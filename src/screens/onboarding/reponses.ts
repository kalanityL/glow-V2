import { AVATAR_INITIAL, type Avatar } from '../../domaine/avatar';
import type { Forme } from '../../domaine/traitements';
import { ANNEE_NAISSANCE_PAR_DEFAUT, TAILLE_PAR_DEFAUT_CM } from '../../domaine/mesures';
import { SYSTEME_PAR_DEFAUT, type Systeme } from '../../domaine/unites';
import { LANGUE_PAR_DEFAUT, type Langue } from '../../i18n/langues';
import { THEME_PAR_DEFAUT, type ThemeId } from '../../themes/themes';

/** Les objectifs proposés, dans l'ordre d'affichage. Le premier est retenu d'avance. */
export const OBJECTIFS = ['perdre', 'stabiliser'] as const;
export type Objectif = (typeof OBJECTIFS)[number];

/**
 * TOUT CE QUE L'ONBOARDING RECUEILLE.
 *
 * Les mesures sont gardées EN TEXTE et AVEC UN POINT, « 95.0 » : c'est ce que
 * rend le sélecteur, et ce que rendrait une saisie libre. Le point n'est pas
 * ce qu'on affiche — le séparateur affiché suit la langue —, c'est la forme
 * stockée, la même dans toutes les langues. Ce qui les lit en aval n'a
 * pas à savoir d'où elles viennent. La conversion en nombre se fera là où on
 * les enregistrera.
 *
 * `null` veut dire « pas encore répondu », et se distingue d'une réponse vide.
 */
export interface Reponses {
  /**
   * LA LANGUE CHOISIE — recueillie, mais PAS ENCORE BRANCHÉE (2026-09-07) :
   * l'application parle toujours la langue qu'elle détecte. Voir
   * `EtapeLangue` pour ce qu'il faudra faire le jour où on la branchera.
   */
  langue: Langue;
  theme: ThemeId;
  systeme: Systeme;
  objectif: Objectif;
  poids: string;
  poidsCible: string;
  /**
   * LE TRAITEMENT, EN TROIS RÉPONSES LIÉES, sur deux écrans.
   *
   * `traitementCommence` vaut « oui » d'avance (2026-09-07) : c'est le cas de
   * la plupart de celles qui installent l'application. Il n'est donc jamais
   * `null` — il y a toujours une réponse.
   *
   * Les trois se défont ensemble : répondre « non » efface la forme et la
   * spécialité, changer de forme efface la spécialité. Sinon on garderait une
   * réponse qui ne correspond plus à la question posée — un comprimé choisi
   * puis une forme passée à « injection ».
   */
  traitementCommence: boolean;
  formeTraitement: Forme | null;
  traitement: string | null;
  /**
   * L'AVATAR, COMPOSÉ ET NON CHOISI (2026-09-08) : c'est la fonctionnalité de
   * GLOW V1. LE GENRE EN FAIT PARTIE — il se voit, sur le vêtement et la
   * coiffure — et n'est donc plus une question de l'écran suivant.
   */
  avatar: Avatar;
  /* Qui l'on est. L'année de naissance et la taille ont un défaut (1980,
     165 cm — demande du 2026-09-09) ; le prénom part vide. LA TAILLE EST
     TOUJOURS EN CENTIMÈTRES ici, quelle que soit l'unité de saisie. */
  anneeNaissance: number;
  tailleCm: number;
  prenom: string;
  /* Le compte. Le mot de passe fait huit signes au moins, et c'est la seule
     contrainte (2026-09-08). */
  email: string;
  motDePasse: string;
}

export const REPONSES_INITIALES: Reponses = {
  langue: LANGUE_PAR_DEFAUT,
  theme: THEME_PAR_DEFAUT,
  systeme: SYSTEME_PAR_DEFAUT,
  objectif: OBJECTIFS[0],
  /* 95,0 par défaut (demande du 2026-09-07) : le sélecteur s'ouvre sur une
     valeur plausible plutôt que sur son premier cran, qui serait 1 kg.

     DEUX CHAMPS SÉPARÉS, ET JAMAIS UN SEUL (mise en garde du 2026-09-07 :
     « pas de mémorisation de poids entre écran poids et ecran poids cible : ce
     ne sont pas les memes valeurs »). Ils partent de la même valeur par
     défaut, ce qui peut donner le change, mais ils ne se touchent jamais :
     choisir 97 au poids actuel laisse le poids visé à 95. Ne JAMAIS les
     fusionner, ni faire partir l'un de l'autre « pour rendre service » — c'est
     précisément ce qu'elle refuse. */
  poids: '95.0',
  poidsCible: '95.0',
  traitementCommence: true,
  formeTraitement: null,
  traitement: null,
  avatar: AVATAR_INITIAL,
  anneeNaissance: ANNEE_NAISSANCE_PAR_DEFAUT,
  tailleCm: TAILLE_PAR_DEFAUT_CM,
  prenom: '',
  email: '',
  motDePasse: '',
};
