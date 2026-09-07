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
  | 'activite'
  | 'souhait-quotidien';

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
  { id: 'activite' },
  /* Le souhait APRÈS le niveau : on dit d'abord où l'on en est, ensuite où
     l'on veut aller. L'inverse ferait répondre dans le vide. */
  { id: 'souhait-quotidien' },
];

/**
 * CE QUI EMPÊCHE D'AVANCER, étape par étape.
 *
 * La règle est ici et non dans un écran : le bouton « Suivant » vit dans
 * `Onboarding`, à côté de toutes les étapes, et c'est le parcours qui sait ce
 * qu'une réponse exige.
 *
 * Une seule étape bloque aujourd'hui (2026-09-07, « on ne peut pas valider
 * avant d'avoir selectionné la réponse à la question suivante ») : celle du
 * traitement, et seulement quand on a répondu « oui ». La cascade doit alors
 * être complète — la forme ET la spécialité — car dire « j'ai commencé » sans
 * dire quoi ne renseigne rien. Répondre « non » suffit et laisse passer.
 *
 * Ailleurs, rien ne bloque : une question sans réponse se saute, c'est la
 * règle de l'onboarding depuis le premier jour.
 */
export function peutValider(etape: EtapeId, reponses: Reponses): boolean {
  if (etape !== 'traitement') return true;
  if (reponses.traitementCommence === null) return false;
  if (!reponses.traitementCommence) return true;
  return reponses.formeTraitement !== null && reponses.traitement !== null;
}

/** Les étapes que ces réponses font voir, dans l'ordre. */
export function etapesVisibles(reponses: Reponses): EtapeId[] {
  return ETAPES.filter((etape) => etape.montre?.(reponses) ?? true).map((etape) => etape.id);
}
