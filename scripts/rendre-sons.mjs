/**
 * LES SONS DE L'APPLICATION, RENDUS EN FICHIERS (2026-09-21 au soir, après
 * la simulation des vingt clics : « son bulle pour le poids / son
 * plastique : ajoute le pour qd on tourne l'heure avec le cadran de
 * l'horloge / garde tous les autres sons disponibles on s'en servira dans
 * les parametres ») : chaque son est SYNTHÉTISÉ ici — la même écriture Web
 * Audio que la simulation, mot pour mot —, rendu hors ligne par le Chrome
 * de la machine (`OfflineAudioContext`, sans fenêtre, par DevTools), et
 * ÉCRIT EN `.wav` dans `src/assets/sons/`, avec le catalogue TypeScript
 * `src/app/sons-catalogue.ts` qui les importe. L'application ne synthétise
 * rien : elle joue des FICHIERS embarqués (GUIDELINES), par le même verbe
 * `jouerClics` — en natif, le lecteur du téléphone.
 *
 * RENDU UNE FOIS, HORS DU NAVIGATEUR DE LA PERSONNE, relisible et versionné.
 * Se relance à chaque son ajouté ou retouché :
 *
 *     node scripts/rendre-sons.mjs
 *
 * Les VARIANTES : un son de pur sinus est toujours le même, un seul fichier
 * suffit ; un son de souffle (bruit filtré) est tiré au sort à chaque
 * rendu, quatre fichiers joués à tour de rôle évitent la mitraillette ; les
 * gammes ont une note par morceau (huit), « Deux notes » deux, « Monte avec
 * le poids » dix (un par dixième de kilo). La roue de la fortune, elle, est
 * son enregistrement découpé (`cran-1..8.wav`, 2026-09-21 au matin) : elle
 * reste au catalogue, sans être rendue ici — comme la petite cloche de la
 * confirmation (`petite-cloche-1.wav`, rendue par `rendre-petite-cloche.sh`).
 *
 * Chaque fichier : mono, 44 100 Hz, 16 bits, coupé au silence, normalisé à
 * -1 dB de crête (0,9) — comme les morceaux de la roue l'avaient été.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ouvrirChrome } from './piloter-chrome.mjs';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER_SONS = join(RACINE, 'src', 'assets', 'sons');
const CATALOGUE = join(RACINE, 'src', 'app', 'sons-catalogue.ts');

/* ── LES SONS — l'écriture de la simulation, telle quelle ──────────────── */

/* Le code Web Audio commun, évalué dans la page : `ton` (une sinusoïde ou
   autre forme à enveloppe percussive), `bruit` (un souffle blanc filtré en
   bande), `NOTE` (numéro MIDI → Hz), `PENTA` (la gamme pentatonique de do7
   à mi8). */
const COMMUN = `
const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);
const PENTA = [96, 98, 100, 103, 105, 108, 110, 112];
function ton(ctx, sortie, t, freq, duree, gain, forme = 'sine', glisseVers = null) {
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type = forme; o.frequency.setValueAtTime(freq, t);
  if (glisseVers) o.frequency.exponentialRampToValueAtTime(glisseVers, t + duree);
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  o.connect(g).connect(sortie); o.start(t); o.stop(t + duree + 0.01);
}
function bruit(ctx, sortie, t, freq, q, duree, gain, type = 'bandpass') {
  const tampon = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
  const d = tampon.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = ctx.createBufferSource(); s.buffer = tampon;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  s.connect(f).connect(g).connect(sortie); s.start(t); s.stop(t + duree + 0.01);
}`;

/** Chaque son : son identifiant (le nom du fichier), sa famille et sa note
    (en commentaire du catalogue), ses variantes, et sa fonction
    `(ctx, out, t, tour, poids)` — la même que dans la simulation. */
