# TODO — celui de Claude (V2)

Ce que **je** relève au fil du travail : arbitrages qui te reviennent, dettes,
points laissés ouverts, vérifications à faire à l'écran. Je l'alimente
moi-même ; ton fichier à toi est `TODO.md`.

**Ce fichier est le mien, je le gère comme je veux** (ta parole du 2026-08-15,
V1) : j'y ajoute et j'y coche sans demander. Je te signale ce qui compte plutôt
que de te faire lire le fichier. Le TODO de la V1 est importé tel quel dans
`TODO-CLAUDE-V1.md` ; ce qui en vaut encore est repris ci-dessous.

---

## À arbitrer (décisions à toi)

- [ ] **Le déploiement de la V2** : nouveau projet Firebase, canal de
      préversion sur `glow-private`, ou écrasement volontaire du site de la
      V1 ? Proposé le 2026-09-08, non tranché. Rien ne se déploie avant.
- [ ] **Un mot de passe vide laisse entrer** (dernière étape). Choisi le
      2026-09-08 parce que rien n'était obligatoire jusque-là ; à renverser
      d'un mot si le compte doit être obligatoire.
- [ ] **Le titre de l'écran des unités** (« Langue et unités ») et celui de
      l'avatar (« Composez votre avatar ») sont de moi.
- [ ] **L'écran de l'avatar défile** (sept réglages). La V1 les rangeait
      derrière des onglets ; à voir si cela gêne.
- [ ] **De la V1, non repris dans l'avatar** : l'import d'une photo (demande
      de stocker un fichier) et le tirage au hasard.
- [ ] **Le TODO et les TIPS UX/UI de la V1 sont-ils à importer aussi ?**
      Seul mon TODO l'a été (ta demande). Ton `TODO.md` et `TIPS-UX-UI.md`
      de la V1 contiennent des points qui parlent directement de l'onboarding
      (finir par un premier enregistrement, féliciter, « avancer, pas
      configurer ») — leurs principes sont résumés dans GUIDELINES § 4.

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
