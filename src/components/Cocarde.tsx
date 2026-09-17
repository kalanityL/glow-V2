/**
 * LA COCARDE VIDE — la forme d'un badge sans badge (2026-09-17, « sous bonjour
 * mettre un placeholder de la meme forme qu'un badge (rond avec
 * collerette) »). La forme est celle du cadre des badges de la V1
 * (`versions/cartes/components/badge/BadgeFrame.tsx`) : une rosette de
 * seize plis régulièrement répartis, un anneau, une plaque, un liseré
 * pointillé — sans les rubans ni la bannière du palier, et sans dessin.
 * Centrée dans son carré de 120 ; la V1 la posait à 57 pour laisser la place
 * aux rubans.
 *
 * AUCUNE COULEUR ICI : chaque pièce porte une classe, `page.css` la peint aux
 * jetons du thème — c'est un emplacement, pas un badge, il ne porte aucun
 * métal. La taille est celle de l'endroit qui l'abrite.
 */

/** Les seize plis de la rosette, en degrés. */
const PLIS = Array.from({ length: 16 }, (_, i) => i * 22.5);

const CENTRE = 60;
const RAYON_PLIS = 47;
const RAYON_PLI = 6.5;

export function Cocarde() {
  return (
    <svg className="cocarde" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <g className="cocarde__plis">
        {PLIS.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <circle
              key={deg}
              cx={CENTRE + RAYON_PLIS * Math.cos(rad)}
              cy={CENTRE + RAYON_PLIS * Math.sin(rad)}
              r={RAYON_PLI}
            />
          );
        })}
      </g>
      <circle cx={CENTRE} cy={CENTRE} r="48" className="cocarde__anneau" />
      <circle cx={CENTRE} cy={CENTRE} r="46.5" className="cocarde__plaque" />
      <circle cx={CENTRE} cy={CENTRE} r="43.5" className="cocarde__lisere" />
    </svg>
  );
}
