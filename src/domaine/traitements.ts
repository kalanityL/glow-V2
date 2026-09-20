/**
 * LES TRAITEMENTS GLP-1, ET LEUR FORME.
 *
 * Une liste de faits : des noms de spécialités, la façon dont elles se
 * prennent, et LES PALIERS DE DOSE écrits sur leur boîte (2026-09-20, pour
 * le formulaire d'une prise — la V1 les proposait, `treatment.catalog.ts`).
 * Aucune cinétique, aucun conseil — l'application demande ce qu'on prend,
 * elle ne dit pas quoi prendre : les paliers sont ce que le formulaire
 * PROPOSE, et une autre dose se tape toujours.
 *
 * Les NOMS NE SE TRADUISENT PAS : ce sont des marques, elles s'écrivent pareil
 * dans toutes les langues. Ils vivent donc ici et non dans le dictionnaire. Les
 * mots qui les entourent — « Injection », « Comprimé » —, eux, s'y trouvent.
 *
 * Chaque forme finit par « Autre » : la liste des spécialités bouge plus vite
 * qu'une application, et il faut pouvoir répondre quand la sienne n'y est pas.
 */

export const FORMES = ['injection', 'comprime'] as const;

export type Forme = (typeof FORMES)[number];

export interface Traitement {
  id: string;
  /** Le nom de la spécialité, tel qu'il est écrit sur la boîte. */
  nom: string;
  forme: Forme;
  /** Les paliers de dose de la spécialité, en milligrammes, du premier au
      dernier : le premier est proposé d'avance, « Autre » a ceux du
      sémaglutide injectable. */
  paliersMg: readonly number[];
}

const PALIERS_SEMAGLUTIDE = [0.25, 0.5, 1, 1.7, 2, 2.4] as const;
const PALIERS_TIRZEPATIDE = [2.5, 5, 7.5, 10, 12.5, 15] as const;
const PALIERS_LIRAGLUTIDE = [0.6, 1.2, 1.8, 2.4, 3] as const;
const PALIERS_SEMAGLUTIDE_ORAL = [3, 7, 14] as const;

export const TRAITEMENTS: readonly Traitement[] = [
  { id: 'ozempic', nom: 'Ozempic', forme: 'injection', paliersMg: PALIERS_SEMAGLUTIDE },
  { id: 'wegovy-injection', nom: 'Wegovy', forme: 'injection', paliersMg: PALIERS_SEMAGLUTIDE },
  { id: 'mounjaro', nom: 'Mounjaro', forme: 'injection', paliersMg: PALIERS_TIRZEPATIDE },
  { id: 'zepbound', nom: 'Zepbound', forme: 'injection', paliersMg: PALIERS_TIRZEPATIDE },
  { id: 'saxenda', nom: 'Saxenda', forme: 'injection', paliersMg: PALIERS_LIRAGLUTIDE },
  { id: 'victoza', nom: 'Victoza', forme: 'injection', paliersMg: PALIERS_LIRAGLUTIDE },
  { id: 'trulicity', nom: 'Trulicity', forme: 'injection', paliersMg: [0.75, 1.5, 3, 4.5] },
  { id: 'retatrutide', nom: 'Rétatrutide', forme: 'injection', paliersMg: [1, 2, 4, 8, 12] },
  { id: 'autre-injection', nom: 'Autre', forme: 'injection', paliersMg: [0.25, 0.5, 1, 1.7, 2.4] },
  { id: 'rybelsus', nom: 'Rybelsus', forme: 'comprime', paliersMg: PALIERS_SEMAGLUTIDE_ORAL },
  { id: 'wegovy-oral', nom: 'Wegovy', forme: 'comprime', paliersMg: PALIERS_SEMAGLUTIDE_ORAL },
  { id: 'foundayo', nom: 'Foundayo', forme: 'comprime', paliersMg: [1, 3, 10, 36, 45] },
  { id: 'autre-comprime', nom: 'Autre', forme: 'comprime', paliersMg: PALIERS_SEMAGLUTIDE_ORAL },
];

/** Ceux qui se prennent de cette façon-là, dans l'ordre de la liste. */
export function traitementsDeLaForme(forme: Forme): Traitement[] {
  return TRAITEMENTS.filter((traitement) => traitement.forme === forme);
}
