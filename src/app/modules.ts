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
