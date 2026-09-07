import { useEffect, useRef, useState } from 'react';
import { useTextes } from '../../i18n/useTextes';
import { POIDS_MAX } from '../../domaine/mesures';
import type { Unite } from '../../domaine/unites';

interface SelecteurPoidsProps {
  id: string;
  /** Le poids, tel qu'il est gardé : « 95.0 ». */
  valeur: string;
  onValeur: (valeur: string) => void;
  unite: Unite;
  /** La question, qui nomme le sélecteur à qui écoute la page. */
  question: string;
}

/**
 * LE SÉPARATEUR DE STOCKAGE — un point, toujours, quelle que soit la langue.
 *
 * Celui qui S'AFFICHE vient de la langue (virgule en français, point en
 * anglais) et se lit dans le dictionnaire. Les deux sont séparés exprès : une
 * valeur écrite « 95,1 » puis relue dans une autre langue ne voudrait plus
 * rien dire, et c'est aussi la forme qu'un nombre prend en JSON.
 */
const SEPARATEUR_STOCKE = '.';

/** Les dix crans de la seconde roue. */
const DIXIEMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * CE QU'AFFICHE UN CRAN DE LA SECONDE ROUE.
 *
 * En kilos, un cran vaut 100 grammes et s'écrit « 0, 100, 200… 900 » : c'est la
 * grandeur réelle, celle qu'on lit sur une balance. En livres, le cran est un
 * dixième et n'a pas de sous-unité usuelle à nommer : il s'écrit « 0 à 9 ».
 *
 * La VALEUR gardée ne change pas pour autant : c'est toujours le dixième, et
 * « 95.3 » veut dire 95 kg et 300 g.
 */
const PAS_AFFICHE: Partial<Record<Unite, number>> = { kg: 100 };

/**
 * LE POIDS SE CHOISIT DANS DEUX ROUES QUI S'OUVRENT ENSEMBLE, comme une heure
 * et ses minutes (demande du 2026-09-07 : « quand on clique sur le champ poid,
 * ça ouvre les deux select comme l'heure »).
 *
 * POURQUOI PAS DEUX `select` NATIFS, ce qu'il y avait avant : ils s'ouvrent
 * l'un APRÈS l'autre — deux gestes, deux listes qui se recouvrent, et jamais
 * les deux nombres sous les yeux en même temps. Ici, un seul geste ouvre le
 * panneau et les deux colonnes se lisent ensemble ; on repart quand les deux
 * sont posés.
 *
 * CE QUI EST DU NAVIGATEUR ET DEVRA CHANGER EN NATIF, et rien d'autre :
 *   - la fermeture au clic dehors, écrite avec `document` ;
 *   - la touche Échap ;
 *   - `scrollIntoView`, qui amène le cran retenu au milieu de sa colonne à
 *     l'ouverture.
 * Tout le reste — l'état, les bornes, l'affichage — est ordinaire.
 */
export function SelecteurPoids({ id, valeur, onValeur, unite, question }: SelecteurPoidsProps) {
  const textes = useTextes();
  const max = POIDS_MAX[unite] ?? 999;
  const pas = PAS_AFFICHE[unite] ?? 1;

  const [ouvert, setOuvert] = useState(false);
  const enveloppe = useRef<HTMLDivElement>(null);
  const cranEntiere = useRef<HTMLButtonElement>(null);
  const cranDixieme = useRef<HTMLButtonElement>(null);

  const [entiereBrute = '', dixiemeBrut = '0'] = valeur.split(/[.,]/);
  const entiere = Number(entiereBrute) || 1;
  const dixieme = Number(dixiemeBrut) || 0;

  const poser = (nouvelleEntiere: number, nouveauDixieme: number) =>
    onValeur(`${nouvelleEntiere}${SEPARATEUR_STOCKE}${nouveauDixieme}`);

  /* À l'ouverture, chaque colonne se place sur son cran retenu : sans cela, on
     tomberait sur le début de la liste, à 1 kg. */
  useEffect(() => {
    if (!ouvert) return;
    cranEntiere.current?.scrollIntoView({ block: 'center' });
    cranDixieme.current?.scrollIntoView({ block: 'center' });
  }, [ouvert]);

  /* Le panneau se referme au clic dehors et sur Échap — les deux façons
     ordinaires de dire « j'ai fini », l'une à la souris, l'autre au clavier. */
  useEffect(() => {
    if (!ouvert) return;

    const auClic = (evenement: MouseEvent) => {
      if (!enveloppe.current?.contains(evenement.target as Node)) setOuvert(false);
    };
    const auClavier = (evenement: KeyboardEvent) => {
      if (evenement.key === 'Escape') setOuvert(false);
    };

    document.addEventListener('mousedown', auClic);
    document.addEventListener('keydown', auClavier);
    return () => {
      document.removeEventListener('mousedown', auClic);
      document.removeEventListener('keydown', auClavier);
    };
  }, [ouvert]);

  const entieres = Array.from({ length: max }, (_, rang) => rang + 1);

  return (
    <div className="selecteur" ref={enveloppe}>
      <button
        type="button"
        id={id}
        className={`selecteur__boite${ouvert ? ' selecteur__boite--ouvert' : ''}`}
        onClick={() => setOuvert((etait) => !etait)}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        aria-label={question}
      >
        <span className="selecteur__valeur selecteur__valeur--entiere">{entiere}</span>
        <span className="selecteur__separateur">{textes.separateurDecimal}</span>
        <span className="selecteur__valeur selecteur__valeur--fraction">{dixieme * pas}</span>
      </button>

      {/* L'unité reste DEHORS du champ, comme demandé le 2026-09-07. */}
      <span className="champ__unite">{textes.unites[unite]}</span>

      {ouvert ? (
        <div className="roues">
          <ul className="roue" role="listbox" aria-label={question}>
            {entieres.map((valeurEntiere) => (
              <li key={valeurEntiere}>
                <button
                  type="button"
                  ref={valeurEntiere === entiere ? cranEntiere : undefined}
                  className={`roue__cran${valeurEntiere === entiere ? ' roue__cran--choisi' : ''}`}
                  role="option"
                  aria-selected={valeurEntiere === entiere}
                  onClick={() => poser(valeurEntiere, dixieme)}
                >
                  {valeurEntiere}
                </button>
              </li>
            ))}
          </ul>

          <ul className="roue" role="listbox" aria-label={textes.fractions[unite]}>
            {DIXIEMES.map((valeurDixieme) => (
              <li key={valeurDixieme}>
                <button
                  type="button"
                  ref={valeurDixieme === dixieme ? cranDixieme : undefined}
                  className={`roue__cran${valeurDixieme === dixieme ? ' roue__cran--choisi' : ''}`}
                  role="option"
                  aria-selected={valeurDixieme === dixieme}
                  onClick={() => poser(entiere, valeurDixieme)}
                >
                  {valeurDixieme * pas}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
