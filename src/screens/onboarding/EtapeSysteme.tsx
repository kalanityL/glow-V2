import { useTextes } from '../../i18n/useTextes';
import { SYSTEMES, type Systeme } from '../../domaine/unites';
import { ChoixUnique } from './ChoixUnique';

/**
 * ÉTAPE : LE SYSTÈME D'UNITÉS — centimètres et kilos, ou pouces et livres.
 *
 * Elle vient JUSTE APRÈS LE THÈME et avant toute mesure (demande du
 * 2026-09-07) : on choisit ses unités avant qu'on ne lui demande un poids, et
 * jamais après. Le métrique est retenu d'avance.
 *
 * Le choix ne convertit rien et n'a rien à convertir : aucune mesure n'a encore
 * été saisie à ce point du parcours. Le jour où ce réglage reviendra dans les
 * préférences, il devra convertir — et c'est pour cela que les mesures sont
 * stockées en métrique, quelle que soit l'unité de saisie (voir
 * `domaine/unites.ts`).
 */
export function EtapeSysteme({
  systeme,
  onSysteme,
}: {
  systeme: Systeme;
  onSysteme: (systeme: Systeme) => void;
}) {
  const textes = useTextes();
  const question = textes.onboarding.systeme.question;

  return (
    <>
      <h1 className="titre">{question}</h1>
      <ChoixUnique
        options={SYSTEMES}
        libelle={(id) => textes.systemes[id]}
        valeur={systeme}
        onChoix={onSysteme}
        question={question}
      />
    </>
  );
}
