import { describe, expect, it } from 'vitest';
import { REPONSES_INITIALES, type Reponses } from './reponses';
import { ETAPE_DEBUT_DECOMPTE, etapesVisibles, peutValider } from './parcours';

const avec = (changements: Partial<Reponses>): Reponses => ({
  ...REPONSES_INITIALES,
  ...changements,
});

describe('etapesVisibles', () => {
  it('commence par le thème, puis la langue et les unités', () => {
    expect(etapesVisibles(REPONSES_INITIALES).slice(0, 2)).toEqual(['theme', 'langue-unites']);
  });

  it('ne demande le poids visé qu’à qui veut perdre du poids', () => {
    expect(etapesVisibles(avec({ objectif: 'perdre' }))).toContain('poids-cible');
    expect(etapesVisibles(avec({ objectif: 'stabiliser' }))).not.toContain('poids-cible');
  });

  it('ne demande quel traitement qu’à qui a commencé', () => {
    expect(etapesVisibles(avec({ traitementCommence: true }))).toContain('quel-traitement');
    expect(etapesVisibles(avec({ traitementCommence: false }))).not.toContain('quel-traitement');
  });

  it('finit par l’avatar puis le profil, quel que soit le chemin', () => {
    for (const reponses of [
      avec({ objectif: 'stabiliser', traitementCommence: false }),
      avec({ objectif: 'perdre', traitementCommence: true }),
    ]) {
      expect(etapesVisibles(reponses).slice(-2)).toEqual(['avatar', 'profil']);
    }
  });

  it('le décompte commence à une étape toujours visible', () => {
    expect(etapesVisibles(avec({ traitementCommence: false }))).toContain(ETAPE_DEBUT_DECOMPTE);
  });
});

describe('peutValider', () => {
  it('bloque « quel traitement » tant que la forme ET la spécialité manquent', () => {
    expect(peutValider('quel-traitement', avec({ formeTraitement: null, traitement: null }))).toBe(
      false,
    );
    expect(
      peutValider('quel-traitement', avec({ formeTraitement: 'injection', traitement: null })),
    ).toBe(false);
    expect(
      peutValider('quel-traitement', avec({ formeTraitement: 'injection', traitement: 'ozempic' })),
    ).toBe(true);
  });

  it('laisse entrer sans mot de passe, mais pas avec un mot de passe trop court', () => {
    expect(peutValider('profil', avec({ motDePasse: '' }))).toBe(true);
    expect(peutValider('profil', avec({ motDePasse: 'court' }))).toBe(false);
    expect(peutValider('profil', avec({ motDePasse: 'huit-oui' }))).toBe(true);
  });

  it('ne bloque aucune autre étape', () => {
    for (const etape of ['theme', 'langue-unites', 'objectif', 'poids', 'poids-cible', 'traitement', 'avatar'] as const) {
      expect(peutValider(etape, REPONSES_INITIALES)).toBe(true);
    }
  });
});
