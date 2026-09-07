import { useTextes } from '../../i18n/useTextes';
import { ChoixUnique } from './ChoixUnique';
import { NIVEAUX_ACTIVITE, type NiveauActivite } from './reponses';

/**
 * ÉTAPE : LE NIVEAU D'ACTIVITÉ QUOTIDIENNE.
 *
 * AUCUN NIVEAU N'EST RETENU D'AVANCE, contrairement à l'objectif : on ne
 * suppose pas à la place de quelqu'un ce qu'est sa journée. Tant qu'il n'a pas
 * répondu, aucune réponse n'est cochée.
 */
export function EtapeActivite({
  activite,
  onActivite,
}: {
  activite: NiveauActivite | null;
  onActivite: (activite: NiveauActivite) => void;
}) {
  const textes = useTextes();
  const question = textes.onboarding.activite.question;

  return (
    <>
      <h1 className="titre">{question}</h1>
      <ChoixUnique
        options={NIVEAUX_ACTIVITE}
        libelle={(id) => textes.niveauxActivite[id]}
        valeur={activite}
        onChoix={onActivite}
        question={question}
      />
    </>
  );
}
