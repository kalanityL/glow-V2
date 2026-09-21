import type { SleepKind, SleepLog } from '../donnees/v1';
import { dateLocale } from './dates';

/**
 * LE SOMMEIL — la table `sleepLogs` de la V1 (`SleepLog`, `donnees/v1.ts`),
 * et ce que la SPEC en dit (§ « Le sommeil ») : une PLAGE, deux instants
 * complets ; la durée se calcule, jamais stockée ; deux sommeils ne se
 * recouvrent pas ; au plus quinze par date de réveil, et le plafond REFUSE.
 * Ce fichier ne connaît ni l'écran ni le navigateur.
 */

export const NATURES: readonly SleepKind[] = ['nuit', 'sieste'];

/** Les instants proposés d'avance (SPEC) : une nuit, la veille à 23:00 →
    07:00 ; une sieste, le jour même, 14:00 → 15:00. */
export const HEURES_PAR_DEFAUT: Record<SleepKind, { coucher: string; reveil: string }> = {
  nuit: { coucher: '23:00', reveil: '07:00' },
  sieste: { coucher: '14:00', reveil: '15:00' },
};

/** L'échelle de la qualité : six crans, de 0 à 5 ; proposée à 3. */
export const QUALITE_MAX = 5;
export const QUALITE_PAR_DEFAUT = 3;

/** Le plafond par date de réveil (SPEC) : quinze, et il refuse. */
export const SOMMEILS_PAR_JOUR_MAX = 15;

/** Au-delà de douze heures strictes : une question, pas un refus. */
export const LONGUE_DUREE_MIN = 12 * 60;

/** Un instant `AAAA-MM-JJ` + `HH:MM` en minutes depuis l'époque locale, ou
    `null` s'il est illisible. */
function instant(date: string, heure: string): number | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const h = /^(\d{2}):(\d{2})$/.exec(heure);
  if (!d || !h) return null;
  return Math.round(new Date(+d[1], +d[2] - 1, +d[3], +h[1], +h[2]).getTime() / 60000);
}

export interface Plage {
  bedDate: string;
  bedTime: string;
  date: string;
  time: string;
}

/** La durée d'une plage en minutes : réveil − endormissement si le réveil
    est après, sinon 0 — une date illisible donne 0 aussi. */
export function dureeMinutes(plage: Plage): number {
  const debut = instant(plage.bedDate, plage.bedTime);
  const fin = instant(plage.date, plage.time);
  if (debut === null || fin === null || fin <= debut) return 0;
  return fin - debut;
}

/** Une durée écrite comme la V1 : « 45 min », « 8 h », « 7 h 45 ». */
export function dureeEcrite(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`;
}

/** Deux plages se recouvrent (SPEC) : début(a) < fin(b) et début(b) < fin(a)
    — le bout à bout passe. Une plage de durée nulle ne recouvre rien. */
export function seRecouvrent(a: Plage, b: Plage): boolean {
  const aD = instant(a.bedDate, a.bedTime), aF = instant(a.date, a.time);
  const bD = instant(b.bedDate, b.bedTime), bF = instant(b.date, b.time);
  if (aD === null || aF === null || bD === null || bF === null) return false;
  if (aF <= aD || bF <= bD) return false;
  return aD < bF && bD < aF;
}

/** Le sommeil déjà enregistré que cette plage recoupe, s'il y en a un —
    la ligne qu'on modifie ne compte pas. */
export function sommeilEnConflit(sommeils: readonly SleepLog[], plage: Plage, ignorerId?: string): SleepLog | undefined {
  return sommeils.find((s) => s.id !== ignorerId && seRecouvrent(s, plage));
}

/** Le plafond par date de réveil : vrai s'il reste de la place. */
export function peutAjouterSommeil(sommeils: readonly SleepLog[], date: string, ignorerId?: string): boolean {
  return sommeils.filter((s) => s.date === date && s.id !== ignorerId).length < SOMMEILS_PAR_JOUR_MAX;
}

/** Le journal avec ce sommeil — à la place de celui du même identifiant,
    sinon en plus —, dans l'ordre des réveils. */
export function avecLeSommeil(sommeils: readonly SleepLog[], sommeil: SleepLog): SleepLog[] {
  return [...sommeils.filter((s) => s.id !== sommeil.id), sommeil].sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
  );
}

/** La veille d'une date `AAAA-MM-JJ`. */
export function veille(date: string): string {
  const [a, m, j] = date.split('-').map(Number);
  return dateLocale(new Date(a, m - 1, j - 1));
}

/**
 * LA JAUGE D'UN SOMMEIL (2026-09-21, « barre de progression : nuit : barre
 * complètement remplie à 8 h, de 8 à 12 h de durée le bleu devient de plus
 * en plus foncé ; de 0 à 8 h le bleu reste le même, la barre se remplit ;
 * plus de 12 h la barre ne change plus de couleur ; idem pour sieste avec
 * barre complètement remplie à 1 h 30 et s'intensifie jusqu'à 3 h ») : deux
 * nombres de 0 à 1 — le REMPLISSAGE, la durée rapportée à la durée pleine ;
 * et L'INTENSITÉ, de 0 à la pleine durée, montant jusqu'à 1 à la durée
 * haute, où elle reste.
 */
export const JAUGE: Record<SleepKind, { pleine: number; haute: number }> = {
  nuit: { pleine: 8 * 60, haute: 12 * 60 },
  sieste: { pleine: 90, haute: 3 * 60 },
};

export function jaugeDuSommeil(nature: SleepKind, minutes: number): { remplissage: number; intensite: number } {
  const { pleine, haute } = JAUGE[nature];
  const m = Math.max(0, minutes);
  return {
    remplissage: Math.min(1, m / pleine),
    intensite: m <= pleine ? 0 : Math.min(1, (m - pleine) / (haute - pleine)),
  };
}

/**
 * LA NOTE PROPOSÉE D'AVANCE (2026-09-21, « note par défaut d'une nuit :
 * reprendre la note de la nuit précédente la plus proche ; idem pour
 * sieste ») : celle du sommeil de même nature le plus récent AVANT ce
 * réveil ; sans aucun, la qualité de 3.
 */
export function noteParDefaut(sommeils: readonly SleepLog[], nature: SleepKind, date: string, time: string): number {
  let retenu: SleepLog | null = null;
  for (const s of sommeils) {
    if (s.kind !== nature) continue;
    if (s.date > date || (s.date === date && s.time >= time)) continue;
    if (!retenu || s.date > retenu.date || (s.date === retenu.date && s.time > retenu.time)) retenu = s;
  }
  return retenu?.quality ?? QUALITE_PAR_DEFAUT;
}
