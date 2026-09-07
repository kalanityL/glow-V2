import { useState } from 'react';
import { nettoyerPoids } from '../domaine/mesures';
import { etapesVisibles, type EtapeId } from '../screens/onboarding/parcours';
import { REPONSES_INITIALES, type Reponses } from '../screens/onboarding/reponses';

/**
 * LE PARCOURS : les réponses ET le rang de l'étape, ensemble.
 *
 * POURQUOI ENSEMBLE : depuis que « Quel poids visez-vous ? » ne se montre qu'à
 * qui veut perdre du poids (2026-09-07), la SUITE des étapes dépend des
 * RÉPONSES. Les tenir à deux endroits séparés, c'était laisser l'un décider
 * sans voir l'autre.
 *
 * POURQUOI ICI, et non dans l'écran d'onboarding : le bouton « retour » de la
 * barre est HORS de l'écran du téléphone — c'est le bouton natif simulé —, et
 * il doit pouvoir reculer dans le parcours.
 *
 * Le rang est un simple compteur sur la liste des étapes VISIBLES. Il est borné
 * à chaque lecture plutôt qu'au moment de la réponse : changer d'objectif peut
 * raccourcir la liste sous les pieds du rang, et mieux vaut qu'il retombe sur
 * la dernière étape que sur rien.
 */
export function useParcours() {
  const [reponses, setReponses] = useState<Reponses>(REPONSES_INITIALES);
  const [rang, setRang] = useState(0);

  const visibles = etapesVisibles(reponses);
  const rangBorne = Math.min(rang, visibles.length - 1);
  const etape: EtapeId = visibles[rangBorne];

  /** Une réponse, et une seule, remplacée. */
  const repondre = <C extends keyof Reponses>(champ: C, valeur: Reponses[C]) =>
    setReponses((precedentes) => ({ ...precedentes, [champ]: valeur }));

  /** Les mesures passent par le filtre de saisie : le plafond vaut partout. */
  const repondrePoids = (champ: 'poids' | 'poidsCible', saisie: string) =>
    repondre(champ, nettoyerPoids(saisie));

  return {
    reponses,
    etape,
    repondre,
    repondrePoids,
    peutRevenir: rangBorne > 0,
    avancer: () => setRang(Math.min(rangBorne + 1, visibles.length - 1)),
    reculer: () => setRang(Math.max(rangBorne - 1, 0)),
  };
}
