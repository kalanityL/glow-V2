import { useRef, type PointerEvent } from 'react';
import { MINUTES_RONDES } from '../domaine/prises';

/**
 * LE CADRAN D'UNE HEURE (2026-09-21, « au dessus de chaque heure en chiffre
 * on va mettre un cercle d'horloge avec 12 / 3 / 6 / 9 d'étiquetés et une
 * petite boule sur le cercle positionnée à l'heure indiquée en dessous. On
 * peut faire glisser la boule sur le cercle pour modifier l'heure.
 * Synchronisation totale […] Pour les heures en 0-24, passer par 12 et
 * continuer fait passer aux heures > 12 et les étiquettes passent en 12 15
 * 18 21 ») : un cercle, quatre repères, une boule à l'angle de l'heure —
 * la même valeur `HH:MM` que le chiffre dessous, dans les deux sens. La
 * boule se glisse ; passer le haut du cadran fait basculer la moitié du
 * jour, et les repères le disent. Les minutes retombent sur les minutes
 * rondes, celles que la roue propose.
 */
const RAYON = 40;
const CENTRE = 50;
const MINUTES_PAR_TOUR = 12 * 60;
const MINUTES_PAR_JOUR = 24 * 60;

function minutesDe(valeur: string): number {
  const m = /^(\d{2}):(\d{2})$/.exec(valeur);
  return m ? Number(m[1]) * 60 + Number(m[2]) : 0;
}

function valeurDe(minutes: number): string {
  const total = ((minutes % MINUTES_PAR_JOUR) + MINUTES_PAR_JOUR) % MINUTES_PAR_JOUR;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** L'angle depuis le haut, dans le sens des aiguilles, en degrés. */
function angleDe(minutes: number): number {
  return ((minutes % MINUTES_PAR_TOUR) / MINUTES_PAR_TOUR) * 360;
}

/** Les minutes ramenées sur une minute ronde de leur heure. */
function surMinuteRonde(minutes: number): number {
  const heure = Math.floor(minutes / 60);
  const reste = minutes % 60;
  let proche: number = MINUTES_RONDES[0];
  for (const m of MINUTES_RONDES) if (Math.abs(m - reste) < Math.abs(proche - reste)) proche = m;
  /* Au-delà de 50, l'heure suivante est plus proche. */
  if (reste - proche > 5 && 60 - reste <= 5) return (heure + 1) * 60;
  return heure * 60 + proche;
}

export function CadranHeure({ valeur, onValeur, nom }: { valeur: string; onValeur: (heure: string) => void; nom: string }) {
  const cadran = useRef<SVGSVGElement>(null);
  const glisse = useRef<{ angle: number; minutes: number } | null>(null);
  const minutes = minutesDe(valeur);
  const apresMidi = minutes >= MINUTES_PAR_TOUR;
  const angle = angleDe(minutes);
  const rad = ((angle - 90) * Math.PI) / 180;
  const boule = { x: CENTRE + RAYON * Math.cos(rad), y: CENTRE + RAYON * Math.sin(rad) };
  const reperes = apresMidi ? ['12', '15', '18', '21'] : ['12', '3', '6', '9'];

  const angleSous = (e: PointerEvent): number => {
    const r = cadran.current!.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    return ((Math.atan2(y, x) * 180) / Math.PI + 90 + 360) % 360;
  };

  return (
    <svg
      ref={cadran}
      className="cadran"
      viewBox="0 0 100 100"
      role="slider"
      aria-label={nom}
      aria-valuetext={valeur}
      aria-valuemin={0}
      aria-valuemax={MINUTES_PAR_JOUR - 1}
      aria-valuenow={minutes}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        const a = angleSous(e);
        /* La boule saute sous le doigt, dans la moitié du jour où l'on est. */
        const nouvelles = surMinuteRonde((apresMidi ? MINUTES_PAR_TOUR : 0) + (a / 360) * MINUTES_PAR_TOUR);
        glisse.current = { angle: a, minutes: nouvelles };
        if (nouvelles !== minutes) onValeur(valeurDe(nouvelles));
      }}
      onPointerMove={(e) => {
        if (!glisse.current) return;
        const a = angleSous(e);
        /* Le plus court chemin depuis l'angle d'avant : c'est ce qui fait
           passer minuit et midi, dans un sens comme dans l'autre. */
        let delta = a - glisse.current.angle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        const brutes = glisse.current.minutes + (delta / 360) * MINUTES_PAR_TOUR;
        const enroulees = ((brutes % MINUTES_PAR_JOUR) + MINUTES_PAR_JOUR) % MINUTES_PAR_JOUR;
        glisse.current = { angle: a, minutes: enroulees };
        const rondes = surMinuteRonde(enroulees) % MINUTES_PAR_JOUR;
        if (rondes !== minutes) onValeur(valeurDe(rondes));
      }}
      onPointerUp={() => {
        glisse.current = null;
      }}
      onPointerCancel={() => {
        glisse.current = null;
      }}
    >
      <circle className="cadran__cercle" cx={CENTRE} cy={CENTRE} r={RAYON} />
      {/* LES CRANS D'UNE MONTRE (2026-09-21, « fait apparaitre les crans
          comme sur une montre à cadran ») : soixante, un par minute, les
          douze des heures plus longs. */}
      {Array.from({ length: 60 }, (_, i) => {
        const a = ((i * 6 - 90) * Math.PI) / 180;
        const longueur = i % 5 === 0 ? 5 : 2.5;
        return (
          <line
            key={i}
            className={`cadran__cran${i % 5 === 0 ? ' cadran__cran--heure' : ''}`}
            x1={CENTRE + (RAYON - 1) * Math.cos(a)}
            y1={CENTRE + (RAYON - 1) * Math.sin(a)}
            x2={CENTRE + (RAYON - 1 - longueur) * Math.cos(a)}
            y2={CENTRE + (RAYON - 1 - longueur) * Math.sin(a)}
          />
        );
      })}
      <text className="cadran__repere" x={CENTRE} y={CENTRE - RAYON + 15} textAnchor="middle">
        {reperes[0]}
      </text>
      <text className="cadran__repere" x={CENTRE + RAYON - 9} y={CENTRE + 3.5} textAnchor="end">
        {reperes[1]}
      </text>
      <text className="cadran__repere" x={CENTRE} y={CENTRE + RAYON - 9} textAnchor="middle">
        {reperes[2]}
      </text>
      <text className="cadran__repere" x={CENTRE - RAYON + 9} y={CENTRE + 3.5} textAnchor="start">
        {reperes[3]}
      </text>
      <circle className="cadran__boule" cx={boule.x} cy={boule.y} r={6.5} />
    </svg>
  );
}
