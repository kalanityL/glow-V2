/**
 * L'ACTIVITÉ PHYSIQUE — LES CATÉGORIES (2026-09-25, « on va créer la page
 * ajouter une activité physique »). Elles viennent de son tri du Compendium
 * of Physical Activities 2024 (la simulation « Compendium des activités
 * physiques », 24 et 25 septembre) : neuf catégories, dans son ordre — six
 * familles de sports, gym et muscu, les activités aquatiques, les
 * hivernales, et « Autre ». Le nom de chacune vit dans `i18n/textes.ts`
 * (`Record<CategorieActivite, string>`) ; l'icône, un masque embarqué,
 * dans `themes/page.css`. Les activités de chaque catégorie, avec leur MET,
 * viendront ici le jour de la liste.
 */
export const CATEGORIES_ACTIVITE = [
  'ballon-et-balles',
  'raquettes',
  'roues',
  'pedestre',
  'cheval',
  'individuel',
  'aquatiques',
  'hivernales',
  'autre',
] as const;

export type CategorieActivite = (typeof CATEGORIES_ACTIVITE)[number];

/**
 * LE SLUG D'UN NŒUD (2026-09-25, « resultat de recherche : les icones
 * doivent etre celle du sport ») : le nom d'un nœud de niveau 1, en
 * minuscules sans accents, tout ce qui n'est pas lettre ou chiffre devenu
 * un tiret — c'est le nom de son icône, un masque de
 * `src/assets/images/activites/sports/`, posé par
 * `themes/activites-icones.css` (engendré). Un nœud sans icône garde celle
 * de sa catégorie.
 */
export function slugActivite(nom: string): string {
  return nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
