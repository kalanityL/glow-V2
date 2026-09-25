import type { SportLog } from '../donnees/v1';
import { CATALOGUE_ACTIVITES, type NoeudActivite } from './activites-catalogue';
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
 * LES SPORTS OÙ UNE DISTANCE A UN SENS, ET LEUR DISTANCE PROPOSÉE D'AVANCE
 * (SPEC § 4.7 : « une distance facultative en mètres pour les sports où
 * elle a un sens » ; la V1 en tenait la liste par ses courbes allure → MET,
 * `sportCalories.ts`). Sa liste du 2026-09-25 au soir (« distance par
 * defaut : a pied et raquette 5km ; à velo/roller : 10km ; natation :
 * 1km ; rameur : 4km ; patinage, ski : pas de possibilité de mettre la
 * distance ») : par nom de nœud de niveau 1 de l'arbre, en kilomètres.
 * Le vélo elliptique va avec le vélo, le canoë, le kayak et l'aviron avec
 * le rameur — deux rapprochements de moi. Une distance entrée remplace
 * l'intensité (la V1 : la distance remplie, l'intensité passe en grisé).
 */
export const DISTANCE_PAR_DEFAUT_KM: Readonly<Record<string, number>> = {
  Marche: 5,
  Randonnée: 5,
  'Course à pied': 5,
  'Raquettes à neige': 5,
  Vélo: 10,
  Roller: 10,
  'Vélo elliptique': 10,
  Natation: 1,
  Rameur: 4,
  'Canoë, kayak et aviron': 4,
};

/** Les sports où une distance a un sens : ceux qui ont une distance d'avance. */
export const AVEC_DISTANCE: ReadonlySet<string> = new Set(Object.keys(DISTANCE_PAR_DEFAUT_KM));

/** L'ESCALIER (2026-09-25 au soir, « escalier : durée / nombre de marche /
    nombre d'étages ») : le nœud de niveau 1 qui se compte en marches ou en
    étages, pas en intensité ni en distance. */
export const ESCALIER = 'Escalier';

/** Des kilomètres tapés au chiffre (2026-09-25 au soir, « on peut aussi
    modifier directement la valeur numérique des kilometre ») : virgule ou
    point, jamais négatif, arrondis au cran de 50 m ; `null` sinon. */
export function kmDepuisSaisie(saisie: string): number | null {
  const n = Number(saisie.trim().replace(',', '.'));
  if (!Number.isFinite(n) || n < 0 || saisie.trim() === '') return null;
  return Math.round(n * 20) / 20;
}

/** Des minutes tapées (la durée « Autre ») : un entier, au moins une ;
    `null` sinon. */
export function minutesDepuisSaisie(saisie: string): number | null {
  const s = saisie.trim();
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  return n >= 1 ? n : null;
}

/** Le nœud de niveau 1 qui porte ce nom, et sa catégorie — pour rouvrir une
    séance enregistrée (la V1 ne garde que le nom du sport). */
export function noeudDuSport(nom: string): { categorie: CategorieActivite; noeud: NoeudActivite } | null {
  for (const categorie of CATEGORIES_ACTIVITE) {
    const noeud = CATALOGUE_ACTIVITES[categorie].find((n) => n.nom === nom);
    if (noeud) return { categorie, noeud };
  }
  return null;
}

/** QUINZE SÉANCES PAR JOUR AU PLUS (la règle de la V1, `addLogWithinDailyCap`
    : « Limite atteinte pour aujourd'hui : cette saisie remplace la
    dernière. ») : la seizième consignée sur une journée pleine remplace la
    dernière de cette journée — comme la troisième prise. */
export const ACTIVITES_PAR_JOUR_MAX = 15;

/** Le journal avec cette séance : mise à jour si son identifiant y est,
    sinon ajoutée — la journée pleine perd sa dernière séance —, trié par
    date puis heure. Ne modifie pas le journal reçu. */
export function avecLActivite(activites: readonly SportLog[], activite: SportLog): SportLog[] {
  const autres = activites.filter((a) => a.id !== activite.id);
  const duJour = autres.filter((a) => a.date === activite.date);
  const gardees = duJour.length >= ACTIVITES_PAR_JOUR_MAX ? autres.filter((a) => a !== duJour[duJour.length - 1]) : autres;
  return [...gardees, activite].sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
}
