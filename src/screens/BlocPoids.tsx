import { useCallback, useEffect, useRef, useState } from 'react';
import { Bloc } from '../components/Bloc';
import { ChampEnLigne } from '../components/ChampEnLigne';
import { useTextes } from '../i18n/useTextes';
import { POIDS_MAX, POIDS_MIN, cransFranchis, dixiemesFranchis, poidsDepuisRapport, poidsDepuisSaisie, rapportDuPoids } from '../domaine/mesures';
import type { UnitePoids } from '../domaine/unites';
import { defilementHorizontal, defilerHorizontalA, jouerSon } from '../plateforme/navigateur';
/* SON SON (2026-09-20, « utilise les sons dans ../son pour claude », puis
   « utilise le son kilo pour tous les clics ») : le « kilo », pour chaque
   clic. Un fichier embarqué, comme les polices. */
import sonKilo from '../assets/sons/03_metallic_air_kilo.wav';

/**
 * LE BLOC DU POIDS (2026-09-20, « mise à jour de poids : ouvre qqchose comme
 * ça ou on peut slider pour faire defiler le poids dans un sens ou l'autre
 * jusqu'au poids choisi ou bien directement modifier les chiffres et la barre
 * du bas se met à jour au bon endroit en temps réel », d'après son image) :
 * le chiffre en grand, qui s'édite sur place, et dessous UNE RÈGLE qui glisse
 * — un cran par unité, tous de la même hauteur, plus marqué tous les dix et
 * tous les cent, le nombre écrit tous les dix, du plus léger au plus lourd de
 * l'unité — sous un repère fixe, le seul cran foncé. Les
 * deux se suivent : glisser la règle change le chiffre, taper le chiffre
 * amène la règle, à chaque frappe.
 *
 * LES CLICS (2026-09-20) : en glissant, un clic par cran entier franchi et un
 * par dixième entre deux ; en tapant, un clic par chiffre changé — toujours
 * le même son, le « kilo », embarqué.
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
          <span key={i} className={`poids__case${chiffre === ' ' ? ' poids__case--vide' : ''}`}>
            {/* Une case vide porte UN ZÉRO INVISIBLE : sans texte, elle n'a
                pas de ligne de base ; avec une espace insécable, la police
                d'affichage n'a pas ce glyphe et le navigateur en prend un
                dans une autre, aux métriques différentes — dans les deux
                cas le chiffre changeait de hauteur en passant les cent
                (2026-09-20, « corrige le changement de hauteur qd on passe
                la barre des 100 »). Un chiffre caché a exactement la
                hauteur d'un chiffre. */}
            {chiffre === ' ' ? '0' : chiffre}
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

  /* À l'ouverture, la graduation se place sous le poids enregistré, d'un coup. */
  useEffect(() => {
    placement.current = true;
    amenerLaRegle(valeur, false);
  }, [valeur, amenerLaRegle]);

  /* Glisser la graduation écrit le chiffre — sauf pendant qu'on le tape — et
     FAIT CLIQUER chaque cran qui passe (2026-09-20, « autant de clic que de
     crans qui passent »). Le glissement d'ouverture, programmé, ne compte
     pas : la graduation se place, elle ne passe pas de crans. */
  const placement = useRef(true);
  const surDefilement = () => {
    if (enEdition) return;
    const { position, course } = defilementHorizontal(graduation.current);
    if (course <= 0) return;
    const nouveau = poidsDepuisRapport(position / course, unite);
    setBrouillon((precedent) => {
      if (!placement.current) {
        /* Les crans entiers cliquent « kilo », les dixièmes entre eux
           cliquent « centième » (2026-09-20, « les centièmes de kilos font
           clic clic aussi »). */
        const crans = cransFranchis(precedent, nouveau);
        const dixiemes = dixiemesFranchis(precedent, nouveau);
        /* Le même son pour tous (« utilise le son kilo pour tous les clics »). */
        if (crans + dixiemes > 0) jouerSon(sonKilo, crans + dixiemes);
      }
      return nouveau;
    });
    placement.current = false;
  };

  const differe = brouillon !== valeur;
  const enregistrer = () => {
    onEnregistrer(brouillon);
    onFermer();
  };
  /* La croix : sans changement, ferme ; avec, demande confirmation ; et LA
     CONFIRMATION AFFICHÉE, UN SECOND CLIC FERME SANS ENREGISTRER (2026-09-20,
     « si on clic sur la croix qd le message de confirmation s'affiche, ca
     confirme la fermeture sans sauvegarde »). */
  const demanderFermeture = useCallback(() => {
    if (brouillon === valeur || sortie) {
      onFermer();
      return;
    }
    setSortie(true);
  }, [brouillon, valeur, sortie, onFermer]);

  /* LES CRANS SONT DES DIXIÈMES (2026-09-20, « échelle de la regle : 10x plus
     précise : ce qui represente actuellement 10kg change pour representer à
     la place 1 kilo. faire figurer aussi les graduations des centiemes ») :
     un cran par dixième d'unité, comptés en entiers de dixièmes pour ne pas
     additionner des flottants. */
  const crans: number[] = [];
  for (let d = POIDS_MIN * 10; d <= POIDS_MAX[unite] * 10; d += 1) crans.push(d);

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
    <Bloc titre={titre} onFermer={demanderFermeture} pied={pied} hauteur="ajustee">
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
              /* Un clic à chaque chiffre changé (2026-09-20) : chaque frappe qui
                 change le texte. La graduation suit, en silence — elle est
                 amenée, elle ne passe pas de crans. */
              jouerSon(sonKilo);
              const stocke = poidsDepuisSaisie(saisie, unite);
              if (stocke) {
                placement.current = true;
                amenerLaRegle(stocke, false);
              }
            }}
            onEdition={(edition) => {
              setEnEdition(edition);
              /* L'édition finie, la graduation est en place : le prochain
                 glissement compte ses crans. */
              if (!edition) placement.current = false;
            }}
            regle={textes.compte.reglePoids(POIDS_MIN, POIDS_MAX[unite], textes.unites[unite])}
            unite={textes.unites[unite]}
            nom={titre}
            inputMode="decimal"
          />
        </div>

        {/* La tige est HORS du défilement (2026-09-20) : dedans, un élément
            absolu part avec le contenu qui glisse, et Chrome l'emportait hors
            de vue — la tige tient dans le cadre, seule la piste glisse. */}
        <div className="graduation">
          <div className="graduation__defilement" ref={graduation} onScroll={surDefilement}>
            <div className="graduation__piste">
              {crans.map((d) => (
                <span
                  key={d}
                  className={`graduation__cran${
                    d % 10 === 0 ? ' graduation__cran--kilo' : d % 5 === 0 ? ' graduation__cran--demi' : ''
                  }`}
                >
                  {/* Le nombre au-dessus de son cran, tous les demis : l'entier
                      seul sur le kilo, « 97,5 » sur le demi (2026-09-20). */}
                  {d % 5 === 0 ? (
                    <span className="graduation__nombre">{d % 10 === 0 ? d / 10 : ecrit((d / 10).toFixed(1))}</span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
          <span className="graduation__repere" aria-hidden="true" />
        </div>
      </div>
    </Bloc>
  );
}
