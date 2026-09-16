/**
 * LES SEPT MODULES DE L'ACCUEIL, dans son ordre (2026-09-16 : « traitement
 * poids effets secondaire menu activité sommeil temps pour soi ») : les
 * cercles au-dessus du menu, trois puis quatre. Le nom de chacun vit dans
 * `i18n/textes.ts` — `Record<ModuleId, string>`, un module ajouté ici sans
 * son nom dans chaque langue ne compile pas. Les mots sont ceux de
 * VOCABULAIRE.md : « Balance » (jamais « Poids »), « Menus », « Activité
 * physique » (jamais « Sport »), « Un temps pour soi ».
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
  'activite-physique',
  'sommeil',
  'temps-pour-soi',
] as const;

export type ModuleId = (typeof MODULES)[number];

/** Les deux rangs du quinconce : trois cercles, puis quatre. */
export const RANGS_MODULES: readonly (readonly ModuleId[])[] = [
  MODULES.slice(0, 3),
  MODULES.slice(3),
];
