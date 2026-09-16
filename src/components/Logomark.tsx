import { useId } from 'react';

/**
 * LE BLOC-LOGO DE GLOW — la pastille dégradée aux trois étoiles d'argent.
 *
 * `STAR_PATHS` est la table de tracés de la marque, et `STAR_VIEWBOX` la
 * fenêtre qui va avec : la petite étoile du haut déborde du carré de 24 par le
 * haut, et c'est la fenêtre — pas les tracés — qui recadre le motif. Reprendre
 * les tracés sans la fenêtre le montrerait décalé.
 *
 * L'identifiant du dégradé est unique par instance : un `<linearGradient id>`
 * vaut pour tout le document, et deux logos sur la même page se voleraient leur
 * dessin, celui du premier démonté emportant l'autre. D'où `useId`, sans
 * ponctuation — deux-points et chevrons n'ont rien à faire dans une `url(#…)`.
 *
 * AUCUNE COULEUR NI AUCUNE TAILLE ICI (règle de la V1 reprise le 2026-09-09 :
 * rien de style en dur dans un template). Les quatre teintes de l'argent et le
 * filet des étoiles sont des CLASSES, peintes dans `themes/dessins.css` ; la
 * boîte prend ses trois teintes des jetons `--logo-*` du thème ; la taille est
 * `--logo-size`, posée par la feuille de l'endroit où le logo se trouve.
 */

/** Les trois tracés : la grande étoile à quatre branches et ses deux satellites.
    Exportés : `Etoiles` (le salut, en or) et `IconeEtoiles` (le menu, en trait)
    reprennent le même motif — une retouche vaut pour tous. */
export const STAR_PATHS = [
  'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z',
  'm5 1.5 1 2.5L8.5 4.5 6 5.5 5 8 4 5.5 1.5 4.5 4 4Z',
  'm19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z',
] as const;

/** La fenêtre qui recadre le motif sur sa bande commune. */
export const STAR_VIEWBOX = '-1.2 -0.7 26.4 26.4';

/**
 * LES TROIS ÉTOILES SEULES, SANS LA PASTILLE — en doré (2026-09-16, « remplace
 * le soleil pa les 3 étoiles du logo en dorée comme le soleil ») : le même
 * motif, la même fenêtre, un autre métal. L'or est peint par les classes
 * `etoiles__or-*` dans `themes/dessins.css` ; la taille est celle de
 * l'endroit qui les abrite (`.salut__etoiles`).
 */
export function Etoiles() {
  const gradientId = `glow-or-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg className="etoiles" viewBox={STAR_VIEWBOX} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="etoiles__or-1" />
          <stop offset="35%" className="etoiles__or-2" />
          <stop offset="65%" className="etoiles__or-3" />
          <stop offset="100%" className="etoiles__or-4" />
        </linearGradient>
      </defs>
      {STAR_PATHS.map((d) => (
        <path key={d} d={d} className="etoiles__etoile" fill={`url(#${gradientId})`} />
      ))}
    </svg>
  );
}

export function Logomark() {
  const gradientId = `glow-silver-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="logomark">
      <svg viewBox={STAR_VIEWBOX} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="logomark__argent-1" />
            <stop offset="35%" className="logomark__argent-2" />
            <stop offset="65%" className="logomark__argent-3" />
            <stop offset="100%" className="logomark__argent-4" />
          </linearGradient>
        </defs>
        {STAR_PATHS.map((d) => (
          <path key={d} d={d} className="logomark__etoile" fill={`url(#${gradientId})`} />
        ))}
      </svg>
    </div>
  );
}
