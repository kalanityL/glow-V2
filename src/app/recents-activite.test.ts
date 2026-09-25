import { describe, expect, it } from 'vitest';
import { avecLeSportRecent, lireSportsRecents } from './recents-activite';

describe('avecLeSportRecent', () => {
  it('met le sport en tête, une fois, et garde neuf sports', () => {
    expect(avecLeSportRecent(['Vélo', 'Natation'], 'Natation')).toEqual(['Natation', 'Vélo']);
    const dix = Array.from({ length: 10 }, (_, i) => `s${i}`);
    expect(avecLeSportRecent(dix, 'nouveau')).toHaveLength(9);
    expect(avecLeSportRecent(dix, 'nouveau')[0]).toBe('nouveau');
  });
});

describe('lireSportsRecents', () => {
  it('lit la suite enregistrée et se tait sur tout le reste', () => {
    expect(lireSportsRecents('{"version":1,"sports":["Vélo","Yoga"]}')).toEqual(['Vélo', 'Yoga']);
    expect(lireSportsRecents('{"version":2,"sports":["Vélo"]}')).toEqual([]);
    expect(lireSportsRecents('pas du json')).toEqual([]);
    expect(lireSportsRecents(null)).toEqual([]);
  });
});
