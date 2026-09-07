import type { Unite } from './unites';

/**
 * LA SAISIE D'UNE MESURE — ce qu'on accepte de taper, et jusqu'où.
 *
 * Le filtrage vit ICI et non dans un écran : la même règle vaut pour le poids
 * actuel, le poids visé et tous les poids à venir, et une règle recopiée finit
 * toujours par diverger. Elle ne connaît rien du navigateur non plus — elle
 * partira telle quelle en React Native.
 */

/**
 * LE PLAFOND, PAR UNITÉ (2026-09-07 : « limite poids : 999kilos / 2000
 * pounds »). Il n'est PAS la conversion de l'un dans l'autre — 999 kg font
 * 2 202 lb — et c'est voulu : ce sont deux plafonds ronds, chacun choisi dans
 * son unité.
 *
 * C'est un plafond de SAISIE : il est là pour qu'une faute de frappe ne passe
 * pas, pas pour juger un poids.
 */
export const POIDS_MAX: Partial<Record<Unite, number>> = {
  kg: 999,
  lb: 2000,
};

/** Le nombre de décimales gardées. Une suffit : personne ne se pèse au gramme. */
const DECIMALES = 1;

/** Le plus grand nombre de chiffres avant la virgule, tous plafonds confondus. */
const CHIFFRES_ENTIERS = Math.max(...Object.values(POIDS_MAX).map((max) => String(max).length));

/**
 * Ce qu'on garde de ce qui vient d'être tapé.
 *
 * IL NE COUPE PAS AU PLAFOND, et c'est le point : une valeur trop grande doit
 * pouvoir être TAPÉE pour qu'on puisse la dire incorrecte. Couper en silence
 * laisserait croire que le nombre a été accepté. Le filtre ne fait donc que la
 * forme — des chiffres, un seul séparateur, une décimale — et c'est
 * `poidsDepasse` qui juge.
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
    propre = propre.slice(0, premier + 1) + propre.slice(premier + 1).replace(/[.,]/g, '');
  }

  const [entiere = '', decimale] = propre.split(/[.,]/);
  const separateur = premier === -1 ? '' : propre[premier];
  const entiereCoupee = entiere.slice(0, CHIFFRES_ENTIERS);
  const decimaleCoupee = decimale === undefined ? undefined : decimale.slice(0, DECIMALES);

  return decimaleCoupee === undefined ? entiereCoupee : entiereCoupee + separateur + decimaleCoupee;
}

/** La valeur tapée, en nombre — ou `null` si elle n'en est pas encore un. */
export function versNombre(saisie: string): number | null {
  const nettoye = saisie.replace(',', '.');
  if (nettoye === '' || nettoye.endsWith('.')) return null;
  const nombre = Number(nettoye);
  return Number.isFinite(nombre) ? nombre : null;
}

/**
 * Vrai quand le poids tapé dépasse le plafond de son unité.
 *
 * Un champ vide, ou une saisie encore en cours (« 72, »), ne dépasse rien : on
 * ne reproche pas à quelqu'un de n'avoir pas fini d'écrire.
 */
export function poidsDepasse(saisie: string, unite: Unite): boolean {
  const nombre = versNombre(saisie);
  const max = POIDS_MAX[unite];
  return nombre !== null && max !== undefined && nombre > max;
}
