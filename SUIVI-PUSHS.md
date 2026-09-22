# Suivi des pushs — V2

Règle reprise de la V1 : **avant chaque `git push origin main`, l'entrée du
lot s'ajoute en haut de ce fichier et part avec ce même push.** Le résumé
doit permettre de retrouver *quand et pourquoi* quelque chose a bougé : les
défauts corrigés et les décisions prises, pas seulement les commits.

La V2 n'a **aucun déploiement** (voir GUIDELINES.md) : une entrée parle donc
du push seul, jusqu'au jour où un déploiement existera.

---

## 2026-09-22 — neuvième push · 23 commits (`4605149..HEAD`) · déployé

**Poussé et déployé sur sa demande** (« prepare un clear push et deploy »),
neuvième déploiement sur `https://glow-private-v2.web.app`. Entrée écrite
avant le push. Le verrou de connexion, lui, était déjà en ligne depuis le
21/09 au soir (déployé par elle, `! firebase deploy --only hosting:v2`).

**Vérifié avant envoi :** `npm run build` vert — `tsc` silencieux,
`npm test` 85/85, `index-BNkmTDcm.js`.

**Ce que le lot contient :**
- LE VERROU DE CONNEXION : l'identification de la V1, même projet
  Firebase, mêmes comptes ; armé en production seulement ; « Se
  déconnecter » sur « Mon compte » ; la dépendance `firebase`, la seule.
  La connexion Google en ligne marche depuis qu'elle a ajouté
  `glow-private-v2.web.app` aux domaines autorisés (un site Hosting
  supplémentaire ne l'est pas de lui-même).
- L'AVATAR MODULAIRE, ESSAYÉ ET RETIRÉ : les SVG de `../avatars` sont le
  dessin plat qu'elle a refusé ; la fusion est défaite par commit inverse,
  l'avatar de la V1 reste.
- LE SOMMEIL : « Notez la qualité de ce sommeil », « Durée : 8 h 05 » ;
  aucune nature marquée d'avance ; les étoiles à cinq branches nettes sans
  contour (l'étoile du logo et deux halos ont vécu une heure chacun) ; le
  cadran dont l'arc et la boule sont dans les bleus des étoiles, le
  dégradé marqué du pâle au plein ; passer minuit en glissant change le
  jour ; le jour en mots d'avant-hier à après-demain, sinon la date ;
  toucher une étoile donne bien l'étoile touchée.
- LES SONS : après une simulation de vingt clics, le catalogue entier
  embarqué en fichiers rendus par `scripts/rendre-sons.mjs` ; « Bulle »
  pour la règle du poids, « Plastique » pour le cadran, « Cristal » pour
  les étoiles ; jamais incrustés dans le bundle. Sa ligne « parametre
  effets sonores » dans `TODO.md`.
- LA BALANCE : « Balance mise à jour ! » ; et le « + » mène bien à la
  prise quand la forme du traitement manque hors base (relue du
  catalogue).
- Les tests excluent les worktrees des agents (`.claude/**`).

**Répondu sans commit :** la simulation des réglages de l'avatar actuel
(agrandir, déplacer, écarter ; sourcils en courbure), en artifact.

**Non vérifié sur Android :** les sons, les gestes des cadrans.

## 2026-09-21 — huitième push · 9 commits (`31380c6..HEAD`) · déployé

**Poussé et déployé sur sa demande** (« push et deploy tout v1 et v2 »),
huitième déploiement sur `https://glow-private-v2.web.app`. Entrée écrite
avant le push. La V1 est poussée et déployée le même soir, depuis son
dépôt, avec sa propre entrée.

**Vérifié avant envoi :** `tsc` silencieux, `npm test` 78/78,
`npm run build` vert (`index-CEFH7fmb.js`).

**Ce que le lot contient :**
- LA JAUGE DE LA DURÉE du sommeil : se remplit jusqu'au repère (8 h la
  nuit, 1 h 30 la sieste) puis son bleu s'intensifie jusqu'au double ;
  deux fois plus fine (4 px) ; « 13 h de sommeil » à la place de
  « Durée : 13 h ».
- LE SOMMEIL EN TROIS ÉCRANS quand la suite ne tient pas dans l'écran
  (mesuré au rendu) : nature, les deux bords et la jauge, puis la note —
  proposée d'avance de la dernière du même genre ; le fil d'Ariane sur une
  ligne « 10/09/2026 23:45 · 11/09/2026 07:00 » et « nuit de 7 h 15 » ;
  « Valider » en troisième écran, jamais « Mettre à jour ».
- Un message qui apparaît se montre : la zone qui défile se place sur
  lui, partout (`montrerEnEntier`).
- `/long` : la même application dans un cadre dont l'écran fait 850 px,
  pour voir ce que voit un téléphone d'aujourd'hui ; `/` inchangé.
- La note de reprise du soir dans `TODO-CLAUDE.md`.

**Répondu sans commit :** la V2 en ligne n'a pas de verrou (la V1 en a un,
Firebase Authentication) ; l'option de le reprendre attend sa décision.

