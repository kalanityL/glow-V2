/**
 * LE SEUL ENDROIT DU PROJET QUI TOUCHE AU NAVIGATEUR (hors `main.tsx`).
 *
 * Règle reprise de la V1 (« Aucune API web hors de `shared/platform/` ») et
 * gardée ici sous un autre nom : tout ce qui lit `document`, `navigator` ou
 * fait défiler le DOM passe par ce fichier. Le jour de React Native, c'est
 * LUI qu'on réécrit — et rien d'autre. Un écran ou un hook qui appellerait
 * `document` en direct casserait cette promesse : c'est une faute, pas un
 * raccourci.
 *
 * Ce fichier ne porte que des VERBES. Les décisions — quand écouter, quoi
 * faire au clic — restent chez l'appelant.
 */

/** Les langues que le lecteur préfère, de la plus voulue à la moins. */
export function languesDuLecteur(): readonly string[] {
  return typeof navigator === 'undefined' ? [] : (navigator.languages ?? []);
}

/**
 * Appelle `quand` à chaque clic HORS de `dedans`, et à la touche Échap.
 * Renvoie ce qui arrête l'écoute. C'est la fermeture ordinaire d'un panneau.
 */
export function surClicDehors(dedans: () => Element | null, quand: () => void): () => void {
  const auClic = (evenement: MouseEvent) => {
    if (!dedans()?.contains(evenement.target as Node)) quand();
  };
  const auClavier = (evenement: KeyboardEvent) => {
    if (evenement.key === 'Escape') quand();
  };
  document.addEventListener('mousedown', auClic);
  document.addEventListener('keydown', auClavier);
  return () => {
    document.removeEventListener('mousedown', auClic);
    document.removeEventListener('keydown', auClavier);
  };
}

/** Amène l'élément au milieu de sa zone de défilement. */
export function centrerDansSaListe(element: Element | null): void {
  element?.scrollIntoView({ block: 'center' });
}

/** Ramène une zone de défilement à son haut. */
export function remonterEnHaut(element: Element | null): void {
  if (element) element.scrollTop = 0;
}

/** Fait glisser un carrousel horizontal jusqu'à son volet `index`. */
export function montrerVolet(carrousel: Element | null, index: number): void {
  carrousel?.scrollTo({ left: carrousel.clientWidth * index, behavior: 'smooth' });
}

/** Le volet d'un carrousel horizontal qui occupe l'écran. */
export function voletVisible(carrousel: Element | null): number {
  if (!carrousel || carrousel.clientWidth === 0) return 0;
  return Math.round(carrousel.scrollLeft / carrousel.clientWidth);
}
