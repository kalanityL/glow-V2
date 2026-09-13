# VOCABULAIRE — les mots du projet, tels qu'elle les a tranchés

Ce fichier ne dit qu'une chose : **quel mot employer, et lequel ne plus
employer**. Il est relevé de la V1 (`CONVENTIONS.md`, `TODO-CLAUDE.md`,
`SUIVI-PUSHS.md`, `SPEC-FONCTIONNELLE.md`, `TIPS-UX-UI.md`, `TODO.md` et les
commentaires de `src/**`) et de la V2 (`GUIDELINES.md`, les deux TODO, les
commentaires de `src/**` et les messages de commit) — les décisions de mots y
étaient éparpillées, elles sont ici en un seul endroit.
**Une directive de vocabulaire non respectée coûte un travail refait** : « home
carré » mal compris a coûté une planche de vingt propositions ; « bloc
insolite » mal compris a coûté un commit annulé au `git reset --hard`.
Elle est citée **mot pour mot, fautes comprises**. Rien n'est reformulé, rien
n'est tranché à sa place.

**Convention de source** : `V1/…` = `~/Desktop/GLOW/REPO-GIT-LOCAL`,
`V2/…` = `~/Desktop/GLOW/GIT-APP-V2`.

---

## 1. Les directives tranchées

### 1.1 Les noms de domaines et de modules

