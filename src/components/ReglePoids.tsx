import { useCallback, useEffect, useRef } from 'react';
import { ChampEnLigne } from './ChampEnLigne';
import { useTextes } from '../i18n/useTextes';
import { POIDS_MAX, POIDS_MIN, poidsDepuisRapport, poidsDepuisSaisie, rapportDuPoids } from '../domaine/mesures';
import type { UnitePoids } from '../domaine/unites';
import { defilementHorizontal, defilerHorizontalA, surFinDeDefilement } from '../plateforme/navigateur';

/**
 * LA RÈGLE CRANTÉE DU POIDS — le chiffre en grand, qui s'édite sur place, et
 * dessous UNE GRADUATION qui glisse sous une tige fixe (2026-09-20, le bloc
 * du poids ; sortie du bloc le 2026-09-21 pour servir aussi à la pesée :
 * « utilise le system de regle crantée pour choisir le poids »). Les deux
 * se suivent : glisser la graduation change le chiffre, taper le chiffre
 * amène la graduation, à chaque frappe. Un cran par dixième ; le kilo a le
 * grand cran, le demi le moyen ; le nombre tous les demis. L'aimant est
 * immédiat : le geste fini, la graduation est amenée d'un coup sur le cran
 * du poids lu. En silence.
 *
 * LA GRADUATION EST DU DÉFILEMENT NATIF (le doigt, la molette) : sa position
 * se lit en RAPPORT du chemin total — la géométrie (le pas d'un cran) est
 * dans `page.css`, le code n'en sait rien. Pendant qu'on tape, la règle suit
 * mais ne dicte pas.
 *
 * Le composant ne garde rien : le poids est à l'appelant (`valeur`,
 * `onValeur`), sous sa forme stockée.
 */
export function ReglePoids({
  valeur,
  unite,
  nom,
  onValeur,
  onEdition,
}: {
  /** Le poids, forme stockée (« 95.0 »). */
  valeur: string;
  unite: UnitePoids;
  /** Le nom de la donnée, dit à qui écoute la page. */
  nom: string;
  onValeur: (stocke: string) => void;
  /** L'édition du chiffre commence ou finit. */
  onEdition?: (edition: boolean) => void;
}) {
  const textes = useTextes();
  const graduation = useRef<HTMLDivElement>(null);
  const enEdition = useRef(false);
  const separateur = textes.separateurDecimal;
  const ecrit = (stocke: string) => stocke.replace('.', separateur);

  /* LE CHIFFRE EN CASES FIXES (2026-09-20) : autant de cases entières que le
     plus lourd de l'unité a de chiffres, puis le séparateur et la case des
     dixièmes ; une case vide porte un zéro invisible, pour la ligne de base. */
  const casesEntieres = String(POIDS_MAX[unite]).length;
  const enCases = (stocke: string) => {
    const [entier, dixieme] = stocke.split('.');
    const chiffres = entier.padStart(casesEntieres, ' ').split('');
    return (
      <span className="poids__cases">
        {chiffres.map((chiffre, i) => (
          <span key={i} className={`poids__case${chiffre === ' ' ? ' poids__case--vide' : ''}`}>
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

  /* À l'ouverture — et quand la valeur change d'ailleurs —, la graduation
     se place sous le poids, d'un coup. */
  useEffect(() => {
    amenerLaRegle(valeur, false);
  }, [valeur, amenerLaRegle]);

  useEffect(
    () =>
      surFinDeDefilement(graduation.current, () => {
        const { position, course } = defilementHorizontal(graduation.current);
        if (course <= 0) return;
        amenerLaRegle(poidsDepuisRapport(position / course, unite), false);
      }),
    [unite, amenerLaRegle],
  );

  const surDefilement = () => {
    if (enEdition.current) return;
    const { position, course } = defilementHorizontal(graduation.current);
    if (course <= 0) return;
    const lu = poidsDepuisRapport(position / course, unite);
    if (lu !== valeur) onValeur(lu);
  };

  const crans: number[] = [];
  for (let d = POIDS_MIN * 10; d <= POIDS_MAX[unite] * 10; d += 1) crans.push(d);

  return (
    <div className="poids">
      <div className="poids__valeur">
        <ChampEnLigne
          valeur={ecrit(valeur)}
          valeurAffichee={enCases(valeur)}
          onValeur={(saisie) => {
            const stocke = poidsDepuisSaisie(saisie, unite);
            if (stocke) onValeur(stocke);
          }}
          normaliser={(saisie) => {
            const stocke = poidsDepuisSaisie(saisie, unite);
            return stocke ? ecrit(stocke) : null;
          }}
          onSaisie={(saisie) => {
            const stocke = poidsDepuisSaisie(saisie, unite);
            if (stocke) amenerLaRegle(stocke, false);
          }}
          onEdition={(edition) => {
            enEdition.current = edition;
            onEdition?.(edition);
          }}
          regle={textes.compte.reglePoids(POIDS_MIN, POIDS_MAX[unite], textes.unites[unite])}
          unite={textes.unites[unite]}
          nom={nom}
          inputMode="decimal"
        />
      </div>

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
  );
}
