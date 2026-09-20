import { describe, expect, it } from 'vitest';
import { doseDepuisSaisie, heureRonde } from './prises';

describe('heureRonde', () => {
  it('ramène à la minute ronde inférieure', () => {
    expect(heureRonde('08:37')).toBe('08:30');
    expect(heureRonde('08:12')).toBe('08:10');
    expect(heureRonde('08:04')).toBe('08:00');
    expect(heureRonde('23:59')).toBe('23:50');
    expect(heureRonde('08:45')).toBe('08:45');
  });

  it('laisse passer ce qui n’est pas une heure', () => {
    expect(heureRonde('midi')).toBe('midi');
  });
});

describe('doseDepuisSaisie', () => {
  it('lit une dose, virgule ou point, trois décimales au plus', () => {
    expect(doseDepuisSaisie('0,25')).toBe(0.25);
    expect(doseDepuisSaisie('2.4')).toBe(2.4);
    expect(doseDepuisSaisie(' 15 ')).toBe(15);
    expect(doseDepuisSaisie('0.001')).toBe(0.001);
  });

  it('refuse le vide, l’illisible, le zéro, le négatif, le trop fin et le trop grand', () => {
    expect(doseDepuisSaisie('')).toBeNull();
    expect(doseDepuisSaisie('abc')).toBeNull();
    expect(doseDepuisSaisie('0')).toBeNull();
    expect(doseDepuisSaisie('-1')).toBeNull();
    expect(doseDepuisSaisie('0.0001')).toBeNull();
    expect(doseDepuisSaisie('1000001')).toBeNull();
  });
});
