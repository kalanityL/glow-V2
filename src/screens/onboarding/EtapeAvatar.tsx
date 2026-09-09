import {
  COIFFURES,
  COIFFURE_DU_GENRE,
  COULEURS_CHEVEUX,
  COULEURS_PEAU,
  COULEURS_YEUX,
  EXPRESSIONS,
  FORMES_VISAGE,
  GENRES,
  type Avatar as AvatarModele,
} from '../../domaine/avatar';
import { useTextes } from '../../i18n/useTextes';
import { ChoixUnique } from './ChoixUnique';

interface EtapeAvatarProps {
  avatar: AvatarModele;
  onAvatar: (avatar: AvatarModele) => void;
}

/**
 * ÉTAPE : L'AVATAR — la fonctionnalité de GLOW V1, reprise ici.
 *
 * ON SE VOIT PENDANT QU'ON SE COMPOSE : le portrait est en haut, les réglages
 * dessous, et il change à chaque touche. C'était déjà le principe de la V1, et
 * c'est tout l'intérêt — un avatar ne se choisit pas dans une liste de noms.
 * Le portrait n'est PAS rendu ici mais par `Onboarding`, hors de la zone qui
 * défile : il reste en place pendant qu'on fait défiler les réglages
 * (2026-09-09).
 *
 * LE GENRE EST ICI, ET PLUS SUR L'ÉCRAN SUIVANT (demande du 2026-09-08) : il
 * choisit la couleur du vêtement et la coiffure de départ, c'est-à-dire qu'il
 * SE VOIT. Le demander deux fois — une fois en dessin, une fois en liste —
 * n'avait pas de sens.
 *
 * CHANGER DE GENRE CHANGE LA COIFFURE, comme dans la V1 : court, long ou
 * bouclé. C'est un point de départ, pas une règle — la coiffure se rechoisit
 * juste en dessous.
 */
export function EtapeAvatar({ avatar, onAvatar }: EtapeAvatarProps) {
  const textes = useTextes();
  const modifier = <C extends keyof AvatarModele>(champ: C, valeur: AvatarModele[C]) =>
    onAvatar({ ...avatar, [champ]: valeur });

  return (
    <>
      <h1 className="titre">{textes.onboarding.avatar.question}</h1>

      <p className="libelle-groupe">{textes.groupes.genre}</p>
      <ChoixUnique
        options={GENRES}
        libelle={(id) => textes.genres[id]}
        valeur={avatar.genre}
        onChoix={(genre) =>
          /* Le genre amène sa coiffure : deux réponses changent d'un coup, et
             les écrire l'une après l'autre laisserait un dessin intermédiaire. */
          onAvatar({ ...avatar, genre, coiffure: COIFFURE_DU_GENRE[genre] })
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

      <p className="libelle-groupe">{textes.groupes.coiffure}</p>
      <ChoixUnique
        options={COIFFURES}
        libelle={(id) => textes.coiffures[id]}
        valeur={avatar.coiffure}
        onChoix={(coiffure) => modifier('coiffure', coiffure)}
        question={textes.groupes.coiffure}
        enGrille
      />

      <p className="libelle-groupe">{textes.groupes.cheveux}</p>
      <Pastilles
        couleurs={COULEURS_CHEVEUX}
        valeur={avatar.couleurCheveux}
        onChoix={(couleur) => modifier('couleurCheveux', couleur)}
        libelle={textes.groupes.cheveux}
      />

      <p className="libelle-groupe">{textes.groupes.yeux}</p>
      <Pastilles
        couleurs={COULEURS_YEUX}
        valeur={avatar.couleurYeux}
        onChoix={(couleur) => modifier('couleurYeux', couleur)}
        libelle={textes.groupes.yeux}
      />

      <p className="libelle-groupe">{textes.groupes.visage}</p>
      <ChoixUnique
        options={FORMES_VISAGE}
        libelle={(id) => textes.formesVisage[id]}
        valeur={avatar.formeVisage}
        onChoix={(forme) => modifier('formeVisage', forme)}
        question={textes.groupes.visage}
        enGrille
      />

      <p className="libelle-groupe">{textes.groupes.expression}</p>
      <ChoixUnique
        options={EXPRESSIONS}
        libelle={(id) => textes.expressions[id]}
        valeur={avatar.expression}
        onChoix={(expression) => modifier('expression', expression)}
        question={textes.groupes.expression}
        enGrille
      />

      <p className="libelle-groupe">{textes.groupes.lunettes}</p>
      <ChoixUnique
        options={['oui', 'non'] as const}
        libelle={(id) => (id === 'oui' ? textes.oui : textes.non)}
        valeur={avatar.lunettes ? 'oui' : 'non'}
        onChoix={(id) => modifier('lunettes', id === 'oui')}
        question={textes.groupes.lunettes}
        enLigne
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
