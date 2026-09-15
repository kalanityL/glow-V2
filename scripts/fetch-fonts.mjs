/**
 * TÉLÉCHARGE LES POLICES DANS LE DÉPÔT, une fois pour toutes.
 *
 * Pourquoi : l'application ne doit dépendre d'AUCUN service extérieur pour
 * s'afficher. Deux raisons qui ne bougeront pas —
 *   1. la conversion en React Native : là-bas, une police est un FICHIER
 *      embarqué dans le paquet, jamais une feuille distante ; les fichiers
 *      déposés ici sont ceux qu'on lui donnera ;
 *   2. le multilingue : chaque police est découpée en sous-ensembles
 *      (latin, latin étendu, cyrillique, vietnamien…) et on les prend TOUS.
 *      Le navigateur ne charge que ceux dont la page a besoin, grâce à
 *      `unicode-range` : garder le cyrillique ne coûte donc rien au lecteur
 *      français, et évite qu'une traduction russe tombe sur la police de
 *      repli.
 *
 * Le relancer met les polices à jour :
 *   node scripts/fetch-fonts.mjs
 *
 * Il écrit les `.woff2` dans `src/assets/fonts/` et réécrit `src/fonts.css`.
 * Les deux sont versionnés : une installation propre n'a pas besoin du réseau.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONT_DIR = resolve(ROOT, 'src/assets/fonts');
const CSS_FILE = resolve(ROOT, 'src/fonts.css');

/* Les familles et les SEULES graisses employées par les thèmes. En ajouter une
   à un thème demande de l'ajouter ici, et de relancer le script. */
const QUERY =
  'family=Outfit:wght@600;800;900&family=Plus+Jakarta+Sans:wght@400;500;700&family=Inter:wght@400;500;600;700;800&display=swap';

/* Sans un agent moderne, Google sert des `.ttf` : c'est le même agent qui
   décide du format, et on veut le woff2, quatre fois plus léger. */
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';

const css = await fetch(`https://fonts.googleapis.com/css2?${QUERY}`, {
  headers: { 'User-Agent': UA },
}).then((r) => {
  if (!r.ok) throw new Error(`Google Fonts a répondu ${r.status}`);
  return r.text();
});

await mkdir(FONT_DIR, { recursive: true });

/* Chaque bloc `@font-face` porte son sous-ensemble en commentaire juste
   au-dessus ; on le reprend pour nommer le fichier lisiblement. */
const blocks = css.split('/*').slice(1);
let out = `/* POLICES EMBARQUÉES — fichier ENGENDRÉ par scripts/fetch-fonts.mjs.
   Ne pas le modifier à la main : relancer le script.

   Les sous-ensembles sont tous là (latin, latin étendu, cyrillique,
   vietnamien…) pour que le multilingue ne tombe jamais sur la police de repli.
   \`unicode-range\` fait que le navigateur ne télécharge que ceux dont la page
   se sert : les garder ne coûte rien à qui ne lit qu'une langue. */\n`;

let count = 0;
for (const block of blocks) {
  const subset = block.slice(0, block.indexOf('*/')).trim();
  const face = block.slice(block.indexOf('*/') + 2);
  const family = /font-family: '([^']+)'/.exec(face)?.[1];
  const weight = /font-weight: (\d+)/.exec(face)?.[1];
  const url = /url\((https:[^)]+)\)/.exec(face)?.[1];
  if (!family || !weight || !url) continue;

  const slug = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight}-${subset.replace(/[^a-z0-9]+/g, '-')}`;
  const file = `${slug}.woff2`;
  const bytes = await fetch(url).then((r) => r.arrayBuffer());
  await writeFile(resolve(FONT_DIR, file), Buffer.from(bytes));
  count += 1;

  out += `\n/* ${subset} */\n${face.trim().replace(url, `./assets/fonts/${file}`)}\n`;
}

await writeFile(CSS_FILE, out);
console.log(`${count} fichiers de police écrits dans src/assets/fonts/, src/fonts.css réécrit.`);