| Employer | Ne plus dire | Où | Date | Source |
|---|---|---|---|---|
| « activité physique » | « sport » — et, dans les félicitations, ni « sport » **ni « séance »** | tous les textes du site, menu, home, export, PDF | 2026-08-27, réaffirmé le 2026-08-30 (« SPORT PARTOUT SUR LE SITE DEVIENT "ACTIVITÉ PHYSIQUE" ») | `V1/TODO-CLAUDE.md:1334-1336` · `V1/src/app/navigation.ts:51-58` · `V1/src/features/sport/sportEncouragements.ts:29-30` · `V1/src/versions/mixte/app/navigation.test.ts:353` · `V1/SUIVI-PUSHS.md:456-458` |
| « séances d'activité » | — (raccourci de cartouche, pour tenir la place) | cartouche du PDF | 2026-08-27 | `V1/SUIVI-PUSHS.md:457-459` |
| « repas et en-cas » | « journal alimentaire » | tous les textes | 2026-08-27 | `V1/TODO-CLAUDE.md:1335-1336` · `V1/src/versions/mixte/components/MedicalReportExport.tsx:577-580` · `V1/SUIVI-PUSHS.md:459-460` |
| « Un temps pour soi » | « Me time » (dernier libellé anglais du site) | nom du domaine, partout | nommé le 2026-08-25 (« me time s'appelle "un temps pour soi" »), français posé à la source le 2026-08-30 | `V1/src/app/navigation.ts:64-73` · `V1/src/versions/mixte/app/navigation.ts:193-198` · `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:5209-5210` |
| « Nombre de Pas » | « Pas & Marche » | nom du module, badges | 2026-08-27 | `V1/SUIVI-PUSHS.md:460` · `V1/src/versions/mixte/App.tsx:1094` · `V1/src/versions/cartes/components/BadgesPage.tsx:220-227` |
| « Repas et En-cas », « Activité Physique », « Un Temps pour Soi », « Nombre de Pas » | anciens noms de catégories de badge : « Pas & Marche », « Sport », « Alimentation » | badges, textes d'activation | 2026-08-27 | `V1/src/versions/cartes/components/BadgesPage.tsx:220-227` · `V1/src/versions/mixte/App.tsx:1090-1094` |
| « Préférences » | « Paramètres » — **plus jamais dans un texte** | menu, tous les textes | 2026-08-27 | `V1/TODO-CLAUDE.md:1342-1343` · `V1/SUIVI-PUSHS.md:455` |
| « Préférences et raccourcis » | « Paramètres et raccourcis » | `title=` du bouton roue | 2026-08-27 | `V1/TODO-CLAUDE.md:1359-1360` |
| « Menu » | « Paramètres » | entrée du menu du bas | 2026-08-26 : « Renomme l'item de menu du bas menu au lieu de parametre et change l'icone » | `V1/src/versions/mixte/App.tsx:1384-1390` |
| « Accueil » | « Maison » — **en version Mixte seulement**, les autres versions gardent « Maison » | onglet | 2026-08-27 : « renommer maison en Accueil » | `V1/src/versions/mixte/app/navigation.ts:41-44` · `V1/src/versions/mixte/App.tsx:1349-1351` |
| « Tendances », au pluriel | « Tendance » | bandeau et case | 2026-08-27 : « tendance->tendances » | `V1/TODO-CLAUDE.md:1342` · `V1/src/versions/mixte/App.tsx:323` |
| « Tendance » (l'entrée du menu du bas) | « Export », qui occupait la place | menu du bas | 2026-08-25 : « a la place d'export, mets une icone graph et appelle le "tendance" » | `V1/src/versions/mixte/App.tsx:1370-1373` |
| « Dynamique » | « Divination » — nom qu'elle-même donnait **pour provisoire** (« pour l'intant ») | section de la home, tiroir | 2026-08-28 : « divination->dynamique » | `V1/src/versions/mixte/App.tsx:343-348` · `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:2738-2753` |
| « Un temps pour soi » (page) / « Un moment pour soi » (le nom que le site donne à cette page dans une suggestion) | — | textes du sommeil | non datée | `V1/src/features/sleep/useSleepForm.ts:156-158` |

### 1.2 Le nom du produit

| Employer | Ne plus dire | Où | Date | Source |
|---|---|---|---|---|
| **GLP1LOW**, et le **mot-symbole dessiné** partout où la mise en forme est possible | « Ma Cure GLP-1 », « mon Compagnon de Cure GLP-1 », « MON COMPAGNON GLP-1 », et « GLOW » en texte brut | partout | 2026-08-30 : « ma cure glp1 n'existe pas. Partout à la place mettre glp1low » | `V1/src/features/auth/LoginPage.tsx:63-68` · `V1/src/versions/cartes/components/Maison.tsx:163-170` · `V1/src/shared/components/ShareBlock.tsx:102-107` · `V1/src/versions/mixte/components/AccountSettings.tsx:60` |
| Toute occurrence TEXTUELLE de « GLOW » s'écrit avec le mot-symbole (`<Wordmark as="span" inline />`) | « GLOW » en toutes lettres | FAQ, Sondage, PlusMenu… | 2026-08-27 | `V1/TODO-CLAUDE.md:1339-1342` · `V1/SUIVI-PUSHS.md:464-466` |
| **Seule exception** : les slogans du logo, « ready, shine, glow! », restent en toutes lettres | — | logo | 2026-08-27 | `V1/TODO-CLAUDE.md:1341-1342` · `V1/src/versions/mixte/App.tsx:1199` |
| Hors DOM (canvas, presse-papier, partage natif), le nom s'écrit en toutes lettres — le dessin n'y est pas possible | — | légendes de partage, carte de badge | 2026-08-30 | `V1/src/shared/components/ShareBlock.tsx:102-107` · `V1/src/versions/cartes/components/Maison.tsx:163-170` |
| Le mot **« cure »** RESTE là où il nomme le TRAITEMENT (« sous cure GLP-1 ») — il parle de la personne, pas du logiciel | — | partout | 2026-08-30 | `V1/src/versions/cartes/components/Maison.tsx:168-170` |
| « Rendre public votre journal Glp1low » | « Cahier de suivi en ligne » (2026-08-25 → « Rendre public de votre carnet de suivi »), puis re-renommé | Sondage | 2026-08-25 puis 2026-08-27 : « Rendre public votre journal Glp1low (écrit comme dhab) » | `V1/src/versions/mixte/components/Sondage.tsx:253-257` |
| Titre de l'onglet du navigateur : « G(lp1)LOW - Just GLOW! » | « My Google AI Studio App » | tout le site | non datée | `V1/SUIVI-PUSHS.md:3918` |

### 1.3 La page du poids et ses blocs

| Employer | Ne plus dire | Où | Date | Source |
|---|---|---|---|---|
| **« Voir la page Balance »** | « Voir la page Poids » / « Pesée » | lien du pied du widget poids, home « côte à côte » | 2026-09-01 : **« LE titre de la page est balance, donc balance »** | `V1/TODO-CLAUDE.md:185-186` · `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:4277` |
| « aller à la page balance » | — | les portes vers la page | 2026-08-31 | `V1/TODO-CLAUDE.md:285-286` · `V1/SUIVI-PUSHS.md:153-155` · `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:3725` |
| **« Cadence »** — cinquième nom | « Perte /semaine » → « Évolution du poids /semaine » → « Évolution /semaine » → « Évolution » | bandeau du graphe de la page Balance | 2026-08-31 : « page balance graph évolution, évolution-> cadence » | `V1/src/versions/mixte/features/weight/WeeklyLossChart.tsx:204-209` · `V1/TODO-CLAUDE.md:193-195` |
| « Perte par semaine », aligné à gauche | — (titre nouveau) | au-dessus du graphe | 2026-08-31 : « saute 2 lignes avant le graph, ajouter titre du graph aligné à gauche : Perte par semaine » | `V1/src/versions/mixte/features/weight/WeeklyLossChart.tsx:327-335` |
| « Nouvelle saisie » tout court | « Nouvelle saisie d'un poids » (2026-08-16), lui-même remplaçant « Nouvelle pesée » | titre du formulaire de la page Balance | 2026-08-26 | `V1/src/versions/mixte/features/weight/WeighInForm.tsx:110-115` · `V1/SUIVI-PUSHS.md:637` |
| « saisie » | « pesée » | textes de la page Balance | 2026-08-31 | `V1/TODO-CLAUDE.md:285-286` · `V1/SUIVI-PUSHS.md:153-154` |
| « Évolution » **quand le poids actuel ≥ le poids de départ**, « Progrès » sinon | — | titre de la section de la home | 2026-08-27 : « si poids actuel >= poids de depart, renommer pogres en evolution, sinon garder progres » | `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:3599-3602` |
| « 27 semaines » | « semaine n27 » | bloc de suivi du poids | 2026-08-30 : « semaine n27 -> 27 semaines » | `V1/src/versions/mixte/components/BlocSuiviPoids.tsx:457` |
| « IMC : −9,2 » (libellé reformulé, tildes retirés) | — | pastille hebdomadaire | 2026-09-01 | `V1/TODO-CLAUDE.md:199-201` |

### 1.4 Les autres titres de blocs et de sections

| Employer | Ne plus dire | Où | Date | Source |
|---|---|---|---|---|
| « Depuis le début » | « Synthèse » | tuiles et bilans de la home | 2026-08-24 | `V1/src/features/injections/injections.utils.ts:189` · `V1/src/features/sleep/sleep.utils.ts:218` · `V1/src/features/sport/sportAverages.ts:7` · `V1/src/features/steps/steps.utils.ts:261` · `V1/src/features/meal-journal/mealAverages.ts:7` |
| « dernière perte enregistrée » et « Depuis le début » | « depuis le 12/08/2026 » (les dates demandées le 2026-08-16) | libellés des équivalences insolites | **revirement du 2026-08-18** : « pour les équivalences insolites, revenir à dernière perte enregistrée et depuis le début à la place de depuis le XXX » | `V1/src/features/home/homeOverview.ts:77-102` · `V1/src/features/weight/submissionInfo.ts:43-44` |
| « Menus » | « Repas et en-cas » (2026-08-30 : « Repas et en-cas-> menus ») puis « Aujourd'hui » (le soir même) puis retour à « Menus » | titre du bloc de la home | 2026-08-30, trois fois dans la journée | `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:4984-4997` |
| Dans le CORPS de la couche, on continue d'écrire « repas » et « en-cas » | — | couche des repas | 2026-08-30 | `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:4993-4997` |
| « Évolution du niveau sanguin » | — (bloc explicatif renommé) | sous le graphe du niveau sanguin actif | 2026-08-22 : « bloc pkoi la courbe bla bla se deplace sous le graph de niveau sanguin actif, et se renomme évolution du niveau [sanguin] » | `V1/src/versions/mixte/features/blood-level/TreatmentCurveExplainerAccordion.tsx:11-13` |
| « actif » | « niveau sanguin réel » | graphe de concentration | non datée | `V1/SUIVI-PUSHS.md:744-745` |
| « Activités » | « Moments d'activité physique » (2026-08-17), qui remplaçait déjà « séances » | carreau du rapport médical | 2026-08-18 | `V1/src/versions/mixte/components/MedicalReportExport.tsx:1591-1595` |
| « Le poids et les mensurations » | « Les pesées » | section du rapport médical | 2026-08-17 | `V1/src/versions/mixte/components/MedicalReportExport.tsx:584-586` |
| « Tolérance au traitement » | — (titre du graphe d'effets) | suivi sportif | non datée | `V1/SUIVI-PUSHS.md:2773` |
| « Total calories dépensées » | — (renommé, en gris italique sous le titre) | suivi sportif | non datée | `V1/SUIVI-PUSHS.md:2772` |
| « Total » (sans capitales forcées) | « Estimation » | bandeau nutritionnel de composition | 2026-08-09 | `V1/src/versions/mixte/components/NutritionEstimate.tsx:26-27` |
| « Ajout rapide » | — (nouvelle rubrique) | home, après le bloc Salut | non datée : « ajouter apres le bloc salut une rubrique "ajout rapide" avec les boutons d'ajout rapide » | `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:891-892` |
| « 7 derniers jours » avant les barres, « Depuis le début » après le filet | le bandeau « Mes moments », **supprimé** (titre inventé faute de mieux) | bloc du temps pour soi, et son jumeau de l'activité physique | 2026-08-31 : « supprimer "Mes moments" En premier, la suite de barre pour les 7 derniers jours » ; « Avant les barres : "7 derniers jours" / aprs la ligne horizontale : "depuis le début : " » | `V1/src/versions/mixte/features/me-time/BlocMesMoments.tsx:9-46` · `V1/src/versions/mixte/features/sport/BlocDeQuoiCestFait.tsx:35-52` |
| « Aucun moment enregistré ces 7 derniers jours. » | « Aucun moment enregistré sur cette période. » | phrase d'absence | 2026-08-31 | `V1/src/versions/mixte/features/me-time/BlocMesMoments.tsx:38-46` |
| Bouton « Ajouter une entrée » + lien « Voir la page {Titre} » | — (ajout) | pied de tous les widgets « côte à côte » | 2026-09-01 : « en bas de tous les widgets cote à côte si pas déjà là : un BOUTON ajouter une entrée / un lien Voir la page + titre de la page correspondante » | `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:586-588` |

### 1.5 Les libellés de gestes et de formulaires

| Employer | Ne plus dire | Où | Date | Source |
|---|---|---|---|---|
| « Options » (bouton « … » qui ouvre modifier/supprimer), et il NOMME la saisie visée | le stylo/crayon d'édition | journal des repas | 2026-08-30 : « remplacer le stylo par ... avec dans ce menu modifier ou supprimer » | `V1/src/features/meal-journal/mealSurimpression.ts:141-147` |
| « Confirmer mon choix » | « Valider » | bouton du formulaire de sommeil, question des 12 h armée, **dans les deux modes** | 2026-08-31 : « le bouton de validation devient confirmer mon choix » | `V1/src/versions/mixte/features/sleep/SleepForm.tsx:62-65` |
| « Mettre à jour la prise » / « Mettre à jour le repas » | « Valider » en modification | formulaires en modification | non datée (commit `15e0037`) | `V1/TODO-CLAUDE.md:1648`, `V1/TODO-CLAUDE.md:1832` · `V1/src/versions/mixte/features/meal-form/FormulaireRepasEnSurimpression.tsx:41` |
| « Choisir », tout court | — | boutons de la page Thèmes | non datée (commit `24a444d`) | `V1/SUIVI-PUSHS.md:1885-1886` |
| « voir le calcul » | « voir le detail » | bloc Dynamique | non datée : « voir le detail->voir le calcul » | `V1/src/versions/mixte/components/DivinationBlock.tsx:59` |
| « Masquer dans l'application. » (avec point final) | — | case de la page Modules | 2026-08-27 | `V1/SUIVI-PUSHS.md:441-442` |
| « Badge à activer » | — | page Badges | 2026-08-27 | `V1/SUIVI-PUSHS.md:434-435` |
| « Injection » au singulier (le geste), « Injections » au pluriel (la rubrique) ; sous forme orale, les deux disent « Comprimé » | — | saisie rapide, menu | non datée | `V1/src/shared/medication/medication.labels.tsx:9-31` |
| « Indiquer un changement de traitement » quand il n'y a pas de traitement | « Ajouter une injection » | menu d'ajout de la home | 2026-08-15 | `V1/src/versions/mixte/App.tsx:350-356` |

### 1.6 Le rapport médical (PDF)

| Employer | Ne plus dire | Où | Date | Source |
|---|---|---|---|---|
| « Lisa • du … au … » — **le mot « période » saute** | « période du … au … » | bandeau du PDF | 2026-08-23 | `V1/src/versions/mixte/features/report/medicalReportPdf.ts:1585-1588` |
| — | « document d'échange clinique », retiré du bandeau (le pied de page le dit déjà) | PDF | 2026-08-23 | `V1/src/versions/mixte/features/report/medicalReportPdf.ts:1591-1592` |
| « Repas » / « En-cas » — la famille seule | **JAMAIS** « Petit-déjeuner », « Déjeuner » ni « Dîner » | PDF et calendrier des repas | 2026-08-23, après « d'où tu sors l'info petit dej dej diner ?? supprime » (2026-08-22) | `V1/src/versions/mixte/features/report/medicalReportPdf.ts:3331-3333` · `V1/src/features/meal-journal/mealCalendar.ts:129-138` |
| « Jour » | — (légende du PDF) | légende | 2026-08-31 | `V1/SUIVI-PUSHS.md:155-156` |
| « juillet/aout » — la barre oblique | le tiret d'intervalle (« Juillet – Septembre ») | calendriers fusionnés du rapport | 2026-08-24 : « le calendrier devient ainsi juillet/aout » | `V1/src/versions/mixte/features/report/reportCalendar.ts:337-341` |
| « Carnet de suivi GLP-1 », sans capitales criées | — | bandeau du PDF | non datée | `V1/src/versions/mixte/features/report/medicalReportPdf.ts:1578-1579` |

### 1.7 Les noms d'aliments, de thèmes, d'échelles

| Employer | Ne plus dire | Où | Date | Source |
|---|---|---|---|---|
| Le **nom court** de l'aliment | le libellé ANSES/Ciqual entier | autocomplétion, cartes de repas, journal, tableaux, PDF | 2026-08-23 : « noms courts partout » | `V1/src/shared/food/food.resolve.ts:44-48` · `V1/src/shared/food/food.composition.ts:48-54` · `V1/SPEC-FONCTIONNELLE.md:166-169` |
| « Asthénie » (nom court, sans la parenthèse explicative) dans le champ FERMÉ ; la liste déroulante garde le libellé entier | « Asthénie (fatigue sans possibilité de récupération) » dans le champ fermé | sélecteur d'effets secondaires | 2026-08-16 : « ne pas afficher le nom entier » | `V1/src/features/side-effects/sideEffects.utils.ts:52-60` |
| Thèmes « Ciel de neige » et « Ciel de pluie » | — | galerie des thèmes | 2026-08-24 : « appelle les ciel de neige et ciel de pluie » | `V1/src/shared/theme.ts:67-85` |
| Thème « Masculin » — **nom provisoire, de son propre aveu** | — | galerie | 2026-08-27 : « Fait un theme appelle le provisoirement "masculin" » | `V1/src/shared/theme.ts:67-85` |
| Thèmes « Glow » et « Glow light » | — | galerie | 2026-08-31 : « Création d'un nouveau theme appelé "Glow" » ; « idem que glow mais avec fond gris tres clair presque blanc au lieu du fond de page foncé de glow » | `V1/src/shared/theme.ts:67-85` |
| Le préfixe de classes du thème Glow est `glw`, **JAMAIS** `glow` (namespace des utilitaires) | — | feuilles de style | 2026-08-31 | `V1/TODO-CLAUDE.md:271-274` |
| L'échelle d'intensité d'un ressenti : 0 « imperceptible », 1 « léger », 5 « élevé » — **ses mots** | — | formulaire d'effets secondaires | 2026-08-18 | `V1/src/versions/mixte/features/side-effects/SideEffectForm.tsx:39-42` |
| Les échelles de progrès : « cette semaine », « ce mois ci » — **sa graphie, sans trait d'union, conservée telle quelle** | — | analyse de progrès de la home | non datée | `V1/src/features/home/homeProgressAnalysis.ts:179-183` |
| « Foundayo » | « orforglipron » comme nom affiché (l'identifiant, lui, ne bouge pas) | catalogue des traitements | non datée (FDA, 1ᵉʳ avril 2026) | `V1/SUIVI-PUSHS.md:1637-1639` |
| Traitement par défaut : « aucun » | « Ozempic » | profil | non datée (commit `6deda75`) | `V1/SUIVI-PUSHS.md:1881-1883` |
| « une vraie flèche, pas un graph » — le mot qui compte est le dernier | un mini-graphe en guise d'icône | icônes de tendance, briques sport et pas | 2026-08-29 : « icone menu et fleche vers haut/bas ou qqchose pour dire stable ; une vraie fleche, pas un graph. Idem pour les briques sport et pas. » | `V1/src/shared/icons/TrendArrowIcon.tsx:14-17` |

### 1.8 Les homes (V1) — la chaîne de renommages

| Employer | Ne plus dire | Où | Date | Source |
|---|---|---|---|---|
| « home sections » (`MaisonSections`) | « home fines lignes », qui remplaçait déjà « home carré » | dossier, composant, libellés (~130 occurrences) | 2026-08-31 : « la nomenclature fine ligne n'est pas extra pour la home […] Appelons cette home la home sections » | `V1/src/versions/mixte/homes/homeChoice.ts:9-38` · `V1/TODO-CLAUDE.md:1882-1884` · `V1/SUIVI-PUSHS.md:157-159` |
| « home fines lignes » (étape intermédiaire) | « home carré » | — | 2026-08-16 au soir : « renomme home carré en home fines lignes » | `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:854-864` · `V1/SUIVI-PUSHS.md:1620-1622` |

### 1.9 La V2

| Employer | Ne plus dire | Où | Date | Source |
|---|---|---|---|---|
| « Choisissez » | « Choisissez un thème » ; le surtitre « Votre thème » ; **le nom du thème écrit dans le cadre** (il reste en `aria-label`) | écran 1 de l'onboarding | 2026-09-07 : « supprimer le nom du theme dans les themes. supprimer votre theme. remplaxer choisisez un theme par choisissez » | `V2/src/i18n/textes.ts:209-211` · `V2/src/screens/onboarding/EtapeTheme.tsx:9-12, 33-36` · commit `d5daeab` |
| *(aucun titre)* | « Lequel prenez-vous ? » — lu comme le retrait du TITRE, pas de l'écran | écran « quel traitement » | 2026-09-08 : « supprimer :Lequel prenez-vous ? » | `V2/src/screens/onboarding/EtapeQuelTraitement.tsx:12-24` · commit `8c3186d` |
| « Dernière étape » | « Encore un mot sur vous » | titre du dernier écran | 2026-09-08 : « Encore un mot sur vous -> derniere etape » | `V2/src/i18n/textes.ts:229` · commit `c4e1e35` |
| « Prénom » | « Nom » | dernière étape | 2026-09-08 : « remplace nom par prenom » | `V2/src/i18n/textes.ts:187` · commit `a833080` |
| « Année de naissance » | « Âge » | dernière étape | 2026-09-09 : « remplacer age pas année de naissance par defaut 1980 » | `V2/src/i18n/textes.ts:185` · `V2/src/screens/onboarding/EtapeProfil.tsx:32-34` · commit `3bf414d` |
| « Neutre / je le garde pour moi » sur un SEUL bouton | quatre réponses de genre distinctes | avatar | 2026-09-08 : « neutre/je le garde pour moi -> meme bouton » | commit `c4e1e35` |
| Le bouton du dernier écran ne porte que **le mot-symbole dessiné** ; la phrase « Entre dans la galaxie GLP1LOW » reste en `aria-label` | le texte du bouton | dernier écran | 2026-09-08 : « entre dans la galay glp1low -> juste le logo glp1low sur le bouton » ; dicté à l'origine le même jour : « bouton : entre dans la galay glp1low » | `V2/src/i18n/textes.ts:127-136, 236` · commits `d7e6db9`, `c4e1e35` |
| Les **noms de langues s'écrivent dans leur propre langue** : « Français », « English » | une langue traduite | dictionnaire | non datée (règle du dictionnaire) | `V2/src/i18n/textes.ts:37-41` · `V2/GUIDELINES.md` § 1 |
| Les **systèmes d'unités se nomment par leurs unités** : « cm · kg », « inch · pound » | « métrique », « impérial » | écran des unités | non datée | `V2/src/i18n/textes.ts:56-58, 197-200` |
| Le nom de la fraction se dit vraiment : « Centaines de grammes », « Dixièmes de livre » | « décimale » | sélecteurs à roues | non datée | `V2/src/i18n/textes.ts:73-78, 202-207` |

---

## 2. Son vocabulaire à elle — les mots dont le sens n'est pas l'évident

### « home carré » = l'habit `blocs`
> **« NON !! home carré c'est home fine ligne en blocs »** (sa correction, 2026-08-18)

Le nom a **changé de main**. Le 2026-08-16 la deuxième home s'est appelée « home
carré », puis a été renommée « home fines lignes » le soir même, puis « home
sections » le 2026-08-31. Devant « home carré » dans une demande, il faut
comprendre **`blocs`** — la troisième home, celle que la page Thème nomme
« Home sections en blocs » et dont les carrés sont des CARTES.
**Ce que la confusion a coûté** : une planche refaite (`TODO-CLAUDE.md:1457`).
Trois fichiers le répètent, précisément pour cette raison.
Sources : `V1/TODO-CLAUDE.md:1455-1458` · `V1/src/versions/mixte/homes/homeChoice.ts:20-38` ·
`V1/src/versions/mixte/homes/sections/MaisonSections.tsx:854-868` ·
`V1/src/versions/mixte/components/ThemePage.tsx:140-147` ·
copie V2 : `V2/TODO-CLAUDE-V1.md:1471-1473`

### « bloc insolite » = le carré des pertes, PAS la Bibliothèque d'Insolites
> « Leçon de vocabulaire au passage : "bloc insolite" désignait le carré des
> pertes, pas la Bibliothèque d'Insolites »

**Ce que la confusion a coûté** : « une première interprétation a été commitée
puis annulée (`git reset --hard`) avant d'être refaite ».
Source : `V1/SUIVI-PUSHS.md:3352-3356`

### « passe en bleu » = « passe dans l'accent du thème »
> **« tu comprends, si je te dis "passe en bleu", ça ne veut pas dire en bleu sur
> tous les themes (sauf si on parle des protéines), ça veut dire passe dans une
> couleur différente de la couleur de texte habituelle du theme »** (2026-08-30)

Un **rôle**, pas une teinte. Exception : les macronutriments gardent leurs
couleurs fixes. En cas de doute, sa consigne du même jour : **« si tu as un
doute, demande-moi si je veux la couleur exactement sur tous les thèmes ou
assortie aux thèmes »**.
Source : `V1/CONVENTIONS.md:1167-1187` · repris dans `V2/GUIDELINES.md` § 2

### « tous les thèmes » = tous sauf Sidéral et Test, quel qu'en soit le nombre
> **« tous les themes ca n'est plus 11 themes, c'est tous les themes sauf sideral
> et test, peu importe le nombre »** (2026-08-17)

Corollaire d'écriture : **le nombre ne s'écrit plus** — une règle qui compte est
programmée pour mentir au thème suivant.
Source : `V1/CONVENTIONS.md:431-445`

### « 15 derniers jours » = deux dernières semaines
> **« en français 15 derniers jours veut dire 2 denieres semaines »** (2026-08-28)
> **« En anglais ça sera last couple of weeks »** (même phrase)

Une **TOURNURE, pas un compte**. La donnée reste sur ses quatorze jours ; on ne
rectifie jamais la donnée pour coller au chiffre écrit, et on ne traduit jamais
mot à mot (« last 15 days » compterait vraiment quinze jours).
Sources : `V1/CONVENTIONS.md:176-197` · `V1/src/versions/mixte/App.tsx:325-341` ·
repris dans `V2/GUIDELINES.md` § 1

### « en vitrant tout le reste de la page » = la vitre des tiroirs, pas un popup
> « c'est exactement celui-ci, et c'est le vocabulaire qu'elle a employé : "en
> vitrant tout le reste de la page" »

Un calque transparent qui referme au clic à côté n'est pas un popup au sens de
sa règle du 2026-08-15 (« plus une seule fenêtre par-dessus l'écran, plus un
seul voile sombre »).
Source : `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:4868-4876`

### « supprimer X », où X est un texte de l'écran = retirer ce TEXTE, pas l'écran
Même tournure que « supprimer votre theme » et « supprimer le nom du theme dans
les themes », qui visaient un texte.
Sources : commit V2 `8c3186d` · `V2/GUIDELINES.md` § 2 (« Lire la demande littéralement »)

### « en premier » peut vouloir dire « en premier SUR CET ÉCRAN-LÀ »
« on va mettre en premier la langue entre fr et en » a été lu « avant tout le
reste » ; elle voulait dire « en premier sur cet écran-là ». L'écran avait été
mis en tête du parcours à tort, et il a fallu revenir.
Sources : `V2/src/screens/onboarding/parcours.ts:31-33` · commit V2 `9624799`

### « un temps pour soit » = « Un temps pour soi »
Sa graphie récurrente, avec un t. Relevé comme coquille et signalé, jamais
corrigé par elle.
Sources : `V1/SUIVI-PUSHS.md:2499` · `V1/src/versions/mixte/features/me-time/BlocMesMoments.tsx:4`

### « cure » = le traitement, jamais le logiciel
« "sous cure GLP-1" parle de la personne, pas du logiciel ».
Source : `V1/src/versions/cartes/components/Maison.tsx:168-170`

### « Divination », « Masculin » = des noms qu'elle donne POUR PROVISOIRES
Elle le dit elle-même : « on va mettre une nouvelle section qu'on va appelé pour
l'intant "divination" » ; « Fait un theme appelle le provisoirement
"masculin" ». Ne pas graver un nom qu'elle a marqué comme provisoire.
Sources : `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:2738-2746` ·
`V1/src/shared/theme.ts:67-85`

### « annule » / « non reviens à ce que tu avais fait »
« Annule » remet l'état précédent ; « non reviens à ce que tu avais fait »
rétablit le dernier état montré.
Source : `V2/GUIDELINES.md` § 2

### « galay » = galaxie
Sa graphie dans la dictée du bouton final (« entre dans la galay glp1low »),
écrite « galaxie » à l'écran.
Source : commit V2 `d7e6db9` · `V2/src/i18n/textes.ts:236`

### « c ok comme ça » = ne plus y revenir
Sur le contraste du mot « kcal », le 2026-09-02 : « à ne reprendre que si elle
le redemande ».
Source : `V1/TODO.md:74`

---

## 3. Les règles d'écriture

### Le ton et la personne
- **Vouvoiement de tout le site, accords AU FÉMININ compris** : « Êtes-vous sûre
  de vouloir enregistrer… », « ajouté à votre journal ».
  `V1/src/features/sleep/useSleepForm.ts:154-155`
- Onboarding : « **Vouvoiement, sobre, sans point d'exclamation ni promesse de
  résultat** : l'application accompagne un traitement, elle ne juge rien et ne
  conseille rien de médical. Chaque question tient en une phrase ».
  `V1/src/features/onboarding/onboarding.content.ts:19-24`
- « on vouvoie, comme toutes les confirmations du site ».
  `V1/src/features/sport/sportEncouragements.ts:30`
- « Conventions de textes du projet : "activité physique", "repas et en-cas",
  **jamais de minuterie ni d'anglais** ». `V1/src/features/celebrations/celebrations.ts:86-88`
- « prise de poids -> dedramatiser » (sa ligne, son fichier). `V1/TODO.md:67`
- « tous les messages de confirmation doivent contenir une invitation à action
  suivante ». `V1/TODO.md:71`
- **Rien qui trahisse une IA** : pas d'emoji décoratif, pas de « ✨ », pas de
  centrage systématique, pas de « 200+ ». `V2/GUIDELINES.md` § 3

### Les messages, les refus, les couleurs de mots
- « **LE MESSAGE DIT CE QUI EST ATTENDU, jamais "erreur" ni "invalide"** » — et
  les quatre messages du profil sont **genrés** (« Un âge… est attendu », « Une
  taille… est attendue »), une phrase générique les aurait abîmés.
  `V1/src/versions/mixte/app/form.rules.ts:24-27`
- Une règle de saisie se dit **AVANT la faute**, en temps réel : « validation en
  temps reel, pas apres avoir cliqué sur valider ». `V1/TODO.md:72` · `V2/GUIDELINES.md` § 3
- **Le rouge n'est la couleur de rien** : « supprimer ne doit jamais etre en
  rouge » (2026-08-22), « meme couleur que modifier » (2026-08-23).
  `V1/CONVENTIONS.md:1152-1162`
- « **NOUVELLE RÈGLE : plus jamais de rouge** ». `V1/SUIVI-PUSHS.md:1888-1890`

### Les nombres, les signes, les absences
- « **-0** » quand rien n'a bougé — **jamais « 0 » nu**, qui ne dirait pas de
  quel côté on regarde (règle du document médical du 2026-08-18, étendue à
  l'écran). `V1/src/features/home/homeOverview.ts:52-54` · `V1/src/versions/mixte/features/weight/WeeklyLossChart.tsx:141`
- « **JAMAIS "0 jour"** : le jour du démarrage s'écrit "1 jour" » (décision du
  2026-08-12). `V1/src/features/home/homeOverview.ts:498-501`
- « une famille à zéro se tait — "2 snacks" tout court sur un jour sans repas,
  **jamais "0 repas"** ». `V1/src/features/meal-journal/mealCalendar.ts:143-148`
- « « <1 % », jamais « 0 % » ». `V1/src/versions/mixte/features/meal-charts/TimeSlotCompositionBars.tsx:78`
- « les libellés sont « -9 kg », **jamais « -9.0 kg »** ».
  `V1/src/versions/mixte/features/weight/WeightTracker.tsx:320`
- Sous le kilomètre, « on écrit « 400 m », pas « 0.4 km » ».
  `V1/src/features/sport/sport.distance.ts:76-77`
- **Une valeur absente se tait** — jamais un zéro, un tiret ou une moyenne à sa
  place. `V2/GUIDELINES.md` § 3

### Les durées et les dates
- « **JJ/MM**, jamais « 12 août » » (règle du 2026-08-12), répétée à l'identique
  dans sept fichiers : `V1/src/features/sleep/sleep.utils.ts:567` ·
  `V1/src/features/sport/sport.utils.ts:202` · `V1/src/features/me-time/meTime.utils.ts:78` ·
  `V1/src/features/side-effects/sideEffects.utils.ts:141` ·
  `V1/src/versions/mixte/features/weight/useWeightTreatmentChart.ts:166` ·
  `V1/src/versions/mixte/features/weight/WeightTreatmentChart.tsx:297` ·
  `V1/src/versions/mixte/features/blood-level/MoleculeConcentrationChart.tsx:367`
  (« jamais « mer. 12 » »)
- « module pas : si temps < 60 min, xx min sinon xxhxx » (2026-08-28) → « 45min »
  sous l'heure, « 1h33 » au-delà. `V1/src/features/steps/steps.utils.ts:48-51`
- Le sommeil en « xxhxx/j » : « 7 derniers jours sommeils : pas en minutes, le
  double tilde suivi de la durée moyenne par jour (/j) en xxhxx/j » (2026-08-19).
  `V1/src/features/sleep/sleep.utils.ts:165-167`
- Le temps pour soi se compte en **nombre d'occurrences**, pas en minutes : « me
  time pas en nombre de minutes mais en nombre d'occurence » (2026-08-19).
  `V1/src/features/home/homeOverview.ts:600-608`
- Une nuit se nomme par ses **deux** bords : « sam.→dim. », jamais « sam 29→30 »
  ni « sam. » seul — mais **une SIESTE ne se renomme jamais** ainsi.
  `V1/src/features/sleep/sleepNightBands.ts:64` · `V1/src/features/sleep/sleepLabel.ts:20-23`

### La grammaire française
- « **« repas » et « en-cas » sont INVARIABLES en français : ils ne prennent
  jamais d's** » ; « snack » prend son pluriel.
  `V1/src/features/meal-journal/mealSurimpression.ts:284-286` · `V1/src/features/meal-journal/mealCalendar.ts:143-147`
- **Élision** : « de l'en-cas », jamais « du en-cas » ;
  « après l'injection », jamais « après la injection » ;
  « du début À aujourd'hui », jamais « au aujourd'hui ».
  `V1/src/features/meal-journal/mealSurimpression.ts:149` ·
  `V1/src/versions/mixte/features/blood-level/treatmentCurveExplainer.test.ts:267` ·
  `V1/src/versions/mixte/components/InlineCustomDateRange.tsx:151`
- **Singulier traité** : « 1 jour », jamais « 1 jours » ; l'accord de « point »
  suit la règle française (pluriel à partir de 2).
  `V1/src/versions/mixte/features/blood-level/treatmentCurveExplainer.ts:89` ·
  `V1/src/features/meal-charts/chartAnalysis.ts:312`
- **Apostrophe typographique** partout : « Une apostrophe droite à côté des
  apostrophes courbes du reste du site se verrait ».
  `V1/src/versions/mixte/components/MedicalReportExport.tsx:589-593`
- « apparaît » plutôt que « est renseigné(e) ». `V1/src/features/sleep/sleepAnalysis.ts:196`

### Les majuscules et la ponctuation
- **Noms de modules en MAJUSCULES À CHAQUE NOM** dans les textes d'activation
  (« Nombre de Pas », « Activité Physique », « Un Temps pour Soi », « Repas et
  En-cas ») **avec POINT FINAL**. `V1/TODO-CLAUDE.md:1336-1339` ·
  `V1/src/versions/mixte/App.tsx:1062-1066, 1090-1094`
- « Total » et « sans capitales forcées » là où elle n'en a pas demandé.
  `V1/src/versions/mixte/components/NutritionEstimate.tsx:26-27` · `V1/SUIVI-PUSHS.md:1268-1270`
- **Le point final se met à TOUTES les phrases d'un jeu**, même quand elle n'en
  écrit un que sur la dernière : « c'est le rythme de l'écriture rapide, pas une
  intention typographique — et le projet met un point final aux phrases ».
  `V1/src/features/divination/divination.ts:75-79` ·
  `V1/src/versions/mixte/features/me-time/BlocMesMoments.tsx:54-55`
- « sortir les sous titres des titres (ex effets secondaire Impact global des
  effets secondaires) ». `V1/TODO.md:62`

### La vérité de ce qu'on écrit
- « **LE VERDICT DOIT TENIR DEVANT L'ÉCART QU'IL CITE** » : « assez régulières :
  de 465 à 1 937 kcal -> assez régulières avec un min à 4 fois moins que le
  max ? » (sa correction, 2026-08-18) — au-delà d'un rapport de 1,5 le « très
  régulières » est interdit, au-delà de 2,5 le « assez » aussi.
  `V1/src/features/meal-charts/chartAnalysis.ts:110-119`
- Aucune félicitation ne prétend savoir ce qui s'est passé les jours d'avant :
  « aujourd'hui » ou « trois jours d'affilée » seraient faux un jour sur deux.
  `V1/src/features/sport/sportEncouragements.ts:22-27`
- Une dose saisie à l'avance n'entre jamais dans la phrase qui situe le pic :
  « annoncer "prochain pic dans trois jours" pour une prise non faite serait
  donner une prévision pour un fait ». `V1/SPEC-FONCTIONNELLE.md:249-252`

### Les identifiants ne suivent jamais les mots
Doctrine réaffirmée à chaque renommage : **on renomme le TEXTE, jamais la clé.**
`V1/src/app/navigation.ts:58` (« L'`id` reste `sports` — c'est l'onglet visé, pas
du texte lu ») · `V1/src/app/navigation.ts:72-73` ·
`V1/src/versions/mixte/App.tsx:1389-1390` ·
`V1/src/versions/mixte/homes/sections/MaisonSections.tsx:2744-2746` ·
`V1/src/versions/mixte/components/Sondage.tsx:254-255` (« sans quoi les réponses
déjà données se perdraient ») · `V1/SPEC-FONCTIONNELLE.md:52`
Corollaire vérifié à ses dépens : **un renommage se vérifie AU RENDU**, pas au
diff — le mot « Divination » est resté à l'écran sur la home le jour du
renommage. `V1/src/versions/mixte/homes/sections/MaisonSections.tsx:2748-2753`

### L'écriture du dépôt
- **Code, identifiants, commentaires et messages de commit sont en français.**
  `V2/GUIDELINES.md` § 3
- Le message de commit cite **l'instruction telle que tapée, fautes comprises**.
  `V1/CONVENTIONS.md:30-31` · `V2/GUIDELINES.md` § 2
- **Aucun libellé anglais ne subsiste dans l'application** depuis le 2026-08-30
  (« Me time » était le dernier) ; un test le verrouille.
  `V1/src/app/navigation.test.ts:78-90`

---

## 4. Les questions de vocabulaire restées SANS RÉPONSE

1. **L'étiquette « Pesée » du défilé récent** (`recentJournal.ts:191`) : même
   règle que « Voir la page Balance », ou non ? « question distincte posée il y
   a plusieurs jours et toujours sans réponse explicite malgré ce tranchage-ci »
   — posée avant le 2026-08-31, toujours ouverte au 2026-09-01. L'onglet de menu
   « Pesée » et le carreau rapide ne sont pas visés par sa dictée.
   `V1/TODO-CLAUDE.md:186-189`, `V1/TODO-CLAUDE.md:220-221`, `V1/TODO-CLAUDE.md:291-293`

2. **Les loisirs de l'onboarding** — « Sports collectifs », « Sports en
   extérieur », « Regarder du sport entre amis » — n'ont **pas** été renommés
   par le balayage « sport → activité physique » : « des activités nommées, pas
   le module. **Signalé, sans réponse.** » (2026-08-27)
   `V1/TODO-CLAUDE.md:1329-1332` · `V1/SUIVI-PUSHS.md:479-480` · copie V2 : `V2/TODO-CLAUDE-V1.md:1345-1347`

3. **« Mes préférences de compte » contre « Mes paramètres de compte »** : un
   agent a corrigé SA formulation du 2026-08-30, qui disait « Mes paramètres de
   compte », au nom de la convention « plus jamais Paramètres ». « Convention
   contre lettre : elle doit trancher. » `V1/TODO-CLAUDE.md:392-395`

4. **Le titre de l'étape détente**, passé de « Vos moments » à « **Détente** »
   (2026-08-19) — « un mot au lieu de deux, choix de concision de l'agent. Rien
   d'autre dans le questionnaire ne porte un titre d'un seul mot. » Jamais
   validé. `V1/TODO-CLAUDE.md:1021-1024`

5. **Deux propositions de détente ne viennent pas de sa dictée** — « une partie
   de cartes » et « regarder du sport entre amis », ajoutées pour que les neuf
   activités du catalogue soient atteignables. « Deux lignes à retirer si elle
   veut sa liste exacte. » `V1/TODO-CLAUDE.md:1016-1020`

6. **« Home fines lignes en blocs » est le nom choisi par Claude** — « un mot
   d'elle le remplace ». `V1/TODO-CLAUDE.md:1898-1899`

7. **Le libellé des carrés d'équivalence est GARDÉ contre la lettre de sa
   demande** (« uniquement -0.2kg et l'image ») : elle venait de faire rétablir
   ces libellés le jour même. « Un mot à retirer si elle veut le carré nu. »
   `V1/TODO-CLAUDE.md:1126-1130`

8. **L'échelle « cela vous a-t-il aidé ? » est en chiffres 0 à 5**, « faute de
   mots qui tiennent dans six boutons côte à côte à 320 px ». Aucun mot proposé
   par elle. `V1/TODO-CLAUDE.md:1014-1015`

9. **Le nom de la formule du métabolisme** : c'est **Mifflin-St Jeor** (1990),
   nommée à tort « Harris-Benedict » jusqu'au 2026-08-24. Corrigé dans la
   version courante ; « Initiale, Cartes et les thèmes Sidéral et Test affichent
   encore "Harris-Benedict" ». `V1/SPEC-FONCTIONNELLE.md:285-291`, `V1/SPEC-FONCTIONNELLE.md:504-508`

10. **L'entrée « Injection » du panneau d'ajout rapide garde ce libellé pour un
    traitement oral** — relevé en « Non traité », jamais tranché.
    `V1/SUIVI-PUSHS.md:3205-3206`

11. **Le titre « Un temps pour soi » lu comme une coquille de « soit »** —
    « signalé », pas de réponse. `V1/SUIVI-PUSHS.md:2499`

12. **Sa liste de mots à trouver, dans son propre fichier** (`TIPS-UX-UI.md`,
    aucune ligne n'y est datée) :
    - « action plus explicite que enregistrer/valider/ok » — aucun mot proposé.
      `V1/TIPS-UX-UI.md:27`
    - « enregistrer -> visualiser la composition du repas ou visualiser mon
      parcours ? » — sa propre question, sans réponse. `V1/TIPS-UX-UI.md:33`
    - « sauvegarder -> sauvegarder et generer l'analyse ». `V1/TIPS-UX-UI.md:34`
    - « finir l'onboarding par "enregistrer ma premiere injection" ou
      "enregitrer ma premiere prise de comprimé" ou enregistrer mon premier
      repas ou enregistrer ma premiere seance d'activité physique ».
      `V1/TIPS-UX-UI.md:28`
    - le texte d'accueil à traduire : « "Thank you for trusting Together we all
      can make it happen" -> "Merci d'avoir choisi Glp1low. Ensemble, on peut
      tous y arriver." » — dicté, jamais posé dans le code à ma connaissance.
      `V1/TIPS-UX-UI.md:23`
    - « les textes de la page ciel », « les textes des infos legales », « les
      textes des cgu », « les textes de la faq » — quatre chantiers de mots
      jamais ouverts. `V1/TODO.md:34-37`

13. **V2 — deux titres d'écran sont de Claude, pas d'elle** : « Le titre de
    l'écran des unités (« Langue et unités ») et celui de l'avatar (« Composez
    votre avatar ») **sont de moi**. » En attente d'arbitrage.
    `V2/TODO-CLAUDE.md:85-86`

14. **Les libellés de section : quatre rôles, un arbitrage ouvert.** Le
    découpage légende / titre de section / libellé de champ / badge est fait ;
    l'interlettrage des 46 titres de section « se partage à peu près
    moitié-moitié » et « choisir change l'aspect de tous les en-têtes de bloc de
    l'application. **Décision de l'utilisatrice.** »
    `V1/CONVENTIONS.md:1201-1240`

---

## 5. Les contradictions relevées — rapportées côte à côte, non tranchées

**A. L'accord de genre dans les messages.** Les deux règles coexistent selon
l'endroit :
- « Le vouvoiement est celui de tout le site (« Êtes-vous sûre de vouloir
  enregistrer… », « ajouté à votre journal »), **accords au féminin compris**. »
  `V1/src/features/sleep/useSleepForm.ts:154-155`
- « Elles **ne portent pas non plus d'accord de genre** : le message s'adresse à
  qui utilise l'app. » `V1/src/features/sport/sportEncouragements.ts:26-27`

**B. « séance » interdit, « sessions » imposé.** Trois positions cohabitent :
- « Vocabulaire : « activité physique », **jamais « sport » ni « séance »** »
  `V1/src/features/sport/sportEncouragements.ts:29`
- « L'accord suit le compte (« 1 session », « 2 sessions »), la règle générale
  qu'elle a posée le 2026-08-19 pour tout le site. **Le mot est le sien —
  « sessions », pas « séances »** » `V1/src/features/home/homeProgressAnalysis.ts:331-333`
- et le raccourci de cartouche du PDF dit « **séances** d'activité »
  `V1/SUIVI-PUSHS.md:457-459`

**C. « Tendances » au pluriel, mais le titre du tiroir au singulier.**
- « « tendance->tendances » (2026-08-27) : le pluriel, bandeau et case. »
  `V1/src/versions/mixte/App.tsx:323`
- « titre tiroir devient : "tendance des 15 derniers jours" » (2026-08-28) — le
  titre servi est « **Tendance** des 15 derniers jours », au singulier.
  `V1/src/versions/mixte/App.tsx:325-341`

**D. « Préférences », plus jamais « Paramètres » — mais elle a écrit
« Mes paramètres de compte ».** Convention du 2026-08-27
(`V1/TODO-CLAUDE.md:1342-1343`) contre sa formulation du 2026-08-30
(`V1/TODO-CLAUDE.md:392-395`). Voir § 4.3.

**E. « pas de texte avant / apres », puis des libellés ajoutés.**
- « pas de texte avant / apres » (2026-08-30), qui a fait retirer jusqu'à la
  mention de la période. `V1/src/versions/mixte/features/me-time/BlocMesMoments.tsx:6-7` ·
  `V1/TODO-CLAUDE.md:399-401`
- « Avant les barres : "7 derniers jours" / aprs la ligne horizontale :
  "depuis le début : " » (2026-08-31), qui « lève, sur ce point précis », la
  règle de la veille. `V1/src/versions/mixte/features/me-time/BlocMesMoments.tsx:38-46`
  La règle générale, elle, n'a pas été levée.

**F. Le rouge : deux règles opposées, la seconde renverse la première.**
- 2026-08-06 : « le rouge est réservé à ce qui supprime »
- 2026-08-22 : « supprimer ne doit jamais etre en rouge », « supprimer dans
  l'info bulle ne doit pas etre en rouge », puis 2026-08-23 : « meme couleur que
  modifier ». `V1/CONVENTIONS.md:1152-1162`

**G. Les libellés des équivalences insolites : demandés, puis rendus.**
- 2026-08-16 : « remplacée dernière perte enregistrée par depuis le XX…
  remplacer depuis le debut par "depuis le XXX" »
- 2026-08-18 : « pour les équivalences insolites, revenir à dernière perte
  enregistrée et depuis le début à la place de depuis le XXX »
  `V1/src/features/home/homeOverview.ts:77-100`

**H. Les modules « désactivés par défaut » de « Un temps pour soi ».** Le
2026-08-16 (« ajoute me time aux modules activables ou non. par defaut, non
activé ») **renverse** son « toujours proposé » du 2026-08-12 — cité ici parce
que la note documente les deux. `V1/src/app/navigation.ts:64-68`

---

## 6. Ce qui ne vaut plus tel quel pour la V2

Ces directives sont **conservées, pas jetées** : elles disent comment elle
nomme, et le jour où l'écran correspondant reviendra en V2, c'est son mot qu'il
faudra reprendre. Mais l'écran, l'objet ou la notion qu'elles visent n'existent
pas dans la V2 d'aujourd'hui.

- **Les trois homes** (« home carré » / « fines lignes » / « sections »,
  « Home sections en blocs ») : la V2 n'a pas de page d'accueil.
  *À garder devant les yeux malgré tout* — c'est le piège de vocabulaire le plus
  coûteux du projet, et elle emploie encore ces mots.
- **La page Balance, « Cadence », « Perte par semaine », « Nouvelle saisie »,
  « saisie »** : la V2 n'a pas encore de page du poids. Le tranchage du
  2026-09-01 (« LE titre de la page est balance, donc balance ») vaudra dès
  qu'elle existera.
- **Les noms de modules en MAJUSCULES avec point final**, leurs textes
  d'activation, la page vitrée : la V2 n'a pas de modules.
- **« Préférences et raccourcis », le bouton roue, « Menu » contre
  « Paramètres », « Accueil » contre « Maison », les quatre tiroirs, les noms de
  tiroirs (« Balance », « Menus »)** : la V2 n'a ni menu ni tiroir.
- **Tout le rapport médical (PDF)** : « Lisa • du … au … », « Jour »,
  « juillet/aout », « Le poids et les mensurations », « Activités », l'interdit
  sur « Petit-déjeuner / Déjeuner / Dîner ».
- **Les noms de thèmes de la V1** (Nostalgic, Glow, Glow light, Ciel de neige,
  Ciel de pluie, Masculin, Sidéral, Test) et « tous les thèmes sauf Sidéral et
  Test » : la V2 n'a que `ciel` et `ciel-fonce`.
- **Les noms courts Ciqual, « Asthénie »** : pas de base alimentaire ni de
  journal d'effets en V2.
- **Le mot-symbole peint par les feuilles (le G, le LP1, l'encre du bandeau)** :
  la V2 a un `Wordmark`, mais pas ces règles de peinture par thème.
- **Les libellés des équivalences insolites, les badges, la Dynamique, le bloc
  « Mes moments »** : rien de tout cela n'existe en V2.

**Ce qui, de la V1, vaut TOUJOURS pour la V2** et n'est donc pas dans cette
section : « activité physique » (jamais « sport » ni « séance »), « repas et
en-cas » (jamais « journal alimentaire »), « Préférences » (jamais
« Paramètres »), « Un temps pour soi » (jamais « me time »), GLP1LOW et le
mot-symbole, le vouvoiement au féminin, l'interdit de l'anglais, « 15 derniers
jours » = deux semaines, « passe en bleu » = l'accent du thème, toutes les
règles de nombres, de dates et de grammaire du § 3, et la doctrine « le texte
change, la clé jamais ».

---

## 7. Relevé sans source sûre

Rien n'a été écarté pour absence totale de source. Trois réserves, en revanche,
sur la **date** — la directive est certaine, sa date ne l'est pas :

- **Les lignes de `V1/TIPS-UX-UI.md` et de `V1/TODO.md` ne portent aucune
  date.** Ce sont ses fichiers, elle y dicte sans dater. Toutes les entrées du
  § 4.12 sont donc datées « non datée » — il faudrait remonter l'historique git
  de la V1 pour les dater, ce que je n'ai pas fait.
- **« Mettre à jour la prise » / « Mettre à jour le repas »** : le commit
  (`15e0037`) est cité, la date ne l'est pas dans le TODO. `V1/TODO-CLAUDE.md:1648`
- **« Tolérance au traitement », « Total calories dépensées », « niveau sanguin
  actif », « Choisir », le titre d'onglet « G(lp1)LOW - Just GLOW! »** : relevés
  dans `SUIVI-PUSHS.md` à l'intérieur d'entrées de lot dont la date d'en-tête
  n'a pas été remontée jusqu'à la ligne. Les lignes citées sont exactes.
- **La règle « le projet met un point final aux phrases »** renvoie à « sa
  demande du **2026-08-2x** sur les textes d'activation » — le commentaire
  lui-même ne connaît pas le jour exact.
  `V1/src/features/divination/divination.ts:77`
