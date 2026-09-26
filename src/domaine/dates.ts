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

/** La date décalée de `jours` jours (négatif : en arrière), en local — le
    mois et l'année suivent ; `2026-02-28` + 1 = `2026-03-01`. */
export function dateDecalee(date: string, jours: number): string {
  const [a, m, j] = date.split('-').map(Number);
  return dateLocale(new Date(a, m - 1, j + jours));
}

/** LES JOURS QUI ONT UN MOT (2026-09-21 au soir, « pour les dates : hier /
    avant hier / aujourd'hui / demain / apres demain / sinon la date ») :
    l'écart en jours entre `date` et `aujourdhui` quand il vaut un mot, de
    -2 (avant-hier) à 2 (après-demain), `null` sinon — l'appelant écrit
    alors la date. */
export type JourRelatif = 'avantHier' | 'hier' | 'aujourdhui' | 'demain' | 'apresDemain';
const JOURS_RELATIFS: Record<string, JourRelatif> = { '-2': 'avantHier', '-1': 'hier', '0': 'aujourdhui', '1': 'demain', '2': 'apresDemain' };
export function jourRelatif(date: string, aujourdhui: string): JourRelatif | null {
  const [a, m, j] = date.split('-').map(Number);
  const [a0, m0, j0] = aujourdhui.split('-').map(Number);
  const ecart = Math.round((new Date(a, m - 1, j).getTime() - new Date(a0, m0 - 1, j0).getTime()) / 86_400_000);
  return JOURS_RELATIFS[String(ecart)] ?? null;
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

/**
 * LA SEMAINE D'UNE DATE, LUNDI EN PREMIER (2026-09-26, la vue « Semaine » du
 * journal, son template « sous-header-vue semaine.png ») : les sept jours,
 * du lundi au dimanche, celui de la date comprise. Même premier jour que la
 * grille du mois — le calendrier du projet ouvre toujours sur un lundi.
 */
export function semaineDe(date: string): string[] {
  const [a, m, j] = date.split('-').map(Number);
  const d = new Date(a, m - 1, j);
  const lundi = new Date(a, m - 1, j - ((d.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => dateLocale(new Date(lundi.getFullYear(), lundi.getMonth(), lundi.getDate() + i)));
}

/** Le jour de la semaine d'une date, 0 pour lundi — l'index des noms de
    jours du dictionnaire, qui commencent au lundi comme les calendriers. */
export function jourDeLaSemaine(date: string): number {
  const [a, m, j] = date.split('-').map(Number);
  return (new Date(a, m - 1, j).getDay() + 6) % 7;
}

/** Une date `AAAA-MM-JJ` écrite en toutes lettres avec les noms de mois
    donnés : « 13 septembre 2026 » ; en anglais, « September 13, 2026 ». */
export function formaterDateLongue(date: string, mois: readonly string[], langue: Langue): string {
  const [annee, m, jour] = date.split('-').map(Number);
  const nom = mois[m - 1] ?? '';
  return langue === 'en' ? `${nom} ${jour}, ${annee}` : `${jour} ${nom} ${annee}`;
}

/**
 * LE TITRE D'UNE JOURNÉE DU JOURNAL (2026-09-26, son template « journal mode
 * liste.png » : « Mardi 16 septembre ») : le jour de la semaine, le quantième
 * et le mois — SANS L'ANNÉE, qui est dite par le calendrier juste au-dessus.
 * La capitale initiale est celle du dictionnaire (« Lundi »), pas une
 * fabrication.
 */
export function formaterJourEtDate(
  date: string,
  jours: readonly string[],
  mois: readonly string[],
  langue: Langue,
): string {
  const [, m, jour] = date.split('-').map(Number);
  const nomJour = jours[jourDeLaSemaine(date)] ?? '';
  const nomMois = mois[m - 1] ?? '';
  return langue === 'en' ? `${nomJour}, ${nomMois} ${jour}` : `${nomJour} ${jour} ${nomMois}`;
}
