# Suivi des pushs — V2

Règle reprise de la V1 : **avant chaque `git push origin main`, l'entrée du
lot s'ajoute en haut de ce fichier et part avec ce même push.** Le résumé
doit permettre de retrouver *quand et pourquoi* quelque chose a bougé : les
défauts corrigés et les décisions prises, pas seulement les commits.

La V2 n'a **aucun déploiement** (voir GUIDELINES.md) : une entrée parle donc
du push seul, jusqu'au jour où un déploiement existera.

---

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
