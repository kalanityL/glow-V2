/**
 * LES AVATARS PROPOSÉS.
 *
 * CE SONT DES PASTILLES DESSINÉES, PAS DES PORTRAITS : une silhouette sur un
 * disque de couleur, six variantes. Aucune image, aucun fichier, aucune
 * dépendance — le dessin est du SVG écrit dans le composant, et il suivra en
 * natif.
 *
 * C'EST UN PLACEHOLDER ASSUMÉ : elle n'a pas dit à quoi les avatars devaient
 * ressembler. Quand les vrais existeront, seule cette table changera — le
 * composant et l'écran ne connaissent que des identifiants et deux couleurs.
 *
 * Les NOMS ne sont pas ici mais dans le dictionnaire : ils se disent aux
 * lecteurs d'écran, et ce qui se dit se traduit.
 */

export const AVATARS = ['aurore', 'ocean', 'menthe', 'prune', 'sable', 'nuit'] as const;

export type AvatarId = (typeof AVATARS)[number];

/** Les deux teintes du disque de chaque avatar, du haut vers le bas. */
export const COULEURS_AVATAR: Record<AvatarId, { de: string; a: string }> = {
  aurore: { de: '#fca5a5', a: '#f472b6' },
  ocean: { de: '#7dd3fc', a: '#2563eb' },
  menthe: { de: '#6ee7b7', a: '#0d9488' },
  prune: { de: '#c4b5fd', a: '#7c3aed' },
  sable: { de: '#fde68a', a: '#d97706' },
  nuit: { de: '#64748b', a: '#1e293b' },
};
