/**
 * LE MENU PRINCIPAL (2026-09-19, « remplace le lien profil du menu par une
 * icone menu qui ouvre un menu »), en trois sections, dans son ordre — celui
 * de la V1 (`versions/mixte/App.tsx`, `quickMenuSections`), qu'elle a redit
 * entrée par entrée :
 *   Préférences — Activation Modules, Notifications, Thème et couleurs,
 *                 Badges ;
 *   Export      — Nouveau rapport médical, Rapports disponibles ;
 *   GLP1LOW et vous (le titre porte le mot-symbole dessiné, suivi de
 *                 « et vous ») — Mon compte, Avis et Feedback, Sondage, FAQ,
 *                 Ciel.
 * « Admin (seulement pour le compte administrateur) » n'est pas là : la V2
 * n'a pas de compte, donc pas d'administrateur ; l'entrée viendra avec lui.
 *
 * Le nom de chaque section et de chaque entrée vit dans `i18n/textes.ts`,
 * sous contrat : une entrée ajoutée ici sans son nom ne compile pas.
 *
 * AUCUNE ENTRÉE NE MÈNE ENCORE NULLE PART : ce fichier ne dit que la liste.
 */
export const SECTIONS_MENU = ['preferences', 'export', 'glowEtVous'] as const;
export type SectionMenu = (typeof SECTIONS_MENU)[number];

export const ENTREES_MENU_PRINCIPAL = [
  'modules',
  'notifications',
  'theme',
  'badges',
  'nouveauRapport',
  'rapports',
  'compte',
  'avis',
  'sondage',
  'faq',
  'ciel',
] as const;
export type EntreeMenuPrincipal = (typeof ENTREES_MENU_PRINCIPAL)[number];

/** Les entrées de chaque section, dans l'ordre. */
export const ENTREES_PAR_SECTION: Record<SectionMenu, readonly EntreeMenuPrincipal[]> = {
  preferences: ['modules', 'notifications', 'theme', 'badges'],
  export: ['nouveauRapport', 'rapports'],
  glowEtVous: ['compte', 'avis', 'sondage', 'faq', 'ciel'],
};
