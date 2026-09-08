import type { UnitePoids, UniteTaille } from './unites';

/**
 * LES BORNES D'UN POIDS.
 *
 * Elles vivent ICI et non dans un écran : les mêmes valent pour le poids
 * actuel, le poids visé et tous les poids à venir, et une règle recopiée finit
 * toujours par diverger. Rien du navigateur non plus — ce fichier partira tel
 * quel en React Native.
 */

/**
 * LE PLUS LOURD QU'ON PUISSE CHOISIR, PAR UNITÉ (2026-09-07 : « limite poids :
 * 999kilos / 2000 pounds »). Ce n'est PAS la conversion de l'un dans l'autre —
 * 999 kg font 2 202 lb — et c'est voulu : deux plafonds ronds, chacun choisi
 * dans son unité.
 *
 * Depuis que le poids se choisit dans une liste plutôt qu'il ne se tape, ce
 * plafond BORNE LA LISTE : il n'y a plus de valeur incorrecte à refuser, il n'y
 * en a plus d'atteignable. C'est le même nombre qui servait à juger la saisie.
 */
export const POIDS_MAX: Record<UnitePoids, number> = {
  kg: 999,
  lb: 2000,
};

/**
 * LES BORNES DE L'ÂGE. Large exprès : l'application n'a pas à décider qui est
 * trop jeune ou trop vieux pour se peser — elle borne une roue, rien de plus.
 */
export const AGE_MIN = 12;
export const AGE_MAX = 110;

/**
 * LES BORNES DE LA TAILLE, dans chaque unité. Comme pour le poids, ce ne sont
 * pas les conversions l'une de l'autre : deux fourchettes rondes, chacune
 * choisie dans son unité.
 */
export const TAILLE_BORNES: Record<UniteTaille, { min: number; max: number }> = {
  cm: { min: 100, max: 250 },
  in: { min: 40, max: 98 },
};
