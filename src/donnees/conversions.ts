import type { Avatar, Coiffure, Expression, FormeVisage, Genre } from '../domaine/avatar';
import type { Reponses } from '../screens/onboarding/reponses';
import { UNITES_DU_SYSTEME, poidsDepuisKg, poidsEnKg } from '../domaine/unites';
import { TRAITEMENTS, type Forme } from '../domaine/traitements';
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

/** Les réponses que la base de la V1 ne sait pas porter. */
export type ReponsesHorsBase = Pick<
  Reponses,
  'langue' | 'theme' | 'fond' | 'systeme' | 'objectif' | 'traitementCommence' | 'formeTraitement' | 'dateNaissance' | 'email' | 'motDePasse'
>;

export const CLES_HORS_BASE: readonly (keyof ReponsesHorsBase)[] = [
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

/* ── L'avatar : les mêmes traits, les mots de la V1 ── */

const FORME_VISAGE_V1: Record<FormeVisage, AvatarConfig['faceShape']> = {
  ovale: 'oval',
  rond: 'round',
  carre: 'square',
  coeur: 'heart',
};
const FORME_VISAGE_V2 = Object.fromEntries(Object.entries(FORME_VISAGE_V1).map(([v2, v1]) => [v1, v2])) as Record<
  AvatarConfig['faceShape'],
  FormeVisage
>;
const EXPRESSION_V1: Record<Expression, AvatarConfig['expression']> = {
  joyeuse: 'happy',
  determinee: 'determined',
  fiere: 'proud',
  calme: 'calm',
};
const EXPRESSION_V2 = Object.fromEntries(Object.entries(EXPRESSION_V1).map(([v2, v1]) => [v1, v2])) as Record<
  AvatarConfig['expression'],
  Expression
>;

export function avatarConfigDepuisAvatar(avatar: Avatar): AvatarConfig {
  return {
    gender: avatar.genre,
    faceShape: FORME_VISAGE_V1[avatar.formeVisage],
    skinColor: avatar.couleurPeau,
    eyeColor: avatar.couleurYeux,
    hairStyle: avatar.coiffure,
    hairColor: avatar.couleurCheveux,
    hasGlasses: avatar.lunettes,
    expression: EXPRESSION_V1[avatar.expression],
  };
}

export function avatarDepuisAvatarConfig(config: AvatarConfig, defaut: Avatar): Avatar {
  return {
    genre: (['femme', 'homme', 'neutre'] as Genre[]).includes(config.gender) ? config.gender : defaut.genre,
    formeVisage: FORME_VISAGE_V2[config.faceShape] ?? defaut.formeVisage,
    couleurPeau: typeof config.skinColor === 'string' ? config.skinColor : defaut.couleurPeau,
    couleurYeux: typeof config.eyeColor === 'string' ? config.eyeColor : defaut.couleurYeux,
    coiffure: (['court', 'long', 'boucle', 'frange', 'brosse', 'chauve'] as Coiffure[]).includes(config.hairStyle)
      ? config.hairStyle
      : defaut.coiffure,
    couleurCheveux: typeof config.hairColor === 'string' ? config.hairColor : defaut.couleurCheveux,
    lunettes: Boolean(config.hasGlasses),
    expression: EXPRESSION_V2[config.expression] ?? defaut.expression,
  };
}

/* ── Le traitement : un identifiant a changé de nom ── */

/** La V2 nomme `foundayo` ce que la V1 enregistre sous `orforglipron`
    (l'identifiant est resté celui de la molécule pour atteindre les données
    déjà enregistrées, SPEC) ; sans traitement, la V1 écrit `aucun`. */
export function brandDepuisTraitement(traitement: string | null): string {
  if (!traitement) return 'aucun';
  return traitement === 'foundayo' ? 'orforglipron' : traitement;
}

/** La forme d'une spécialité du catalogue ; `null` sans traitement ou hors
    catalogue. */
export function formeDuTraitement(traitement: string | null): Forme | null {
  if (!traitement) return null;
  return TRAITEMENTS.find((t) => t.id === traitement)?.forme ?? null;
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
    avatar: p.avatar ? avatarDepuisAvatarConfig(p.avatar, defaut.avatar) : defaut.avatar,
    traitement,
    /* UN TRAITEMENT EN BASE SANS FORME HORS BASE : LA FORME VIENT DU
       CATALOGUE (2026-09-21 au soir, « mon traitement est wegovy injection
       mais ajouter traitement ne m'amene pas au formulaire d'ajout ») — le
       commentaire le disait, le code rendait `null` : le bloc « Mon
       traitement » s'ouvrait sans forme et le « + » n'arrivait jamais à la
       prise. Chaque spécialité connaît sa forme. */
    formeTraitement: horsBase.formeTraitement ?? formeDuTraitement(traitement),
    traitementCommence: horsBase.traitementCommence ?? traitement !== null,
  };
}
