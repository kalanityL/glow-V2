import { describe, expect, it } from 'vitest';
import {
  JOURS_MINIMUM,
  apparier,
  correlationsNuitApports,
  lendemain,
  pValeur,
  rangs,
  spearman,
  valeurApports,
  type Apports,
  type Nuit,
} from './correlation';

/** Une journée d'apports ordinaire, à laquelle on change ce qu'on veut. */
const journee = (date: string, kcal: number, extra: Partial<Apports> = {}): Apports => ({
  date,
  kcal,
  lipidesG: 70,
  glucidesG: 200,
  proteinesG: 80,
  fibresG: 25,
  ...extra,
});

/** N jours consécutifs à partir du 1er mars 2026. */
const dates = (n: number): string[] => {
  const out = ['2026-03-01'];
  while (out.length < n) out.push(lendemain(out[out.length - 1]));
  return out;
};

describe('lendemain', () => {
  it('passe les fins de mois et d’année sans fuseau', () => {
    expect(lendemain('2026-02-28')).toBe('2026-03-01');
    expect(lendemain('2026-12-31')).toBe('2027-01-01');
  });
});

describe('rangs', () => {
  it('numérote de 1 à n et donne le rang moyen aux ex æquo', () => {
    expect(rangs([30, 10, 20])).toEqual([3, 1, 2]);
    expect(rangs([10, 20, 20, 30])).toEqual([1, 2.5, 2.5, 4]);
  });
});

describe('spearman', () => {
  it('vaut 1 sur une relation qui monte, -1 sur une qui descend, 0 sur une constante', () => {
    expect(spearman([1, 2, 3, 4], [10, 100, 1000, 10000])).toBe(1);
    expect(spearman([1, 2, 3, 4], [4, 3, 2, 1])).toBe(-1);
    expect(spearman([1, 2, 3, 4], [5, 5, 5, 5])).toBe(0);
  });

  it('ne se laisse pas écraser par une valeur extrême', () => {
    /* Un repas de fête à 6 000 kcal ne change pas l'ordre : rho reste à 1. */
    expect(spearman([1500, 1700, 1900, 6000], [400, 420, 440, 460])).toBe(1);
  });
});

describe('pValeur', () => {
  it('est petite pour un lien fort sur assez de jours, grande sans lien', () => {
    expect(pValeur(0.8, 20)).toBeLessThan(0.01);
    expect(pValeur(0.05, 20)).toBeGreaterThan(0.5);
    expect(pValeur(0.9, 3)).toBe(1);
  });
});

describe('valeurApports', () => {
  it('rend les parts des macronutriments dans les calories, et rien sans calories', () => {
    const j = journee('2026-03-01', 2000, { lipidesG: 100, glucidesG: 200, proteinesG: 75 });
    expect(valeurApports(j, 'partLipides')).toBeCloseTo(0.45);
    expect(valeurApports(j, 'partGlucides')).toBeCloseTo(0.4);
    expect(valeurApports(j, 'partProteines')).toBeCloseTo(0.15);
    expect(valeurApports(journee('2026-03-01', 0), 'partLipides')).toBeNull();
    expect(valeurApports(j, 'fibres')).toBe(25);
  });
});

describe('apparier', () => {
  const apports = [journee('2026-03-02', 1800)];
  const nuits: Nuit[] = [
    { date: '2026-03-01', dureeMin: 400 },
    { date: '2026-03-02', dureeMin: 500 },
  ];

  it('associe la journée à la nuit qui la suit, ou à celle qui la précède', () => {
    expect(apparier(apports, nuits, 'journee-vers-nuit')[0].nuit.dureeMin).toBe(500);
    expect(apparier(apports, nuits, 'nuit-vers-journee')[0].nuit.dureeMin).toBe(400);
  });

  it('laisse de côté une journée sans sa nuit', () => {
    expect(apparier([journee('2026-03-10', 1800)], nuits, 'journee-vers-nuit')).toHaveLength(0);
  });
});

describe('correlationsNuitApports', () => {
  it('ne rend rien sous le plancher de jours', () => {
    const jours = dates(JOURS_MINIMUM - 1);
    const apports = jours.map((d, i) => journee(d, 1500 + i * 50));
    const nuits = jours.map((d, i) => ({ date: d, dureeMin: 400 + i * 5 }));
    expect(correlationsNuitApports(apports, nuits)).toHaveLength(0);
  });

  it('trouve un lien net entre les calories du jour et la durée de la nuit qui suit', () => {
    const jours = dates(20);
    const apports = jours.map((d, i) => journee(d, 1500 + i * 50));
    /* Plus la journée est riche, plus la nuit qui SUIT est courte. */
    const nuits = jours.map((d, i) => ({ date: d, dureeMin: 520 - i * 6 }));
    const resultats = correlationsNuitApports(apports, nuits);
    const kcal = resultats.find((r) => r.sens === 'journee-vers-nuit' && r.apports === 'kcal' && r.nuit === 'duree');
    expect(kcal).toBeDefined();
    expect(kcal!.n).toBe(20);
    expect(kcal!.rho).toBe(-1);
    expect(kcal!.lien).toBe(true);
    /* La qualité n'est pas notée : aucune ligne pour elle. */
    expect(resultats.some((r) => r.nuit === 'qualite')).toBe(false);
    /* Le plus net d'abord. */
    expect(resultats[0].p).toBeLessThanOrEqual(resultats[resultats.length - 1].p);
  });

  it('ne conclut à rien quand les séries n’ont pas de rapport', () => {
    const jours = dates(20);
    const bruit = [3, 9, 1, 7, 5, 8, 2, 6, 4, 10, 13, 11, 19, 15, 17, 12, 18, 14, 20, 16];
    const apports = jours.map((d, i) => journee(d, 1500 + bruit[i] * 30));
    const nuits = jours.map((d, i) => ({ date: d, dureeMin: 400 + ((i * 7) % 11) * 10, qualite: 1 + (i % 5) }));
    const kcal = correlationsNuitApports(apports, nuits).find(
      (r) => r.sens === 'journee-vers-nuit' && r.apports === 'kcal' && r.nuit === 'duree',
    );
    expect(kcal).toBeDefined();
    expect(kcal!.lien).toBe(false);
  });
});
