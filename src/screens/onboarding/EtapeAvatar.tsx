import { Avatar } from '../../components/Avatar';
import { AVATARS, type AvatarId } from '../../domaine/avatars';
import { useTextes } from '../../i18n/useTextes';

/**
 * ÉTAPE : L'AVATAR — la dernière du parcours.
 *
 * Elle vient après le traitement, quel que soit le chemin : après la forme et
 * la spécialité pour qui a commencé, tout de suite après le « non » pour qui
 * n'a pas commencé (demande du 2026-09-08).
 *
 * TROIS PAR LIGNE : ce sont des images, elles se comparent d'un coup d'œil, et
 * une colonne unique aurait fait défiler six pastilles.
 *
 * AUCUN N'EST RETENU D'AVANCE : un avatar est une figure de soi, en choisir un
 * à la place de quelqu'un n'aurait pas de sens. Rien ne bloque pour autant —
 * la question se saute comme les autres.
 */
export function EtapeAvatar({
  avatar,
  onAvatar,
}: {
  avatar: AvatarId | null;
  onAvatar: (avatar: AvatarId) => void;
}) {
  const textes = useTextes();
  const question = textes.onboarding.avatar.question;

  return (
    <>
      <h1 className="titre">{question}</h1>

      <div className="avatars" role="radiogroup" aria-label={question}>
        {AVATARS.map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            className={`avatar-choix${id === avatar ? ' avatar-choix--choisi' : ''}`}
            aria-checked={id === avatar}
            /* La pastille n'a pas de texte : son nom se dit ici, ou elle ne
               serait qu'un bouton muet pour qui écoute la page. */
            aria-label={textes.avatars[id]}
            onClick={() => onAvatar(id)}
          >
            <Avatar avatar={id} />
          </button>
        ))}
      </div>
    </>
  );
}
