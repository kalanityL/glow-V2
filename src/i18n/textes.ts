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
  accueil: {
    surtitre: string;
    titre: string;
    chapeau: string;
  };
  /** Le bouton « retour » de la barre du bas : lu par les lecteurs d'écran. */
  retour: string;
}

export const TEXTES: Record<Langue, Textes> = {
  fr: {
    accueil: {
      surtitre: 'hello world',
      titre: 'hello world',
      chapeau: 'hello world',
    },
    retour: 'Retour',
  },
  en: {
    accueil: {
      surtitre: 'hello world',
      titre: 'hello world',
      chapeau: 'hello world',
    },
    retour: 'Back',
  },
};
