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
 *
 * `dedans` peut rendre PLUSIEURS éléments (2026-09-20) : le panneau, et le
 * bouton qui l'ouvre — un clic sur ce bouton n'est pas un clic « à côté »,
 * sinon il fermerait le panneau juste avant de le rouvrir, et « reclic
 * ferme » ne marcherait jamais.
 */
export function surClicDehors(
  dedans: () => Element | null | readonly (Element | null)[],
  quand: () => void,
): () => void {
  const auClic = (evenement: MouseEvent) => {
    const cible = evenement.target as Node;
    const elements = dedans();
    const liste = Array.isArray(elements) ? elements : [elements];
    if (!liste.some((element) => element?.contains(cible))) quand();
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

/** L'écran du téléphone — le bloc conteneur des éléments fixes (`App`). */
export function ecranDuTelephone(): HTMLElement | null {
  return document.getElementById('phone-screen');
}

/** Où un panneau se pose, en pixels DEPUIS L'ÉCRAN DU TÉLÉPHONE. */
export interface PlacePanneau {
  left: number;
  width: number;
  maxHeight: number;
  /** Posé sous l'ancre (`top`) ou, faute de place, au-dessus (`bottom`). */
  top?: number;
  bottom?: number;
}

/**
 * PLACE UN PANNEAU SOUS SON ANCRE, DANS L'ÉCRAN — JAMAIS DEHORS (2026-09-20,
 * « Regle ABSOLUE : AUCUN SELECT NE DOIT JAMAIS DEPASSER DE L'ECRAN ») : de
 * la largeur de l'ancre, ramené dans les bords ; sous l'ancre, ou au-dessus
 * quand la place manque dessous et qu'il y en a plus dessus ; jamais plus
 * haut que la place qui reste. Les coordonnées sont celles de l'écran, qui
 * porte les éléments fixes.
 */
export function placerPanneau(ancre: Element | null, hauteurVoulue: number, largeurMin = 0): PlacePanneau | null {
  const ecran = ecranDuTelephone();
  if (!ancre || !ecran) return null;
  const e = ecran.getBoundingClientRect();
  const a = ancre.getBoundingClientRect();
  const marge = 8;
  const ecart = 4;
  const placeDessous = e.bottom - a.bottom - marge - ecart;
  const placeDessus = a.top - e.top - marge - ecart;
  const dessus = placeDessous < Math.min(hauteurVoulue, 180) && placeDessus > placeDessous;
  const maxHeight = Math.max(96, Math.min(hauteurVoulue, dessus ? placeDessus : placeDessous));
  const width = Math.min(Math.max(a.width, largeurMin), e.width - 2 * marge);
  const left = Math.min(Math.max(a.left - e.left, marge), e.width - marge - width);
  return dessus
    ? { left, width, maxHeight, bottom: e.bottom - a.top + ecart }
    : { left, width, maxHeight, top: a.bottom - e.top + ecart };
}

/** LA PAGE qui abrite un élément — là où un panneau se porte, pour hériter
    des jetons du thème posés sur elle ; l'écran, à défaut. */
export function pageDe(element: Element | null): HTMLElement | null {
  return (element?.closest('.page') as HTMLElement | null) ?? ecranDuTelephone();
}

/** Appelle `quand` à tout défilement HORS des éléments `dedans` — un
    panneau resté ouvert se décrocherait de son ancre. */
export function surDefilementHors(
  dedans: () => readonly (Element | null)[],
  quand: () => void,
): () => void {
  const auDefilement = (evenement: Event) => {
    const cible = evenement.target;
    if (cible instanceof Node && dedans().some((element) => element?.contains(cible))) return;
    quand();
  };
  window.addEventListener('scroll', auDefilement, { capture: true, passive: true });
  return () => window.removeEventListener('scroll', auDefilement, { capture: true });
}

/**
 * DIT SI UN DÉFILEMENT VERTICAL RESTE DISPONIBLE dans `zone` — s'il y a du
 * contenu sous le bord visible —, maintenant et à chaque changement : le
 * défilement lui-même, et la taille de la zone ou de son contenu
 * (`ResizeObserver`). Rend de quoi se désabonner.
 */
export function surDefilementDisponible(zone: HTMLElement | null, quand: (disponible: boolean) => void): () => void {
  if (!zone) return () => {};
  const mesurer = () => quand(zone.scrollHeight - zone.scrollTop - zone.clientHeight > 4);
  mesurer();
  zone.addEventListener('scroll', mesurer, { passive: true });
  const observateur = new ResizeObserver(mesurer);
  observateur.observe(zone);
  for (const enfant of Array.from(zone.children)) observateur.observe(enfant);
  return () => {
    zone.removeEventListener('scroll', mesurer);
    observateur.disconnect();
  };
}

/** Fait défiler une zone vers le bas d'une page de ce qu'elle montre, en
    glissant — moins un peu, pour que la dernière ligne vue reste en vue. */
export function defilerDUnePage(zone: HTMLElement | null): void {
  zone?.scrollBy({ top: Math.max(40, zone.clientHeight * 0.8), behavior: 'smooth' });
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

/**
 * LE STOCKAGE LOCAL DE L'APPAREIL (2026-09-20) : lire et écrire un texte sous
 * une clé, sur l'appareil et nulle part ailleurs. `null` quand il n'y a rien
 * ou que le stockage est indisponible (navigation privée, quota) ; une
 * écriture qui échoue se tait — la forme de ce qu'on écrit est décidée
 * ailleurs (`app/enregistrement.ts`). En natif, c'est le stockage sécurisé
 * du téléphone derrière les mêmes deux verbes.
 */
export function lireEnregistre(cle: string): string | null {
  try {
    return localStorage.getItem(cle);
  } catch {
    return null;
  }
}

/** Efface une clé enregistrée — une migration finie retire l'ancienne. */
export function effacerEnregistre(cle: string): void {
  try {
    localStorage.removeItem(cle);
  } catch {
    /* Stockage indisponible. */
  }
}

export function enregistrer(cle: string, texte: string): void {
  try {
    localStorage.setItem(cle, texte);
  } catch {
    /* Stockage indisponible : l'application continue sans enregistrer. */
  }
}

/** Où en est un défilement horizontal : sa position, et sa course totale
    (2026-09-20, la règle des poids — le code n'en fait qu'un rapport). */
export function defilementHorizontal(element: Element | null): { position: number; course: number } {
  if (!element) return { position: 0, course: 0 };
  return { position: element.scrollLeft, course: element.scrollWidth - element.clientWidth };
}

/**
 * APPELLE `action` QUAND UN DÉFILEMENT S'ARRÊTE (2026-09-20, « aimant
 * immédiat ») : sur `scrollend` là où le navigateur le donne, sinon après
 * un court silence des événements `scroll`. Rend de quoi se désabonner.
 */
export function surFinDeDefilement(element: Element | null, action: () => void): () => void {
  if (!element) return () => {};
  if ('onscrollend' in window) {
    element.addEventListener('scrollend', action);
    return () => element.removeEventListener('scrollend', action);
  }
  let minuteur: ReturnType<typeof setTimeout> | undefined;
  const surScroll = () => {
    clearTimeout(minuteur);
    minuteur = setTimeout(action, 80);
  };
  element.addEventListener('scroll', surScroll);
  return () => {
    clearTimeout(minuteur);
    element.removeEventListener('scroll', surScroll);
  };
}

/** Amène un défilement horizontal à une position, en glissant ou d'un coup. */
export function defilerHorizontalA(element: Element | null, position: number, doux: boolean): void {
  element?.scrollTo({ left: position, behavior: doux ? 'smooth' : 'auto' });
}
