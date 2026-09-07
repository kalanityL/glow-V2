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

/** Le séparateur décimal affiché. La valeur, elle, est gardée avec une virgule. */
const SEPARATEUR = ',';

/** Les dixièmes : de 0 à 9. En kilos, ce sont les centaines de grammes. */
const DIXIEMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * LE POIDS SE CHOISIT, IL NE SE TAPE PLUS (demande du 2026-09-07 : « selecteur
 * de poids : select kg / centaines de g comme heure / minutes »).
 *
 * DEUX LISTES, comme une heure et ses minutes : l'unité entière d'un côté, le
 * dixième de l'autre, séparés par la virgule. Ce que ça change, et pourquoi
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
    onValeur(`${nouvelleEntiere}${SEPARATEUR}${nouveauDixieme}`);

  return (
    <div className="selecteur">
      <span className="selecteur__champ">
        <select
          id={id}
          className="selecteur__liste"
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
      </span>

      <span className="selecteur__separateur" aria-hidden="true">
        {SEPARATEUR}
      </span>

      <span className="selecteur__champ">
        <select
          id={`${id}-dixieme`}
          className="selecteur__liste selecteur__liste--courte"
          value={dixieme}
          onChange={(evenement) => poser(entiere, Number(evenement.target.value))}
          /* Nommée par ce qu'elle est vraiment — des centaines de grammes en
             kilos, des dixièmes de livre en livres — et non par « décimale ». */
          aria-label={textes.fractions[unite]}
        >
          {DIXIEMES.map((valeurDixieme) => (
            <option key={valeurDixieme} value={valeurDixieme}>
              {valeurDixieme}
            </option>
          ))}
        </select>
      </span>

      <span className="champ__unite">{textes.unites[unite]}</span>
    </div>
  );
}
