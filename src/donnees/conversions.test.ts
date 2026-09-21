import { describe, expect, it } from 'vitest';
import { AVATAR_INITIAL } from '../domaine/avatar';
import { avatarConfigDepuisAvatar, avatarDepuisAvatarConfig, brandDepuisTraitement, traitementDepuisBrand } from './conversions';
import { poidsDepuisKg, poidsEnKg } from '../domaine/unites';

describe('l’avatar, dans les mots de la V1', () => {
  it('fait le tour sans rien perdre', () => {
    const avatar = { ...AVATAR_INITIAL, formeVisage: 'coeur' as const, expression: 'determinee' as const, lunettes: true };
    const config = avatarConfigDepuisAvatar(avatar);
    expect(config).toMatchObject({ faceShape: 'heart', expression: 'determined', hasGlasses: true, hairStyle: 'long' });
    expect(avatarDepuisAvatarConfig(config, AVATAR_INITIAL)).toEqual(avatar);
  });
});

describe('le traitement', () => {
  it('nomme foundayo comme la V1, et aucun sans traitement', () => {
    expect(brandDepuisTraitement('foundayo')).toBe('orforglipron');
    expect(brandDepuisTraitement('ozempic')).toBe('ozempic');
    expect(brandDepuisTraitement(null)).toBe('aucun');
    expect(traitementDepuisBrand('orforglipron')).toBe('foundayo');
    expect(traitementDepuisBrand('aucun')).toBeNull();
    expect(traitementDepuisBrand(undefined)).toBeNull();
  });
});

describe('le poids, métrique en base', () => {
  it('convertit les livres et revient', () => {
    expect(poidsEnKg('95.0', 'kg')).toBe(95);
    expect(poidsEnKg('209.4', 'lb')).toBe(95);
    expect(poidsDepuisKg(95, 'lb')).toBe('209.4');
    expect(poidsDepuisKg(95, 'kg')).toBe('95.0');
  });
});
