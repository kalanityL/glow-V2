import { describe, expect, it } from 'vitest';
import { deserialiserJournaux, serialiserJournaux, VERSION_JOURNAUX } from './journaux';

const journaux = {
  prises: [{ date: '2026-09-20', heure: '08:30', doseMg: 0.25, zone: 'abdomen-gauche' as const, traitement: 'ozempic', notes: 'ok' }],
  pesees: [{ date: '2026-09-21', heure: '08:00', poids: '93.4' }],
};

describe('journaux : écrire et relire', () => {
  it('relit ce qu’il a écrit', () => {
    expect(deserialiserJournaux(serialiserJournaux(journaux))).toEqual(journaux);
  });

  it('ignore l’illisible et une autre version', () => {
    expect(deserialiserJournaux(null)).toBeNull();
    expect(deserialiserJournaux('{')).toBeNull();
    expect(deserialiserJournaux(JSON.stringify({ version: VERSION_JOURNAUX + 1, journaux }))).toBeNull();
  });

  it('écarte une ligne abîmée, garde les autres', () => {
    const texte = JSON.stringify({
      version: VERSION_JOURNAUX,
      journaux: {
        prises: [journaux.prises[0], { date: 'hier', heure: '08:00', doseMg: 1, zone: 'nulle-part', traitement: 'x' }],
        pesees: [{ date: '2026-09-21', heure: '08:00', poids: 'lourd' }, journaux.pesees[0]],
      },
    });
    expect(deserialiserJournaux(texte)).toEqual(journaux);
  });
});
