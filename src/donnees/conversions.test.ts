import { describe, expect, it } from 'vitest';
import { AVATAR_INITIAL } from '../domaine/avatar';
import { avatarConfigDepuisAvatar, avatarDepuisAvatarConfig, avatarHorsBaseDepuisAvatar, brandDepuisTraitement, traitementDepuisBrand } from './conversions';
import { poidsDepuisKg, poidsEnKg } from '../domaine/unites';

describe('l’avatar, dans les mots de la V1', () => {
  it('écrit chez la V1 ce qu’elle porte, à sa valeur neutre ce que le prototype n’a plus', () => {
    const avatar = { ...AVATAR_INITIAL, formeVisage: 'carre' as const, coiffure: 'carre' as const, nez: 'large' as const };
    const config = avatarConfigDepuisAvatar(avatar);
    expect(config).toEqual({
      gender: 'femme',
      faceShape: 'square',
      skinColor: AVATAR_INITIAL.couleurPeau,
      eyeColor: AVATAR_INITIAL.couleurYeux,
      hairStyle: 'long',
      hairColor: AVATAR_INITIAL.couleurCheveux,
      hasGlasses: false,
      expression: 'happy',
    });
    expect('nez' in config).toBe(false);
  });

  it('fait le tour sans rien perdre, la part hors base comprise', () => {
    const avatar = { ...AVATAR_INITIAL, genre: 'homme' as const, formeYeux: 'tombant' as const, bouche: 'neutre' as const, vetement: 'capuche' as const, coiffure: 'boucle' as const };
    const relu = avatarDepuisAvatarConfig(avatarConfigDepuisAvatar(avatar), AVATAR_INITIAL, avatarHorsBaseDepuisAvatar(avatar));
    expect(relu).toEqual(avatar);
  });

  it('relit un profil de la V1 au plus proche : le cœur en ovale, la frange en carré, la brosse en court', () => {
    const config = avatarConfigDepuisAvatar(AVATAR_INITIAL);
    expect(avatarDepuisAvatarConfig({ ...config, faceShape: 'heart', hairStyle: 'frange', hasGlasses: true, expression: 'calm' }, AVATAR_INITIAL)).toEqual({ ...AVATAR_INITIAL, formeVisage: 'ovale', coiffure: 'carre' });
    expect(avatarDepuisAvatarConfig({ ...config, hairStyle: 'brosse' }, AVATAR_INITIAL).coiffure).toBe('court');
    expect(avatarDepuisAvatarConfig({ ...config, hairStyle: 'chauve' }, AVATAR_INITIAL).coiffure).toBe('court');
  });

  it('sans part hors base, relit les réglages de départ du prototype', () => {
    const relu = avatarDepuisAvatarConfig(avatarConfigDepuisAvatar({ ...AVATAR_INITIAL, nez: 'retrousse' }), AVATAR_INITIAL);
    expect(relu.nez).toBe(AVATAR_INITIAL.nez);
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
