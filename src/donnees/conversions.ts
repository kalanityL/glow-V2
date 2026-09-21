import { avatarDepuisInconnu, type Avatar, type Coiffure, type FormeVisage } from '../domaine/avatar';
import type { Reponses } from '../screens/onboarding/reponses';
import { UNITES_DU_SYSTEME, poidsDepuisKg, poidsEnKg } from '../domaine/unites';
import { ageA, dateLocale } from '../domaine/dates';
import { avecLeDepart, peseeDeDepart } from '../domaine/pesees';
import type { AppData, AvatarConfig, UserProfile } from './v1';

/**
 * ENTRE LES RÉPONSES DE LA V2 ET LE PROFIL DE LA V1 (2026-09-21) : ce que
 * l'application manie (`Reponses`, les mots de l'onboarding) et ce qui est
 * ÉCRIT (`UserProfile`, la base de la V1). Chaque conversion est une
 * fonction pure, testée.
 *
 * Ce que la V1 n'a pas — la langue, le thème, le fond, l'objectif, la date
 * de naissance (la V1 tient l'âge), l'adresse, le mot de passe, la forme
 * du traitement — vit sous sa propre clé, hors de la racine, comme la V1
 * fait de tout ce qui n'est pas une ligne de suivi (`ReponsesHorsBase`).
 */

/** Les réponses que la base de la V1 ne sait pas porter — et, depuis le
    prototype modulaire (2026-09-21), la part de l'avatar qu'elle ne sait pas
    porter non plus (`AvatarHorsBase`). */
export type ReponsesHorsBase = Pick<
  Reponses,
  'langue' | 'theme' | 'fond' | 'systeme' | 'objectif' | 'traitementCommence' | 'formeTraitement' | 'dateNaissance' | 'email' | 'motDePasse'
> & { avatar: AvatarHorsBase };

/** Les réponses hors base qui sont des réponses entières — l'avatar, lui,
    n'est hors base qu'en partie. */
export type CleHorsBase = Exclude<keyof ReponsesHorsBase, 'avatar'>;

export const CLES_HORS_BASE: readonly CleHorsBase[] = [
  'langue',
  'theme',
  'fond',
  'systeme',
  'objectif',
  'traitementCommence',
  'formeTraitement',
  'dateNaissance',
  'email',
  'motDePasse',
];

/* ── L'avatar : ce que la V1 sait porter, dans ses mots ── */

/**
 * L'AVATAR DU PROTOTYPE MODULAIRE (2026-09-21) ET L'`AvatarConfig` DE LA V1.
 * La V1 porte le genre, la forme du visage, la coiffure et les trois couleurs
 * — ce qu'elle porte s'écrit chez elle, dans ses mots. Ce qu'elle ne connaît
 * pas — la forme des yeux, le nez, la bouche, le vêtement et sa couleur —
 * est hors base (`AvatarHorsBase`). Ce qu'elle connaît et que le prototype n'a
 * plus — les lunettes, l'expression, le visage en cœur — s'écrit à sa valeur
 * neutre : la base de la V1 reste la base, telle quelle.
 */
export type AvatarHorsBase = Pick<Avatar, 'formeYeux' | 'nez' | 'bouche' | 'vetement' | 'couleurVetement'>;

export const CLES_AVATAR_HORS_BASE: readonly (keyof AvatarHorsBase)[] = ['formeYeux', 'nez', 'bouche', 'vetement', 'couleurVetement'];

const FORME_VISAGE_V1: Record<FormeVisage, AvatarConfig['faceShape']> = {
  ovale: 'oval',
  rond: 'round',
  carre: 'square',
};
/** Le cœur de la V1 n'a pas de tracé dans le prototype : il se relit ovale. */
const FORME_VISAGE_V2: Record<AvatarConfig['faceShape'], FormeVisage> = {
  oval: 'ovale',
  round: 'rond',
  square: 'carre',
  heart: 'ovale',
};
/** Le carré est la coiffure LONGUE du prototype : la V1 l'écrit `long`. */
const COIFFURE_V1: Record<Coiffure, AvatarConfig['hairStyle']> = {
  carre: 'long',
  court: 'court',
  boucle: 'boucle',
};
/** Les coiffures de la V1 sans tracé se relisent au plus proche : la frange
    est longue, la brosse est courte, l'absence de cheveux devient courte. */
const COIFFURE_V2: Record<AvatarConfig['hairStyle'], Coiffure> = {
  long: 'carre',
  court: 'court',
  boucle: 'boucle',
  frange: 'carre',
  brosse: 'court',
  chauve: 'court',
};

export function avatarConfigDepuisAvatar(avatar: Avatar): AvatarConfig {
  return {
    gender: avatar.genre,
    faceShape: FORME_VISAGE_V1[avatar.formeVisage],
    skinColor: avatar.couleurPeau,
    eyeColor: avatar.couleurYeux,
    hairStyle: COIFFURE_V1[avatar.coiffure],
    hairColor: avatar.couleurCheveux,
    hasGlasses: false,
    expression: 'happy',
  };
}

/** La part hors base de l'avatar, et rien d'autre. */
export function avatarHorsBaseDepuisAvatar(avatar: Avatar): AvatarHorsBase {
  return Object.fromEntries(CLES_AVATAR_HORS_BASE.map((c) => [c, avatar[c]])) as AvatarHorsBase;
}

