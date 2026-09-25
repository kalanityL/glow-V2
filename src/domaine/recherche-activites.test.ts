import { describe, expect, it } from 'vitest';
import { chercherActivites, normaliser } from './recherche-activites';
import type { NoeudActivite } from './activites-catalogue';
import type { CategorieActivite } from './activites';

const a = (code: string, nom: string, en: string, met = 5) => ({ code, met, nom, en });
const catalogue: Record<CategorieActivite, readonly NoeudActivite[]> = {
  'ballon-et-balles': [{ nom: 'Football', activites: [a('15610', 'Football, en général', 'Soccer, general')], sous: [] }],
  raquettes: [{ nom: 'Tennis', activites: [], sous: [{ nom: 'Tennis de table', activites: [a('15675', 'Tennis de table, ping-pong', 'Table tennis, ping pong')], sous: [] }] }],
  roues: [{ nom: 'Vélo', activites: [a('01015', 'Vélo, allure choisie', 'Bicycling, self-selected pace')], sous: [{ nom: 'VTT', activites: [a('01009', 'VTT, en général', 'Bicycling, mountain, general')], sous: [] }] }],
  pedestre: [],
  cheval: [{ nom: 'Polo, à cheval', activites: [a('15550', 'Polo, à cheval', 'Polo, on horseback')], sous: [] }],
  individuel: [],
  aquatiques: [{ nom: 'Vélo aquatique', activites: [a('18355', 'Vélo aquatique, 50 W', 'Water aerobics, water bicycle')], sous: [] }],
  hivernales: [],
  autre: [],
};

describe('normaliser', () => {
  it('ôte les accents, la casse et la ponctuation', () => {
    expect(normaliser('  Vélo,  Électrique ')).toBe('velo electrique');
  });
});

describe('chercherActivites', () => {
  it('ne rend rien pour un mot vide', () => {
    expect(chercherActivites('   ', catalogue)).toEqual([]);
  });
  it('trouve un nœud de niveau 1 par son nom, sans accents', () => {
    expect(chercherActivites('velo', catalogue).map((r) => r.noeud.nom)).toEqual(['Vélo', 'Vélo aquatique']);
  });
  it('fait remonter le niveau 1 quand le mot est dans un sous-groupe, une seule fois', () => {
    const r = chercherActivites('vtt', catalogue);
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ categorie: 'roues', noeud: { nom: 'Vélo' } });
  });
  it('fait remonter le niveau 1 quand le mot est dans une activité, en français ou en anglais', () => {
    expect(chercherActivites('ping', catalogue).map((r) => r.noeud.nom)).toEqual(['Tennis']);
    expect(chercherActivites('soccer', catalogue).map((r) => r.noeud.nom)).toEqual(['Football']);
  });
  it('cherche au début d’un mot : « ping » trouve ping-pong, pas camping', () => {
    const cat = { ...catalogue, hivernales: [{ nom: 'Camping', activites: [a('17000', 'Camping, en général', 'Camping, general')], sous: [] }] };
    expect(chercherActivites('ping', cat).map((r) => r.noeud.nom)).toEqual(['Tennis']);
    expect(chercherActivites('camp', cat).map((r) => r.noeud.nom)).toEqual(['Camping']);
  });
  it('ne propose jamais une catégorie', () => {
    expect(chercherActivites('cheval', catalogue).map((r) => r.noeud.nom)).toEqual(['Polo, à cheval']);
  });
});
