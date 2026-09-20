# GUIDELINES — la mémoire du projet, à lire EN ENTIER au début de CHAQUE session

Ce fichier dit ce que le projet est, comment on y travaille, et ce qui a été
décidé. Il se lit AVANT de rendre le premier travail d'une session — pas après
la première correction. `CLAUDE.md` le rappelle à chaque ouverture ; ce n'est
pas un rappel de courtoisie, c'est la règle.

Il est écrit pour Claude, en français, comme le code et ses commentaires.
Il vient de deux sources : ce que ces sessions de V2 ont établi, et ce que la
V1 avait consigné dans `CONVENTIONS.md`, `SPEC-FONCTIONNELLE.md`,
`TODO-CLAUDE.md`, `TIPS-UX-UI.md` et les commentaires de son code — relus en
entier le 2026-09-09, à sa demande, pour n'en rien perdre. Les règles de la V1
qui parlaient d'un code qui n'existe plus (Tailwind, Recharts, Ciqual, les
trois versions, les onze thèmes) ne sont pas reprises ; leur ESPRIT l'est.

Quand une décision nouvelle est prise en session, elle s'ajoute ici dans le
commit qui la met en œuvre.

---

## 1. Ce que le projet est

- **V2 de GLOW / GLP1LOW**, une application de suivi pour les personnes sous
  traitement GLP-1. Repartie **de zéro** le 2026-09-06, dans **son propre
  dépôt** : `~/Desktop/GLOW/GIT-APP-V2`, distant
  `https://github.com/kalanityL/glow-V2`, branche `main`.
- **Rien n'est copié de la V1** (`~/Desktop/GLOW/REPO-GIT-LOCAL`). Ce qui en
  vient est repris **pièce par pièce, à sa demande explicite, et STRICTEMENT
  ce dont on a besoin** — réécrit sans les dépendances d'origine, sans les
  classes Tailwind, sans ce qui n'a pas été demandé. Exemples tenus : le cadre
  du téléphone (sans le reste du shell), le catalogue des traitements (noms et
  formes, sans posologie ni cinétique), le dessin de l'avatar (sans l'import de
  photo ni le tirage au hasard). Ne jamais aller puiser dans la V1 de
  soi-même.
- **Socle** : React 19, TypeScript, Vite, Vitest. **Rien d'autre** — pas de
  Tailwind, pas de Firebase, pas de bibliothèque de composants ni d'icônes.
  On ajoute au fur et à mesure, jamais par recopie ; une dépendance de plus se
  justifie dans le commit qui l'ajoute.
- **Le produit** (SPEC V1, à garder en tête) : aucune donnée de santé ne
  quitte l'appareil sans un geste explicite ; aucune restitution ne peut se
  lire comme une recommandation médicale ; pas de conseil nutritionnel,
  sportif ou posologique généré ; pas de réseau social ni de comparaison entre
  personnes ; pas de synchronisation multi-appareils.

### Les deux contraintes permanentes (2026-09-06)

Elles décident de la FORME du code, pas seulement de son contenu.

1. **React Native à venir.** Aucune API du navigateur hors de `main.tsx`,
   `index.html` et **`src/plateforme/navigateur.ts`** — le SEUL fichier qui
   connaisse `document`, `navigator` et le défilement du DOM ; il ne porte
   que des verbes, les décisions restent chez l'appelant. Les polices sont des
   FICHIERS embarqués (`src/assets/fonts/`, engendrés par
   `scripts/fetch-fonts.mjs`), jamais une feuille distante. Ce qui est
   web-only et le restera (le cadre du téléphone, l'attribut `lang`) le dit en
   tête de fichier.
   **Le jour de la conversion**, consignes d'elle (2026-08-26/27, V1) : la
   sécurité d'abord — surface d'attaque minimale, aucune permission native
   non justifiée, données de santé chiffrées, secrets hors du bundle,
   dépendances auditées, deep links validés, revue de sécurité avant toute
   distribution ; de VRAIES notifications du téléphone ; un VRAI scan de
   code-barres à l'appareil photo (saisie à la main en repli, chaque échec
   journalisé anonymement) ; le podomètre RÉEL du téléphone. Une conversion,
   une seule fois : après, tout se fait sur le natif, le web est gelé puis
   supprimé.
