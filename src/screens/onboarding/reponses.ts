import { SYSTEME_PAR_DEFAUT, type Systeme } from '../../domaine/unites';
import { THEME_PAR_DEFAUT, type ThemeId } from '../../themes/themes';

/** Les objectifs proposés, dans l'ordre d'affichage. Le premier est retenu d'avance. */
export const OBJECTIFS = ['perdre', 'stabiliser'] as const;
export type Objectif = (typeof OBJECTIFS)[number];

/** Les niveaux d'activité quotidienne. AUCUN n'est retenu d'avance : on ne
 *  suppose pas à la place de quelqu'un ce qu'est sa journée. */
export const NIVEAUX_ACTIVITE = ['doux', 'modere', 'intense'] as const;
export type NiveauActivite = (typeof NIVEAUX_ACTIVITE)[number];

/**
 * TOUT CE QUE L'ONBOARDING RECUEILLE.
 *
 * Les mesures sont gardées TELLES QU'ELLES SONT TAPÉES, en texte : les
 * convertir à chaque frappe empêcherait d'écrire « 72, » puis « 72,5 ». La
 * conversion se fera là où on les enregistrera.
 *
 * `null` veut dire « pas encore répondu », et se distingue d'une réponse vide.
 */
export interface Reponses {
  theme: ThemeId;
  systeme: Systeme;
  objectif: Objectif;
  poids: string;
  poidsCible: string;
  activite: NiveauActivite | null;
}

export const REPONSES_INITIALES: Reponses = {
  theme: THEME_PAR_DEFAUT,
  systeme: SYSTEME_PAR_DEFAUT,
  objectif: OBJECTIFS[0],
  poids: '',
  poidsCible: '',
  activite: null,
};
