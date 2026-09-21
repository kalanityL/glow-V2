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

import type { Langue } from '../i18n/langues';

export const SYSTEMES = ['metrique', 'imperial'] as const;

export type Systeme = (typeof SYSTEMES)[number];

/** Celui de départ, tant que rien ne permet d'en changer. */
export const SYSTEME_PAR_DEFAUT: Systeme = 'metrique';

/** Les unités connues, toutes langues confondues. */
export const UNITES = ['kg', 'lb', 'cm', 'in'] as const;

export type Unite = (typeof UNITES)[number];

/* Les deux familles, nommées : elles n'ont ni les mêmes bornes ni les mêmes
   sélecteurs, et un poids ne doit jamais pouvoir se glisser là où une taille
   est attendue. */
export type UnitePoids = Extract<Unite, 'kg' | 'lb'>;
export type UniteTaille = Extract<Unite, 'cm' | 'in'>;

/**
 * LE SYSTÈME QUE CHAQUE LANGUE APPORTE AVEC ELLE (2026-09-07 : « si choix en,
 * ça bascule le defaut de l'unité vers pound, mais on peut le changer apres ;
 * si choix fr, rebascule vers defaut cm »).
 *
 * C'est un DÉFAUT, pas une règle : choisir une langue repose le système sur
 * celui-ci, et l'on est libre d'en changer juste après, sur le même écran.
 * L'anglais amène l'impérial parce que c'est ce que lisent la plupart de ceux
 * qui le choisiront ; le jour où une langue de plus arrivera, sa ligne se pose
 * ici et nulle part ailleurs.
 */
export const SYSTEME_PAR_LANGUE: Record<Langue, Systeme> = {
  fr: 'metrique',
  en: 'imperial',
};

/** L'unité de chaque grandeur, dans chaque système. */
export const UNITES_DU_SYSTEME: Record<Systeme, { poids: UnitePoids; taille: UniteTaille }> = {
  metrique: { poids: 'kg', taille: 'cm' },
  imperial: { poids: 'lb', taille: 'in' },
};

/** Un pouce, en centimètres. */
const CM_PAR_POUCE = 2.54;

/**
 * LA TAILLE SE STOCKE EN CENTIMÈTRES, ET SE CONVERTIT AUX DEUX BOUTS — à
 * l'affichage et à la saisie, jamais au stockage (règle de la V1, reprise). Ces
 * deux fonctions sont les seuls endroits où le pouce existe.
 */
export function tailleAffichee(cm: number, unite: UniteTaille): number {
  return unite === 'in' ? Math.round(cm / CM_PAR_POUCE) : cm;
}

export function tailleEnCm(valeur: number, unite: UniteTaille): number {
  return unite === 'in' ? Math.round(valeur * CM_PAR_POUCE) : valeur;
}

/** Une livre, en kilogrammes. */
const KG_PAR_LIVRE = 0.45359237;

/** Un poids stocké dans son unité (« 95.0 », « 209.4 ») → kilogrammes, un
    décimal — la base de la V1 est métrique quelle que soit la préférence. */
export function poidsEnKg(stocke: string, unite: UnitePoids): number {
  const valeur = Number(stocke);
  const kg = unite === 'lb' ? valeur * KG_PAR_LIVRE : valeur;
  return Math.round(kg * 10) / 10;
}

/** Des kilogrammes → le poids stocké dans son unité, un décimal, un point. */
export function poidsDepuisKg(kg: number, unite: UnitePoids): string {
  const valeur = unite === 'lb' ? kg / KG_PAR_LIVRE : kg;
  return (Math.round(valeur * 10) / 10).toFixed(1);
}
