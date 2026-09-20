/**
 * LES FONDS DE PAGE (2026-09-20, « menu parametre couleur : […] un bouton de
 * l'image de fond […], un bouton avec l'image de fond de ciel journée
 * ensoleillé de la v1 ») : sa photo, ou le ciel de midi du thème « Bleu
 * ensoleillé » de la V1. Le choix est une réponse enregistrée (`fond`) ; ce
 * qu'il peint est dans les feuilles des thèmes (`--fond-photo`,
 * `--fond-ciel`), consommé par `.page--fond-<id>`.
 */
export const FONDS = ['photo', 'ciel'] as const;

export type FondId = (typeof FONDS)[number];

export const FOND_PAR_DEFAUT: FondId = 'photo';
