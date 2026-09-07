import type { Reponses } from './reponses';

/**
 * LE PARCOURS DE L'ONBOARDING : les étapes, dans l'ordre, et celles qui ne se
 * montrent que si une réponse le demande.
 *
 * `montre` absent veut dire « toujours ». La liste des étapes VISIBLES se
 * recalcule à chaque réponse : c'est ce qui fait que « Quel poids visez-vous ? »
 * apparaît ou disparaît selon l'objectif, sans qu'aucun écran n'ait à le
 * savoir.
 */
export interface Etape {
  id: EtapeId;
  montre?: (reponses: Reponses) => boolean;
}

export type EtapeId = 'theme' | 'objectif' | 'poids' | 'poids-cible' | 'activite';

export const ETAPES: readonly Etape[] = [
  { id: 'theme' },
  { id: 'objectif' },
  { id: 'poids' },
  /* Viser un poids n'a de sens que si l'on veut en changer : à « stabiliser »,
     la question se saute (demande du 2026-09-07). */
  { id: 'poids-cible', montre: (reponses) => reponses.objectif === 'perdre' },
  { id: 'activite' },
];

/** Les étapes que ces réponses font voir, dans l'ordre. */
export function etapesVisibles(reponses: Reponses): EtapeId[] {
  return ETAPES.filter((etape) => etape.montre?.(reponses) ?? true).map((etape) => etape.id);
}
