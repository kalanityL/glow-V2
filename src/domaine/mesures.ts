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

/**
 * LA RÈGLE DES POIDS (2026-09-20, la mise à jour du poids « comme ça » : le
 * chiffre en grand et une règle qui glisse dessous). Elle va de `POIDS_MIN` à
 * `POIDS_MAX` de l'unité ; sa position est un RAPPORT de 0 à 1, jamais des
 * pixels — la géométrie est dans la feuille, le code ne connaît que le
 * rapport entre le chemin parcouru et le chemin total. Le poids lu est
 * arrondi au dixième, la forme stockée.
 */
export function poidsDepuisRapport(rapport: number, unite: UnitePoids): string {
  const borne = Math.min(1, Math.max(0, rapport));
  const valeur = POIDS_MIN + borne * (POIDS_MAX[unite] - POIDS_MIN);
  return (Math.round(valeur * 10) / 10).toFixed(1);
}

/** Le rapport (0 à 1) où se trouve un poids stocké sur la règle de l'unité. */
export function rapportDuPoids(stocke: string, unite: UnitePoids): number {
  const valeur = Number(stocke);
  return (valeur - POIDS_MIN) / (POIDS_MAX[unite] - POIDS_MIN);
}

/**
 * LES CRANS FRANCHIS entre deux poids stockés (2026-09-20, « autant de clic
 * que de crans qui passent ») : un cran par unité entière — ceux que la
 * graduation dessine. De 94,9 à 95,1 on en franchit un ; de 95,0 à 95,9,
 * aucun ; de 90,0 à 95,0, cinq. Dans un sens comme dans l'autre.
 */
export function cransFranchis(avant: string, apres: string): number {
  return Math.abs(Math.floor(Number(apres)) - Math.floor(Number(avant)));
}
