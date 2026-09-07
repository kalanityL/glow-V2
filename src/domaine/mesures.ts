/**
 * LA SAISIE D'UNE MESURE — ce qu'on accepte de taper, et jusqu'où.
 *
 * Le filtrage est fait ICI et non dans un écran : la même règle vaudra pour le
 * poids actuel, le poids visé et tous les poids à venir, et une règle recopiée
 * finit toujours par diverger. Elle ne connaît rien du navigateur non plus —
 * elle partira telle quelle en React Native.
 */

/**
 * LE POIDS LE PLUS LOURD QU'ON PUISSE TAPER : 999, dans les deux systèmes
 * (demande du 2026-09-07 : « poids max 999 kilos et 999 pounds »). C'est un
 * plafond de SAISIE, pas une vérité physiologique : il est là pour qu'une
 * faute de frappe ne passe pas, pas pour juger un poids.
 */
export const POIDS_MAX = 999;

/** Le nombre de décimales gardées. Une suffit : personne ne se pèse au gramme. */
const DECIMALES = 1;

/**
 * Ce qu'on garde de ce qui vient d'être tapé.
 *
 * Les deux séparateurs sont acceptés — « 72,5 » est la façon française, « 72.5 »
 * celle du clavier numérique de certains téléphones — et gardés tels quels :
 * corriger la virgule en point sous les doigts déplacerait le curseur.
 */
export function nettoyerPoids(saisie: string): string {
  /* Tout ce qui n'est ni un chiffre ni un séparateur disparaît. */
  let propre = saisie.replace(/[^\d.,]/g, '');

  /* Un seul séparateur : les suivants sont ignorés. */
  const premier = propre.search(/[.,]/);
  if (premier !== -1) {
    propre =
      propre.slice(0, premier + 1) + propre.slice(premier + 1).replace(/[.,]/g, '');
  }

  const [entiere = '', decimale] = propre.split(/[.,]/);
  const separateur = premier === -1 ? '' : propre[premier];
  const entiereCoupee = entiere.slice(0, String(POIDS_MAX).length);
  const decimaleCoupee = decimale === undefined ? undefined : decimale.slice(0, DECIMALES);

  /* Au plafond, les décimales n'ont plus de place : 999,5 dépasserait. */
  if (Number(entiereCoupee) >= POIDS_MAX) return String(POIDS_MAX);

  return decimaleCoupee === undefined ? entiereCoupee : entiereCoupee + separateur + decimaleCoupee;
}
