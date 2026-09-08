/**
 * LE COMPTE — ce qu'il faut pour en ouvrir un.
 *
 * UNE SEULE CONTRAINTE, ET C'EST VOULU (2026-09-08 : « contrainte mot de passe
 * 8 caracteres mini c'est tout ») : la longueur du mot de passe. Pas de
 * majuscule obligatoire, pas de chiffre imposé, pas de caractère spécial — ces
 * règles-là poussent surtout à écrire le mot de passe sur un papier.
 */

/** Le nombre de signes minimum d'un mot de passe. */
export const LONGUEUR_MOT_DE_PASSE = 8;

/** Vrai quand le mot de passe tient la règle. */
export function motDePasseValide(motDePasse: string): boolean {
  return motDePasse.length >= LONGUEUR_MOT_DE_PASSE;
}
