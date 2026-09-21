import { CLE_BASE, donneesVides, type AppData, type InjectionLog, type SleepLog, type UserProfile, type WeightLog } from '../donnees/v1';
import { enregistrer, lireEnregistre } from '../plateforme/navigateur';

/**
 * LA BASE SUR L'APPAREIL (2026-09-21, « pour chaque formulaire tu reprends
 * de la v1 la structure de la base de données correspondante ») : le
 * document racine de la V1, sous sa clé, lu et écrit ici et nulle part
 * ailleurs. Chaque écriture RELIT le document, ne remplace que sa part, et
 * réécrit le tout : deux gestes qui touchent deux tables ne s'écrasent
 * pas, et les tables que la V2 n'écrit pas encore sont conservées.
 *
 * CE QU'ON RELIT EST VÉRIFIÉ, JAMAIS PRIS TEL QUEL : le document doit être
 * un objet, son profil un objet, ses tables des listes ; une ligne de pesée
 * ou de prise sans ses champs obligatoires est écartée sans perdre le
 * journal. Illisible, le document est ignoré et la base part vide.
 *
 * SUR L'APPAREIL, ET NULLE PART AILLEURS (SPEC).
 */

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const HEURE = /^\d{2}:\d{2}$/;

function peseeLue(x: unknown): WeightLog | null {
  if (typeof x !== 'object' || x === null) return null;
  const p = x as Record<string, unknown>;
  if (typeof p.id !== 'string' || typeof p.date !== 'string' || !DATE.test(p.date)) return null;
  if (typeof p.weight !== 'number' || !Number.isFinite(p.weight) || p.weight <= 0) return null;
  if (p.time !== undefined && (typeof p.time !== 'string' || !HEURE.test(p.time))) return null;
  return { ...(p as unknown as WeightLog), isStartingWeight: Boolean(p.isStartingWeight) };
}

function priseLue(x: unknown): InjectionLog | null {
  if (typeof x !== 'object' || x === null) return null;
  const p = x as Record<string, unknown>;
  if (typeof p.id !== 'string' || typeof p.date !== 'string' || !DATE.test(p.date)) return null;
  if (typeof p.time !== 'string' || !HEURE.test(p.time)) return null;
  if (typeof p.dose !== 'number' || !Number.isFinite(p.dose) || p.dose <= 0) return null;
  if (typeof p.site !== 'string') return null;
  return p as unknown as InjectionLog;
}

function sommeilLu(x: unknown): SleepLog | null {
  if (typeof x !== 'object' || x === null) return null;
  const s = x as Record<string, unknown>;
  if (typeof s.id !== 'string') return null;
  for (const c of ['date', 'bedDate']) if (typeof s[c] !== 'string' || !DATE.test(s[c] as string)) return null;
  for (const c of ['time', 'bedTime']) if (typeof s[c] !== 'string' || !HEURE.test(s[c] as string)) return null;
  if (s.kind !== 'nuit' && s.kind !== 'sieste') return null;
  if (typeof s.quality !== 'number' || !Number.isFinite(s.quality)) return null;
  return s as unknown as SleepLog;
}

/** Le document relu et vérifié, ou une base vide. */
export function lireBase(texte: string | null = lireEnregistre(CLE_BASE)): AppData {
  const vide = donneesVides();
  if (!texte) return vide;
  let lu: unknown;
  try {
    lu = JSON.parse(texte);
  } catch {
    return vide;
  }
  if (typeof lu !== 'object' || lu === null) return vide;
  const d = lu as Record<string, unknown>;
  const profile = typeof d.profile === 'object' && d.profile !== null ? { ...vide.profile, ...(d.profile as UserProfile) } : vide.profile;
  return {
    ...d,
    profile,
    weightHistory: Array.isArray(d.weightHistory) ? d.weightHistory.map(peseeLue).filter((p): p is WeightLog => p !== null) : [],
    dailyLogs: Array.isArray(d.dailyLogs) ? (d.dailyLogs as AppData['dailyLogs']) : [],
    injectionHistory: Array.isArray(d.injectionHistory) ? d.injectionHistory.map(priseLue).filter((p): p is InjectionLog => p !== null) : [],
    sleepLogs: Array.isArray(d.sleepLogs) ? d.sleepLogs.map(sommeilLu).filter((s): s is SleepLog => s !== null) : [],
  };
}

/** Le document écrit, tel quel. */
export function ecrireBase(base: AppData): void {
  enregistrer(CLE_BASE, JSON.stringify(base));
}

/** Une part du document remplacée — le reste relu et conservé. */
export function modifierBase(changer: (base: AppData) => AppData): AppData {
  const apres = changer(lireBase());
  ecrireBase(apres);
  return apres;
}
