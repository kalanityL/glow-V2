/**
 * UNE PRISE DE TRAITEMENT — le fait d'avoir pris son traitement à un instant,
 * injection ou comprimé (SPEC § « Les prises de traitement »). Ce fichier
 * ne connaît ni l'écran ni le navigateur : des faits, des bornes, des
 * conversions.
 */

/** Les zones d'injection, dans l'ordre de ses boutons (2026-09-21,
    « Abdomen G/D - bras G/D - cuisse G/D ») ; « voie orale » pour un
    comprimé. */
export const ZONES_INJECTION = [
  'abdomen-gauche',
  'abdomen-droit',
  'bras-gauche',
  'bras-droit',
  'cuisse-gauche',
  'cuisse-droite',
] as const;

export type Zone = (typeof ZONES_INJECTION)[number] | 'voie-orale';

/** La zone proposée d'avance pour une injection, sans historique : la
    première. La V1 tire au sort hors des zones voisines ; sans journal, il
    n'y a pas de voisines. */
export const ZONE_PAR_DEFAUT: Zone = 'abdomen-gauche';

/** LES MINUTES RONDES (V1, décision du 2026-08-08) : une heure de prise ne
    se choisit que sur celles-ci. */
export const MINUTES_RONDES = [0, 10, 15, 20, 30, 40, 45, 50] as const;

/** Une heure `HH:MM` ramenée à la minute ronde inférieure : 08:37 → 08:30,
    08:12 → 08:10, 08:04 → 08:00. Une heure illisible revient telle quelle. */
export function heureRonde(heure: string): string {
  const lu = /^(\d{2}):(\d{2})$/.exec(heure);
  if (!lu) return heure;
  const minute = Number(lu[2]);
  const ronde = [...MINUTES_RONDES].reverse().find((m) => m <= minute) ?? 0;
  return `${lu[1]}:${String(ronde).padStart(2, '0')}`;
}

/** L'heure d'une `Date` EN LOCAL, `HH:MM`. */
export function heureLocale(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Les bornes d'une dose, en milligrammes (SPEC) : de 0,001 à 1 000 000,
    trois décimales au plus. */
export const DOSE_MIN_MG = 0.001;
export const DOSE_MAX_MG = 1_000_000;

/**
 * UNE DOSE TAPÉE À LA MAIN : virgule ou point, trois décimales au plus, dans
 * les bornes. Rendue en nombre, ou `null` si la saisie ne vaut pas une dose —
 * vide, illisible, nulle, négative (SPEC : « refus formulé, rien n'est
 * écrit »).
 */
export function doseDepuisSaisie(texte: string): number | null {
  const propre = texte.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,3})?$/.test(propre)) return null;
  const dose = Number(propre);
  if (!Number.isFinite(dose) || dose < DOSE_MIN_MG || dose > DOSE_MAX_MG) return null;
  return dose;
}

/** La longueur d'une note, partout (V1, décision du 2026-08-09). */
export const NOTE_MAX = 280;

/** Une prise consignée. La dose en milligrammes ; les notes absentes plutôt
    que vides. */
export interface Prise {
  date: string;
  heure: string;
  doseMg: number;
  zone: Zone;
  notes?: string;
  /** L'identifiant du traitement, écrit depuis le profil (SPEC). */
  traitement: string;
}

/** Le plafond de prises par jour (SPEC) : deux. */
export const PRISES_PAR_JOUR_MAX = 2;

/**
 * LE JOURNAL AVEC CETTE PRISE (SPEC, « Consigner une prise », reprise avec
 * le formulaire le 2026-09-21) : une ligne à sa date, sous le plafond de
 * deux par jour — consigner une troisième prise sur une journée déjà pleine
 * REMPLACE LA DERNIÈRE ligne de cette journée. Le journal reste dans
 * l'ordre des dates et des heures.
 */
export function avecLaPrise(prises: readonly Prise[], prise: Prise): Prise[] {
  const duJour = prises.filter((p) => p.date === prise.date);
  const gardees =
    duJour.length >= PRISES_PAR_JOUR_MAX ? prises.filter((p) => p !== duJour[duJour.length - 1]) : [...prises];
  return [...gardees, prise].sort((a, b) =>
    a.date === b.date ? a.heure.localeCompare(b.heure) : a.date.localeCompare(b.date),
  );
}
