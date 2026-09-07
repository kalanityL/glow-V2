import { useTextes } from '../../i18n/useTextes';
import { POIDS_MAX } from '../../domaine/mesures';
import type { Unite } from '../../domaine/unites';

interface SelecteurPoidsProps {
  id: string;
  /** Le poids, tel qu'il est gardé : « 95,0 ». */
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

/** Les dix crans de la seconde liste. */
const DIXIEMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * CE QU'AFFICHE UN CRAN DE LA SECONDE LISTE (2026-09-07, « choix centaine :
 * 0/100/200 etc... »).
 *
 * En kilos, un cran vaut 100 grammes et s'écrit donc « 0, 100, 200… 900 » :
 * c'est la grandeur réelle, celle qu'on lit sur une balance, et non un rang
 * sans unité. En livres, le cran est un dixième et n'a pas de sous-unité usuelle
 * à nommer : il s'écrit « 0 à 9 ».
 *
 * La VALEUR gardée ne change pas pour autant : c'est toujours le dixième, et
 * « 95,3 » veut dire 95 kg et 300 g. L'affichage ne décide de rien.
 */
const PAS_AFFICHE: Partial<Record<Unite, number>> = { kg: 100 };

/**
 * LE POIDS SE CHOISIT, IL NE SE TAPE PLUS (demande du 2026-09-07 : « selecteur
 * de poids : select kg / centaines de g comme heure / minutes »).
 *
 * DEUX LISTES DANS UN SEUL CHAMP, comme une heure et ses minutes : l'unité
 * entière d'un côté, le dixième de l'autre, la virgule entre les deux et une
 * seule bordure autour. Ce que ça change, et pourquoi
 * c'est mieux qu'un champ libre : on ne peut plus taper une valeur impossible,
 * ni oublier l'unité, ni hésiter entre le point et la virgule — le clavier ne
 * s'ouvre même pas.
 *
 * LES BORNES VIENNENT DE L'UNITÉ : 1 à 999 en kilos, 1 à 2000 en livres. La
 * liste est donc plus longue en livres, et c'est normal — c'est le même
 * plafond qu'avant, celui du domaine, lu au même endroit.
 *
 * LA VALEUR RESTE UNE CHAÎNE « 95,0 », comme quand elle se tapait : ce qui la
 * lit en aval n'a pas à savoir d'où elle vient, et le jour où l'on rendra la
 * saisie libre à ceux qui la préfèrent, rien d'autre ne bougera.
 */
export function SelecteurPoids({ id, valeur, onValeur, unite, question }: SelecteurPoidsProps) {
  const textes = useTextes();
  const max = POIDS_MAX[unite] ?? 999;

  const [entiereBrute = '', dixiemeBrut = '0'] = valeur.split(/[.,]/);
  const entiere = Number(entiereBrute) || 1;
  const dixieme = Number(dixiemeBrut) || 0;

  const poser = (nouvelleEntiere: number, nouveauDixieme: number) =>
    onValeur(`${nouvelleEntiere}${SEPARATEUR_STOCKE}${nouveauDixieme}`);

  return (
    <div className="selecteur">
      {/* UN SEUL CHAMP pour les deux listes (demande du 2026-09-07, « kg et
          centaines de grammes dans le meme champs, comme qd on choisit hures
          et minutes ») : une seule boîte, une seule bordure, la virgule
          dedans. Les deux listes n'ont plus de matière propre — c'est la boîte
          qui la porte, et qui s'allume quand l'une ou l'autre est prise. */}
      <div className="selecteur__boite">
        <select
          id={id}
          className="selecteur__liste selecteur__liste--entiere"
          value={entiere}
          onChange={(evenement) => poser(Number(evenement.target.value), dixieme)}
          aria-label={question}
        >
          {/* De 1 au plafond de l'unité. La liste est longue, et c'est le prix
              d'un choix borné : aucun poids possible n'en est absent. */}
          {Array.from({ length: max }, (_, rang) => rang + 1).map((valeurEntiere) => (
            <option key={valeurEntiere} value={valeurEntiere}>
              {valeurEntiere}
            </option>
          ))}
        </select>

        <span className="selecteur__separateur" aria-hidden="true">
          {textes.separateurDecimal}
        </span>

        <select
          id={`${id}-dixieme`}
          className="selecteur__liste selecteur__liste--fraction"
          value={dixieme}
          onChange={(evenement) => poser(entiere, Number(evenement.target.value))}
          /* Nommée par ce qu'elle est vraiment — des centaines de grammes en
             kilos, des dixièmes de livre en livres — et non par « décimale ». */
          aria-label={textes.fractions[unite]}
        >
          {DIXIEMES.map((valeurDixieme) => (
            <option key={valeurDixieme} value={valeurDixieme}>
              {valeurDixieme * (PAS_AFFICHE[unite] ?? 1)}
            </option>
          ))}
        </select>
      </div>

      {/* L'unité reste DEHORS, comme demandé le 2026-09-07. */}
      <span className="champ__unite">{textes.unites[unite]}</span>
    </div>
  );
}
