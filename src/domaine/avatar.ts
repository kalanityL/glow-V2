/**
 * L'AVATAR — le modèle repris de GLOW V1 (2026-09-08).
 *
 * Le dessin et ses réglages viennent de `versions/cartes/components/
 * AvatarCreator.tsx` de l'ancien dépôt : mêmes traits, mêmes tables de
 * couleurs, même façon de composer un visage. Ce qui change ici : les valeurs
 * ne portent plus de classes Tailwind, et LES NOMS DES COULEURS SONT DANS LE
 * DICTIONNAIRE — « Blond », « Noisette » se traduisent, les codes hexadécimaux
 * non.
 *
 * LES TABLES DE COULEURS CI-DESSOUS SONT DES DONNÉES, pas du style : ce que la
 * personne choisit sera enregistré avec son profil. C'est pour cela qu'elles
 * sont ici, en code, et non dans une feuille — l'exception consignée dans la
 * V1 (« nuancier de l'avatar — des données enregistrées »). Les couleurs du
 * dessin lui-même (pupille, bouche, vêtement…) sont, elles, dans
 * `themes/dessins.css`.
 *
 * LE GENRE FAIT PARTIE DE L'AVATAR, et n'est plus une question à part
 * (demande du 2026-09-08) : il choisit la couleur du vêtement et la coiffure de
 * départ, c'est-à-dire qu'il se VOIT. Le demander deux fois — une fois en
 * dessin, une fois en liste — n'avait pas de sens.
 */

export const GENRES = ['femme', 'homme', 'neutre'] as const;
export type Genre = (typeof GENRES)[number];

export const FORMES_VISAGE = ['ovale', 'rond', 'carre', 'coeur'] as const;
export type FormeVisage = (typeof FORMES_VISAGE)[number];

export const COIFFURES = ['court', 'long', 'boucle', 'frange', 'brosse', 'chauve'] as const;
export type Coiffure = (typeof COIFFURES)[number];

export const EXPRESSIONS = ['joyeuse', 'determinee', 'fiere', 'calme'] as const;
export type Expression = (typeof EXPRESSIONS)[number];

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

/** La coiffure que le genre amène avec lui, tant qu'on n'en a pas choisi une. */
export const COIFFURE_DU_GENRE: Record<Genre, Coiffure> = {
  homme: 'court',
  femme: 'long',
  neutre: 'boucle',
};

export interface Avatar {
  genre: Genre;
  formeVisage: FormeVisage;
  couleurPeau: string;
  couleurYeux: string;
  coiffure: Coiffure;
  couleurCheveux: string;
  lunettes: boolean;
  expression: Expression;
}

/** L'avatar de départ : celui qu'on voit avant d'avoir touché à quoi que ce soit. */
export const AVATAR_INITIAL: Avatar = {
  /* Femme aux cheveux longs par défaut (2026-09-20, « avatar par defaut :
     cheveux long femme ») — neutre et bouclé jusque-là. */
  genre: 'femme',
  formeVisage: 'ovale',
  couleurPeau: COULEURS_PEAU[1],
  couleurYeux: COULEURS_YEUX[0],
  coiffure: COIFFURE_DU_GENRE.femme,
  couleurCheveux: COULEURS_CHEVEUX[1],
  lunettes: false,
  expression: 'joyeuse',
};
