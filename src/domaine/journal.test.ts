import { describe, expect, it } from 'vitest';
import { bornesDuJournal, compteDuJour, entreesDuJournal, fenetreDuJournal, imageDeLEntree, joursAvecEntree, joursDuJournal, type TablesDuJournal } from './journal';
import type { InjectionLog, SleepLog, SportLog, WeightLog } from '../donnees/v1';

const prise = (id: string, date: string, time: string): InjectionLog => ({ id, date, time, dose: 0.25, site: 'abdomen_gauche' });
const pesee = (id: string, date: string, time?: string): WeightLog => ({ id, date, time, weight: 95, isStartingWeight: false });
const sommeil = (id: string, date: string, time: string): SleepLog => ({ id, date, time, bedDate: '2026-09-25', bedTime: '23:00', kind: 'nuit', quality: 3 });
const activite = (id: string, date: string, time: string): SportLog => ({ id, date, time, sport: 'Vélo', intensity: 'moderee', duration: 30 });

const tables: TablesDuJournal = {
  prises: [prise('inj-1', '2026-09-26', '12:15'), prise('inj-2', '2026-09-25', '12:10')],
  pesees: [pesee('w-1', '2026-09-26', '09:12'), pesee('w-2', '2026-09-24')],
  sommeils: [sommeil('sleep-1', '2026-09-26', '07:20')],
  activites: [activite('sport-1', '2026-09-26', '18:10'), activite('sport-2', '2026-09-27', '10:00')],
};

const TOUS = ['traitement', 'balance', 'sommeil', 'activite-physique'] as const;

describe('entreesDuJournal', () => {
  it('reprend les quatre tables, la ligne attachée', () => {
    const entrees = entreesDuJournal(tables);
    expect(entrees).toHaveLength(7);
    expect(entrees.filter((e) => e.module === 'traitement')).toHaveLength(2);
    expect(entrees.find((e) => e.id === 'sport-1')).toMatchObject({ module: 'activite-physique', date: '2026-09-26', heure: '18:10' });
  });
  it('range un sommeil au jour de son réveil, et une pesée sans heure au début de sa journée', () => {
    const entrees = entreesDuJournal(tables);
    expect(entrees.find((e) => e.id === 'sleep-1')).toMatchObject({ date: '2026-09-26', heure: '07:20' });
    expect(entrees.find((e) => e.id === 'w-2')).toMatchObject({ heure: '' });
  });
});

describe('bornesDuJournal', () => {
  it('va dix ans en arrière et un an en avant, depuis aujourd’hui', () => {
    expect(bornesDuJournal('2026-09-26')).toEqual({ min: '2016-09-26', max: '2027-09-26' });
  });
});

describe('fenetreDuJournal', () => {
  it('ouvre sur six mois de chaque côté du jour regardé', () => {
    const f = fenetreDuJournal('2026-09-26', '2026-09-26');
    expect(f).toMatchObject({ debut: '2026-03-26', fin: '2027-03-26', plusAvant: true, plusApres: true });
  });

  it('c’est le jour regardé qui déplace la fenêtre, pas un compteur de pas', () => {
    /* « Voir plus » dans le passé revient à regarder le début de la fenêtre :
       six mois de plus apparaissent dessous. */
    expect(fenetreDuJournal('2026-03-26', '2026-09-26')).toMatchObject({ debut: '2025-09-26', fin: '2026-09-26' });
    /* Et dans le futur, à regarder sa fin. */
    expect(fenetreDuJournal('2027-03-26', '2026-09-26')).toMatchObject({ debut: '2026-09-26', fin: '2027-09-26' });
  });

  it('les bornes absolues rognent, et le « Voir plus » disparaît de ce côté', () => {
    expect(fenetreDuJournal('2027-03-26', '2026-09-26')).toMatchObject({ fin: '2027-09-26', plusApres: false });
    expect(fenetreDuJournal('2016-12-26', '2026-09-26')).toMatchObject({ debut: '2016-09-26', plusAvant: false });
  });

  it('un jour du passé garde ses six mois en avant sans dépasser la borne', () => {
    expect(fenetreDuJournal('2020-01-15', '2026-09-26')).toMatchObject({ debut: '2019-07-15', fin: '2020-07-15', plusAvant: true, plusApres: true });
  });

  it('ramène le quantième au dernier jour du mois d’arrivée', () => {
    expect(fenetreDuJournal('2026-08-31', '2026-09-26').debut).toBe('2026-02-28');
  });
});

