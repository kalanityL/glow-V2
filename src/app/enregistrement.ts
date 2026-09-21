import { REPONSES_INITIALES, type Reponses } from '../screens/onboarding/reponses';
import { CLES_HORS_BASE, avatarHorsBaseDepuisAvatar, baseDepuisReponses, reponsesDepuisBase, type ReponsesHorsBase } from '../donnees/conversions';
import { avatarDepuisInconnu } from '../domaine/avatar';
import type { AppData } from '../donnees/v1';
import { effacerEnregistre, enregistrer, lireEnregistre } from '../plateforme/navigateur';
import { lireBase, modifierBase } from './base';
import { CLE_BASE } from '../donnees/v1';

/**
 * L'ENREGISTREMENT DES RÉPONSES (2026-09-20, « changement d'information dans
 * "mon compte" persistent au reload ») — DANS LA BASE DE LA V1 depuis le
 * 2026-09-21 (« chaque formulaire et chaque données, y compris les infos du
 * compte ») : ce que la V1 sait porter va dans son profil et sa table des
 * pesées (`donnees/conversions.ts`) ; ce qu'elle ne sait pas porter — la
 * langue, le thème, le fond, l'objectif, la date de naissance, l'adresse,
 * le mot de passe, la forme du traitement — vit sous sa propre clé, hors
 * de la racine, comme la V1 fait de tout ce qui n'est pas une ligne de
 * suivi. Versionné : « le format déjà enregistré ne se change pas sans
 * migration » (GUIDELINES).
 */

/** La clé des réponses hors base. Préfixe `glp1_`, comme les clés de la V1. */
export const CLE_HORS_BASE = 'glp1_v2_reponses';
/** Version 2 depuis le prototype modulaire de l'avatar (2026-09-21) : la
    part de l'avatar que la V1 ne porte pas s'ajoute sous `avatar`. Une
    version 1 se relit telle quelle — elle n'a pas d'avatar hors base, il
    part de ses valeurs de départ — et se réécrit en 2 au prochain
    enregistrement. */
export const VERSION_HORS_BASE = 2;
const VERSIONS_LISIBLES = [1, 2];

/** Les clés de l'enregistrement d'avant le 2026-09-21, relues une fois pour
    migrer, puis effacées. */
const ANCIENNE_CLE_REPONSES = 'glp1low.reponses';

interface EnregistrementHorsBase {
  version: number;
  reponses: Partial<ReponsesHorsBase>;
}

export function serialiserHorsBase(reponses: Reponses): string {
  const horsBase = {
    ...Object.fromEntries(CLES_HORS_BASE.map((c) => [c, reponses[c]])),
    avatar: avatarHorsBaseDepuisAvatar(reponses.avatar),
  } as ReponsesHorsBase;
  const enregistrement: EnregistrementHorsBase = { version: VERSION_HORS_BASE, reponses: horsBase };
  return JSON.stringify(enregistrement);
}

export function deserialiserHorsBase(texte: string | null): Partial<ReponsesHorsBase> {
  if (!texte) return {};
  let lu: unknown;
  try {
    lu = JSON.parse(texte);
  } catch {
    return {};
  }
  if (typeof lu !== 'object' || lu === null) return {};
  const { version, reponses } = lu as Partial<EnregistrementHorsBase>;
  if (!VERSIONS_LISIBLES.includes(version as number) || typeof reponses !== 'object' || reponses === null) return {};
  const horsBase: Partial<ReponsesHorsBase> = Object.fromEntries(CLES_HORS_BASE.filter((c) => c in reponses).map((c) => [c, reponses[c]]));
  /* L'avatar hors base est relu tel quel : c'est `reponsesDepuisBase` qui en
     juge chaque réglage, avec les valeurs de départ pour ce qui manque. */
  if (typeof reponses.avatar === 'object' && reponses.avatar !== null) horsBase.avatar = reponses.avatar;
  return horsBase;
}

/** Les réponses, depuis la base et les réponses hors base. */
export function lireReponses(base: AppData = lireBase(), horsBase = deserialiserHorsBase(lireEnregistre(CLE_HORS_BASE))): Reponses {
  return reponsesDepuisBase(base, horsBase, REPONSES_INITIALES);
}

/** Les réponses enregistrées — ou, SANS AUCUNE BASE sur l'appareil, les
    valeurs de départ de la V2 (« Marie Cécile », 95,0…), pas le profil
    d'usine de la V1 : le premier écrit posera la base. */
export function lireReponsesEnregistrees(): Reponses {
  return lireEnregistre(CLE_BASE) === null ? REPONSES_INITIALES : lireReponses();
}

/** Les réponses écrites : le profil et la pesée de départ dans la base, le
    reste sous sa clé. */
export function ecrireReponses(reponses: Reponses): void {
  modifierBase((base) => baseDepuisReponses(reponses, base));
  enregistrer(CLE_HORS_BASE, serialiserHorsBase(reponses));
}

/**
 * LA MIGRATION DE L'ENREGISTREMENT D'AVANT (2026-09-20 → 2026-09-21) : les
 * réponses sous `glp1low.reponses` (version 1, `{ version, reponses }`)
 * passent dans la base de la V1 une fois, puis la clé est effacée. Rien si
 * la base existe déjà.
 */
export function migrerAncienEnregistrement(): void {
  const ancien = lireEnregistre(ANCIENNE_CLE_REPONSES);
  if (!ancien || lireEnregistre(CLE_HORS_BASE)) return;
  try {
    const lu = JSON.parse(ancien) as { version?: number; reponses?: Partial<Reponses> };
    if (lu.version === 1 && lu.reponses && typeof lu.reponses === 'object') {
      /* L'avatar d'alors est celui de la V1 (expression, lunettes, cœur…) :
         chaque réglage encore connu est gardé, le reste tombe. */
      const reponses: Reponses = { ...REPONSES_INITIALES, ...lu.reponses, avatar: avatarDepuisInconnu(lu.reponses.avatar, REPONSES_INITIALES.avatar) };
      ecrireReponses(reponses);
    }
  } catch {
    /* Illisible : on part des valeurs de départ. */
  }
  effacerEnregistre(ANCIENNE_CLE_REPONSES);
}
