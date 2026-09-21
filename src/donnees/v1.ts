/**
 * LA BASE DE DONNÉES DE LA V1, REPRISE TELLE QUELLE (2026-09-21, « pour
 * chaque formulaire tu reprends de la v1 la structure de la base de données
 * correspondante ; chaque formulaire et chaque données, y compris les infos
 * du compte ») : l'objet racine `AppData` de la V1 (`V1/src/types.ts`,
 * SPEC § « L'objet racine et ses tables »), conservé en un seul document
 * JSON sous la clé `glp1_app_companion_data` — la même clé, la même forme.
 *
 * LES NOMS DES CHAMPS SONT CEUX DE LA V1, EN ANGLAIS : c'est la structure
 * de la base, pas un texte d'interface — la renommer, ce ne serait plus la
 * reprendre (exception consignée dans GUIDELINES). Les commentaires, eux,
 * sont en français.
 *
 * Ici les tables que la V2 écrit déjà : le profil, les pesées, les prises.
 * Les autres tables de la racine (repas, effets secondaires, pas, sport,
 * temps pour soi, sommeil) sont GARDÉES TELLES QUELLES à la relecture et à
 * l'écriture — jamais perdues —, et prendront leur type de la V1 le jour où
 * leur formulaire arrive.
 */

/** La clé du document racine, celle de la V1. */
export const CLE_BASE = 'glp1_app_companion_data';

export type MeasurementSystem = 'metric' | 'imperial';
export type Gender = 'homme' | 'femme' | 'neutre';
export type SilhouetteType =
  | 'sablier'
  | 'poire'
  | 'pomme'
  | 'rectangle'
  | 'triangle_inverse'
  | 'trapeze'
  | 'oval'
  | 'triangle';

/** L'avatar de la V1 (`AvatarConfig`), imbriqué dans le profil. */
export interface AvatarConfig {
  gender: Gender;
  faceShape: 'oval' | 'round' | 'square' | 'heart';
  skinColor: string;
  eyeColor: string;
  hairStyle: 'court' | 'long' | 'boucle' | 'chauve' | 'frange' | 'brosse';
  hairColor: string;
  hasGlasses: boolean;
  expression: 'happy' | 'determined' | 'proud' | 'calm';
  customPhotoUrl?: string;
}

/** Le profil de la V1 (`UserProfile`) : un seul exemplaire, sans
    identifiant, attribut `profile` de la racine. */
export interface UserProfile {
  name: string;
  gender: Gender;
  /** En années. La V2 tient la date de naissance à part et le recalcule. */
  age: number;
  /** En centimètres. */
  height: number;
  /** En kilogrammes, un décimal. */
  targetWeight: number;
  silhouetteType: SilhouetteType;
  avatar: AvatarConfig;
  /** L'identifiant du traitement dans le catalogue ; `aucun` sans traitement. */
  glp1Brand: string;
  /** Une préférence d'affichage : le stockage reste métrique. */
  measurementSystem?: MeasurementSystem;
  reminderDay: number;
  reminderTime: string;
  reminderEnabled: boolean;
  injectionReminderType?: 'weekly' | 'custom';
  injectionReminderDaysInterval?: number;
  injectionReminderStartDate?: string;
  medicalReminderEnabled: boolean;
  medicalReminderDate?: string;
  medicalReminderTime?: string;
  medicalReminderDoctor?: string;
  medicalReminderNotifyBefore?: string;
  countdownTargetDate?: string;
  dailyCaloriesGoal?: number;
  dailyProteinGoal?: number;
  dailyFiberGoal?: number;
  foodTrackingEnabled: boolean;
  stepsTrackingEnabled: boolean;
  sportTrackingEnabled: boolean;
  meTimeTrackingEnabled?: boolean;
  sleepTrackingEnabled?: boolean;
  treatmentTrackingEnabled?: boolean;
  sideEffectsTrackingEnabled?: boolean;
  quickAddEnabled: boolean;
  [autre: string]: unknown;
}

/** Une pesée de la V1 (`WeightLog`) : une ligne par journée pesée, le poids
    en kilogrammes arrondi au dixième, neuf mensurations facultatives en
    centimètres, et LE DRAPEAU du poids de départ — obligatoire, y compris à
    `false`. */
