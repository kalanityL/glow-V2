// Engendre docs/inspirations.html : tout ce qui a été pensé sans être décidé.
//
// Deux matières, deux origines :
//  - les ARBITRAGES : des choix que Claude a pris seul en écrivant la V1, relevés
//    par les neuf lecteurs de l'inventaire. Ils attendent un oui ou un non.
//  - les INVENTIONS : des phrases que les rédacteurs de la spécification ont eu
//    envie d'écrire sans pouvoir les fonder sur le code, plus tout ce que les
//    vérificateurs ont fait retirer des chapitres. Elles disent ce que le
//    produit pourrait être, pas ce qu'il est.
//
// Emploi : node scripts/assembler-inspirations.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..')
const BROUILLONS = join(RACINE, 'docs', 'brouillons')

const ORDRE = [
  'produit', 'compte', 'onboarding', 'maison', 'traitement', 'poids', 'effets',
  'alimentation', 'pas', 'activite', 'sommeil', 'temps-pour-soi', 'metabolisme',
  'badges', 'ciel', 'insolites', 'rapport', 'modules', 'profil', 'partage',
  'non-implemente',
]

// Les neuf lecteurs de l'inventaire ont chacun rendu un pavé de texte pour dire
// leur domaine. On leur donne ici un nom court, dans l'ordre où ils sont rangés.
const DOMAINES = [
  'Profil, compte, avatar, modules et rappels',
  'Le traitement',
  'Le poids',
  "L'alimentation",
  'Les effets secondaires',
  'Pas, activité physique, sommeil, temps pour soi',
  'La Maison',
  'Métabolisme, rapport médical, badges, Mon Ciel, équivalences insolites',
  'Transversal : modèle de données, stockage, dates, navigation',
]

