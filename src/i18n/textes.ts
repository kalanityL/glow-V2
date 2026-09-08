import type { AvatarId } from '../domaine/avatars';
import type { Forme } from '../domaine/traitements';
import type { Systeme, Unite } from '../domaine/unites';
import type { Langue } from './langues';
import type { Genre, Objectif } from '../screens/onboarding/reponses';
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

/** Le contrat : chaque langue doit porter exactement ces clés. */
export interface Textes {
  /**
   * LE NOM DE CHAQUE THÈME. `Record<ThemeId, string>` et non un objet libre :
   * ajouter un thème sans le nommer dans CHAQUE langue ne compile pas.
   */
  /**
   * LE NOM DE CHAQUE LANGUE, ÉCRIT DANS SA PROPRE LANGUE — « Français »,
   * « English » — et non traduit : c'est l'usage, et c'est le seul moyen que
   * quelqu'un qui ne lit pas la langue affichée retrouve la sienne. Les deux
   * dictionnaires portent donc les mêmes mots, et c'est normal.
   */
  langues: Record<Langue, string>;
  themes: Record<ThemeId, string>;
  /** Les objectifs, sous le même contrat : en ajouter un l'exige dans chaque langue. */
  objectifs: Record<Objectif, string>;
  /** Les niveaux d'activité, sous le même contrat. */
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
   * LE SÉPARATEUR DÉCIMAL DE LA LANGUE (2026-09-07) : virgule en français,
   * POINT EN ANGLAIS. Il est ici et non dans le code d'un écran parce que
   * c'est une affaire de langue, comme un mot.
   *
   * L'anglais n'est pas encore une langue servie pour de bon — ses textes sont
   * de simples jalons —, mais son séparateur est déjà juste : le jour où on
   * ouvrira la langue, il n'y aura rien à retrouver.
   *
   * ATTENTION : c'est un séparateur D'AFFICHAGE. Les valeurs sont gardées avec
   * un POINT, quelle que soit la langue — voir `SelecteurPoids` —, sans quoi
   * changer de langue changerait la façon d'écrire un poids déjà enregistré.
   */
  separateurDecimal: string;
  /**
   * LE NOM DE LA FRACTION DE CHAQUE UNITÉ — ce que vaut le second cran d'un
   * sélecteur. En kilos ce sont des centaines de grammes, en livres des
   * dixièmes : le dire vraiment vaut mieux que « décimale ».
   */
  fractions: Record<Unite, string>;
  /** Les intitulés des groupes d'un écran qui pose deux questions. */
  groupes: {
    langue: string;
    unites: string;
    forme: string;
    traitement: string;
    age: string;
    taille: string;
    nom: string;
    genre: string;
  };
  onboarding: {
    langueUnites: {
      question: string;
    };
    theme: {
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
    traitement: {
      question: string;
    };
    avatar: {
      question: string;
    };
    profil: {
      question: string;
    };
    precedent: string;
    suivant: string;
    /**
     * LE BOUTON DU DERNIER ÉCRAN. Il n'affiche plus ce texte (2026-09-08 :
     * « juste le logo glp1low sur le bouton ») — il porte le mot-symbole
     * dessiné. La phrase reste ici et sert d'`aria-label` : un bouton dont le
     * contenu est un dessin n'a pas de nom pour qui écoute la page.
     */
    entrer: string;
  };
  /** Le bouton « retour » de la barre du bas : lu par les lecteurs d'écran. */
  retour: string;
  oui: string;
  non: string;
  /**
   * LE DÉCOMPTE DES ÉCRANS, pour qui écoute la page : les billes ne se voient
   * pas. Ce texte ne s'affiche jamais.
   */
  progression: string;
  /** Le nom de chaque avatar. Il ne s'affiche pas : il se dit aux lecteurs
   *  d'écran, à qui une pastille ne montre rien. */
  avatars: Record<AvatarId, string>;
  /** Les genres proposés, sous le même contrat que les autres listes. */
  genres: Record<Genre, string>;
  /** Les deux façons de prendre un traitement. Les NOMS des spécialités, eux,
   *  ne se traduisent pas : voir `domaine/traitements.ts`. */
  formes: Record<Forme, string>;
}

export const TEXTES: Record<Langue, Textes> = {
  fr: {
    langues: {
      fr: 'Français',
      en: 'English',
    },
    groupes: {
      langue: 'Langue',
      unites: 'Unités',
      forme: 'Forme',
      traitement: 'Traitement',
      age: 'Âge',
      taille: 'Taille',
      nom: 'Nom',
      genre: 'Genre',
    },
    themes: {
      ciel: 'Ciel',
      'ciel-fonce': 'Ciel foncé',
    },
    objectifs: {
      perdre: 'Perdre du poids',
      stabiliser: 'Stabiliser mon poids',
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
    separateurDecimal: ',',
    fractions: {
      kg: 'Centaines de grammes',
      lb: 'Dixièmes de livre',
      cm: 'Millimètres',
      in: 'Dixièmes de pouce',
    },
    onboarding: {
      langueUnites: {
        question: 'Langue et unités',
      },
      theme: {
        question: 'Choisissez',
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
      traitement: {
        question: 'Avez-vous commencé votre traitement GLP-1 ?',
      },
      avatar: {
        question: 'Choisissez votre avatar',
      },
      profil: {
        question: 'Dernière étape',
      },
      precedent: 'Précédent',
      suivant: 'Suivant',
      entrer: 'Entre dans la galaxie GLP1LOW',
    },
    retour: 'Retour',
    oui: 'Oui',
    non: 'Non',
    progression: 'Avancement du questionnaire',
    avatars: {
      aurore: 'Aurore',
      ocean: 'Océan',
      menthe: 'Menthe',
      prune: 'Prune',
      sable: 'Sable',
      nuit: 'Nuit',
    },
    genres: {
      femme: 'Femme',
      homme: 'Homme',
      'neutre-ou-prive': 'Neutre / Je le garde pour moi',
    },
    formes: {
      injection: 'Injection',
      comprime: 'Comprimé',
    },
  },
  en: {
    langues: {
      fr: 'Français',
      en: 'English',
    },
    groupes: {
      langue: 'Language',
      unites: 'Units',
      forme: 'Form',
      traitement: 'Treatment',
      age: 'Age',
      taille: 'Height',
      nom: 'Name',
      genre: 'Gender',
    },
    themes: {
      ciel: 'Sky',
      'ciel-fonce': 'Dark sky',
    },
    objectifs: {
      perdre: 'Lose weight',
      stabiliser: 'Keep my weight steady',
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
    separateurDecimal: '.',
    fractions: {
      kg: 'Hundreds of grams',
      lb: 'Tenths of a pound',
      cm: 'Millimetres',
      in: 'Tenths of an inch',
    },
    onboarding: {
      langueUnites: {
        question: 'Language and units',
      },
      theme: {
        question: 'Choose',
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
      traitement: {
        question: 'Have you started your GLP-1 treatment?',
      },
      avatar: {
        question: 'Choose your avatar',
      },
      profil: {
        question: 'Last step',
      },
      precedent: 'Previous',
      suivant: 'Next',
      entrer: 'Enter the GLP1LOW galaxy',
    },
    retour: 'Back',
    oui: 'Yes',
    non: 'No',
    progression: 'Questionnaire progress',
    avatars: {
      aurore: 'Dawn',
      ocean: 'Ocean',
      menthe: 'Mint',
      prune: 'Plum',
      sable: 'Sand',
      nuit: 'Night',
    },
    genres: {
      femme: 'Woman',
      homme: 'Man',
      'neutre-ou-prive': 'Neutral / I would rather not say',
    },
    formes: {
      injection: 'Injection',
      comprime: 'Tablet',
    },
  },
};
