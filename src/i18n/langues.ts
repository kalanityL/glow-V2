/**
 * LES LANGUES SERVIES, dans un fichier à part.
 *
 * Pourquoi pas dans `textes.ts` avec le reste : le système d'unités a besoin de
 * connaître les langues (chacune a le sien par défaut) et le dictionnaire a
 * besoin de connaître les unités (il en porte les libellés). L'un dans l'autre,
 * les deux fichiers s'importeraient en rond. Ce fichier-ci, qui ne dépend de
 * rien, coupe le cercle.
 */

export const LANGUES = ['fr', 'en'] as const;

export type Langue = (typeof LANGUES)[number];

/** La langue de repli, celle du projet. */
export const LANGUE_PAR_DEFAUT: Langue = 'fr';