**Non vérifié sur Android :** les gestes du sommeil, `/long` sur un vrai
navigateur.

## 2026-09-21 — septième push · 17 commits (`2034715..d0ad92a`) · déployé

**Poussé et déployé sur sa demande** (« ok push et deploy tout »), septième
déploiement sur `https://glow-private-v2.web.app`. Entrée écrite avant le
push.

**Vérifié avant envoi :** `tsc` silencieux, `npm test` 73/73,
`npm run build` vert (`index-BLgHfq0U.js`).

**Ce que le lot contient :**
- LA PAGE D'UN SOMMEIL et sa confirmation : le formulaire de la V1 et ses
  règles (durée nulle refusée, question au-delà de douze heures,
  recouvrement refusé, quinze par jour), en deux temps — Nuit ou Sieste en
  gros boutons, puis la suite avec son encoche ; chaque bord en carte
  d'après son dessin `horloge.png` (couleurs relevées au pixel), avec un
  CADRAN dont la boule se glisse, les crans d'une montre, l'arc en dégradé
  le long de l'arc ; « Hier » / « Aujourd'hui » ; la note en cinq étoiles
  dans le dégradé du « + », sans mot ; largeurs fixées.
- Le clic hors d'un bloc au doigt comme à la souris.
- L'indice de défilement dans le coin droit, sans anneau.
- Les réponses à choisir de l'avatar au style des formulaires.
- Le fond « Café parisien » remplacé par sa nouvelle image.
- La règle crantée qui clique à chaque cran, du son de sa roue de la
  fortune (huit morceaux découpés, une file à 45 ms).
- Son TODO : la limite du 1er mois gratuit.

**Non vérifié sur Android :** le clic hors bloc au doigt, le glissement de
la boule du cadran, les étoiles au doigt, les clics.

## 2026-09-21 — sixième push · 1 commit (`fd237aa..ffb1bf6`) · déployé

**Poussé et déployé sur sa demande** (« push et deploy »), sixième
déploiement sur `https://glow-private-v2.web.app`. Entrée écrite avant le
push.

**Vérifié avant envoi :** `tsc` silencieux, `npm test` 67/67,
`npm run build` vert (`index-B9jdgiLu.js`).

**Ce que le lot contient :** l'indice de défilement ne se montre plus
quand il reste moins qu'une pastille à voir (sa capture : la pastille
posée sur « Oui » pour la marge sous les boutons).

## 2026-09-21 — cinquième push · 2 commits (`a764a77..141bfee`) · déployé

**Poussé et déployé sur sa demande** (« push et deploy ce qui est pret »),
cinquième déploiement sur `https://glow-private-v2.web.app`. Cette entrée
est écrite avant le push et part avec lui.

**Vérifié avant envoi :** `tsc` silencieux, `npm test` 67/67,
`npm run build` vert (`index-C0s6BmvW.js`).

**Ce que le lot contient — ses captures de téléphone du matin :**
- G et LOW qui n'apparaissaient pas dans les entêtes sur Chrome Android :
  le dégradé découpé par le texte est posé sur chaque lettre ;
- les tiroirs et les blocs qui laissaient voir la page : la photo repeinte
  dessous est ancrée sur la hauteur de l'écran, plus de `position: fixed` ;
- le champ des notes qui s'ouvrait sous le bord : il se montre en entier ;
- « Valider » l'avatar qui ramenait l'onglet mais pas le volet : le
  carrousel est amené après le rendu, d'un coup.

**Non vérifié sur Android** — c'est ce déploiement qui le vérifiera.

## 2026-09-21 — quatrième push · 34 commits (`c54f5af..9552398`) · déployé

**Poussé et déployé sur sa demande** (« push et deploy »), quatrième
déploiement sur `https://glow-private-v2.web.app` ; celui de la V1 n'est
pas touché. Cette entrée est écrite AVANT le push et part avec lui.

**Vérifié avant envoi :** `tsc` silencieux, `npm test` 67/67,
`npm run build` vert (`index-C65X9RpW.js`).

**Ce que le lot contient** — du 20 septembre au soir au 21 :
- LA BASE DE LA V1, reprise telle quelle : l'objet racine `AppData` sous
  la clé `glp1_app_companion_data` — profil (avec l'avatar dans les mots de
  la V1), pesées (`WeightLog`, le départ marqué de son drapeau), prises
  (`InjectionLog`) —, ses identifiants, ses zones, ses invariants ; ce que
  la V1 ne porte pas sous `glp1_v2_reponses` ; l'enregistrement d'avant
  migré une fois. Tout ce qu'on saisit survit au rechargement.
