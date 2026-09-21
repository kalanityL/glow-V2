/* ENGENDRÉ PAR `scripts/rendre-sons.mjs` (2026-09-21) — NE PAS ÉDITER À LA MAIN :
   relancer le script. Les sons de l'application, des fichiers embarqués,
   chacun en un ou plusieurs morceaux joués à tour de rôle par
   `jouerClics`. Les noms des sons ne sont pas ici : ce sont des mots
   d'interface, qui iront dans le dictionnaire le jour de l'écran des
   effets sonores (son TODO). */
import cran1 from '../assets/sons/cran-1.wav';
import cran2 from '../assets/sons/cran-2.wav';
import cran3 from '../assets/sons/cran-3.wav';
import cran4 from '../assets/sons/cran-4.wav';
import cran5 from '../assets/sons/cran-5.wav';
import cran6 from '../assets/sons/cran-6.wav';
import cran7 from '../assets/sons/cran-7.wav';
import cran8 from '../assets/sons/cran-8.wav';
import ticDeMontre1 from '../assets/sons/tic-de-montre-1.wav';
import ticDeMontre2 from '../assets/sons/tic-de-montre-2.wav';
import ticDeMontre3 from '../assets/sons/tic-de-montre-3.wav';
import ticDeMontre4 from '../assets/sons/tic-de-montre-4.wav';
import cliquet1 from '../assets/sons/cliquet-1.wav';
import cliquet2 from '../assets/sons/cliquet-2.wav';
import cliquet3 from '../assets/sons/cliquet-3.wav';
import cliquet4 from '../assets/sons/cliquet-4.wav';
import pieceDeMonnaie1 from '../assets/sons/piece-de-monnaie-1.wav';
import aiguille1 from '../assets/sons/aiguille-1.wav';
import ressort1 from '../assets/sons/ressort-1.wav';
import clochette1 from '../assets/sons/clochette-1.wav';
import aimant1 from '../assets/sons/aimant-1.wav';
import aimant2 from '../assets/sons/aimant-2.wav';
import aimant3 from '../assets/sons/aimant-3.wav';
import aimant4 from '../assets/sons/aimant-4.wav';
import ting1 from '../assets/sons/ting-1.wav';
import clink1 from '../assets/sons/clink-1.wav';
import goutte1 from '../assets/sons/goutte-1.wav';
import cristal1 from '../assets/sons/cristal-1.wav';
import carillonDeVerre1 from '../assets/sons/carillon-de-verre-1.wav';
import bulle1 from '../assets/sons/bulle-1.wav';
import tacDeBois1 from '../assets/sons/tac-de-bois-1.wav';
import tacDeBois2 from '../assets/sons/tac-de-bois-2.wav';
import tacDeBois3 from '../assets/sons/tac-de-bois-3.wav';
import tacDeBois4 from '../assets/sons/tac-de-bois-4.wav';
import toucheDeClavier1 from '../assets/sons/touche-de-clavier-1.wav';
import toucheDeClavier2 from '../assets/sons/touche-de-clavier-2.wav';
import toucheDeClavier3 from '../assets/sons/touche-de-clavier-3.wav';
import toucheDeClavier4 from '../assets/sons/touche-de-clavier-4.wav';
import plastique1 from '../assets/sons/plastique-1.wav';
import plastique2 from '../assets/sons/plastique-2.wav';
import plastique3 from '../assets/sons/plastique-3.wav';
import plastique4 from '../assets/sons/plastique-4.wav';
import gammeQuiMonte1 from '../assets/sons/gamme-qui-monte-1.wav';
import gammeQuiMonte2 from '../assets/sons/gamme-qui-monte-2.wav';
import gammeQuiMonte3 from '../assets/sons/gamme-qui-monte-3.wav';
import gammeQuiMonte4 from '../assets/sons/gamme-qui-monte-4.wav';
import gammeQuiMonte5 from '../assets/sons/gamme-qui-monte-5.wav';
import gammeQuiMonte6 from '../assets/sons/gamme-qui-monte-6.wav';
import gammeQuiMonte7 from '../assets/sons/gamme-qui-monte-7.wav';
import gammeQuiMonte8 from '../assets/sons/gamme-qui-monte-8.wav';
import gammeQuiDescend1 from '../assets/sons/gamme-qui-descend-1.wav';
import gammeQuiDescend2 from '../assets/sons/gamme-qui-descend-2.wav';
import gammeQuiDescend3 from '../assets/sons/gamme-qui-descend-3.wav';
import gammeQuiDescend4 from '../assets/sons/gamme-qui-descend-4.wav';
import gammeQuiDescend5 from '../assets/sons/gamme-qui-descend-5.wav';
import gammeQuiDescend6 from '../assets/sons/gamme-qui-descend-6.wav';
import gammeQuiDescend7 from '../assets/sons/gamme-qui-descend-7.wav';
import gammeQuiDescend8 from '../assets/sons/gamme-qui-descend-8.wav';
import deuxNotes1 from '../assets/sons/deux-notes-1.wav';
import deuxNotes2 from '../assets/sons/deux-notes-2.wav';
import monteAvecLePoids1 from '../assets/sons/monte-avec-le-poids-1.wav';
import monteAvecLePoids2 from '../assets/sons/monte-avec-le-poids-2.wav';
import monteAvecLePoids3 from '../assets/sons/monte-avec-le-poids-3.wav';
import monteAvecLePoids4 from '../assets/sons/monte-avec-le-poids-4.wav';
import monteAvecLePoids5 from '../assets/sons/monte-avec-le-poids-5.wav';
import monteAvecLePoids6 from '../assets/sons/monte-avec-le-poids-6.wav';
import monteAvecLePoids7 from '../assets/sons/monte-avec-le-poids-7.wav';
import monteAvecLePoids8 from '../assets/sons/monte-avec-le-poids-8.wav';
import monteAvecLePoids9 from '../assets/sons/monte-avec-le-poids-9.wav';
import monteAvecLePoids10 from '../assets/sons/monte-avec-le-poids-10.wav';