export const SONS = [
  /* Métal */
  { id: 'tic-de-montre', nom: 'Tic de montre', famille: 'Métal', note: '4 200 Hz', variantes: 4,
    joue: `(ctx, out, t) => { bruit(ctx, out, t, 4200, 14, 0.010, 0.9); ton(ctx, out, t, 3300, 0.008, 0.25); }` },
  { id: 'cliquet', nom: 'Cliquet', famille: 'Métal', note: '2 500 Hz', variantes: 4,
    joue: `(ctx, out, t) => { bruit(ctx, out, t, 2500, 6, 0.012, 1); ton(ctx, out, t, 1900, 0.006, 0.3, 'square'); }` },
  { id: 'piece-de-monnaie', nom: 'Pièce de monnaie', famille: 'Métal', note: '2 900 · 4 300 · 6 100 Hz', variantes: 1,
    joue: `(ctx, out, t) => { ton(ctx, out, t, 2900, 0.04, 0.35); ton(ctx, out, t, 4300, 0.03, 0.25); ton(ctx, out, t, 6100, 0.02, 0.15); }` },
  { id: 'aiguille', nom: 'Aiguille', famille: 'Métal', note: '5 000 · 7 300 Hz', variantes: 1,
    joue: `(ctx, out, t) => { ton(ctx, out, t, 5000, 0.015, 0.35); ton(ctx, out, t, 7300, 0.012, 0.2); }` },
  { id: 'ressort', nom: 'Ressort', famille: 'Métal', note: '1 800 → 1 200 Hz', variantes: 1,
    joue: `(ctx, out, t) => { ton(ctx, out, t, 1800, 0.03, 0.4, 'triangle', 1200); }` },
  { id: 'clochette', nom: 'Clochette', famille: 'Métal', note: 'la7 (3 520 Hz)', variantes: 1,
    joue: `(ctx, out, t) => { ton(ctx, out, t, 3520, 0.06, 0.3); ton(ctx, out, t, 5280, 0.045, 0.18); ton(ctx, out, t, 8800, 0.03, 0.1); }` },
  { id: 'aimant', nom: 'Aimant', famille: 'Métal', note: '900 Hz', variantes: 4,
    joue: `(ctx, out, t) => { ton(ctx, out, t, 900, 0.01, 0.5, 'square'); bruit(ctx, out, t, 3000, 2, 0.008, 0.5, 'highpass'); }` },
  /* Verre */
  { id: 'ting', nom: 'Ting', famille: 'Verre', note: 'do8 (4 186 Hz)', variantes: 1,
    joue: `(ctx, out, t) => { ton(ctx, out, t, NOTE(108), 0.05, 0.35); }` },
  { id: 'clink', nom: 'Clink', famille: 'Verre', note: 'mi7 (2 637 Hz) + 6 200 Hz', variantes: 1,
    joue: `(ctx, out, t) => { ton(ctx, out, t, NOTE(100), 0.035, 0.35); ton(ctx, out, t, 6200, 0.02, 0.15); }` },
  { id: 'goutte', nom: 'Goutte', famille: 'Verre', note: '2 500 → 3 500 Hz', variantes: 1,
    joue: `(ctx, out, t) => { ton(ctx, out, t, 2500, 0.02, 0.4, 'sine', 3500); }` },
  { id: 'cristal', nom: 'Cristal', famille: 'Verre', note: 'mi8 (5 274 Hz) + 7 900 Hz', variantes: 1,
    joue: `(ctx, out, t) => { ton(ctx, out, t, NOTE(112), 0.03, 0.3); ton(ctx, out, t, 7900, 0.02, 0.12); }` },
  { id: 'carillon-de-verre', nom: 'Carillon de verre', famille: 'Verre', note: 'sol7 (3 136 Hz) + 4 700 Hz', variantes: 1,
    joue: `(ctx, out, t) => { ton(ctx, out, t, NOTE(103), 0.045, 0.32); ton(ctx, out, t, 4700, 0.03, 0.14); }` },
  { id: 'bulle', nom: 'Bulle', famille: 'Verre', note: '1 500 → 2 200 Hz', variantes: 1,
    joue: `(ctx, out, t) => { ton(ctx, out, t, 1500, 0.025, 0.4, 'sine', 2200); }` },
  /* Bois et plastique */
  { id: 'tac-de-bois', nom: 'Tac de bois', famille: 'Bois et plastique', note: '1 100 Hz', variantes: 4,
    joue: `(ctx, out, t) => { bruit(ctx, out, t, 1100, 3, 0.010, 1); }` },
  { id: 'touche-de-clavier', nom: 'Touche de clavier', famille: 'Bois et plastique', note: '400 Hz', variantes: 4,
    joue: `(ctx, out, t) => { bruit(ctx, out, t, 3000, 0.7, 0.006, 0.8, 'lowpass'); ton(ctx, out, t, 400, 0.012, 0.25, 'triangle'); }` },
  { id: 'plastique', nom: 'Plastique', famille: 'Bois et plastique', note: '1 800 Hz', variantes: 4,
    joue: `(ctx, out, t) => { bruit(ctx, out, t, 1800, 4, 0.008, 0.9); }` },
  /* La note change d'un morceau à l'autre */
  { id: 'gamme-qui-monte', nom: 'Gamme qui monte', famille: 'La note change', note: 'pentatonique do7 → mi8', variantes: 8,
    joue: `(ctx, out, t, tour) => { ton(ctx, out, t, NOTE(PENTA[tour]), 0.025, 0.35); }` },
  { id: 'gamme-qui-descend', nom: 'Gamme qui descend', famille: 'La note change', note: 'pentatonique mi8 → do7', variantes: 8,
    joue: `(ctx, out, t, tour) => { ton(ctx, out, t, NOTE(PENTA[7 - tour]), 0.025, 0.35); }` },
  { id: 'deux-notes', nom: 'Deux notes', famille: 'La note change', note: 'la7 / ré8 (3 520 / 4 699 Hz)', variantes: 2,
    joue: `(ctx, out, t, tour) => { ton(ctx, out, t, NOTE(tour % 2 ? 110 : 105), 0.02, 0.35); }` },
  { id: 'monte-avec-le-poids', nom: 'Monte avec le poids', famille: 'La note change', note: 'do7 à do8 sur chaque kilo, un morceau par dixième', variantes: 10,
    joue: `(ctx, out, t, tour) => { ton(ctx, out, t, NOTE(96) * Math.pow(2, tour / 10), 0.025, 0.35); }` },
];

