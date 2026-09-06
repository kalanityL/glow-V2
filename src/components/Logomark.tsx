import { useId, type CSSProperties } from 'react';

interface LogomarkProps {
  /**
   * Côté de la pastille, en pixels. ABSENT, LE COMPOSANT NE POSE RIEN et la
   * taille vient de la feuille, par le jeton `--logo-size` : un style en ligne
   * l'emporterait sur toute règle, y compris celle qui accorde la pastille à
   * son titre.
   */
  size?: number;
  className?: string;
}

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
 * Aucune couleur ici : les trois teintes de la boîte sont les jetons
 * `--logo-from/-via/-to` de la feuille du thème.
 */

/** Les trois tracés : la grande étoile à quatre branches et ses deux satellites. */
const STAR_PATHS = [
  'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z',
  'm5 1.5 1 2.5L8.5 4.5 6 5.5 5 8 4 5.5 1.5 4.5 4 4Z',
  'm19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z',
] as const;

/** La fenêtre qui recadre le motif sur sa bande commune. */
const STAR_VIEWBOX = '-1.2 -0.7 26.4 26.4';

export function Logomark({ size, className }: LogomarkProps) {
  const gradientId = `glow-silver-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div
      className={className ? `logomark ${className}` : 'logomark'}
      style={size === undefined ? undefined : ({ '--logo-size': `${size}px` } as CSSProperties)}
    >
      <svg viewBox={STAR_VIEWBOX} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#e2e8f0" />
            <stop offset="65%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        {STAR_PATHS.map((d) => (
          <path key={d} d={d} fill={`url(#${gradientId})`} stroke="#f8fafc" strokeWidth={0.5} />
        ))}
      </svg>
    </div>
  );
}
