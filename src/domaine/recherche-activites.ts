import type { CategorieActivite } from './activites';
import { CATALOGUE_ACTIVITES, type NoeudActivite } from './activites-catalogue';

/**
 * LA RECHERCHE D'UNE ACTIVITÉ (2026-09-25, son image du champ de
 * recherche : « La recherche propose un sport uniquement du niveau 1 : pas
 * du niveau 0, ni des niveau 2, 3 etc.. si on tape un mot qui apparait
 * dans un sport de niveau 2 ou 3, on suggere en resultat de recherche le
 * sport de niveau 1 correspondant ») : un résultat est TOUJOURS un nœud de
 * niveau 1 — un groupe d'une catégorie, ou une activité seule —, jamais
 * une catégorie, jamais un sous-groupe. Un mot trouvé dans un sous-groupe
 * ou une activité fait remonter le nœud de niveau 1 qui le porte, une
 * fois. Le mot se cherche sans accents ni casse, AU DÉBUT D'UN MOT
 * (« ping » trouve « ping-pong », pas « camping » — vu au pilotage), et
 * DANS LE FRANÇAIS SEULEMENT : l'intitulé anglais du Compendium reste au
 * catalogue mais ne répond pas (2026-09-25 au soir, « pourquoi
 * calilistenie apparait qd je tape lu ? » — « lunges » dans l'anglais de
 * la callisthénie). Ce fichier ne connaît ni l'écran ni le navigateur.
 */

export interface ResultatActivite {
  categorie: CategorieActivite;
  noeud: NoeudActivite;
}

/** Sans accents, en minuscules, tout ce qui n'est pas lettre ou chiffre
    devenu une espace, les espaces resserrées : « Vélo, montagne » se lit
    « velo montagne », « ping-pong » « ping pong ». */
export function normaliser(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Le mot est au début d'un mot du texte. */
function commenceUnMot(texte: string, mot: string): boolean {
  return ` ${normaliser(texte)}`.includes(` ${mot}`);
}

/** Le nœud, ou l'un de ses descendants, porte le mot. */
function porteLeMot(noeud: NoeudActivite, mot: string): boolean {
  if (commenceUnMot(noeud.nom, mot)) return true;
  if (noeud.activites.some((a) => commenceUnMot(a.nom, mot))) return true;
  return noeud.sous.some((s) => porteLeMot(s, mot));
}

/** Les nœuds de niveau 1 qui répondent au mot, dans l'ordre du catalogue ;
    rien pour un mot vide. */
export function chercherActivites(requete: string, catalogue = CATALOGUE_ACTIVITES): ResultatActivite[] {
  const mot = normaliser(requete);
  if (!mot) return [];
  const resultats: ResultatActivite[] = [];
  for (const categorie of Object.keys(catalogue) as CategorieActivite[]) {
    for (const noeud of catalogue[categorie]) {
      if (porteLeMot(noeud, mot)) resultats.push({ categorie, noeud });
    }
  }
  return resultats;
}
