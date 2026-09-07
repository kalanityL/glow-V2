import { useTextes } from '../../i18n/useTextes';
import { ChoixUnique } from './ChoixUnique';
import { SOUHAITS_ACTIVITE, type SouhaitActivite } from './reponses';

/**
 * ÉTAPE : CE QU'ON SOUHAITE POUR SON ACTIVITÉ QUOTIDIENNE.
 *
 * « CONSERVER MON RYTHME ACTUEL » EST RETENU D'AVANCE (2026-09-07) : ne rien
 * changer est le point neutre, il ne conseille rien. Cocher « être plus actif »
 * d'avance, ça, en serait un.
 *
 * La question qui demandait le NIVEAU d'activité la précédait ; elle a été
 * supprimée le même jour.
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
