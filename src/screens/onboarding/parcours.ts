import { motDePasseValide } from '../../domaine/compte';
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
  | 'quel-traitement'
  | 'avatar'
  | 'profil';

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
  /* L'avatar EN DERNIER, quel que soit le chemin : après la forme et la
     spécialité pour qui a commencé, tout de suite après le « non » pour qui
     n'a pas commencé (2026-09-08). */
  { id: 'avatar' },
  /* QUI L'ON EST, en dernier (2026-09-08) : c'est l'écran qui précède
     l'application, et son bouton n'annonce plus la suite du questionnaire mais
     l'entrée dans l'application. */
  { id: 'profil' },
];

/**
 * L'ÉTAPE À PARTIR DE LAQUELLE LE DÉCOMPTE S'AFFICHE (2026-09-08 : « a partir
 * de avez-vous commencé votre traitement »).
 *
 * Les premiers écrans ne le portent pas : on y règle l'application — le thème,
 * la langue, les unités — plus qu'on ne remplit un questionnaire, et annoncer
 * un décompte dès la première page ferait paraître le chemin plus long qu'il
 * n'est.
 */
export const ETAPE_DEBUT_DECOMPTE: EtapeId = 'traitement';

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
  if (etape === 'quel-traitement') {
    return reponses.formeTraitement !== null && reponses.traitement !== null;
  }
  /* Le dernier écran ouvre un compte : un mot de passe commencé doit tenir la
     règle des huit signes avant qu'on entre. Un mot de passe VIDE ne bloque
     pas — rien n'est obligatoire dans cet onboarding, et forcer la main ici
     serait un choix qu'elle n'a pas fait. */
  if (etape === 'profil') {
    return reponses.motDePasse.length === 0 || motDePasseValide(reponses.motDePasse);
  }
  return true;
}

/** Les étapes que ces réponses font voir, dans l'ordre. */
export function etapesVisibles(reponses: Reponses): EtapeId[] {
  return ETAPES.filter((etape) => etape.montre?.(reponses) ?? true).map((etape) => etape.id);
}
