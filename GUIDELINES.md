# GUIDELINES — à lire en entier au début de CHAQUE session

Ce fichier est la mémoire du projet. Il dit ce que le projet est, comment on y
travaille, et ce qui a été décidé. Il se lit AVANT de rendre le premier
travail d'une session — pas après la première correction. `CLAUDE.md` le
rappelle à chaque ouverture ; ce n'est pas un rappel de courtoisie, c'est la
règle.

Il est écrit pour Claude, en français, comme le code et ses commentaires.

---

## 1. Ce que le projet est

- **V2 de GLOW / GLP1LOW**, une application de suivi pour les personnes sous
  traitement GLP-1. Repartie **de zéro** le 2026-09-06, dans **son propre
  dépôt** : `~/Desktop/GLOW/GIT-APP-V2`, distant
  `https://github.com/kalanityL/glow-V2`, branche `main`.
- **Rien n'est copié de la V1** (`~/Desktop/GLOW/REPO-GIT-LOCAL`). Ce qui en
  vient est repris **pièce par pièce, à sa demande explicite**, et réécrit sans
  les dépendances d'origine — le cadre du téléphone, l'écran d'accès du site
  vitrine, le dessin de l'avatar. Ne jamais aller y puiser de soi-même.
- **Socle** : React 19, TypeScript, Vite. **Rien d'autre** — pas de Tailwind,
  pas de Firebase, pas de bibliothèque de composants ni d'icônes. On ajoute au
  fur et à mesure, jamais par recopie. Une dépendance de plus se justifie.
- **Deux contraintes permanentes**, énoncées le 2026-09-06, qui décident de la
  FORME du code et pas seulement de son contenu :
  1. **React Native à venir.** Aucune API du navigateur hors des points
     d'entrée web (`main.tsx`, `index.html`) et de fichiers isolés qui le
     disent en tête (`useSelecteurOuvert.ts`, `i18n/useTextes.ts`). Les polices
     sont des FICHIERS embarqués (`src/assets/fonts/`, engendrés par
     `scripts/fetch-fonts.mjs`), jamais une feuille distante.
  2. **Multilingue.** Aucun texte dans un composant : tout passe par
     `src/i18n/textes.ts`, dont le type fait d'un texte manquant une erreur de
     compilation. Les noms de marques (traitements) et les codes couleur ne se
     traduisent pas et vivent dans `src/domaine/`. Les noms de langues
     s'écrivent dans leur propre langue.

## 2. Manière de travailler

### Commits
- **Un commit par demande, immédiatement**, dès que `tsc` et `npm run build`
  passent. Ne jamais PROPOSER le commit : le faire. Ne jamais laisser une
  demande finie dormir dans l'arbre.
- **Commiter AVANT de montrer**, même un essai : un état non commité qu'elle
  demande de rétablir après un « annule » doit être réécrit de mémoire (c'est
  arrivé le 2026-09-07).
- **Message exhaustif** : l'instruction citée **telle que tapée, fautes
  comprises**, sous « Instruction : » ; tout ce que contient le diff ; les
  décisions de conception et leur pourquoi ; ce qui a été vérifié et comment ;
  une section « Non traité ». Terminer par « Commit réalisé par Claude à la
  demande de l'utilisatrice. » puis les lignes d'attribution demandées par
  l'outil.
- **Chaque commit est annoncé avec son hash** dans la réponse.
- **Chaque réponse rapportant du travail se termine par
  « Commits non poussés : N »** (`git rev-list --count @{u}..HEAD`).
- **Le push n'a lieu que sur son ordre, et chaque fois** : « pousse » vaut pour
  ce lot-ci, jamais pour les suivants.
- **Le déploiement n'a jamais lieu sans ordre explicite.** V2 n'a **aucune**
  configuration de déploiement. Le seul projet Firebase de la machine,
  `glow-private`, est celui de la V1 : y publier V2 écraserait le site de la
  V1. Ne jamais le faire de soi-même ; proposer un projet à part ou un canal de
  préversion.

