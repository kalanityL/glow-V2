/**
 * LA CONFIGURATION FIREBASE — CELLE DE LA V1, TELLE QUELLE (2026-09-21,
 * « peux tu brancher sur la v2 en ligne la meme identification que la v1
 * et utiliser les memes comptes pour que je n'ai rien à faire dans
 * l'interface firebase ? ») : le même projet `glow-private`, donc les mêmes
 * comptes — ceux qu'elle a créés dans la console pour la V1 ouvrent la V2.
 *
 * Ces valeurs identifient le projet côté client et NE SONT PAS DES SECRETS
 * (la V1 le dit déjà) : la sécurité repose sur la liste des comptes
 * autorisés dans le projet Firebase, pas sur la confidentialité de ces
 * chaînes. Elles viennent de la console : Paramètres du projet → Vos
 * applications → application Web.
 *
 * TANT QUE `apiKey` EST VIDE, L'APPLICATION DÉMARRE SANS VERROU — le
 * mécanisme de la V1, repris : le garde (`screens/Verrou.tsx`) laisse
 * passer.
 */
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAwwYEK7SWPYG_ulF7YWAiciBtb3Dit6mA',
  authDomain: 'glow-private.firebaseapp.com',
  projectId: 'glow-private',
  storageBucket: 'glow-private.firebasestorage.app',
  messagingSenderId: '636090918903',
  appId: '1:636090918903:web:230c3654c160813e40b0f2',
};

/** Vrai dès que la configuration est remplie : le verrou peut être armé. */
export const verrouConfigure = FIREBASE_CONFIG.apiKey !== '';
