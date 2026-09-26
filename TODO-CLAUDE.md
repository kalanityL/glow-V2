# TODO — celui de Claude (V2)

Ce que **je** relève au fil du travail : arbitrages qui te reviennent, dettes,
points laissés ouverts, vérifications à faire à l'écran. Je l'alimente
moi-même ; ton fichier à toi est `TODO.md`.

**Ce fichier est le mien, je le gère comme je veux** (ta parole du 2026-08-15,
V1) : j'y ajoute et j'y coche sans demander. Je te signale ce qui compte plutôt
que de te faire lire le fichier. Le TODO de la V1 est importé tel quel dans
`TODO-CLAUDE-V1.md` ; ce qui en vaut encore est repris ci-dessous.

---

## NOTE DE REPRISE — CLEAR DU 2026-09-26 (l'activité physique, le gling, la vitre)

**Rien ne tourne, rien n'est à moitié fait.** Aucun agent en cours. TOUT
EST POUSSÉ (dixième push, 25 commits `5bf0af6..f1cc2fc` + le commit du
suivi, entrée écrite dans `SUIVI-PUSHS.md`), NON DÉPLOYÉ (pas demandé ;
en ligne, c'est encore le neuvième push, `index-BNkmTDcm.js`). La V1 est
poussée aussi (deux commits : deux effets secondaires, billard et bowling
au temps pour soi), non déployée. Pousser et déployer SEULEMENT sur son
ordre, ÉCRIRE L'ENTRÉE DE `SUIVI-PUSHS.md` AVANT le push.

**LA MACHINE MANQUE DE MÉMOIRE** : relancer `npm run dev -- --port 3002
--strictPort` quand la page est blanche (vérifier d'abord `curl
localhost:3002`, le port est souvent déjà pris par un serveur qui
tourne). Chrome se pilote par `scripts/piloter-chrome.mjs` (ports 9340+,
`attente: 5000` quand la machine est chargée) ; toujours `pkill -f
"remote-debugging-port=<port>"` après, JAMAIS un `pkill` de tous les
Chrome. Une tuile sous le pli se fait défiler avant le clic
(`scrollIntoView`). Le python avec numpy et Pillow pour les images :
`$(cat scratchpad/py-np.txt)` de la session — à recréer (`python3 -m venv`,
`pip install numpy pillow`).

**FAIT du 22 au 26 (tout dans GUIDELINES § 4) :**
- Le gling de la confirmation (« Petite cloche », `SON_DE_LA_CONFIRMATION`),
  le premier choix de la confirmation qui ramène d'où l'on vient, le
  tiroir du « + » en cartes, le menu du bas en vitre.
- L'ACTIVITÉ PHYSIQUE : `screens/PageActivite.tsx`, `domaine/activites.ts`
  (catégories, slug, intensités, durées, distances d'avance, escalier,
  règle des quinze séances, récents), `domaine/activites-catalogue.ts`
  ENGENDRÉ par `scripts/engendrer-activites.mjs` depuis
  `docs/pour-claude/compendium/arbre.json` (corriger le JSON, relancer),
  `domaine/recherche-activites.ts`, `components/CadranDistance.tsx` (la
  piste), `app/recents-activite.ts` (clé `glp1_v2_sports_recents`), les
  masques `src/assets/images/activites/` et `sports/` avec
  `themes/activites-icones.css` ENGENDRÉE par
  `scripts/engendrer-icones-activites.mjs` (déposer un masque, relancer).
  La ligne enregistrée est `SportLog` de la V1 (`sportLogs`).
- Trois artifacts de simulation : le gling
  (https://claude.ai/code/artifact/89ef81a0-0e85-4897-a862-f9aca9f0abe7),
  le Compendium
  (https://claude.ai/code/artifact/beeb8688-73a9-48a2-8506-998e00af6b85),
  les bruitages de la piste
  (https://claude.ai/code/artifact/0c8df719-55f1-4322-b7c1-03208ec8f56e) —
  elle n'a pas encore choisi un bruitage par sport ; le jour venu, les
  embarquer en fichiers comme le catalogue des clics
  (`scripts/rendre-sons.mjs`), joués à la cadence du sport tant que la
  boule bouge, en quatre variantes à tour de rôle.

**Ce qui n'existe pas encore (les écrans l'annoncent, éteint) :** Journal,
Analyse, Concentration sanguine, Évolution ; les cases du « + » autres
que Traitement, Balance, Sommeil, Activité physique ; les mensurations ;
la note et les calories d'une séance.

**À arbitrer, en tête de la section :** les marches et les étages de
l'escalier (pas de place dans la ligne de la V1).

**Non vérifié sur Android (à ses yeux) :** la vitre du menu, la piste et
ses gestes, les masques d'icônes (`mask-image`), les sons.

**Ce qui reste des documents (note du 15/09), toujours vrai :**

**Ce qui reste, à dépiler (petit, refermable, un commit par point) :**
- [ ] **Neuf contradictions internes dans l'abstraite**, relevées par l'agent
      de conversion, à trancher en OUVRANT LE CODE, pas en choisissant la
      version la plus jolie : sévérité 1–5 (ch. 6) contre 0–5 (ch. 3, qui dit
      l'autre périmée) ; plafond des pesées « aucun » ET « 1 » dans deux
      tableaux du ch. 5 ; heures de rappel arrondies (ch. 3, 9) ou non
      (ch. 5) ; base d'aliments 3 479 (ch. 1) contre 3 258 (ch. 2) ; marque
      de journée lue par 2 (ch. 2) ou 5 (ch. 10) calculs ; « sept
      conversions » (ch. 10) puis huit listées ; « trois grandeurs » (ch. 6)
      puis quatre ; « cinq endroits dérogent, un sixième » (ch. 10) ; « paliers
      de 4 000 kcal » (ch. 1) contre 4 000/8 000/14 000. Deux doutes plus
      faibles : « IMC ≥ 19 » (ch. 7) inexpliqué ; « sept » attributs booléens
      (ch. 2) contre six (ch. 7). Corriger les fragments `abstraite-*.html`,
      réassembler, RECONVERTIR le Markdown.
- [ ] **Trois agrégations absentes de l'abstraite** (elle l'a demandé, vu
      le 13/09) : la part de chaque activité (code :
      `src/versions/mixte/features/sport/deQuoiCestFait.calculs.ts` — queue
      repliée au-delà de quatre lignes, période réellement couverte), les
      apports par créneau de repas (`src/features/meal-charts/mealCharts.utils.ts`,
      créneaux de trois heures, huit par jour), la sévérité par moment de la
      journée (`SideEffectTrendChart.tsx`). À écrire dans
      `abstraite-derivations.html`, section par section, fondé sur le code.
- [ ] Le Markdown de la technique n'existe pas (même méthode que
      l'abstraite : un agent, fidélité intégrale, cinq contrôles chiffrés).
- [ ] Les inventions de la technique et de l'abstraite ne sont pas versées
      dans Inspirations (`assembler-inspirations.mjs` ne lit que
      `chapitre-*.json`).
- [ ] VOCABULAIRE.md : quatre gisements non balayés — `SUIVI-PUSHS.md` de la
      V1 ligne à ligne (lu par motifs seulement), `src/index.css` de la V1
      (5 000 lignes de commentaires), `PASSATION-CIQUAL.md` (dix doutes de
      nommage d'aliments sans arbitrage), l'historique git pour dater
      `TIPS-UX-UI.md` et `TODO.md`.
- [ ] La synthèse de l'abstraite à relire après les corrections ci-dessus.

**Table d'équivalence portion/poids** (son TODO : « finir … et inclure
somehow aux formulaires ») : elle existe dans la V1,
`src/data/portionsUsuelles.ts`, 1 500 lignes, 140 tailles, sourcée, 40 tests,
RIEN N'EST CÂBLÉ (sa consigne du 02/09). Quatre verres distincts (générique
150/200/250 ml, vin 100 ml, alcool fort 40 ml, bière). Trois questions à ELLE
avant tout câblage : la quantité par défaut (le « 100 g » codé en dur n'a
jamais été décidé), l'unité par nature d'aliment, le défaut par famille ; plus
trois chiffres (part de pizza 1/8, huître 8 g, lignes sans source). Rien dans
la V2.

**Pièges appris, à ne pas repayer :**
- Un résultat de workflow ne vit que dans la mémoire de la tâche : ÉCRIRE SUR
  LE DISQUE avant toute reprise. Les chapitres tombés se repêchent dans le
  `journal.jsonl` du run.
- `resumeFromRunId` ne lit le cache que dans le dossier de la session
  COURANTE (`~/.claude/projects/<projet>/<session>/subagents/workflows/<run>/`) :
  copier le dossier du run avant de relancer, puis vérifier le journal — seuls
  les agents restants doivent apparaître en `started`.
- Les plafonds d'usage coupent les agents même quand elle pense que non
  (14/09) ; les workflows se reprennent à l'identique après la remise à zéro.
- Une capture par ancre sur une page de plusieurs centaines de ko revient
  BLANCHE sous Chrome sans interface (`loading="lazy"`) : découper une page
  d'essai, ou capturer le haut.
- Rédacteurs et captureurs slugifient l'apostrophe autrement (`d-un` /
  `dun`) : l'assembleur rapproche au tiret près, et le dit en pied de page.
- Les rédacteurs rendent parfois leur HTML échappé (`&lt;section`), ou des
  ancres déjà préfixées d'un dièse : déséchapper, retirer le dièse.
- Le lapin (et les autres badges) sont des SVG dessinés en code, pas des
  images : animables groupe par groupe.

## À arbitrer (décisions à toi)

- [ ] **Les marches et les étages de l'escalier** (2026-09-25, « escalier :
      durée / nombre de marche / nombre d'étages ») : le formulaire les
      demande, la ligne de la V1 (`SportLog`) n'a pas de place pour eux —
      ils ne s'enregistrent pas. Deux sorties : un champ de plus dans la
      ligne (la base de la V1 change de forme), ou les convertir en une
      grandeur que la ligne porte déjà (une distance ? une durée ?).

- [ ] **Les analyses croisées à retenir** (2026-09-17, sa question :
      « quelle/s autres/s correlations/analyses de données croisées te
      paraissent pertinentes ? ») — proposées dans la réponse du jour, à
      trancher avant d'en écrire une seule : effets secondaires × jour depuis
      l'injection ; effets secondaires × dose ; poids × apports (semaine
      glissante) ; poids × activité + pas ; nuit × activité (heure et
      intensité) ; nuit × dernier repas (heure, quantité) ; effets
      secondaires × repas (gras, quantité) ; pas × nuit précédente ; « un
      temps pour soi » × nuit et × effets secondaires ; appétit (kcal) × jour
      depuis l'injection. Même moteur que la nuit × apports
      (`src/domaine/correlation.ts`) : Spearman, plancher de jours, p-valeur.

- [ ] **Les 14 questions de vocabulaire sans réponse** de `VOCABULAIRE.md`
      § 4 — dont l'étiquette « Pesée » du défilé récent (la règle « Balance »
      a été tranchée le 01/09, celle-ci jamais), et les activités qui portent
      « sport » dans leur nom propre.
- [ ] **La table d'équivalence portion/poids** : les trois questions de la
      quantité par défaut et les trois chiffres, listés dans la note ci-dessus.
- [x] **Le déploiement de la V2** — tranché le 2026-09-17 : un second site
      Hosting dans le projet de la V1, `glow-private-v2.web.app`. Déployé
      le jour même (voir GUIDELINES § 2).
- [ ] **Un mot de passe vide laisse entrer** (dernière étape). Choisi le
      2026-09-08 parce que rien n'était obligatoire jusque-là ; à renverser
      d'un mot si le compte doit être obligatoire.
- [ ] **Le titre de l'écran des unités** (« Langue et unités ») et celui de
      l'avatar (« Composez votre avatar ») sont de moi.
- [ ] **De la V1, non repris dans l'avatar** : l'import d'une photo (demande
      de stocker un fichier) et le tirage au hasard.

## Sur sa demande, plus tard — ne pas dépiler seul

- [ ] **Importer son `TODO.md` et `TIPS-UX-UI.md` de la V1** — tranché le
      2026-09-09 : « on les importera plus tard ». C'est elle qui dira quand.
      En attendant, leurs principes d'onboarding sont résumés dans
      GUIDELINES § 4.

## À faire (je dépile sans demander, un commit par point)

- [ ] **Brancher la langue** quand tu le diras : `useTextes` lit le choix de
      l'onboarding quand il existe, retombe sur la détection sinon.
- [ ] **Les roues aux flèches du clavier** : le champ s'ouvre et se ferme au
      clavier, mais le choix ne se fait qu'au doigt.
- [ ] **Le panneau des roues s'ouvre toujours vers le bas** ; près du pied de
      l'écran il gagnerait à s'ouvrir vers le haut.

## À vérifier à l'écran (ce que je n'ai pas pu voir)

- [ ] La centaine de grammes referme bien le sélecteur de poids, et le kilo
      non (2026-09-07).
- [ ] Toucher « English » bascule bien les unités sur inch · pound sous les
      yeux (2026-09-07).

## Repris de la V1, encore vrai pour la V2

- La consigne de conversion React Native et multilingue (`TODO-CLAUDE-V1.md`,
  « LA CONVERSION REACT NATIVE ET LE MULTILINGUE »), résumée dans
  GUIDELINES § 1. Rien ne se fait aujourd'hui ; tout s'y prépare.
- La base alimentaire sera française (Ciqual) : traduire l'interface ne
  traduit pas la base — décision à poser AVANT de promettre une date pour
  l'anglais.
