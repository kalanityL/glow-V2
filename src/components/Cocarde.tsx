/**
 * LA COCARDE VIDE — la forme d'un badge sans badge (2026-09-17, « sous bonjour
 * mettre un placeholder de la meme forme qu'un badge (rond avec
 * collerette) »). La forme est celle du cadre des badges de la V1
 * (`versions/cartes/components/badge/BadgeFrame.tsx`) : une rosette de
 * seize plis régulièrement répartis, un anneau, une plaque, un liseré
 * pointillé, et LES DEUX RUBANS PENDANTS (« il manque les deux rubans sur le
 * placeholder ») — sans la bannière du palier, et sans dessin. La géométrie
 * est celle de la V1 à l'unité près : la cocarde centrée à (60, 57), les
 * rubans qui descendent jusqu'à 129 — d'où une fenêtre de 120 sur 130.
 *
 * AUCUNE COULEUR ICI : chaque pièce porte une classe, `page.css` la peint aux
 * jetons du thème — c'est un emplacement, pas un badge, il ne porte aucun
 * métal. La taille est celle de l'endroit qui l'abrite.
 */

/** Les seize plis de la rosette, en degrés. */
const PLIS = Array.from({ length: 16 }, (_, i) => i * 22.5);

const CENTRE_X = 60;
const CENTRE_Y = 57;
/* LE ROND EST PLUS PETIT QUE DANS LA V1 (2026-09-17, « réduire la proportion
   rond/ruban du badge ») : rosette à 40 au lieu de 47, plis de 5,5 au lieu
   de 6,5, anneau, plaque et liseré resserrés d'autant — les rubans, eux,
   gardent leurs tracés, et se voient donc davantage sous le rond. */
const RAYON_PLIS = 40;
const RAYON_PLI = 5.5;
const RAYON_ANNEAU = 41;
const RAYON_PLAQUE = 39.5;
const RAYON_LISERE = 36.5;

export function Cocarde() {
  return (
    <svg className="cocarde" viewBox="0 0 120 130" aria-hidden="true" focusable="false">
      <g className="cocarde__rubans">
        <path d="M 40 86 Q 30 104 16 128 L 28 120 L 38 129 Q 48 106 50 90 Z" />
        <path d="M 70 90 Q 72 106 82 129 L 92 120 L 104 128 Q 90 104 80 86 Z" />
      </g>
      <g className="cocarde__plis">
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
      <circle cx={CENTRE_X} cy={CENTRE_Y} r={RAYON_ANNEAU} className="cocarde__anneau" />
      <circle cx={CENTRE_X} cy={CENTRE_Y} r={RAYON_PLAQUE} className="cocarde__plaque" />
      <circle cx={CENTRE_X} cy={CENTRE_Y} r={RAYON_LISERE} className="cocarde__lisere" />
    </svg>
  );
}
