import { LANGUE_PAR_DEFAUT, LANGUES, type Langue } from './langues';
import { TEXTES, type Textes } from './textes';

/**
 * LA LANGUE ACTIVE, ET LES MOTS QUI VONT AVEC.
 *
 * LE SEUL ENDROIT DU PROJET QUI INTERROGE LE NAVIGATEUR pour connaître la
 * langue. C'est délibéré : en React Native, `navigator.languages` n'existe pas
 * et la question se pose à `expo-localization`. Ce fichier-ci sera donc le seul
 * à réécrire, et aucun écran ne s'en apercevra.
 */

/** La première langue du lecteur que nous savons servir, sinon celle du projet. */
export function detecterLangue(): Langue {
  const demandees = typeof navigator === 'undefined' ? [] : (navigator.languages ?? []);
  for (const demandee of demandees) {
    /* « fr-CA » vaut « fr » : on compare sur la partie avant le tiret. */
    const base = demandee.toLowerCase().split('-')[0];
    const connue = LANGUES.find((langue) => langue === base);
    if (connue) return connue;
  }
  return LANGUE_PAR_DEFAUT;
}

/**
 * Les textes de la langue active.
 *
 * La langue est lue une fois, au montage : personne ne change la sienne en
 * cours de route. Le jour où un réglage la fera changer, c'est ici qu'il se
 * branchera — et nulle part ailleurs.
 */
export function useTextes(): Textes {
  return TEXTES[detecterLangue()];
}
