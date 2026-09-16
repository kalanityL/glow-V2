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

import { useId } from 'react';

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

/* ── LES SEPT MODULES (2026-09-16, « les 7 icones […] doivent etre celles de
   la v1 ») : les dessins du menu du bas de la V1, dans l'ordre qu'elle a
   donné — traitement, poids, effets secondaires, menu, activité, sommeil,
   temps pour soi. Trois viennent de Lucide (seringue, pomme, haltère), quatre
   sont des dessins maison de la V1 (`V1/src/shared/icons/`, `medication/`),
   repris tracé pour tracé.

   LA BANDE COMMUNE : les dessins maison de la V1 occupent 3 → 21 de leur
   carré de 24, ceux de Lucide 2 → 22. La V1 les rattrapait en resserrant la
   fenêtre (`1.2 1.2 21.6 21.6`) et en compensant le trait ; c'est repris tel
   quel — `icone--resserree` porte la fenêtre, et `page.css` le trait
   compensé. La lampe de chevet, redessinée à la bonne bande dans la V1, garde
   la fenêtre de 24. ─────────────────────────────────────────────────────── */

/** La même enveloppe, à la fenêtre resserrée des dessins maison de la V1. */
function IconeResserree({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className="icone icone--resserree"
      viewBox="1.2 1.2 21.6 21.6"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Lucide `syringe` — le traitement par injection. */
export function IconeSeringue() {
  return (
    <Icone>
      <path d="m18 2 4 4" />
      <path d="m17 7 3-3" />
      <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
      <path d="m9 11 4 4" />
      <path d="m5 19-3 3" />
      <path d="m14 4 6 6" />
    </Icone>
  );
}

/** Le comprimé rond de la V1 (`RoundPillIcon`) — le traitement par comprimé. */
export function IconeComprime() {
  return (
    <IconeResserree>
      <g transform="rotate(45 12 12)">
        <circle cx="12" cy="12" r="9" />
        <line x1="11" y1="5.5" x2="11" y2="18.5" />
        <line x1="13" y1="5.5" x2="13" y2="18.5" />
      </g>
    </IconeResserree>
  );
}

/** La balance de la V1 (`BathroomScaleIcon`) — le poids. */
export function IconeBalance() {
  return (
    <IconeResserree>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M 8 8 A 4 4 0 0 1 16 8" />
      <line x1="12" y1="4" x2="12" y2="5" />
      <line x1="9.5" y1="5.5" x2="10.2" y2="6.2" />
      <line x1="14.5" y1="5.5" x2="13.8" y2="6.2" />
      <line x1="12" y1="10" x2="11.5" y2="6.2" />
      <rect x="6.5" y="11.5" width="2.5" height="6.5" rx="1.2" className="icone__voile" />
      <rect x="15" y="11.5" width="2.5" height="6.5" rx="1.2" className="icone__voile" />
    </IconeResserree>
  );
}

/** La tête bandée de la V1 (`HeadBandageIcon`) — les effets secondaires. */
export function IconeEffetsSecondaires() {
  return (
    <IconeResserree>
      <circle cx="12" cy="12" r="9" />
      <path d="M 4.5 7.5 C 7 5, 17 5, 19.5 7.5" />
      <path d="M 3.2 10.5 C 5 7.5, 19 7.5, 20.8 10.5" />
      <path d="M 8 7 L 9.5 9.5" />
      <path d="M 12 6.2 L 12.5 9" />
      <path d="M 16 7 L 14.5 9.5" />
      <line x1="9" x2="9.01" y1="13.5" y2="13.5" />
      <line x1="15" x2="15.01" y1="13.5" y2="13.5" />
      <path d="M 15 17.5 C 14 16, 10 16, 9 17.5" />
    </IconeResserree>
  );
}

/** Lucide `apple` — le menu (repas et en-cas). */
export function IconeRepas() {
  return (
    <Icone>
      <path d="M12 6.528V3a1 1 0 0 1 1-1h0" />
      <path d="M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21" />
    </Icone>
  );
}

/** Lucide `dumbbell` — l'activité physique. */
export function IconeActivite() {
  return (
    <Icone>
      <path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" />
      <path d="m2.5 21.5 1.4-1.4" />
      <path d="m20.1 3.9 1.4-1.4" />
      <path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" />
      <path d="m9.6 14.4 4.8-4.8" />
    </Icone>
  );
}

/** La lampe de chevet de la V1 (`BedsideLampIcon`) — le sommeil. */
export function IconeSommeil() {
  return (
    <Icone>
      <path d="M7.5 2h9l3 10H4.5l3-10Z" />
      <path d="M12 12v10" />
      <path d="M7.5 22h9" />
    </Icone>
  );
}

/**
 * Le cœur « me » de la V1 (`MeTimeHeartIcon`) — un temps pour soi. Le mot est
 * en cursive et déborde du cœur ; le tracé du cœur est PERCÉ sur son passage
 * par un masque de luminance, pour que le fond, quel qu'il soit, passe au
 * travers. `#fff` et `#000` ne sont pas des couleurs : ce sont les deux
 * valeurs du masque (opaque / percé), posées en `style` pour qu'aucune
 * feuille ne les repeigne — c'est le seul endroit où un `style` est admis,
 * et la V1 le justifiait de même. La police du mot est une classe, peinte
 * dans `dessins.css`.
 */
export function IconeTempsPourSoi() {
  const maskId = `glow-me-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg
      className="icone icone--resserree icone--deborde"
      viewBox="1.2 1.2 21.6 21.6"
      aria-hidden="true"
      focusable="false"
    >
      <mask id={maskId} maskUnits="userSpaceOnUse" x="-6" y="-6" width="36" height="36">
        <rect x="-6" y="-6" width="36" height="36" style={{ fill: '#fff' }} />
        <text
          x="12"
          y="14.5"
          textAnchor="middle"
          className="icone__mot"
          paintOrder="stroke"
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ fill: '#000', stroke: '#000' }}
        >
          me
        </text>
      </mask>
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        mask={`url(#${maskId})`}
      />
      <text x="12" y="14.5" textAnchor="middle" className="icone__mot icone__mot--encre">
        me
      </text>
    </svg>
  );
}
