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
  Tailwind, pas de bibliothèque de composants ni d'icônes.
  On ajoute au fur et à mesure, jamais par recopie ; une dépendance de plus se
  justifie dans le commit qui l'ajoute. **Une seule ajoutée, consignée :
  `firebase`** (2026-09-21, « brancher sur la v2 en ligne la meme
  identification que la v1 et utiliser les memes comptes ») — pour le
  verrou de connexion, et rien d'autre : ni Firestore, ni stockage ; aucune
  donnée de santé ne passe par lui (voir § 4, « Le verrou de connexion »).
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
- **UNE IMAGE DE RÉFÉRENCE SE MESURE, ELLE NE S'ESTIME PAS** (2026-09-21,
  après deux contours faux : « pourquoi as tu fait cette erreur ? » — les
  couleurs avaient été estimées à l'œil sur une vignette, puis corrigées
  dans le mauvais sens). Toute image qu'elle donne pour modèle — couleurs,
  espacements, proportions — est ouverte et RELEVÉE AU PIXEL (PIL) avant
  d'écrire un seul jeton, comme le sont ses propres captures pour vérifier ;
  les valeurs relevées sont citées dans le commit, et la capture du
  résultat est mesurée contre elles. Une image collée dans la conversation
  et absente du disque : le dire, et lui demander le fichier.

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
  thème. **Un message qui apparaît se montre** (2026-09-21, « si un bouton
  valider ou autre actionne un message d'erreur, positionner la fenêtre
  pour avoir ce message visible — valable partout sur le site ») :
  `components/MessageEnPlace.tsx` — refus, règle manquée, question —
  amène la zone qui défile sur lui dès qu'il apparaît ; tout nouveau
  message passe par lui. Ce qui n'est pas un popup : un panneau déroulant qui se ferme au
  clic à côté (les roues des sélecteurs). Sur une sortie : **un bouton,
  jamais une redirection minutée**.
- **LA CHARTE DES FORMULAIRES** (2026-09-21, d'après son image « Ajouter un
  poids » : « utilise cette image comme guidlines de style pour TOUS les
  formulaires de la v2 ») : **couleur sobre ; pas d'icône en couleur ; pas
  de ligne séparatrice ; pas de couleur criarde de focus — un très léger
  changement de couleur à la place ; pas de texte en bleu ; même police,
  même taille partout ; la croix de fermeture et l'icône de la ligne de
  titre pas en bleu.** Tout le formulaire est à l'encre et à ses gris, dans
  la police et la taille du texte courant ; ce qui se dit (règle refusée,
  question) se dit en gris ; les liens sont à l'encre, soulignés ; la valeur
  choisie d'un panneau est à l'encre sur fond léger, le jour choisi du
  calendrier plein à l'encre ; seul le bouton qui valide est à l'accent. Le
  focus, partout où l'on tape ou choisit : le fond et le filet
  s'assombrissent d'un rien, plus d'anneau. Vaut pour la page d'une prise,
  d'une pesée, les lignes de « Mon compte », les champs de l'onboarding —
