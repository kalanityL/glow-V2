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

/** Amène un défilement horizontal à une position, en glissant ou d'un coup. */
export function defilerHorizontalA(element: Element | null, position: number, doux: boolean): void {
  element?.scrollTo({ left: position, behavior: doux ? 'smooth' : 'auto' });
}

/**
 * JOUE UN SON, `nombre` fois (2026-09-20, les clics de la graduation du poids) :
 * un clic par cran, espacés de quelques millisecondes pour qu'on les entende
 * un à un plutôt qu'en un seul bruit ; au-delà de vingt d'un coup — une
 * pichenette qui traverse la graduation —, on s'arrête à vingt. Le son est un
 * FICHIER embarqué (`src/assets/sons/`), jamais distant. Un navigateur qui
 * refuse le son (pas de geste préalable) se tait : rien ne se casse. En
 * natif, le lecteur audio du téléphone derrière le même verbe.
 */
export function jouerSon(url: string, nombre = 1): void {
  const fois = Math.min(nombre, 20);
  for (let i = 0; i < fois; i += 1) {
    setTimeout(() => {
      new Audio(url).play().catch(() => {
        /* Le son refusé se tait. */
      });
    }, i * 24);
  }
}
