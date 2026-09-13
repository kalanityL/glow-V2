// Assemble les fragments de chapitre en une page lisible, figures comprises.
//
// Les rédacteurs rendent des fragments <section id="…"> sans images : ils
// écrivent seulement <figure data-capture="<domaine>/<slug>">. Les captureurs,
// eux, écrivent les PNG. Ce script fait la jonction — c'est le seul endroit qui
// la fasse, pour que la spécification et la page des brouillons ne divergent
// pas (demande du 2026-09-13 : « pkoi je ne voi rien dan les fichiets ? »).
//
// Deux sorties, même matière :
//   node scripts/assembler-chapitres.mjs spec        → docs/spec-fonctionnelle.html
//   node scripts/assembler-chapitres.mjs brouillons  → docs/brouillons.html
//
// La spécification porte en plus la table des écrans, le glossaire et l'index,
// construits depuis les `chapitre-<id>.json` rendus par les rédacteurs.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..')
const BROUILLONS = join(RACINE, 'docs', 'brouillons')
const CAPTURES = join(RACINE, 'docs', 'captures')

// L'ordre du sommaire, celui qu'elle a validé le 2026-09-12.
const ORDRE = [
  'produit', 'compte', 'onboarding', 'maison', 'traitement', 'poids', 'effets',
  'alimentation', 'pas', 'activite', 'sommeil', 'temps-pour-soi', 'metabolisme',
  'badges', 'ciel', 'insolites', 'rapport', 'modules', 'profil', 'partage',
  'non-implemente',
]

/** Tous les PNG, indexés deux fois : par leur nom, et par leur nom tirets
 *  retirés. Les rédacteurs rendent l'apostrophe par un tiret (« d-un »), les
 *  captureurs la suppriment (« dun ») : le second index rattrape cet écart
 *  sans qu'on retouche les fichiers. */
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