2. **Multilingue.** Aucun texte dans un composant : tout passe par
   `src/i18n/textes.ts`, dont le type `Textes` fait d'un texte manquant une
   erreur de compilation. Les listes (thèmes, objectifs, unités, genres…) y
   sont des `Record<Id, string>` : ajouter une entrée sans la nommer dans
   chaque langue ne compile pas. Les noms de marques (traitements) et les
   codes couleur ne se traduisent pas et vivent dans `src/domaine/`. Les
   noms de langues s'écrivent dans leur propre langue. **Pour l'instant, on
   n'écrit que le français** (2026-09-16, « ne t'occupe pas du bilingue on ne
   fait que le francais ») : l'entrée `en` de `TEXTES` lit le dictionnaire
   français, et un lecteur anglophone — ou qui choisit « English » — tombe
   sur le français (« si anglai choisi pour l'instant on tombe aussi sur le
   francais »). Le squelette reste : le type exige toujours chaque langue ;
   écrire l'anglais, c'est poser un second dictionnaire. **Le genre est une
   dimension des textes** (V1) : la structure du dictionnaire doit pouvoir
   porter des variantes accordées ou des tournures neutres — à prévoir dès
   qu'une phrase s'accorde. **Une durée écrite est une TOURNURE, pas un
   compte** : « 15 derniers jours » se rend par « last couple of weeks », pas
   par « last 15 days » ; on ne rectifie jamais la donnée pour coller au
   chiffre écrit. **Dates et nombres passent par des fonctions de format**,
   jamais par des chaînes assemblées à la main dans un écran.

## 2. Manière de travailler

### Commits
- **Aucun commit ne casse le code** : `npx tsc --noEmit`, `npm test` et
  `npm run build` passent sur CHAQUE commit — le build enchaîne les trois.
  Un gros changement se découpe en additif → migration → suppression, jamais
  « je casse puis je répare ».
- **Un commit par demande, immédiatement**, dès que c'est vérifié. Ne jamais
  PROPOSER le commit : le faire. Ne jamais laisser une demande finie dormir
  dans l'arbre. **Commiter AVANT de montrer**, même un essai — un état non
  commité qu'elle demande de rétablir après un « annule » doit être réécrit
  de mémoire (arrivé le 2026-09-07).
- **Message exhaustif** : l'instruction citée **telle que tapée, fautes
  comprises**, sous « Instruction : » ; tout ce que contient le diff,
  renommages et nettoyages compris ; les décisions de conception et leur
  pourquoi ; ce qui a été vérifié et comment ; une section « Non traité ».
  Relire le diff avant d'écrire, ne pas se fier à sa mémoire. Terminer par
  « Commit réalisé par Claude à la demande de l'utilisatrice. » puis les
  lignes d'attribution demandées par l'outil.
- **Chaque commit est annoncé avec son hash** dans la réponse. **Chaque
  réponse rapportant du travail se termine par « Commits non poussés : N »**
  (`git rev-list --count @{u}..HEAD`).
- **Le push n'a lieu que sur son ordre, et chaque fois** : « pousse » vaut
  pour ce lot-ci, jamais pour les suivants. **Avant chaque push, l'entrée du
  lot s'écrit en haut de `SUIVI-PUSHS.md`** et part avec lui. Push et
  vérifications se font en commandes SÉPARÉES, jamais en une chaîne : un
  `tsc` rouge au milieu d'une chaîne n'arrête rien.
- **Le déploiement n'a jamais lieu sans ordre explicite.** **Depuis le
  2026-09-17, la V2 a son propre site Hosting dans le projet Firebase de la
  V1 : `glow-private-v2`, servi à `https://glow-private-v2.web.app`**
  (« ok alors fais ca et domne moi l url »). `firebase.json` et
  `.firebaserc` de ce dépôt visent ce site par la cible `v2` ; la commande
  est `npm run build` puis `firebase deploy --only hosting:v2`. Le site de
  la V1, `glow-private.web.app`, est un autre site du même projet : rien de
  ce qui part d'ici ne le touche, et on le vérifie après chaque déploiement
  (son empreinte de bundle ne doit pas changer). À chaque déploiement :
  vérifier que le site sert le nouveau build (l'empreinte du bundle
  change), pas se contenter de « Deploy complete ».
- **« Préparer un clear »** = committer tout ce qui ne l'est pas, mettre à
  jour la note de reprise, dire ce qui reste non poussé.

