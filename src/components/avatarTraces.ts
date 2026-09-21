import type { Bouche, Coiffure, FormeVisage, FormeYeux, Nez, Vetement } from '../domaine/avatar';

/**
 * LES TRACÉS DE L'AVATAR — recopiés du prototype modulaire du 2026-09-21
 * (`~/Desktop/GLOW/avatars/avatar_prototype_svg/`, un fichier SVG par
 * couche et par forme, tous sur le même canevas de 500 × 600).
 *
 * NE PAS LES « ARRONDIR » ni les déplacer : ce sont eux qui font le visage,
 * et une coordonnée déplacée décale un œil ou creuse une joue. Les couleurs
 * ne sont pas ici : ce que la personne choisit arrive par l'avatar, ce qui
 * tient du dessin est dans `themes/dessins.css`.
 *
 * L'ORDRE DES COUCHES est celui du manifeste (`layer_order`) : le corps, le
 * visage, les yeux, les sourcils, le nez, la bouche, la coiffure, le vêtement
 * — le vêtement couvre le corps, la coiffure couvre le haut du visage.
 */

export const CANEVAS_AVATAR = '0 0 500 600';

/** `body_neutral.svg` — le cou et les épaules, sous le vêtement. */
export const TRACE_CORPS = 'M135 600 L150 420 Q250 390 350 420 L365 600 Z';

/** `face_*.svg`. */
export const TRACE_VISAGE: Record<FormeVisage, string> = {
  ovale: 'M250 85 C180 85 145 140 150 235 C155 320 195 365 250 365 C305 365 345 320 350 235 C355 140 320 85 250 85 Z',
  rond: 'M250 85 C175 85 140 145 145 225 C150 305 195 355 250 355 C305 355 350 305 355 225 C360 145 325 85 250 85 Z',
  carre: 'M175 105 L325 105 L345 235 C340 315 300 360 250 360 C200 360 160 315 155 235 Z',
};

/** `eyes_*.svg` — le blanc de chaque œil ; l'iris et la pupille sont les
    mêmes cercles quelle que soit la forme. */
export const TRACE_YEUX: Record<FormeYeux, { gauche: string; droit: string }> = {
  amande: {
    gauche: 'M185 195 Q215 170 240 195 Q215 220 185 195',
    droit: 'M260 195 Q285 170 315 195 Q285 220 260 195',
  },
  rond: {
    gauche: 'M185 195 a27 27 0 1 0 54 0 a27 27 0 1 0 -54 0',
    droit: 'M261 195 a27 27 0 1 0 54 0 a27 27 0 1 0 -54 0',
  },
  tombant: {
    gauche: 'M182 202 Q212 170 240 195 Q215 214 182 202',
    droit: 'M260 195 Q288 170 318 202 Q285 214 260 195',
  },
};

export const IRIS = [
  { cx: 213, cy: 195 },
  { cx: 287, cy: 195 },
] as const;
export const RAYON_IRIS = 10;
export const RAYON_PUPILLE = 4;

/** `eyebrows_default.svg` — une seule paire de sourcils dans le prototype. */
export const TRACE_SOURCILS = ['M180 160 Q212 142 240 158', 'M260 158 Q288 142 320 160'] as const;

/** `nose_*.svg`. */
export const TRACE_NEZ: Record<Nez, string> = {
  droit: 'M250 205 Q242 245 250 260 Q258 245 250 205',
  retrousse: 'M250 215 Q232 258 250 265 Q268 258 250 215',
  large: 'M250 205 Q230 250 225 260 Q250 275 275 260 Q270 250 250 205',
};

/** `mouth_*.svg` — la bouche neutre est un trait, les deux autres des
    lèvres pleines (leur couleur est dans la feuille des dessins). */
export const TRACE_BOUCHE: Record<Bouche, string> = {
  neutre: 'M225 295 Q250 300 275 295',
  sourire: 'M215 292 Q250 330 285 292 Q250 315 215 292',
  pulpeuse: 'M218 295 Q250 275 282 295 Q250 330 218 295',
};

/** `hair_*.svg` — un tracé par coiffure ; le prototype le donnait en trois
    couleurs (« _1 », « _2 », « _3 »), la couleur est un réglage à part. */
export const TRACE_COIFFURE: Record<Coiffure, string> = {
  carre: 'M145 205 Q125 70 250 55 Q375 70 355 205 L330 270 Q310 180 250 175 Q190 180 170 270 Z',
  court: 'M150 175 Q145 65 250 55 Q355 65 350 175 Q320 120 250 125 Q180 120 150 175 Z',
  boucle:
    'M135 190 Q125 70 185 55 Q220 25 250 55 Q280 25 315 55 Q375 70 365 190 Q335 135 300 155 Q275 105 250 155 Q225 105 200 155 Q165 135 135 190 Z',
};

/** `shirt_*.svg` — le vêtement, et pour le sweat le pan de la capuche
    par-dessus, à peine translucide (`opacity=".82"` dans le prototype, une
    classe ici). */
export const TRACE_VETEMENT: Record<Vetement, { corps: string; capuche?: string }> = {
  tshirt: { corps: 'M125 600 L145 420 L205 385 L250 410 L295 385 L355 420 L375 600 Z' },
  capuche: {
    corps: 'M115 600 L135 420 L195 380 L250 420 L305 380 L365 420 L385 600 Z',
    capuche: 'M205 385 L250 430 L295 385 L300 600 L200 600 Z',
  },
};
