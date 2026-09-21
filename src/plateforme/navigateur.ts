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
 * LE CHEMIN DE LA PAGE OUVERTE (2026-09-21, « sur http://localhost:3002/long
 * fait sert exactement la meme chose mais dans une simulation de telephone
 * où la hauteur d ecran […] fasse 850px ») : `/`, `/long`… Web seulement —
 * en natif il n'y a pas d'adresse, et le cadre du téléphone qui s'en sert
 * n'existe pas non plus. `/` quand il n'y a pas de fenêtre (les tests).
 */
export function cheminDeLaPage(): string {
  return typeof window === 'undefined' ? '/' : window.location.pathname;
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
  /* Au doigt comme à la souris (2026-09-21, « qd on clique hors d'un bloc
     fermable : meme comportement que si on avait cliqué sur la croix ») :
     `pointerdown` part dès que le doigt se pose, là où `mousedown` n'est
     rejoué sur un téléphone qu'après le relâcher, et pas toujours. */
  const evenement = 'onpointerdown' in window ? 'pointerdown' : 'mousedown';
  document.addEventListener(evenement, auClic);
  document.addEventListener('keydown', auClavier);
  return () => {
    document.removeEventListener(evenement, auClic);
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
  /* UN RESTE D'UNE PASTILLE NE SE SIGNALE PAS (2026-09-21, son téléphone :
     la pastille posée sur « Oui » pour quelques pixels de marge sous les
     boutons — « le positionnement de l'indicateur est fâcheux ») : quand
     ce qui reste sous le bord tient dans la hauteur de la pastille et son
     air, elle cacherait plus qu'elle n'annonce. */
  const RESTE_MIN = 44;
  const mesurer = () => quand(zone.scrollHeight - zone.scrollTop - zone.clientHeight > RESTE_MIN);
  mesurer();
  zone.addEventListener('scroll', mesurer, { passive: true });
  const tailles = new ResizeObserver(mesurer);
  tailles.observe(zone);
  for (const enfant of Array.from(zone.children)) tailles.observe(enfant);
  /* CE QUI APPARAÎT APRÈS COUP (2026-09-21, « je clique sur aucun puis sur
     injection : la petite indication de scroll n'est pas là ») : une liste
     qui se déplie est un enfant nouveau, que l'observateur de tailles ne
     connaissait pas — on le mesure, et on l'observe à son tour. */
  const enfants = new MutationObserver(() => {
    for (const enfant of Array.from(zone.children)) tailles.observe(enfant);
    mesurer();
  });
  enfants.observe(zone, { childList: true, subtree: true });
  return () => {
    zone.removeEventListener('scroll', mesurer);
    tailles.disconnect();
    enfants.disconnect();
  };
}

/** Fait défiler une zone vers le bas d'une page de ce qu'elle montre, en
    glissant — moins un peu, pour que la dernière ligne vue reste en vue. */
export function defilerDUnePage(zone: HTMLElement | null): void {
  zone?.scrollBy({ top: Math.max(40, zone.clientHeight * 0.8), behavior: 'smooth' });
}

/** Amène l'élément entier dans la zone visible, au plus près. */
export function montrerEnEntier(element: Element | null): void {
  element?.scrollIntoView({ block: 'nearest' });
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
export function montrerVolet(carrousel: Element | null, index: number, doux = true): void {
  carrousel?.scrollTo({ left: carrousel.clientWidth * index, behavior: doux ? 'smooth' : 'auto' });
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

/* LES CLICS EN ATTENTE : une file, jouée un clic à la fois. */
let clicsEnAttente = 0;
let clicsEnCours = false;
let tourDeClic = 0;

/** L'écart entre deux clics, et la file au plus long : lentement, chaque
    cran s'entend ; vite, un roulement régulier plutôt qu'une rafale. */
const ECART_CLICS_MS = 45;
const FILE_CLICS_MAX = 6;

/**
 * FAIT CLIQUER, `nombre` fois, en tournant sur les morceaux donnés
 * (2026-09-21, « ouvre le son roue de la fortune, et utilise les morceaux
 * de ce son pour qd on modifie un poids, les clics doivent correspondre au
 * passage d'un cran de la règle graduée ») : chaque demande entre dans une
 * file qui joue un clic toutes les 45 ms, et ne garde que six clics
 * d'avance. Les sons sont des FICHIERS embarqués (`src/assets/sons/`),
 * jamais distants. Un navigateur qui refuse le son (pas de geste
 * préalable) se tait : rien ne se casse. En natif, le lecteur audio du
 * téléphone derrière le même verbe.
 */
export function jouerClics(morceaux: readonly string[], nombre = 1): void {
  if (morceaux.length === 0) return;
  clicsEnAttente = Math.min(clicsEnAttente + nombre, FILE_CLICS_MAX);
  if (clicsEnCours) return;
  clicsEnCours = true;
  const suivant = () => {
    if (clicsEnAttente <= 0) {
      clicsEnCours = false;
      return;
    }
    clicsEnAttente -= 1;
    tourDeClic = (tourDeClic + 1) % morceaux.length;
    new Audio(morceaux[tourDeClic]).play().catch(() => {
      /* Le son refusé se tait. */
    });
    setTimeout(suivant, ECART_CLICS_MS);
  };
  suivant();
}