et les réponses à choisir (`.option`, l'avatar de « Mon compte » compris :
« modif avatar : bouton activé/desactivé -> mettre meme style que
formulaire », puis « idem pour tous les endroits où il y a ce genre de
bouton »), qui ont la matière des boutons de dosage et de zone — et de
même le cadre choisi du thème, le cran choisi d'une roue (sans gras), le
jour choisi du calendrier, la valeur choisie d'un panneau : le bleu pâle
cerné de bleu grisé, jamais l'anneau bleu franc.
- **CHAQUE DONNÉE EST ÉCRITE DANS LA BASE DE LA V1, TELLE QUELLE** (2026-09-21,
  « NON NON NON. Pour chaque formulaire tu reprends de la v1 la structure
  de la base de données correspondante. chaque formulaire et chaque
  données, y compris les infos du compte etc.. ») : l'objet racine
  `AppData` de la V1 — `profile` (`UserProfile`, avec `AvatarConfig`),
  `weightHistory` (`WeightLog`), `injectionHistory` (`InjectionLog`) et
  les autres tables —, en un seul document JSON sous LA CLÉ DE LA V1,
  `glp1_app_companion_data` (`src/donnees/v1.ts`, repris de
  `V1/src/types.ts` et de la SPEC § « L'objet racine »). **Les noms des
  champs sont ceux de la V1, en anglais** : c'est la structure de la base,
  pas un texte d'interface — exception à la règle du français. Les tables
  que la V2 n'écrit pas encore sont conservées telles quelles à chaque
  écriture, et prennent leur type de la V1 le jour où leur formulaire
  arrive. Les identifiants sont ceux de la V1 (`w-<horloge>`,
  `inj-<horloge>`, `starting-weight-log`), les zones aussi
  (`abdomen_gauche`…), le poids en kilogrammes quelle que soit l'unité
  affichée, le poids de départ une pesée marquée de son drapeau. Les
  conversions entre les réponses de l'onboarding et le profil de la V1
  sont dans `src/donnees/conversions.ts`, testées ; ce que la V1 ne sait
  pas porter (langue, thème, fond, objectif, date de naissance, adresse,
  mot de passe, forme du traitement) vit sous sa propre clé `glp1_v2_reponses`,
  hors de la racine, comme la V1 fait de tout ce qui n'est pas une ligne
  de suivi. Tout passe par `src/app/base.ts` : chaque écriture relit le
  document, ne remplace que sa part, réécrit le tout. L'enregistrement
  d'avant (`glp1low.*`, 20 et 21 septembre) est migré une fois puis
  effacé.
- **UN FORMULAIRE REPRIS DE LA V1 REPREND AUSSI SES RÈGLES** (2026-09-21,
  « regle pour TOUS les formulaires à inscrire qqpart pour toujours t'en
  souvenir : les formulaires récupérés de la v1 récuperent aussi les regles
  qui s'y attachent (nb d'entrées par jour max notament et les messages qui
  s'y attachent) ») : le plafond d'entrées par jour, ce qui arrive quand il
  est atteint, les refus et leurs messages — dans les mots de la V1
  (`VOCABULAIRE.md`, SPEC § « Les capacités »). Aujourd'hui : la pesée, une
  par jour, « Une pesée existe déjà le JJ/MM/AAAA. » et la question de la
  remplacer ; la prise, deux par jour, la troisième remplace la dernière de
  la journée (SPEC). Tout formulaire à venir se vérifie contre la SPEC
  avant d'être rendu.
- **AUCUN `select` NATIF, JAMAIS ; AUCUN CHOIX NE SORT DE L'ÉCRAN** (2026-09-20,
  règle absolue : « AUCUN SELECT NE DOIT JAMAIS DEPASSER DE L'ECRAN. Style
  des selects heure et calendrier et TOUS les selects, toujours : tout est
  stylé, accordé au theme, comme sur la v1 »). Le menu d'un `<select>` est
  celui du système, gris, hors de l'écran du téléphone. Tout choix déroule
  un PANNEAU DESSINÉ par l'application (`components/Panneau.tsx`) — porté
  dans la page, aux jetons du thème, placé sous son ancre ou au-dessus
  quand la place manque, jamais plus haut que la place qui reste, jamais
  hors des bords (`plateforme/navigateur.ts`, `placerPanneau`) ; il se
  ferme au clic à côté, à Échap, au défilement. Trois formes :
  `Choix` (une liste, la valeur choisie marquée et amenée sous les yeux),
  `ChoixHeure` (heures et minutes rondes, deux colonnes — une heure laisse
  ouvert, une minute referme), `ChoixDate` (le calendrier : le mois entre
  deux flèches, lundi en premier, six semaines, aujourd'hui cerné, le jour
  choisi plein). Même règle pour le sélecteur de date natif.
- **LES GESTES SE VÉRIFIENT EN PILOTANT CHROME** (2026-09-21) : l'extension
  Chrome n'est pas connectée, mais `scripts/piloter-chrome.mjs` ouvre le
  Chrome de la machine sans fenêtre par le protocole DevTools — molette,
  lancers, clics — et lit la page ; `scripts/verifier-regle-poids.mjs` est
  le scénario de la règle crantée (le chiffre contre le cran sous la tige).
  L'état se force et se restaure par `sed` sur les `useState`, jamais par
  `git checkout`.
- **TOUT DÉFILEMENT DISPONIBLE SE SIGNALE** (2026-09-21, d'après son image,
  la pastille à flèche de l'écran de choix de compte de Google : « quand un
  scroll est disponible n'importe ou sur le site, le signaler avec un
  petit picto de ce genre là — sobre et discret ») : `components/IndiceDefilement.tsx`,
  posé EN DERNIER ENFANT de toute zone qui défile verticalement (le corps
  des formulaires, la confirmation, le contenu d'un bloc, le tiroir, les
  volets de « Mon compte », les panneaux de choix, les colonnes d'heures,
  le calendrier) — collé au bas de la zone visible, DANS LE COIN DROIT
  (« pas très heureux le positionnement de la coche de scroll » au milieu,
  sur une étoile : le contenu se centre, le coin est presque toujours vide),
  tant qu'il reste du contenu dessous, effacé au bout ; une petite pastille ronde au fond des
  champs, cernée de leur filet, le chevron en gris ; **elle ne se montre
  que s'il reste plus qu'une pastille à voir** (44 px — son téléphone : posée
  sur « Oui » pour la marge sous les boutons, « le positionnement de
  l'indicateur est fâcheux ») ; **touchée, elle fait
  défiler d'une page** (« clic sur le bouton doit faire scroller »). Il se
  pose dans L'ÉLÉMENT QUI DÉFILE — pas dans son cadre (l'avatar de « Mon
  compte » : la zone des réglages, pas le volet). Toute nouvelle zone qui
  défile le reçoit.
- **LE TÉLÉPHONE EST LA RÉFÉRENCE, ET CHROME ANDROID A SES PIÈGES**
  (2026-09-21, ses captures) : un fond découpé par le texte
  (`background-clip: text`) ne peint pas un enfant transformé — le fond et
  sa découpe vont SUR la lettre, avec `-webkit-text-fill-color` ; un
  `position: fixed` dans un ancêtre transformé ou rogné ne couvre pas la
  bonne surface — on ancre en absolu sur la hauteur de l'écran (`cqh`,
  l'écran est un conteneur de taille). Un champ qui s'ouvre se montre en
  entier (« quand on ouvre note, il faut que tout le champ soit visible »).
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
  au-dessus, borné 300–480 px ; 96 % de la hauteur (80 % jusqu'au 2026-09-16).
  **Sur `/long`, et là seulement, l'écran fait 850 px** (2026-09-21, « ne
  touche pas à http://localhost:3002/ sur http://localhost:3002/long fait
  sert exactement la meme chose mais dans une simulation de telephone où
  la hauteur d ecran sans les bords du téléphone fasse 850px ») : la même
  application, dans un cadre de hauteur fixe (914 px : 850 d'écran, deux
  bordures de 10, la barre du bas de 44) qui peut dépasser la fenêtre — elle
  défile alors, le cadre reste centré en largeur ; le chemin est lu par
  `cheminDeLaPage()` (`plateforme/navigateur.ts`) et pose `app-root--long`
  (`index.css`). Sur `/`, rien ne change.
- **Aucune animation de tracé, aucun `transition: all`** : les propriétés qui
  bougent sont nommées ; un fondu léger est le maximum, et il doit se
  transposer en natif. **Une exception, consignée** (2026-09-20, « le menu
  s'ouvre en tiroir depuis le bas de l'écran ») : le tiroir du menu GLISSE
  depuis le bas, 280 ms en `ease-out` — la vitesse du tiroir de la V1 —, sur
  sa position (`bottom`, une propriété nommée) —
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
(2026-09-19). **Le menu du bas est une vitre depuis le 2026-09-26** (« effet
transparent vitré sur le menu du bas comme pour la v1 ») : son fond est un
jeton translucide — le blanc de son image à 55 % sur Blanc et Dégradé doux,
la nuit du Bleu nuit de la V1 `rgba(7, 36, 61, 0.55)` sur les deux ciels —
et `page.css` lui donne le flou et la saturation du menu de la V1 dans son
dernier état, `blur(16px) saturate(1.4)` (`V1/src/index.css:4410-4414`,
`bleu-ensoleille.css:894-898`, `bleu-nuit.css:967`) ; ce qui passe dessous
— la photo, le bas d'un tiroir — se devine flouté, le « + », les icônes, le
filet de son image et la mise en page ne bougent pas. L'ombre portée vers
le haut du menu de la V1 (`0 -6px 18px -10px rgb(0 0 0 / 0.35)`) n'est pas
reprise.

**LE BAS DE LA HOME PORTE SES DESSINS EN RELIEF, ET LÀ SEULEMENT**
(2026-09-26, « uniquement pour la home, utilise les icones dans ../images
pour claude/template/icones pour le bas de la home ») : ses huit captures
— des icônes bleues en volume, une par module — sont DÉTOURÉES et
embarquées en PNG (`src/assets/images/modules/`, engendrées par
`scripts/decouper-icones-modules.py`, à relancer si elle en dépose
d'autres), et `ImageDuModule` les pose dans les cercles de l'accueil.
**Leurs couleurs sont celles de ses images, pas celles du thème :
exception consignée**, comme la coche de validation d'une confirmation —
ces dessins ont leurs dégradés et leur volume, qu'un aplat de thème
détruirait ; ce ne sont donc PAS des masques, contrairement aux icônes de
sport. Le détourage se fait par PROPAGATION DEPUIS LES BORDS et jamais par
un seuil sur le blanc, qui mangerait les blancs intérieurs des dessins (le
corps de la balance, l'abat-jour, le piston de la seringue). **Partout
ailleurs — le journal, le tiroir du « + », le filtre, la confirmation —
c'est `IconeDuModule`, au trait, qui sert** : « uniquement pour la home ».
**Sous forme orale, le traitement garde son dessin au trait** : elle n'a
donné que la seringue, et la montrer à qui prend un comprimé serait faux ;
le jour où elle donne l'image du comprimé, elle s'ajoute au script.

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
page, sous un voile blanc à 78 % — **ancrée au bas du tiroir et de la
hauteur de l'écran (`100cqh`), jamais `position: fixed`** (2026-09-21, son
téléphone : « les menus ne devraient pas laisser voir ce qu'il y a sous
eux, c'est une transparence directe vers le fond » — `fixed` dans un
ancêtre transformé et rogné ne couvrait pas la bonne surface sur Chrome
Android) ; même chose pour les blocs. Il glisse aussi à la fermeture. Ses trois sections, dans son ordre :
Préférences (Modules, Notifications, Couleurs, Badges), Exporter un bilan
(Créer, Disponibles), GLP1LOW et vous — le mot-symbole dessiné, puis « et
vous » — (Mon compte, Sondage, Avis et Feedback, FAQ, Ciel) ; mots courts et
ordre du 2026-09-20, la croix en contour, le premier titre sous sa ligne. « Admin » attend qu'il existe un compte. Aucune entrée
ne mène encore nulle part. La liste vit dans `src/app/menuPrincipal.ts`.

**Le tiroir du « + »** (2026-09-20, « bouton + du menu du bas : ouvre un
tiroir meme fonctionnalité que v1 avec le style actuel de v2 ») : la fonction
du tiroir « ajout » de la V1 — les sept modules qui ont un formulaire d'ajout,
trois par rangée, dans l'ordre de la V1, chaque case menant à la page du
module avec son formulaire ouvert (les pages n'existent pas encore) — dans le
cadre commun des tiroirs (`components/Tiroir.tsx`). Son titre, « Que
souhaitez-vous ajouter ? », est **sur la ligne de la croix, sans ligne
dessous, à l'encre de la croix** (2026-09-20, « meme ligne que la croix de
fermeture, pas de ligne horizontale dessous, meme couleur que la croix de
fermeture ») — le menu principal, lui, garde son premier titre sous la
croix. **Un bloc resté ouvert passe sous la vitre d'un tiroir** (2026-09-20,
« s'il y a un bloc reste de page vitré ouvert qd on ouvre un tiroir ou un
menu, ce bloc passe sous la vitre ») : les rangs sont dans `page.css` —
vitre du bloc, bloc, vitre du tiroir, tiroir, barre du bas. **Ouvrir un
tiroir ferme l'autre en même temps** : l'un descend pendant que l'autre monte. **Ses cases sont des cartes depuis le 2026-09-25, d'après son image
`Images-pour-claude/menu-plus.png`** (« nouveau design pour me menu + dans
../images pour claude / menu-plus.png / ne mets pas les sous titres des
catégories, garde nos icones la croix de fermeture et nos textes ») : deux
colonnes de cartes blanches aux coins arrondis (14 px), sur une ombre bleutée
diffuse, gouttière de 14 px ; dans chacune, la pastille ronde de 64 px en
bleu pâle portant l'icône en bleu, un chevron en bleu grisé en haut à
droite, le nom en gras de 16 px en bleu nuit dessous, sur deux lignes s'il
le faut (la règle « sur une seule ligne » du 20/09 cède : l'image l'écrit
sur deux). Les mesures et les couleurs sont relevées au pixel — les
couleurs en jetons `--ajout-*` des quatre thèmes, les ciels sur leurs
propres couleurs. NON REPRIS de l'image, à sa demande : les sous-titres
(aucun), ses icônes (les nôtres, `IconeDuModule`, au trait de 1,5 px du
20/09), son titre « Ajouter une entrée » (le nôtre, sur la ligne de la
croix, la croix telle quelle) ; et, de nous-mêmes, le fond du tiroir reste
la photo voilée du 20/09 (l'image a un fond blanc uni) et la marge latérale
celle de la page. **Puis tout en plus petit** (2026-09-25, « menu + : nom des catégories pas en gras, en + petit / tout en + petit (icone pastille rectangle) ») : pastille 48, icône 24, coins 12, gouttière 10, chevron 20, le nom à 14 px sans gras.

**La page d'une prise** (2026-09-20, « ajouter->injection : envoie vers une
page ultra simple avec uniquement le fomulaire d'ajout d'injection de la v1
avec la meme mise en page, mais pas en bloc reste page vitré, en mode page
simple ») : la case « Traitement » du tiroir du « + » y mène, quand un
traitement est répondu (la forme manquante hors base vient du catalogue,
`formeDuTraitement` — 2026-09-21 au soir, « mon traitement est wegovy
injection mais ajouter traitement ne m'amene pas au formulaire d'ajout » :
la relecture rendait `null`) — **sinon, la case ouvre d'abord le bloc « Mon
traitement »** (2026-09-21, « ajouter traitement si traitement aucun :
ouvre le formulaire de traitement, si un traitement est choisi on arrive
ensuite au formulaire nouveau comprimé / injection ») : rendu par la barre
du bas dans la page, comme le bloc « Thème » ; un traitement complet
enregistré, la page de la prise s'ouvre ; fermé sans traitement, rien. Une
page
ordinaire — l'entête des pages, la barre du bas — dont le contenu n'est
qu'une carte : le formulaire de la V1 (`InjectionForm.tsx`), mise en page
comprise — l'icône de la forme, le titre en capitales, la croix qui ramène
à l'accueil ; **le nom du traitement sur sa ligne, entier, jamais coupé**
(« il ne doit pas etre coupé »), et **touché, il propose « Mettre à jour
le traitement ? » Non / Oui — Oui ouvre le bloc « Mon traitement », et
fermé, on est de retour sur le formulaire au traitement mis à jour** (le
premier palier de la nouvelle spécialité, la zone selon la forme) ; la
date et l'heure côte à côte, éditées en place — en édition, la boîte porte
son icône à gauche et déroule son panneau (l'heure sur les minutes rondes
de la V1) ; **rien en gras sur le formulaire**, le bouton compris ; **dans
l'ordre du 2026-09-21** (« d'abord date et heure ; puis nom du médicament
et a la place du select, des boutons pour chaque dosage avec un dosage
preselectionné, et un bouton autre […] ; plus besoin du lien autre dose ;
on ajoute le label zone d'injection avec 6 boutons ») : la date et l'heure
d'abord, puis le nom du traitement, UN BOUTON PAR PALIER (le premier choisi
d'avance) et « Autre » qui ouvre la saisie, puis « Zone d'injection » et six
boutons — Abdomen G, Abdomen D, Bras G, Bras D, Cuisse G, Cuisse D (G et D
pour gauche et droite ; pas sous forme orale) — **aux couleurs de son
image** (« utilise ces styles pour les boutons de dosage et de zone (pas
les ronds radio) ») : non choisi, gris très clair sans filet et texte gris ;
choisi, le bleu pâle des réponses choisies cerné d'un bleu plus soutenu, le
texte à l'encre du formulaire, jamais bleu ; non choisi cerné d'un gris à
peine plus foncé que son fond, choisi cerné d'un bleu grisé à peine plus soutenu que son fond (« les
couleurs de contours ne sont pas conforme à l'image », puis « ça n'est pas
le meme bleu clair de contour » — corrigé deux fois, la seconde vers le
plus discret) ; le nom
du traitement et l'intitulé de la zone à l'encre ; **le bandeau de titre
et le bouton Valider sont figés, le corps du formulaire défile entre eux**
(« bandeau titre et bouton valider figés, c'est le reste qui scrolle »),
et le bandeau prend la couleur par défaut de la V1
(`--formulaire-bandeau-fond`, le `--glow-band-bg` #f0f9ff de la V1) ;
la dose parmi les paliers de la spécialité — désormais dans
`domaine/traitements.ts`, des faits de boîte, pas un conseil — ou « Autre
dose » tapée ; « + Notes » ; « Valider » au milieu. Une dose absente ou
nulle est refusée et la règle se dit. **Deux prises par jour au plus**
(SPEC, règle reprise avec le formulaire, 2026-09-21) : la troisième
consignée sur une journée pleine remplace la dernière de cette journée
(`domaine/prises.ts`, `avecLaPrise`). **Les prises et les pesées sont
enregistrées sur l'appareil, dans la base de la V1** (2026-09-21, « tu
effaces toutes les modifications qd je reload ? », puis « tu reprends de
la v1 la structure de la base ») : `app/journaux.ts` écrit `injectionHistory`
et `weightHistory` par `app/base.ts`, chaque ligne relue vérifiée et une
ligne abîmée écartée sans perdre le journal.

**L'écran de confirmation d'une prise** (2026-09-20, son image, puis
« ecran de confirmation : que souhaitez vous -> vous pouvez maintenant :
nouvelle element : en 1er ; ouvre la meme chose que bouton plus. Rien en
gras sur cette page. ») : validée, la prise y mène (`PageConfirmation`).
**La coche est son image, le fichier même** (« meme image que jointe, en
plus petit », puis « image de validation :
glp1low_validation_injection.svg ») : `assets/images/validation-prise.svg`,
embarqué comme les polices et la photo, montré en plus petit — **ses
couleurs sont celles de l'image, pas du thème : exception consignée** —,
décollé du titre de page ; « Injection
enregistrée ! » (« Prise enregistrée ! » sous forme orale), « Votre suivi
est à jour. » ; la carte de la prise en TROIS LIGNES DE MÊME STYLE — la
spécialité et sa dose, la date en toutes lettres et l'heure, la zone
(« icone + wegovy meme style et taille que date et zone d'injection ») ;
« Vous pouvez maintenant : » et cinq entrées SANS SOUS-TITRE, petites
pastilles, dans cet ordre : **Ajouter un autre élément, en premier et
pleine, qui ouvre le tiroir du « + »** (la barre du bas l'ouvre sur
demande, `demandeAjout`) ; Voir dans le journal, Concentration sanguine,
Évolution du traitement, Retour à l'accueil — **les quatre éteintes**
(« retour à l'accueil comme les autres désactivés » ; la barre et le
bouton du téléphone ramènent). Rien en gras. La colonne défile en
elle-même sur un écran court. **La carte de la prise est un bouton**
(2026-09-20, « clic sur bloc récapitulatif : réouvre le formulaire avec
les données enregistrées par defaut, et bouton annuler et mettre à
jour ») : elle rouvre le formulaire en modification — rempli de la prise,
« Annuler » et « Mettre à jour » au pied — et la prise mise à jour
remplace la dernière ; la confirmation titre alors « Injection mise à
jour ! » (« Message de validation devient "Injection mise à jour" »).

**La page d'une pesée** (2026-09-21, « ajouter balance : idem que ajouter
injection, utilise le system de regle crantée pour choisir le poids, poids
par defaut à l'ouverture : poids dont la date est la plus proche de la date
d'aujourd'hui et inferieure à la date d'aujourd'hui (attention : la date du
formulaire de poids, pas la date de creation de l'entrée de la table) ; on
ne regarde pas les dates futures ») : la case « Balance » du tiroir du « + »
y mène. La page d'une prise, au poids : la carte « Nouvelle pesée » (les
mots de la V1), la date et l'heure côte à côte, LA RÈGLE CRANTÉE du poids —
`components/ReglePoids.tsx`, sortie du bloc du poids pour servir aux deux —,
« Valider ». Le poids proposé d'avance (`domaine/pesees.ts`,
`poidsLePlusRecent`, testé) : celui de la pesée dont la date — celle du
formulaire — est la plus proche d'aujourd'hui sans être future, aujourd'hui
compris ; sans pesée, le poids du profil. Une pesée par jour (SPEC) :
valider sur un jour déjà pesé dit, dans les mots de la V1, « Une pesée
existe déjà le JJ/MM/AAAA. » — puis, depuis le 2026-09-21 au soir, « Une
saisie existe déjà le JJ/MM/AAAA. La mettre à jour ? » — Non / Oui — Non
ferme le formulaire sans rien écrire (« non -> ferme le formulaire sans
enregistrer »), et rien ne s'écrit sans ce oui ; mise à jour, la
confirmation titre « Balance mise à jour ! » (« si mise à jour, remplacer
Pesée mise à jour ! », puis le soir du 2026-09-21 « Pesée mise à jour
!->Balance mise à jour ! » — le nom de la page). Sa confirmation est LE MÊME ÉCRAN que celui
de la prise (« exactement meme principe »), `PageConfirmation` devenu
générique : « Pesée enregistrée ! » / « Balance mise à jour ! », la carte —
l'icône de la balance et le poids côte à côte sans intitulé (« supprimer le
label poids et mettre directement icone balance et valeur de poids à
côté »), la date, et l'heure précédée de son icône (« mettre icone heure
devant l'heure », sur toute confirmation) — qui rouvre le formulaire en
modification, puis
Ajouter un autre élément, Voir dans le journal, Évolution du poids, Retour à
l'accueil. Les pesées sont la table `weightHistory` de la V1, avec ses
invariants (`domaine/pesees.ts`, testé : au plus une par jour, mise à jour
de la ligne du jour qui garde identité, drapeau et mensurations ; la pesée
de départ la plus ancienne, reconnue à son drapeau). Pas encore : les
mensurations de la V1.

