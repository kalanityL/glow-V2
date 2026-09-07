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

export type EtapeId =
  | 'theme'
  | 'langue-unites'
  | 'objectif'
  | 'poids'
  | 'poids-cible'
  | 'activite';

export const ETAPES: readonly Etape[] = [
  /* LE THÈME EN PREMIER, et la langue ensuite (2026-09-07). J'avais d'abord
     mis la langue en tête, en lisant « en premier » comme « avant tout » ; ce
     qu'elle voulait dire, c'est « en premier SUR CET ÉCRAN-LÀ » — l'écran des
     unités, qui vient après le thème depuis le début (« écran apres choix du
     theme, choix metrique »). Le défaut sautait aux yeux à l'usage : il
     manquait un bouton « Précédent » sur l'écran langue et unités, ce qui ne
     peut arriver qu'à la toute première page. */
  { id: 'theme' },
  /* LA LANGUE ET LES UNITÉS, ENSEMBLE : la langue amène ses unités, et les
     poser sur le même écran montre ce que le choix de l'une fait à l'autre.
     Elles arrivent bien AVANT toute mesure : on ne demande pas un poids à
     quelqu'un avant de savoir dans quelle unité il le compte. */
  { id: 'langue-unites' },
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
