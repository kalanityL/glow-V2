import { useId } from 'react';
import { COULEURS_AVATAR, type AvatarId } from '../domaine/avatars';

/**
 * UNE PASTILLE D'AVATAR : une silhouette claire sur un disque dégradé.
 *
 * Le dessin est le même pour tous, seules les deux teintes changent : c'est ce
 * qui permet d'en ajouter un en écrivant une ligne de couleurs, sans toucher au
 * dessin.
 *
 * L'identifiant du dégradé est unique par instance (`useId`) : six pastilles
 * sur une page se voleraient sinon leur dessin, celle démontée la première
 * emportant les autres — la même règle que pour le logo.
 */
export function Avatar({ avatar }: { avatar: AvatarId }) {
  const degrade = `avatar-${avatar}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { de, a } = COULEURS_AVATAR[avatar];

  return (
    <svg className="avatar" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={degrade} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={de} />
          <stop offset="100%" stopColor={a} />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill={`url(#${degrade})`} />
      {/* La tête et les épaules, en blanc voilé : une présence, pas un visage —
          aucun trait qui prétendrait ressembler à quelqu'un. */}
      <circle cx="32" cy="25" r="10" fill="rgba(255, 255, 255, 0.92)" />
      <path
        d="M14 54c0-9.94 8.06-16 18-16s18 6.06 18 16z"
        fill="rgba(255, 255, 255, 0.92)"
      />
    </svg>
  );
}
