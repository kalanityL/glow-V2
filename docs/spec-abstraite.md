# GLP1LOW — Spécification abstraite

*Les données et les capacités, sans un mot d'interface.*

Les dix chapitres qui suivent sont écrits depuis le code de la V1 et les décisions de la V2, réfutés contre le code, puis corrigés.

**Sommaire**

1. [1. Le domaine](#1-le-domaine)
2. [2. Les entités](#2-les-entités)
3. [3. Grandeurs, unités et nombres](#3-grandeurs-unités-et-nombres)
4. [4. Le temps](#4-le-temps)
5. [5. Les capacités](#5-les-capacités)
6. [6. Les dérivations](#6-les-dérivations)
7. [7. États et transitions](#7-états-et-transitions)
8. [8. Persistance, effacement, portabilité](#8-persistance-effacement-portabilité)
9. [9. Les invariants](#9-les-invariants)
10. [10. Ce que le modèle ne fait pas](#10-ce-que-le-modèle-ne-fait-pas)

## 1. Le domaine

Le produit modélise une personne sous traitement GLP-1 et le relevé de sa cure, sur un appareil, pour elle seule. Ce chapitre pose l'acteur, la portée, les non-buts, les domaines de relevé et le vocabulaire que les neuf chapitres suivants emploient sans le redéfinir.

### Ce qui est modélisé

Trois choses. Un **profil** : qui est la personne, ce qu'elle prend, ce qu'elle vise, ce qu'elle suit, ce qu'on doit lui rappeler. Des **journaux** : des collections de lignes datées, une ligne par fait relevé. Des **référentiels** : les listes que la personne compose elle-même et auxquelles ses lignes renvoient.

Le profil et les journaux forment la **sauvegarde** : un document unique, un seul profil, neuf collections, sous une clé de stockage unique. Les référentiels ne sont *pas* dans ce document : chacun vit sous sa propre clé, à côté. Aucune structure ne porte plus d'un profil, aucune ligne ne porte d'identifiant de personne : l'appartenance des données à la personne est celle de l'appareil, non celle d'un document.

| Membre de la sauvegarde | Cardinalité | Rôle |
| --- | --- | --- |
| profil | exactement 1 | Identité, corps, traitement suivi, objectifs, drapeaux d'activation des domaines, rappels. |
| pesées | 0..n | Journal du poids et des mensurations. |
| prises | 0..n | Journal du traitement. |
| repas | 0..n | Journal alimentaire. |
| effets secondaires | 0..n | Journal des ressentis. |
| pas | 0..n | Journal de la marche. |
| séances | 0..n | Journal de l'activité physique. |
| moments pour soi | 0..n | Journal du temps pour soi. |
| sommeils | 0..n | Journal des nuits et des siestes. |
| journées | 0..n | Collection déclarée et morte : elle ne porte qu'un identifiant et une date, aucun geste de la personne n'y écrit, et les seules écritures existantes sont la collection vide et le jeu de démonstration. **[non implémenté]** |

Six de ces collections sont facultatives dans le document — repas, effets secondaires, pas, séances, moments pour soi, sommeils : une sauvegarde ancienne peut ne pas les porter, et leur absence vaut collection vide. Le profil, les pesées, les prises et les journées sont toujours présents.

### Les capacités

**Enregistrer** : créer, modifier et supprimer une ligne dans l'un des huit journaux de relevé, créer, modifier et supprimer une entrée de référentiel, et modifier le profil. **Dériver** : calculer des totaux, des moyennes, des écarts, des séries temporelles, des échéances, des paliers et des projections à partir des lignes, sans rien réécrire. **Importer** : verser dans les référentiels une fiche nutritionnelle obtenue d'une base ouverte à partir d'un code-barres, et une photographie choisie sur l'appareil, réencodée et enregistrée dans le profil. **Rendre transmissible** : produire, sur une période choisie, un document destiné à un professionnel de santé.

Le contenu du document transmissible n'est pas exactement « les domaines activés qui portent au moins une ligne sur la période ». Deux écarts sont dans le code : une rubrique qui n'est pas un domaine de relevé y entre, retenue d'avance et croisée avec aucune condition de disponibilité ; et le temps pour soi, même activé et pourvu de lignes, est exclu du chemin court, son masque de disponibilité valant faux en permanence.

Trois écritures de journal seulement n'ont pas pour cause un enregistrement de la personne : à l'installation, une pesée de départ de 95,0 kg est semée, datée de la veille, à 08:00 ; le jeu de données de démonstration remplace les journaux entiers ; les conversions de forme sont rejouées à *chaque* chargement d'une sauvegarde — elles ne sont pas appliquées une fois, elles sont idempotentes, ce qui n'est pas la même chose.

### L'acteur unique

Une seule personne par installation. Il n'existe ni liste de profils, ni rôle distinct, ni notion de tiers autorisé : le modèle n'a nulle part où loger une seconde personne.

Un compte — adresse électronique et mot de passe, ou fournisseur tiers — ne fait qu'ouvrir l'accès quand il est configuré ; il ne porte, ne transporte et ne sépare aucune donnée de suivi. La sauvegarde n'est pas indexée par compte : deux comptes ouverts tour à tour sur le même appareil lisent et écrivent le même document. Sans configuration d'authentification, l'accès est ouvert sans compte. Le compte sert d'axe de rangement aux seuls flux techniques.

La V2 n'a pas de compte : elle recueille une adresse et un mot de passe, et ne porte du sujet qu'une règle, une longueur d'au moins huit signes, un mot de passe vide n'étant pas refusé. Ni ouverture de session, ni fournisseur tiers, ni suppression de compte n'y existent. **[V2]**

Le genre de la personne est une donnée du profil, à trois valeurs : homme, femme, neutre. Il a trois usages : le calcul du métabolisme de base, où la valeur neutre donne la moyenne des deux formules et où un genre absent est lu comme « femme » ; l'identité portée par le document de synthèse ; et le jeu de démonstration, où il décide d'un taux d'entretien calorique (28, 31 ou 29,5 kcal par kilogramme), d'un prénom et d'une silhouette. Le profil porte en outre une silhouette et un avatar, lequel porte lui aussi un genre : trois emplacements pour une même notion. En V2, le genre n'est plus une donnée à part : il est une composante de l'avatar, parce qu'il s'y voit. **[V2]**

### La portée

Toutes les données de relevé vivent sur l'appareil, dans un stockage local, derrière une couche d'accès unique. Elles n'y tiennent pas sous une seule clé : la sauvegarde en occupe une, chaque référentiel la sienne, et une vingtaine d'autres portent des marques d'état — jours de première ouverture, paliers déjà fêtés, périodes retenues, compteurs. Il n'existe aucune base distante de suivi, aucune synchronisation, aucune reprise sur un second appareil.

Conséquences à assumer, toutes vraies du modèle : changer d'appareil ne transporte rien ; effacer le stockage local efface l'historique ; un stockage indisponible ou plein fait échouer l'écriture en silence. Une sauvegarde illisible n'est jamais écrasée : sa chaîne brute est recopiée sous une clé de secours si celle-ci est libre, et plus rien n'est écrit *sous la clé de la sauvegarde* pendant la session. La garde ne connaît que cette clé : les référentiels et les marques d'état continuent d'être écrits normalement.

| Flux | Sens | Ce qui passe |
| --- | --- | --- |
| Document de synthèse | sortant, sur geste | Les valeurs relevées de la période retenue. |
| Fichier peint depuis une distinction | sortant, sur geste | Un fichier JPEG remis au partage de l'appareil ; aucune valeur mesurée. |
| Fiche par code-barres | entrant, sur geste | Un code-barres part, une fiche nutritionnelle revient, vérifiée valeur par valeur, et devient une entrée du référentiel des aliments. |
| Photographie d'avatar | entrant, local | Un fichier de l'appareil, recadré au carré, ramené à 256 px, réencodé et enregistré dans le profil. |
| Réponse au sondage | sortant, technique | Un document par compte, fusionné à chaque envoi. |
| Avis, idée, anomalie | sortant, technique | Un document par message, rangé sous le compte. |
| Fiche d'un échec de production du document | sortant, technique | Cause et étape, bornes de la période demandée et son nombre de jours, ce qui était retenu et ce que le masque en gardait, et des *nombres* de lignes par journal. Aucune valeur mesurée. |
| Courrier | sortant, technique | Une file de messages à expédier, écrite en création seule et jamais relue. |

### Les non-buts

Ce que le produit ne modélise pas, et qu'aucune capacité ne doit introduire.

| Non-but | Ce qu'il exclut, et ce qu'il n'exclut pas |
| --- | --- |
| Pas de diagnostic | Aucun état de santé n'est déduit d'un relevé. L'exception est nommée et unique : l'indice de masse corporelle est rangé en six catégories cliniques, dont « Insuffisance pondérale » et « Corpulence normale » — c'est bien une qualification de normalité, et c'est la seule du modèle. |
| Pas de posologie | Aucune dose n'est corrigée ni prescrite. Mais le catalogue V1 porte des paliers de dose explicitement destinés à la saisie — 0,25 · 0,5 · 1 · 1,7 · 2 · 2,4 mg pour le sémaglutide injectable, 2,5 à 15 mg pour le tirzépatide, 3 · 7 · 14 mg pour le sémaglutide oral — et une dose est retenue d'avance : le premier palier. Le catalogue de la V2 ne porte que des identifiants, des noms et des formes. **[V2]** |
| Pas de conseil | Aucune recommandation nutritionnelle, sportive ou médicamenteuse n'est engendrée. Les objectifs quotidiens sont des valeurs par défaut modifiables, pas des prescriptions. |
| Pas de comparaison | Aucune donnée d'une autre personne n'entre dans le modèle : ni classement, ni moyenne de population, ni réseau. |
| Pas de synchronisation | Aucun compte partagé, aucun accès soignant, aucune copie distante des journaux. |
| Pas de capteur | Aucune connexion à un objet connecté ni à une plateforme de santé : tout relevé est écrit par la personne. |

Cinq dérivations vont plus loin que le relevé brut, et elles se nomment : le franchissement d'un palier de corpulence, qui nomme l'ancienne et la nouvelle catégorie ; l'estimation de la quantité de molécule active dans l'organisme, dérivée des demi-vies du catalogue ; la projection de poids des sept jours à venir, tirée du bilan énergétique de la semaine écoulée à raison de 8 000 kcal par kilogramme, et nommée en cinq verdicts de « stable » à « baisse marquée » ; le verdict de tendance énergétique, quatre paliers en valeur absolue à 4 000, 8 000 et 14 000 kcal ; et les analyses en prose des séries alimentaires, un moteur de règles qui énonce corrélation ou absence de corrélation à partir des points calculés. Le document produit porte une mention qui le désigne comme document de suivi personnel destiné à l'échange avec un professionnel de santé et non comme avis médical.

### Les domaines de relevé

Huit domaines. Sept portent un drapeau d'activation ; le poids n'en a pas et ne se désactive pas.

| Domaine | Ce qu'une ligne enregistre | Par date | Drapeau |
| --- | --- | --- | --- |
| Poids | Date, heure facultative, poids en kg, jusqu'à neuf mensurations en cm, un drapeau de départ obligatoire. | 1 au plus à la création : une ligne du même jour est fusionnée, en gardant son identifiant, son drapeau et les mensurations non fournies. À la modification, la règle ne s'applique pas. | aucun |
| Traitement | Date, heure, dose en mg, zone d'administration, note, identifiant de traitement facultatif. | 2 au plus ; au-delà, la dernière ligne du jour est fusionnée avec la nouvelle. | absent vaut activé |
| Effets secondaires | Date, heure, type d'effet, sévérité entière de 1 à 5, note. | 15 au plus ; au-delà, fusion avec la dernière du jour. | absent vaut activé |
| Alimentation | Date, heure, famille du repas, composition (au moins une quantité d'aliment), faim avant et après, entières de 0 à 5. | 30 au plus ; au-delà, l'enregistrement est refusé. Déplacer un repas vers une autre date est jugé comme un ajout à cette date. | absent vaut désactivé |
| Pas | Date, nombre de pas. Aucune heure. | sans plafond, et sans unicité : rien n'empêche deux lignes d'une même date. | absent vaut désactivé pour l'accès, activé pour les distinctions |
| Activité physique | Date, heure, nom de l'activité, intensité ressentie (douce, modérée, intensive), durée en minutes, distance facultative en mètres, note. | 15 au plus ; au-delà, fusion avec la dernière du jour. | absent vaut désactivé pour l'accès, activé pour les distinctions |
| Temps pour soi | Date, heure, nom de l'activité, durée en minutes, note. Ni intensité ni dépense : ce n'est pas de l'exercice. | 15 au plus ; au-delà, fusion avec la dernière du jour. | absent vaut désactivé |
| Sommeil | Nature (nuit ou sieste), jour et heure d'endormissement, jour et heure de réveil, qualité entière de 0 à 5, note. | 15 au plus par date de réveil ; au-delà, l'enregistrement est refusé. Une plage qui recouvre une plage existante est refusée avant écriture. | absent vaut désactivé |

Un domaine désactivé n'accepte plus d'enregistrement et ne fournit aucun contenu au document de synthèse. Désactiver n'efface rien : les lignes restent dans la sauvegarde et reviennent telles quelles à la réactivation.

La lecture d'un drapeau absent n'est pas unique dans le code, et c'est un défaut, pas une règle. L'accès aux domaines lit l'absence comme *activé* pour le traitement et les effets secondaires, *désactivé* pour les cinq autres. L'évaluation des distinctions lit la même absence comme *activé* pour l'activité physique et pour les pas, et n'accepte l'alimentation que sur un drapeau explicitement vrai. Un domaine peut donc être hors d'accès et malgré tout évalué.

**Cas limites**

Une ligne de pas peut porter un drapeau « simulée » : il est déclaré et lu, mais aucun code ne l'écrit. **[non implémenté]**

Une date portant plusieurs relevés de pas n'a pas une seule valeur : une lecture somme les lignes de la date, une autre moyenne les lignes sans les regrouper, une troisième ne retient que la première trouvée. **[arbitrage non validé]**

La date d'un sommeil est celle du *réveil* : une nuit du 17 à 23 h au 18 à 7 h appartient au 18. **[arbitrage non validé]**

Les deux jours du sommeil sont écrits et non déduits de l'ordre des heures ; c'est ce qui permet de refuser un réveil antérieur à l'endormissement. Le contact bout à bout est permis : les deux inégalités du test de recouvrement sont strictes.

La zone d'administration d'une prise est une chaîne libre dans le modèle. Sept zones sont cataloguées, rien ne les impose. **[arbitrage non validé]**

### La ligne de relevé

Toute ligne, quel que soit son journal, porte un identifiant et une date locale. La plupart portent une heure locale. Aucune ne porte d'instant de création ni de modification. Rien d'autre n'est commun.

```
ligne      = { id: string, date: 'AAAA-MM-JJ', time?: 'HH:MM', … }
ordre      = tri stable sur `${date}T${time || '12:00'}`
supprimer  = journal.filter(l => l.id !== id)          // la ligne quitte la sauvegarde
modifier   = journal.map(l => l.id === u.id ? { ...l, ...u } : l)   // fusion : une propriété absente n'efface rien
```

L'unicité de l'identifiant n'est garantie que pour les repas, dont l'identifiant est universel et ordonné dans le temps. Les sept autres journaux composent le leur d'un préfixe et de l'instant de création à la milliseconde : deux créations dans la même milliseconde produisent la même valeur.

L'identifiant est presque opaque. Trois lectures en tirent une information : le chargement écarte les lignes d'exemple d'anciennes livraisons à leur préfixe ; la conversion de la pesée de départ reconnaît sa ligne à un identifiant en dur quand le drapeau manque ; et la fabrication d'une valeur de faim absente s'écarte d'un cran selon la somme des codes de caractères de l'identifiant, pour rester reproductible sans tirer au sort.

Toute heure retenue est ramenée à la minute ronde inférieure parmi `0, 10, 15, 20, 30, 40, 45, 50`, à la création comme à la modification, y compris les deux heures d'un sommeil et les heures de rappel du profil. À défaut d'heure indiquée, c'est l'heure locale ainsi arrondie qui est écrite, donc jamais une heure future.

### Les référentiels

Ce sont les listes propres à la personne. Elles ne sont pas dans la sauvegarde, une clé de stockage chacune, et les lignes de journal en dépendent.

| Référentiel | Contenu d'une entrée | Ce qui y renvoie |
| --- | --- | --- |
| Aliments personnalisés | Identifiant, nom, énergie et macronutriments pour 100 g ou 100 ml, nature liquide ou solide, code-barres facultatif conservé en chaîne, marque de recette, instants de création et de modification. | Chaque quantité d'aliment d'un repas, par identifiant. |
| Compteurs de choix d'aliments | Nombre de fois qu'un aliment a été retenu. | Rien : dérivé d'usage, il n'est référencé par aucune ligne. |
| Repas favoris | Une composition mémorisée, réutilisable comme base d'un repas. | Rien : une reprise recopie, elle ne référence pas. |
| Types d'effets actifs | Un libellé. | Chaque ligne d'effet secondaire, *par ce libellé*. |
| Activités physiques actives | Un nom, dont le catalogue livré tire un équivalent métabolique. | Chaque séance, par ce nom. |
| Moments pour soi actifs | Un nom. | Chaque moment pour soi, par ce nom. |

Les instants de création et de modification n'existent que sur des entrées de référentiel, jamais sur une ligne de journal. La création dans le référentiel des aliments est plafonnée par jour : 50 aliments et 20 recettes, quotas indépendants, refus sans écrasement, une entrée supprimée le jour même rendant sa place. Une entrée sans instant de création n'est comptée dans aucun quota.

Une recette n'est pas un type à part : c'est un aliment personnalisé portant sa composition et une marque. Le type de recette autonome déclaré dans le modèle n'a aucun magasin. **[non implémenté]**

À côté des référentiels vivent deux **catalogues**, livrés avec le produit et non modifiables : la table des aliments de référence, et le catalogue des traitements.

### Unités et précision

Chaque grandeur est stockée dans une unité canonique, et une seule. Aucune étiquette d'unité n'accompagne une valeur : l'unité est celle de la grandeur, pas de la valeur.

| Grandeur | Unité stockée | Arrondi à l'écriture |
| --- | --- | --- |
| Poids d'une pesée, poids visé | kilogramme | dixième |
| Distance d'une séance | mètre | entier |
| Mensuration | centimètre | aucun : la valeur est enregistrée telle qu'elle est reçue |
| Taille | centimètre | aucun en V1 ; en V2 la conversion depuis le pouce arrondit à l'entier |
| Dose | milligramme | aucun : un palier du catalogue, ou une valeur libre enregistrée telle quelle |
| Quantité d'aliment | gramme ou millilitre, selon la nature de l'aliment | aucun |
| Durée | minute | entier |
| Énergie | kilocalorie | — |
| Macronutriments | gramme | — |
| Pas | unité | entier |
| Sévérité | entier de 1 à 5 | — |
| Faim, qualité de sommeil | entier de 0 à 5 | — |
| Heure de relevé | HH:MM local | minute ronde inférieure |
| Instant technique | millisecondes depuis l'époque Unix | — |

La personne choisit un **système de mesure**, métrique ou impérial, qui ne décide que de l'unité dans laquelle une valeur est reçue et restituée, jamais de celle dans laquelle elle est stockée. En V1, ce choix est déclaré dans le profil et n'est ni écrit ni lu. **[non implémenté]** En V2, la langue amène son système par défaut — français avec le métrique, anglais avec l'impérial — et il reste rechoisissable ensuite ; changer de langue repose le système, le dernier geste l'emportant. **[V2]** La taille se convertit aux deux bouts, à raison de 2,54 cm par pouce, chaque conversion arrondissant à l'entier ; le pouce existe une troisième fois, comme fourchette de bornes propre. La conversion du poids entre kilogramme et livre n'existe pas : un poids choisi en livres serait retenu tel quel. **[non implémenté]**

Les bornes n'écartent que l'absurde et ne disent jamais à quelqu'un quel corps il a le droit d'avoir : âge de 1 à 130 ans, taille de 50 à 300 cm ou de 20 à 118 pouces, poids jusqu'à 999 kg ou 2 000 livres — deux plafonds ronds, chacun choisi dans son unité, et non la conversion l'un de l'autre. **[V2]** La V2 remplace l'âge par l'**année de naissance**, dont les bornes sont celles de l'âge rapportées à l'année en cours, passée par l'appelant : un âge se périme, une année de naissance non. **[V2]**

### Les invariants

Ils valent pour tout le domaine et priment sur les cas particuliers des chapitres suivants.

| Invariant | Ce qu'il interdit, et sa portée réelle |
| --- | --- |
| Rien de dérivable n'est stocké | Une durée de sommeil, une dépense de séance, la valeur nutritionnelle d'un repas ne sont pas des données : elles se recalculent. Corriger la fiche d'un aliment corrige tout l'historique. Trois manquements subsistent, tous nommés plus bas. |
| On référence par identifiant | Vrai de l'aliment et du traitement : les renommer ne touche aucune ligne. Faux du type d'effet secondaire, de l'activité physique et du moment pour soi, qui sont référencés par leur libellé — renommer y a déjà exigé une conversion de sauvegarde pour ne pas faire changer des calories déjà enregistrées. |
| Les dates sont locales | Aucun fuseau, aucun suffixe universel sur une date ou une heure de relevé : ce sont les heures murales vécues. Aucune ligne ne porte d'instant absolu ; seules les entrées de référentiel en portent. |
| Supprimer supprime | Aucune ligne conservée sous une marque de suppression, aucun filtrage à la lecture. Les commentaires de type décrivant une suppression logique décrivent un état disparu. |
| Une valeur absente se tait | Aucun zéro, tiret ni moyenne implicite à la place d'une donnée manquante. La règle est tenue par la variation hebdomadaire, qui rend l'absence de valeur en deçà de sept jours de recul, d'une seule pesée ou d'aucune ; elle ne l'est pas par la moyenne hebdomadaire d'un bilan de période, sans borne et divisant par un nombre de tranches de sept jours arrondi au supérieur. |
| Le passé ne se réécrit pas | Changer le traitement suivi ne modifie aucune prise déjà enregistrée ; une prise sans traitement explicite se rattache à celui du profil au moment de la lecture, ce qui n'est pas « aucun traitement ». |
| La pesée de départ est la plus ancienne | Le drapeau se replace à chaque écriture du journal du poids : une pesée antidatée devient le départ, un drapeau perdu se repose sur la plus ancienne, et un historique qui en porterait deux est nettoyé. À date égale, le départ en place reste le départ. |
| Un format enregistré ne change pas sans migration | Toute évolution de forme est une conversion idempotente, rejouée à chaque chargement. |

Trois manquements au premier invariant sont connus et signalés là où ils portent : la valeur nutritionnelle d'un repas est stockée et recalculée à chaque écriture, en attendant que tous les calculs partent de la composition ; le libellé de la famille d'un repas est stocké alors qu'il se dérive entièrement de la famille, et il est lui aussi recalculé à chaque écriture ; et une prise sans identifiant de traitement se résout à la lecture, ce qui fait dépendre le passé du profil courant.

Un invariant de la V2 est énoncé mais non tenu : « aucune branche ne se ferme sur un silence ». Aucune branche ne se ferme, en effet — une question sans réponse se saute. Mais deux branches s'*ouvrent* sur une valeur que personne n'a confirmée : la question du poids visé paraît parce que l'objectif vaut « perdre » d'avance, et la question du traitement paraît parce que « avez-vous commencé » vaut « oui » d'avance. **[arbitrage non validé]**

### Ce qui peut effacer

L'effacement en masse a trois portées, et elles ne détruisent pas la même chose.

| Capacité | Précondition | Effet |
| --- | --- | --- |
| Vider un journal | un drapeau du profil, absent valant permis, que la personne peut mettre à faux — auquel cas le geste n'existe plus pour aucun journal | Ce journal-là devient vide. Une exception : vider le journal du poids conserve la pesée portant le drapeau de départ. |
| Vider tous les journaux | ce geste n'est atteignable que par les outils d'administration, hors périmètre de ce document | Les huit journaux de relevé et la collection des journées sont vidés, à l'exception de la pesée de départ. Le profil est intact : identité, traitement, drapeaux d'activation, objectifs et rappels survivent. Les référentiels aussi. |
| Supprimer le compte | le compte est supprimé d'abord, quand l'authentification est configurée ; en cas d'échec, rien n'est effacé | Tout le stockage local est effacé entièrement : sauvegarde, référentiels et marques d'état, profil compris. |

La pesée de départ est épargnée parce que sans elle la perte totale, les distinctions et le document de synthèse n'ont plus de référence. Elle se reconnaît à son drapeau et jamais à sa valeur : repasser par son poids de départ, ou le dépasser, ne fait pas d'une pesée ordinaire un départ. Mais le drapeau, lui, se déplace : il suit toujours la pesée la plus ancienne.

### Le vocabulaire

Les termes ci-dessous sont employés dans ce sens exact partout dans le document, et ne sont pas redéfinis.

| Terme | Sens |
| --- | --- |
| Sauvegarde | Le document unique qui porte le profil et les neuf collections. Ne porte pas les référentiels. |
| Profil | L'unique enregistrement décrivant la personne, ses objectifs, ses drapeaux d'activation et ses rappels. |
| Journal | Une collection de lignes datées d'un même domaine. |
| Ligne | Un fait relevé : identifiant, date locale, souvent une heure locale, et les données propres à son domaine. |
| Référentiel | Une liste composée par la personne, hors de la sauvegarde, à laquelle des lignes renvoient : aliments, favoris, types d'effets, activités, moments. |
| Catalogue | Une liste livrée avec le produit et non modifiable : la table des aliments de référence, le catalogue des traitements. |
| Domaine de relevé | L'un des huit sujets suivis. Sept portent un drapeau d'activation. |
| Prise | Une administration du traitement, injection ou comprimé. Jamais « injection » seul : la forme dépend du traitement. |
| Pesée | Une ligne du journal du poids, mensurations comprises. |
| Pesée de départ | La pesée la plus ancienne, seule à porter le drapeau de départ, référence de la perte totale. |
| Traitement | Une entrée du catalogue des traitements, jamais une chaîne libre. En V1 : identifiant, nom court, libellé complet, forme, molécule, paliers de dose, demi-vie d'élimination, demi-vie d'absorption, part de la dose portée au sang, rythme de prise usuel, exigence éventuelle d'une certification d'essai clinique. En V2 : identifiant, nom, forme. **[V2]** |
| Molécule | Le principe actif d'un traitement, nul pour les entrées génériques. C'est l'axe des cumuls, pas le nom commercial ni la forme. |
| Cure | Le suivi d'une personne sous traitement, de la pesée de départ à aujourd'hui — jamais jusqu'au dernier relevé. Sa durée est le dénominateur de la variation hebdomadaire. |
| Série en cours | Les prises du traitement porté par le profil, depuis le dernier changement de traitement, celles datées dans le futur exclues. Revenir à un traitement déjà pris ouvre une nouvelle série, sans rouvrir l'ancienne. |
| Fenêtre | Un intervalle de dates sur lequel une dérivation est calculée. |
| Distinction | Un palier — aucun, éveil, bronze, argent, or — évalué à partir d'un journal sur une fenêtre récente. Ne se stocke pas : seul le dernier palier connu est mémorisé, hors de la sauvegarde, pour ne pas fêter deux fois le même. |
| Plafond quotidien de lignes | Le nombre maximal de lignes qu'une date accepte dans un journal donné. À ne pas confondre avec les plafonds quotidiens de *création* du référentiel des aliments (50 et 20) ni avec celui des envois techniques (10). |

> **Exemple.**
>
> L'installation de Camille porte un profil — née en 1978, 168 cm, poids visé, Ozempic, traitement et effets secondaires accessibles d'office — huit journaux et ses référentiels. À cette installation, une pesée de 95,0 kg a été semée, datée de la veille, à 08:00, avec le drapeau de départ. Sa pesée du 12 mai 2026, 96,0 kg, ne prend donc le drapeau que si elle devient la plus ancienne : tant que la pesée semée subsiste, c'est elle la référence de la perte totale, et Camille apparaît en prise de poids. Une pesée antidatée au 1er mai, elle, prendrait le drapeau à l'écriture. Sa série en cours est la suite de ses prises d'Ozempic ; le jour où elle passerait à un Wegovy injectable, les prises déjà faites resteraient des prises d'Ozempic, et le cumul de sémaglutide se poursuivrait sans rupture. Si elle change d'appareil, rien ne la suit.

Rien de ce qui précède n'est enregistré par la V2 à ce jour : le recueil initial tient ses réponses en mémoire, et elles ne survivent pas à la session. **[non implémenté]**

## 2. Les entités

Ce chapitre énumère les objets que le produit conserve : leurs attributs, leurs types, leurs unités canoniques, leurs valeurs par défaut, leur identité et leurs cardinalités. Il nomme aussi ce que les types déclarent sans qu'aucune donnée ne soit derrière, et ce que la V2 a décidé autrement.

### L'objet racine et ses tables

Une personne, un appareil, une sauvegarde. L'objet racine (`AppData`) porte un profil et neuf tables de lignes datées ; il est conservé en un seul document JSON, sous la clé `glp1_app_companion_data`.

| Attribut | Type | Obligatoire | Absent vaut |
| --- | --- | --- | --- |
| `profile` | `UserProfile` | oui | — |
| `weightHistory` | `WeightLog[]` | oui | liste vide |
| `dailyLogs` | `DailyLog[]` | oui | liste vide |
| `injectionHistory` | `InjectionLog[]` | oui | liste vide |
| `savedMeals` | `SavedMealLog[]` | non | liste vide |
| `sideEffectHistory` | `SideEffectLog[]` | non | liste vide |
| `stepLogs` | `StepLog[]` | non | liste vide |
| `sportLogs` | `SportLog[]` | non | liste vide |
| `meTimeLogs` | `MeTimeLog[]` | non | liste vide |
| `sleepLogs` | `SleepLog[]` | non | liste vide |

Aucune de ces tables ne porte d'index ni de contrainte d'unicité. Huit d'entre elles sont en ordre d'insertion : une ligne s'ajoute en fin de tableau, y compris antidatée. La neuvième, `weightHistory`, n'a d'ordre stocké garanti d'aucune sorte — l'ajout d'une pesée retrie sur la seule `date`, la conversion qui fabrique la pesée de départ retrie sur date et heure, et la modification d'une pesée ne retrie pas. L'ordre qui fait foi est donc toujours celui que le lecteur reconstruit à partir des dates et heures portées par les lignes.

```
cle(ligne) = ligne.date + "T" + (ligne.time || "12:00")   // comparaison lexicographique
// le repli est sur une valeur FAUSSE, pas sur l'absence : une heure vide vaut midi elle aussi
```

Deux endroits échappent à cette règle et méritent d'être connus. Le plafond quotidien, quand il réécrit « la dernière ligne du jour », désigne cette ligne par son **rang** dans le tableau, pas par son heure : antidater une saisie du jour fait donc écraser une ligne qui n'est pas forcément la plus tardive. Et la signature de la pesée la plus récente, celle qui gouverne l'assignation d'équivalences, replie une heure absente sur `00:00` et non sur midi. **[arbitrage non validé]**

### Les réserves hors de l'objet racine

Tout n'est pas dans l'objet racine. Dix-sept clés supplémentaires portent des données que ce chapitre décrit, parce qu'elles ne sont pas des lignes de suivi.

| Clé | Contenu | Décrit en |
| --- | --- | --- |
| `glp1_user_custom_foods` | Aliments créés et recettes | L'aliment |
| `glp1_favorite_meals` | Menus favoris | Le menu favori |
| `glp1_food_selection_counts` | Compteurs de sélection d'aliment | Les états tenus hors de la sauvegarde |
| `glp1_active_sports`, `glp1_active_side_effects`, `glp1_active_me_time` | Trois listes d'entrées actives | Les listes d'entrées actives |
| `glp1_badge_tiers_connus` | Paliers de récompense connus | Les états tenus hors de la sauvegarde |
| `glow_ludic_usage` | Assignation d'équivalences et ses compteurs — **seule clé de données à porter le préfixe `glow_`** et non `glp1_` | Les états tenus hors de la sauvegarde |
| `glp1_first_open_date` | Date de première ouverture | Les états tenus hors de la sauvegarde |
| `glp1_paliers_nutritifs_fetes`, `glp1_notified_bmi_tier_index`, `glp1_last_celebrated_weight`, `glp1_last_celebrated_weight_id`, `glp1_dynamique_celebrated` | Cinq états de célébration | Les états tenus hors de la sauvegarde |
| `glp1_user_feedbacks`, `glp1_user_survey_v2` (et `glp1_user_survey`, ancien format lu en repli, jamais réécrit) | Messages envoyés et réponse au questionnaire | Le compte et ce qui quitte l'appareil |
| `glp1_app_companion_data__secours` | Copie unique d'une sauvegarde illisible | Conventions communes, cas limites |
| `glp1_app_companion_data__secours-index` et `…__secours-<horodatage>` | Index et copies de secours | Les copies de secours |

Quinze autres clés existent et sont **hors du périmètre de ce document** : elles ne conservent que des préférences de restitution ou des états techniques. Huit clés `glp1_<journal>_history_view`, `glp1_period_blood_level_by_brand`, `glp1_meal_edit_notice_dismissed`, `glp1_send_cap_alert`, `glp1_test_data`, `hasAcceptedMedicalDisclaimer_v1`, plus les clés à préfixe `glow_` autres que `glow_ludic_usage`. Une seizième, `glp1_meals_cleared`, n'est plus jamais écrite : elle n'est conservée que pour être effacée.

### Conventions communes à toutes les lignes

| Convention | Règle |
| --- | --- |
| Identité | `id`, chaîne, posée à l'enregistrement, jamais réécrite. Pesées `w-<ms>`, prises `inj-<ms>`, ressentis `se-<ms>`, pas `step-<ms>`, séances `sport-<ms>`, moments `metime-<ms>`, nuits `sleep-<ms>` ; repas, quantités d'aliment et menus favoris reçoivent un UUID version 7 (`newId`), aliments personnalisés `user-custom-<ms>`. |
| Date | `date` : chaîne `AAAA-MM-JJ`, jour *local*. Jamais un instant UTC tronqué. |
| Heure | `time` : chaîne `HH:MM`, locale, ramenée à l'écriture à la minute ronde inférieure parmi 0, 10, 15, 20, 30, 40, 45, 50. |
| Instants techniques | `createdAt`, `updatedAt`, `sentAt` : entiers, millisecondes depuis l'époque Unix. Distincts des dates locales. |
| Unités | Le stockage est métrique : kilogramme, centimètre, gramme, millilitre, milligramme, minute, mètre, kilocalorie. Aucune étiquette d'unité n'est enregistrée. |
| Grandeurs sans unité | Quatre valeurs ne portent pas d'unité et n'en attendent pas : le pas (`StepLog.steps`, un compte), trois échelles bornées (`severity` 1–5, `quality` 0–5, `hungerBefore` et `hungerAfter` 0–5) et l'équivalent métabolique du catalogue d'activités (`met`, sans dimension). |
| Décimales | Point décimal en stockage, quelle que soit la langue. |
| Références | Par identifiant — sauf **trois** exceptions héritées, où la clé stockée est le texte lui-même : une séance référence son activité par son nom (`SportLog.sport`), un moment pour soi par le sien (`MeTimeLog.activity`), un ressenti son effet par le sien (`SideEffectLog.type`). Renommer une entrée de l'un de ces trois catalogues coupe les lignes déjà enregistrées de leur entrée. |
| Suppression | Franche : la ligne quitte la sauvegarde. Aucun marqueur de suppression n'est conservé. |
| Modification | Fusion : les attributs absents de la charge sont conservés (`LogUpdate<T>` = `Omit<T,'id'> & { id }`). |
| Dérivé | Rien de dérivable n'est stocké — deux exceptions assumées, le cache nutritionnel d'un repas et son `typeLabel`. |

**Cas limites**

Une sauvegarde illisible n'est pas écrasée : elle est recopiée une fois sous `glp1_app_companion_data__secours` — sans tiret final, à ne pas confondre avec le préfixe `__secours-` des copies horodatées —, et plus rien n'est écrit de la session.

Neuf conversions s'appliquent au chargement, toutes idempotentes : retrait des lignes d'exemple, retrait des repas sans composition, passage des traitements du libellé à l'identifiant, repli de l'ancienne note de ressenti, fusion des deux noms du tennis de table, remplissage des faims manquantes, purge des lignes anciennement marquées supprimées, pose du drapeau de pesée de départ, oubli des attributs du suivi hydrique et des objectifs de poids supprimés.

Deux identifiants peuvent coïncider lorsqu'ils dérivent de l'horloge à la milliseconde ; seuls les UUID version 7 ferment ce cas.

### Les cardinalités

| Entité | Par journée | Au-delà |
| --- | --- | --- |
| Pesée | 1 | La ligne du jour est mise à jour : elle garde son identifiant, sa nature de départ, et les mensurations que la nouvelle saisie ne porte pas. |
| Prise de traitement | 2 | Réécriture de la dernière ligne du jour *au sens du rang* dans la table. |
| Ressenti | 15 | Idem. |
| Séance d'activité | 15 | Idem. |
| Moment pour soi | 15 | Idem. |
| Sommeil | 15 | Refus : rien n'est écrit. |
| Repas ou en-cas | 30, comptés à la *date visée* | Refus. Déplacer un repas vers une date pleine est refusé aussi ; le repas reste à sa date d'origine. |
| Relevé de pas | illimité | Plusieurs lignes peuvent porter la même date. |
| Aliment personnalisé | 50 *créations* | Refus. Une modification ne consomme rien. |
| Recette | 20 *créations*, quota indépendant du précédent | Refus. |
| Menu favori | 50 *créations* | Refus. |
| Message envoyé | 10 *envois* | Refus. |

Le décompte porte sur les lignes réellement présentes : supprimer une ligne du jour rend sa place. Une entrée créée avant l'arrivée de son instant de création n'est comptée dans aucune journée.

### Le profil

Un seul exemplaire (`UserProfile`), sans identifiant : il est l'attribut `profile` de l'objet racine. Il mêle l'identité corporelle, les objectifs quotidiens, les rappels et les interrupteurs de suivi.

| Attribut | Type | Unité / valeurs | Obligatoire | Absent ou d'usine |
| --- | --- | --- | --- | --- |
| `name` | chaîne | — | oui | « Chloé » |
| `gender` | énuméré | `homme` · `femme` · `neutre` | oui | `femme` |
| `age` | entier | années | oui | 42 |
| `height` | nombre | centimètres | oui | 168 |
| `targetWeight` | nombre | kilogrammes, arrondi au dixième à l'écriture | oui | 72,0 |
| `silhouetteType` | énuméré | 8 valeurs : `sablier`, `poire`, `pomme`, `rectangle`, `triangle_inverse`, `trapeze`, `oval`, `triangle` | oui | `sablier` — aucun enregistrement ne le réécrit, hors la fabrication de données d'essai |
| `avatar` | `AvatarConfig` | voir ci-dessous | oui | voir ci-dessous |
| `glp1Brand` | chaîne | identifiant du catalogue des traitements | oui | `aucun` |
| `measurementSystem` | énuméré | `metric` · `imperial` — n'affecte que la saisie et la restitution, jamais le stockage | non | `metric` |
| `reminderEnabled`, `reminderDay`, `reminderTime` | booléen, entier 0–6 (0 = dimanche), `HH:MM` | — | oui | faux, 0, « 20:00 » |
| `injectionReminderType` | énuméré | `weekly` · `custom` | non | absent |
| `injectionReminderDaysInterval` | entier | jours | non | absent |
| `injectionReminderStartDate` | chaîne | `AAAA-MM-JJ` | non | absent |
| `medicalReminderEnabled` | booléen | — | oui | faux |
| `medicalReminderDate`, `medicalReminderTime`, `medicalReminderDoctor`, `medicalReminderNotifyBefore` | `AAAA-MM-JJ`, `HH:MM`, chaîne, chaîne (`1h`, `2h`, `1d`, `2d`…) | — | non | absents |
| `countdownTargetDate` | chaîne | `AAAA-MM-JJ` | non | « 2026-11-15 » d'usine |
| `dailyCaloriesGoal` | nombre | kilocalories | non | 1 400 |
| `dailyProteinGoal` | nombre | grammes | non | poids courant × 1,5, arrondi |
| `dailyFiberGoal` | nombre | grammes | non | 25 |
| `foodTrackingEnabled`, `stepsTrackingEnabled`, `sportTrackingEnabled` | booléens | — | oui | faux |
| `meTimeTrackingEnabled`, `sleepTrackingEnabled` | booléens | — | non | absent = **désactivé** |
| `treatmentTrackingEnabled`, `sideEffectsTrackingEnabled` | booléens | — | non | absent = **activé** |
| Quatorze attributs de restitution | booléens, l'un d'eux booléen ou nombre | Ils ne modélisent rien : aucun ne conditionne, ne dérive ni ne contraint une donnée conservée. Ils sont mentionnés ici parce qu'ils occupent le profil et qu'une réimplémentation les rencontrera, et nommés hors de ce chapitre. Sept d'entre eux ne portent une valeur vraie que pendant qu'un suivi est désactivé : réactiver ce suivi les remet à faux. | non | absents |

Trois attributs ont quitté le profil et subsistent dans les sauvegardes anciennes, lus par la seule conversion : `startingWeight`, `startingWeightDate`, `startingMeasurements`. Le poids de départ est devenu une pesée.

### L'avatar

Imbriqué dans le profil (`AvatarConfig`), sans identité propre. Trois de ses attributs sont des chaînes hexadécimales, prises chacune dans un nuancier fermé : ce sont des valeurs choisies et conservées, non des paramètres de rendu.

| Attribut | Type | Valeurs | Obligatoire | D'usine |
| --- | --- | --- | --- | --- |
| `gender` | énuméré | `homme` · `femme` · `neutre` | oui | `femme` |
| `faceShape` | énuméré | `oval` · `round` · `square` · `heart` | oui | `oval` |
| `skinColor` | chaîne | hexadécimal, nuancier de **6** valeurs | oui | `#FFE5D9` |
| `eyeColor` | chaîne | hexadécimal, nuancier de **5** | oui | `#2E8B57` |
| `hairStyle` | énuméré | `court` · `long` · `boucle` · `chauve` · `frange` · `brosse` | oui | `long` |
| `hairColor` | chaîne | hexadécimal, nuancier de **6** | oui | `#4E3629` |
| `hasGlasses` | booléen | — | oui | faux |
| `expression` | énuméré | `happy` · `determined` · `proud` · `calm` | oui | `happy` |
| `customPhotoUrl` | chaîne | une image importée, conservée dans le profil ; renseignée, les huit attributs précédents ne sont plus lus | non | absent |

Le type déclare les trois attributs hexadécimaux comme des chaînes libres : rien ne contraint une valeur hors nuancier, et une sauvegarde peut en porter une.

### La pesée

Une ligne par journée pesée (`WeightLog`). Le poids est en kilogrammes, arrondi au dixième à l'écriture ; les neuf mensurations sont en centimètres et toutes facultatives.

| Attribut | Type | Unité | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date` | `AAAA-MM-JJ` | jour local | oui |
| `time` | `HH:MM` | heure locale, minutes rondes | non — absente, elle vaut midi au tri |
| `weight` | nombre | kilogrammes, un décimal | oui |
| `chest`, `waist`, `hips`, `arm`, `underbust`, `buttocks`, `thigh`, `knee`, `calf` | nombres | centimètres | non |
| `isStartingWeight` | booléen | — | **oui**, y compris à `false` |

Le sous-ensemble des neuf mensurations porte un nom (`BodyMeasurements`) et se dérive de la pesée plutôt que de se recopier.

Invariants du départ, visés à chaque écriture :

```
au plus une ligne porte isStartingWeight = true
la ligne marquee est la plus ancienne au sens (date, heure)
une pesee anterieure au depart DEVIENT le depart
a date egale, le depart en place reste le depart
vider l'historique epargne la ligne marquee
```

**Cas limites**

Le départ se reconnaît à son drapeau, jamais à sa valeur : repasser par son poids de départ ne fait pas d'une pesée ordinaire un départ.

Le premier invariant n'est pas tenu dans tous les cas. La réparation cherche *le premier* drapeau rencontré ; s'il est déjà celui de la plus ancienne ligne, ou porte la même date qu'elle, elle sort sans rien réécrire. Un historique qui porterait deux drapeaux dont le premier est le bon les garde tous les deux. La réparation n'agit donc de façon sûre que sur l'historique sans drapeau, ou dont le drapeau n'est pas sur la plus ancienne ligne. **[arbitrage non validé]**

Sur une sauvegarde ancienne sans drapeau, la conversion fabrique la pesée de départ à partir des trois attributs quittés du profil, à 08:00, ou à la veille de la plus ancienne pesée si aucune date n'était enregistrée.

> **Exemple.**
>
> Camille, 168 cm, part de 96,0 kg en mai 2026 : cette ligne porte le drapeau. Le 12 septembre elle enregistre 84,5 kg à 07:32, ramené à 07:30. Se peser à nouveau le même jour à 20:12 met à jour la ligne du 12 — même identifiant, 20:10, et les mensurations du matin conservées si elles ne sont pas ressaisies.

### La prise de traitement

Une ligne par prise (`InjectionLog`) — injection ou comprimé, la même entité pour les deux formes.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date` | `AAAA-MM-JJ` | jour local | oui |
| `time` | `HH:MM` | minutes rondes | oui |
| `dose` | nombre | milligrammes | oui |
| `site` | chaîne | sept valeurs connues : `abdomen_gauche`, `abdomen_droit`, `cuisse_gauche`, `cuisse_droite`, `bras_gauche`, `bras_droit`, `prise_orale` ; le type accepte toute autre chaîne | oui |
| `brand` | chaîne | identifiant du catalogue. **Absent signifie « celui du profil au moment de la lecture »**, ce qui n'est pas « aucun » | non |
| `notes` | chaîne | texte libre | non |

### Le catalogue des traitements

Données de référence livrées avec le produit, jamais écrites par la personne (`Treatment`) : treize spécialités, plus une entrée d'absence de traitement, tenue à part parce que ce n'est pas un traitement mais un état. Seul l'identifiant est enregistré ; le nom ne l'est jamais.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | seule valeur enregistrée ailleurs | oui |
| `name`, `label` | chaînes | nom court et libellé complet | oui |
| `form` | énuméré | `injection` · `oral` | oui |
| `molecule` | chaîne ou `null` | `null` pour les entrées génériques et l'absence de traitement | oui |
| `dosePresets` | liste de nombres | milligrammes | oui |
| `halfLifeHours`, `absorptionHalfLifeHours` | nombres | heures | oui |
| `doseScale` | nombre | biodisponibilité relative à l'injection ; absent = 1 | non |
| `doseIntervalDays` | entier | jours ; absent = 1 pour un comprimé, 7 pour une injection | non |
| `requiresTrialCertification` | booléen | molécule non commercialisée | non |

Identifiants : `ozempic`, `wegovy-injection`, `mounjaro`, `zepbound`, `saxenda`, `victoza`, `trulicity`, `retatrutide`, `autre-injection`, `rybelsus`, `wegovy-oral`, `orforglipron`, `autre-comprime`, plus `aucun`. Un identifiant inconnu se résout sur `aucun`.

### Le repas ou l'en-cas

Une ligne par prise alimentaire (`SavedMealLog`). Sa composition est la source de vérité ; ses cinq valeurs nutritionnelles sont un cache recalculé à chaque écriture.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne (UUID v7) | — | oui |
| `date`, `time` | `AAAA-MM-JJ`, `HH:MM` | local, minutes rondes | oui |
| `type` | énuméré | `breakfast` · `lunch` · `dinner` · `snacks` · `repas` · `snack` | oui |
| `typeLabel` | chaîne | doublon dérivé de `type`, réécrit à chaque écriture ; seul `type` fait foi. Un type inconnu donne « En-cas » | oui |
| `items` | `FoodQuantity[]` | **au moins un** ; retirer le dernier supprime le repas | oui |
| `calories`, `protein`, `carbs`, `fat`, `fiber` | nombres | kilocalories et grammes ; cache dérivé de `items` | oui |
| `hungerBefore`, `hungerAfter` | entiers | échelle 0–5 | non |

Une quantité d'aliment (`FoodQuantity`) est imbriquée : elle n'existe pas hors de son parent et ne porte pas d'instants propres. Le même format sert aux repas, aux menus favoris et aux ingrédients d'une recette — avec une cardinalité différente : `items` ne peut jamais être vide, `recipeIngredients` le peut.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne (UUID v7) | régénéré à chaque copie ; aucune référence ne le vise | oui |
| `foodId` | chaîne | identifiant d'une entrée de la base de référence, ou d'un aliment personnalisé | oui |
| `isCustomFood` | booléen | dit laquelle des deux bases résoudre | oui |
| `qty` | nombre | **grammes** pour un solide, **millilitres** pour un liquide — jamais autre chose | oui |

**Cas limites**

Les repas antérieurs au passage à une composition d'aliments portaient leur contenu dans une phrase ; ils sont écartés au chargement. Le critère est l'*absence* de `items`, jamais une liste vide.

La conversion des faims se déclenche dès qu'un repas ne porte pas **ses deux** valeurs, et elle en réécrit alors **deux**. Un repas qui portait `hungerBefore` sans `hungerAfter` voit donc sa valeur saisie remplacée par une valeur déduite. La prudence annoncée — « un 0 saisi reste un 0 saisi » — ne vaut que pour les lignes déjà complètes. **[arbitrage non validé]**

Les valeurs déduites le sont du moment de la journée, de l'apport et de la somme des codes de caractères de l'identifiant : jamais d'un tirage au sort, et stables d'un chargement à l'autre.

Un aliment personnalisé supprimé laisse son item irrésoluble : le repas garde ses valeurs, l'item n'a plus de fiche.

### L'aliment

Deux bases distinctes, même forme (`CiqualFood`, dont `UserCustomFood` est un alias). La base de référence est livrée avec le produit et non modifiable ; celle des aliments créés vit sous la clé `glp1_user_custom_foods`.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `alim_code` | chaîne | identité ; `user-custom-<ms>` pour une création | oui |
| `alim_nom_fr` | chaîne | libellé officiel ; à la création, première lettre mise en capitale et texte détouré | oui |
| `nom_court` | chaîne | nom abrégé, 32 signes visés. L'invariant vérifié est l'autre sens : aucune entrée dont le libellé officiel dépasse 30 signes n'en est dépourvue (0 manquant sur 3 258). La borne de 32, elle, n'est pas tenue : `13212` porte « Compote de pomme maison non sucrée », 34 signes | non |
| `nom_generique` | chaîne | nom de famille de l'aliment ; **les collisions sont voulues**, ce n'est pas un identifiant | non |
| `calories`, `protein`, `carbs`, `fat`, `fiber` | nombres | pour 100 g ou 100 ml | oui |
| `isLiquid` | booléen | nature de l'aliment ; à défaut, dérivée de `unit === 'ml'` | non |
| `unit` | énuméré | `g` · `ml` — attribut hérité | non |
| `isUserCustom`, `isRecipe` | booléens | origine de l'entrée et nature du quota qu'elle consomme | non |
| `recipeIngredients` | `FoodQuantity[]` | composition d'une recette, gardée pour pouvoir la reprendre ; les valeurs nutritionnelles n'en dépendent pas. **Peut être vide** | non |
| `barcode` | chaîne | EAN-13 ou UPC-A ; **chaîne et non nombre**, les zéros de tête sont signifiants | non |
| `valide` | booléen | marque de revue du nom abrégé, posée hors de l'application | non |
| `createdAt` | entier | millisecondes ; posé à la création seule, jamais réécrit | non |

La base de référence compte 3 258 entrées, plus 2 entrées ajoutées à la main, soit 3 260 fiches résolvables : 2 425 portent un nom abrégé, les 3 258 portent un nom générique et leur nature liquide ou solide. Elle est indexée par identifiant ; une consommation ne s'y rapproche jamais par ressemblance de nom.

Une recette est un aliment personnalisé qui porte sa composition. Elle n'a pas de nom propre : son nom *est* celui de l'aliment qu'elle définit, et ses valeurs sont rapportées à 100 g de la composition entière.

```
invariant : un ingredient de recette existe toujours
=> supprimer un aliment reference par une recette est refuse
```

**Cas limites**

L'unicité du nom se juge après détourage, mise en minuscules et retrait des accents, contre les deux bases à la fois ; une entrée en cours de modification ne se déclare pas en doublon d'elle-même.

Un attribut nutritionnel laissé vide à la création vaut zéro.

Les recettes d'avant le passage à une composition référencée se reprennent avec une composition vide — d'où la seule liste `FoodQuantity[]` du modèle qui puisse être vide. Rouvrir puis ré-enregistrer une telle recette abaisse ses valeurs nutritionnelles sans le dire : défaut connu, non traité. **[arbitrage non validé]**

### La fiche normalisée et l'apport

Les deux bases décrivent la même chose sous des noms d'attributs différents. Toute consommation d'aliment est lue à travers une forme unique (`ResolvedFood`), et tout apport à travers un quintuplet nommé (`Nutrition`).

| Type | Attributs | Règle |
| --- | --- | --- |
| `ResolvedFood` | `id`, `name`, `calories`, `protein`, `carbs`, `fat`, `fiber`, `isLiquid` (obligatoire ici) | Construit depuis `CiqualFood` : `isLiquid: row.isLiquid ?? row.unit === 'ml'`. Une référence qui ne se résout pas rend `undefined` — cas réel et non exceptionnel, un aliment personnalisé pouvant être supprimé. |
| `Nutrition` | Les cinq valeurs, sans unité déclarée : kilocalories et grammes | `ZERO_NUTRITION` est le neutre de la somme. |
| `LegacyCustomFood` | `alim_code`, `alim_nom_fr`, les cinq valeurs, `isLiquid`, `unit` | Forme héritée de la base des aliments créés, normalisée en `ResolvedFood` à la lecture. Transitoire. |

```
apport(item) = fiche(item.foodId) * item.qty / 100      // les fiches valent pour 100 g ou 100 ml
apport(repas) = somme des apports des items resolus     // un item non resolu est ignore, pas compte a zero
```

### Le menu favori

Une composition nommée, réutilisable (`FavoriteMealItem`), conservée sous la clé `glp1_favorite_meals`. Elle reçoit une *copie* de la composition : modifier le repas d'origine ne la touche pas.

| Attribut | Type | Valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne (UUID v7) | — | oui |
| `title` | chaîne | — | oui |
| `type` | énuméré | `repas` · `snack` | oui |
| `items` | `FoodQuantity[]` | — | oui |
| `createdAt` | entier | millisecondes ; absent, le menu ne compte dans aucun quota | non |

### Le ressenti

Une ligne par effet ressenti (`SideEffectLog`).

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date`, `time` | `AAAA-MM-JJ`, `HH:MM` | local, minutes rondes | oui |
| `type` | chaîne | le *nom* de l'effet, et non un identifiant — troisième exception à la règle de référence | oui |
| `severity` | entier | 1 à 5, non borné par le type | oui |
| `notes` | chaîne | texte libre, enregistré tel quel ; un texte réduit à des espaces vaut absence | non |

Le catalogue des ressentis (`SideEffectOption`) porte deux attributs, `value` et `label`, tous deux égaux au même nom français : 36 entrées, dont 12 actives par défaut. `value` est ce qui est enregistré.

Un second attribut de texte libre, `description`, a existé ; il est replié dans `notes` au chargement, `notes` l'emportant quand les deux sont remplis.

### Le relevé de pas

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date` | `AAAA-MM-JJ` | jour local — **pas d'heure** | oui |
| `steps` | entier | nombre de pas, sans unité | oui |
| `isSimulated` | booléen | marque une ligne fabriquée et non relevée | non |

Seule entité sans plafond quotidien : plusieurs lignes peuvent porter la même date. **Ce que vaut alors la journée n'est pas tranché par le modèle** : la moyenne journalière et l'évaluation des récompenses somment les lignes d'une même date, tandis que la lecture des pas du jour retient la première ligne trouvée à cette date et ignore les suivantes. Deux relevés de 4 000 pas le même jour valent 8 000 d'un côté et 4 000 de l'autre. **[arbitrage non validé]**

### La séance d'activité

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date`, `time` | `AAAA-MM-JJ`, `HH:MM` | local, minutes rondes | oui |
| `sport` | chaîne | **le nom est la clé** : c'est lui qui retrouve l'équivalent métabolique au catalogue. Le renommer couperait les séances enregistrées de leur dépense | oui |
| `intensity` | énuméré | `douce` · `moderee` · `intensive` | oui |
| `duration` | nombre | minutes | oui |
| `distance` | nombre | **mètres** ; renseignée, la dépense se lit sur l'allure et non sur l'intensité | non |
| `notes` | chaîne | texte libre | non |

Le catalogue des activités (`SportPreset`) : 54 entrées, 7 actives par défaut.

| Attribut | Type | Rôle |
| --- | --- | --- |
| `value` | chaîne | La clé enregistrée dans `SportLog.sport`. |
| `label` | chaîne | Égal à `value` pour toutes les entrées livrées. |
| `met` | nombre | Équivalent métabolique, sans dimension, arrondi au demi. |

Une conversion au chargement ramène « Ping-pong » et « Tennis de table » à la clé unique « Ping-pong/Tennis de table », sans quoi ces séances perdraient leur équivalent métabolique, et donc leur dépense.

### Le moment pour soi

Même forme qu'une séance, sans intensité, sans distance et sans dépense (`MeTimeLog`).

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date`, `time` | `AAAA-MM-JJ`, `HH:MM` | local, minutes rondes | oui |
| `activity` | chaîne | le nom, comme clé | oui |
| `duration` | nombre | minutes | oui |
| `notes` | chaîne | texte libre | non |

Le catalogue (`MeTimePreset`) porte deux attributs, `value` et `label`, égaux : 9 entrées, dont 6 actives par défaut.

### La nuit ou la sieste

Une ligne par sommeil (`SleepLog`). Elle porte **deux instants complets**, jour et heure de chaque bout ; la durée n'est pas stockée.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date` | `AAAA-MM-JJ` | **la date du réveil** : une nuit du 17 au 18 appartient au 18 | oui |
| `time` | `HH:MM` | **l'heure du réveil**, horodatage de la ligne | oui |
| `bedDate` | `AAAA-MM-JJ` | jour de l'endormissement, *écrit et non déduit* | oui |
| `bedTime` | `HH:MM` | heure de l'endormissement, minutes rondes elle aussi | oui |
| `kind` | énuméré | `nuit` · `sieste` | oui |
| `quality` | entier | 0 à 5. Une ligne enregistrée sans que la valeur soit touchée porte 3 | oui |
| `notes` | chaîne | texte libre | non |

```
duree(nuit) = instant(date, time) - instant(bedDate, bedTime)   // en minutes
si reveil <= endormissement : duree = 0, et l'enregistrement est refuse
```

Écrire les deux jours est ce qui rend une donnée impossible reconnaissable : avec la seule paire d'heures, tout couple se lisait comme une nuit passée par minuit.

**Cas limites**

Une qualité à 0 enregistrée avant que 3 ne devienne la valeur non touchée est indiscernable d'un 0 choisi ; ces lignes ne sont pas réécrites.

### La marque de journée

Une ligne sans contenu (`DailyLog`) : deux attributs, et rien d'autre.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date` | `AAAA-MM-JJ` | jour local | oui |

Elle a porté trois contenus, tous disparus — les ressentis notés par symptôme, les quatre repas en texte libre, le total d'hydratation. Ne subsiste que sa *présence* à une date, lue par le choix de la phrase d'accueil et par le comptage du document médical. **[non implémenté]** Aucun enregistrement n'en crée : seule la fabrication de données d'essai en écrit.

### Les listes d'entrées actives

Trois listes de chaînes, conservées hors de l'objet racine. Elles restreignent l'ensemble des valeurs qu'une nouvelle ligne peut porter ; elles ne retirent rien aux lignes déjà enregistrées, qui restent résolubles contre le catalogue complet.

| Réserve | Type | Défaut |
| --- | --- | --- |
| `glp1_active_sports` | liste de clés d'activité | 7 entrées sur 54 |
| `glp1_active_side_effects` | liste de noms d'effets | 12 entrées sur 36 |
| `glp1_active_me_time` | liste de noms d'activités | 6 entrées sur 9 |

### Les états tenus hors de la sauvegarde

Des états dérivés mais *mémorisés*, parce qu'ils décident d'un « déjà fêté » ou d'un « déjà vu » qu'aucun recalcul ne retrouverait.

| État | Clé | Type | Ce qu'il retient |
| --- | --- | --- | --- |
| Paliers de récompense connus (`BadgeTiersConnus`) | `glp1_badge_tiers_connus` | `Record<identifiant, palier>`, palier parmi `aucun`, `eveil`, `bronze`, `argent`, `or` | Le dernier palier observé de chacune des quatre récompenses. On part de l'état connu : un suivi éteint ne fait pas retomber son palier à « jamais observé ». |
| Assignation d'équivalences (`LudicUsageState`) | `glow_ludic_usage` | `{ counts: Record<nom, entier>, assignment? }`, l'assignation portant `signature`, `totalKg?`, `lastKg?`, `total`, `last` | Les compteurs par objet et l'assignation en cours, signée par l'identifiant, la date et l'heure de la pesée la plus récente, et par les deux pertes au dixième. Chaque nouvelle pesée réassigne, même à poids inchangé. Une assignation sans les deux pertes est tenue pour périmée. |
| Compteurs de sélection d'aliment | `glp1_food_selection_counts` | `Record<nom d'aliment, entier>` | Combien de fois chaque aliment a été retenu ; la table est relue avant chaque incrément. |
| Date de première ouverture | `glp1_first_open_date` | chaîne `AAAA-MM-JJ` | L'ancre du délai de sept jours. À défaut, la donnée la plus ancienne de toutes les tables, ou aujourd'hui. |
| Paliers nutritionnels fêtés | `glp1_paliers_nutritifs_fetes` | `{ date, nutriments: ('proteines'\|'fibres')[] }` | Ce qui a déjà été fêté ce jour-là. |
| Marques de célébration | `glp1_notified_bmi_tier_index`, `glp1_last_celebrated_weight`, `glp1_last_celebrated_weight_id`, `glp1_dynamique_celebrated` | chaînes nues | Le dernier palier d'IMC signalé, la dernière pesée fêtée (par valeur, puis par identifiant), et le fait que l'ouverture des fonctions du septième jour a déjà été signalée une fois. |

### Les copies de secours

Une copie intégrale de la sauvegarde, prise *avant* tout geste qui remplace en masse (`BackupEntry`). L'index des copies vit sous `glp1_app_companion_data__secours-index`, chaque copie sous `glp1_app_companion_data__secours-<horodatage>`.

| Attribut | Type | Valeurs |
| --- | --- | --- |
| `key` | chaîne | où la copie se trouve |
| `stamp` | chaîne | `AAAA-MM-JJ-HHMMSS`, heure locale |
| `reason` | chaîne | ce qui l'a déclenchée, en clair |
| `size` | entier | taille en signes |

Deux invariants : une copie n'en recouvre jamais une autre — un suffixe est ajouté jusqu'à trouver une clé libre — et une copie n'est déclarée faite qu'après avoir été relue et comparée signe pour signe. L'appelant a le droit de refuser d'écrire quand la mise à l'abri a échoué. Rien ne les efface automatiquement.

### Le compte et ce qui quitte l'appareil

Le compte est distant ; les données de suivi ne le sont pas. Rien ne part sans un geste explicite, et aucune ligne de suivi ne part jamais.

| Entité | Attributs | Portée |
| --- | --- | --- |
| Compte connecté (`AuthUser`) | `id`, `email` ou `null`, `name` ou `null` | La session est mémorisée jusqu'à déconnexion explicite. L'état de connexion vaut « en cours », « déconnecté » ou « connecté ». |
| Message envoyé (`FeedbackItem`) | `id`, `type` (`avis` · `feature` · `bug`), `sentiment` (`content` · `neutre` · `pas_content`), `category`, `message`, `date` (libellé, non comparable), `sentAt` (ms), `acceptsContact` | Conservé sur l'appareil sous `glp1_user_feedbacks` et copié à distance sous le compte, un document par message. **Le type est déclaré plusieurs fois**, avec des attributs divergents sur la même clé : `acceptsContact` n'existe que dans l'une des déclarations. Une même sauvegarde peut donc porter des messages des deux formes. **[arbitrage non validé]** |
| Réponse au questionnaire (`StoredSurvey`) | `ratings` : un dictionnaire de notes par proposition ; `otherSuggestion` ; `sendLog` : instants des envois | **Une seule réponse**, sous `glp1_user_survey_v2`, réécrite à chaque envoi. Les notes sont rangées par clé et jamais par position, ce qui permet aux déclarations divergentes de cohabiter : l'une porte sept propositions (`albumPhotos`, `mealPhotos`, `wallet`, `journal`, `hydration`, `onlineSharing`, `printableBook`), une autre quatre (`albumPhotos`, `wallet`, `journal`, `scanNutrition`). À distance, un document unique par compte, fusionné, avec un cumul d'envois qui ne redescend jamais. **[arbitrage non validé]** |
| Échec d'export | étape et cause | Un document par échec, sous le compte. |

Chaque envoi emporte un contexte technique : version, langue, fuseau, instant local, instant serveur, plus deux entiers de gabarit qui ne relèvent pas de ce document. Le consentement à être recontactée est absent des messages écrits avant qu'il ne soit demandé : il ne se présume pas.

### Déclarés sans table derrière

Ces types existent dans le modèle et décrivent la cible d'une migration entamée ; aucune donnée n'est enregistrée sous cette forme. **[non implémenté]**

| Type | Ce qu'il déclare | Ce qui tient la place |
| --- | --- | --- |
| `CustomFood` | `id`, `name`, cinq valeurs pour 100 g/ml, `isLiquid` obligatoire, `barcode`, `recipeId`, `createdAt`, `updatedAt` | `UserCustomFood`, aux attributs nommés autrement et sans `updatedAt` |
| `Recipe` | `id`, `ingredients`, `createdAt`, `updatedAt` — une recette sans nom, le nom étant celui de l'aliment qu'elle définit | L'attribut `recipeIngredients` de l'aliment personnalisé |
| `SideEffectType` | `id`, `label`, `createdAt`, `updatedAt` — un effet référencé par identifiant et traduisible | Une liste de *noms* livrée, et le nom stocké dans chaque ligne |
| `SportType` | idem, plus `met` | Le catalogue d'activités, référencé par son texte |
| `HungerLevel`, `SeverityLevel` | Entiers bornés, 0–5 et 1–5 | Des `number` non bornés par le type |
| `OnboardingAnswers`, `OnboardingState` | Une trentaine d'attributs **tous facultatifs** : `theme`, `goal` (`perdre` · `stabiliser` · `masse`), `started`, `startedSince`, `startingWeight`, `startingWeightDate`, `currentWeight`, `currentWeightDate`, `targetWeight`, `height` (cm), `age` (années), `dailyActivity`, `hasSessions`, `sessionsCount`, `sessionsRate`, `sessionKinds`, `dailyActivityWish`, `sessionsWish`, `foodDiary`, `foodDiaryHelp` (0–5), `trackNutrition`, `trackSteps`, `trackSport`, `meTimePrefs`, `trackMeTime`, `gender`, `firstName` ; l'état ajoute `skipped`, la liste des étapes explicitement passées | **Rien.** Aucun de ces attributs n'atteint la sauvegarde : le questionnaire d'accueil de la V1 ne produit aucune donnée conservée |

Deux entités ont été supprimées et ne doivent pas revenir : le relevé d'hydratation et les objectifs de poids à paliers. Leurs traces sont écartées à chaque chargement.

### Ce que la V2 a décidé autrement **[V2]**

La V2 ne conserve encore rien : l'objet des réponses (`Reponses`) vit en mémoire, aucun code n'écrit ni ne lit de stockage, et il ne survit pas à la fin de la session. **[non implémenté]** Ce qu'elle a tranché sur les entités vaut néanmoins, et prime sur la V1.

| Sujet | V1 | V2 |
| --- | --- | --- |
| Âge | `age`, entier d'années — se périme | `anneeNaissance`, entier. Bornes : de l'année courante moins 130 à l'année courante moins 1 ; l'appelant passe l'année, le modèle ne lit pas l'horloge. Défaut 1980 |
| Taille | `height`, centimètres | `tailleCm`, centimètres, défaut 165. Bornes 50–300 cm, ou 20–118 pouces |
| Poids | arrondi au dixième | Chaîne à point décimal (« 95.0 »), défaut « 95.0 », convertie en nombre là où elle sera enregistrée. Plafonds 999 kg et 2 000 lb — deux plafonds ronds, non convertis l'un de l'autre. `poids` et `poidsCible` sont **deux attributs qui ne se touchent jamais** |
| Objectif | trois valeurs : `perdre` · `stabiliser` · `masse` | Deux : `perdre` · `stabiliser`. `poidsCible` n'a de sens que sur `perdre`, et n'est **jamais** dérivé de `poids` |
| Système d'unités | `measurementSystem` : `metric` · `imperial` | `Systeme` : `metrique` · `imperial`. `SYSTEME_PAR_LANGUE` associe `fr` à `metrique` et `en` à `imperial` ; l'attribut reste modifiable indépendamment. Le stockage demeure métrique, et la conversion du pouce tient en deux fonctions |
| Langue | absente du modèle | `Langue` : `fr` · `en`. L'attribut existe, rien ne le lit encore **[non implémenté]** |
| Avatar | `AvatarConfig`, plus `customPhotoUrl` | `Avatar` : `genre` (`femme` · `homme` · `neutre`), `formeVisage` (`ovale` · `rond` · `carre` · `coeur`), `couleurPeau` (nuancier fermé de 6), `couleurYeux` (5), `coiffure` (`court` · `long` · `boucle` · `frange` · `brosse` · `chauve`), `couleurCheveux` (6), `lunettes`, `expression` (`joyeuse` · `determinee` · `fiere` · `calme`). Les trois nuanciers sont ceux de la V1, valeur pour valeur. Pas d'équivalent de `customPhotoUrl`. Le genre fait partie de l'avatar et n'est plus une donnée à part ; `COIFFURE_DU_GENRE` associe une coiffure à chaque genre |
| Silhouette | `silhouetteType`, obligatoire | Supprimée |
| Traitement | `Treatment` : 11 attributs, dont posologie et cinétique | `Traitement` : `id`, `nom`, `forme` (`injection` · `comprime`). Treize entrées, chaque forme finissant par « Autre ». Aucune posologie, aucune cinétique |
| Absence de traitement | une entrée `aucun` du catalogue | Un attribut à part, `traitementCommence`, booléen vrai par défaut et jamais nul. À faux, `formeTraitement` et `traitement` repassent à `null` ; changer `formeTraitement` remet `traitement` à `null` |
| Compte | identité distante seule | `email` et `motDePasse`, chaînes vides au départ. **Une seule contrainte**, huit signes au moins sur le mot de passe. Rien d'autre n'est vérifié |

> **Exemple.**
>
> Camille en V2 : `anneeNaissance` 1978, `tailleCm` 168, `poids` « 96.0 », `objectif` `perdre`, `traitementCommence` vrai, `formeTraitement` `injection`, `traitement` `ozempic`. Rien de tout cela n'est encore écrit nulle part.

## 3. Grandeurs, unités et nombres

Chaque grandeur mesurée par le produit a une unité de conservation, et le nombre conservé ne porte jamais l'étiquette de cette unité. Ce chapitre donne ces unités, les facteurs de conversion qui existent, les bornes et les pas admis, ce qui contraint la granularité au moment d'écrire, et la forme littérale d'un nombre au stockage.

### Les unités canoniques

La doctrine est écrite dans les deux versions : une valeur se conserve en unité métrique de base, sans étiquette, et le système d'unités ne décide que de l'unité dans laquelle elle est exprimée vers l'extérieur et interprétée quand elle arrive. Deux systèmes existent, `metrique` et `imperial` ; le défaut est `metrique`, et choisir une langue repose le système sur celui qu'elle amène — le français le métrique, l'anglais l'impérial — sans l'imposer. **[V2]**

La doctrine n'est tenue que pour une seule grandeur : la taille, seule à disposer de fonctions de conversion. Pour le poids, elle n'est tenue par aucun code — voir plus bas.

La conséquence symétrique vaut pour les étiquettes dérivées d'une propriété de la donnée. Une quantité d'aliment est conservée sans savoir si elle est un poids ou un volume : c'est la nature solide ou liquide de la fiche référencée qui détermine son unité, et cette nature n'est pas recopiée dans la quantité. Reclasser un aliment de solide en liquide change donc l'unité de toutes les quantités déjà conservées qui le référencent, sans qu'aucune d'elles soit réécrite.

| Grandeur | Unité de conservation | Type | Granularité conservée |
| --- | --- | --- | --- |
| Poids d'une pesée, poids de départ, poids visé (V1) | kilogramme | nombre | dixième de kilogramme |
| Poids actuel, poids visé **[V2]** | celle que le système désigne, `kg` ou `lb` — aucune conversion n'existe | chaîne, « 95.0 » | dixième |
| Taille | centimètre | entier | 1 cm |
| Mensuration (facultative) | centimètre | nombre | dixième de centimètre, par pas de 0,5 |
| Quantité d'un aliment solide | gramme | nombre | dixième de gramme |
| Quantité d'un aliment liquide | millilitre | nombre | dixième de millilitre |
| Énergie d'une fiche d'aliment, objectif d'énergie | kilocalorie | nombre | pour 100 g ou 100 ml de la fiche |
| Protéines, glucides, lipides, fibres d'une fiche | gramme | nombre | pour 100 g ou 100 ml de la fiche |
| Dose d'une prise de traitement | milligramme | nombre | millième de milligramme |
| Durée d'une séance, d'un moment pour soi | minute | entier | 1 min |
| Montée d'escaliers | étage | entier | 1 étage — la seule activité dont la « durée » ne compte pas des minutes |
| Distance parcourue pendant une séance | mètre | entier | 1 m |
| Pas d'une journée | sans unité (un compte) | entier | 1 pas |
| Poids d'un objet de comparaison | kilogramme | nombre | gramme — la valeur est posée et relue en grammes |
| Âge (V1) | année | entier | 1 an |
| Année de naissance **[V2]** | année | entier | 1 an — remplace l'âge, qui se périme |
| Instant technique (création, modification) | milliseconde depuis l'époque Unix | entier | 1 ms |
| Date d'une entrée | jour local, `AAAA-MM-JJ` | chaîne | 1 jour, sans fuseau |
| Heure d'une entrée | heure murale locale, `HH:MM` | chaîne | quantifiée, voir plus bas |

Il n'existe pas d'instant de suppression. Le modèle a porté un `deletedAt` et gardé la ligne marquée ; il l'a retiré — supprimer retire la ligne de la sauvegarde — et une conversion irréversible efface la métadonnée des sauvegardes héritées, ligne marquée comprise. Seuls `createdAt` et `updatedAt` subsistent.

Les objectifs quotidiens vivent dans le compte, chacun dans l'unité de la grandeur qu'il vise : énergie en kilocalories (à défaut 1 400), protéines en grammes (à défaut le poids courant en kilogrammes multiplié par 1,5, arrondi à l'entier), fibres en grammes (à défaut 25). L'objectif de pas, lui, n'est pas conservé : c'est une constante de 8 000 pas.

L'énergie n'existe qu'en kilocalories : aucune valeur n'est conservée en kilojoules, et aucun facteur de conversion vers le kilojoule n'existe. L'énergie d'un repas n'est pas une grandeur enregistrée mais une grandeur dérivée des fiches d'aliments et des quantités.

### Le poids échappe à la doctrine **[V2]**

Le poids actuel et le poids visé de la V2 sont deux chaînes, « 95.0 », posées dans l'unité que le système désigne au moment où elles sont produites, et rien ne conserve cette unité à côté de la valeur. Aucun facteur livre ↔ kilogramme n'existe dans le domaine : le seul facteur déclaré est `2,54`, pour la taille. Le commentaire du modèle garantit l'unité de conservation pour la seule taille et se tait sur le poids.

Il s'ensuit qu'un changement de système laisse la chaîne en place et en change le sens : « 95.0 » posé en métrique vaut 95,0 kg, puis 95,0 lb une fois le système passé à l'impérial. C'est le trou par lequel l'invariant central du chapitre fuit, et il est ouvert. **[arbitrage non validé]**

**Cas limites**

- Un code-barres est conservé en chaîne et non en nombre : les zéros de tête d'un code à douze chiffres seraient perdus par un type numérique.
- La durée d'un sommeil n'est pas conservée : elle se déduit des deux instants d'endormissement et de réveil, franchissement de minuit compris.
- En V1, le système d'unités du compte n'agit sur aucune grandeur : la propriété existe dans le modèle et aucune ligne du dépôt ne la lit. Les fonctions de conversion des quantités d'aliments existent, mais aucun appelant ne leur transmet jamais `imperial`. **[non implémenté]**
- Les valeurs nutritionnelles d'un repas subsistent en V1 comme cache transitoire recalculé à chaque écriture, alors même qu'elles sont dérivables ; le modèle cible ne les conserve pas.

### Les valeurs de départ

Plusieurs grandeurs partent d'une valeur posée d'avance, et non d'une absence. Une valeur de départ conservée telle quelle est indiscernable d'une valeur choisie.

| Grandeur | Valeur de départ | Remarque |
| --- | --- | --- |
| Poids actuel **[V2]** | `'95.0'` | deux grandeurs jumelles, jamais fusionnées |
| Poids visé **[V2]** | `'95.0'` | ne part jamais du poids actuel et ne le suit jamais |
| Taille **[V2]** | 165 cm | en centimètres, l'unité de conservation |
| Année de naissance **[V2]** | 1980 | — |
| Qualité d'un sommeil (V1) | 3, « Correcte » | partait de 0, « Très mauvaise » |
| Faim avant un repas (V1) | 2 | — |
| Faim après un repas (V1) | 0 | — |

Le poids actuel et le poids visé partent de la même valeur, ce qui peut donner le change : ce sont deux grandeurs indépendantes, l'une ne se propage jamais dans l'autre, et les fusionner est explicitement interdit.

### Les conversions et leurs facteurs

Une conversion n'a lieu qu'aux deux extrémités : quand une valeur entre, et quand elle sort. Aucun facteur n'est appliqué au stockage.

| De | Vers | Facteur | Arrondi appliqué | État |
| --- | --- | --- | --- | --- |
| pouce | centimètre | × 2,54 (exact) | à l'entier | taille — le seul facteur du domaine V2 **[V2]** |
| centimètre | pouce | ÷ 2,54 | à l'entier | taille **[V2]** |
| kilomètre | mètre | × 1000 | au mètre | distance d'une séance |
| étage | minute d'équivalent | × 0,5 | aucun | cumul des durées d'activité et score |
| once avoirdupois | gramme | × 28,349523125 (exact) | aucun | déclaré, jamais atteint : aucun appelant ne transmet `imperial` **[non implémenté]** |
| once liquide américaine | millilitre | × 29,5735295625 (exact) | aucun | même état **[non implémenté]** |
| kilogramme, litre | gramme, millilitre | × 1000 | aucun | fonction exportée sans aucun appelant **[non implémenté]** |
| livre | kilogramme | aucun facteur n'existe, dans aucune des deux versions **[non implémenté]** |  |  |

Les deux fonctions de conversion de la taille sont les seuls endroits où le pouce existe. Elles arrondissent à l'entier aux deux bouts, si bien que la conversion n'est pas une involution : une taille exprimée en pouces puis réinterprétée en centimètres peut perdre un centimètre.

```
centimetres = arrondi(pouces × 2,54)
pouces      = arrondi(centimetres ÷ 2,54)
166 cm → 65 in → 165 cm   (perte d'un centimètre)
168 cm → 66 in → 168 cm   (stable)
```

Une table d'équivalences entre unités usuelles et unités de conservation existe : 16 contenants génériques (un verre, une tasse, un bol, une cuillère à soupe) et 74 unités attachées à une famille d'aliments par son nom générique (un œuf, une part de pizza, une tranche de pain), chacune pouvant porter plusieurs tailles. Chaque valeur est un poids net comestible, jamais un poids brut ; chaque ligne cite ses sources et nomme, le cas échéant, la partie retirée. Rien ne la lit encore. **[non implémenté]**

> **Exemple.**
>
> Camille mesure 168 cm. En système impérial, sa taille est exprimée 66 pouces (168 ÷ 2,54 = 66,14) ; réinterprétée, elle revaut 168 cm (66 × 2,54 = 167,64). La valeur conservée n'a pas bougé : 168. Son poids, lui, n'a aucun facteur : « 95.0 » posé en métrique se relit 95,0 lb dès que le système passe à l'impérial.

### Les bornes et les pas

Les bornes n'écartent que l'absurde : la valeur aberrante et la valeur manquante. Elles ne disent jamais à quelqu'un quel corps il a le droit d'avoir — c'est la raison pour laquelle un âge va jusqu'à 130 ans et une taille jusqu'à 3 mètres. À côté de la borne, chaque grandeur déclare un pas : la troisième dimension du contrat numérique, après l'unité et la fourchette.

| Grandeur | Minimum | Maximum | Décimales | Pas | Vide admis |
| --- | --- | --- | --- | --- | --- |
| Poids, en kilogrammes **[V2]** | 1 (non déclaré) | 999 | 1 | 0,1 | non |
| Poids, en livres **[V2]** | 1 (non déclaré) | 2000 | 1 | 0,1 | non |
| Poids, en kilogrammes (V1) | 0,1 | 1000 | 1 | 0,1 | non |
| Taille, en centimètres | 50 | 300 | 0 | 1 | non |
| Taille, en pouces **[V2]** | 20 | 118 | 0 | 1 | non |
| Âge, en années (V1) | 1 | 130 | 0 | 1 | non |
| Année de naissance **[V2]** | année courante − 130 | année courante − 1 | 0 | 1 | non |
| Mensuration, en centimètres (V1) | 1 | 300 | 1 | 0,5 | oui |
| Durée, en minutes (V1) | 1 | 480 | 0 | 5 | non |
| Étages (V1) | 1 | 480 | 0 | 1 | non |
| Distance fournie en kilomètres (V1) | 0,1 | 1000 | 1 | 0,1 | oui |
| Distance fournie en mètres (V1) | 10 | 100000 | 0 | 10 | oui |
| Dose, en milligrammes (V1) | 0,001 | 1000000 | 3 | 0,25 | non |
| Quantité d'un aliment (V1) | 1 | 10000 | 1 | 10 | non |
| Valeur nutritionnelle pour 100 (V1) | 0 | 10000 | 1 | 0,1 | oui |
| Poids d'un objet de comparaison, en grammes (V1) | 1 | 1000000 | 0 | 1 | non |
| Longueur de nom, en lettres (V1, outillage interne de revue) | 0 | 200 | 0 | 1 | oui |

Le pas non déclaré vaut un cran de la dernière décimale autorisée : 1 pour un entier, 0,1 pour une décimale, 0,001 pour trois.

Les deux plafonds de poids de la V2 ne sont pas la conversion l'un de l'autre : 999 kg valent 2 202 lb, et non 2 000. Ce sont deux plafonds ronds, chacun choisi dans son unité, et ce choix est délibéré. Le plancher de 1, lui, n'est déclaré nulle part : il tombe de la construction de l'ensemble des poids atteignables, dont le premier élément est 1.

Les bornes en pouces sont la conversion arrondie des bornes en centimètres : 50 cm donnent 20 pouces et 300 cm en donnent 118. La règle reste la fourchette en centimètres ; elle ne change pas d'unité.

La borne haute est facultative dans le modèle de contrainte : une grandeur peut n'avoir aucun plafond défendable, et n'en porter aucun ; la contrainte ne refuse alors rien par le haut. Le signe négatif n'est jamais admis : il est retiré de ce qui arrive plutôt que refusé après coup. Zéro reste une réponse juste là où elle a un sens — un aliment sans calories.

Une borne se tient de deux manières. En V1, une valeur hors bornes n'est pas retenue et la valeur enregistrée reste en place : le refus ne détruit rien. En V2, le poids, la taille et l'année de naissance ne se posent que par choix dans un ensemble énuméré, borné à la construction ; hors de cet ensemble aucune valeur n'est jamais produite, et il n'y a donc plus rien à refuser. **[V2]**

Ce raisonnement est exact pour la taille et l'année de naissance, entières, dont l'ensemble énuméré est exactement l'intervalle. Il ne l'est pas pour le poids, la seule des trois à porter une décimale : l'ensemble atteignable est le produit d'une partie entière de 1 à 999 par un dixième de 0 à 9, soit le réseau discret `{1,0 ; 1,1 ; … ; 999,9}`. Son maximum, 999,9, dépasse le plafond déclaré de 999. **[arbitrage non validé]**

**Cas limites**

- Une valeur non finie est refusée : la contrainte ne rend aucune valeur, et la valeur enregistrée reste en place. C'est un chemin distinct de l'absence de valeur, qui n'est admise que pour une grandeur facultative.
- Une grandeur facultative distingue le vide de zéro : une mensuration non prise n'est pas une mensuration nulle.
- Un plafond en pouces borne ce qui est fourni en pouces, pas le résultat de sa conversion : 118 pouces valent 300 cm, la borne en centimètres est donc atteinte exactement.
- Le plafond de poids en V1 (1000 kg) est supérieur au plafond en V2 (999 kg) : une valeur déjà enregistrée entre les deux resterait valide. Aucune migration, aucune vérification à la lecture et aucune garde n'existe pour la ramener. **[non implémenté]**

### Les arrondis et la troncature

Deux familles appartiennent à ce document. La troncature et l'arrondi d'écriture changent la valeur conservée ; l'arrondi de calcul détermine la valeur d'une grandeur dérivée. Ce qui n'existe que le temps d'exprimer un nombre vers l'extérieur ne touche aucune donnée et est hors de ce document.

Ce qui impose réellement la granularité d'une valeur fournie n'est pas un arrondi mais une **troncature** : les décimales au-delà du nombre autorisé sont coupées, non arrondies, et la valeur n'est pas refusée pour autant.

```
tronquee(« 95.65 », 1 décimale) = « 95.6 »
tronquee(« 95.65 », 0 décimale) = « 95 »
```

L'arrondi d'écriture du poids s'applique ensuite, sur une valeur déjà tronquée : il ne modifie donc rien d'une valeur fournie à la main, et ne mord que sur une valeur produite par un calcul.

| Grandeur | Règle | Moment |
| --- | --- | --- |
| Toute grandeur à décimales bornées | troncature au nombre de décimales autorisé | avant l'écriture |
| Poids (pesée, départ, visé) (V1) | `arrondi(kg × 10) ÷ 10` | à l'écriture |
| Distance d'une séance | `arrondi(mètres)` | à l'écriture |
| Taille convertie **[V2]** | `arrondi(pouces × 2,54)` | à l'écriture |
| Heure d'une entrée | plus grande minute ronde inférieure ou égale | à l'écriture |
| Poids d'un objet de comparaison | `grammes ÷ 1000`, sans arrondi | à l'écriture |
| IMC | `arrondi(imc × 10) ÷ 10` | au calcul |
| Points d'IMC | `arrondi(écart × 10) ÷ 10`, sur l'écart et non sur les deux IMC | au calcul |
| Énergie dépensée par une séance ou par des pas | arrondi à l'entier, entrée par entrée | au calcul |
| Énergie ingérée d'une journée | arrondi à l'entier, une fois la somme faite | au calcul |
| Objectif de protéines par défaut | `arrondi(poids × 1,5)` | au calcul |
| Durée de marche estimée | `arrondi(pas ÷ 95)`, en minutes | au calcul |
| Distance de marche estimée | `(pas × 0,00076)` ramené à une décimale | au calcul |
| Pourcentage d'atteinte d'un objectif | `max(0, min(100, arrondi(valeur ÷ objectif × 100)))` | au calcul |
| Score d'activité d'une journée | `arrondi(score × 10) ÷ 10` | au calcul |

L'arrondi du poids au dixième vaut pour les trois poids du modèle de la V1 — la pesée, le poids de départ, le poids visé : la granularité est un invariant de la grandeur, pas une règle locale. L'arrondi des points d'IMC porte sur l'écart et non sur les deux IMC pris séparément, parce que retrancher deux valeurs déjà arrondies peut décaler le résultat d'un dixième entier.

Un cumul sur plusieurs jours n'est pas la somme des valeurs journalières arrondies : le métabolisme de base est accumulé sans arrondi et le total n'est arrondi qu'une fois, si bien que le total d'une semaine peut différer d'une unité de la somme de ses sept valeurs journalières.

**Cas limites**

- La seule opération qui arrondisse au pas déclaré est le déplacement d'une valeur d'un cran, pour écarter les résidus de la virgule flottante. Le chemin ordinaire d'une valeur fournie tronque et n'arrondit jamais au pas.
- Une valeur déplacée d'un cran est ramenée dans les bornes plutôt que refusée ; un déplacement ne produit jamais une valeur hors bornes.
- L'arrondi d'une heure est toujours vers le bas, jamais au plus proche : arrondir vers le haut produirait un instant futur, qu'aucun calcul rapporté à l'instant présent ne compterait.
- Deux modèles de foulée coexistent : la distance de marche estimée d'un nombre de pas emploie une foulée fixe de 0,00076 km, tandis que l'énergie dépensée par ces mêmes pas emploie une foulée proportionnelle à la taille (`taille_cm × 0,414 ÷ 100000` km). Les deux donnent des distances différentes pour le même nombre de pas. **[arbitrage non validé]**

### L'écriture d'un nombre au stockage

Le séparateur décimal du stockage est le point, dans toutes les langues et dans tous les systèmes d'unités. Le séparateur qu'une langue emploie — la virgule en français, le point en anglais — est une propriété de la langue et ne touche jamais la valeur conservée : une valeur écrite « 95,1 » puis relue dans une autre langue ne voudrait plus rien dire.

Un nombre conservé ne porte ni séparateur de milliers, ni étiquette d'unité, ni signe positif. Ce qui arrive est nettoyé avant d'être interprété : la virgule devient un point, tout ce qui n'est ni chiffre ni point est retiré, un seul point survit, les décimales au-delà du nombre autorisé sont tronquées plutôt que refusées, un point final orphelin est retiré, et le signe négatif est retiré. Le nettoyage ne borne pas : il vaut sur toute valeur partielle, alors que la vérification des bornes ne vaut qu'une fois la valeur complète — sans quoi une valeur en cours de composition serait refusée avant d'avoir atteint son minimum.

La valeur retenue est la chaîne nettoyée elle-même, sans recomposition : « 70 » reste « 70 » et ne devient pas « 70.0 ». Une valeur absente reste absente ; aucune substitution — ni zéro, ni moyenne — ne prend sa place.

Une valeur peut transiter sous forme de texte avant d'être enregistrée ; elle porte alors le point décimal, la même forme dans toutes les langues, et sa conversion en nombre a lieu à l'enregistrement. **[V2]**

**Cas limites**

- Une chaîne réduite à un point vaut une valeur vide, admise pour une grandeur facultative et refusée sinon.
- Une chaîne dont le nettoyage ne laisse rien vaut également une valeur vide.
- Le format déjà enregistré ne change pas sans migration explicite ; aucun code de migration n'existe à ce jour. **[non implémenté]**

> **Exemple.**
>
> Camille est partie de 96 kg en mai 2026. La valeur conservée est `96`, la même dans toutes les langues. Une pesée fournie à 95,65 kg est conservée à `95.6` : la troncature au dixième la coupe avant que l'arrondi ne la voie, et l'arrondi ne la remonte pas à 95,7.

### Les échelles sans unité

Certaines grandeurs sont des positions sur une échelle et non des mesures. Leur seule définition est l'intervalle et l'ordre de leurs échelons.

| Grandeur | Valeurs | Sens |
| --- | --- | --- |
| Faim avant un repas, faim après | entier de 0 à 5 | croissant |
| Qualité d'un sommeil | entier de 0 à 5, six échelons nommés | croissant, de « Très mauvaise » à « Excellente » |
| Sévérité d'un effet indésirable | entier de 0 à 5, six échelons nommés | croissant, de « Imperceptible » à « Élevé » |
| Score d'activité d'une journée | nombre de 0 à 10, au dixième | croissant, plafonné |
| Intensité d'une séance | trois valeurs nommées : douce, modérée, intensive | ordinale, avec les facteurs 0,8, 1,0 et 1,3 |

Le type du modèle cible déclare la sévérité de 1 à 5 ; rien ne l'applique, et ce qui est écrit aujourd'hui peut valoir 0. L'échelle vivante est celle des six échelons nommés. **[arbitrage non validé]**

Le score d'activité n'est pas conservé : il se calcule à partir des minutes pondérées d'une journée, la durée de chaque séance multipliée par son facteur d'intensité, un étage valant une demi-minute d'équivalent. 78 minutes pondérées valent le score plein de 10, au-delà duquel il est plafonné : le plafond fait qu'une séance de trois heures ne vaut pas trois journées.

```
minutesPonderees = durée × facteurIntensite      (étages : durée × 0,5 × facteur)
score            = min(minutesPonderees ÷ 78 × 10, 10)
```

Une valeur d'échelle conservée à sa valeur de départ est indiscernable d'une valeur choisie : rien dans la donnée ne distingue une qualité de sommeil laissée à sa position initiale d'une qualité posée volontairement. Les entrées ainsi conservées restent ambiguës et ne sont pas réécrites — les réécrire détruirait aussi les vraies valeurs basses.

> **Exemple.**
>
> Camille marche 45 minutes à intensité modérée : 45 minutes pondérées, soit un score de 45 ÷ 78 × 10 = 5,769, tracé 5,8. Ses 6 200 pas contre un objectif de 8 000 donnent un pourcentage d'atteinte de 78.

### Les grandeurs dérivées

Rien de dérivable n'est conservé : une grandeur dérivée se recalcule à chaque lecture, de sorte que corriger une valeur source corrige tout l'historique qui en dépend. Les formules ci-dessous prennent leurs entrées dans les unités de conservation.

```
imc            = arrondi(kg ÷ (cm ÷ 100)² × 10) ÷ 10
pointsImc      = arrondi((kgActuel − kgDepart) ÷ (cm ÷ 100)² × 10) ÷ 10
metabolismeBase= 10 × kg + 6,25 × cm − 5 × ans + 5      (homme)
                 10 × kg + 6,25 × cm − 5 × ans − 161    (femme)
                 moyenne des deux                        (neutre)
energiePas     = arrondi(3,5 × kg × (pas × (cm × 0,414 ÷ 100000)) ÷ 4,2)
distanceMarche = pas × 0,00076                           (km, une décimale)
dureeMarche    = arrondi(pas ÷ 95)                       (minutes)
energieSeance  = arrondi(MET × facteurIntensite × kg × minutes ÷ 60)
energieEtages  = arrondi(0,05 × facteurIntensite × kg × etages)
nutriment      = valeurPour100 × quantite ÷ 100
pourcentage    = max(0, min(100, arrondi(valeur ÷ objectif × 100)))
```

Le MET est un équivalent métabolique : une kilocalorie par kilogramme de masse corporelle et par heure. C'est ce qui rend homogène `MET × kg × heures`, dont le résultat est en kilocalories. Le MET de la marche vaut 3,5 dans la formule des pas, dont la vitesse de référence est fixée à 4,2 km/h.

Quand une séance porte une distance non nulle, une durée non nulle et que son activité admet une allure, l'énergie ne se lit plus sur l'intensité ressentie mais sur l'allure, exprimée en kilomètres par heure : `allure = mètres ÷ 1000 ÷ heures`, puis un coût énergétique interpolé linéairement entre les deux points d'une table d'ancrages, bloqué à la valeur du point extrême au-delà des bornes de la table. Le facteur tiré de l'allure est ramené à la même plage que le ressenti, de 0,8 à 1,3, faute de quoi les deux chemins ne seraient plus comparables.

Un pourcentage d'atteinte est une grandeur dérivée bornée sans unité : il vaut 0 quand l'objectif est nul ou négatif, et il est ramené dans `[0, 100]`.

L'IMC vaut 0 quand la taille est inconnue ou nulle ; les points d'IMC valent alors une absence de valeur, et non zéro. Le signe des points d'IMC est celui de la variation : perdre du poids donne un nombre négatif.

La concentration sanguine d'une molécule est une grandeur dérivée sans unité physiologique : elle est exprimée sur l'échelle de la dose, en milligrammes, mise à l'échelle par la biodisponibilité relative de la forme prise et normalisée pour que son maximum vaille la dose ainsi mise à l'échelle. Elle n'est comparable qu'à elle-même.

**Cas limites**

- Une quantité dont l'aliment ne se résout pas est ignorée dans un total plutôt que comptée pour zéro : le total reste juste pour ce qui est connu.
- Un poids total nul dans une composition donne des valeurs nulles, jamais une division par zéro.
- Une activité absente du catalogue n'a pas de MET ; le score d'activité la compte quand même, puisqu'il ne demande qu'une durée et une intensité.
- Le poids employé par une formule dérivée est le dernier poids connu à la date considérée, à défaut le poids de départ, à défaut le poids visé, à défaut 80 kg.

> **Exemple.**
>
> Camille, née en 1978, 168 cm, 96 kg : son IMC vaut 96 ÷ 1,68² = 34,01…, soit 34,0. À 85,9 kg il vaut 30,4, et la variation est de −3,6 points d'IMC. Son métabolisme de base, à 48 ans, vaut 10 × 96 + 6,25 × 168 − 5 × 48 − 161 = 1 609 kcal. Ses 6 200 pas donnent 4,7 km par la foulée fixe, 65 minutes de marche, et 345 kcal par la foulée proportionnelle à sa taille, qui ne compte que 4,31 km.

### Le temps comme grandeur

Une durée est conservée en minutes entières, jamais en texte. Un instant technique est un nombre de millisecondes depuis l'époque Unix. Une date et une heure d'entrée sont des chaînes d'heure murale locale, sans fuseau ni suffixe : elles sont lues sur les composantes locales de l'horloge, jamais sur une représentation universelle, faute de quoi une entrée faite en soirée ou en début de nuit changerait de jour selon le fuseau.

Toute heure conservée est quantifiée sur huit minutes rondes, arrondie vers le bas.

```
minutesRondes = { 0, 10, 15, 20, 30, 40, 45, 50 }
heureConservee(h:m) = h : max{ r ∈ minutesRondes | r ≤ m }
14:37 → 14:30   14:47 → 14:45   14:58 → 14:50   14:07 → 14:00
```

La quantification est appliquée au moment d'écrire, dans le domaine, et non au moment où la valeur est fournie : l'ensemble étant irrégulier, il mêle des pas de cinq et de dix. Elle vaut pour toutes les heures conservées, y compris celles d'un rappel et les deux heures d'un sommeil.

Fuseau et langue sont indépendants : la langue ne détermine que la manière d'écrire une date, jamais le jour auquel une entrée appartient.

**Cas limites**

- Une chaîne qui n'a pas la forme `HH:MM`, ou dont les minutes dépassent 59, ressort inchangée de la quantification : c'est aux vérifications amont de la refuser.
- Une entrée sans heure est réputée avoir eu lieu ; pour ordonner les entrées d'un même jour, une heure absente vaut midi.
- L'arrondi vers le bas garantit que l'heure conservée est déjà passée et que le passage à minuit n'est jamais franchi.
- Une nuit appartient au jour de son réveil : les deux jours, celui de l'endormissement et celui du réveil, sont conservés séparément, ce qui rend détectable une paire d'instants impossible.

## 4. Le temps

Le produit date tout ce qu'il enregistre par un jour local et, le plus souvent, par une heure murale. Ce chapitre pose ces deux grandeurs, la journée qu'elles composent, l'arithmétique qui les décale et les fenêtres qui les découpent.

### Les représentations du temps

Quatre représentations coexistent, et une seule est un instant absolu.

| Représentation | Type | Forme | Ce qu'elle porte |
| --- | --- | --- | --- |
| Jour local | chaîne | `AAAA-MM-JJ` | La date portée par toute entrée de journal, sans exception. |
| Heure murale | chaîne | `HH:MM`, 24 h, zéros de tête | L'heure d'une entrée, quand elle en porte une. Aucun fuseau, aucune seconde, aucun suffixe. |
| Horodatage d'archive | chaîne | `AAAA-MM-JJ-HHMMSS` | Le moment local d'une copie de secours des données. |
| Instant absolu | entier | millisecondes depuis l'époque Unix | Les métadonnées de création et de dernière modification des référentiels et des collections que l'utilisatrice enrichit. |

L'instant absolu n'est jamais porté par une donnée de santé. Il est porté par six sortes d'objets, et par elles seules : une recette et un aliment personnalisé portent un instant de création *et* un instant de dernière modification, tous deux obligatoires ; un type d'effet secondaire et un type d'activité physique portent les deux mêmes, également obligatoires ; un menu favori et une entrée de la base d'aliments enrichie portent un instant de création *facultatif*, arrivé après coup avec un plafond de création — les objets écrits avant lui n'en ont pas, et ne comptent dans aucun quota.

Aucune pesée, aucune prise, aucun repas, aucune nuit ne porte d'instant absolu : ces entrées portent un jour local et, sauf le total de pas, une heure murale.

### Le jour local

Un jour local se compose des composantes locales de l'horloge de l'appareil : année, mois, quantième, chacun complété de zéros. Il n'est jamais dérivé de la moitié gauche d'un instant sérialisé en UTC.

```
jourLocal(t) = t.année_locale + "-" + pad2(t.mois_local) + "-" + pad2(t.quantième_local)
```

La conversion par UTC est proscrite parce qu'elle décale d'un jour et que le sens du décalage dépend du fuseau. Dans un fuseau positif (France en été, UTC+2), une saisie faite à 00 h 30 locale appartient encore à la veille en UTC. Dans un fuseau négatif, c'est la fin de soirée qui bascule au lendemain. Une entrée ainsi datée est rangée dans la mauvaise journée, comptée dans la mauvaise fenêtre et perdue pour la bonne.

Le format se compare directement : pour deux jours locaux, l'ordre lexicographique des chaînes est l'ordre chronologique. C'est ce que fait le filtrage des fenêtres réglables, qui ne compare que des chaînes et ne fait donc intervenir aucun fuseau. **Ce n'est pas universel** : plusieurs bornes et plusieurs ordres passent par des instants, et la section sur l'arithmétique des jours en donne le relevé.

#### La lecture stricte d'un jour

Une seule capacité vérifie qu'un jour local *existe*, et rend le triplet ou l'absence. C'est la seule règle de quantième du produit.

```
lireJour("AAAA-MM-JJ") → { année, mois, quantième } | absent
  forme ≠ AAAA-MM-JJ         → absent
  mois < 1 ou mois > 12      → absent
  quantième < 1 ou quantième > joursDuMois(année, mois) → absent
joursDuMois(année, mois) = quantième local du « jour 0 » du mois suivant
```

Ainsi `2026-02-30` et `1900-02-29` sont absents, `2000-02-29` est accepté, sans qu'aucune règle de divisibilité par 4, 100 ou 400 soit écrite : le débordement d'un mois se résout par la normalisation d'un triplet, jamais par un test. La saisie de huit chiffres se lit avec les mêmes trois refus, plus un quatrième : une année inférieure à 1000 est refusée. Partout ailleurs, une date est seulement testée sur sa *forme* — `^\d{4}-\d{2}-\d{2}$` —, jamais sur son existence.

### L'heure murale et les minutes rondes

Une heure est une chaîne `HH:MM`, zéros de tête compris, donc comparable comme chaîne à toute autre heure. Elle ne porte ni fuseau, ni secondes. **Son domaine est `HH ∈ [00,23]` et `MM ∈ [00,59]`**, et ce domaine n'est vérifié que par les deux capacités qui lisent une heure en minutes : la conversion d'une heure en minutes depuis minuit rend « absent » dès que `HH > 23` ou `MM > 59`, et le placement d'une entrée dans son créneau de trois heures rend « absent » hors de `[0,23]`.

Toute heure retenue par le produit respecte les **minutes rondes** : `0, 10, 15, 20, 30, 40, 45, 50`. L'ensemble est irrégulier — des pas de dix, plus les deux quarts.

```
arrondir("HH:MM") = "HH:" + max{ m ∈ {0,10,15,20,30,40,45,50} | m ≤ MM }
```

L'arrondi est toujours vers le bas, jamais au plus proche : arrondir vers le haut produirait une heure encore à venir, qu'un calcul de « déjà survenu » refuserait de compter, et pourrait franchir minuit — donc changer de journée.

**L'arrondi ne contrôle que les minutes.** Il refuse une chaîne qui n'a pas la forme `HH:MM`, et refuse `MM > 59` : ces deux-là ressortent inchangées. Il ne regarde pas l'heure : `25:37` ressort `25:30`. Il n'y a donc pas une lecture d'« heure » mais deux — la garde de forme de l'arrondi, et la garde de domaine de la conversion en minutes. Aucune précondition d'écriture ne rattrape la première.

La règle vit au moment d'écrire, pas à la saisie, parce que l'ensemble des minutes rondes est trop irrégulier pour être proposé autrement. Elle est portée par les deux gestes génériques d'un journal — ajouter une ligne, fusionner une modification dans une ligne —, qui arrondissent le seul attribut nommé *heure* et laissent passer une ligne qui n'en a pas. Le sommeil en porte *deux* : ses gestes appellent donc leur propre arrondi, qui traite l'heure de réveil et l'heure d'endormissement, faute de quoi un endormissement à 22:37 serait écrit tel quel. Sont ainsi arrondies les heures de pesée, de prise de traitement, de repas, de séance d'activité, de moment à soi, les deux heures d'une entrée de sommeil, et les heures de rappel.

L'heure proposée par défaut à la création d'une entrée est l'heure locale courante ainsi arrondie vers le bas ; elle est donc toujours déjà passée.

> **Exemple.**
>
> Camille se pèse à 07 h 37 : la pesée est enregistrée à `07:30`. Une prise notée à 14 h 58 est enregistrée à `14:50`, jamais à 15 h 00.

### L'instant d'une entrée, et les trois heures de repli

Quand un calcul a besoin d'un instant — durée d'une nuit, cinétique d'une molécule, ordre de deux entrées du même jour —, il compose le jour local et l'heure murale et lit le résultat dans le fuseau de l'appareil, sans jamais mentionner de fuseau.

```
instant(entrée) = interprétationLocale(entrée.date + "T" + (entrée.heure || "12:00") + ":00")
```

Le repli est celui d'une valeur *vide ou absente*, et non de la seule absence : l'heure étant facultative, une chaîne vide retombe elle aussi sur le repli plutôt que de produire un instant illisible.

**Trois heures de repli coexistent, et le produit n'a pas tranché entre elles.** Elles ne portent pas sur les mêmes calculs, et deux d'entre elles se contredisent sur le même objet.

| Repli | Où il s'applique | Effet |
| --- | --- | --- |
| `12:00` | Le comparateur générique du modèle (croissant et décroissant) ; la retenue de la dernière pesée d'une journée ; toute la cinétique des molécules (instant de la prise la plus récente, fenêtre des prises actives, rotation des sites) ; l'ordre du journal des traitements. | Place l'entrée au milieu de sa journée, donc ni avant ni après les journées voisines. |
| `00:00` | La signature de la *dernière pesée* ; l'ordre des journaux de sommeil, d'activité physique et de moments à soi ; la coupure du traitement en cours. | Place l'entrée en tête de sa journée : elle passe avant toutes celles qui portent une heure. |
| chaîne vide | L'ordre du fil de toutes les entrées, tous journaux confondus, qui compare d'abord les dates puis les heures. | La chaîne vide est plus petite que toute heure : en ordre décroissant, l'entrée sans heure passe *après* celles de son jour qui en portent une. |

La retenue de la dernière pesée d'une journée et la signature de la dernière pesée du journal portent sur la même donnée avec deux replis différents. Aucune décision ne dit lequel fait foi.

L'ordre d'un journal se lit sur la date et l'heure portées par ses lignes, jamais sur leur rang d'insertion : une ligne antidatée est écrite en fin de table et appartient pourtant au passé. La forme de la comparaison varie elle aussi : le comparateur générique compare deux clés `date + "T" + heure` comme des chaînes, les journaux de sommeil, d'activité et de moments à soi construisent deux instants et soustraient leurs millisecondes, le fil de toutes les entrées compare la date puis l'heure séparément.

```
cléDeTri(ligne) = ligne.date + "T" + (ligne.heure || "12:00")   // comparateur générique du modèle
```

À clé égale, l'ordre de la table subsiste : à heure égale, la dernière enregistrée l'emporte.

### L'instant de référence est toujours injecté

Aucune fonction du domaine ne lit l'horloge d'elle-même : « maintenant » ou « aujourd'hui » lui est passé en paramètre, avec l'instant courant pour valeur par défaut. La règle vaut pour le calcul de « déjà survenu », les bornes des fenêtres de progression, le rang de semaine depuis une date, le bilan de dépense, la date de première ouverture, l'horodatage d'une archive, les séries journalières et la proposition d'un site de rotation.

Deux conséquences. Un calcul est reproductible : le même appel avec le même instant de référence rend toujours le même résultat, ce qui rend testables les bords — la veille d'un changement d'heure, une minute avant minuit, une année bissextile. Et un même instant de référence traverse une chaîne de calculs sans se décaler en route : la fenêtre de sept jours et la frontière du « déjà survenu » d'un même bilan sont fixées par la même valeur.

### Fuseau et langue

Le fuseau qui date une entrée est toujours celui de l'appareil, lu à travers les composantes locales de l'horloge. Le produit ne convertit jamais une date de santé d'un fuseau à un autre et n'en stocke aucun *sur une entrée*.

Deux exceptions, hors des données de santé. Un envoi de retour capte le fuseau nommé de l'appareil (`Europe/Paris`, ou « inconnu »), son décalage en minutes compté positivement à l'est, l'instant de l'envoi en millisecondes, ce même instant sérialisé en UTC, son écriture lisible locale et le jour local correspondant — six valeurs, jointes au message. Et la synthèse médicale exportée relit ses dates en UTC de bout en bout : elle compose l'instant à partir de la chaîne suffixée `Z` puis le remet en forme dans ce même UTC, si bien que les deux conversions s'annulent et que le jour rendu est celui qui était écrit.

La langue et le fuseau sont deux axes indépendants : changer de langue ne change pas la journée à laquelle une entrée appartient. L'indépendance est aujourd'hui une propriété par défaut plutôt qu'une règle tenue par du code : le profil de la V1 ne porte aucune langue, et toute mise en forme lisible y est figée en français. La V2 porte une langue (`fr`, `en`, valeur de départ `fr`) et ne met en forme aucune date. **[V2]**

Une conséquence à admettre : le jour local d'une entrée est figé à l'écriture, mais « aujourd'hui » est recalculé sur l'horloge de l'appareil à chaque lecture. Voyager change donc ce qui est « aujourd'hui », jamais ce qui a déjà été enregistré.

### La journée

Une journée est désignée par son jour local, et rien d'autre. Une entrée appartient à la journée de sa date ; il n'existe aucune notion de journée décalée (pas de « journée qui commence à 4 h »).

| Ce qui se compte par journée | Règle |
| --- | --- |
| Plafond quotidien d'un journal | Le décompte porte sur les lignes réellement présentes qui portent la même date. Selon le journal, le plafond refuse la saisie (sommeil : 15 par journée, rien n'est écrit) ou écrase une ligne du jour. |
| Total de pas | Une valeur par journée, sans heure. L'entrée de pas ne porte aucun attribut d'heure : l'absence n'y est pas un oubli de saisie mais une impossibilité de type. La journée entière est donc réputée survenue dès qu'elle est la journée en cours. |
| Dénominateur d'une moyenne journalière | Le nombre de journées effectivement renseignées dans la fenêtre, jamais la longueur de la fenêtre. Aucune journée renseignée : la moyenne est absente, pas nulle. |
| Découpage horaire des repas | Huit créneaux fixes de trois heures, `index = ⌊heure / 3⌋`. Ce découpage ne sert qu'aux repas et en-cas ; aucun autre journal n'est découpé ainsi. Une heure absente ou hors `[0,23]` est comptée à part, jamais placée au hasard. |

**La ligne écrasée au plafond est la dernière de la table, pas la plus tardive.** Le geste cherche, en remontant depuis la fin, la dernière ligne portant la date visée, et fusionne la nouvelle valeur dedans ; il ne lit aucune heure. C'est l'ordre des saisies qui décide — exactement ce que le reste du modèle refuse. Une ligne antidatée saisie en dernier est donc celle qu'on écrase. **[arbitrage non validé]**

**Une nuit occupe deux journées et n'appartient qu'à une.** Une entrée de sommeil porte quatre valeurs temporelles : une date et une heure d'endormissement, une date et une heure de réveil ; elle porte aussi sa nature, nuit ou sieste. La date de l'entrée est celle du *réveil* ; la date d'endormissement est écrite, jamais déduite — une sieste et une nuit ont la même structure.

```
durée(nuit) = instant(date, heureRéveil) − instant(dateEndormissement, heureEndormissement), en minutes
si cette différence est ≤ 0 → 0   // aucun passage de minuit n'est deviné
recouvrement(a, b) ⇔ début(a) < fin(b) et début(b) < fin(a)   // bout-à-bout permis
```

Le **temps d'éveil** d'une journée J se lit sur deux entrées différentes : le réveil d'une nuit datée J l'ouvre, l'endormissement d'une nuit datée J+1 le ferme, et les siestes de J s'en retranchent. Il est absent tant que l'une des deux nuits manque — un jour sans nuit ne vaut pas vingt-quatre heures d'éveil.

Sa formule n'est pas une soustraction d'instants, contrairement à celle de la durée d'une nuit : elle ne manipule que des *minutes depuis minuit*, et c'est le seul endroit du produit où un passage de minuit est *deviné*. La date d'endormissement de la nuit du lendemain n'est jamais lue.

```
nuitsJ    = entrées de nature « nuit » datées J          ; absent si vide
nuitsJ+1  = entrées de nature « nuit » datées J+1        ; absent si vide
réveil    = max( minutesDepuisMinuit(heureRéveil) sur nuitsJ )          // le plus tardif ouvre
coucher   = min( minutesDepuisMinuit(heureEndormissement) sur nuitsJ+1 ) // le plus précoce ferme
brut      = coucher > réveil ? coucher − réveil : coucher + 1440 − réveil
éveil(J)  = brut − siestes(J)   ; absent si ce résultat n'est pas > 0
```

Plusieurs nuits pour une même journée donnent donc le temps d'éveil le plus prudent, jamais gonflé par une saisie en double. Une heure illisible y compte pour zéro minute.

### L'arithmétique des jours

| Capacité | Définition | Rendu |
| --- | --- | --- |
| Décaler un jour de *n* | Le triplet (année, mois, quantième + *n*) est normalisé composante par composante, sur une origine UTC posée et relue en UTC des deux côtés ; *n* peut être négatif. | Un jour local. Une entrée mal formée ressort inchangée. |
| Veille d'un jour | Le décalage de −1. | Un jour local. |
| Écart entre deux jours | `(fin − début) / 86 400 000`, arrondi, les deux jours étant posés à la même origine composante par composante. | Un entier de jours, signé. Zéro si l'une des deux formes est illisible. |

Ces trois opérations sont insensibles au changement d'heure : elles ne manipulent que des triplets de nombres, jamais une durée réelle. La normalisation absorbe seule les fins de mois et les années bissextiles.

**Reculer de *n* jours se fait de quatre façons dans le produit, et elles ne coïncident pas toujours.**

| Méthode | Où | Sensibilité au changement d'heure |
| --- | --- | --- |
| Triplet normalisé (décalage de jour ci-dessus) | Les deux fenêtres de comparaison de la progression d'activité et de la progression alimentaire ; les quatre fenêtres semaine/mois ; la date de déverrouillage de l'ancienneté. | Aucune. |
| Décrémentation du quantième d'une date locale | La coupure des fenêtres réglables ; les sept journées du bilan de dépense ; la veille du libellé relatif. | Aucune. |
| Décrémentation du quantième, la date étant d'abord posée à midi | Le lendemain d'une journée, dans le temps d'éveil. | Aucune ; le midi met à l'abri des heures manquantes ou doublées. |
| Soustraction de `n × 86 400 000` ms à l'instant courant, puis relecture du jour local | Les cumuls à sept jours (activité, moments à soi, sommeil) ; les moyennes journalières des repas ; les séries de quatorze journées ; la fenêtre du fil de toutes les entrées. | Décale d'un jour quand un changement d'heure tombe dans l'intervalle et que l'instant courant est à moins d'une heure de minuit. |

À cela s'ajoute une arithmétique par instants : l'écart en jours depuis la dernière prise du traitement en cours se calcule en soustrayant deux chaînes `AAAA-MM-JJ` converties en instants. La conversion interprète chacune comme minuit UTC ; comme les deux subissent le même décalage, la différence reste exacte. Le procédé est néanmoins celui que la règle du produit proscrit, et il est faux dès qu'un seul des deux termes est un instant local.

Le rang d'une semaine depuis une date de départ se calcule encore autrement, sur deux minuits locaux :

```
joursÉcoulés = arrondi((minuitLocal(aujourd'hui) − minuitLocal(départ)) / 86 400 000)
si départ illisible → absent               // année, mois ou quantième nul ou non numérique
si joursÉcoulés < 0 → absent               // une date de départ à venir n'a pas de rang
rangDeSemaine = ⌊joursÉcoulés / 7⌋ + 1     // la première semaine porte le n° 1
```

L'arrondi est là pour absorber l'heure qu'un passage à l'heure d'été ajoute ou retire au milieu de l'intervalle. Le rang de semaine de la cure se compte depuis la date de la pesée de départ ; le même calcul, appliqué à la date de la première prise du traitement en cours, donne le rang de semaine de ce traitement.

> **Exemple.**
>
> Camille a sa pesée de départ au 2026-05-04. Le 2026-09-13, l'écart vaut 132 jours : elle est dans sa 19e semaine de cure.

### Le futur et le déjà survenu

Rien n'interdit de dater une entrée dans le futur : une prise peut être notée à l'avance, un repas planifié. Les calculs qui prétendent décrire l'état réel à l'instant présent écartent donc ce qui n'a pas encore eu lieu.

```
déjàSurvenu(date, heure?, maintenant) =
  date < aujourd'hui(maintenant)        → vrai
  date > aujourd'hui(maintenant)        → faux
  date = aujourd'hui, sans heure        → vrai      // une journée en cours compte en entier
  date = aujourd'hui, avec heure        → heure ≤ heure locale de maintenant
```

Cette précondition gouverne notamment le nombre de prises comptées, la dose dite « actuelle », le total administré, les bilans de dépense et l'analyse de progression. Elle n'est pas universelle : la plupart des fenêtres n'ont pas de borne haute, et une entrée datée de demain y passe.

### Les fenêtres réglables

Six fenêtres, les mêmes partout, le choix étant une donnée retenue par usage.

| Fenêtre | Borne basse | Borne haute | Inclusivité |
| --- | --- | --- | --- |
| 7 jours | `aujourd'hui − 6 jours` | aucune | Basse inclusive. |
| 14 jours | `aujourd'hui − 13 jours` | aucune | Basse inclusive. |
| 30 jours | `aujourd'hui − 29 jours` | aucune | Basse inclusive. |
| 90 jours | `aujourd'hui − 89 jours` | aucune | Basse inclusive. |
| Tout | aucune | aucune | Tout est retenu. |
| Personnalisée | jour local donné, ou vide | jour local donné, ou vide | Les deux bornes inclusives ; une borne vide vaut « sans limite de ce côté ». |

```
coupure(n jours) = aujourd'hui − (n − 1) jours          // la journée en cours compte
retenue(entrée)  = entrée.date ≥ coupure                 // comparaison de chaînes
personnalisée : retenue(entrée) = (début vide ou entrée.date ≥ début) et (fin vide ou entrée.date ≤ fin)
```

« Sept derniers jours » signifie donc aujourd'hui et les six jours précédents, soit sept journées pleines. La coupure est obtenue en décrémentant le quantième de la date locale courante : elle est insensible au changement d'heure. Ces quatre fenêtres à durée fixe ne posent aucune borne haute, et laissent passer une entrée datée du futur.

La valeur de départ d'une fenêtre est propre à chaque usage : elle vaut 30 jours sauf si l'usage en demande une autre — le relevé des créneaux horaires ouvre sur 7 jours. Une valeur relue qui ne correspond à aucune des six retombe sur la valeur de départ *de cet usage*, pas sur 30 jours. Chaque usage retient son choix séparément : changer la fenêtre d'un usage n'entraîne aucun autre. Le passage en fenêtre personnalisée et l'écriture de ses deux bornes forment une seule écriture.

> **Exemple.**
>
> Le 2026-09-13, la fenêtre « 7 derniers jours » de Camille retient toute entrée dont la date est ≥ `2026-09-07`.

### Les fenêtres fixes des bilans

Certains calculs ne sont pas réglables : leur fenêtre fait partie de leur définition. Les bornes ci-dessous sont toutes inclusives, et J désigne la journée en cours.

| Bilan | Fenêtre | Borne haute | Précision |
| --- | --- | --- | --- |
| Cumuls et moyennes « sept derniers jours » : minutes d'activité, minutes de moments à soi, sommeil | `[J−6, J]` | aucune | Recul par millisecondes. Dénominateur d'une moyenne : les journées renseignées ; absente si aucune. |
| Moyennes journalières des repas sur sept jours (calories, protéines, fibres) | `[J−7, J−1]` | `J−1` | Sept journées *révolues* : la journée en cours est écartée, parce qu'elle est presque toujours incomplète. Dénominateur : les journées renseignées ; absente si aucune. |
| Moyennes journalières des repas depuis le début | tout l'historique | aucune | Aucune borne : le découpage est celui des journées renseignées du journal, quel que soit leur éloignement. |
| Séries journalières de quatorze journées | `[J−13, J]` | aucune | Une valeur par journée, de la plus ancienne à la plus récente. Recul par millisecondes. |
| Sens d'évolution d'une série journalière | première moitié contre seconde | — | Sur une série de quatorze journées, cela fait sept contre sept. |
| Progression d'activité et progression alimentaire, échelle semaine | `[J−6, J]` contre `[J−13, J−7]` | bornes des fenêtres | Recul par triplet. Entrées filtrées en plus par « déjà survenu ». Ni chevauchement ni trou. |
| Progression d'activité, échelle mois | `[J−29, J]` contre `[J−59, J−30]` | bornes des fenêtres | Les deux échelles se calculent, la meilleure l'emporte. |
| Bilan de dépense et projection | `[J−6, J]` | aucune | Recul par décrémentation du quantième. Entrées filtrées par « déjà survenu », l'instant de référence fixant à la fois la fenêtre et cette frontière. |
| Fil de toutes les entrées | `[J−6, J]` | `J` | Borne haute explicite : le futur est écarté. Au plus 40 entrées retenues. |
| Prises réputées actives | instants ≥ maintenant − 60 × 86 400 000 ms | aucune | Exprimée en instants. Si elle ne retient rien, l'historique entier est repris — un traitement arrêté depuis longtemps mais encore présent dans le sang ne disparaît pas. |
| Étendue d'une série poids-traitement à durée fixe | `[midiLocal(J) − n × 86 400 000, midiLocal(J)]` | `midi de J` | Deux bornes en instants, et un recul de *n* jours pleins : la fenêtre « 7 jours » y couvre huit journées, contrairement à la fenêtre réglable homonyme. |
| Étendue d'un histogramme de perte à durée fixe | `dernierPoint − n × 86 400 000` | aucune | La coupure se compte depuis la dernière semaine connue, pas depuis aujourd'hui. |

La série journalière compte quatorze journées ; le nom qui la désigne dit « quinze derniers jours », par décision de l'utilisatrice du 2026-08-28 — en français, « quinze jours » veut dire deux semaines. Aucune règle de données ne dépend de ce nom, et la donnée reste sur quatorze journées.

La comparaison de deux moitiés porte sur des *sommes*. Elle ne connaît pas le nombre sept : elle coupe la série qu'on lui donne en `⌊longueur / 2⌋`, la première moitié étant ce qui précède cette coupure. Sur une longueur impaire les deux moitiés diffèrent d'une journée ; le sept contre sept ne tient qu'à la longueur de quatorze. Une journée absente y compte pour zéro : une semaine vide est une semaine sans activité, pas une mesure manquante.

```
si longueur(série) < 2 → absent
avant = somme(première moitié) ; après = somme(seconde moitié)   // une valeur absente vaut 0
si avant ≤ 0 ou après ≤ 0 :
    les deux ≤ 0 → stable ; sinon après > avant ? hausse : baisse
sinon écart = (après − avant) / avant
    |écart| < 0,05 → stable ; écart > 0 → hausse ; sinon baisse
```

La branche directe couvre donc tout ce qui est négatif ou nul, pas seulement le zéro : le rapport relatif n'est calculé que sur deux moitiés strictement positives. Le seuil de stabilité vaut 5 % et se remplace par appel.

La progression alimentaire ajoute une précondition d'échantillon : elle est absente tant que la fenêtre récente porte moins de **trois** repas analysables. Et l'amélioration ne se déclare que si la fenêtre ancienne porte au moins un repas analysable — sinon son écart moyen vaudrait zéro par convention, et toute semaine passerait pour une régression.

### L'ancienneté d'usage

Le modèle ne porte aucune date d'installation. Une date de première ouverture est donc déterminée une fois, écrite en `AAAA-MM-JJ`, et jamais réécrite :

```
1. la date déjà écrite, si elle existe et a la forme AAAA-MM-JJ ;
2. sinon, la plus ancienne date trouvée dans les neuf journaux, si elle est ≤ aujourd'hui ;
3. sinon, aujourd'hui.
```

Les neuf journaux sont parcourus, y compris ceux dont le suivi est éteint : une donnée datée du 15 mars prouve que le produit était là le 15 mars. Une entrée dont la date n'a pas la bonne forme est ignorée ; une date postérieure à aujourd'hui n'est pas retenue comme origine, sans quoi l'âge serait négatif. La détermination est une lecture pure ; l'écriture est un geste distinct, qui ne touche jamais une date déjà posée. Vider un journal ne rajeunit donc pas l'installation.

```
âgeD'usage = max(0, écartEnJours(premièreOuverture, aujourd'hui))
déverrouillé ⇔ âgeD'usage ≥ 7
```

Le seuil se compte en jours entiers, sur des jours locaux : six jours et vingt-trois heures ne font pas sept jours.

La durée d'une perte de poids se dit en jours en deçà de sept jours, et au-delà en semaines arrondies à l'entier le plus proche, avec un plancher d'une semaine. Elle est *absente* dans deux cas : quand la date de début manque ou est postérieure à la date de fin, et quand l'écart est inférieur à un jour — « en 0 jour » serait un artefact.

### Les horodatages d'archive

Une copie de secours des données porte un horodatage local `AAAA-MM-JJ-HHMMSS`, composé lui aussi des composantes locales de l'horloge, secondes comprises.

Deux copies faites dans la même seconde ne s'écrasent pas, mais le suffixe qui les sépare porte sur l'*emplacement* de la copie, pas sur son horodatage : un suffixe `-2` à `-99` est cherché, et à défaut le nombre de millisecondes depuis l'époque Unix. L'entrée d'index, elle, conserve l'horodatage nu — recomposé une seconde fois, donc identique. L'index est ordonné par comparaison de chaînes décroissante sur cet horodatage, ce que ce format rend exact sans conversion ; deux copies de la même seconde y portent la même clé de tri et ne sont départagées que par la stabilité du tri, la dernière ajoutée restant en tête. Une entrée est remplacée quand son emplacement est réutilisé, jamais quand son horodatage se répète. **[arbitrage non validé]**

### Les données temporelles du profil

Les valeurs ci-dessous sont enregistrées et relues. Les domaines indiqués sont ceux que le type documente ; **aucun n'est vérifié** — ce sont des annotations, pas des préconditions. La valeur de départ est celle qui s'applique quand la donnée est absente.

| Donnée | Type | Domaine documenté | Valeur de départ |
| --- | --- | --- | --- |
| Forme du rappel de prise | énumération | hebdomadaire ou par intervalle | hebdomadaire |
| Jour de rappel hebdomadaire | entier | 0 à 6, `0` = dimanche | 0 |
| Heure de rappel | chaîne `HH:MM` | Minutes rondes, comme toute heure enregistrée. | `20:00` |
| Intervalle d'un rappel de prise | entier | Un nombre de jours (5, 7, 10…) | 7 |
| Date de début du rappel par intervalle | `AAAA-MM-JJ` | — | aujourd'hui |
| Date d'un rendez-vous médical | `AAAA-MM-JJ` | Facultative. | vide |
| Heure d'un rendez-vous médical | chaîne `HH:MM` | Facultative. | `10:00` |
| Préavis d'un rappel | chaîne d'énumération | une heure, deux heures, un jour, deux jours, trois jours, sept jours — une durée relative à l'échéance | un jour |

Les deux formes du rappel de prise s'excluent : c'est la forme retenue qui décide si le jour et l'heure hebdomadaires s'appliquent, ou l'intervalle et sa date de début.

Ces valeurs sont enregistrées et relues, et rien de plus : aucune remise de rappel à l'échéance n'existe. **[non implémenté]**

### L'année de naissance **[V2]**

La V1 enregistre un âge en années. La V2 enregistre l'**année de naissance** : un âge se périme d'un anniversaire à l'autre, une année de naissance non. L'âge redevient une valeur dérivée, jamais stockée.

```
bornes(annéeCourante) = { min: annéeCourante − 130, max: annéeCourante − 1 }   // âge 1 à 130
```

L'année courante est fournie par l'appelant, comme tout instant de référence du produit : la règle de bornes ne lit pas l'horloge, ce qui la rend testable et indépendante du moment où elle s'exécute. Valeur de départ : 1980.

> **Exemple.**
>
> Camille est née en 1978. En 2026, les bornes acceptent 1896 à 2025 ; son âge, 48 ans, se recalcule à chaque lecture et n'est écrit nulle part.

**Cas limites**

Une chaîne de date mal formée n'est jamais devinée : le décalage la rend inchangée, l'écart entre deux jours rend zéro, la lecture stricte rend « absent ».

Une heure dont les minutes dépassent 59, ou qui n'a pas la forme `HH:MM`, traverse l'arrondi sans être modifiée ; une heure dont les *heures* dépassent 23 est arrondie comme une autre, et n'est refusée que par la conversion en minutes.

Trois heures de repli coexistent pour une entrée sans heure : midi pour le comparateur du modèle et la cinétique, minuit pour les journaux de sommeil, d'activité et de moments à soi, la chaîne vide pour le fil de toutes les entrées — où l'entrée sans heure passe après celles de son jour qui en portent une.

Une heure vide (chaîne vide) se comporte comme une heure absente : le repli s'applique à la valeur fausse, pas à la seule absence.

Un réveil antérieur ou égal à l'endormissement rend une durée de zéro : aucun passage de minuit n'est deviné dans la durée d'une nuit. Le temps d'éveil, lui, en devine un.

Le temps d'éveil est absent quand son résultat n'est pas strictement positif — siestes plus longues que le temps disponible, données incohérentes.

Une date de départ postérieure à aujourd'hui rend un rang de semaine absent, jamais un rang négatif ou nul ; une date de départ illisible aussi.

Quatre méthodes de recul coexistent ; seule celle par millisecondes se décale d'un jour quand un changement d'heure tombe dans l'intervalle et que l'instant courant est à moins d'une heure de minuit.

Les quatre fenêtres réglables à durée fixe n'ont pas de borne haute : une entrée datée du futur y est retenue, sauf si le calcul applique en plus « déjà survenu ». Trois fenêtres fixes en posent une : les moyennes de repas sur sept jours, le fil de toutes les entrées, l'étendue d'une série poids-traitement.

Une comparaison de deux moitiés sur une série de moins de deux journées est absente ; sur une série impaire, les deux moitiés n'ont pas la même longueur.

Rien ne se recalcule au passage de minuit : « aujourd'hui » est lu sur l'instant de référence à chaque calcul, pas à intervalle régulier.

Une année bissextile et une fin de mois ne sont l'objet d'aucune règle de divisibilité : la normalisation du triplet et le « jour 0 du mois suivant » les traitent seuls.

## 5. Les capacités

Ce chapitre énumère ce qu'une personne peut faire des données décrites au chapitre précédent : pour chaque verbe, ses préconditions, ce qu'il écrit, et ce qui le fait refuser. Il est rangé par domaine de relevé ; les règles d'écriture communes à tous les domaines sont posées une fois, en tête.

### Ce qu'une capacité engage

Une capacité est un verbe qui lit l'état des données, juge une saisie, et écrit ou refuse d'écrire. Elle ne rend jamais un résultat partiel : ou bien tout l'effet a lieu, ou bien rien n'est écrit et un refus est formulé. Les refus sont de quatre natures — hors bornes, journée pleine, unicité violée, cohérence temporelle violée — et aucune n'existe pour juger le corps de qui que ce soit : les bornes n'écartent que l'absurde.

| Règle d'écriture | Portée |
| --- | --- |
| Toute heure retenue est ramenée à la plus grande valeur de {0, 10, 15, 20, 30, 40, 45, 50} minutes inférieure ou égale à la minute donnée. | Toutes les capacités qui écrivent une heure, y compris les heures de rappel. La règle s'applique à la valeur *enregistrée*, pas seulement à celle qui est proposée. |
| Tout poids écrit est arrondi au dixième de kilogramme. | Pesée, poids de départ, poids visé. |
| Une date est un jour local `AAAA-MM-JJ`, une heure un `HH:MM` local. Fuseau et langue sont indépendants. | Toutes. |
| Une suppression retire la ligne de la sauvegarde. Il n'y a pas de suppression logique : rien ne subsiste marqué supprimé. | Toutes. |
| Une modification fusionne : une grandeur absente de la charge conserve sa valeur d'avant. | Tous les journaux. |
| Une valeur absente reste absente. Elle ne devient jamais zéro, ni une moyenne, ni un repli. | Mensurations, notes, distance, valeurs nutritionnelles inconnues. |
| Rien de ce que la personne consigne ne quitte l'appareil sans un geste explicite de sa part. | Toutes. Les seuls envois sont ceux du chapitre « Les retours », et le document médical, qui est remis à la personne et non transmis. |

Chaque journal borne le nombre de lignes qu'une même journée peut porter. Le plafond compte les lignes *réellement présentes* à la *date visée* — pas au jour courant : consigner trois journées de retard reste possible. Deux régimes coexistent, et c'est le seul endroit du produit où le même mot recouvre deux comportements opposés.

| Journal | Plafond par date | Au plafond |
| --- | --- | --- |
| Prises de traitement | 2 | La dernière ligne de cette date est remplacée par la nouvelle, en gardant son identité. |
| Ressentis | 15 | Remplacement de la dernière ligne de la date. |
| Séances d'activité physique | 15 | Remplacement de la dernière ligne de la date. |
| Moments pour soi | 15 | Remplacement de la dernière ligne de la date. |
| Sommeils | 15 | Refus. Rien n'est écrit, rien n'est perdu. |
| Prises alimentaires | 30 | Refus, et le refus invite à choisir une autre date. |
| Aliments personnels créés | 50 | Refus. |
| Recettes créées | 20 | Refus. Quota indépendant du précédent. |
| Menus favoris créés | 50 | Refus. |
| Envois de retour | 10 | Refus. |
| Pesées | 1 | La pesée du jour est mise à jour, jamais doublée. Voir « Les pesées ». |

```
ajouter(journal, ligne, plafond) :
  duJour = journal filtré sur ligne.date
  si |duJour| < plafond           → ajouter ligne
  sinon si régime = refus         → ne rien écrire, formuler le refus
  sinon                           → remplacer la dernière ligne de duJour par ligne
```

Quatre journaux remplacent, six refusent. L'invariant énoncé pour le produit est que rien ne détruit une donnée hors une destruction demandée et confirmée : les quatre remplacements sont l'écart à cet invariant, non la règle. **[arbitrage non validé]** Ce document propose de les aligner sur le refus.

**Cas limites**

Une suppression rend sa place au décompte du jour : le plafond ne mémorise rien, il compte.

Les quotas de création (aliments, recettes, menus) ne comptent que les entrées qui portent un instant de création ; une entrée antérieure à l'apparition de cet instant ne consomme aucun quota.

Modifier une entrée ne consomme jamais de quota de création.

Déplacer une ligne vers une autre date, c'est l'ajouter à cette date : le plafond de la date visée s'applique.

### Le compte et la session

Un compte identifie la personne auprès du service qui reçoit ses retours et qui, seul, peut supprimer son identité. Il ne détient aucune donnée de santé.

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Ouvrir une session | Une adresse et un secret, tous deux non vides après rognage ; ou un fournisseur d'identité tiers. | La session est mémorisée jusqu'à sa fermeture. | Adresse ou secret vide : refusé sans tentative distante. Identifiants inconnus, adresse mal formée, compte désactivé, trop de tentatives, réseau injoignable : refusés, chacun avec sa cause. |
| Ouvrir un compte **[V2]** | Un prénom, une adresse, un secret. Le secret fait huit signes au moins — *seule* contrainte : ni majuscule, ni chiffre, ni signe particulier n'est imposé. Un secret vide n'empêche pas d'entrer. | Le compte est ouvert au terme du recueil initial. | Un secret commencé mais plus court que huit signes bloque l'entrée. |
| Fermer la session | Une session ouverte. | La session tombe. Aucune donnée n'est touchée. | — |
| Supprimer le compte et toutes les données | Une confirmation explicite, distincte du geste qui ouvre la capacité. | Dans cet ordre : le compte distant est supprimé, puis l'intégralité du stockage local est effacée. Le second geste ne part que si le premier a réussi. | Si la suppression distante échoue, *rien n'est effacé* et l'échec le dit. Une session trop ancienne exige d'en rouvrir une avant de recommencer. |
| Attester avoir pris connaissance de l'avertissement médical | Une attestation explicite. | Un marqueur booléen persistant est posé, une fois pour toutes. | Tant qu'il n'est pas posé, aucune autre capacité n'est atteignable. |

**Cas limites**

Quand aucun service d'authentification n'est configuré, le verrou ne mord pas : tout est atteignable sans session, et rien ne part.

L'effacement local emporte la session avec le reste : il n'y a pas de déconnexion à faire ensuite.

Il n'existe aucune capacité de récupérer un secret oublié, ni d'ouvrir un compte, depuis la session de connexion de la V1.

### Qui l'on est

Le profil porte ce qui ne se relève pas : l'identité, le corps de référence et l'objectif. Chacune de ces grandeurs se modifie à tout moment, indépendamment des autres.

| Grandeur | Type et bornes | Refus |
| --- | --- | --- |
| Prénom ou pseudonyme | Texte, non vide après rognage. | Vide ou uniquement des espaces. |
| Âge | Entier, 1 à 130 ans. | Hors bornes, illisible, vide. |
| Année de naissance **[V2]** | Entier. Les bornes sont celles de l'âge rapportées à l'année en cours : de `année − 130` à `année − 1`. Défaut 1980. L'année en cours est passée par l'appelant ; le domaine ne lit pas l'horloge. | Hors bornes. |
| Taille | Entier, 50 à 300 cm. Toujours stockée en centimètres ; convertie à la lecture et à la saisie selon le système d'unités (fourchette en pouces : 20 à 118). | Hors bornes. |
| Genre | Femme, homme, ou neutre. | — |
| Poids visé | Nombre strictement positif, arrondi au dixième de kilogramme. | Vide, illisible, nul ou négatif, au-delà de 1 000 kg. |

L'avatar est une composition, non un choix dans une galerie : forme du visage, teinte de peau, teinte des yeux, coiffure, teinte des cheveux, présence de lunettes, expression. **Le genre est une dimension de l'avatar** : il se voit, et le choisir aligne le genre du profil. Le modifier retient une coiffure de départ propre à chaque genre.

La V1 permet en outre d'attacher une photographie et de tirer un avatar au hasard. La V2 supprime les deux. **[V2]**

**Cas limites**

Photographie (V1) : le type est jugé avant le poids ; cinq types d'image sont acceptés ; au-delà de 12 Mio le fichier est refusé sans être lu. L'image retenue est recadrée au carré centré, réduite à 256 pixels de côté au plus — jamais agrandie —, puis réencodée à qualité décroissante (0,82 ; 0,70 ; 0,55) jusqu'à tenir sous 300 Kio ; si les trois tentatives échouent, la photographie est refusée. Toute retouche de l'avatar dessiné efface la photographie.

La V1 dérive le genre du profil de celui de l'avatar : c'est le seul endroit où il se choisit.

Le système d'unités décide de l'unité de saisie et de lecture, jamais de l'unité de stockage. Le stockage est métrique sans exception (kg, cm, g, ml) et ne porte aucune étiquette d'unité. La langue apporte un système par défaut, rechoisissable aussitôt.

Le séparateur décimal de saisie suit la langue ; la forme stockée porte toujours un point.

> **Exemple.**
>
> Camille est née en 1978 et mesure 168 cm. En système impérial, la même taille se lit 66 pouces et se ressaisit dans cette unité ; la valeur stockée reste 168.

### Ce que l'on suit

Sept domaines de relevé s'allument et s'éteignent indépendamment : l'alimentation, les pas, l'activité physique, le temps pour soi, le sommeil, le traitement, les ressentis. Deux drapeaux par domaine : *actif* et *masqué*.

| Capacité | Précondition | Effet |
| --- | --- | --- |
| Activer ou désactiver un domaine | Aucune. | Le drapeau d'activité est inversé. Rallumer un domaine remet son drapeau de masquage à faux — un domaine actif ne peut pas être masqué. |
| Masquer un domaine | Le domaine est éteint. | Le drapeau de masquage est posé. Le domaine cesse d'être proposé nulle part. |

En l'absence de valeur enregistrée, le traitement et les ressentis sont actifs ; l'alimentation, les pas, l'activité physique, le temps pour soi et le sommeil sont éteints. **Éteindre un domaine ne détruit rien** : ses relevés restent, cessent d'être proposés à la saisie et sortent des décomptes transversaux. Le rallumer les y ramène tels quels.

**Cas limites**

V1 : viser le domaine des pas ou celui de l'activité physique l'allume automatiquement ; le sommeil, le temps pour soi, l'alimentation ne s'allument jamais d'eux-mêmes.

Un domaine sans drapeau déclaré est réputé actif.

Le document médical ne propose une rubrique que si son domaine est actif *et* porte au moins une donnée sur la période.

### Le traitement déclaré

Le profil porte l'identifiant d'un traitement, jamais son nom. Le catalogue est fermé et chaque forme s'y termine par une entrée « Autre » : la liste des spécialités bouge plus vite qu'une application, il faut pouvoir répondre quand la sienne n'y est pas. Un identifiant absent ou inconnu vaut « aucun traitement ».

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Déclarer ou changer son traitement | L'identifiant appartient au catalogue. | Le profil porte le nouvel identifiant. **Les prises déjà consignées gardent le leur** : changer de traitement n'en réécrit aucune. | Un identifiant hors catalogue n'est pas atteignable : le traitement se choisit, il ne se saisit pas. |
| Attester d'un essai clinique (V1) | La spécialité choisie porte le drapeau correspondant — une seule le porte. | Sans l'attestation, le choix n'est pas écrit. Elle n'est pas redemandée quand la spécialité choisie est déjà celle du profil. | Attestation absente. |

Le catalogue de la V1 porte, pour chacune des treize spécialités, une forme (injectable ou orale), une molécule, des paliers de dose et des paramètres de cinétique. **Celui de la V2 ne porte que le nom et la forme** — aucune posologie, aucune cinétique : l'application demande ce qu'on prend, elle ne dit pas quoi prendre. **[V2]** Le drapeau d'essai clinique n'y existe pas non plus.

**Cas limites**

Conversion : à la lecture d'une sauvegarde, tout libellé historique est ramené à un identifiant. Un libellé inconnu retombe sur l'entrée « Autre » de la famille qu'il évoque, et sur « aucun traitement » quand il en dit l'absence. La conversion s'applique au profil comme à chaque prise.

La forme se lit sur la fiche du catalogue, jamais sur le nom : c'est elle qui décide du mot employé pour une prise et de la zone par défaut.

Une prise sans identifiant de traitement est réputée relever du traitement du profil.

### Les prises de traitement

Une prise consigne le fait d'avoir pris son traitement à un instant. Elle vaut pour les deux formes : injection ou comprimé.

| Grandeur | Type | Bornes et défaut |
| --- | --- | --- |
| Date | Jour local | Obligatoire. Proposée : aujourd'hui. |
| Heure | `HH:MM` local | Obligatoire. Proposée : maintenant, ramené à la minute ronde inférieure. |
| Dose | Nombre, en milligrammes | 0,001 ≤ dose ≤ 1 000 000, trois décimales au plus. Proposée : le premier palier de la spécialité. |
| Zone | Une valeur close : abdomen gauche, abdomen droit, cuisse gauche, cuisse droite, bras gauche, bras droit, voie orale | Obligatoire. « Voie orale » pour une forme orale ; sinon une zone proposée par rotation. |
| Notes | Texte facultatif | Vide après rognage vaut absente. |
| Traitement | Identifiant du catalogue | Écrit depuis le profil au moment de l'écriture — à l'ajout *comme* à la modification. |

**Consigner une prise.** Préconditions : une date non vide, et une dose qui est un nombre fini strictement positif dans les bornes. Effet : une ligne à la date visée, sous le plafond de deux par jour. Une dose vide, illisible, nulle, négative ou hors bornes est refusée d'un seul message, effacé dès que la dose est retouchée.

**Se voir proposer une zone.** La zone proposée est tirée au sort parmi celles qui ne sont ni la zone de la prise passée la plus proche, ni celle de la prise future la plus proche ; s'il n'en reste aucune, toutes redeviennent candidates. Retenir malgré tout la zone de la dernière prise n'est pas refusé : c'est signalé, et le signalement se tait dès qu'on change de zone. Cette capacité introduit du hasard dans une écriture : deux ouvertures successives ne proposent pas la même zone.

**Modifier une prise.** Dose, zone, date, heure et notes. Rien n'est écrit si aucune de ces grandeurs n'a changé, ni si la dose est illisible ou négative, ni si la date est vide.

**Supprimer une prise**, ou **vider le journal des prises** — ce second geste exige une confirmation explicite et ne préserve rien.

**Cas limites**

Une prise peut être datée dans le futur : rien ne l'interdit. Les décomptes de la cure en cours l'écartent ; la lecture du journal ne l'écarte pas.

Une prise dont l'heure manque est ordonnée comme s'il était midi.

Le plafond de deux par jour vaut par date visée ; consigner une troisième prise sur une journée déjà pleine remplace la dernière ligne de cette journée.

La V1 tient un journal des prises par personne, non par traitement : les prises d'un traitement abandonné restent, avec leur identifiant d'origine.

> **Exemple.**
>
> Camille, sous Ozempic, consigne 0,25 mg le 12 mai 2026. Elle valide à 8 h 37 : l'heure retenue est 08:30. Sa prise précédente était en abdomen gauche ; la zone proposée est tirée parmi cuisse gauche, cuisse droite, bras gauche et bras droit.

### Les pesées

Une pesée porte une date, une heure, un poids en kilogrammes et, facultativement, neuf mensurations. L'une d'elles porte un drapeau : c'est la pesée de départ, référence de toute perte et de toute progression.

**Deux invariants gouvernent ce journal.**

```
1. Au plus une pesée par jour.
2. La pesée de départ est la plus ancienne.
   Après CHAQUE écriture : si la ligne marquée n'est ni la plus ancienne
   ni datée du même jour qu'elle, le drapeau est réécrit sur toute la
   liste — vrai sur la plus ancienne, faux ailleurs.
   Un historique sans marque, ou qui en porterait deux, se répare là.
   À date égale, la marque en place ne change pas de main.
```

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Enregistrer une pesée | Poids entre 0,1 et 1 000 kg, une décimale. Date non vide. | Poids arrondi au dixième, heure ramenée à la minute ronde, ligne insérée à sa place chronologique, puis les deux invariants sont rétablis. | Poids hors bornes, vide ou illisible. |
| Enregistrer une pesée sur un jour déjà pris | Une confirmation explicite, après annonce du remplacement. | La ligne du jour est *mise à jour* : elle garde son identité, son drapeau de départ, et **toute mensuration que la nouvelle saisie ne renseigne pas**. Se repeser le soir sans ressortir le mètre ne perd pas les mesures du matin. | Sans confirmation, rien n'est écrit. |
| Modifier une pesée | Poids dans les bornes ; date non vide ; au moins une grandeur changée. | Fusion dans la ligne visée, puis rétablissement des invariants. | Déplacer une pesée sur un jour déjà occupé est refusé, la date revenant à sa valeur d'avant. Dater la pesée de départ après une autre pesée est refusé. |
| Supprimer une pesée | La pesée n'est pas celle de départ. | Retrait franc. | La pesée de départ ne se supprime pas. |
| Vider le journal des pesées | Confirmation explicite. | Toutes les pesées sont retirées *sauf* celle de départ. | — |
| Modifier le poids de départ directement | Poids dans les bornes. | Seul le poids de la ligne marquée change. Sa date et ses mensurations ne sont jamais touchées. Si aucune ligne n'est marquée, elle est créée à la veille de la plus ancienne pesée — ou d'hier sur un historique vide — à 08:00. | Hors bornes. |
| Fixer le poids visé | Nombre strictement positif. | Le profil le porte, arrondi au dixième. | Vide, nul, négatif. |

**Le poids visé n'est jamais lié au poids courant.** Ce sont deux grandeurs indépendantes : elles peuvent partir de la même valeur, elles ne se recopient jamais l'une dans l'autre, dans aucun sens. **[V2]**

**Les mensurations.** Neuf grandeurs facultatives en centimètres, attachées à une pesée : poitrine, taille, hanches, bras, sous-poitrine, fesses, cuisses, genoux, mollets. Chacune vaut entre 1 et 300 cm, une décimale, et le vide est permis — *vide n'est pas zéro*. Une mensuration ne s'efface qu'en la vidant explicitement sur la pesée qui la porte.

En V2, le poids ne se saisit plus librement : il se choisit dans une liste bornée à 999 kg en métrique et 2 000 lb en impérial — deux plafonds ronds, choisis chacun dans son unité, et non la conversion l'un de l'autre. **Il n'y a donc plus de valeur incorrecte à refuser : il n'y en a plus d'atteignable.** **[V2]**

**Cas limites**

La pesée de départ se reconnaît à son drapeau, jamais à sa valeur : repasser par son poids de départ, ou le dépasser, ne fait d'aucune pesée un départ.

Modifier une pesée ne réordonne pas la sauvegarde ; l'ordre qui compte est celui des dates portées, jamais l'ordre d'enregistrement.

Une antidatation qui place une pesée avant le départ lui donne le départ. Le refus symétrique — dater le départ après une autre pesée — dit la même chose de l'autre côté.

Quand plusieurs pesées existent le même jour dans une sauvegarde ancienne, les calculs retiennent la plus tardive.

Sur un historique vide, la première pesée écrite devient le départ : elle est la plus ancienne puisqu'elle est la seule.

> **Exemple.**
>
> Camille part de 96,0 kg le 4 mai 2026. Le 20 mai, elle retrouve un relevé du 3 mai à 96,4 kg et le consigne : la pesée du 3 mai devient le poids de départ, celle du 4 mai perd le drapeau, et toutes les pertes se recomptent depuis 96,4 kg.

### Les prises alimentaires

Une prise alimentaire est un repas ou un en-cas : une composition d'aliments, un instant, et deux notes de faim. **Ses valeurs nutritionnelles ne se saisissent pas** : elles se calculent de la composition à chaque écriture.

| Grandeur | Type | Bornes et défaut |
| --- | --- | --- |
| Date | Jour local | Obligatoire. Proposée : aujourd'hui. |
| Heure | `HH:MM` | Obligatoire, ramenée à la minute ronde inférieure. |
| Famille | Repas ou en-cas | Obligatoire. Les six valeurs historiques (petit-déjeuner, déjeuner, dîner, en-cas…) retombent sur ces deux familles. |
| Composition | Liste ordonnée de couples { référence d'aliment, quantité } | Au moins un couple. Quantité en grammes pour un solide, millilitres pour un liquide ; 1 ≤ q ≤ 10 000, une décimale ; proposée à 100. |
| Faim avant | Entier 0 à 5 | Proposée à 2. |
| Faim après | Entier 0 à 5 | Proposée à 0. |
| Énergie, protéines, glucides, lipides, fibres | Cinq nombres | Calculés, jamais saisis. Les fibres vont toujours avec les quatre autres : elles ne sont jamais omises. |

```
apport(quantité) = valeur_pour_100 × quantité / 100
apport(composition) = Σ apport(quantité) sur les lignes qui se résolvent
  — une ligne dont l'aliment n'existe plus est IGNORÉE, pas comptée à zéro.
```

**Consigner une prise.** Préconditions : au moins une ligne de composition, et chaque ligne référence un aliment existant — du catalogue ou de la bibliothèque personnelle. Un nom saisi sans référence choisie est refusé nommément. Une composition vide est refusée. Le plafond de trente par date visée refuse aussi, sans rien écraser.

**Modifier une prise.** Composition, famille, date, heure, faim. Les cinq valeurs sont recalculées, l'heure re-arrondie. Déplacer une prise vers une date déjà pleine est refusé et la prise reste à sa date d'origine.

**Retirer une ligne de composition.** Retirer la dernière supprime la prise : une prise porte toujours au moins un aliment.

**Supprimer une prise**, ou **vider le journal** après confirmation explicite.

**Cas limites**

Une prise alimentaire est en-cas ou repas ; il n'y a pas de troisième famille, et un type inconnu vaut en-cas.

Les cinq valeurs restent inscrites sur la prise bien qu'elles soient dérivables de sa composition : c'est un reste de conversion, contraire à la règle « rien de dérivable n'est stocké ». Le recalcul systématique à l'écriture empêche les deux de diverger.

Une sauvegarde antérieure à la conversion — une prise sans composition — est écartée au chargement : elle n'est ni réparable ni comptable.

Une prise dont la faim manque reçoit deux valeurs déduites de manière déterministe, pour que la même sauvegarde donne toujours le même résultat.

> **Exemple.**
>
> Camille consigne 60 g de pain complet et 250 ml de lait à 8 h 12 le 12 mai. L'heure retenue est 08:10. Les cinq valeurs sont calculées ; si l'aliment personnel « lait de mon fromager » est supprimé plus tard, la ligne cesse de compter — elle n'est pas comptée à zéro.

### La bibliothèque d'aliments et les menus

Trois référentiels servent à composer une prise : un catalogue fermé d'aliments de référence, une bibliothèque personnelle, et une collection de menus favoris. Le catalogue ne se modifie ni ne se supprime.

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Créer un aliment personnel | Nom non vide et unique après normalisation — rognage, casse et accents ignorés — contre le catalogue *et* la bibliothèque personnelle. Cinq valeurs pour 100 g ou 100 ml, chacune entre 0 et 10 000, une décimale, le vide permis. Une nature : solide ou liquide. | Une entrée nouvelle, portant son instant de création. Une valeur laissée vide vaut zéro à l'écriture — zéro est une réponse juste : l'eau n'a pas de calories. | Nom vide, nom déjà pris, valeur hors bornes. Cinquantième création du jour dépassée : refus. |
| Modifier un aliment personnel | Mêmes règles, l'entrée modifiée exclue du contrôle d'unicité. | L'instant de création est conservé. | Aucun quota consommé. |
| Supprimer un aliment personnel | Aucune recette ne l'emploie comme ingrédient. | Retrait franc. Les prises qui le référençaient cessent de le compter. | Refusé s'il est ingrédient : le refus nomme les recettes concernées. |
| Créer ou modifier une recette | Nom unique (même règle), au moins un ingrédient, tous référencés. | Une recette est un aliment personnel qui porte sa composition. Ses valeurs pour 100 g sont calculées puis arrondies à l'entier. | Vingtième création du jour dépassée : refus. Quota indépendant de celui des aliments. |
| Retrouver un aliment par son code-barres | Un code non vide. | Trois recherches, dans l'ordre : la bibliothèque personnelle — l'entrée s'ouvre en modification ; puis le catalogue ; puis un service distant. Ce qui revient préremplit une création. | Code vide. Service injoignable, service en défaut, réponse illisible : chacun a sa cause, et la saisie à la main reste ouverte. |
| Créer un menu favori | Un titre non vide et unique après normalisation ; une composition. | Une entrée portant titre, famille et composition — *ni date, ni heure, ni faim*. Les lignes sont recopiées avec de nouvelles identités. | Titre vide ou déjà pris ; cinquantième création du jour dépassée. |
| Reprendre un menu favori | — | Sa composition et sa famille sont *copiées* dans une prise en cours. Aucun lien n'est créé : modifier le menu plus tard ne touche à aucune prise. | — |

```
valeurs_pour_100(recette) :
  masse = Σ quantités des ingrédients
  si masse ≤ 0 → les cinq valeurs valent 0
  sinon        → valeur = apport_total × 100 / masse, arrondi à l'entier
```

Une prise dont la composition est *identique* à celle d'un menu — même longueur, mêmes références aux mêmes rangs, mêmes quantités, l'ordre compris — est reconnue comme relevant de ce menu. La famille n'entre pas dans la comparaison.

La lecture d'un code-barres par l'appareil photo n'existe pas : le code se saisit. **[non implémenté]** Un vrai lecteur, avec la saisie à la main en repli et chaque échec journalisé anonymement, est décidé pour la conversion en application native.

**Cas limites**

Une valeur venue du service distant n'est retenue que si elle est un nombre fini, positif ou nul, et sous sa borne de vraisemblance (900 kcal, 100 g pour 100 g). Sinon elle est *laissée absente*, jamais rabattue sur la borne. Une fiche sans nom ni aucune valeur est traitée comme inconnue et n'ouvre qu'une création vierge nommée d'après le code.

Le nom d'un aliment personnel se compte pour l'unicité même quand l'entrée est une recette : les deux natures partagent l'espace des noms.

Une recette antérieure à la conversion — dont les ingrédients étaient du texte — se rouvre avec une composition vide.

Chaque aliment retenu dans une écriture incrémente un compteur d'usage attaché à son libellé officiel. Ce compteur ne sert qu'à ordonner les propositions ; il n'entre dans aucun calcul nutritionnel.

### Les ressentis

Un ressenti déclare un effet indésirable à un instant, avec son intensité. Rien n'y est interprété : l'application enregistre ce que la personne dit, et ne produit aucun avis.

| Grandeur | Type | Bornes et défaut |
| --- | --- | --- |
| Type | Une valeur de la liste de référence restreinte | Obligatoire, non vide. |
| Intensité | Entier | 0 à 5. Proposée à 0. |
| Date, heure | Jour local, `HH:MM` | Obligatoires. Proposées : maintenant, minute ronde inférieure. |
| Note | Texte facultatif | 280 signes au plus. Vide après rognage vaut absente ; le texte lui-même n'est pas rogné. |

**Déclarer un ressenti.** Rien n'est écrit si le type est vide, ou si la date ou l'heure manque. Effet : une ligne à la date visée, sous un plafond de quinze par jour — au-delà, la dernière ligne de la journée est remplacée.

**Modifier un ressenti** : type, intensité, date, heure, note. Rien n'est écrit si aucune grandeur n'a changé. **Supprimer un ressenti.** **Vider le journal**, après confirmation explicite.

**Cas limites**

Selon le chemin de modification, l'intensité acceptée va de 1 à 5 ou de 0 à 5. La liste de référence, elle, va de 0 à 5. Cet écart est un défaut du code, non une règle.

Un ressenti dont le type ne fait plus partie de la liste active reste lisible et modifiable : le type est réintroduit dans le choix tant qu'il est celui de la ligne travaillée.

Comme pour les prises, l'ordre qui compte est celui des dates et heures portées ; une heure absente est lue comme midi.

### L'activité physique

Une séance porte une activité, une durée, une intensité ressentie et, pour certaines activités, une distance. La distance et l'intensité ne comptent jamais ensemble.

| Grandeur | Type | Bornes et défaut |
| --- | --- | --- |
| Activité | Une valeur de la liste de référence restreinte | Obligatoire. Chaque activité porte un coût métabolique de référence. |
| Durée | Entier, en minutes | 1 à 480. Proposée à 30. |
| Étages | Entier | 1 à 480, *à la place* de la durée pour la montée d'escaliers — la seule activité dont l'effort ne se compte pas en minutes. Proposé à 5. |
| Intensité | Douce, modérée ou intensive | Proposée à douce. |
| Distance | Nombre, canonique en mètres | Facultative, offerte aux seules huit activités où elle a un sens. Saisie en kilomètres (0,1 à 1 000) ou en mètres (10 à 100 000) selon l'activité ; convertie et arrondie au mètre ; sous un mètre, absente. |
| Date, heure | Jour local, `HH:MM` | Obligatoires, heure ramenée à la minute ronde. |

**Consigner une séance.** Préconditions : une durée entière strictement positive dans les bornes ; une distance, si elle est saisie, dans les bornes de son unité. Une durée hors bornes et une distance hors bornes sont refusées, chacune avec sa cause, et les refus s'effacent dès que la grandeur fautive est retouchée. Changer d'activité efface les deux refus, remet la durée à sa proposition et vide la distance. Plafond : quinze par date, avec remplacement.

**Invariant.** Une distance renseignée écarte l'intensité du calcul de la dépense — l'effort se lit alors sur l'allure. Effacer la distance ramène l'intensité à « douce ». Une distance ne s'ajoute pas depuis la ligne du journal : elle s'y modifie seulement.

**Modifier**, **supprimer** une séance, **vider le journal** après confirmation.

**Cas limites**

Si l'activité change dans le même geste qu'une modification, la distance est conservée quand la nouvelle activité l'accepte, supprimée sinon.

Une durée non entière ou nulle n'écrit rien, en silence, sans refus formulé.

Une activité hors du catalogue reçoit un coût métabolique de repli ; le catalogue n'est pas extensible par la personne.

Après une séance *nouvelle* — jamais après une modification —, une phrase d'encouragement est tirée parmi huit, sans répéter la précédente.

### Le sommeil

Un sommeil est une *plage* : deux instants complets, jour et heure d'endormissement, jour et heure de réveil. La date de la ligne est celle du réveil. **La durée n'est jamais stockée** — les deux instants sont la source de vérité, et une durée écrite à côté d'eux finirait par les contredire.

```
durée = instant(réveil) − instant(endormissement)  si réveil > endormissement
      = 0                                          sinon

recouvrement(a, b) = début(a) < fin(b) ET début(b) < fin(a)
  — bout à bout permis : une sieste qui commence à l'instant où la nuit finit passe.
```

| Grandeur | Type | Bornes et défaut |
| --- | --- | --- |
| Nature | Nuit ou sieste | Obligatoire. |
| Endormissement | Jour local + `HH:MM` | Écrits tous deux, jamais déduits. Nuit : la veille à 23:00. Sieste : le jour même à 14:00. |
| Réveil | Jour local + `HH:MM` | Nuit : 07:00. Sieste : 15:00. |
| Qualité | Entier 0 à 5 | Proposée à 3. |

**Consigner un sommeil.** Trois jugements se succèdent, dans cet ordre.

1. **Durée nulle : refus.** Un réveil antérieur ou égal à l'endormissement n'est pas une plage. Rien n'est écrit.
2. **Durée au-delà de douze heures strictes : question, pas refus.** Une première validation ne fait qu'interroger ; une seconde écrit. Toute retouche d'un instant ou de la nature désarme la question. Douze heures pile ne la déclenchent pas.
3. **Recouvrement : refus.** Deux sommeils ne peuvent pas se recouvrir. Le refus nomme la plage en conflit et dit que rien n'a été enregistré. En modification, une plage inchangée n'est pas contrôlée.

Le plafond est de quinze par date de réveil, et il **refuse** : rien n'est écrasé. Les *deux* heures sont ramenées aux minutes rondes, à l'ajout comme à la modification.

**Modifier un sommeil.** En place, déplacer la date du réveil déplace celle de l'endormissement du même nombre de jours : l'écart entre les deux bords est conservé. Une durée devenue nulle abandonne la modification en silence ; un recouvrement la refuse et la ligne garde ses valeurs d'avant.

**Supprimer un sommeil**, **vider le journal** après confirmation.

**Cas limites**

Une date ou une heure illisible donne une durée nulle : c'est aux préconditions de la refuser, pas au calcul de la deviner.

Changer de nature ne déplace les instants que s'ils sont encore ceux proposés pour l'ancienne nature.

Rien ne distingue une qualité de 3 choisie d'une qualité laissée telle quelle. Les qualités déjà enregistrées à 0 restent ambiguës pour toujours : les réécrire détruirait de la donnée, y compris de vrais zéros.

> **Exemple.**
>
> Camille s'endort le 11 mai à 22 h 47 et se réveille le 12 à 6 h 52. Les instants retenus sont 22:45 et 06:50 ; la durée vaut 8 h 05 ; la ligne est datée du 12 mai. Une sieste du 12 mai de 6 h 30 à 7 h 00 serait refusée : elle recoupe cette nuit.

### Le temps pour soi

Un moment pour soi est le décalque d'une séance d'activité physique, sans intensité ni distance : une activité prise dans une liste de référence restreinte, une durée entière de 1 à 480 minutes, une date et une heure aux minutes rondes.

**Consigner, modifier, supprimer un moment**, **vider le journal** : mêmes préconditions et mêmes effets que pour une séance, plafond de quinze par date avec remplacement. Une durée non entière ou nulle n'écrit rien, en silence.

### Les pas

Un relevé de pas porte une date et un nombre de pas. Il n'a pas d'heure. **Plusieurs relevés d'une même date s'additionnent** : il n'y a pas d'unicité par jour, et aucun plafond quotidien.

**La V1 n'offre aucune capacité de consigner un relevé de pas.** **[non implémenté]** Le geste existe dans le modèle mais n'est relié à rien : le journal ne se remplit que par génération de données. Ce qui est décidé pour la V2 est le podomètre réel du téléphone, à la conversion en application native.

| Capacité | Précondition | Effet |
| --- | --- | --- |
| Modifier un relevé | — | Fusion dans la ligne visée. |
| Supprimer un relevé | — | Retrait franc. |
| Vider le journal des pas | Confirmation explicite. | Le journal devient vide. |
| Fixer la date depuis laquelle le cumul se compte | Un jour local. | La date est persistée et gouverne le cumul et les moyennes par jour. À défaut, le cumul part du plus ancien relevé. |

L'objectif quotidien de pas vaut 8 000 et **ne se règle pas** : c'est la seule des quatre grandeurs à objectif qui ne soit pas réglable.

### Les listes de référence

Trois catalogues fermés dont la personne choisit le sous-ensemble qui lui sera proposé : les types de ressenti, les activités physiques, les activités de temps pour soi. Le catalogue lui-même ne s'étend pas.

| Liste | Taille du catalogue | Retenus par défaut |
| --- | --- | --- |
| Types de ressenti | 36 | 12 |
| Activités physiques | 54 | 7 |
| Activités de temps pour soi | 9 | 6 |

**Restreindre une liste.** Préconditions : au moins un élément retenu — une sélection vide est refusée. Effet : le sous-ensemble remplace la liste active, trié, et est persisté. Les gestes disponibles sont : retenir, écarter, filtrer par le nom, tout retenir ou tout écarter parmi ce que le filtre laisse.

**Invariants.** Restreindre ne touche à aucun relevé déjà consigné. Une valeur enregistrée qui n'appartient plus au catalogue est écartée à la lecture ; une liste devenue vide retombe sur le défaut. Si l'élément d'un relevé en cours de modification n'est plus actif, il est réintroduit dans le choix pour ce relevé-là.

### Les objectifs quotidiens

Quatre grandeurs se comparent chaque jour à un objectif ; trois se règlent, une ne se règle pas.

| Grandeur | Réglable | Valeur en l'absence de réglage |
| --- | --- | --- |
| Énergie | Oui, en kilocalories | 1 400 kcal |
| Protéines | Oui, en grammes | `arrondi(poids courant × 1,5)` g — l'objectif suit donc le poids |
| Fibres | Oui, en grammes | 25 g |
| Pas | Non | 8 000 |

Le franchissement d'un objectif de protéines ou de fibres est **constaté une seule fois par jour local et par nutriment**. Les deux sont évalués indépendamment. La mémoire de ce constat est datée et périme d'elle-même au changement de jour.

### Les rappels

Deux rappels se règlent. **[non implémenté]** Leur réglage est enregistré ; **rien ne les déclenche**. De vraies notifications du téléphone sont décidées pour la conversion en application native.

| Rappel | Grandeurs | Valeurs en l'absence de réglage |
| --- | --- | --- |
| Prise de traitement | Actif ou non. Deux régimes : *hebdomadaire* — un jour de semaine (0 dimanche à 6 samedi) et une heure ; ou *périodique* — tous les N jours avec 1 ≤ N ≤ 30, une date de départ et une heure. | Inactif ; hebdomadaire ; dimanche ; 20:00 ; N = 7 ; départ aujourd'hui. |
| Rendez-vous | Actif ou non ; nom du praticien (texte libre) ; date ; heure ; préavis parmi une heure, deux heures, un jour, deux jours, trois jours, sept jours. | Inactif ; nom vide ; date vide ; 10:00 ; un jour. |

Toute heure de rappel est ramenée aux minutes rondes à l'écriture, comme toute heure retenue par le produit.

### Les fenêtres d'observation

Capacité transversale : borner dans le temps ce que l'on regarde. Elle n'écrit aucune donnée de santé — seulement une préférence.

| Fenêtre | Définition |
| --- | --- |
| 7, 14, 30, 90 derniers jours | Inclusive du jour courant : la coupure vaut `aujourd'hui − (n − 1)`. « 7 derniers jours » contient donc aujourd'hui et les six jours précédents. |
| Depuis le début | Aucune coupure. |
| Bornes libres | Deux jours locaux, chacun facultatif. Une borne absente est illimitée de son côté. |

La comparaison est lexicographique sur `AAAA-MM-JJ` — c'est exact pour ce format et n'exige aucun calcul de fuseau. Chaque endroit qui fait usage d'une fenêtre mémorise son choix indépendamment ; le défaut est de trente jours. Modifier une borne d'une fenêtre fixe la bascule en bornes libres.

**Cas limites**

Un relevé daté dans le futur n'est jamais refusé. Certains décomptes l'écartent explicitement — la série du traitement en cours, les distinctions —, d'autres non. L'écart est réel et n'a pas de règle unique.

Une fenêtre bornée sur un journal vide n'est pas une erreur : elle rend un ensemble vide, et une valeur absente se tait.

### Le document médical

Capacité : produire, à partir des relevés d'une période, un document destiné à un soignant. Le document est **remis à la personne** ; il n'est transmis à personne.

| Précondition | Détail |
| --- | --- |
| Une période | Une fenêtre d'observation. La borne de début vaut, à défaut, la plus ancienne donnée tous journaux confondus ; la borne de fin, aujourd'hui. |
| Un choix de rubriques | Une rubrique n'est proposée que si son domaine est actif *et* porte au moins une donnée sur la période. Les prises de traitement y figurent toujours, sans choix. |

**Effets.** Un document paginé nommé d'après les deux bornes. Un échec de production consigne une fiche : étape atteinte, période, rubriques demandées et rubriques effectivement écrites, volumes par journal, message d'erreur tronqué. **Cette fiche ne porte aucune donnée de santé**, et rien n'est consigné si personne n'est connecté.

Le nombre de journées documentées d'une période est le nombre de dates distinctes portées par les journaux inclus — un relevé de pas nul ne fait pas une journée documentée.

### Le partage

Capacité : composer une image à partir du dernier relevé d'un domaine et la remettre au mécanisme de partage de l'appareil ; à défaut, déposer un texte dans le presse-papiers.

- Le partage est toujours demandé, jamais automatique.
- La matière est le relevé le plus récent du domaine choisi. En l'absence de relevé, un exemple figé sert de matière, et le fait qu'il s'agisse d'un exemple est porté par la donnée elle-même.
- Ce qui n'est jamais partagé : les notes de faim, les mensurations, les notes libres attachées à un relevé.
- Il n'existe aucune capacité de comparer son état à celui d'une autre personne, ni d'atteindre les données d'autrui.

### Les distinctions

Quatre distinctions constatent une régularité sur une fenêtre courte. Cinq paliers ordonnés : aucun < éveil < bronze < argent < or. Une distinction n'est évaluée que si le domaine dont elle dépend est actif.

| Distinction | Domaine | Journée réussie | Paliers |
| --- | --- | --- | --- |
| Activité physique | Activité physique | Minutes pondérées par l'intensité : *équivalent intensif* ×1 / ×0,67 / ×0,33 ; *équivalent modéré* ×1,5 / ×1 / ×0,5. | Or : ≥ 180 min intensives sur 7 jours. Argent : ≥ 180 sur 10 jours. Bronze : ≥ 120 modérées sur 10 jours. Éveil : au moins une séance aujourd'hui ou hier. |
| Fibres | Alimentation | Total du jour ≥ 25 g. | Or 7 journées sur 7, argent 5, bronze 4, éveil aujourd'hui ou hier. |
| Protéines | Alimentation | Total du jour ≥ `arrondi(poids courant × 1,5)` g. | Or 7 sur 7, argent 5, bronze 4, éveil aujourd'hui ou hier. |
| Pas | Pas | Total du jour ≥ 8 000. | Or 5 journées sur 7, argent 4, bronze 3, éveil aujourd'hui ou hier. |

**Seules les entrées déjà survenues comptent** : une date passée, ou aujourd'hui à une heure déjà atteinte. Une montée de palier est constatée une seule fois : jamais à la première observation d'un palier, jamais lors d'une descente. Le palier connu est persisté et une descente le remplace sans être constatée.

Capacité annexe : masquer la distinction non révélée. Effet : un drapeau booléen sur le profil.

### Les retours

Deux capacités adressent quelque chose au dehors, et ce sont les seules. **Aucune ne porte de donnée de santé.**

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Adresser un avis, une idée ou un signalement | Un texte non vide après rognage. Une nature : avis, idée, signalement. | Consigné d'abord localement, puis transmis *sans attente et sans compte rendu d'échec* : l'ordre garantit que rien ne se perd si la transmission échoue. Le consentement à être recontactée accompagne l'envoi et retombe à faux après. | Texte vide. Onzième envoi du jour local : refus, et le refus dit que les envois reprennent le lendemain. |
| Supprimer un envoi de son historique local | — | Retrait franc. La place est rendue au décompte du jour. | — |
| Répondre au questionnaire, ou modifier sa réponse | — | Sept notes entières de 0 à 5 et une suggestion libre. **Une seule réponse existe** : la modifier la réécrit. Le décompte des reprises est incrémenté au dehors. | Même plafond de dix envois par jour local. |

Ce qui accompagne un envoi : la version du produit, la provenance du geste, le fuseau, les langues, les dimensions de l'appareil, l'instant local et son décalage. Rien d'autre. Le plafond atteint est signalé une seule fois par compte et par jour local.

### Effacer

Trois portées, trois régimes. La règle qui les gouverne toutes : **rien ne détruit une donnée hors une destruction demandée et confirmée.**

| Portée | Confirmation | Ce qui survit |
| --- | --- | --- |
| Une ligne | Non — le retrait est franc et immédiat. | Rien de la ligne. Exception : la pesée de départ n'offre pas cette capacité. |
| Un journal entier | Oui, explicite. | Rien, sauf pour les pesées, où la pesée de départ est épargnée : elle sert de référence à la perte totale, aux distinctions et au document médical. |
| Le compte et toutes les données | Oui, explicite, et la suppression distante d'abord. | Rien. Voir « Le compte et la session ». |

Les quatre plafonds quotidiens qui remplacent la dernière ligne d'une journée sont le seul endroit du produit où une donnée disparaît sans confirmation. Ils sont signalés à la personne au moment où ils mordent, mais le signalement suit l'écrasement, il ne le précède pas.

**Cas limites**

Une sauvegarde illisible n'est jamais écrasée : elle est recopiée sous une clé de secours, une seule fois, et plus rien n'est écrit de la session. C'est la seule situation où l'application refuse d'enregistrer quoi que ce soit.

Les capacités de suppression totale d'un journal peuvent être retirées par un drapeau du profil ; leur absence ne retire rien à la suppression ligne à ligne.

## 6. Les dérivations

Ce chapitre énumère les grandeurs que le produit calcule à partir des journaux et du profil : leur formule, leurs entrées, leur unité canonique, leur fenêtre de temps et leur dénominateur. Chacune dit aussi ce qu'elle rend quand ses entrées manquent, parce que c'est la moitié de sa définition.

### La règle du silence, et ses exceptions

Presque rien de dérivable n'est enregistré : la quasi-totalité des grandeurs de ce chapitre se recalculent à chaque lecture depuis les journaux et le profil. Deux conséquences : corriger une entrée corrige toutes les grandeurs qui en dépendent du même geste, et aucune migration n'est due lorsqu'une formule change.

**Deux grandeurs échappent à cette règle et sont persistées**, parce qu'elles portent une mémoire que le recalcul détruirait :

| Grandeur persistée | Contenu | Pourquoi |
| --- | --- | --- |
| Attribution d'équivalences insolites | les compteurs d'usage par objet, et l'attribution en cours avec la signature de la pesée qui l'a produite | la rotation entre objets se lit sur un compteur cumulé, qui n'existe nulle part ailleurs ; l'attribution doit rester stable entre deux pesées |
| Dernier palier de badge observé | un palier par distinction | une montée de palier se juge contre ce qui a déjà été observé, y compris entre deux sessions |

Une dérivation dont les entrées manquent doit rendre une absence, pas un zéro : `null` pour une grandeur numérique indisponible, une liste vide pour une décomposition impossible. Un zéro serait une mesure — « zéro kilocalorie » se lit comme un jeûne, « zéro pas » comme une journée immobile — alors que l'absence dit seulement que rien n'a été enregistré. **[arbitrage non validé]** **Le code ne tient pas cette règle partout.** Six dérivations rendent 0 ou une valeur inventée là où la règle voudrait une absence :

| Dérivation | Ce qu'elle rend faute d'entrées |
| --- | --- |
| Poids actif à une date | une chaîne de replis qui finit par 80 kg |
| Métabolisme de base | un calcul sur 42 ans, 170 cm et « femme » |
| Cadence depuis le départ | 0 quand l'ancienneté de la cure est nulle ou négative |
| Variation en % du poids de départ | 0 quand le poids de départ est nul ou négatif |
| Avancement vers la cible | 0 |
| Concentration sanguine | 0, accompagné d'un drapeau « plusieurs molécules » |
| Score d'activité d'une journée sans séance | 0 — ici légitime : l'absence de séance est une information |
| Moyenne et écart-type d'appoint | 0 sur une liste vide |

| Convention | Règle |
| --- | --- |
| Signe d'une variation de poids | Négatif quand le poids descend, positif quand il monte. La grandeur nommée « perte » suit la convention inverse : positive quand on a perdu. |
| Précision d'un poids | Un dixième de kilogramme, la précision d'une balance ; appliqué à l'écriture de la pesée, donc hérité par tout ce qui la lit. |
| Précision d'une distance | Un dixième de kilomètre, arrondi dans le calcul — mais seulement sur la *distance moyenne* de marche. La distance totale cumulée sort du calcul non arrondie. |
| Unités canoniques | kilogramme, centimètre, gramme, millilitre, milligramme, mètre (distance d'une séance), minute (durée), kilocalorie, pas. |
| Jour | Date locale `AAAA-MM-JJ`. |
| Écart de jours | `Math.round((Date.UTC(a2,m2−1,j2) − Date.UTC(a1,m1−1,j1)) / 86400000)` : les nombres d'année, de mois et de jour sont lus séparément puis reportés sur des instants UTC, jamais interprétés comme des instants locaux. C'est ce qui absorbe les jours de 23 et 25 heures. Le résultat passe par un arrondi. Une date illisible rend 0. |
| Ce qui a eu lieu | Une entrée est « survenue » si sa date est antérieure à aujourd'hui, ou si elle est d'aujourd'hui et que son heure est passée. **Une entrée d'aujourd'hui sans heure est survenue** : le prédicat ne substitue pas minuit, il compte la journée en cours en entier. |

**L'heure absente n'a pas une seule valeur dans le produit, mais trois conventions.** C'est un écart de code, pas une règle :

| Convention | Où |
| --- | --- |
| Journée entière (pas de substitution) | le prédicat « a eu lieu » |
| 12:00 | l'ordre général des entrées datées, la dernière pesée d'une journée, l'instant d'une prise dans le calcul de concentration |
| 00:00 | la coupure de traitement de la série courante, la signature de la pesée la plus récente pour l'attribution d'équivalences |

L'ordre général de deux entrées datées est la comparaison lexicographique de `date + "T" + (heure ou "12:00")`. À date et heure égales, l'ordre d'enregistrement départage : la dernière ligne l'emporte.

Les entrées datées dans l'avenir sont écartées des paliers de badge, de la projection de poids, de la série du traitement en cours, de la fréquence de prise et des analyses de coïncidence. Elles ne sont pas écartées du bilan énergétique sur sept jours ni des moyennes de journal, qui filtrent seulement par date.

### Le poids actif à une date

Presque toutes les dépenses énergétiques ont besoin d'un poids au jour considéré. Le poids actif d'un jour est la dernière pesée dont la date est inférieure ou égale à ce jour.

```
poidsActif(jour) :
  si le journal est vide       → poids de départ, sinon poids cible, sinon 80 kg
  sinon, valeur initiale        = poids de départ
                       sinon    poids cible du profil
                       sinon    poids de la pesée la plus ANCIENNE
                       sinon    80 kg
  puis, en parcourant les pesées par date croissante :
       toute pesée p telle que p.date <= jour écrase la valeur
```

La chaîne de replis compte donc quatre crans, et le quatrième — la pesée la plus ancienne — n'existe que lorsque l'historique n'est pas vide mais qu'aucune pesée ne précède le jour demandé. Cette dérivation ne se tait jamais : elle finit par 80 kg. Le poids de départ est celui de la pesée portant le drapeau de départ, pas la pesée la plus ancienne. Le tri interne se fait sur la date seule, l'heure n'y entre pas.

Le poids « actuel » d'un profil, lui, est la pesée la plus récente *par date et heure*, et non la dernière saisie ; une pesée antidatée ajoutée après coup ne devient pas le poids actuel. Deux pesées le même jour se départagent par l'heure la plus tardive, jamais par leur moyenne : une pesée du matin et une du soir ne décrivent pas le même poids. **Sur un journal vide, le poids actuel est le poids de départ** — il ne se tait pas non plus.

Le poids de départ, lu par les paliers de badge, retombe sur 70 kg quand aucune pesée de départ n'existe.

### IMC et catégories

```
imc = poidsKg / (tailleCm / 100)²      arrondi au dixième
imc = 0 si la taille est inconnue ou nulle
```

Les bornes de catégorie sont uniques dans le produit ; **trois jeux de noms les habillent**, et ils ne se comportent pas de la même façon sur un IMC nul.

| Rang | Borne | Jeu court | Jeu à rang | Jeu à puce |
| --- | --- | --- | --- | --- |
| 0 | < 18,5 | Insuffisance pondérale | Insuffisance pondérale | Insuffisance pondérale |
| 1 | 18,5 à < 25 | Corpulence normale | Corpulence normale | Corpulence normale |
| 2 | 25 à < 30 | Surpoids | Surpoids | Surpoids |
| 3 | 30 à < 35 | Obésité I | Obésité modérée (Classe I) | Obésité • Classe I |
| 4 | 35 à < 40 | Obésité II | Obésité sévère (Classe II) | Obésité • Classe II |
| 5 | ≥ 40 | Obésité III | Obésité très sévère (Classe III) | Obésité • Classe III |
| 99 | ≤ 0 | *n'existe pas* | Inconnu | *n'existe pas* |

**[arbitrage non validé]** Seul le jeu à rang connaît le cas « inconnu », et c'est aussi le seul dont le rang sert à comparer deux catégories. Les deux autres testent d'abord `imc < 18,5` : **une taille inconnue y produit « Insuffisance pondérale », pas « inconnu »**, et rien ne garde ce chemin — l'IMC nul est lu sans condition préalable.

Les **points d'IMC gagnés ou perdus** depuis le départ se calculent sur la différence de poids, jamais en retranchant deux IMC déjà arrondis :

```
pointsImc = (poidsActuel − poidsDepart) / (tailleM)²   arrondi au dixième
null si tailleM <= 0 ou poidsDepart <= 0
```

Le signe est celui de la variation : perdre du poids donne un nombre négatif.

La **date de franchissement** d'un rang visé est la date de la première pesée, dans l'ordre chronologique, dont le rang d'IMC est inférieur ou égal au rang visé — à condition que le rang du poids de départ lui soit strictement supérieur. Sans franchissement, la dérivation ne rend rien : entrer déjà dans la catégorie visée n'est pas un franchissement.

> **Exemple.**
>
> Camille, 168 cm : à 96 kg son IMC vaut 96 / 1,68² = 34,0 — rang 3, « Obésité I ». À 88 kg il vaut 31,2, même rang ; les points d'IMC valent (88 − 96) / 2,8224 = −2,8. Le rang 2 se franchira à 84,7 kg.

### Le métabolisme de base

Formule de Mifflin-St Jeor, en kilocalories par jour, calculée sur le poids actif du jour :

```
mbHomme = 10×poidsKg + 6,25×tailleCm − 5×age + 5
mbFemme = 10×poidsKg + 6,25×tailleCm − 5×age − 161
mb(neutre) = (mbHomme + mbFemme) / 2
```

Les trois genres modélisés sont homme, femme et neutre ; le neutre est la moyenne arithmétique des deux autres, ce n'est pas une quatrième formule. Les entrées manquantes ne font pas taire le calcul : âge absent vaut 42 ans, taille absente 170 cm, genre absent « femme ». La valeur du jour est arrondie à l'unité ; le cumul de sept jours somme les valeurs non arrondies.

**[V2]** Le profil n'enregistre plus un âge mais une **année de naissance**, dans les bornes d'un âge de 1 à 130 ans rapportées à l'année courante. L'âge de la formule devient donc lui-même une dérivation, année courante moins année de naissance ; la V2 n'en implémente encore aucune application. **[arbitrage non validé]** pour la question de savoir si l'âge se raffine par le jour de naissance, que le produit ne recueille pas.

> **Exemple.**
>
> Camille, née en 1978, 168 cm, 96 kg, genre femme, en 2026 : 960 + 1050 − 240 − 161 = 1 609 kcal par jour.

### Les dépenses actives

Deux sources, additionnées : les pas et les séances.

**Les pas.** La foulée se déduit de la taille, la durée d'une vitesse de marche fixe de 4,2 km/h, la dépense d'un coût de 3,5 MET.

```
foulée_km   = tailleCm × 0,414 / 100000
distance_km = pas × foulée_km
heures      = distance_km / 4,2
kcal        = arrondi(3,5 × poidsKg × heures)
```

**Les séances.** Une séance porte un sport, une intensité ressentie (douce, modérée, intensive), une durée en minutes et une distance facultative en mètres. Le facteur d'intensité vaut 0,8 / 1,0 / 1,3.

```
kcal = arrondi(MET × poidsKg × durée_h)
MET  = MET_catalogue(sport) × facteur(intensité)          sans distance
MET  = MET_allure(sport, allure)                           avec distance
kcal = arrondi(0,05 × facteur(intensité) × poidsKg × étages)   montée d'escaliers
allure_kmh = (distance_m / 1000) / (durée_min / 60)
```

L'**allure** est donc elle-même une dérivation, en kilomètres par heure, tirée de la distance en mètres et de la durée en minutes. Elle n'est jamais enregistrée.

Le catalogue des sports compte **54 entrées**, de 2,5 à 12,0 MET. L'identité d'un sport est son libellé enregistré, pas un identifiant : c'est ce qui a obligé à migrer les entrées « Ping-pong » et « Tennis de table » vers un libellé fusionné. Un sport absent du catalogue prend 4,5 MET.

La montée d'escaliers est le seul sport dont la durée ne compte pas des minutes mais des **étages** ; partout où des minutes s'additionnent, un étage vaut une demi-minute.

Quand une distance est renseignée sur un sport qui en accepte une, l'allure *remplace* l'intensité ressentie : la multiplier encore compterait deux fois le même effort. Le MET se lit par interpolation linéaire sur une table d'ancrages allure → MET propre au sport, bloquée aux extrémités — ce qui rend une distance absurde inoffensive. Les huit sports à distance sont la marche, la randonnée, la course à pied, le vélo, la natation, le rameur, le ski de fond et le patinage.

**[arbitrage non validé]** **Les deux chemins ne se rejoignent pas sur tous les sports.** Six tables contiennent bien un ancrage dont le MET vaut exactement le MET du catalogue — à cette allure de référence, le résultat est celui du calcul par intensité modérée. Deux n'en ont pas : la course à pied, dont le MET catalogue (8,0) tombe entre les ancrages 6,4 km/h → 6,0 et 8,0 km/h → 8,3 ; le rameur, dont le MET catalogue (6,0) tombe entre les ancrages 9 km/h → 4,8 et 12 km/h → 7,0. Pour ces deux sports, aucune allure ne retombe sur le calcul par intensité.

Le chemin « allure » est abandonné, et le calcul par intensité repris, si la distance n'est pas un nombre fini strictement positif, si la durée ne l'est pas, ou si le sport n'a pas de table.

### Le score d'activité

Une mesure d'effort distincte des kilocalories, qui ignore volontairement le MET du sport : elle mesure ce que la personne fait — combien de temps, à quelle intensité — et non ce que vaut la discipline.

```
minutesPondérées(séance) = minutes(séance) × facteur(séance)
minutes(séance)          = étages × 0,5 pour la montée d'escaliers, la durée sinon
facteur(séance)          = MET_allure / MET_catalogue, borné à [0,8 ; 1,3]   avec distance
                           facteur(intensité ressentie)                       sinon
score(jour) = min(10 ; somme des minutesPondérées du jour × 10 / 78)
```

Le facteur tiré de l'allure est borné exactement à la plage du ressenti, sans quoi une journée renseignée avec distance ne se comparerait plus à une journée renseignée sans. Le plafond de 10 fait qu'une séance de trois heures ne vaut pas trois journées : la mesure récompense la régularité. La provenance du facteur — allure ou ressenti — est rendue avec lui, parce qu'une allure très vive rend exactement 1,3 et qu'on ne peut pas la déduire du nombre. Une journée sans séance rend 0 : ici l'absence de séance est bien une information.

### La balance énergétique

Sur les sept derniers jours, aujourd'hui compris, jour par jour :

| Grandeur du jour | Définition | Unité |
| --- | --- | --- |
| poids | poids actif à cette date | kg |
| mb | métabolisme de base sur ce poids | kcal, arrondi |
| ingéré | somme des calories des repas de la date | kcal, arrondi |
| kcalSéances | somme des dépenses des séances de la date | kcal |
| kcalPas | somme des dépenses des relevés de pas de la date | kcal |
| dépenseActive | kcalSéances + kcalPas | kcal |
| dépenseTotale | mb + dépenseActive | kcal, arrondi |

```
sortie = arrondi(Σ mb + Σ dépenseActive)
balance = Σ ingéré − sortie          positif = surplus, négatif = déficit
```

Le sens de la balance se lit par bandes, sur sa valeur absolue en kilocalories cumulées sur sept jours. Le sens est la donnée ; les libellés qui l'habillent n'en sont pas.

| \|balance\| | Sens | Degré |
| --- | --- | --- |
| ≤ 4 000 | stable | — |
| ≤ 8 000 | perte / prise | léger |
| ≤ 14 000 | perte / prise | franc |
| > 14 000 | perte / prise | marqué |

Les calories d'un repas ne sont pas ré-estimées ici : elles sont recalculées depuis les aliments du repas à chaque écriture de celui-ci, et lues telles quelles.

### La projection de poids

La même balance énergétique, traduite en grammes, sur les sept derniers jours et en écartant cette fois toute saisie non survenue.

```
dépenses     = arrondi(Σ mb) + arrondi(Σ kcalPas) + arrondi(Σ kcalSéances)
différentiel = Σ ingéré − dépenses                      kcal
grammes      = arrondi(différentiel / 8000 × 1000)      g
```

Le taux de conversion — 8 000 kcal pour un kilogramme — est une constante du produit, posée par l'utilisatrice ; ce n'est pas la valeur physiologique usuelle. Les trois dépenses sont arrondies *avant* d'être sommées pour que la soustraction retombe exactement sur le différentiel rendu.

| \|grammes\| | Verdict |
| --- | --- |
| ≤ 300 | stable |
| 300 < g < 1 000 | légère hausse · légère baisse |
| ≥ 1 000 | hausse assez marquée · baisse assez marquée |

**[arbitrage non validé]** La bande de 700 g à 1 000 g n'était pas nommée dans la consigne d'origine ; la lecture retenue étend « légère » jusqu'à 1 kg exclu.

### La cadence de perte

Quatre cadences coexistent, sur trois dénominateurs différents ; elles ne sont pas interchangeables.

**La cadence depuis le départ.** Le dénominateur est le nombre de jours écoulés depuis la pesée de départ jusqu'à aujourd'hui, et non jusqu'à la dernière pesée.

```
cadence = (poidsActuel − poidsDepart) × 7 / joursDepuisLeDepart      kg/semaine
0 si joursDepuisLeDepart <= 0 ; rien avant 7 jours de recul
```

**La cadence sur un intervalle borné.** Même formule ; le dénominateur est `joursEntre(début, fin)`, **bornes non comprises**.

```
cadence = (dernièrePeséeDedans − premièrePeséeDedans) × 7 / joursEntre(début, fin)
          arrondi au dixième
null si moins de deux pesées dans l'intervalle
null si joursEntre(début, fin) < 7
```

Les deux pesées retenues sont la première et la dernière *journée* de l'intervalle, chaque journée n'étant représentée que par sa dernière pesée. **[arbitrage non validé]** Ce dénominateur n'est pas la longueur de période définie plus bas (`joursEntre + 1`) : sur un intervalle de trente jours de calendrier, cette cadence divise par 29.

**[arbitrage non validé]** **Le seuil de sept jours n'est pas écrit de la même façon partout**, et les trois écritures ne comptent pas les mêmes jours :

| Grandeur | Comptage | Statut du seuil |
| --- | --- | --- |
| Cadence sur intervalle borné | `joursEntre(début, fin)`, bornes non comprises | toujours appliqué |
| Moyennes hebdomadaires de journal (moments pour soi, effets) | `joursEntre(première, aujourd'hui) + 1` | toujours appliqué |
| Moyennes hebdomadaires d'activité | `joursEntre(première, aujourd'hui) + 1` | **paramètre** : appliqué par défaut, désactivé pour le document de suivi, dont la fenêtre est annoncée |

Un intervalle du lundi au dimanche — sept jours de calendrier — est donc refusé par la première et accepté par les deux autres. La justification du seuil est commune : ramener un écart de trois jours à la semaine le multiplie par 2,3, alors que le bruit d'un jour à l'autre domine la mesure.

**La perte par tranche de sept jours.** Un découpage en tranches consécutives de sept jours, ancrées soit sur la première pesée, soit sur le début de la période demandée. Deux règles portées par ce seul calcul : un jour ne compte que par sa dernière pesée ; le poids d'un jour sans pesée est **interpolé linéairement** entre les deux pesées qui l'encadrent, et vaut la pesée la plus proche au-delà des bornes. Chaque tranche rend son poids de fin et sa perte, définie comme poids de début moins poids de fin — donc positive quand on a perdu. **Les deux sont arrondis au dixième** à l'écriture de la tranche. Le nombre de tranches est le plafond entier du nombre de jours divisé par sept, au moins une.

**Le résumé d'une suite de tranches.**

```
totalKg       = arrondi₁(Σ pertes des tranches)
poidsEntrée   = poids de fin de la 1re tranche + sa perte
pctDuDépart   = arrondi₁(totalKg / poidsEntrée × 100)     null si poidsEntrée <= 0
parSemaine    = arrondi₁(totalKg / nombre de tranches)
pctParSemaine = arrondi₂(pctDuDépart / nombre de tranches)
```

Le télescopage `totalKg = poids d'entrée − poids de sortie` n'est donc exact qu'à l'arrondi près, chaque tranche ayant déjà arrondi sa perte. La référence du pourcentage est le poids d'*entrée de période*, jamais le poids de départ de la cure. Conséquence assumée du découpage : une période de trente jours compte cinq tranches, dont une partielle, et la moyenne par semaine s'en trouve diluée.

**La variation en pourcentage du poids de départ**, elle, est indépendante des tranches :

```
pct = (poidsActuel − poidsDepart) / poidsDepart × 100     0 si poidsDepart <= 0
```

Enfin, l'**interpolation lissée** entre les pesées est une spline cubique monotone de Fritsch–Carlson : elle passe exactement par chaque pesée et ne dépasse jamais les deux qui l'encadrent — pas de rebond sous le poids plancher. Elle ne rend rien hors de l'intervalle [première pesée, dernière pesée] : elle ne s'invente aucun prolongement.

> **Exemple.**
>
> Camille est partie de 96,0 kg en mai 2026. Au 112ᵉ jour elle pèse 88,0 kg : la cadence depuis le départ vaut (88,0 − 96,0) × 7 / 112 = −0,5 kg par semaine, et la variation −8,3 % du poids de départ.

### Les deux pertes et leurs durées

Deux pertes sont dérivées du journal des pesées, sur des ancrages différents. Les pesées sont triées par date et heure décroissantes.

| Grandeur | Formule | Ancrage de durée |
| --- | --- | --- |
| Perte totale | `poidsDepart − poidsActuel` | de la date de la pesée de départ à celle de la pesée la plus récente |
| Dernière perte | `avantDernière.poids − dernière.poids`, 0 avec moins de deux pesées | de la date de l'avant-dernière pesée à celle de la dernière |

La durée de la dernière perte se compte entre les deux pesées qu'elle mesure, **jamais jusqu'à aujourd'hui** : une pesée d'il y a trois jours ne rallonge pas la perte qu'elle a constatée.

```
duréeDePerte(début, fin) :
  null si début manque, ou si début > fin
  jours = joursEntre(début, fin)
  null si jours < 1                    ← deux pesées le même jour
  jours   en deçà de 7 jours
  arrondi(jours / 7) semaines, au moins 1, au-delà
```

### L'avancement vers la cible

```
écart = poidsDepart − poidsCible
si écart > 0 : avancement = borne(0, 100, (poidsDepart − poidsActuel) / écart × 100)
sinon        : avancement = 100 si poidsActuel <= poidsCible, 0 sinon
```

Une cible incohérente — au-dessus du poids de départ — ne rend pas d'erreur : elle rend 0, sauf si la cible est déjà tenue. Le trajet départ → cible se décrit aussi par son écart signé, en kilogrammes et en pourcentage du poids de départ, indéfini si l'un des deux poids manque.

Deux autres formes d'avancement existent, sur la même idée et avec des comportements différents. **[arbitrage non validé]**

| Forme | Formule | Objectif nul ou négatif | Usage réel |
| --- | --- | --- | --- |
| Avancement de poids | borne sans arrondir | voir ci-dessus | l'avancement vers le poids cible |
| Avancement générique | `borne(0, 100, arrondi(valeur / objectif × 100))` | 0 | deux appelants seulement, tous deux une largeur proportionnelle — il ne sert aucun des objectifs nutritionnels |
| Part d'objectif du document de suivi | `arrondi(valeur / objectif × 100)`, sans borne | indéfinie | le document de suivi |

L'avancement des pas n'emploie aucune des trois : il est écrit à part, `min(100, arrondi(pas / (objectif ou 8 000) × 100))`, sans plancher à 0 et avec un repli sur 8 000 quand l'objectif est nul.

### La concentration sanguine

La quantité de principe actif présente à un instant se modélise par un compartiment unique et un modèle de Bateman, appliqué aux deux phases — montée et descente. Chaque traitement du catalogue porte trois paramètres : demi-vie d'élimination, demi-vie d'absorption, et une part de dose utile qui représente la biodisponibilité relative (1 par défaut).

```
ke = ln2 / demiVieElimination
ka = ln2 / demiVieAbsorption
tMax = ln(ka/ke) / (ka − ke)
normalisation = 1 / (e^(−ke·tMax) − e^(−ka·tMax))
contribution(dose, h) = dose × partUtile × (e^(−ke·h) − e^(−ka·h)) × normalisation
contribution = 0 si h < 0
concentration(t) = Σ contribution(dose_i, (t − instant_i)/3600000) pour instant_i <= t
```

La normalisation fait que le pic d'une prise isolée vaut exactement la dose utile ; l'unité est donc un milligramme-équivalent, pas une concentration plasmatique. Loin du pic le terme d'absorption devient négligeable et la concentration décroît exactement selon la demi-vie d'élimination. L'heure d'une prise absente vaut midi.

**Le cumul se fait par molécule, pas par marque ni par forme.** Deux prises de la même molécule s'additionnent quels que soient leur nom commercial et leur forme ; chacune garde la cinétique de sa propre fiche, ce que la part de dose utile rend légitime. Un traitement de molécule inconnue ne s'additionne à rien et forme son propre groupe.

**La fenêtre de soixante jours ne sert qu'à former les groupes.** On retient d'abord les prises des soixante derniers jours — ou tout l'historique si cette fenêtre est vide — et on en tire la liste des molécules. La concentration de chaque groupe est ensuite calculée sur l'*historique entier* de ses traitements : une prise d'il y a soixante-dix jours contribue encore au nombre rendu. On écarte enfin les groupes dont la concentration résiduelle est inférieure ou égale à 0,001 mg.

**[arbitrage non validé]** La grandeur d'état courant ne rend pas une absence mais **un couple (concentration, drapeau « plusieurs »)** : zéro groupe actif rend (0, faux), un groupe rend (sa concentration, faux), plusieurs rendent (0, vrai). Zéro molécule active et deux molécules actives rendent donc le même nombre, ce que la règle du silence de ce chapitre interdirait.

Deux autres grandeurs sortent du même modèle :

| Grandeur | Définition |
| --- | --- |
| tMax | Le délai du pic après une prise isolée, en heures, propre à la cinétique de la fiche. |
| État du pic | Un sommet local de la trajectoire est un point strictement supérieur à son voisin de gauche et supérieur ou égal à celui de droite ; les extrémités ne comptent pas. L'état vaut « pic en cours » à l'intérieur d'une fenêtre autour du sommet, sinon « pic à venir » ou « pic passé » avec son délai en heures. **La largeur de la fenêtre est décidée par la forme de la dernière prise *déjà faite*** : 12 heures pour une injection, 20 minutes pour un comprimé. |
| Rythme de prise usuel | Une dérivation de la fiche du traitement : la valeur qu'elle porte, sinon 1 jour pour un comprimé et 7 jours pour une injection. Saxenda et Victoza portent explicitement 1 jour malgré leur forme injectable. |

Le catalogue compte onze traitements plus un état « pas de traitement ». Les trois entrées sans molécule ne s'additionnent à rien.

| Fiche | Molécule | Forme | Élimination | Absorption | Part de dose utile |
| --- | --- | --- | --- | --- | --- |
| Ozempic, Wegovy injectable | sémaglutide | injection | 168 h | 15 h | 1 |
| Rybelsus, Wegovy oral | sémaglutide | oral | 160 h | 0,1 h | 0,008 |
| Mounjaro, Zepbound | tirzépatide | injection | 120 h | 12 h | 1 |
| Saxenda, Victoza | liraglutide | injection | 13 h | 2,5 h | 1 |
| Trulicity | dulaglutide | injection | 113 h | 14 h | 1 |
| Rétatrutide | rétatrutide | injection | 144 h | 12 h | 1 |
| Foundayo | orforglipron | oral | 36 h | 0,7 h | 1 |
| Autre traitement (comprimé) | — | oral | 160 h | 1,5 h | 1 |
| Autre traitement (injection) | — | injection | 168 h | 15 h | 1 |
| Pas de traitement | — | injection | 168 h | 15 h | 1 |

> **Exemple.**
>
> Camille est sous sémaglutide injectable : ke = 0,004126 h⁻¹, ka = 0,046210 h⁻¹, pic à 57,4 h — un peu moins de deux jours et demi après l'injection — et normalisation 1,391. Une dose de 1 mg atteint donc 1,00 mg-équivalent à son pic ; en rythme hebdomadaire, les doses successives s'accumulent vers un plateau d'environ le double d'une dose isolée.

### La série du traitement

Trois grandeurs répondent à la même question — quelles prises comptent aujourd'hui — et sortent donc d'un seul calcul. Deux règles, dans cet ordre :

1. les prises non survenues sont écartées, date et heure comprises ;
2. **un changement de traitement est une coupure** : en remontant depuis la fin, on garde les prises du traitement courant jusqu'à la première prise d'un autre traitement. Revenir à un traitement déjà pris ne rouvre pas son ancien épisode.

Le filtre passe devant la coupure : sans cela, une prise future d'un autre traitement — un changement planifié — viderait la série entière. Une prise sans marque est réputée du traitement courant. Pour ce tri-là, une heure absente vaut minuit.

| Grandeur | Définition | Absence |
| --- | --- | --- |
| compte | nombre de prises de la série | 0 |
| dose initiale | dose de la première prise de la série, en mg | `null` si série vide |
| dose actuelle | dose de la dernière prise de la série, en mg | `null` si série vide |
| cumul | somme des doses, figée au centième | 0 |

La **fréquence de prise** se mesure sur tout l'historique et non sur la seule série courante, en comptant des *journées* de prise et non des lignes :

```
fréquence = joursEntre(1re journée, dernière journée) / (nombre de journées − 1)   jours
null si moins de deux journées de prise survenues, ou si l'écart est nul
```

Deux prises le même jour — une correction, un doublon, une dose scindée — ne font pas deux prises espacées de zéro jour. C'est la moyenne des écarts et non leur médiane : elle ne dépend que des deux extrémités, et n'efface donc pas les semaines sautées.

L'**ancienneté** se compte sur deux ancrages : la pesée de départ pour la cure, la première prise du traitement courant pour le traitement.

```
joursTotal = arrondi((minuitLocal(aujourd'hui) − minuitLocal(ancrage)) / 86400000)
semaine    = plancher(joursTotal / 7) + 1
null si l'ancrage n'existe pas, est illisible, ou est daté du futur
```

Le jour de l'ancrage se dit « semaine 1 » et vaut 0 jour écoulé.

Le délai depuis la dernière prise est un nombre entier de jours entre minuits ; il peut être négatif si la seule prise connue est datée dans l'avenir, et il est alors lu comme un délai *jusqu'à* la prochaine.

### Les tendances

Sept séries journalières de quatorze jours, aujourd'hui compris, du plus ancien au plus récent. Elles ne réemploient aucun des calculs de fenêtre réglable : quatorze jours pleins, toujours les mêmes.

```
TREND_DAYS = 14
```

Le traitement du jour non renseigné dépend de la nature de la grandeur, et il a été tranché série par série :

| Série | Nature | Jour non renseigné |
| --- | --- | --- |
| Poids | état | report de la dernière valeur connue ; avant la première pesée, la première valeur connue ; série vide sans aucune pesée |
| Concentration sanguine | état | recalculée à midi de chaque jour depuis toutes les prises ; ne se tait pas quand plusieurs molécules sont actives, contrairement à la grandeur d'état courant |
| Calories, sommeil, pas | cumul | `null` — la série s'interrompt |
| Sport, temps pour soi | cumul | 0 — ne rien trouver, c'est n'avoir pas bougé |

Grandeurs d'appoint du même module : la moyenne sur les seuls points renseignés d'une série trouée, le total d'une série, la dépense quotidienne moyenne de sport et de pas, le décalage entre deux périodes, le décalage de sévérité des effets, et un prédicat disant si une série a une forme — c'est-à-dire si elle n'est ni vide ni plate.

### Les fenêtres et les dénominateurs

Une moyenne n'a de sens que par son dénominateur, et le produit n'en emploie pas un seul. La règle générale : **on divise par les journées renseignées quand le silence est un oubli, par les jours écoulés quand le silence est une information.** Une journée sans repas saisi est une journée non tenue, pas un jeûne ; une semaine sans séance est une semaine sans séance.

| Grandeur | Fenêtre | Dénominateur | Absence |
| --- | --- | --- | --- |
| Repas, en-cas, kcal, protéines, fibres par jour | tout l'historique | journées portant au moins un repas — **le dénominateur est rendu avec les moyennes** | null si aucune |
| kcal, protéines, fibres par jour, récent | de J−7 à J−1 (hier inclus, aujourd'hui exclu) | journées portant au moins un repas dans la fenêtre | null si aucune |
| Pas par jour | tout l'historique, ou J−6 à J | journées dont le total de pas est > 0 | null si aucune |
| Pas, distance, durée, kcal, avancement — depuis une date | de la date choisie à la fin | nombre de relevés retenus | zéros si aucun relevé |
| Minutes et séances d'activité par semaine | 1re séance → aujourd'hui (bornes comprises), ou période choisie (au moins 1 jour) | jours de la fenêtre / 7 | null si la fenêtre couvre moins de 7 jours *et* que le seuil est appliqué ; total exact dès la 1re séance |
| Durée de nuit moyenne | tout l'historique, ou J−6 à J | journées portant une nuit de durée **strictement positive** | null si aucune |
| Sommeil moyen d'une journée | idem | **dates portant une entrée, quelle que soit sa durée**, siestes comprises | null si aucune |
| Moments pour soi, effets secondaires par semaine | 1re entrée → aujourd'hui, bornes comprises | jours / 7 | null si journal vide ou recul < 7 jours |
| Comptes à sept jours (séances, effets, moments) | J−6 à J, aujourd'hui compris | — | 0 |

Une journée à zéro pas est un podomètre éteint, pas une journée immobile : elle ne compte ni au numérateur ni au dénominateur. Une nuit de zéro minute n'est pas une nuit blanche : même traitement — **mais seulement pour la durée de nuit moyenne**. Le sommeil moyen d'une journée, lui, ne filtre rien : une entrée dégénérée de zéro minute y compte une journée entière au dénominateur. Deux relevés de pas le même jour s'additionnent sans compter deux journées ; deux nuits le même jour aussi. Les moments pour soi se comptent en *entrées* et non en journées : deux moments dans la même journée font deux.

Les fenêtres nommées valent 7, 14, 30 et 90 jours. Une paire de bornes complète a bien une longueur, `joursEntre(début, fin) + 1` ; seuls « depuis le début » et une paire dont une borne manque, ou dont la fin précède le début, n'ont pas de longueur connue. Ce calcul-là passe par deux instants pris à midi, pour ne pas être décalé par un changement d'heure au milieu de la période.

**Un seul total de pas fige la journée en cours** : celui qui totalise les pas d'une période pour le document de suivi. Il ne relève pas lui-même le compte du jour — il le reçoit en paramètre, relevé une fois par son appelant. Un total qui bougerait entre deux lectures serait faux deux fois. Si la période ne contient pas aujourd'hui, la valeur figée n'entre pas dans le total. Aucun autre total de pas ne fige quoi que ce soit.

Une distance de marche connaît **deux formules distinctes** : les relevés de pas la calculent à 0,00076 km par pas, tandis que la dépense énergétique la recalcule depuis la taille. Elles ne coïncident pas.

Une vitesse de marche connaît elle aussi **deux valeurs** : les moyennes depuis une date rendent la constante de 4,2 km/h, tandis que le bilan cumulé divise sa distance totale par sa durée totale, soit 0,00076 × 95 × 60 ≈ 4,3 km/h ; la constante n'y sert que de repli quand la durée est nulle. La durée de marche vaut `arrondi(pas / 95)` minutes.

### Les objectifs nutritionnels

Trois objectifs quotidiens, chacun remplaçable par une valeur du profil :

| Objectif | Défaut | Réglage de profil | Unité |
| --- | --- | --- | --- |
| Calories | 1 400 | oui | kcal |
| Protéines | `arrondi(poidsActuel × 1,5)` | oui | g |
| Fibres | 25 | oui | g |

**[arbitrage non validé]** **L'objectif de protéines des paliers de badge n'est pas celui-ci**, malgré la formule identique. Ils diffèrent sur deux points : le réglage de profil écrase le calcul côté nutrition et pas côté badge, et le poids retenu n'est pas le même — la pesée la plus récente par date et heure d'un côté, la dernière ligne enregistrée du journal des pesées de l'autre. Une pesée antidatée saisie en dernier change donc l'un sans changer l'autre.

Les totaux d'une journée sont les sommes des calories, protéines et fibres des repas de cette date ; les fibres sont toujours du nombre. La part d'un objectif atteinte vaut `arrondi(valeur / objectif × 100)`, indéfinie si l'objectif n'est pas un nombre fini strictement positif.

### Les effets et leurs paliers

Un effet secondaire porte une sévérité entière **de 0 à 5** : six crans, dont le premier — « imperceptible » — est la valeur retenue à l'ouverture d'une saisie. Un effet à peine remarqué est une réponse, pas une absence de réponse. Les paliers sont uniques dans le produit et le zéro tombe dans « léger » avec le 1 :

```
palier(sévérités) : max > 3 → sévère ; max > 1 → modéré ; sinon léger
```

Le palier d'une *journée* se juge sur son pire effet. Le *décompte* par palier se juge effet par effet : une journée portant une nausée à 1 et un vertige à 5 vaut un léger et un sévère, là où la journée entière est dite sévère. La note d'une journée est la moyenne arithmétique des sévérités déclarées ce jour-là, sur cinq, à une décimale.

Le climat d'une journée se déduit des effets du jour :

```
score = Σ sévérités du jour
score = 0                          → serein
score > 8 ou une sévérité >= 4     → difficile
sinon                              → modéré
```

### Le sommeil

Une entrée de sommeil est de type nuit ou sieste, porte un instant d'endormissement et un instant de réveil, et une note de qualité. Elle est datée du jour de son **réveil**.

```
durée = réveil − endormissement, en minutes
durée = 0 si le réveil ne suit pas l'endormissement, ou si une date est illisible
```

Les instants se construisent depuis les nombres d'année, de mois, de jour, d'heure et de minute lus séparément, jamais par interprétation d'une chaîne, qui décalerait d'un jour selon le fuseau. La durée de nuit d'une journée est la somme de ses entrées de type nuit, indéfinie s'il n'y en a aucune ; la durée de sieste, la somme des siestes, nulle s'il n'y en a pas.

La qualité moyenne d'un ensemble d'entrées est **pondérée par leur durée**, arrondie au dixième : une sieste de vingt minutes ne pèse pas autant qu'une nuit de huit heures. Elle est indéfinie si la durée totale est nulle. Les entrées de durée nulle ou négative ne pèsent rien.

### La corrélation

Le produit énonce des coïncidences entre deux séries journalières, jamais des causes, et sans appel à un service externe : c'est un moteur de règles sur des textes préparés.

```
r = Σ(x−x̄)(y−ȳ) / √(Σ(x−x̄)² · Σ(y−ȳ)²)        coefficient de Pearson
r indéfini si moins de 2 paires, ou si une des deux séries a une variance nulle
```

| Condition | Verdict |
| --- | --- |
| moins de 7 paires complètes | trop peu — aucun verdict |
| variance nulle d'un côté | rien à mesurer |
| \|r\| < 0,3 | aucun lien |
| 0,3 ≤ \|r\| < 0,5 | modéré |
| \|r\| ≥ 0,5 | net |

Le garde-fou de sept paires est délibérément exigeant : à si peu de points, un coefficient élevé se produit couramment par hasard. Le sens du lien n'est rendu que lorsqu'il y en a un. Les journées datées après aujourd'hui sont retirées de l'analyse et leur nombre est rendu à part : sans quoi une fenêtre de quatorze jours pourrait annoncer seize journées renseignées.

Les statistiques d'appoint sont la moyenne arithmétique et l'écart-type de *population*, toutes deux nulles sur une liste vide.

### Les paliers de badge

Quatre distinctions, cinq paliers ordonnés — aucun, éveil, bronze, argent, or. L'ordre est unique et sert à comparer : une montée de palier est un rang strictement supérieur au dernier rang **observé et enregistré**. Un palier supérieur écrase les inférieurs ; l'évaluation rend toujours le plus haut palier atteint. Les entrées non survenues ne comptent jamais.

Le dernier rang observé est la seule mémoire persistée des paliers : un palier jamais observé n'est pas une progression mais une découverte, enregistrée en silence.

Le palier « éveil » est le critère du badge rempli sur **une seule journée**, la journée en cours ou la précédente — les deux seules journées que ce palier regarde.

| Distinction | Journal | Éveil | Bronze | Argent | Or |
| --- | --- | --- | --- | --- | --- |
| Activité physique | séances | une séance aujourd'hui ou hier | 120 min modérées-équivalent / 10 j | 180 min intensives-équivalent / 10 j | 180 min intensives-équivalent / 7 j |
| Fibres | repas | 25 g aujourd'hui ou hier | 25 g atteints 4 j / 7 | 5 j / 7 | 7 j / 7 |
| Protéines | repas | objectif atteint aujourd'hui ou hier | objectif atteint 4 j / 7 | 5 j / 7 | 7 j / 7 |
| Pas | relevés de pas | 8 000 pas aujourd'hui ou hier | 8 000 pas 3 j / 7 | 4 j / 7 | 5 j / 7 |

Les équivalences d'activité sont des coefficients appliqués à la durée : vers l'intensif, 1,0 / 0,67 / 0,33 pour intensive, modérée, douce ; vers le modéré, 1,5 / 1,0 / 0,5. Ce sont des coefficients propres aux paliers, distincts du facteur d'intensité des dépenses (0,8 / 1,0 / 1,3) et du score d'activité. La durée entre ici brute, sans conversion des étages.

L'objectif de protéines de ce palier est `arrondi(poidsActuel × 1,5)`, le poids actuel y étant pris comme la *dernière ligne* du journal des pesées, non la plus récente par date et heure ; le poids de départ, à défaut, et 70 kg en dernier ressort. Aucun réglage de profil ne l'écrase.

Une distinction dépend de l'activation de son domaine : l'activité et les pas sont réputés actifs sauf refus explicite, les repas sont réputés inactifs sauf accord explicite. Une distinction dont le domaine est éteint n'est pas évaluée.

> **Exemple.**
>
> Camille marche 8 200 pas hier et 6 000 aujourd'hui, et n'a pas d'autre relevé sur les sept derniers jours : la distinction des pas est au palier éveil — un jour sur sept, il en faut trois pour le bronze.

### Les équivalences insolites

Un poids en kilogrammes se traduit en une combinaison de **un ou deux objets** d'un catalogue de 222 entrées — 71 objets courants et 151 insolites — dont les masses vont de 1 g à 200 kg. Chaque entrée porte un nom au singulier avec son article, un pluriel, une masse en kilogrammes, une catégorie et un article. Le type prévoit aussi un drapeau « animal », mais **aucune des 222 entrées ne le porte** : le filtre correspondant ne rend jamais rien.

La recherche est exhaustive et déterministe : toutes les combinaisons d'un et de deux objets sont énumérées, et la meilleure est celle dont l'écart absolu au poids visé est le plus faible ; à égalité, la première du catalogue. Une combinaison est admissible si elle compte au plus deux objets, au plus deux insolites, et — dès qu'elle contient un insolite — au moins un insolite de moins d'un kilogramme.

**L'équivalence doit être vraie à 200 g près.** C'est un écart absolu, le même à 0,8 kg qu'à 30 kg : au-delà, ce n'est plus une équivalence. Deux règles supplémentaires ne s'appliquent qu'à l'intérieur de cette tolérance :

1. **exclusion** — une combinaison ne reprend pas un objet déjà attribué à une autre équivalence attribuée en même temps ; si aucune autre combinaison vraie n'existe, la règle cède, et jamais au prix d'une équivalence fausse ;
2. **rotation** — parmi les combinaisons vraies restantes, celle dont les objets ont été attribués le moins souvent gagne ; à usage égal, la plus juste ; à justesse égale, la première du catalogue.

Un poids nul ou négatif ne rend aucune combinaison : rien plutôt que du faux. Un poids que le catalogue n'approche pas à 200 g près reçoit simplement la combinaison admissible la plus juste, répétition comprise — c'est la première passe qui le sert. **[arbitrage non validé]** Une seconde passe relâchant l'admissibilité existe dans le code, mais elle ne se déclenche que si aucune combinaison admissible n'a été trouvée, ce qui ne peut arriver pour un poids strictement positif : un objet courant seul est toujours admissible. Elle est donc morte.

Une **attribution** est rattachée à la pesée la plus récente par date et heure — heure absente valant minuit —, identifiée par cette pesée et par les deux poids qu'elle traduit, arrondis au dixième. La perte totale choisit ses objets en premier ; la dernière perte prend ce qui reste. L'attribution vaut jusqu'à la pesée suivante : chaque nouvelle pesée réattribue, même à poids identique.

**Le compteur d'usage n'avance qu'au changement de pesée**, pas à chaque attribution. Corriger une pesée passée fait bouger les deux pertes sans changer la signature de la pesée la plus récente : l'attribution neuve est alors écrite, mais aucun compteur n'est incrémenté. Une attribution après une pesée compte pour un, et pour un seul.

Une attribution conservée dont la liste d'objets est vide alors que la perte correspondante est strictement positive est tenue pour périmée et recalculée.

> **Exemple.**
>
> Camille a perdu 8,0 kg. Le catalogue doit rendre une combinaison d'un ou deux objets pesant entre 7,8 et 8,2 kg ; si l'un d'eux sert déjà à dire sa dernière perte, la règle d'exclusion en choisit une autre du même intervalle.

**Cas limites**

Taille inconnue ou nulle : l'IMC vaut 0 ; le jeu de noms à rang le dit « inconnu », les deux autres jeux le nomment « Insuffisance pondérale ». Les points d'IMC et la date de franchissement ne se disent pas.

Journal de pesées vide : le poids actif retombe sur le poids de départ, puis sur le poids cible, puis sur 80 kg ; le poids actuel retombe sur le poids de départ. Ni l'un ni l'autre ne se tait.

Journal non vide mais aucune pesée avant le jour demandé : le poids actif prend le poids de départ, puis le poids cible, puis la pesée la plus ancienne, puis 80 kg.

Âge, taille ou genre absents du profil : le métabolisme de base emploie 42 ans, 170 cm et « femme » plutôt que de se taire.

Moins de sept jours de recul : aucune moyenne hebdomadaire n'est rendue, sauf pour l'activité du document de suivi, dont le seuil est désactivé ; les totaux le sont toujours.

Une seule pesée dans un intervalle : aucune cadence sur cet intervalle.

Aucune pesée dans un intervalle, mais des pesées avant et après : le découpage en tranches interpole et rend une variation, là où la cadence bornée se tait.

Deux pesées le même jour : la durée de la perte qu'elles bornent est indéfinie, l'écart valant zéro jour.

Course à pied ou rameur avec une distance : aucune allure ne fait coïncider le calcul par allure et le calcul par intensité modérée.

Plusieurs molécules actives simultanément : la grandeur d'état courant rend 0 avec un drapeau, pas une absence — le même 0 que zéro molécule active.

Toutes les prises datées de plus de soixante jours : la fenêtre de soixante jours cède et l'historique entier forme les groupes ; la concentration, elle, est de toute façon calculée sur l'historique entier.

Deux prises la même journée : elles comptent pour une journée dans la fréquence, pour deux dans le compte de la série.

Une seule journée de prise : aucune fréquence.

Prise ou pesée datée dans l'avenir : écartée des paliers, de la projection, de la série, de la fréquence et des analyses de coïncidence ; le délai depuis la dernière prise devient négatif et se lit comme un délai jusqu'à la prochaine.

Journal de repas vide sur la fenêtre : aucune moyenne, ni de calories, ni de protéines, ni de fibres.

Relevé de pas à zéro, nuit de durée nulle : exclus du numérateur et du dénominateur de leurs moyennes — mais une entrée de sommeil de durée nulle compte quand même une journée au dénominateur du sommeil moyen d'une journée.

Moins de sept paires complètes, ou une série constante : aucun verdict de corrélation.

Poids nul ou négatif : aucune équivalence insolite.

Objectif nul ou négatif : l'avancement vaut 0, ou n'est pas rendu, selon laquelle des trois formes est employée.

Cible au-dessus du poids de départ : l'avancement vaut 0, sauf si la cible est déjà tenue, auquel cas 100.

Sévérité d'effet à 0 : elle est enregistrable et tombe dans le palier « léger ».

## 7. États et transitions

Ce chapitre énumère ce qui, dans le produit, porte un état : ses valeurs possibles, sa valeur initiale, ce qui le fait changer et si le changement se défait. Un état y est toujours une propriété des données — une valeur enregistrée, ou une valeur dérivée par une règle — jamais une apparence.

### Ce qui porte un état

Treize familles d'état sont retenues, sur un seul critère : commander quelque chose — un calcul, une écriture, ou l'ouverture d'une célébration. L'inventaire n'est pas exhaustif et ne prétend pas l'être : le stockage local porte une trentaine de clés `glp1_…` et quelques-unes sans préfixe, dont la plupart ne retiennent qu'une préférence de restitution qu'aucune règle de données ne lit.

| État | Porté par | Nature | Durée de vie |
| --- | --- | --- | --- |
| Activation d'un module de suivi (7) | Un booléen du profil par module | Enregistré dans la sauvegarde | Jusqu'à effacement total |
| Second drapeau d'un module (7) | Un booléen du profil par module | Enregistré dans la sauvegarde | Jusqu'à effacement total |
| Traitement déclaré | Un identifiant de catalogue dans le profil | Enregistré dans la sauvegarde | Jusqu'à effacement total |
| Évaluabilité d'un badge (4) | Rien — lu sur le drapeau d'activation de sa catégorie | Dérivé | Instantané |
| Palier d'un badge (4) | Rien — recalculé à chaque lecture des journaux | Dérivé | Instantané |
| Palier connu d'un badge | Une table identifiant → palier, hors sauvegarde | Enregistré | Jusqu'à effacement total |
| Palier d'IMC signalé | Un entier, hors sauvegarde | Enregistré | Jusqu'à effacement total |
| Paliers nutritifs fêtés du jour | Un couple (date, liste de nutriments), hors sauvegarde | Enregistré, périmé au changement de jour | Jusqu'à effacement total |
| Acceptation de l'avertissement | Une chaîne, hors sauvegarde | Enregistré | Jusqu'à effacement total |
| Session | Le service d'authentification, dans le même stockage local que la sauvegarde | Enregistré | Jusqu'à déconnexion ou effacement total |
| Session en lecture seule | Rien — décidé au chargement | Volatil | Une exécution |
| Ancienneté d'usage et signalement du déverrouillage | Deux clés hors sauvegarde : une date, une chaîne | Enregistré, dérivé au besoin | Jusqu'à effacement total |
| Réglages sans effet sur les données | Des champs du profil | Enregistré dans la sauvegarde | Jusqu'à effacement total |

« Hors sauvegarde » veut dire : conservé à côté du document unique qui porte le profil et les journaux, sous une clé propre. Ces valeurs ne sont pas des données de la personne mais l'état d'un mécanisme ; elles ne partent ni dans une exportation ni dans un partage. Un seul geste les emporte toutes : la suppression du compte, qui efface l'intégralité du stockage local de l'appareil — la session mémorisée comprise, puisqu'elle y vit aussi — puis redémarre l'exécution de zéro.

### Ce qui a déjà eu lieu

Une règle unique décide si une entrée datée compte dans un état dérivé. Elle vaut pour les quatre badges et pour la série du traitement en cours ; elle n'est écrite qu'une fois dans le produit.

```
survenu(date, heure, maintenant) =
    date < aujourd'hui   → vrai
    date > aujourd'hui   → faux
    heure absente        → vrai        // le cas des pas, qui n'ont pas d'heure
    sinon                → heure ≤ heure courante
```

Une entrée saisie à l'avance existe dans son journal et se relit telle quelle ; elle ne commande simplement aucun état dérivé avant son instant. L'ordre d'application compte : le filtre passe *devant* toute coupure, jamais après.

### Un module de suivi

Sept domaines sont modulaires : traitement, effets secondaires, alimentation, pas, activité physique, temps pour soi, sommeil. La pesée n'en est pas un — elle est toujours disponible.

| Module | Drapeau d'activation | Obligatoire au modèle | Absent vaut | Second drapeau |
| --- | --- | --- | --- | --- |
| Traitement | `treatmentTrackingEnabled` | non | allumé | `treatmentModuleHidden` |
| Effets secondaires | `sideEffectsTrackingEnabled` | non | allumé | `sideEffectsModuleHidden` |
| Alimentation | `foodTrackingEnabled` | **oui** | éteint | `foodModuleHidden` |
| Pas | `stepsTrackingEnabled` | **oui** | éteint | `stepsModuleHidden` |
| Activité physique | `sportTrackingEnabled` | **oui** | éteint | `sportModuleHidden` |
| Temps pour soi | `meTimeTrackingEnabled` | non | éteint | `meTimeModuleHidden` |
| Sommeil | `sleepTrackingEnabled` | non | éteint | `sleepModuleHidden` |

Les trois drapeaux obligatoires sont toujours écrits dans une sauvegarde ; les quatre autres sont facultatifs, et leur absence est le cas ordinaire d'un profil ancien. Le repli existe pour les sept, mais il n'est atteignable que par les quatre facultatifs.

L'activation a **deux valeurs** : allumé, éteint. Les sept seconds drapeaux sont des booléens du profil qu'*aucune règle de données ne lit* : ils n'entrent dans aucun calcul, ne conditionnent aucune écriture et ne changent aucun état dérivé. Leur seul effet relève de la restitution et sort du périmètre de ce document. Ils figurent ici parce que la bascule d'activation les écrit, et que leurs règles d'écriture ne sont pas symétriques.

```
allume(m)     = drapeau(m) == null ? (m ∈ {traitement, effets secondaires}) : Boolean(drapeau(m))
secondaire(m) = !allume(m) && Boolean(secondDrapeau(m))   // lu sur l'état effectif, non sur le drapeau nu
```

Valeur initiale d'un profil neuf : traitement et effets secondaires allumés (drapeau non écrit) ; les cinq autres explicitement éteints ; aucun second drapeau écrit.

| Transition | Précondition | Effet sur les données | Réversible |
| --- | --- | --- | --- |
| Allumer explicitement | aucune | Écrit `drapeau = true` **et** `secondDrapeau = false`, dans la même écriture du profil. | oui |
| Éteindre explicitement | aucune | Écrit `drapeau = false`. Le second drapeau n'est pas touché : sa valeur d'avant reprend effet. | oui |
| Allumer implicitement | domaine ∈ {alimentation, pas, activité physique} et drapeau faux ou absent | Écrit `drapeau = true` et rien d'autre, lorsqu'une capacité de saisie ou de consultation du domaine est demandée. Un second drapeau vrai le reste. | oui |
| Basculer le second drapeau | aucune dans les données | Écrit `secondDrapeau = !secondDrapeau`. | oui |

L'allumage implicite ne concerne que ces trois modules. Toutes les demandes n'allument pas : une seconde forme de demande, réservée à la consultation d'un domaine éteint, n'écrit rien du tout. Le traitement, les effets secondaires, le temps pour soi et le sommeil ne s'allument jamais implicitement.

**Invariant.** L'état d'un module ne conditionne aucune donnée : éteindre n'efface rien, ne supprime aucune entrée déjà enregistrée et n'invalide aucun calcul. Les journaux d'un module éteint restent lus par tout ce qui les consulte — la déduction de l'ancienneté d'usage les parcourt tous, et le palier d'un badge se recalcule sur eux dès que sa catégorie redevient évaluable.

**Cas limites**

Allumer explicitement puis éteindre laisse le second drapeau à faux : la valeur qu'il portait avant l'allumage est perdue.

Allumer implicitement puis éteindre laisse le second drapeau tel qu'il était : c'est le seul chemin par lequel un module éteint retrouve la valeur qu'il portait auparavant.

Un second drapeau vrai sous un module allumé est inerte au regard de `secondaire`, mais reste enregistré.

Le second drapeau se lit sur l'état effectif du module, pas sur le drapeau nu : un traitement dont le drapeau d'activation n'a jamais été écrit est allumé, et `secondaire` y rend faux quelle que soit la valeur enregistrée.

Un identifiant de domaine sans drapeau associé — la pesée — donne `allume = vrai` et `secondaire = faux`.

> **Exemple.**
>
> Camille éteint le module Sommeil après trois semaines de saisie. Ses nuits enregistrées restent dans le journal, la déduction de son ancienneté d'usage continue de les voir, et rallumer le module les retrouve toutes.

### Le traitement déclaré

Le profil porte un **identifiant de traitement**, jamais un nom. L'absence de traitement est une valeur du catalogue (`aucun`), pas une valeur absente : il y a donc toujours une réponse.

| Donnée | Type | Valeur initiale |
| --- | --- | --- |
| Traitement du profil | identifiant du catalogue (14 valeurs, `aucun` compris) | `aucun` |
| Traitement d'une prise | identifiant, facultatif au modèle | écrit à l'enregistrement ; jamais absent sur une prise saisie par le produit |

```
traitementDe(fiche) = catalogue[id] ?? catalogue['aucun']        // id inconnu ⇒ « aucun »
traitementResolu(prise, profil) = prise.traitement || profil.traitement || 'aucun'
```

Ce que l'enregistrement écrit dans une prise est `traitementResolu(rien, profil)` : quand le profil dit `aucun`, c'est `aucun` qui est écrit dans la prise. Une prise peut donc porter explicitement l'absence de traitement.

| Transition | Précondition | Effet | Réversible |
| --- | --- | --- | --- |
| Déclarer ou changer | aucune au niveau des données | Écrit l'identifiant dans le profil. Rien d'autre n'est touché. | oui, vers n'importe quel identifiant, `aucun` compris |
| Migrer | au chargement d'une sauvegarde | Convertit en identifiant toute valeur historique du profil et de chaque prise ; un profil sans valeur devient `aucun` ; une prise sans valeur reste sans valeur. | non |
| Enregistrer ou modifier une prise | aucune | Écrit dans la prise l'identifiant du profil *au moment de l'écriture*. | oui, en réécrivant la prise |

**L'attestation d'essai clinique est une garde de saisie, pas un invariant de la donnée.** Une seule fiche du catalogue porte l'exigence — le rétatrutide. Le choix guidé la fait valoir : désigner cette fiche alors qu'elle n'est pas déjà celle du profil demande une attestation explicite avant d'écrire. L'écriture du profil, elle, accepte n'importe quel identifiant sans rien vérifier : aucune règle de données ne garantit qu'une attestation a été donnée. Redéclarer un traitement déjà déclaré ne demande rien, même pour cette fiche : l'exigence porte sur le changement, pas sur la valeur.

**Ce que le changement fait aux dérivés.** Les prises déjà enregistrées gardent leur identifiant. La *série du traitement en cours* se construit en deux temps, et l'ordre est déterminant :

```
1. filtrer le journal des prises sur `survenu` (§ ce qui a déjà eu lieu)
2. trier par date puis heure, l'heure absente valant minuit
3. remonter depuis la fin tant que traitementResolu(prise, profil) == profil.traitement
   → la série est ce suffixe final
```

Le filtre passe devant la coupure, et c'est délibéré : une prise *à venir* relevant d'un autre traitement — un changement déjà saisi à l'avance — vide sinon la série entière, puisque la coupure remonte depuis la dernière ligne. Si la dernière prise **déjà survenue** relève d'un autre traitement que celui du profil, la série est vide. Changer de traitement la vide ; elle repart de la première prise enregistrée sous le nouvel identifiant.

**Cas limites**

Modifier une prise ancienne après un changement de traitement lui donne le traitement *courant* : une prise d'Ozempic corrigée alors que le profil dit Mounjaro devient une prise de Mounjaro.

Une prise sans identifiant est réputée relever du traitement du profil ; sa lecture change donc quand le profil change.

Un identifiant absent du catalogue est lu comme `aucun` plutôt que rejeté.

Revenir à un traitement déjà utilisé ne recolle pas les deux périodes : la série repart de la première prise du retour.

Une prise datée d'aujourd'hui sans heure est réputée survenue et compte dans la série.

> **Exemple.**
>
> Camille déclare Ozempic en mai 2026, puis passe à Mounjaro le 12 août. Ses prises de mai à août gardent l'identifiant `ozempic` ; la série du traitement en cours ne compte plus que les prises postérieures au 12 août. Si elle saisit dès le 10 août sa première prise de Mounjaro datée du 12, la série d'Ozempic reste entière jusqu'au 12 : la prise à venir ne coupe rien.

### Le palier d'un badge

Quatre badges existent. Chacun porte deux états distincts : son **évaluabilité**, qui se lit sur le drapeau d'activation de sa catégorie, et son **palier**, qui n'existe que s'il est évaluable.

| État | Valeurs | Valeur initiale (profil d'usine) | Transition | Réversible |
| --- | --- | --- | --- | --- |
| Évaluabilité | évaluable / non évaluable | activité physique et pas : évaluable ; alimentation : non évaluable | bascule du drapeau d'activation du module | oui |
| Palier | `aucun`, `eveil`, `bronze`, `argent`, `or` — et *pas de palier* quand la catégorie n'est pas évaluable | `aucun` sur des journaux vides | recalcul, à chaque lecture | oui, dans les deux sens |

```
paliers, du plus bas au plus haut : ['aucun', 'eveil', 'bronze', 'argent', 'or']
rang(p) = index de p dans cette liste   // 0 … 4
```

Le palier n'est jamais enregistré : il se recalcule à partir des journaux et de l'instant présent. Il monte et il redescend — une journée qui sort de la période de calcul le fait baisser sans autre geste. Un badge non évaluable n'a pas de palier du tout : il n'est pas calculé, et son palier connu est conservé tel quel.

| Badge | Évaluable si | Éveil | Bronze | Argent | Or |
| --- | --- | --- | --- | --- | --- |
| Kangourou Musclé (activité physique) | drapeau activité physique ≠ faux | ≥ 1 séance survenue aujourd'hui ou hier | équivalent modéré ≥ 120 min sur 10 j | équivalent intensif ≥ 180 min sur 10 j | équivalent intensif ≥ 180 min sur 7 j |
| Lapin des Fibres (alimentation) | drapeau alimentation = vrai | ≥ 25 g de fibres aujourd'hui ou hier | 4 journées sur 7 | 5 journées sur 7 | 7 journées sur 7 |
| Requin protéiné (alimentation) | drapeau alimentation = vrai | seuil protéines atteint aujourd'hui ou hier | 4 journées sur 7 | 5 journées sur 7 | 7 journées sur 7 |
| Hérisson Marcheur (pas) | drapeau pas ≠ faux | ≥ 8 000 pas aujourd'hui ou hier | 3 journées sur 7 | 4 journées sur 7 | 5 journées sur 7 |

```
periode(N)      = [aujourd'hui, … , aujourd'hui − (N−1) jours]   // dates locales
periodeEveil    = periode(2)                                      // aujourd'hui et hier
equivIntensif   = duree × (intensive 1 | moderee 0,67 | douce 0,33)
equivModere     = duree × (intensive 1,5 | moderee 1 | douce 0,5)
seuilProteines  = round(poidsActuel × 1,5) g      // le PROFIL N'EST PAS LU
seuilFibres     = 25 g                            // en dur
palier          = premier seuil satisfait en descendant : or, argent, bronze, eveil, sinon aucun
```

**Les deux seuils nutritionnels des badges ne sont pas les objectifs du profil.** Le profil porte `dailyProteinGoal` et `dailyFiberGoal`, tous deux facultatifs, dont l'absence vaut respectivement `round(poids actuel × 1,5)` et 25 g ; ce sont eux que lit le reste du produit. Les badges, eux, recalculent les deux valeurs par défaut et ignorent les champs du profil : un objectif protéines fixé à 110 g ne change aucun palier. Les deux valeurs coïncident tant que la personne n'a rien fixé.

`poidsActuel` est la *dernière ligne* du journal des pesées — le dernier élément de la suite, non la pesée la plus récente par date ; à défaut le poids de départ ; à défaut 70 kg. Le total d'une journée est la somme des entrées portant cette date, filtrées par `survenu`.

**Cas limites**

Les deux badges d'alimentation exigent le drapeau *strictement* vrai, tandis que les deux autres se contentent d'un drapeau *non faux*. Les trois drapeaux concernés étant obligatoires au modèle et toujours écrits, la différence ne se manifeste jamais sur une sauvegarde chargée.

La condition d'évaluation lit le drapeau d'activation nu, et rien d'autre : le second drapeau du module n'y entre pas.

Le palier éveil se calcule sur deux jours et les autres sur sept ou dix : un palier supérieur atteint l'emporte, l'éveil n'est donc pas un passage obligé.

Aucune période ne remonte au-delà de dix jours : un historique ancien ne maintient aucun palier.

> **Exemple.**
>
> Camille, 96 kg au départ et 88,4 kg à sa dernière pesée, a pour seuil de badge round(88,4 × 1,5) = 133 g de protéines par jour. Quatre journées à 140 g sur les sept derniers jours lui donnent le palier bronze du Requin protéiné ; une seule journée sortie de la période le ramène à éveil si l'une des deux dernières journées tient encore le seuil, à `aucun` sinon.

### La mémoire des paliers

À côté des paliers calculés, le produit retient le **dernier palier observé** de chaque badge : une table identifiant de badge → palier, enregistrée hors de la sauvegarde. C'est elle, et non le palier lui-même, qui décide de ce qui se célèbre.

Valeur initiale : table absente, c'est-à-dire aucun badge observé. Une passe d'évaluation rejoue **à chaque écriture de la sauvegarde** — une pesée, un repas, un pas, un réglage de profil — et non une fois par ouverture ; c'est ce qui permet la célébration au moment même où la saisie fait monter un palier. Au premier passage d'une exécution, l'état connu est lu dans le stockage ; ensuite il est celui que la passe précédente a rendu.

```
suivants = { …connus }                       // on PART du connu, on ne le reconstruit pas
pour chaque badge dont la catégorie est évaluable :
    p = palier(badge)
    suivants[badge] = p                      // écrit d'abord, sans comparer
    si connus[badge] est absent            → rien à célébrer   (découverte)
    sinon si rang(p) > rang(connus[badge]) → à célébrer        (progression)
    sinon                                  → rien à célébrer   (stable ou baisse)
```

| Situation | Palier connu après la passe | Célébration |
| --- | --- | --- |
| Badge jamais observé, quel que soit son palier | écrit | non |
| Palier observé qui monte | écrit | oui, une fois |
| Palier observé qui baisse | écrit | non |
| Catégorie non évaluable | inchangé, conservé | non |
| Catégorie redevenue évaluable au même palier | réécrit à la même valeur | non |
| Catégorie redevenue évaluable à un palier supérieur | écrit | oui, une fois |

Deux conséquences tiennent de ce seul critère, sans cas particulier. Une installation qui démarre sur un historique déjà fourni ne célèbre rien : les quatre badges sont des découvertes. Éteindre puis rallumer une catégorie ne rejoue pas une célébration déjà eue, y compris après une fermeture, parce que le palier connu traverse l'extinction.

**Cas limites**

Une entrée de la table dont la valeur n'est pas un palier connu est ignorée à la lecture, badge par badge : le badge redevient « jamais observé » et sa prochaine évaluation est une découverte.

Une table absente et une table vide se comportent identiquement.

Un palier qui baisse puis remonte au même niveau se célèbre de nouveau : la remontée est une progression réelle.

La passe ne compare rien avant d'écrire : seul un badge non évaluable laisse son entrée intacte.

### Les autres mémoires de célébration

Deux mécanismes de la même famille exacte que la mémoire des paliers vivent hors de la sauvegarde, sous leur propre clé, et retiennent ce qui a déjà été signalé.

**Le palier d'IMC signalé.** Un entier enregistré comme chaîne ; clé absente vaut 99, c'est-à-dire rien de signalé.

```
imc         = round(poidsCourant / taille² × 10) / 10      // taille en m, 170 cm à défaut
poidsCourant = pesée la plus récente par (date, heure) décroissantes, à défaut le poids de départ
poidsPrecedent = pesée suivante dans ce tri, à défaut le poids de départ
paliers d'IMC, par index : 0 < 18,5 ≤ 1 < 25 ≤ 2 < 30 ≤ 3 < 35 ≤ 4 < 40 ≤ 5 ; 99 si imc ≤ 0
célébrer et écrire l'index courant si :
    imc ≥ 19  et  index courant ≠ 99  et  index précédent ≠ 99
    et index courant < index précédent  et  index courant < index signalé
```

La passe rejoue à chaque changement du journal des pesées ou de la taille. L'index signalé ne se réécrit qu'en baissant : reprendre du poids puis en reperdre ne resignale pas un palier déjà signalé. La transition est irréversible hors effacement total.

**Les paliers nutritifs du jour.** Un couple `{date, nutriments}`, où `nutriments` est une partie de `{proteines, fibres}` ; clé absente vaut rien de fêté. La passe compare les totaux du jour aux objectifs du profil — `dailyProteinGoal ?? round(poids × 1,5)` et `dailyFiberGoal ?? 25`, et non les seuils des badges.

```
dejaFetes = (etat ≠ null et etat.date == jour) ? etat.nutriments : []
atteint(total, reco) = reco > 0 et total ≥ reco
aFeter    = les nutriments atteints qui ne sont pas dans dejaFetes
etat      = { date: jour, nutriments: dejaFetes + aFeter }
```

Les deux nutriments sont indépendants : le même jour peut n'en fêter aucun, un seul, ou les deux. Un jour qui change périme l'état entier par une seule comparaison de dates. Une recommandation nulle ou négative ne se franchit pas. Le mécanisme est écrit et testé, mais aucune capacité ne l'appelle : rien ne l'évalue aujourd'hui. **[non implémenté]**

**Cas limites**

Un état dont la forme n'est pas celle attendue est lu comme absent ; à l'intérieur, une valeur qui n'est ni `proteines` ni `fibres` est écartée une à une.

Un IMC nul ou négatif — taille absurde — donne l'index 99 et bloque toute célébration, dans les deux sens de la comparaison.

Le poids courant de l'IMC est la pesée la plus récente *par date*, contrairement au poids courant des badges, qui est la dernière ligne de la suite.

> **Exemple.**
>
> Camille, 168 cm, passe de 88,4 kg à 82,5 kg : son IMC descend de 31,3 (index 3) à 29,2 (index 2). La baisse d'index se signale une fois et l'index 2 est écrit. Remonter à 30,5 puis redescendre à 29,0 ne signale plus rien.

### L'acceptation de l'avertissement

Un drapeau unique, enregistré hors de la sauvegarde, dit si l'avertissement médical a été accepté. Deux valeurs seulement : accepté, non accepté.

| Valeur enregistrée | Signification |
| --- | --- |
| `"true"` | accepté |
| toute autre valeur, ou clé absente | non accepté |

Valeur initiale : non accepté. Aucune donnée ne dépend de ce drapeau : aucun calcul ne le lit, aucune écriture ne l'exige, et rien ne se perd s'il reste à « non accepté ». Sa seule conséquence est une condition de restitution, hors périmètre.

| Transition | Précondition | Effet | Réversible |
| --- | --- | --- | --- |
| Accepter | attestation explicite de lecture | Écrit le drapeau à `"true"`. | non |
| Demander de nouveau le texte | accepté | Aucun. Aucune écriture, et aucun refus possible. | sans objet |
| Supprimer le compte | voir la session | Efface tout le stockage local, ce drapeau compris : l'acceptation redevient à donner. | non |

**Cas limites**

L'acceptation est propre à l'appareil : elle n'est pas attachée au compte et ne suit pas une connexion sur un autre appareil.

Le drapeau vaut une chaîne nue et non une valeur structurée : une réécriture au format JSON, qui ajouterait les guillemets à la chaîne, serait lue comme « non accepté ».

### La session

Le produit se verrouille derrière un compte lorsque, et seulement lorsque, le champ `apiKey` de la configuration d'authentification est non vide. Cette configuration est écrite en dur dans une source du dépôt, et non fournie à l'exécution : elle est aujourd'hui remplie, le verrou est donc actif. Ce n'est pas un état modifiable en cours d'usage.

| Verrou | États possibles |
| --- | --- |
| inactif (`apiKey` vide) | un seul état : ouvert, sans compte. Aucune identité, aucune écriture distante. |
| actif | `restauration` → `déconnecté` \| `connecté {identifiant: chaîne, e-mail: chaîne ou nul, nom: chaîne ou nul}` |

Les trois champs du compte connecté sont toujours présents ; les deux derniers peuvent valoir nul. Valeur initiale, verrou actif : `restauration`. La session précédente est mémorisée par le service d'authentification, dans le même stockage local que la sauvegarde, et restaurée au démarrage ; la transition suivante est donc automatique et ne demande rien.

| Transition | Précondition | État atteint | Réversible |
| --- | --- | --- | --- |
| Restauration terminée | — | `connecté` ou `déconnecté` | sans objet |
| Se connecter par e-mail | couple e-mail / mot de passe non vides, compte préexistant | `connecté` | oui |
| Se connecter par fournisseur externe | — | `connecté`, le compte étant créé au passage s'il n'existait pas | oui |
| Se déconnecter | `connecté` | `déconnecté`, puis redémarrage de l'exécution | oui |
| Supprimer le compte | `connecté`, et session récente | compte détruit, puis stockage local effacé, puis redémarrage de l'exécution | non |

Le produit n'offre aucune capacité de création de compte par e-mail et mot de passe. Le chemin du fournisseur externe en crée un implicitement à la première connexion d'une adresse inconnue : c'est le comportement du service d'authentification, que rien ne bride ici.

**Ordre imposé de la suppression.** Le compte est détruit d'abord, les données ensuite. Tant que la destruction n'a pas réussi, aucune donnée n'est touchée. Deux refus sont distingués : aucune session courante, et session trop ancienne. Le second ouvre une transition à part entière — déconnexion, puis redémarrage complet de l'exécution, la suppression étant à reprendre depuis une session fraîche. Après une suppression réussie, l'état final décrit ci-dessus n'est jamais observé : l'exécution se termine et tout l'état volatil part avec elle, la session en lecture seule comprise.

**Invariant.** Aucune donnée de suivi ne dépend de la session : profil, journaux, paliers connus, acceptation et ancienneté vivent sur l'appareil, non dans le compte. Se déconnecter et se reconnecter avec un autre compte, sur le même appareil, retrouve exactement les mêmes données.

**Cas limites**

Verrou inactif : la suppression du compte n'a pas de compte à détruire ; elle efface le stockage local, puis redémarre l'exécution.

La session mémorisée vit dans le même stockage que les données : l'effacement total l'emporte aussi.

L'état `restauration` n'est jamais atteint deux fois dans une exécution.

### La session en lecture seule

Le chargement de la sauvegarde a trois issues, et la troisième change l'état de toute l'exécution.

| Issue du chargement | Données | Écriture |
| --- | --- | --- |
| Sauvegarde absente | profil d'usine, journaux vides, pesée de départ semée à 95,0 kg | autorisée |
| Sauvegarde lisible | profil et journaux restaurés, migrations appliquées | autorisée |
| Sauvegarde illisible | identique à l'absence : profil d'usine, journaux vides, pesée de départ semée à 95,0 kg — les deux branches tombent sur le même repli | **interdite pour toute l'exécution** |

Valeur initiale : écriture autorisée. La transition vers la lecture seule est unique, automatique et sans retour possible avant un rechargement.

```
si l'analyse de la sauvegarde échoue :
    si la clé de secours « <clé>__secours » est ABSENTE → y recopier la sauvegarde brute, telle quelle
    marquer la session en lecture seule
    plus aucune écriture du document de sauvegarde n'a lieu
```

La condition porte sur l'absence de la clé, non sur son contenu : une clé de secours portant une chaîne vide empêcherait le sauvetage. Elle ne s'écrit donc qu'une fois — un second échec ne recouvre pas le premier sauvetage, qui porte les vraies données. Rien n'est perdu, rien n'est écrasé ; le produit fonctionne sur des données vides plutôt que d'effacer ce qu'il n'a pas su lire. L'échec du sauvetage lui-même n'empêche pas le passage en lecture seule.

**Cas limites**

La lecture seule ne concerne que le document de sauvegarde. Les valeurs conservées sous d'autres clés — paliers connus, palier d'IMC signalé, acceptation, date de première ouverture — restent écrites.

La pesée de départ semée sur une sauvegarde illisible n'est jamais persistée, puisque plus rien ne s'écrit : elle disparaît à la fin de l'exécution.

Si le stockage lui-même est indisponible, toute écriture échoue en silence : aucun état ne se retient d'une exécution à l'autre, et l'acceptation de l'avertissement est redemandée à chaque ouverture.

### L'ancienneté d'usage

Deux valeurs hors sauvegarde : une **date de première ouverture** et un drapeau disant si le franchissement du seuil a déjà été signalé. L'ancienneté s'en dérive, et vaut **verrouillé** tant que sept jours entiers ne se sont pas écoulés, **déverrouillé** ensuite.

```
premiereOuverture = date enregistrée
                    ?? plus ancienne date de TOUS les journaux, si elle est ≤ aujourd'hui
                    ?? aujourd'hui
anciennete   = max(0, jours entiers entre premiereOuverture et aujourd'hui)   // dates locales
deverrouille = anciennete ≥ 7
```

La date retenue est écrite une fois pour toutes, dès la première ouverture qui la calcule ; la déduction ne se refait jamais. Une entrée datée dans le futur n'est pas retenue comme origine — l'ancienneté serait négative. Les neuf journaux sont parcourus, ceux des modules éteints compris : une donnée est une preuve de présence. Ce que le déverrouillage ouvre relève de la restitution et sort du périmètre.

| Transition | Déclencheur | Réversible |
| --- | --- | --- |
| Poser la date de première ouverture | une ouverture sans date enregistrée | non, sauf suppression du compte |
| verrouillé → déverrouillé | écoulement du temps : le septième jour | non, sauf suppression du compte |
| Marquer le franchissement signalé | la **fermeture** de la célébration par la personne, et non son ouverture | non, sauf suppression du compte |

La suppression du compte efface les deux clés comme le reste du stockage : la date se redéduira, et l'ancienneté se reverrouillera si aucun journal ne subsiste — ce qui est le cas, puisque la sauvegarde part avec.

**Cas limites**

Vider tous les journaux ne reverrouille pas : la date est enregistrée, elle ne se redéduit plus.

Six jours et vingt-trois heures ne font pas sept jours : la comparaison porte sur des dates locales, pas sur des durées.

Une installation qui porte déjà des mois de données est déverrouillée dès la première ouverture, par la déduction sur les journaux.

Quitter sans fermer la célébration laisse le drapeau à zéro : elle reviendra à l'ouverture suivante.

> **Exemple.**
>
> Camille installe l'application le 20 mai 2026 et y importe aussitôt une pesée du 3 mai. La date de première ouverture retenue est le 3 mai : l'ancienneté vaut dix-sept jours et le seuil est franchi immédiatement.

### Les états sans effet sur les données

Plusieurs champs du profil sont enregistrés et modifiables sans qu'aucune règle de données ne les lise : ils ne conditionnent ni un calcul, ni une écriture, ni un état dérivé. Deux règles les excluent du reste de ce chapitre — un champ dont le seul effet est une condition de restitution n'y a pas sa place, et un champ qui ne se règle que depuis la surface d'administration est hors périmètre déclaré. Les voici néanmoins nommés, avec leurs valeurs et leurs défauts.

| État | Valeurs | Valeur initiale | Ce qu'il commande |
| --- | --- | --- | --- |
| Rappel de prise | actif / inactif, plus une périodicité hebdomadaire (jour, heure) ou libre (tous les N jours, date de départ, heure) | inactif ; jour = dimanche ; heure = 20:00 ; N = 7 | rien : aucun planificateur ne le lit **[non implémenté]** |
| Rappel de rendez-vous médical | actif / inactif, plus date, heure, praticien, délai ∈ {1 h, 2 h, 1 j, 2 j, 3 j, 7 j} | inactif ; heure = 10:00 ; délai = 1 j | rien **[non implémenté]** |
| Second drapeau d'un module (7) | booléen facultatif | absent, donc faux | rien dans les données ; une condition de restitution |
| `mysteryBadgeHidden` | booléen facultatif | absent, donc faux | rien dans les données ; une condition de restitution, à polarité inversée à la lecture **[arbitrage non validé]** |
| Cinq interrupteurs d'administration | `quickAddEnabled`, `insoliteLibraryEnabled`, `deleteAllButtonsEnabled`, `homeCornerButtonsEnabled`, `colorblindModeEnabled` | les deux premiers écrits à faux ; les trois autres absents, donc faux | rien dans les données ; hors périmètre |

### Ce que la V2 décide autrement

La V2 tranche à rebours sur quatre points ; ce qu'elle dit prévaut. **[V2]**

| Sujet | V1 | V2 |
| --- | --- | --- |
| Persistance | Tout état survit à la fermeture, dans le stockage de l'appareil. | Aucun état n'est enregistré : réponses et rang se perdent entièrement à un rechargement. Aucun des états persistés ci-dessus n'existe encore. |
| Absence de traitement | Une valeur du catalogue, `aucun`. | Trois réponses liées : un booléen « traitement commencé » (vrai par défaut, jamais nul), une forme (`injection` \| `comprime`) et une spécialité, les deux dernières nulles tant qu'elles ne sont pas données. Répondre « non » remet forme et spécialité à nul ; changer de forme remet la spécialité à nul. |
| Catalogue | 14 entrées, dont `aucun` ; une entrée exige une attestation d'essai clinique ; chaque entrée porte paliers de dose et paramètres cinétiques. | 13 entrées, aucune entrée d'absence, aucune attestation, aucune posologie ni cinétique : identifiant, nom et forme seulement. Chaque forme finit par « Autre ». |
| Modules, badges, avertissement, compte | Sept modules, quatre badges, un avertissement à accepter, un verrou de session actif. | Ni modules, ni badges, ni avertissement. Le compte existe à moitié : une adresse et un mot de passe sont recueillis dans les réponses, une seule règle les contraint — huit signes au moins —, aucun service d'authentification n'est appelé et rien n'est persisté. |

La V2 porte en revanche un état que la V1 n'a pas : le couple **(réponses, rang)** du questionnaire d'entrée. Neuf questions le composent, dont deux conditionnelles — le poids visé, retenu si l'objectif est de perdre ; la forme et la spécialité du traitement, retenues si le traitement est commencé.

| Donnée | Type | Valeur initiale | Transitions |
| --- | --- | --- | --- |
| Réponses | un enregistrement de champs typés | chaque champ a son défaut ; le traitement est réputé commencé, sa forme et sa spécialité nulles | un champ remplacé à la fois, sauf trois gestes liés : la langue repose les unités, « non » au traitement remet forme et spécialité à nul, changer de forme remet la spécialité à nul |
| Rang | entier ≥ 0 | 0 | `avancer` : `min(rangBorné + 1, retenues − 1)` ; `reculer` : `max(rangBorné − 1, 0)` |

```
retenues  = les étapes dont la condition est vraie pour ces réponses, dans l'ordre
rangBorne = min(rang, retenues.length − 1)      // borné à chaque lecture, pas à l'écriture
etape     = retenues[rangBorne]
```

Le bornage est relu à chaque lecture : une réponse qui raccourcit la liste ramène le rang sur la dernière étape retenue au lieu de le laisser hors des bornes. Reculer n'efface aucune réponse. **Deux étapes bloquent l'avancée**, et non une : celle qui demande quel traitement — tant que la forme ou la spécialité manque — et la dernière, celle du compte, si un mot de passe entamé fait moins de huit signes ; un mot de passe vide ne bloque pas. L'étape qui demande *si* le traitement est commencé ne bloque jamais, sa réponse étant retenue d'avance.

## 8. Persistance, effacement, portabilité

Tout ce que le produit retient tient sur l'appareil, dans un magasin de paires clé-valeur, et n'en sort que par un geste explicite. Ce chapitre dit ce qui est conservé, sous quelle forme, ce qui arrive quand la lecture ou l'écriture échoue, ce que l'effacement emporte et dans quel ordre, et ce qui franchit ou ne franchit jamais la limite de l'appareil.

### Le document unique

Le profil et les journaux forment un seul document, sérialisé en JSON, conservé sous une seule clé : `glp1_app_companion_data`. Il n'a ni numéro de schéma, ni horodatage, ni signature : les conversions de chargement se reconnaissent à la forme des données, pas à une version déclarée. Il est conservé en clair.

| Propriété | Type | Cardinalité | Contenu |
| --- | --- | --- | --- |
| `profile` | objet | 1, obligatoire | identité, corps, cible, avatar, rappels, drapeaux des sept suivis activables, traitement en cours (identifiant du catalogue) |
| `weightHistory` | liste | 0..n, obligatoire | pesées, dont au plus une porte le drapeau de pesée de départ |
| `dailyLogs` | liste | 0..n, obligatoire | journal quotidien hérité |
| `injectionHistory` | liste | 0..n, obligatoire | prises : dose, traitement, zone |
| `savedMeals` | liste | 0..n, facultative | repas et en-cas, leur composition et leurs valeurs nutritionnelles |
| `sideEffectHistory` | liste | 0..n, facultative | effets ressentis : type, intensité 1–5, note libre |
| `stepLogs` | liste | 0..n, facultative | pas comptés par jour |
| `sportLogs` | liste | 0..n, facultative | séances : sport, durée, calories |
| `meTimeLogs` | liste | 0..n, facultative | moments pour soi |
| `sleepLogs` | liste | 0..n, facultative | nuits et siestes |

« Facultative » se lit à la lettre : la propriété peut être absente du document, et l'absence ne vaut pas liste vide pour qui la relit — toute lecture retombe sur une liste vide elle-même. Rien de dérivable n'y est conservé, à une exception assumée : un repas garde les valeurs nutritionnelles calculées à son enregistrement (calories, protéines, glucides, lipides, fibres), recalculées à chaque modification.

Ce document ne contient pas : la base des aliments et recettes personnalisés, les repas mis en favori, les compteurs de sélection d'aliments, les listes de sports, d'effets et de moments suivis, les paliers déjà franchis, les compteurs d'objets ludiques, les retours et les réponses au questionnaire, l'acceptation du cadre médical, ni aucune préférence de restitution. Chacun de ces ensembles a sa propre clé.

### Ce qui vit hors du document

| Clé | Forme | Contenu |
| --- | --- | --- |
| `glp1_user_custom_foods` | JSON, liste | aliments et recettes créés ; seul ensemble portant un lien référentiel (une recette vers ses ingrédients) |
| `glp1_favorite_meals` | JSON, liste | compositions mises de côté pour être rejouées |
| `glp1_food_selection_counts` | JSON, dictionnaire | nombre de fois qu'un aliment a été retenu |
| `glp1_active_sports`, `glp1_active_side_effects`, `glp1_active_me_time` | JSON, listes de chaînes | ce qui est suivi dans chacun des trois catalogues |
| `glp1_badge_tiers_connus` | JSON, dictionnaire | dernier palier observé par distinction, pour ne fêter qu'une fois |
| `glp1_paliers_nutritifs_fetes` | JSON | paliers nutritionnels déjà salués |
| `glow_ludic_usage` | JSON, objet | compteurs par objet et assignation courante (signature de la pesée, deux pertes en kilos, deux décompositions) |
| `glp1_first_open_date` | chaîne `AAAA-MM-JJ` | premier jour d'usage, posé une fois |
| `glp1_dynamique_celebrated` | chaîne `'true'` | déblocage déjà salué |
| `glp1_notified_bmi_tier_index` | chaîne d'un entier | dernier palier d'IMC signalé ; absent vaut 99 |
| `hasAcceptedMedicalDisclaimer_v1` | chaîne `'true'` | acceptation du cadre médical |
| `glp1_meal_edit_notice_dismissed` | chaîne `'true'` | avertissement de modification écarté |
| `steps_custom_start_date` | chaîne | origine choisie pour le cumul des pas |
| `glow_report_include_v2` | JSON, objet | les huit sections retenues pour le prochain bilan ; paramètre de ce qui sortira de l'appareil |
| `glp1_user_feedbacks` | JSON, liste | retours écrits : type, ressenti, catégorie, message, instant d'envoi, consentement de recontact |
| `glp1_user_survey_v2` | JSON, objet | sept notes 0–5, suggestion libre, journal des envois (instants en millisecondes, deux jours gardés) |
| `glp1_user_survey` | JSON, objet | format antérieur du questionnaire : lu en repli, jamais réécrit |
| `glp1_send_cap_alert` | chaîne `identifiant:AAAA-MM-JJ` | jour où l'alerte de plafond d'envoi est déjà partie |
| clés de restitution (`glp1_period_…`, `glp1_view_…`, `glp1_*_history_view`, `glow_theme_…`, `glow_home_…`, `glow_menu_…`, `glow_trend_flips`, `glow_home_equivalences`) | JSON ou chaîne nue | préférences de restitution ; aucune n'a d'effet sur les données. Hors périmètre de ce document |
| `glp1_meals_cleared`, `glp1_last_celebrated_weight`, `glp1_last_celebrated_weight_id` | chaînes nues | héritées : plus jamais écrites, jamais lues, conservées seulement pour être emportées par l'effacement total |
| `<clé>__secours`, `<clé>__secours-<horodatage>`, `<clé>__secours-index` | chaînes brutes et JSON | copies de secours du document unique et leur inventaire |

Deux conventions d'accès coexistent et ne sont pas interchangeables : une valeur écrite en JSON se relit en JSON, une chaîne nue se relit telle quelle. Faire passer un drapeau `'true'` par la voie JSON le réécrirait `"true"` et rendrait illisible ce qui est déjà conservé sur les appareils. Le choix de la voie est donc fixé par clé, et ne se change pas.

### Quand l'écriture a lieu

Le document unique est réécrit intégralement à chaque changement de son contenu, y compris au tout premier instant qui suit un chargement réussi. Il n'y a ni écriture différée, ni écriture partielle, ni journal d'opérations : la dernière écriture gagne, et une écriture porte tout le document. Les ensembles hors du document suivent la même règle, chacun pour sa clé.

L'écriture peut échouer sans que rien ne le signale : magasin indisponible, place épuisée. La couche d'accès avale l'erreur — une lecture ratée rend « absent », une écriture ratée ne rend rien. Une seule capacité corrige ce silence, en relisant ce qu'elle vient d'écrire et en comparant à l'octet près.

**Cas limites**

- Magasin indisponible : chaque lecture rend « absent », donc les valeurs par défaut ; le produit fonctionne, sans rien conserver.
- Une valeur illisible sous une clé secondaire vaut valeur par défaut, sans trace ni copie de secours ; seul le document unique bénéficie du garde-fou.
- Deux exécutions simultanées du produit sur le même appareil écrivent la même clé sans arbitrage : la dernière écrase.

### Le chargement et ses conversions

Le document est lu comme une chaîne, puis analysé, afin de distinguer un document absent d'un document illisible — les deux mènent à des états vides, mais pas aux mêmes conséquences. L'analyse réussie, une chaîne de conversions s'applique, dans cet ordre, toutes idempotentes : les rejouer sur un document déjà converti ne le change plus.

| # | Conversion | Effet |
| --- | --- | --- |
| 1 | Retrait des ensembles supprimés | le suivi hydrique et les objectifs de poids à paliers quittent le document, ainsi que trois drapeaux du profil qui leur appartenaient |
| 2 | Complétion du profil | le profil lu recouvre le profil d'usine, propriété par propriété ; l'avatar est fusionné de la même façon |
| 3 | Écart des repas d'avant la bascule | un repas est retenu si et seulement s'il porte une liste de composants ; le critère est l'absence de la liste, jamais une liste vide |
| 4 | Retrait des lignes de démonstration | neuf journaux traversés ; une ligne part si son identifiant commence par l'un des cinq préfixes de démonstration |
| 5 | Passage des traitements aux identifiants | le profil et chaque prise portaient un libellé, ils portent un identifiant du catalogue ; un profil sans correspondance retombe sur « aucun traitement » ; une prise sans traitement en reste dépourvue, ce qui signifie « celui du profil » |
| 6 | Purge des lignes marquées supprimées | sept journaux traversés ; les lignes marquées quittent le document et la marque est retirée des autres. Irréversible : les lignes marquées étaient déjà inaccessibles |
| 7 | Fusion des deux textes libres d'un effet | l'ancien texte se replie dans la note ; la note l'emporte quand les deux existent ; un texte vide vaut absence de note |
| 8 | Fusion de deux noms de sport | deux libellés désignant le même sport n'en font plus qu'un ; sans quoi les séances retomberaient sur le repli du catalogue et leurs calories changeraient après coup |
| 9 | Complétion des deux niveaux de faim d'un repas | une ligne qui porte déjà ses deux valeurs n'est jamais retouchée ; sinon les deux se déduisent du moment de la journée, de la taille du repas et de l'identifiant de la ligne — donc stables d'un chargement à l'autre |
| 10 | Assurance de la pesée de départ | le drapeau est posé sur toutes les pesées, vrai sur une seule ; si aucune ne le porte et que l'ancien profil déclarait un poids de départ, une pesée est créée à 08:00, à la date déclarée ou la veille de la plus ancienne |

Document absent : le produit part du profil d'usine et d'une seule pesée, marquée départ, à 95,0 kg, datée de la veille à 08:00 ; les autres journaux sont vides. Cette pesée existe parce que la perte totale, les distinctions et le bilan n'auraient sinon aucune référence.

> **Exemple.**
>
> Le document de Camille a été écrit avant l'arrivée des identifiants de traitement : son profil porte le libellé « Ozempic » et douze prises aussi. Au premier chargement, tous deviennent l'identifiant `ozempic`, et le document réécrit ne contient plus un seul libellé. Le chargement suivant traverse la même conversion sans rien changer.

### Quand le document ne se lit pas

Une lecture ratée ne doit jamais détruire ce qu'elle n'a pas su lire. Trois effets, ensemble :

```
lecture échouée →
  1. copie brute sous « <clé>__secours », UNE seule fois (si la clé est libre)
  2. aucune écriture de toute la session : mayPersist(chargementRaté) = faux
  3. l'état est déclaré : rien n'est perdu, rien ne sera enregistré
```

Le produit fonctionne alors sur des données vides — profil d'usine et pesée de départ semée — sans jamais les conserver. La session redevient normale au redémarrage suivant, dont la lecture échouera de nouveau tant que le document reste illisible.

**Cas limites**

- Un second échec ne recouvre pas le premier sauvetage : la clé de secours ne s'écrit que si elle est libre, et c'est la première copie qui porte les vraies données.
- La copie de secours ne peut être remise en place par aucune capacité offerte à la personne : elle existe pour être récupérable, pas pour être restaurée depuis le produit. **[non implémenté]**
- Si l'écriture de la copie échoue elle aussi, la session reste en lecture seule : le refus d'écrire ne dépend pas de la réussite du sauvetage.

> **Exemple.**
>
> Le document de Camille est tronqué. Au démarrage suivant, elle retrouve une pesée de départ à 95,0 kg datée de la veille — un chiffre qui ressemble à ses 96 kg de mai 2026 sans en être un. Ses données réelles sont intactes sous `glp1_app_companion_data__secours`, et rien de ce qu'elle enregistrerait pendant cette session ne serait conservé.

### Les copies de secours

Une capacité met le document courant à l'abri avant qu'il ne soit remplacé. La copie porte un horodatage local, à la seconde, et aucune copie n'en recouvre jamais une autre.

| Élément | Forme | Règle |
| --- | --- | --- |
| Horodatage | `AAAA-MM-JJ-HHMMSS` | heure locale, jamais universelle : une copie faite à 00 h 30 porte le jour vécu |
| Clé de la copie | `<clé>__secours-<horodatage>` | si prise, un suffixe `-n` est essayé de 2 à 99, puis l'instant en millisecondes |
| Inventaire | `<clé>__secours-index`, liste JSON | une entrée par copie : clé, horodatage, motif en clair, taille en caractères ; ordonnée du plus récent au plus ancien ; inventaire illisible vaut inventaire vide |
| Vérification | relecture | la mise à l'abri n'est déclarée réussie que si la copie relue est identique à l'original, caractère pour caractère |
| Source vide | — | rien à copier n'est pas un échec : la mise à l'abri réussit sans produire d'entrée |

Deux capacités s'appuient dessus. **Écrire sous protection** : mettre à l'abri, puis écrire, puis relire ; si la mise à l'abri échoue, rien n'est écrit. **Remettre une copie** : lire la copie, mettre l'état courant à l'abri sous le motif « Avant restauration », puis écrire et relire ; si l'une des deux vérifications échoue, l'état antérieur est intact. Les copies ne sont jamais effacées automatiquement : elles s'accumulent, et c'est assumé.

**Cas limites**

- Deux copies dans la même seconde : le suffixe numérique les sépare ; au-delà de 99, l'instant en millisecondes.
- Une copie référencée par l'inventaire mais absente du magasin : la remise échoue et ne touche à rien.
- Les copies comptent dans la place occupée : plus il y en a, plus tôt la place manque.
- Ces deux capacités ne sont déclenchées que depuis l'espace d'administration, hors périmètre ; le modèle, lui, les porte.

> **Exemple.**
>
> Le 18 août 2026 à 14 h 32 min 05 s, l'état de Camille est mis à l'abri sous `glp1_app_companion_data__secours-2026-08-18-143205`, et l'inventaire retient le motif et la taille de la copie.

### Quand la place manque

Le magasin a une capacité bornée — de l'ordre de cinq mégaoctets sur le socle actuel — et rien ne prévient de son approche. Trois ans de journaux en occupent une bonne part. La conséquence est une écriture qui échoue en silence, indistinguable d'une écriture réussie pour qui ne relit pas.

La seule parade est la relecture. Une capacité qui remplace le document ne se déclare réussie qu'après avoir relu et comparé ; à défaut, elle refuse, l'état antérieur est intact, et la personne est informée de ce qu'il faut libérer.

**Cas limites**

- Les écritures ordinaires du document unique ne relisent pas : une saisie perdue faute de place ne se signale pas. **[arbitrage non validé]**
- Une copie de secours qui ne tient pas en place fait échouer le geste qu'elle protégeait, jamais l'inverse.

### Effacer

Supprimer supprime : aucune ligne n'est marquée, aucune n'est conservée hors de vue. Une suppression retire la ligne de sa liste par identifiant, et le document réécrit ne la contient plus.

| Geste | Portée | Ce qui survit |
| --- | --- | --- |
| Supprimer une ligne | un journal | tout le reste ; rien n'est récupérable |
| Vider le journal des pesées | toutes les pesées | **la pesée de départ**, épargnée : elle est la référence de la perte totale, des distinctions et du bilan |
| Vider un autre journal | prises, effets, pas, séances, moments, sommeil, repas | rien de ce journal ; la liste devient vide |
| Retirer les favoris | la clé entière | — |
| Supprimer un aliment | la base personnalisée | refusé si une recette l'utilise comme ingrédient ; le refus nomme les recettes concernées |
| Supprimer un retour | l'inventaire local des retours | l'envoi distant déjà parti, qui n'est pas repris |
| Tout effacer | l'appareil entier | rien |

**L'ordre de l'effacement total est fixe, et il est le sujet.**

```
1. si un compte distant existe → le supprimer
     échec → RIEN n'est effacé, l'état antérieur est intact, la cause est dite
2. effacer le magasin local en une fois, toutes clés confondues
3. redémarrer le produit à zéro
```

Le compte d'abord : le service distant peut refuser (session trop ancienne, réseau coupé), et effacer avant de savoir laisserait une personne sans données mais avec un compte — un demi-état qu'aucun message ne rattrape. Sans compte distant configuré, l'étape 1 n'existe pas et le reste est identique.

L'effacement est total et non sélectif, délibérément : les clés naissent dans une vingtaine d'endroits, et une liste écrite à la main vieillirait mal — la première clé ajoutée ailleurs survivrait à l'effacement sans que rien ne le signale. Il emporte donc aussi la session d'authentification mémorisée, les copies de secours, l'acceptation du cadre médical, les préférences de restitution et les clés héritées.

**Cas limites**

- Session trop ancienne : la suppression du compte est refusée ; seule une reconnexion débloque le geste, et rien n'a été effacé.
- Aucune session ouverte alors qu'un compte est configuré : refus, rien n'est effacé.
- Le redémarrage est le seul moyen sûr de ne rien laisser en mémoire vive d'un compte qui n'existe plus.
- Les copies de secours partent avec le reste : après un effacement total, aucun sauvetage n'existe plus.

> **Exemple.**
>
> Camille efface tout. Son compte est supprimé, puis les 96 kg de mai, les prises d'Ozempic, les repas, les effets, l'année 1978 et les 168 cm quittent l'appareil en une fois, copies de secours comprises. Au redémarrage, le produit ne la connaît plus : profil d'usine, pesée de départ à 95,0 kg, cadre médical à accepter de nouveau.

### Ce qui sort de l'appareil

Rien ne part sans un geste explicite, et aucun geste ne synchronise : il n'existe aucune remontée du carnet, aucun rétablissement depuis un serveur, aucun partage entre appareils.

| Sortie | Contenu | Destination |
| --- | --- | --- |
| Bilan de suivi | document paginé nommé `Bilan_GLP1_<début>_<fin>.pdf` : identité (prénom ou « Patiente non nommée »), genre, taille, IMC, cible, reste à parcourir, traitement, puis les sections retenues parmi huit, bornées à la période retenue | l'appareil lui-même : le document est produit localement et enregistré, il n'est envoyé nulle part |
| Image de progression | une image et une légende portant la valeur mise en avant (une perte en kilos, par exemple), plus l'adresse du produit | enregistrée sur l'appareil, ou remise au partage du système, ou déposée sur un service tiers dont l'adresse est ouverte avec la légende |
| Légende seule | le même texte | presse-papiers de l'appareil |
| Réponse au questionnaire | sept notes 0–5, suggestion libre, nombre de reprises, instants d'envoi ; auteur (identifiant, adresse, nom) ; contexte technique | un document par compte, fusionné à chaque envoi, dans la base distante |
| Retour écrit | type, ressenti, catégorie, message, consentement de recontact ; auteur ; contexte technique | un document par message, rangé sous l'identifiant du compte |
| Fiche d'un bilan qui a échoué | nature et pile de l'erreur, étape, bornes de la période, sections demandées et sections effectivement retenues, **comptes** d'entrées, options du tirage, durée écoulée | un document par échec, rangé sous l'identifiant du compte |
| Courrier d'accompagnement | reprise du contenu ci-dessus, mis en forme, échappé | une file d'envoi lue par un service tiers, vers une adresse fixe |
| Connexion | adresse et mot de passe, ou passage par un fournisseur tiers | le service d'authentification ; la session revient et est mémorisée sur l'appareil |

Le contexte technique joint aux trois envois ne contient que : version, provenance, préférences de restitution, dimensions, langues déclarées par le socle, instant en trois formes, fuseau et décalage, identification du socle, mode de compilation. Aucune donnée de santé.

Les envois distants sont un ajout, jamais un obstacle : l'enregistrement local a lieu le premier, et rien de ce qui suit ne peut l'empêcher ni le défaire. Aucun envoi ne peut faire échouer un geste, aucun ne se signale en cas d'échec. Sans configuration du service distant, rien n'est même tenté.

**Cas limites**

- Plafond de dix envois par jour local ; au-delà, refus, et une alerte part une seule fois par compte et par jour.
- Au-delà de dix reprises du questionnaire, une alerte part au franchissement, une seule fois.
- Un retour supprimé localement ne retire pas le document déjà envoyé.
- Le partage vers un service tiers emporte la légende et l'adresse du produit, jamais un fichier.

### Ce qui n'en sort jamais

Poids et mensurations, prises et doses, repas et leur composition, effets ressentis et leurs notes, pas, séances, sommeil, moments pour soi, distinctions, avatar, identité : rien de tout cela ne quitte l'appareil, sinon dans le bilan et l'image de progression, que la personne produit et destine elle-même.

La recherche d'un aliment par son code-barres est entièrement locale : elle interroge la base embarquée et celle des aliments créés. Aucune requête ne part vers un service alimentaire, ni pour chercher, ni pour signaler un code introuvable.

La fiche d'un bilan qui a échoué ne connaît du carnet que sa taille : des comptes et deux bornes de période, jamais une valeur, jamais une date d'entrée de journal. La seule chose que la taille d'un carnet dit de sa propriétaire, c'est depuis combien de temps elle s'en sert.

### Les contraintes du portage

Le magasin n'est connu que d'une couche unique : lire, écrire, retirer une clé, tout effacer. Aucune autre partie du produit ne sait comment ni où c'est conservé, ce qui fait du remplacement du magasin un changement d'un seul endroit. La même clôture vaut pour l'authentification, pour la base distante, pour le presse-papiers, pour le partage, pour l'enregistrement d'un fichier et pour la génération d'identifiants.

Les identifiants sont des UUID version 7 : 48 bits d'horodatage en tête, 74 bits d'aléatoire, ordonnables lexicographiquement à la milliseconde. Le motif antérieur, fondé sur l'instant seul, produisait deux fois la même valeur pour deux créations dans la même milliseconde. Plusieurs journaux emploient encore ce motif antérieur. **[arbitrage non validé]**

**[V2]** Ce que la V2 a arrêté et qui prévaut :

- Rien n'est encore conservé : aucune écriture n'existe, un redémarrage perd tout. Ce chapitre décrit donc l'état de la V1, sauf mention contraire.
- Le stockage est toujours métrique — kilogrammes, centimètres, grammes, millilitres — et ne porte aucune étiquette d'unité ; la conversion se fait aux deux bouts. Le séparateur décimal conservé est le point.
- La taille est conservée en centimètres ; l'année de naissance remplace l'âge, qui se périme.
- Les dates conservées sont locales (`AAAA-MM-JJ`, `HH:MM`) ; une conversion universelle recule d'un jour en soirée.
- Le format déjà enregistré ne se change pas sans migration.
- Rien de dérivable n'est conservé ; on référence par identifiant, jamais par nom ; supprimer supprime ; une valeur absente se tait plutôt que de valoir zéro.

**[V2]** Exigences posées pour la conversion vers le socle natif, qui n'aura lieu qu'une fois : surface d'attaque minimale ; **données de santé chiffrées** ; secrets hors du paquet livré ; aucune permission native non justifiée ; dépendances auditées ; liens profonds validés ; revue de sécurité avant toute distribution. Aucune n'est tenue aujourd'hui : le document est conservé en clair, et la configuration du service distant vit dans le code livré — elle n'est pas un secret, la protection tenant aux règles du service et à la liste des comptes autorisés, mais l'exigence, elle, reste à satisfaire. **[non implémenté]**

**Cas limites**

- Le chiffrement au repos changera la forme de ce qui est conservé : il appelle une migration, donc une conversion de plus dans la chaîne de chargement.
- Le magasin natif n'offre pas les mêmes garanties de capacité : la relecture de vérification reste la seule parade portable.
- Aucune synchronisation multi-appareils n'est prévue ; le carnet reste lié à un appareil, et un appareil perdu est un carnet perdu.

## 9. Les invariants

Ce chapitre énonce dix-neuf propriétés que le modèle doit vérifier, avec l'endroit du code qui les tient, le test qui les épingle quand il existe, et la conséquence de leur chute. Elles priment sur les règles particulières des chapitres précédents : une capacité qui les contredirait n'est pas une capacité du produit.

Elles ne sont pas de même nature. Les nº 1 à 17 sont des propriétés des données, vraies après n'importe quelle écriture ; la nº 18 borne le périmètre du modèle ; la nº 19 porte sur la lecture d'une sauvegarde plus ancienne que le code qui la lit. Sept d'entre elles ne sont aujourd'hui tenues qu'en partie, et chaque écart est situé à la ligne.

### 1. Rien de dérivable n'est stocké

Aucune grandeur calculable à partir d'autres attributs ne possède d'attribut à elle. La durée d'un sommeil n'existe nulle part : elle se calcule des deux instants complets par `sleepMinutesBetween` (`src/features/sleep/sleep.utils.ts:43`), seule fonction à la produire. L'apport d'une composition se recalcule par `computeItemsNutrition` (`src/shared/food/food.nutrition.ts:52`). L'IMC, la perte totale, la dépense d'une séance, le poids courant se calculent à la demande. En V2, l'âge est remplacé par l'année de naissance (`src/domaine/mesures.ts`) — un âge se périme, une année de naissance non. **[V2]**

```
duree_sommeil = instant(reveil) − instant(endormissement)   // jamais un attribut enregistré
nutrition(composition) = Σ computeQuantityNutrition(item.qty, fiche(item.foodId))
```

**Trois dérivations sont pourtant stockées :**

| Dérivation stockée | Où | Quand elle se rafraîchit |
| --- | --- | --- |
| Les cinq valeurs nutritionnelles d'une prise alimentaire (`calories`, `protein`, `carbs`, `fat`, `fiber`) | `SavedMealLog`, `src/types.ts` ; écrites par `src/app/useAppData.ts:445-458` et `:487-497` | à chaque réécriture de la ligne, jamais autrement |
| Les cinq valeurs pour 100 g d'une recette, à côté de sa composition `recipeIngredients` | `UserCustomFood` = `CiqualFood`, `src/data/mealConstants.ts` ; écrites par `computeRecipeNutritionPer100` depuis `src/features/custom-food/useRecipeForm.ts:211-258` | au ré-enregistrement de la recette seulement |
| L'âge en années | `UserProfile.age`, `src/types.ts:109` | jamais : il se périme tout seul |

Seule la première est inscrite au « reste à faire » de `CONVENTIONS.md` ; les deux autres ne le sont pas. **[arbitrage non validé]** La conséquence porte : corriger la fiche d'un aliment ne corrige que ce qui se recalcule à la demande. Une recette qui le cite garde ses propres valeurs, et le code le dit — le commentaire de `recipesUsingFood` (`src/features/custom-food/customFood.utils.ts:119-135`) constate que `computeItemsNutrition` « abaisserait ses valeurs au ré-enregistrement, sans rien dire ».

**S'il tombe :** deux valeurs existent pour une même grandeur et divergent à la première correction.

> **Exemple.**
>
> Camille corrige la fiche d'un yaourt de 60 à 54 kcal pour 100 g. Ses prises alimentaires contenant ce yaourt gardent leurs cinq valeurs jusqu'à la prochaine réécriture de la ligne ; et sa recette « bol du matin », qui contient ce yaourt, garde les siennes tant qu'elle ne la ré-enregistre pas.

### 2. On référence par identifiant, jamais par nom

Une ligne qui désigne une entrée d'un catalogue en porte l'identifiant, pas le libellé. Un composant de composition porte `foodId` et `isCustomFood` ; une prise de traitement et le profil portent un identifiant du catalogue des traitements (`src/shared/medication/treatment.catalog.ts`), résolu par `getTreatment`, qui rend `aucun` pour un identifiant inconnu. Les libellés hérités sont convertis une fois au chargement par `toTreatmentId`. En V2, le traitement se choisit dans le catalogue (`src/domaine/traitements.ts`) et ne se saisit jamais librement. **[V2]**

| Référence | Forme stockée | Tenu |
| --- | --- | --- |
| Aliment d'une composition | `foodId` + `isCustomFood` | oui |
| Traitement d'une prise | `brand?: string`, identifiant du catalogue, *facultatif* | à moitié |
| Traitement du profil | `glp1Brand`, identifiant du catalogue | oui |
| Type d'un effet indésirable | nom (`type: string`) | non |
| Discipline d'une séance | nom (`sport: string`) | non |
| Activité d'un temps pour soi | nom (`activity: string`) | non |

**Quatre écarts sont constatés**, tous inscrits au « reste à faire » de `CONVENTIONS.md`. Les types `SideEffectType` et `SportType` sont déclarés dans `src/types.ts` sans que `AppData` porte la table correspondante, et les trois journaux ci-dessus gardent un nom. Sur une prise de traitement, l'identifiant est facultatif : son absence n'est pas « aucun traitement » mais « celui du profil au moment de la lecture » (`src/types.ts:93-98`) — une résolution tardive que la règle est justement censée interdire. Enfin les deux champs portent encore le nom `brand` et `glp1Brand` alors qu'ils ne portent plus une marque. **[arbitrage non validé]**

**S'il tombe :** renommer une entrée casse l'historique qui la citait, et le nom stocké interdit toute traduction — deux langues donneraient deux valeurs pour la même chose.

### 3. L'identifiant d'une ligne est unique et stable

Chaque ligne d'un journal porte un `id` qui la désigne seule, et qui ne change pas de sa vie. Les deux invariants suivants s'appuient dessus : la suppression se fait par identifiant (`removeLogById`), et le remplacement d'une pesée du jour lui conserve le sien.

```
∀ journal, ∀ a ≠ b ∈ journal : a.id ≠ b.id
modifier(ligne) ⇒ ligne.id inchangé
```

**La stabilité est tenue ; l'unicité ne l'est pas.** Hors alimentation, les identifiants valent un préfixe suivi de l'horloge : `w-${Date.now()}`, `inj-`, `se-`, `step-`, `sport-`, `metime-`, `sleep-` (`src/app/useAppData.ts:233-401`). Deux écritures dans la même milliseconde donnent le même identifiant. Seules les prises alimentaires emploient un UUID v7 (`newId`, `src/shared/platform/id.ts`), qui est la convention écrite du nouveau modèle. Aucun test ni aucune garde ne couvre le cas. **[arbitrage non validé]**

**S'il tombe :** supprimer une ligne en supprime deux, et modifier l'une modifie l'autre.

### 4. Supprimer supprime

La ligne supprimée quitte la sauvegarde. `removeLogById` (`src/shared/model/logbook.ts:42`) filtre le tableau ; plus aucune écriture ne pose de marque de suppression. Les sauvegardes antérieures sont nettoyées une fois au chargement par `purgeDeleted` (`src/shared/model/purgeDeleted.ts`), qui retire les lignes marquées et l'attribut de marque des autres. Il n'existe plus de lecture filtrée : la sauvegarde est l'ensemble des données. Tenu par `src/shared/model/logbook.test.ts` et `src/shared/model/purgeDeleted.test.ts`.

```
∀ journal, ∀ id : après supprimer(journal, id), aucune ligne de journal n'a cet id
```

**Une seule suppression est refusée**, au nom de l'intégrité référentielle : supprimer un aliment personnalisé qui est ingrédient d'une recette (`recipesUsingFood`, `src/features/custom-food/customFood.utils.ts:136-148`), parce que le recalcul de la recette ignorerait silencieusement ce qu'il ne résout pas.

**Cas limites**

- `purgeDeleted` traverse sept journaux ; ceux du temps pour soi et du sommeil, nés après l'abandon de la suppression logique, n'y figurent pas.
- La suppression du compte efface d'abord le compte distant, puis tout le stockage local ; si l'effacement du compte échoue, rien n'est effacé.
- Une suppression de plus, non nommée ici, a lieu au chargement : voir l'invariant nº 19.

**S'il tombe :** chaque lecture doit filtrer, et une seule qui l'oublie compte des lignes mortes. C'est arrivé : les plafonds quotidiens comptaient les lignes marquées, une journée vidée était déclarée pleine, et l'écriture suivante écrasait une ligne invisible.

### 5. Un journal absent vaut le journal vide

Un journal manquant d'une sauvegarde n'est pas une erreur : il vaut zéro ligne. La garantie est portée par la signature de chaque fonction du modèle, sous la forme d'un tableau vide par défaut — `logs: T[] = []` dans `src/shared/model/logbook.ts`, `rows: T[] = []` dans `purgeDeleted.ts`, `history: WeightLog[] = []` dans `startingWeighIn.ts`, `logs: SleepLog[] = []` dans `sleep.utils.ts`. C'est ce qui rend lisible une sauvegarde écrite avant qu'un journal n'existe, et donc ce qui rend tenable l'invariant nº 19.

```
journal absent ≡ journal vide ≢ erreur
```

Tenu par `src/shared/model/logbook.test.ts` (« traite le journal absent comme un journal vide », deux fois).

**S'il tombe :** ouvrir une sauvegarde ancienne lève une erreur, et l'invariant nº 19 emporte avec lui tout l'historique de qui n'a pas mis à jour depuis longtemps.

### 6. Une valeur absente se tait

Une grandeur calculée sur un ensemble vide rend l'absence, jamais zéro, jamais une valeur de remplacement. `nightMinutesOn` rend `null` quand aucune nuit ne porte cette date (`src/features/sleep/sleep.utils.ts:124`) ; les moyennes alimentaires rendent `null` sans journée renseignée (`src/features/meal-journal/mealAverages.ts`) ; une famille de prises sans ligne n'a pas de valeur plutôt qu'une valeur nulle (`src/features/meal-charts/mealVsSnack.ts`).

```
agréger(∅) = absence      // et non 0
0 mesuré ≠ absence        // un zéro enregistré est une valeur
```

La réciproque tient aussi : un zéro enregistré est une donnée, et `fillMealHunger` ne touche pas une prise qui porte déjà ses deux valeurs, zéro compris.

**Deux écarts, de sens opposés.**

- **Le dénominateur.** Les moyennes alimentaires divisent par le nombre de journées *renseignées*. Deux familles de moyennes divisent au contraire par les jours *écoulés depuis la première entrée*, bornes comprises, journées vides comprises : `entriesWeeklyAverageSinceFirst` (`src/features/home/homeOverview.ts:727-736`) et les moyennes du sport (`src/features/sport/sportAverages.ts:105-121`). C'est assumé — ces journaux n'enregistrent que des événements qui ont eu lieu, leur silence est une information — et les deux rendent `null` en deçà de sept jours de recul. La règle du dénominateur dépend donc du journal, et n'est pas universelle.
- **La faim fabriquée.** Une prise alimentaire à qui manquent ses deux niveaux de faim s'en voit attribuer deux, de 0 à 5, au chargement : `hungerOfSavedMeal` (`src/shared/model/appData.ts:200-216`) les déduit du moment de la journée, des calories de la prise et d'une somme des codes de caractères de son identifiant. Une valeur absente y est rendue parlante, et rien dans la ligne n'en garde la trace — c'est le contre-exemple le plus net de cet invariant. **[arbitrage non validé]**

Un troisième cas est ambigu par construction et le code le dit : une qualité de sommeil laissée à sa valeur d'ouverture ne se distingue pas d'une qualité choisie (`DEFAULT_SLEEP_QUALITY`, `src/features/sleep/sleep.constants.ts:59`) ; les nuits déjà enregistrées à 0 le resteront. **[arbitrage non validé]**

**S'il tombe :** un zéro se lit comme une nuit blanche ou un jeûne, c'est-à-dire comme une mesure ; le produit affirme une chose que personne n'a enregistrée.

> **Exemple.**
>
> Camille n'a rien enregistré du 14 septembre : sa moyenne de fibres de la semaine se calcule sur les six journées renseignées, et sa nuit du 14 n'existe pas — elle ne vaut pas zéro minute. Ses moments pour soi par semaine, eux, se divisent bien par sept, journée vide comprise.

### 7. Aucune suite ne se décide sur un silence

Une question sans réponse ne décide rien ; seule une réponse explicite ouvre ou ferme une suite. Les conditions qui font poser une question s'écrivent en égalité stricte à une réponse (`started === true`, `hasSessions === true`, `foodDiary === true`, `src/features/onboarding/onboarding.steps.ts:83-93`) et jamais en simple vérité d'une valeur possiblement absente ; quand la condition doit rester ouverte au silence, elle s'écrit en négation d'une réponse donnée (`goal !== 'stabiliser'`). Ce que les réponses activent suit la même règle : une fonctionnalité s'active sur un `true` explicite, jamais sur une absence.

```
question posée = f(réponses explicites)     // jamais f(absence)
```

**En V1, une question retirée emporte ses réponses** : `clearStepAnswers` et la table `STEP_ANSWER_KEYS` (`src/features/onboarding/onboarding.steps.ts:155-190`) effacent les clés qu'elle portait, pour qu'une valeur orpheline ne survive pas. Tenu par `src/features/onboarding/onboarding.steps.test.ts`.

**En V2 la mécanique est reprise, mais amputée** (`parcours.ts`, `useParcours.ts`). `montre` dit quelles réponses conditionnent quelle question et `etapesVisibles` les filtre ; `peutValider` porte *deux* conditions bloquantes et non une : le traitement, tant que la forme et la spécialité manquent, et le compte, dès qu'un mot de passe est commencé sans atteindre huit signes — un mot de passe vide, lui, ne bloque pas (`parcours.ts:98-107`, `motDePasseValide` de `src/domaine/compte.ts`). Il n'existe en revanche **aucun équivalent de `clearStepAnswers`** : passer de « perdre » à « stabiliser » retire la question du poids visé, mais `poidsCible` garde sa valeur. Seul le triplet du traitement se défait ensemble (`repondreTraitementCommence`, `repondreForme`). **[V2]** **[arbitrage non validé]** Tenu par `parcours.test.ts` et `compte.test.ts`.

**S'il tombe :** une question sautée décide à la place de la personne, et le produit lui attribue un état qu'elle n'a pas déclaré.

### 8. Les unités stockées sont canoniques

Chaque grandeur a une unité de stockage unique, et aucune étiquette d'unité n'accompagne une valeur enregistrée. Le système d'unités ne concerne que les deux bouts — ce qui entre, ce qui sort ; il ne touche pas la valeur écrite.

| Grandeur | Unité stockée |
| --- | --- |
| Poids, mesures corporelles | kilogramme (une décimale, `roundWeight`), centimètre |
| Taille | centimètre |
| Quantité d'aliment | gramme pour un solide, millilitre pour un liquide |
| Dose d'un traitement | milligramme |
| Durée d'une séance, d'un temps pour soi, d'un sommeil | minute |
| Distance d'une séance | mètre |
| Énergie, macronutriments, fibres | kilocalorie, gramme |

Litres, kilomètres, livres, pouces et portions n'existent qu'aux deux bouts.

**En V2, la règle tient pour la taille et tombe pour le poids.** `src/domaine/unites.ts` ne porte qu'une conversion, celle du pouce vers le centimètre et retour, appliquée aux deux bouts ; la taille recueillie est en centimètres quoi qu'il arrive (`tailleCm: number` dans `reponses.ts`). Le poids, lui, n'a *aucune* conversion : il est recueilli sous la forme d'une chaîne sans unité (`poids: '95.0'`), produite dans l'unité du système choisi et bornée par `POIDS_MAX[unite]`. En impérial, la valeur recueillie est donc en livres. La ligne « poids → kilogramme » du tableau ne vaut que pour la V1. **[V2]** **[arbitrage non validé]**

Le pouce, enfin, n'est pas confiné aux deux fonctions de conversion comme leur commentaire l'affirme : il figure aussi dans `UNITES` et `UNITES_DU_SYSTEME` (`src/domaine/unites.ts:31` et `:60-63`) et dans `TAILLE_BORNES` (`src/domaine/mesures.ts:56-59`). Tenu, pour la taille, par `unites.test.ts`.

**S'il tombe :** changer de système d'unités change la valeur des mesures déjà prises, et une même table mêle des grandeurs qui ne se comparent pas.

> **Exemple.**
>
> Camille mesure 168 cm : c'est ce qui est enregistré, quel que soit le système. En impérial, sa taille entre et sort en pouces — 66 in — et la valeur enregistrée ne bouge pas. Son poids de 96,0 kg, en revanche, serait aujourd'hui recueilli en V2 comme « 211.0 » si elle avait choisi l'impérial, sans qu'aucune unité n'accompagne le nombre.

### 9. Les bornes n'écartent que l'absurde

Une borne existe pour refuser l'impossible, jamais pour dire à quelqu'un quel corps il a le droit d'avoir. Les bornes du modèle sont des constantes du domaine, hors de tout point de saisie, et les mêmes valent pour toutes les grandeurs de même nature — le poids actuel et le poids visé partagent leur plafond.

| Grandeur | Bornes | Où |
| --- | --- | --- |
| Poids | 1 à 999 kg, ou 1 à 2000 lb | `POIDS_MAX`, `src/domaine/mesures.ts:22-25` **[V2]** |
| Taille | 50 à 300 cm, 20 à 118 in | `TAILLE_BORNES`, `src/domaine/mesures.ts:56-59` **[V2]** |
| Âge (et par là l'année de naissance) | 1 à 130 ans, rapportés à l'année en cours par `bornesAnneeNaissance` | `AGE_MIN`, `AGE_MAX`, `src/domaine/mesures.ts:38-47` **[V2]** |
| Sévérité d'un effet indésirable | 1 à 5 | `src/types.ts:437`, en commentaire |
| Niveau de faim | 0 à 5 | clamp de `dansEchelle`, `src/shared/model/appData.ts:197` |
| Qualité d'un sommeil | 0 à 5, six termes nommés | `SLEEP_QUALITY_LABELS`, `src/features/sleep/sleep.constants.ts:26-33` |

Les deux plafonds du poids ne sont pas la conversion l'un de l'autre — 999 kg font 2 202 lb — mais deux nombres ronds choisis chacun dans son unité. Les bornes de la taille en pouces, elles, *sont* la conversion arrondie de celles en centimètres. Tenu par `unites.test.ts` (« n'écartent que l'absurde »).

**Trois échelles ne sont pas tenues par le type.** `HungerLevel` (`0 | 1 | … | 5`) et `SeverityLevel` (`1 | … | 5`) sont déclarés dans `src/types.ts` et jamais employés : les champs correspondants valent `number`, avec un commentaire pour toute borne. Aucune écriture de la V1 ne vérifie une borne — `roundWeight` arrondit sans plafonner. La dette est inscrite dans `CONVENTIONS.md`. **[arbitrage non validé]**

**S'il tombe :** une valeur absurde traverse tout l'historique et fausse chaque moyenne, chaque écart et chaque échelle qui la croise, sans jamais se signaler.

### 10. Les dates sont locales

Un jour s'écrit `AAAA-MM-JJ` et une heure `HH:MM`, sans fuseau : ce sont des heures murales, celles que la personne a vécues. Elles se produisent et se lisent segment par segment — `getLocalDateStr` lit l'année, le mois et le jour locaux ; `instantMinutes` découpe la chaîne plutôt que de la donner à un constructeur de date, qui l'interpréterait en temps universel. Seules les métadonnées techniques (`createdAt`, `updatedAt`, sur les recettes et les aliments personnalisés) sont des instants absolus en millisecondes.

```
jour = AAAA-MM-JJ local        // jamais toISOString().split('T')[0]
comparaison de jours = comparaison de chaînes
```

**L'écart est plus large qu'annoncé jusqu'ici.** Les constructions nues d'une date depuis la seule chaîne du jour — les seules réellement relues en temps universel, à la différence de ``new Date(`${date}T12:00:00`)`` qui est locale — sont trois dans le code partagé : `src/features/home/homeOverview.ts:225`, `src/features/steps/steps.utils.ts:170`, `src/features/injections/injections.utils.ts:140`. Il s'en compte une cinquantaine de plus dans les gabarits de version (`src/versions/`). À l'ouest de Greenwich, chacune décale d'un jour la date qu'elle produit. **[arbitrage non validé]**

**S'il tombe :** une pesée du soir se range au lendemain, et le décalage varie avec le fuseau de la personne — donc avec ses voyages.

### 11. L'ordre est celui des dates

Aucun calcul ne se fie au rang d'une ligne dans son journal. L'ordre qui compte est celui porté par les lignes : `byDateTimeAsc` et `byDateTimeDesc` (`src/shared/model/logOrder.ts`, tenu par `logOrder.test.ts`) comparent la clé `date + T + heure`, l'heure absente valant midi ; à clé égale, l'ordre du tableau subsiste. Les journaux s'écrivent par ajout en fin de tableau : leur rang est l'ordre de création, et une ligne antidatée y arrive en dernier tout en appartenant au passé.

```
cle(ligne) = `${ligne.date}T${ligne.time || '12:00'}`
poids courant = pesée maximale pour cle, jamais pesées[pesées.length − 1]
```

**Cas limites**

- La modification d'une pesée ne retrie pas le journal : le rang stocké cesse de suivre les dates, et seul le tri par la clé rétablit l'ordre au moment du calcul. **[arbitrage non validé]**
- Trois endroits prennent encore la dernière ligne du tableau pour le poids courant, tous dans le même gabarit de version : `src/versions/cartes/App.tsx:362`, `src/versions/cartes/components/PlusMenu.tsx:40`, `src/versions/cartes/components/MedicalReportExport.tsx:235`. Une pesée antidatée y fausse la perte annoncée. **[arbitrage non validé]**

**S'il tombe :** une pesée antidatée passe pour la plus récente ; la perte totale, l'IMC et tout ce qui se compte depuis le départ partent du mauvais point.

### 12. Les heures tombent sur des minutes rondes

Toute heure enregistrée appartient à l'ensemble `0, 10, 15, 20, 30, 40, 45, 50`, arrondie vers le bas. La règle porte sur la valeur écrite, et `snapToRoundedMinutes` (`src/shared/date/date.local.ts`, tenu par `src/shared/date/date.test.ts`) est appliquée aux huit endroits qui écrivent une heure.

| Écriture | Appliquant |
| --- | --- |
| Ajout sous plafond quotidien, fusion d'une modification | `snapLogTime`, `src/shared/model/logbook.ts:28-32` |
| Ajout d'une pesée, modification d'une pesée | `src/features/weight/weighInWrites.ts:129` et `:195` |
| Les deux heures d'un sommeil, à l'ajout comme à la modification | `snapSleepTimes`, `src/features/sleep/sleep.utils.ts:97`, appelée en `useAppData.ts:401` et `:413` |
| Prise alimentaire, à l'ajout comme à la modification | `src/app/useAppData.ts:440` et `:494` |
| Les deux heures de rappel du profil | `src/app/useAppData.ts:205-207` |

`snapSleepTimes` existe parce que la règle commune ne voit que le champ `time` : sans elle, l'heure d'endormissement d'un sommeil y échapperait.

```
minutes(heure enregistrée) ∈ {0,10,15,20,30,40,45,50}
14:37 → 14:30    14:47 → 14:45    23:59 → 23:50    14:07 → 14:00
```

**Cas limites**

- Une chaîne qui n'est pas `HH:MM`, ou dont les minutes dépassent 59, ressort telle quelle.
- Une ligne sans attribut d'heure ressort inchangée.
- Quand aucune heure n'est fournie, c'est l'heure locale arrondie de la même façon qui est écrite (`getRoundedLocalTimeStr`) : l'arrondi étant vers le bas, une heure enregistrée n'est jamais dans le futur.

**S'il tombe :** deux heures voisines qui décrivent le même moment ne se regroupent plus, et l'ensemble des instants cesse d'être commun à tous les journaux.

### 13. Une seule pesée par jour

Le journal des pesées porte au plus une ligne par date. Enregistrer une pesée sur une date déjà prise met à jour la ligne du jour au lieu d'en créer une seconde (`addWeighIn`, `src/features/weight/weighInWrites.ts`, tenu par `weighInWrites.test.ts`) : elle garde son identifiant, son drapeau de départ, et les mesures corporelles que la nouvelle valeur ne fournit pas — une mesure non fournie n'est pas un effacement (`keptMeasurements`).

```
∀ date d : |{ p ∈ pesées : p.date = d }| ≤ 1
```

**Cas limites**

- La modification d'une pesée n'applique pas la règle : déplacer une pesée sur une date occupée n'écrase rien, c'est l'appelant qui refuse avant d'écrire. **[arbitrage non validé]**
- Le remplacement conserve la nature de la ligne remplacée : se peser le jour du départ met à jour le départ, qui reste le départ.
- Aucun autre journal ne porte cette contrainte ; les autres ont des plafonds quotidiens (2 prises de traitement, 15 effets indésirables, 15 séances, 15 temps pour soi, 15 sommeils par date de réveil, 30 prises alimentaires). Les quatre premiers écrasent la dernière ligne du jour (`addLogWithinDailyCap`, `src/shared/model/logbook.ts:67`), les deux derniers refusent l'écriture.

**S'il tombe :** deux poids coexistent pour un même jour et aucune règle ne dit lequel est le poids de ce jour ; la perte quotidienne et la cadence hebdomadaire deviennent ambiguës.

> **Exemple.**
>
> Camille, pesée à 85,2 kg le 12 septembre au matin, se repèse le soir à 85,1 : la ligne du 12 passe à 85,1 kg, garde son identifiant et garde le tour de taille enregistré le matin.

### 14. Le poids de départ est la pesée la plus ancienne

Une pesée porte le drapeau de départ, et c'est la plus ancienne. Le drapeau est reposé après chaque écriture par `keepStartingOnOldest` (`src/features/weight/weighInWrites.ts:60-71`) : si la ligne marquée n'est ni la plus ancienne ni du même jour qu'elle, le drapeau est réécrit sur toute la liste — vrai sur la plus ancienne, faux partout ailleurs. Le départ se reconnaît à son drapeau, jamais à sa valeur : repasser par ce poids, ou le dépasser, ne fait pas d'une pesée ordinaire un départ (`findStartingWeighIn`, `src/shared/model/startingWeighIn.ts:38`). La règle a un pendant symétrique à l'écriture : dater le départ après une autre pesée est refusé.

```
depart = min(journal, byDateTimeAsc)      // à date égale, le départ en place le reste
```

**L'unicité, elle, n'est pas tenue.** `keepStartingOnOldest` prend le premier drapeau trouvé et s'arrête là : `const current = entries.find(w => w.isStartingWeight); if (current && (current.id === oldest.id || current.date === oldest.date)) return entries;`. Si ce premier drapeau est déjà sur la plus ancienne, un second drapeau posé plus loin survit indéfiniment. Même faiblesse au chargement : `ensureStartingWeighIn` s'arrête dès qu'*une* ligne porte le drapeau. La cardinalité exacte n'est donc pas `= 1` mais `≥ 1` dès qu'une sauvegarde en portait deux. **[arbitrage non validé]** Tenu, pour le reste, par `src/features/weight/weighInWrites.test.ts` et `src/shared/model/startingWeighIn.test.ts`.

**Cas limites**

- Un journal vide reste vide : il n'y a rien à marquer, et l'invariant ne s'applique pas.
- La première pesée d'un journal vide devient le départ, puisqu'elle est la seule.
- Le chargement d'une sauvegarde ancienne pose le drapeau à faux sur toutes les lignes et ne fabrique une ligne de départ que si l'ancien profil portait un `startingWeight` ; sinon le journal reste sans départ. Idempotent.

**S'il tombe :** la perte totale, la progression d'IMC et les paliers se comptent depuis une pesée qui n'est plus la première ; et si le drapeau disparaît en silence, le produit retombe sur un poids de départ qui n'a jamais été mesuré.

> **Exemple.**
>
> Camille est partie de 96,0 kg en mai 2026. Elle retrouve une pesée du 28 avril à 97,2 kg et l'enregistre : cette ligne devient le départ, la ligne de mai perd son drapeau, et la perte totale se recompte depuis 97,2.

### 15. Le poids de départ ne se supprime pas

C'est un invariant distinct du précédent : il est tenu par une autre fonction, dans un autre fichier, et il tombe séparément. Supprimer une pesée n'est pas une capacité applicable à la ligne marquée, et vider le journal des pesées ne garde qu'elle — `removeAllWeightsButStarting` (`src/shared/model/startingWeighIn.ts`).

```
vider(journal des pesées) = { p ∈ journal : p.estDepart }
```

**La formule se retourne quand le drapeau manque.** Sur un journal où aucune ligne ne le porte — cas que l'invariant nº 14 reconnaît possible, puisque `ensureStartingWeighIn` laisse tous les drapeaux à faux quand l'ancien profil n'avait pas de `startingWeight` — le filtre ne retient rien et tout est effacé, poids de départ compris. Cette capacité ne passe pas par `keepStartingOnOldest` : rien ne garantit la présence du drapeau au moment où elle s'exécute. **[arbitrage non validé]**

**S'il tombe :** la référence depuis laquelle se comptent la perte totale et la progression d'IMC disparaît sans qu'aucune saisie ne puisse la reconstituer.

### 16. Deux plages de sommeil ne se recouvrent pas

Une entrée de sommeil est une plage entre deux instants complets : jour et heure de l'endormissement, jour et heure du réveil, tous les quatre enregistrés. Deux plages du journal n'ont jamais d'étendue commune. Le conflit se juge avant l'écriture, par `sleepRangesOverlap` et `findOverlappingSleep` (`src/features/sleep/sleep.utils.ts:412-437`, tenu par `sleep.utils.test.ts`) ; en cas de conflit, rien n'est écrit et la ligne visée garde ses valeurs.

```
recouvre(a, b) = aDebut < bFin ∧ bDebut < aFin      // inégalités strictes
∀ a ≠ b du journal : ¬recouvre(a, b)
```

Les inégalités sont strictes : le bout-à-bout est permis — se rendormir à l'heure exacte d'un réveil n'est pas dormir deux fois. Une plage sans étendue (réveil antérieur ou égal à l'endormissement) ne recouvre rien : c'est la règle de la durée nulle qui la refuse, chaque refus gardant son propre motif. La date d'une entrée est celle du réveil, ce qui fait que la nuit précédant un jour porte, par construction, la date de ce jour. **[arbitrage non validé]**

**Un des quatre repères est posé par déduction avant d'être enregistré** : le jour d'endormissement vaut la veille du réveil pour une nuit, le jour même pour une sieste, et se repose seul tant que les heures n'ont pas été touchées (`src/features/sleep/useSleepForm.ts:268`, `:322`, `:367`). Il est corrigeable, mais il n'est pas fourni. Le stockage, lui, porte bien les quatre.

**Cas limites**

- La ligne en cours de modification est exclue de la recherche de conflit, faute de quoi elle se verrait elle-même.
- Une plage dont un des quatre repères est illisible ne recouvre rien.
- Le journal du sommeil refuse au-delà de quinze entrées portant la même date de réveil, sans rien écrire.
- Aucune borne haute ne pèse sur la durée d'une plage : une plage de plusieurs jours est acceptable pour le modèle.

**S'il tombe :** le sommeil cumulé d'une journée peut dépasser la journée, et le temps d'éveil — du réveil du matin à l'endormissement du soir, moins les siestes — devient négatif.

> **Exemple.**
>
> Camille dort du 12 septembre 23:10 au 13 septembre 07:00. Une sieste du 13 de 06:30 à 08:00 est refusée ; une sieste du 13 de 07:00 à 08:00 est acceptée, parce qu'elle touche la nuit sans la recouvrir.

### 17. Les fibres comptent partout

Partout où le produit compte des nutriments, il en compte cinq : énergie, protéines, glucides, lipides et fibres. Le type `Nutrition` et sa valeur nulle `ZERO_NUTRITION` portent les cinq attributs (`src/shared/food/food.nutrition.ts:4-19`) ; `computeQuantityNutrition` et `computeItemsNutrition` les calculent tous les cinq ; une fiche d'aliment, personnalisée ou non, donne ses fibres pour 100 g comme le reste (`src/data/mealConstants.ts`) ; le profil porte un objectif quotidien de fibres, à 25 g par défaut (`dailyNutritionGoals`, `src/features/home/homeOverview.ts:821-841`) ; un palier quotidien s'atteint indépendamment pour les protéines et pour les fibres ; les moyennes alimentaires rendent des fibres par jour ; la répartition calorique compte les fibres à part des glucides, à 2 kcal par gramme.

```
Nutrition = { calories, protein, carbs, fat, fiber }   // cinq, toujours
```

`food.nutrition.ts` n'a pas de test à lui ; les cinq valeurs sont exercées indirectement par `src/shared/food/food.composition.test.ts` et `food.resolve.test.ts`.

**S'il tombe :** une composition dont les macronutriments ne rendent pas l'énergie annoncée, un objectif quotidien muet sur le nutriment que le traitement rend justement critique, et une répartition qui range les fibres avec les glucides.

### 18. Une seule personne par installation

Le modèle porte un profil, un jeu de journaux, une installation. Il n'existe ni profils multiples, ni partage de compte, ni rôle tiers, ni comparaison entre personnes. Tout tient sous une clé de stockage unique — `STORAGE_KEY = 'glp1_app_companion_data'` (`src/app/useAppData.ts:80`) — derrière une couche de stockage unique (`src/shared/platform/storage.ts`, « ne jamais appeler `localStorage` directement en dehors de ce fichier »). Les données de suivi ne sont synchronisées nulle part : changer d'appareil ne transporte pas l'historique.

**Il existe cependant une base distante, et un compte.** Quatre collections reçoivent des écritures du client (`firestore.rules`, `src/shared/platform/firestore.ts`, `src/features/auth/`) :

| Collection | Ce qui part | Acte de la personne |
| --- | --- | --- |
| `surveys/{uid}` | les réponses d'un sondage | explicite |
| `feedbacks/{uid}/messages/{id}` | un message écrit par la personne | explicite |
| `mail/{id}` | la mise en file d'un courrier | conséquence des deux précédents et du suivant |
| `reportErrors/{uid}/failures/{id}` | l'échec d'une production de document : bornes de la période demandée, nombre d'entrées par journal, étape et durée | **aucun** — écrit tout seul quand un compte est connecté (`recordReportExportFailure`, `src/features/feedback/remoteSubmit.ts:332`) |

Aucune de ces quatre écritures ne porte de donnée de santé : ni poids, ni dose, ni composition, ni note — `ReportExportFailure` (`src/features/report/exportFailure.ts:185-208`) ne porte que des comptes et des bornes, et le code l'écrit en toutes lettres à l'endroit de l'envoi. L'énoncé exact est donc : *aucune donnée de santé ne quitte l'appareil sans un acte explicite*, et non « le seul flux sortant est un document que la personne transmet elle-même ». **[arbitrage non validé]**

La V2 reprend le principe dans ses `GUIDELINES.md` (§ « Le produit ») : aucune donnée de santé hors de l'appareil sans acte explicite, rien de ce que le produit calcule n'est une recommandation médicale, pas de comparaison entre personnes, pas de synchronisation multi-appareils. **[V2]**

**S'il tombe :** la promesse tombe avec lui — et avec elle la raison pour laquelle une personne accepte d'enregistrer son poids, ses effets indésirables et ses doses.

### 19. Une sauvegarde ancienne reste lisible

Une sauvegarde écrite par une version antérieure s'ouvre sans erreur. La lecture (`src/app/useAppData.ts:96-160`) procède en trois temps, dans cet ordre.

1. **Les traces des fonctionnalités supprimées sont écartées d'abord**, et non à la fin : `delete parsed.waterLogs`, `delete parsed.milestones`, puis `hydrationTrackingEnabled`, `dailyWaterGoalMl` et `weightGoalsEnabled` du profil (`:105-114`). Sans cela, l'étalement de l'objet les recopierait sans fin.
2. **Une suppression, puis sept conversions.** `dropPreMigrationMeals` (`:127`) jette de la sauvegarde toute prise alimentaire sans tableau `items` — `savedMeals.filter((meal) => Array.isArray(meal?.items))`, `src/shared/model/appData.ts:71-74`. C'est la seule étape du chargement qui détruit des données de la personne, et elle est irréversible ; le critère est l'absence du champ, jamais une liste vide. Viennent ensuite, dans l'ordre : `dropSeedData`, `migrateTreatmentIds`, `purgeDeleted`, `mergeSideEffectNotes`, `mergeTableTennisSport`, `fillMealHunger`, `ensureStartingWeighIn` (`:130`).
3. **Chaque étape est idempotente, par une garde nommable.**

```
charger(charger(sauvegarde)) = charger(sauvegarde)

purgeDeleted        if (!('deletedAt' in row)) return row
fillMealHunger      typeof meal.hungerBefore === 'number' && typeof meal.hungerAfter === 'number'
ensureStartingWeighIn   if (drapeaux.some(w => w.isStartingWeight)) return …
```

Tenu par `src/shared/model/appData.test.ts`, `purgeDeleted.test.ts` et `startingWeighIn.test.ts`.

**Le garde-fou de la lecture ratée.** Si la sauvegarde est illisible, elle est recopiée telle quelle sous une clé de secours — une seule fois, et seulement si cette clé est libre —, puis `loadFailed` est posé et `mayPersist` interdit toute écriture de la session (`:139-171`). Ce qui est empêché est l'*écriture*, pas le remplacement : l'état de la session *est* le profil d'usine, `INITIAL_PROFILE` assorti d'une pesée de départ semée à `INITIAL_STARTING_WEIGHT` (`:148-157`). Le produit tient cette session pour non écrivable ; les valeurs présentes sont des valeurs d'usine que personne n'a enregistrées.

**S'il tombe :** une conversion appliquée deux fois abîme les données qu'elle devait sauver, ou une lecture ratée efface un historique en le recouvrant de valeurs d'usine.

## 10. Ce que le modèle ne fait pas

Ce chapitre borne le modèle : ce qu'aucune entité ne porte, ce qu'aucune capacité n'écrit, ce que les types déclarent sans que rien ne l'emploie, et ce qu'une décision déjà prise coûterait en migration. Il énumère des faits vérifiés dans le code ; ce qui attend un choix est renvoyé à inspirations.html (*inspirations*).

### La forme de la sauvegarde

Une installation porte un seul agrégat, et cet agrégat est tout ce qui est conservé.

```
AppData = {
  profile:            UserProfile,     // exactement un, jamais zéro, jamais deux
  weightHistory:      WeightLog[],     // requis
  dailyLogs:          DailyLog[],      // requis
  injectionHistory:   InjectionLog[],  // requis
  savedMeals?:        SavedMealLog[],  // les six restantes sont facultatives ;
  sideEffectHistory?: SideEffectLog[], // absente vaut liste vide
  stepLogs?:          StepLog[],
  sportLogs?:         SportLog[],
  meTimeLogs?:        MeTimeLog[],
  sleepLogs?:         SleepLog[],
}
```

Aucune propriété de cet agrégat ne désigne un propriétaire, une version, une origine ni un appareil. Un profil n'a ni identifiant, ni instant de création, ni instant de modification. Tout ce que ce chapitre énumère découle de cette forme.

### Ce qu'aucune entité ne porte

| Absent du modèle | Ce que le modèle porte à la place | Conséquence |
| --- | --- | --- |
| Une deuxième personne | Un `UserProfile` unique. Un soignant n'existe que comme `medicalReminderDoctor?: string`, un nom libre posé sur un rappel. | Ni compte partagé, ni rôle de soignant, ni comparaison entre personnes : aucune donnée n'est attribuable à quelqu'un d'autre. |
| Un fuseau horaire | Des dates `AAAA-MM-JJ` et des heures `HH:MM`, heures murales locales, sans décalage ni suffixe. | Deux prises notées à 08:00 dans deux pays sont indiscernables ; un déplacement ne se rattrape pas après coup. |
| Une prescription | `UserProfile.glp1Brand: string`, un identifiant de catalogue. La dose vit sur chaque prise (`InjectionLog.dose`, en mg). `Treatment.dosePresets: number[]` et `Treatment.doseIntervalDays?: number` appartiennent au catalogue, pas à la personne. | Rien ne dit ce qui est prescrit, ni quelle dose est attendue quand. Le rythme se déduit des prises déjà enregistrées. |
| Un épisode de traitement | Rien. La série courante se déduit du journal : on remonte les prises de la plus récente à la plus ancienne et on s'arrête au premier `brand` différent (`currentTreatmentInjections`). | Ni début, ni fin, ni date de changement. Une prise sans `brand` vaut « celui du profil au moment de la lecture » : changer `glp1Brand` réécrit la lecture du passé. |
| Une date de début de cure | La date de la pesée qui porte `isStartingWeight: true`. `cureWeek` compte les semaines depuis elle. | Un historique sans pesée de départ n'a pas de semaine de cure ; supprimer les pesées ne libère pas cette date, la pesée de départ n'étant pas supprimable. |
| Une date de naissance | `UserProfile.age: number`, en années révolues. | L'âge ne vieillit pas seul : il reste celui du jour où il a été écrit. **[V2]** La V2 conserve `anneeNaissance: number`, bornée par l'âge 1–130 rapporté à l'année courante. |
| Une mensuration sans pesée | `BodyMeasurements` est un `Pick` de `WeightLog` sur neuf propriétés facultatives, toutes en centimètres. `WeightLog.weight: number` est requis. | Enregistrer un tour de taille impose d'enregistrer un poids le même jour. |
| Une mesure du corps autre que le poids et neuf tours | Rien. Pas de glycémie, pas de tension, pas de résultat d'analyse, pas de température. | Le document transmissible ne peut rien porter de biologique. |
| Une pièce jointe | Aucun journal ne porte de fichier. La seule image du modèle est `AvatarConfig.customPhotoUrl?: string`, une photo recadrée au carré, ramenée à 256 px et réencodée en JPEG dans l'adresse elle-même. | Ni photographie d'un repas, ni ordonnance, ni cliché d'un pèse-personne. |
| Un moment dans une journée de pas | `StepLog { id, date, steps: number, isSimulated?: boolean }` — pas d'heure. | Un total par journée, jamais une répartition dans la journée. `isSimulated` distingue le jeu de démonstration du reste, et rien d'autre : aucune propriété ne nomme l'appareil ou la méthode de comptage. |
| Une note libre sur quatre journaux | `notes?: string` existe sur `InjectionLog`, `SideEffectLog`, `SportLog`, `MeTimeLog` et `SleepLog`. | `WeightLog`, `SavedMealLog`, `StepLog` et `DailyLog` n'ont nulle part où mettre un mot. |
| Une hydratation | Rien. `waterLogs`, `profile.hydrationTrackingEnabled` et `profile.dailyWaterGoalMl` sont retirés à chaque chargement et disparaissent à l'écriture suivante. | Supprimée le 2026-08-07. **[V2]** La V2 la range parmi ce qu'on ne réintroduit pas. |
| Un objectif de poids à paliers | Rien. `milestones` et `profile.weightGoalsEnabled` sont retirés au chargement comme les traces d'hydratation. Il reste `UserProfile.targetWeight: number`, un seul poids visé en kg. | Supprimé le 2026-08-09. **[V2]** Même règle en V2. |
| Un objectif de pas | `DEFAULT_DAILY_GOAL_STEPS = 8000`, une constante du domaine. Les seuls objectifs du profil sont `dailyCaloriesGoal?` (kcal, absent vaut 1 400), `dailyProteinGoal?` (g, absent vaut le poids courant × 1,5 arrondi) et `dailyFiberGoal?` (g, absent vaut 25). | Le pourcentage de pas atteint se rapporte à un nombre que personne ne peut changer. |
| Un historique du profil | Un enregistrement unique et muable, sans `createdAt`, `updatedAt` ni numéro de version. | Changer `targetWeight`, `height` ou `glp1Brand` n'en garde aucune trace : la valeur d'hier est perdue. |
| Un badge | Rien dans l'agrégat. Les paliers (`'aucun' \| 'eveil' \| 'bronze' \| 'argent' \| 'or'`) se recalculent à chaque lecture depuis les journaux. | Ni date de décrochage, ni ordre d'obtention. Seuls les derniers paliers observés sont retenus hors du carnet, sous `glp1_badge_tiers_connus`, pour ne pas refêter deux fois. |
| Une récurrence | Des propriétés du profil : `reminderDay: number` (0–6), `reminderTime: HH:MM`, `injectionReminderType?: 'weekly' \| 'custom'`, `injectionReminderDaysInterval?: number`, `injectionReminderStartDate?`, et cinq propriétés de rappel médical. | Un exemplaire de chaque famille, jamais deux. Aucune occurrence n'est matérialisée, aucune n'est marquée faite ou manquée. |
| Un nom de traitement hors catalogue | Chaque famille du catalogue finit par une entrée « Autre ». | Un traitement absent du catalogue perd son nom : rien ne le conserve. |

### Une entité que rien ne crée

`DailyLog { id, date }` ne porte plus aucun contenu : elle a successivement porté les effets secondaires notés de 0 à 10, quatre repas en texte libre et le total d'hydratation du jour, tous retirés. Aucune capacité ordinaire n'en écrit une ; seule la génération de données de démonstration en pose. Deux lectures la parcourent, toutes deux pour y chercher la date la plus ancienne de la sauvegarde. La collection est donc requise, toujours vide en usage réel, et son seul effet possible est d'avancer la borne de départ des bilans.

### Ce qu'aucune capacité n'écrit

| Geste absent | Ce que le code porte | Conséquence |
| --- | --- | --- |
| Créer un compte | L'authentification n'expose que six verbes : s'abonner à l'état de connexion, lire le compte courant, se connecter par courriel et mot de passe, se connecter par Google, se déconnecter, supprimer le compte. | Aucune inscription par courriel, aucune réinitialisation de mot de passe, aucun changement d'adresse. **[V2]** La V2 recueille courriel et mot de passe — huit signes au moins, seule contrainte — sans les enregistrer ni vérifier l'adresse. |
| Synchroniser | Le carnet entier tient dans une clé unique du stockage local, `glp1_app_companion_data`. La base distante ne reçoit que le sondage, les retours et les échecs d'export ; le contexte joint ne contient aucune donnée de santé. | Changer d'appareil ne transporte rien. Vider le stockage efface tout. Une écriture refusée par le stockage échoue en silence. |
| Exporter puis relire le carnet | Deux sorties seulement : un document PDF, et une image PNG de partage. | Ni l'un ni l'autre ne se relit. Aucune capacité n'importe de données, d'aucune forme. |
| Émettre un rappel | Les rappels sont des propriétés du profil. Aucun appel à une interface de notification n'existe dans le code. | Un rappel est une préférence conservée, jamais un événement. Rien ne se déclenche à l'heure dite. |
| Lire un code-barres optiquement | Le code EAN-13 ou UPC-A est enregistré en chiffres, puis cherché chez Open Food Facts — le seul appel sortant du produit hors retours. | Un code illisible sur l'emballage ne peut pas entrer autrement. Le code est conservé en chaîne pour garder ses zéros de tête. |
| Recevoir des pas d'un podomètre ou d'une plateforme de santé | `StepLog.steps` s'écrit à la main, ou par la génération de démonstration. | Aucune connexion à un objet connecté. Une journée à zéro pas est traitée comme un compteur éteint et n'entre dans aucune moyenne. |
| Restaurer une ligne supprimée | Supprimer retire la ligne de la sauvegarde. L'ancien marquage `deletedAt` a été converti au chargement, la conversion est irréversible et idempotente. | Aucun rappel possible d'une ligne effacée. Seule exception : la pesée de départ n'a aucun chemin de suppression. |
| Choisir son système d'unités | `UserProfile.measurementSystem?: 'metric' \| 'imperial'` est déclaré et n'est ni lu ni écrit nulle part. | Tout est conservé et rendu en unités métriques. **[V2]** La V2 recueille le système (`'metrique' \| 'imperial'`), avec un défaut apporté par la langue, et ne l'enregistre pas encore. |
| Modifier un aliment de la base de référence | Seuls les aliments créés depuis l'application se modifient ; un code-barres déjà connu rouvre sa fiche au lieu d'en créer une seconde. | Une valeur fausse de la base livrée ne se corrige qu'en créant un aliment à soi. |
| Dépasser un plafond quotidien | Par journée : 2 prises, 15 effets secondaires, 15 séances, 15 moments pour soi, 15 sommeils, 30 repas ou en-cas, 1 pesée. | Au-delà du plafond, la ligne la plus récente est remplacée plutôt qu'ajoutée, sauf pour les repas et le sommeil qui refusent. La règle de la pesée unique s'applique à l'ajout et non à la modification. |

### Déclaré sans être employé

Ces déclarations existent dans les types et ne gouvernent rien : la donnée réelle est plus lâche, ou n'a pas de place où vivre.

| Déclaration | Ce que porte la donnée réelle |
| --- | --- |
| `HungerLevel = 0 \| 1 \| 2 \| 3 \| 4 \| 5` | `SavedMealLog.hungerBefore?: number` et `hungerAfter?: number` — un nombre quelconque. **[non implémenté]** |
| `SeverityLevel = 1 \| 2 \| 3 \| 4 \| 5` | `SideEffectLog.severity: number` — un nombre quelconque. **[non implémenté]** |
| `SideEffectType { id, label, createdAt, updatedAt }` | Aucune collection `sideEffectTypes` dans l'agrégat ; `SideEffectLog.type: string` porte un nom. **[non implémenté]** |
| `SportType { id, label, met, createdAt, updatedAt }` | Aucune collection `sportTypes` ; `SportLog.sport: string` porte un nom, et le MET se relit dans un catalogue constant à partir de ce nom. **[non implémenté]** |
| `Recipe` et `CustomFood`, le modèle cible des aliments | Le stockage garde la forme héritée de la base de référence (`alim_code`, `alim_nom_fr`), qu'un adaptateur convertit à la lecture. **[non implémenté]** |
| `MeasurementSystem` et `UserProfile.measurementSystem?` | Aucune lecture, aucune écriture. **[non implémenté]** |
| `UserProfile.silhouetteType: SilhouetteType` (huit valeurs) | Écrit au profil d'usine et par la génération de démonstration ; la version courante ne le relit jamais. |
| `UserProfile.easyReadingMode?: boolean \| number` | Conservé pour les sauvegardes existantes et les versions gelées ; retiré de la version courante le 2026-08-27. |
| `JournalViewMode = 'survol' \| 'vue' \| 'plongee'` | Un état figé à `'vue'` dans un module partagé, survivance des trois modes de lecture retirés. |
| Six zones corporelles avec leur code et leurs coordonnées | Une donnée qu'aucune capacité de la version courante ne consomme. **[non implémenté]** |

Les métadonnées `createdAt` et `updatedAt` — instants absolus, en millisecondes depuis l'époque Unix — n'existent que sur `Recipe`, `CustomFood`, `SideEffectType` et `SportType`. Aucun journal n'en porte, ni `UserProfile`, ni `AvatarConfig` : on ne peut donc pas savoir quand une ligne a été écrite, seulement à quelle date et à quelle heure elle se rapporte.

### Des noms là où la règle veut des identifiants

Le premier principe du modèle demande de référencer par identifiant et jamais par nom. Quatre endroits y dérogent, et un cinquième conserve une valeur dérivable.

- `SideEffectLog.type: string` — le nom du symptôme.
- `SportLog.sport: string` — le nom du sport. Dans le catalogue des sports, la clé *est* le libellé français : `value === label`.
- `MeTimeLog.activity: string` — le nom de l'activité, même règle.
- `SavedMealLog.typeLabel: string` — recalculé depuis `type` à chaque écriture, et conservé quand même.
- À l'inverse, `UserProfile.glp1Brand` et `InjectionLog.brand?` portent bien un identifiant de catalogue, sous un nom de « marque » qui n'est plus le bon.

Conséquence directe, mesurée : renommer une entrée de catalogue impose de réécrire l'historique. La fusion de deux noms d'un même sport a exigé une conversion appliquée à chaque chargement ; sans elle, les séances des deux anciens noms seraient retombées sur l'entrée de repli et leurs calories auraient changé toutes seules, après coup. Conséquence indirecte : ces valeurs ne se traduisent pas.

### Ce qui demanderait une migration

Ces points sont décidés ; le stockage porte encore l'ancienne forme, et le passage réécrit des données déjà enregistrées.

| Décision | Ce que le stockage porte | Ce que coûte le passage |
| --- | --- | --- |
| Un horodatage unique `localDateTime`, heure murale locale sans fuseau | `date: AAAA-MM-JJ` et `time: HH:MM` séparés, sur tous les journaux | Réécrire chaque ligne et chaque lecture. **[non implémenté]** **[V2]** La V2 garde les deux séparés. |
| Référencer les symptômes et les sports par `typeId` | Des noms libres, sans table où les ranger | Créer une entrée par nom distinct rencontré, puis réécrire chaque ligne. **[non implémenté]** |
| Ne rien stocker de dérivable | Cinq valeurs nutritionnelles sur `SavedMealLog` (`calories`, `protein`, `carbs`, `fat`, `fiber`), plus `typeLabel` | Les retirer et recalculer partout, ce qui suppose que chaque lecture dispose de la base des aliments créés. |
| Des identifiants UUIDv7 et des métadonnées sur toutes les tables | Des identifiants fabriqués par préfixe et horodatage ; aucune métadonnée sur les journaux | Décider d'abord si les métadonnées s'étendent aux journaux. |
| Le stockage des aliments créés au nouveau modèle | La forme héritée de la base de référence | Convertir la base locale, puis retirer l'adaptateur de lecture. **[non implémenté]** |
| Un drapeau nommé au positif pour le badge mystère | `mysteryBadgeHidden?: boolean`, dont la polarité est retournée en un seul endroit | Un renommage sans migration de données : aucune sauvegarde n'est à ménager. **[non implémenté]** |

Deux conversions sont, elles, déjà passées et ne peuvent pas revenir : le retrait des lignes marquées supprimées, et le remplacement des noms de traitement par leurs identifiants de catalogue.

### Ce que la V2 a retiré, ou n'a pas repris

Sur ces points, la V2 tranche et l'emporte. **[V2]**

- La V2 ne conserve encore rien : tout ce qu'elle recueille vit en mémoire, et un rechargement le perd. **[non implémenté]**
- Son catalogue de traitements ne porte que des noms et des formes — ni paliers de dose, ni demi-vies. Aucune concentration active, aucun escalier de doses ne s'y calcule.
- Ni poids de départ, ni date de départ : deux valeurs indépendantes, poids actuel et poids visé, qui ne se recopient jamais l'une dans l'autre.
- L'avatar se compose, il ne se photographie pas et ne se tire pas au hasard. Le genre en fait partie et n'est plus une question à part.
- Ni niveau d'activité, ni souhait d'activité : supprimés, à ne pas réintroduire.
- Ni suivi hydrique, ni objectifs de poids à paliers, ni saisies rapides comme modèle.
- La taille est conservée en centimètres et convertie aux deux bouts ; les mesures recueillies le sont en texte avec un point décimal, quelle que soit la langue.
- La langue est recueillie sans être branchée : l'application parle la langue détectée. **[non implémenté]**

**Cas limites**

Une sauvegarde illisible n'est pas écrasée : elle est recopiée une fois sous une clé de secours, et plus rien n'est écrit de la session.

Le stockage local plafonne autour de 5 Mo pour toute l'application, photo d'avatar comprise ; rien ne prévient avant le refus.

Une pesée antidatée plus ancienne que la pesée de départ devient la pesée de départ ; à date égale, le départ en place le reste.

Une prise sans identifiant de traitement est réputée du traitement courant, y compris quand ce traitement a changé depuis.

Les journaux acceptent des lignes datées du futur ; seules les analyses les écartent.

La durée d'un sommeil et les calories d'une séance ne sont jamais conservées : elles se recalculent à chaque lecture.

Une valeur absente se tait : aucune lecture ne lui substitue un zéro, un tiret ou une moyenne.

> **Exemple.**
>
> Camille, née en 1978, 168 cm, partie de 96 kg en mai 2026, sous Ozempic. Son profil conserve `age: 48` : en 2028 il dira toujours 48, faute d'année de naissance. Ses dix-neuf prises portent l'identifiant d'Ozempic, écrit à l'enregistrement ; une prise plus ancienne qui n'en porterait aucun serait relue comme une prise de Wegovy le jour où elle changerait de traitement. Sa semaine de cure se compte depuis la date de sa pesée à 96 kg, la seule chose qui tienne lieu de début de cure. Son objectif de pas vaut 8 000, qu'elle le veuille ou non. Et si elle change de téléphone, rien ne la suit.

Ce qui n'a pas pu être fondé sur le code est rangé à part : la migration des noms vers des tables de référence (*inspirations*), l'émission réelle des rappels (*inspirations*), la reprise d'un carnet sur un autre appareil (*inspirations*), l'historique des changements de profil (*inspirations*), l'objectif de pas réglable (*inspirations*), le sort de l'entité de journée (*inspirations*).
