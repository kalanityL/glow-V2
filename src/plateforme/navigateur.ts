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

/** La valeur calculée d'une propriété CSS de l'élément — un jeton du thème,
    par exemple —, ou une chaîne vide. */
export function proprieteCalculee(element: Element | null, nom: string): string {
  return element ? getComputedStyle(element).getPropertyValue(nom).trim() : '';
}

/** L'adresse de l'image que porte une valeur CSS `url(…)`, ou `null`. */
export function adresseDeLImage(valeurCss: string): string | null {
  return /url\(["']?([^"')]+)["']?\)/.exec(valeurCss)?.[1] ?? null;
}

/**
 * LES PIXELS D'UNE IMAGE, réduite à un carré de 32 (2026-09-16, la teinte
 * des pastilles « comme YouTube », calculée depuis la photo de fond) : charge
 * l'image et rend ses 1 024 pixels en rouge, vert, bleu. Renvoie `null` si
 * elle ne se lit pas ; ce qu'on fait des pixels est décidé ailleurs
 * (`domaine/couleurs.ts`) — ce fichier ne porte que des verbes. En React
 * Native, c'est une bibliothèque de palette d'image qui tiendra ce rôle,
 * derrière la même signature.
 */
export async function pixelsDeLImage(
  url: string,
): Promise<readonly (readonly [number, number, number])[] | null> {
  const image = new Image();
  image.src = url;
  try {
    await image.decode();
  } catch {
    return null;
  }

  const cote = 32;
  const toile = document.createElement('canvas');
  toile.width = cote;
  toile.height = cote;
  const contexte = toile.getContext('2d');
  if (!contexte) return null;
  contexte.drawImage(image, 0, 0, cote, cote);
  const donnees = contexte.getImageData(0, 0, cote, cote).data;

  const pixels: (readonly [number, number, number])[] = [];
  for (let i = 0; i < donnees.length; i += 4) {
    pixels.push([donnees[i], donnees[i + 1], donnees[i + 2]]);
  }
  return pixels;
}
