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

/** LES TROIS INTENSITÉS RESSENTIES de la V1 (`SportLog.intensity`, SPEC
    § 4.7) : douce, modérée, intensive — les valeurs de la base. */
export const INTENSITES = ['douce', 'moderee', 'intensive'] as const;
export type Intensite = (typeof INTENSITES)[number];

/** LES DURÉES PROPOSÉES (2026-09-25, « on peut choisir le temps avec des
    choix 15 min 30 min 45 min 1h ou autre ») — en minutes, l'unité de la
    base. */
export const DUREES_PROPOSEES = [15, 30, 45, 60] as const;

/**
 * LES SPORTS OÙ UNE DISTANCE A UN SENS (SPEC § 4.7 : « une distance
 * facultative en mètres pour les sports où elle a un sens » ; la V1 en
 * tenait la liste par ses courbes allure → MET, `sportCalories.ts` :
 * marche, randonnée, course à pied, vélo, natation, rameur et aviron, ski
 * de fond, patinage et roller). Ici, par nom de nœud de niveau 1 de
 * l'arbre. Une distance entrée remplace l'intensité (2026-09-25,
 * « entrer une distance » OU l'intensité ; la V1 : la distance remplie,
 * l'intensité passe en grisé).
 */
export const AVEC_DISTANCE: ReadonlySet<string> = new Set([
  'Marche',
  'Randonnée',
  'Marche athlétique',
  'Course à pied',
  'Vélo',
  'Roller',
  'Natation',
  'Canoë, kayak et aviron',
  'Rameur',
  'Vélo elliptique',
  'Ski',
  'Patinage',
  'Raquettes à neige',
]);
