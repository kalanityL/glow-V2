/**
 * L'AVATAR — le modèle du prototype modulaire (2026-09-21).
 *
 * Jusqu'ici, le dessin et ses réglages venaient de la V1 (`AvatarCreator`,
 * repris le 2026-09-08). Le 2026-09-21, elle a livré un PROTOTYPE MODULAIRE
 * (`~/Desktop/GLOW/avatars/avatar_prototype_svg/`, « mettre à jour notre
 * fonctionnalité d'avatar ») : un canevas de 500 × 600, huit couches — le
 * corps, le visage, les yeux, les sourcils, le nez, la bouche, la coiffure,
 * le vêtement —, chaque couche en plusieurs formes. C'est lui, désormais.
 * Les tracés sont dans `components/avatarTraces.ts` ; ici, ce qui se CHOISIT.
 *
 * LA FORME ET LA TEINTE SONT SÉPARÉES. Le prototype les mêle dans ses noms de
 * fichiers (« face_oval_skin1 », « eyes_almond_brown », « hair_bob_2 » : les
 * trois carrés n'ont qu'un seul tracé, en trois couleurs). Ici, la forme vient
 * du fichier et la couleur du nuancier — celui qui existait déjà pour la peau,
 * les yeux et les cheveux, et deux teintes de vêtement relevées dans le
 * prototype. Hypothèse dite, à trancher par elle.
 *
 * LES TABLES DE COULEURS CI-DESSOUS SONT DES DONNÉES, pas du style : ce que la
 * personne choisit est enregistré avec son profil. C'est pour cela qu'elles
 * sont ici, en code, et non dans une feuille — l'exception consignée dans la
 * V1 (« nuancier de l'avatar — des données enregistrées »). Les couleurs du
 * dessin lui-même (le contour, le blanc de l'œil, la pupille, les lèvres) sont
 * dans `themes/dessins.css`.
 *
 * LE GENRE FAIT PARTIE DE L'AVATAR, et n'est pas une question à part (demande
 * du 2026-09-08) : il choisit la coiffure et le vêtement de départ, c'est-à-dire
 * qu'il se VOIT. Le demander deux fois — une fois en dessin, une fois en liste
 * — n'avait pas de sens.
 *
 * CE QUE LE PROTOTYPE N'A PAS N'EST PLUS À L'ÉCRAN : les lunettes, les
 * expressions, le visage en cœur, la frange, la brosse, l'absence de cheveux.
 * La base de la V1 les connaît encore (`donnees/conversions.ts` les écrit à
 * leur valeur neutre) ; on ne les invente pas en dessin.
 */

export const GENRES = ['femme', 'homme', 'neutre'] as const;
export type Genre = (typeof GENRES)[number];

export const FORMES_VISAGE = ['ovale', 'rond', 'carre'] as const;
export type FormeVisage = (typeof FORMES_VISAGE)[number];

/** « amande », « rond », « tombant » : almond, round, hooded du prototype. */
export const FORMES_YEUX = ['amande', 'rond', 'tombant'] as const;
export type FormeYeux = (typeof FORMES_YEUX)[number];

/** « droit », « retroussé », « large » : straight, button, wide. */
export const NEZ = ['droit', 'retrousse', 'large'] as const;
export type Nez = (typeof NEZ)[number];

/** « neutre », « sourire », « pulpeuse » : neutral, smile, full. */
export const BOUCHES = ['neutre', 'sourire', 'pulpeuse'] as const;
export type Bouche = (typeof BOUCHES)[number];

/** « carré », « court », « bouclé » : bob, short, curly. Un seul tracé par
    coiffure — les « 1, 2, 3 » du prototype sont trois couleurs, pas trois
    formes, et la couleur est un réglage à part. */
export const COIFFURES = ['carre', 'court', 'boucle'] as const;
export type Coiffure = (typeof COIFFURES)[number];

/** « t-shirt », « sweat à capuche » : tshirt, hoodie. Même chose : un tracé
    chacun, la couleur à part. */
export const VETEMENTS = ['tshirt', 'capuche'] as const;
export type Vetement = (typeof VETEMENTS)[number];

/** Les teintes de peau, dans l'ordre des tables de la V1. */
export const COULEURS_PEAU = [
  '#FFE5D9',
  '#F7D1BA',
  '#E8AC80',
  '#B57E58',
  '#724A30',
  '#43291F',
] as const;

export const COULEURS_YEUX = ['#4682B4', '#2E8B57', '#CD853F', '#5C3A21', '#708090'] as const;

