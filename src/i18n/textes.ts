import type {
  Coiffure,
  Expression,
  FormeVisage,
  Genre,
} from '../domaine/avatar';
import type { Forme } from '../domaine/traitements';
import type { Systeme, Unite } from '../domaine/unites';
import type { Langue } from './langues';
import type { Objectif } from '../screens/onboarding/reponses';
import type { ThemeId } from '../themes/themes';
import type { EntreeMenu } from '../app/menu';
import type { ModuleId } from '../app/modules';

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
 *     compilation et non un trou découvert à l'écran — pour l'instant, seul
 *     le français est écrit, et l'anglais le lit (voir `TEXTES`) ;
 *   - REACT NATIVE : ce fichier est du TypeScript pur, sans rien du navigateur.
 *     Il partira tel quel dans le paquet natif.
 *
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
    anneeNaissance: string;
    taille: string;
    prenom: string;
    email: string;
    motDePasse: string;
    genre: string;
    peau: string;
    cheveux: string;
    yeux: string;
    coiffure: string;
    visage: string;
    expression: string;
    lunettes: string;
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
      /** La règle du mot de passe, dite avant la faute et non après. */
      regleMotDePasse: string;
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
  /** L'ACCUEIL (2026-09-16) : l'entête, le salut, le menu du bas. */
  accueil: {
    /**
     * LE SALUT, avec le prénom quand il y en a un : « Bonjour Lisa ». Sans
     * point d'exclamation (2026-09-16, « supprime le point d'exclamation »).
     * Une fonction et non une chaîne à assembler dans l'écran : l'ordre du
     * prénom et du mot dépend de la langue. Un prénom vide se tait : « Bonjour ».
     */
    bonjour: (prenom: string) => string;
    /** Les entrées du menu du bas, sous le même contrat que les thèmes. */
    menu: Record<EntreeMenu, string>;
    /**
     * LES SEPT MODULES, écrits dans leur cercle (2026-09-16, « dans les
     * cercle sous les icones le nom ds catégories »). Le nom du traitement
     * est celui de `traitement`, selon la forme : celui-ci est le nom
     * quand rien n'est répondu.
     */
    modules: Record<ModuleId, string>;
    /** Le nom du module du traitement selon sa forme (VOCABULAIRE : « Injections »
     *  au pluriel pour la rubrique, « Comprimé » sous forme orale). */
    traitement: Record<Forme, string>;
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
  /** Les réglages de l'avatar. Les COULEURS n'ont pas de libellé visible — une
   *  pastille se voit —, mais leur nom se dit à qui écoute la page. */
  genres: Record<Genre, string>;
  coiffures: Record<Coiffure, string>;
  formesVisage: Record<FormeVisage, string>;
  expressions: Record<Expression, string>;
  couleurs: Record<string, string>;
  /** Les deux façons de prendre un traitement. Les NOMS des spécialités, eux,
   *  ne se traduisent pas : voir `domaine/traitements.ts`. */
  formes: Record<Forme, string>;
}

/** LE DICTIONNAIRE FRANÇAIS — le seul écrit. */
const FR: Textes = {
  langues: {
    fr: 'Français',
    en: 'English',
  },
  groupes: {
    langue: 'Langue',
    unites: 'Unités',
    forme: 'Forme',
    traitement: 'Traitement',
    anneeNaissance: 'Année de naissance',
    taille: 'Taille',
    prenom: 'Prénom',
    email: 'Adresse e-mail',
    motDePasse: 'Mot de passe',
    genre: 'Genre',
    peau: 'Peau',
    cheveux: 'Cheveux',
    yeux: 'Yeux',
    coiffure: 'Coiffure',
    visage: 'Visage',
    expression: 'Expression',
    lunettes: 'Lunettes',
  },
  themes: {
    ciel: 'Ciel',
    'ciel-fonce': 'Ciel foncé',
    blanc: 'Blanc',
    'degrade-doux': 'Dégradé doux',
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
      question: 'Composez votre avatar',
    },
    profil: {
      question: 'Dernière étape',
      regleMotDePasse: 'Huit caractères au moins.',
    },
    precedent: 'Précédent',
    suivant: 'Suivant',
    entrer: 'Entre dans la galaxie GLP1LOW',
  },
  accueil: {
    bonjour: (prenom) => (prenom.trim() ? `Bonjour ${prenom.trim()}` : 'Bonjour'),
    menu: {
      accueil: 'Accueil',
      journal: 'Journal',
      ajouter: 'Ajouter',
      analyse: 'Analyse',
      profil: 'Profil',
    },
    modules: {
      traitement: 'Traitement',
      balance: 'Balance',
      'effets-secondaires': 'Effets secondaires',
      menus: 'Menus',
      'activite-physique': 'Activité physique',
      sommeil: 'Sommeil',
      'temps-pour-soi': 'Un temps pour soi',
    },
    traitement: {
      injection: 'Injections',
      comprime: 'Comprimé',
    },
  },
  retour: 'Retour',
  oui: 'Oui',
  non: 'Non',
  progression: 'Avancement du questionnaire',
  genres: {
    femme: 'Femme',
    homme: 'Homme',
    neutre: 'Neutre',
  },
  coiffures: {
    court: 'Courts',
    long: 'Longs',
    boucle: 'Bouclés',
    frange: 'Frange',
    brosse: 'En brosse',
    chauve: 'Sans cheveux',
  },
  formesVisage: {
    ovale: 'Ovale',
    rond: 'Rond',
    carre: 'Carré',
    coeur: 'Cœur',
  },
  expressions: {
    joyeuse: 'Joyeuse',
    determinee: 'Déterminée',
    fiere: 'Fière',
    calme: 'Calme',
  },
  couleurs: {
    '#FFE5D9': 'Clair',
    '#F7D1BA': 'Beige',
    '#E8AC80': 'Doré',
    '#B57E58': 'Café',
    '#724A30': 'Chocolat',
    '#43291F': 'Ébène',
    '#4682B4': 'Bleu',
    '#2E8B57': 'Vert d’eau',
    '#CD853F': 'Noisette',
    '#5C3A21': 'Brun intense',
    '#708090': 'Gris azur',
    '#E9C46A': 'Blond',
    '#4E3629': 'Brun',
    '#8D5B4C': 'Châtain',
    '#1A1A1A': 'Noir',
    '#E76F51': 'Roux',
    '#DFE2E6': 'Gris polaire',
  },
  formes: {
    injection: 'Injection',
    comprime: 'Comprimé',
  },
};

/**
 * ON NE FAIT QUE LE FRANÇAIS POUR L'INSTANT (2026-09-16, « ne t'occupe pas du
 * bilingue on ne fait que le francais » ; « si anglai choisi pour l'instant on
 * tombe aussi sur le francais ») : l'entrée anglaise LIT le dictionnaire
 * français. Le squelette multilingue reste entier — le type exige toujours
 * chaque langue, `detecterLangue` sert toujours l'anglais d'un lecteur
 * anglophone —, mais il reçoit les mots français. Le jour où l'anglais
 * s'écrira, c'est un second dictionnaire à poser ici, et rien d'autre. Les
 * jalons anglais écrits jusqu'à ce jour sont dans l'historique (`349ea8e`).
 */
export const TEXTES: Record<Langue, Textes> = {
  fr: FR,
  en: FR,
};