/** L'avatar relu : la part de la V1 dans ses mots, la part hors base telle
    quelle, et `defaut` pour ce qui manque ou n'est pas lisible. */
export function avatarDepuisAvatarConfig(config: AvatarConfig, defaut: Avatar, horsBase: Partial<AvatarHorsBase> = {}): Avatar {
  return avatarDepuisInconnu(
    {
      ...horsBase,
      genre: config.gender,
      formeVisage: FORME_VISAGE_V2[config.faceShape],
      coiffure: COIFFURE_V2[config.hairStyle],
      couleurPeau: config.skinColor,
      couleurYeux: config.eyeColor,
      couleurCheveux: config.hairColor,
    },
    defaut,
  );
}

/* ── Le traitement : un identifiant a changé de nom ── */

/** La V2 nomme `foundayo` ce que la V1 enregistre sous `orforglipron`
    (l'identifiant est resté celui de la molécule pour atteindre les données
    déjà enregistrées, SPEC) ; sans traitement, la V1 écrit `aucun`. */
export function brandDepuisTraitement(traitement: string | null): string {
  if (!traitement) return 'aucun';
  return traitement === 'foundayo' ? 'orforglipron' : traitement;
}

export function traitementDepuisBrand(brand: string | undefined): string | null {
  if (!brand || brand === 'aucun') return null;
  return brand === 'orforglipron' ? 'foundayo' : brand;
}

/* ── Le profil ── */

/**
 * Le profil de la V1 écrit depuis les réponses, SUR le profil déjà là : les
 * champs que la V2 ne manie pas (rappels, objectifs quotidiens, drapeaux de
 * suivi…) sont gardés tels quels.
 */
export function profilDepuisReponses(reponses: Reponses, avant: UserProfile, aujourdhui = dateLocale(new Date())): UserProfile {
  const unites = UNITES_DU_SYSTEME[reponses.systeme];
  return {
    ...avant,
    name: reponses.prenom,
    gender: reponses.avatar.genre,
    age: ageA(reponses.dateNaissance, aujourdhui),
    height: reponses.tailleCm,
    targetWeight: poidsEnKg(reponses.poidsCible, unites.poids),
    avatar: avatarConfigDepuisAvatar(reponses.avatar),
    glp1Brand: brandDepuisTraitement(reponses.traitement),
    measurementSystem: reponses.systeme === 'imperial' ? 'imperial' : 'metric',
  };
}

/**
 * LA RACINE ÉCRITE DEPUIS LES RÉPONSES : le profil, et LA PESÉE DE DÉPART —
 * une pesée comme les autres, reconnue à son drapeau (SPEC) : le poids de
 * départ des réponses est le poids de cette ligne ; s'il n'y en a pas, elle
 * est créée (à la veille de la plus ancienne pesée, ou d'hier, à 08:00).
 * « Modifier le poids de départ directement : seul le poids de la ligne
 * marquée change. Sa date et ses mensurations ne sont jamais touchées. »
 */
export function baseDepuisReponses(reponses: Reponses, avant: AppData, aujourdhui = dateLocale(new Date())): AppData {
  const unites = UNITES_DU_SYSTEME[reponses.systeme];
  return {
    ...avant,
    profile: profilDepuisReponses(reponses, avant.profile, aujourdhui),
    weightHistory: avecLeDepart(avant.weightHistory, poidsEnKg(reponses.poids, unites.poids), aujourdhui),
  };
}

/**
 * LES RÉPONSES RELUES depuis la racine et les réponses hors base, complétées
 * des valeurs de départ pour ce qui manque.
 */
export function reponsesDepuisBase(base: AppData, horsBase: Partial<ReponsesHorsBase>, defaut: Reponses): Reponses {
  const p = base.profile;
  const systeme = horsBase.systeme === 'imperial' ? 'imperial' : horsBase.systeme === 'metrique' ? 'metrique' : p.measurementSystem === 'imperial' ? 'imperial' : defaut.systeme;
  const unites = UNITES_DU_SYSTEME[systeme];
  const depart = peseeDeDepart(base.weightHistory);
  const traitement = traitementDepuisBrand(p.glp1Brand);
  return {
    ...defaut,
    ...Object.fromEntries(CLES_HORS_BASE.filter((c) => horsBase[c] !== undefined).map((c) => [c, horsBase[c]])),
    systeme,
    prenom: typeof p.name === 'string' ? p.name : defaut.prenom,
    tailleCm: typeof p.height === 'number' && p.height > 0 ? p.height : defaut.tailleCm,
    poidsCible: typeof p.targetWeight === 'number' && p.targetWeight > 0 ? poidsDepuisKg(p.targetWeight, unites.poids) : defaut.poidsCible,
    poids: depart ? poidsDepuisKg(depart.weight, unites.poids) : defaut.poids,
    avatar: p.avatar ? avatarDepuisAvatarConfig(p.avatar, defaut.avatar, horsBase.avatar) : avatarDepuisInconnu(horsBase.avatar, defaut.avatar),
    traitement,
    /* Un traitement en base sans forme hors base : la forme vient du catalogue. */
    formeTraitement: horsBase.formeTraitement ?? (traitement ? null : null),
    traitementCommence: horsBase.traitementCommence ?? traitement !== null,
  };
}
