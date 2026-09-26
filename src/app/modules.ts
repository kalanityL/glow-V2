/**
 * LES HUIT MODULES DE L'ACCUEIL, dans son ordre (2026-09-16 : « traitement
 * poids effets secondaire menu activité sommeil temps pour soi », puis
 * « ajouter marche entre menus et activité physique ») : les cercles
 * au-dessus du menu, quatre puis quatre, alignés. Le nom de chacun vit dans
 * `i18n/textes.ts` — `Record<ModuleId, string>`, un module ajouté ici sans
 * son nom dans chaque langue ne compile pas. Les mots sont ceux de
 * VOCABULAIRE.md : « Balance » (jamais « Poids »), « Menus », « Activité
 * physique » (jamais « Sport »), « Un temps pour soi » — et « Marche », son
 * mot du 2026-09-16 pour le module des pas (la V1 disait « Nombre de Pas »).
 *
 * Le traitement est à part : son nom et son dessin suivent la forme répondue
 * (« Injections », « Comprimé »), voir `textes.accueil.traitement`.
 *
 * AUCUN MODULE NE MÈNE ENCORE NULLE PART : ce fichier ne dit que la liste.
 */
export const MODULES = [
  'traitement',
  'balance',
  'effets-secondaires',
  'menus',
  'marche',
  'activite-physique',
  'sommeil',
  'temps-pour-soi',
] as const;

export type ModuleId = (typeof MODULES)[number];

/** Les deux rangs, alignés : quatre cercles, puis quatre. */
export const RANGS_MODULES: readonly (readonly ModuleId[])[] = [
  MODULES.slice(0, 4),
  MODULES.slice(4),
];

/**
 * LES MODULES DU TIROIR « + » (2026-09-20) : ceux qui ont un formulaire
 * d'ajout, dans l'ordre du tiroir « ajout » de la V1 (`ADD_DRAWER_ORDER` :
 * injection, pesée, effets secondaires, activité physique, repas, sommeil,
 * temps pour soi) — la marche n'y est pas, elle n'a pas de formulaire
 * d'ajout dans la V1.
 */
/**
 * LES MODULES DE L'ÉCRAN VIDE DU JOURNAL (2026-09-26, sa liste : « Ajouter :
 * une injection / un poids / un effet secondaire / un repas / une activité
 * physiue / un sommeil / un temps pour soi ») : les mêmes sept que le tiroir
 * du « + », DANS SON ORDRE À ELLE, qui n'est pas celui de la V1 — le repas
 * passe devant l'activité physique. Une liste à part plutôt qu'un tri :
 * l'ordre du tiroir est celui de la V1 et ne doit pas bouger.
 */
export const MODULES_AJOUT_JOURNAL: readonly ModuleId[] = [
  'traitement',
  'balance',
  'effets-secondaires',
  'menus',
  'activite-physique',
  'sommeil',
  'temps-pour-soi',
];

export const MODULES_AJOUT: readonly ModuleId[] = [
  'traitement',
  'balance',
  'effets-secondaires',
  'activite-physique',
  'menus',
  'sommeil',
  'temps-pour-soi',
];
