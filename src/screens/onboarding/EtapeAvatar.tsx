import {
  BOUCHES,
  COIFFURES,
  COULEURS_CHEVEUX,
  COULEURS_PEAU,
  COULEURS_VETEMENT,
  COULEURS_YEUX,
  DEPART_DU_GENRE,
  FORMES_VISAGE,
  FORMES_YEUX,
  GENRES,
  NEZ,
  VETEMENTS,
  type Avatar as AvatarModele,
} from '../../domaine/avatar';
import { useTextes } from '../../i18n/useTextes';
import { ChoixUnique } from './ChoixUnique';

interface EtapeAvatarProps {
  avatar: AvatarModele;
  onAvatar: (avatar: AvatarModele) => void;
  /**
   * Sans le titre de l'étape : sur la page « Mon compte » (2026-09-19), c'est
   * la carte « Mon avatar » qui titre — les réglages, eux, sont LES MÊMES.
   */
  sansTitre?: boolean;
}

/**
 * ÉTAPE : L'AVATAR — les réglages du prototype modulaire (2026-09-21).
 *
 * ON SE VOIT PENDANT QU'ON SE COMPOSE : le portrait est en haut, les réglages
 * dessous, et il change à chaque touche. C'était déjà le principe de la V1, et
 * c'est tout l'intérêt — un avatar ne se choisit pas dans une liste de noms.
 * Le portrait n'est PAS rendu ici mais par l'endroit qui abrite l'étape, hors
 * de la zone qui défile : il reste en place pendant qu'on fait défiler les
 * réglages (2026-09-09).
 *
 * LES RÉGLAGES SONT CEUX DU PROTOTYPE, forme et couleur séparées : la peau,
 * le visage, les yeux (forme, puis couleur), la coiffure et la couleur des
 * cheveux, le nez, la bouche, le vêtement (forme, puis couleur). Une forme se
 * nomme, une couleur se voit (pastilles).
 *
 * LE GENRE EST ICI, ET PLUS SUR L'ÉCRAN SUIVANT (demande du 2026-09-08) : il
 * choisit la coiffure et le vêtement de départ, c'est-à-dire qu'il SE VOIT.
 * C'est un point de départ, pas une règle — tout se rechoisit dessous.
 */
