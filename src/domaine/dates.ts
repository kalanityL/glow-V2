import type { Langue } from '../i18n/langues';

/**
 * LES DATES — toujours locales, toujours `AAAA-MM-JJ` en stockage (GUIDELINES :
 * jamais `toISOString().split('T')`, qui recule d'un jour en soirée), et
 * toujours passées par une fonction de FORMAT pour l'écran, jamais assemblées
 * à la main. Le format d'écriture dépend de la langue : `JJ/MM/AAAA` en
 * français, `MM/JJ/AAAA` en anglais.
 */

/** Le 1er janvier d'une année : la date de naissance quand on n'a que l'année
    (2026-09-19, « une date par defaut 01/01 année de naissance »). */
export function dateDepuisAnnee(annee: number): string {
  return `${String(annee).padStart(4, '0')}-01-01`;
}

/** L'année d'une date `AAAA-MM-JJ`. */
export function anneeDe(date: string): number {
  return Number(date.slice(0, 4));
}

/** L'ordre des trois parts dans l'écriture courte, par langue. */
const ORDRE: Record<Langue, readonly ('jour' | 'mois' | 'annee')[]> = {
  fr: ['jour', 'mois', 'annee'],
  en: ['mois', 'jour', 'annee'],
};

/** Une date `AAAA-MM-JJ` écrite dans la langue : `19/09/2026` en français. */
export function formaterDateCourte(date: string, langue: Langue): string {
  const [annee, mois, jour] = date.split('-');
  const parts = { jour, mois, annee };
  return ORDRE[langue].map((part) => parts[part]).join('/');
}

/**
 * Une date lue dans l'écriture de la langue — `19/09/2026`, `19.09.2026`,
 * `19-09-2026`, l'année sur quatre chiffres —, rendue en `AAAA-MM-JJ`, ou
 * `null` si ce n'est pas une date qui existe (le 31/02 n'existe pas).
 */
export function lireDateCourte(texte: string, langue: Langue): string | null {
  const morceaux = texte.trim().split(/[/.\-\s]+/);
  if (morceaux.length !== 3 || morceaux.some((m) => !/^\d{1,4}$/.test(m))) return null;
  const parts: Record<'jour' | 'mois' | 'annee', number> = { jour: 0, mois: 0, annee: 0 };
  ORDRE[langue].forEach((part, i) => {
    parts[part] = Number(morceaux[i]);
  });
  const { jour, mois, annee } = parts;
  if (annee < 1000 || mois < 1 || mois > 12 || jour < 1 || jour > 31) return null;
  /* Le jour existe-t-il dans ce mois ? `Date.UTC` déborde silencieusement
     (le 31 février devient le 3 mars) : on vérifie qu'il n'a pas bougé. */
  const d = new Date(Date.UTC(annee, mois - 1, jour));
  if (d.getUTCMonth() !== mois - 1 || d.getUTCDate() !== jour) return null;
  return `${String(annee).padStart(4, '0')}-${String(mois).padStart(2, '0')}-${String(jour).padStart(2, '0')}`;
}

/** Une `Date` écrite `AAAA-MM-JJ` EN LOCAL — jamais `toISOString`, qui
    recule d'un jour en soirée (GUIDELINES). */
export function dateLocale(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** L'âge en années révolues à la date `aujourdhui`, l'une et l'autre en
    `AAAA-MM-JJ` : l'anniversaire compte le jour même. */
export function ageA(dateNaissance: string, aujourdhui: string): number {
  const [an, mn, jn] = dateNaissance.split('-').map(Number);
  const [aa, ma, ja] = aujourdhui.split('-').map(Number);
  const anniversairePasse = ma > mn || (ma === mn && ja >= jn);
  return aa - an - (anniversairePasse ? 0 : 1);
}

/** L'année et le mois (1 à 12) d'une date `AAAA-MM-JJ`. */
export function anneeMoisDe(date: string): { annee: number; mois: number } {
  const [annee, mois] = date.split('-').map(Number);
  return { annee, mois };
}

/** Le mois décalé de `delta` mois, l'année suivant. */
export function moisDecale(annee: number, mois: number, delta: number): { annee: number; mois: number } {
  const d = new Date(annee, mois - 1 + delta, 1);
  return { annee: d.getFullYear(), mois: d.getMonth() + 1 };
}

export interface CaseDuMois {
  date: string;
  jour: number;
  dansLeMois: boolean;
}

/**
 * LA GRILLE D'UN MOIS, pour un calendrier : six semaines de sept jours,
 * LUNDI EN PREMIER, les jours des mois voisins compris et marqués — la
 * grille garde toujours la même hauteur d'un mois à l'autre.
 */
export function grilleDuMois(annee: number, mois: number): CaseDuMois[] {
  const premier = new Date(annee, mois - 1, 1);
  const decalage = (premier.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(annee, mois - 1, 1 - decalage + i);
    return { date: dateLocale(d), jour: d.getDate(), dansLeMois: d.getMonth() === mois - 1 };
  });
}
