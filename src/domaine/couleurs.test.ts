import { describe, expect, it } from 'vitest';
import {
  CLARTE_PASTILLE,
  SATURATION_PASTILLE,
  moyenneDe,
  moyenneDesTeintes,
  rgbDepuisHex,
  teinteBannie,
  teinteDe,
  teinteDePastille,
  teinteViveDominante,
} from './couleurs';

describe('teinteDe', () => {
  it('lit la teinte en degrés', () => {
    expect(teinteDe([255, 0, 0])).toBe(0);
    expect(teinteDe([0, 255, 0])).toBe(120);
    expect(teinteDe([0, 0, 255])).toBe(240);
    /* La couleur moyenne de la photo du 2026-09-16, un gris-vert chaud. */
    expect(teinteDe([0xd3, 0xd4, 0xc3])).toBe(64);
  });

  it('donne 0 pour un gris, sans diviser par zéro', () => {
    expect(teinteDe([128, 128, 128])).toBe(0);
  });
});

describe('teinteBannie', () => {
  it('bannit le jaune et l’orange, pas le bleu ni le vert franc', () => {
    expect(teinteBannie(30)).toBe(true);
    expect(teinteBannie(75)).toBe(true);
    expect(teinteBannie(120)).toBe(false);
    expect(teinteBannie(210)).toBe(false);
  });
});

describe('teinteViveDominante', () => {
  const bleu: [number, number, number] = [60, 110, 200];
  const vertJaune: [number, number, number] = [150, 190, 60];
  const gris: [number, number, number] = [200, 200, 200];

  it('prend la tranche vive la plus peuplée, hors teintes bannies', () => {
    /* Trois pixels de vert-jaune (banni) contre deux de bleu : le bleu gagne. */
    expect(teinteViveDominante([vertJaune, vertJaune, vertJaune, bleu, bleu, gris])).toBe(215);
  });

  it('ignore les gris et rend null quand rien n’est vif', () => {
    expect(teinteViveDominante([gris, gris])).toBeNull();
    expect(teinteViveDominante([vertJaune])).toBeNull();
  });
});

describe('rgbDepuisHex', () => {
  it('lit #rrggbb et #rgb, refuse le reste', () => {
    expect(rgbDepuisHex('#2f6cf5')).toEqual([47, 108, 245]);
    expect(rgbDepuisHex(' #2F6CF5 ')).toEqual([47, 108, 245]);
    expect(rgbDepuisHex('#fff')).toEqual([255, 255, 255]);
    expect(rgbDepuisHex('var(--accent)')).toBeNull();
  });
});

describe('moyenneDesTeintes', () => {
  it('moyenne sur le cercle : 350° et 10° donnent 0°, pas 180°', () => {
    expect(moyenneDesTeintes(350, 10)).toBe(0);
    expect(moyenneDesTeintes(200, 240)).toBe(220);
  });
});

describe('teinteDePastille', () => {
  it('rend la teinte vive dominante, à la clarté et à la saturation des pastilles', () => {
    expect(teinteDePastille([[60, 110, 200], [200, 200, 200]])).toBe(
      `hsl(215 ${SATURATION_PASTILLE}% ${CLARTE_PASTILLE}%)`,
    );
  });

  it('moyenne la teinte de la photo avec celle de l’accent du menu', () => {
    /* Photo dans la tranche 210–219 (milieu 215°), menu #2f6cf5 à 222° :
       218,5°, arrondi à 219. */
    expect(teinteDePastille([[60, 110, 200]], [47, 108, 245])).toBe(
      `hsl(219 ${SATURATION_PASTILLE}% ${CLARTE_PASTILLE}%)`,
    );
  });

  it('retombe sur la teinte moyenne quand rien n’est vif', () => {
    expect(moyenneDe([[0xd3, 0xd4, 0xc3]])).toEqual([0xd3, 0xd4, 0xc3]);
    expect(teinteDePastille([[0xd3, 0xd4, 0xc3]])).toBe(
      `hsl(64 ${SATURATION_PASTILLE}% ${CLARTE_PASTILLE}%)`,
    );
  });
});
