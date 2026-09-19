/**
 * LA COCARDE VIDE — la forme d'un badge sans badge (2026-09-17, « sous bonjour
 * mettre un placeholder de la meme forme qu'un badge (rond avec
 * collerette) »), devenue UN MASQUE BLANC (2026-09-19, « placeholder de
 * badge : un masque blanc de la forme exterieur du badge, pas de trait ni
 * rien de dessiné ») : la silhouette extérieure du cadre des badges de la V1
 * (`versions/cartes/components/badge/BadgeFrame.tsx`) — la rosette de seize
 * plis, le disque, et les deux rubans pendants — d'un seul aplat, sans anneau,
 * sans liseré, sans rien dessiné dedans. La géométrie est celle de la V1 : la
 * cocarde centrée à (60, 57) ; le rond réduit (rosette à 40, « réduire la
 * proportion rond/ruban ») ; les rubans réduits de 25 % depuis leur point
 * d'attache (60, 86).
 *
 * AUCUNE COULEUR ICI : la classe `cocarde__masque` est peinte par `page.css`
 * en surface du thème. La taille est celle de l'endroit qui l'abrite.
 */

/** Les seize plis de la rosette, en degrés. */
const PLIS = Array.from({ length: 16 }, (_, i) => i * 22.5);

const CENTRE_X = 60;
const CENTRE_Y = 57;
/* LE ROND EST PLUS PETIT QUE DANS LA V1 (2026-09-17, « réduire la proportion
   rond/ruban du badge ») : rosette à 40 au lieu de 47, plis de 5,5 au lieu
   de 6,5, disque de 41 — les rubans, eux, gardent leurs tracés, et se voient
   donc davantage sous le rond. */
const RAYON_PLIS = 40;
const RAYON_PLI = 5.5;
const RAYON_DISQUE = 41;

export function Cocarde() {
  return (
    <svg className="cocarde" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <g className="cocarde__masque" transform="translate(60 86) scale(0.75) translate(-60 -86)">
        <path d="M 40 86 Q 30 104 16 128 L 28 120 L 38 129 Q 48 106 50 90 Z" />
        <path d="M 70 90 Q 72 106 82 129 L 92 120 L 104 128 Q 90 104 80 86 Z" />
      </g>
      <g className="cocarde__masque">
        {PLIS.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <circle
              key={deg}
              cx={CENTRE_X + RAYON_PLIS * Math.cos(rad)}
              cy={CENTRE_Y + RAYON_PLIS * Math.sin(rad)}
              r={RAYON_PLI}
            />
          );
        })}
      </g>
      <circle cx={CENTRE_X} cy={CENTRE_Y} r={RAYON_DISQUE} className="cocarde__masque" />
    </svg>
  );
}
