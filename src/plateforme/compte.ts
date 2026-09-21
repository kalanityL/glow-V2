/**
 * LE COMPTE — L'IDENTIFICATION DE LA V1, DERRIÈRE LA COUCHE PLATEFORME
 * (2026-09-21, « brancher sur la v2 en ligne la meme identification que la
 * v1 et utiliser les memes comptes »).
 *
 * TOUT LE SDK FIREBASE VIT ICI, et nulle part ailleurs : le reste de
 * l'application ne connaît que `Compte` et les cinq verbes exportés. C'est
 * le second fichier de la plateforme, à côté de `navigateur.ts` — le SDK
 * n'est pas une API du navigateur, mais il en est aussi près qu'elle : le
 * jour de la conversion React Native, c'est le seul fichier à réécrire (le
 * SDK y demande un adaptateur de persistance différent). Repris de
 * `shared/platform/auth.ts` de la V1, sans la suppression de compte, qui
 * n'a pas d'écran ici.
 *
 * LA SESSION EST MÉMORISÉE PAR DÉFAUT (persistance locale du SDK) : une
 * fois connectée, l'utilisatrice ne l'est plus jamais redemandé sur cet
 * appareil, jusqu'à déconnexion explicite.
 *
 * Le SDK n'est initialisé qu'au premier usage, jamais à l'import : tant que
 * le verrou n'est pas armé, aucun appel réseau ni stockage Firebase
 * n'existe.
 */
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Auth,
} from 'firebase/auth';
import { FIREBASE_CONFIG, verrouConfigure } from './firebase.config';

/** La personne connectée, réduite à ce que l'application montre. */
export interface Compte {
  id: string;
  email: string | null;
  nom: string | null;
}

let auth: Auth | null = null;
function authFirebase(): Auth {
  if (!auth) {
    if (!verrouConfigure) {
      throw new Error('Firebase non configuré — remplir plateforme/firebase.config.ts');
    }
    auth = getAuth(initializeApp(FIREBASE_CONFIG));
  }
  return auth;
}

/**
 * S'abonne à l'état de connexion. Le premier appel arrive dès que le SDK a
 * restauré (ou non) la session mémorisée. Rend le désabonnement.
 */
export function surCompte(quand: (compte: Compte | null) => void): () => void {
  return onAuthStateChanged(authFirebase(), (u) =>
    quand(u ? { id: u.uid, email: u.email, nom: u.displayName } : null),
  );
}

/** Connexion par e-mail et mot de passe. Rejette avec un code `auth/…`. */
export async function connexionParMotDePasse(email: string, motDePasse: string): Promise<void> {
  await signInWithEmailAndPassword(authFirebase(), email.trim(), motDePasse);
}

/**
 * Connexion par le compte Google, dans la fenêtre de Google — celle de la
 * V1 (`signInWithPopup`). Ce n'est pas un popup de l'application au sens de
 * GUIDELINES : c'est la page de Google, hors de l'écran, qui demande
 * l'accord de la personne ; l'application n'ouvre rien par-dessus elle-même.
 */
export async function connexionParGoogle(): Promise<void> {
  await signInWithPopup(authFirebase(), new GoogleAuthProvider());
}

/** Déconnexion explicite — seule façon d'oublier la session mémorisée. */
export async function deconnexion(): Promise<void> {
  await signOut(authFirebase());
}

/** Le code `auth/…` d'une erreur du SDK, ou une chaîne vide. */
export function codeDErreur(erreur: unknown): string {
  return typeof erreur === 'object' && erreur !== null && typeof (erreur as { code?: unknown }).code === 'string'
    ? (erreur as { code: string }).code
    : '';
}
