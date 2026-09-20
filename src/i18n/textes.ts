import type {
  Coiffure,
  Expression,
  FormeVisage,
  Genre,
} from '../domaine/avatar';
import type { Forme } from '../domaine/traitements';
import type { Zone } from '../domaine/prises';
import type { EntreeConfirmation } from '../screens/PageConfirmation';
import type { Systeme, Unite } from '../domaine/unites';
import type { Langue } from './langues';
import type { Objectif } from '../screens/onboarding/reponses';
import type { ThemeId } from '../themes/themes';
import type { EntreeMenu } from '../app/menu';
import type { ModuleId } from '../app/modules';
import type { EntreeMenuPrincipal, SectionMenu } from '../app/menuPrincipal';
import type { VoletCompte } from '../screens/Compte';
import type { FondId } from '../app/fonds';

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
    /** La date entière, sur le profil ; l'onboarding ne demande que l'année. */
    dateNaissance: string;
    taille: string;
    /** Le poids de départ et l'objectif final, sur « Mon compte » — les
     *  mots de la V1 (2026-09-20, « information mon compte : celles de la
     *  v1 »). */
    poids: string;
    poidsCible: string;
    /** L'âge, lu ; c'est la date de naissance qui s'édite. */
    age: string;
    /** Le médicament prescrit — le traitement, sur « Mon compte ». */
    medicament: string;
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
     * LA DEVISE SOUS LE MOT-SYMBOLE, celle de la V1, telle quelle (2026-09-17,
     * « logo et glp1low comme sur v1 avec ready shine glow en dessous ») :
     * « ready, shine, glow! ». Une devise de marque, en anglais et avec son
     * point d'exclamation : elle ne se traduit pas et ne suit pas la règle
     * des textes d'interface. En DEUX PARTS depuis le 2026-09-20 : la fin,
     * « glow! », se peint en gras et plus clair, comme sur son image.
     */
    devise: { debut: string; fin: string };
    /**
     * LE SALUT, avec le prénom quand il y en a un : « Bonjour Lisa ». Sans
     * point d'exclamation (2026-09-16, « supprime le point d'exclamation »).
     * Une fonction et non une chaîne à assembler dans l'écran : l'ordre du
     * prénom et du mot dépend de la langue. Un prénom vide se tait : « Bonjour ».
     */
    bonjour: (prenom: string) => string;
    /** Les entrées du menu du bas, sous le même contrat que les thèmes. */
    menu: Record<EntreeMenu, string>;
    /** Le titre du tiroir du « + » (2026-09-20). */
    questionAjout: string;
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
  /**
   * LE MENU PRINCIPAL (2026-09-19) : son titre, ses sections et ses entrées.
   * La section « GLP1LOW et vous » porte le mot-symbole dessiné : son texte
   * n'est que la suite, « et vous ».
   */
  menuPrincipal: {
    titre: string;
    sections: Record<SectionMenu, string>;
    entrees: Record<EntreeMenuPrincipal, string>;
  };
  /** LE BLOC DU POIDS (2026-09-20) : ses boutons — enregistrer, et la sortie
   *  sans avoir enregistré. Son titre est le nom de la donnée. */
  blocPoids: {
    enregistrer: string;
    confirmer: string;
  };
  /** LE BLOC « THÈME » (2026-09-20) : son titre, le nom de chaque fond (dit
   *  à qui écoute la page : les cadres se voient), son bouton. */
  blocTheme: {
    titre: string;
    fonds: Record<FondId, string>;
    choisir: string;
    /** La sortie sans avoir choisi, avec un autre fond sous les yeux
     *  (2026-09-20) : confirmer le nouveau fond, ou fermer. */
    confirmer: string;
  };
  /** LA PAGE « MON COMPTE » (2026-09-19, « Mon profil » jusqu'au soir) : son
   *  titre, ses trois volets et leurs onglets, et ce que chaque valeur attend
   *  quand une saisie est refusée. */
  compte: {
    titre: string;
    /** Les onglets du carrousel, figés en bas — des mots courts. */
    onglets: Record<VoletCompte, string>;
    /** Le nom du volet de l'avatar, dit à qui écoute la page. */
    avatar: string;
    /** Le bouton qui enregistre l'avatar composé (2026-09-20). */
    valider: string;
    /** L'âge écrit, « 46 ans » : une tournure, par langue. */
    ageEcrit: (ans: number) => string;
    /**
     * LE BLOC « MON TRAITEMENT » (2026-09-20) : son titre, le choix
     * « Aucun » à côté des deux formes, la valeur lue quand il n'y a pas de
     * traitement, et ses boutons — enregistrer (pas de traitement avant),
     * mettre à jour (il y en avait un), et les deux sorties quand on ferme
     * sans avoir enregistré.
     */
    traitement: {
      titre: string;
      aucun: string;
      enregistrer: string;
      mettreAJour: string;
      terminer: string;
      confirmer: string;
    };
    /** La règle d'une date : dite au refus, dans l'écriture de la langue. */
    regleDate: string;
    /** La règle d'un poids, avec ses bornes et son unité. */
    reglePoids: (min: number, max: number, unite: string) => string;
    /** La règle d'une taille, avec ses bornes et son unité. */
    regleTaille: (min: number, max: number, unite: string) => string;
  };
  /**
   * LA PAGE D'UNE PRISE (2026-09-20, « ajouter->injection : envoie vers une
   * page ultra simple avec uniquement le formulaire d'ajout d'injection de
   * la v1 avec la meme mise en page ») : le titre du formulaire selon la
   * forme, les zones, les paliers écrits, les liens et le bouton — les mots
   * de la V1.
   */
  prise: {
    titre: Record<Forme, string>;
    /** Le titre en modification — les mots de la V1 (`InjectionForm.tsx`). */
    titreModification: Record<Forme, string>;
    zones: Record<Zone, string>;
    /** Un palier écrit : « 0,25 mg (Initiation) », « 2,4 mg (Dose max) »,
        « 1 mg » entre les deux. */
    palier: (mg: string, rang: 'initiation' | 'max' | null) => string;
    autreDose: string;
    prereglages: string;
    /** Le champ de l'autre dose, vide. */
    autreDoseVide: string;
    notes: string;
    masquerNotes: string;
    /** Le champ des notes, vide. */
    notesVide: string;
    valider: string;
    /** La règle de la dose, dite au refus. */
    regleDose: string;
    /** La proposition, quand on touche le nom du traitement (2026-09-20). */
    mettreAJour: string;
    /** EN MODIFICATION (2026-09-20, « réouvre le formulaire avec les données
        enregistrées par defaut, et bouton annuler et mettre à jour ») : ses
        deux boutons. */
    annuler: string;
    mettreAJourPrise: string;
  };
  /**
   * L'ÉCRAN DE CONFIRMATION D'UNE PRISE (2026-09-20, son image) : le titre
   * selon la forme, le sous-titre, la ligne de la zone, le titre de la liste
   * (« que souhaitez vous -> vous pouvez maintenant : »), et les cinq
   * entrées avec leur sous-titre.
   */
  confirmation: {
    titre: Record<Forme, string>;
    /** Le titre après une modification (2026-09-20, « Message de validation
        devient "Injection mise à jour" »). */
    titreMiseAJour: Record<Forme, string>;
    sousTitre: string;
    zone: string;
    maintenant: string;
    /** Les entrées, sans sous-titre (2026-09-20, « pas de sous titre »). */
    entrees: Record<EntreeConfirmation, string>;
  };
  /** LE CALENDRIER d'un choix de date (2026-09-20) : les mois, les jours en
   *  court, lundi en premier, et les deux flèches dites à qui écoute. */
  calendrier: {
    mois: readonly string[];
    jours: readonly string[];
    moisPrecedent: string;
    moisSuivant: string;
  };
  /** Le bouton « retour » de la barre du bas : lu par les lecteurs d'écran. */
  retour: string;
  /** La croix qui ferme un tiroir : lue par les lecteurs d'écran. */
  fermer: string;
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
    dateNaissance: 'Date de naissance',
    taille: 'Taille',
    poids: 'Poids de départ',
    poidsCible: 'Objectif',
    age: 'Âge',
    medicament: 'Médicament prescrit',
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
    devise: { debut: 'ready, shine, ', fin: 'glow!' },
    bonjour: (prenom) => (prenom.trim() ? `Bonjour ${prenom.trim()}` : 'Bonjour'),
    menu: {
      accueil: 'Accueil',
      journal: 'Journal',
      ajouter: 'Ajouter',
      analyse: 'Analyse',
      menu: 'Menu',
    },
    questionAjout: 'Que souhaitez-vous ajouter ?',
    modules: {
      traitement: 'Traitement',
      balance: 'Balance',
      /* Majuscules aux seconds mots (2026-09-16, « majuscule à secondaire
         physique temps et soit ») — la graphie des catégories de badges de
         la V1 (« Activité Physique », « Un Temps pour Soi »). */
      'effets-secondaires': 'Effets Secondaires',
      menus: 'Menus',
      marche: 'Marche',
      'activite-physique': 'Activité Physique',
      sommeil: 'Sommeil',
      'temps-pour-soi': 'Un Temps pour Soi',
    },
    traitement: {
      injection: 'Injections',
      comprime: 'Comprimé',
    },
  },
  menuPrincipal: {
    titre: 'Menu',
    sections: {
      preferences: 'Préférences',
      /* Renommages du 2026-09-20 : « Export » → « Exporter un rapport » puis
         « Exporter un bilan » le même jour,
         « Activation Modules » → « Modules », « Thème et couleurs » →
         « Couleurs », « Nouveau rapport médical » → « Créer », « Rapports
         disponibles » → « Disponibles ». */
      export: 'Exporter un bilan',
      glowEtVous: 'et vous',
    },
    entrees: {
      modules: 'Modules',
      notifications: 'Notifications',
      theme: 'Couleurs',
      badges: 'Badges',
      nouveauRapport: 'Créer',
      rapports: 'Disponibles',
      compte: 'Mon compte',
      avis: 'Avis et Feedback',
      sondage: 'Sondage',
      faq: 'FAQ',
      ciel: 'Ciel',
    },
  },
  blocPoids: {
    /* « OK » (2026-09-20, « bouton ok »). */
    enregistrer: 'OK',
    confirmer: 'Confirmer la mise à jour',
  },
  blocTheme: {
    titre: 'Thème',
    /* Ses deux photos (2026-09-20 au soir) : les identifiants sont restés
       — `fond` est une réponse enregistrée —, les noms suivent les images. */
    fonds: {
      photo: 'Fleurs',
      ciel: 'Brasserie',
    },
    choisir: 'Choisir',
    confirmer: 'Confirmer le nouveau fond',
  },
  compte: {
    titre: 'Mon compte',
    onglets: {
      informations: 'Informations',
      avatar: 'Avatar',
      compte: 'Mon compte',
    },
    avatar: 'Mon avatar',
    valider: 'Valider',
    ageEcrit: (ans) => `${ans} ans`,
    traitement: {
      titre: 'Mon traitement',
      aucun: 'Aucun',
      enregistrer: 'Enregistrer',
      mettreAJour: 'Mettre à jour',
      terminer: 'Terminer la mise à jour',
      confirmer: 'Confirmer la mise à jour',
    },
    regleDate: 'Une date, en JJ/MM/AAAA',
    reglePoids: (min, max, unite) => `Un poids entre ${min} et ${max} ${unite}`,
    regleTaille: (min, max, unite) => `Une taille entre ${min} et ${max} ${unite}`,
  },
  prise: {
    titre: {
      injection: 'Nouvelle injection',
      comprime: 'Nouvelle prise de comprimé',
    },
    titreModification: {
      injection: 'Modifier l’injection',
      comprime: 'Modifier la prise',
    },
    /* Les zones de la V1, avec leurs majuscules. */
    zones: {
      'abdomen-gauche': 'Abdomen Gauche',
      'abdomen-droit': 'Abdomen Droit',
      'cuisse-gauche': 'Cuisse Gauche',
      'cuisse-droite': 'Cuisse Droite',
      'bras-gauche': 'Bras Gauche',
      'bras-droit': 'Bras Droit',
      'voie-orale': 'Prise Orale',
    },
    palier: (mg, rang) =>
      `${mg} mg${rang === 'initiation' ? ' (Initiation)' : rang === 'max' ? ' (Dose max)' : ''}`,
    autreDose: 'Autre dose',
    prereglages: 'Préréglages',
    autreDoseVide: 'Autre dose de GLP-1 (mg)',
    notes: 'Notes',
    masquerNotes: 'Masquer les notes',
    notesVide: 'Notes / Observations (facultatif)',
    valider: 'Valider',
    regleDose: 'Une dose en mg, supérieure à zéro',
    mettreAJour: 'Mettre à jour le traitement ?',
    annuler: 'Annuler',
    mettreAJourPrise: 'Mettre à jour',
  },
  confirmation: {
    titre: {
      injection: 'Injection enregistrée !',
      comprime: 'Prise enregistrée !',
    },
    titreMiseAJour: {
      injection: 'Injection mise à jour !',
      comprime: 'Prise mise à jour !',
    },
    sousTitre: 'Votre suivi est à jour.',
    zone: 'Zone d’injection',
    maintenant: 'Vous pouvez maintenant :',
    /* Ses mots du 2026-09-20 : « voir la concentration -> concentration
       sanguine ; voir l'évolution : Evolution du traitement ». */
    entrees: {
      ajouter: 'Ajouter un autre élément',
      journal: 'Voir dans le journal',
      concentration: 'Concentration sanguine',
      evolution: 'Évolution du traitement',
      accueil: 'Retour à l’accueil',
    },
  },
  calendrier: {
    mois: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    jours: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    moisPrecedent: 'Mois précédent',
    moisSuivant: 'Mois suivant',
  },
  retour: 'Retour',
  fermer: 'Fermer',
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
