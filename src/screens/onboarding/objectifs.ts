/**
 * LES OBJECTIFS PROPOSÉS, dans l'ordre où ils s'affichent.
 *
 * Le premier est celui qui est retenu à l'ouverture de l'étape. Les LIBELLÉS ne
 * sont pas ici mais dans `i18n/textes.ts` : ce fichier ne porte que les
 * identifiants, qui ne changent pas d'une langue à l'autre.
 */
export const OBJECTIFS = ['perdre', 'stabiliser'] as const;

export type Objectif = (typeof OBJECTIFS)[number];

/** Celui qui est retenu d'avance. */
export const OBJECTIF_PAR_DEFAUT: Objectif = OBJECTIFS[0];