**La page d'un sommeil** (2026-09-21, « fais moi l'écran nouveau sommeil
et confirmation ») : la case « Sommeil » du tiroir du « + » y mène. Le
formulaire de la V1 (`SleepForm.tsx`, `useSleepForm.ts`) et ses règles
(SPEC § « Le sommeil ») : **d'abord la nature seule, Nuit ou Sieste, deux
gros boutons — aucun marqué d'avance sur un nouveau sommeil (2026-09-21 au
soir, « nouveau sommeil : pas de selection par defaut nuit/sieste » ; en
modification, la nature du sommeil l'est) ; puis la suite, avec une toute
petite encoche de retour**
(« d'abord 2 gros boutons : nuit ou sieste ; ensuite la suite du
formulaire, avec une très petite encoche de retour ») — **et la suite tient
sur un écran si elle tient sans défiler, sinon elle se coupe après la
jauge** (2026-09-21, « le reste : si ça tient sur une page sans scroll, sur
une page. Sinon on coupe après la barre de progression et Valider envoie
sur l'écran suivant où on donne une note et où on peut ajouter une note ;
validation de l'écran de durée enregistre le sommeil avec la note par
défaut et sans commentaire, le 3ème écran met à jour — ainsi si le 3ème
écran est fermé, on aura quand même une note/5 ») : la suite est mesurée
avant la peinture ; en deux écrans, Valider consigne le sommeil avec la
note d'avance, et le troisième écran — son fil d'Ariane en tête, sur une
ligne, « Hier 14:00 · Aujourd'hui 15:00 », puis « sieste de 1 h »
(2026-09-21, « fil d'ariane pour 3ème écran » puis la forme sans la
nature), et son bouton « Valider », pas « Mettre à jour » — le met à
jour ; **la note proposée d'avance est celle du dernier sommeil de
même nature** (« reprendre la note de la nuit précédente la plus proche ;
idem pour sieste », `noteParDefaut`, testé), 3 sans aucun ; **chaque bord est
une carte, d'après son dessin** (« utilise ce design sauf rien en gras ; ne
mets pas les pictos endormissement / réveil ») : le nom, le jour en gris
dessous (« Hier », « Aujourd'hui » ou la date, le calendrier au clic), le
cadran avec l'arc du haut jusqu'à la boule (la boule seule, sans bout
d'aiguille — « uniquement la boule, pas la petite barre intérieure ») — en
dégradé LE LONG DE L'ARC jusqu'à la boule quel que soit l'angle (« il y
manque un dégradé dans la coloration du cercle », « le dégradé doit
partir de 0 et arriver jusqu'à la boule » — par segments de 4°, un
dégradé linéaire ne suivant pas un cercle), **l'arc et la boule dans les
bleus des étoiles de la note depuis le soir du 2026-09-21** (« assorti le
bleu degradé du cadran de montre et celui de la boule avec le bleu des
étoiles de notation /5 » : du bleu clair au bleu foncé du « + »,
du bleu clair éclairci du fond de la carte au `--menu-ajouter-fin`
entier — « marque plus le degradé », les deux bleus du « + » étant trop
proches —, chaque segment portant sa part du chemin en propriété
personnalisée et la feuille la mêlant ; la
boule au bleu foncé, cerclée du fond de la carte — le gris-vers-bleu et la
boule bleu nuit relevés sur l'image ont vécu la journée) —, l'heure en
pastille avec son horloge — **le reste du cadran (intérieur, cercle,
repères, crans) et la pastille aux couleurs de son image `horloge.png`,
relevées au pixel et écrites telles quelles, pas en jetons du thème :
exception consignée** (« on a dit que tu mets exactement les couleurs qd
je te donne une capture ») — **« Hier » et « Aujourd'hui » valent pour les deux
bords, quelle que soit la date choisie** (« la règle pour aujourd'hui /
hier reste : si date choisie est hier ou aujourd'hui, mettre hier ou
aujourd'hui ») — **et d'avant-hier à après-demain depuis le soir du
2026-09-21** (« pour les dates : hier / avant hier / aujourd'hui / demain /
apres demain / sinon la date » : `jourRelatif`, testé, et les cinq mots
dans le dictionnaire ; au-delà, la date) ; deux
instants complets, Endormissement et Réveil, chacun son jour et son heure
sur deux colonnes — une nuit part de la veille 23:00 → 07:00, une sieste du
jour même 14:00 → 15:00, changer de nature ne déplace les instants que s'ils
sont encore ceux proposés — **et, au-dessus de chaque heure, un cadran**
(`components/CadranHeure.tsx`, 2026-09-21 : « un cercle d'horloge avec
12 / 3 / 6 / 9 et une petite boule positionnée à l'heure […] on peut faire
glisser la boule […] synchronisation totale […] passer par 12 et continuer
fait passer aux heures > 12 et les étiquettes passent en 12 15 18 21 ») :
le cercle porte les crans d'une montre (soixante, les douze des heures plus
longs — « fait apparaitre les crans comme sur une montre à cadran ») ; la
boule est à l'angle de l'heure, elle se glisse et l'heure suit sur les
minutes rondes, l'heure change et la boule suit ; passer le haut du cadran
bascule la moitié du jour et les repères deviennent 12 15 18 21 ; **passer
minuit change le jour du bord** (2026-09-21 au soir, « cadran horloge
reglage heure -> modifie pour que le passage avant ou apres 23:59 modifie
la date ») : en glissant, franchir 23:59 vers l'avant met le lendemain,
vers l'arrière la veille — compté sur la valeur arrondie, une fois par
passage, jamais en passant midi (`CadranHeure`, `onJour` ; `dateDecalee`,
testée) ; **les
heures et la durée ont une largeur fixée** (chiffres tabulaires, une case
constante alignée à gauche — « pour que ça ne saute pas qd on modifie ») ; la durée déduite, écrite « Durée : 8 h 05 » (2026-09-21 au soir, « 8 h 05
de sommeil-> Durée : xx » — « 13 h de sommeil » a vécu la journée), jamais
saisie, **et sa jauge** (2026-09-21, « barre de progression : nuit : barre
complètement remplie à 8h, de 8 à 12h de durée le bleu devient de plus en
plus foncé ; de 0 à 8h le bleu reste le même, la barre se remplit ; plus de
12h la barre ne change plus ; idem pour sieste, remplie à 1h30,
s'intensifie jusqu'à 3h ») : elle se remplit jusqu'à la durée pleine (8 h
la nuit, 1 h 30 la sieste) dans le bleu clair du « + », puis son bleu
s'intensifie jusqu'à la durée haute (12 h, 3 h) et n'en bouge plus — en
temps réel avec les heures (`domaine/sommeils.ts`, `jaugeDuSommeil`,
testé) ; **la note en étoiles** (« notez votre nuit ou notez votre sieste :
5 étoiles qu'on peut cliquer ou slider pour remplir, par défaut 3 » —
titrée « Notez la qualité de ce sommeil », nuit ou sieste, depuis le soir
du 2026-09-21 : « Notez votre nuit-> notez la qualité de ce sommeil ») — la
qualité de 0 à 5 de la V1, sans mot dessous (« pas de label aux
étoiles »), **à cinq branches, sans contour, SANS HALO** (2026-09-21 au soir : « notez
votre nuit : utiliser la forme d'étoile du logo de glow », puis « remet
la forme d'étoile initiale, pas la forme d'étoile du logo » — l'étoile
du logo a vécu une heure ; « mets leur un effet glow style les comme les
etoiles de image pour claude/etoiles », « effet glow et pas de contour »,
puis « cet effet glow donne une impression d'image flou mal définie. fait
un meilleur effet glow » — son `Images-pour-claude/etoiles.png` relevé au
pixel : des étoiles blanches sur bleu nuit, le halo est une LUMIÈRE RONDE
fondue dans le fond, pas la silhouette floutée ; un `drop-shadow` a vécu
une demi-heure et se lisait comme une image mal définie. Puis un
DISQUE en dégradé radial derrière chaque étoile pleine, une demi-heure
encore : « enleve le glow c'est moche ». Depuis : AUCUN HALO, des aplats
nets — une étoile vide est un aplat au gris des filets, une pleine son
dégradé, aucun trait autour ; ne pas reproposer de halo), les étoiles pleines dans le dégradé bleu du bouton « + »
(« couleur des étoiles de notation : bleu dégradé du bouton + » — ses deux
bouts en jetons, `--menu-ajouter-debut` / `--menu-ajouter-fin`) ; le jour de l'endormissement en mots — « Hier »,
« Aujourd'hui », sinon la date — et le calendrier au clic (« endormissement :
mettre hier, aujourd'hui ou date, qd on clique ça ouvre le calendrier ») ;
les notes ; « Valider ». Trois
jugements au clic, dans l'ordre et les mots de la V1 : durée nulle,
refusée ; plus de douze heures, une question et le bouton « Confirmer mon
choix », toute retouche la désarme ; recouvrement d'un sommeil enregistré,
refusé en nommant la plage. Quinze par date de réveil au plus, refusé.
Écrit dans `sleepLogs` (`domaine/sommeils.ts`, testé). Sa confirmation est
le même écran : « Sommeil enregistré ! » / « Sommeil mis à jour ! », la
carte (nature et durée, endormissement, réveil, qualité) qui rouvre le
formulaire en modification, puis Ajouter, Journal, Évolution du sommeil,
Accueil.

**Toute page de confirmation d'enregistrement fait « gling » en
apparaissant** (2026-09-22, « joue 7 :petite cloche a chaque page de
confirmation ») : `PageConfirmation` joue `SON_DE_LA_CONFIRMATION`
(`app/sons.ts`) une fois, à sa naissance — enregistrement ou mise à jour,
prise, pesée, sommeil, et toute confirmation à venir qui passe par cet
écran. Le son est « Petite cloche », choisi dans une simulation en trois
temps (le même jour : dix sons libres de droits dans l'esprit de son
`gling.mov`, puis dix de plus au plus près du gling isolé de son fond,
puis « je crois que le son initial est 4 notes jouees rapidement, refais
tous les sons precedents mais avec 4 notes et que je puisse modifier la
vitesse ») : une frappe de « Small Bell #2 » (steffcaffrey, Freesound
452379, CC0) jouée quatre fois transposée sur mi5 · sol#5 · si5 · mi6, la
première douce et la dernière pleine, une note tous les 90 ms — les
réglages de la page tels qu'elle les a écoutés ; une autre vitesse ou un
autre motif se dicte. Rendu EN FICHIER (`src/assets/sons/petite-cloche-1.wav`,
2,97 s avec sa résonance) par `scripts/rendre-petite-cloche.sh` depuis la
frappe gardée hors du dépôt avec l'enregistrement de la roue
(`son-pour-claude/petite-cloche-frappe.mp3`) ; il entre au catalogue
(`sons-catalogue.ts`, écrit à la main tel que `rendre-sons.mjs` l'écrit,
sans relancer le rendu au hasard des souffles) sous l'identifiant
`petite-cloche`, joué par le même verbe `jouerClics`. Les dix-neuf autres
timbres de la simulation ne sont pas embarqués : ce sont des fichiers
tiers, à reprendre si l'écran des effets sonores les veut.

