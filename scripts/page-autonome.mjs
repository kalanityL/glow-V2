// Fabrique une copie autonome d'une page de docs/ : la feuille de style est
// incrustée dans le fichier, qui n'a plus besoin de rien d'autre pour
// s'ouvrir. Sert à envoyer un document par courriel ou à le lire hors du
// dépôt (demande du 2026-09-13 : « donne moi ici une version telechargeable en
// un seul fichier »).
//
// Les pages qui portent des images ne deviennent PAS autonomes pour autant :
// leurs <img src="captures/…"> resteraient morts. Le script le dit et refuse,
// sauf si on passe --avec-images pour incruster aussi les PNG en base64 — ce
// qui donne un fichier énorme, à n'employer qu'en connaissance de cause.
//
// Emploi : node scripts/page-autonome.mjs <page.html> <sortie.html> [--avec-images]

import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = join(RACINE, 'docs')

const [page, sortie, ...options] = process.argv.slice(2)
if (!page || !sortie) {
  console.error('Emploi : node scripts/page-autonome.mjs <page.html> <sortie.html> [--avec-images]')
  process.exit(1)
}
const avecImages = options.includes('--avec-images')

const chemin = join(DOCS, page)
if (!existsSync(chemin)) {
  console.error(`${chemin} n'existe pas.`)
  process.exit(1)
}

let html = readFileSync(chemin, 'utf8')
const feuille = readFileSync(join(DOCS, 'style.css'), 'utf8')

// La feuille commune prend la place de son <link>, avant le <style> propre à la
// page : l'ordre compte, les règles de la page doivent pouvoir la surcharger.
const lien = /<link rel="stylesheet" href="style\.css">/
if (!lien.test(html)) {
  console.error('La page ne référence pas style.css : rien à incruster.')
  process.exit(1)
}
html = html.replace(lien, `<style>\n/* docs/style.css, incrustée pour rendre ce fichier autonome */\n${feuille.trim()}\n</style>`)

// Les liens vers les autres documents ne mènent nulle part dans un fichier
// isolé : on les neutralise plutôt que de laisser des liens morts.
const TYPES = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml' }
let images = 0
let manquantes = 0
if (avecImages) {
  html = html.replace(/src="(captures\/[^"]+)"/g, (tout, rel) => {
    const f = join(DOCS, rel)
    if (!existsSync(f)) { manquantes += 1; return tout }
    const ext = rel.split('.').pop().toLowerCase()
    images += 1
    return `src="data:${TYPES[ext] ?? 'application/octet-stream'};base64,${readFileSync(f).toString('base64')}"`
  })
} else {
  const restantes = html.match(/src="captures\//g)
  if (restantes) {
    console.error(`Cette page appelle ${restantes.length} images. Sans --avec-images le fichier ne serait pas autonome.`)
    process.exit(1)
  }
}

// Un fichier isolé n'a pas ses voisins : le bandeau de navigation devient une
// simple mention, et les renvois vers les autres documents perdent leur lien.
html = html.replace(/<div class="bandeau">[\s\S]*?<\/div>/, '<p class="note">Copie autonome, détachée du jeu des quatre documents. Les renvois vers les autres documents y sont inertes.</p>')
html = html.replace(/<a href="(spec-[a-z]+|inspirations|index|brouillons)\.html(#[^"]*)?">([\s\S]*?)<\/a>/g, '$3')

writeFileSync(sortie, html)
const ko = Math.round(statSync(sortie).size / 1024)
console.log(`${sortie} : ${ko} ko${avecImages ? `, ${images} images incrustées${manquantes ? `, ${manquantes} introuvables` : ''}` : ''}`)
