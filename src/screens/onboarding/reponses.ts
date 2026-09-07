import type { Forme } from '../../domaine/traitements';
import { SYSTEME_PAR_DEFAUT, type Systeme } from '../../domaine/unites';
import { LANGUE_PAR_DEFAUT, type Langue } from '../../i18n/langues';
import { THEME_PAR_DEFAUT, type ThemeId } from '../../themes/themes';

/** Les objectifs proposés, dans l'ordre d'affichage. Le premier est retenu d'avance. */
export const OBJECTIFS = ['perdre', 'stabiliser'] as const;
export type Objectif = (typeof OBJECTIFS)[number];

/** Les niveaux d'activité quotidienne. AUCUN n'est retenu d'avance : on ne
 *  suppose pas à la place de quelqu'un ce qu'est sa journée. */
export const NIVEAUX_ACTIVITE = ['doux', 'modere', 'intense'] as const;
export type NiveauActivite = (typeof NIVEAUX_ACTIVITE)[number];

/**
 * Ce qu'on souhaite pour son activité quotidienne. LE PREMIER — « conserver mon
 * rythme actuel » — EST RETENU D'AVANCE (demande du 2026-09-07), à la
 * différence du niveau, qui n'a pas de défaut.
 *
 * Et c'est cohérent : ne rien changer n'est pas un conseil, c'est le point
 * neutre. Cocher « être plus actif » d'avance, ça, en serait un.
 */
export const SOUHAITS_ACTIVITE = [
  'conserver',
  'un-peu-plus',
  'beaucoup-plus',
  'ralentir',
] as const;
export type SouhaitActivite = (typeof SOUHAITS_ACTIVITE)[number];

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
  activite: NiveauActivite | null;
  /* Toujours renseigné : il a un défaut, contrairement au niveau d'activité. */
  souhaitActivite: SouhaitActivite;
  /**
   * LE TRAITEMENT, EN TROIS RÉPONSES LIÉES. `null` veut dire « pas encore
   * répondu » et se distingue d'un « non ».
   *
   * Elles se défont ensemble : répondre « non » efface la forme et la
   * spécialité, changer de forme efface la spécialité. Sinon on garderait une
   * réponse qui ne correspond plus à la question posée — un comprimé choisi
   * puis une forme passée à « injection ».
   */
  traitementCommence: boolean | null;
  formeTraitement: Forme | null;
  traitement: string | null;
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
  activite: null,
  souhaitActivite: SOUHAITS_ACTIVITE[0],
  traitementCommence: null,
  formeTraitement: null,
  traitement: null,
};
