/**
 * LA CORRÉLATION ENTRE LA NUIT ET LES APPORTS (2026-09-17, « prepare un
 * algorithme qui cherche à établir s'il y a correlation entre durée et/ou
 * qualité de la nuit ET prise calorique / prise lipidique / prise glucide :
 * prise protéine »).
 *
 * CE QUE C'EST : un calcul sur les données de la personne, et rien d'autre.
 * Il dit si, chez ELLE, les nuits et les assiettes vont ensemble — jamais
 * pourquoi, jamais ce qu'il faudrait manger ou dormir. La restitution qui
 * s'en servira restera descriptive (SPEC : aucune restitution ne peut se lire
 * comme une recommandation). Ce fichier ne connaît ni écran ni navigateur :
 * il partira tel quel dans le paquet natif.
 *
 * ── Le sens ────────────────────────────────────────────────────────────────
 * UN SEUL : la nuit qui PRÉCÈDE la journée D — celle qui a commencé le soir de
 * D-1 — contre les apports de D. La question est « la nuit que j'ai passée
 * change-t-elle ce que je mange ? », pas l'inverse (2026-09-17 : « la 2eme on
 * s'en fout, on veut juste savoir si la nuit qu'on a pasé influence comment
 * on mangera »). Une nuit est datée du SOIR où elle commence.
 *
 * ── Les grandeurs ──────────────────────────────────────────────────────────
 * Côté nuit : la durée (minutes) et, quand elle est notée, la qualité.
 * Côté apports : les calories, puis lipides, glucides, protéines et fibres
 * (quand il est question de nutriments, JAMAIS oublier les fibres — règle
 * absolue du 2026-08-31) en grammes, et AUSSI la PART de chaque
 * macronutriment dans les calories (lipides 9 kcal/g, glucides et protéines
 * 4 kcal/g) : les grammes suivent la quantité totale, la part dit la
 * composition — une nuit peut aller avec « beaucoup mangé » ou avec « mangé
 * gras », et ce n'est pas la même chose.
 *
 * ── La mesure ──────────────────────────────────────────────────────────────
 * Le coefficient de SPEARMAN (corrélation des rangs), pas Pearson : les
 * séries d'un suivi personnel sont courtes, irrégulières et pleines de
 * valeurs extrêmes (un repas de fête, une nuit blanche) qui écraseraient une
 * corrélation linéaire ; les rangs n'y sont pas sensibles, et ne supposent
 * pas une relation en ligne droite, seulement une relation qui monte ou
 * descend. Les ex æquo prennent le rang moyen.
 *
 * ── La confiance ───────────────────────────────────────────────────────────
 * Une corrélation sur cinq jours ne veut rien dire : sous `JOURS_MINIMUM`
 * paires, on ne calcule pas. Au-dessus, la « p-valeur » approche la chance
 * d'observer un tel coefficient s'il n'y avait aucun lien (transformation de
 * Fisher, correction de Spearman, loi normale). On ne conclut à un lien que
 * sous `SEUIL_P`. Avec seize croisements, un sur vingt sortira « lié » par
 * hasard : la restitution devra le dire, ou ne montrer que les liens les
 * plus nets.
 */

/** Une nuit, datée du soir où elle commence (AAAA-MM-JJ). */
export interface Nuit {
  date: string;
  /** La durée dormie, en minutes. */
  dureeMin: number;
  /** La qualité ressentie, sur l'échelle de l'application, si elle est notée. */
  qualite?: number;
}

/** Les apports d'une journée (AAAA-MM-JJ), en kcal et en grammes. */
export interface Apports {
  date: string;
  kcal: number;
  lipidesG: number;
  glucidesG: number;
  proteinesG: number;
  fibresG: number;
}

/** Les grandeurs de la nuit qu'on croise. */
export const MESURES_NUIT = ['duree', 'qualite'] as const;
export type MesureNuit = (typeof MESURES_NUIT)[number];

/** Les grandeurs des apports qu'on croise : quantités, puis parts. */
export const MESURES_APPORTS = [
  'kcal',
  'lipides',
  'glucides',
  'proteines',
  'fibres',
  'partLipides',
  'partGlucides',
  'partProteines',
] as const;
export type MesureApports = (typeof MESURES_APPORTS)[number];

/** En dessous, on ne calcule pas : une corrélation sur peu de jours ment. */
export const JOURS_MINIMUM = 10;

/** Le seuil de la p-valeur sous lequel on parle d'un lien. */
export const SEUIL_P = 0.05;

/** Les calories par gramme, pour les parts. */
const KCAL_PAR_G = { lipides: 9, glucides: 4, proteines: 4 } as const;

/** Un résultat pour une paire de grandeurs. */
export interface Correlation {
  nuit: MesureNuit;
  apports: MesureApports;
  /** Le nombre de paires (jour, nuit) réellement croisées. */
  n: number;
  /** Le coefficient de Spearman, de -1 à 1. */
  rho: number;
  /** La chance d'un tel coefficient sans lien réel, de 0 à 1. */
  p: number;
  /** Vrai sous `SEUIL_P` : on parle d'un lien. */
  lien: boolean;
}

/** Ajoute un jour à une date AAAA-MM-JJ, sans passer par le fuseau. */
export function lendemain(date: string): string {
  const [a, m, j] = date.split('-').map(Number);
  const d = new Date(Date.UTC(a, m - 1, j + 1));
  return d.toISOString().slice(0, 10);
}

