import { describe, expect, it } from 'vitest';
import { ACTIVITES_PAR_JOUR_MAX, avecLActivite, kmDepuisSaisie, minutesDepuisSaisie, noeudDuSport, slugActivite } from './activites';
import type { SportLog } from '../donnees/v1';

const s = (id: string, date: string, time: string): SportLog => ({ id, date, time, sport: 'Vélo', intensity: 'moderee', duration: 30 });

describe('slugActivite', () => {
  it('fait un slug sans accent ni ponctuation', () => {
    expect(slugActivite('Tennis de table, ping-pong (Taylor Code 410)')).toBe('tennis-de-table-ping-pong-taylor-code-410');
    expect(slugActivite('Vélo')).toBe('velo');
  });
});

describe('kmDepuisSaisie', () => {
  it('lit la virgule et le point, arrondit au cran de 50 m, refuse le reste', () => {
    expect(kmDepuisSaisie('3,5')).toBe(3.5);
    expect(kmDepuisSaisie('12.37')).toBe(12.35);
    expect(kmDepuisSaisie('-1')).toBeNull();
    expect(kmDepuisSaisie('abc')).toBeNull();
    expect(kmDepuisSaisie('')).toBeNull();
  });
});

describe('minutesDepuisSaisie', () => {
  it('veut un entier d’au moins une minute', () => {
    expect(minutesDepuisSaisie(' 25 ')).toBe(25);
    expect(minutesDepuisSaisie('0')).toBeNull();
    expect(minutesDepuisSaisie('12,5')).toBeNull();
  });
});

describe('noeudDuSport', () => {
  it('retrouve un nœud de niveau 1 par son nom, avec sa catégorie', () => {
    expect(noeudDuSport('Vélo')?.categorie).toBe('roues');
    expect(noeudDuSport('Inconnu')).toBeNull();
  });
});

describe('avecLActivite', () => {
  it('ajoute et trie par date puis heure', () => {
    const j = avecLActivite([s('a', '2026-09-25', '10:00')], s('b', '2026-09-24', '18:00'));
    expect(j.map((x) => x.id)).toEqual(['b', 'a']);
  });
  it('met à jour la séance qui porte le même identifiant', () => {
    const j = avecLActivite([s('a', '2026-09-25', '10:00')], { ...s('a', '2026-09-25', '11:00'), duration: 45 });
    expect(j).toHaveLength(1);
    expect(j[0].duration).toBe(45);
  });
  it('sur une journée pleine, la nouvelle remplace la dernière de la journée', () => {
    const pleine = Array.from({ length: ACTIVITES_PAR_JOUR_MAX }, (_, i) => s(`s${i}`, '2026-09-25', `${String(6 + i).padStart(2, '0')}:00`));
    const j = avecLActivite(pleine, s('nouvelle', '2026-09-25', '05:00'));
    expect(j).toHaveLength(ACTIVITES_PAR_JOUR_MAX);
    expect(j.some((x) => x.id === 's14')).toBe(false);
    expect(j[0].id).toBe('nouvelle');
  });
});
