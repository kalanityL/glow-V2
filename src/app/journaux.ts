import { ZONES_INJECTION, type Prise, type Zone } from '../domaine/prises';
import type { Pesee } from '../domaine/pesees';

/**
 * L'ENREGISTREMENT DES JOURNAUX SUR L'APPAREIL (2026-09-21, « tu effaces
 * toutes les modifications qd je reload ? les poids et injections saisies
 * disparaissent ?? ») : les prises et les pesées, qui ne vivaient qu'en
 * mémoire depuis la veille, sont écrites sur l'appareil comme les réponses
 * (`enregistrement.ts`) — même forme : une clé, une version, ce qu'on
 * relit est VÉRIFIÉ ligne à ligne, jamais pris tel quel, et un
 * enregistrement illisible est ignoré.
 *
 * SUR L'APPAREIL, ET NULLE PART AILLEURS : aucune donnée de santé ne quitte
 * l'appareil sans un geste explicite (SPEC).
 */

export const CLE_JOURNAUX = 'glp1low.journaux';
export const VERSION_JOURNAUX = 1;

export interface Journaux {
  prises: Prise[];
  pesees: Pesee[];
}

export const JOURNAUX_VIDES: Journaux = { prises: [], pesees: [] };

interface Enregistrement {
  version: number;
  journaux: Journaux;
}

export function serialiserJournaux(journaux: Journaux): string {
  const enregistrement: Enregistrement = { version: VERSION_JOURNAUX, journaux };
  return JSON.stringify(enregistrement);
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const HEURE = /^\d{2}:\d{2}$/;
const POIDS = /^\d+\.\d$/;
const ZONES: readonly string[] = [...ZONES_INJECTION, 'voie-orale'];

/** Une prise relue : chaque champ vérifié, sinon `null`. */
function priseLue(x: unknown): Prise | null {
  if (typeof x !== 'object' || x === null) return null;
  const p = x as Record<string, unknown>;
  if (typeof p.date !== 'string' || !DATE.test(p.date)) return null;
  if (typeof p.heure !== 'string' || !HEURE.test(p.heure)) return null;
  if (typeof p.doseMg !== 'number' || !Number.isFinite(p.doseMg) || p.doseMg <= 0) return null;
  if (typeof p.zone !== 'string' || !ZONES.includes(p.zone)) return null;
  if (typeof p.traitement !== 'string' || !p.traitement) return null;
  const prise: Prise = { date: p.date, heure: p.heure, doseMg: p.doseMg, zone: p.zone as Zone, traitement: p.traitement };
  if (typeof p.notes === 'string' && p.notes) prise.notes = p.notes;
  return prise;
}

/** Une pesée relue : chaque champ vérifié, sinon `null`. */
function peseeLue(x: unknown): Pesee | null {
  if (typeof x !== 'object' || x === null) return null;
  const p = x as Record<string, unknown>;
  if (typeof p.date !== 'string' || !DATE.test(p.date)) return null;
  if (typeof p.heure !== 'string' || !HEURE.test(p.heure)) return null;
  if (typeof p.poids !== 'string' || !POIDS.test(p.poids)) return null;
  return { date: p.date, heure: p.heure, poids: p.poids };
}

/**
 * Ce qu'on relit : les journaux, chaque ligne vérifiée — une ligne
 * illisible est écartée, pas le journal ; `null` si le texte n'est pas un
 * enregistrement lisible ou d'une version qu'on ne sait pas lire.
 */
export function deserialiserJournaux(texte: string | null): Journaux | null {
  if (!texte) return null;
  let lu: unknown;
  try {
    lu = JSON.parse(texte);
  } catch {
    return null;
  }
  if (typeof lu !== 'object' || lu === null) return null;
  const { version, journaux } = lu as Partial<Enregistrement>;
  if (version !== VERSION_JOURNAUX || typeof journaux !== 'object' || journaux === null) return null;
  const j = journaux as Partial<Record<keyof Journaux, unknown>>;
  return {
    prises: Array.isArray(j.prises) ? j.prises.map(priseLue).filter((p): p is Prise => p !== null) : [],
    pesees: Array.isArray(j.pesees) ? j.pesees.map(peseeLue).filter((p): p is Pesee => p !== null) : [],
  };
}
