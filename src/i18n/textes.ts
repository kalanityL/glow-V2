import type {
  Coiffure,
  Expression,
  FormeVisage,
  Genre,
} from '../domaine/avatar';
import type { Forme } from '../domaine/traitements';
import type { RefusConnexion } from '../domaine/connexion';
import type { JourRelatif } from '../domaine/dates';
import type { Zone } from '../domaine/prises';
import type { SleepKind } from '../donnees/v1';
import type { CategorieActivite, Intensite } from '../domaine/activites';
import type { EntreeConfirmation, Origine } from '../screens/PageConfirmation';
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
    /** Les zones en court, sur les boutons (2026-09-21, « Abdomen G/D - bras
        G/D - cuisse G/D : ou g d valent pour gauche et droite »). */
    zonesCourtes: Record<Zone, string>;
    /** L'intitulé au-dessus des boutons de zone. */
    zone: string;
    /** Le bouton du dosage personnalisé. */
    autre: string;
    /** Un palier écrit : « 0,25 mg (Initiation) », « 2,4 mg (Dose max) »,
        « 1 mg » entre les deux. */
    palier: (mg: string, rang: 'initiation' | 'max' | null) => string;
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
  /** LA PAGE D'UNE PESÉE (2026-09-21, « ajouter balance : idem que ajouter
   *  injection ») : ses titres — les mots de la V1 —, et la question quand
   *  le jour est déjà pesé (SPEC : au plus une pesée par jour). */
  pesee: {
    titre: string;
    titreModification: string;
    /** Le message de la V1, avec la date écrite, et la question. */
    remplacer: (date: string) => string;
  };
  /** LA PAGE D'UNE ACTIVITÉ PHYSIQUE (2026-09-25, « on va créer la page
   *  ajouter une activité physique ») : le titre de la liste des
   *  catégories, et le nom de chacune — les neuf de son tri du Compendium. */
  activite: {
    /** Le bandeau du formulaire (2026-09-25, « nouvelle activité physique
        est un formulaire, comme nouvelle injection »), et en modification. */
    titre: string;
    titreModification: string;
    /** La durée « Autre » refusée. */
    regleDuree: string;
    /** Le champ de recherche (2026-09-25, son image) : ce qu'il propose,
        la croix qui l'efface (dite à qui écoute), le titre des résultats,
        et l'absence de résultat. */
    rechercher: string;
    effacerRecherche: string;
    resultats: string;
    aucunResultat: string;
    categories: string;
    /** Les sports des dernières séances, sous les catégories (2026-09-26). */
    recents: string;
    categorie: Record<CategorieActivite, string>;
    /** Un sport choisi (2026-09-25) : la durée et ses choix, « Autre » et
        la saisie en minutes, l'intensité (ses trois niveaux dits à qui
        écoute, sans mot à l'écran), ou la distance. */
    duree: string;
    durees: Record<'15' | '30' | '45' | '60', string>;
    autreDuree: string;
    dureeMinutes: string;
    intensite: string;
    intensites: Record<Intensite, string>;
    ouDistance: string;
    distanceKm: string;
    /** Les deux onglets quand le sport accepte une distance (2026-09-25,
        « systeme d'onglet : un onglet intensite un onglet distance »), et
        l'unité écrite sous le cadran. */
    onglets: Record<'intensite' | 'distance' | 'marches' | 'etages', string>;
    km: string;
    /** Ce que la saisie des minutes propose, à la place de « Autre » : court, la case est étroite. */
    minutes: string;
    /** La distance tapée au chiffre (2026-09-25 au soir) : ce qu'elle attend. */
    regleDistance: string;
    /** L'escalier (le même soir, « escalier : durée / nombre de marche /
        nombre d'étages ») : les deux saisies. */
    nombreDeMarches: string;
    nombreDEtages: string;
  };
  /** LA PAGE D'UN SOMMEIL (2026-09-21, « fais moi l'écran nouveau sommeil et
   *  confirmation ») : le formulaire de la V1 (`SleepForm.tsx`) et ses
   *  règles (`useSleepForm.ts`), dans ses mots. */
  sommeil: {
    titre: string;
    titreModification: string;
    natures: Record<SleepKind, string>;
    endormissement: string;
    reveil: string;
    /** La durée écrite en phrase : « Durée : 8 h 05 » (2026-09-21 au soir,
        « 8 h 05 de sommeil-> Durée : xx ») — et le mot seul, avant, pour
        l'écran, où la durée garde sa largeur fixe. */
    duree: (duree: string) => string;
    dureeAvant: string;
    /** Sur le troisième écran : « nuit de 7 h 15 », « sieste de 1 h »
        (2026-09-21). */
    natureDe: (nature: SleepKind, duree: string) => string;
    /** « Notez la qualité de ce sommeil » (2026-09-21 au soir) ; la nature
        reste passée, le jour où la phrase la nommerait. */
    qualite: (nature: SleepKind) => string;
    /** Les six crans, de 0 à 5. */
    qualites: readonly string[];
    refusDureeNulle: string;
    questionLongue: (nature: SleepKind, duree: string) => string;
    refusRecouvrement: (plage: string, modification: boolean) => string;
    refusPlafond: (plafond: number) => string;
    /** Le bouton, la question des douze heures armée. */
    confirmerChoix: string;
    mettreAJour: string;
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
    /** Les titres de l'écran d'une pesée (2026-09-21). */
    titrePesee: string;
    titrePeseeMiseAJour: string;
    titreSommeil: string;
    titreSommeilMiseAJour: string;
    /** La confirmation d'une activité physique (2026-09-25). */
    titreActivite: string;
    titreActiviteMiseAJour: string;
    sousTitre: string;
    zone: string;
    maintenant: string;
    /** Le premier choix, « Retourner à » l'endroit d'où l'on vient
        (2026-09-23). */
    retourVers: Record<Origine, string>;
    /** Les entrées, sans sous-titre (2026-09-20, « pas de sous titre »). */
    entrees: Record<EntreeConfirmation, string>;
  };
  /** LE CALENDRIER d'un choix de date (2026-09-20) : les mois, les jours en
   *  court, lundi en premier, et les deux flèches dites à qui écoute.
   *  `joursAbreges` est la forme à trois lettres de la vue « Semaine » du
   *  journal (2026-09-26, son template) ; `jours` reste la lettre seule du
   *  calendrier, où sept colonnes étroites ne tiennent rien de plus. */
  calendrier: {
    mois: readonly string[];
    jours: readonly string[];
    joursAbreges: readonly string[];
    joursEntiers: readonly string[];
    moisPrecedent: string;
    moisSuivant: string;
  };
  /**
   * LES JOURS QUI ONT UN MOT (2026-09-21 au soir, « pour les dates : hier /
   * avant hier / aujourd'hui / demain / apres demain / sinon la date ») : nés
   * dans le formulaire du sommeil, ils servent partout où une date se lit —
   * le journal les emploie pour ses titres de journée. Un seul jeu de mots,
   * pour qu'il n'y ait pas deux vérités.
   */
  joursRelatifs: Record<JourRelatif, string>;
  /**
   * LA PAGE JOURNAL (2026-09-26, « On va faire la page journal », ses
   * templates `Images-pour-claude/templates/journal/`) : le calendrier et ses
   * deux vues, le filtre par catégorie, les deux modes d'affichage, et ce
   * qu'une entrée dit d'elle-même.
   */
  journal: {
    /** Les deux vues du calendrier (« header-vue clendrier.png »). */
    vues: Record<'semaine' | 'mois', string>;
    /** Le bouton qui ouvre le tiroir du filtre, son titre, son intitulé de
        groupe et le lien qui recoche tout. */
    filtrer: string;
    /** L'INDICATEUR DU BOUTON (2026-09-26, « ajouter un indicateur sur le
        bouton pour filtrer qui indique si un filtre es tmis ou non ») : la
        pastille porte le nombre de catégories retenues ; la phrase dit la
        même chose à qui écoute la page, et l'autre dit qu'il n'y a pas de
        filtre. */
    filtreMis: (retenues: number, total: number) => string;
    filtreAucun: string;
    /** LA RANGÉE DU PIED DU TIROIR (2026-09-26, « filtrer : gros bouton
        annuler / fermer en bas ») : « Annuler » rend le filtre tel qu'il
        était en ouvrant ; « Fermer » garde celui qu'on vient de poser. */
    annuler: string;
    reinitialiser: string;
    categories: string;
    /** LES DEUX MODES (« switch mode-grille-ligne.png ») : les boutons n'ont
        pas de mot à l'écran, leur nom se dit à qui écoute la page. */
    modes: Record<'liste' | 'grille', string>;
    /** Le compte du bandeau de mode : « 6 entrées », « 1 entrée » — et
        « Aucune entrée », jamais « 0 entrée » (VOCABULAIRE § 3). */
    entrees: (nombre: number) => string;
    /** Rien à montrer : le filtre ne laisse rien passer. */
    aucuneCategorie: string;
    /** LE BOUT DE LA FENÊTRE (2026-09-26, « qd on arrive à + ou - 6 mois on a
        dans un sens comme dans l'autre un "voir plus" qui charge les 6 mois
        (maximum) précédents ou suivant ») : le bouton de chaque bout. Aux
        bornes (dix ans en arrière, un an en avant), il n'y en a plus.  */
    voirPlus: string;
    /** Le « + » d'une journée sans rien, qui déplie son écran d'ajout, et la
        croix qui le replie : dits à qui écoute, ils n'ont pas de mot. */
    deplierJour: string;
    replierJour: string;
    /** L'ÉCRAN D'UN JOUR VIDE (2026-09-26, son image et sa dictée : « texte :
        aucune entrée au xxxdatexx. Ajouter : ... ») : la phrase avec la date
        du jour regardé, puis l'invitation au-dessus des sept cases. */
    aucuneEntreeLe: (date: string) => string;
    ajoutezUneEntree: string;
    /** Le détail d'un sommeil : sa qualité, telle que la V1 la note. */
    qualite: (note: number) => string;
  };
  /**
   * L'ÉCRAN DE CONNEXION (2026-09-21, « brancher sur la v2 en ligne la
   * meme identification que la v1 et utiliser les memes comptes ») : les
   * mots de la page de connexion de la V1 (`LoginPage.tsx`), et ses refus
   * (`auth.errors.ts`), un par code du SDK — le générique en dernier.
   */
  connexion: {
    chapeau: string;
    seConnecter: string;
    ou: string;
    google: string;
    note: string;
    /** Les deux champs vides : dit avant d'appeler qui que ce soit. */
    champsVides: string;
    refus: Record<RefusConnexion, string>;
    /** Le lien qui oublie la session, sur « Mon compte ». */
    seDeconnecter: string;
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
      vide: 'Aucun',
      photo: 'Fleurs',
      ciel: 'Brasserie',
      /* Les noms de sa planche (2026-09-20 au soir). */
      'nature-printaniere': 'Nature printanière',
      'coucher-de-soleil': 'Coucher de soleil',
      'bord-de-mer': 'Bord de mer',
      foret: 'Forêt',
      'cafe-parisien': 'Café parisien',
      'nuit-etoilee': 'Nuit étoilée',
      'minimaliste-clair': 'Minimaliste clair',
      aquarelle: 'Aquarelle',
      montagnes: 'Montagnes',
      'abstrait-glow': 'Abstrait glow',
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
      abdomen_gauche: 'Abdomen Gauche',
      abdomen_droit: 'Abdomen Droit',
      cuisse_gauche: 'Cuisse Gauche',
      cuisse_droite: 'Cuisse Droite',
      bras_gauche: 'Bras Gauche',
      bras_droit: 'Bras Droit',
      prise_orale: 'Prise Orale',
    },
    zonesCourtes: {
      abdomen_gauche: 'Abdomen G',
      abdomen_droit: 'Abdomen D',
      bras_gauche: 'Bras G',
      bras_droit: 'Bras D',
      cuisse_gauche: 'Cuisse G',
      cuisse_droite: 'Cuisse D',
      prise_orale: 'Prise orale',
    },
    zone: 'Zone d’injection',
    autre: 'Autre',
    palier: (mg, rang) =>
      `${mg} mg${rang === 'initiation' ? ' (Initiation)' : rang === 'max' ? ' (Dose max)' : ''}`,
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
  pesee: {
    titre: 'Nouvelle pesée',
    titreModification: 'Modifier la pesée',
    remplacer: (date) => `Une saisie existe déjà le ${date}. La mettre à jour ?`,
  },
  activite: {
    titre: 'Nouvelle activité physique',
    titreModification: 'Modifier l’activité physique',
    regleDuree: 'Une durée en minutes est attendue.',
    rechercher: 'Rechercher une activité',
    effacerRecherche: 'Effacer la recherche',
    resultats: 'Résultats de recherche',
    aucunResultat: 'Aucune activité ne répond à ce mot.',
    categories: 'Catégories',
    recents: 'Récents',
    /* Ses neuf catégories, ses mots (24 et 25 septembre 2026). */
    categorie: {
      'ballon-et-balles': 'Ballon et balles',
      raquettes: 'Raquettes',
      roues: 'Roues',
      pedestre: 'Pédestre',
      cheval: 'Cheval',
      individuel: 'Individuel',
      aquatiques: 'Activités aquatiques',
      hivernales: 'Activités hivernales',
      autre: 'Autre',
    },
    duree: 'Durée',
    durees: { '15': '15 min', '30': '30 min', '45': '45 min', '60': '1 h' },
    autreDuree: 'Autre',
    dureeMinutes: 'Durée en minutes',
    intensite: 'Intensité',
    /* Les mots de la V1 pour l'intensité ressentie. */
    intensites: { douce: 'Douce', moderee: 'Modérée', intensive: 'Intensive' },
    ouDistance: 'ou une distance',
    distanceKm: 'Distance en km',
    onglets: { intensite: 'Intensité', distance: 'Distance', marches: 'Marches', etages: 'Étages' },
    km: 'km',
    minutes: 'Minutes',
    regleDistance: 'Une distance en kilomètres est attendue.',
    nombreDeMarches: 'Nombre de marches',
    nombreDEtages: 'Nombre d’étages',
  },
  sommeil: {
    titre: 'Nouveau sommeil',
    titreModification: 'Modifier le sommeil',
    natures: { nuit: 'Nuit', sieste: 'Sieste' },
    endormissement: 'Endormissement',
    reveil: 'Réveil',
    /* « Durée : 8 h 05 » (2026-09-21 au soir, « 8 h 05 de sommeil-> Durée :
       xx ») — « 13 h de sommeil » a vécu la journée. */
    duree: (duree) => `Durée : ${duree}`,
    dureeAvant: 'Durée :',
    natureDe: (nature, duree) => `${nature === 'nuit' ? 'nuit' : 'sieste'} de ${duree}`,
    /* « Notez la qualité de ce sommeil », nuit ou sieste (2026-09-21 au
       soir, « Notez votre nuit-> notez la qualité de ce sommeil ») —
       « Notez votre nuit » / « Notez votre sieste » ont vécu la journée. */
    qualite: () => 'Notez la qualité de ce sommeil',
    qualites: ['Très mauvaise', 'Mauvaise', 'Passable', 'Correcte', 'Bonne', 'Excellente'],
    refusDureeNulle: 'L’heure de réveil et l’heure d’endormissement sont identiques : aucune durée de sommeil à enregistrer.',
    questionLongue: (nature, duree) =>
      `Êtes-vous sûre de vouloir enregistrer ${nature === 'nuit' ? 'une nuit' : 'une sieste'} de ${duree} ? Sinon, vérifiez les dates et heures d’endormissement et de réveil.`,
    refusRecouvrement: (plage, modification) =>
      `Deux sommeils ne peuvent pas se recouvrir : cette plage recoupe le sommeil déjà enregistré ${plage}. ${
        modification ? 'La modification n’a pas été enregistrée : la ligne garde ses valeurs d’avant.' : 'Rien n’a été enregistré.'
      }`,
    refusPlafond: (plafond) => `Limite atteinte pour cette journée : ${plafond} saisies de sommeil au maximum. Rien n’a été enregistré.`,
    confirmerChoix: 'Confirmer mon choix',
    mettreAJour: 'Mettre à jour le sommeil',
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
    titrePesee: 'Pesée enregistrée !',
    /* « Balance mise à jour ! » (2026-09-21 au soir, « Pesée mise à jour
       !->Balance mise à jour ! ») — le nom de la page (VOCABULAIRE :
       « LE titre de la page est balance, donc balance »). */
    titrePeseeMiseAJour: 'Balance mise à jour !',
    titreSommeil: 'Sommeil enregistré !',
    titreSommeilMiseAJour: 'Sommeil mis à jour !',
    titreActivite: 'Activité physique enregistrée !',
    titreActiviteMiseAJour: 'Activité physique mise à jour !',
    sousTitre: 'Votre suivi est à jour.',
    zone: 'Zone d’injection',
    maintenant: 'Vous pouvez maintenant :',
    /* « "retourner à"+ l endroit d'ou vient » (2026-09-23) : l'accueil, ou
       la page « Mon compte », par son nom. */
    retourVers: {
      accueil: 'Retourner à l’accueil',
      compte: 'Retourner à Mon compte',
    },
    /* Ses mots du 2026-09-20 : « voir la concentration -> concentration
       sanguine ; voir l'évolution : Evolution du traitement ». */
    entrees: {
      ajouter: 'Ajouter un autre élément',
      journal: 'Voir dans le journal',
      concentration: 'Concentration sanguine',
      evolution: 'Évolution du traitement',
      evolutionPoids: 'Évolution du poids',
      evolutionSommeil: 'Évolution du sommeil',
      evolutionActivite: 'Évolution de l’activité physique',
    },
  },
  calendrier: {
    mois: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    jours: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    /* La vue « Semaine » du journal (2026-09-26, son template) : sept cartes
       larges, où le jour tient en entier abrégé. */
    joursAbreges: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    /* Le titre d'une journée du journal : « Mardi 16 septembre ». La
       capitale initiale est ici, pas fabriquée par l'écran. */
    joursEntiers: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    moisPrecedent: 'Mois précédent',
    moisSuivant: 'Mois suivant',
  },
  joursRelatifs: {
    avantHier: 'Avant-hier',
    hier: 'Hier',
    aujourdhui: 'Aujourd’hui',
    demain: 'Demain',
    apresDemain: 'Après-demain',
  },
  journal: {
    vues: { semaine: 'Semaine', mois: 'Mois' },
    filtrer: 'Filtrer',
    filtreMis: (retenues, total) => `Filtrer — ${retenues} catégories sur ${total}`,
    filtreAucun: 'Filtrer — toutes les catégories',
    annuler: 'Annuler',
    reinitialiser: 'Réinitialiser',
    categories: 'Catégories',
    modes: { liste: 'Voir en liste', grille: 'Voir en grille' },
    /* « Aucune entrée », jamais « 0 entrée » (VOCABULAIRE § 3 : une famille
       à zéro se tait). */
    entrees: (nombre) => (nombre === 0 ? 'Aucune entrée' : nombre === 1 ? '1 entrée' : `${nombre} entrées`),
    aucuneCategorie: 'Aucune catégorie retenue.',
    voirPlus: 'Voir plus',
    deplierJour: 'Ajouter une entrée ce jour-là',
    replierJour: 'Replier',
    /* Sa tournure, telle qu'elle l'a dictée (« aucune entrée au
       xxxdatexx »), avec le point final que le projet met à ses phrases. */
    aucuneEntreeLe: (date) => `Aucune entrée au ${date}.`,
    ajoutezUneEntree: 'Ajoutez une entrée',
    qualite: (note) => `Qualité ${note}`,
  },
  connexion: {
    chapeau: 'Accès privé — connectez-vous pour continuer',
    seConnecter: 'Se connecter',
    ou: 'ou',
    google: 'Continuer avec Google',
    note: 'Les comptes sont créés par l’administratrice — pas d’inscription libre.',
    champsVides: 'Renseignez l’e-mail et le mot de passe.',
    refus: {
      adresse: 'L’adresse e-mail n’est pas valide.',
      identifiants: 'E-mail ou mot de passe incorrect.',
      compteDesactive: 'Ce compte a été désactivé.',
      tropDEssais: 'Trop de tentatives. Réessayez dans quelques minutes.',
      reseau: 'Connexion impossible. Vérifiez votre accès à Internet.',
      fenetreFermee: 'La fenêtre Google a été refermée avant la fin.',
      fenetreBloquee: 'Le navigateur a bloqué la fenêtre Google. Autorisez les pop-ups puis réessayez.',
      domaine: 'Ce domaine n’est pas autorisé dans la console Firebase.',
      autre: 'La connexion a échoué. Réessayez.',
    },
    seDeconnecter: 'Se déconnecter',
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
