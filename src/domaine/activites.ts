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
