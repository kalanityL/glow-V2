import type { Avatar as AvatarModele, Expression, FormeVisage } from '../domaine/avatar';

/**
 * LE DESSIN DE L'AVATAR — repris trait pour trait de GLOW V1.
 *
 * Les tracés, les coordonnées et les proportions viennent de `AvatarSVG` de
 * l'ancien dépôt. NE PAS LES « ARRONDIR » : ce sont eux qui font le visage, et
 * une coordonnée déplacée décale un œil ou creuse une joue.
 *
 * DEUX SORTES DE COULEURS, ET ELLES NE VIVENT PAS AU MÊME ENDROIT :
 *   - celles que la personne CHOISIT — peau, yeux, cheveux — sont des DONNÉES
 *     (elles seront enregistrées avec son profil) : elles arrivent par
 *     `avatar` et se posent en attribut. C'est l'exception consignée dans la
 *     V1 (« nuancier de l'avatar — des données enregistrées »).
 *   - celles du DESSIN — le blanc de l'œil, la pupille, la bouche, les
 *     lunettes, l'ombre du nez, le fard, le vêtement de chaque genre — sont
 *     des CLASSES, peintes dans `themes/dessins.css`. Rien de style en dur
 *     dans un template : c'est la règle, reprise de la V1 le 2026-09-09.
 * La taille non plus n'est pas ici : c'est la feuille de l'endroit qui la
 * donne.
 */

/** Les traits qui changent avec l'expression : les sourcils et la bouche. */
const TRAITS_EXPRESSION: Record<
  Expression,
  { sourcilGauche: string; sourcilDroit: string; bouche: string }
> = {
  joyeuse: {
    sourcilGauche: 'M53 77 Q60 67 67 77',
    sourcilDroit: 'M113 77 Q120 67 127 77',
    bouche: 'M60 105 Q90 135 120 105',
  },
  determinee: {
    sourcilGauche: 'M55 77 L65 73',
    sourcilDroit: 'M115 73 L125 77',
    bouche: 'M70 112 Q90 105 110 112',
  },
  fiere: {
    sourcilGauche: 'M54 75 Q60 68 66 75',
    sourcilDroit: 'M114 75 Q120 68 126 75',
    bouche: 'M62 108 Q90 132 118 108',
  },
  calme: {
    sourcilGauche: 'M55 76 H65',
    sourcilDroit: 'M115 76 H125',
    bouche: 'M72 110 Q90 118 108 110',
  },
};

/** Le contour du visage, selon sa forme. */
const TRACE_VISAGE: Record<FormeVisage, string> = {
  ovale: 'M40 60 Q40 140 90 145 Q140 140 140 60 Z',
  rond: 'M40 70 Q40 140 90 150 Q140 140 140 70 Q140 30 90 30 Q40 30 40 70',
  carre: 'M45 45 L135 45 L135 120 Q135 145 90 145 Q45 145 45 120 Z',
  coeur:
    'M40 50 Q40 110 90 150 Q140 110 140 50 Q140 30 115 35 Q90 40 90 40 Q90 40 65 35 Q40 30 40 50',
};

