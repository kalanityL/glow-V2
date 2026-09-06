/**
 * LES THÈMES, ET LE SEUL ENDROIT OÙ L'ON CHOISIT.
 *
 * IL N'Y A PAS DE PAGE DE CHOIX DE THÈME, et c'est voulu (2026-09-06) : les
 * thèmes ne se montrent pas à qui utilise l'application. Pour passer de l'un à
 * l'autre, une seule valeur change — `THEME_ACTIF`, ci-dessous — et rien
 * d'autre dans tout le projet.
 *
 * AJOUTER UN THÈME se fait en trois gestes, et rien de plus :
 *   1. `src/themes/<id>/<id>.css`, qui ne pose QUE des jetons ;
 *   2. son import dans `src/App.tsx` ;
 *   3. son `id` dans `THEMES` ci-dessous.
 * La mise en page, elle, ne bouge jamais : elle vit dans `themes/page.css` et
 * ne connaît aucune couleur.
 */

/** Les thèmes existants, dans l'ordre où ils ont été faits. */
export const THEMES = ['ciel', 'ciel-fonce'] as const;

export type ThemeId = (typeof THEMES)[number];

/** LE THÈME AFFICHÉ. C'est cette ligne, et elle seule, qui bascule. */
export const THEME_ACTIF: ThemeId = 'ciel-fonce';

/** La classe que la feuille du thème attend sur la page. */
export function classeDuTheme(theme: ThemeId): string {
  return `theme-${theme}`;
}
