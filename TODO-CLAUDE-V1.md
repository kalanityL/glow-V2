# TODO — celui de Claude, HÉRITÉ DE LA V1

**Ce fichier est une copie, importée telle quelle le 2026-09-09** du
`TODO-CLAUDE.md` de la V1 (`~/Desktop/GLOW/REPO-GIT-LOCAL`), à sa demande :
« importe aussi ta to do de la v1 ». Il n'est PAS le TODO de la V2 — celui-ci
est `TODO-CLAUDE.md`, à côté. On ne l'édite pas : on y pioche ce qui vaut
encore pour la V2 et on le reporte dans `TODO-CLAUDE.md`.

Tout ce qui suit parle du code de la V1 (Mixte, thèmes, Ciqual, graphes…),
qui n'existe pas dans la V2. Ce qui y reste vrai pour la V2, en revanche :
les consignes de conversion React Native et de multilingue (« LA CONVERSION
REACT NATIVE ET LE MULTILINGUE »), la sécurité du natif, et les leçons de
méthode. Elles sont reprises dans `GUIDELINES.md`.

---

# TODO — celui de Claude

Ce que **je** relève au fil du travail : arbitrages qui te reviennent,
dettes, points laissés ouverts, vérifications à faire à l'écran. Je
l'alimente moi-même ; ton fichier à toi est `TODO.md`.

**Ce fichier est le mien, je le gère comme je veux** (ta parole du
2026-08-15) : j'y ajoute et j'y coche sans demander. La règle « ne jamais
cocher sans demander » ne vaut que pour `TODO.md`, le tien. Je te signale
ce qui compte plutôt que de te faire lire le fichier.



---

## PASSATION — SESSION DU 2026-09-01 AU 2026-09-06

État à la coupure : **arbre propre**, tout poussé et déployé, `tsc`
silencieux, **117 fichiers de test, 2 127 tests au vert**, build vert.

### Ce que cette session a livré

**Journal des repas et en-cas — la barre de composition.** La ligne écrite
« Prot : 78g Gluc : 210g … » a disparu des TROIS niveaux (journée, prise,
item) au profit de la barre à quatre parts du site (`BarreEtiquetee`), muette
au repos : le clic sur la barre ouvre labels au-dessus et valeurs en dessous,
sans plier la journée ni le repas ni ouvrir le menu de l'item. Les kcal
précèdent la barre aux deux niveaux du bas, sur pastille violette
(`glow-kcal-badge`), **la valeur seule, pas l'unité**. Barre à 6 px dans le
journal (prop `fine`), 12 ailleurs. Les portions sont des MASSES, pas des
parts caloriques : ce sont des grammes qui reviennent au clic.
`macrosPart`, `summaryLine`, `kcalPart` et l'import `NutritionSummary` sont
partis avec leur dernier appel.

**Accueil — deux boutons « + AJOUTER »**, au bas d'« En direct » (pomme,
ouvre le formulaire de repas sous la vitre) et de « Dynamique » (haltère).
Côté activité physique il n'existait PAS de couche vitrée d'écriture : elle a
gagné un second visage (`SurimpressionSport`) qui MONTE le formulaire de la
page, jamais une copie.

**Ciqual — `nom_generique`**, troisième étage de nommage, sur les 3 258
entrées. Tout est dans `PASSATION-CIQUAL.md` §9, y compris les dix doutes en
attente d'arbitrage.

**Table d'équivalence** — `src/data/portionsUsuelles.ts`, 90 lignes,
140 tailles, poids NETS comestibles, sourcées. Rien n'est câblé.

### LA LEÇON DE CETTE SESSION, à ne pas repayer

**La barre de composition a été DÉPLOYÉE INVISIBLE.** Les aplats
`gc-nutri-swatch-*` n'étaient peints que sous `.glow-chart` ; l'entête de
journée n'étant pas un bloc de graphe, ses quatre portions sortaient
transparentes. `tsc`, 2 066 tests et le build passaient tous **sans un mot**.
Corrigé par un second crochet, `.glow-nutri-aplats` — et surtout PAS en
posant `glow-chart` sur la barre, ce qui aurait suffi : Bleu matinal
immersive habille ses cartes par `…:has(.glow-chart, …)` et la carte entière
du journal basculait du verre au blanc opaque.

**Rien ne remplace le rendu.** Le protocole qui marche, employé cinq fois
dans la session : copie jetable hors dépôt, `apiKey` vidée, `npm run build`,
`scripts/servir-dist.sh` sur un port isolé (jamais 3000, jamais 4300 — deux
agents se sont effacé leur `dist` en partageant dossier et port),
`puppeteer-core` installé HORS du dépôt, Chrome headless piloté en CDP,
graine dans `localStorage`, mesures au pixel sur le rectangle des glyphes.

### En attente de son arbitrage — À LUI REDEMANDER

1. **Quantité par défaut Ciqual** (chantier NON lancé) : trois questions
   posées, aucune réponse. Les alcools forts (250 ml de vodka, c'est huit
   shots — éclater le 250 en spiritueux 30 / vin 125 / bière 250 ?) ;
   l'unité (ml pour les liquides, g sinon) ; le défaut posé sur la FAMILLE
   (`nom_generique`) plutôt qu'entrée par entrée. Contexte indispensable :
   **Ciqual ne publie aucune portion**, le 100 g codé en dur dans
   `draftItemFromFood` est la base de référence de la table qui fuit jusqu'à
   l'écran — personne n'a jamais décidé que 100 g était une portion.
2. **Trois chiffres de la table d'équivalence** : la part de pizza (1/8,
   donc 50 g — mais une pizza individuelle se coupe souvent en 4) ;
   l'huître (8 g de chair retenus contre les 15-20 g qui circulent, ceux-là
   comptant l'eau que Ciqual ne compose pas) ; les 26 lignes sans source.
3. **Trois arbitrages Ciqual** : les sauces (70 entrées, 54 valeurs — une
   béarnaise est-elle un aliment ou toutes les sauces sont-elles « Sauce » ?) ;
   « Tomate - concentré » qui tombe sur *Tomate* alors que sa règle des
   transformations donnerait *Concentré de tomate* ; le séché (« Abricot
   sec » → *Abricot*, alors qu'elle a fait du fumé une exception).
4. **Sans générique auquel s'accrocher**, donc sans ligne d'équivalence :
   baguette, steak haché, petit-suisse, pamplemousse.

### Ce qu'elle a explicitement REFUSÉ, à ne pas reproposer

- **Redescendre d'un cran les génériques trop hauts** (« Chanterelle » →
  *Champignon*, « Paris-Brest » → *Gâteau*, les 22 fromages décrits par leur
  pâte → *Fromage*) : « non c bien comme ça ».
- **Le mot « kcal » sous le seuil sur trois thèmes** (glow-light 2,56 ;
  bleu-matinal et bleu-matinal-immersive 4,24) : « c ok comme ça ». Défaut
  ancien, ni créé ni aggravé par la barre — mesuré contre un build de la
  version d'avant.
