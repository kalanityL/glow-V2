import type { Avatar as AvatarModele } from '../domaine/avatar';
import {
  CANEVAS_AVATAR,
  IRIS,
  RAYON_IRIS,
  RAYON_PUPILLE,
  TRACE_BOUCHE,
  TRACE_COIFFURE,
  TRACE_CORPS,
  TRACE_NEZ,
  TRACE_SOURCILS,
  TRACE_VETEMENT,
  TRACE_VISAGE,
  TRACE_YEUX,
} from './avatarTraces';

/**
 * LE DESSIN DE L'AVATAR — le prototype modulaire du 2026-09-21, composé en un
 * seul SVG : huit couches dans l'ordre du manifeste, chacune à la forme
 * choisie. Le prototype superposait huit images ; ici, ce sont huit groupes
 * du même dessin, et rien d'autre ne change — les tracés sont recopiés tels
 * quels (`avatarTraces.ts`).
 *
 * DEUX SORTES DE COULEURS, ET ELLES NE VIVENT PAS AU MÊME ENDROIT :
 *   - celles que la personne CHOISIT — peau, yeux, cheveux, vêtement — sont
 *     des DONNÉES (elles sont enregistrées avec son profil) : elles arrivent
 *     par `avatar` et se posent en attribut. C'est l'exception consignée dans
 *     la V1 (« nuancier de l'avatar — des données enregistrées »). La peau
 *     colore le visage ET le corps : le prototype donnait au cou une teinte
 *     fixe, qui jurerait sous un visage d'une autre couleur.
 *   - celles du DESSIN — le contour de tous les traits, le blanc de l'œil, la
 *     pupille, les lèvres, le pan de la capuche — sont des CLASSES, peintes
 *     dans `themes/dessins.css`. Rien de style en dur dans un template.
 * La taille non plus n'est pas ici : c'est la feuille de l'endroit qui la
 * donne.
 */
export function Avatar({ avatar }: { avatar: AvatarModele }) {
  const yeux = TRACE_YEUX[avatar.formeYeux];
  const vetement = TRACE_VETEMENT[avatar.vetement];

  return (
    <svg className="avatar" viewBox={CANEVAS_AVATAR} aria-hidden="true">
      <g className="avatar__traits">
        <path d={TRACE_CORPS} fill={avatar.couleurPeau} />
        <path d={TRACE_VISAGE[avatar.formeVisage]} fill={avatar.couleurPeau} />

        {/* Les yeux : le blanc à la forme choisie, l'iris à la couleur
            choisie, la pupille. */}
        <path d={yeux.gauche} className="avatar__blanc" />
        <path d={yeux.droit} className="avatar__blanc" />
        {IRIS.map((oeil) => (
          <circle key={oeil.cx} cx={oeil.cx} cy={oeil.cy} r={RAYON_IRIS} fill={avatar.couleurYeux} />
        ))}
        {IRIS.map((oeil) => (
          <circle key={oeil.cx} cx={oeil.cx} cy={oeil.cy} r={RAYON_PUPILLE} className="avatar__pupille" />
        ))}

        {TRACE_SOURCILS.map((trace) => (
          <path key={trace} d={trace} className="avatar__sourcil" />
        ))}

        <path d={TRACE_NEZ[avatar.nez]} className="avatar__ligne" />
        <path d={TRACE_BOUCHE[avatar.bouche]} className={`avatar__bouche avatar__bouche--${avatar.bouche}`} />

        <path d={TRACE_COIFFURE[avatar.coiffure]} fill={avatar.couleurCheveux} />

        <path d={vetement.corps} fill={avatar.couleurVetement} />
        {vetement.capuche ? (
          <path d={vetement.capuche} fill={avatar.couleurVetement} className="avatar__capuche" />
        ) : null}
      </g>
    </svg>
  );
}
