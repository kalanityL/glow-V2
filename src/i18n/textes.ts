import type { Objectif } from '../screens/onboarding/objectifs';
import type { ThemeId } from '../themes/themes';

/**
 * TOUS LES MOTS DE L'APPLICATION, ET RIEN D'AUTRE.
 *
 * Aucun texte n'est écrit dans un composant : une traduction ne doit jamais
 * demander d'ouvrir un écran. C'est la règle dès le premier jour, parce que
 * l'ajouter après coup voudrait dire repasser sur chaque fichier.
 *
 * Deux contraintes permanentes qui expliquent la forme de ce fichier :
 *   - MULTILINGUE : une entrée par langue, toutes bâties sur le même type, si
 *     bien qu'un texte oublié dans une traduction est une erreur de
 *     compilation et non un trou découvert à l'écran ;
 *   - REACT NATIVE : ce fichier est du TypeScript pur, sans rien du navigateur.
 *     Il partira tel quel dans le paquet natif.
 *
 * Les textes sont pour l'instant des « hello world » : le thème s'installe
 * avant les mots.
 */

/** Les langues servies. En ajouter une : une entrée dans `TEXTES`, et c'est tout. */
export const LANGUES = ['fr', 'en'] as const;

export type Langue = (typeof LANGUES)[number];

/** La langue de repli, celle du projet. */
export const LANGUE_PAR_DEFAUT: Langue = 'fr';

/** Le contrat : chaque langue doit porter exactement ces clés. */
export interface Textes {
  /**
   * LE NOM DE CHAQUE THÈME. `Record<ThemeId, string>` et non un objet libre :
   * ajouter un thème sans le nommer dans CHAQUE langue ne compile pas.
   */
  themes: Record<ThemeId, string>;
  /** Les objectifs, sous le même contrat : en ajouter un l'exige dans chaque langue. */
  objectifs: Record<Objectif, string>;
  onboarding: {
    theme: {
      question: string;
    };
    objectif: {
      question: string;
    };
    precedent: string;
    suivant: string;
  };
  /** Le bouton « retour » de la barre du bas : lu par les lecteurs d'écran. */
  retour: string;
}

export const TEXTES: Record<Langue, Textes> = {
  fr: {
    themes: {
      ciel: 'Ciel',
      'ciel-fonce': 'Ciel foncé',
    },
    objectifs: {
      perdre: 'Perdre du poids',
      stabiliser: 'Stabiliser mon poids',
    },
    onboarding: {
      theme: {
        question: 'Choisissez',
      },
      objectif: {
        question: 'Vous souhaitez…',
      },
      precedent: 'Précédent',
      suivant: 'Suivant',
    },
    retour: 'Retour',
  },
  en: {
    themes: {
      ciel: 'Sky',
      'ciel-fonce': 'Dark sky',
    },
    objectifs: {
      perdre: 'Lose weight',
      stabiliser: 'Keep my weight steady',
    },
    onboarding: {
      theme: {
        question: 'Choose',
      },
      objectif: {
        question: 'You would like to…',
      },
      precedent: 'Previous',
      suivant: 'Next',
    },
    retour: 'Back',
  },
};
