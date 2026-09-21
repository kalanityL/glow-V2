import { describe, expect, it } from 'vitest';
import { REPONSES_INITIALES } from '../screens/onboarding/reponses';
import { VERSION_HORS_BASE, deserialiserHorsBase, lireReponses, serialiserHorsBase } from './enregistrement';
import { lireBase } from './base';
import { baseDepuisReponses } from '../donnees/conversions';
import { donneesVides } from '../donnees/v1';

describe('les réponses hors base', () => {
  it('relit ce qui a été écrit, et rien que ce que la V1 ne porte pas', () => {
    const reponses = { ...REPONSES_INITIALES, email: 'camille@exemple.fr', theme: 'blanc' as const, prenom: 'Camille' };
    const lu = deserialiserHorsBase(serialiserHorsBase(reponses));
    expect(lu.email).toBe('camille@exemple.fr');
    expect(lu.theme).toBe('blanc');
    expect('prenom' in lu).toBe(false);
  });

  it('ignore ce qui n’est pas lisible, ou d’une version à venir', () => {
    expect(deserialiserHorsBase(null)).toEqual({});
    expect(deserialiserHorsBase('pas du json')).toEqual({});
    expect(deserialiserHorsBase(JSON.stringify({ version: VERSION_HORS_BASE + 1, reponses: { email: 'x' } }))).toEqual({});
  });

  it('écrit la part hors base de l’avatar, et la relit', () => {
    const reponses = { ...REPONSES_INITIALES, avatar: { ...REPONSES_INITIALES.avatar, nez: 'large' as const, vetement: 'capuche' as const, couleurVetement: '#244B73' } };
    const lu = deserialiserHorsBase(serialiserHorsBase(reponses));
    expect(lu.avatar).toEqual({ formeYeux: 'amande', nez: 'large', bouche: 'sourire', vetement: 'capuche', couleurVetement: '#244B73' });
    expect(lu.avatar && 'genre' in lu.avatar).toBe(false);
  });

  it('relit une version 1 (d’avant le prototype modulaire), sans avatar hors base', () => {
    const lu = deserialiserHorsBase(JSON.stringify({ version: 1, reponses: { email: 'camille@exemple.fr', theme: 'blanc' } }));
    expect(lu).toEqual({ email: 'camille@exemple.fr', theme: 'blanc' });
    expect(lireReponses(lireBase(JSON.stringify(donneesVides())), lu).avatar).toMatchObject({ nez: REPONSES_INITIALES.avatar.nez, vetement: REPONSES_INITIALES.avatar.vetement });
  });
});

describe('lireReponses : la base de la V1 et les réponses hors base', () => {
  it('fait le tour : réponses → base → réponses', () => {
    const reponses = {
      ...REPONSES_INITIALES,
      prenom: 'Camille',
      tailleCm: 172,
      poids: '96.0',
      poidsCible: '72.0',
      traitement: 'foundayo',
      formeTraitement: 'comprime' as const,
      avatar: { ...REPONSES_INITIALES.avatar, genre: 'homme' as const, coiffure: 'court' as const, bouche: 'pulpeuse' as const },
    };
    const base = baseDepuisReponses(reponses, donneesVides(), '2026-09-21');
    expect(base.profile).toMatchObject({ name: 'Camille', height: 172, targetWeight: 72, glp1Brand: 'orforglipron', gender: 'homme' });
    expect(base.profile.avatar).toMatchObject({ hairStyle: 'court', expression: 'happy', hasGlasses: false });
    expect('bouche' in base.profile.avatar).toBe(false);
    expect(base.weightHistory[0]).toMatchObject({ id: 'starting-weight-log', weight: 96, isStartingWeight: true, time: '08:00' });
    const relues = lireReponses(lireBase(JSON.stringify(base)), deserialiserHorsBase(serialiserHorsBase(reponses)));
    expect(relues).toEqual(reponses);
  });

  it('sur une base au profil d’usine de la V1, lit ce profil', () => {
    expect(lireReponses(lireBase(JSON.stringify(donneesVides())), {})).toMatchObject({ prenom: 'Chloé', tailleCm: 168 });
  });
});
