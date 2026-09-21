import { describe, expect, it } from 'vitest';
import { avecLeSommeil, dureeEcrite, dureeMinutes, jaugeDuSommeil, noteParDefaut, peutAjouterSommeil, seRecouvrent, sommeilEnConflit, veille } from './sommeils';
import type { SleepLog } from '../donnees/v1';

const nuit: SleepLog = { id: 's-1', bedDate: '2026-09-11', bedTime: '23:00', date: '2026-09-12', time: '07:00', kind: 'nuit', quality: 3 };

describe('dureeMinutes / dureeEcrite', () => {
  it('franchit minuit, et refuse un réveil avant le coucher', () => {
    expect(dureeMinutes(nuit)).toBe(480);
    expect(dureeMinutes({ bedDate: '2026-09-12', bedTime: '22:45', date: '2026-09-13', time: '06:30' })).toBe(465);
    expect(dureeMinutes({ bedDate: '2026-09-12', bedTime: '08:00', date: '2026-09-12', time: '07:00' })).toBe(0);
    expect(dureeMinutes({ bedDate: 'hier', bedTime: '08:00', date: '2026-09-12', time: '07:00' })).toBe(0);
  });
  it('s’écrit comme la V1', () => {
    expect(dureeEcrite(480)).toBe('8 h');
    expect(dureeEcrite(465)).toBe('7 h 45');
    expect(dureeEcrite(45)).toBe('45 min');
  });
});

describe('seRecouvrent / sommeilEnConflit', () => {
  it('refuse le recouvrement, laisse passer le bout à bout', () => {
    expect(seRecouvrent(nuit, { bedDate: '2026-09-12', bedTime: '06:30', date: '2026-09-12', time: '07:00' })).toBe(true);
    expect(seRecouvrent(nuit, { bedDate: '2026-09-12', bedTime: '07:00', date: '2026-09-12', time: '08:00' })).toBe(false);
    expect(sommeilEnConflit([nuit], { bedDate: '2026-09-12', bedTime: '06:30', date: '2026-09-12', time: '07:30' })?.id).toBe('s-1');
    expect(sommeilEnConflit([nuit], { bedDate: '2026-09-12', bedTime: '06:30', date: '2026-09-12', time: '07:30' }, 's-1')).toBeUndefined();
  });
});

describe('avecLeSommeil / peutAjouterSommeil / veille', () => {
  it('remplace par identifiant et trie par réveil', () => {
    const apres = avecLeSommeil([nuit], { ...nuit, id: 's-2', date: '2026-09-11', time: '15:00', bedDate: '2026-09-11', bedTime: '14:00', kind: 'sieste' });
    expect(apres.map((s) => s.id)).toEqual(['s-2', 's-1']);
    expect(avecLeSommeil([nuit], { ...nuit, quality: 5 })).toHaveLength(1);
  });
  it('plafonne à quinze par date de réveil', () => {
    const quinze = Array.from({ length: 15 }, (_, i) => ({ ...nuit, id: `s-${i}` }));
    expect(peutAjouterSommeil(quinze, '2026-09-12')).toBe(false);
    expect(peutAjouterSommeil(quinze, '2026-09-12', 's-3')).toBe(true);
    expect(peutAjouterSommeil(quinze, '2026-09-13')).toBe(true);
  });
  it('connaît la veille', () => {
    expect(veille('2026-09-01')).toBe('2026-08-31');
  });
});

describe('jaugeDuSommeil', () => {
  it('une nuit : se remplit jusqu’à 8 h, s’intensifie jusqu’à 12 h, puis reste', () => {
    expect(jaugeDuSommeil('nuit', 4 * 60)).toEqual({ remplissage: 0.5, intensite: 0 });
    expect(jaugeDuSommeil('nuit', 8 * 60)).toEqual({ remplissage: 1, intensite: 0 });
    expect(jaugeDuSommeil('nuit', 10 * 60)).toEqual({ remplissage: 1, intensite: 0.5 });
    expect(jaugeDuSommeil('nuit', 12 * 60)).toEqual({ remplissage: 1, intensite: 1 });
    expect(jaugeDuSommeil('nuit', 15 * 60)).toEqual({ remplissage: 1, intensite: 1 });
  });
  it('une sieste : pleine à 1 h 30, intense à 3 h', () => {
    expect(jaugeDuSommeil('sieste', 45)).toEqual({ remplissage: 0.5, intensite: 0 });
    expect(jaugeDuSommeil('sieste', 90)).toEqual({ remplissage: 1, intensite: 0 });
    expect(jaugeDuSommeil('sieste', 135)).toEqual({ remplissage: 1, intensite: 0.5 });
    expect(jaugeDuSommeil('sieste', 240)).toEqual({ remplissage: 1, intensite: 1 });
  });
  it('une durée nulle : vide', () => {
    expect(jaugeDuSommeil('nuit', 0)).toEqual({ remplissage: 0, intensite: 0 });
  });
});

describe('noteParDefaut', () => {
  const j = [
    { ...nuit, id: 'n1', date: '2026-09-10', quality: 2 },
    { ...nuit, id: 'n2', date: '2026-09-18', quality: 5 },
    { ...nuit, id: 's1', date: '2026-09-15', kind: 'sieste' as const, quality: 1 },
    { ...nuit, id: 'n3', date: '2026-09-25', quality: 4 },
  ];
  it('reprend la note du sommeil de même nature le plus proche avant', () => {
    expect(noteParDefaut(j, 'nuit', '2026-09-21', '07:00')).toBe(5);
    expect(noteParDefaut(j, 'sieste', '2026-09-21', '15:00')).toBe(1);
    expect(noteParDefaut(j, 'nuit', '2026-09-12', '07:00')).toBe(2);
  });
  it('sans sommeil avant, la qualité de 3', () => {
    expect(noteParDefaut(j, 'nuit', '2026-09-01', '07:00')).toBe(3);
    expect(noteParDefaut([], 'sieste', '2026-09-21', '15:00')).toBe(3);
  });
});
