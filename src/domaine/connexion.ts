/**
 * LES REFUS DE CONNEXION — ce que l'écran dit pour chaque code du SDK.
 *
 * Fonction pure, sans le SDK : testable à sec. Les codes sont ceux de
 * Firebase Auth (`auth/…`), repris de `shared/platform/auth.errors.ts` de la
 * V1 ; les MOTS sont dans le dictionnaire (`textes.connexion.refus`), pas
 * ici — aucun texte hors de `i18n/textes.ts`. Un code non prévu tombe sur
 * le refus générique : mieux vaut une phrase vague qu'un code anglais brut
 * à l'écran.
 */

/** Les refus qui ont leur phrase, dans les mots de la V1. */
export const REFUS_CONNEXION = [
  'adresse',
  'identifiants',
  'compteDesactive',
  'tropDEssais',
  'reseau',
  'fenetreFermee',
  'fenetreBloquee',
  'domaine',
  'autre',
] as const;
export type RefusConnexion = (typeof REFUS_CONNEXION)[number];

/** Le refus que dit chaque code du SDK. */
const REFUS_DU_CODE: Readonly<Record<string, RefusConnexion>> = {
  'auth/invalid-email': 'adresse',
  'auth/invalid-credential': 'identifiants',
  'auth/user-not-found': 'identifiants',
  'auth/wrong-password': 'identifiants',
  'auth/user-disabled': 'compteDesactive',
  'auth/too-many-requests': 'tropDEssais',
  'auth/network-request-failed': 'reseau',
  'auth/popup-closed-by-user': 'fenetreFermee',
  'auth/cancelled-popup-request': 'fenetreFermee',
  'auth/popup-blocked': 'fenetreBloquee',
  'auth/unauthorized-domain': 'domaine',
};

export function refusDuCode(code: string): RefusConnexion {
  return REFUS_DU_CODE[code] ?? 'autre';
}