### Les fichiers de travail, et leur tenue
- **`TODO.md` est le sien.** Claude n'y ajoute rien de lui-même et n'y coche
  jamais un point : quand un point lui semble fini, il DEMANDE. Sa lecture ne
  déclenche aucun travail.
- **`TODO-CLAUDE.md` est celui de Claude** : arbitrages qui lui reviennent à
  elle, dettes, points ouverts, vérifications à faire. Il l'alimente et le
  coche librement. Il en DÉPILE la section « À faire » sans demander (points
  petits et refermables, un commit par point), JAMAIS la section
  « À arbitrer », jamais ce qu'elle est en train de regarder : une demande
  d'elle passe toujours devant. Le résultat se DIT, elle ne lit pas le fichier.
- **`TODO-CLAUDE-V1.md`** est la copie importée du TODO de la V1 (2026-09-09) :
  on ne l'édite pas, on y pioche ce qui vaut encore et on le reporte.
- **`SUIVI-PUSHS.md`** : une entrée par push, avant le push.
- Toute session lit `GUIDELINES.md`, `TODO.md`, `TODO-CLAUDE.md` et
  `SUIVI-PUSHS.md` en prenant connaissance du projet.

### Réponses
- **Chaque demande arrivée pendant le travail a sa ligne dans la réponse**,
  même quand elle n'exigeait rien de nouveau : « c'était déjà le cas,
  vérifié » vaut mieux que le silence. Le silence lui fait répéter la
  demande (2026-09-07 : « pourquoi je dois le répéter ?? »).
- Lire la demande **littéralement**. « Supprimer X » où X est un texte de
  l'écran = retirer ce texte, pas l'écran. « En premier » peut vouloir dire
  « en premier sur cet écran-là » et non « avant tout ». Quand deux lectures
  mènent à deux travaux différents, dire laquelle on a prise.
- **La version, le thème, l'écran se demandent, ils ne se devinent pas** —
  mais une question ne bloque que si travailler sous une hypothèse rendrait le
  travail inutile.
- **« Passe en bleu » veut dire « passe dans l'accent du thème »** (règle
  absolue d'elle, 2026-08-30) — un RÔLE, pas une teinte ; jamais un bleu
  figé dans un template. Exception : les macronutriments (protéines,
  glucides, lipides, fibres) gardent leurs couleurs FIXES d'un thème à
  l'autre, ce sont des repères de lecture. En cas de doute, lui demander
  AVANT d'écrire : « la couleur exactement sur tous les thèmes, ou assortie
  aux thèmes ? »
- **« Annule »** remet l'état précédent ; **« non reviens à ce que tu avais
  fait »** rétablit le dernier état montré.
- **Sur une question de choix qu'elle n'a pas tranchée, on ne décide pas à
  sa place** : on livre sous hypothèse dite, ou on pose la question en ses
  termes.
- **Jamais d'attente passive sur une tâche finissable** : si je peux finir
  moi-même, je finis moi-même.
- **Chaque lancement d'agent** (si un jour) reçoit un brief complet ; **chaque
  simulation** demandée donne une page artifact dont le lien est donné.

