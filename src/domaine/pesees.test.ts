import { describe, expect, it } from 'vitest';
import { avecLaPesee, avecLeDepart, garderLeDepart, peseeDeDepart, peseeDuJour, poidsLePlusRecent } from './pesees';
import type { WeightLog } from '../donnees/v1';

const p = (id: string, date: string, time: string, weight: number, isStartingWeight = false): WeightLog => ({ id, date, time, weight, isStartingWeight });

const journal = [p('starting-weight-log', '2026-09-10', '08:00', 96, true), p('w-1', '2026-09-18', '08:00', 95.2), p('w-2', '2026-09-25', '08:00', 94)];

describe('poidsLePlusRecent', () => {
  it('prend la pesée la plus proche d’aujourd’hui sans regarder le futur', () => {
    expect(poidsLePlusRecent(journal, '2026-09-21')).toBe(95.2);
  });
  it('compte la pesée d’aujourd’hui', () => {
    expect(poidsLePlusRecent(journal, '2026-09-18')).toBe(95.2);
  });
  it('ne trouve rien quand tout est dans le futur, ou vide', () => {
    expect(poidsLePlusRecent(journal, '2026-09-01')).toBeNull();
    expect(poidsLePlusRecent([], '2026-09-21')).toBeNull();
  });
  it('à date égale, la plus tardive dans la journée', () => {
    expect(poidsLePlusRecent([p('a', '2026-09-20', '08:00', 95), p('b', '2026-09-20', '20:00', 94.8)], '2026-09-21')).toBe(94.8);
  });
});

describe('avecLaPesee', () => {
  it('met à jour la ligne du jour : même identité, drapeau et mensurations gardés', () => {
    const avant = [{ ...p('w-1', '2026-09-18', '08:00', 95.2), waist: 88 }];
    const apres = avecLaPesee(avant, p('w-9', '2026-09-18', '19:00', 95));
    expect(apres).toHaveLength(1);
    expect(apres[0]).toMatchObject({ id: 'w-1', time: '19:00', weight: 95, waist: 88 });
  });
  it('insère à sa place chronologique', () => {
    const apres = avecLaPesee(journal, p('w-3', '2026-09-15', '09:00', 95.5));
    expect(apres.map((x) => x.date)).toEqual(['2026-09-10', '2026-09-15', '2026-09-18', '2026-09-25']);
  });
  it('une pesée antérieure au départ devient le départ', () => {
    const apres = avecLaPesee(journal, p('w-3', '2026-09-01', '09:00', 97));
    expect(peseeDeDepart(apres)?.id).toBe('w-3');
    expect(apres.filter((x) => x.isStartingWeight)).toHaveLength(1);
  });
  it('retrouve la pesée d’un jour', () => {
    expect(peseeDuJour(journal, '2026-09-18')?.weight).toBe(95.2);
    expect(peseeDuJour(journal, '2026-09-19')).toBeUndefined();
  });
});

describe('avecLeDepart / garderLeDepart', () => {
  it('ne change que le poids de la ligne marquée', () => {
    const apres = avecLeDepart(journal, 98, '2026-09-21');
    expect(peseeDeDepart(apres)).toMatchObject({ id: 'starting-weight-log', date: '2026-09-10', weight: 98 });
  });
  it('crée la ligne à la veille de la plus ancienne, ou d’hier', () => {
    expect(avecLeDepart([p('w-1', '2026-09-18', '08:00', 95)], 96, '2026-09-21')[0]).toMatchObject({ date: '2026-09-17', time: '08:00', weight: 96, isStartingWeight: true });
    expect(avecLeDepart([], 96, '2026-09-21')[0]).toMatchObject({ date: '2026-09-20', isStartingWeight: true });
  });
  it('répare un historique sans marque, ou à deux marques', () => {
    const sans = garderLeDepart([p('a', '2026-09-18', '08:00', 95), p('b', '2026-09-10', '08:00', 96)]);
    expect(sans.map((x) => [x.id, x.isStartingWeight])).toEqual([['b', true], ['a', false]]);
    const deux = garderLeDepart([p('a', '2026-09-10', '08:00', 96, true), p('b', '2026-09-18', '08:00', 95, true)]);
    expect(deux.map((x) => x.isStartingWeight)).toEqual([true, false]);
  });
});
