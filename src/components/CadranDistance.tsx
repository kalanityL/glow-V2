import { useRef, type CSSProperties, type PointerEvent } from 'react';
import { jouerClics } from '../plateforme/navigateur';
import { SON_DU_CADRAN, morceauxDuSon } from '../app/sons';

/* LE CLIC D'UN CRAN DE DISTANCE : « meme son que l'horloge » (2026-09-25),
   par la même file que le cadran de l'heure. */
const CLICS = morceauxDuSon(SON_DU_CADRAN);

/**
 * LA PISTE D'UNE DISTANCE (2026-09-25, « Pour la distance, un rond sur le
 * meme principe que l'horloge où un tour complet est 1km, meme son que
 * l'horloge, si on fait plus d'un tour complet les lables évoluent
 * accordingly, il ne se passe rien si on est deja a zero et qu'on recule
 * encore » — puis, son image : « à la place de l'horloge (garde le meme
 * design mais mets cette forme à la place). on peut faire circuler le
 * point en suivant le rectangle ou en faisant des cercles ça doit marcher
 * aussi ») : une PISTE — deux droites et deux demi-cercles —, les crans et
 * la boule du cadran de l'heure, le tracé en dégradé du départ à la boule ;
 * UN TOUR VAUT UN KILOMÈTRE, vingt crans de 50 m, un clic par cran ; les
 * quatre repères disent la distance au quart, à la moitié, aux trois
 * quarts et au bout du tour en cours (« 0,25 km · 0,5 km · 0,75 km ·
 * 1 km », puis « 1,25 km … 2 km » au second tour) ; sous zéro, la boule
 * ne recule pas. LE DOIGT PEUT SUIVRE LA PISTE OU TOURNER EN ROND : la
 * boule va au point de la piste le plus proche du doigt, et le plus court
 * chemin le long de la piste depuis le point d'avant fait les tours dans
 * les deux sens. La valeur est en kilomètres, sur des crans de 0,05 ;
 * l'appelant l'écrit et la convertit en mètres pour la base.
 */
const LARGEUR = 280;
const HAUTEUR = 110;
const RAYON = 32;
const DROITE = 100;
const GAUCHE = { x: 90, y: 55 };
const DROIT = { x: 190, y: 55 };
const HAUT = GAUCHE.y - RAYON;
const BAS = GAUCHE.y + RAYON;
const DEMI_TOUR = Math.PI * RAYON;
/** Le tour entier de la piste, en unités de la fenêtre. */
const PERIMETRE = 2 * DROITE + 2 * DEMI_TOUR;
const CRANS_PAR_TOUR = 20;
const PAS_KM = 1 / CRANS_PAR_TOUR;
const DEPART = { x: (GAUCHE.x + DROIT.x) / 2, y: HAUT };

/** Le point de la piste à la distance `s` du départ (le haut, au milieu),
    dans le sens des aiguilles, et la normale qui rentre dans la piste. */
function surLaPiste(s: number): { x: number; y: number; nx: number; ny: number } {
  let d = ((s % PERIMETRE) + PERIMETRE) % PERIMETRE;
  if (d < DROITE / 2) return { x: DEPART.x + d, y: HAUT, nx: 0, ny: 1 };
  d -= DROITE / 2;
  if (d < DEMI_TOUR) {
    const a = -Math.PI / 2 + d / RAYON;
    return { x: DROIT.x + RAYON * Math.cos(a), y: DROIT.y + RAYON * Math.sin(a), nx: -Math.cos(a), ny: -Math.sin(a) };
  }
  d -= DEMI_TOUR;
  if (d < DROITE) return { x: DROIT.x - d, y: BAS, nx: 0, ny: -1 };
  d -= DROITE;
  if (d < DEMI_TOUR) {
    const a = Math.PI / 2 + d / RAYON;
    return { x: GAUCHE.x + RAYON * Math.cos(a), y: GAUCHE.y + RAYON * Math.sin(a), nx: -Math.cos(a), ny: -Math.sin(a) };
  }
  d -= DEMI_TOUR;
  return { x: GAUCHE.x + d, y: HAUT, nx: 0, ny: 1 };
}

/** La piste échantillonnée, pour trouver le point le plus proche du doigt. */
const ECHANTILLONS = Array.from({ length: 240 }, (_, i) => {
  const s = (i / 240) * PERIMETRE;
  const p = surLaPiste(s);
  return { s, x: p.x, y: p.y };
});

