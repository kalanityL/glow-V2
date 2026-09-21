import { describe, expect, it } from 'vitest';
import { ageA, anneeDe, anneeMoisDe, dateDecalee, dateDepuisAnnee, dateLocale, formaterDateCourte, grilleDuMois, jourRelatif, lireDateCourte, moisDecale } from './dates';

describe('jourRelatif', () => {
  it('nomme de l’avant-veille au surlendemain, et se tait au-delà', () => {
    const j = '2026-09-21';
    expect(jourRelatif('2026-09-19', j)).toBe('avantHier');
    expect(jourRelatif('2026-09-20', j)).toBe('hier');
    expect(jourRelatif('2026-09-21', j)).toBe('aujourdhui');
    expect(jourRelatif('2026-09-22', j)).toBe('demain');
    expect(jourRelatif('2026-09-23', j)).toBe('apresDemain');
    expect(jourRelatif('2026-09-18', j)).toBeNull();
    expect(jourRelatif('2026-09-24', j)).toBeNull();
    /* Le passage d'un mois, et le changement d'heure d'octobre (2026-10-25). */
    expect(jourRelatif('2026-10-01', '2026-09-30')).toBe('demain');
    expect(jourRelatif('2026-10-24', '2026-10-26')).toBe('avantHier');
  });
});

describe('dateDecalee', () => {
  it('avance et recule d’un jour, mois et année compris', () => {
    expect(dateDecalee('2026-09-21', 1)).toBe('2026-09-22');
    expect(dateDecalee('2026-09-21', -1)).toBe('2026-09-20');
    expect(dateDecalee('2026-09-30', 1)).toBe('2026-10-01');
    expect(dateDecalee('2026-01-01', -1)).toBe('2025-12-31');
    expect(dateDecalee('2028-02-28', 1)).toBe('2028-02-29');
    expect(dateDecalee('2026-09-21', 0)).toBe('2026-09-21');
  });
});

describe('dateDepuisAnnee / anneeDe', () => {
  it('fait un 1er janvier, et retrouve l’année', () => {
    expect(dateDepuisAnnee(1980)).toBe('1980-01-01');
    expect(anneeDe('1980-01-01')).toBe(1980);
  });
});

describe('formaterDateCourte', () => {
  it('écrit JJ/MM/AAAA en français, MM/JJ/AAAA en anglais', () => {
    expect(formaterDateCourte('2026-09-19', 'fr')).toBe('19/09/2026');
    expect(formaterDateCourte('2026-09-19', 'en')).toBe('09/19/2026');
  });
});

describe('lireDateCourte', () => {
  it('lit l’écriture de la langue, avec / . - ou des espaces, sans zéro devant', () => {
    expect(lireDateCourte('19/09/2026', 'fr')).toBe('2026-09-19');
    expect(lireDateCourte('1.1.1980', 'fr')).toBe('1980-01-01');
    expect(lireDateCourte('09/19/2026', 'en')).toBe('2026-09-19');
  });

  it('refuse ce qui n’est pas une date qui existe', () => {
    expect(lireDateCourte('31/02/2026', 'fr')).toBeNull();
    expect(lireDateCourte('19/13/2026', 'fr')).toBeNull();
    expect(lireDateCourte('19/09/26', 'fr')).toBeNull();
    expect(lireDateCourte('demain', 'fr')).toBeNull();
    expect(lireDateCourte('', 'fr')).toBeNull();
  });
});

describe('dateLocale', () => {
  it('écrit la date locale, sans passer par le fuseau', () => {
    expect(dateLocale(new Date(2026, 8, 20, 23, 30))).toBe('2026-09-20');
  });
});

describe('ageA', () => {
  it('compte les années révolues, l’anniversaire le jour même', () => {
    expect(ageA('1980-01-01', '2026-09-20')).toBe(46);
    expect(ageA('1980-09-20', '2026-09-20')).toBe(46);
    expect(ageA('1980-09-21', '2026-09-20')).toBe(45);
  });
});

describe('grilleDuMois', () => {
  it('fait six semaines, lundi en premier, les voisins marqués', () => {
    const grille = grilleDuMois(2026, 9);
    expect(grille).toHaveLength(42);
    /* Le 1er septembre 2026 est un mardi : la grille ouvre sur le lundi 31 août. */
    expect(grille[0]).toEqual({ date: '2026-08-31', jour: 31, dansLeMois: false });
    expect(grille[1]).toEqual({ date: '2026-09-01', jour: 1, dansLeMois: true });
    expect(grille[30]).toEqual({ date: '2026-09-30', jour: 30, dansLeMois: true });
    expect(grille[31].dansLeMois).toBe(false);
  });
});

describe('moisDecale / anneeMoisDe', () => {
  it('passe l’année en décalant', () => {
    expect(moisDecale(2026, 12, 1)).toEqual({ annee: 2027, mois: 1 });
    expect(moisDecale(2026, 1, -1)).toEqual({ annee: 2025, mois: 12 });
    expect(anneeMoisDe('2026-09-20')).toEqual({ annee: 2026, mois: 9 });
  });
});
