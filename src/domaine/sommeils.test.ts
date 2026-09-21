import { describe, expect, it } from 'vitest';
import { avecLeSommeil, dureeEcrite, dureeMinutes, peutAjouterSommeil, seRecouvrent, sommeilEnConflit, veille } from './sommeils';
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
