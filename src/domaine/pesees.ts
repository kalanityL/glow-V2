import { STARTING_WEIGHT_LOG_ID, type WeightLog } from '../donnees/v1';
import { dateLocale } from './dates';

/**
 * LES PESÉES — la table `weightHistory` de la V1 (`WeightLog`,
 * `donnees/v1.ts`), et ce que la SPEC en dit (§ « Les pesées ») : au plus
 * une par jour ; la pesée de départ est la plus ancienne et se reconnaît à
 * son drapeau, jamais à sa valeur. Ce fichier ne connaît ni l'écran ni le
 * navigateur.
 */

const ordre = (a: WeightLog, b: WeightLog) =>
  a.date === b.date ? (a.time ?? '12:00').localeCompare(b.time ?? '12:00') : a.date.localeCompare(b.date);

/** Le journal dans l'ordre des dates — une pesée sans heure vaut midi. */
export function triees(pesees: readonly WeightLog[]): WeightLog[] {
  return [...pesees].sort(ordre);
}

/**
 * LE POIDS PROPOSÉ D'AVANCE (2026-09-21, « poids par defaut à l'ouverture :
 * poids dont la date est la plus proche de la date d'aujourd'hui et
 * inferieure à la date d'aujourd'hui ; on ne regarde pas les dates
 * futures ») : celui, en kilogrammes, de la pesée la plus récente qui n'est
 * pas dans le futur — aujourd'hui compris —, ou `null` s'il n'y en a aucune.
 * La date est CELLE DE LA PESÉE, jamais celle de la création de la ligne.
 */
export function poidsLePlusRecent(pesees: readonly WeightLog[], aujourdhui: string): number | null {
  let retenue: WeightLog | null = null;
  for (const pesee of pesees) {
    if (pesee.date > aujourdhui) continue;
    if (!retenue || ordre(pesee, retenue) > 0) retenue = pesee;
  }
  return retenue?.weight ?? null;
}

/** La pesée déjà consignée ce jour-là, s'il y en a une. */
export function peseeDuJour(pesees: readonly WeightLog[], date: string): WeightLog | undefined {
  return pesees.find((pesee) => pesee.date === date);
}

/** La pesée de départ : celle qui porte le drapeau. */
export function peseeDeDepart(pesees: readonly WeightLog[]): WeightLog | undefined {
  return pesees.find((pesee) => pesee.isStartingWeight);
}

/**
 * LE JOURNAL AVEC CETTE PESÉE (SPEC, « Enregistrer une pesée sur un jour déjà
 * pris ») : la ligne du jour est MISE À JOUR — elle garde son identité, son
 * drapeau de départ, et toute mensuration que la nouvelle saisie ne
 * renseigne pas ; sinon la pesée s'insère à sa place chronologique. Puis
 * les invariants du départ sont rétablis.
 */
export function avecLaPesee(pesees: readonly WeightLog[], pesee: WeightLog): WeightLog[] {
  const dejaLa = peseeDuJour(pesees, pesee.date);
  const ligne: WeightLog = dejaLa
    ? { ...dejaLa, ...sansIndefinis(pesee), id: dejaLa.id, isStartingWeight: dejaLa.isStartingWeight }
    : pesee;
  return garderLeDepart(triees([...pesees.filter((p) => p !== dejaLa), ligne]));
}

/** Le journal sans cette pesée — jamais celle de départ (SPEC). */
export function sansLaPesee(pesees: readonly WeightLog[], id: string): WeightLog[] {
  return pesees.filter((p) => p.id !== id || p.isStartingWeight);
}

/**
 * LE POIDS DE DÉPART POSÉ SANS PASSER PAR LA TABLE (SPEC, « Modifier le
 * poids de départ directement ») : seul le poids de la ligne marquée
 * change ; si aucune ligne n'est marquée, elle est créée à la veille de la
 * plus ancienne pesée — ou d'hier sur un historique vide — à 08:00.
 */
export function avecLeDepart(pesees: readonly WeightLog[], poidsKg: number, aujourdhui: string): WeightLog[] {
  const depart = peseeDeDepart(pesees);
  if (depart) {
    if (depart.weight === poidsKg) return [...pesees];
    return pesees.map((p) => (p === depart ? { ...p, weight: poidsKg } : p));
  }
  const reference = pesees.length > 0 ? triees(pesees)[0].date : aujourdhui;
  const [a, m, j] = reference.split('-').map(Number);
  const veille = new Date(a, m - 1, j - 1);
  const ligne: WeightLog = { id: STARTING_WEIGHT_LOG_ID, date: dateLocale(veille), time: '08:00', weight: poidsKg, isStartingWeight: true };
  return garderLeDepart(triees([...pesees, ligne]));
}

/**
 * LES DEUX INVARIANTS (SPEC) : « la pesée de départ est la plus ancienne.
 * Après chaque écriture : si la ligne marquée n'est ni la plus ancienne ni
 * datée du même jour qu'elle, le drapeau est réécrit sur toute la liste —
 * vrai sur la plus ancienne, faux ailleurs. Un historique sans marque, ou
 * qui en porterait deux, se répare là. À date égale, la marque en place ne
 * change pas de main. »
 */
export function garderLeDepart(pesees: readonly WeightLog[]): WeightLog[] {
  const liste = triees(pesees);
  if (liste.length === 0) return [];
  const marquee = liste.find((p) => p.isStartingWeight);
  const plusAncienne = liste[0];
  if (marquee && (marquee === plusAncienne || marquee.date === plusAncienne.date) && liste.filter((p) => p.isStartingWeight).length === 1) {
    return liste;
  }
  const retenue = marquee && marquee.date === plusAncienne.date ? marquee : plusAncienne;
  return liste.map((p) => ({ ...p, isStartingWeight: p === retenue }));
}

function sansIndefinis<T extends object>(objet: T): Partial<T> {
  return Object.fromEntries(Object.entries(objet).filter(([, v]) => v !== undefined)) as Partial<T>;
}