export const SONS_IDS = ['roue', 'tic-de-montre', 'cliquet', 'piece-de-monnaie', 'aiguille', 'ressort', 'clochette', 'aimant', 'ting', 'clink', 'goutte', 'cristal', 'carillon-de-verre', 'bulle', 'tac-de-bois', 'touche-de-clavier', 'plastique', 'gamme-qui-monte', 'gamme-qui-descend', 'deux-notes', 'monte-avec-le-poids'] as const;
export type SonId = (typeof SONS_IDS)[number];

export const SONS: Record<SonId, readonly string[]> = {
  /* Roue de la fortune — son enregistrement découpé (2026-09-21 au matin). */
  roue: [cran1, cran2, cran3, cran4, cran5, cran6, cran7, cran8],
  /* Tic de montre — Métal, 4 200 Hz. */
  'tic-de-montre': [ticDeMontre1, ticDeMontre2, ticDeMontre3, ticDeMontre4],
  /* Cliquet — Métal, 2 500 Hz. */
  'cliquet': [cliquet1, cliquet2, cliquet3, cliquet4],
  /* Pièce de monnaie — Métal, 2 900 · 4 300 · 6 100 Hz. */
  'piece-de-monnaie': [pieceDeMonnaie1],
  /* Aiguille — Métal, 5 000 · 7 300 Hz. */
  'aiguille': [aiguille1],
  /* Ressort — Métal, 1 800 → 1 200 Hz. */
  'ressort': [ressort1],
  /* Clochette — Métal, la7 (3 520 Hz). */
  'clochette': [clochette1],
  /* Aimant — Métal, 900 Hz. */
  'aimant': [aimant1, aimant2, aimant3, aimant4],
  /* Ting — Verre, do8 (4 186 Hz). */
  'ting': [ting1],
  /* Clink — Verre, mi7 (2 637 Hz) + 6 200 Hz. */
  'clink': [clink1],
  /* Goutte — Verre, 2 500 → 3 500 Hz. */
  'goutte': [goutte1],
  /* Cristal — Verre, mi8 (5 274 Hz) + 7 900 Hz. */
  'cristal': [cristal1],
  /* Carillon de verre — Verre, sol7 (3 136 Hz) + 4 700 Hz. */
  'carillon-de-verre': [carillonDeVerre1],
  /* Bulle — Verre, 1 500 → 2 200 Hz. */
  'bulle': [bulle1],
  /* Tac de bois — Bois et plastique, 1 100 Hz. */
  'tac-de-bois': [tacDeBois1, tacDeBois2, tacDeBois3, tacDeBois4],
  /* Touche de clavier — Bois et plastique, 400 Hz. */
  'touche-de-clavier': [toucheDeClavier1, toucheDeClavier2, toucheDeClavier3, toucheDeClavier4],
  /* Plastique — Bois et plastique, 1 800 Hz. */
  'plastique': [plastique1, plastique2, plastique3, plastique4],
  /* Gamme qui monte — La note change, pentatonique do7 → mi8. */
  'gamme-qui-monte': [gammeQuiMonte1, gammeQuiMonte2, gammeQuiMonte3, gammeQuiMonte4, gammeQuiMonte5, gammeQuiMonte6, gammeQuiMonte7, gammeQuiMonte8],
  /* Gamme qui descend — La note change, pentatonique mi8 → do7. */
  'gamme-qui-descend': [gammeQuiDescend1, gammeQuiDescend2, gammeQuiDescend3, gammeQuiDescend4, gammeQuiDescend5, gammeQuiDescend6, gammeQuiDescend7, gammeQuiDescend8],
  /* Deux notes — La note change, la7 / ré8 (3 520 / 4 699 Hz). */
  'deux-notes': [deuxNotes1, deuxNotes2],
  /* Monte avec le poids — La note change, do7 à do8 sur chaque kilo, un morceau par dixième. */
  'monte-avec-le-poids': [monteAvecLePoids1, monteAvecLePoids2, monteAvecLePoids3, monteAvecLePoids4, monteAvecLePoids5, monteAvecLePoids6, monteAvecLePoids7, monteAvecLePoids8, monteAvecLePoids9, monteAvecLePoids10],
};