- La page d'une PRISE (le formulaire de la V1 : date et heure d'abord, le
  traitement et un bouton par dosage plus « Autre », six boutons de zone,
  les notes, deux prises par jour) et la page d'une PESÉE (la règle crantée,
  le poids proposé = la pesée la plus récente non future, une par jour,
  « Une saisie existe déjà le … La mettre à jour ? »), toutes deux en
  modification depuis l'écran de confirmation ; sans traitement, le « + »
  ouvre d'abord « Mon traitement ».
- L'ÉCRAN DE CONFIRMATION générique, avec son image de validation ; la carte
  qui rouvre le formulaire ; « Vous pouvez maintenant : ».
- La règle crantée : au dixième, tige bleue de 2 px sur son cran, aimant
  immédiat, piste dessinée autour du poids (ouverture 4 fois plus rapide),
  toute la zone sous le chiffre qui glisse, en silence.
- LA CHARTE DES FORMULAIRES (sobre, sans icône en couleur, sans ligne, sans
  bleu, focus léger, bandeau de titre à la couleur de la V1 figé avec le
  bouton, corps qui défile) et le même bouton choisi partout, aux couleurs
  de son image.
- AUCUN `select` NATIF : les choix, l'heure et le calendrier en panneaux
  dessinés dans l'écran ; l'indice de défilement partout où ça défile.
- Les fonds : Fleurs, Brasserie, les dix de sa planche, « Aucun » ; le logo
  et l'entête aux couleurs de l'image (`scripts/palette-fonds.py`) ; l'image
  nette ; le clic sur le fond n'ouvre le thème que sur l'accueil.
- Le pilote de Chrome par DevTools (`scripts/piloter-chrome.mjs`) pour
  vérifier les gestes, et la règle : une image de référence se mesure.

**Défauts corrigés en route :** le chiffre et la graduation qui se
contredisaient (une seule source à la fois) ; la tige emportée hors de vue
par le défilement ; l'indice de défilement absent de l'avatar et après
« Injection » ; l'oubli des hashs de commit dans les réponses.

## 2026-09-20 — troisième push · 49 commits (`183a88d..deb6fad`) · déployé

**Poussé et déployé sur sa demande** (« push deploy »), troisième
déploiement sur `https://glow-private-v2.web.app` ; celui de la V1 n'est
pas touché. **L'entrée ci-dessous a été écrite APRÈS le push, pas avant**,
contrairement à la règle en tête de ce fichier : elle part dans un push de
suite, seule.

**Vérifié avant envoi :** `tsc` silencieux, `npm test` 44/44,
`npm run build` vert ; après envoi, le site en ligne sert le même paquet
que la construction locale (`index-CoPqKw5G.js`).

**Ce que le lot contient** — du 19 septembre au soir au 20 :
- les tiroirs : « Menu » ouvre et referme, le tiroir glisse depuis le bas à
  la vitesse de la V1, voile transparent sur la photo ; le tiroir du « + »
  de la V1 au style de la V2 (« Exporter un bilan », deux cases par
  rangée, icônes plus grandes au trait inchangé) ; un tiroir en ferme un
  autre ; les couleurs de son image (bleu vers marine, devise d'une
  couleur, pastilles presque blanches) ;
- les réponses enregistrées sur l'appareil ; l'avatar par défaut, une femme
  aux cheveux longs ;
