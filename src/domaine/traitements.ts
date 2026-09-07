/**
 * LES TRAITEMENTS GLP-1, ET LEUR FORME.
 *
 * Une liste de faits : des noms de spécialités et la façon dont elles se
 * prennent. Aucune posologie, aucune cinétique, aucun conseil — l'application
 * demande ce qu'on prend, elle ne dit pas quoi prendre.
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
}

export const TRAITEMENTS: readonly Traitement[] = [
  { id: 'ozempic', nom: 'Ozempic', forme: 'injection' },
  { id: 'wegovy-injection', nom: 'Wegovy', forme: 'injection' },
  { id: 'mounjaro', nom: 'Mounjaro', forme: 'injection' },
  { id: 'zepbound', nom: 'Zepbound', forme: 'injection' },
  { id: 'saxenda', nom: 'Saxenda', forme: 'injection' },
  { id: 'victoza', nom: 'Victoza', forme: 'injection' },
  { id: 'trulicity', nom: 'Trulicity', forme: 'injection' },
  { id: 'retatrutide', nom: 'Rétatrutide', forme: 'injection' },
  { id: 'autre-injection', nom: 'Autre', forme: 'injection' },
  { id: 'rybelsus', nom: 'Rybelsus', forme: 'comprime' },
  { id: 'wegovy-oral', nom: 'Wegovy', forme: 'comprime' },
  { id: 'foundayo', nom: 'Foundayo', forme: 'comprime' },
  { id: 'autre-comprime', nom: 'Autre', forme: 'comprime' },
];

/** Ceux qui se prennent de cette façon-là, dans l'ordre de la liste. */
export function traitementsDeLaForme(forme: Forme): Traitement[] {
  return TRAITEMENTS.filter((traitement) => traitement.forme === forme);
}
