import { describe, expect, it } from 'vitest';
import { poidsDepuisSaisie } from './mesures';

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
