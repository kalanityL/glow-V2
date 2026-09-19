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
