/**
 * LES THÈMES, ET LE THÈME PAR DÉFAUT.
 *
 * Le choix se fait maintenant À L'ÉCRAN, au premier pas de l'onboarding
 * (2026-09-07) : ce fichier ne désigne plus le thème affiché, il donne la
 * LISTE et le DÉFAUT — le premier de la liste, celui qui est sélectionné quand
 * l'écran s'ouvre.
 *
 * AJOUTER UN THÈME se fait en quatre gestes, et rien de plus :
 *   1. `src/themes/<id>/<id>.css`, qui ne pose QUE des jetons ;
 *   2. son import dans `src/App.tsx` ;
 *   3. son `id` dans `THEMES` ci-dessous ;
 *   4. son nom dans chaque langue de `src/i18n/textes.ts` — le type l'exige,
 *      un oubli est une erreur de compilation et non un trou à l'écran.
 * La mise en page ne bouge jamais : elle vit dans `themes/page.css` et ne
 * connaît aucune couleur.
 */

/** Les thèmes existants, dans l'ordre où ils s'affichent. */
export const THEMES = ['ciel', 'ciel-fonce', 'blanc'] as const;

export type ThemeId = (typeof THEMES)[number];

/** Celui qui est sélectionné à l'ouverture : le premier de la liste. */
export const THEME_PAR_DEFAUT: ThemeId = THEMES[0];

/** La classe que la feuille du thème attend. */
export function classeDuTheme(theme: ThemeId): string {
  return `theme-${theme}`;
}