/** Un morceau du tracé entre deux distances, en petits segments droits. */
function trace(s0: number, s1: number): string {
  const n = Math.max(1, Math.ceil((s1 - s0) / 3));
  const p0 = surLaPiste(s0);
  let d = `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`;
  for (let i = 1; i <= n; i++) {
    const p = surLaPiste(s0 + ((s1 - s0) * i) / n);
    d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }
  return d;
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
  /** Le nombre écrit, dans la langue (« 5,25 ») ; le composant y ajoute l'unité. */
  ecrire: (km: number) => string;
  }) {
  const piste = useRef<SVGSVGElement>(null);
  /* Pendant un glissement : la distance sur la piste d'avant et les
     kilomètres NON ARRONDIS depuis le départ, pour compter les tours. */
  const glisse = useRef<{ s: number; km: number } | null>(null);
  const crans = Math.round(km / PAS_KM);
  const part = crans * PAS_KM - Math.floor(crans * PAS_KM + 1e-9);
  const sBoule = part * PERIMETRE;
  const boule = surLaPiste(sBoule);
  const tour = Math.floor(crans / CRANS_PAR_TOUR);
  /* Les repères : la distance au quart, à la moitié, aux trois quarts, au
     bout du tour en cours. */
  const reperes = [0.25, 0.5, 0.75, 1].map((q) => ecrire(tour + q));

  const PAS = 5;
  const segments = Math.ceil(sBoule / PAS);
  const arc = Array.from({ length: segments }, (_, i) => ({
    d: trace(i * PAS, Math.min(sBoule, (i + 1) * PAS)),
    part: segments === 1 ? 1 : i / (segments - 1),
  }));

  /* La distance sur la piste du point le plus proche du doigt. */
  const sSous = (e: PointerEvent): number => {
    const r = piste.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) * LARGEUR) / r.width;
    const y = ((e.clientY - r.top) * HAUTEUR) / r.height;
    let meilleur = ECHANTILLONS[0];
    let dist = Infinity;
    for (const p of ECHANTILLONS) {
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < dist) {
        dist = d;
        meilleur = p;
      }
    }
    return meilleur.s;
  };
  /* Poser des kilomètres bruts : jamais sous zéro, arrondis au cran ; un cran
     franchi clique (trois au plus d'un coup). */
  const poser = (brut: number) => {
    const nouveaux = Math.max(0, Math.round(brut / PAS_KM));
    if (nouveaux !== crans) {
      jouerClics(CLICS, Math.min(Math.abs(nouveaux - crans), 3));
      onKm(nouveaux * PAS_KM);
    }
  };

  return (
    <svg
      ref={piste}
      className="cadran cadran--piste"
      viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
      role="slider"
      aria-label={nom}
      aria-valuetext={ecrire(km)}
      aria-valuemin={0}
      aria-valuenow={km}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        const s = sSous(e);
        /* La boule saute sous le doigt, dans le tour où l'on est. */
        const brut = tour + s / PERIMETRE;
        glisse.current = { s, km: brut };
        poser(brut);
      }}
      onPointerMove={(e) => {
        if (!glisse.current) return;
        const s = sSous(e);
        /* Le plus court chemin le long de la piste depuis le point d'avant :
           passer le départ fait un tour de plus ou de moins. */
        let delta = s - glisse.current.s;
        if (delta > PERIMETRE / 2) delta -= PERIMETRE;
        if (delta < -PERIMETRE / 2) delta += PERIMETRE;
        /* Sous zéro, rien ne bouge. */
        const brut = Math.max(0, glisse.current.km + delta / PERIMETRE);
        glisse.current = { s, km: brut };
        poser(brut);
      }}
      onPointerUp={() => {
        glisse.current = null;
      }}
      onPointerCancel={() => {
        glisse.current = null;
      }}
    >
      <path className="cadran__cercle" d={`${trace(0, PERIMETRE)} Z`} />
      {/* Les crans, vingt par tour, les quatre des quarts plus longs. */}
      {Array.from({ length: CRANS_PAR_TOUR }, (_, i) => {
        const p = surLaPiste((i / CRANS_PAR_TOUR) * PERIMETRE);
        const longueur = i % 5 === 0 ? 5 : 2.5;
        return (
          <line
            key={i}
            className={`cadran__cran${i % 5 === 0 ? ' cadran__cran--heure' : ''}`}
            x1={p.x + p.nx}
            y1={p.y + p.ny}
            x2={p.x + p.nx * (1 + longueur)}
            y2={p.y + p.ny * (1 + longueur)}
          />
        );
      })}
      <text className="cadran__repere" x={DROIT.x + RAYON + 5} y={DROIT.y + 3.5} textAnchor="start">
        {reperes[0]}
      </text>
      <text className="cadran__repere" x={DEPART.x} y={BAS + 13} textAnchor="middle">
        {reperes[1]}
      </text>
      <text className="cadran__repere" x={GAUCHE.x - RAYON - 5} y={GAUCHE.y + 3.5} textAnchor="end">
        {reperes[2]}
      </text>
      <text className="cadran__repere" x={DEPART.x} y={HAUT - 8} textAnchor="middle">
        {reperes[3]}
      </text>
      {arc.map((s, i) => (
        <path key={i} className="cadran__arc" d={s.d} style={{ '--part': s.part } as CSSProperties} />
      ))}
      <circle className="cadran__boule" cx={boule.x} cy={boule.y} r={7} />
    </svg>
  );
}