function echapper(texte) {
  return String(texte).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Les arbitrages ont été relevés depuis des commentaires du code, écrits en
 *  markdown : sans cette conversion la page affiche des astérisques et des
 *  accents graves bruts (vu au rendu le 2026-09-13). */
function markdown(texte) {
  return echapper(texte)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

function slug(texte) {
  return String(texte).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
}

// ---------- les arbitrages ----------
const brut = JSON.parse(readFileSync(join(BROUILLONS, 'inventaire-v1.json'), 'utf8'))
const inventaires = brut.result?.inventaires ?? brut.inventaires
const arbitrages = inventaires.map((inv, i) => ({
  nom: DOMAINES[i] ?? `Domaine ${i}`,
  id: `arb-${slug(DOMAINES[i] ?? i)}`,
  points: (inv.arbitrages_de_claude ?? []).filter((a) => a?.sujet),
})).filter((d) => d.points.length)

// ---------- les inventions ----------
const chapitres = ORDRE
  .filter((id) => existsSync(join(BROUILLONS, `chapitre-${id}.json`)))
  .map((id) => {
    const cote = JSON.parse(readFileSync(join(BROUILLONS, `chapitre-${id}.json`), 'utf8'))
    const html = readFileSync(join(BROUILLONS, `chapitre-${id}.html`), 'utf8')
    const titre = (html.match(/<h2>(.*?)<\/h2>/s)?.[1] ?? id)
      .replace(/<a\b[^>]*>.*?<\/a>/gs, '').replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ').trim()
      .replace(/^\d+\.\s*/, '')   // la liste du sommaire numérote déjà
    // Les inventions arrivent en vrac ; on les range par catégorie pour qu'un
    // même sujet se lise d'un bloc.
    const parCategorie = new Map()
    for (const inv of cote.inventions ?? []) {
      if (!inv?.texte) continue
      const cat = inv.categorie || 'Divers'
      if (!parCategorie.has(cat)) parCategorie.set(cat, [])
      parCategorie.get(cat).push(inv)
    }
    return { id, titre, categories: [...parCategorie].sort((a, b) => a[0].localeCompare(b[0], 'fr')) }
  })
  .filter((c) => c.categories.length)

const totalArbitrages = arbitrages.reduce((n, d) => n + d.points.length, 0)
const totalInventions = chapitres.reduce((n, c) => n + c.categories.reduce((m, [, l]) => m + l.length, 0), 0)

const sectionArbitrages = `<section id="arbitrages">
<h2>1. Les arbitrages non validés <a class="retour" href="#sommaire">↑ sommaire</a></h2>
<p>${totalArbitrages} choix pris par Claude en écrivant la V1, sans décision de l'utilisatrice. Chacun est signalé dans le code par un commentaire, et repris ici pour être confirmé ou renversé. Tant qu'un arbitrage n'est pas tranché, ce qu'il décide reste en place : ce document ne demande pas de tout rouvrir, il dit ce qui n'a jamais été choisi.</p>
${arbitrages.map((d) => `<h3 id="${d.id}">${echapper(d.nom)}</h3>
<p class="note">${d.points.length} arbitrages.</p>
<table>
<tr><th>Sujet</th><th>Ce qui a été décidé sans toi</th><th>Où</th></tr>
${d.points.map((a) => `<tr><td>${echapper(a.sujet)}</td><td>${markdown(a.texte ?? '')}</td><td><code>${echapper(a.fichier ?? '')}</code></td></tr>`).join('\n')}
</table>`).join('\n')}
</section>`

const sectionInventions = `<section id="inventions">
<h2>2. Ce qui a été pensé sans pouvoir être fondé <a class="retour" href="#sommaire">↑ sommaire</a></h2>
<p>${totalInventions} phrases que les rédacteurs de la <a href="spec-fonctionnelle.html">spécification fonctionnelle</a> ont eu envie d'écrire, et qui n'ont pas résisté au code — soit qu'ils l'aient su en écrivant, soit qu'un vérificateur les ait fait retirer. Elles ne décrivent pas le produit. Elles disent ce qu'on a cru qu'il faisait, ou ce qu'on aurait aimé qu'il fasse : c'est la matière d'une prochaine version. Chacune porte son origine, c'est-à-dire pourquoi elle est venue et ce que le code dit à la place.</p>
${chapitres.map((c) => `<h3 id="inv-${c.id}">${echapper(c.titre)}</h3>
${c.categories.map(([cat, liste]) => `<h4>${echapper(cat)}</h4>
<dl class="inventions">
${liste.map((i) => `<dt>${markdown(i.texte)}</dt><dd>${i.fonctionnalite ? `<em>${echapper(i.fonctionnalite)}</em> — ` : ''}${markdown(i.origine ?? '')}</dd>`).join('\n')}
</dl>`).join('\n')}`).join('\n')}
</section>`

const page = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GLP1LOW — Inspirations</title>
<link rel="stylesheet" href="style.css">
<style>
dl.inventions dt { font-weight: 600; margin-top: 14px; }
dl.inventions dd { margin: 4px 0 0; color: var(--encre-douce); max-width: 72ch; }
table td:last-child { white-space: nowrap; }
</style>
</head>
<body>
<main>
<div class="bandeau">
  <a href="index.html">Sommaire général</a>
  <a href="spec-fonctionnelle.html">Fonctionnelle</a>
  <a href="spec-technique.html">Technique</a>
  <a href="spec-abstraite.html">Abstraite</a>
  <a href="inspirations.html" aria-current="page">Inspirations</a>
</div>

<h1>Inspirations</h1>
<p class="sous-titre">Tout ce qui a été pensé sans être décidé : les choix pris sans toi, et les idées que le code ne fonde pas.</p>

<p class="etat">Ce document ne décrit pas le produit — c'est le travail des trois autres. Il rassemble ce qui attend une décision. Rien n'y est une recommandation : chaque ligne dit ce qui a été supposé, par qui, et ce que le code fait à la place.</p>

<nav class="sommaire" id="sommaire">
<h2>Sommaire</h2>
<ol>
<li><a href="#arbitrages">Les arbitrages non validés</a>
<ol>
${arbitrages.map((d) => `<li><a href="#${d.id}">${echapper(d.nom)}</a></li>`).join('\n')}
</ol></li>
<li><a href="#inventions">Ce qui a été pensé sans pouvoir être fondé</a>
<ol>
${chapitres.map((c) => `<li><a href="#inv-${c.id}">${echapper(c.titre)}</a></li>`).join('\n')}
</ol></li>
</ol>
</nav>

${sectionArbitrages}

${sectionInventions}
</main>
</body>
</html>
`

writeFileSync(join(RACINE, 'docs', 'inspirations.html'), page)
console.log(`inspirations.html : ${totalArbitrages} arbitrages sur ${arbitrages.length} domaines, ${totalInventions} inventions sur ${chapitres.length} chapitres`)
