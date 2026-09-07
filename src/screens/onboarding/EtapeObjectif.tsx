import { useTextes } from '../../i18n/useTextes';
import { OBJECTIFS, type Objectif } from './objectifs';

interface EtapeObjectifProps {
  objectif: Objectif;
  onObjectif: (objectif: Objectif) => void;
}

/**
 * ÉTAPE 2 : L'OBJECTIF.
 *
 * Deux réponses, une seule à la fois, la première retenue d'avance. Elles sont
 * empilées et pleine largeur : la question se lit d'un trait, du haut vers le
 * bas, et rien n'oblige à comparer deux colonnes.
 *
 * `role="radiogroup"` et `aria-checked` plutôt que `aria-pressed` : ce n'est
 * pas un interrupteur par réponse, c'est UN choix parmi deux — la nuance
 * change ce qu'annonce un lecteur d'écran.
 */
export function EtapeObjectif({ objectif, onObjectif }: EtapeObjectifProps) {
  const textes = useTextes();

  return (
    <>
      <h1 className="titre">{textes.onboarding.objectif.question}</h1>

      <div className="options" role="radiogroup" aria-label={textes.onboarding.objectif.question}>
        {OBJECTIFS.map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            className={`option${id === objectif ? ' option--choisi' : ''}`}
            aria-checked={id === objectif}
            onClick={() => onObjectif(id)}
          >
            {textes.objectifs[id]}
          </button>
        ))}
      </div>
    </>
  );
}