**Le premier choix d'une confirmation ramène d'où l'on vient** (2026-09-23,
« page de confirmation : Vous pouvez maintenant : 1er choix, pas en bleu :
"retourner à"+ l endroit d'ou vient ; icone correspondant selon,la d ou on
vient ») : sous « Vous pouvez maintenant : », d'abord « Retourner à
l'accueil » ou « Retourner à Mon compte » — la page où le « + » a été
touché (`Origine`, mémorisée dans `App` au moment du « + » ; un formulaire
ouvert depuis une confirmation garde l'origine de celle-ci) —, avec
l'icône de cet endroit (les étoiles de l'accueil, le profil de
« Mon compte »), sur carte et PAS à l'accent ; puis « Ajouter un autre
élément », toujours pleine ; puis les entrées éteintes. « Retour à
l'accueil », qui fermait la liste éteint depuis le 2026-09-20, est retiré
entièrement (entrée, texte, icône). Lecture prise : « pas en bleu » vise
ce premier choix ; « Ajouter » garde sa couleur, elle n'en a pas parlé.

**La page d'une activité physique** (2026-09-25, son image « Ajouter une
activité » : « on va créer la page ajouter une activité physique. (pas de
couleur vert, reprends juste l'idée, remplace le vert par notre bleu de
pastille bleu). les icones sont dans ../imagespour claude / icones/sport.
pour la recherche laisse la blank, on s'occupera apres de la fonctionnalité
de recherche et son design ») : la case « Activité Physique » du tiroir du
« + » y mène (`PageActivite`). **C'est un formulaire, comme celui d'une
prise** (le même soir, « nouvelle activité physique est un formulaire,
comme nouvelle injection ») : l'entête des pages, la barre du bas, et la
carte — le bandeau avec l'icône du module, « Nouvelle activité physique »
et la croix ; le corps qui défile, avec la date et l'heure côte à côte
puis LE CHAMP DE RECHERCHE (le même soir, son image : « voilà le design
du champ recherche. La recherche propose un sport uniquement du niveau
1 : pas du niveau 0, ni des niveau 2, 3 etc.. si on tape un mot qui
apparait dans un sport de niveau 2 ou 3, on suggere en resultat de
recherche le sport de niveau 1 correspondant ») — la loupe, le mot, la
croix qui efface, à la charte des formulaires et non au bleu de l'image ;
dessous, « Résultats de recherche (n) » et des tuiles COMME CELLES DES
CATÉGORIES (« resultat de recherche : Meme mise en page que categorie »),
L'ICÔNE DU SPORT (« resultat de recherche : les icones doivent etre celle
du sport (cf ../images pour claude tu as toutes les icones sur les
fichiers dans icones) » : ses planches par catégorie, découpées en masques
`src/assets/images/activites/sports/<slug>.png` — le slug du nom du nœud,
`domaine/activites.ts` —, et `scripts/engendrer-icones-activites.mjs` en
écrit `src/themes/activites-icones.css`, une règle par icône, à relancer à
chaque masque déposé ; un nœud sans planche, ceux des activités hivernales
et de « Autre », garde l'icône de sa catégorie) et le nom du nœud — une activité seule réduite à
ce qui précède sa première virgule ; un résultat est TOUJOURS UN NŒUD DE
NIVEAU 1 de l'arbre (un groupe d'une catégorie, ou une activité seule),
jamais une catégorie ni un sous-groupe, et un mot trouvé dans un
sous-groupe ou une activité fait remonter le nœud de niveau 1 qui le
porte (`domaine/recherche-activites.ts`, testé) ; le mot se cherche AU
DÉBUT D'UN MOT et DANS LE FRANÇAIS SEULEMENT — l'anglais du Compendium
répondait à côté (« pourquoi calilistenie apparait qd je tape lu ? » :
« lunges ») ;
sans résultat, une phrase en place —, puis « Catégories » ; « Valider »
au pied, éteint tant qu'il n'y a rien à consigner. **L'arbre est
embarqué** : `docs/pour-claude/compendium/arbre.json` est son tri du
Compendium 2024 (766 activités, leur MET, le nom français et l'intitulé
anglais, le code du Compendium), `scripts/engendrer-activites.mjs` en
écrit `src/domaine/activites-catalogue.ts` — à relancer à chaque
correction de l'arbre ; les noms des activités sont des données du
catalogue, comme ceux des traitements, pas des textes du dictionnaire.
**Une catégorie touchée** (le même soir, « si on clique sur une catégorie,
on voit le nom de la catégorie en fil d'arianne et on affiche les icones
des sports (niveau 1) contenus dans la catégorie ») : à la place de
« Catégories » et des neuf tuiles, le fil « Catégories › Roues » —
« Catégories » ramène, et LES CRANS QUI RAMÈNENT SONT SOULIGNÉS (2026-09-26,
« fil d'ariane : souligne les éléemtns clicables du fil ») — et les tuiles
des nœuds de niveau 1 de la catégorie, avec l'icône de chaque sport. **Trois catégories par rangée ;
quatre tuiles par rangée pour les résultats et les sports d'une catégorie**
(« catégories : 3 par lignes. Résultats de recherche et sports une fois
qu'on a choisi la catégorie : 4 par ligne »). **Le champ de recherche s'efface une fois le sport choisi** (2026-09-26,
« une fois qu'on a choisi l'activité, le champ de recherche d'activité
disparait ») ; il revient avec les catégories. **L'escalier** (le même soir, « escalier : durée / nombre de marche /
nombre d'étages ») : le nœud « Escalier » n'a ni intensité ni distance —
après la durée, deux onglets, Marches et Étages, chacun sa saisie ; la
ligne de la V1 n'a ni marches ni étages : ILS NE S'ÉCRIVENT PAS ENCORE
(TODO-CLAUDE, à arbitrer : une table à part, ou un champ de plus dans la
ligne de la V1). **Valider écrit la séance et mène à la confirmation**
(le même soir, « page de confirmation meme concept que les autres pages de
confirmation ») : la table `sportLogs` de la V1 (`SportLog` : date,
heure, le nom du nœud, l'intensité toujours, la durée en minutes, la
distance en mètres quand l'onglet Distance est ouvert et qu'elle n'est
pas nulle, les notes gardées ; `domaine/activites.ts`, `avecLActivite`,
testé), sa règle de la V1 — QUINZE SÉANCES PAR JOUR AU PLUS, la seizième
remplace la dernière de la journée (« Limite atteinte pour aujourd'hui :
cette saisie remplace la dernière. ») —, la durée « Autre » refusée si ce
n'est pas un nombre de minutes (« Une durée en minutes est attendue. ») ;
« Valider » est éteint tant qu'aucun sport n'est choisi. Sa confirmation
est le même écran : « Activité physique enregistrée ! » / « Activité
physique mise à jour ! », la carte — l'icône du sport (son masque, dans
le gris des lignes) et son nom court avec la durée, la distance ou
l'intensité (son picto), la date en toutes lettres et l'heure — qui
rouvre le formulaire en modification (« Annuler » / « Mettre à jour »,
le sport, la durée, l'intensité ou la distance retrouvés), puis Ajouter,
Journal, Évolution de l'activité physique. **Un sport touché** (le même
soir, « une fois qu'on clique sur un sport : on peut choisir le temps avec
des choix 15 min 30 min 45 min 1h ou autre qui si on clique ouvre un
champs pou rmettre la quantité en minute. Ensuite on peut choisir
l'intensité avec des pictos qui exprime l'intensité (3 niveaux) sans
label OU BIEN , si le sport s'y prete, entrer une distance ») : le fil sur
trois crans (« Catégories › Roues › Vélo », les deux premiers ramènent) ;
« Durée » et cinq boutons de la matière des paliers — 15 min, 30 min
(choisi d'avance), 45 min, 1 h, Autre — et « Autre » touché S'EFFACE, la
saisie des minutes prend sa place dans la grille (« si on clique sur
"autre" : le champ autre disparait et le champ ou on rentre les minutes
prend sa place ») ; « Intensité » et trois pictos sans mot, un, deux,
trois éclairs DE LA MÊME TAILLE (« intensité 2 et 3 : les éclairs font
la meme taille que pour intensité 1 ») (les mots de la V1, douce /
modérée / intensive, dits à qui écoute), modérée d'avance ; POUR LES SPORTS OÙ UNE DISTANCE A UN SENS,
DEUX ONGLETS à l'encre, Intensité et Distance (« systeme d'onglet : un
onglet intensite un onglet distance ») — l'onglet ouvert dit ce qui
compte —, et sous Distance LA PISTE DE LA DISTANCE
(`components/CadranDistance.tsx` : « un rond sur le meme principe que
l'horloge où un tour complet est 1km, meme son que l'horloge, si on fait
plus d'un tour complet les lables évoluent accordingly, il ne se passe
rien si on est deja a zero et qu'on recule encore », puis son image, le
même soir : « à la place de l'horloge (garde le meme design mais mets
cette forme à la place). on peut faire circuler le point en suivant le
rectangle ou en faisant des cercles ça doit marcher aussi ») — UNE PISTE,
deux droites et deux demi-cercles, avec les crans et la boule du cadran
de l'heure et le tracé en dégradé du départ à la boule, vingt crans de
50 m par tour, un clic « Plastique » par cran, les quatre repères disent
la distance au quart, à la moitié, aux trois quarts et au bout du tour en
cours (« 1,25 km … 2,00 km »), LE DOIGT PEUT SUIVRE LA PISTE OU TOURNER
EN ROND (la boule va au point de la piste le plus proche du doigt, le
plus court chemin le long de la piste fait les tours), la boule ne recule
pas sous zéro, la valeur en pastille dessous — TOUJOURS DEUX DÉCIMALES, chiffres tabulaires, la
dizaine une case même vide (« distance : fixer la largeur des unités
dizaines etc.. pour que ça ne saute pas qd modifie ») ET QUI S'ÉDITE SUR
PLACE (« on peut aussi modifier directement la valeur numérique des
kilometre plutot que de bouger le curseur sur le parcours » :
`ChampEnLigne`, virgule ou point, arrondi au cran de 50 m, jamais
négatif, la règle dite en gris si refusé) —, au départ la distance
d'avance du sport
(`DISTANCE_PAR_DEFAUT_KM`, `domaine/activites.ts` — sa liste : « distance
par defaut : a pied et raquette 5km ; à velo/roller : 10km ; natation :
1km ; rameur : 4km ; patinage, ski : pas de possibilité de mettre la
distance » ; le vélo elliptique avec le vélo, le canoë-kayak-aviron avec
le rameur, deux rapprochements de moi). **« Récents », avant les catégories** (2026-09-26, « sous catégorie,
ajouter : récents », « récents : les sports récents, pas les categories
récentes », puis « met recent avant categories, 4 par ligne, 4 max ») :
LES SPORTS des dernières séances DANS L'ORDRE DE LA SAISIE (« dans
l'ordre dans lequel ça a été saisie (date de création ou de mise à jour),
pas date de l'activité. Une activité future sera présente dans recents ») :
la ligne de la V1 ne dit pas quand elle a été écrite, la suite des sports
consignés vit donc sous sa propre clé, `glp1_v2_sports_recents`
(`app/recents-activite.ts`, versionnée, neuf gardés), le dernier consigné
en tête, chacun une fois ; la page en montre quatre, en tuiles sur quatre
colonnes qui choisissent le sport ; rien sans séance (`sportsRecents`,
testé).
**« Marche athlétique » est retirée de l'arbre** (2026-09-26, « supprime
"marche athlétique" de la liste des sports ») : ses quatre activités
aussi, `arbre.json` corrigé et le catalogue régénéré. « Catégories » et neuf tuiles, les catégories de SON tri du Compendium of
Physical Activities 2024 (la simulation « Compendium des activités
physiques » des 24 et 25 septembre : Ballon et balles, Raquettes, Roues,
Pédestre, Cheval, Individuel, Activités aquatiques, Activités hivernales,
Autre — `domaine/activites.ts`), chacune une carte du tiroir du « + » en
petit, la pastille et l'icône aux jetons du « + » — rien de vert —, le nom
dessous (48 px : « icones des catégories + grandes de 2 tailles », puis
« pas de pastille sous l'icone. Icone prend toute la place de la
pastille », le même soir — l'icône seule, sans rond derrière). LES ICÔNES SONT SES PLANCHES (`Images-pour-claude/icones/sport/`),
découpées en masques PNG (`src/assets/images/activites/`) que la feuille
remplit de la couleur du thème. PAS ENCORE : la liste des activités d'une catégorie (les tuiles sont des
blocs, pas des boutons), les activités récentes (aucune n'est
enregistrée), le formulaire — qui reprendra celui de la V1 et ses règles
(SPEC § 4.7 : sport du catalogue avec son MET, intensité ressentie, durée
en minutes, distance facultative en mètres, note).