/** La valeur d'une grandeur des apports, ou `null` si elle ne se calcule pas. */
export function valeurApports(apports: Apports, mesure: MesureApports): number | null {
  switch (mesure) {
    case 'kcal':
      return apports.kcal;
    case 'lipides':
      return apports.lipidesG;
    case 'glucides':
      return apports.glucidesG;
    case 'proteines':
      return apports.proteinesG;
    case 'fibres':
      return apports.fibresG;
    case 'partLipides':
      return apports.kcal > 0 ? (apports.lipidesG * KCAL_PAR_G.lipides) / apports.kcal : null;
    case 'partGlucides':
      return apports.kcal > 0 ? (apports.glucidesG * KCAL_PAR_G.glucides) / apports.kcal : null;
    case 'partProteines':
      return apports.kcal > 0 ? (apports.proteinesG * KCAL_PAR_G.proteines) / apports.kcal : null;
  }
}

/** La valeur d'une grandeur de la nuit, ou `null` si elle n'est pas notée. */
export function valeurNuit(nuit: Nuit, mesure: MesureNuit): number | null {
  return mesure === 'duree' ? nuit.dureeMin : (nuit.qualite ?? null);
}

/**
 * LES PAIRES (nuit, journée) : chaque journée D est appariée à la nuit qui la
 * précède, celle qui a commencé le soir de D-1. Une journée sans sa nuit est
 * laissée de côté — une valeur absente se tait, elle ne vaut pas zéro.
 */
export function apparier(
  apports: readonly Apports[],
  nuits: readonly Nuit[],
): readonly { apports: Apports; nuit: Nuit }[] {
  const nuitParSoir = new Map(nuits.map((nuit) => [nuit.date, nuit]));
  const paires: { apports: Apports; nuit: Nuit }[] = [];
  for (const journee of apports) {
    const nuit = nuitParSoir.get(veille(journee.date));
    if (nuit) paires.push({ apports: journee, nuit });
  }
  return paires;
}

/** Retire un jour à une date AAAA-MM-JJ, sans passer par le fuseau. */
export function veille(date: string): string {
  const [a, m, j] = date.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, j - 1)).toISOString().slice(0, 10);
}

/** Les rangs d'une série, de 1 à n, les ex æquo au rang moyen. */
export function rangs(valeurs: readonly number[]): number[] {
  const indices = valeurs.map((_, i) => i).sort((a, b) => valeurs[a] - valeurs[b]);
  const resultat = new Array<number>(valeurs.length);
  let i = 0;
  while (i < indices.length) {
    let j = i;
    while (j + 1 < indices.length && valeurs[indices[j + 1]] === valeurs[indices[i]]) j += 1;
    /* Les rangs vont de i+1 à j+1 : leur moyenne est (i + j) / 2 + 1. */
    const moyen = (i + j) / 2 + 1;
    for (let k = i; k <= j; k += 1) resultat[indices[k]] = moyen;
    i = j + 1;
  }
  return resultat;
}

/** Le coefficient de Pearson de deux séries de même longueur ; 0 si l'une est constante. */
export function pearson(x: readonly number[], y: readonly number[]): number {
  const n = x.length;
  const mx = x.reduce((s, v) => s + v, 0) / n;
  const my = y.reduce((s, v) => s + v, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i += 1) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  return sxx === 0 || syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
}

/** Le coefficient de Spearman : Pearson sur les rangs. */
export function spearman(x: readonly number[], y: readonly number[]): number {
  return pearson(rangs(x), rangs(y));
}

/** La fonction d'erreur, approchée à 1,5 × 10⁻⁷ près (Abramowitz et Stegun 7.1.26). */
function erf(x: number): number {
  const signe = x < 0 ? -1 : 1;
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t) *
      Math.exp(-x * x);
  return signe * y;
}

/**
 * La p-valeur bilatérale d'un coefficient de Spearman sur n paires :
 * transformation de Fisher z = atanh(rho), écart-type 1,06 / √(n - 3) (la
 * correction de Spearman), puis loi normale. Une approximation honnête au-delà
 * de dix paires, ce qui est notre plancher.
 */
export function pValeur(rho: number, n: number): number {
  if (n < 4) return 1;
  const r = Math.max(-0.999999, Math.min(0.999999, rho));
  const z = Math.atanh(r) * Math.sqrt((n - 3) / 1.06);
  return 1 - erf(Math.abs(z) / Math.SQRT2);
}

/**
 * LE CROISEMENT COMPLET : chaque mesure de la nuit précédente contre chaque
 * mesure des apports du jour. Une paire de grandeurs qui n'a pas
 * `JOURS_MINIMUM` jours croisés n'est pas rendue — plutôt rien qu'un chiffre
 * qui ment. Le résultat est trié du lien le plus net au moins net.
 */
export function correlationsNuitApports(
  apports: readonly Apports[],
  nuits: readonly Nuit[],
): Correlation[] {
  const resultats: Correlation[] = [];
  const paires = apparier(apports, nuits);
  for (const mesureNuit of MESURES_NUIT) {
    for (const mesureApports of MESURES_APPORTS) {
      const x: number[] = [];
      const y: number[] = [];
      for (const paire of paires) {
        const vn = valeurNuit(paire.nuit, mesureNuit);
        const va = valeurApports(paire.apports, mesureApports);
        if (vn === null || va === null) continue;
        x.push(vn);
        y.push(va);
      }
      if (x.length < JOURS_MINIMUM) continue;
      const rho = spearman(x, y);
      const p = pValeur(rho, x.length);
      resultats.push({
        nuit: mesureNuit,
        apports: mesureApports,
        n: x.length,
        rho,
        p,
        lien: p < SEUIL_P,
      });
    }
  }
  return resultats.sort((a, b) => a.p - b.p || Math.abs(b.rho) - Math.abs(a.rho));
}
