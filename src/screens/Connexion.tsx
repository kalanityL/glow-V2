import { useState, type FormEvent } from 'react';
import { IndiceDefilement } from '../components/IndiceDefilement';
import { MessageEnPlace } from '../components/MessageEnPlace';
import { Wordmark } from '../components/Wordmark';
import { refusDuCode } from '../domaine/connexion';
import { useTextes } from '../i18n/useTextes';
import { codeDErreur, connexionParGoogle, connexionParMotDePasse } from '../plateforme/compte';
import { classeDuTheme } from '../themes/themes';

/**
 * L'ÉCRAN DE CONNEXION — la page de connexion de la V1 (`LoginPage.tsx`),
 * dans le téléphone et à la charte des formulaires de la V2 (2026-09-21,
 * « brancher sur la v2 en ligne la meme identification que la v1 et
 * utiliser les memes comptes ») : seule vue tant qu'on n'est pas connecté.
 *
 * Deux chemins, ceux de la V1 : e-mail et mot de passe, ou le compte
 * Google. Pas d'inscription : les comptes sont créés par l'administratrice
 * dans la console Firebase — les mêmes que la V1, c'est le même projet. La
 * session est mémorisée par le SDK, l'écran ne réapparaît qu'après une
 * déconnexion explicite.
 *
 * À LA CHARTE (GUIDELINES) : tout à l'encre et à ses gris, les champs de
 * l'onboarding, un refus dit en place et en gris, seul le bouton qui
 * connecte est à l'accent ; le bouton Google a la matière du second
 * bouton, et le G de Google est dessiné sur place (ses quatre couleurs
 * sont des couleurs de dessin, dans `dessins.css`). Pas de ligne de part
 * et d'autre du « ou » : pas de ligne séparatrice.
 */
export function Connexion({ classeFond }: { classeFond: string }) {
  const textes = useTextes();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [refus, setRefus] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  const tenter = async (action: () => Promise<void>) => {
    setRefus(null);
    setOccupe(true);
    try {
      await action();
      /* Pas de navigation ici : le verrou bascule tout seul sur l'application. */
    } catch (erreur) {
      setRefus(textes.connexion.refus[refusDuCode(codeDErreur(erreur))]);
    } finally {
      setOccupe(false);
    }
  };

  const valider = (evenement: FormEvent) => {
    evenement.preventDefault();
    if (!email.trim() || !motDePasse) {
      setRefus(textes.connexion.champsVides);
      return;
    }
    void tenter(() => connexionParMotDePasse(email, motDePasse));
  };

  return (
    <div className={`page page--photo ${classeFond} ${classeDuTheme('blanc')}`}>
      <div className="page__colonne connexion">
        <form className="carte connexion__carte" onSubmit={valider} noValidate>
          <h1 className="connexion__marque">
            <Wordmark />
          </h1>
          <p className="connexion__chapeau">{textes.connexion.chapeau}</p>

          <p className="libelle-groupe">{textes.groupes.email}</p>
          <input
            id="connexion-email"
            className="champ-texte"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(evenement) => setEmail(evenement.target.value)}
            aria-label={textes.groupes.email}
          />

          <p className="libelle-groupe">{textes.groupes.motDePasse}</p>
          <input
            id="connexion-mot-de-passe"
            className="champ-texte"
            type="password"
            autoComplete="current-password"
            value={motDePasse}
            onChange={(evenement) => setMotDePasse(evenement.target.value)}
            aria-label={textes.groupes.motDePasse}
          />

          {refus ? <MessageEnPlace classe="connexion__refus">{refus}</MessageEnPlace> : null}

          <button type="submit" className="bouton connexion__bouton" disabled={occupe} aria-disabled={occupe}>
            {textes.connexion.seConnecter}
          </button>

          <p className="connexion__ou">{textes.connexion.ou}</p>

          <button
            type="button"
            className="bouton bouton--second connexion__google"
            disabled={occupe}
            aria-disabled={occupe}
            onClick={() => void tenter(connexionParGoogle)}
          >
            <LogoGoogle />
            {textes.connexion.google}
          </button>

          <p className="connexion__note">{textes.connexion.note}</p>
        </form>
        <IndiceDefilement />
      </div>
    </div>
  );
}

/** Le G multicolore de Google, dessiné sur place pour rester hors ligne —
    celui de la V1. Ses couleurs sont celles de Google, des couleurs de
    dessin : `dessins.css`. */
function LogoGoogle() {
  return (
    <svg className="connexion__google-g" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        className="google__rouge"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        className="google__bleu"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        className="google__jaune"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        className="google__vert"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