- **L'effet « télévision qui s'allume »** sur les blocs d'équivalence :
  écrit, montré, puis « annule ». `src/index.css` et `MaisonSections.tsx` ont
  été rendus à leur dernier commit. Si elle y revient : animer le calque
  INTÉRIEUR, jamais `.glow-drawer-glass` qui porte le `backdrop-filter`, et
  faire survivre la couche à sa fermeture (sinon il n'y a rien à l'écran pour
  jouer l'extinction) en surveillant la bascule ouvert→fermé, car il y a
  trois chemins de fermeture.

### Défauts de la base VUS et non corrigés (règle : pas d'arbitrage, pas de correction)

Accents manquants (`20083` Epinard, `10088` Ecrevisses, `31076` Edulcorant,
`23122` Kouign Amann) ; singulier/pluriel mêlés dans une même famille
(Crevette/Crevettes, Moule/Moules, Olive verte/Olives vertes…) ; `20315`
« Céleri rave » contre trois « Céleri - rave » ; `13411` jus de citron vert
martiniquais marqué `isLiquid: false` quand ses deux voisins sont liquides ;
`1030` « Fines tranches végétales », seul nom dont le mot de tête est un
adjectif.

---

## À REFAIRE SUR DEMANDE — LE POINT DU 2026-09-04

Sa demande du 2026-09-04 : « mets dans ta todo de me refaire exactement ce
point plus tard. » Le point en question, à REPRODUIRE DANS CETTE FORME
EXACTE — elle en a besoin court et scannable, elle avait dit deux jours plus
tôt « fais moi un point j'ai trop de trucs à lire » :

1. **Fait, vérifié, COMMITÉ** (avec le nombre de commits non poussés) — une
   ligne par chantier, pas un paragraphe.
2. **Fait, vérifié, PAS COMMITÉ** — idem.
3. L'état des contrôles (`tsc`, nombre de tests, build), ce qui tourne encore
   comme agent, l'état de son serveur de développement.
4. **CE QUI ATTEND UN MOT D'ELLE**, numéroté, chaque point tenant en une ou
   deux lignes, avec la question posée telle qu'elle doit y répondre — et
   « Je pousse ? » en dernier.

Ce qui restait ouvert au moment où elle l'a demandé, à reprendre tel quel tant
qu'elle n'a pas tranché : la quantité par défaut (3 questions en attente : les
alcools forts, l'unité ml/g, le défaut posé sur la famille) ; trois chiffres de
la table d'équivalence (part de pizza 1/8 ou 1/4, huître 8 g ou 15-20 g, 26
lignes sans source) ; trois arbitrages Ciqual (les sauces, « Tomate -
concentré », le séché) ; et le push.

---

## PASSATION — SESSION DU 2026-08-31 AU 2026-09-01 (gros lot d'agents parallèles)

État à la coupure : **1 commit non poussé** (`47ed174d`), arbre propre (seuls
les 4 fichiers non suivis habituels à la racine — PDF, prototype, deux
dossiers d'images/maquettes), `tsc` silencieux, **113 fichiers de test, 2040
tests au vert**. Deux lots précédents de cette même session ONT ÉTÉ poussés et
déployés (empreinte de bundle vérifiée en ligne à chaque fois) ; **CE DERNIER
COMMIT NE L'EST PAS** — attends son mot avant de pousser, une autorisation
donnée pour un lot ne vaut pas pour le suivant (leçon posée en mémoire durable
ce jour, voir plus bas).

### Ce qui existe de neuf (repères pour la reprise)

- **Thème « Glow light »** (`themes/glow-light/`, préfixe `glwl`) : Glow avec
  un fond de page gris-bleu léger (`#eef1f5` au dernier réglage, après
  plusieurs allers-retours — vérifier la valeur en vigueur avant d'en reparler)
  au lieu du marine sombre. Header/vitrage recalculés pour rester lisibles sur
  ce fond clair. Deux purges faites sur demande : plus aucune trace du marine
  de Glow, ni du dégradé bleu-vert de Nostalgic, nulle part dans les deux
  thèmes (Glow ET Glow light) — y compris le tiroir Dynamique, qui suit
  désormais le fond de SON thème comme les trois autres tiroirs (Journal,
  Tendances, Menu).
- **Page admin « Tips UX/UI »** (`TIPS-UX-UI.md` à la racine, nouveau fichier
  jumeau de `TODO.md` — même règles de tenue, mêmes cases à cocher) : point de
  terminaison dev-server `/__tips` (calqué sur `/__todo`), page
  `TipsUxUiPage.tsx`, carte Admin dédiée. **Ordre des 4 premières cartes de la
  page Admin, tranché par elle** : Félicitations → Onboarding → Ma TODO →
  Tips UX/UI → puis le reste inchangé.
- **Page admin « Félicitations »** : n'est plus réservée à Nostalgic, visible
  sur tous les thèmes désormais.
- **Menu « Admin »** : réservé à `lisa197975@gmail.com` (affichage ET route
  bloqués pour tout autre compte).
- **Bug corrigé — poids inline dans le tiroir Journal** : la persistance ET le
  déclenchement de la confirmation/insolite (équivalences de perte) sont
  maintenant branchés depuis le tiroir, pas seulement depuis la page Balance —
  nouveau composant partagé `WeighInSubmissionCard`, en couche centrée,
  fusionnée (un seul bloc visuel), vitrée (clic pour fermer). **Appliqué aussi
  à `WeightTracker.tsx`** (la version « page ») par cohérence, signalé comme
  un choix non explicitement demandé — à confirmer si elle veut autre chose.
- **Section « Côte à côte » de la home** : chaque domaine (traitement, poids,
  repas, sommeil, activité physique, temps pour soi) porte désormais un pied
  avec bouton « Ajouter une entrée » + lien « Voir la page {Titre} » (les Pas
  n'ont pas de bouton, pas d'entrée manuelle possible pour un podomètre). Le
  libellé du domaine poids dit « Voir la page **Balance** » (tranché le
  2026-09-01 : « LE titre de la page est balance, donc balance ») — **cette
  même règle reste à appliquer** à l'étiquette « Pesée » du défilé récent
  (`recentJournal.ts:191`), question distincte posée il y a plusieurs jours et
  toujours sans réponse explicite malgré ce tranchage-ci.
- **Bug corrigé — clic qualité du sommeil** dans « Côte à côte » : ouvrait la
  page directement au lieu de la couche des sept dernières nuits, comme son
  double « durée du sommeil ». Aligné.
- **Graphe balance** (`WeeklyLossChart.tsx`) : « Évolution » renommé
  « Cadence », le bandeau de trois cellules devient deux lignes de phrase
  centrées, nouveau titre « Perte par semaine » aligné à gauche avant le
  graphe.
- **Flèches du suivi de poids** (`BlocSuiviPoids.tsx`) : bug de fond trouvé et
  corrigé — un chevron tourné à angle variable autour du CENTRE de son cadre
  déplace sa pointe visible (décalée du centre) ; corrigé en posant le pivot
  de rotation (`transformOrigin`) sur la pointe elle-même. Tildes retirés de
  la pastille hebdomadaire, libellé IMC reformulé (« IMC : −9,2 »).
- **Widget sommeil** (`SurimpressionNuits.tsx`) : textes agrandis (mini/inter/
  maxi), légende centrée, espace avant/après la ligne de titres de colonnes
  multiplié.
- **Tuiles « Progrès » de la home** : icône balance alignée en couleur/trait
  sur le reste des tuiles, icône jauge IMC restaurée en 3ᵉ ligne.
- **Bleu ensoleillé** : pastille poids/Dynamique passée du vert au bleu clair
  (`#2e8fd2` / encre `#082137`, 4,66:1) — un seul jeton partagé
  (`--glow-poids-badge-*`) couvrait les trois affichages (Balance, bloc et
  tiroir Dynamique), donc un seul endroit à corriger.

### Ce qui attend SA réponse

- **Animations de félicitation** (`CelebrationFelicitation.tsx`,
  `scenes.css`) : trois arbitrages de goût signalés par l'agent qui a posé le
  mécanisme clair/foncé, jamais confirmés depuis — le gris d'ardoise choisi
  comme repli des teintes pâles sur fond clair, la stratégie de repli
  accent/douce sur fond sombre, et la méthode (calquée sur le menu du bas) qui
  classe quels thèmes ont un vitrage sombre.
- **Étiquette « Pesée » du défilé récent** (voir ci-dessus) — à trancher
  explicitement, même règle que « Voir la page Balance » ou non.
- **Fusion des blocs de `WeighInSubmissionCard` appliquée aussi à la page**
  (`WeightTracker.tsx`) — choix de portée non demandé explicitement, à
  confirmer ou détricoter si elle veut deux rendus différents page/tiroir.
- Les gros dossiers inchangés, toujours en attente : verre des deux **Bleu
  matinal**, **console Firebase** (6 étapes manuelles), **chargement des
  journaux à cinq ans**, **Ciqual** (rappel 2×/jour), **Sidéral/Test**.

### Leçon de méthode posée en mémoire durable ce jour

**Une autorisation de pousser ne vaut que pour LE LOT pour lequel elle a été
donnée** — jamais pour les lots suivants de la même session, même après
plusieurs heures de travail coordonné. Sa correction, mot pour mot : « tu ne
dois rien pousser. Tu comit. je te dis qd pousser. » Committer reste
systématique et immédiat après vérification (`tsc`/tests) ; le push et le
déploiement attendent TOUJOURS un mot explicite à cet instant précis.

---

## NOTE POUR LE JOUR OÙ ON BRANCHE LES VRAIS DÉCLENCHEMENTS DE FÉLICITATION (2026-08-31)

Sa consigne, mot pour mot, à ne pas oublier quand ce chantier viendra (rien n'est
câblé aujourd'hui, voir `src/features/celebrations/DECLENCHEMENTS.md`) :
« ne pas oublier de brancher aussi les declenchement des felicitation de meme
façon que si hors widget ». Autrement dit : toute action qui déclenche une
félicitation depuis la PAGE dédiée (ex: enregistrer un poids sur la page
Balance) doit déclencher EXACTEMENT LA MÊME chose quand la même action est
faite depuis un WIDGET (ex: édition inline du poids depuis le tiroir Journal,
ou toute autre saisie en place ailleurs dans l'app) — même mécanique, pas de
chemin bis oublié. Vérifié aujourd'hui : le bug du poids non persisté dans le
tiroir Journal venait justement d'un chemin bis (`onUpdateWeight={RIEN}`) qui
ne rejoignait pas le circuit réel — la même vigilance vaut pour les
déclenchements de félicitation le jour où ils existeront.

---

## PASSATION — SESSION DU 2026-08-31 (matinée, 02:02 → ~11:45)

État à la coupure : TOUT poussé et déployé (trois lots : 59 + 23 + 20
commits, empreinte du bundle vérifiée en ligne à chaque fois), arbre propre,
aucun agent en cours, **2040 tests / 113 fichiers verts**, `tsc` silencieux.

### Ce qui existe de neuf (repères pour la reprise)

- **Thème « Glow »** (`themes/glow/`, préfixe `glw` — JAMAIS `glow`, c'est
  le namespace des utilitaires) : fond marine #1c314b mesuré sur le logo
  officiel, couleurs partagées avec Nostalgic À LA SOURCE (`.glw-root`
  ajouté aux sélecteurs `.nost-root` d'index.css — leçon : un thème qui
  « reprend les couleurs de Nostalgic » doit reprendre ses REDÉFINITIONS de
  racine, pas hériter du socle nu). Widgets clairs ; seuls Tendances, Menu
  et Journal gardent l'aplat marine (`3f9f875e`).
- **Page admin « Félicitations »** (Nostalgic seul : Menu → Admin → carte
  Félicitations) : 10 scènes du Septième ciel portées en React (contrainte
  native), 12 liens de démo. LA SPEC DES DÉCLENCHEMENTS est dans
  `src/features/celebrations/DECLENCHEMENTS.md` — complète et tranchée
  (y compris le début entre le 14 et la fin du mois) ; AUCUNE mécanique
  réelle n'est branchée, c'est le prochain chantier quand elle le dira.
- **La home servie s'appelle « sections »** (`homes/sections/`,
  `MaisonSections`) — migration de stockage à la lecture (`homeChoice.ts`,
  les anciennes valeurs `fines-lignes`/`carre` traduites). La home
  STANDARD est HORS JEU (« on n'utilisera jamais ») — zéro finition.
- **`computeSubmissionInfo`** (`src/features/weight/submissionInfo.ts`) :
  la décision du bandeau de confirmation de la Balance, extraite et testée ;
  le dossier des scénarios (insolite à tort) est CLOS, tout tranché.
- **Vocabulaire** : page Balance dit « saisie », les portes « aller à la
  page balance » (`2ccff5da`). Inventaires exhaustifs « pesée »/« sport »
  du jour : dans le rapport de session (56+8 emplacements front servis).

### Ce qui attend SA réponse

- **Étiquette « Pesée » du défilé récent** (`recentJournal.ts:191`) —
  question posée (« Balance » ?), pas de réponse encore ; onglet de menu
  « Pesée » et carreau rapide non visés par sa dictée, à aligner si elle
  le demande.
- **FAQ et onboarding** : mise à jour GLOBALE à venir (sa décision — ne pas
  y toucher au détail).
- Les gros dossiers inchangés : verre des deux **Bleu matinal** (le plus
  lourd), **console Firebase** (6 étapes manuelles, rules jamais
  déployées), **chargement des journaux à cinq ans**
  (`ARBITRAGE-CHARGEMENT-JOURNAUX.md`), **Sidéral/Test** (aligner ou
  laisser), **Ciqual** (`PASSATION-CIQUAL.md`, rappel 2×/jour).

### Leçons de la session (payées, à ne pas repayer)

- **Beaucoup d'agents en parallèle** : ça tient si (1) un fichier = un
  agent, MaisonSections/App.tsx sont les goulots ; (2) `git add` par
  pathspec TOUJOURS (un agent a embarqué les renommages stagés d'un autre —
  défait au `reset --soft`) ; (3) réveil DIRECT des agents en attente dès
  que la dépendance committe.
- **Republier un artifact existant** exige d'avoir LU la version en ligne
  intégralement (le publish est refusé sinon) — prévoir ce coût.
- Le rapport d'inventaire pesée/sport est dans la transcription de session
  du 2026-08-31 (fichier:ligne pour chaque occurrence) — le régénérer au
  besoin coûte un agent Explore (~10 min).

---

## ARBITRAGES TRANCHÉS LE 2026-08-31 AU MATIN (session du jour)

- **Pastilles qualité/durée du graphe sommeil** : le VOILE à 30 % de la
  couleur de série (fond sans contour, `86f85995`) est VALIDÉ par elle
  (« tres bien comme ça, validé ») — pas d'aplat plein, pas de couple
  aplat/encre neuf à créer dans le socle et les feuilles. Clos.
- **Home standard** : « on n'utilisera jamais home standard » — plus aucun
  arbitrage ni finition ne la concerne (mémoire durable posée).
- **Scénarios de la confirmation de pesée** (suite du bug insolite corrigé
  `d2e8d085`), tranchés le 2026-08-31 :
  - édition du poids de départ → **pas de fête** (corrigé : le drapeau
    `isStartingWeight` est posé par le calcul, la garde du rendu joue) ;
  - reprise partielle (dernière pesée qui remonte mais perte globale
    positive) → **on félicite quand même** (« au global on a toujours
    perdu ») — comportement actuel validé, rien à changer ;
  - déplacement vers le futur → exemple donné, TRANCHÉ : « c bien comme ça
    on garde » — la date du journal fait foi, rien à changer ;
  - pesée antidatée devenant départ → expliqué, TRANCHÉ : « on laisse tel
    quel » — pas de recalcul du « depuis le début » dans cette confirmation.
  Le dossier des scénarios de confirmation de pesée est CLOS.

- **Encres blanches du header Nostalgic sur le nouveau vitré (~2,5:1)** :
  VALIDÉES par elle (« je valide ») — exception assumée, cohérente avec le
  ciel nu à 2,92:1 accepté le 30/08. Ne plus le remonter.
- ~~**Le verre du menu du bas (slate-900 à 0,80, plus assorti au header)**~~ —
  FAIT le 2026-08-31 (« assorti le vitré du menu bas au vitré du header sur
  nostalgy », le commit du jour qui porte cette dictée) : le header validé au
  vitrage « Plein ciel », le menu prend le même verre — rgb(1 167 177 / 0.55),
  blur 16 px / saturate 1,4 déjà alignés depuis le 30/08, seule la couleur a
  changé (les deux règles `.nost-root .glow-frosted-bar` d'`index.css`).
  ENCRES RE-MESURÉES sur le composite verre-sur-carte-blanche
  ≈ rgb(115 207 212) : actif #e0f2fe 8,31:1 → **1,58:1** (seuils 3:1 picto /
  4,5:1 libellé), inactif #aebbcc 4,89:1 → **1,07:1** (strictement invisible).
  L'ARBITRAGE ACTIF/INACTIF EST TRANCHÉ le même matin (« nostalgy menu du bas
  vitré : passe les icones en mode foncé sur fond clair », le second commit du
  jour sur ce chantier) : actif **#082137** (marine profond du thème, l'encre
  du mot-symbole) à **9,04:1** (8,78:1 au pire fond), inactif **#334155**
  (slate-700) à **5,72:1** (5,56:1 au pire) — hiérarchie du fond clair, l'actif
  le plus sombre. Aucun aplat derrière l'item actif (couleur + graisse seules,
  vérifié dans les deux gabarits d'App.tsx). Le « + » rond central partage
  `nost-plus-on` sur SON dégradé sky-500→blue-600 : le foncé y tient 5,91:1 /
  3,17:1 (seuil picto 3:1), mieux que l'ancien clair sur sky-500 (2,42:1).
  Refermé.

## PASSATION — SESSION DU 2026-08-30 AU 2026-08-31 (nuit entière, trois plantages)

État à la coupure : **38 commits non poussés**, arbre de travail PROPRE, aucun
agent en cours, `tsc` silencieux, **103 fichiers de test et 1914 tests au vert**.
Le dernier push ET le dernier déploiement remontent au milieu de la session
(`7f1ac895`) : **tout ce qui suit n'est ni poussé ni en ligne**.

### CE QUI ATTEND SA RÉPONSE — à lui reposer, elle n'a pas tranché

  1. **LE VERRE DES DEUX BLEU MATINAL.** C'est le plus gros. Sur `bleu-matinal`
     et `bleu-matinal-immersive`, AUCUNE encre ne dépasse 4,07:1 sur leur verre
     actuel — mesuré sur 19 fonds de bloc. Ces deux thèmes échouent dans presque
     tous les relevés du site. La seule sortie est le VERRE FUMÉ sombre (plancher
     remonté à 5,90:1, essayé sur copie jetable), mais il **change leur visage
     sur tout le site**. Décision d'habillage, pas de contraste : elle seule
     peut la prendre. Ne pas la préempter, ne pas poser une rustine de plus.
  2. **LA PASTILLE DE POIDS NE SE DÉTACHE QU'À 1,93:1** de son bloc, depuis
     qu'elle porte la couleur exacte de la courbe (sa demande, `79260e28`). Le
     texte est à 10,46:1, c'est la FORME qui se dissout. Aucune encre ne répare
     cela. La sortie proposée et non faite : cerner la pastille d'un filet.
  3. ~~**LE LP1 DU HEADER DE NOSTALGIC**~~ — TRANCHÉ le 2026-08-31, en trois
     temps : « theme nostalgic : GLP1low du header : LP1 passe en bleu
     marine » (#0a4363, 5efdd4fa), « lp1 : en vert plutot » (emerald-950
     #022c22, ea959ba3), puis « vert lp1 : prend le vert du coin haut droit
     du fond » : le LP1 du header lit `var(--glow-palette-emerald-400)` — le
     stop exact du coin du ciel, oklch(76.5% .177 163.223) ≈ rgb(0 212 146),
     plein. Contrastes mesurés et ASSUMÉS par elle : 1,11:1 sur le ciel nu,
     1,19:1 sur le verre « Plein ciel », 1,00:1 sur le coin — le LP1 est une
     nuance du ciel, pas une encre de lecture ; ne pas « réparer » sans
     nouvelle dictée. Voir le commentaire de la règle
     `.nost-root .nost-topbars .nost-wordmark-lp1` dans `src/index.css`.
  4. **« Mes préférences de compte »** — un agent a corrigé SA formulation du
     2026-08-30, qui disait « Mes paramètres de compte ». Convention contre
     lettre : elle doit trancher.
  5. **La couche peut s'ouvrir sur une période VIDE** (calendrier paramétrique
     resté sur 30 jours, tuile montrant une moyenne depuis le début). Faut-il
     que cette porte force une fenêtre large ? Et le bloc du temps pour soi dit
     alors le vide SANS dire la période, parce que « pas de texte avant/après »
     la lui a retirée.
  6. Le **dégradé par rang** de « De quoi c'est fait » (écarté, le veut-elle ?),
     le **titre « Mes moments »** (inventé faute de mieux), les **deux pointillés
     identiques** de l'échelle d'IMC (tige de départ / tic de cap), la **casse de
     `Glp1LOW.com`**, les **noms d'activités** (« Sports collectifs » — mon avis :
     les laisser, c'est le nom français de la chose), et le **teal des pastilles
     de la Balance** qui reste « bonne nouvelle » même sur une reprise de poids.
  7. **Planche « Nuits »** — https://claude.ai/code/artifact/5145f51a-4dbf-40e6-be18-0d611624af86
     Trois questions ouvertes : le nombre de teintes pour les six crans de
     qualité, le sélecteur du bloc hebdomadaire, et le sort des blocs eux-mêmes
     (rien n'est codé, tout est simulation, générateur dans `simulations/nuits/`).

### DEUX RISQUES HORS DÉPÔT

  - **`Social-app-GIT-REPO`** porte un commit NON POUSSÉ (`fa1e332`) et des
    modifications non commitées sur `glow-carte-sociale.html` et
    `PASSATION-publication-sociale.md` — la SOURCE DE VÉRITÉ de la carte
    sociale, recopiée à la main dans `public/social/carte.html`. Si le disque
    lâche, la correction du rebrand est perdue.
  - Quatre fichiers non suivis traînent à la racine du dépôt :
    `Bilan_GLP1_*.pdf`, `glow-prototype.html`, `images pour claude/`,
    `maquettes-design-2026/`. Ni commités, ni ignorés.

### CE QUE LA NUIT A APPRIS, ET QUI VAUT POUR TOUS LES PROCHAINS LOTS

  - **NE JAMAIS LIRE UNE COULEUR DANS UN COMMENTAIRE.** `#0369a1` y est appelé
    « le bleu de la courbe de poids » : c'est l'encre « perte » du bilan, qui le
    NOMME sans l'être. La courbe porte `var(--glow-chart-soft)`, #6dc3fe. Deux
    commits ont été perdus à cause de cette lecture.
  - **PIÈGES DE BANC, tous payés au moins une fois cette nuit** : recadrer sur le
    rectangle des GLYPHES (un `Range`) et non sur la boîte — mais BORNER ce
    rectangle par l'élément, il déborde quand `glow-digits` excède la hauteur de
    ligne ; capturer la page ENTIÈRE et recadrer ensuite, une capture recadrée
    ment sous un `backdrop-filter` (0,0619 contre 0,9085 sur le même rectangle) ;
    attendre que la couche soit ENTRÉE, la première image rend la trame
    précédente ; un percentile fixe ment sur un texte fin ; et **un contraste
    identique au centième sur les vingt thèmes n'est jamais une encre, c'est un
    rectangle sans encre**.
  - **L'ARBRE PORTE LE TRAVAIL D'AUTRES AGENTS** : pour mesurer HEAD pur, faire
    une extraction (`git archive`), jamais toucher au dépôt.
  - **Les agents partagent le scratchpad de session** et s'écrasent leurs
    scripts : chacun doit s'isoler dans un sous-répertoire et prendre ses ports.
  - **Un test peut être vert et fragile** : `badgeCelebration` n'était rouge
    qu'entre minuit et 8 h, parce que son montage horodatait à 08:00 un repas du
    jour, écarté par la règle de l'instant t (`d93b51f4`, 2026-08-04). Horloge
    figée dans le test, attente conservée. AUCUN badge « or » n'a été perdu.

### DETTES CONNUES, NON TRAITÉES

  - **`versions/initiale/App.tsx:675`** compose son infobulle à la main : le
    libellé vient de la source, le FORMAT y est écrit deux fois.
  - **Aucun composant React n'est montable en test** — le dépôt n'a pas de
    `@testing-library`, les tests tournent en Node. Les contrats sont tenus, pas
    les rendus.
  - **Le formulaire de recette** (3 emplacements) n'a jamais pu être atteint au
    pilotage : les fibres y sont corrigées sans avoir été vues.
  - **La carte de partage du sommeil** : aucun bouton atteint en Chrome sans
    tête, libellé non vu.
  - **Le bilan métabolique de la Mixte n'est atteignable par rien** — branche
    dormante, montée en forçant l'onglet.

---

## ARBITRAGE À LUI DEMANDER — le chargement des journaux à cinq ans (2026-08-29)

Sa consigne : « grave dans ta todo de me demander de trancher ce sujet ». La
discussion entière est consignée dans **`ARBITRAGE-CHARGEMENT-JOURNAUX.md`**
(racine du dépôt) : le volume visé (5 à 7 000 entrées de repas à cinq ans), la
cible React Native et ses listes virtualisées par défaut, le coût du
`JSON.parse` au lancement, et surtout LE PIÈGE — pendant un chargement partiel,
les chiffres agrégés de la home seraient faux, et silencieusement.

**Rien n'est décidé, rien n'est codé.** Le relire AVANT d'en reparler, pour ne
pas lui refaire le chemin.

- [ ] La forme du stockage : un JSON découpé par période, ou SQLite ?
- [ ] Le résumé précalculé (perte totale, cumuls par jour) : on l'écrit ?
- [ ] La fenêtre du tiroir : combien de jours, « voir plus » ou défilement ?
- [ ] Quand : maintenant, ou au portage React Native ?

Une seule chose gagne à être décidée TÔT, et elle ne coûte rien : structurer les
journaux comme un tableau trié plat avec en-têtes de section, la forme qu'attend
une `SectionList`. Le reste peut attendre le portage.

## PASSATION — SESSION DU 2026-08-29 (journée entière)

Tout est **poussé** (`dc5f7e1c`) et **déployé** sur `glow-private.web.app`,
empreinte du bundle vérifiée en ligne. Arbre propre, `tsc` propre, 1709 tests.
Le déploiement se fait TOUJOURS depuis une copie propre de HEAD dans un worktree
jetable — des agents laissent du travail non commité dans l'arbre, et bâtir là
mettrait en ligne des chantiers à moitié faits.

La passation du MATIN, plus bas, reste valable pour ce qu'elle décrit ; celle-ci
la complète et prime en cas de désaccord.

### Ce qu'elle doit trancher, et que je dois lui reposer

- [ ] **Console Firebase — six étapes**, sans lesquelles aucun courrier de
      sondage ou de feedback ne part (détail dans le commit `e02511f3`) : plan
      Blaze, base Firestore `eur3`, publication de `firestore.rules`, mot de
      passe d'application Gmail, extension « Trigger Email » sur la collection
      `mail`, vérification des journaux. **Les règles ne sont PAS déployées** —
      je n'ai jamais déployé que l'hébergement.
- [ ] **Trois contrastes sous 4,5:1, tous PRÉEXISTANTS**, qu'aucun agent n'a
      voulu forcer seul : `text-slate-400` des mentions secondaires à 2,56:1
      (identique sur les pages) ; la pastille dorée d'un badge gagné à 2,88:1
      sur Nuit étoilée — l'or y porte le sens ; sur Bleu matinal, deux encres
      que la feuille elle-même rend trop claires. Les corriger demande des
      couleurs NOUVELLES, ce que la règle des trois étages interdit : chantier
      à part.
- [ ] **Le format des durées** : `formatCalendarDuration` écrit « 45min » sans
      espace, là où elle écrivait « xx min » (`2d97170b`). Forme existante du
      site, gardée pour ne pas en introduire une seconde.
- [ ] **Le chargement des journaux à cinq ans** : tout est dans
      `ARBITRAGE-CHARGEMENT-JOURNAUX.md` (`d0344345`).
- [ ] **Chantier Ciqual** : inchangé, `PASSATION-CIQUAL.md`.
- [ ] **Sidéral et Test** : ces copies gelées divergent un peu plus à chaque
      passe — ancien menu (aucune section Export), minutes nues dans le module
      des pas, blocs absents par principe. On les aligne ou on les laisse ?

### Ce que je peux reprendre sans elle

- [ ] **Deux bandeaux empilés** dans les surimpressions du niveau sanguin et des
      graphes de « Tendances » : `SurimpressionVitree` pose son titre, puis le
      bloc monté remet le sien (« NIVEAU SANGUIN ACTIF » deux fois).
- [ ] **La couche des équivalences insolites n'a pas de carte** : sa tuile est à
      nu (`gbare-smooth`, ni `bg-white` ni arrondi), donc invisible aux règles
      d'habillage des feuilles. Pas une régression, mais elle n'a pas
      « l'apparence de sa page » que le reste a désormais.
- [ ] **Un pixel de débordement horizontal** sur le libellé « Notifications » du
      menu : il porte `truncate`, donc `white-space: nowrap`, et sa largeur
      minimale pousse la colonne. Le faire céder afficherait « Notification… ».
- [ ] **Le tiroir du menu coupe FAQ et Ciel à 360×640** (28 px sous la barre) —
      défaut PRÉEXISTANT, mesuré identique avant et après l'ajout des Badges.
- [ ] **La colonne L/P/1 du mot-symbole a perdu sa nuance** dans les bandeaux
      (`dc5f7e1c`) : accent calibré sur le ciel, à 1,25:1 sur un bandeau clair,
      elle hérite donc comme le reste.
- [ ] **Le cas mixte injection/comprimé** du médaillon de « Côte à côte » est
      structurellement inatteignable : `currentTreatmentSeries` coupe au
      changement de traitement, donc les deux colonnes résolvent la même forme.
      La branche est écrite et prête ; il faudrait que la colonne « début » lise
      la première prise de TOUT l'historique — autre geste, à demander.

### Ce qu'elle a explicitement mis de côté

- Le **doublon du bloc « suivi du poids »** : extrait dans `BlocSuiviPoids.tsx`
  ET toujours en clair dans `Maison.tsx`. « On laisse tel quel pour l'instant,
  pas de problème » (2026-08-29). Les retouches du 29 ne portent que sur la
  variante de surimpression ; la home standard rend ce qu'elle rendait.

### Les pièges de méthode, tous payés cette journée

1. **La clé Firebase se VIDE, elle ne se remplace pas** — sinon le verrou reste
   armé et on ne mesure que la page de connexion.
2. **Un serveur statique sert un répertoire supprimé** après reconstruction,
   indéfiniment et sans erreur → `scripts/servir-dist.sh`, qui libère toujours
   le port et affiche le répertoire réellement servi.
3. **Un build peut échouer EN SILENCE derrière un `| tail`** : `set -e` ne voit
   pas l'échec derrière un tuyau. `set -eo pipefail`, et vérifier la présence de
   son code dans le bundle AVANT toute mesure.
4. **Un commentaire `{/* … */}` posé directement dans une expression JSX casse
   le build.** Payé deux fois le 2026-08-29, par moi.
5. **Lire les PIXELS, pas le DOM** : un SVG présent et bien dimensionné peut ne
   rien peindre ; une règle CSS peut être jetée par le minificateur ; un texte
   peut être blanc sur blanc sans que rien ne le dise.
6. **Paralléliser dès que les demandes sont disjointes** — quand plusieurs
   visent le même gros fichier, sortir chaque morceau dans SON fichier neuf et
   ne garder dans le fichier commun que le branchement, que je fais moi-même.

## PASSATION — FIN DE LA SESSION DU 2026-08-29 (matin)

Tout est **poussé** (`30554335`) et **déployé** sur `glow-private.web.app`,
empreinte du bundle vérifiée en ligne. Arbre propre. Le déploiement se fait
depuis une copie PROPRE de HEAD dans un worktree jetable, jamais depuis l'arbre
courant : des agents y laissent du travail non commité, et bâtir là mettrait en
ligne leurs chantiers à moitié faits.

### Ce qu'elle doit trancher ou faire elle-même

- [ ] **Console Firebase, six étapes** avant qu'un seul courrier ne parte (le
      détail est dans le commit `e02511f3`) : plan Blaze, création de la base
      Firestore (`eur3`), publication de `firestore.rules`, mot de passe
      d'application Gmail pour `glp1low@gmail.com`, installation de l'extension
      « Trigger Email from Firestore » sur la collection `mail`, vérification
      des journaux. **Les règles ne sont PAS déployées** — je n'ai déployé que
      l'hébergement. En attendant, tout fonctionne : les documents s'accumulent
      dans `mail` sans être expédiés, aucun envoi n'est bloqué.
- [ ] **L'heure des entrées de journal est en `text-sky-400`** (#38bdf8), soit
      2,14:1 sur une carte blanche. Ce n'est pas un effet de thème : c'est la
      couleur choisie dans le gabarit, et elle vaut aussi sur les pages. La
      corriger (un `sky-600` donnerait ~4,9:1) change la teinte de l'heure dans
      TOUS les journaux du site — d'où son arbitrage.
- [ ] **Chantier Ciqual** : inchangé, tout est dans `PASSATION-CIQUAL.md`.

### Ce que je peux reprendre sans elle

- [ ] **Tiroir journal : l'édition n'est pas branchée.** Le tiroir REGARDE ;
      supprimer, modifier ou gérer les listes renvoie à la page. L'agent avait
      câblé les gestionnaires puis les a retirés en découvrant que `App.tsx`
      était tenu par un autre — plutôt que de committer le travail d'autrui. Le
      branchement ne coûte qu'un bloc de props dans `App.tsx`, désormais libre ;
      la marche à suivre est décrite dans `JournalDrawer.tsx`.
- [ ] **Tiroir journal, cadre 320×568 : seul recouvrement du « + » qui
      subsiste** (+14 px, 4 éléments — la 3ᵉ ligne des cases « Un temps pour
      soi » et « Pas »). Son contenu déborde le panneau de 23 px : c'est le
      CONTENU qui doit se resserrer, jamais la marge qui saute. Une entrée de
      moins par case sous ~600 px de haut, ou un `clamp()` sur l'interligne.
- [ ] **Bug d'heure d'été, Initiale et Cartes** (relevé le 2026-08-29, non
      corrigé) : `getChartData` avance de `currentMs += 3 h` depuis un midi puis
      teste `getHours() === 12`. Après le changement d'heure, l'heure locale
      glisse à 13 h et PLUS AUCUN point n'est retenu — la courbe de poids
      s'arrête fin mars (29 midis trouvés sur 188 jours). Mixte y échappe
      (`cursor.setHours(cursor.getHours() + 3)`). Correctif dans
      `WeightTracker.tsx` de ces deux versions.
- [ ] **Sidéral et Test : le bloc « Salut » affiche encore l'ancien objectif**
      (−23,4 kg au lieu de poids cible − poids actuel). Ces deux thèmes tiennent
      leurs propres copies, gelées ; sa demande du 2026-08-29 n'a été appliquée
      qu'à la home de la Mixte. À aligner si elle le veut.
- [ ] **Contrastes préexistants sous 4,5:1**, tous signalés et aucun introduit
      par cette session : `text-slate-400` à 2,56:1 (encre des mentions
      secondaires, identique sur les pages depuis toujours) ; les trois lignes
      « Créneaux hauts en… » de `TimeSlotTable` (1,67 à 3,12 selon le thème) ;
      `EstimateDisclaimer` à 2,07 sur Aurore ; sur Aurore, `text-slate-600`
      lui-même plafonne à 4,01:1 dans ces cartes. Chantier à part.
- [ ] **À 320 px, le titre du bandeau « Composition moy. / h » déborde
      visuellement** sur « du … à … » — mesuré identique en vue tableau et en
      vue barres, boîtes DOM jointives, c'est le texte peint qui dépasse.
      Préexistant, dans le bandeau commun.

### Deux pièges de vérification payés cher ce jour-là

1. **La clé Firebase se VIDE, elle ne se remplace pas.** `isAuthConfigured` vaut
   `apiKey !== ''` : une chaîne factice laisse le verrou ARMÉ et on ne mesure
   que la page de connexion. Éditer `apiKey: ''` dans la copie jetable.
2. **`rm -rf` du répertoire servi ne coupe pas le serveur.** `python3 -m
   http.server` garde son répertoire par son inode : après `rm -rf srv && cp -R
   dist srv`, il sert l'ANCIEN build supprimé, indéfiniment et sans erreur. Tuer
   et relancer après chaque reconstruction, ou servir sur un port neuf.

Et la règle qui prime sur les deux : **lire les PIXELS, pas le DOM.** Un SVG
présent, bien dimensionné et de bon `viewBox` peut ne rien peindre.

## EXTINCTION DES MODULES TRAITEMENT ET EFFETS — CE QUI RESTE (2026-08-29)

Sa demande : « injection et effets secondaires desactivés-> propager bien
partout les affichages et comportements de module desactivé ». Le gros est
fait (commit `a8856ac6`) ; ces points-ci n'ont pas pu être traités parce que
leurs fichiers étaient tenus par d'autres agents au même moment. À reprendre
dès qu'ils sont libres, en employant `isModuleOn(profile, id)` et JAMAIS le
drapeau nu — un drapeau jamais écrit doit valoir ALLUMÉ, sans quoi les cures
déjà enregistrées perdraient leur page principale.

- [ ] `MaisonSections.tsx` (ex-`MaisonFinesLignes.tsx`, renommée le 2026-08-31) :
      le carré de traitement et la tuile de niveau
      sanguin de « En direct » à conditionner par `isModuleOn(…, 'injection')` ;
      les tuiles de traitement des « repères de la cure » (compte de prises,
      dosages, fréquence) de même ; les rangées d'effets secondaires de
      « Côte à côte » par `'symptoms'` — mais elle a demandé le 2026-08-29 de
      les SUPPRIMER de cette zone, donc à vérifier après ce retrait. La rangée
      des « + » filtre déjà par `bottomMenuTabs` : rien à y faire.
- [ ] `JournalDrawer.tsx` et `TrendDrawer.tsx` : vérifier que l'état `enabled`
      de leurs cases vient bien de `isModuleOn` et non du drapeau nu — sinon
      le traitement et les effets s'y afficheraient grisés à tort sur les
      anciens profils.
- [ ] `RecentJournalStrip.tsx` : le défilé de la home montre les entrées de
      traitement et d'effets ; à filtrer si elle veut qu'elles disparaissent.
      Pas demandé explicitement — à lui poser quand le reste sera vu.

DEUX POINTS TRANCHÉS PAR L'AGENT, à connaître : le RAPPORT MÉDICAL garde les
prises même module éteint (c'est un document pour un médecin, bâti sur des
données déjà saisies : éteindre un suivi règle l'affichage quotidien, pas la
relecture d'un historique) ; l'ONBOARDING ne propose pas ces deux modules,
ils restent donc allumés à la création d'un profil.

## IMAGE D'ÉQUIVALENCE : DEUX LIGNES À REPRENDRE (2026-08-29)

Un agent a trouvé comment rendre l'objet de « Depuis le début » lisible
(23 → 35 px) sans que la rangée bouge, mais n'a pas pu committer :
`MaisonFinesLignes.tsx` (aujourd'hui `MaisonSections.tsx`) était tenu.
Les deux lignes, dans `lossTile` :
`leading-none` sur le `<p>` du chiffre (le paragraphe gardait 4 px
d'interligne que le `<span>` n'avait pas), et `gap-0.5` → `gap-0` sur le
bouton. Mesuré : rangée inchangée (73 px), les trois autres tuiles
inchangées.

- [ ] Les appliquer dès que le fichier est libre, et vérifier au rendu.

---

## CHANTIER CIQUAL — rappel actif 2×/jour (consigne du 2026-08-28)

**Sa consigne, mot pour mot : « mets dans ta todo de me demander 2 fois par
jour au moins de reprendre ce chantier, peu importe si dans la même session
ou session différente ».** Donc : toute session active lui propose AU MOINS
deux fois par jour (matin et après-midi) de reprendre le chantier Ciqual —
jusqu'à ce qu'elle le clôture ou annule le rappel. L'état complet du
chantier est dans **`PASSATION-CIQUAL.md`** (racine du dépôt) : fiches
menteuses (72 kcal fabriquées sur macros trouées), règles d'extraction
reconstituées, décisions en attente (null+masquage vs complétion 2020,
signalements, sous-jeu martiniquais). Ne rien corriger sans son arbitrage.

- [x] Rappel du matin fait aujourd'hui ? (2026-08-30, 07 h — rappel planifié ; proposé pendant la session des surimpressions. Rien corrigé dans la base : son arbitrage n'est toujours pas rendu)
- [ ] Rappel de l'après-midi fait aujourd'hui ? (2026-08-30)

---

## LA CONVERSION REACT NATIVE ET LE MULTILINGUE — consigne de passation (2026-08-19)

**0. LA SÉCURITÉ D'ABORD — consigne d'elle du 2026-08-26, mot pour mot :
« qd on fera la conversion react native, oit particulierement attentif à la
sécurisation de l'app pour qu'elle ne puisse jamais etre un bacdoor pour une
attaque ni rien ».** À traiter comme une exigence de premier rang du jour de
la conversion : surface d'attaque minimale (aucune permission native non
justifiée, aucun port ouvert, pas de WebView résiduelle), données de santé
chiffrées au repos et en transit, secrets hors du bundle, dépendances
auditées (npm audit + verrouillage), deep links validés strictement (les
paramètres type `?theme=` de l'aperçu web ne doivent pas devenir des
vecteurs), points d'écriture du serveur de dev (TODO/Ciqual) ABSENTS du
build natif, et revue de sécurité dédiée avant toute distribution.

**0 bis. LE NATIF POUR DE VRAI — consignes d'elle du 2026-08-27, mot pour
mot : « A la converion en react native : / les notifications mises en place
doivent donner lieu à de vraies notifications du telephone / le scan de barre
code doit etre un vrai scan avec l'appareil photo et pas la saisie du barre
code - saisie a la main possible si scan avec l appareil photo echoue (dans ce
cas là logger en base echec de scan barre code avec l'heure de l'incident la
versio de l'app et toute autre information anonyme relevant qu'on peut
legalement recuperer) / le podometre doit etre le podometre reel du
telephone ».** Concrètement :
- Les rappels (traitement, rendez-vous médecin…) déclenchent de VRAIES
  notifications système du téléphone, pas des affichages dans l'app.
- Le scan de code-barres se fait à l'APPAREIL PHOTO ; la saisie à la main
  n'est qu'un repli en cas d'échec du scan — et chaque échec est journalisé
  en base : heure de l'incident, version de l'app, et toute autre information
  ANONYME pertinente qu'on peut légalement récupérer (modèle d'appareil, OS…
  — jamais de donnée de santé ni d'identifiant personnel dans ce log).
- Le podomètre lit le compteur de pas RÉEL du téléphone (c'est la raison
  d'être du choix React Native — voir la mémoire : jamais de webview).

**À lire par la session qui fera la conversion. Rien de tout ceci ne se fait
aujourd'hui** — c'est ce qu'il faudra faire LE JOUR VENU pour que le passage au
multilingue coûte le moins possible. Sa demande, mot pour mot : « consigne ça
tres clairement dans ton fichier de passassion pour que quand tu fasses la
conversion tu fasse bien ce qu'il faut pour optmisier le passage en
multilingue ».

**L'ordre arrêté** (discussion du 2026-08-19) :
design terminé → suppression des versions gelées → conversion React Native
**avec** sortie des textes en dictionnaires → traduction en tout dernier.

**1. Une conversion, une seule fois, une seule source vivante ensuite.**
« Reconvertir » n'existe pas : après la conversion, TOUTES les modifications se
font sur la version native, et le site web actuel est gelé puis supprimé —
exactement la règle des deux designs (« deux versions vivantes en parallèle
pourrissent en parallèle »). Ne jamais accepter un flux « je modifie le web
puis on reconvertit ».

**2. La sortie des textes se fait PENDANT la conversion, écran par écran.**
C'est le cœur de la consigne. Chaque écran réécrit en natif naît en lisant ses
mots dans un fichier de dictionnaire — JAMAIS un texte en dur dans un écran
natif, pas un seul, dès le premier. Le modèle existe et il est validé :
`features/onboarding/onboarding.content.ts` — un fichier qui ne porte QUE des
mots, des clés typées par des unions (une clé de trop ou de moins ne compile
pas), des identifiants stables pour les listes ouvertes, zéro style, zéro
logique. Le faire AVANT la conversion repasserait deux fois sur tous les
écrans ; le faire APRÈS serait une chasse aux chaînes sur du code neuf. Pendant,
c'est un seul passage.

**3. Les grandeurs restent canoniques, et la conversion vit aux deux bouts.**
Tout est stocké en unités de base (kg, g, ml, cm), le profil porte déjà le
choix métrique/impérial (`measurementSystem`, absent vaut métrique). À la
conversion : l'affichage ET la saisie convertissent, le stockage jamais. Toute
grandeur nouvelle qui naîtrait autrement est un défaut.

**4. Dates et nombres passent par des fonctions de format, jamais par des
chaînes construites à la main.** Aujourd'hui l'app écrit la virgule décimale
française et des dates françaises ; le jour du multilingue, seules les
fonctions de format changent — à condition qu'aucun écran n'assemble lui-même
un « 70,5 kg » ou un « 19 août ».

**5. Le genre est une dimension des textes.** Des tournures accordées au
masculin existent (les quatre souhaits d'activité de l'onboarding : « être un
peu plus actif ») et le profil porte le genre (homme/femme/neutre). Le
dictionnaire doit permettre des variantes par genre OU des tournures neutres —
décision d'écriture à lui reposer le moment venu, mais la STRUCTURE doit le
permettre dès la conversion.

**6. Le plus gros coût caché : la base alimentaire est française.** Ciqual —
les noms d'aliments, l'autocomplétion, les noms courts curés depuis des
semaines. Traduire l'interface ne traduit pas la base. Trois issues, décision
à elle le jour venu : traduire la base, brancher une base anglophone, ou
garder les aliments en français sous une interface traduite. À poser AVANT de
promettre une date pour l'anglais.

**7. D'ici là, une seule discipline au quotidien** : tout NOUVEAU gros bloc de
texte (pages légales, CGU, FAQ, textes de la page ciel…) naît dans un fichier
de mots à part, sur le modèle de l'onboarding — jamais éparpillé dans les
écrans. Les textes existants, eux, ne bougent pas avant la conversion.

**Contexte utile à la session de conversion** : la logique pure et ses tests
passent tels quels ; le stockage est derrière une couche unique ; « jamais de
hover » et « aucun popup » jouent pour le tactile ; le kaléidoscope prouve
qu'un thème peut changer sans rechargement (il n'y a pas de rechargement en
natif) ; les thèmes devront être extraits des feuilles CSS en objets de jetons
— c'est le chantier de conversion le plus délicat, distinct du multilingue.

---

## À arbitrer (décisions à toi)

### Bloc insolite de la Balance — scénarios voisins du bug du 31 août 2026, énoncés SANS correction

Le bug dicté (déplacer la pesée de 100 kg au 05/08 déclenchait l'insolite au
nom d'une autre pesée) est corrigé : la confirmation parle désormais de la
pesée touchée, jugée à sa place dans le journal, et une reprise ne fête rien.
En balayant la même logique, voici ce qui reste à trancher — rien n'a été
corrigé sans ton accord :

- [ ] **Éditer le poids de départ peut encore fêter une « perte » fictive.**
      Journal réduit au seul départ : le corriger de 90 → 85 kg fait fêter
      « -5 kg depuis le début » — la perte se mesure contre l'ANCIEN départ
      (le calcul lit le journal d'avant le re-rendu), et le drapeau
      `isStartingWeight` de la confirmation n'est JAMAIS posé, donc sa garde
      dans le rendu ne protège pas (le bandeau « Votre poids de départ a bien
      été mis à jour » n'apparaît d'ailleurs jamais, faute du même drapeau).
      Attendu : l'édition du départ ne fête rien et son bandeau parle de
      départ. *Mon avis : à corriger — poser le drapeau depuis la ligne
      confirmée, deux lignes.*

- [ ] **Une reprise partielle fête encore « depuis le début ».** Départ 90,
      pesée 79, puis nouvelle pesée du jour à 85 kg : la « dernière perte »
      (-6, une reprise) se tait, mais « Depuis le début : -5 kg » s'ouvre en
      insolite le jour même d'une reprise de 6 kg. Attendu : discutable — la
      perte cumulée est réelle, mais fêter le jour d'une reprise surprend.
      *Mon avis : ne fêter que si la dernière pesée ne remonte pas ; à toi de
      dire si la perte cumulée mérite sa fête quand même.*

- [ ] **Déplacer une pesée VERS le futur fête à sa nouvelle place.** Les
      79 kg du 10/08 déplacés au 20/08 passent derrière les 100 kg du 15/08 :
      l'insolite fête -21 kg contre ce nouveau voisin, sans pesée réelle ce
      jour-là. Attendu : conforme à la règle saine (elle EST la plus récente
      du journal à sa nouvelle date, la perte est réelle dans l'ordre du
      journal). *Mon avis : légitime, rien à faire.*

- [ ] **Une pesée antidatée AVANT le départ devient le départ** (invariant du
      2026-08-17) : sa confirmation mesure encore « depuis le début » contre
      l'ancien départ, pour la même raison de journal lu avant re-rendu.
      Cas rare, sans insolite à tort observé (la pesée n'est pas la plus
      récente). *Mon avis : à laisser, sauf si tu veux des chiffres exacts
      dans ce bandeau-là aussi.*

- [ ] **`initiale` et `cartes` portent le même bug par copie** (branche
      `latestLossInfluenced` intacte dans leurs `WeightTracker.tsx`). Non
      servies, non corrigées — signalées seulement, comme convenu. *Mon
      avis : à reprendre le jour où l'une redevient servie, pas avant.*

Pour mémoire, deux cas du balayage sont COUVERTS par la correction elle-même :
l'édition de la valeur seule d'une pesée passée (plus aucune fête au nom de la
dernière, la home se met à jour sans widget) et la pesée AJOUTÉE à une date
passée, intercalée (jugée à sa place, jamais « plus récente ») — tests à
l'appui dans `src/features/weight/submissionInfo.test.ts`.

### Laissé ouvert les 24 et 25 août 2026 — ce qui attend TON œil ou TON avis

- [ ] **Bleu matinal immersive : son second plan tient 2,56:1** sur TOUS ses
      blocs blancs (mesuré le 2026-08-24). C'est le défaut exact corrigé pour
      Nostalgic le même jour (2,56 → 5,44). Une ligne dans sa feuille le
      règlerait pour tout le thème ; elle n'a pas été écrite faute de demande.
      Conséquences visibles : les pictos allumés de l'export sur mesure, et
      « Rappels : … » du bloc Salut.

- [ ] **Nuit étoilée et Pleine lune : l'accent tient 3,99:1** sur leur carte,
      un blanc à 75 % posé sur un ciel déjà pâle. Assombrir leur teal
      changerait toute la palette de leurs cartes pour 10 % de contraste.

- [ ] **La barre de progression tombe à 1,67:1** (Bleu matinal immersive) et
      **2,04:1** (Immersive A et C) : leur dégradé de barre est posé pour la
      matière dominante du thème et se retrouve sur une carte claire.

- [ ] **Nuit étoilée et Less Nostalgic rendent le bloc « Salut » d'un bord à
      l'autre, coins équarris** — leur signature assumée pour tout bloc pleine
      largeur, mais le bloc y est le seul élément de la home dans ce cas.
      *À trancher à l'œil, pas à la mesure.*

- [ ] **Export sur mesure : la ligne « journal des injections » garde son
      texte** quand tout le reste est passé en pictos nus (2026-08-24). Elle
      n'est pas une bascule — le journal est toujours inclus —, et en carreau
      nu elle serait indiscernable d'un bouton éteint. À confirmer ou à
      supprimer.

- [ ] **Le bloc « FIBR. » de la home coupe encore son libellé à 300 px** :
      9 px de texte de trop avant les marges adaptatives du 2026-08-24, 4 px
      après ; zéro dès 320 px. La cause est dans la tuile, qui mesure sur son
      propre conteneur, pas dans la marge de page.

- [ ] **Les versions gelées affichent encore « Harris-Benedict »** là où la
      formule est celle de Mifflin-St Jeor (corrigé le 2026-08-25 dans la
      version courante et la brique partagée). Initiale, Cartes, thèmes
      Sidéral et Test : une ligne par fichier, cinq fichiers, sur demande.

- [ ] **Rapport PDF : la palette « coucher de soleil » n'a plus de raison
      d'être** depuis que la dérivation lit le vrai ciel et les vrais jetons
      du thème (2026-08-23) ; et le bandeau de la première page porte encore
      le **nom du thème en clair**, posé pour du débogage à ta demande.

- [ ] **Le questionnaire d'accueil n'écrit toujours rien** dans le profil, les
      modules ni les journaux : c'est une simulation. Le brancher demande de
      décider ce qui se passe quand une réponse contredit une donnée déjà
      saisie. La silhouette et l'avatar n'y sont pas demandés — un
      questionnaire ne sait pas les montrer.


- [ ] **LE MENU DU BAS RÉTRÉCIT QUAND TU ACTIVES DES MODULES** (mesuré le
      2026-08-24). Le menu du bas montre jusqu'à neuf pictos — maison,
      injection, pesée, effets, sport, repas, sommeil, un temps pour soi,
      rapport — et quatre d'entre eux ne sont là que si le module est activé.
      Chaque picto se partage la largeur restante : à neuf entrées il fait
      43 px de large sur un écran ordinaire, et **36 px sur un petit
      téléphone**, alors que le minimum pour viser sans se tromper est 44 px.
      L'effet est à l'envers du bon sens : **celle qui active le plus de
      suivis est celle qui vise le plus mal.** Et il n'y a aucun écart entre
      deux pictos voisins, donc une erreur de visée ouvre la page d'à côté.
      **Que fait-on quand il y a trop d'entrées ?** Trois sorties possibles :
      plafonner le menu et ranger le reste derrière une entrée « Plus » ;
      rendre le menu défilant sur le côté ; ou passer à deux rangées.
      *Ma recommandation : plafonner à six entrées et ranger le reste
      derrière « Plus ».* C'est la seule des trois qui garantisse la taille
      des cibles quel que soit le nombre de modules, et le geste « ouvrir
      Plus » est déjà connu de tout le monde.

- [ ] **LE TEXTE DE 10 ET 11 PIXELS — 1 816 endroits rien qu'en Mixte**
      (compté le 2026-08-24 : 505 fois du 10 px, 503 fois du 11 px, 808 fois
      du 12 px). C'est sous le seuil de lisibilité pour tout le monde, et
      franchement sous celui d'une lectrice de cinquante ans. Ce n'est pas
      une retouche : c'est la moitié des textes de l'app.
      **Est-ce qu'on remonte tout le texte de l'app d'un cran ?** Le faire
      change l'allure de toutes les pages : les blocs grandissent, certains
      chiffres perdent leur place, il faudra redessiner des alignements.
      *Ma recommandation : oui, mais en posant d'abord une échelle de tailles
      nommées* — sinon on corrige 1 816 fois à la main et le défaut revient au
      premier écran neuf. L'échelle d'abord, la migration ensuite, écran par
      écran.

- [ ] **LES TROIS THÈMES IMMERSIVE — quatre décisions prises sans toi**
      (2026-08-21, commit `c3fd60a`). Les maquettes des deux questions :
      https://claude.ai/code/artifact/6a61f2f0-cb52-4ee1-a681-70c4a02d8774
      1. **Le ciel TRANSITE entre les pages** (ma recommandation à la
         question 2, restée sans réponse quand tu as dit « fais les 3
         themes ») : chaque page porte sa tonalité, fondu d'1,4 s comme les
         chapitres du site. Un mot (« fixe ») et je fige la tonalité
         d'ouverture partout — quelques lignes par entry.
      2. **Le verre des blocs de B est un voile de NUIT** (rgb(9 38 62) à
         42 %), pas le verre blanc à 8 % du site : le bas du ciel (#2E7FBE)
         ne laisse aucune encre tenir sur un verre blanc. Mesuré, expliqué
         dans l'en-tête d'immersive-b.css ; si tu veux le verre blanc du
         site coûte que coûte, c'est deux lignes, et du texte y deviendra
         peu lisible en bas de page.
      3. **La frontière parcours/lecture de C** est limitée au bloc Salut et
         au défilé des dernières entrées (contrat `glow-tile-nav`, classe
         nue posée dans SalutBlock et RecentJournalStrip). La home réelle
         n'a pas la rangée « 4 indicateurs » des maquettes ; tout autre bloc
         que tu voudrais en verre = un mot, j'y pose la classe.
      4. **Les trois thèmes rejoignent la ronde du Kaléidoscope** (règle
         « tous les thèmes sauf Sidéral et Test ») — trois ambiances
         proches dans la ronde ; ils s'en retirent en trois lignes.

- [ ] **AUDIT DE SINCÉRITÉ (2026-08-20)** — rapport complet :
      https://claude.ai/code/artifact/6a72df47-3ae8-43af-be83-1b742a301439
      Les allégations de sécurité fausses sont DÉJÀ corrigées (`6393e04`,
      `40cbb1f`). Restent tes décisions, par ordre de priorité proposé :
      1. **Rappels fantômes** (NotificationsSettings) : aucun rappel n'est
         jamais envoyé — reformuler en « repères affichés dans l'appli »
         + renvoi vers l'app Horloge, ou implémenter de vraies notifications ;
      2. **Jeu-concours Instagram** (MonCiel) : aucun abonnement à gagner,
         aucun compte officiel — retirer, ou assumer en clin d'œil sans lot ;
      3. **Site vitrine** : « AES-256/chiffré/certificat » ×3, « colonnes à
         100 % » (faux), marquer « Exemple » le compteur En direct et la
         courbe −4,2 kg, mentions légales manquantes, polices Google à
         auto-héberger, EAN Cristaline sur le skyr ;
      4. **Feedback + sondage** : « envoyé / nous lisons » alors que rien ne
         part — « enregistré sur cet appareil », ou brancher un vrai envoi ;
      5. **La grande omission** : dire quelque part qu'il n'existe AUCUNE
         copie des données (vider le navigateur = tout perdre) + inviter à
         exporter ;
      6. **Thèmes Sidéral/Test dans la galerie** : ils re-montrent AES-256,
         HDS et le concours — corriger malgré le gel, ou retirer de la
         galerie ;
      7. Divers à nuancer : « Nous garantissons », pastille « Sovereign »,
         « sauvegarde », « © HOPTID-GLOW » sans mentions légales, faux QR
         sur les cartes partagées, bloc sensations sans réserve médicale.

- [ ] **L'ONBOARDING : sept points ouverts** (2026-08-19). La simulation est
      dans l'espace Admin (`Onboarding`), structure et textes commités
      (`1eb3c71`, `01e548a`), rien n'est mis en place pour de vrai.
      1. **Le thème choisi dans le questionnaire s'applique POUR DE BON.** Un
         thème charge sa feuille et passe par un rechargement — c'est la
         mécanique de la galerie et la seule qui existe. C'est le prix de
         « reste du questionnaire dans le thème » : la vraie apparence plutôt
         qu'une imitation. À confirmer, ou à remplacer par un aperçu approché ;
      2. **une question passée n'allume pas son module** : passer « voulez-vous
         suivre vos apports nutritionnels » éteint les repas. C'est le défaut
         du profil d'usine et le sens de « home vide » ; l'inverse se défend ;
      3. **le questionnaire ne demande ni le traitement, ni la taille, ni
         l'âge, ni le sommeil** — sa liste ne les porte pas. La home d'arrivée
         les prend au profil d'usine. Le traitement manque particulièrement :
         c'est lui qui décide du picto et du libellé de la page injection ;
      4. **les trois blocs vides de la home d'arrivée** (poids, traitement, et
         alimentation si le module est allumé) sont ma proposition, pas une
         maquette validée ;
      5. **« Être un peu plus actif » est au masculin**, comme les trois autres
         souhaits — ce sont ses mots, dictés tels quels. Or le questionnaire
         demande le genre à l'avant-dernière question. Une tournure neutre
         (« Bouger un peu plus ») réglerait les deux souhaits d'un coup.
         Ma recommandation : neutraliser ;
      6. **l'échelle « cela vous a-t-il aidé ? » est en chiffres 0 à 5**, faute
         de mots qui tiennent dans six boutons côte à côte à 320 px ;
      7. **deux propositions de détente ne viennent pas de sa dictée** — « une
         partie de cartes » et « regarder du sport entre amis », ajoutées pour
         que les neuf activités du catalogue « Un temps pour soi » soient
         toutes atteignables. Deux lignes à retirer si elle veut sa liste
         exacte.
- [ ] **Le titre de l'étape détente est passé de « Vos moments » à
      « Détente »** (2026-08-19) — un mot au lieu de deux, choix de concision
      de l'agent. Rien d'autre dans le questionnaire ne porte un titre d'un
      seul mot.
- [ ] **LA RÉGRESSION DE LA PAGE DES THÈMES N'A JAMAIS ÉTÉ DÉCRITE**
      (2026-08-19). Elle l'a signalée en trois mots — « regression page theme »
      — puis a demandé de pousser et déployer sans répondre à ma question. Le
      lot est donc EN LIGNE avec un défaut possible sur cette page. J'ai
      corrigé en cherchant une fragilité réelle (`2f57c77` : la remise des
      bleus à la base pesait autant que la règle du thème, l'ordre de
      chargement des feuilles pouvait donc tout retourner) — mais ça ne prouve
      pas que c'en était la cause. À regarder sur le déploiement : les
      vignettes portent-elles chacune son fond, et son bouton ?
- [ ] **Les boutons d'ajout rapide des deux ÉCLIPSES** (2026-08-19). Ils
      portent le ciel de leur thème éclairci d'un cran, comme les dix autres.
      La planche recommandait pour eux un APLAT de la seconde couleur, leur
      ciel frôlant le noir et l'éclaircissement s'y perdant. Elle a dit « les
      versions légèrement plus claires », j'ai appliqué partout. Deux lignes à
      changer, une par feuille, si les boutons s'y perdent.
- [ ] **Sidéral et Test ont reçu le ciel de leurs boutons d'ajout**
      (2026-08-19), contre sa règle qui les exclut de tout travail de thème :
      sans lui, leurs boutons auraient porté le ciel de Nostalgic sur une page
      sombre. Ce n'est pas un changement d'apparence mais l'absence d'un trou —
      à confirmer ou à retirer.
- [ ] **Le relief des boutons d'ajout rapide est MON choix** (2026-08-19) :
      ombre posée d'un pixel et léger bombé, retenus parmi seize habits mis
      côte à côte sur la planche. Elle n'a pas tranché — elle a répondu sur la
      couleur du fond, pas sur le relief. Une ligne à changer dans `index.css`.
- [ ] **Les trois planches d'essai des boutons d'ajout rapide**, si elle veut
      y revenir : `dff2cacc-aecd-42ac-9533-90e61652bcf0` (les seize habits et
      huit emplacements du « + »), `26da2501-f8da-4487-a7aa-964e26d3943c` (le
      « + » à gauche, sans astre, plein selon le fond),
      `6ee546df-eb52-45b0-9eab-450de52d2606` (les six traitements de fond,
      celle qui a décidé). Toutes en `https://claude.ai/code/artifact/…`.
- [ ] **Le graphe appétit, trois points laissés ouverts le 2026-08-19** quand
      il est passé aux créneaux horaires :
      1. **les pastilles sont revenues sur la courbe**, contre sa règle du
         2026-08-18 (« pas de boule sur le graph ») — sans elles, un créneau
         renseigné entre deux créneaux vides ne produit aucun segment et
         disparaît. Sa règle d'alors visait trente points par jour ; il y en a
         huit au maximum ici ;
      2. **la garde des dates futures a disparu** : sans axe de dates, ce
         graphe rejoint la famille « Répartition », qui ne l'a jamais eue. Un
         repas daté de demain compte dans les moyennes de son créneau ;
      3. **la moyenne par jour ne s'affiche plus nulle part** dans la Mixte.
         Si elle veut garder les deux lectures, c'est un second bloc.

- [ ] **Les partages : ce que la page de templates laisse ouvert** (`5adb131`,
      2026-08-19). Les dix-neuf maquettes sont en ligne, thémées par la
      signature de bloc. Restent quatre décisions à elle :
      1. **le QR code n'est pas scannable** — c'est un motif dessiné,
         déterministe, marqué comme tel. Le vrai encodeur, c'est soit une
         dépendance tierce, soit ~300 lignes d'algorithme à écrire et tester,
         soit une image fabriquée hors de l'app. Ma recommandation : une image
         fixe, le lien vers les stores ne changeant jamais ;
      2. **le format 4/5** est mon choix, le plus polyvalent sur un réseau.
         L'ancien partage faisait du 9/16, format story. Une ligne à changer ;
      3. **la carte s'allonge** quand le contenu déborde (journée
         d'alimentation, graphe) : 4/5 est un plancher, pas un carcan. Si le
         format doit être strict, il faudra couper des informations ;
      4. **le graphe montre ses commandes** — sélecteur de période et bornes
         « du … au … » s'affichent dans la maquette. Un vrai partage ne
         devrait pas les porter : il faudra une prop « lecture seule » sur les
         graphes, ou les masquer au moment de fabriquer l'image.
- [ ] **Ce que la page de partages a mis au jour, et qui n'est pas d'elle** :
      le commentaire de l'arrondi du logo dans `App.tsx` dit « 10 px sur 38,
      rapport 0,263 » alors que la classe écrite est `rounded-xl`, soit 12 px
      et un rapport de 0,316. Le commentaire ment depuis le 2026-08-14. Rien
      n'a été changé — `LogoMark` reproduit les classes littérales, l'entête ne
      bouge pas —, mais lequel des deux a raison ? Et `badgeShare.ts` garde sa
      copie du logo en chaîne SVG : la duplication n'est qu'à moitié résorbée,
      elle avait demandé de ne pas toucher aux boutons de partage.
- [ ] **La prise de poids de Less Nostalgic, Nuit étoilée et Pleine lune** :
      revue des douze feuilles faite le 2026-08-19 (`5f81e29`), trois corrigées
      — Bleu matinal et Bleu nuit passent au turquoise `#5eead4` pris dans la
      couche verte de leur ciel, Bleu ensoleillé au violet `#5b21b6`, la teinte
      voisine du bleu, sa palette n'ayant QUE du bleu. Cinq étaient déjà dans
      leurs tons. Restent ces trois-là, qui ne posent AUCUN jeton de couleur :
      leur palette entière est celle de Nostalgic, magenta compris. « Les tons
      du thème » n'a pas de sens distinct pour elles. Leur donner une prise à
      part, c'est leur inventer une gamme propre — un autre chantier.
      **Faut-il le faire, ou suivent-elles Nostalgic comme pour tout le reste ?**
      Ma recommandation : les laisser suivre.
- [x] **Le dosage du voile sombre de Bleu matinal** — TRANCHÉ par elle sur
      planche le 2026-08-19 : **20 %**, le dernier palier (ma recommandation
      était 30 %), les grisés en blanc, et répercuté sur TOUS les blocs foncés
      du thème (`160884e`, `7546012`). Planche des cinq dosages :
      https://claude.ai/code/artifact/a365706f-7cc1-4f40-b4d7-99ac8e2e60ac
      Le bloc était 1,74 à 2,06 fois plus sombre que ses voisins, il est à
      1,42-1,48. Le texte tient partout (3,65:1, second plan compris).
- [ ] **Ce que le voile à 20 % a coûté, et qu'elle n'a pas encore vu** — trois
      reculs, tous mesurés, aucun sur du texte principal :
      1. les cinq encres nutritionnelles tombent vers 2,4:1 dans le DERNIER
         QUART du ciel (elles tenaient 3,1 à 3,9 à 45 %). Ne concerne que les
         blocs nutritionnels vus en bas d'écran — tableau des créneaux, graphes
         de repas —, jamais les trois blocs de la home, qui ne voient que la
         moitié haute du ciel ;
      2. le filet des graphes (`--glow-chart-rule`) passe de 3,21 à 2,07:1.
         C'est une grille de fond, sa discrétion est voulue ; la relever la
         rendrait plus présente qu'avant en haut de page (4,5:1) ;
      3. le remplissage des deux rails d'objectif de la home passe de 3,59/4,00
         à 2,57/2,86:1 — leur dégradé vit en dur dans le template, le relever
         demanderait de le repeindre depuis la feuille.
      Ma recommandation : ne rien toucher avant ses captures. Si quelque chose
      la gêne, ce sera le point 2 ou le 3, et les deux se corrigent d'un mot.
- [ ] **Le libellé des carrés d'équivalence est GARDÉ** contre la lettre de sa
      demande (« uniquement -0.2kg et l'image ») : elle venait de faire rétablir
      ces libellés le jour même, et sans eux les deux carrés sont
      indiscernables. Un mot à retirer si elle veut le carré nu.
- [ ] **Coucher de soleil n'exporte plus automatiquement dans sa palette** :
      « aucune case cochée = neutre et sobre » vaut pour lui aussi depuis le
      2026-08-18 ; sa palette ne sort que si « couleurs du thème » est cochée.
      Lecture littérale de sa demande — lui rendre son automatisme ?
- [ ] **Export « Par repas » : la composition en toutes lettres a disparu** de
      ce niveau (elle vit au niveau « Chaque aliment », avec les valeurs par
      aliment). Devait-elle survivre au niveau intermédiaire ?
- [ ] **Les deux blocs « répartition » de la page repas portent le MÊME texte
      d'analyse** (mêmes chiffres, textes cohérents par construction) : côte à
      côte, la répétition peut lasser — un seul des deux devrait-il porter
      l'accordéon ?
- [ ] **Sommeil, édition par le formulaire complet** : en cas de chevauchement
      refusé, les champs du formulaire restent aux valeurs tentées (patron des
      refus du site) — c'est la LIGNE qui garde ses valeurs d'avant. Voulait-elle
      que le formulaire lui-même revienne en arrière ?
- [x] **Supprimer l'habillage « à nu » de la page injection** — VALIDÉ par
      elle le 2026-08-19 (« page injection validée ») et FAIT dans la foulée,
      les deux vagues comme recommandé : `4138069` (la prop `bareTitles` sur
      `InjectionsTracker`, `MoleculeConcentrationChart` et `BloodLevelPlot`,
      196 lignes en moins) puis `8633219` (la cascade : la prop « hors bloc »
      d'`InlineCustomDateRange`, `PeriodBounds` et `JournalEntryCard`, le
      `badgeClassName` de `PeriodSelector`, et les classes
      `.gbare-calendrier` / `-roue` d'`index.css`). Aucun pixel ne change.
      `SectionDivider` et les `glow-ico-bare` / `gbare-*` restent, la home
      sections et le bloc Salut les portent.
- [ ] **La seule phrase du bloc explicatif de la page Poids qui parle d'EFFET**
      et non de courbe : « et le moment où l'effet de la molécule est le plus
      marqué », fin du paragraphe du pic. Elle reste dans le registre du bloc
      voisin de la page injection (« la sensation de satiété est maximale »).
      Zéro mention d'effet sur la page Poids ? Il suffit de couper l'incise.
      Planche complète : https://claude.ai/code/artifact/eaa350e8-b975-448f-b9ab-85efa5acfc40
- [ ] **`text-red-655` est une classe morte** (faute de frappe, présente dans
      les trois versions) : l'entrée « Supprimer » du menu « … » d'un repas
      n'est donc pas rouge, contrairement à la règle « le rouge est réservé à
      ce qui supprime ». La corriger en `text-red-600` ?
- [ ] **`text-sky-905`, la même faute, sur l'entête « Journal (N) » du journal
      des repas** d'Initiale et de Cartes (2026-08-17). Le jeton mort a été
      RETIRÉ (`764fd81`), donc l'entête hérite sa couleur : zéro changement de
      pixel. Le corriger en `text-sky-900` — ce que la faute promettait —
      changerait l'apparence de deux versions GELÉES, d'où l'arbitrage. La
      Mixte n'est pas concernée, son journal a été réorganisé depuis.
- [ ] **Largeur du menu « … »** sur Less Nostalgic et Nuit étoilée : la règle
      des blocs pleine largeur lui retire sa largeur fixe, il se resserre sur
      son contenu. La figer ?
- [ ] **Le chip 0/1/2 du mode lecture facile** : ses pastilles actives vont
      bien, mais son rail clair fait une tache sur les thèmes de nuit.
      L'aligner sur la famille des sélecteurs segmentés changerait aussi le
      rendu Nostalgic.
- [ ] **Le segment « Idée » est en `text-sm`** quand « Avis » et « Bug » sont
      en `text-xs` (page Feedback) — écart de typo antérieur.
- [ ] **Éclipse de soleil, badges** : seules les gemmes bleues des couronnes
      sont devenues ambre ; les rubis restent rouges. Le « aucun bleu » du
      thème doit-il aussi chasser le rouge ?
- [ ] **Simulation badges** : faut-il rétablir dans la section Nostalgic une
      rangée « actuel » en comparaison des nouvelles règles ?
- [ ] **Les boutons pleins en dégradé bleu** : 33 usages, 30 écritures
      différentes (graisse, taille, espacements). Relevé complet dans
      CONVENTIONS.md, « Les boutons pleins en dégradé bleu — à arbitrer ».
- [ ] **Les titres de section** : leur TAILLE est unifiée en `text-sm`
      (2026-08-15), mais leur couleur (`text-sky-950/900/800`, `text-slate-800`)
      et leur interlettrage (`tracking-wider` / `tracking-tight`) restent
      partagés moitié-moitié. Relevé dans CONVENTIONS.md.

## À faire

- [ ] **Recharts 3 écrase la classe des curseurs custom** (trouvé le
      2026-08-26 en corrigeant « la ligne pointillé se voit a peine ») : les
      graphes VIVANTS sont réparés via `ruleClassName` (`5a067d8`), mais les
      appels des VERSIONS GELÉES (Initiale, Cartes, thèmes test/sideral)
      passent toujours `className` et gardent donc le curseur gris #ccc par
      défaut. Assumé — gelé ne se retouche pas — mais à savoir si elle le
      remarque un jour.

- [ ] **`filterNull` de recharts peut vider d'autres bulles** : la courbe de
      poids est corrigée (`10ebaf1` — jours prolongés à plat, toutes séries
      nulles → payload vide, plus jamais de bulle). Si un autre graphe a des
      zones où TOUTES les séries valent `null` en même temps, il aura le même
      silence au clic. Aucun cas repéré à ce jour ; vérifier si une bulle
      « ne répond pas » quelque part.

- [ ] **Le rig de vérification headless** (2026-08-26) vit dans le scratchpad
      de session (éphémère) : copie jetable du dépôt avec `apiKey` Firebase
      vidée (le verrou se désarme tout seul), `vite build` + `vite preview`,
      puppeteer-core sur le Chrome local. Semer :
      `glp1_app_companion_data`, `hasAcceptedMedicalDisclaimer_v1: 'true'`,
      `glow_theme_mixte` (ou `?theme=X` dans l'URL), naviguer par les
      `title` des boutons du menu. À remonter en script du dépôt si on s'en
      ressert souvent.

- [x] **FAIT le 2026-08-26** (lot de préparation React Native) — les sept noms
      sont purgés, `medicalReportPdf.ts` importe les noms du domaine, les
      21 cas jumeaux de `reportSummary.test.ts` sont supprimés (tous déjà
      réunis côté domaine), et `reportSummary.ts` ne garde que la mise en mots
      du document (`APPROX`/`approx`/`frDecimal`/`goalPercent`) et
      `weeklyLossPercent`. **Faire disparaître les sept noms jumeaux de `reportSummary`** (reste du
      lot de fusion du 2026-08-23, commits `9a7ab0c`, `73fb541`, `d48fa10`).
      Les deux lots parallèles de ce jour-là avaient écrit les mêmes calculs
      sous deux noms ; il n'en reste plus qu'UNE implémentation, dans le
      domaine, mais `reportSummary` en garde les noms du document —
      `mealRhythm`, `nutritionAverages` et `sportPeriodSummary` (trois lignes
      de renommage de champs chacune), `sideEffectTierCounts`,
      `nightAverageMinutes`, `intakeIntervalDays`, `stepsAverage` (de simples
      réexports). Les faire disparaître demande de repointer les ~8 appels et
      le bloc d'imports de `medicalReportPdf.ts` sur
      `mealDailyAverages` / `severityTierCounts` / `nightMinutesDailyAverage` /
      `injectionIntervalDays` / `stepsDailyAverage` / `sportWeeklyAverages`, et
      de déplacer les cas de `reportSummary.test.ts` (déjà tous réunis côté
      domaine — rien à sauver, juste à supprimer). Laissé de côté parce qu'un
      autre agent réécrivait `medicalReportPdf.ts` au même moment : à faire
      quand la refonte visuelle du PDF sera posée.

- [ ] **RETIRER le nom du thème du bandeau du rapport PDF** (posé le
      2026-08-23 à sa demande, « provisoirement, pour débogage »). C'est un
      repère de vérification, pas une information de document médical : il
      part dès qu'elle a vu ce qu'elle voulait voir. Trois gestes, rien de
      plus — `currentThemeDebugLabel()` et son appel dans
      `MedicalReportExport.tsx`, le champ `debugThemeName` de
      `MedicalReportOptions`, et les lignes qui l'écrivent dans `drawBanner`.
      Chaque endroit porte déjà le mode d'emploi en commentaire. **À NE PAS
      dépiler de soi-même** : c'est elle qui dira quand la vérification est
      faite.

- [ ] **La feuille du menu annule la compensation d'épaisseur des pictos
      recadrés** (trouvé le 2026-08-19). Quatre pictos ont reçu une fenêtre
      resserrée pour que tous tombent sur la même ligne, et leur trait est
      divisé d'autant pour ne pas grossir — mais `P-menu-bar svg:not([class*='stroke-'])`
      impose `stroke-width: 1.6`, et une règle de feuille bat un attribut de
      dessin. Ces quatre pictos sont donc à 1,78 apparent dans le menu du bas,
      les autres à 1,6. L'alignement qu'elle a demandé n'est appliqué qu'à
      moitié. Peu visible, mais réel.

> **NOTE DE REPRISE — CLEAR DU 2026-08-28.** Poussé ET déployé : le lot
> `083a983..a1d7498` + TODO + SUIVI + cette note (vérifier l'empreinte au
> prochain doute : `grep index- dist/index.html` contre
> `https://glow-private.web.app`). `tsc`, **1 618 tests / 88 fichiers** et
> `build` verts. AUCUN agent en cours, arbre propre (hors dépôt habituels).
> Le détail du lot est dans SUIVI-PUSHS (entrée 2026-08-28) — Divination de
> fond en comble, thème Masculin + IBM Plex Sans, couleurs Éveil thémables
> par 20 thèmes, fusion des tuiles + bloc poids (IMC, arc), bandes
> disjointes du graphe Appétit, vitrage Nostalgic.
>
> **CE QUI ATTEND SA RÉPONSE — à reposer, ne rien décider seul :**
> 1. Le NUMÉRO du bouton « Ajouter » de Mes aliments — planche artifact
>    (10 habillages/placements, ma recommandation : n° 4 pleine largeur en
>    pied) : https://claude.ai/code/artifact/c30d0edd-fddf-4f71-bdeb-71f7ddb1a9c6
>    Le bouton unique à menu (manuel/code-barres) est VALIDÉ, seul le
>    style+placement reste à trancher, puis À BRANCHER dans l'app.
> 2. Critère ÉVEIL du Kangourou Musclé : « au moins une séance sur jour en
>    cours/veille » retenu — alternative « 1 h d'équivalent modéré ».
> 3. Divination : bande 700 g–1 kg rangée dans « légère » ; second terme de
>    sa soustraction dictée lu comme « métabolisme » ; MET bruts (option
>    MET−1 signalée, sans suite demandée).
> 4. Les deux questions d'audit anciennes : verre de Bleu matinal, second
>    jeton d'encre de Plein soleil du désert.
>
> **RÈGLE MAJEURE DU 2026-08-28** (CONVENTIONS + mémoire) : JAMAIS
> d'attente passive — finir soi-même ce qui peut l'être, chien de garde
> (minuterie de fond) quand des agents tournent, réveil direct par message
> à chaque libération. Les boucles d'attente des agents MEURENT sans
> signal : ne jamais s'y fier.
>
> **SESSION PARALLÈLE** : elle fait parfois travailler une seconde session
> sur le même arbre (constaté : icônes divination, instruction jamais reçue
> ici mais style aux conventions). Avant d'éditer un fichier modifié non
> commis : c'est peut-être elle — adopter, ne pas écraser.
>
> **MÉCANIQUES NEUVES DU JOUR, où elles vivent** : fond du tiroir
> divination = contrat `.glow-divi-ground` (opaque, 20 feuilles) ; couleurs
> Éveil = 9 jetons `--bdg-eveil-*` (défaut index.css, choix par feuille) ;
> aération divination = formules à seuil `calc((100vh-568px)*pente+base)`
> (les vh simples remordent le petit cadre) ; graphe Appétit = bandes
> disjointes par domaines élargis (faim [-5.5,5], kcal [0,max×2.1]) ;
> thème Masculin = themes/masculin/ (Oswald + IBM Plex Sans via l'@import
> d'index.css). Le tiroir divination a AUSSI un rembourrage à seuil dans
> App.tsx (openDrawer === 'divination').
>
> **PIÈGE D'OUTILLAGE appris** : `vitest | grep` avale le code de sortie —
> pendant qu'un agent a ses tests transitoirement rouges, vérifier le
> périmètre de SES fichiers avant de conclure. Et `str.replace` Python
> remplace TOUTES les occurrences : ancrer les motifs.

> **NOTE DE REPRISE — CLEAR DU 2026-08-27.** Poussé ET déployé : `ae8fd18`
> (27 commits, lot `b6cec2d..83b6bb1` + SUIVI), `https://glow-private.web.app`,
> empreinte vérifiée (`index-BJSseyLd.js`). Arbre propre ; hors dépôt comme
> d'habitude : `images pour claude/`, `glow-prototype.html`,
> `maquettes-design-2026/`, un PDF d'essai. `tsc`, **1 564 tests /
> 86 fichiers** et `build` verts. AUCUNE tâche en cours, aucun agent.
> **0 commit non poussé.** Le détail du lot est dans SUIVI-PUSHS (entrée
> 2026-08-27) — refonte badges, masquage des modules, page vitrée, Tendances,
> menu Préférences, renommages, GLP1LOW en mot-symbole, Feedback/Sondage sans
> blocs.
>
> **CE QUI ATTEND UNE RÉPONSE D'ELLE — à reposer, ne rien décider seul :**
> 1. Les deux questions de l'audit de lisibilité du 2026-08-26 : épaissir le
>    verre de Bleu matinal (8 % plafonne le contraste ~3:1 — changerait
>    l'aspect du thème) ? créer le second jeton d'encre pour « Faim avant
>    repas » sur Plein soleil du désert (~2,2:1) ?
> 2. « supprimer l'object » (page badges) a été lu comme LA LIGNE OBJECTIF
>    (progressText) des cartes à débloquer — jamais confirmé par elle.
> 3. Les loisirs de l'onboarding (« Sports collectifs », « Sports en
>    extérieur », « Regarder du sport entre amis ») n'ont PAS été renommés
>    par le balayage « sport → activité physique » : des activités nommées,
>    pas le module. Signalé, sans réponse.
>
> **CONVENTIONS DE TEXTE NÉES CE JOUR** (déjà appliquées, à respecter dans
> tout nouveau texte) : « activité physique » et « repas et en-cas » — les
> mots « sport » et « journal alimentaire » ont disparu des textes ; noms de
> modules en MAJUSCULES À CHAQUE NOM dans les textes d'activation (« Nombre
> de Pas », « Activité Physique », « Un Temps pour Soi », « Repas et
> En-cas ») avec POINT FINAL ; toute occurrence TEXTUELLE de « GLOW » s'écrit
> avec le mot-symbole (`<Wordmark as="span" inline />`, lié au mot précédent
> par `{' '}`) — SEULS les slogans « ready, shine, glow! » du logo
> restent en toutes lettres ; « Tendances » au pluriel ; « Préférences »
> (plus jamais « Paramètres » dans un texte).
>
> **MÉCANIQUES NEUVES, où elles vivent** : masquage complet d'un module =
> cinq drapeaux `*ModuleHidden` sur UserProfile + `isModuleHidden` dans
> `versions/mixte/app/navigation.ts` (les tiroirs filtrent ; TrendDrawer et
> BadgesPage aussi) — rallumer un module EFFACE son masquage (les bascules
> de NotificationsSettings s'en chargent). La PAGE VITRÉE d'un module éteint
> vit dans App.tsx (`PAGES_MODULE`, `naviguerVersPageEteinte` — qui n'allume
> RIEN, contrairement à `handleNavigate` qui rallume le module de la page
> visée) ; le tiroir Journal y mène, le tiroir « + » reste inerte. Les
> messages d'activation de TrendDrawer : `MODULES_TENDANCE`. Le trio CSS
> « cartes d'ÉTAT en rounded-3xl » existe maintenant sur DIX feuilles
> (Immersive B ajouté le 2026-08-27 — seul thème où encres blanches et
> cartes pâles se croisaient).
>
> **PIÈGES DU RIG HEADLESS appris ce jour** (recette complète plus bas) :
> le bouton roue s'appelle désormais title=« Préférences et raccourcis »
> (plus « Paramètres et raccourcis ») ; pour ouvrir une page directement,
> semer `localStorage glow_theme_return_tab_mixte = '<tab>'` (badges,
> modules, faq, sondage, feedback…) — consommé au premier chargement ; dans
> le tiroir des cases, TOUT clic qui remonte FERME le tiroir
> (conteneur `onClick`) — un geste interne doit `stopPropagation()` ; les
> textes rendus sont souvent en MAJUSCULES CSS (tester l'innerText en
> majuscules) ; `page.evaluateOnNewDocument` : passer TOUTES les valeurs en
> arguments (une référence à une variable d'un autre script casse TOUTE la
> graine, silencieusement).
>
> **TOUJOURS EN ATTENTE** : la balance du bloc Salut vit dans
> `stash@{0}` (récupérable par `git stash pop`, uniquement sur sa demande).

> **NOTE DE REPRISE — CLEAR DU 2026-08-26.** Poussé ET déployé : `24a0671`,
> tout le chantier des 25-26 août (30 commits sur deux lots),
> `https://glow-private.web.app`, empreinte vérifiée (`index-B4Km1mbG.js`).
> Arbre propre ; hors dépôt comme d'habitude : `images pour claude/`,
> `glow-prototype.html`, `maquettes-design-2026/`, un PDF d'essai. `tsc`,
> **1 574 tests / 85 fichiers** et `build` verts. AUCUNE tâche en cours.
>
> **CE QUI S'EST CONSTRUIT CES DEUX JOURS** : le MENU SIMPLIFIÉ (choix en tête
> de la page Thème, barre Maison·Journal·+·Tendance·Paramètres, quatre tiroirs
> — la mécanique vit dans `app/menuChoice.ts` et l'AppShell) ; le tiroir
> TENDANCE (`features/trends/`, séries testées ; jours vides : trou pour
> kcal/sommeil/pas, zéro pour sport/me time — SON arbitrage —, report pour
> poids/concentration ; lissage MONOTONE, jamais Catmull-Rom qui invente des
> creux) ; la VITRE des formulaires ouverts (`glow-form-open` sur FORM_CARD) ;
> refonte des 7 calendriers ; textes des journaux relevés.
>
> **LA PROCHAINE ÉTAPE EST DÉCIDÉE : préparation React Native.** L'audit du
> 2026-08-26 (rapporté en fin de session, résumé dans SUIVI-PUSHS) conclut :
> fondation saine. À dépiler sur son go, dans cet ordre :
> 1. ~~purge des réexports `reportSummary`~~ — **FAIT le 2026-08-26**
>    (`84ee665`, point « À faire » plus haut, coché) ;
> 2. ~~le DOM dans la logique partagée~~ — **FAIT le 2026-08-26** :
>    `shared/theme.ts` derrière la plateforme (`5af55ec`), le canvas isolé
>    (`4a63c5b` — `shared/platform/image.ts` pour l'avatar,
>    `utils/badgeCardImage.ts` peintre web assumé pour la carte de badge),
>    `onPressOutside` unique et les 3 écouteurs migrés (`0733dba`). Les
>    règles et le « à ne plus étendre » de `shared/ui` sont consignés dans
>    CONVENTIONS, « Le DOM et la logique partagée ». Resté en dehors, à
>    dessein : badgeShare parle encore `navigator.share` en direct (détail
>    différent du contrat `shareNative`, consigné dans le fichier) ; les
>    `window.location` des écrans (VersionRouter, pages Ciqual) meurent avec
>    le web ;
> 3. la SUPPRESSION DES VERSIONS GELÉES (~8 Mo, 408 fichiers) attend SON
>    feu vert « design terminé » — ordre arrêté le 2026-08-19.
> NE PAS refactorer d'avance : recharts, CSS des thèmes, PDF, shell —
> ils se réécrivent à la conversion. `localDateTime` : si un jour, AVANT.
>
> **RÈGLE NEUVE DU 2026-08-26** (dans CONVENTIONS) : chaque réponse se termine
> par le nombre de commits non poussés.

> **NOTE DE REPRISE — CLEAR DU 2026-08-21.** État : `tsc`, **1 273 tests /
> 65 fichiers** et `build` verts. **RIEN N'EST POUSSÉ depuis `051e b42`** :
> onze commits locaux attendent (`1eb3c71` → `c35a128` — onboarding,
> code-barres dessiné, thème Pleine lune blanche + intérieur site immersif,
> corrections AES/HDS, audit). Elle n'a pas dit « push ».
>
> **ARBRE PAS PROPRE, C'EST VOULU** : `src/index.css` porte l'essai NON
> COMMITÉ des pastilles des tableaux de répartition (Nostalgic seul, fonds
> dérivés par color-mix des encres d'origine — les couleurs de son image ont
> été retirées à sa demande). Elle doit dire « garde » (→ committer) ou
> « annule » (→ git checkout src/index.css). Ne pas committer sans elle.
> `images pour claude/` reste hors dépôt, c'est normal.
>
> **BUG DU TÉLÉPHONE : RÉSOLU** (« resolu », 2026-08-21). Le cadre qui
> « descendait des tonnes de pixels et ne réduisait plus en largeur » sur
> tous les thèmes était un état bancal du serveur de dev / cache — le code
> n'y était pour rien (les classes du cadre étaient bien dans le CSS
> produit). Rien à reprendre. L'extension Chrome reste déconnectée, à
> reconnecter un jour pour les vérifications visuelles.
>
> **FAIT CE JOUR (2026-08-20)** : figure code-barres EAN dessinée localement
> au-dessus du formulaire aliment (scan ET édition, message « trouvé »
> supprimé) ; thème « Pleine lune blanche » complet (copie de Pleine lune,
> blocs blancs pleins, préfixe `luneb`, galerie + accueil + ronde) puis son
> intérieur aux couleurs/polices du site immersif (encres #082f49/#3e6180,
> Outfit pour les titres, champs #f7fbff, contrat glow-sel) ; audit de
> sincérité complet (appli + site vitrine) :
> https://claude.ai/code/artifact/6a72df47-3ae8-43af-be83-1b742a301439 —
> les allégations de sécurité fausses (AES-256, HDS, « chiffrées », faux
> absolus réseau) sont corrigées, le reste est en tête de « À arbitrer ».
>
> **MÉMOIRE** : cible mobile = React Native (compteur de pas natif requis) ;
> ne JAMAIS proposer Capacitor/webview — c'est écrit dans la mémoire
> persistante. La note du 2026-08-19 ci-dessous garde le vocabulaire
> (« home carré » = la home en blocs) et les arbitrages plus anciens.

> **NOTE DE REPRISE — CLEAR DU 2026-08-19 (matin).** Poussé ET déployé :
> `051eb42`, 36 commits du 2026-08-18/19, `https://glow-private.web.app`,
> empreinte du bundle vérifiée en ligne (`index-C2S1NreY.js`). Arbre propre,
> seul `images pour claude/` hors dépôt. `tsc`, **1 179 tests / 60 fichiers**
> et `build` verts. AUCUNE tâche en cours, aucun agent, rien d'à moitié fait.
>
> **VOCABULAIRE, à ne plus jamais confondre : « home carré », dans sa bouche,
> c'est l'habit `blocs`** (sa correction : « NON !! home carré c'est home fine
> ligne en blocs »). C'est écrit dans `homeChoice.ts`, dans la mémoire
> persistante, et ça a déjà coûté une planche refaite.
>
> **CE QUI ATTEND UNE RÉPONSE D'ELLE — à reposer, ne rien décider seul :**
> 1. ~~La suppression de l'habillage « à nu » de la page injection.~~ **RÉGLÉ
>    le 2026-08-19** : « page injection validée ». Supprimé en deux commits,
>    `4138069` et `8633219`, les deux vagues (les ~93 lignes annoncées et la
>    cascade). 262 lignes en moins sur neuf fichiers, aucun pixel changé.
> 2. **Le choix parmi les 20 propositions de boutons d'ajout rapide** :
>    https://claude.ai/code/artifact/383f3ba2-a0f5-4a8e-976b-3700c4848f07
>    (refaite contre le bon voisinage, les cartes). Recommandées : n° 1 (son
>    brief, arrondi proportionnel 3 px — DÉJÀ appliqué aux coins en attendant,
>    `dcaffde`), n° 12 (l'arrondi littéral 12 px, le rival direct), n° 8 (le
>    plus en négatif). L'arbitrage n° 1 contre n° 12 règle la moitié de la
>    planche.
> 3. **Le masque du menu du bas, seconde moitié.** Elle veut les pixels du
>    picto SANS transparence. L'encre a perdu son alpha (`e40b4e1`), le voile
>    teinté est revenu sur son « oui ». RESTE, seulement si elle voit encore le
>    verre au travers du dessin : remplir l'intérieur du picto d'une plaque
>    opaque de la couleur de la barre — une variable par thème, douze feuilles.
> 4. **L'icône du sommeil.** Planches livrées, la dernière d'après SON croquis
>    (`42e9ebd3-93c9-4692-b4e5-8396b17175d4`). Décidé : deux états dans un même
>    SVG (complet ≥ 26 px, zZ seul en dessous), requête de conteneur, pas de
>    JS. Question ouverte : un seul Z dans le coin, ou une tête plus petite
>    pour deux ? Rien dans le code — l'icône reste le croissant.
> 5. **Les cinq arbitrages du soir** (en tête de « À arbitrer ») : libellé
>    gardé sur les carrés d'équivalence ; Coucher de soleil qui n'exporte plus
>    automatiquement dans sa palette ; composition absente du niveau « Par
>    repas » de l'export ; texte d'analyse dupliqué des deux blocs répartition ;
>    formulaire de sommeil qui garde les valeurs tentées après refus.
> 6. **La phrase d'effet du bloc explicatif de la page Poids** (« le moment où
>    l'effet est le plus marqué ») — la seule qui parle d'effet et non de
>    courbe. Planche des huit cinétiques :
>    https://claude.ai/code/artifact/eaa350e8-b975-448f-b9ab-85efa5acfc40
>
> **CE QUI A ÉTÉ FAIT LE 2026-08-18/19 ET QU'ELLE N'A PAS ENCORE TOUT REGARDÉ**
> — tout est en ligne, rien n'est vérifié à l'écran de mon côté :
> - la PHOTO D'AVATAR enfin enregistrée (`e11f8d3`) — **lui rappeler : les
>   photos importées avant sont PERDUES, à réimporter une fois** ; vérifier :
>   importer, recharger, la photo tient ;
> - la page injection revenue au graphisme standard quelle que soit la home ;
> - la page poids : concentration réelle par défaut + bloc « Pourquoi la
>   courbe varie ? » (titre court, question entière, chevron à la place de la
>   croix — motif appliqué aussi au bloc sensations de la page injection) ;
> - la home carré : ordre Salut / Ajout rapide / En direct / Progrès /
>   7 derniers jours / pied médical ; bande kcal en tête avec le module pas,
>   pavé demi-largeur sans lui ; tuile effets secondaires neuve ; équivalences
>   dépliables (indépendantes, mémorisées, le voisin s'élargit) ; boutons
>   arrondis 3 px ; titres de section 9-11 px ; avatar collé à gauche ;
>   `inkValue` thémé ;
> - les quatre chantiers d'agents : export (repas et en-cas à trois niveaux,
>   PDF aux couleurs du thème), analyses sous les neuf graphes (+ les deux
>   corrections : journées futures écartées et dites, régularité tenue par le
>   rapport max/min), chevauchement du sommeil interdit, deux questions de
>   sondage ;
> - les badges : placeholder « ? » en couleurs, verre dépoli sur les non-gagnés
>   (7 px image / 4 px nom — réglable d'un chiffre), désaturation .65 au lieu
>   de la grisaille, nom dédoublonné, titres de section en encre hors bloc.
>   **VU PAR ELLE ET VALIDÉ le 2026-08-19 (« badges floutés -> OK ») :** le
>   voile de `c4968dd` est au bon endroit, liste à débloquer floutée et
>   débloqués nets. Le réglage des deux rayons reste à un chiffre près si
>   elle le trouve trop ou pas assez fort ;
> - le blanc en dur sur le ciel : CLOS (trois conversions + `inkValue`) ;
> - Éclipse de lune : la prise en périvenche
>   (https://claude.ai/code/artifact/10da34b7-c3bd-4262-9eb7-cc4c1ff0a48d) ;
> - menu des graphes en 12 px ; graphe éveil sans la journée en cours.
>
> **CE QUI NE SE FAIT PAS SEUL** : la section « À arbitrer », à elle par
> construction. **Ce qui est impossible d'ici** : toute vérification à
> l'écran — et l'extension Chrome était déconnectée en fin de session, penser
> à la retester avant de promettre une vérification navigateur.

- [ ] **`updateWeighIn` ne protège pas le drapeau du poids de départ**, et ce
      sont ses deux appelants qui le reportent (`InlineWeighInRow` par son
      `...item`, `WeightTracker` par `conservee.isStartingWeight`). Un
      troisième appelant qui l'oublierait effacerait le départ sans que rien ne
      prévienne. Le test l'écrit noir sur blanc (`64530df`) ; faire porter la
      protection par la fonction serait un changement de comportement — donc à
      arbitrer, mais c'est un garde-fou sur des données irrécupérables.
- [ ] **« Ping-pong » et « Tennis de table » sont le même sport** au catalogue,
      tous deux à 4.0 MET (relevé le 2026-08-17 en l'enrichissant). En supprimer
      un couperait les séances déjà enregistrées qui le portent — leur nom EST
      la clé. Lequel garder, et que faire des séances de l'autre ?
- [ ] **Dix-neuf silhouettes pleines ne servent plus à rien**
      (`shared/icons/solid/solidIcons`) : la règle du plein a été restreinte à
      trois pictos le 2026-08-17 (`f80094f`), leurs dessins restent. À
      supprimer le jour où la règle aura tenu quelques semaines — elle a changé
      deux fois en trois jours.
- [ ] **`CiqualValidation.tsx` garde trois usages de rouge** aux mêmes endroits
      que ceux passés au rose dans `CiqualDoublons.tsx` le 2026-08-17
      (`10115e0`) : fond de la carte à supprimer, coche « Supprimer », icône
      corbeille. L'agent Sonnet ne les a pas touchés — elle ne l'avait autorisé
      que sur « la page doublon ». Un mot d'elle et la cohérence se fait.

> **DÉPILAGE DU 2026-08-17 (après-midi) — les trois points prêts sont
> faits.** Sa consigne, mot pour mot : « ta prochaine tache sera de
> depiler ta todo a toi, ce qui peut etre fait sans mon avis », confirmée
> le jour même par « oui vas y » puis « toi tu continues la todo ». Cette
> section est donc une FILE DE TRAVAIL, plus un pense-bête : la dépiler ne
> demande aucune autorisation (règle consignée dans CONVENTIONS.md,
> « Manière de travailler »).
>
> Faits, un commit chacun, `tsc` + tests + build verts sur chacun (le
> projet est passé de 700 à 722 tests en chemin) :
> 1. `text-sky-905` — RETIRÉ (`764fd81`). Le point s'est révélé plus
>    étroit que noté : la classe n'est pas dans la Mixte, seulement dans
>    Initiale et Cartes. Le jeton mort part sans changer un pixel ; le
>    corriger en `sky-900` est passé en « À arbitrer », c'est un
>    changement d'apparence sur des versions gelées.
> 2. « Mettre à jour la prise » pour un comprimé (`15e0037`) — Mixte
>    seule ; les six autres exemplaires du formulaire sont gelés.
> 3. Le journal des pesées sous `useInlineEditableLog` (`e8111c4`) —
>    Mixte seule, rendu inchangé, `chosen ?? …` supprimé.
> 4. **Le clavier du select maison** (`1c39acf`) — flèches, Origine/Fin,
>    saisie du nom, tabindex tournant, focus posé et rendu ; logique pure
>    sortie dans `shared/ui/selectTypeAhead.ts` avec 22 tests. Ce point
>    n'était pas dans les quatre annoncés au clear : il est monté à leur
>    place, les trois premiers étant refermés.
> 5. **Le sélecteur de traitement** (`709428d`) et **le champ d'ingrédient
>    d'une recette** (`c35e8a7`) — les deux trous que le point 4 avait mis
>    au jour. Le second était un vrai défaut : Entrée y soumettait le
>    formulaire au lieu de prendre la suggestion.
>
> **UN AGENT SONNET TRAVAILLE DANS LE MÊME ARBRE** depuis le 2026-08-17
> après-midi, sur la base Ciqual (noms courts par lots, et une page
> d'admin « Suggestion Sonnet Ciqual » de propositions de suppression à
> quatre issues). Ses fichiers : `src/data/`, `scripts/`,
> `vite.config.ts`, les `Ciqual*.tsx`, `AdminSettings.tsx`, `App.tsx`. NE
> PAS y toucher tant qu'il tourne, et committer par CHEMINS EXPLICITES
> (`git commit -- <paths>`) : son index et le mien se croisent.
>
> **Ce qui restait dans la liste et qui NE se fait pas seul** : les
> squelettes `Modal`/`MODAL_*` à renommer (seulement le jour où les
> versions gelées seront supprimées), toute la section « À arbitrer », la
> home galaxie 3D (EN PAUSE sur sa demande), et tout ce qui touche
> l'écran qu'elle est en train de regarder — une demande d'elle passe
> toujours devant.
>
> **Ce qui est impossible** : la section « À vérifier à l'écran », qui
> attend ses yeux et non les miens.
>
> **RIEN N'EST POUSSÉ depuis `e41e915`** (dernier lot poussé et déployé,
> `index-DAuzHzxY.js` vérifié en ligne). En attente : `b9f1781` (note de
> reprise), `764fd81`, `15e0037`, `ab7add9` (règle des thèmes),
> `e8111c4`, `1c39acf`, plus les commits de l'agent Sonnet sur Ciqual.


- [ ] **La home galaxie 3D** — chantier ouvert le 2026-08-16 au soir, EN
      PAUSE sur sa demande (« j'y reviendrai plus tard »). La simulation
      retenue : **« La constellation des douze »**,
      https://claude.ai/code/artifact/6bd3a204-b60f-4aed-b711-dd4e0aede319
      (les deux essais précédents, satellites-arêtes puis post-it, sont
      abandonnés). Le modèle arrêté : le graphe de constellation aux fils
      visibles demeure ; 5 têtes toujours lisibles (tête poids = perte
      moyenne/semaine, PAS le poids actuel), 7 étoiles muettes ; les infos
      supplémentaires ne sont PAS sur les arêtes — le bloc d'un nœud
      n'apparaît que quand on est dessus ; équivalences insolites dans les
      blocs des deux étoiles de perte. Acquis techniques : projection 3D
      maison portable React Native (pas de preserve-3d, pas de librairie) ;
      barres et SVG possibles dans les blocs ; charge négligeable sur un
      iPhone 2015 (mettre la boucle rAF en pause à l'inactivité, seul vrai
      point batterie).

- [ ] **Le profil d'usine et la pesée de 95 kg partent avec l'onboarding**
      (décision du 2026-08-16 : « ça n arrivera plus qd on aura fait les pages
      d'onboarding de l'app »). En attendant, le PDF médical imprime « Chloé,
      42 ans, 168 cm, départ 95 kg » comme si c'étaient ses données — c'est
      assumé et transitoire, mais à ne pas oublier le jour où les écrans de
      démarrage seront faits : la pesée semée porte `isStartingWeight` et
      `dropSeedData` ne la reconnaît pas.

- [ ] **Recréer un compte n'est pas possible depuis l'application** : la page
      de connexion dit « Les comptes sont créés par l'administratrice — pas
      d'inscription libre ». La suppression de compte (2026-08-16) tient donc
      sa promesse à moitié : le compte disparaît, mais il faut passer par la
      console Firebase pour revenir. À refermer le jour de l'onboarding, avec
      « Le parcours et les écrans de demarrage » de son TODO.

- [x] **Pousser et déployer** — fait le 2026-08-15 au soir : lot de 35
      commits poussé (`516af54`), déployé, empreinte du bundle vérifiée
      (`index-CzmZhNsL.js`).
- [ ] **`addLogWithinDailyCap` écrase « la dernière du jour » au sens du
      TABLEAU** (donc de la saisie) quand un plafond quotidien est atteint —
      pas la plus tardive par l'heure. C'est un geste d'écrasement, pas un
      affichage : relevé pendant l'audit du 2026-08-16, laissé tel quel faute
      de savoir ce qu'elle attend. Faut-il écraser la plus tardive ?
- [ ] **Initiale et Cartes gardent les tris sur la seule date** (leur
      `App.tsx`, leurs `WeightTracker`) : deux pesées le même jour y sont
      encore classées par ordre de saisie. Versions gelées — à reprendre si
      elles redeviennent un sujet.
- [x] **« Mettre à jour l'injection » pour un comprimé** : fait le 2026-08-17
      (`15e0037`), Mixte seule — le bouton dit « Mettre à jour la prise »
      quand le traitement est oral, comme le bandeau. Les six autres
      exemplaires du formulaire (Initiale, Cartes, Sidéral, Test) gardent
      l'écart : versions gelées.
- [x] **Le journal des pesées réécrit `useInlineEditableLog` à la main** :
      fait le 2026-08-17 (`e8111c4`), Mixte seule. `InlineWeighInRow` prend
      le hook comme les quatre autres journaux, le rendu ne bouge pas d'un
      pixel, et le contournement `chosen ?? …` qu'elle s'était donné le matin
      même disparaît (le `draftRef` du hook le rend inutile). Vérifié avant de
      basculer que `listHistory` trie et filtre sans recopier ses éléments —
      sans quoi la resynchronisation sur l'identité de la ligne écraserait une
      saisie en cours. Les six exemplaires gelés gardent leur réécriture.
- [ ] **Aucun test ne couvre l'édition sur place** : le hook est React, et le
      projet ne teste que la logique pure (pas de bibliothèque de rendu). Le
      défaut du 2026-08-17 — l'affichage qui bouge, la base qui ne suit pas —
      est exactement ce qu'un test de composant aurait attrapé.
- [ ] **Cinq bandeaux de graphe sont en `py-2`** (8 px) quand tous les autres
      sont en `py-2.5` (10 px) : les quatre graphes des repas et celui du
      niveau sanguin. Écart de 2 px, invisible sur une page mais réel dans la
      famille — relevé le 2026-08-17 en corrigeant les trois qui étaient en
      `p-4`. Les aligner ?
- [x] **`text-sky-905` dans `MealJournal.tsx`** : jeton retiré le 2026-08-17
      (`764fd81`). Il n'était pas dans la Mixte mais dans Initiale et Cartes,
      sur l'entête « Journal (N) ». La question « faut-il le corriger en
      `sky-900` ? » est passée en « À arbitrer » — ce serait un changement
      d'apparence sur deux versions gelées.
- [ ] **Kaléidoscope** : la position dans la ronde n'est pas retenue entre
      deux chargements (recharger tire un thème au hasard). À ajouter si
      l'usage le réclame.
- [ ] **Sidéral et Test** (gelés) : leurs galeries ne proposent pas
      Kaléidoscope, et choisir un thème depuis chez eux ramène sur la home au
      lieu de la page d'origine.
- [ ] **Les blocs des autres versions ne sont pas posés à l'endroit du
      geste** : Initiale, Cartes, Sidéral et Test rendent leurs blocs là où
      leur fenêtre était appelée dans le JSX (souvent en bas de page). La
      Mixte, elle, a été traitée écran par écran. À reprendre si ces versions
      redeviennent un sujet.
- [ ] **Les squelettes `Modal`, `ConfirmModal`, `NoticeModal`,
      `ConfirmDeleteAllModal` et les constantes `MODAL_*`** ne fabriquent plus
      de fenêtre mais gardent leurs noms : à renommer le jour où les versions
      gelées seront supprimées.
- [x] **Le clavier du select maison** : fait le 2026-08-17 (`1c39acf`), Mixte
      seule. Flèches, Origine/Fin, saisie du nom (accents et casse ignorés,
      lettre répétée qui fait la ronde), tabindex tournant,
      `aria-activedescendant`, focus posé à l'ouverture et rendu au bouton à
      la fermeture, flèches qui déroulent depuis le bouton fermé. La logique
      pure est sortie dans `shared/ui/selectTypeAhead.ts` avec 22 tests.
- [x] **Le sélecteur de traitement au clavier** : fait le 2026-08-17
      (`709428d`), Mixte seule. Il portait `glow-sel` sans passer par
      `InlineEditSelect` et n'avait donc AUCUN clavier — pas même Échap.
      Flèches, Origine/Fin, saisie du nom sur le libellé affiché, Échap,
      tabindex tournant, rôles ARIA, focus posé et rendu. Même module pur.
- [x] **Le champ d'ingrédient d'une recette au clavier** : fait le 2026-08-17
      (`c35e8a7`). C'était le seul des quatre champs à suggestions sans
      `onKeyDown` — et son Entrée SOUMETTAIT le formulaire, donc enregistrait
      la recette à moitié remplie. Flèches en ronde, Entrée, Échap, sur le
      modèle des favoris.
- [x] **`FoodSuggestionList` défile vers l'entrée courante** : fait le
      2026-08-17 (`117ecc6`), les quatre champs d'un coup. Devenu nécessaire le
      jour même, le plafond des suggestions passant de 10 à 20 (`ac9f008`) à
      hauteur de panneau inchangée : la moitié de la liste est hors de vue. Le
      focus reste dans le champ de texte, contrairement au select maison.
      Rôles `listbox`/`option` + `aria-selected` posés au passage.
- [ ] **`aria-activedescendant` n'est pas câblé côté CHAMP** pour les
      suggestions d'aliments : les identifiants d'entrée existent depuis
      `117ecc6`, mais les relier demanderait de toucher les quatre appelants et
      leurs hooks. À faire si l'accessibilité devient un sujet.
- [ ] **`getSortedCiqualSuggestions` n'est pas testée** (`data/mealConstants.ts`)
      alors qu'elle porte tout le tri des suggestions — score de
      correspondance, priorité aux aliments créés, comptes de sélection,
      longueur — et son plafond. Elle lit le stockage et la base entière : la
      rendre testable est un chantier à part, mais c'est la fonction la plus
      employée du formulaire de repas.
- [ ] **L'arithmétique de la ronde est écrite deux fois** (favoris et recette,
      quatre lignes chacune). Pas de quoi un module partagé aujourd'hui ; à
      grouper si un troisième champ la redemande.
- [ ] Le **reste à faire du modèle de données** est listé dans CONVENTIONS.md,
      section « Reste à faire » (localDateTime, champs dérivables de
      SavedMealLog, `brand`/`glp1Brand`, HungerLevel/SeverityLevel…).

## À vérifier à l'écran

- [ ] **Code-barres déjà enregistré → fiche de mise à jour** (`af17b20`,
      agent, 2026-08-22) : scanner un code déjà dans « mes aliments »
      depuis la page aliment ET depuis le bloc — le formulaire doit
      s'ouvrir directement en modification, prérempli de SA fiche, code
      dessiné au-dessus, bouton « Mettre à jour », sans message ni clic
      intermédiaire (l'ancien message bleu + bouton « Voir / Modifier »
      est supprimé). Un scan pendant l'édition d'un AUTRE aliment doit
      basculer proprement. Décision d'agent à valider : le libellé est
      « Mettre à jour » NU (les autres formulaires accolent l'objet —
      « l'aliment » tiendrait aussi à 320 px, un mot et c'est fait).
- [ ] **Les colonnes kcal des deux tableaux** (`b7b536f`, agent, 2026-08-21) :
      la répartition passe à 6 colonnes, la composition moyenne à 7 — la
      tenue à 320 px est LE point à regarder (table-fixed, polices clamp
      jusqu'à 9 px, overflow-x-auto en dernier recours). Dans la
      composition : « ≈ 512 » après le Total, « — » pour un créneau sans
      prise, pastille sur les deux plus hautes valeurs, phrase de légende
      ajoutée sous le tableau. Interprétations de l'agent à valider :
      « double tilde » = le signe ≈ ; « la moyenne pour les repas de ces
      crenaux » = moyenne PAR PRISE du créneau sur la période (pas par
      jour).
- [ ] **Bleu matinal immersive** (`d41e7be`, 2026-08-21) — galerie, carte
      après Bleu matinal. À regarder :
      1. la home : TOUS ses blocs en blanc opaque, encres sombres lisibles
         (le verre de l'original les avait éclaircies — elles sont
         restaurées) ; à comparer avec Bleu matinal côte à côte ;
      2. la page injection : formulaire ET graphes en blanc, le journal
         RESTE en verre (il n'est ni home, ni graphe, ni formulaire — dire
         si c'est voulu autrement) ; le graphe du niveau sanguin repasse en
         bleu sombre sur blanc ;
      3. l'entête ET la bande de titre : fondues dans le ciel en haut de
         page, verre au défilement (56 px de course), le filet suit ; le
         menu du bas en verre en permanence ;
      4. les polices : titres Outfit, chiffres JetBrains Mono (plus de
         Playfair ni de Georgia) ;
      5. un bloc à la fois « home » et « formulaire » gagne le blanc — et
         les blocs HORS des trois familles (journaux, listes, profil sans
         <form>) restent au verre de Bleu matinal : c'est la lecture
         littérale de sa demande, à confirmer à l'écran.
- [ ] **Les trois thèmes Immersive** (`c3fd60a`, 2026-08-21) — galerie des
      thèmes, trois nouvelles cartes après Aurore. Sur chacun :
      1. **l'entête caméléon** : en haut de page, le logo se pose sur le
         ciel sans bandeau ; dès qu'on défile, le verre de nuit se pose
         (56 px de défilement pour l'opacité pleine) ;
      2. **le ciel qui transite** : changer de page fait glisser la
         tonalité en 1,4 s, sans à-coup ; revenir sur une page retrouve la
         même ambiance ;
      3. **A** : blocs en panneau blanc du site (entête bleu pâle, titres
         Outfit marine — AUCUN titre bleu), tiroir du « + » et menus « … »
         en verre de nuit à encres blanches ;
      4. **B** : tous les blocs en verre de nuit — vérifier la lisibilité
         du petit texte en BAS de page (le ciel y est le plus clair, c'est
         le cas limite qui a dicté le voile) ;
      5. **C** : le bloc Salut et le défilé des dernières entrées en verre,
         le reste comme A ;
      6. les boutons de validation en pilule avec halo ; la courbe de poids
         et la progression en VERT ; les chiffres en JetBrains Mono ;
      7. le graphe du niveau sanguin (courbe verte) et son mode daltonien
         (qui doit rester ambre/inchangé) ;
      8. à 320 px, et dans la ronde du Kaléidoscope (les trois y passent,
         ciel figé sur la tonalité d'ouverture).

- [ ] **La simulation d'onboarding** (`1eb3c71`, `01e548a`) : Admin →
      Onboarding. Le parcours entier, les six branches (déjà commencé oui/non,
      objectif « stabiliser » qui retire le poids cible, séances oui/non,
      cahier alimentaire oui/non), le bouton « Passer cette étape » sur chaque
      question, le retour en arrière, et « Recommencer ».
      **Le point le plus fragile : le choix du thème.** Il recharge
      l'application ; le questionnaire doit revenir à l'étape suivante, avec
      ses réponses, habillé du nouveau thème. À essayer depuis plusieurs
      étapes, et deux fois de suite.
      Puis la home d'arrivée : le menu du bas et la rangée d'ajout rapide
      doivent perdre leurs pictos quand on répond non aux trois suivis, et les
      reprendre quand on répond oui. À voir aussi à 320 px — les douze
      vignettes de thème sont sur deux colonnes.
- [ ] **Les boutons d'ajout rapide sur les douze thèmes** (`5d95f29`,
      `e78411d`, `9d1ed49`) : le picto en vedette, le « + » en haut à gauche,
      le ciel du thème éclairci d'un cran. Cas particuliers à regarder :
      Nostalgic, dont le bouton est une FENÊTRE (le fond de la page passe au
      travers, un filtre l'éclaircit) ; Aurore, dont le bas ne doit plus tirer
      vers le jaune ; les deux éclipses, sans lune ni soleil.
- [ ] **Le kaléidoscope sur une session entière** (`9389464`) : changer de
      page une douzaine de fois et vérifier qu'aucun thème ne passe deux fois
      avant que tous soient passés.
- [ ] **Le retour en haut de page** (`dacd4dc`) : depuis la rangée d'ajout
      rapide, depuis les deux « + » du bas, et par le bouton retour du cadre —
      la page d'arrivée doit se montrer par son haut, sans glisser.
- [ ] **La page « Un temps pour soi » sans sa devise** (`b835a62`) : le bouton
      d'ajout vient directement sous le titre, l'espacement doit tenir.

**Dépilage du 2026-08-17 (après-midi) — COMMITÉ PAS POUSSÉ (`764fd81`,
`15e0037`, `e8111c4`) :**

- [ ] **Journal des pesées, le geste complet** : modifier un poids, une date
      et une heure sur une ligne, puis RECHARGER — la valeur doit avoir été
      enregistrée, pas seulement affichée (c'est le défaut du matin, sur un
      autre journal). Le journal est passé sous la mécanique commune, son
      dessin ne doit pas avoir bougé d'un pixel.
- [ ] **Les deux refus de ce journal** : déplacer une pesée sur un jour qui
      en porte déjà une (« Une pesée existe déjà le … », la date revient en
      arrière), et faire passer la pesée de DÉPART après une autre pesée (le
      bloc d'avertissement, pas la phrase bleue).
- [ ] **Le bouton du formulaire de traitement pour un COMPRIMÉ**, en
      modification : il dit maintenant « Mettre à jour la prise », comme son
      bandeau. Pour une injection, rien ne change.
- [ ] **Le select maison au clavier** (`1c39acf`) : ouvrir un select de
      formulaire (durée d'une activité) ou un select d'édition sur place (zone
      d'injection dans le journal) SANS la souris — flèche bas pour dérouler,
      flèches pour se déplacer, le début d'un nom pour sauter à une entrée,
      Entrée pour choisir, Échap pour renoncer. Et surtout : le focus doit
      REVENIR sur le champ après la fermeture, au lieu de se perdre.
      À regarder aussi dans un thème sombre et à 320 px : la liste se décale
      d'elle-même pour montrer l'entrée courante, et ce défilement est
      nouveau.
- [ ] **Le sélecteur de traitement au clavier** (`709428d`) : sur la page
      profil, dans la fenêtre de changement de traitement et dans l'édition
      rapide de l'accueil — flèche bas pour dérouler, « oz » pour aller à
      Ozempic, Échap pour renoncer (la touche ne faisait RIEN avant). Vérifier
      que le panneau de certification du rétatrutide s'ouvre toujours
      normalement, et que la liste ne se referme pas en se montrant (son
      défilement automatique est neuf, et un défilement de page la fermait).
**Ses trois demandes du 2026-08-17 (soir) — COMMITÉ PAS POUSSÉ :**

- [ ] **Le poids de départ suit la pesée la plus ancienne** (`fd2295b`) :
      saisir une pesée à une date ANTÉRIEURE au départ doit déplacer la ligne
      « Départ » du journal sur elle, recalculer la perte totale et les
      pourcentages de la home depuis elle, et le PDF médical doit la citer
      comme départ. Vérifier aussi qu'un départ déplacé plus tard reste REFUSÉ
      (l'autre sens n'a pas changé).
- [ ] **Le 4ᵉ carré des 7 derniers jours** (`c0b7f76`) : « xx repas / xx
      en-cas » à la place des trois lignes de créations. Deux lignes de 11 px
      là où il y en avait trois de 9 — à voir sous les deux habits et à 320 px.
- [ ] **Les pictos en plein, réduits à trois** (`f80094f`) : sur un thème à
      encre CLAIRE sur fond sombre, le menu du bas et la bande de titre — seuls
      la seringue (ou le comprimé), la balance et le pansement sont pleins, le
      reste est revenu en contour. Puis les filigranes des boutons d'ajout de
      la home sections : sport, temps pour soi et repas ont repris leur
      contour.

- [ ] **Une recette au clavier** (`c35e8a7`) : taper un ingrédient, descendre
      aux flèches, valider à Entrée. **La recette ne doit PAS s'enregistrer** —
      c'est ce qu'elle faisait avant, à moitié remplie.
- [ ] **VINGT suggestions d'aliments** (`ac9f008`, `117ecc6`) : taper « pain »
      dans un champ d'aliment. Jusqu'à vingt entrées, et **le panneau ne doit
      pas être plus haut qu'avant** (192 px) ni recouvrir le champ — c'est la
      moitié de sa demande. Puis descendre aux flèches jusqu'en bas : la liste
      défile d'elle-même, l'entrée surlignée reste visible, et la page ne bouge
      pas derrière. À voir aux quatre endroits (repas, item du journal,
      ingrédient de recette, favoris) et à 320 px.

**Renommage « fines lignes » + home en blocs — COMMITÉ PAS POUSSÉ
(`26f357f`) :**

> Note du 2026-08-31 : la home a été renommée « sections » (« Appelons cette
> home la home sections »). Les cartes disent désormais « Home sections » et
> « Home sections en blocs », et `homeChoice` traduit en lecture `carre` ET
> `fines-lignes` vers `sections`. Les points ci-dessous se vérifient donc
> avec les nouveaux noms ; le dernier est réglé par sa dictée du 2026-08-31.

- [ ] La page Thèmes offre TROIS cartes de home : standard, fines lignes,
      fines lignes en blocs — et le renommage n'a rien changé au pixel de la
      home fines lignes (l'ex-« carré »).
- [ ] Un appareil qui avait choisi « Home carré » doit retrouver sa home
      fines lignes sans rien refaire (la valeur `carre` est traduite en
      lecture).
- [ ] La home en blocs : les tuiles portent la signature de carte — sous
      Nostalgic d'abord, puis sous un thème sombre (les feuilles doivent les
      habiller) ; les croix ont laissé place à des écarts ; séparateurs de
      section et pied de page restent en encre hors-bloc.
- [ ] Le nom « Home fines lignes en blocs » est mon choix — un mot d'elle le
      remplace.

**Code-barres et pied de la page d'export — COMMITÉ PAS POUSSÉ
(`898ebe0`, `89e2334`) :**

- [ ] Ajout par code-barres, champ vide → « Rechercher le produit » : notre
      message bleu dans le bloc, PLUS la bulle orange du navigateur ; il
      s'efface dès qu'on tape.
- [ ] Le pied « Présents sur cette période » : jusqu'à 7 carreaux sur deux
      colonnes (4 au plus jusqu'ici) — à 320 px et sous les douze thèmes.
- [ ] Les pas figés : arriver sur la page d'export, ajouter des pas ailleurs,
      revenir — le total doit avoir bougé ; changer de période sans quitter
      la page doit recalculer sans rafraîchir la journée en cours.
- [ ] `FeedbackSettings.tsx` garde un `required` : sa bulle ne peut pas
      paraître (bouton désactivé tant que le message est vide), mais le
      dé-désactiver et lui écrire un refus reste à faire — c'est le dernier
      bouton grisé de la Mixte.

**Suppression de compte, en bas de la page profil — COMMITÉ PAS POUSSÉ
(`a5e82ee`) :**

- [ ] Le bloc au repos, tout en bas de la page profil, après le
      remerciement : sous les douze thèmes (il porte la signature de carte,
      il doit être habillé comme les autres) et à 320 px en iframe.
- [ ] Le clic sur « Supprimer mon compte et mes données » : la mise en garde
      s'ouvre DANS la page, pas en fenêtre ; « Annuler » la referme sans rien
      faire.
- [ ] **Le vrai geste, à faire en dernier et en connaissance de cause** : il
      supprime pour de bon le compte Firebase et efface tout le stockage. À
      l'écran ensuite : la page de connexion, et un compte à recréer dans la
      console avant de pouvoir revenir.
- [ ] Le chemin `auth/requires-recent-login` (session ancienne) : message
      bleu + bouton « Se reconnecter » — c'est le chemin le plus probable au
      premier essai, la session étant mémorisée sans limite de durée.

**Messages de formulaire au clic sur Valider — COMMITÉ PAS POUSSÉ
(`eb55c0b`, `392f1de`, `cf8ad77`, agent) :**

- [ ] Le cas de la capture : pesée vide/« 0 »/« 5000 » → Valider →
      « Un poids entre 0,1 et 1000 kg est attendu. » pleine ligne au-dessus
      du bouton ; RIEN pendant la frappe ; la saisie fautive reste visible ;
      retoucher efface.
- [ ] Pesée + mensuration fautives → deux messages EMPILÉS.
- [ ] Injection « Autre dose » vide/« 0 » → message au clic, effacé à la
      retouche (comportement du 2026-08-16 conservé).
- [ ] Sport : durée « Autre » vide ; natation distance « 5 » (min 10 m) —
      une distance illisible ne passe plus en silence.
- [ ] Profil : deux champs vidés → messages empilés AVANT le bouton (plus
      sous les champs) ; deux poids fautifs = une seule phrase.
- [ ] Repas : aliment non choisi dans la liste → bouton CLIQUABLE, message
      au clic (avant : bouton désactivé en permanence) ; titre favori
      vide/doublon/plafond → messages au clic.
- [ ] Aliment : nom vide → notre message (le `required` natif est parti,
      plus de bulle navigateur) ; nutriment à 99999 → message.
- [ ] Favoris : « Enregistrer » sans aliment → message NOUVEAU ; recette :
      message déplacé au-dessus du bouton.
- [ ] Décision d'agent à valider : un refus s'efface dès la retouche de son
      champ et revient au prochain clic (la règle de la dose, généralisée).

**Home carré, suite du soir — jeton d'encre hors-bloc (`d693c08`) :**

- [ ] La home carré sous les ONZE thèmes : l'encre hors-bloc vient
      maintenant du jeton de chaque feuille (prune sur Aurore, navy sur
      Bleu ensoleillé, brun sur Désert, crème sur les couchants, blanc
      ailleurs) — Aurore et Nostalgic en premier.
- [ ] Le bloc nutrition au code couleur du contrat (kcal violet / prot
      bleu / fibre vert, nuancés par thème) — ces encres étaient calibrées
      pour des fonds de bloc, à confirmer hors bloc sur chaque ciel.
- [ ] La rangée des « + » dynamique : elle suit les modules activés, dans
      l'ordre du menu du bas ; à 6 boutons sur 320 px ils rétrécissent.
- [ ] Le carré poids : % du poids de départ ajouté, Départ/Objectif à la
      moitié d'Actuel et du %, Actuel recentré.
- [ ] Le pied de page de la home STANDARD garde ses blancs : sous Aurore il
      souffre du même mal — à traiter à sa revue.

**Lot du 2026-08-16 (après-midi) — home carré à nu, modules, focus — COMMITÉ
PAS POUSSÉ :**

- [ ] **Home carré sous NOSTALGIC** (`9679a66`) : les encres des carrés nus
      sont passées au blanc (langue du pied de page) pour être lisibles sur
      les ciels sombres — vérifier que les grandes valeurs blanches tiennent
      sur le dégradé CLAIR de Nostalgic ; sinon il faudra un jeton d'encre
      hors-bloc par thème.
- [ ] **Boutons d'ajout « carré net filigrane »** (`9679a66`) : angles vifs,
      + dominant, icône du menu en filigrane 20 % au coin — à voir à 320 px
      et sous les thèmes sombres.
- [ ] **Un libellé de tuile de perte encore sombre** sur un thème pourpre
      (sa capture) : `sky-800`, dépend du remap de chaque feuille — à
      confirmer thème par thème.
- [ ] **Module « temps pour soi »** (`d9a1230`) : la carte sur la page
      modules, l'entrée de menu qui apparaît/disparaît, le petit menu du
      « + » flottant qui suit, le bilan « Cette semaine » qui suit. Chez qui
      l'employait : le module apparaît DÉSACTIVÉ au premier chargement
      (drapeau neuf) — voulu.
- [ ] **Focus des formulaires** (`54f6851`, agent) : pesée (curseur dans
      Poids), injection (rien au repli, dose au clic « Autre dose »), sport
      (Distance si le sport en a une), repas — et SURTOUT : modifier un
      repas existant ne doit PAS rouvrir le menu de suggestions. Question
      de l'agent : sur la page Repas, le focus se pose à chaque arrivée sur
      l'onglet — trop insistant ?
- [ ] **Sélecteur des effets secondaires** (`ee0775f`) : fermé « Asthénie »
      tout court, liste ouverte au nom entier.
- [ ] **Séparateurs de section** (`b299433`) : pastille blanche translucide
      lisible partout, y compris Nostalgic.

**Journal des repas réorganisé — COMMITÉ MAIS PAS ENCORE POUSSÉ (`49c8e7a`,
agent) :**

- [ ] L'entête de journée en deux colonnes : les kcal du jour à gauche
      (taille des heures de repas), la date à droite avec les macros dessous.
      Vérifier l'alignement visuel kcal-du-jour / heures sur une journée
      dépliée, à 320 et 480 px — l'alignement est structurel (mêmes classes,
      même gap), pas verrouillé au pixel (`px-1.5` contre `px-2.5`).
- [ ] Le repli des macros de l'entête entre paires à 320 px (jamais
      tronquées).
- [ ] Une journée repliée puis dépliée : le clic, le filet 2/3, et la ligne
      d'un repas strictement identique à avant.

**Home carré réorganisée — COMMITÉ MAIS PAS ENCORE POUSSÉ (`9502682`, agent) :**

- [ ] Les trois séparateurs « En direct / Progrès / Cette semaine » : traits
      `white/40` lisibles sur le dégradé, pastille au format du chip « En
      direct » du bloc alimentation.
- [ ] La ligne des 4 carrés d'ajout à 320 px (icônes centrées, bandes « + »
      pas trop étroites).
- [ ] Le carré traitement compact : le pied « nom · N prises · X mg » sur
      deux lignes quand le nom est long, et l'équilibre face au carré poids.
- [ ] La rangée « Cette semaine » sans le sport : trois carrés + une case
      vide à droite — voulu ou à resserrer ?
- [ ] Quand une tuile de perte est absente, le carré d'en face reste seul sur
      sa demi-ligne — à arbitrer si ça choque.
- [ ] Le 4ᵉ carré compte désormais les créations des **7 derniers jours**
      (`3fed331`) — les menus ont reçu `createdAt` et un plafond de 50/jour,
      comme les aliments (50) et recettes (20) l'avaient déjà. Ce qui
      existait avant les plafonds n'a pas de date et ne compte pas : le carré
      peut afficher 0/0/0 sur une base ancienne, c'est normal.
- [ ] Le 51ᵉ menu d'une même journée doit être refusé avec le message bleu,
      aux trois endroits : la case « favori » du formulaire de repas (bloque
      la validation, comme le doublon), « Ajouter aux favoris » depuis le
      journal, et la création directe dans la gestion des favoris.
- [ ] Journal des repas (`59da9d6`) : plus de trait de séparation entre
      l'entête d'une journée dépliée et ses repas.
- [ ] La Bibliothèque d'Insolites a disparu des DEUX homes (`93fc3fe` pour
      la standard) ; elle reste accessible depuis l'admin.

**Police des titres — COMMITÉ MAIS PAS ENCORE POUSSÉ (`1b01727`) :**

- [ ] Les titres qui quittent Playfair Display : les **trois panneaux
      « Gérer »**, les **cinq titres des blocs du métabolisme** (qui suivent,
      constante partagée), « **Ajouter aux favoris** », les **confirmations de
      suppression**, les **blocs d'avertissement**, le **bloc de partage**, et
      le titre « **ÉVOLUTION PONDÉRALE** » du carré du poids de la home carré.
      Vérifier qu'aucun ne se met à déborder : la police habituelle est plus
      large que Playfair à taille égale.

**Panneaux « Ajouter / Gérer » — COMMITÉ MAIS PAS ENCORE POUSSÉ
(`95b8166`, `517f5ef`) :**

- [ ] Les trois panneaux (sports, effets secondaires, temps pour soi)
      s'ouvrent maintenant **en fenêtre**. Vérifier qu'aucun ne déborde du
      cadre, en largeur comme en hauteur, et que la marge de 16 px est bien
      là. **Le cas à regarder en premier : les effets secondaires** — le plus
      long des trois — dans un cadre à 320 px, en iframe.
- [ ] Leur **première** ouverture après un rechargement (c'est elle qui
      pouvait se peindre au mauvais endroit, corrigé par `517f5ef`).

**Lot du 2026-08-16 (soir) — poussé et déployé, RIEN regardé à l'écran :**

- [ ] La **page Thèmes** refaite : titre « Présentation », les deux cartes de
      home, le titre « Thèmes », les boutons « Choisir », et surtout **plus
      aucune vignette** — vérifier que les cartes ne s'affaissent pas sans leur
      image.
- [ ] La **home carré** sous Nostalgic : ses étiquettes « Départ » et
      « Objectif » viennent de passer au gris clair, comme la home standard.
- [ ] Le **bloc insolite après une pesée** et celui de la home nomment bien
      **le même objet** pour la même perte (c'était le bug corrigé).
- [ ] Le **message de dose** : dose personnalisée cochée, champ laissé vide,
      Valider → la phrase doit apparaître au-dessus du bouton, et disparaître
      dès qu'on touche à la dose.
- [ ] Les **plafonds des repas** : le 51ᵉ aliment et la 21ᵉ recette d'une même
      journée doivent être refusés avec un message, sans rien perdre.
- [ ] Le **message des favoris** (« Ce titre existe déjà… »), désormais bleu.
- [ ] Les **pourcentages de pas** du journal, qui divisaient par 10000 au lieu
      de 8000.


**Lot du 2026-08-15 (soir) — la fin des popups**, aucun regardé à l'écran :

- [ ] Les **confirmations de suppression** des sept journaux : le bloc s'ouvre
      bien sous le bouton, et pour un favori **à la place de sa ligne**.
- [ ] Les **blocs « Gérer »** (sports, effets secondaires, temps pour soi) :
      entre le formulaire et le journal.
- [ ] **Ajouter aux favoris**, **ajout rapide d'un favori**, **scanner de
      code-barres** : leur nouvelle place dans la page.
- [ ] Les **félicitations** (badge débloqué, palier d'IMC) en tête de page, et
      le **palier d'IMC de la maison** sous le carré du poids.
- [ ] La **confirmation de pesée** à la place du formulaire.
- [ ] Le **détail d'un badge** en sous-page, et le retour.
- [ ] L'**avertissement médical** en page — au premier lancement (seul à
      l'écran) et appelé depuis la maison.
- [ ] Le **partage** en bloc (pesée, sport, repas), et son message Instagram.
- [ ] Les **trois panneaux de Mon Ciel** amarrés en bas de la scène.
- [ ] Les **messages de limite** en tête de page (16ᵉ repas, 3ᵉ injection).
- [ ] **Initiale, Cartes, Sidéral, Test** : leurs fenêtres sont devenues des
      blocs par la bande (Modal + constantes), elles s'ouvrent donc **là où
      leur JSX les rendait**, souvent en bas de page. À regarder si ces
      versions comptent encore.

Lots posés le 2026-08-15 (après-midi) qui n'ont pas encore été regardés :

- [ ] Les **badges** sous les dix thèmes (page Badges et home) : médailles,
      rubans aux gammes des métaux, robes des personnages.
- [ ] Le **« + » de la home** : apparition au premier défilement, petit menu
      d'ajout, bascule vers chaque page avec le formulaire ouvert.
- [ ] Les **titres de bloc en `text-sm`** (~37 titres).
- [ ] **Kaléidoscope** : la ronde tourne bien toutes les 5 pages, au hasard.
- [ ] Le **changement de thème** : depuis une page, « Choisir ce thème »
      ramène sur cette page habillée du nouveau thème.
- [ ] Le **select du sport** : le geste du bug (ajouter → défiler → remonter →
      ouvrir le select) dans un thème à verre.
- [ ] Les **menus « … »** et le **sélecteur d'effort du sport** dans un thème
      sombre.

## Campagne de tests jamais faite (dette ancienne, 2026-08-06) — REFERMÉE le 2026-08-17

Reprise sur son feu vert (« vas y »). En regardant les quatre points un par un,
trois étaient devenus vrais en chemin : la couverture s'est faite au fil des
chantiers, sans que ce pense-bête soit mis à jour. Un seul restait à écrire.

- [x] **Les quatre chemins d'écriture des pesées** (`64530df`). Deux étaient
      déjà couverts (`removeLogById`, `removeAllWeightsButStarting`), plus le
      poids de départ du profil (`setStartingWeight`). Les DEUX écritures du
      journal, elles, vivaient dans le corps de `useAppData` : sorties dans
      `features/weight/weighInWrites.ts` et couvertes par 29 tests.
- [x] **« Supprimer tout l'historique »**. Le seul des sept journaux qui ait
      une règle est celui des pesées — épargner le poids de départ —, et
      `removeAllWeightsButStarting` est testée, y compris « reste seule debout
      après un supprimer tout ». Les six autres `handleClearAll*` font
      `journal: []` : il n'y a rien de pur à tester.
- [x] **Le refus de supprimer un aliment utilisé par une recette**.
      `recipesUsingFood` (5 tests, dont l'ingrédient Ciqual homonyme) et
      `foodUsedByRecipesMessage` (4 tests, singulier/pluriel/énumération) sont
      couvertes dans `customFood.utils.test.ts`.
- [x] **Le rechargement d'une sauvegarde existante**. `appData.test.ts` couvre
      la chaîne complète (« convertit une sauvegarde d'avant tous les
      chantiers ») ET son idempotence (« sans effet si on la rejoue — le cas de
      tous les chargements suivants »), migration par migration.

Ce qui reste vraiment découvert, et qui n'était pas dans cette liste : les
COMPOSANTS. Le projet n'a pas de bibliothèque de rendu, donc ni l'édition sur
place, ni les claviers posés le 2026-08-17, ni les formulaires ne sont testés.
C'est la dette qui compte désormais, pas celle-ci.

---

## ARBITRAGE À LUI DEMANDER — l'unité de l'axe du niveau sanguin (2026-08-30)

Sa consigne : « pas compris. Mets toi dans ta todo de m'en reparler plus
tard. » Le sujet vient de l'étude comparative du 2026-08-30
(`~/Desktop/GLOW/rapports/etude-comparative-courbes-concentration-glp1-vs-dev1niscool-2026-08-30.md`,
à relire AVANT d'en reparler).

**Le fait, en une phrase :** l'axe vertical du graphe du niveau sanguin est
étiqueté « Niveau Actif (mg) » (`MoleculeConcentrationChart.tsx`), mais la
valeur affichée n'est pas une masse en milligrammes. `normFactor`
(`src/utils/pharmacokinetics.ts`) normalise le pic d'une dose unique à la
valeur de la dose : une dose de 1 mg culmine donc à 1,00, quelle que soit la
molécule.

**Ce que ça casse, et ce que ça ne casse pas.** À l'intérieur d'une même
molécule, TOUT est juste — c'est une constante multiplicative : la forme de la
courbe, les pics, les creux, l'accumulation, le niveau en direct, le prochain
pic. Ce qui est faux, c'est la COMPARAISON ENTRE MOLÉCULES (1 mg de
sémaglutide et 1 mg de tirzépatide s'affichent tous deux à 1,00, alors qu'ils
culminent en réalité vers 60 et 70 ng/mL) et l'ÉTIQUETTE, qui annonce des
milligrammes qui n'en sont pas.

**Le correctif, si elle le veut :** remplacer `normFactor` par
`ka·1000/(V/F·(ka−ke))` et ajouter un volume apparent de distribution par
fiche de molécule. Le calcul est trivial ; le coût est la révision de tous les
libellés, échelles, partages et PDF qui affichent cette valeur — de l'ordre
d'UNE JOURNÉE.

**Comment le lui présenter :** ne pas partir de `normFactor`. Partir de
l'écran — « le chiffre que tu lis n'est pas des mg, c'est une proportion de ta
dose ; c'est exact pour suivre TON traitement, faux si on compare deux
molécules » — puis demander si la comparaison entre molécules l'intéresse. Si
elle ne l'intéresse pas, corriger l'étiquette suffit peut-être, et c'est dix
minutes au lieu d'une journée.

---

## À IMPLÉMENTER — l'animation d'attente du scan de code-barres (2026-08-30)

Elle a choisi, sur la planche « Quinze attentes »
(https://claude.ai/code/artifact/ed96f546-d124-4473-9daf-c55bb0cf78bb,
générateur `~/Desktop/GLOW/simulations/quinze-attentes/build.mjs`) :
**« pour l'attente qd on interroge food fact, je choisis 12 Faisceau de
lecture »**.

**Où :** pendant la lecture d'un code-barres, `fetchProductByBarcode`
(`src/shared/food/food.barcode.ts`), affichée par les `MealTracker`. L'attente
va de quelques dixièmes de seconde à 10 s (le délai d'abandon posé le
2026-08-30).

**Ce qui va avec, recommandé par l'agent et non encore arbitré :** à partir de
3 s, la ligne devrait changer de mot — « Recherche… » → « Toujours en cours… »
→ le message de `barcodeErrorMessage`. L'animation dit que ça travaille ; seule
la phrase dit où on en est.

**Pas encore fait** : l'implémentation attendait la fin du balayage des champs
date/heure/select, qui touche `MealForm.tsx` et les composants de champ.

---

## CHANTIER DÉCIDÉ — scinder `MealForm.tsx` (2026-08-30)

Sa décision : « MealForm me parait gerer trop de choses. Ne pourrais tu pas le
scinder en sous blocs ? […] plus tu compartimente (avec bien sur des parties
partagées) mieux c'est » puis « fais le decoupage des que tu peux, mets les
modifications en attente ».

**La mesure qui justifie** : `src/versions/mixte/features/meal-form/MealForm.tsx`
fait 1 189 lignes, `useMealForm.ts` 562, et le composant reçoit **une
soixantaine de props**. Trois demandes du 2026-08-30 ont fait la queue sur ce
seul fichier.

**LE PIÈGE À NE PAS TOMBER DEDANS** : découper en faisant redescendre les
soixante props donnerait six fichiers plus une plomberie illisible. Le gain
n'existe que si l'état partagé passe par un CONTEXTE, sur le modèle de
`components/surimpressionGraphe.ts` (posé le même jour).

**Découpage retenu** : `EnteteRepas` (famille, date, heure, favoris) ·
`ListeAliments` (~25 props) avec `LigneAliment`, `SuggestionsAliment` et
`ScanCodeBarres` · `BlocFaim` · `BlocFavori` · `PiedValidation` (total, refus,
bouton).
**Reste dans `useMealForm`** — ce qui traverse plusieurs blocs : total
nutritionnel, validation croisée aliments/date, plafond de 30 saisies
(`mealDailyCap`), favori déduit de la liste, résolution contre la base Ciqual.
**Descend dans les blocs** : les états purement locaux (édition de la date,
détail d'une ligne déplié, liste de suggestions ouverte).

**En trois temps, chacun vert** (règle « additif → migration → suppression ») :
poser le contexte et extraire sans changer le rendu, preuve par diff pixel ;
rebrancher les appelants et laisser tomber les props ; supprimer le reste du
monolithe.

**EN ATTENTE DERRIÈRE CE CHANTIER, à sa demande** — à faire APRÈS, sinon on
écrit deux fois :
- le faisceau de lecture pendant l'attente d'Open Food Facts (voir la section
  dédiée plus haut) — il atterrit dans `ScanCodeBarres` ;
- l'ouverture du formulaire d'ÉDITION d'une saisie sous la couche vitrée, avec
  sa confirmation — elle atterrit dans le pied de validation et dans la liste.
