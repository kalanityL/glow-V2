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
  | 'traitement'
  | 'quel-traitement';

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
  /* Le traitement APRÈS les poids : on a dit où l'on en est et où l'on va
     avant de dire ce qu'on prend. */
  { id: 'traitement' },
  /* La forme et la spécialité, SUR LEUR PROPRE ÉCRAN (2026-09-07) : elles se
     posaient en cascade sous la question précédente, et trois questions
     empilées dépassaient la hauteur de l'écran. Elle ne se montre qu'à qui a
     commencé — la poser à qui n'a pas commencé n'aurait pas de sens. */
  { id: 'quel-traitement', montre: (reponses) => reponses.traitementCommence },
];

/**
 * CE QUI EMPÊCHE D'AVANCER, étape par étape.
 *
 * La règle est ici et non dans un écran : le bouton « Suivant » vit dans
 * `Onboarding`, à côté de toutes les étapes, et c'est le parcours qui sait ce
 * qu'une réponse exige.
 *
 * Une seule étape bloque aujourd'hui (2026-09-07, « on ne peut pas valider
 * avant d'avoir selectionné la réponse à la question suivante ») : celle qui
 * demande QUEL traitement. La forme ET la spécialité doivent y être choisies —
 * dire qu'on a commencé sans dire quoi ne renseigne rien.
 *
 * L'étape « avez-vous commencé », elle, ne bloque plus rien : « oui » y est
 * retenu d'avance, il y a donc toujours une réponse. Et qui répond « non » ne
 * voit jamais l'étape suivante.
 *
 * Ailleurs, rien ne bloque : une question sans réponse se saute, c'est la
 * règle de l'onboarding depuis le premier jour.
 */
export function peutValider(etape: EtapeId, reponses: Reponses): boolean {
  if (etape !== 'quel-traitement') return true;
  return reponses.formeTraitement !== null && reponses.traitement !== null;
}

/** Les étapes que ces réponses font voir, dans l'ordre. */
export function etapesVisibles(reponses: Reponses): EtapeId[] {
  return ETAPES.filter((etape) => etape.montre?.(reponses) ?? true).map((etape) => etape.id);
}
