import { describe, expect, it } from 'vitest';
import { ageA, anneeDe, dateDepuisAnnee, dateLocale, formaterDateCourte, lireDateCourte } from './dates';

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