export interface WeightLog {
  id: string;
  date: string;
  time?: string;
  weight: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arm?: number;
  underbust?: number;
  buttocks?: number;
  thigh?: number;
  knee?: number;
  calf?: number;
  isStartingWeight: boolean;
}

export type BodyMeasurements = Pick<
  WeightLog,
  'chest' | 'waist' | 'hips' | 'arm' | 'underbust' | 'buttocks' | 'thigh' | 'knee' | 'calf'
>;

/** Les sept zones de la V1, telles qu'elles sont écrites en base. */
export const SITES = [
  'abdomen_gauche',
  'abdomen_droit',
  'cuisse_gauche',
  'cuisse_droite',
  'bras_gauche',
  'bras_droit',
  'prise_orale',
] as const;
export type Site = (typeof SITES)[number];

/** Une prise de la V1 (`InjectionLog`) : injection ou comprimé, la même
    ligne. `brand` absent signifie « celui du profil au moment de la
    lecture ». */
export interface InjectionLog {
  id: string;
  date: string;
  time: string;
  /** En milligrammes. */
  dose: number;
  site: Site | string;
  notes?: string;
  brand?: string;
}

/** Une nuit ou une sieste (`SleepLog`) : DEUX INSTANTS COMPLETS, jour et
    heure de l'endormissement, jour et heure du réveil — la date de la ligne
    est celle du réveil ; la durée n'est jamais stockée ; la qualité de 0 à
    5, toujours écrite. */
export type SleepKind = 'nuit' | 'sieste';

export interface SleepLog {
  id: string;
  /** Le jour du réveil. */
  date: string;
  /** L'heure du réveil. */
  time: string;
  bedDate: string;
  bedTime: string;
  kind: SleepKind;
  quality: number;
  notes?: string;
}

/** Une journée marquée (`DailyLog`) : sa seule présence à une date. */
export interface DailyLog {
  id: string;
  date: string;
}

/** L'objet racine de la V1 (`AppData`). Les tables que la V2 n'écrit pas
    encore sont opaques et conservées. */
export interface AppData {
  profile: UserProfile;
  weightHistory: WeightLog[];
  dailyLogs: DailyLog[];
  injectionHistory: InjectionLog[];
  savedMeals?: unknown[];
  sideEffectHistory?: unknown[];
  stepLogs?: unknown[];
  sportLogs?: unknown[];
  meTimeLogs?: unknown[];
  sleepLogs?: SleepLog[];
  [autre: string]: unknown;
}

/** L'identifiant de la pesée de départ (`V1/src/shared/model/startingWeighIn.ts`). */
export const STARTING_WEIGHT_LOG_ID = 'starting-weight-log';

/** Les identifiants de la V1 : un préfixe et l'horloge (`V1/src/app/useAppData.ts`). */
export const idPesee = (): string => `w-${Date.now()}`;
export const idPrise = (): string => `inj-${Date.now()}`;
export const idSommeil = (): string => `sleep-${Date.now()}`;

/** Le profil d'usine de la V1 (SPEC § « Le profil », colonne « d'usine »). */
export const PROFIL_USINE: UserProfile = {
  name: 'Chloé',
  gender: 'femme',
  age: 42,
  height: 168,
  targetWeight: 72,
  silhouetteType: 'sablier',
  avatar: {
    gender: 'femme',
    faceShape: 'oval',
    skinColor: '#FFE5D9',
    eyeColor: '#2E8B57',
    hairStyle: 'long',
    hairColor: '#4E3629',
    hasGlasses: false,
    expression: 'happy',
  },
  glp1Brand: 'aucun',
  measurementSystem: 'metric',
  reminderDay: 0,
  reminderTime: '20:00',
  reminderEnabled: false,
  medicalReminderEnabled: false,
  dailyCaloriesGoal: 1400,
  dailyFiberGoal: 25,
  foodTrackingEnabled: false,
  stepsTrackingEnabled: false,
  sportTrackingEnabled: false,
  quickAddEnabled: true,
};

/** Une racine vide, au profil d'usine. */
export function donneesVides(): AppData {
  return { profile: { ...PROFIL_USINE, avatar: { ...PROFIL_USINE.avatar } }, weightHistory: [], dailyLogs: [], injectionHistory: [] };
}
