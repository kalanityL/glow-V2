import { describe, expect, it } from 'vitest';
import { AVATAR_INITIAL, DEPART_DU_GENRE, avatarDepuisInconnu } from './avatar';

describe('l’avatar relu depuis n’importe quoi', () => {
  it('garde chaque réglage connu et rend les autres à leur valeur de départ', () => {
    const relu = avatarDepuisInconnu(
      { genre: 'homme', formeVisage: 'carre', formeYeux: 'rond', nez: 'large', bouche: 'pulpeuse', coiffure: 'boucle', vetement: 'capuche', couleurPeau: '#43291F', couleurVetement: '#244B73' },
      AVATAR_INITIAL,
    );
    expect(relu).toEqual({
      ...AVATAR_INITIAL,
      genre: 'homme',
      formeVisage: 'carre',
      formeYeux: 'rond',
      nez: 'large',
      bouche: 'pulpeuse',
      coiffure: 'boucle',
      vetement: 'capuche',
      couleurPeau: '#43291F',
      couleurVetement: '#244B73',
    });
  });

  it('relit un avatar de l’ancien modèle sans rien casser : ce qui n’existe plus tombe', () => {
    const ancien = { genre: 'neutre', formeVisage: 'coeur', coiffure: 'frange', expression: 'fiere', lunettes: true, couleurCheveux: '#E9C46A' };
    const relu = avatarDepuisInconnu(ancien, AVATAR_INITIAL);
    expect(relu).toEqual({ ...AVATAR_INITIAL, genre: 'neutre', couleurCheveux: '#E9C46A' });
    expect('expression' in relu).toBe(false);
    expect('lunettes' in relu).toBe(false);
  });

  it('écarte une couleur qui n’en est pas une, et tout ce qui n’est pas un objet', () => {
    expect(avatarDepuisInconnu({ couleurPeau: 'rouge', couleurYeux: 12 }, AVATAR_INITIAL)).toEqual(AVATAR_INITIAL);
    expect(avatarDepuisInconnu(null, AVATAR_INITIAL)).toEqual(AVATAR_INITIAL);
    expect(avatarDepuisInconnu('avatar', AVATAR_INITIAL)).toEqual(AVATAR_INITIAL);
  });

  it('part d’une femme aux cheveux longs : le carré, la coiffure longue du prototype', () => {
    expect(AVATAR_INITIAL.genre).toBe('femme');
    expect(AVATAR_INITIAL.coiffure).toBe(DEPART_DU_GENRE.femme.coiffure);
    expect(DEPART_DU_GENRE.femme.coiffure).toBe('carre');
  });
});
