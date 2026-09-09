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
 * LES BORNES DE L'ÂGE ET DE LA TAILLE — celles de la spécification de la V1
 * (§ 10, « Contraintes ») : « les bornes n'écartent que l'absurde — jamais
 * elles ne disent à quelqu'un quel corps il a le droit d'avoir ». Âge de 1 à
 * 130 ans, taille de 50 à 300 cm. Mes premières bornes (12–110, 100–250)
 * décidaient à la place des gens ; reprises le 2026-09-09.
 *
 * En pouces, la fourchette est la conversion arrondie de celle en
 * centimètres : ici la règle EST la fourchette, elle ne change pas d'unité.
 */
export const AGE_MIN = 1;
export const AGE_MAX = 130;

export const TAILLE_BORNES: Record<UniteTaille, { min: number; max: number }> = {
  cm: { min: 50, max: 300 },
  in: { min: 20, max: 118 },
};
