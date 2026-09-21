import { describe, expect, it } from 'vitest';
import { lireBase } from './base';
import { CLE_BASE, donneesVides } from '../donnees/v1';

describe('lireBase', () => {
  it('a la clé de la V1 et part vide sur rien, ou sur de l’illisible', () => {
    expect(CLE_BASE).toBe('glp1_app_companion_data');
    expect(lireBase(null)).toEqual(donneesVides());
    expect(lireBase('{')).toEqual(donneesVides());
  });

  it('garde les tables qu’il ne connaît pas, et écarte les lignes abîmées', () => {
    const texte = JSON.stringify({
      profile: { name: 'Camille', glp1Brand: 'ozempic' },
      weightHistory: [
        { id: 'w-1', date: '2026-09-18', time: '08:00', weight: 95.2, isStartingWeight: false },
        { id: 'w-2', date: 'hier', weight: 90 },
      ],
      injectionHistory: [
        { id: 'inj-1', date: '2026-09-20', time: '08:30', dose: 0.25, site: 'abdomen_gauche', brand: 'ozempic' },
        { id: 'inj-2', date: '2026-09-20', time: '08:30', dose: 'beaucoup', site: 'abdomen_gauche' },
      ],
      sleepLogs: [{ id: 's-1', kind: 'nuit' }],
    });
    const base = lireBase(texte);
    expect(base.profile).toMatchObject({ name: 'Camille', glp1Brand: 'ozempic', age: 42 });
    expect(base.weightHistory.map((p) => p.id)).toEqual(['w-1']);
    expect(base.injectionHistory.map((p) => p.id)).toEqual(['inj-1']);
    expect(base.sleepLogs).toEqual([{ id: 's-1', kind: 'nuit' }]);
  });
});
