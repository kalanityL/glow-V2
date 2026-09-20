import type { Reponses } from '../screens/onboarding/reponses';
import type { ChoixTraitement } from '../screens/BlocTraitement';
import type { useParcours } from './useParcours';

/** Ce que le bloc « Mon traitement » édite, lu dans les réponses : « aucun »
    quand il n'y a pas de traitement. */
export function choixTraitementDe(reponses: Reponses): ChoixTraitement {
  return reponses.traitement
    ? { forme: reponses.formeTraitement, traitement: reponses.traitement }
    : { forme: 'aucun', traitement: null };
}

/** Écrit le choix du bloc dans les réponses — les trois réponses liées du
    traitement, ensemble (voir `reponses.ts`). */
export function appliquerChoixTraitement(parcours: ReturnType<typeof useParcours>, choix: ChoixTraitement): void {
  if (choix.forme === 'aucun' || choix.forme === null) {
    parcours.repondreTraitementCommence(false);
    return;
  }
  parcours.repondreTraitementCommence(true);
  parcours.repondreForme(choix.forme);
  if (choix.traitement) parcours.repondre('traitement', choix.traitement);
}
