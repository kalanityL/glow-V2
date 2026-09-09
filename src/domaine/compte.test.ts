import { describe, expect, it } from 'vitest';
import { LONGUEUR_MOT_DE_PASSE, motDePasseValide } from './compte';

describe('motDePasseValide', () => {
  it('exige huit signes, et rien d’autre', () => {
    expect(LONGUEUR_MOT_DE_PASSE).toBe(8);
    expect(motDePasseValide('1234567')).toBe(false);
    expect(motDePasseValide('12345678')).toBe(true);
    /* Ni majuscule, ni chiffre, ni signe imposé : « c'est tout ». */
    expect(motDePasseValide('abcdefgh')).toBe(true);
  });
});
