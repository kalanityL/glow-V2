// Assemble des fragments de chapitre en une page lisible, figures comprises.
//
// Les rédacteurs rendent des fragments <section id="…"> sans images : ils
// écrivent seulement <figure data-capture="<domaine>/<slug>">. Les captureurs,
// eux, écrivent les PNG. Ce script fait la jonction — c'est le seul endroit qui
// la fasse, pour que l'assemblage final et la lecture des brouillons ne
// divergent pas (demande du 2026-09-13 : « pkoi je ne voi rien dan les
// fichiets ? » — les chapitres étaient écrits mais invisibles).
//
// Emploi :
//   node scripts/assembler-chapitres.mjs <sortie.html> <titre> [ids…]
// Sans ids, tous les chapitres de docs/brouillons/ dans l'ordre du sommaire.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..')
const BROUILLONS = join(RACINE, 'docs', 'brouillons')
const CAPTURES = join(RACINE, 'docs', 'captures')

// L'ordre du sommaire, celui qu'elle a validé. Le chapitre 21 n'est pas encore
// écrit ; un id sans fichier est simplement sauté.
export const ORDRE = [
  'produit', 'compte', 'onboarding', 'maison', 'traitement', 'poids', 'effets',
  'alimentation', 'pas', 'activite', 'sommeil', 'temps-pour-soi', 'metabolisme',
  'badges', 'ciel', 'insolites', 'rapport', 'modules', 'profil', 'partage',
  'non-implemente',
]

/** Tous les PNG du dossier des captures, indexés deux fois : par leur nom, et
 *  par leur nom tirets retirés. Les rédacteurs rendent l'apostrophe par un
 *  tiret (« d-un »), les captureurs la suppriment (« dun ») : le second index
 *  rattrape cet écart sans qu'on retouche les fichiers. */
function indexerCaptures() {
  const exact = new Map()
  const souple = new Map()
  for (const domaine of readdirSync(CAPTURES, { withFileTypes: true })) {
    if (!domaine.isDirectory()) continue
    for (const fichier of readdirSync(join(CAPTURES, domaine.name))) {
      if (!fichier.endsWith('.png')) continue
      const cle = `${domaine.name}/${fichier.slice(0, -4)}`
      exact.set(cle, cle)
      const nu = cle.replaceAll('-', '')
      if (!souple.has(nu)) souple.set(nu, cle)
    }
  }
  return { exact, souple }
}

/** Le titre d'un chapitre, lu dans son <h2>, sans le lien de retour et sans son
 *  numéro : le sommaire est une <ol>, elle numérote déjà. */
function titreDu(fragment) {
  const h2 = fragment.match(/<h2>(.*?)<\/h2>/s)
  if (!h2) return null
  return h2[1]
    .replace(/<a\b[^>]*>.*?<\/a>/gs, '')
    .replace(/<[^>]+>/g, '')
    .replace(/^\s*\d+\.\s*/, '')
    .trim()
}

function echapper(texte) {
  return texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Remplace chaque <figure data-capture="…"> par la même figure avec son <img>.
 *  Une figure sans fichier n'est pas silencieusement vidée : elle le dit à
 *  l'écran, sinon on croit la page complète alors qu'il manque une image. */
function poserLesImages(fragment, index, manquantes, rapprochees) {
  return fragment.replace(
    /<figure([^>]*?)data-capture="([^"]+)"([^>]*)>/g,
    (_, avant, cle, apres) => {
      const trouve = index.exact.get(cle) ?? index.souple.get(cle.replaceAll('-', ''))
      const ouverture = `<figure${avant}data-capture="${cle}"${apres}>`
      if (!trouve) {
        manquantes.push(cle)
        return `${ouverture}<p class="figure-absente">Capture absente : <code>${echapper(cle)}</code></p>`
      }
      if (trouve !== cle) rapprochees.push([cle, trouve])
      return `${ouverture}<img src="captures/${trouve}.png" alt="" loading="lazy">`
    },
  )
}

