/**
 * LES ICÔNES DE L'APPLICATION — « les icones sont celles qui existent deja »
 * (2026-09-16) : les tracés de Lucide que la V1 employait, repris tracé par
 * tracé et SANS la bibliothèque — la V2 n'a pas de bibliothèque d'icônes, et
 * une poignée de dessins ne justifie pas une dépendance. Lucide est sous licence ISC :
 * les tracés se recopient.
 *
 * AUCUNE COULEUR NI AUCUNE TAILLE ICI : le trait, sa graisse, ses bouts ronds
 * sont peints par la classe `icone` dans `page.css` ; la taille est celle de
 * l'endroit qui abrite l'icône. Chaque icône est `aria-hidden` : elle
 * accompagne toujours un mot, ou ne dit rien.
 */

import { useId } from 'react';
import { STAR_PATHS, STAR_VIEWBOX } from './Logomark';

/** Le cadre commun : la fenêtre de Lucide, et la classe qui peint le trait. */
function Icone({ children }: { children: React.ReactNode }) {
  return (
    <svg className="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/**
 * LES TROIS ÉTOILES DU LOGO, EN TRAIT — l'accueil (2026-09-16, « icone
 * d'accueil remplace la maison par les étoiles comme pour la v1 ») : la V1
 * mettait ce motif (`MonCielIcon`) sur l'onglet de la Maison. Les tracés et
 * la fenêtre sont ceux du logo, et la fenêtre de 26,4 amincit le trait :
 * `icone--etoiles` le compense dans `page.css`, comme la V1 le faisait.
 */
export function IconeEtoiles() {
  return (
    <svg
      className="icone icone--etoiles"
      viewBox={STAR_VIEWBOX}
      aria-hidden="true"
      focusable="false"
    >
      {STAR_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
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

/** Lucide `arrow-left` — revenir à la page d'avant. */
export function IconeRetour() {
  return (
    <Icone>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </Icone>
  );
}

/** Lucide `calendar` — une date, l'année de naissance. */
export function IconeCalendrier() {
  return (
    <Icone>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </Icone>
  );
}

/** Lucide `mail` — l'adresse. */
export function IconeCourriel() {
  return (
    <Icone>
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </Icone>
  );
}

/**
 * UNE TOISE — la taille (2026-09-20, « icone hauteur dans information :
 * inspire toi de cette image ») : le mât gradué sur un socle, et la tête
 * coulissante en haut, d'après son image. Dessin maison, dans la bande
 * commune de Lucide (2 → 22), au trait des voisines.
 */
export function IconeToise() {
  return (
    <Icone>
      <path d="M7 2v20" />
      <path d="M3 22h13" />
      <path d="M7 6h12" />
      <path d="M7 4h3" />
      <path d="M7 10h3" />
      <path d="M7 13h2" />
      <path d="M7 16h3" />
      <path d="M7 19h2" />
    </Icone>
  );
}

/** Lucide `palette` — l'avatar qu'on compose. Les quatre points sont pleins,
    par la classe `icone__plein`. */
export function IconePalette() {
  return (
    <Icone>
      <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
      <circle cx="13.5" cy="6.5" r=".5" className="icone__plein" />
      <circle cx="17.5" cy="10.5" r=".5" className="icone__plein" />
      <circle cx="6.5" cy="12.5" r=".5" className="icone__plein" />
      <circle cx="8.5" cy="7.5" r=".5" className="icone__plein" />
    </Icone>
  );
}

/** La cible à la flèche plantée de la V1 (`TargetArrowIcon`) — l'objectif
    final (2026-09-20, « ajouter fleche plantée au centre de la cible »). Le
    point du centre est plein. */
export function IconeCible() {
  return (
    <Icone>
      <circle cx="10" cy="14" r="8" />
      <circle cx="10" cy="14" r="4.5" />
      <circle cx="10" cy="14" r="1.2" className="icone__plein" />
      <path d="M10 14 L20.5 3.5" />
      <path d="M16.2 5.2 L18.8 7.8" />
      <path d="M18.2 3.2 L20.8 5.8" />
    </Icone>
  );
}

/* ── LE MENU PRINCIPAL (2026-09-19) : les icônes que la V1 donnait à ces
   entrées (`quickMenuSections`), Lucide sauf la constellation, dessin
   maison de la V1. ──────────────────────────────────────────────────────── */

/** Lucide `menu` — l'entrée « Menu » de la barre du bas. */
export function IconeMenu() {
  return (
    <Icone>
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </Icone>
  );
}

/** Lucide `layout-grid` — l'activation des modules. */
export function IconeModules() {
  return (
    <Icone>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </Icone>
  );
}

/** Lucide `bell` — les notifications. */
export function IconeNotifications() {
  return (
    <Icone>
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </Icone>
  );
}

/** Lucide `award` — les badges. */
export function IconeBadges() {
  return (
    <Icone>
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </Icone>
  );
}

/** Lucide `file-up` — un nouveau rapport médical. */
export function IconeRapport() {
  return (
    <Icone>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M12 12v6" />
      <path d="m15 15-3-3-3 3" />
    </Icone>
  );
}

/** Lucide `files` — les rapports disponibles. */
export function IconeRapports() {
  return (
    <Icone>
      <path d="M15 2a2 2 0 0 1 1.414.586l4 4A2 2 0 0 1 21 8v7a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M15 2v4a2 2 0 0 0 2 2h4" />
      <path d="M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1" />
    </Icone>
  );
}

/** Lucide `message-square-plus` — les avis. */
export function IconeAvis() {
  return (
    <Icone>
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path d="M12 8v6" />
      <path d="M9 11h6" />
    </Icone>
  );
}

/** Lucide `clipboard-list` — le sondage. */
export function IconeSondage() {
  return (
    <Icone>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </Icone>
  );
}

/** Lucide `circle-help` — la FAQ. */
export function IconeFaq() {
  return (
    <Icone>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </Icone>
  );
}

/** La constellation de la V1 (`ConstellationIcon`) — la page Ciel : quatre
    étoiles pleines reliées par un tracé pointillé, doublé d'un trait estompé. */
export function IconeConstellation() {
  return (
    <Icone>
      <path d="M5 18 10 12.5 15.5 15 20 6" className="icone__pointille" />
      <path d="M5 18 10 12.5 15.5 15 20 6" className="icone__estompe" />
      <circle cx="5" cy="18" r="1.4" className="icone__plein" />
      <circle cx="10" cy="12.5" r="1.4" className="icone__plein" />
      <circle cx="15.5" cy="15" r="1.4" className="icone__plein" />
      <circle cx="20" cy="6" r="1.4" className="icone__plein" />
    </Icone>
  );
}

/** Lucide `x` — fermer. */
export function IconeCroix() {
  return (
    <Icone>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Icone>
  );
}

/** Lucide `clock` — l'heure d'une prise. */
export function IconeHorloge() {
  return (
    <Icone>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Icone>
  );
}

/** Lucide `check` — la coche du bouton « Valider ». */
export function IconeCoche() {
  return (
    <Icone>
      <path d="M20 6 9 17l-5-5" />
    </Icone>
  );
}

/** Lucide `chevron-left` — le mois d'avant. */
export function IconeChevronGauche() {
  return (
    <Icone>
      <path d="m15 18-6-6 6-6" />
    </Icone>
  );
}

/** Lucide `chevron-right` — le mois d'après. */
export function IconeChevronDroit() {
  return (
    <Icone>
      <path d="m9 18 6-6-6-6" />
    </Icone>
  );
}

/** Lucide `lock` — le cadenas d'un badge pas encore gagné. */
export function IconeCadenas() {
  return (
    <Icone>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

/** Lucide `footprints` — la marche, celui que la V1 donnait aux pas. */
export function IconeMarche() {
  return (
    <Icone>
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
      <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
      <path d="M16 17h4" />
      <path d="M4 13h4" />
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
