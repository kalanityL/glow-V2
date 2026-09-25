/**
 * LES ICÔNES DES SPORTS, EN FEUILLE (2026-09-25, « resultat de recherche :
 * les icones doivent etre celle du sport ») : chaque masque de
 * `src/assets/images/activites/sports/<slug>.png` — découpé de ses
 * planches (`Images-pour-claude/icones/sport/`) — devient une règle
 * `.categorie--sport-<slug> { --categorie-masque: url(...) }` dans
 * `src/themes/activites-icones.css`. Le slug est celui de
 * `domaine/activites.ts` (`slugActivite`) ; une tuile de résultat porte la
 * classe de sa catégorie ET celle de son sport, la seconde gagne quand le
 * masque existe. Relancer à chaque icône ajoutée :
 *
 *     node scripts/engendrer-icones-activites.mjs
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER = join(RACINE, 'src', 'assets', 'images', 'activites', 'sports');
const fichiers = readdirSync(DOSSIER).filter((f) => f.endsWith('.png')).sort();
const regles = fichiers.map((f) => `.categorie--sport-${f.slice(0, -4)} { --categorie-masque: url('../assets/images/activites/sports/${f}'); }`);
writeFileSync(
  join(RACINE, 'src', 'themes', 'activites-icones.css'),
  `/* ENGENDRÉ PAR \`scripts/engendrer-icones-activites.mjs\` (2026-09-25) — NE PAS
   ÉDITER À LA MAIN : déposer le masque dans \`src/assets/images/activites/sports/\`
   et relancer. Une règle par icône de sport : le masque d'une tuile de
   résultat de recherche, à la place de celui de sa catégorie. */
${regles.join('\n')}
`,
);
console.log(`${fichiers.length} icônes de sport, feuille écrite`);
