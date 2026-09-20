import { describe, expect, it } from 'vitest';
import { POIDS_MAX, POIDS_MIN, poidsDepuisRapport, poidsDepuisSaisie, rapportDuPoids } from './mesures';

describe('poidsDepuisSaisie', () => {
  it('lit virgule ou point, et rend la forme stockée avec un point et une décimale', () => {
    expect(poidsDepuisSaisie('95', 'kg')).toBe('95.0');
    expect(poidsDepuisSaisie('95,5', 'kg')).toBe('95.5');
    expect(poidsDepuisSaisie(' 95.5 ', 'kg')).toBe('95.5');
  });

  it('refuse l’absurde et le non-nombre, par unité', () => {
    expect(poidsDepuisSaisie('0', 'kg')).toBeNull();
    expect(poidsDepuisSaisie('1000', 'kg')).toBeNull();
    expect(poidsDepuisSaisie('1500', 'lb')).toBe('1500.0');
    expect(poidsDepuisSaisie('95.55', 'kg')).toBeNull();
    expect(poidsDepuisSaisie('lourd', 'kg')).toBeNull();
    expect(poidsDepuisSaisie('', 'kg')).toBeNull();
  });
});

describe('la règle des poids', () => {
  it('va du plus léger au plus lourd, en rapport', () => {
    expect(poidsDepuisRapport(0, 'kg')).toBe(`${POIDS_MIN}.0`);
    expect(poidsDepuisRapport(1, 'kg')).toBe(`${POIDS_MAX.kg}.0`);
    expect(poidsDepuisRapport(1.5, 'kg')).toBe(`${POIDS_MAX.kg}.0`);
  });

  it('retrouve le poids d’où l’on est parti, au dixième', () => {
    expect(poidsDepuisRapport(rapportDuPoids('95.0', 'kg'), 'kg')).toBe('95.0');
    expect(poidsDepuisRapport(rapportDuPoids('82.4', 'kg'), 'kg')).toBe('82.4');
    expect(poidsDepuisRapport(rapportDuPoids('1500.0', 'lb'), 'lb')).toBe('1500.0');
  });
});