### Vérification
- **Vérifier au rendu avant d'affirmer** : Chrome sans interface
  (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless
  --screenshot=… --window-size=520,760 --user-data-dir=<scratch>`), puis lire
  la capture. Pour un état qu'on ne peut pas atteindre au clic, forcer
  temporairement la valeur (`useState(rang)`, `REPONSES_INITIALES`) et **la
  remettre avant de commiter**. Pour un détail, capturer à 3× ou 4× et
  recadrer (`sips --cropOffset`).
- **Lire les PIXELS, pas le DOM** (V1) : un SVG présent et bien dimensionné
  peut ne rien peindre ; `tsc`, les tests et le build passent SANS UN MOT
  devant une couleur transparente. Rien ne remplace le rendu.
- **Fermer Chrome après chaque capture** (`pkill -f "Google Chrome
  --headless"`) et supprimer son profil : 75 instances laissées ouvertes ont
  saturé la mémoire et fait tuer le serveur de dev (2026-09-08).
- Ce qui n'a pas pu être vu (un clic, une fermeture) se dit comme tel : « je
  n'ai pas pu le voir, c'est toi qui le confirmeras ».

### Le contrôle des guidelines, à la fin de chaque modification (2026-09-15)
- **À la fin de chaque modification, avant de rendre la réponse, un passage
  de contrôle relit ce qui a été modifié** (le diff, pas la mémoire qu'on en
  a) **et vérifie que rien n'y contrevient à ce fichier** : rien de style en
  dur dans un template, aucun texte hors du dictionnaire, aucune API du
  navigateur hors de `navigateur.ts`, aucun `:hover`, aucun popup, rien qui
  déborde, aucune couleur dans `page.css`, rien de la V1 au-delà du
  strictement demandé, le vocabulaire de `VOCABULAIRE.md`, les commentaires
  en français qui disent le pourquoi…
- **Si tout est respecté, la réponse dit seulement : « Guidelines
  respectées ».**
- **Sinon, on CORRIGE, puis la réponse dit : « Guidelines non respectées »**,
  suivi d'UNE ligne disant ce qui contrevenait, et si c'est corrigé ou non.
- **Par défaut, tout ce qui contrevient se corrige**, sans demander. Seule
  une mention explicite d'elle (« laisse comme ça ») dispense de corriger ;
  la ligne dit alors que ce n'est pas corrigé, et pourquoi.

### Serveur de développement
- `npm run dev -- --port 3002 --strictPort`, en arrière-plan. **Le relancer en
  début de session** et chaque fois qu'il tombe — quand la page est blanche
  chez elle, c'est presque toujours ça.

## 3. Architecture et conventions de code

### Trois étages étanches pour le style
1. **Les écrans** (`src/screens/`, `src/components/`) ne posent que des
   **classes**. **RIEN DE STYLE EN DUR DANS UN TEMPLATE** — ni couleur, ni
   police, ni taille, ni mesure, ni `style={{…}}` (règle absolue de la V1,
   2026-08-28). Un SVG pose des classes et la feuille le peint (une règle
   CSS bat un attribut de présentation). La taille d'un dessin est donnée par
   l'endroit qui l'abrite (`.entete { --logo-size }`), pas par une prop.
   **Les seules exceptions, consignées** : les couleurs que la personne
   CHOISIT et qui seront enregistrées (le nuancier de l'avatar — peau, yeux,
   cheveux) ; la géométrie du mot-symbole (des em calculés depuis les
   constantes du dessin, comme des coordonnées SVG). (Une troisième, la
   couleur des pastilles calculée depuis la photo de fond « comme YouTube »,
   a vécu du 16 au 17 septembre 2026 : retirée avec le calcul, `129a7c9`
   dans l'historique.)
2. **`src/themes/page.css`** dit la mise en page, les tailles et les
   rapports, et **ne nomme aucune couleur** : elle consomme des jetons.
3. **`src/themes/<id>/<id>.css`** pose les **jetons**, et rien d'autre.
   Jamais de `font-family` dans une feuille de thème.

À côté : **`src/themes/dessins.css`**, les couleurs de DONNÉES STABLES des
dessins (argent du logo, pupille, bouche, vêtement de l'avatar) — que les
thèmes ne repeignent pas, et qui ne sont pas dans les templates non plus.

- **Pas de jeton sans règle qui l'emploie ; pas de règle sans écran ; pas de
  texte sans emploi.** Ce qui est retiré est retiré **entièrement** : le
  fichier, le type, les textes dans chaque langue. Rien ne sèche dans le dépôt.
- **Un thème ne pose que ses jetons.** Thèmes : `ciel` (jour),
  `ciel-fonce` (nuit), `blanc` (fond blanc, 2026-09-16) et `degrade-doux`
  (Blanc avec le « Dégradé doux » du board en fond, 2026-09-16). **Les
  couleurs et la police de `blanc` et de `degrade-doux` sont dictées par
  `docs/pour-claude/colorboard.png`** (« exactement conforme », 2026-09-16) :
  on n'y change rien à l'œil, on relit le board ; un jeton qui change dans
  l'un change dans l'autre. En ajouter un = quatre gestes, écrits dans
  `src/themes/themes.ts`. Le thème est choisi à l'écran ; il n'y a pas de
  page de choix de thème ailleurs. Le contour du téléphone et sa barre du bas
  (`src/index.css`) figurent l'appareil, pas l'application : ils ne suivent
  pas le thème.
- **RIEN N'A JAMAIS DE STYLE HOVER. RIEN.** (V1, absolue) Aucune règle
  `:hover`, aucun retour de survol d'aucune sorte. `:active` et `:focus`
  restent permis.
- **IL N'EXISTE AUCUN POPUP. AUCUN.** (V1, absolue) Aucune fenêtre par-dessus
  l'écran, aucun voile sombre, jamais `alert`/`confirm`/`prompt`. Tout
  s'ouvre DANS la page : un bloc à l'endroit du geste, une page ou sous-page,
  ou un message écrit là où le geste a lieu — en italique et à l'accent du
  thème. Ce qui n'est pas un popup : un panneau déroulant qui se ferme au
  clic à côté (les roues des sélecteurs). Sur une sortie : **un bouton,
  jamais une redirection minutée**.
- **RIEN NE DÉBORDE JAMAIS, NULLE PART** (V1, sine qua non). Aucun élément ne
  dépasse l'écran du téléphone ni son conteneur. Quand un écran est plus haut
  que le téléphone : d'abord mettre côte à côte, resserrer, ou séparer en deux
  écrans ; en dernier recours une barre de défilement — jamais une coupe. Les
  plafonds en `100vw`/`100vh` sont suspects par construction : la fenêtre est
  bien plus grande que l'écran dessiné. `#phone-screen` porte
  `translateZ(0)` pour que tout `position: fixed` reste dans le téléphone.
- **Colonnes égales** dans les grilles et les lignes : une colonne plus large
  aurait l'air d'être la bonne réponse. Une réponse orpheline prend toute la
  largeur. Traiter les styles **par famille, pas par chaîne**.
- **Le cadre du téléphone** : toute la largeur sous 768 px, 45 % de la fenêtre
  au-dessus, borné 300–480 px ; 80 % de la hauteur.
- **Aucune animation de tracé, aucun `transition: all`** : les propriétés qui
  bougent sont nommées ; un fondu léger est le maximum, et il doit se
  transposer en natif. **Une exception, consignée** (2026-09-20, « le menu
  s'ouvre en tiroir depuis le bas de l'écran ») : le tiroir du menu GLISSE
  depuis le bas, 240 ms, sur sa position (`bottom`, une propriété nommée) —
  en natif, une valeur animée sur la position.
- **Mémoïsation** (V1, obligatoire le jour où une page a un formulaire et des
  sections lourdes) : la frappe ne re-rend que le formulaire — `React.memo`
  sur chaque section, `useCallback` sur chaque geste descendu, `useMemo` sur
  chaque objet dérivé. Un memo cassé ne prévient pas, la page redevient
  juste lente.

### Le parcours d'onboarding
- `src/screens/onboarding/parcours.ts` : les étapes dans l'ordre, `montre`
  pour les conditionnelles, `peutValider` pour ce qui bloque « Suivant »,
  `ETAPE_DEBUT_DECOMPTE` pour les billes. **La règle de blocage vit dans le
  parcours, pas dans un écran.**
- `src/app/useParcours.ts` : les réponses ET le rang, ensemble — la suite des
  étapes dépend des réponses. Le rang vit dans `App` parce que le bouton
  « retour » de la barre du téléphone doit pouvoir reculer.
- `src/screens/onboarding/reponses.ts` : tout ce qui est recueilli, et les
  valeurs de départ. **Les réponses liées se défont ensemble** (traitement :
  « non » efface la forme et la spécialité, changer de forme efface la
  spécialité ; la langue repose les unités).
- **Aucune branche ne se ferme sur un silence** (SPEC) : une question passée
  ne décide rien ; seule une réponse explicite ouvre ou ferme une suite. Une
  question sans réponse se saute — rien n'est obligatoire, sauf ce qu'elle a
  demandé de bloquer.
- **Réutiliser** : `ChoixUnique` (`enLigne` pour deux mots, `enGrille` pour
  une liste longue de mots courts, empilé sinon), `SelecteurPoids` (deux
  roues), `SelecteurNombre` (une roue), `useSelecteurOuvert` (leur ouverture
  commune). Ne pas réécrire un sélecteur local.
- **Trois zones sur chaque page (2026-09-09) : l'entête, le portrait de
  l'avatar (sur son écran) et la rangée des boutons sont FIGÉS ; seule la
  zone du milieu (`.page__defilant`) défile.** L'entête et le portrait vivent
  dans `Onboarding`, hors de la zone qui défile ; un écran ne rend que son
  contenu. `min-height: 0` sur la colonne et sur la zone, sans quoi rien ne
  défile et les boutons passent sous le pli.
- **Boutons** : la rangée est **au bas de l'écran** sur toutes les pages.
  « Précédent » est **absent** de la première page, pas éteint. « Suivant »
  s'**éteint** (jamais caché) quand `peutValider` refuse. Sur la dernière
  page, il ne porte que le mot-symbole dessiné.
- Une règle de saisie se dit **AVANT la faute**, sous le champ, et passe à
  l'accent quand elle n'est pas tenue — seulement une fois qu'on a commencé à
  taper. Validation en temps réel, jamais après un clic sur « Valider ».

### Données, unités, nombres, dates
- **Stockage toujours métrique (kg, cm, g, ml), affichage et saisie selon le
  système** choisi (`src/domaine/unites.ts`). Aucune étiquette d'unité en
  base. La langue amène son système par défaut (`SYSTEME_PAR_LANGUE`),
  rechoisissable. L'unité est toujours **hors du champ**.
- **Séparateur décimal : affichage selon la langue** (virgule en français,
  point en anglais, dans le dictionnaire), **stockage avec un point**.
- **Bornes** (`src/domaine/mesures.ts`) : elles n'écartent que l'ABSURDE et ne
  disent jamais à quelqu'un quel corps il a le droit d'avoir — année de
  naissance dans les bornes de l'âge 1–130 (rapportées à l'année en cours,
  passée par l'appelant), taille 50–300 cm ; poids 1–999 kg / 1–2000 lb
  (deux plafonds ronds d'elle, pas la conversion l'un de l'autre). **La
  taille est stockée en centimètres** (`tailleCm`) et convertie aux deux
  bouts par `tailleAffichee` / `tailleEnCm`.
- **Rien de dérivable n'est stocké ; on référence par identifiant, jamais par
  nom ; supprimer supprime ; les dates sont locales** (`AAAA-MM-JJ`, `HH:MM`,
  jamais `toISOString().split('T')`, qui recule d'un jour en soirée) ;
  **fuseau et langue sont indépendants** ; **une valeur absente se tait** —
  jamais un zéro, un tiret ou une moyenne à sa place ; **toute heure retenue
  respecte les minutes rondes** `0, 10, 15, 20, 30, 40, 45, 50`, arrondies
  vers le bas ; **quand il est question de nutriments, jamais oublier les
  fibres** (règle absolue d'elle, 2026-08-31). **Le format déjà enregistré ne
  se change pas sans migration.**
- **Le traitement se choisit dans le catalogue** (`src/domaine/traitements.ts`),
  jamais saisi à la main ; chaque famille finit par « Autre ».

### Écriture
- **`VOCABULAIRE.md` dit les mots** (2026-09-13) : les termes qu'elle a tranchés
  (« activité physique » jamais « sport » ni « séance », « Balance » pour la
  page du poids, « Préférences » jamais « Paramètres »…), son vocabulaire à
  elle dont le sens n'est pas l'évident (« home carré » = l'habit en blocs),
  les règles de ton — **vouvoiement de tout le site, accords au féminin**,
  sobre, sans point d'exclamation ni promesse de résultat — et les questions de
  mots restées sans réponse. Chaque entrée porte sa citation exacte et sa
  source. **Un mot d'interface se cherche là avant de s'écrire** : une
  directive de vocabulaire non respectée coûte un travail refait.
- Code, identifiants, commentaires, messages de commit : **en français**.
- Les commentaires disent le **pourquoi**, et datent les décisions de
  l'utilisatrice (« demande du 2026-09-07 »). Un commentaire qui décrit un
  état disparu est faux : le reprendre. Les commentaires JSX ne se placent
  jamais devant la branche d'une expression.
- Accessibilité sans texte visible : `aria-label` sur ce qui n'a pas de mot
  (cadres de thème, pastilles, bouton au logo), `role="radiogroup"` +
  `aria-checked` pour un choix unique, `role="progressbar"` pour les billes.
- **Rien qui trahisse une IA** : pas d'emoji décoratif, pas de « ✨ », pas de
  centrage systématique, pas de « 200+ ».
- **Le rouge n'est la couleur de rien** (V1) : les messages sont à l'accent
  du thème ; supprimer prend la couleur de modifier.

## 4. Décisions produit consignées

L'onboarding, dans l'ordre (état au 2026-09-09) :
1. **Thème** — quatre cadres nus (Ciel, Ciel foncé, Blanc, Dégradé doux),
   le premier retenu, clic = toute la page change. Titre « Choisissez ».
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
   puis spécialité à deux par ligne ; bloque tant que les deux manquent.
8. **Avatar** — le créateur de la V1 (genre inclus, il se voit sur le vêtement
   et la coiffure). Pas de photo, pas de tirage au hasard.
9. **Dernière étape** — année de naissance (défaut 1980, remplace l'âge) et
   taille (défaut 165 cm) côte à côte — l'année seule, stockée comme date
   de naissance au 1er janvier (2026-09-19) —, prénom, e-mail, mot de passe (huit
   signes au moins, **seule** contrainte ; vide ne bloque pas). Bouton = le
   mot-symbole.

Supprimées, ne pas réintroduire ni reproposer : le niveau d'activité, le
souhait d'activité, le message « Poids saisi incorrect » (rendu inatteignable
par les roues), la question du genre à part, les six pastilles d'avatar
dessinées. De la V1, à ne pas réintroduire non plus : le suivi hydrique, les
objectifs de poids à paliers, les saisies rapides comme modèle.

**Ses principes d'onboarding** (`TIPS-UX-UI.md` de la V1, à garder devant les
yeux) : l'utilisateur doit AVANCER, pas configurer ; un seul chemin, une seule
action claire à chaque moment ; il ne doit jamais se demander « qu'est-ce que
je fais maintenant » ; à chaque étape, sentir qu'il avance ; chaque étape
complétée débloque une capacité ; la simplicité est dans la prédictibilité,
pas dans le design ; finir l'onboarding par un premier enregistrement (une
injection, un comprimé, un repas, une séance) et le féliciter.

**L'accueil** (2026-09-16, « a la fin du formulaire on arrive à la home ») :
le bouton du dernier écran y mène. **Pour l'instant, la page s'ouvre
DIRECTEMENT sur l'accueil, l'onboarding est mis de côté** (2026-09-16, « pour
l'instant met l'onboarding de coté et la home directement qd on charge la
page ») : `entre` part à `true` dans `useParcours` ; le remettre à `false`
rend l'onboarding, rien d'autre n'a bougé. **Pour l'instant, l'accueil est en thème
Blanc quel que soit le thème choisi dans l'onboarding** (« peu importe la
couleur choisie dans l'onboarding, pour l'instant on arrive sur le theme fond
gris blanc ») — provisoire, de son mot. Le bouton « retour » de la barre n'y
ramène pas à l'onboarding. **Son entête et son menu suivent ses deux images
du 2026-09-16**, avec le logo et les icônes qui existaient déjà (les tracés
Lucide de la V1, recopiés sans la bibliothèque dans `components/Icones.tsx`),
sans point d'exclamation, et les trois étoiles du logo en doré à la place du
soleil. **Rien n'y est cliquable** tant que les pages n'existent pas : des
blocs, pas des boutons — **sauf le portrait, qui ouvre la page Profil**
(2026-09-19).

**Le menu principal** (2026-09-19, « remplace le lien profil du menu par une
icone menu qui ouvre un menu […] garder le design actuel », puis « ouvre le
menu en tiroir comme ça avec une croix pour fermer ») : l'entrée « Menu » de
la barre du bas (à la place de « Profil ») ouvre UN TIROIR qui monte depuis
la barre par-dessus le bas de l'accueil — sans voile sombre, fermé par sa
croix, par un clic à côté ou par Échap, le mécanisme du panneau des roues,
donc pas un popup — avec les entrées sur deux colonnes, l'icône de la V1 à
l'encre sur une pastille bleu clair (2026-09-20) et le nom, sans chevron ni
ligne entre les entrées ; une longue ligne sous chaque titre de groupe, le
titre à l'accent (2026-09-20) ; le mot-symbole de « GLP1LOW
et vous » dans la police, la couleur et la graisse de la ligne. **Derrière
le tiroir, le reste de la page est une vitre floue, sans teinte** (« reste
de la page vitré flou », 2026-09-19) — c'est la seule chose qui couvre une
page, et elle ne l'assombrit pas. **Le fond du tiroir est en très légère
transparence sur la PHOTO de la page qui l'ouvre, jamais sur son contenu**
(2026-09-20) : la photo est repeinte sous le tiroir, alignée sur celle de la
page, sous un voile blanc à 78 %. Il glisse aussi à la fermeture. Ses trois sections, dans son ordre :
Préférences (Modules, Notifications, Couleurs, Badges), Exporter un rapport
(Créer, Disponibles), GLP1LOW et vous — le mot-symbole dessiné, puis « et
vous » — (Mon compte, Sondage, Avis et Feedback, FAQ, Ciel) ; mots courts et
ordre du 2026-09-20, la croix en contour, le premier titre sous sa ligne. « Admin » attend qu'il existe un compte. Aucune entrée
ne mène encore nulle part. La liste vit dans `src/app/menuPrincipal.ts`.

**La page « Mon compte »** — « Mon profil » jusqu'au soir du 2026-09-19
(« page mon profil devient mon compte. Onglet information/avatar/mon
compte ») : trois volets, Informations / Avatar / Mon compte (l'adresse et
le mot de passe, éditables sur place, le mot de passe en points avec sa
règle de huit signes), et des ONGLETS nommés figés EN HAUT des volets (« les
onglets sont en haut »), à la place des points du bas. Le portrait de l'accueil et l'entrée « Mon compte » du tiroir
l'ouvrent. Ce qui suit décrit la page telle qu'elle est née le matin
(2026-09-19, « clic sur avatar ouvre une page
profil avec les infos persos modifiables et la config de l'avatar […] garde
les consignes : pas de label et info editable en inline sans icone de
modification comme sur la V1 ; meme module de modification d'avatar que la
v1, NE CHANGE PAS LA FONCTIONNALITE UNIQUEMENT LE DESIGN », puis ses
consignes du soir) : la marque à gauche et le bouton retour dessous, le
titre à droite ; le portrait, qui mène au volet de l'avatar, et **le prénom
qui s'édite sur place à côté du portrait, et nulle part ailleurs** ; puis
**un carrousel à deux volets** — « Mes informations » (date de naissance,
taille, poids actuel, poids cible ; ni prénom ni adresse) et « Mon avatar »
(`EtapeAvatar`, celui de l'onboarding, à l'identique) — dont **les deux
points sont figés sous les volets**, toujours visibles quoi qu'on fasse
défiler. **Aucun intitulé devant une information, aucun crayon, aucun
champ : la valeur s'édite sur place** (`ChampEnLigne` : on la touche, elle
devient un champ, elle s'enregistre quand on la quitte ou sur Entrée, Échap
la rend ; une saisie refusée revient à la valeur enregistrée et LA RÈGLE SE
DIT dessous). **La date de naissance remplace l'année** dans les réponses
(`dateNaissance`, `AAAA-MM-JJ`) : l'onboarding ne demande que l'année et
pose son 1er janvier. Pas de bouton « Enregistrer ». Le bouton « retour »
de la barre ramène à l'accueil. **Sa photo en portrait (mur blanc, plante,
sol) est le fond de toute la page**, à la largeur de l'écran, sans zoom ni
fondu (« essaie l'image fond haut sur toute la jauteur de l'ecran en fond »,
« non zoomée », 2026-09-16 au soir — la photo horizontale du haut de page et
son fondu ont vécu un après-midi) ; elle est un jeton des thèmes clairs
(`--accueil-fond-image`, `none` sur les ciels) et un FICHIER embarqué dans
`src/assets/images/`, comme les polices — jamais une ressource distante.

## 5. Non traité, au 2026-09-20
- Les réponses sont enregistrées SUR L'APPAREIL depuis le 2026-09-20
  (« changement d'information dans "mon compte" persistent au reload ») :
  `app/enregistrement.ts` (la forme, versionnée — changer la forme, c'est
  monter la version et migrer) et deux verbes de la plateforme (le stockage
  local). Rien ne quitte l'appareil. Mais rien d'autre n'est enregistré : ni
  journal, ni mesures.
- L'accueil n'a que son entête, son salut et son menu ; rien n'y est
  cliquable, la zone du milieu est vide.
- Les roues ne se parcourent pas aux flèches du clavier.
- L'écran de l'avatar défile (sept réglages) — le portrait et les boutons
  restent en place, seuls les réglages défilent.
- La langue est une maquette.
