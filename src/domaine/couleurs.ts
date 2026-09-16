/**
 * LES COULEURS CALCULÉES — ce qu'on tire des pixels d'une image.
 *
 * LA TEINTE DES PASTILLES DE L'ACCUEIL SE CALCULE DEPUIS LA PHOTO DE FOND
 * (2026-09-16 : « pastilles toutes de la meme couleur, couleur calculée à
 * partir du fond d'écran pour etre le plus joli possible », puis « pareil que
 * ce que fait youtube pour la couleur du cadre qui change en fonction de
 * l'image de la video ») : comme le halo de YouTube, la couleur n'est pas
 * écrite, elle se LIT dans l'image à l'exécution, et suit la photo si elle
 * change. La lecture des pixels est un verbe de la plateforme
 * (`plateforme/navigateur.ts`) ; ici, la DÉCISION : ce qu'on en fait.
 *
 * LA RÈGLE, ET POURQUOI. Un premier jet prenait la teinte MOYENNE de la photo
 * — sur un mur clair et des feuilles, un gris-vert chaud qui donnait une
 * sauge olive : « c tres moche » (2026-09-16). La moyenne d'une photo est
 * presque toujours une boue. On prend donc la TEINTE VIVE DOMINANTE : parmi
 * les pixels assez saturés et ni trop sombres ni trop clairs, la tranche de
 * dix degrés la plus peuplée — en ÉCARTANT LE JAUNE ET L'ORANGE (20° à 90°),
 * qu'elle a bannis des pastilles le même jour (« pas de jaune ni orange »).
 * Sur la photo du 2026-09-16, le vert-jaune des feuilles est écarté et
 * c'est le bleu du fauteuil et du ciel qui reste : une pastille bleu pâle.
 * S'il ne reste rien de vif, la teinte moyenne sert de repli.
 *
 * LE BLEU DU MENU ENTRE DANS LE CALCUL (2026-09-16, « prend aussi en compte
 * le bleu du menu dans ton calcul ») : la teinte finale est la MOYENNE
 * CIRCULAIRE de la teinte vive de la photo et de celle de l'entrée active du
 * menu (le jeton `--menu-actif` du thème) — à mi-chemin entre ce que montre
 * la photo et ce que porte l'interface, la pastille s'accorde aux deux.
 *
 * La pastille garde cette teinte, éclaircie à 91 % pour que l'encre et les
 * icônes y tiennent, saturée à 45 % pour se détacher du flou.
 */

/** Une couleur en rouge, vert, bleu, chacun de 0 à 255. */
export type Rgb = readonly [number, number, number];

/** La clarté de la pastille, en pour cent : claire, pour que l'encre y tienne. */
export const CLARTE_PASTILLE = 91;

/** La saturation de la pastille, en pour cent : présente, jamais criarde. */
export const SATURATION_PASTILLE = 45;

/** Les teintes bannies des pastilles : du orange au jaune-vert. */
export const TEINTES_BANNIES: readonly [number, number] = [20, 90];

/** Teinte (0–360, 0 pour un gris), saturation et clarté (0–1) d'une couleur. */
export function hsl([r, g, b]: Rgb): readonly [number, number, number] {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const delta = max - min;
  const clarte = (max + min) / 2;
  if (delta === 0) return [0, 0, clarte];
  const saturation = delta / (1 - Math.abs(2 * clarte - 1));
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  let teinte: number;
  if (max === rr) teinte = ((gg - bb) / delta) % 6;
  else if (max === gg) teinte = (bb - rr) / delta + 2;
  else teinte = (rr - gg) / delta + 4;
  return [Math.round((teinte * 60 + 360) % 360) % 360, saturation, clarte];
}

/** La teinte d'une couleur, en degrés. */
export function teinteDe(couleur: Rgb): number {
  return hsl(couleur)[0];
}

/** Vrai pour une teinte bannie des pastilles (jaune, orange). */
export function teinteBannie(teinte: number): boolean {
  return teinte >= TEINTES_BANNIES[0] && teinte < TEINTES_BANNIES[1];
}

/**
 * LA TEINTE VIVE DOMINANTE d'une image, d'après ses pixels : la tranche de
 * dix degrés la plus peuplée parmi les pixels vifs (saturation > 25 %,
 * clarté entre 20 et 85 %) hors teintes bannies. `null` si aucun pixel vif
 * ne reste.
 */
export function teinteViveDominante(pixels: readonly Rgb[]): number | null {
  const tranches = new Map<number, number>();
  for (const pixel of pixels) {
    const [teinte, saturation, clarte] = hsl(pixel);
    if (saturation <= 0.25 || clarte <= 0.2 || clarte >= 0.85) continue;
    if (teinteBannie(teinte)) continue;
    const tranche = Math.floor(teinte / 10) * 10;
    tranches.set(tranche, (tranches.get(tranche) ?? 0) + 1);
  }
  let meilleure: number | null = null;
  let poids = 0;
  for (const [tranche, compte] of tranches) {
    if (compte > poids) {
      meilleure = tranche;
      poids = compte;
    }
  }
  /* Le milieu de la tranche : 210 pour la tranche 210–219. */
  return meilleure === null ? null : meilleure + 5;
}

/** La couleur moyenne de pixels — le repli, quand rien n'est vif. */
export function moyenneDe(pixels: readonly Rgb[]): Rgb {
  const somme = [0, 0, 0];
  for (const [r, g, b] of pixels) {
    somme[0] += r;
    somme[1] += g;
    somme[2] += b;
  }
  const n = Math.max(pixels.length, 1);
  return [Math.round(somme[0] / n), Math.round(somme[1] / n), Math.round(somme[2] / n)];
}

/** Une couleur écrite `#rrggbb` (ou `#rgb`), en rouge, vert, bleu ; `null` sinon. */
export function rgbDepuisHex(texte: string): Rgb | null {
  const hex = texte.trim().replace(/^#/, '');
  const long = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  if (!/^[0-9a-f]{6}$/i.test(long)) return null;
  return [
    parseInt(long.slice(0, 2), 16),
    parseInt(long.slice(2, 4), 16),
    parseInt(long.slice(4, 6), 16),
  ];
}

/**
 * La moyenne de deux teintes SUR LE CERCLE : entre 350° et 10°, c'est 0°,
 * pas 180°. Chaque teinte est un vecteur unitaire, on moyenne les vecteurs.
 */
export function moyenneDesTeintes(a: number, b: number): number {
  const ra = (a * Math.PI) / 180;
  const rb = (b * Math.PI) / 180;
  const x = Math.cos(ra) + Math.cos(rb);
  const y = Math.sin(ra) + Math.sin(rb);
  return Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360);
}

/**
 * La couleur des pastilles : la teinte vive dominante de la photo (ou sa
 * teinte moyenne à défaut), moyennée avec celle de l'accent du menu quand il
 * est donné, à la clarté et à la saturation des pastilles. Rendue en
 * `hsl()`, que la feuille consomme telle quelle.
 */
export function teinteDePastille(pixels: readonly Rgb[], accentMenu?: Rgb | null): string {
  const teintePhoto = teinteViveDominante(pixels) ?? teinteDe(moyenneDe(pixels));
  const teinte = accentMenu ? moyenneDesTeintes(teintePhoto, teinteDe(accentMenu)) : teintePhoto;
  return `hsl(${teinte} ${SATURATION_PASTILLE}% ${CLARTE_PASTILLE}%)`;
}
