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

/**
 * L'ANNÉE DE NAISSANCE REMPLACE L'ÂGE (2026-09-09) : un âge se périme, une
 * année de naissance non. Ses bornes sont celles de l'âge, rapportées à
 * l'année en cours — l'appelant la passe, ce fichier ne lit pas l'horloge.
 */
export const ANNEE_NAISSANCE_PAR_DEFAUT = 1980;

export function bornesAnneeNaissance(anneeCourante: number): { min: number; max: number } {
  return { min: anneeCourante - AGE_MAX, max: anneeCourante - AGE_MIN };
}

/** La taille de départ, en centimètres — l'unité de stockage (2026-09-09). */
export const TAILLE_PAR_DEFAUT_CM = 165;

export const TAILLE_BORNES: Record<UniteTaille, { min: number; max: number }> = {
  cm: { min: 50, max: 300 },
  in: { min: 20, max: 118 },
};

/** Le plus léger qu'on puisse choisir : un kilo, une livre — en dessous, c'est
    l'absurde, et rien d'autre (GUIDELINES : les bornes n'écartent que
    l'absurde). */
export const POIDS_MIN = 1;

/**
 * UN POIDS TAPÉ À LA MAIN (2026-09-19, le profil édite ses valeurs sur
 * place) : virgule ou point acceptés, une décimale au plus, dans les bornes
 * de l'unité. Rendu sous la forme stockée — un point, une décimale, « 95.0 » —,
 * ou `null` si la saisie ne vaut pas un poids.
 */
export function poidsDepuisSaisie(texte: string, unite: UnitePoids): string | null {
  const propre = texte.trim().replace(',', '.');
  if (!/^\d{1,4}(\.\d)?$/.test(propre)) return null;
  const valeur = Number(propre);
  if (valeur < POIDS_MIN || valeur > POIDS_MAX[unite]) return null;
  return valeur.toFixed(1);
}
