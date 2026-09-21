import { describe, expect, it } from 'vitest';
import { avecLaPrise, doseDepuisSaisie, heureRonde } from './prises';

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

describe('avecLaPrise', () => {
  const prise = (date: string, heure: string, doseMg: number) => ({
    date,
    heure,
    doseMg,
    zone: 'abdomen-gauche' as const,
    traitement: 'ozempic',
  });

  it('ajoute sous le plafond de deux par jour, dans l’ordre', () => {
    const journal = avecLaPrise([prise('2026-09-20', '20:00', 0.25)], prise('2026-09-20', '08:00', 0.25));
    expect(journal.map((p) => p.heure)).toEqual(['08:00', '20:00']);
  });

  it('la troisième du jour remplace la dernière de la journée', () => {
    const journal = [prise('2026-09-19', '08:00', 0.25), prise('2026-09-20', '08:00', 0.25), prise('2026-09-20', '20:00', 0.5)];
    const apres = avecLaPrise(journal, prise('2026-09-20', '12:00', 1));
    expect(apres).toHaveLength(3);
    expect(apres.filter((p) => p.date === '2026-09-20').map((p) => p.doseMg)).toEqual([0.25, 1]);
  });
});
