# TODO — celui de Claude (V2)

Ce que **je** relève au fil du travail : arbitrages qui te reviennent, dettes,
points laissés ouverts, vérifications à faire à l'écran. Je l'alimente
moi-même ; ton fichier à toi est `TODO.md`.

**Ce fichier est le mien, je le gère comme je veux** (ta parole du 2026-08-15,
V1) : j'y ajoute et j'y coche sans demander. Je te signale ce qui compte plutôt
que de te faire lire le fichier. Le TODO de la V1 est importé tel quel dans
`TODO-CLAUDE-V1.md` ; ce qui en vaut encore est repris ci-dessous.

---

## NOTE DE REPRISE — CLEAR DU 2026-09-13 (spécifications en cours)

**Elle a demandé un clear avant de relancer ; à la reprise, LUI REPOSER LA
QUESTION : « je relance les deux chantiers de la spec fonctionnelle ? »** Ne
rien relancer sans son oui — elle a refusé le lancement automatique le 13/09
justement pour faire ce clear.

Contexte : docs en cours dans `docs/` (servi sur http://localhost:3003/ par
`python3 -m http.server 3003 --bind 127.0.0.1 --directory docs`, à relancer
s'il est tombé). Table des matières validée par elle (21 chapitres, ordre :
traitement, poids, effets secondaires, alimentation…), `docs/spec-fonctionnelle.html`
est un squelette « à venir ». Périmètre : V1 Mixte + décisions V2, sans admin
ni thèmes, sans les TODO ; aucune maquette inventée ; captures V1 en Nostalgic.

**Ce qui est fait :**
- Inventaire de la V1 par 9 lecteurs : `scratchpad/inventaire-v1.json`
  (scratchpad = `/private/tmp/claude-501/-Users-beauty-Desktop-GLOW/4f237620-7356-4a0e-861c-339563e2ef7b/scratchpad`).
- Banc de capture V1 : `scratchpad/rig-v1` (apiKey vidée, build servi sur le
  port 3011 par `rig-v1/scripts/servir-dist.sh rig-v1/dist 3011`), outil
  `scratchpad/outil-capture/capturer.mjs` + `MODE-EMPLOI.md`, graine
  `scratchpad/graine.json` (Camille, 1978, 168 cm, 96 → 85,9 kg, 122 jours).
- 371 captures dans `docs/captures/<domaine>/` (8 domaines V1 + onboarding-v2) ;
  MANQUENT : `metabolisme-rapport-badges` et `transversal` (coupés par le
  plafond d'usage).
- 20 chapitres ÉCRITS mais NON VÉRIFIÉS (les réfutateurs ont été coupés) ;
  seuls `compte` et `onboarding` ont leur réfutation, sans correction ; le
  chapitre 21 (`non-implemente`) n'est pas écrit. Résultats dans
  `/private/tmp/claude-501/-Users-beauty-Desktop-GLOW-GIT-APP-V2/4f237620-7356-4a0e-861c-339563e2ef7b/tasks/w17twnc87.output`
  et le journal du workflow.

**Comment reprendre (après son oui) — les deux workflows se REPRENNENT, les
agents finis rejouent depuis le cache :**
- Captures : `Workflow({scriptPath: "/Users/beauty/.claude/projects/-Users-beauty-Desktop-GLOW-GIT-APP-V2/4f237620-7356-4a0e-861c-339563e2ef7b/workflows/scripts/captures-v1-mixte-wf_02a1fb56-16e.js", resumeFromRunId: "wf_02a1fb56-16e"})`
- Rédaction : `Workflow({scriptPath: "/Users/beauty/.claude/projects/-Users-beauty-Desktop-GLOW-GIT-APP-V2/4f237620-7356-4a0e-861c-339563e2ef7b/workflows/scripts/redaction-spec-fonctionnelle-wf_ec85ca17-0ff.js", resumeFromRunId: "wf_ec85ca17-0ff"})`
- Ensuite : assembler les chapitres vérifiés dans `docs/spec-fonctionnelle.html`
  (insérer les figures par `data-capture` → `captures/<domaine>/<slug>.png`),
  puis glossaire, index, table des écrans ; puis spec technique, abstraite,
  inspirations (mêmes méthodes). Ne publier un chapitre qu'une fois réfuté et
  corrigé.
- Piège : les plafonds d'usage coupent les agents (« session limit ») ; les
  workflows se relancent à l'identique après la remise à zéro.

## À arbitrer (décisions à toi)

- [ ] **Le déploiement de la V2** : nouveau projet Firebase, canal de
      préversion sur `glow-private`, ou écrasement volontaire du site de la
      V1 ? Proposé le 2026-09-08, non tranché. Rien ne se déploie avant.
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