function page({ titre, avertissement, sommaire, corps, pied }) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${echapper(titre)}</title>
<link rel="stylesheet" href="style.css">
<style>
.figure-absente { border: 1px dashed var(--filet); border-radius: 10px; padding: 10px 14px; color: var(--encre-douce); font-size: 14px; margin: 0; }
.avertissement { border-left: 3px solid #b45309; background: #fff7ed; color: #7a5200; padding: 12px 16px; border-radius: 0 10px 10px 0; margin: 0 0 32px; }
.avertissement p:first-child { margin-top: 0; }
.avertissement p:last-child { margin-bottom: 0; }
</style>
</head>
<body>
<main>
<div class="bandeau">
  <a href="index.html">Sommaire général</a>
  <a href="spec-fonctionnelle.html">Fonctionnelle</a>
  <a href="brouillons.html" aria-current="page">Brouillons</a>
</div>

<h1>${echapper(titre)}</h1>
${avertissement}
<nav class="sommaire" id="sommaire">
<h2>Sommaire</h2>
<ol>
${sommaire}
</ol>
</nav>

${corps}

${pied}
</main>
</body>
</html>
`
}

const [sortie, titre, ...demandes] = process.argv.slice(2)
if (!sortie || !titre) {
  console.error('Emploi : node scripts/assembler-chapitres.mjs <sortie.html> <titre> [ids…]')
  process.exit(1)
}

const index = indexerCaptures()
const ids = (demandes.length ? demandes : ORDRE).filter((id) =>
  existsSync(join(BROUILLONS, `chapitre-${id}.html`)))

const manquantes = []
const rapprochees = []
const lignes = []
const morceaux = []

ids.forEach((id, rang) => {
  const brut = readFileSync(join(BROUILLONS, `chapitre-${id}.html`), 'utf8')
  morceaux.push(poserLesImages(brut, index, manquantes, rapprochees))
  lignes.push(`<li><a href="#${id}">${echapper(titreDu(brut) ?? id)}</a></li>`)
})

const total = manquantes.length + rapprochees.length + morceaux.join('').match(/<img /g)?.length ?? 0
const figures = (morceaux.join('').match(/data-capture=/g) ?? []).length

const avertissement = `<div class="avertissement">
<p><strong>Brouillons — rien ici n'est vérifié.</strong> Ces ${ids.length} chapitres ont été écrits depuis l'inventaire de la V1 et son code, mais n'ont pas encore été réfutés contre le code ni corrigés. Ils peuvent contenir des affirmations que le code ne fonde pas.</p>
<p>La spécification, elle, est <a href="spec-fonctionnelle.html">là</a> : un chapitre n'y entre qu'une fois réfuté et corrigé.</p>
</div>`

const pied = `<h2 id="figures">Les figures <a class="retour" href="#sommaire">↑ sommaire</a></h2>
<p>${figures} figures appelées, ${manquantes.length} sans fichier${rapprochees.length ? `, ${rapprochees.length} retrouvées à un tiret près` : ''}.</p>
${manquantes.length ? `<h3>Sans fichier</h3>\n<ul>\n${[...new Set(manquantes)].sort().map((c) => `<li><code>${echapper(c)}</code></li>`).join('\n')}\n</ul>` : ''}
${rapprochees.length ? `<h3>Retrouvées à un tiret près</h3>\n<p class="note">Le chapitre écrit le premier nom, le fichier porte le second. C'est le chapitre qu'il faudra corriger, pas le fichier.</p>\n<ul>\n${[...new Map(rapprochees).entries()].sort().map(([a, b]) => `<li><code>${echapper(a)}</code> → <code>${echapper(b)}</code></li>`).join('\n')}\n</ul>` : ''}`

writeFileSync(join(RACINE, 'docs', sortie), page({
  titre,
  avertissement,
  sommaire: lignes.join('\n'),
  corps: morceaux.join('\n\n'),
  pied,
}))

console.log(`${sortie} : ${ids.length} chapitres, ${figures} figures — ${manquantes.length} absentes, ${rapprochees.length} rapprochées`)
