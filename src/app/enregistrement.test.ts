import { describe, expect, it } from 'vitest';
import { REPONSES_INITIALES } from '../screens/onboarding/reponses';
import { VERSION_ENREGISTREMENT, deserialiser, serialiser } from './enregistrement';

describe('serialiser / deserialiser', () => {
  it('relit ce qui a été écrit', () => {
    const reponses = { ...REPONSES_INITIALES, prenom: 'Camille', tailleCm: 172 };
    expect(deserialiser(serialiser(reponses))).toEqual(reponses);
  });

  it('complète un enregistrement auquel il manque des clés', () => {
    const partiel = JSON.stringify({
      version: VERSION_ENREGISTREMENT,
      reponses: { prenom: 'Camille', avatar: { genre: 'homme' } },
    });
    const lu = deserialiser(partiel);
    expect(lu?.prenom).toBe('Camille');
    expect(lu?.tailleCm).toBe(REPONSES_INITIALES.tailleCm);
    expect(lu?.avatar.genre).toBe('homme');
    expect(lu?.avatar.coiffure).toBe(REPONSES_INITIALES.avatar.coiffure);
  });

  it('ignore ce qui n’est pas lisible, ou d’une autre version', () => {
    expect(deserialiser(null)).toBeNull();
    expect(deserialiser('')).toBeNull();
    expect(deserialiser('pas du json')).toBeNull();
    expect(deserialiser('42')).toBeNull();
    expect(deserialiser(JSON.stringify({ version: 0, reponses: {} }))).toBeNull();
    expect(deserialiser(JSON.stringify({ version: VERSION_ENREGISTREMENT }))).toBeNull();
  });
});
