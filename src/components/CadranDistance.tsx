import { useRef, type CSSProperties, type PointerEvent } from 'react';
import { jouerClics } from '../plateforme/navigateur';
import { SON_DU_CADRAN, morceauxDuSon } from '../app/sons';

/* LE CLIC D'UN CRAN DE DISTANCE : « meme son que l'horloge » (2026-09-25),
   par la même file que le cadran de l'heure. */
const CLICS = morceauxDuSon(SON_DU_CADRAN);

/**
 * LE CADRAN D'UNE DISTANCE (2026-09-25, « Pour la distance, un rond sur le
 * meme principe que l'horloge où un tour complet est 1km, meme son que
 * l'horloge, si on fait plus d'un tour complet les lables évoluent
 * accordingly, il ne se passe rien si on est deja a zero et qu'on recule
 * encore ») : le cercle et les crans du cadran de l'heure, une boule qu'on
 * glisse ; UN TOUR VAUT UN KILOMÈTRE, vingt crans de 50 m, un clic par
 * cran ; les quatre repères disent le kilomètre du tour en cours (« 0 ·
 * 0,25 · 0,5 · 0,75 », puis « 1 · 1,25 · 1,5 · 1,75 » au second tour…) ;
 * sous zéro, la boule ne recule pas. La valeur est en kilomètres, sur des
 * crans de 0,05 ; l'appelant l'écrit et la convertit en mètres pour la
 * base.
 */
const RAYON = 40;
const CENTRE = 50;
const CRANS_PAR_TOUR = 20;
const PAS_KM = 1 / CRANS_PAR_TOUR;

/** L'angle depuis le haut, dans le sens des aiguilles, de la part de tour. */
function angleDe(km: number): number {
  const part = km - Math.floor(km + 1e-9);
  return part * 360;
}

export function CadranDistance({
  km,
  onKm,
  nom,
  ecrire,
}: {
  km: number;
  onKm: (km: number) => void;
  nom: string;
  /** Le nombre écrit pour qui écoute (« 5,25 km »), dans la langue. */
  ecrire: (km: number) => string;
}) {
  const cadran = useRef<SVGSVGElement>(null);
  /* Pendant un glissement : l'angle d'avant et les kilomètres NON ARRONDIS
     depuis le départ, pour compter les tours dans les deux sens. */
  const glisse = useRef<{ angle: number; km: number } | null>(null);
  const crans = Math.round(km / PAS_KM);
  const angle = angleDe(crans * PAS_KM);
  const rad = ((angle - 90) * Math.PI) / 180;
  const boule = { x: CENTRE + RAYON * Math.cos(rad), y: CENTRE + RAYON * Math.sin(rad) };
  const tour = Math.floor(crans / CRANS_PAR_TOUR);
  /* Les repères du tour en cours : le kilomètre du tour, puis ses quarts. */
  const reperes = [0, 0.25, 0.5, 0.75].map((q) => ecrire(tour + q));

  const PAS = 4;
  const segments = Math.ceil(angle / PAS);
  const point = (deg: number) => {
    const r = ((deg - 90) * Math.PI) / 180;
    return { x: CENTRE + RAYON * Math.cos(r), y: CENTRE + RAYON * Math.sin(r) };
  };
  const arc = Array.from({ length: segments }, (_, i) => {
    const p0 = point(i * PAS);
    const p1 = point(Math.min(angle, (i + 1) * PAS));
    return { d: `M ${p0.x} ${p0.y} A ${RAYON} ${RAYON} 0 0 1 ${p1.x} ${p1.y}`, part: segments === 1 ? 1 : i / (segments - 1) };
  });

  const angleSous = (e: PointerEvent): number => {
    const r = cadran.current!.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    return ((Math.atan2(y, x) * 180) / Math.PI + 90 + 360) % 360;
  };
  /* Poser des kilomètres bruts : jamais sous zéro, arrondis au cran ; un cran
     franchi clique. */
  const poser = (brut: number) => {
    const nouveaux = Math.max(0, Math.round(brut / PAS_KM));
    if (nouveaux !== crans) {
      jouerClics(CLICS, Math.min(Math.abs(nouveaux - crans), 3));
      onKm(nouveaux * PAS_KM);
    }
  };

  return (
    <svg
      ref={cadran}
      className="cadran"
      viewBox="0 0 100 100"
      role="slider"
      aria-label={nom}
      aria-valuetext={ecrire(km)}
      aria-valuemin={0}
      aria-valuenow={km}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        const a = angleSous(e);
        /* La boule saute sous le doigt, dans le tour où l'on est. */
        const brut = tour + a / 360;
        glisse.current = { angle: a, km: brut };
        poser(brut);
      }}
      onPointerMove={(e) => {
        if (!glisse.current) return;
        const a = angleSous(e);
        /* Le plus court chemin depuis l'angle d'avant : passer le haut du
           cadran fait un tour de plus ou de moins. */
        let delta = a - glisse.current.angle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        /* Sous zéro, rien ne bouge : les kilomètres bruts s'arrêtent à zéro. */
        const brut = Math.max(0, glisse.current.km + delta / 360);
        glisse.current = { angle: a, km: brut };
        poser(brut);
      }}
      onPointerUp={() => {
        glisse.current = null;
      }}
      onPointerCancel={() => {
        glisse.current = null;
      }}
    >
      <circle className="cadran__cercle" cx={CENTRE} cy={CENTRE} r={RAYON} />
      {Array.from({ length: CRANS_PAR_TOUR }, (_, i) => {
        const a = ((i * (360 / CRANS_PAR_TOUR) - 90) * Math.PI) / 180;
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
      {arc.map((s, i) => (
        <path key={i} className="cadran__arc" d={s.d} style={{ '--part': s.part } as CSSProperties} />
      ))}
      <circle className="cadran__boule" cx={boule.x} cy={boule.y} r={7} />
    </svg>
  );
}
