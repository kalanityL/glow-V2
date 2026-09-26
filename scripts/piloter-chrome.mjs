/**
 * PILOTER CHROME SANS FENÊTRE PAR LE PROTOCOLE DEVTOOLS (2026-09-21) : ce que
 * l'extension Chrome, jamais connectée, ne permet pas — VÉRIFIER LES GESTES.
 * Aucune dépendance : Node 22+ (WebSocket et fetch intégrés) et le Chrome de
 * la machine. À utiliser depuis un scénario :
 *
 *   import { ouvrirChrome } from './piloter-chrome.mjs';
 *   const c = await ouvrirChrome('http://localhost:3002/');
 *   await c.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 120, deltaY: 0 });
 *   console.log(await c.lire(`document.querySelector('.poids__cases').textContent`));
 *   await c.fermer();
 *
 * L'état de la page se force par `sed` sur les `useState` (et se RESTAURE par
 * `sed` inverse), comme pour les captures. Le scénario de la règle crantée
 * est dans `verifier-regle-poids.mjs`.
 */
import { spawn } from 'node:child_process';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sommeil = (ms) => new Promise((r) => setTimeout(r, ms));

export async function ouvrirChrome(url, { port = 9333, largeur = 520, hauteur = 760, attente = 4000 } = {}) {
  const profil = `/tmp/piloter-chrome-${port}`;
  const chrome = spawn(
    CHROME,
    ['--headless=new', `--remote-debugging-port=${port}`, `--window-size=${largeur},${hauteur}`, `--user-data-dir=${profil}`, 'about:blank'],
    { stdio: 'ignore' },
  );
  /* ATTENDRE QUE LE PORT RÉPONDE, et non un délai fixe (2026-09-26) : sur une
     machine chargée, Chrome met plus de 1,5 s à ouvrir son port et le
     scénario tombait sur un `ECONNREFUSED`. Vingt essais d'une demi-seconde. */
  let cibles;
  for (let essai = 0; essai < 20; essai += 1) {
    await sommeil(500);
    try {
      cibles = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      break;
    } catch {
      /* Pas encore ouvert : on repasse. */
    }
  }
  if (!cibles) throw new Error(`Chrome n'a pas ouvert son port ${port}`);
  const ws = new WebSocket(cibles.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const enAttente = new Map();
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && enAttente.has(d.id)) {
      enAttente.get(d.id)(d.result ?? d.error);
      enAttente.delete(d.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((r) => {
      enAttente.set(++id, r);
      ws.send(JSON.stringify({ id, method, params }));
    });
  const lire = async (expression) =>
    (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value;
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url });
  await sommeil(attente);
  /** Le centre d'un élément, pour y viser un geste. */
  const centre = (selecteur) =>
    lire(`(() => { const r = document.querySelector(${JSON.stringify(selecteur)}).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
  /** Clique au centre de l'élément que rend une expression JavaScript. */
  const clicSur = async (expression) => {
    const { x, y } = await lire(`(() => { const r = (${expression}).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  };
  const clic = async (selecteur) => {
    const { x, y } = await centre(selecteur);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  };
  const fermer = async () => {
    ws.close();
    chrome.kill();
    await sommeil(300);
    spawn('rm', ['-rf', profil]);
  };
  return { send, lire, centre, clic, clicSur, sommeil, fermer };
}