export function Avatar({ avatar }: { avatar: AvatarModele }) {
  const { genre, formeVisage, couleurPeau, couleurYeux, coiffure, couleurCheveux, lunettes } =
    avatar;
  const traits = TRAITS_EXPRESSION[avatar.expression];
  /* Le fard suit l'expression : c'est la classe qui le dit, la feuille qui le
     peint — et qui ne peint rien pour « déterminée » et « calme ». */
  const fard = `avatar__fard avatar__fard--${avatar.expression}`;

  return (
    <svg className="avatar" viewBox="0 0 180 180" aria-hidden="true">
      {/* Le cou, puis les épaules : le vêtement porte la couleur du genre. */}
      <rect x="75" y="120" width="30" height="40" rx="10" fill={couleurPeau} />
      <path
        d="M30 180 C30 150 60 140 90 140 C120 140 150 150 150 180 Z"
        className={`avatar__vetement avatar__vetement--${genre}`}
      />
      <path d="M75 140 L90 155 L105 140 Z" fill={couleurPeau} />

      {/* Les oreilles, sous les cheveux. */}
      <circle cx="36" cy="85" r="10" fill={couleurPeau} />
      <circle cx="144" cy="85" r="10" fill={couleurPeau} />

      <path d={TRACE_VISAGE[formeVisage]} fill={couleurPeau} />

      <circle cx="54" cy="95" r="12" className={fard} />
      <circle cx="126" cy="95" r="12" className={fard} />

      {/* Les yeux : le blanc, l'iris, la pupille, et le reflet qui les anime. */}
      <g>
        <ellipse cx="60" cy="76" rx="9" ry="5" className="avatar__blanc" />
        <ellipse cx="120" cy="76" rx="9" ry="5" className="avatar__blanc" />
        <circle cx="60" cy="76" r="5" fill={couleurYeux} />
        <circle cx="120" cy="76" r="5" fill={couleurYeux} />
        <circle cx="60" cy="76" r="2.5" className="avatar__pupille" />
        <circle cx="120" cy="76" r="2.5" className="avatar__pupille" />
        <circle cx="58" cy="74" r="1" className="avatar__blanc" />
        <circle cx="118" cy="74" r="1" className="avatar__blanc" />
      </g>

      {/* Les sourcils prennent la couleur des cheveux. */}
      <path
        d={traits.sourcilGauche}
        fill="none"
        stroke={couleurCheveux}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d={traits.sourcilDroit}
        fill="none"
        stroke={couleurCheveux}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M86 85 Q90 98 94 95"
        className="avatar__nez"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={traits.bouche}
        className="avatar__bouche"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {lunettes ? (
        <g className="avatar__lunettes" strokeWidth="2.5" fill="none">
          <circle cx="60" cy="76" r="14" strokeWidth="3" />
          <circle cx="120" cy="76" r="14" strokeWidth="3" />
          <line x1="74" y1="76" x2="106" y2="76" strokeWidth="3" />
          <path d="M46 76 L34 71" strokeWidth="2" />
          <path d="M134 76 L146 71" strokeWidth="2" />
        </g>
      ) : null}

      {coiffure === 'chauve' ? null : (
        <g fill={couleurCheveux}>
          {coiffure === 'court' ? (
            <path d="M35 60 C30 45 45 25 90 25 C135 25 150 45 145 60 C140 50 135 45 130 45 C115 45 105 35 90 35 C75 35 65 45 50 45 C45 45 40 50 35 60 Z" />
          ) : null}
          {coiffure === 'long' ? (
            <g>
              <path d="M36 70 C30 90 25 140 40 150 C50 155 55 120 55 90 Z" />
              <path d="M144 70 C150 90 155 140 140 150 C130 155 125 120 125 90 Z" />
              <path d="M36 60 C32 40 50 20 90 20 C130 20 148 40 144 60 C135 45 125 35 90 35 C55 35 45 45 36 60 Z" />
            </g>
          ) : null}
          {coiffure === 'boucle' ? (
            <g>
              <circle cx="90" cy="25" r="14" />
              <circle cx="72" cy="28" r="13" />
              <circle cx="108" cy="28" r="13" />
              <circle cx="56" cy="35" r="12" />
              <circle cx="124" cy="35" r="12" />
              <circle cx="43" cy="50" r="12" />
              <circle cx="137" cy="50" r="12" />
              <circle cx="36" cy="68" r="11" />
              <circle cx="144" cy="68" r="11" />
              <circle cx="70" cy="45" r="8" />
              <circle cx="110" cy="45" r="8" />
            </g>
          ) : null}
          {coiffure === 'frange' ? (
            <g>
              <path d="M35 60 C30 80 25 150 42 160 C45 140 46 95 48 70 Z" />
              <path d="M145 60 C150 80 155 150 138 160 C135 140 134 95 132 70 Z" />
              <path d="M34 55 C34 30 60 22 90 22 C120 22 146 30 146 55 C146 55 135 46 125 46 C110 46 110 58 90 58 C70 58 70 46 55 46 C45 46 34 55 34 55 Z" />
            </g>
          ) : null}
          {coiffure === 'brosse' ? (
            <path d="M38 52 L42 28 L56 34 L64 16 L76 26 L90 12 L104 26 L116 16 L124 34 L138 28 L142 52 C125 40 105 38 90 38 C75 38 55 40 38 52 Z" />
          ) : null}
        </g>
      )}
    </svg>
  );
}