/* ── LE RENDU, dans la page ──────────────────────────────────────────────── */

/* Rend un son en `.wav` (base64) : contexte hors ligne de 120 ms, coupé au
   silence (sous 1/1000 de crête), normalisé à 0,9. */
const RENDRE = `
async (joue, tour) => {
  const ctx = new OfflineAudioContext(1, Math.ceil(44100 * 0.12), 44100);
  const out = ctx.createGain(); out.gain.value = 1; out.connect(ctx.destination);
  joue(ctx, out, 0, tour, 95);
  const tampon = await ctx.startRendering();
  const d = tampon.getChannelData(0);
  let crete = 0; for (const v of d) crete = Math.max(crete, Math.abs(v));
  let fin = d.length; while (fin > 1 && Math.abs(d[fin - 1]) < crete / 1000) fin--;
  fin = Math.min(d.length, fin + 44);
  const gain = crete > 0 ? 0.9 / crete : 1;
  const n = fin, octets = new ArrayBuffer(44 + n * 2), vue = new DataView(octets);
  const ecrire = (o, s) => { for (let i = 0; i < s.length; i++) vue.setUint8(o + i, s.charCodeAt(i)); };
  ecrire(0, 'RIFF'); vue.setUint32(4, 36 + n * 2, true); ecrire(8, 'WAVE'); ecrire(12, 'fmt ');
  vue.setUint32(16, 16, true); vue.setUint16(20, 1, true); vue.setUint16(22, 1, true);
  vue.setUint32(24, 44100, true); vue.setUint32(28, 44100 * 2, true); vue.setUint16(32, 2, true); vue.setUint16(34, 16, true);
  ecrire(36, 'data'); vue.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) vue.setInt16(44 + i * 2, Math.max(-1, Math.min(1, d[i] * gain)) * 32767, true);
  let s = ''; const u = new Uint8Array(octets); for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
  return { wav: btoa(s), ms: Math.round((n / 44100) * 1000) };
}`;

const c = await ouvrirChrome('about:blank', { port: 9343, attente: 500 });
await c.lire(`(() => { ${COMMUN}; window.__rendre = ${RENDRE}; window.__ton = ton; window.__bruit = bruit; window.__NOTE = NOTE; window.__PENTA = PENTA; return true; })()`);
mkdirSync(DOSSIER_SONS, { recursive: true });

const lignesImport = [];
const lignesCatalogue = [];
for (const son of SONS) {
  const noms = [];
  for (let v = 0; v < son.variantes; v++) {
    const { wav, ms } = await c.lire(
      `(async () => { const ton = window.__ton, bruit = window.__bruit, NOTE = window.__NOTE, PENTA = window.__PENTA; return window.__rendre(${son.joue}, ${v}); })()`,
    );
    const nom = `${son.id}-${v + 1}.wav`;
    writeFileSync(join(DOSSIER_SONS, nom), Buffer.from(wav, 'base64'));
    noms.push(nom);
    console.log(`${nom.padEnd(28)} ${String(ms).padStart(3)} ms`);
  }
  const variables = noms.map((_, i) => `${son.id.replace(/-([a-z])/g, (_, l) => l.toUpperCase())}${i + 1}`);
  noms.forEach((nom, i) => lignesImport.push(`import ${variables[i]} from '../assets/sons/${nom}';`));
  lignesCatalogue.push(`  /* ${son.nom} — ${son.famille}, ${son.note}. */\n  '${son.id}': [${variables.join(', ')}],`);
}
await c.fermer();

const roue = Array.from({ length: 8 }, (_, i) => `cran${i + 1}`);
const catalogue = `/* ENGENDRÉ PAR \`scripts/rendre-sons.mjs\` (2026-09-21) — NE PAS ÉDITER À LA MAIN :
   relancer le script. Les sons de l'application, des fichiers embarqués,
   chacun en un ou plusieurs morceaux joués à tour de rôle par
   \`jouerClics\`. Les noms des sons ne sont pas ici : ce sont des mots
   d'interface, qui iront dans le dictionnaire le jour de l'écran des
   effets sonores (son TODO). */
${roue.map((v, i) => `import ${v} from '../assets/sons/cran-${i + 1}.wav';`).join('\n')}
import petiteCloche1 from '../assets/sons/petite-cloche-1.wav';
${lignesImport.join('\n')}

export const SONS_IDS = ['roue', 'petite-cloche', ${SONS.map((s) => `'${s.id}'`).join(', ')}] as const;
export type SonId = (typeof SONS_IDS)[number];

export const SONS: Record<SonId, readonly string[]> = {
  /* Roue de la fortune — son enregistrement découpé (2026-09-21 au matin). */
  roue: [${roue.join(', ')}],
  /* Petite cloche — quatre notes d'une frappe enregistrée, rendues par `rendre-petite-cloche.sh` (2026-09-22). */
  'petite-cloche': [petiteCloche1],
${lignesCatalogue.join('\n')}
};
`;
writeFileSync(CATALOGUE, catalogue);
console.log(`\n${SONS.length} sons rendus, catalogue écrit : ${CATALOGUE}`);
