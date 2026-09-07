import type { Systeme, Unite } from '../domaine/unites';
import type { NiveauActivite, Objectif } from '../screens/onboarding/reponses';
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
  /** Les niveaux d'activité, sous le même contrat. */
  niveauxActivite: Record<NiveauActivite, string>;
  /**
   * LES UNITÉS. Elles se traduisent : « lb » s'écrit « lbs » ou « livres »
   * selon la langue, et une langue non latine ne les écrit pas du tout comme
   * ça. Elles ne sont donc pas dans `domaine/unites.ts`, qui ne porte que les
   * identifiants.
   */
  unites: Record<Unite, string>;
  /**
   * LES SYSTÈMES, tels qu'ils se proposent : par leurs unités, qui parlent
   * mieux que « métrique » et « impérial ».
   */
  systemes: Record<Systeme, string>;
  /**
   * LE NOM DE LA FRACTION DE CHAQUE UNITÉ — ce que vaut le second cran d'un
   * sélecteur. En kilos ce sont des centaines de grammes, en livres des
   * dixièmes : le dire vraiment vaut mieux que « décimale ».
   */
  fractions: Record<Unite, string>;
  onboarding: {
    theme: {
      question: string;
    };
    systeme: {
      question: string;
    };
    objectif: {
      question: string;
    };
    poids: {
      question: string;
    };
    poidsCible: {
      question: string;
    };
    activite: {
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
    niveauxActivite: {
      doux: 'Doux',
      modere: 'Modéré',
      intense: 'Intense',
    },
    unites: {
      kg: 'kg',
      lb: 'lb',
      cm: 'cm',
      in: 'in',
    },
    systemes: {
      metrique: 'cm · kg',
      imperial: 'inch · pound',
    },
    fractions: {
      kg: 'Centaines de grammes',
      lb: 'Dixièmes de livre',
      cm: 'Millimètres',
      in: 'Dixièmes de pouce',
    },
    onboarding: {
      theme: {
        question: 'Choisissez',
      },
      systeme: {
        question: 'Vos unités',
      },
      objectif: {
        question: 'Vous souhaitez…',
      },
      poids: {
        question: 'Quel est votre poids actuel ?',
      },
      poidsCible: {
        question: 'Quel poids visez-vous ?',
      },
      activite: {
        question: 'Quel est votre niveau d’activité au quotidien ?',
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
    niveauxActivite: {
      doux: 'Gentle',
      modere: 'Moderate',
      intense: 'Intense',
    },
    unites: {
      kg: 'kg',
      lb: 'lb',
      cm: 'cm',
      in: 'in',
    },
    systemes: {
      metrique: 'cm · kg',
      imperial: 'inch · pound',
    },
    fractions: {
      kg: 'Hundreds of grams',
      lb: 'Tenths of a pound',
      cm: 'Millimetres',
      in: 'Tenths of an inch',
    },
    onboarding: {
      theme: {
        question: 'Choose',
      },
      systeme: {
        question: 'Your units',
      },
      objectif: {
        question: 'You would like to…',
      },
      poids: {
        question: 'What is your current weight?',
      },
      poidsCible: {
        question: 'What weight are you aiming for?',
      },
      activite: {
        question: 'How active are your days?',
      },
      precedent: 'Previous',
      suivant: 'Next',
    },
    retour: 'Back',
  },
};
