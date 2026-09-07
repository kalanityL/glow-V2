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
}

/**
 * UNE QUESTION À RÉPONSE UNIQUE — le motif de toutes les questions à choisir.
 *
 * Les réponses sont EMPILÉES et pleine largeur par défaut : la question se lit
 * d'un trait, du haut vers le bas, là où deux colonnes obligeraient à comparer.
 * `enLigne` les met côte à côte pour les réponses d'un ou deux mots — la langue,
 * les unités —, où l'empilement gâcherait une hauteur d'écran pour rien.
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
}: ChoixUniqueProps<T>) {
  return (
    <div
      className={`options${enLigne ? ' options--ligne' : ''}`}
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
