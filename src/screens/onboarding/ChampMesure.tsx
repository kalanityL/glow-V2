import { useTextes } from '../../i18n/useTextes';
import type { Unite } from '../../domaine/unites';

interface ChampMesureProps {
  id: string;
  valeur: string;
  onValeur: (valeur: string) => void;
  unite: Unite;
  /** La question, qui nomme le champ à qui écoute la page. */
  question: string;
}

/**
 * UN CHAMP DE MESURE — un nombre, et son unité À CÔTÉ du champ.
 *
 * L'UNITÉ EST DEHORS (demande du 2026-09-07), et ce n'est pas qu'une affaire de
 * dessin : dans le champ, elle se mêlerait au texte saisi — illisible dès que
 * le nombre est long, impossible d'y placer le curseur sans la traverser — et
 * un lecteur d'écran la dicterait comme une partie de la valeur. Dehors, elle
 * reste une étiquette, rattachée par `aria-describedby`.
 *
 * L'unité vient du système d'unités et non d'une constante : le jour où l'on
 * passera aux livres, ce mot suivra sans qu'on rouvre un écran.
 *
 * LE CHAMP EST UN `text`, PAS UN `number`, avec `inputMode="decimal"` :
 *   - un `number` refuse la virgule dans la plupart des navigateurs, or
 *     « 72,5 » est la façon française d'écrire un poids ;
 *   - il ajoute des flèches d'incrément dont personne ne veut sur un téléphone.
 * `inputMode` donne quand même le clavier numérique. La valeur est gardée telle
 * qu'elle est tapée ; sa conversion en nombre viendra là où on l'enregistrera,
 * et acceptera les deux séparateurs.
 */
export function ChampMesure({ id, valeur, onValeur, unite, question }: ChampMesureProps) {
  const textes = useTextes();

  return (
    <div className="champ">
      <input
        id={id}
        className="champ__saisie"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={valeur}
        onChange={(evenement) => onValeur(evenement.target.value)}
        aria-label={question}
        aria-describedby={`${id}-unite`}
      />
      <span className="champ__unite" id={`${id}-unite`}>
        {textes.unites[unite]}
      </span>
    </div>
  );
}
