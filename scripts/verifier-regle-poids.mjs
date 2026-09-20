/**
 * LE SCÉNARIO DE LA RÈGLE CRANTÉE (2026-09-21, son enregistrement : le
 * chiffre et la graduation se contredisaient et s'échangeaient à chaque
 * rendu) : ouvrir le bloc du poids, glisser la graduation — gestes lents,
 * lancers rapides, rafale de molette comme un trackpad —, cliquer la croix,
 * et vérifier À CHAQUE FOIS que le chiffre est celui du cran sous la tige.
 *
 * Avant : forcer l'ouverture du bloc (`sed` sur `blocPoids` dans
 * `Compte.tsx` et sur la page dans `App.tsx`) ; après : restaurer.
 *
 *   node scripts/verifier-regle-poids.mjs
 */
import { ouvrirChrome } from './piloter-chrome.mjs';

const c = await ouvrirChrome('http://localhost:3002/');
const etat = () =>
  c.lire(`(() => {
    const d = document.querySelector('.graduation__defilement');
    if (!d) return null;
    const n = document.querySelector('.poids__cases').textContent.replace(/^0+/, '');
    const attendu = ((d.scrollLeft / 20) / 10 + 1).toFixed(1).replace('.', ',');
    return { scrollLeft: d.scrollLeft, chiffre: n, attendu, ok: n === attendu };
  })()`);
let fautes = 0;
const dire = async (nom) => {
  const e = await etat();
  if (e && !e.ok) fautes += 1;
  console.log(nom.padEnd(22), e);
};
await dire('ouverture');
const { x, y } = await c.centre('.graduation__defilement');
for (const [xDistance, speed] of [[-400, 2000], [-900, 6000], [600, 8000], [-1500, 9000]]) {
  await c.send('Input.synthesizeScrollGesture', { x, y, xDistance, yDistance: 0, speed, gestureSourceType: 'touch' });
  await c.sommeil(300);
  await dire(`lancer ${xDistance}`);
  await c.sommeil(1200);
  await dire('  repos');
}
for (let i = 0; i < 40; i++) {
  await c.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: i % 7 === 0 ? -300 : 90, deltaY: 0 });
  await c.sommeil(16);
}
await c.sommeil(300);
await dire('rafale');
await c.sommeil(1200);
await dire('  repos');
await c.clic('.bloc__fermer');
await c.sommeil(600);
await dire('après la croix');
await c.fermer();
console.log(fautes === 0 ? 'AUCUNE CONTRADICTION entre le chiffre et la graduation.' : `${fautes} CONTRADICTION(S).`);
process.exit(fautes === 0 ? 0 : 1);
