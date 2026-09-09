import { describe, expect, it } from 'vitest';
import { AGE_MAX, AGE_MIN, POIDS_MAX, TAILLE_BORNES } from './mesures';
import { SYSTEME_PAR_DEFAUT, SYSTEME_PAR_LANGUE, UNITES_DU_SYSTEME } from './unites';

describe('les systèmes d’unités', () => {
  it('part en métrique', () => {
    expect(SYSTEME_PAR_DEFAUT).toBe('metrique');
  });

  it('le français amène le métrique, l’anglais l’impérial', () => {
    expect(SYSTEME_PAR_LANGUE.fr).toBe('metrique');
    expect(SYSTEME_PAR_LANGUE.en).toBe('imperial');
  });

  it('chaque système a une unité de poids et une de taille', () => {
    expect(UNITES_DU_SYSTEME.metrique).toEqual({ poids: 'kg', taille: 'cm' });
    expect(UNITES_DU_SYSTEME.imperial).toEqual({ poids: 'lb', taille: 'in' });
  });
});

describe('les bornes', () => {
  it('deux plafonds de poids ronds, chacun dans son unité', () => {
    expect(POIDS_MAX).toEqual({ kg: 999, lb: 2000 });
  });

  it('n’écartent que l’absurde — les bornes de la spécification', () => {
    expect([AGE_MIN, AGE_MAX]).toEqual([1, 130]);
    expect(TAILLE_BORNES.cm).toEqual({ min: 50, max: 300 });
  });
});