### Réponses
- **Chaque demande arrivée pendant le travail a sa ligne dans la réponse**,
  même quand elle n'exigeait rien de nouveau : « c'était déjà le cas, vérifié »
  vaut mieux que le silence. Le silence lui fait répéter la demande, et elle le
  dit (2026-09-07 : « pourquoi je dois le répéter ?? »).
- Lire la demande **littéralement**. « Supprimer X » où X est un texte de
  l'écran = retirer ce texte, pas l'écran. « En premier » peut vouloir dire
  « en premier sur cet écran-là » et non « avant tout » — quand deux lectures
  mènent à deux travaux différents, dire laquelle on a prise.
- Pas de gras sur les mots des demandes cités, pas de reformulation de ses
  phrases : citer.
- Quand elle dit « annule », remettre l'état précédent ; quand elle dit
  « non reviens à ce que tu avais fait », c'est le dernier état montré.

### Vérification
- **Vérifier au rendu avant d'affirmer** : Chrome sans interface
  (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless
  --screenshot=… --window-size=520,760 --user-data-dir=<scratch>`), puis lire
  la capture. Pour un état qu'on ne peut pas atteindre au clic, forcer
  temporairement la valeur (`useState(rang)`, `REPONSES_INITIALES`) et **la
  remettre avant de commiter**.
- **Fermer Chrome après chaque capture** (`pkill -f "Google Chrome
  --headless"`) et supprimer son profil : 75 instances laissées ouvertes ont
  saturé la mémoire et fait tuer le serveur de dev (2026-09-08).
- Ce qui n'a pas pu être vu (un clic, une fermeture) se dit comme tel : « je
  n'ai pas pu le voir, c'est toi qui le confirmeras ».

### Serveur de développement
- `npm run dev -- --port 3002 --strictPort`, en arrière-plan. **Le relancer en
  début de session** et chaque fois qu'il tombe — quand la page est blanche
  chez elle, c'est presque toujours ça.

## 3. Architecture et conventions de code

### Trois étages étanches pour le style
1. **Les écrans** (`src/screens/`) ne posent que des **classes**. Ni couleur,
   ni police, ni mesure.
2. **`src/themes/page.css`** dit la mise en page, les tailles et les rapports,
   et **ne nomme aucune couleur** : elle consomme des jetons.
3. **`src/themes/<id>/<id>.css`** pose les **jetons**, et rien d'autre. Jamais
   de `font-family` dans une feuille de thème.

- **Pas de jeton sans règle qui l'emploie ; pas de règle sans écran ; pas de
  texte sans emploi.** Ce qui est retiré est retiré **entièrement** : le
  fichier, le type, les textes dans chaque langue. Rien ne sèche dans le dépôt.
- **Thèmes** : `ciel` (jour) et `ciel-fonce` (nuit). En ajouter un = quatre
  gestes, écrits dans `src/themes/themes.ts`. Le thème est choisi à l'écran ;
  il n'y a pas de page de choix de thème ailleurs.
- **« Bleu » veut dire l'accent du thème** (`--accent`), jamais un bleu figé.
- Le contour du téléphone et sa barre du bas (`src/index.css`) figurent
  l'appareil, pas l'application : ils ne suivent pas le thème.

### Le parcours d'onboarding
- `src/screens/onboarding/parcours.ts` : les étapes dans l'ordre, `montre`
  pour les conditionnelles, `peutValider` pour ce qui bloque « Suivant »,
  `ETAPE_DEBUT_DECOMPTE` pour les billes.
- `src/app/useParcours.ts` : les réponses ET le rang, ensemble — la suite des
  étapes dépend des réponses. Le rang vit dans `App` parce que le bouton
  « retour » de la barre du téléphone doit pouvoir reculer.
- `src/screens/onboarding/reponses.ts` : tout ce qui est recueilli, et les
  valeurs de départ. Les réponses liées se défont ensemble (traitement :
  « non » efface la forme et la spécialité).
- **Réutiliser** : `ChoixUnique` (`enLigne` pour deux mots, `enGrille` pour
  une liste longue de mots courts, empilé sinon), `SelecteurPoids` (deux
  roues), `SelecteurNombre` (une roue), `useSelecteurOuvert` (le seul endroit
  qui connaît le navigateur pour les roues).
- **Colonnes égales** dans les grilles et les lignes : une colonne plus large
  aurait l'air d'être la bonne réponse. Une réponse orpheline prend toute la
  largeur.
- **Boutons** : la rangée est **au bas de l'écran** sur toutes les pages
  (`margin-top: auto`). « Précédent » est **absent** de la première page, pas
  éteint. « Suivant » s'**éteint** (jamais caché) quand `peutValider` refuse.
  Sur la dernière page, il ne porte que le mot-symbole dessiné.
- Un écran ne doit pas dépasser la hauteur du téléphone : quand ça arrive,
  mettre côte à côte, resserrer, ou séparer en deux écrans — pas laisser les
  boutons passer sous le pli.

### Unités et nombres
- **Stockage toujours métrique, affichage selon le système** choisi
  (`src/domaine/unites.ts`). La langue amène son système par défaut
  (`SYSTEME_PAR_LANGUE`), rechoisissable.
- **Séparateur décimal : affichage selon la langue** (virgule en français,
  point en anglais, dans le dictionnaire), **stockage avec un point**.
- Bornes dans `src/domaine/mesures.ts` : poids 1–999 kg / 1–2000 lb (deux
  plafonds ronds, pas la conversion l'un de l'autre), âge 12–110, taille
  100–250 cm / 40–98 in.
- L'unité est toujours **hors du champ**.

### Écriture
- Code, identifiants, commentaires, messages de commit : **en français**.
- Les commentaires disent le **pourquoi**, et datent les décisions de
  l'utilisatrice (« demande du 2026-09-07 »). Un commentaire qui décrit un
  état disparu est faux : le reprendre.
- Accessibilité sans texte visible : `aria-label` sur ce qui n'a pas de mot
  (cadres de thème, pastilles, bouton au logo), `role="radiogroup"` +
  `aria-checked` pour un choix unique, `role="progressbar"` pour les billes.

## 4. Décisions produit consignées

L'onboarding, dans l'ordre (état au 2026-09-09) :
1. **Thème** — deux cadres nus, le premier retenu, clic = toute la page
   change. Titre « Choisissez ».
2. **Langue et unités** — sur une ligne chacun. Français et cm · kg par
   défaut ; « English » bascule sur inch · pound. La langue est une
   **maquette** : recueillie, pas branchée (l'application parle la langue
   détectée). Brancher = `useTextes` lit ce choix ; rien d'autre ne bouge.
3. **Objectif** — Perdre du poids (défaut) · Stabiliser mon poids.
4. **Poids actuel** — deux roues dans un champ (kg , centaines de grammes),
   95,0 par défaut ; la centaine referme, le kilo non.
5. **Poids visé** — seulement si « perdre ». **Jamais lié au poids actuel** :
   deux valeurs, même défaut, aucune mémorisation de l'un vers l'autre.
6. **Traitement commencé ?** — Oui par défaut. Les billes du décompte
   commencent ici.
7. **Lequel** — seulement si oui ; sans titre ; forme (Injection / Comprimé)
   puis spécialité à deux par ligne ; bloque tant que les deux ne sont pas
   choisies.
8. **Avatar** — le créateur de la V1 (genre inclus, il se voit sur le
   vêtement et la coiffure). Pas de photo, pas de tirage au hasard.
9. **Dernière étape** — âge et taille côte à côte, prénom, e-mail, mot de
   passe (huit signes au moins, **seule** contrainte ; vide ne bloque pas).
   Bouton = le mot-symbole.

Supprimées, ne pas réintroduire : le niveau d'activité, le souhait d'activité,
le message « Poids saisi incorrect » (rendu inatteignable par les roues), la
question du genre à part.

## 5. Non traité, au 2026-09-09
- Aucune réponse n'est enregistrée : un rechargement perd tout.
- Pas de page d'accueil : le bouton du dernier écran ne mène nulle part.
- Pas de déploiement configuré.
- Les roues ne se parcourent pas aux flèches du clavier.
- L'écran de l'avatar défile (sept réglages).
