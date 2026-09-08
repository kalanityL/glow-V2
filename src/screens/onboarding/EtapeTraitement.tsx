import { useTextes } from '../../i18n/useTextes';
import { ChoixUnique } from './ChoixUnique';

interface EtapeTraitementProps {
  commence: boolean;
  onCommence: (commence: boolean) => void;
}

/** Les deux réponses, comme identifiants. */
const OUI_NON = ['oui', 'non'] as const;

/**
 * ÉTAPE : A-T-ON COMMENCÉ SON TRAITEMENT ?
 *
 * Une seule question, « oui » retenu d'avance (2026-09-07). La forme et la
 * spécialité, qui se posaient ici en cascade, vivent maintenant sur l'écran
 * suivant : sur trois questions empilées, la page dépassait la hauteur de
 * l'écran et les boutons descendaient hors de vue.
 *
 * L'ÉTAPE NE BLOQUE PLUS RIEN : « oui » étant retenu d'avance, il y a toujours
 * une réponse. C'est l'écran suivant qui exige de choisir un traitement.
 */
export function EtapeTraitement({ commence, onCommence }: EtapeTraitementProps) {
  const textes = useTextes();
  const question = textes.onboarding.traitement.question;

  return (
    <>
      <h1 className="titre">{question}</h1>
      <ChoixUnique
        options={OUI_NON}
        libelle={(id) => (id === 'oui' ? textes.oui : textes.non)}
        valeur={commence ? 'oui' : 'non'}
        onChoix={(id) => onCommence(id === 'oui')}
        question={question}
        enLigne
      />
    </>
  );
}
