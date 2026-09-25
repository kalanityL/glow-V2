/**
 * LE CATALOGUE DES ACTIVITÉS PHYSIQUES, ENGENDRÉ (2026-09-25) : l'arbre de
 * SON tri du Compendium of Physical Activities 2024 (pacompendium.com,
 * édition adultes, 1 111 activités et leur MET), fait dans la simulation
 * « Compendium des activités physiques » les 24 et 25 septembre — neuf
 * catégories hors activité physique retirées, les activités traduites en
 * français, fusionnées par le sens en groupes et sous-groupes, déplacées
 * ou supprimées à sa demande, jusqu'aux neuf catégories de la page. Le
 * résultat est `docs/pour-claude/compendium/arbre.json` (la source, avec
 * l'intitulé anglais d'origine et le code du Compendium de chaque
 * activité) ; ce script en écrit `src/domaine/activites-catalogue.ts`.
 *
 *     node scripts/engendrer-activites.mjs
 *
 * Les niveaux : 0 la catégorie (`CategorieActivite`), 1 les nœuds de la
 * catégorie (un groupe, ou une activité seule faite nœud), 2 et 3 leurs
 * sous-groupes ; les activités pendent au nœud qui les porte. Les MET
 * « estimés » (codes en rouge sur le site) sont marqués.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const arbre = JSON.parse(readFileSync(join(RACINE, 'docs', 'pour-claude', 'compendium', 'arbre.json'), 'utf8'));

const q = (s) => JSON.stringify(s);
const activite = (a, retrait) => `${retrait}{ code: ${q(a.code)}, met: ${a.met}, nom: ${q(a.nom)}, en: ${q(a.en)}${a.estime ? ', estime: true' : ''} },`;
const noeud = (n, retrait) => {
  const r2 = retrait + '  ';
  const activites = n.activites.length ? `\n${r2}activites: [\n${n.activites.map((a) => activite(a, r2 + '  ')).join('\n')}\n${r2}],` : `\n${r2}activites: [],`;
  const sous = n.sous.length ? `\n${r2}sous: [\n${n.sous.map((s) => noeud(s, r2 + '  ')).join('\n')}\n${r2}],` : `\n${r2}sous: [],`;
  return `${retrait}{\n${r2}nom: ${q(n.nom)},${activites}${sous}\n${retrait}},`;
};
let total = 0;
const compter = (n) => n.activites.length + n.sous.reduce((s, x) => s + compter(x), 0);
for (const c of arbre) for (const n of c.noeuds) total += compter(n);

const sortie = `/* ENGENDRÉ PAR \`scripts/engendrer-activites.mjs\` (2026-09-25) — NE PAS ÉDITER
   À LA MAIN : corriger \`docs/pour-claude/compendium/arbre.json\` et relancer.
   Le catalogue des activités physiques : son tri du Compendium of Physical
   Activities 2024 (pacompendium.com), ${total} activités et leur MET, en neuf
   catégories. Les noms des activités sont des DONNÉES du catalogue (comme
   les noms des traitements), en français ; l'intitulé anglais d'origine
   reste à côté, pour la recherche et pour retrouver l'activité dans le
   Compendium. Un MET \`estime\` est une valeur estimée par les auteurs, pas
   mesurée. */
import type { CategorieActivite } from './activites';

export interface ActiviteCompendium {
  /** Le code du Compendium (cinq chiffres). */
  code: string;
  met: number;
  nom: string;
  en: string;
  estime?: true;
}

/** Un nœud de l'arbre : un groupe (ses activités directes, ses sous-groupes),
    ou une activité seule faite nœud (une activité, aucun sous-groupe). */
export interface NoeudActivite {
  nom: string;
  activites: readonly ActiviteCompendium[];
  sous: readonly NoeudActivite[];
}

/** Les nœuds de niveau 1 de chaque catégorie, dans l'ordre de la page. */
export const CATALOGUE_ACTIVITES: Record<CategorieActivite, readonly NoeudActivite[]> = {
${arbre.map((c) => `  ${q(c.id)}: [\n${c.noeuds.map((n) => noeud(n, '    ')).join('\n')}\n  ],`).join('\n')}
};
`;
writeFileSync(join(RACINE, 'src', 'domaine', 'activites-catalogue.ts'), sortie);
console.log(`${total} activités, catalogue écrit`);
