import { REPONSES_INITIALES, type Reponses } from '../screens/onboarding/reponses';

/**
 * L'ENREGISTREMENT DES RÉPONSES SUR L'APPAREIL (2026-09-20, « changement
 * d'information dans "mon compte" persistent au reload ») — le premier
 * enregistrement de l'application.
 *
 * SUR L'APPAREIL, ET NULLE PART AILLEURS : aucune donnée de santé ne quitte
 * l'appareil sans un geste explicite (SPEC). Le stockage lui-même est un verbe
 * de la plateforme (`plateforme/navigateur.ts`, le stockage local du
 * navigateur ; en natif, le stockage sécurisé du téléphone) ; ici, la FORME :
 * ce qu'on écrit, ce qu'on relit, et comment on se protège de ce qu'on
 * relit.
 *
 * LE FORMAT EST VERSIONNÉ (`VERSION_ENREGISTREMENT`) : « le format déjà
 * enregistré ne se change pas sans migration » (GUIDELINES). Changer la
 * forme des réponses, c'est monter la version et écrire la migration de
 * l'ancienne — jamais laisser un vieil enregistrement casser l'application.
 *
 * CE QU'ON RELIT EST COMPLÉTÉ, JAMAIS PRIS TEL QUEL : un enregistrement d'une
 * version antérieure peut manquer d'une clé ; les valeurs de départ comblent
 * le manque. Un enregistrement illisible est ignoré, et l'application part
 * des valeurs de départ.
 */

/** La clé sous laquelle les réponses sont enregistrées. */
export const CLE_REPONSES = 'glp1low.reponses';

/** La version du format enregistré. À monter quand la forme change. */
export const VERSION_ENREGISTREMENT = 1;

interface Enregistrement {
  version: number;
  reponses: Reponses;
}

/** Ce qu'on écrit : la version, et les réponses. */
export function serialiser(reponses: Reponses): string {
  const enregistrement: Enregistrement = { version: VERSION_ENREGISTREMENT, reponses };
  return JSON.stringify(enregistrement);
}

/**
 * Ce qu'on relit : les réponses de l'enregistrement, complétées des valeurs
 * de départ pour toute clé absente ; `null` si le texte n'est pas un
 * enregistrement lisible ou d'une version qu'on ne sait pas lire.
 */
export function deserialiser(texte: string | null): Reponses | null {
  if (!texte) return null;
  let lu: unknown;
  try {
    lu = JSON.parse(texte);
  } catch {
    return null;
  }
  if (typeof lu !== 'object' || lu === null) return null;
  const { version, reponses } = lu as Partial<Enregistrement>;
  if (version !== VERSION_ENREGISTREMENT || typeof reponses !== 'object' || reponses === null) {
    return null;
  }
  return {
    ...REPONSES_INITIALES,
    ...reponses,
    /* L'avatar est un objet : ses clés se complètent aussi. */
    avatar: { ...REPONSES_INITIALES.avatar, ...(reponses.avatar ?? {}) },
  };
}