export function EtapeAvatar({ avatar, onAvatar, sansTitre = false }: EtapeAvatarProps) {
  const textes = useTextes();
  const modifier = <C extends keyof AvatarModele>(champ: C, valeur: AvatarModele[C]) =>
    onAvatar({ ...avatar, [champ]: valeur });

  return (
    <>
      {sansTitre ? null : <h1 className="titre">{textes.onboarding.avatar.question}</h1>}

      <p className={`libelle-groupe${sansTitre ? ' libelle-groupe--premier' : ''}`}>
        {textes.groupes.genre}
      </p>
      <ChoixUnique
        options={GENRES}
        libelle={(id) => textes.genres[id]}
        valeur={avatar.genre}
        onChoix={(genre) =>
          /* Le genre amène sa coiffure et son vêtement : plusieurs réponses
             changent d'un coup, et les écrire l'une après l'autre laisserait
             un dessin intermédiaire. */
          onAvatar({ ...avatar, genre, ...DEPART_DU_GENRE[genre] })
        }
        question={textes.groupes.genre}
        enLigne
      />

      <p className="libelle-groupe">{textes.groupes.peau}</p>
      <Pastilles
        couleurs={COULEURS_PEAU}
        valeur={avatar.couleurPeau}
        onChoix={(couleur) => modifier('couleurPeau', couleur)}
        libelle={textes.groupes.peau}
      />

      <p className="libelle-groupe">{textes.groupes.visage}</p>
      <ChoixUnique
        options={FORMES_VISAGE}
        libelle={(id) => textes.formesVisage[id]}
        valeur={avatar.formeVisage}
        onChoix={(forme) => modifier('formeVisage', forme)}
        question={textes.groupes.visage}
        enLigne
      />

      <p className="libelle-groupe">{textes.groupes.formeYeux}</p>
      <ChoixUnique
        options={FORMES_YEUX}
        libelle={(id) => textes.formesYeux[id]}
        valeur={avatar.formeYeux}
        onChoix={(forme) => modifier('formeYeux', forme)}
        question={textes.groupes.formeYeux}
        enLigne
      />

      <p className="libelle-groupe">{textes.groupes.yeux}</p>
      <Pastilles
        couleurs={COULEURS_YEUX}
        valeur={avatar.couleurYeux}
        onChoix={(couleur) => modifier('couleurYeux', couleur)}
        libelle={textes.groupes.yeux}
      />

      <p className="libelle-groupe">{textes.groupes.coiffure}</p>
      <ChoixUnique
        options={COIFFURES}
        libelle={(id) => textes.coiffures[id]}
        valeur={avatar.coiffure}
        onChoix={(coiffure) => modifier('coiffure', coiffure)}
        question={textes.groupes.coiffure}
        enLigne
      />

      <p className="libelle-groupe">{textes.groupes.cheveux}</p>
      <Pastilles
        couleurs={COULEURS_CHEVEUX}
        valeur={avatar.couleurCheveux}
        onChoix={(couleur) => modifier('couleurCheveux', couleur)}
        libelle={textes.groupes.cheveux}
      />

      <p className="libelle-groupe">{textes.groupes.nez}</p>
      <ChoixUnique
        options={NEZ}
        libelle={(id) => textes.nez[id]}
        valeur={avatar.nez}
        onChoix={(nez) => modifier('nez', nez)}
        question={textes.groupes.nez}
        enLigne
      />

      <p className="libelle-groupe">{textes.groupes.bouche}</p>
      <ChoixUnique
        options={BOUCHES}
        libelle={(id) => textes.bouches[id]}
        valeur={avatar.bouche}
        onChoix={(bouche) => modifier('bouche', bouche)}
        question={textes.groupes.bouche}
        enLigne
      />

      <p className="libelle-groupe">{textes.groupes.vetement}</p>
      <ChoixUnique
        options={VETEMENTS}
        libelle={(id) => textes.vetements[id]}
        valeur={avatar.vetement}
        onChoix={(vetement) => modifier('vetement', vetement)}
        question={textes.groupes.vetement}
        enLigne
      />

      <p className="libelle-groupe">{textes.groupes.couleurVetement}</p>
      <Pastilles
        couleurs={COULEURS_VETEMENT}
        valeur={avatar.couleurVetement}
        onChoix={(couleur) => modifier('couleurVetement', couleur)}
        libelle={textes.groupes.couleurVetement}
      />
    </>
  );
}

/**
 * Une rangée de pastilles de couleur.
 *
 * Les couleurs n'ont pas de libellé visible : une pastille SE VOIT, et écrire
 * « Châtain » à côté d'un carré châtain n'apprend rien. Le nom se dit en
 * revanche à qui écoute la page, où la couleur ne se voit pas — il vient du
 * dictionnaire, une teinte se nommant dans chaque langue.
 */
function Pastilles({
  couleurs,
  valeur,
  onChoix,
  libelle,
}: {
  couleurs: readonly string[];
  valeur: string;
  onChoix: (couleur: string) => void;
  libelle: string;
}) {
  const textes = useTextes();

  return (
    <div className="pastilles" role="radiogroup" aria-label={libelle}>
      {couleurs.map((couleur) => (
        <button
          key={couleur}
          type="button"
          role="radio"
          className={`pastille${couleur === valeur ? ' pastille--choisie' : ''}`}
          style={{ background: couleur }}
          aria-checked={couleur === valeur}
          aria-label={textes.couleurs[couleur] ?? couleur}
          onClick={() => onChoix(couleur)}
        />
      ))}
    </div>
  );
}