- « Mon compte », page à part entière : entête des pages (la marque ramène
  à l'accueil), barre du bas, trois onglets en haut ; les informations de
  la V1 (prénom, âge édité en date, taille avec sa toise, poids de départ,
  objectif, médicament) sans titre ni crayon ; l'avatar figé avec
  « Valider » à côté, qui ramène aux informations ; toute la ligne d'une
  information lance l'édition ;
- le bloc « Mon traitement » (« Aucun » seul, hauteur pleine, boutons
  ancrés, sortie confirmée) ; le bloc « Thème » (photo ou ciel de la V1,
  aperçu sous les yeux, un clic sur le fond de page l'ouvre, sortie
  confirmée ; sous le ciel, le logo et l'entête aux couleurs de la V1) ;
- le bloc du poids : le chiffre en grand dans des cases fixes, une
  graduation qui glisse — au dixième, nombres au-dessus tous les demis,
  trois hauteurs de crans, la tige bleue de deux pixels par-dessus le cran
  désigné, aimantée et immédiate ; un seul son pour tous les clics, en
  rythme quand on glisse vite ; la hauteur du bloc qui ne bouge plus en
  passant les cent ;
- dans tous les blocs, la confirmation affichée, la croix ferme sans
  enregistrer ;
- la marge des côtés suit la largeur de l'écran, la colonne est centrée
  sur un écran large.

**Défauts corrigés en route :** le fond choisi ne mettait pas à jour le
fond de page (cascade des thèmes) ; le repère foncé de la graduation était
emporté hors de vue par le défilement — la marque foncée qu'on voyait
était le cran des 100 ; le cran gris passait devant la tige.

## 2026-09-19 — second push · 108 commits (`b69715d..6b365ab`) · déployé

**Poussé et déployé sur sa demande** (« ppush et deploy »). Le déploiement
est le second de la V2 sur son site, `https://glow-private-v2.web.app`
(créé le 2026-09-17, voir GUIDELINES § 2) ; celui de la V1 n'est pas touché.

**Vérifié avant envoi :** `tsc` silencieux, `npm test` 35/35 (6 fichiers),
`npm run build` vert.

**Ce que le lot contient** — du 9 au 19 septembre :
- la mémoire du projet : `GUIDELINES.md` (avec le contrôle des guidelines
  à la fin de chaque modification), `VOCABULAIRE.md`, les deux TODO ; les
  quatre documents de spécification (`docs/`) et leurs assembleurs ;
- deux thèmes clairs, Blanc (aux couleurs et à la police de son colorboard)
  et Dégradé doux ; le mot-symbole en marine et vert ; le français seul
  (l'anglais lit le dictionnaire français) ;
- l'accueil, sur lequel la page s'ouvre directement (l'onboarding mis de
  côté) : la barre d'état du téléphone, la photo de fond en portrait,
  floutée ; l'entête de la home de la V1 ; le salut avec les étoiles dorées
  et le placeholder d'un badge ; huit pastilles de modules, icônes de la
  V1 ; le menu du bas aux couleurs de son image, « Menu » à la place de
  « Profil » ;
- le menu principal en tiroir, vitre floue derrière, trois sections dans
  l'ordre de la V1 ;
- la page « Mon compte » (le portrait et le tiroir y mènent) : trois volets
  à onglets — Informations éditables sur place sans champ (date de
  naissance, taille, poids, poids cible), Avatar (le module de
  l'onboarding), Mon compte (adresse, mot de passe) ;
- le domaine : `dates`, `mesures` (saisie d'un poids), `correlation` (la
  nuit passée contre les apports du lendemain, Spearman, gardé prêt) ;
- la configuration Firebase du site de la V2.

**Défauts corrigés en chemin :** les liserés du choix rognés par la zone qui
défile ; un bloc de styles dupliqué dans `page.css` ; le trait des dessins
maison non compensé dans les pastilles.

**Non traité :** aucune donnée n'est enregistrée ; les entrées du tiroir
autres que « Mon compte », le menu du bas hors « Menu », les huit modules ne
mènent nulle part ; l'accueil et le compte sont en thème Blanc forcé.

---

## 2026-09-08 — premier push · 48 commits (`bc1ed76..a833080`)

**Poussé sur sa demande** (« pousse et deploy »). Le déploiement n'a pas eu
lieu : la V2 n'a pas de configuration, et le seul projet Firebase de la machine
est celui de la V1 — trois sorties lui ont été proposées, aucune tranchée.

**Vérifié avant envoi :** `tsc` silencieux, `npm run build` vert. (Pas encore
de tests à cette date — Vitest arrive le 2026-09-09.)

**Ce que le lot contient** — tout ce qui existe, du premier jour au 8 :
- le dépôt neuf (React 19, TypeScript, Vite, rien d'autre), le cadre du
  téléphone et sa barre du bas repris de Mixte ;
- deux thèmes, Ciel et Ciel foncé, sur trois étages étanches (écrans en
  classes, `page.css` sans couleur, feuilles de jetons) ; le dégradé de Ciel
  foncé réglé en une dizaine d'allers-retours mesurés en OKLCH ;
- les polices embarquées (`scripts/fetch-fonts.mjs`) et le dictionnaire
  multilingue typé (`i18n/textes.ts`) ;
- l'onboarding en neuf étapes : thème, langue et unités, objectif, poids,
  poids visé (si perdre), traitement commencé, lequel (si oui), avatar de la
  V1, dernière étape (âge, taille, prénom, e-mail, mot de passe) ; les
  billes du décompte ; le parcours conditionnel (`parcours.ts`,
  `useParcours`) ; les sélecteurs à roues ;
- supprimés en route, à ne pas réintroduire : le niveau d'activité, le
  souhait d'activité, le message « Poids saisi incorrect », la question du
  genre à part.

**Cette entrée est écrite APRÈS le push**, le 2026-09-09 : la règle du suivi
n'avait pas encore été reprise de la V1. C'est le seul push qui n'a pas eu son
entrée avant de partir.