export const COULEURS_CHEVEUX = [
  '#E9C46A',
  '#4E3629',
  '#8D5B4C',
  '#1A1A1A',
  '#E76F51',
  '#DFE2E6',
] as const;

/** Les deux teintes de vêtement du prototype, relevées telles quelles :
    le crème de `shirt_tshirt_1` et le marine de `shirt_tshirt_2`. */
export const COULEURS_VETEMENT = ['#F7F4EE', '#244B73'] as const;

export interface Avatar {
  genre: Genre;
  formeVisage: FormeVisage;
  formeYeux: FormeYeux;
  nez: Nez;
  bouche: Bouche;
  coiffure: Coiffure;
  vetement: Vetement;
  couleurPeau: string;
  couleurYeux: string;
  couleurCheveux: string;
  couleurVetement: string;
}

/** Ce que le genre amène avec lui, tant qu'on n'a pas choisi autrement : la
    coiffure (femme aux cheveux longs par défaut, 2026-09-20 — le carré est la
    coiffure longue du prototype) et le vêtement. Hypothèse dite. */
export const DEPART_DU_GENRE: Record<Genre, Pick<Avatar, 'coiffure' | 'vetement' | 'couleurVetement'>> = {
  femme: { coiffure: 'carre', vetement: 'tshirt', couleurVetement: COULEURS_VETEMENT[0] },
  homme: { coiffure: 'court', vetement: 'capuche', couleurVetement: COULEURS_VETEMENT[1] },
  neutre: { coiffure: 'boucle', vetement: 'tshirt', couleurVetement: COULEURS_VETEMENT[1] },
};

/** L'avatar de départ : celui qu'on voit avant d'avoir touché à quoi que ce
    soit. Les formes sont celles que le prototype ouvre (visage ovale, yeux en
    amande, nez droit, sourire). */
export const AVATAR_INITIAL: Avatar = {
  /* Femme aux cheveux longs par défaut (2026-09-20, « avatar par defaut :
     cheveux long femme ») — neutre et bouclé jusque-là. */
  genre: 'femme',
  formeVisage: 'ovale',
  formeYeux: 'amande',
  nez: 'droit',
  bouche: 'sourire',
  ...DEPART_DU_GENRE.femme,
  couleurPeau: COULEURS_PEAU[1],
  couleurYeux: COULEURS_YEUX[0],
  couleurCheveux: COULEURS_CHEVEUX[1],
};

function parmi<T extends string>(valeurs: readonly T[], valeur: unknown, defaut: T): T {
  return (valeurs as readonly string[]).includes(valeur as string) ? (valeur as T) : defaut;
}

function couleur(valeur: unknown, defaut: string): string {
  return typeof valeur === 'string' && /^#[0-9A-Fa-f]{6}$/.test(valeur) ? valeur : defaut;
}

/**
 * UN AVATAR RELU DEPUIS N'IMPORTE QUOI — un enregistrement d'avant le
 * prototype, un champ abîmé : chaque réglage est gardé s'il est un des
 * réglages connus, remplacé par celui de `defaut` sinon. Un avatar de l'ancien
 * modèle (« coeur », « frange », `expression`, `lunettes`) se relit ainsi sans
 * rien casser : ce qui n'existe plus tombe, le reste tient.
 */
export function avatarDepuisInconnu(source: unknown, defaut: Avatar): Avatar {
  const s = (typeof source === 'object' && source !== null ? source : {}) as Record<string, unknown>;
  return {
    genre: parmi(GENRES, s.genre, defaut.genre),
    formeVisage: parmi(FORMES_VISAGE, s.formeVisage, defaut.formeVisage),
    formeYeux: parmi(FORMES_YEUX, s.formeYeux, defaut.formeYeux),
    nez: parmi(NEZ, s.nez, defaut.nez),
    bouche: parmi(BOUCHES, s.bouche, defaut.bouche),
    coiffure: parmi(COIFFURES, s.coiffure, defaut.coiffure),
    vetement: parmi(VETEMENTS, s.vetement, defaut.vetement),
    couleurPeau: couleur(s.couleurPeau, defaut.couleurPeau),
    couleurYeux: couleur(s.couleurYeux, defaut.couleurYeux),
    couleurCheveux: couleur(s.couleurCheveux, defaut.couleurCheveux),
    couleurVetement: couleur(s.couleurVetement, defaut.couleurVetement),
  };
}
