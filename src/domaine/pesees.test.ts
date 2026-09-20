import { describe, expect, it } from 'vitest';
import { avecLaPesee, peseeDuJour, poidsLePlusRecent } from './pesees';

const journal = [
  { date: '2026-09-10', heure: '08:00', poids: '96.0' },
  { date: '2026-09-18', heure: '08:00', poids: '95.2' },
  { date: '2026-09-25', heure: '08:00', poids: '94.0' },
];

describe('poidsLePlusRecent', () => {
  it('prend la pesée la plus proche d’aujourd’hui sans regarder le futur', () => {
    expect(poidsLePlusRecent(journal, '2026-09-21')).toBe('95.2');
  });

  it('compte la pesée d’aujourd’hui', () => {
    expect(poidsLePlusRecent(journal, '2026-09-18')).toBe('95.2');
  });

  it('ne trouve rien quand tout est dans le futur, ou vide', () => {
    expect(poidsLePlusRecent(journal, '2026-09-01')).toBeNull();
    expect(poidsLePlusRecent([], '2026-09-21')).toBeNull();
  });

  it('à date égale, la plus tardive dans la journée', () => {
    const deux = [
      { date: '2026-09-20', heure: '08:00', poids: '95.0' },
      { date: '2026-09-20', heure: '20:00', poids: '94.8' },
    ];
    expect(poidsLePlusRecent(deux, '2026-09-21')).toBe('94.8');
  });
});

describe('peseeDuJour / avecLaPesee', () => {
  it('retrouve la pesée d’un jour, et la remplace', () => {
    expect(peseeDuJour(journal, '2026-09-18')?.poids).toBe('95.2');
    expect(peseeDuJour(journal, '2026-09-19')).toBeUndefined();
    const apres = avecLaPesee(journal, { date: '2026-09-18', heure: '19:00', poids: '95.0' });
    expect(apres).toHaveLength(3);
    expect(peseeDuJour(apres, '2026-09-18')?.poids).toBe('95.0');
  });

  it('ajoute à sa place dans l’ordre des dates', () => {
    const apres = avecLaPesee(journal, { date: '2026-09-15', heure: '09:00', poids: '95.5' });
    expect(apres.map((p) => p.date)).toEqual(['2026-09-10', '2026-09-15', '2026-09-18', '2026-09-25']);
  });
});
