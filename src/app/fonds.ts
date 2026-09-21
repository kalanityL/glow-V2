/**
 * LES FONDS DE PAGE (2026-09-20, « menu parametre couleur : […] un bouton de
 * l'image de fond […], un bouton avec l'image de fond de ciel journée
 * ensoleillé de la v1 ») : sa photo, ou le ciel de midi du thème « Bleu
 * ensoleillé » de la V1. Le choix est une réponse enregistrée (`fond`) ; ce
 * qu'il peint est dans les feuilles des thèmes (`--fond-photo`,
 * `--fond-ciel`), consommé par `.page--fond-<id>`.
 */
export const FONDS = [
  /* LE FOND VIDE (2026-09-21, « ajouter a theme l'option fond vide ») : pas
     d'image, le fond uni du thème. */
  'vide',
  'photo',
  'ciel',
  /* LES DIX FONDS DE SA PLANCHE (2026-09-20 au soir, « extrais les 10 fonds
     et ajoute les a la page theme ») : dans l'ordre de la planche, sous
     leurs noms. Les deux premiers identifiants sont d'avant — `photo` est
     « Fleurs », `ciel` est « Brasserie ». */
  ...(['nature-printaniere', 'coucher-de-soleil', 'bord-de-mer', 'foret', 'cafe-parisien', 'nuit-etoilee', 'minimaliste-clair', 'aquarelle', 'montagnes', 'abstrait-glow'] as const),
] as const;

export type FondId = (typeof FONDS)[number];

export const FOND_PAR_DEFAUT: FondId = 'photo';
