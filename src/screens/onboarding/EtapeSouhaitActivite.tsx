import { useTextes } from '../../i18n/useTextes';
import { ChoixUnique } from './ChoixUnique';
import { SOUHAITS_ACTIVITE, type SouhaitActivite } from './reponses';

/**
 * ÉTAPE : CE QU'ON SOUHAITE POUR SON ACTIVITÉ QUOTIDIENNE.
 *
 * Elle suit le niveau d'activité, et l'ordre compte : on dit d'abord où l'on
 * en est, ensuite où l'on veut aller. L'inverse ferait répondre dans le vide.
 *
 * « CONSERVER MON RYTHME ACTUEL » EST RETENU D'AVANCE (2026-09-07), alors que
 * le niveau d'activité, lui, n'a pas de défaut. Ce n'est pas une
 * incohérence : ne rien changer est le point neutre, il ne conseille rien.
 * Cocher « être plus actif » d'avance, ça, en serait un.
 */
export function EtapeSouhaitActivite({
  souhait,
  onSouhait,
}: {
  souhait: SouhaitActivite;
  onSouhait: (souhait: SouhaitActivite) => void;
}) {
  const textes = useTextes();
  const question = textes.onboarding.souhaitQuotidien.question;

  return (
    <>
      <h1 className="titre">{question}</h1>
      <ChoixUnique
        options={SOUHAITS_ACTIVITE}
        libelle={(id) => textes.souhaitsActivite[id]}
        valeur={souhait}
        onChoix={onSouhait}
        question={question}
      />
    </>
  );
}
