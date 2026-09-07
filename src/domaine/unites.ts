/**
 * LES SYSTÈMES D'UNITÉS.
 *
 * L'application se saisit aujourd'hui en centimètres et en kilogrammes, mais
 * elle devra pouvoir passer au système impérial (2026-09-07 : « avoir en tete
 * qu'il sera possible de passer du systeme cm/kg au systeme inch/once »).
 * D'où ce fichier, écrit AVANT que le besoin n'arrive : le rétrofiter aurait
 * voulu dire rouvrir chaque écran de saisie.
 *
 * LA RÈGLE QUI ÉVITE TOUS LES ENNUIS : ce qui est SAISI et ce qui est STOCKÉ ne
 * sont pas la même chose. On stockera toujours en unités métriques — un poids
 * en kilogrammes, une taille en centimètres —, et le système ne décide que de
 * l'unité D'AFFICHAGE et de saisie. Sans cela, changer de système changerait la
 * valeur des mesures déjà prises.
 *
 * Rien ici n'est traduit : les libellés (« kg », « lb »…) vivent dans
 * `i18n/textes.ts`, sous le contrat `Record<Unite, string>` — une unité de plus
 * l'exige dans chaque langue.
 */

export const SYSTEMES = ['metrique', 'imperial'] as const;

export type Systeme = (typeof SYSTEMES)[number];

/** Celui de départ, tant que rien ne permet d'en changer. */
export const SYSTEME_PAR_DEFAUT: Systeme = 'metrique';

/** Les unités connues, toutes langues confondues. */
export const UNITES = ['kg', 'lb', 'cm', 'in'] as const;

export type Unite = (typeof UNITES)[number];

/** L'unité de chaque grandeur, dans chaque système. */
export const UNITES_DU_SYSTEME: Record<Systeme, { poids: Unite; taille: Unite }> = {
  metrique: { poids: 'kg', taille: 'cm' },
  imperial: { poids: 'lb', taille: 'in' },
};
