import { describe, expect, it } from 'vitest';
import { AVATAR_INITIAL } from '../domaine/avatar';
import { avatarConfigDepuisAvatar, avatarDepuisAvatarConfig, brandDepuisTraitement, formeDuTraitement, reponsesDepuisBase, traitementDepuisBrand } from './conversions';
import { poidsDepuisKg, poidsEnKg } from '../domaine/unites';
import { REPONSES_INITIALES } from '../screens/onboarding/reponses';
import { donneesVides } from './v1';

describe('la forme du traitement, relue depuis la base (2026-09-21, « ajouter traitement ne m’amene pas au formulaire »)', () => {
  const avecBrand = (glp1Brand: string) => {
    const base = donneesVides();
    base.profile.glp1Brand = glp1Brand;
    return base;
  };
  it('vient du catalogue quand rien ne la dit hors base', () => {
    expect(formeDuTraitement('wegovy-injection')).toBe('injection');
    expect(formeDuTraitement('rybelsus')).toBe('comprime');
    expect(formeDuTraitement(null)).toBeNull();
    expect(formeDuTraitement('inconnu')).toBeNull();
    const r = reponsesDepuisBase(avecBrand('wegovy-injection'), {}, REPONSES_INITIALES);
    expect(r.traitement).toBe('wegovy-injection');
    expect(r.formeTraitement).toBe('injection');
    expect(r.traitementCommence).toBe(true);
    expect(reponsesDepuisBase(avecBrand('rybelsus'), {}, REPONSES_INITIALES).formeTraitement).toBe('comprime');
  });
  it('se tait sans traitement, et respecte la forme hors base quand elle est là', () => {
    expect(reponsesDepuisBase(avecBrand('aucun'), {}, REPONSES_INITIALES).formeTraitement).toBeNull();
    expect(reponsesDepuisBase(avecBrand('wegovy-injection'), { formeTraitement: 'injection' }, REPONSES_INITIALES).formeTraitement).toBe('injection');
  });
});

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
