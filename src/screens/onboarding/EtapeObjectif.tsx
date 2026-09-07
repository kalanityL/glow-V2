import { useTextes } from '../../i18n/useTextes';
import { ChoixUnique } from './ChoixUnique';
import { OBJECTIFS, type Objectif } from './reponses';

/** ÉTAPE : L'OBJECTIF. Deux réponses, la première retenue d'avance. */
export function EtapeObjectif({
  objectif,
  onObjectif,
}: {
  objectif: Objectif;
  onObjectif: (objectif: Objectif) => void;
}) {
  const textes = useTextes();
  const question = textes.onboarding.objectif.question;

  return (
    <>
      <h1 className="titre">{question}</h1>
      <ChoixUnique
        options={OBJECTIFS}
        libelle={(id) => textes.objectifs[id]}
        valeur={objectif}
        onChoix={onObjectif}
        question={question}
      />
    </>
  );
}
