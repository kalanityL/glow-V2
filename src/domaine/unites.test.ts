import { describe, expect, it } from 'vitest';
import {
  AGE_MAX,
  AGE_MIN,
  ANNEE_NAISSANCE_PAR_DEFAUT,
  POIDS_MAX,
  TAILLE_BORNES,
  TAILLE_PAR_DEFAUT_CM,
  bornesAnneeNaissance,
} from './mesures';
import {
  SYSTEME_PAR_DEFAUT,
  SYSTEME_PAR_LANGUE,
  UNITES_DU_SYSTEME,
  tailleAffichee,
  tailleEnCm,
} from './unites';

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

describe('les défauts du profil', () => {
  it('1980 et 165 cm (demande du 2026-09-09)', () => {
    expect(ANNEE_NAISSANCE_PAR_DEFAUT).toBe(1980);
    expect(TAILLE_PAR_DEFAUT_CM).toBe(165);
  });

  it('les années de naissance suivent les bornes de l’âge', () => {
    expect(bornesAnneeNaissance(2026)).toEqual({ min: 1896, max: 2025 });
  });
});

describe('la taille se stocke en cm et se convertit aux deux bouts', () => {
  it('ne change rien en métrique', () => {
    expect(tailleAffichee(165, 'cm')).toBe(165);
    expect(tailleEnCm(165, 'cm')).toBe(165);
  });

  it('affiche des pouces arrondis et revient en centimètres', () => {
    expect(tailleAffichee(165, 'in')).toBe(65);
    expect(tailleEnCm(65, 'in')).toBe(165);
  });
});
