import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ChampEnLigne } from './ChampEnLigne';
import { useTextes } from '../i18n/useTextes';
import { POIDS_MAX, POIDS_MIN, poidsDepuisRapport, poidsDepuisSaisie, rapportDuPoids } from '../domaine/mesures';
import type { UnitePoids } from '../domaine/unites';
import { defilementHorizontal, defilerHorizontalA, jouerClics, surFinDeDefilement } from '../plateforme/navigateur';
/* LE CLIC D'UN CRAN (2026-09-21, « les clics doivent correspondre au
   passage d'un cran ») : un par cran franchi. Le son fut la roue de la
   fortune découpée (le matin) ; c'est « Bulle » depuis le soir (« son bulle
   pour le poids »), choisi dans `app/sons.ts` parmi le catalogue embarqué. */
import { SON_DU_POIDS, morceauxDuSon } from '../app/sons';

const CLICS = morceauxDuSon(SON_DU_POIDS);

/**
 * LA RÈGLE CRANTÉE DU POIDS — le chiffre en grand, qui s'édite sur place, et
 * dessous UNE GRADUATION qui glisse sous une tige fixe (2026-09-20, le bloc
 * du poids ; sortie du bloc le 2026-09-21 pour servir aussi à la pesée :
 * « utilise le system de regle crantée pour choisir le poids »). Les deux
 * se suivent : glisser la graduation change le chiffre, taper le chiffre
 * amène la graduation, à chaque frappe. Un cran par dixième ; le kilo a le
 * grand cran, le demi le moyen ; le nombre tous les demis. L'aimant est
 * immédiat : le geste fini, la graduation est amenée d'un coup sur le cran
 * du poids lu. CHAQUE CRAN FRANCHI CLIQUE (2026-09-21), du son de sa roue
 * de la fortune.
 *
 * LA GRADUATION EST DU DÉFILEMENT NATIF (le doigt, la molette) : sa position
 * se lit en RAPPORT du chemin total — la géométrie (le pas d'un cran) est
 * dans `page.css`, le code n'en sait rien. Pendant qu'on tape, la règle suit
 * mais ne dicte pas.
 *
 * Le composant ne garde rien : le poids est à l'appelant (`valeur`,
 * `onValeur`), sous sa forme stockée.
 *
 * LA PISTE N'EST DESSINÉE QU'AUTOUR DU POIDS (2026-09-21, « il y a un petit
 * delai […] qd on ouvre qqchose avec la regle graduée » — 210 ms mesurés,
 * pour 9 981 crans créés d'un coup) : le rail a la largeur de tous les
 * crans (`--crans`, la feuille fait le reste), mais seuls ceux d'une
 * FENÊTRE autour du cran central sont dans la page — 400 de chaque côté,
 * quarante kilos, bien plus que l'écran —, chacun posé à sa place
 * (`--cran`). La fenêtre suit le glissement : dès que le centre s'en
 * éloigne de moitié, elle se recentre. Le nombre n'est écrit que sur les
 * kilos (« N'étiquette pas les crans de demi kilos non plus »).
 *
 * UNE SEULE SOURCE À LA FOIS (2026-09-21, son enregistrement : le chiffre
 * et la graduation se contredisaient — 91,5 sous 116,5 — et s'échangeaient
 * à chaque rendu). Le composant ne ramène JAMAIS la graduation sur un poids
 * qu'elle vient elle-même de lui donner : `derniereLue` garde le dernier
 * poids lu sur la graduation, et l'effet qui place la graduation ne joue
 * que pour un poids venu d'ailleurs — l'ouverture, une frappe, un autre
 * traitement. Sinon chaque lecture provoquait un placement, chaque
 * placement une lecture, et deux positions se renvoyaient la balle.
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
  /* Le dernier poids LU sur la graduation : un poids égal à lui n'a pas à y
     être ramené, il en vient. */
  const derniereLue = useRef<string | null>(null);

  /* Les crans sont des dixièmes, comptés en entiers ; le premier est le
     cran 0. */
  const premier = POIDS_MIN * 10;
  const nombreCrans = POIDS_MAX[unite] * 10 - premier + 1;
  const cranDe = (stocke: string) => Math.round(Number(stocke) * 10) - premier;
  const RAYON = 400;
  const [centre, setCentre] = useState(() => cranDe(valeur));
  const dansLaFenetre = (cran: number) => Math.abs(cran - centre) <= RAYON;
  const recentrer = (cran: number) => {
    if (Math.abs(cran - centre) > RAYON / 2) setCentre(cran);
  };
  /* Un poids à placer QUAND LA FENÊTRE L'AURA : l'aimant du défilement ne
     connaît que les crans dans la page — placer la graduation hors de la
     fenêtre, c'est la voir aimantée à son bord. */
  const aPlacer = useRef<string | null>(null);
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

  /* À l'ouverture — et quand le poids change D'AILLEURS que de la
     graduation —, elle se place dessous, d'un coup, AVANT LA PEINTURE
     (`useLayoutEffect`) : peinte d'abord au cran 0, hors de la fenêtre,
     l'aimant la tirait au premier cran dessiné et le chiffre suivait. Si le
     cran n'est pas dans la fenêtre, la fenêtre se recentre d'abord et le
     placement attend son rendu. */
  useLayoutEffect(() => {
    if (valeur === derniereLue.current) return;
    derniereLue.current = valeur;
    const cran = cranDe(valeur);
    if (dansLaFenetre(cran)) {
      amenerLaRegle(valeur, false);
    } else {
      aPlacer.current = valeur;
      setCentre(cran);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valeur, amenerLaRegle]);

  useLayoutEffect(() => {
    if (aPlacer.current === null) return;
    const stocke = aPlacer.current;
    aPlacer.current = null;
    amenerLaRegle(stocke, false);
  }, [centre, amenerLaRegle]);

  /* L'aimant immédiat : le geste fini, la graduation est amenée d'un coup
     sur le cran du poids lu, et ce poids est le sien. */
  useEffect(
    () =>
      surFinDeDefilement(graduation.current, () => {
        const { position, course } = defilementHorizontal(graduation.current);
        if (course <= 0) return;
        const lu = poidsDepuisRapport(position / course, unite);
        derniereLue.current = lu;
        amenerLaRegle(lu, false);
      }),
    [unite, amenerLaRegle],
  );

  const surDefilement = () => {
    if (enEdition.current) return;
    const { position, course } = defilementHorizontal(graduation.current);
    if (course <= 0) return;
    const lu = poidsDepuisRapport(position / course, unite);
    recentrer(cranDe(lu));
    if (lu === derniereLue.current) return;
    /* Un clic par cran franchi — un cran est un dixième — depuis le dernier
       poids lu ; le placement programmé, lui, ne franchit rien : il est
       arrêté au-dessus. */
    if (derniereLue.current !== null) {
      const crans = Math.abs(Math.round(Number(lu) * 10) - Math.round(Number(derniereLue.current) * 10));
      if (crans > 0) jouerClics(CLICS, crans);
    }
    derniereLue.current = lu;
    onValeur(lu);
  };

  /* LA FENÊTRE DE CRANS autour du centre, redessinée seulement quand le
     centre change ; le rail garde la largeur de tous. */
  const piste = useMemo(() => {
    const debut = Math.max(0, centre - RAYON);
    const fin = Math.min(nombreCrans - 1, centre + RAYON);
    const crans: number[] = [];
    for (let i = debut; i <= fin; i += 1) crans.push(i);
    return (
      <div className="graduation__piste" style={{ '--crans': nombreCrans } as CSSProperties}>
        <div className="graduation__rail">
          {crans.map((i) => {
            const d = premier + i;
            return (
              <span
                key={i}
                className={`graduation__cran${
                  d % 10 === 0 ? ' graduation__cran--kilo' : d % 5 === 0 ? ' graduation__cran--demi' : ''
                }`}
                style={{ '--cran': i } as CSSProperties}
              >
                {d % 10 === 0 ? <span className="graduation__nombre">{d / 10}</span> : null}
              </span>
            );
          })}
        </div>
      </div>
    );
  }, [centre, nombreCrans, premier]);

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
          {piste}
        </div>
        <span className="graduation__repere" aria-hidden="true" />
      </div>
    </div>
  );
}