function echapper(texte) {
  return texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Le texte d'un fragment HTML, balises retirées. Les entités sont laissées
 *  telles quelles : elles sont déjà du HTML valide, les ré-échapper afficherait
 *  « Configuration &amp;amp; Plus » (vu au rendu le 2026-09-13). Ce que rend
 *  cette fonction se réinjecte donc SANS echapper(). */
function sansBalises(html) {
  return html.replace(/<a\b[^>]*>.*?<\/a>/gs, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

/** Le titre d'un chapitre, sans son numéro : le sommaire est une <ol>, elle
 *  numérote déjà. */
function titreDu(fragment) {
  const h2 = fragment.match(/<h2>(.*?)<\/h2>/s)
  return h2 ? sansBalises(h2[1]).replace(/^\d+\.\s*/, '') : null
}

/** Les écrans d'un chapitre : chaque <h3> avec son ancre, et la figure qui le
 *  suit s'il y en a une. C'est ce qui fait la table des écrans. */
function ecransDu(fragment) {
  const ecrans = []
  const re = /<h3 id="([^"]+)">(.*?)<\/h3>([\s\S]*?)(?=<h3 |<\/section>)/g
  let m
  while ((m = re.exec(fragment)) !== null) {
    const figure = m[3].match(/data-capture="([^"]+)"/)
    ecrans.push({ ancre: m[1], nom: sansBalises(m[2]), capture: figure ? figure[1] : null })
  }
  return ecrans
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

/** Glossaire et index : réunis de tous les chapitres, doublons fondus, rangés
 *  par ordre alphabétique français. */
function reunir(cotes) {
  const glossaire = new Map()
  const index = new Map()
  for (const c of cotes) {
    for (const e of c.glossaire ?? []) {
      if (!e?.terme) continue
      if (!glossaire.has(e.terme)) glossaire.set(e.terme, e.definition ?? '')
    }
    for (const e of c.index ?? []) {
      if (!e?.terme || !e?.ancre) continue
      // Certains rédacteurs rendent l'ancre déjà préfixée d'un dièse : sans ce
      // nettoyage on écrit href="##…", et le lien ne mène nulle part.
      const ancre = e.ancre.replace(/^#+/, '')
      if (!ancre) continue
      if (!index.has(e.terme)) index.set(e.terme, new Set())
      index.get(e.terme).add(ancre)
    }
  }
  const fr = new Intl.Collator('fr', { sensitivity: 'base' })
  return {
    glossaire: [...glossaire].sort((a, b) => fr.compare(a[0], b[0])),
    index: [...index].sort((a, b) => fr.compare(a[0], b[0])),
  }
}

const mode = process.argv[2] ?? 'brouillons'
if (mode !== 'spec' && mode !== 'brouillons') {
  console.error('Emploi : node scripts/assembler-chapitres.mjs spec|brouillons')
  process.exit(1)
}

const index = indexerCaptures()
const ids = ORDRE.filter((id) => existsSync(join(BROUILLONS, `chapitre-${id}.html`)))

const manquantes = []
const rapprochees = []
const chapitres = ids.map((id) => {
  const brut = readFileSync(join(BROUILLONS, `chapitre-${id}.html`), 'utf8')
  const cote = JSON.parse(readFileSync(join(BROUILLONS, `chapitre-${id}.json`), 'utf8'))
  return {
    id,
    titre: titreDu(brut) ?? id,
    ecrans: ecransDu(brut),
    cote,
    html: poserLesImages(brut, index, manquantes, rapprochees),
  }
})

const figures = chapitres.reduce((n, c) => n + (c.html.match(/data-capture=/g) ?? []).length, 0)
const absentes = [...new Set(manquantes)].sort()
const rapprochementsFaits = [...new Map(rapprochees).entries()].sort()

const LIRE = readFileSync(join(BROUILLONS, 'section-lire.html'), 'utf8').trim()

const etatFigures = `<h2 id="figures">État des figures <a class="retour" href="#sommaire">↑ sommaire</a></h2>
<p>${figures} figures appelées par les chapitres, ${absentes.length} sans capture${rapprochementsFaits.length ? `, ${rapprochementsFaits.length} retrouvées à un tiret près` : ''}.</p>
${absentes.length ? `<h3 id="figures-absentes">Sans capture</h3>
<p class="note">Ces écrans sont décrits dans les chapitres mais n'ont pas d'image. Il faudra les capturer, ou retirer la figure.</p>
<ul>
${absentes.map((c) => `<li><code>${echapper(c)}</code></li>`).join('\n')}
</ul>` : ''}
${rapprochementsFaits.length ? `<h3 id="figures-rapprochees">Retrouvées à un tiret près</h3>
<p class="note">Le chapitre écrit le premier nom, le fichier porte le second. C'est le chapitre qu'il faudra corriger, pas le fichier.</p>
<ul>
${rapprochementsFaits.map(([a, b]) => `<li><code>${echapper(a)}</code> → <code>${echapper(b)}</code></li>`).join('\n')}
</ul>` : ''}`

let sortie, titre, bandeau, sousTitre, etat, corps, sommaire
let annexes = ''
let debutSommaire = ''

if (mode === 'spec') {
  const { glossaire, index: idx } = reunir(chapitres.map((c) => c.cote))
  const totalEcrans = chapitres.reduce((n, c) => n + c.ecrans.length, 0)

  sortie = 'spec-fonctionnelle.html'
  titre = 'Spécification fonctionnelle'
  sousTitre = "Chaque écran qui présente des données : ce qu'il montre, ce qu'on y fait, illustré."
  bandeau = `<a href="index.html">Sommaire général</a>
  <a href="spec-fonctionnelle.html" aria-current="page">Fonctionnelle</a>
  <a href="spec-technique.html">Technique</a>
  <a href="spec-abstraite.html">Abstraite</a>
  <a href="inspirations.html">Inspirations</a>`
  etat = `<p class="etat">Les ${chapitres.length} chapitres sont écrits depuis l'inventaire de la V1 et son code, puis réfutés un à un contre le code par un vérificateur, puis corrigés d'après ses réfutations. Ce que le code ne fondait pas en a été retiré et rangé dans <a href="inspirations.html">Inspirations</a>. Les renvois « → technique » pointent dans le vide tant que la <a href="spec-technique.html">spécification technique</a> n'existe pas. ${absentes.length} figures n'ont pas encore de capture : elles sont nommées en <a href="#figures">état des figures</a>.</p>`

  // « Lire ce document » porte le numéro 0, comme son titre le dit : la liste
  // démarre donc à zéro. Les trois annexes n'ont pas de numéro de chapitre,
  // elles sortent de la liste numérotée.
  sommaire = [
    '<li><a href="#lire">Lire ce document</a></li>',
    ...chapitres.map((c) => `<li><a href="#${c.id}">${c.titre}</a></li>`),
  ].join('\n')

  const tableEcrans = `<h2 id="ecrans">Table des écrans <a class="retour" href="#sommaire">↑ sommaire</a></h2>
<p>${totalEcrans} écrans décrits. Une puce grise signale un écran décrit sans capture.</p>
${chapitres.filter((c) => c.ecrans.length).map((c) => `<h3 id="ecrans-${c.id}">${c.titre}</h3>
<ul class="table-ecrans">
${c.ecrans.map((e) => `<li${e.capture && !index.exact.has(e.capture) && !index.souple.has(e.capture.replaceAll('-', '')) || !e.capture ? ' class="sans-image"' : ''}><a href="#${e.ancre}">${e.nom}</a></li>`).join('\n')}
</ul>`).join('\n')}`

  const pageGlossaire = `<h2 id="glossaire">Glossaire <a class="retour" href="#sommaire">↑ sommaire</a></h2>
<p>${glossaire.length} termes.</p>
<dl class="index">
${glossaire.map(([t, d]) => `<dt>${echapper(t)}</dt><dd>${echapper(d)}</dd>`).join('\n')}
</dl>`

  // Une entrée d'index qui pointe vers une ancre absente du document est un
  // lien mort : on la résout contre les ancres réellement présentes (au tiret
  // près), et ce qui ne se résout pas est retiré plutôt que publié cassé.
  const ancresPresentes = new Set()
  for (const c of chapitres) {
    for (const m of c.html.matchAll(/id="([^"]+)"/g)) ancresPresentes.add(m[1])
  }
  const ancresNues = new Map([...ancresPresentes].map((a) => [a.replaceAll('-', ''), a]))
  let ancresRetirees = 0
  const idxResolu = idx
    .map(([terme, ancres]) => {
      const bonnes = [...ancres]
        .map((a) => ancresPresentes.has(a) ? a : ancresNues.get(a.replaceAll('-', '')))
        .filter(Boolean)
      ancresRetirees += ancres.size - bonnes.length
      return [terme, [...new Set(bonnes)]]
    })
    .filter(([, ancres]) => ancres.length)

  const pageIndex = `<h2 id="index">Index <a class="retour" href="#sommaire">↑ sommaire</a></h2>
<p>${idxResolu.length} entrées${ancresRetirees ? `, ${ancresRetirees} renvois retirés faute d'ancre` : ''}.</p>
<dl class="index">
${idxResolu.map(([t, ancres]) => `<dt>${echapper(t)}</dt><dd>${ancres.map((a) => `<a href="#${a}">${a.split('-')[0]}</a>`).join(', ')}</dd>`).join('\n')}
</dl>`

  corps = [LIRE, ...chapitres.map((c) => c.html), tableEcrans, pageGlossaire, pageIndex, etatFigures].join('\n\n')
  annexes = '<ul class="annexes">\n<li><a href="#ecrans">Table des écrans</a></li>\n<li><a href="#glossaire">Glossaire</a></li>\n<li><a href="#index">Index</a></li>\n<li><a href="#figures">État des figures</a></li>\n</ul>'
  debutSommaire = ' start="0"'
} else {
  sortie = 'brouillons.html'
  titre = 'Les chapitres écrits — brouillons'
  sousTitre = 'La même matière que la spécification, sans sa table des écrans ni son glossaire.'
  bandeau = `<a href="index.html">Sommaire général</a>
  <a href="spec-fonctionnelle.html">Fonctionnelle</a>
  <a href="brouillons.html" aria-current="page">Brouillons</a>`
  etat = `<p class="etat">Cette page sert à relire les chapitres pendant qu'on y travaille. Le document publié, avec sa table des écrans, son glossaire et son index, est la <a href="spec-fonctionnelle.html">spécification fonctionnelle</a>.</p>`
  sommaire = chapitres.map((c) => `<li><a href="#${c.id}">${c.titre}</a></li>`).join('\n')
  corps = [...chapitres.map((c) => c.html), etatFigures].join('\n\n')
}

const page = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GLP1LOW — ${echapper(titre)}</title>
<link rel="stylesheet" href="style.css">
<style>
.figure-absente { border: 1px dashed var(--filet); border-radius: 10px; padding: 10px 14px; color: var(--encre-douce); font-size: 14px; margin: 0; }
.table-ecrans { columns: 2; column-gap: 32px; font-size: 15px; }
.table-ecrans li { break-inside: avoid; }
.table-ecrans li.sans-image { color: var(--encre-douce); }
.annexes { list-style: none; margin: 12px 0 0; padding: 12px 0 0; border-top: 1px solid var(--filet); columns: 2; column-gap: 32px; }
.annexes li { break-inside: avoid; margin: 2px 0; }
</style>
</head>
<body>
<main>
<div class="bandeau">
  ${bandeau}
</div>

<h1>${echapper(titre)}</h1>
<p class="sous-titre">${sousTitre}</p>

${etat}

<nav class="sommaire" id="sommaire">
<h2>Sommaire</h2>
<ol${debutSommaire}>
${sommaire}
</ol>
${annexes}
</nav>

${corps}
</main>
</body>
</html>
`

writeFileSync(join(RACINE, 'docs', sortie), page)
console.log(`${sortie} : ${chapitres.length} chapitres, ${figures} figures — ${absentes.length} absentes, ${rapprochementsFaits.length} rapprochées`)
