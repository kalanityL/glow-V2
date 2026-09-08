interface ChoixUniqueProps<T extends string> {
  /** Les réponses, dans l'ordre d'affichage. */
  options: readonly T[];
  /** Le libellé de chacune, déjà traduit. */
  libelle: (option: T) => string;
  /** Celle qui est retenue, ou rien tant qu'on n'a pas répondu. */
  valeur: T | null;
  onChoix: (option: T) => void;
  /** La question, reprise pour nommer le groupe à qui écoute la page. */
  question: string;
  /**
   * Les réponses côte à côte plutôt qu'empilées. À réserver aux réponses
   * COURTES : deux mots tiennent sur une ligne de téléphone, une phrase non.
   */
  enLigne?: boolean;
  /**
   * Les réponses en grille de deux par ligne. Pour une LISTE LONGUE de
   * réponses courtes — les noms de spécialités —, où l'empilement ne tiendrait
   * pas dans l'écran et où `enLigne` les serrerait toutes sur une seule ligne.
   */
  enGrille?: boolean;
}

/**
 * UNE QUESTION À RÉPONSE UNIQUE — le motif de toutes les questions à choisir.
 *
 * Les réponses sont EMPILÉES et pleine largeur par défaut : la question se lit
 * d'un trait, du haut vers le bas, là où deux colonnes obligeraient à comparer.
 * `enLigne` les met côte à côte pour les réponses d'un ou deux mots — la langue,
 * les unités —, où l'empilement gâcherait une hauteur d'écran pour rien.
 * `enGrille` les range deux par ligne, pour une liste longue de réponses
 * courtes : les noms de spécialités.
 *
 * `role="radiogroup"` et `aria-checked`, et NON `aria-pressed` : ce n'est pas
 * un interrupteur par réponse, c'est UN choix parmi plusieurs — la nuance
 * change ce qu'annonce un lecteur d'écran.
 */
export function ChoixUnique<T extends string>({
  options,
  libelle,
  valeur,
  onChoix,
  question,
  enLigne = false,
  enGrille = false,
}: ChoixUniqueProps<T>) {
  return (
    <div
      className={`options${enLigne ? ' options--ligne' : ''}${enGrille ? ' options--grille' : ''}`}
      role="radiogroup"
      aria-label={question}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          className={`option${option === valeur ? ' option--choisi' : ''}`}
          aria-checked={option === valeur}
          onClick={() => onChoix(option)}
        >
          {libelle(option)}
        </button>
      ))}
    </div>
  );
}