describe('joursDuJournal', () => {
  const entrees = entreesDuJournal(tables);
  const fenetre = { debut: '2026-09-24', fin: '2026-09-27', plusAvant: false, plusApres: false };

  it('rend TOUS les jours de la fenêtre, du plus récent au plus ancien, les vides compris', () => {
    const jours = joursDuJournal(entrees, fenetre, TOUS);
    expect(jours.map((j) => j.date)).toEqual(['2026-09-27', '2026-09-26', '2026-09-25', '2026-09-24']);
  });

  it('une journée sans rien est là, sans entrée', () => {
    const vide = { debut: '2026-09-20', fin: '2026-09-21', plusAvant: false, plusApres: false };
    const jours = joursDuJournal(entrees, vide, TOUS);
    expect(jours).toHaveLength(2);
    expect(jours.every((j) => j.entrees.length === 0)).toBe(true);
  });

  it('range les entrées d’une journée du matin au soir', () => {
    const [, aujourdhui] = joursDuJournal(entrees, fenetre, TOUS);
    expect(aujourdhui.entrees.map((e) => e.id)).toEqual(['sleep-1', 'w-1', 'inj-1', 'sport-1']);
  });

  it('ne montre rien hors de la fenêtre', () => {
    const etroite = { debut: '2026-09-26', fin: '2026-09-26', plusAvant: true, plusApres: true };
    expect(joursDuJournal(entrees, etroite, TOUS).map((j) => j.date)).toEqual(['2026-09-26']);
  });

  it('le filtre retient les catégories cochées ; aucune cochée, les jours restent vides', () => {
    const jours = joursDuJournal(entrees, fenetre, ['balance']);
    expect(jours.flatMap((j) => j.entrees).map((e) => e.id)).toEqual(['w-1', 'w-2']);
    expect(joursDuJournal(entrees, fenetre, []).every((j) => j.entrees.length === 0)).toBe(true);
  });
});

describe('joursAvecEntree', () => {
  it('donne les jours à pointer, le futur compris, filtre appliqué', () => {
    const entrees = entreesDuJournal(tables);
    expect([...joursAvecEntree(entrees, TOUS)].sort()).toEqual(['2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27']);
    expect([...joursAvecEntree(entrees, ['sommeil'])]).toEqual(['2026-09-26']);
  });
});

describe('compteDuJour', () => {
  it('compte ce qu’une journée porte, filtre appliqué', () => {
    const entrees = entreesDuJournal(tables);
    expect(compteDuJour(entrees, '2026-09-26', TOUS)).toBe(4);
    expect(compteDuJour(entrees, '2026-09-26', ['traitement'])).toBe(1);
    expect(compteDuJour(entrees, '2026-09-23', TOUS)).toBe(0);
  });
});

describe('imageDeLEntree', () => {
  it('aucune ligne d’aujourd’hui n’a d’image : la grille montrera l’icône', () => {
    expect(entreesDuJournal(tables).every((e) => imageDeLEntree(e) === undefined)).toBe(true);
  });
  it('rend la photo de la ligne le jour où une table en portera une', () => {
    const avecPhoto = { ...activite('sport-9', '2026-09-26', '10:00'), photoUrl: 'repas.jpg' } as SportLog;
    const [entree] = entreesDuJournal({ prises: [], pesees: [], sommeils: [], activites: [avecPhoto] });
    expect(imageDeLEntree(entree)).toBe('repas.jpg');
  });
});
