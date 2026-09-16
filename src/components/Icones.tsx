/**
 * LES ICÔNES DE L'APPLICATION — « les icones sont celles qui existent deja »
 * (2026-09-16) : les tracés de Lucide que la V1 employait, repris tracé par
 * tracé et SANS la bibliothèque — la V2 n'a pas de bibliothèque d'icônes, et
 * huit dessins ne justifient pas une dépendance. Lucide est sous licence ISC :
 * les tracés se recopient.
 *
 * AUCUNE COULEUR NI AUCUNE TAILLE ICI : le trait, sa graisse, ses bouts ronds
 * sont peints par la classe `icone` dans `page.css` ; la taille est celle de
 * l'endroit qui abrite l'icône. Chaque icône est `aria-hidden` : elle
 * accompagne toujours un mot, ou ne dit rien.
 */

/** Le cadre commun : la fenêtre de Lucide, et la classe qui peint le trait. */
function Icone({ children }: { children: React.ReactNode }) {
  return (
    <svg className="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** Lucide `house` — l'accueil. */
export function IconeMaison() {
  return (
    <Icone>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Icone>
  );
}

/** Lucide `book-open-text` — le journal, celui que la V1 importait. */
export function IconeJournal() {
  return (
    <Icone>
      <path d="M12 7v14" />
      <path d="M16 12h2" />
      <path d="M16 8h2" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      <path d="M6 12h2" />
      <path d="M6 8h2" />
    </Icone>
  );
}

/** Lucide `plus` — ajouter. */
export function IconePlus() {
  return (
    <Icone>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </Icone>
  );
}

/** Lucide `chart-no-axes-column` — l'analyse : les trois barres de son image. */
export function IconeAnalyse() {
  return (
    <Icone>
      <path d="M5 21v-6" />
      <path d="M12 21V3" />
      <path d="M19 21V9" />
    </Icone>
  );
}

/** Lucide `user` — le profil. */
export function IconeProfil() {
  return (
    <Icone>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icone>
  );
}

/** Lucide `search` — la recherche. */
export function IconeRecherche() {
  return (
    <Icone>
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </Icone>
  );
}

/** Lucide `settings` — les préférences, celui que la V1 importait. */
export function IconeReglages() {
  return (
    <Icone>
      <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
      <circle cx="12" cy="12" r="3" />
    </Icone>
  );
}

/** Lucide `pencil` — modifier, sur le portrait. */
export function IconeCrayon() {
  return (
    <Icone>
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </Icone>
  );
}
