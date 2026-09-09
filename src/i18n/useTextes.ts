import { LANGUE_PAR_DEFAUT, LANGUES, type Langue } from './langues';
import { languesDuLecteur } from '../plateforme/navigateur';
import { TEXTES, type Textes } from './textes';

/**
 * LA LANGUE ACTIVE, ET LES MOTS QUI VONT AVEC.
 *
 * La langue du lecteur vient de `plateforme/navigateur` — le seul fichier qui
 * connaisse le navigateur. En React Native, c'est lui qui interrogera
 * `expo-localization`, et aucun écran ne s'en apercevra.
 */

/** La première langue du lecteur que nous savons servir, sinon celle du projet. */
export function detecterLangue(): Langue {
  for (const demandee of languesDuLecteur()) {
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
