import type { Unite } from './unites';

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
export const POIDS_MAX: Partial<Record<Unite, number>> = {
  kg: 999,
  lb: 2000,
};
