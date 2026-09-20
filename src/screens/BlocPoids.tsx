import { useCallback, useEffect, useRef, useState } from 'react';
import { Bloc } from '../components/Bloc';
import { ChampEnLigne } from '../components/ChampEnLigne';
import { useTextes } from '../i18n/useTextes';
import { POIDS_MAX, POIDS_MIN, poidsDepuisRapport, poidsDepuisSaisie, rapportDuPoids } from '../domaine/mesures';
import type { UnitePoids } from '../domaine/unites';
import { defilementHorizontal, defilerHorizontalA } from '../plateforme/navigateur';

/**
 * LE BLOC DU POIDS (2026-09-20, « mise à jour de poids : ouvre qqchose comme
 * ça ou on peut slider pour faire defiler le poids dans un sens ou l'autre
 * jusqu'au poids choisi ou bien directement modifier les chiffres et la barre
 * du bas se met à jour au bon endroit en temps réel », d'après son image) :
 * le chiffre en grand, qui s'édite sur place, et dessous UNE RÈGLE qui glisse
 * — un cran par unité, un cran plus haut tous les cinq, le nombre écrit tous
 * les dix, du plus léger au plus lourd de l'unité — sous un repère fixe. Les
 * deux se suivent : glisser la règle change le chiffre, taper le chiffre
 * amène la règle, à chaque frappe.
 *
 * LA GRADUATION EST DU DÉFILEMENT NATIF (le doigt, la molette) : sa position se lit
 * en RAPPORT du chemin total — la géométrie (le pas d'un cran) est dans la
 * feuille, `page.css`, et le code n'en sait rien. Pendant qu'on tape, la
 * règle suit mais ne dicte pas : ce qu'elle rend en glissant ne remplace pas
 * ce qu'on est en train d'écrire.
 *
 * Comme les autres blocs (« bouton ok, meme systeme que d'habitude si on sort
 * ou ferme avant de valider ») : « OK » au pied, éteint tant que rien n'a
 * changé ; fermer sans avoir validé propose « Confirmer la mise à jour » /
 * « Fermer ».
 */
export function BlocPoids({
  titre,
  valeur,
  unite,
  onEnregistrer,
  onFermer,
}: {
  titre: string;
  /** Le poids enregistré, sous sa forme stockée (« 95.0 »). */
  valeur: string;
  unite: UnitePoids;
  onEnregistrer: (stocke: string) => void;
  onFermer: () => void;
}) {
  const textes = useTextes();
  const graduation = useRef<HTMLDivElement>(null);
  const [brouillon, setBrouillon] = useState(valeur);
  const [enEdition, setEnEdition] = useState(false);
  const [sortie, setSortie] = useState(false);
  const separateur = textes.separateurDecimal;
  const ecrit = (stocke: string) => stocke.replace('.', separateur);

  /* LE CHIFFRE EN CASES FIXES (2026-09-20, « fixer la place des centaines des
     dizaines des unites et des diziemes pour ne pas que ça saute trop quand on
     fait varier le poids ») : autant de cases entières que le plus lourd de
     l'unité a de chiffres (trois en kilos, quatre en livres), puis le
     séparateur et la case des dixièmes ; une case sans chiffre reste vide, à
     sa place. Les chiffres sont tabulaires : chaque case a la largeur d'un
     chiffre. */
  const casesEntieres = String(POIDS_MAX[unite]).length;
  const enCases = (stocke: string) => {
    const [entier, dixieme] = stocke.split('.');
    const chiffres = entier.padStart(casesEntieres, ' ').split('');
    return (
      <span className="poids__cases">
        {chiffres.map((chiffre, i) => (
          <span key={i} className="poids__case">
            {chiffre.trim()}
          </span>
        ))}
        <span className="poids__separateur">{separateur}</span>
        <span className="poids__case">{dixieme}</span>
      </span>
    );
  };

  const amenerLaRegle = useCallback(
    (stocke: string, doux: boolean) => {
      const { course } = defilementHorizontal(graduation.current);
      defilerHorizontalA(graduation.current, rapportDuPoids(stocke, unite) * course, doux);
    },
    [unite],
  );

  /* À l'ouverture, la règle se place sous le poids enregistré, d'un coup. */
  useEffect(() => {
    amenerLaRegle(valeur, false);
  }, [valeur, amenerLaRegle]);

  /* Glisser la règle écrit le chiffre — sauf pendant qu'on le tape. */
  const surDefilement = () => {
    if (enEdition) return;
    const { position, course } = defilementHorizontal(graduation.current);
    if (course > 0) setBrouillon(poidsDepuisRapport(position / course, unite));
  };

  const differe = brouillon !== valeur;
  const enregistrer = () => {
    onEnregistrer(brouillon);
    onFermer();
  };
  const demanderFermeture = useCallback(() => {
    if (brouillon === valeur) {
      onFermer();
      return;
    }
    setSortie(true);
  }, [brouillon, valeur, onFermer]);

  const crans: number[] = [];
  for (let v = POIDS_MIN; v <= POIDS_MAX[unite]; v += 1) crans.push(v);

  const pied = sortie ? (
    <div className="boutons">
      <button type="button" className="bouton bouton--second" onClick={onFermer}>
        {textes.fermer}
      </button>
      <button type="button" className="bouton" onClick={enregistrer}>
        {textes.blocPoids.confirmer}
      </button>
    </div>
  ) : (
    <div className="boutons">
      <button
        type="button"
        className="bouton"
        disabled={!differe}
        aria-disabled={!differe}
        onClick={enregistrer}
      >
        {textes.blocPoids.enregistrer}
      </button>
    </div>
  );

  return (
    <Bloc titre={titre} onFermer={demanderFermeture} pied={pied}>
      <div className="poids">
        <div className="poids__valeur">
          <ChampEnLigne
            valeur={ecrit(brouillon)}
            valeurAffichee={enCases(brouillon)}
            onValeur={(saisie) => {
              const stocke = poidsDepuisSaisie(saisie, unite);
              if (stocke) setBrouillon(stocke);
            }}
            normaliser={(saisie) => {
              const stocke = poidsDepuisSaisie(saisie, unite);
              return stocke ? ecrit(stocke) : null;
            }}
            onSaisie={(saisie) => {
              setSortie(false);
              const stocke = poidsDepuisSaisie(saisie, unite);
              if (stocke) amenerLaRegle(stocke, false);
            }}
            onEdition={setEnEdition}
            regle={textes.compte.reglePoids(POIDS_MIN, POIDS_MAX[unite], textes.unites[unite])}
            unite={textes.unites[unite]}
            nom={titre}
            inputMode="decimal"
          />
        </div>

        <div className="graduation" ref={graduation} onScroll={surDefilement}>
          <div className="graduation__piste">
            {crans.map((v) => (
              <span
                key={v}
                className={`graduation__cran${
                  v % 100 === 0
                    ? ' graduation__cran--dix graduation__cran--cent'
                    : v % 10 === 0
                      ? ' graduation__cran--dix'
                      : v % 5 === 0
                        ? ' graduation__cran--cinq'
                        : ''
                }`}
              >
                {v % 10 === 0 ? <span className="graduation__nombre">{v}</span> : null}
              </span>
            ))}
          </div>
          <span className="graduation__repere" aria-hidden="true" />
        </div>
      </div>
    </Bloc>
  );
}
