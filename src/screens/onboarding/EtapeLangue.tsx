import { LANGUES, type Langue } from '../../i18n/textes';
import { useTextes } from '../../i18n/useTextes';
import { ChoixUnique } from './ChoixUnique';

/**
 * ÉTAPE : LA LANGUE — la toute première du parcours.
 *
 * ELLE NE CHANGE RIEN POUR L'INSTANT, ET C'EST VOULU (demande du 2026-09-07 :
 * « on ne le fera pas pour de vrai, choix en continuera en français aussi,
 * c'est juste pour avoir la maquette »). Le choix est bien recueilli et gardé
 * dans les réponses ; ce qui n'est pas branché, c'est la SUITE — l'application
 * continue de parler la langue qu'elle détecte, même si l'on touche
 * « English ».
 *
 * CE QU'IL FAUDRA FAIRE LE JOUR OÙ ON LA BRANCHERA, en un seul endroit :
 * `useTextes` lit aujourd'hui la langue du navigateur (`detecterLangue`) ; il
 * devra lire CE choix quand il existe, et retomber sur la détection sinon.
 * Rien d'autre ne bougera : aucun écran n'écrit de texte, ils lisent tous le
 * dictionnaire.
 *
 * LES LANGUES SE NOMMENT DANS LEUR PROPRE LANGUE — « Français », « English » —
 * et non traduites. C'est l'usage, et c'est le seul moyen que quelqu'un qui ne
 * lit pas la langue affichée retrouve la sienne.
 */
export function EtapeLangue({
  langue,
  onLangue,
}: {
  langue: Langue;
  onLangue: (langue: Langue) => void;
}) {
  const textes = useTextes();
  const question = textes.onboarding.langue.question;

  return (
    <>
      <h1 className="titre">{question}</h1>
      <ChoixUnique
        options={LANGUES}
        libelle={(id) => textes.langues[id]}
        valeur={langue}
        onChoix={onLangue}
        question={question}
      />
    </>
  );
}