**La page Journal** (2026-09-26, « On va faire la page journal. tu as tous
les templates dans ../images pour claude/templates / journal ») : l'entrée
« Journal » de la barre du bas y mène, depuis n'importe quelle page
(`PageJournal`). TOUT CE QUI EST ENREGISTRÉ, REMIS ENSEMBLE ET RANGÉ PAR
JOURNÉE — les quatre tables que la V2 écrit (`domaine/journal.ts`, testé :
`entreesDuJournal`, `joursDuJournal`, `joursAvecEntree`, `compteDuJour`,
`imageDeLEntree`) ; le domaine NE PRODUIT AUCUN TEXTE, l'écran écrit les
mots. Ses cinq templates sont relevés AU PIXEL (714 px de large pour la
liste, facteur 1,83 sur un écran de 390) : sept cartes de jour de 86 × 80,
gouttière 10, marge 30 (soit 47 × 44, 6 et 16) ; la pastille d'une entrée,
78 (soit 44). **Les couleurs relevées sont, à trois unités près, les jetons
que les thèmes portent déjà** — #eaf3fc contre `--ajout-pastille-fond`,
#3375f3 contre `--accent` — : la page est donc bâtie AUX JETONS et suit les
quatre thèmes ; ce qui est repris de ses images est LA MISE EN PAGE. **Nos
icônes, pas les siennes** (« utilise evidemment nos icones pas celles des
templates ») : `IconeDuModule`, la même qu'à l'accueil et au tiroir du
« + » ; et nos mots (« Balance » là où son template écrit « Poids »,
« Menus », « Marche »). **Le jour choisi commande la liste** : la fenêtre de lecture s'ouvre autour
de lui et il est amené sous les yeux. **MAIS LE CALENDRIER SE PROMÈNE SANS
LE CHANGER** (2026-09-26, « slide sur semaine ou mois : si on ne clique
nulle part, la date selectionnée ne change pas ») : glisser et pousser les
flèches déplacent le REGARD — une semaine, un mois —, et SEUL UN CLIC
choisit une date. Deux états distincts, donc : le jour choisi et ce que le
calendrier montre ; le rail ne se replace que sur demande, jamais au fil
d'un glissement, sinon le doigt se battrait contre le replacement. **LE PASSÉ EST EN HAUT, LE FUTUR EN BAS** (2026-09-26, « orientation du
journal : le passé en haut le futur en bas » — l'ordre inverse, hérité du
template, a vécu la journée) : les journées vont du plus ancien au plus
récent, le « Voir plus » du passé est en haut et celui du futur en bas.
**LE JOURNAL SE DÉROULE SANS FIN DANS LES DEUX SENS**
(2026-09-26, « on doit pouvoir scroller sans fin dans un sens comme dans
l'autre peu importe ou on se trouve. jusqu'à 10 ans en arriere en 1 an
dans le futur par rapport à la date du jour courant ») : `domaine/journal.ts`
tient les deux bornes absolues, comptées depuis AUJOURD'HUI et non depuis
le jour regardé (`bornesDuJournal` : dix ans en arrière, un an en avant).
**La fenêtre fait toujours six mois de part et d'autre du jour
regardé** (`fenetreDuJournal`), et **UN « VOIR PLUS » DÉPLACE LE JOUR
REGARDÉ au bout qu'on vient d'atteindre** (2026-09-26, « quand on clique
sur "voir plus" dans le passé : le jour courant est décalé au nouveau jour
le plus ancien ; dans le futur : le jour courant est décalé au 1er jour des
nouveaux jour qui viennent d'etre charges ») : la fenêtre se rouvre autour
de lui et six mois de plus apparaissent de ce côté. On avance ainsi de six
mois en six mois, sans fin — les deux compteurs de pas ont vécu une heure,
ils n'ont plus lieu d'être. **Aux bornes, plus de bouton et plus rien à
faire défiler**. La lecture reprend sur ce jour-là (`amenerEnHaut`) : rien
ne saute ; et un jour vide atteint ainsi NE SE DÉPLIE PAS de lui-même — on
ne l'a pas choisi, on est arrivé dessus.
**TOUTES LES JOURNÉES SONT LÀ, LES VIDES COMPRISES** (« jour sans donnée :
apparait dans le journal comme un jour avec données, simplement il n'y a
rien en dessous on passe directement au jour suivant ») : une journée vide
n'a que son titre, **et AUCUNE différence de style avec une journée pleine**
(2026-09-26, « pas de différence de style pour les dates avec ou sasn
entrée » — le titre resserré et pâli a vécu une heure). **SON ÉCRAN D'AJOUT PORTE SON ILLUSTRATION** (2026-09-26, « date sans
entrée, ajouter l'icone ../images pour claude/ template/icone/calendrier
nuage de cette façon (sans ajouter le + et avec nos textes deja
presents) ») : son calendrier sur des nuages, détouré et embarqué
(`journee-vide.png`, le même script que les icônes de la home, à tolérance
serrée), À GAUCHE, et la phrase « Aucune entrée pour ce jour. » À CÔTÉ
DE LUI (« Aucune entrée au 28 novembre 2025.-> à côté du calendrier », puis
« Aucune entrée au 3 septembre 2026.->Aucune entrée pour ce jour. ») ;
**« Ajouter au JJ mois AAAA : » CENTRÉ SOUS LE BLOC** — c'est cette ligne
qui porte la date (« Ajouter :->Ajouter au 3 septembre 2026 : ») (« ajouter une entrée passe en centré
sous le bloc calendrier plus phrase », « ajouter avec ":" », puis « Ajoutez
une entrée :->Ajouter : » — « Ajoutez une entrée : » a vécu une demi-heure).
SANS LE « + » de son image, et sans ses mots à elle : les nôtres. **Les
sept cases sont QUATRE PAR LIGNE AU PLUS ET SANS LABEL** (2026-09-26, « pas
de label, 4 icones par ligne max »), **mais gardent leur contour et leur
encoche** (le même jour, « garde les contours et les encoches ») : la carte
et son chevron, comme celles du tiroir du « + » — sans leur nom. **Leurs libellés, PROPRES À CET ÉCRAN**
(« changement des titres ici, pas les titres des catégories mais des labels
au étiquettes , uniquement pour ici ») — « une Injection », « un Poids »,
« un Effets Secondaires », « un Repas », « une Activité Physique », « un
temps de Sommeil », « Un Temps pour Soi », sa dictée avec ses articles et
ses capitales — **NE SE VOIENT PLUS : ils restent dits à qui écoute la
page**, comme les noms des cercles de l'accueil ; ailleurs, ce sont les
noms de modules. Les cartes en deux colonnes avec leur nom et leur chevron
ont vécu deux heures. **Son « + » déplie cet
écran SOUS ELLE, dans le journal** (« Un petit bouton + sur un jour
sans donnée pour voir, sous le jour en uestion, l'écran "journée sans
donnée" insérée à l'intérieur du journal ») — le « + » devient une croix
d'un quart de tour ; **et choisir un jour sans donnée au calendrier
l'ouvre déplié** (« Si on clique sur un jour sasns donnée, on arrive sur ce
jour par defaut deplié »). La journée choisie porte un filet à l'accent :
dans une liste d'un an, il faut la retrouver d'un coup d'œil. **Chaque
journée est un composant MÉMOÏSÉ** (`JourneeDuJournal`) : la fenêtre
déroule jusqu'à plusieurs milliers de journées, et déplier la moindre les
re-rendrait toutes. Deux vues : la
semaine en sept cartes, le mois en six semaines lundi en premier
(`grilleDuMois`). **UNE ICÔNE « AUJOURD'HUI » À GAUCHE DE SEMAINE / MOIS** (2026-09-26,
« ajoute petite icone qui represente aujourd'hui à gauche de semaine/mois /
modele de l'icone ../images claude/icones / aujourd'hui / tu mets dedans le
chiffre du jour courant », « si on est le 2 février, tu mettras 02 ») :
d'après son image `aujourdhui.png`, mais DESSINÉE et non embarquée — le
quantième change chaque jour, une image le graverait ; ses couleurs
relevées au pixel sont rendues en jetons du thème. **Sans cadre autour du
chiffre, et le chiffre en grand** (« pas de contour autour du chiffre pour
l'icone aujourd'hui agrandit le chiffre ») : le cadre de son image rognait
la place. Touchée, elle ramène à aujourd'hui.
**ON S'Y DÉPLACE AU DOIGT COMME AUX FLÈCHES** (2026-09-26,
« on peut slider dans les dates en mode semaine et aussi en mode mois ») :
**C'EST LE DÉFILEMENT DU NAVIGATEUR, AIMANTÉ — le mécanisme de la piste
de la règle crantée du poids** (le même jour, « je n'arrive toujours pas a
slider lees dates (tu peux regarder ajouter un poids, on utilise le slider
a cet endroit pour voir comment fonctionne le sliding »). **EN VUE
SEMAINE, LA PISTE EST CONTINUE ET S'AIMANTE SUR CHAQUE JOUR** (le même
jour, « slide en mode semaine : slide fluide des jour en jour sans sacade,
pas de passage de semaine en semaine ») : sept jours visibles, le jour
regardé AU MILIEU, un cran par jour ; la piste tient quarante-cinq jours de
part et d'autre d'une ancre, et l'ancre ne se repose que lorsque le jour
regardé s'en éloigne de plus de vingt-cinq — sans quoi le DOM changerait
sous le doigt à chaque jour franchi. **LE PAS D'UN CRAN SE MESURE sur la
piste** (`scrollWidth / nombre de jours`) et ne se déduit pas des largeurs
écrites : six pixels de marge oubliés décalaient de huit jours au bout de
la piste. **EN VUE MOIS, trois volets** pleine largeur — le précédent, le
courant, le suivant, ceux que les bornes permettent (« slide de mois en
mois : laisser comme tel ») ; le défilement fini sur un voisin déplace la
date, et le rendu ramène le courant au milieu. Rien n'est intercepté à la main : le geste est celui du système, à
tous les doigts et à tous les trackpads. DEUX TENTATIVES D'INTERCEPTION
ONT VÉCU LA JOURNÉE (un appui qu'on traîne, puis un `wheel` compté à la
main) : ni l'une ni l'autre ne répondait à tous les gestes — la leçon est
de reprendre un mécanisme qui marche déjà dans le projet plutôt que d'en
écrire un — d'une semaine, d'un mois —, dans le sens du doigt, avec un seuil de
40 px qui écarte les frôlements et les gestes verticaux (la zone défile
aussi). **LES BORNES S'Y APPLIQUENT COMME AU « VOIR PLUS »** (« Idem voir
plus selon les memes regles qd on arrive à une borne », `dansLesBornes`) :
à dix ans en arrière ou un an en avant, la date est rabattue, la flèche
s'éteint et le glissement ne fait plus rien ; **les jours qui portent quelque chose sont pointés**,
filtre compris, le futur compris — alors que la liste ne montre rien de
plus récent que le jour choisi. Le titre d'une journée : LA DATE EN TOUTES LETTRES À GAUCHE, TOUJOURS
(`formaterJourEtDate`, sans l'année), le mot du jour à droite quand il en a
un (`jourRelatif`, d'avant-hier à après-demain) — 2026-09-26, « les jours
qui ont des noms (hier aujourd'hui etc..) inverse noms et jour » ; et AU
BOUT, le nombre d'entrées entre parenthèses pour une journée pleine (« les
jours où il y a des entrées : à la place du "+", on met entre parentheses
le nombre d'entrées »), son « + » pour une journée vide. **Le bandeau de
mode est GLOBAL** — le compte du jour choisi, « Filtrer », liste ou grille
— et non dans le titre de chaque journée : ses deux images se contredisent
sur ce point, et changer de mode sur une seule journée n'aurait pas de
sens (lecture prise). **L'entête de son template n'est pas repris** (« Journal » en gros,
la loupe, « Filtrer ») : la V2 a son entête de page consigné, et
« Filtrer » descend sur le bandeau de mode (lecture prise). **Les entrées
sont des BLOCS, pas des boutons, et sans le chevron de son template** :
aucune page de détail n'existe, et un chevron promettrait une page qui
n'est pas là. **Le mode grille, littéralement** (« pour le mode grille tu
mets juste l'image de l'entrée si elle exite sinon l'icone ») : la tuile
ne porte QUE l'image ou l'icône — ni heure ni nom, le nom se dit à qui
écoute —, trois par rangée ; AUCUNE LIGNE N'A D'IMAGE aujourd'hui (la base
de la V1 n'a de champ de photo sur aucune des quatre tables), c'est donc
l'icône partout. **Le filtre est un tiroir** (`TiroirFiltre`, d'après
`écran-filtre.png`), les huit modules en tuiles cochables quatre par
rangée, toutes cochées au départ, agissant tout de suite ; « Filtrer » se
marque quand une catégorie est écartée ; « Réinitialiser » est un lien à
l'encre souligné, éteint quand tout est coché. **Le bouton « Filtrer » dit
si un filtre est mis** (2026-09-26, « ajouter un indicateur sur le bouton
pour filtrer qui indique si un filtre es tmis ou non ») : une pastille à
l'accent portant LE NOMBRE DE CATÉGORIES RETENUES — « je vois six
catégories », ce qu'on a sous les yeux, et non le compte des écartées ;
aucun filtre, pas de pastille, l'absence est la réponse. **Et le tiroir a
une rangée en pied** (2026-09-26, « filtrer : gros bouton annuler / fermer
en bas ») : deux boutons pleine largeur sous le filet de son image —
« Annuler », qui REND LE FILTRE TEL QU'IL ÉTAIT À L'OUVERTURE du tiroir
(ce que « Réinitialiser » ne fait pas, lui qui recoche tout) puis ferme, et
« Fermer » à l'accent, qui garde le filtre qu'on vient de poser ; **pas de
filet avant eux, de l'air puis un filet après, et leur texte sans gras**
(le même jour, « pas de ligne séparatrice avant annuler/fermer ; plus de
vspacce sous annuler /fermer, ligne separatrice apres annuler/fermer »,
puis « bouton annuler/fermer texte pas en gras »). **« Réinitialiser »
disparaît quand tout est coché** (« réinitialiser disparait s'il est
desativé ») : un lien éteint n'apprend rien. Lecture
prise du « / » : deux boutons, comme ses autres paires dictées au slash. **UN
JOUR SANS RIEN A SON PROPRE ÉCRAN, ET LUI SEUL** — dès que LE JOUR CHOISI
ne porte rien, même si les jours d'avant en portent (2026-09-26, « je
clique sur un bouton sans point je n'ai pas l'écran qu'il faut ») : le
déroulé vers le passé ne vaut que pour un jour qui a quelque chose à
montrer. (2026-09-26, son image et sa dictée :
« design s'il n'y a pas d'entrée sur le jour sur lequel on clique : texte :
aucune entrée au xxxdatexx. Ajouter : une injection / un poids / un effet
secondaire / un repas / une activité physiue / un sommeil / un temps pour
soi ») : la phrase dans sa tournure (« Aucune entrée au 21 septembre
2026. »), « Ajoutez une entrée », et SES SEPT MODULES sur deux colonnes —
l'icône dans sa pastille, le nom, le chevron. **Son ordre à elle**
(`MODULES_AJOUT_JOURNAL`), qui n'est pas celui du tiroir du « + » : le repas
passe devant l'activité physique ; l'ordre du tiroir est celui de la V1 et
ne bouge pas. **Nos icônes et une couleur unie** (« couleur unie des icones
et utiliser nos icones ») : `IconeDuModule` aux jetons `--ajout-*`, pas les
six teintes de son image ; la mise en page de l'image est reprise, pas ses
couleurs. **L'illustration du carton de son image n'est pas reprise** : elle
était collée dans la conversation, pas sur le disque. **Toucher une case
ouvre le formulaire À LA DATE REGARDÉE**, pas à aujourd'hui (`dateProposee`,
descendue d'`App` aux quatre formulaires ; pour un sommeil c'est la date du
réveil, le coucher partant de sa veille) : on lirait le 17 et on
enregistrerait le 26. Le « + » de la barre n'en passe pas — ses formulaires
s'ouvrent à aujourd'hui, comme avant. Les trois modules sans formulaire
(effets secondaires, repas, temps pour soi) ont leur case et ne mènent
encore nulle part, comme dans le tiroir du « + ». **PAS DE RECHERCHE**
(2026-09-26, « pour l'instant ne fait pas la fonctionnalité recherche du
journal ») : la loupe de son template n'est pas reprise. **« Voir dans le
journal » des confirmations ouvre le journal À LA DATE DE L'ITEM**
(2026-09-26, « brancher les pages de confirmation voir dans le journal
envoie vers le jouranl à la date saisie pour l"item ») et non à
aujourd'hui — on consigne une pesée d'hier, une séance de demain ; pour un
sommeil, la date du RÉVEIL, celle sous laquelle la ligne se range. Les
cinq mots des jours relatifs sont montés à la racine du dictionnaire
(`joursRelatifs`) : ils servaient au sommeil, ils servent au journal, un
seul jeu.

**Toute page de l'application porte la barre du bas** (`BarreDuBas`, avec
ses deux tiroirs) et, hors de l'accueil, **l'entête des pages**
(`EntetePage` : la marque en petit et les deux outils sur une ligne, le
titre centré et non gras dessous, pas de flèche de retour — « Accueil » de la
barre et le bouton du téléphone ramènent ; 2026-09-20, « mon compte est une
page à part entiere »).

**Le poids s'édite dans son bloc** (2026-09-20, « mise à jour de poids :
ouvre qqchose comme ça […] la barre du bas se met à jour au bon endroit en
temps réel ») : le chiffre en grand, éditable sur place, et dessous une
graduation qui glisse sous une tige fixe — les deux se suivent à chaque
geste et à chaque frappe. **Chaque cran franchi en glissant clique**
(2026-09-21, « ouvre le son roue de la fortune, et utilise les morceaux de
ce son pour qd on modifie un poids, les clics doivent correspondre au
passage d'un cran de la règle graduée » — après le silence de la veille,
« supprime completement l'effet bruit ») : joués à tour de rôle par
une file à 45 ms qui ne garde que six clics d'avance
(`plateforme/navigateur.ts`, `jouerClics`) : lentement, chaque cran ;
vite, un roulement. Le placement programmé (ouverture, frappe) ne clique
pas. **LE SON EST « BULLE » DEPUIS LE SOIR DU 2026-09-21**, après une
simulation de vingt clics (« fais une simulation de 20 sons différents
[…] plus légers, plus metalic ou glass, change de note » puis « son bulle
pour le poids / son plastique : ajoute le pour qd on tourne l'heure avec
le cadran de l'horloge / garde tous les autres sons disponibles on s'en
servira dans les parametres ») : **le catalogue des sons est embarqué en
entier** — vingt sons synthétisés (métal, verre, bois et plastique, la
note qui change) rendus en `.wav` par `scripts/rendre-sons.mjs` (la même
écriture Web Audio que la simulation, rendue hors ligne par le Chrome de
la machine, un fichier par variante : un pour un sinus, quatre pour un
souffle tiré au sort, huit pour une gamme, dix pour « Monte avec le
poids »), et la roue de la fortune (`cran-1..8.wav`, découpée de son
enregistrement `son-pour-claude/SFB-roue-fortune-1.mp3`) ; le catalogue
TypeScript `app/sons-catalogue.ts` est ENGENDRÉ par le script, à relancer
à chaque son ; les deux choix d'elle sont dans `app/sons.ts` (`SON_DU_POIDS`,
`SON_DU_CADRAN`) ; les noms des sons ne sont pas dans le dictionnaire tant
que l'écran des effets sonores (son TODO : « parametre effets sonores
choix sons pour les différents effets ») n'existe pas. **Le cadran d'une
heure clique aussi**, « Plastique », à chaque minute ronde franchie en
glissant la boule, par la même file ; **et les étoiles de la qualité du
sommeil**, « Cristal », un clic par étoile franchie (« ajouter son cristal
à variation de qualité sommeil », le même soir) — `SON_DE_LA_NOTE`. **La graduation** (2026-09-20, « met les chiffres
de la regle graduée au dessus des crans, tous les 5 kilos […] positionne
une tige verticale noire, 4 fois plus grande qu'un cran, au milieu de
l'écran, dont le bout supérieur se place sur la regle graduée ») : les
nombres AU-DESSUS des crans ; les crans sur une même ligne de base, en
trois hauteurs (le double, l'entière, les trois quarts) ; **l'échelle est
au dixième** (2026-09-20, « échelle de la regle : 10x plus précise : ce qui
represente actuellement 10kg change pour representer à la place 1 kilo.
faire figurer aussi les graduations des centiemes ») : un cran par dixième
de kilo — le kilo a le grand cran, le demi-kilo le moyen, le dixième le
petit, le nombre tous les demis (« 97 », « 97,5 ») ; et LA TIGE, fixe au
milieu, dans le bleu du thème, de la hauteur du cran de kilo, PAR-DESSUS
les crans, le pied sur leur ligne de base (2026-09-20, « tige bleue ; tige
de la taille d'un cran de kilo, ne pas la positionner sous la regle
graduée mais en superposition ») — elle dit en permanence le poids que le
chiffre affiche, et RECOUVRE le cran qu'elle désigne (« tige bleue par
dessus et rend invisible tout autre tige sous elle »), épaisse de deux
pixels (« épaisseur tige bleue : 2px », après un passage à l'épaisseur
d'un cran). Elle est posée sur le cadre, HORS du défilement,
dans une grille d'une case avec lui : dedans, un élément absolu part avec
la piste qui glisse et Chrome l'emportait hors de vue. **La graduation est
aimantée, et l'aimant est immédiat** (« tige "aimantée" sur les crans »,
« aimant immédiat ») : pendant le geste, l'aimantation native du
défilement ; le geste fini, la graduation est amenée d'un coup sur le
cran du poids lu, sans glissement d'approche
(`plateforme/navigateur.ts`, `surFinDeDefilement`). **Le chiffre a une
hauteur figée** et sa case vide porte un zéro invisible, pas une espace :
rien ne bouge en passant les cent. **Une seule source à la fois**
(2026-09-21, son enregistrement : 91,5 sous 116,5, et l'échange à chaque
rendu) : la règle (`components/ReglePoids.tsx`) ne ramène jamais la
graduation sur un poids qu'elle vient de lire — l'effet qui la place ne
joue que pour un poids venu d'ailleurs (ouverture, frappe, autre
traitement). **Sa piste n'est dessinée qu'autour du poids** (2026-09-21,
« il y a un petit delai […] qd on ouvre qqchose avec la regle graduée » —
210 ms mesurés pour 9 981 crans) : le rail a la largeur de tous les crans,
seuls 400 de chaque côté du centre sont dans la page, la fenêtre se
recentre en glissant ; le nombre n'est écrit que sur les kilos (« N'étiquette
pas les crans de demi kilos non plus »). La géométrie de la graduation (le pas
d'un cran, les hauteurs) est dans `page.css` ; le code n'en lit qu'un
rapport (`domaine/mesures.ts`).
« OK » au pied, éteint sans changement ; fermer sans valider propose
« Confirmer la mise à jour » / « Fermer », comme les autres blocs.
**Dans tous les blocs fermables, la confirmation affichée, un second clic
sur la croix ferme sans enregistrer** (2026-09-20, « si on clic sur la
croix qd le message de confirmation s'affiche, ca confirme la fermeture
sans sauvegarde ») : la croix vaut alors « Fermer ».

**Les informations de « Mon compte » sont celles de la V1** (2026-09-20) :
l'âge (lu en années, édité en date de naissance), la taille, le poids de
départ, l'objectif final, le médicament prescrit. **Le médicament s'édite dans
le bloc « Mon traitement »** (`BlocTraitement`, sur la page vitrée comme un
tiroir — pas un popup : la vitre des tiroirs, à l'endroit du geste) :
Comprimé / Injection / Aucun, puis les spécialités de la forme ; le bouton dit
« Enregistrer » s'il n'y avait pas de traitement, « Mettre à jour » sinon.
Fermer sans avoir enregistré, avec un changement en cours, propose deux
sorties : « Terminer la mise à jour » / « Fermer » si seule la forme est
choisie, « Confirmer la mise à jour » / « Fermer » si le choix est complet.

**Le bloc « Thème »** (2026-09-20, « menu parametre couleur ») : l'entrée
« Couleurs » du tiroir l'ouvre, sur toute page. Deux cadres, ceux du choix du
thème de l'onboarding — la photo, et le ciel de midi du thème « Bleu
ensoleillé » de la V1 — **devenus ses deux photos le 2026-09-20 au soir**
(« theme : remplacer le fond fleur existant par fond-fleur.png ; remplacer
le fond bleu par fond-brasserie.png ») : « Fleurs », un mur clair sous du
jasmin, et « Brasserie », la terrasse d'un café ; les identifiants `photo`
et `ciel` sont restés, `fond` étant une réponse enregistrée ; les images
sont embarquées en JPEG dans `src/assets/images/` —, **puis « Aucun », le fond vide** (2026-09-21, « ajouter a theme l'option
fond vide » : pas d'image, le fond uni du thème, en premier cadre), **puis
les dix fonds de sa planche** (le même soir, « extrais les 10 fonds et ajoute les a la
page theme ») : Nature printanière, Coucher de soleil, Bord de mer, Forêt,
Café parisien, Nuit étoilée, Minimaliste clair, Aquarelle, Montagnes,
Abstrait glow — découpés de la planche (le haut de chaque case, au-dessus
du téléphone dessiné, environ 200 × 300 px : ils s'agrandissent sous le
voile flou), douze cadres sur trois colonnes, le bloc défile —, et
« Choisir ». **Hors du fond par défaut, le logo et l'entête prennent les
couleurs de l'image choisie** (2026-09-20 au soir, « a part le theme par
defaut, calcule changement couleur logo et header selon image de fond
choisie ») : `scripts/palette-fonds.py` lit chaque image, en tire la
teinte dominante vive (moyenne vectorielle des pixels vifs, pondérée par
la saturation, désaturée quand ils sont rares) et la clarté du haut de
l'image, et ÉCRIT `src/themes/fonds-palette.css` — les jetons du logo
(les trois couleurs de la pastille), de G et LOW, de L/P/1 et de la
devise, de l'encre des pastilles de l'entête, et de l'encre des textes
posés à même le fond (`--fond-encre`, nouveau jeton : le salut, le titre de
page — celle du thème par défaut), pour `.page--fond-<id>` ; encres claires
sur un haut sombre (Nuit étoilée), où les pastilles de l'entête restent
blanches à encre sombre. **Non traité :** la barre d'état du téléphone
reste sombre sur un fond sombre — elle figure l'appareil, hors de la page. Calculé une fois, hors
du navigateur, relisible ; à relancer à chaque fond ajouté. « Fleurs », le
fond par défaut, garde les couleurs du thème. **L'image de fond est
nette** (le même soir, « supprimer flou de l'image de fond ») : le voile
flou du 16 septembre est parti, la vitre des tiroirs et des blocs floute
toujours ce qu'elle couvre. Toucher un cadre change le fond de la
page SOUS LES YEUX sans l'enregistrer ; « Choisir » l'enregistre (réponse
`fond`, sur l'appareil) ; fermer sans choisir, avec un autre fond sous les
yeux, propose « Confirmer le nouveau fond » / « Fermer » (comme le bloc du
traitement) ; « Fermer » rend le fond enregistré. Le fond
choisi vaut pour toute page, les tiroirs et les blocs (`.page--fond-<id>`
rebranche le jeton `--accueil-fond-image`). Sous le ciel de la V1, le logo
et l'entête prenaient ses couleurs « Bleu ensoleillé » ; le ciel parti,
ces couleurs aussi — sur une photo claire, les couleurs ordinaires. **Un bloc prend toute la hauteur
entre la zone sûre et la barre du bas, son contenu défile, son pied est
ancré** (2026-09-20). **Un clic sur le fond de n'importe quelle page ouvre
le bloc « Thème »** (« clique sur fond d'écran depuis n'importe quelle
page : ouvre comme si on avait cliqué sur menu couleur ») : le clic qui
tombe sur une zone de page elle-même, pas sur une carte, une pastille, un
bouton ou une vitre — **sur l'accueil seulement, depuis le 2026-09-21**
(« sauf si un formulaire est ouvert ; uniquement sur la home page ») : les
autres pages, formulaires compris, ne l'écoutent plus.

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
DIT dessous). **Toute la ligne d'une information est le geste** (2026-09-20,
« clic n'importe où sur la ligne bloc de l'info lance l'édit ») : l'icône,
la valeur, le vide entre les deux et jusqu'au bord — un clic n'importe où
sur la ligne lance l'édition sur place, ou ouvre le bloc du poids, de
l'objectif, du traitement. La ligne porte la main (`ligne--geste`) ; les
boutons qu'elle contient n'ont plus de geste propre, le clic monte jusqu'à
elle. **La date de naissance remplace l'année** dans les réponses
(`dateNaissance`, `AAAA-MM-JJ`) : l'onboarding ne demande que l'année et
pose son 1er janvier. Pas de bouton « Enregistrer ». Le bouton « retour »
de la barre ramène à l'accueil. **Sa photo en portrait (mur blanc, plante,
sol) est le fond de toute la page**, à la largeur de l'écran, sans zoom ni
fondu (« essaie l'image fond haut sur toute la jauteur de l'ecran en fond »,
« non zoomée », 2026-09-16 au soir — la photo horizontale du haut de page et
son fondu ont vécu un après-midi) ; elle est un jeton des thèmes clairs
(`--accueil-fond-image`, `none` sur les ciels) et un FICHIER embarqué dans
`src/assets/images/`, comme les polices — jamais une ressource distante.

**Le verrou de connexion** (2026-09-21, « peux tu brancher sur la v2 en
ligne la meme identification que la v1 et utiliser les memes comptes pour
que je n'ai rien à faire dans l'interface firebase ? ») : LA MÊME
IDENTIFICATION QUE LA V1, LES MÊMES COMPTES — Firebase Authentication du
projet `glow-private`, la configuration de la V1 recopiée telle quelle
(`plateforme/firebase.config.ts` : pas des secrets, la sécurité est la
liste des comptes du projet), les comptes créés par elle dans la console
pour la V1 ouvrent la V2, e-mail et mot de passe ou compte Google. **Tout
le SDK vit dans `plateforme/compte.ts`**, second fichier de la plateforme
à côté de `navigateur.ts` : le reste ne connaît que `Compte` et cinq
verbes ; le jour de React Native, c'est le seul fichier à réécrire. **Le
verrou n'est armé que sur le build de production** (`main.tsx`,
`import.meta.env.PROD`) : la V2 EN LIGNE demande un compte, ses mots ; le
poste de développement, les captures et les scénarios n'en ont pas — pour
voir l'écran de connexion en local, `npm run build` puis `npx vite
preview --port 4173`. Armé, `screens/Verrou.tsx` (l'`AuthGate` de la V1)
ne rend l'application qu'à une session connectée, et une page vide du
fond enregistré le temps que le SDK restaure la session mémorisée ; la
session est mémorisée sans limite, jusqu'à « Se déconnecter », un lien au
pied du volet « Mon compte » (absent sans verrou). **L'écran de
connexion** (`screens/Connexion.tsx`) est la page de connexion de la V1
dans le téléphone et à la charte des formulaires : le mot-symbole, « Accès
privé — connectez-vous pour continuer », les deux champs, un refus dit en
place et en gris dans les mots de la V1 (`domaine/connexion.ts`, un refus
nommé par code du SDK, testé ; les phrases dans le dictionnaire), « Se
connecter » à l'accent, « ou » sans ligne, « Continuer avec Google » en
second bouton avec le G de Google dessiné sur place (ses couleurs dans
`dessins.css`), la note « Les comptes sont créés par l'administratrice —
pas d'inscription libre. ». La fenêtre de Google (`signInWithPopup`, celle
de la V1) n'est pas un popup de l'application : c'est la page de Google,
hors de l'écran. **Un site Hosting supplémentaire n'est PAS autorisé de lui-même
pour la connexion Google** (constaté le 2026-09-21 au soir : la fenêtre
Google se refermait aussitôt, le domaine manquait) : elle a ajouté
`glow-private-v2.web.app` dans la console, Authentication → Settings →
Authorized domains, et ça marche. Tout nouveau domaine s'ajoute là, à la
main ; la liste se lit sans identifiants par le point public
`getProjectConfig` de l'Identity Toolkit avec la clé d'API. Rien d'autre ne passe par Firebase : les données
restent sur l'appareil.

**L'avatar modulaire, essayé et retiré le 2026-09-21 au soir.** Un agent
a remplacé le dessin de l'avatar par les 31 SVG de
`~/Desktop/GLOW/avatars/avatar_prototype_svg/` (commit `159f90a`, fusionné
en `0ca2db7`, défait par le commit inverse qui suit) : « remets l'avatar
d'avant le nouveau est trop moche ». Ces SVG SONT le dessin plat qu'elle
a refusé ; le style qu'elle veut est celui de ses images JPEG générées
(`UX:UI chatGPT/avatar/`), qui n'existent pas en pièces séparables.
Leçon : une pièce livrée se met en regard de ce qu'elle attend AVANT de
lancer le chantier, pas après. L'avatar de la V1 reste ; les pistes pour
le style voulu (des pièces générées en images sur un canevas commun, ou un
jeu vectoriel dessiné à la main) attendent sa décision.

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
