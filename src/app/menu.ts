/**
 * LES ENTRÉES DU MENU DU BAS, dans l'ordre (2026-09-16, d'après son image) :
 * Accueil, Journal, Ajouter, Analyse, Profil. « Ajouter » est au milieu, en
 * relief. Le nom de chacune vit dans `i18n/textes.ts` — `Record<EntreeMenu,
 * string>`, une entrée ajoutée ici sans son nom dans chaque langue ne compile
 * pas.
 *
 * AUCUNE ENTRÉE NE MÈNE ENCORE NULLE PART (« les liens ne menent pour
 * l'instant nulle part ») : ce fichier ne dit que la liste.
 */
export const ENTREES_MENU = ['accueil', 'journal', 'ajouter', 'analyse', 'profil'] as const;

export type EntreeMenu = (typeof ENTREES_MENU)[number];
