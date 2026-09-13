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

Deux choses. Un **profil** : qui est la personne, ce qu'elle prend, ce qu'elle vise, ce qu'elle veut suivre, ce qu'on doit lui rappeler, et les réglages qu'elle a choisis. Des **journaux** : des collections de lignes datées, une ligne par fait relevé.

L'ensemble forme la **sauvegarde** — un document unique, un seul profil, neuf collections. Aucune structure ne porte plus d'un profil, aucune ligne ne porte d'identifiant de personne : l'appartenance des données à la personne est celle du document entier.

| Membre | Cardinalité | Rôle |
| --- | --- | --- |
| profil | exactement 1 | Identité, corps, traitement suivi, objectifs, domaines activés, rappels, réglages enregistrés. |
| pesées | 0..n | Journal du poids et des mensurations. |
| prises | 0..n | Journal du traitement. |
| repas | 0..n | Journal alimentaire. |
| effets secondaires | 0..n | Journal des ressentis. |
| pas | 0..n | Journal de la marche. |
| séances | 0..n | Journal de l'activité physique. |
| moments pour soi | 0..n | Journal du temps pour soi. |
| sommeils | 0..n | Journal des nuits et des siestes. |
| journées | 0..n | Marque qu'il s'est passé quelque chose à une date. Ne porte aucune autre donnée. |

Six de ces collections sont facultatives dans le document — repas, effets secondaires, pas, séances, moments pour soi, sommeils : une sauvegarde ancienne peut ne pas les porter, et leur absence vaut collection vide. Le profil, les pesées, les prises et les journées sont toujours présents.

### Ce qui vit hors de la sauvegarde

La sauvegarde n'est pas tout le domaine. Une vingtaine d'autres documents du stockage local portent des entités que les lignes référencent ou que les dérivations lisent ; ils ne sont pas dans la sauvegarde, ne partent pas avec elle et ne sont pas protégés par son garde-fou de chargement.

| Entité | Cardinalité | Ce qu'elle porte |
| --- | --- | --- |
| Base d'aliments livrée | 3 479 fiches, en lecture seule | Identifiant, nom, valeurs pour 100 g ou 100 ml (énergie, protéines, glucides, lipides, fibres), nature liquide ou solide. Livrée avec le produit, jamais modifiée. |
| Aliments personnalisés | 0..n | Mêmes grandeurs qu'une fiche livrée, plus un code-barres facultatif, un renvoi de recette facultatif, un instant de création et un de modification. Chaque quantité d'un repas référence soit une fiche livrée, soit l'une de celles-ci. |
| Recettes | 0..n | Une composition d'aliments, qui définit un aliment personnalisé — la recette n'a pas de nom propre, c'est celui de l'aliment qu'elle produit. |
| Repas favoris | 0..n | Des compositions mémorisées, réutilisables comme point de départ d'un repas. |
| Listes suivies | 3 listes | Les types d'effet secondaire, les activités physiques et les moments pour soi que la personne a retenus parmi ceux proposés, plus ceux qu'elle a créés. |
| Compteurs d'objets de comparaison | 0..n | Ce qui a déjà été attribué à une perte de poids, pour ne pas se répéter. |
| Réponses au sondage, avis déposés | 0..n | Du texte écrit par la personne, conservé localement en plus d'être envoyé. |
| Paliers déjà fêtés, valeurs déjà signalées | 0..n | De quoi ne pas annoncer deux fois le même franchissement. |

Une fiche d'aliment supprimée laisse des quantités qui ne se résolvent plus : le cas est prévu et non exceptionnel.

### Les trois capacités

**Enregistrer** : créer, modifier et supprimer une ligne dans l'un des huit journaux de relevé, et modifier le profil. **Dériver** : calculer des totaux, des moyennes, des écarts, des séries temporelles, des échéances et des paliers à partir des lignes, sans rien réécrire. **Rendre transmissible** : produire, sur une période choisie, un document destiné à un professionnel de santé.

Quatre chemins seulement écrivent sans qu'une personne dicte la valeur : la **recherche d'un code-barres**, qui interroge une base alimentaire extérieure et fait de la fiche revenue un aliment personnalisé enregistré ; la **génération d'un jeu de données de démonstration** ; les **conversions appliquées une fois au chargement** d'une sauvegarde ancienne ; et l'**attribution d'objets de comparaison**, recalculée à chaque écriture du journal du poids.

### L'acteur unique

Une seule personne par installation. Il n'existe ni liste de profils, ni notion de tiers autorisé : le modèle n'a nulle part où loger une seconde personne.

Un compte — adresse électronique et mot de passe, ou compte Google — ne fait qu'ouvrir l'accès quand il est configuré ; il ne porte, ne transporte et ne sépare aucune donnée de suivi. La sauvegarde n'est pas indexée par compte : deux comptes ouverts tour à tour sur le même appareil lisent et écrivent le même document. Sans configuration d'authentification, l'accès est ouvert sans compte. La seule contrainte sur le mot de passe est une longueur d'au moins huit signes. **[V2]**

Un **rôle distinct existe** : l'adresse électronique de la session est comparée à une adresse écrite en dur, et cette égalité seule ouvre deux capacités destructrices — engendrer un jeu de données de démonstration, et vider tous les journaux. Hors configuration d'authentification, personne n'est identifié et ces deux capacités sont hors d'atteinte. Le reste de l'administration est hors périmètre de ce document.

Le genre de la personne est une donnée du profil, à trois valeurs : homme, femme, neutre. Il a deux usages, et deux seulement : le calcul du métabolisme de base, où la valeur neutre donne la moyenne des deux formules et où un genre absent est lu comme « femme » ; et l'identité portée par le document de synthèse. En V2, le genre n'est plus une donnée à part : il est un attribut de la figure de profil (`Avatar.genre`), enregistrée avec le reste du profil. **[V2]**

### La portée

Toutes les données de relevé vivent sur l'appareil, dans un stockage local, derrière une couche d'accès unique. Il n'existe aucune base distante de suivi, aucune synchronisation, aucune reprise sur un second appareil.

Conséquences à assumer, toutes vraies du modèle : changer d'appareil ne transporte rien ; effacer le stockage local efface l'historique ; un stockage indisponible ou plein fait échouer l'écriture en silence. Une sauvegarde illisible n'est jamais écrasée : sa chaîne brute est recopiée sous une clé de secours si celle-ci est libre, et **plus rien n'est écrit sous la clé de la sauvegarde pendant la session**. Ce garde-fou ne couvre que cette clé-là : les aliments personnalisés, les favoris, les listes suivies et les réglages continuent d'être écrits normalement.

Les flux **déclenchés par la personne** sont au nombre de quatre : le document de synthèse ; la production d'une image d'une distinction obtenue ; la production d'une image d'une séance d'activité, qui porte sa durée, sa distance et sa dépense estimée ; la production d'une image d'une série temporelle — poids, sommeil ou concentration de molécule.

Les flux **techniques** visent quatre collections distantes, rangées sous l'identifiant du compte : les réponses au sondage, qui portent ce que la personne a écrit, son adresse électronique et son nom ; les avis, idées et signalements, mêmes auteurs ; les échecs de production du document de synthèse, dont la charge est le contexte technique et les *nombres* de lignes par journal, jamais une valeur mesurée ; et une file de courriels d'accompagnement. Aucun de ces envois ne peut faire échouer un geste de la personne : ils sont silencieux, y compris en échec.

Un flux **entrant** existe : la recherche d'un code-barres interroge une base alimentaire publique par requête HTTP, et les valeurs revenues deviennent un aliment personnalisé enregistré.

### Les non-buts

Ce que le produit ne modélise pas, et qu'aucune capacité ne doit introduire.

| Non-but | Ce qu'il exclut | Ce qu'il n'exclut pas |
| --- | --- | --- |
| Pas de posologie | Aucune dose n'est corrigée, aucun rythme n'est prescrit, aucune prise n'est écrite à la place de la personne. | Le catalogue de la V1 porte des paliers de dose par spécialité, et le chemin d'écriture d'une prise en retient un d'avance. Le catalogue de la V2 ne porte que des noms et des formes. **[V2]** |
| Pas de conseil | Aucune recommandation nutritionnelle, sportive ou médicamenteuse n'est engendrée. Les objectifs quotidiens sont des valeurs par défaut modifiables, pas des prescriptions. | — |
| Pas de comparaison entre personnes | Aucune donnée d'une autre personne n'entre dans le modèle : ni classement, ni moyenne de population, ni réseau. | Le métabolisme de base est estimé par une formule établie sur une population. |
| Pas de synchronisation | Aucun compte partagé, aucun accès soignant, aucune copie distante des journaux. | Sondage, avis et échecs de production partent sous l'identifiant du compte. |
| Pas de capteur | Aucune connexion à un objet connecté ni à une plateforme de santé : tout relevé est écrit par la personne. | Une fiche d'aliment peut venir d'une base extérieure, par code-barres. |

Le non-but « pas de diagnostic » ne tient pas tel quel et se dit plus étroitement : **aucun état de santé n'est déduit d'un relevé autre que le poids**. La corpulence, elle, est qualifiée : l'indice de masse corporelle est rangé dans six catégories nommées — insuffisance pondérale sous 18,5, corpulence normale, surpoids à 25, obésité modérée à 30, sévère à 35, très sévère à 40 — et le franchissement d'un seuil nomme l'ancienne et la nouvelle catégorie. Passer sous 18,5 est traité comme un cas à part, signalé.

Six dérivations vont plus loin que le relevé brut : la catégorie de corpulence et son franchissement ; l'estimation de la quantité de molécule active dans l'organisme, tirée des demi-vies d'absorption et d'élimination du catalogue ; la corrélation entre deux domaines, dite « nette » au-delà de 0,5 et « modérée » au-delà de 0,3, tue en dessous de sept paires ; le métabolisme de base par la formule de Mifflin-St Jeor ; la balance énergétique, nommée par paliers de 4 000 kcal (« Stable », « Légère prise de poids », « Perte de poids marquée »…) ; la dépense estimée d'une séance et d'un nombre de pas. Le document produit porte une mention qui le désigne comme document de suivi personnel et non comme avis médical.

### Les domaines de relevé

Huit domaines. Sept portent un drapeau d'activation ; le poids n'en a pas et est toujours actif.

| Domaine | Ce qu'une ligne enregistre | Par date | Activation |
| --- | --- | --- | --- |
| Poids | Date, heure facultative, poids en kg, jusqu'à neuf mensurations en cm, un drapeau de départ. | 1 au plus à l'ajout : une ligne du même jour est fusionnée, en gardant son identifiant, son drapeau et les mensurations non fournies. | toujours actif |
| Traitement | Date, heure, dose en mg, zone d'administration, note, traitement concerné. | 2 au plus ; au-delà, la charge est fusionnée dans la dernière ligne du jour, qui garde son identifiant. | drapeau absent vaut actif |
| Effets secondaires | Date, heure, type d'effet, intensité entière de 0 à 5, note. | 15 au plus ; au-delà, fusion avec la dernière du jour. | drapeau absent vaut actif |
| Alimentation | Date, heure, famille du repas et son libellé, composition (au moins une quantité d'aliment), faim avant et après, entières de 0 à 5. | 30 au plus ; au-delà, l'enregistrement est refusé, et le déplacement vers une date pleine aussi. | drapeau absent vaut inactif |
| Pas | Date, nombre de pas. Pas d'heure. | sans plafond ; plusieurs lignes d'une même date se somment à la lecture. | drapeau absent vaut inactif |
| Activité physique | Date, heure, activité, intensité ressentie (douce, modérée, intensive), durée en minutes, distance facultative en mètres, note. | 15 au plus ; au-delà, fusion avec la dernière du jour. | drapeau absent vaut inactif |
| Temps pour soi | Date, heure, activité, durée en minutes, note. Ni intensité ni dépense : ce n'est pas de l'exercice. | 15 au plus ; au-delà, fusion avec la dernière du jour. | drapeau absent vaut inactif |
| Sommeil | Nature (nuit ou sieste), jour et heure d'endormissement, jour et heure de réveil, qualité entière de 0 à 5, note. | 15 au plus par date de réveil ; au-delà, l'enregistrement est refusé. | drapeau absent vaut inactif |

Un domaine inactif n'accepte plus d'enregistrement et n'est plus évalué par les distinctions. Éteindre n'efface rien : les lignes restent dans la sauvegarde et reviennent telles quelles au rallumage. Les défauts d'un drapeau absent disent l'ordre des choses : le traitement et les ressentis sont le motif du carnet, les cinq autres sont des suivis qu'on ajoute.

Un **second drapeau** existe par domaine activable, sept en tout. Il ne vaut que domaine inactif, et le rallumage l'efface. Son seul effet porte sur la restitution — le domaine cesse de paraître au lieu de paraître inerte —, jamais sur les données.

Le document de synthèse ne suit pas exactement l'activation. Six domaines n'y produisent de contenu que si leur drapeau est allumé *et* que la période porte au moins une ligne : alimentation, pas, activité physique, sommeil, temps pour soi, effets secondaires. Le traitement, lui, y figure toujours : son drapeau n'est jamais consulté. Une neuvième composante, les objets de comparaison, n'est pas un domaine de relevé et n'est masquée par aucun drapeau.

**Cas limites**

Une ligne de pas peut porter un drapeau « simulée » : il est déclaré et lu, mais aucun code ne l'écrit. **[non implémenté]**

La date d'un sommeil est celle du *réveil* : une nuit du 17 à 23 h au 18 à 7 h appartient au 18. **[arbitrage non validé]**

Les deux jours du sommeil sont écrits et non déduits de l'ordre des heures ; c'est ce qui permet de refuser un réveil antérieur à l'endormissement, et de comparer deux plages.

Deux plages de sommeil ne peuvent pas se recouvrir : un enregistrement dont la plage a une étendue commune avec une plage déjà enregistrée est refusé avant l'écriture. Le bout-à-bout est permis — les deux inégalités sont strictes.

La règle « une seule pesée par jour » n'est tenue qu'à l'ajout : la modification ne l'applique pas, et c'est le chemin appelant qui refuse de déplacer une pesée sur un jour déjà occupé.

Le journal des journées ne porte plus aucun contenu, et **aucun geste n'en crée de ligne** : sur les trente-trois écritures de la sauvegarde, aucune ne le touche. Il ne peut être non vide que sur une sauvegarde ancienne ou un jeu de démonstration — et le document de synthèse en compte pourtant les « bilans quotidiens ».

L'intensité d'un ressenti et la qualité d'un sommeil sont des échelles nommées de six crans : « Imperceptible, Léger, Modéré, Marqué, Fort, Élevé » d'une part, « Très mauvaise, Mauvaise, Passable, Correcte, Bonne, Excellente » de l'autre. Une intensité non touchée vaut 0, une qualité non touchée vaut 3 : rien ne distingue une valeur choisie d'une valeur laissée telle quelle.

### La ligne de relevé

Toute ligne, quel que soit son journal, porte un identifiant et une date locale. La plupart portent une heure locale ; le journal des pas n'en a pas, celui du poids l'a facultative. Rien d'autre n'est commun.

```
ligne      = { id: string, date: 'AAAA-MM-JJ', time?: 'HH:MM', … }
ordre      = tri stable sur `${date}T${time || '12:00'}`
survenu    = date < aujourd'hui || (date === aujourd'hui && (!time || time <= maintenant))
supprimer  = journal.filter(l => l.id !== id)          // la ligne quitte la sauvegarde
modifier   = journal.map(l => l.id === u.id ? { ...l, ...u } : l)   // fusion : une propriété absente n'efface rien
```

Deux conventions d'heure absente coexistent, et elles ne disent pas la même chose. Pour l'**ordre**, une ligne sans heure vaut midi. Pour le **filtrage du futur**, une ligne sans heure a lieu dès le début de sa journée : elle est comptée toute la journée en cours. Ce filtre traverse presque toutes les dérivations — une ligne datée dans le futur existe dans la sauvegarde mais n'est comptée nulle part avant son instant.

L'identifiant n'est **pas garanti unique**. Sept journaux le fabriquent en collant un préfixe à l'instant courant en millisecondes ; deux créations dans la même milliseconde produisent la même valeur, et aucun contrôle d'unicité n'a lieu à l'écriture. Seul le journal des repas emploie un identifiant universel ordonné dans le temps, dont les 74 bits d'aléa rendent la collision impossible en pratique.

Deux dérivations lisent l'identifiant pour autre chose que désigner une ligne : la génération d'une valeur de faim manquante s'écarte d'un cran selon la somme des codes de caractères, pour rester reproductible sans tirer au sort ; et la purge au chargement reconnaît les lignes d'exemple livrées jusqu'au 2026-08-05 à cinq préfixes d'identifiant, et les supprime.

Toute heure retenue est ramenée à la minute ronde inférieure parmi `0, 10, 15, 20, 30, 40, 45, 50`, à la création comme à la modification. L'heure proposée par défaut est l'heure locale ainsi arrondie, donc jamais dans le futur.

### Unités canoniques

Chaque grandeur est stockée dans une unité canonique, et une seule. Aucune étiquette d'unité n'accompagne une valeur : l'unité est celle de la grandeur, pas de la valeur.

| Grandeur | Unité stockée | Normalisée à l'écriture ? |
| --- | --- | --- |
| Poids | kilogramme | oui : arrondi au dixième par le chemin d'écriture |
| Heure | heure locale, `HH:MM` | oui : minute ronde inférieure |
| Mensuration, taille | centimètre | non |
| Dose | milligramme | non — rien n'arrondit une dose avant de l'enregistrer |
| Durée | minute | non |
| Distance | mètre | non |
| Quantité d'aliment | gramme ou millilitre, selon la nature de l'aliment | non |
| Énergie | kilocalorie | recalculée à chaque écriture du repas |
| Macronutriments | gramme (protéines, glucides, lipides, fibres) | recalculés à chaque écriture du repas |
| Pas | unité | non |
| Intensité d'un ressenti, faim, qualité de sommeil | entier de 0 à 5 | non |
| Instant technique | millisecondes depuis l'époque Unix | — |

La personne choisit un **système de mesure**, métrique ou impérial, qui ne décide que de l'unité de saisie et de l'unité de restitution, jamais de l'unité stockée. En V1, la propriété existe dans le profil mais rien ne l'écrit ni ne la lit. **[non implémenté]** En V2, la langue amène son système par défaut — français avec le métrique, anglais avec l'impérial — et il reste rechoisissable ; la taille se convertit aux deux bouts, le pouce n'existant que dans ces deux conversions. **[V2]** La conversion du poids entre kilogramme et livre n'existe pas : un poids choisi en livres serait retenu tel quel. **[non implémenté]**

### Les bornes

Les bornes n'écartent que l'absurde et ne disent jamais à quelqu'un quel corps il a le droit d'avoir. Celles de la V1 valent à l'enregistrement ; celles de la V2 les reprennent et les déplacent là où elles diffèrent.

| Grandeur | Bornes V1 | Décimales | V2 |
| --- | --- | --- | --- |
| Âge | 1 à 130 ans | — | remplacé par l'**année de naissance**, bornée par l'âge rapporté à l'année en cours : un âge se périme, une année de naissance non. **[V2]** |
| Taille | 50 à 300 cm | entier | identique ; 20 à 118 pouces, conversion arrondie de la même fourchette. |
| Poids | 0,1 à 1 000 kg | une | plafonds de 999 kg et 2 000 lb — deux plafonds ronds, chacun choisi dans son unité, et non la conversion l'un de l'autre. **[V2]** |
| Mensuration | 1 à 300 cm, vide permis | une | — |
| Dose | 0,001 à 1 000 000 mg | trois | — |
| Durée | 1 à 480 minutes | entier | — |
| Distance | 0,1 à 1 000 km, ou 10 à 100 000 m selon l'activité, vide permis | une (km), entier (m) | — |
| Quantité d'aliment | 1 à 10 000 | une | — |
| Valeur nutritionnelle pour 100 g | 0 à 10 000, vide permis | une | — |

Les objectifs quotidiens ont des valeurs par défaut, modifiables et enregistrées dans le profil quand elles le sont : 1 400 kcal, poids actuel × 1,5 arrondi pour les protéines, 25 g de fibres.

### Les invariants

Ils valent pour tout le domaine et priment sur les cas particuliers des chapitres suivants.

| Invariant | Ce qu'il interdit, et ce qui l'entame |
| --- | --- |
| Rien de dérivable n'est stocké | Une durée de sommeil, une dépense de séance ne sont pas des données : elles se recalculent. Corriger la fiche d'un aliment corrige tout l'historique. Deux entames : la valeur nutritionnelle d'un repas est conservée en cache et recalculée à chaque écriture, et le libellé de la famille d'un repas est écrit à côté de son code. |
| On référence par identifiant | Un aliment est référencé par identifiant et par sa provenance (base livrée ou base personnelle) ; un traitement par identifiant. Trois entames : une ligne d'effet secondaire stocke le *libellé* français du type, une séance stocke le *nom* de l'activité, un moment pour soi le *nom* du sien. Renommer l'un des trois ne suit pas les lignes déjà écrites. |
| Les dates sont locales | Aucun fuseau, aucun suffixe universel sur une date ou une heure de relevé : ce sont les heures murales vécues. |
| Une ligne ne porte pas d'horodatage de création | Aucun journal ne porte d'instant de création ni de modification. Seules les entités hors sauvegarde — aliment personnalisé, recette, type d'effet, activité — en portent deux. À l'inverse, sept journaux enfouissent l'instant de création dans l'identifiant lui-même. |
| Supprimer supprime | Aucune ligne conservée sous une marque de suppression, aucun filtrage à la lecture ; les marques héritées sont purgées une fois, au chargement. |
| Une valeur absente se tait | Aucun zéro, tiret ni moyenne implicite à la place d'une donnée manquante : une dérivation sans relevé ne rend rien. Elle ne demande pas pour autant une fenêtre pleine — une moyenne à sept jours se calcule sur les seules journées renseignées, et une journée suffit à la produire. |
| Aucune branche ne se ferme sur un silence | Une question passée ne décide rien ; seule une réponse explicite ouvre ou ferme une suite. |
| Le passé ne se réécrit pas | Changer le traitement suivi ne modifie aucune prise déjà enregistrée ; une prise sans traitement explicite se rattache à celui du profil au moment de la lecture, ce qui n'est pas « aucun traitement ». |
| La pesée de départ est la plus ancienne | Le drapeau de départ est **réécrit sur tout le journal à chaque écriture** : antidater une pesée lui transfère le départ, un historique qui en porterait deux est nettoyé, un historique qui n'en porte aucun se répare seul. À date égale, le départ en place le reste. Il se reconnaît à son drapeau et jamais à sa valeur. |
| Deux sommeils ne se recouvrent pas | On ne dort pas deux fois en même temps : une plage qui recoupe une plage enregistrée est refusée. Se rendormir à l'instant exact du réveil est permis. |
| Le chargement est idempotent | Toute évolution de forme est une opération rejouable sans effet sur des données déjà converties. Elle ne fait pas que convertir : trois propriétés caduques sont supprimées de la sauvegarde, les repas antérieurs à la bascule vers une composition sont jetés, et les lignes d'exemple aussi. |

### Ce qui peut effacer

L'effacement en masse a trois portées, et elles ne détruisent pas la même chose.

| Capacité | Précondition | Effet |
| --- | --- | --- |
| Vider un journal | aucune ; n'existe que pour cinq journaux — poids, prises, effets secondaires, pas, repas | Ce journal-là devient vide. Une exception : vider le journal du poids conserve la pesée portant le drapeau de départ. Aucun geste ne vide seul les séances, les moments pour soi, les sommeils ni les journées. |
| Vider tous les journaux | compte administrateur | Les huit journaux de relevé et le journal des journées sont vidés, à l'exception de la pesée de départ. Le profil est intact : identité, traitement, domaines activés, objectifs et rappels survivent. |
| Supprimer le compte | le compte est supprimé d'abord, quand l'authentification est configurée ; en cas d'échec, rien n'est effacé | Tout le stockage local est effacé en bloc — sauvegarde, aliments personnalisés, favoris, listes suivies, réglages, session mémorisée. |

La pesée de départ est épargnée parce que sans elle la perte totale, les distinctions et le document de synthèse n'ont plus de référence.

### Le vocabulaire

Les termes ci-dessous sont employés dans ce sens exact partout dans le document, et ne sont pas redéfinis.

| Terme | Sens |
| --- | --- |
| Sauvegarde | Le document principal du stockage local : le profil et les neuf collections. Pas la totalité des données de la personne. |
| Stockage local | L'ensemble des documents conservés sur l'appareil : la sauvegarde et la vingtaine d'autres clés. |
| Profil | L'unique enregistrement décrivant la personne, ses objectifs, ses domaines activés, ses rappels et ses réglages. |
| Journal | Une collection de lignes datées d'un même domaine. |
| Ligne | Un fait relevé : identifiant, date locale, souvent une heure locale, et les données propres à son domaine. |
| Domaine de relevé | L'un des huit sujets suivis. Sept portent un drapeau d'activation, et un second drapeau qui ne vaut que domaine inactif. |
| Prise | Une administration du traitement, injection ou comprimé. Jamais « injection » seul : la forme dépend du traitement. |
| Pesée | Une ligne du journal du poids, mensurations comprises. |
| Pesée de départ | La plus ancienne pesée, porteuse du drapeau de départ, référence de la perte totale. Le drapeau la suit à chaque écriture. |
| Traitement | Une entrée du catalogue livré avec le produit, jamais une chaîne libre. En V1 elle porte huit à onze propriétés : identifiant, nom court, libellé complet, forme, molécule, paliers de dose, demi-vie d'élimination, demi-vie d'absorption, et selon les cas une mise à l'échelle de dose, un rythme usuel, une certification d'essai clinique. En V2, trois : identifiant, nom, forme. **[V2]** |
| Molécule | Le principe actif d'un traitement, et la clé de cumul : la molécule quand elle est connue, l'identifiant du traitement sinon. Les entrées génériques n'ont pas de molécule et ne s'additionnent donc à rien ni à personne. |
| Fiche d'aliment | Une entrée de la base livrée ou de la base personnelle : un nom et des valeurs pour 100 g ou 100 ml. Une quantité de repas la référence par identifiant. |
| Cure | Le suivi d'une personne sous traitement, du premier relevé au dernier. Le carnet entier en est le relevé. |
| Série en cours | Les prises du traitement porté par le profil, depuis le dernier changement de traitement, celles datées dans le futur exclues. Revenir à un traitement déjà pris ouvre une nouvelle série, sans rouvrir l'ancienne. |
| Distinction | L'une des quatre évaluations dérivées des journaux — activité physique, deux sur l'alimentation, pas — rendant l'un des cinq paliers : aucun, éveil, bronze, argent, or. Une distinction n'est évaluée que si son domaine est actif. |
| Fenêtre | Un intervalle de dates sur lequel une dérivation est calculée. |
| Plafond quotidien | Le nombre maximal de lignes qu'une date accepte dans un journal donné. Selon le journal, il refuse ou il fusionne. |

> **Exemple.**
>
> L'installation de Camille porte un profil — née en 1978, 168 cm, poids visé, Ozempic, domaines du traitement et des effets secondaires actifs d'office — et huit journaux. Sa pesée du 12 mai 2026, 96,0 kg, porte le drapeau de départ : c'est à elle que se rapportera toute perte totale, même le jour où elle repassera par 96 kg. Si elle enregistre plus tard une pesée du 3 mai, c'est celle-là qui devient le départ, sans qu'elle ait rien à demander. Sa série en cours est la suite de ses prises d'Ozempic ; le jour où elle passerait à un Wegovy injectable, les prises déjà faites resteraient des prises d'Ozempic, et le cumul de sémaglutide se poursuivrait sans rupture. Si elle change d'appareil, rien ne la suit : la sauvegarde ne quitte celui-ci que par le document qu'elle produit elle-même.

Rien de ce qui précède n'est enregistré par la V2 à ce jour : le recueil initial tient ses réponses en mémoire, et un rechargement les perd. **[non implémenté]**

## 2. Les entités

Ce chapitre énumère les objets que le produit conserve : leurs attributs, leurs types, leurs unités canoniques, leur identité et leurs cardinalités. Il nomme aussi ce que les types déclarent sans qu'aucune donnée ne soit derrière, et ce que la V2 a décidé autrement.

### L'objet racine et ses tables

Une personne, un appareil, une sauvegarde. L'objet racine (`AppData`) porte un profil et neuf tables de lignes datées ; il est conservé en un seul document JSON, sous la clé `glp1_app_companion_data`. Une trentaine d'autres clés vivent hors de lui, chacune indépendante : elles sont recensées plus bas.

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

Aucune de ces tables ne porte d'index ni de contrainte d'unicité. Huit d'entre elles conservent l'ordre d'insertion. `weightHistory` fait exception : l'ajout d'une pesée retrie la table sur la seule `date`, et les deux écritures de la pesée de départ la retrient sur `(date, heure)` ; la modification d'une pesée, elle, ne retrie rien et laisse la ligne à son rang. L'ordre qui fait foi reste partout celui des dates et heures portées par les lignes, jamais leur rang dans la table.

```
cle(ligne) = ligne.date + "T" + (ligne.time || "12:00")   // comparaison lexicographique
// `||` et non `??` : une heure vide ("") retombe elle aussi sur midi.
// Une seule lecture s'en écarte : la signature de la pesée la plus
// récente, qui compare avec (ligne.time ?? "00:00").
```

### Les réserves hors de la sauvegarde

Tout ce qui n'est pas une ligne de suivi vit sous sa propre clé, hors de l'objet racine. Le préfixe est `glp1_`, à une exception près.

| Clé | Contenu |
| --- | --- |
| `glp1_user_custom_foods` | La base des aliments créés, recettes comprises |
| `glp1_favorite_meals` | Les menus favoris |
| `glp1_food_selection_counts` | Les compteurs de sélection, indexés par *nom* d'aliment |
| `glp1_active_sports`, `glp1_active_side_effects`, `glp1_active_me_time` | Les trois listes d'entrées actives |
| `glp1_badge_tiers_connus`, `glp1_paliers_nutritifs_fetes`, `glp1_notified_bmi_tier_index`, `glp1_dynamique_celebrated` | Les états de célébration |
| `glp1_first_open_date` | La date de première ouverture |
| `glow_ludic_usage` | L'assignation d'équivalences et ses compteurs — **seule clé sans le préfixe `glp1_`** |
| `glp1_user_feedbacks`, `glp1_user_survey_v2`, `glp1_user_survey`, `glp1_send_cap_alert` | Les messages envoyés, la réponse au questionnaire (l'ancien format n'est plus qu'un repli en lecture), et le jour où l'alerte de plafond est déjà partie |
| `hasAcceptedMedicalDisclaimer_v1` | Le consentement à l'avertissement médical — une chaîne nue `'true'`, sans préfixe ni horodatage |
| `glp1_meal_edit_notice_dismissed` | Un rappel éteint définitivement — chaîne nue `'true'` |
| `<clé>__secours`, `<clé>__secours-index`, `<clé>__secours-<horodatage>` | La sauvegarde illisible mise à l'abri, l'index des copies, les copies |
| Héritées : `glp1_meals_cleared`, `glp1_last_celebrated_weight`, `glp1_last_celebrated_weight_id` | Plus jamais écrites ni lues. Elles ne subsistent que pour être effacées à la réinitialisation |

Neuf clés supplémentaires (`glp1_period_blood_level_by_brand`, huit `glp1_*_history_view`) et les clés `glow_*` d'apparence ne portent aucune donnée de suivi : hors périmètre. `glp1_test_data` n'existe que dans les tests.

### Conventions communes à toutes les lignes

| Convention | Règle |
| --- | --- |
| Identité | `id`, chaîne, posée à l'enregistrement, jamais réécrite. Pesées `w-<ms>`, prises `inj-<ms>`, ressentis `se-<ms>`, pas `step-<ms>`, séances `sport-<ms>`, moments `metime-<ms>`, nuits `sleep-<ms>` ; repas, quantités d'aliment et menus favoris reçoivent un UUID version 7 (`newId`). Trois motifs à part : un aliment créé porte `user-custom-<ms>`, une recette `user-custom-recipe-<ms>` — **tester le préfixe `user-custom-` range les deux ensemble** —, et la pesée de départ fabriquée par la conversion porte l'identifiant fixe `starting-weight-log`. Les marques de journée existantes portent `gen-daily-<rang>`, motif de la seule fabrication de données d'essai. |
| Date | `date` : chaîne `AAAA-MM-JJ`, jour *local*. Jamais un instant UTC tronqué. |
| Heure | `time` : chaîne `HH:MM`, locale, ramenée à l'écriture à la minute ronde inférieure parmi 0, 10, 15, 20, 30, 40, 45, 50. |
| Instants techniques | `createdAt` et `sentAt` : entiers, millisecondes depuis l'époque Unix, distincts des dates locales. `updatedAt` n'est porté par **aucune** donnée enregistrée : il n'existe que dans les quatre types de la migration non implémentée. |
| Unités | Le stockage est métrique : kilogramme, centimètre, gramme, millilitre, milligramme, minute, mètre, kilocalorie. Aucune étiquette d'unité n'est enregistrée. |
| Décimales | Point décimal en stockage, quelle que soit la langue. |
| Références | Par identifiant, sauf **trois exceptions héritées**, où le texte *est* la clé : `SportLog.sport`, `MeTimeLog.activity`, `SideEffectLog.type`. S'y ajoute une table de compteurs indexée par nom d'aliment. Renommer une entrée de catalogue coupe les lignes déjà enregistrées de ce que ce catalogue leur apporte. |
| Suppression | Franche : la ligne quitte la sauvegarde. Aucun marqueur de suppression n'est conservé. |
| Modification | Fusion : les attributs absents de la charge sont conservés. C'est la fonction de fusion qui l'assure — sa charge est `Partial<T> & { id }` —, **et non le type** `LogUpdate<T>` = `Omit<T,'id'> & { id }`, qui exige au contraire tous les attributs. La charge de création est `NewLog<T>` = `Omit<T,'id'>`. |
| Dérivé | Rien de dérivable n'est stocké — une exception assumée, le cache nutritionnel d'un repas. |
| Bornes | Les fourchettes énoncées dans ce chapitre (0–6, 0–5, 1–5, positifs) sont des conventions de lecture. **Aucune n'est tenue par un type ni vérifiée à l'écriture** : ce sont des `number` nus. |
| Valeurs par défaut | Une ligne n'en a pas : tout attribut obligatoire est écrit à chaque enregistrement. Seul le profil a des valeurs d'usine, données plus bas. |

**Cas limites**

Une sauvegarde illisible n'est pas écrasée : elle est recopiée une fois sous `<clé>__secours` — suffixe **sans tiret final**, à ne pas confondre avec le préfixe `__secours-` des copies horodatées —, et plus rien n'est écrit de la session.

Neuf conversions s'appliquent au chargement, toutes idempotentes : retrait des lignes d'exemple, retrait des repas sans composition, passage des traitements du libellé à l'identifiant, repli de l'ancienne note de ressenti, fusion des deux noms du tennis de table, remplissage des faims manquantes, purge des lignes anciennement marquées supprimées, pose du drapeau de pesée de départ, oubli des attributs du suivi hydrique et des objectifs de poids supprimés.

Deux identifiants peuvent coïncider lorsqu'ils dérivent de l'horloge à la milliseconde ; seuls les UUID version 7 ferment ce cas.

### Les cardinalités

| Entité | Par journée | Au-delà |
| --- | --- | --- |
| Pesée | 1 **à l'ajout seulement** | À l'ajout, la ligne du jour est mise à jour : elle garde son identifiant, sa nature de départ, et les mensurations que la nouvelle charge ne porte pas. À la *modification*, aucun contrôle de date : redater une pesée sur un jour déjà occupé laisse deux lignes à la même date. |
| Prise de traitement | 2 | La dernière ligne du jour est réécrite. |
| Ressenti | 15 | La dernière ligne du jour est réécrite. |
| Séance d'activité | 15 | La dernière ligne du jour est réécrite. |
| Moment pour soi | 15 | La dernière ligne du jour est réécrite. |
| Sommeil | 15 | Refus : rien n'est écrit. |
| Repas ou en-cas | 30, comptés à la *date visée* | Refus. Déplacer un repas vers une date pleine est refusé aussi ; le repas reste à sa date d'origine. |
| Relevé de pas | illimité | Plusieurs lignes du même jour s'additionnent. |
| Marque de journée | aucun plafond | Rien ne dédoublonne les dates. |
| Aliment personnalisé | 50 *créations* | Refus. Une modification ne consomme rien. |
| Recette | 20 *créations*, quota indépendant du précédent | Refus. |
| Menu favori | 50 *créations* | Refus. |

Le décompte porte sur les lignes réellement présentes : supprimer une ligne du jour rend sa place. Une entrée créée avant l'arrivée de son instant de création n'est comptée dans aucune journée. Aucun plafond ne borne le nombre de quantités d'aliment d'un repas, le nombre d'ingrédients d'une recette, ni le nombre total de lignes d'une table : la seule limite réelle est celle du stockage local, de l'ordre de cinq mégaoctets, qu'aucun code ne mesure à l'avance.

### Le profil

Un seul exemplaire (`UserProfile`), sans identifiant : il est l'attribut `profile` de l'objet racine. Il porte l'identité corporelle, les objectifs quotidiens, les rappels et les drapeaux de suivi.

| Attribut | Type | Unité / valeurs | Obligatoire | Absent ou d'usine |
| --- | --- | --- | --- | --- |
| `name` | chaîne | — | oui | « Chloé » |
| `gender` | énuméré | `homme` · `femme` · `neutre` | oui | `femme` |
| `age` | entier | années | oui | 42 |
| `height` | nombre | centimètres | oui | 168 |
| `targetWeight` | nombre | kilogrammes, arrondi au dixième à l'écriture | oui | 72,0 |
| `silhouetteType` | énuméré | 8 valeurs : `sablier`, `poire`, `pomme`, `rectangle`, `triangle_inverse`, `trapeze`, `oval`, `triangle` | oui | `sablier` |
| `avatar` | `AvatarConfig` | voir ci-dessous | oui | voir ci-dessous |
| `glp1Brand` | chaîne | identifiant du catalogue des traitements | oui | `aucun` |
| `measurementSystem` | énuméré | `metric` · `imperial` — préférence d'unité : aucune valeur conservée n'en dépend, le stockage reste métrique | non | `metric` |
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
| `foodModuleHidden`, `stepsModuleHidden`, `sportModuleHidden`, `meTimeModuleHidden`, `sleepModuleHidden`, `treatmentModuleHidden`, `sideEffectsModuleHidden` | booléens | ne valent que suivi éteint ; rallumer le suivi efface le masquage | non | absent = non masqué |

Sept autres attributs booléens du profil ne modélisent rien du suivi : aucune règle de ce document ne les lit, un seul est obligatoire dans le type, et l'un d'eux est un nombre ou un booléen selon les sauvegardes. Ils sont hors périmètre et nommés dans « inventions ».

`silhouetteType` est obligatoire mais n'est réécrit par aucun geste de suivi : la valeur d'usine ou celle de la fabrication de données d'essai subsiste.

Trois attributs ont quitté le profil et subsistent dans les sauvegardes anciennes, lus par la seule conversion : `startingWeight`, `startingWeightDate`, `startingMeasurements`. Le poids de départ est devenu une pesée.

### L'avatar

Imbriqué dans le profil (`AvatarConfig`), sans identité propre. Trois de ses attributs sont des chaînes hexadécimales choisies dans des tables livrées : ce sont des données enregistrées, au même titre qu'un nom.

| Attribut | Type | Valeurs | Obligatoire | D'usine |
| --- | --- | --- | --- | --- |
| `gender` | énuméré | `homme` · `femme` · `neutre` | oui | `femme` |
| `faceShape` | énuméré | `oval` · `round` · `square` · `heart` | oui | `oval` |
| `skinColor` | chaîne | hexadécimal | oui | `#FFE5D9` |
| `eyeColor` | chaîne | hexadécimal | oui | `#2E8B57` |
| `hairStyle` | énuméré | `court` · `long` · `boucle` · `chauve` · `frange` · `brosse` | oui | `long` |
| `hairColor` | chaîne | hexadécimal | oui | `#4E3629` |
| `hasGlasses` | booléen | — | oui | faux |
| `expression` | énuméré | `happy` · `determined` · `proud` · `calm` | oui | `happy` |
| `customPhotoUrl` | chaîne | image importée ; renseignée, elle rend les huit autres attributs inertes | non | absent |

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

Ce que la fonction de garde tient à chaque écriture de la table :

```
la ligne marquee, s'il y en a une, est la plus ancienne au sens (date, heure)
une pesee anterieure au depart DEVIENT le depart
a date egale, le depart en place reste le depart
un historique sans aucun drapeau en recoit un sur sa plus ancienne ligne
vider l'historique epargne la ligne marquee
```

« Au plus une ligne marquée » n'est **pas** un invariant tenu. La garde cherche la *première* ligne drapeautée dans l'ordre de la table et sort sans rien réécrire dès que celle-ci est la plus ancienne, ou de même date : un historique portant deux drapeaux dont l'un est bien placé traverse toutes les écritures sans être réparé. La réécriture du drapeau sur toute la table n'a lieu que dans les deux autres cas — aucun drapeau, ou drapeau mal placé.

**Cas limites**

Le départ se reconnaît à son drapeau, jamais à sa valeur : repasser par son poids de départ ne fait pas d'une pesée ordinaire un départ.

Sur une sauvegarde ancienne sans drapeau, la conversion fabrique la pesée de départ à partir des trois attributs quittés du profil, sous l'identifiant `starting-weight-log`, à 08:00, ou à la veille de la plus ancienne pesée si aucune date n'était enregistrée.

Poser le poids de départ sans passer par la table crée la ligne si elle manque, et ne touche alors ni à sa date ni à ses mensurations.

> **Exemple.**
>
> Camille, 168 cm, part de 96,0 kg en mai 2026 : cette ligne porte le drapeau. Le 12 septembre elle enregistre 84,5 kg à 07:32, ramené à 07:30. Une seconde pesée le même jour à 20:12 met à jour la ligne du 12 — même identifiant, 20:10, et les mensurations du matin conservées si la nouvelle charge ne les porte pas.

### La prise de traitement

Une ligne par prise (`InjectionLog`) — injection ou comprimé, la même entité pour les deux formes.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date` | `AAAA-MM-JJ` | jour local | oui |
| `time` | `HH:MM` | minutes rondes | oui |
| `dose` | nombre | milligrammes, borne absente du type | oui |
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

Identifiants : `ozempic`, `wegovy-injection`, `mounjaro`, `zepbound`, `saxenda`, `victoza`, `trulicity`, `retatrutide`, `autre-injection`, `rybelsus`, `wegovy-oral`, `orforglipron`, `autre-comprime`, plus `aucun`. Un identifiant inconnu se résout sur `aucun`. L'entrée `orforglipron` porte le nom « Foundayo » : l'identifiant est resté celui de la molécule pour atteindre les données déjà enregistrées.

### Le repas ou l'en-cas

Une ligne par prise alimentaire (`SavedMealLog`). Sa composition est la source de vérité ; ses cinq valeurs nutritionnelles sont un cache recalculé à chaque écriture.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne (UUID v7) | — | oui |
| `date`, `time` | `AAAA-MM-JJ`, `HH:MM` | local, minutes rondes | oui |
| `type` | énuméré | `breakfast` · `lunch` · `dinner` · `snacks` · `repas` · `snack` | oui |
| `typeLabel` | chaîne | libellé dérivé du type, réécrit à chaque écriture ; un type inconnu donne « En-cas » | oui |
| `items` | `FoodQuantity[]` | **au moins un**, sans plafond ; retirer le dernier supprime le repas | oui |
| `calories`, `protein`, `carbs`, `fat`, `fiber` | nombres | kilocalories et grammes ; cache dérivé de `items` | oui |
| `hungerBefore`, `hungerAfter` | entiers | 0 à 5 par convention, borne non tenue | non |

Une quantité d'aliment (`FoodQuantity`) est imbriquée : elle n'existe pas hors de son parent et ne porte pas d'instants propres. Le même format sert aux repas, aux menus favoris et aux ingrédients d'une recette.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne (UUID v7) | régénéré à chaque copie ; aucune référence ne le vise | oui |
| `foodId` | chaîne | identifiant d'une entrée de la base de référence, ou d'un aliment personnalisé | oui |
| `isCustomFood` | booléen | dit laquelle des deux bases résoudre | oui |
| `qty` | nombre | **grammes** pour un solide, **millilitres** pour un liquide — jamais autre chose | oui |

```
apport(item) = fiche(item.foodId) * item.qty / 100      // les fiches valent pour 100 g ou 100 ml
apport(repas) = somme des apports des items resolus     // un item non resolu est ignore, pas compte a zero
```

**Cas limites**

Les repas antérieurs au passage à une composition d'aliments portaient leur contenu dans une phrase ; ils sont écartés au chargement. Le critère est l'*absence* de `items`, jamais une liste vide.

Un repas dont les deux niveaux de faim manquent en reçoit deux, déduits du moment de la journée, de son apport et de son identifiant — jamais une valeur unique, jamais un tirage au sort. Une ligne qui porte déjà ses deux valeurs n'est pas retouchée : un 0 enregistré reste un 0 enregistré.

Un aliment personnalisé supprimé laisse son item irrésoluble : le repas garde ses valeurs, l'item n'a plus de fiche.

### L'aliment

Deux bases distinctes, même forme (`CiqualFood`, dont `UserCustomFood` est un alias). La base de référence est livrée avec le produit et non modifiable ; celle des aliments créés vit sous la clé `glp1_user_custom_foods`.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `alim_code` | chaîne | identité ; `user-custom-<ms>` pour un aliment créé, `user-custom-recipe-<ms>` pour une recette | oui |
| `alim_nom_fr` | chaîne | libellé officiel ; à la création, première lettre mise en capitale et texte détouré | oui |
| `nom_court` | chaîne | libellé abrégé. Les 2 108 entrées dont le libellé officiel dépasse 30 signes en portent toutes un ; la borne de 32 signes est une intention, une entrée en compte 34 | non |
| `nom_generique` | chaîne | nom de famille de l'aliment ; **les collisions sont voulues**, ce n'est pas un identifiant | non |
| `calories`, `protein`, `carbs`, `fat`, `fiber` | nombres | pour 100 g ou 100 ml | oui |
| `isLiquid` | booléen | nature de l'aliment ; absent, il se dérive de `unit === 'ml'`, donc solide par défaut | non |
| `unit` | énuméré | `g` · `ml`. Attribut ancien mais **toujours écrit** : c'est le seul attribut de nature que pose la création d'un aliment, qui n'écrit jamais `isLiquid` | non |
| `isUserCustom`, `isRecipe` | booléens | origine de l'entrée et nature du quota qu'elle consomme | non |
| `recipeIngredients` | `FoodQuantity[]` | composition d'une recette, sans plafond ; les valeurs nutritionnelles n'en dépendent pas après coup | non |
| `barcode` | chaîne | EAN-13 ou UPC-A ; **chaîne et non nombre**, les zéros de tête sont signifiants | non |
| `valide` | booléen | marque de revue du libellé court | non |
| `createdAt` | entier | millisecondes ; posé à la création seule, jamais réécrit | non |

La base de référence compte 3 258 entrées, toutes pourvues d'un nom générique et d'une nature liquide ou solide, dont 2 425 portent un nom court. S'y ajoutent deux entrées écrites à la main, résolues de la même façon mais réduites à leur libellé et à leurs cinq valeurs : ni nom générique, ni `isLiquid`, ni `unit` — donc solides par défaut. La base est indexée par identifiant ; une consommation ne s'y rapproche jamais par ressemblance de nom.

Une recette est un aliment personnalisé qui porte sa composition. Elle n'a pas de nom propre : son nom *est* celui de l'aliment qu'elle définit, et ses valeurs sont rapportées à 100 g de la composition entière.

```
invariant : un ingredient de recette existe toujours
=> supprimer un aliment reference par une recette est refuse
```

**Cas limites**

L'unicité du nom se juge après détourage, mise en minuscules et retrait des accents, contre les deux bases à la fois ; une entrée en cours de modification ne se déclare pas en doublon d'elle-même.

Un attribut nutritionnel laissé vide à la création vaut zéro.

Les recettes d'avant le passage à une composition référencée se reprennent avec une composition vide.

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
| `type` | chaîne | le *nom* de l'effet — jamais un identifiant. Tiré du catalogue de 36 entrées, ou libre | oui |
| `severity` | entier | 1 à 5 par convention, borne non tenue par le type | oui |
| `notes` | chaîne | texte libre, enregistré tel quel ; un texte réduit à des espaces vaut absence | non |

Un second attribut de texte libre, `description`, a existé ; il est replié dans `notes` au chargement, `notes` l'emportant quand les deux sont remplis.

### Le relevé de pas

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date` | `AAAA-MM-JJ` | jour local — **pas d'heure** | oui |
| `steps` | entier | nombre de pas, non borné | oui |
| `isSimulated` | booléen | marque une ligne fabriquée et non relevée | non |

Seule entité sans plafond quotidien : plusieurs lignes du même jour s'additionnent, et une journée relevée est une journée dont la somme est strictement positive.

### La séance d'activité

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date`, `time` | `AAAA-MM-JJ`, `HH:MM` | local, minutes rondes | oui |
| `sport` | chaîne | **le nom est la clé** : c'est lui qui retrouve l'équivalent métabolique au catalogue. Le renommer couperait les séances enregistrées de leur dépense | oui |
| `intensity` | énuméré | `douce` · `moderee` · `intensive` | oui |
| `duration` | nombre | minutes, non bornées | oui |
| `distance` | nombre | **mètres** ; renseignée, la dépense se calcule sur l'allure et non sur l'intensité | non |
| `notes` | chaîne | texte libre | non |

Une conversion au chargement ramène « Ping-pong » et « Tennis de table » à la clé unique « Ping-pong/Tennis de table », sans quoi ces séances perdraient leur dépense.

### Le moment pour soi

Même forme qu'une séance, sans intensité, sans distance et sans dépense (`MeTimeLog`).

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | — | oui |
| `date`, `time` | `AAAA-MM-JJ`, `HH:MM` | local, minutes rondes | oui |
| `activity` | chaîne | le nom, comme clé ; catalogue de neuf entrées | oui |
| `duration` | nombre | minutes | oui |
| `notes` | chaîne | texte libre | non |

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
| `quality` | entier | 0 à 5 par convention, borne non tenue par le type ; toujours écrit | oui |
| `notes` | chaîne | texte libre | non |

```
duree(nuit) = instant(date, time) - instant(bedDate, bedTime)   // en minutes
si reveil <= endormissement : rien n'est ecrit dans la table
```

Écrire les deux jours est ce qui rend une paire d'instants impossible reconnaissable : avec les seules heures, tout couple se lisait comme une nuit passée par minuit.

**Cas limites**

Une qualité à 0 est indiscernable d'une qualité choisie à 0 ; aucune ligne n'est réécrite pour lever l'ambiguïté.

### La marque de journée

Une ligne sans contenu (`DailyLog`) : un identifiant et une date, et rien d'autre.

| Attribut | Type | Unité / valeurs | Obligatoire |
| --- | --- | --- | --- |
| `id` | chaîne | les seules lignes existantes portent `gen-daily-<rang>` | oui |
| `date` | `AAAA-MM-JJ` | jour local | oui |

Elle a porté trois contenus, tous disparus — les ressentis notés par symptôme, les quatre repas en texte libre, le total d'hydratation. Ne subsiste que sa *présence* à une date, lue par deux calculs seulement : le choix d'un message parmi plusieurs, et le comptage des jours du document médical. **[non implémenté]** Aucun geste n'en crée : seule la fabrication de données d'essai en écrit.

### Les catalogues livrés

Trois listes de référence livrées avec le produit et jamais écrites. Les lignes de suivi y renvoient par leur `value`, qui est un texte.

| Catalogue | Attributs | Entrées | Référencé par |
| --- | --- | --- | --- |
| `SportPreset` | `value` (chaîne), `label` (chaîne), `met` (nombre, équivalent métabolique) | 54 | `SportLog.sport` |
| `MeTimePreset` | `value`, `label` — aucune valeur métabolique, rien ne se calcule sur ces moments | 9 | `MeTimeLog.activity` |
| `SideEffectOption` | `value`, `label` | 36 | `SideEffectLog.type` |

Dans les trois, `value` et `label` portent aujourd'hui le même texte français : rien ne les distingue, et c'est ce qui rend la traduction impossible sans rompre les lignes enregistrées.

### Les listes d'entrées actives

Trois listes de chaînes, conservées hors de l'objet racine. Elles désignent le sous-ensemble d'un catalogue tenu pour actif ; elles ne retirent rien des lignes enregistrées, et une ligne peut parfaitement porter un nom absent de sa liste.

| Réserve | Type | Défaut |
| --- | --- | --- |
| `glp1_active_sports` | liste de clés d'activité | 7 entrées sur 54 |
| `glp1_active_side_effects` | liste de noms d'effets | 12 entrées sur 36 |
| `glp1_active_me_time` | liste de noms d'activités | 6 entrées sur 9 |

### Les états tenus hors de la sauvegarde

Des états dérivés mais *mémorisés*, parce qu'ils décident d'un « déjà fêté » ou d'un « déjà vu » qu'aucun recalcul ne retrouverait.

| État | Type | Ce qu'il retient |
| --- | --- | --- |
| Paliers de récompense connus (`BadgeTiersConnus`, `glp1_badge_tiers_connus`) | `Record<identifiant, palier>`, palier parmi `aucun`, `eveil`, `bronze`, `argent`, `or` | Le dernier palier observé de chacune des quatre récompenses. On part de l'état connu : un suivi éteint ne fait pas retomber son palier à « jamais observé ». |
| Assignation d'équivalences (`LudicUsageState`, `glow_ludic_usage`) | `{ counts: Record<nom, entier>, assignment? }`. L'assignation porte `signature` (chaîne `<id>\|<date>\|<heure>` de la pesée la plus récente), `totalKg` et `lastKg` facultatifs (pertes au dixième), `total` et `last` (deux listes de `DecomposedLudicItem`) | Les compteurs par objet et l'assignation en cours. Chaque nouvelle pesée réassigne, même à poids inchangé. Une assignation sans les deux pertes est tenue pour périmée et recalculée une fois. La pesée la plus récente s'y détermine avec une heure absente valant `00:00`, non midi. |
| Compteurs de sélection d'aliment (`glp1_food_selection_counts`) | `Record<nom d'aliment, entier>` | Combien de fois chaque aliment a été retenu ; la table est relue avant chaque incrément. Indexée par nom, non par identifiant. |
| Date de première ouverture (`glp1_first_open_date`) | chaîne `AAAA-MM-JJ` | L'ancre du délai de sept jours. À défaut, la donnée la plus ancienne de toutes les tables, ou aujourd'hui. |
| Paliers nutritionnels fêtés (`glp1_paliers_nutritifs_fetes`) | `{ date, nutriments: ('proteines'\|'fibres')[] }` | Ce qui a déjà été fêté ce jour-là. |
| Marques de célébration (`glp1_notified_bmi_tier_index`, `glp1_dynamique_celebrated`) | chaînes nues | Palier d'IMC notifié, section déjà dévoilée. Deux clés héritées portaient la pesée déjà fêtée : elles ne sont plus ni lues ni écrites. |
| Consentement médical (`hasAcceptedMedicalDisclaimer_v1`) | chaîne nue `'true'` | L'avertissement médical a été accepté. Aucun instant, aucune version du texte accepté. |

### Les copies de secours

Une copie intégrale de la sauvegarde, prise *avant* tout geste qui remplace en masse (`BackupEntry`). L'index, lui-même une réserve à part, vit sous `<clé>__secours-index` et porte la liste des copies, du plus récent au plus ancien ; chaque copie vit sous `<clé>__secours-<horodatage>`. Un index illisible vaut liste vide.

| Attribut | Type | Valeurs |
| --- | --- | --- |
| `key` | chaîne | où la copie se trouve |
| `stamp` | chaîne | `AAAA-MM-JJ-HHMMSS`, heure locale |
| `reason` | chaîne | ce qui l'a déclenchée, en clair |
| `size` | entier | taille en signes |

Deux invariants : une copie n'en recouvre jamais une autre, et une copie n'est déclarée faite qu'après avoir été relue et comparée signe pour signe. L'appelant a le droit de refuser d'écrire quand la mise à l'abri a échoué. Rien ne les efface automatiquement.

```
cle libre : <cle>__secours-<stamp>, puis -2, -3 … -99, enfin -<ms>
```

### Le compte et ce qui quitte l'appareil

Le compte est distant ; les données de suivi ne le sont pas. Rien ne part sans un geste explicite, et aucune ligne de suivi ne part jamais.

| Entité | Attributs | Portée |
| --- | --- | --- |
| Compte connecté (`AuthUser`) | `id`, `email` ou `null`, `name` ou `null` | La session est mémorisée jusqu'à déconnexion explicite. L'état de connexion vaut « en cours », « déconnecté » ou « connecté ». |
| Message envoyé (`FeedbackItem`) | `id`, `type` (`avis` · `feature` · `bug`), `sentiment` (`content` · `neutre` · `pas_content`), `category`, `message`, `date` (libellé), `sentAt` (ms), `acceptsContact` | Sur l'appareil sous `glp1_user_feedbacks`, et à distance en `feedbacks/{uid}/messages/{id}` — un document par message. |
| Réponse au questionnaire (`StoredSurvey`) | `ratings` : sept notes par proposition ; `otherSuggestion` ; `sendLog` : instants des envois | **Une seule réponse**, réécrite à chaque envoi, sous `glp1_user_survey_v2` — l'ancienne clé `glp1_user_survey` n'est plus lue qu'en repli. À distance, `surveys/{uid}`, document unique par compte, fusionné, avec un cumul d'envois qui ne redescend jamais. |
| Échec d'export (`ReportExportFailure`) | `kind`, `errorName`, `errorMessage`, `errorStack`, `stage`, `stageLabel`, `periodWindow`, `periodStart`, `periodEnd`, `periodDays` (ou `null`), `selection` et `selected`, `effective` et `drawn`, `volumes` et `volumesTotal`, `palette`, `mealDetail`, `elapsedMs` | `reportErrors/{uid}/failures/{id}`, un document par échec. Des comptes et des bornes, jamais une valeur du carnet ; deux dates font exception, les bornes de la période demandée. |
| Courrier (`mail/{id}`) | `uid`, `kind`, `to`, `replyTo`, `message{subject, html, text}`, `createdAt` | La quatrième collection : une boîte d'envoi lue par un service tiers, où le contenu du message repart vers une adresse en clair. Le client n'y écrit que des créations et ne les relit jamais. |
| Plafond d'alerte (`glp1_send_cap_alert`) | chaîne nue `<identifiant>:<AAAA-MM-JJ>` | Le jour où l'alerte de plafond est déjà partie, par compte, pour ne pas la répéter. |

Chaque envoi emporte un contexte technique de vingt-quatre attributs (`SubmissionContext`) : la version, quatre attributs de provenance dans le produit avec leurs libellés, quatre réglages de présentation, les dimensions du cadre et du support avec sa finesse, la langue du navigateur et la liste complète des langues qu'il annonce, la langue du produit, l'instant de l'envoi sous quatre formes, le fuseau et son écart en minutes, la chaîne d'agent utilisateur, le mode de compilation. Aucun n'est une donnée de suivi. Le consentement à être recontactée est absent des messages écrits avant qu'il ne soit demandé : il ne se présume pas.

### Déclarés sans table derrière

Ces types existent dans le modèle et décrivent la cible d'une migration entamée ; aucune donnée n'est enregistrée sous cette forme. **[non implémenté]**

| Type | Ce qu'il déclare | Ce qui tient la place |
| --- | --- | --- |
| `CustomFood` | `id`, `name`, cinq valeurs pour 100 g/ml, `isLiquid` obligatoire, `barcode`, `recipeId`, `createdAt`, `updatedAt` | `UserCustomFood`, aux attributs nommés autrement et sans `updatedAt` |
| `Recipe` | `id`, `ingredients`, `createdAt`, `updatedAt` — une recette sans nom, le nom étant celui de l'aliment qu'elle définit | L'attribut `recipeIngredients` de l'aliment personnalisé |
| `SideEffectType` | `id`, `label`, `createdAt`, `updatedAt` — un effet référencé par identifiant et traduisible | Une liste de *noms* livrée, et le nom stocké dans chaque ligne |
| `SportType` | idem, plus `met` | Le catalogue d'activités, référencé par son texte |
| `HungerLevel`, `SeverityLevel` | Entiers bornés, 0–5 et 1–5 | Des `number` non bornés par le type |
| `OnboardingAnswers` (26 attributs, tous facultatifs), `OnboardingState` (`answers` et `skipped`), et les six énumérés `OnboardingGoal` (`perdre` · `stabiliser` · `masse`), `ActivityLevel`, `ActivityWish`, `SessionKind`, `SessionRate`, `StartedSince` (union : jour précis ou approximation) | Le questionnaire d'installation de la V1 : objectif, antériorité du traitement, poids de départ et sa date, poids actuel et sa date, poids visé, taille, âge, activité et souhaits, séances, cahier alimentaire, trois suivis, préférences de moments pour soi, genre, prénom. Poids en kilogrammes, dates en `AAAA-MM-JJ` | **Rien** : aucune de ces réponses n'est écrite, ni dans le profil, ni dans une table, ni dans une réserve |

Deux entités ont été supprimées et ne doivent pas revenir : le relevé d'hydratation et les objectifs de poids à paliers. Leurs traces sont écartées à chaque chargement.

### Ce que la V2 a décidé autrement **[V2]**

La V2 ne conserve encore rien : les réponses recueillies vivent en mémoire et un rechargement les perd. **[non implémenté]** Ce qu'elle a tranché sur les entités vaut néanmoins, et prime sur la V1.

| Sujet | V1 | V2 |
| --- | --- | --- |
| Âge | `age`, entier d'années — se périme | `anneeNaissance`, entier. Bornes : de l'année courante moins 130 à l'année courante moins 1. Défaut 1980 |
| Taille | `height`, centimètres | `tailleCm`, centimètres, défaut 165. Bornes 50–300 cm, ou 20–118 pouces |
| Poids | nombre, arrondi au dixième | `poids` et `poidsCible`, **deux chaînes à point décimal** (« 95.0 »), jamais converties en nombre — aucun code ne les convertit, faute d'écriture. Deux attributs indépendants qui ne se recopient jamais l'un l'autre. Plafonds 999 kg et 2 000 lb — deux plafonds ronds, non convertis l'un de l'autre |
| Objectif | `OnboardingGoal`, trois valeurs, sans table derrière | `objectif` : `perdre` · `stabiliser`. Le poids visé n'est recueilli que sur `perdre`, et n'est **jamais** lié au poids actuel |
| Système d'unités | `measurementSystem` : `metric` · `imperial` | `Systeme` : `metrique` · `imperial`. Chaque langue apporte le sien (`fr` → métrique, `en` → impérial) ; il reste rechoisissable. Le stockage demeure métrique |
| Langue | absente du modèle | `Langue` : `fr` · `en`. Recueillie, pas encore branchée **[non implémenté]** |
| Prénom | `name`, valeur d'usine « Chloé » | `prenom`, chaîne partant vide |
| Avatar | `AvatarConfig`, avec image importée | `Avatar` : `genre` (`femme` · `homme` · `neutre`), `formeVisage` (`ovale` · `rond` · `carre` · `coeur`), `couleurPeau`, `couleurYeux`, `coiffure` (`court` · `long` · `boucle` · `frange` · `brosse` · `chauve`), `couleurCheveux`, `lunettes`, `expression` (`joyeuse` · `determinee` · `fiere` · `calme`). Les trois attributs hexadécimaux se choisissent dans des tables livrées de 6, 5 et 6 valeurs. Ni image importée, ni tirage au sort. Le genre fait partie de l'avatar et n'est plus une donnée à part ; il détermine la coiffure de départ |
| Silhouette | `silhouetteType`, obligatoire | Supprimée |
| Traitement | `Treatment` : 11 attributs, dont posologie et cinétique | `Traitement` : `id`, `nom`, `forme` (`injection` · `comprime`). Treize entrées, chaque forme finissant par « Autre ». Aucune posologie, aucune cinétique |
| Identifiant du treizième traitement | `orforglipron`, nommé « Foundayo » | `foundayo`. Les douze autres identifiants coïncident ; les formes divergent (`oral` contre `comprime`) |
| Absence de traitement | une entrée `aucun` du catalogue | Une réponse à part, `traitementCommence`, booléen vrai par défaut, jamais nul. Répondre « non » efface `formeTraitement` et `traitement` ; changer de forme efface `traitement` |
| Compte | identité distante seule | `email` et `motDePasse` recueillis ; **une seule contrainte**, huit signes au moins. Un mot de passe vide ne bloque pas |

`Reponses` compte quinze attributs. Le quinzième, `theme`, est une préférence de présentation : hors périmètre de ce document.

> **Exemple.**
>
> Camille en V2 : `anneeNaissance` 1978, `tailleCm` 168, `poids` « 96.0 » (une chaîne), `objectif` `perdre`, `traitementCommence` vrai, `formeTraitement` `injection`, `traitement` `ozempic`. Rien de tout cela n'est écrit nulle part, ni converti en nombre.

## 3. Grandeurs, unités et nombres

Chaque grandeur mesurée a une unité de conservation unique, et le nombre conservé ne porte jamais l'étiquette de cette unité. Ce chapitre donne ces unités, les facteurs de conversion exacts, les bornes admises, les arrondis appliqués au moment d'écrire, les valeurs par défaut et la forme littérale d'un nombre au stockage.

### Les unités canoniques

Une valeur est conservée en unité métrique de base, sans étiquette. Le motif n'est pas la commodité : une étiquette conservée serait une seconde source de vérité, et elle se désynchroniserait de la donnée dont elle dérive. L'unité d'une quantité d'aliment se recalcule à chaque lecture depuis la nature solide ou liquide de la fiche référencée ; reclasser un aliment de solide en liquide change donc l'unité de toutes les quantités déjà enregistrées qui le référencent, sans en réécrire aucune. Même règle pour une distance : jamais d'étiquette d'unité au stockage.

Le système d'unités est une préférence du compte : il détermine l'unité dans laquelle une valeur est exprimée vers l'extérieur et interprétée quand elle arrive, jamais celle dans laquelle elle est conservée. Deux systèmes existent, `metrique` et `imperial` ; le défaut est `metrique`, et la langue choisie repose le système sur celui qu'elle amène — le français le métrique, l'anglais l'impérial — sans l'imposer, le système restant rechoisissable ensuite. **[V2]**

La règle est tenue en V2 pour la taille, qui est convertie aux deux extrémités et conservée en centimètres quelle que soit l'unité choisie. Elle n'est pas tenue pour le poids : aucun facteur livre ↔ kilogramme n'existe, et la valeur retenue est le nombre choisi dans l'unité du système — un nombre de livres en impérial, un nombre de kilogrammes en métrique. Le système change aussi le plafond du poids (999 contre 2 000) et son étiquette, mais ne le convertit pas. **[non implémenté]**

En V1, la préférence de système est déclarée dans le compte mais n'a aucun lecteur, et les fonctions de conversion des quantités d'aliments n'ont aucun appelant : l'unité effective y est toujours métrique, en toute circonstance. **[non implémenté]**

La conséquence tient en une phrase, et elle est vraie de la taille, fausse du poids : changer de système ne change aucune valeur déjà enregistrée.

| Grandeur | Unité de conservation | Type | Granularité conservée |
| --- | --- | --- | --- |
| Poids d'une pesée, poids de départ, poids visé (V1) | kilogramme | nombre | dixième de kilogramme |
| Poids **[V2]** | kilogramme ou livre, selon le système — faute de conversion | texte décimal, converti en nombre plus tard | dixième de l'unité : dixième de kilogramme, dixième de livre |
| Taille | centimètre | entier | 1 cm |
| Mensuration (neuf, toutes facultatives) | centimètre | nombre | dixième de centimètre |
| Quantité d'un aliment solide | gramme | nombre | dixième de gramme |
| Quantité d'un aliment liquide | millilitre | nombre | dixième de millilitre |
| Énergie d'une fiche d'aliment (pour 100 g ou 100 ml), objectif d'énergie | kilocalorie | nombre | dixième de kilocalorie |
| Protéines, glucides, lipides, fibres d'une fiche (pour 100 g ou 100 ml) | gramme | nombre | dixième de gramme |
| Dose d'une prise de traitement | milligramme | nombre | millième de milligramme |
| Durée d'une séance, d'un moment pour soi | minute | entier | 1 min |
| Montée d'escaliers | étage | entier | 1 étage — la seule activité dont la « durée » ne compte pas des minutes |
| Distance parcourue pendant une séance | mètre | entier | 1 m, imposé à l'écriture |
| Pas d'une journée | sans unité (un compte) | entier | 1 pas |
| Poids d'un objet de comparaison | kilogramme | nombre | gramme : la valeur arrive en grammes entiers et est divisée par 1000 |
| Âge (V1) | année | entier | 1 an — remplacé en V2 par l'année de naissance, qui ne se périme pas **[V2]** |
| Instant technique (création, modification, suppression) | milliseconde depuis l'époque Unix | entier | 1 ms |
| Date d'une entrée | jour local, `AAAA-MM-JJ` | chaîne | 1 jour, sans fuseau |
| Heure d'une entrée | heure murale locale, `HH:MM` | chaîne | quantifiée sur huit minutes rondes, voir plus bas |

Les objectifs quotidiens vivent dans le compte, chacun dans l'unité de la grandeur qu'il vise : énergie en kilocalories (à défaut 1 400), protéines en grammes (à défaut le poids courant en kilogrammes multiplié par 1,5, arrondi à l'entier), fibres en grammes (à défaut 25). L'objectif de pas, lui, n'est pas conservé : c'est une constante de 8 000 pas.

L'énergie n'existe qu'en kilocalories : aucune valeur n'est conservée en kilojoules, et aucun facteur de conversion vers le kilojoule n'existe — le kilojoule n'apparaît qu'à titre de faute possible d'une fiche importée. L'énergie d'un repas est dérivable de ses quantités et des fiches qu'elles référencent ; elle est néanmoins conservée, avec quatre autres valeurs dérivées, ce que la section des grandeurs dérivées détaille.

**Cas limites**

- Une quantité d'aliment est conservée sans savoir si elle est un poids ou un volume : c'est la fiche référencée qui le dit, à la lecture.
- Un code-barres est conservé en chaîne et non en nombre : les zéros de tête d'un code à douze chiffres seraient perdus par un type numérique.
- La durée d'un sommeil n'est pas conservée : elle se déduit du jour et de l'heure d'endormissement et du jour et de l'heure de réveil, franchissement de minuit compris.
- La granularité effective du poids en impérial est le dixième de livre — le dixième de l'unité, quelle qu'elle soit ; seul le kilogramme a une sous-unité nommée, la centaine de grammes. **[V2]**

> **Exemple.**
>
> Camille choisit l'anglais : le système passe à l'impérial. Sa taille reste conservée à 168, en centimètres. Son poids de 96, lui, est conservé tel quel et vaut désormais 96 livres — c'est le défaut décrit ci-dessus, non une propriété voulue.

### Les conversions et leurs facteurs

Une conversion n'a lieu qu'aux deux extrémités : quand une valeur entre, et quand elle sort. Aucun facteur n'est appliqué au stockage, et aucun n'est appliqué deux fois.

| De | Vers | Facteur | Arrondi appliqué | Où |
| --- | --- | --- | --- | --- |
| pouce | centimètre | × 2,54 (exact) | à l'entier | taille **[V2]** |
| centimètre | pouce | ÷ 2,54 | à l'entier | taille **[V2]** |
| kilomètre | mètre | × 1000 | au mètre | distance d'une séance |
| gramme | kilogramme | ÷ 1000 | aucun | poids d'un objet de comparaison |
| étage | minute | × 0,5 | aucun | minutes pondérées d'activité |
| kilocalorie | gramme de masse corporelle | ÷ 8000, puis × 1000 | au gramme | différentiel énergétique de sept jours |
| once avoirdupois | gramme | × 28,349523125 (exact) | aucun | quantité d'aliment solide — fonction sans appelant **[non implémenté]** |
| once liquide américaine | millilitre | × 29,5735295625 (exact) | aucun | quantité d'aliment liquide — fonction sans appelant **[non implémenté]** |
| kilogramme, litre | gramme, millilitre | × 1000 | aucun | quantité fournie en grande unité — fonction sans appelant **[non implémenté]** |
| livre | kilogramme | aucun facteur n'existe **[non implémenté]** |  |  |

Les deux fonctions de conversion de la taille sont les seuls endroits où le pouce existe. Elles arrondissent à l'entier aux deux bouts : la conversion n'est donc pas une involution — une taille exprimée en pouces puis réinterprétée en centimètres peut perdre un centimètre.

```
centimetres = arrondi(pouces × 2,54)
pouces      = arrondi(centimetres ÷ 2,54)
166 cm → 65 in → 165 cm
```

Le facteur énergie → masse corporelle vaut 8 000 kilocalories par kilogramme. Il ne sert qu'au différentiel de sept jours, qui rend une masse en grammes : `arrondi(differentielKcal ÷ 8000 × 1000)`.

Une table d'équivalences entre unités usuelles et unités de conservation existe : 16 contenants génériques (un verre, une tasse, un bol, une cuillère à soupe, indépendants de ce qu'on y met) et 74 unités attachées à une famille d'aliments par son nom générique (un œuf, une part de pizza, une tranche de pain), le nombre de tailles par ligne étant libre. Chaque valeur est un poids net comestible, jamais un poids brut, et chaque ligne dont le net diffère du brut nomme la partie retirée. Rien ne lit cette table. **[non implémenté]**

> **Exemple.**
>
> Camille mesure 168 cm. En impérial, sa taille est exprimée 66 pouces (168 ÷ 2,54 = 66,14) ; réinterprétée, elle revaut 168 cm (66 × 2,54 = 167,64). Sa valeur conservée n'a pas bougé : 168.

### Les bornes

Les bornes n'écartent que l'absurde : la valeur aberrante et la valeur absente. Elles ne disent jamais à quelqu'un quel corps il a le droit d'avoir — c'est la raison pour laquelle un âge va jusqu'à 130 ans et une taille jusqu'à 3 mètres. La V2 fait foi ; les bornes de la V1 sont données quand elles diffèrent.

| Grandeur | Minimum | Maximum | Vide admis |
| --- | --- | --- | --- |
| Poids, en kilogrammes **[V2]** | 1 | 999 | non |
| Poids, en livres **[V2]** | 1 | 2000 | non |
| Poids, en kilogrammes (V1) | 0,1 | 1000 | non |
| Taille, en centimètres | 50 | 300 | non |
| Taille, en pouces **[V2]** | 20 | 118 | non |
| Âge, en années (V1) | 1 | 130 | non |
| Année de naissance **[V2]** | année courante − 130 | année courante − 1 | non |
| Mensuration, en centimètres | 1 | 300 | oui |
| Durée, en minutes | 1 | 480 | non |
| Étages | 1 | 480 | non |
| Distance fournie en kilomètres | 0,1 | 1000 | oui |
| Distance fournie en mètres | 10 | 100000 | oui |
| Dose, en milligrammes | 0,001 | 1000000 | non |
| Quantité d'un aliment | 1 | 10000 | non |
| Valeur nutritionnelle pour 100, fournie à la main | 0 | 10000 | oui |
| Énergie pour 100, venue d'un code-barres | 0 | 900 | oui (écartement) |
| Macronutriment pour 100, venu d'un code-barres | 0 | 100 | oui (écartement) |
| Poids d'un objet de comparaison, en grammes | 1 | 1000000 | non |

Trois régimes de borne coexistent, et ils ne produisent pas le même effet. Le **refus** : la valeur hors bornes n'est pas retenue, la valeur antérieure demeure — c'est le régime de toutes les grandeurs de la V1. La **restriction du domaine** : l'ensemble des valeurs admissibles est exactement l'intervalle, il n'y a donc rien à refuser — c'est le régime retenu en V2 pour le poids, la taille et l'année de naissance. L'**écartement** : la valeur hors bornes devient une absence de valeur, jamais un rabattement sur la borne — c'est le régime des valeurs nutritionnelles venues d'un code-barres, où une fiche fausse doit se présenter comme une donnée manquante plutôt que se déguiser en valeur ronde. **[V2]**

Les deux plafonds de poids ne sont pas la conversion l'un de l'autre : 999 kg valent 2 202 lb, et non 2 000. Ce sont deux plafonds ronds, chacun choisi dans son unité, et ce choix est délibéré. Le domaine de la V2 ne porte que ces plafonds : il ne déclare aucun plancher de poids, le 1 vient de l'ensemble des valeurs admissibles et du registre des décisions, non du modèle. **[V2]**

Les bornes en pouces sont la conversion arrondie des bornes en centimètres, mais l'aller-retour ne se referme qu'en haut : 118 pouces valent exactement 300 cm, tandis que 20 pouces valent 51 cm. En impérial, la plus petite taille atteignable est donc 51 cm et 50 cm est inatteignable ; l'intervalle effectif en centimètres dépend de l'unité choisie.

La borne haute est facultative dans le modèle de contrainte : une grandeur peut n'avoir aucun plafond défendable, et n'en porter aucun. Le signe négatif n'est jamais admis : il est retiré de ce qui arrive plutôt que refusé après coup. Zéro reste une réponse juste là où elle a un sens — un aliment sans calories.

La frontière de ce chapitre passe entre les grandeurs mesurées et les textes. Deux longueurs de texte sont pourtant bornées et le disent ici pour mémoire : le libellé d'un produit venu d'un code-barres est tronqué franchement à 120 caractères, et la longueur d'un nom filtré par un outil interne de revue va de 0 à 200 lettres, vide admis. Ni l'une ni l'autre n'est une grandeur.

**Cas limites**

- Une valeur non finie n'est jamais retenue ; elle est traitée comme une absence de valeur.
- Une grandeur facultative distingue le vide de zéro : une mensuration non prise n'est pas une mensuration nulle.
- Une borne en pouces borne ce qui est fourni en pouces, pas le résultat de sa conversion : d'où l'asymétrie du plancher et du plafond.
- Le plafond de poids en V1 (1000 kg) est supérieur au plafond en V2 (999 kg) : une valeur déjà enregistrée entre les deux resterait valide, aucune migration ne la ramène.
- Sous le régime de la restriction du domaine, la borne cesse d'être une vérification : rien ne revérifie l'intervalle en centimètres quand la taille est fournie en pouces.

### Les arrondis

Deux familles d'arrondis appartiennent à ce document. L'arrondi d'écriture change la valeur conservée : il est appliqué une fois, au moment d'enregistrer. L'arrondi de calcul intervient dans une grandeur dérivée : il détermine la valeur du résultat. L'arrondi de restitution ne modifie aucune donnée ; il est hors de ce document.

| Grandeur | Règle | Moment |
| --- | --- | --- |
| Poids (pesée, départ, visé) | `arrondi(kg × 10) ÷ 10` | à l'écriture |
| Distance d'une séance | `arrondi(mètres)` | à l'écriture |
| Taille convertie **[V2]** | `arrondi(pouces × 2,54)` | à l'écriture |
| Heure d'une entrée | plus grande minute ronde inférieure ou égale | à l'écriture |
| Poids d'un objet de comparaison | `grammes entiers ÷ 1000` — aucun arrondi, la valeur entrante étant entière | à l'écriture |
| IMC | `arrondi(imc × 10) ÷ 10` | au calcul |
| Points d'IMC | `arrondi(écart × 10) ÷ 10`, sur l'écart et non sur les deux IMC | au calcul |
| Énergie dépensée par une séance ou par des pas | arrondi à l'entier, entrée par entrée | au calcul |
| Énergie ingérée d'une journée | arrondi à l'entier, une fois la somme faite | au calcul |
| Objectif de protéines par défaut | `arrondi(poids × 1,5)` | au calcul |
| Durée de marche estimée | `arrondi(pas ÷ 95)`, en minutes | au calcul |
| Distance moyenne de marche | une décimale, arrondie dans le calcul pour que tout lecteur en hérite | au calcul |
| Poids moyen sur sept jours | `arrondi(moyenne × 10) ÷ 10` | au calcul |
| Atteinte d'un objectif, en pourcent | `max(0, min(100, arrondi(valeur ÷ objectif × 100)))` | au calcul |
| Masse équivalente à un différentiel d'énergie | `arrondi(kcal ÷ 8000 × 1000)`, en grammes | au calcul |

L'arrondi du poids au dixième vaut pour les trois poids du modèle — la pesée, le poids de départ, le poids visé : la granularité appartient à la grandeur, et non à l'un de ses emplois. L'arrondi des points d'IMC porte sur l'écart et non sur les deux IMC pris séparément, parce que retrancher deux valeurs déjà arrondies peut décaler le résultat d'un dixième entier.

L'arrondi d'écriture du poids ne mord presque jamais : ce qui arrive d'une valeur composée signe par signe est déjà tronqué à une décimale par le nettoyage, et l'arrondi le laisse alors inchangé. Il n'agit que sur une valeur qui n'a pas traversé ce nettoyage — une valeur engendrée, importée ou calculée.

Un cumul sur plusieurs jours n'est pas la somme des valeurs journalières arrondies : le métabolisme de base est accumulé sans arrondi et le total n'est arrondi qu'une fois, si bien que le total d'une semaine peut différer d'une unité de la somme de ses sept valeurs journalières.

**Cas limites**

- Toute opération à pas décimal est suivie d'un arrondi au pas, pour écarter les résidus de la virgule flottante.
- L'arrondi d'une heure est toujours vers le bas, jamais au plus proche : arrondir vers le haut produirait un instant que rien n'a encore atteint.
- Deux modèles de foulée coexistent : la distance de marche estimée d'un nombre de pas emploie une foulée fixe de 0,00076 km, tandis que l'énergie dépensée par ces mêmes pas emploie une foulée proportionnelle à la taille (`taille_cm × 0,414 ÷ 100000` km). Les deux donnent des distances différentes pour le même nombre de pas.

### L'écriture d'un nombre au stockage

Le séparateur décimal du stockage est le point, dans toutes les langues et dans tous les systèmes d'unités. La V2 porte en outre un séparateur décimal par langue — la virgule en français, le point en anglais — qui ne concerne que la restitution ; en V1, la restitution elle-même emploie le point dans toutes les langues. Une valeur écrite « 95,1 » puis relue dans une autre langue ne voudrait plus rien dire. **[V2]**

Un nombre conservé ne porte ni séparateur de milliers, ni étiquette d'unité, ni signe positif. Ce qui arrive est nettoyé avant d'être interprété : la virgule devient un point, tout ce qui n'est ni chiffre ni point est retiré, un seul point survit, les décimales au-delà du nombre autorisé sont *tronquées* et non arrondies, et le signe négatif est retiré. Le nettoyage ne borne pas : il vaut à chaque instant de la composition d'une valeur, alors que la vérification des bornes ne vaut qu'une fois la valeur complète.

```
nettoyer("95,65", 1 décimale) → "95.6"     (troncature, pas d'arrondi)
verifier("95.6", min 0,1 max 1000)  → retenu
enregistrer(95.6) → arrondi(95,6 × 10) ÷ 10 = 95,6
```

Une valeur peut transiter sous forme de texte avant d'être enregistrée ; elle porte alors le point décimal, la même forme dans toutes les langues, et sa conversion en nombre a lieu à l'enregistrement. La V2 n'a à ce jour aucune écriture persistante — ni stockage local, ni base, ni échange distant : la règle est posée, elle n'est pas encore exercée. **[V2]** **[non implémenté]**

**Cas limites**

- Un point final sans décimale, état transitoire d'une valeur en cours de composition, est retiré ; il ne fait pas partie de la valeur.
- Une valeur retenue est rendue telle qu'elle a été nettoyée, sans reformatage : « 70 » ne devient pas « 70,0 ».
- Une valeur absente se tait : elle n'est jamais remplacée par zéro, par un tiret ni par une moyenne — sauf dans les replis de calcul, énumérés plus bas, qui contredisent cette règle.
- Le format déjà enregistré ne change pas sans migration explicite.

> **Exemple.**
>
> Camille est partie de 96 kg en mai 2026. La valeur conservée est `96`, et c'est le même nombre dans toutes les langues. Une pesée composée à 95,65 kg est conservée à 95,6 : la troncature du nettoyage a retiré le dernier chiffre avant que l'arrondi d'écriture n'ait quoi que ce soit à faire.

### Les échelles sans unité

Certaines grandeurs sont des positions sur une échelle et non des mesures. Elles sont conservées en entier, sans unité, et leur seule définition est l'intervalle et l'ordre de leurs échelons.

| Grandeur | Valeurs | Sens |
| --- | --- | --- |
| Faim avant un repas, faim après | entier de 0 à 5 | croissant |
| Qualité d'un sommeil | entier de 0 à 5, six échelons nommés | croissant, de « très mauvaise » à « excellente » |
| Sévérité d'un effet indésirable | entier de 0 à 5, six échelons nommés : imperceptible, léger, modéré, marqué, fort, élevé | croissant |
| Intensité d'une séance | trois valeurs nommées : douce, modérée, intensive | ordinale, avec les facteurs 0,8, 1,0 et 1,3 |

L'échelle de sévérité compte six échelons et non cinq : le commentaire du type qui l'annonce de 1 à 5 est périmé, et c'est la liste des échelons nommés qui fait l'échelle.

L'intensité d'une séance ne participe plus au calcul de l'énergie dès que la séance porte une distance : la valeur reste enregistrée, comme ressenti, mais l'allure la remplace dans la formule.

Une valeur d'échelle enregistrée à sa valeur par défaut est indiscernable d'une valeur choisie : rien dans la donnée ne distingue une qualité de sommeil laissée à son défaut d'une qualité posée volontairement. Les entrées ainsi enregistrées restent ambiguës pour toujours et ne sont pas réécrites — réécrire détruirait aussi les vrais zéros.

### Les valeurs par défaut et les replis

Une valeur par défaut est une valeur posée d'avance, qui devient une valeur enregistrée si rien ne la remplace. Un repli est une valeur substituée dans un calcul à une donnée absente : il n'est jamais enregistré, mais il détermine un résultat.

| Grandeur | Valeur par défaut |
| --- | --- |
| Poids, poids visé **[V2]** | `95.0` chacun, dans deux valeurs indépendantes qui ne se touchent jamais |
| Taille **[V2]** | 165 cm |
| Année de naissance **[V2]** | 1980 |
| Durée d'une séance | 30 min — 5 pour la montée d'escaliers, où l'unité est l'étage |
| Qualité d'un sommeil | 3 |
| Faim avant un repas | 2 |
| Faim après un repas | 0 |
| Quantité d'un aliment | 100 |
| Objectif d'énergie, de protéines, de fibres | 1 400 kcal, poids × 1,5 g, 25 g |
| Objectif de pas | 8 000, constante et non valeur du compte |

| Donnée absente | Repli employé dans le calcul |
| --- | --- |
| Âge | 42 ans |
| Taille | 170 cm |
| Genre | femme |
| Poids à une date | le poids de départ, sinon le poids visé, sinon 80 kg |
| Heure d'une prise de traitement | 12:00 |

Les replis contredisent frontalement la règle « une valeur absente se tait » : le métabolisme calculé pour un profil incomplet est celui d'une personne de 42 ans et de 170 cm, et rien dans le résultat ne le signale. **[arbitrage non validé]**

### Les grandeurs dérivées

La règle est que rien de dérivable n'est conservé : une grandeur dérivée se recalcule à chaque lecture, de sorte que corriger une valeur source corrige tout l'historique qui en dépend. Une exception subsiste, et elle est large : un repas conserve cinq valeurs dérivées de sa composition — énergie, protéines, glucides, lipides, fibres — réécrites à chaque enregistrement du repas. Corriger la fiche d'un aliment ne corrige donc pas les repas déjà enregistrés qui la référencent, et l'énergie ingérée d'une journée somme les valeurs conservées, non le recalcul. Le modèle nomme ces cinq champs un cache transitoire et les destine à disparaître ; ils n'ont pas disparu. **[arbitrage non validé]**

Les formules ci-dessous prennent leurs entrées dans les unités de conservation.

```
imc            = arrondi(kg ÷ (cm ÷ 100)² × 10) ÷ 10
pointsImc      = arrondi((kgActuel − kgDepart) ÷ (cm ÷ 100)² × 10) ÷ 10
metabolismeBase= 10 × kg + 6,25 × cm − 5 × ans + 5      (homme)
                 10 × kg + 6,25 × cm − 5 × ans − 161    (femme)
                 moyenne des deux                        (neutre)
energiePas     = arrondi(MET_MARCHE × kg × (pas × foulee_km) ÷ VITESSE_KMH)
                 MET_MARCHE = 3,5 ; VITESSE_KMH = 4,2 ; foulee_km = cm × 0,414 ÷ 100000
energieSeance  = arrondi(MET × facteurIntensite × kg × minutes ÷ 60)
energieEtages  = arrondi(0,05 × facteurIntensite × kg × etages)
nutriment      = valeurPour100 × quantite ÷ 100
masseEquiv_g   = arrondi(differentielKcal ÷ 8000 × 1000)
```

L'énergie dépensée par des pas repose sur trois constantes nommées : le coût métabolique de la marche, 3,5 MET ; la vitesse de marche de référence, 4,2 km/h ; la foulée proportionnelle à la taille, `taille_cm × 0,414` centimètres. Une séance sans distance emploie le MET de son activité, tiré d'un catalogue, multiplié par le facteur de l'intensité ressentie ; la montée d'escaliers a sa formule propre, en étages.

L'IMC vaut 0 quand la taille est inconnue ou nulle ; les points d'IMC valent alors une absence de valeur, et non zéro. Le signe des points d'IMC est celui de la variation : perdre du poids donne un nombre négatif.

Quand une séance porte une distance et que son activité admet une allure, l'énergie ne se lit plus sur l'intensité ressentie mais sur l'allure : `allure = mètres ÷ 1000 ÷ heures`, puis un coût énergétique en MET interpolé linéairement entre les deux ancrages qui encadrent cette allure, bloqué à la valeur de l'ancrage extrême au-delà des bornes de la table. Les ancrages viennent du Compendium of Physical Activities, et chaque table contient un ancrage dont le MET vaut exactement celui du catalogue, de sorte qu'à l'allure de référence le résultat est celui d'avant.

La concentration sanguine d'une molécule est une grandeur dérivée sans unité physiologique : elle est exprimée sur l'échelle de la dose, en milligrammes, mise à l'échelle par la biodisponibilité relative de la forme prise et normalisée pour que son maximum vaille la dose ainsi mise à l'échelle. Elle n'est comparable qu'à elle-même. Les prises d'une même molécule s'additionnent, chacune avec l'absorption et la biodisponibilité de sa propre forme.

**Cas limites**

- Une quantité dont l'aliment ne se résout pas est ignorée dans un total plutôt que comptée pour zéro : le total reste juste pour ce qui est connu.
- Un poids total nul dans une composition rend des valeurs nulles, jamais une division par zéro.
- La nature solide ou liquide d'un aliment n'entre pas dans le calcul d'un nutriment : les quantités et les fiches sont déjà dans la même unité de référence.

> **Exemple.**
>
> Camille, née en 1978, 168 cm, 96 kg : son IMC vaut 96 ÷ 1,68² = 34,01…, soit 34,0. À 85,9 kg il vaut 30,4, et la variation est de −3,6 points d'IMC. Son métabolisme de base, à 48 ans, vaut 10 × 96 + 6,25 × 168 − 5 × 48 − 161 = 1 609 kcal.

### Le temps comme grandeur

Une durée est conservée en minutes entières, jamais en texte. Un instant technique est un nombre de millisecondes depuis l'époque Unix. Une date et une heure d'entrée sont des chaînes d'heure murale locale, sans fuseau ni suffixe : elles sont lues sur les composantes locales de l'horloge, jamais sur une représentation universelle, faute de quoi une entrée faite en soirée ou en début de nuit changerait de jour selon le fuseau.

Toute heure conservée est quantifiée sur huit minutes rondes, arrondie vers le bas.

```
minutesRondes = { 0, 10, 15, 20, 30, 40, 45, 50 }
heureConservee(h:m) = h : max{ r ∈ minutesRondes | r ≤ m }
14:37 → 14:30   14:47 → 14:45   14:58 → 14:50   14:07 → 14:00
```

La règle est doublement tenue. L'ensemble des huit minutes est exporté et sert de domaine à toute heure choisie, l'ensemble étant trop irrégulier — des pas de cinq et de dix — pour qu'un mécanisme générique l'engendre. Et la quantification est réappliquée au moment d'écrire, dans le domaine, pour toute heure d'où qu'elle vienne.

Six écritures l'appliquent : les deux heures de rappel du compte, la création et la modification d'une pesée, la modification d'un repas et la pose de son heure, les deux heures d'une entrée de sommeil, toute ligne d'un journal générique qui porte un champ d'heure, et les données engendrées pour essai. Une écriture qui ne passe par aucune de ces portes conserve l'heure telle quelle.

Fuseau et langue sont indépendants : la langue ne détermine que la manière d'écrire une date, jamais le jour auquel une entrée appartient.

**Cas limites**

- Une chaîne qui n'a pas la forme `HH:MM`, ou dont les minutes dépassent 59, ressort inchangée de la quantification : c'est aux vérifications amont de la refuser.
- Une entrée sans heure est réputée avoir eu lieu ; pour les calculs qui ont besoin d'un instant, une heure absente est ramenée à midi.
- L'arrondi vers le bas garantit que minuit n'est jamais franchi ; il ne garantit pas qu'une heure conservée soit passée — une entrée peut être posée à l'avance, et un prédicat distinct dit si elle a déjà eu lieu.
- Une nuit appartient au jour de son réveil : les deux jours, celui de l'endormissement et celui du réveil, sont conservés séparément, ce qui rend détectable une paire d'instants impossible.

## 4. Le temps

Le produit date tout ce qu'il enregistre par un jour local et, le plus souvent, par une heure murale. Ce chapitre pose ces deux grandeurs, la journée qu'elles composent, l'arithmétique qui les décale et les fenêtres qui les découpent.

### Les représentations du temps

Quatre représentations coexistent, et une seule est un instant absolu.

| Représentation | Type | Forme | Ce qu'elle porte |
| --- | --- | --- | --- |
| Jour local | chaîne | `AAAA-MM-JJ` | La date portée par toute entrée de journal, sans exception. |
| Heure murale | chaîne | `HH:MM`, zéros de tête | L'heure d'une entrée, quand elle en porte une. Aucun fuseau, aucune seconde. |
| Horodatage d'archive | chaîne | `AAAA-MM-JJ-HHMMSS` | Le moment local d'une copie de secours des données. |
| Instant absolu | entier | millisecondes depuis l'époque Unix | Les métadonnées de création et de modification des objets de bibliothèque, l'instant d'un envoi, et le contexte d'un envoi. |

L'instant absolu n'est pas rare et n'est pas réservé aux aliments personnalisés. Il est porté par :

| Objet | Métadonnées absolues | Obligation |
| --- | --- | --- |
| Recette | `createdAt`, `updatedAt` | Obligatoires. |
| Aliment personnalisé | `createdAt` (`updatedAt` dans le type cible) | **Facultatif** dans la structure que le code lit. |
| Nature d'effet indésirable | `createdAt`, `updatedAt` | Obligatoires. |
| Nature d'activité | `createdAt`, `updatedAt` | Obligatoires. |
| Menu favori | `createdAt` | **Facultatif**. |
| Envoi (avis, idée, anomalie, réponse au sondage) | instant d'envoi | **Facultatif**. |
| Contexte d'un envoi | instant en millisecondes, instant sérialisé en UTC, décalage au fuseau en minutes, nom du fuseau | Obligatoires — le seul endroit du produit qui sérialise en UTC. |

**Un instant absolu facultatif est un trou de datation, pas un détail.** Un objet écrit avant l'arrivée de cette métadonnée n'en porte pas ; il n'appartient alors à aucun jour de création, et n'est donc compté dans le quota d'aucune journée. Aucune sauvegarde n'a été réécrite pour lui en donner un.

Aucune donnée de santé n'est datée par un instant absolu : une pesée, une prise, un repas, une nuit portent un jour local et, le plus souvent, une heure murale, jamais un horodatage universel. Les instants absolus datent la *bibliothèque* (aliments, recettes, natures, menus) et les *envois*, jamais le journal.

### Le jour local

Un jour local se compose des composantes locales de l'horloge de l'appareil : année, mois, quantième, chacun complété de zéros.

```
jourLocal(t) = t.année_locale + "-" + pad2(t.mois_local) + "-" + pad2(t.quantième_local)
```

La conversion par UTC est proscrite parce qu'elle décale d'un jour et que le sens du décalage dépend du fuseau. Dans un fuseau positif (France en été, UTC+2), une écriture faite à 00 h 30 locale appartient encore à la veille en UTC. Dans un fuseau négatif, c'est la fin de soirée qui passe au lendemain. Une entrée ainsi datée est rangée dans la mauvaise journée, comptée dans la mauvaise fenêtre et perdue pour la bonne.

La lecture symétrique est proscrite pour la même raison : convertir la chaîne `AAAA-MM-JJ` en instant l'interprète comme minuit UTC, ce qui recule d'un jour à l'ouest de Greenwich.

Le format se compare directement : pour deux jours locaux, l'ordre lexicographique des chaînes est l'ordre chronologique. Tous les filtrages, toutes les bornes et tous les tris comparent des chaînes, et ne font intervenir aucun fuseau.

**La règle est posée, elle n'est pas tenue partout.** Quatre arithmétiques de jours coexistent, une seule conforme :

| Arithmétique | Méthode | Conforme |
| --- | --- | --- |
| Celle du modèle (décalage, veille, écart) | Triplet (année, mois, quantième) normalisé par une origine UTC commune. | Oui. |
| Celle du document médical exporté | Écart et décalage bâtis sur l'analyse de la chaîne, relus par composantes UTC ; la date en toutes lettres est explicitement lue en UTC. | Non — mais cohérente avec elle-même. |
| Celle du sommeil (lendemain d'une journée) | La chaîne est lue à `T12:00:00` locale, puis le quantième est incrémenté. | Non, mais le repli à midi la met hors d'atteinte du changement d'heure. |
| Le libellé relatif d'une date | La chaîne est convertie en instant — donc en minuit UTC — puis mise en forme localement. | Non : c'est exactement la conversion proscrite. |

La validation d'une borne personnalisée convertit elle aussi la chaîne en instant, mais seulement pour juger sa lisibilité : la valeur rendue reste la chaîne d'origine.

### L'heure murale et les minutes rondes

Une heure est une chaîne `HH:MM`, zéros de tête compris, donc comparable comme chaîne à toute autre heure. Elle ne porte ni fuseau, ni secondes.

Toute heure retenue par le produit respecte les **minutes rondes** : `0, 10, 15, 20, 30, 40, 45, 50`. L'ensemble est irrégulier — des pas de dix, plus les deux quarts.

```
arrondir("HH:MM") = "HH:" + max{ m ∈ {0,10,15,20,30,40,45,50} | m ≤ MM }
```

L'arrondi est toujours vers le bas, jamais au plus proche : arrondir vers le haut produirait une heure encore à venir, qu'un calcul de « déjà survenu » refuserait de compter, et pourrait franchir minuit — donc changer de journée. La règle s'applique au moment de l'écriture, à la création comme à la modification, et à toutes les heures enregistrées : pesée, prise de traitement, repas, séance d'activité, moment à soi, les *deux* heures d'une entrée de sommeil (coucher et réveil), et les heures de rappel du profil.

La valeur initiale d'une heure d'entrée est l'heure locale courante ainsi arrondie vers le bas ; elle est donc toujours déjà passée.

**L'arrondi n'est pas la garde de domaine de l'heure.** Il exige la forme `HH:MM` et rend la chaîne inchangée si les minutes dépassent 59, mais il ne borne pas les heures : `99:37` en ressort `99:30`. Deux lectures seulement rejettent une heure hors de 0–23, et aucune n'est universelle :

| Lecture | Ce qu'elle refuse | Portée |
| --- | --- | --- |
| Arrondi aux minutes rondes | Forme non `HH:MM`, minutes > 59 — la chaîne ressort telle quelle. | Toute écriture d'heure. |
| Heure en minutes depuis minuit | Forme non `HH:MM`, heures > 23, minutes > 59 — rend « absent ». | Sommeil seulement. |
| Placement dans un créneau de trois heures | Heure non entière ou hors 0–23 — rend « absent ». | Repas et en-cas seulement. |

Il n'existe donc, hors sommeil et repas, aucune précondition d'écriture qui tienne la borne des vingt-quatre heures.

> **Exemple.**
>
> Camille se pèse à 07 h 37 : la pesée est enregistrée à `07:30`. Une prise notée à 14 h 58 est enregistrée à `14:50`, jamais à 15 h 00.

### L'instant d'une entrée

Quand un calcul a besoin d'un instant — cinétique d'une molécule, ordre de deux entrées du même jour, coupure des soixante jours —, il compose le jour local et l'heure murale et lit le résultat dans le fuseau de l'appareil, sans jamais mentionner de fuseau.

```
instant(entrée) = interprétationLocale(entrée.date + "T" + (entrée.heure || "12:00") + ":00")
```

Le repli est *falsy* et non *nullish*, et ce n'est pas indifférent : l'heure absente est en pratique la chaîne vide, qu'un repli nullish laisserait passer et qui produirait une date invalide.

**La durée d'une nuit ne passe pas par cette fonction.** Elle additionne une origine UTC du jour et les minutes murales, et rend donc exactement la différence d'horloge murale : une nuit qui enjambe un changement d'heure vaut vingt-quatre heures si le coucher et le réveil portent la même heure, jamais vingt-trois ni vingt-cinq.

```
instantMinutes(jour, heure) = Date.UTC(année, mois−1, quantième) / 60000 + minutesDepuisMinuit(heure)
durée(nuit) = instantMinutes(date, time) − instantMinutes(bedDate, bedTime)
si l'une des deux lectures est absente, ou si la différence est ≤ 0 → 0
```

L'ordre d'un journal se lit sur la date et l'heure portées par ses lignes, jamais sur leur rang d'insertion : une ligne antidatée est écrite en fin de table et appartient pourtant au passé.

```
cléDeTri(ligne) = ligne.date + "T" + (ligne.heure || "12:00")   // comparaison de chaînes
```

À clé égale, l'ordre de la table subsiste : à heure égale, la dernière enregistrée l'emporte.

### Ce que vaut une heure absente

Il n'y a pas une convention mais **trois**, et le calcul décide laquelle s'applique.

| Valeur prise | Effet | Où |
| --- | --- | --- |
| `12:00` | L'entrée se range au milieu de sa journée, donc ni avant ni après les journées voisines. | Comparateurs d'ordre du modèle, retenue de la pesée du jour, instants de prise, coupure des soixante jours, rotation des zones. |
| Minuit, de fait | La journée en cours est réputée survenue en entier : une entrée du jour sans heure a déjà eu lieu. | Précondition « déjà survenu ». |
| Chaîne vide | L'entrée passe *après* celles de son jour qui portent une heure, du plus récent au plus ancien. | Sélection des entrées récentes, tous journaux confondus. |

Les trois sont dans le code livré et rien n'énonce laquelle fait foi. **[arbitrage non validé]**

### Le fuseau, et la langue

Le fuseau retenu pour dater est toujours celui de l'appareil, lu à travers les composantes locales de l'horloge. Aucune entrée de journal ne porte de fuseau, et aucune n'est convertie.

Deux endroits sortent de cette règle, tous deux hors du journal :

| Où | Ce qui est lu ou écrit |
| --- | --- |
| Contexte d'un envoi | Le nom du fuseau de l'appareil, le décalage à UTC en minutes (signe retourné pour se lire « UTC+2 »), et l'instant de l'envoi sérialisé en UTC, à côté du même instant en composantes locales et du jour local. |
| Document médical exporté | Une date en toutes lettres composée à partir de la chaîne lue comme minuit UTC, puis mise en forme *en UTC* — cohérente avec elle-même, et sans effet sur les données. |

La langue et le fuseau sont posés comme deux axes indépendants, et c'est une **règle**, pas une propriété observable : la V1 n'a qu'une seule langue, en dur, et toutes ses mises en forme de date sont figées en français ; la V2 porte des langues mais n'a encore aucun module de dates. **[V2]**

Une conséquence à admettre : le jour local d'une entrée est figé à l'écriture, mais « aujourd'hui » est recalculé sur l'horloge de l'appareil à chaque lecture. Voyager change donc ce qui est « aujourd'hui », jamais ce qui a déjà été enregistré.

### La journée

Une journée est désignée par son jour local, et rien d'autre. Une entrée appartient à la journée de sa date ; il n'existe aucune notion de journée décalée (pas de « journée qui commence à 4 h »).

| Ce qui se compte par journée | Règle |
| --- | --- |
| Une pesée par journée | Écrire une pesée sur une journée qui en porte déjà une **fusionne** : la ligne du jour est mise à jour, les valeurs que la nouvelle écriture ne mentionne pas — dont les mensurations — sont conservées. Déplacer une pesée existante sur une journée occupée ne fusionne pas : le geste est refusé en amont. |
| Total de pas | **Aucune unicité, aucun plafond.** Une écriture empile une ligne de plus. Deux lectures divergent : l'une retient la *première* ligne trouvée pour la date — donc le rang d'insertion décide —, l'autre *somme* toutes les lignes du jour. Une entrée de pas ne porte pas d'heure. |
| Dénominateur d'une moyenne journalière | Le nombre de journées effectivement renseignées dans la fenêtre, jamais la longueur de la fenêtre. Aucune journée renseignée : la moyenne est absente, pas nulle. |
| Découpage en créneaux de trois heures | Huit créneaux fixes, `index = ⌊heure / 3⌋`. Ce découpage n'existe que pour les **repas et en-cas** ; aucun autre journal n'est découpé ainsi. Une entrée sans heure exploitable est comptée à part, jamais placée au hasard. |

### Les plafonds quotidiens

Dix plafonds portent sur une journée. Deux effets seulement : refuser l'écriture, ou remplacer la dernière ligne du jour. Deux façons de rattacher un objet à une journée : la date qu'il porte, ou son instant de création ramené au jour local.

| Ce qui est plafonné | Plafond | Effet au plafond | Ce qui est compté |
| --- | --- | --- | --- |
| Prises de traitement | 2 | Remplace la dernière ligne du jour. | Lignes présentes de même date. |
| Effets indésirables déclarés | 15 | Remplace la dernière ligne du jour. | Lignes présentes de même date. |
| Séances d'activité | 15 | Remplace la dernière ligne du jour. | Lignes présentes de même date. |
| Moments à soi | 15 | Remplace la dernière ligne du jour. | Lignes présentes de même date. |
| Entrées de sommeil | 15 | **Refuse l'écriture.** | Lignes présentes de même date (réveil). |
| Repas et en-cas | 30 | **Refuse l'écriture.** | Lignes présentes portant la *date visée*, pas la date du jour. |
| Menus favoris créés | 50 | **Refuse l'écriture.** | `createdAt` ramené au jour local. |
| Aliments personnalisés créés | 50 | **Refuse l'écriture.** | `createdAt` ramené au jour local. |
| Recettes créées | 20 | **Refuse l'écriture.** | `createdAt` ramené au jour local ; quota distinct de celui des aliments. |
| Envois | 10 | **Refuse l'écriture.** | Instant d'envoi ramené au jour local. |
| Pesées, relevés de pas | aucun | — | — |

Les quatre plafonds de création — menus favoris, aliments personnalisés, recettes, envois — sont la **seule exception** à « le décompte porte sur les lignes qui portent la même date » : ils ramènent un instant absolu à un jour local. Un objet sans instant de création échappe donc à tout quota. Dans tous les cas le décompte porte sur les objets *réellement présents* : supprimer une création du jour rend sa place. Modifier un objet existant ne consomme aucun quota.

### La nuit et le temps d'éveil

**Une nuit occupe deux journées et n'appartient qu'à une.** Une entrée de sommeil porte quatre valeurs temporelles : `bedDate` et `bedTime` (l'endormissement), `date` et `time` (le réveil). La date de l'entrée est celle du *réveil* ; la date d'endormissement est écrite, jamais déduite — une sieste et une nuit ont la même structure.

```
si durée ≤ 0 → 0   // aucun passage de minuit n'est deviné à partir des seules heures
recouvrement(a, b) ⇔ début(a) < fin(b) et début(b) < fin(a)   // bout-à-bout permis
```

Le **temps d'éveil** d'une journée J se lit sur deux entrées différentes, et sur des heures murales seules :

```
réveil   = max des heures de réveil des nuits datées J        (en minutes depuis minuit)
coucher  = min des heures d'endormissement des nuits datées J+1
brut     = coucher > réveil ? coucher − réveil : coucher + 1440 − réveil
éveil(J) = brut − minutes de sieste de J
absent si aucune nuit datée J, aucune nuit datée J+1, ou éveil ≤ 0
```

Plusieurs nuits pour une même journée : le réveil le plus tardif ouvre la journée, l'endormissement le plus précoce la ferme — le temps d'éveil le plus prudent. Il est absent tant que l'une des deux nuits manque : un jour sans nuit ne vaut pas vingt-quatre heures d'éveil.

### La semaine

Le mot recouvre **quatre** objets distincts, et aucun ne se déduit d'un autre.

| Semaine | Définition | Ancrage aux jours nommés |
| --- | --- | --- |
| Rang de semaine depuis une date de départ | `⌊joursÉcoulés / 7⌋ + 1`, la première portant le n° 1. | Aucun. |
| Fenêtre glissante de sept journées | `[J−6, J]`, la journée en cours comprise. | Aucun. |
| Semaine civile | Sept jours commençant le **lundi**. | Total. |
| Jour de rappel hebdomadaire | Un entier de 0 à 6 où **0 = dimanche**. | Total, et sur une autre origine que la précédente. |

Les deux dernières se contredisent sur l'origine de la semaine ; rien dans le modèle ne les rapproche.

### L'arithmétique des jours

| Capacité | Définition | Résultat |
| --- | --- | --- |
| Décaler un jour de *n* | Le triplet (année, mois, quantième + *n*) est normalisé composante par composante ; *n* peut être négatif. | Un jour local. Une chaîne mal formée ressort inchangée. |
| Veille d'un jour | Le décalage de −1. | Un jour local. |
| Écart entre deux jours | `(fin − début) / 86 400 000`, arrondi, les deux jours étant pris à la même origine composante par composante. | Un entier de jours, signé. Zéro si l'une des deux formes est illisible. |

Ces trois opérations sont insensibles au changement d'heure : elles ne manipulent que des triplets de nombres, jamais une durée réelle. La normalisation absorbe seule les fins de mois et les années bissextiles — aucune règle de divisibilité n'est écrite nulle part.

Le rang d'une semaine depuis une date de départ se calcule autrement, sur deux minuits locaux :

```
si année, mois ou quantième est illisible ou nul → absent
joursÉcoulés = arrondi((minuitLocal(aujourd'hui) − minuitLocal(départ)) / 86 400 000)
si joursÉcoulés < 0 → absent          // une date de départ à venir n'a pas de rang
rangDeSemaine = ⌊joursÉcoulés / 7⌋ + 1  // la première semaine porte le n° 1
```

L'arrondi est là pour absorber l'heure qu'un passage à l'heure d'été ajoute ou retire au milieu de l'intervalle. Le rang de semaine de la cure se compte depuis la date de la pesée de départ ; le même calcul, appliqué à la date de la première prise du traitement en cours, donne le rang de semaine de ce traitement.

> **Exemple.**
>
> Camille a sa pesée de départ au 2026-05-04. Le 2026-09-13, l'écart vaut 132 jours : elle est dans sa 19e semaine de cure.

### Le futur et le déjà survenu

Rien n'interdit de dater une entrée dans le futur : une prise peut être notée à l'avance, un repas planifié. Les calculs qui prétendent décrire l'état réel à l'instant présent écartent donc ce qui n'a pas encore eu lieu.

```
déjàSurvenu(date, heure?) =
  date < aujourd'hui        → vrai
  date > aujourd'hui        → faux
  date = aujourd'hui, sans heure → vrai      // une journée en cours compte en entier
  date = aujourd'hui, avec heure → heure ≤ heure locale courante
```

Cette précondition gouverne :

| Calcul | Ce qui est filtré |
| --- | --- |
| Attribution des distinctions | Séances d'activité, repas (deux calculs distincts), relevés de pas. C'est le plus gros consommateur de la règle. |
| Projection de poids | Repas, séances d'activité, relevés de pas. |
| Progression d'activité et progression alimentaire | Toutes les entrées de chaque moitié, en plus des bornes de date. |
| Série du traitement en cours | Les prises, avant même la coupure au changement de traitement : nombre de prises, dose initiale, dose actuelle, total administré. |
| Intervalle moyen entre deux prises | Les prises ; l'intervalle est `écart / (nombre de dates distinctes − 1)`, absent sous deux dates. |
| Prochaine zone de rotation | Les prises postérieures à maintenant ne commandent rien. |

Elle n'est pas universelle. Le bilan de dépense énergétique et sa projection ne l'appliquent *pas* : ils parcourent sept journées et prennent tout ce qui y est daté. Les fenêtres réglables non plus.

### Les fenêtres réglables

Six fenêtres, retenues par usage et mémorisées.

| Fenêtre | Borne basse | Borne haute | Inclusivité |
| --- | --- | --- | --- |
| `7days` | `aujourd'hui − 6 jours` | aucune | Basse inclusive. |
| `14days` | `aujourd'hui − 13 jours` | aucune | Basse inclusive. |
| `30days` | `aujourd'hui − 29 jours` | aucune | Basse inclusive. |
| `90days` | `aujourd'hui − 89 jours` | aucune | Basse inclusive. |
| `all` | aucune | aucune | Tout est retenu. |
| `custom` | jour local donné, ou vide | jour local donné, ou vide | Les deux bornes inclusives ; une borne vide vaut « sans limite de ce côté ». |

```
coupure(n jours) = aujourd'hui − (n − 1) jours          // la journée en cours compte
retenue(entrée)  = entrée.date ≥ coupure                 // comparaison de chaînes
custom : retenue(entrée) = (début vide ou entrée.date ≥ début) et (fin vide ou entrée.date ≤ fin)
```

« Sept derniers jours » signifie donc aujourd'hui et les six jours précédents, soit sept journées pleines. La coupure est obtenue en décrémentant le quantième de la date locale courante : elle est insensible au changement d'heure. Aucune fenêtre réglable à durée fixe ne pose de borne haute : elle laisse passer une entrée datée du futur.

**Le défaut appartient à l'usage**, et `30days` n'est que le défaut du défaut : chaque usage peut en demander un autre, et un usage le fait — le découpage des apports par créneau horaire ouvre sur `7days`. Chaque usage porte sa propre clé de mémorisation et vit sa vie : changer la fenêtre d'un usage n'entraîne aucun autre. Une valeur relue qui ne correspond à aucune des six retombe sur le défaut de l'usage. Le passage en fenêtre personnalisée et l'écriture de ses deux bornes forment une *écriture unique* — les enchaîner ferait repartir la seconde écriture de l'état d'avant la première.

**Deux règles divergentes pour une borne personnalisée illisible.** Le filtrage compare les chaînes telles quelles, sans vérifier leur forme : une borne mal formée s'applique lexicalement. Le calcul de coupure, lui, convertit la borne basse en instant et rend « pas de coupure » si elle est illisible : la borne est alors ignorée. Le même intervalle ne retient donc pas les mêmes entrées selon le chemin. **[arbitrage non validé]**

> **Exemple.**
>
> Le 2026-09-13, la fenêtre « 7 derniers jours » de Camille retient toute entrée dont la date est ≥ `2026-09-07`.

### Les fenêtres fixes des bilans

Certains calculs ne sont pas réglables : leur fenêtre fait partie de leur définition. Les bornes ci-dessous sont toutes inclusives et J désigne la journée en cours. La colonne « recul » dit comment la borne basse est obtenue, ce qui décide de sa sensibilité au changement d'heure.

| Bilan | Fenêtre | Recul | Précision |
| --- | --- | --- | --- |
| Cumuls et moyennes « sept derniers jours » (minutes d'activité, séances, moments à soi, effets déclarés, pas, sommeil, qualité pondérée) | `[J−6, J]` | Millisecondes | Sept journées, la journée en cours comprise. Pas de borne haute. |
| Moyennes journalières des repas | `[J−7, J−1]` | Millisecondes | Sept journées *révolues* : la journée en cours est écartée, parce qu'elle est presque toujours incomplète. Dénominateur : les journées renseignées ; absent si aucune. |
| Séries de tendance | `[J−13, J]` | Millisecondes | Quatorze journées, une valeur par journée, de la plus ancienne à la plus récente. |
| Sens d'évolution d'une série de tendance | Les deux moitiés de la série | — | Le partage est `⌊longueur / 2⌋` : sur une longueur impaire, la moitié ancienne est plus courte d'un jour. Aucune parité n'est vérifiée. |
| Progression d'activité, échelle semaine | `[J−6, J]` contre `[J−13, J−7]` | Triplet | Bornes haute et basse ; entrées filtrées en plus par « déjà survenu ». |
| Progression d'activité, échelle mois | `[J−29, J]` contre `[J−59, J−30]` | Triplet | Idem. Sans jour commun entre les deux fenêtres. |
| Progression alimentaire | Les mêmes `[J−6, J]` contre `[J−13, J−7]` | Triplet | Absente tant que la période récente porte moins de **3** repas analysables. Ne compare pas des sommes (voir plus bas). |
| Bilan de dépense énergétique et projection | `[J−6, J]` | Quantième | Sept journées énumérées une à une. **Aucun filtre « déjà survenu ».** |
| Entrées récentes, tous journaux confondus | `[J−6, J]` | Millisecondes | **Borne haute explicite** `≤ aujourd'hui` : une entrée de demain est écartée, une entrée d'aujourd'hui à une heure future est retenue. Au plus 40 entrées. |
| Traitements réputés actifs | instants ≥ maintenant − 60 × 86 400 000 ms | Millisecondes absolues | La seule fenêtre exprimée en instants. Si elle ne retient rien, l'historique entier est repris. |

**Trois façons de reculer de n jours coexistent** — décrémenter le quantième d'une date locale, décaler un triplet, retrancher `n × 86 400 000` ms à l'instant courant puis relire la date locale — et elles ne se répartissent pas entre « réglable » et « fixe » : deux fenêtres fixes majeures reculent par quantième ou par triplet. Les deux premières sont insensibles au changement d'heure, la troisième ne l'est pas.

La fenêtre des traitements actifs est le seul endroit où les deux représentations se rencontrent : une coupure *absolue* est comparée à un instant *recomposé* d'un jour local et d'une heure murale, midi à défaut. C'est le point exact où « aucune donnée de santé n'est datée par un instant absolu » devient délicat : la donnée reste locale, la coupure ne l'est pas.

Le repli « si la fenêtre ne retient rien, tout l'historique est repris » n'existe **que** là. Aucune autre fenêtre ne s'élargit quand elle est vide.

La comparaison de deux moitiés d'une série de tendance porte sur des *sommes*. Le sens est « stable » tant que l'écart relatif à la moitié ancienne reste sous **5 %**. Quand l'une des deux moitiés vaut zéro, le rapport n'est pas calculable et la comparaison est directe : deux moitiés à zéro sont stables, passer de zéro à quelque chose est une hausse, l'inverse une baisse.

```
écart = (somme(récente) − somme(ancienne)) / somme(ancienne)
|écart| < 0,05 → stable ; écart > 0 → hausse ; sinon baisse
```

La progression alimentaire n'obéit pas à cette règle : elle compare deux *moyennes* d'écart de composition et exige un gain d'au moins **2** points de la période récente sur la période ancienne ; une période ancienne sans repas analysable ne sert pas de référence du tout.

### L'ancienneté d'usage

Le modèle ne porte aucune date d'installation. Une date de première ouverture est donc déterminée une fois, écrite en `AAAA-MM-JJ`, et jamais réécrite :

```
1. la date déjà écrite, si elle existe et est bien formée ;
2. sinon, la plus ancienne date trouvée dans les neuf journaux, si elle est ≤ aujourd'hui ;
3. sinon, aujourd'hui.
```

Tous les journaux sont parcourus, y compris ceux dont le suivi est éteint : une donnée datée du 15 mars prouve que le produit était là le 15 mars. Une entrée sans date lisible est ignorée. Comme la date est écrite dès la première détermination, ni vider un journal ni antidater une entrée après coup ne déplacent le repère.

```
âgeD'usage = max(0, écartEnJours(premièreOuverture, aujourd'hui))
déverrouillé ⇔ âgeD'usage ≥ 7
```

Le seuil se compte en jours *calendaires*, sur deux jours locaux, et aucune heure n'entre dans le calcul — ni pour resserrer le seuil, ni pour l'assouplir. Une première ouverture posée le 2026-09-01 à 23 h vaut donc sept jours d'ancienneté dès le 2026-09-08 à 00 h 01, après six jours et une heure d'usage réel.

La durée d'une perte de poids s'exprime en jours en deçà de sept jours, et au-delà en semaines arrondies à l'entier le plus proche, avec un plancher d'une semaine. Elle est **absente** dans deux cas : quand la date de départ est postérieure à la date de référence, et quand l'écart est inférieur à un jour.

### Les horodatages d'archive

Une copie de secours des données porte un horodatage local `AAAA-MM-JJ-HHMMSS`, composé lui aussi des composantes locales de l'horloge, secondes comprises. Deux copies dans la même seconde ne s'écrasent jamais : un suffixe `-2` à `-99` est cherché pour la *clé*, et à défaut le nombre de millisecondes depuis l'époque Unix.

L'inventaire des copies est ordonné par comparaison décroissante des horodatages, selon la collation locale et non octet par octet. L'horodatage qu'il enregistre est l'horodatage *de base*, recalculé, et non la clé : deux copies de la même seconde, que le suffixe distingue bien dans le stockage, y portent le même horodatage et leur ordre relatif n'est pas déterminé.

### Les données temporelles du profil

| Donnée | Type | Domaine |
| --- | --- | --- |
| Jour de rappel hebdomadaire | entier | 0 à 6, `0` = dimanche. |
| Heure de rappel | chaîne `HH:MM` | Minutes rondes, comme toute heure enregistrée. |
| Intervalle d'un rappel de prise | entier | Un nombre de jours (5, 7, 10…), avec une date de début en `AAAA-MM-JJ`. |
| Date et heure d'un rendez-vous médical | `AAAA-MM-JJ` + `HH:MM` | Facultatives. |
| Préavis d'un rappel | chaîne d'énumération | `1h`, `2h`, `1d`, `2d`, `3d`, `7d` — une durée relative à l'échéance. |
| Date d'échéance d'un compte à rebours | `AAAA-MM-JJ` | Lue composante par composante, ramenée à minuit local, jamais convertie depuis la chaîne. |

Ces valeurs sont enregistrées et relues, et rien de plus : aucune remise de rappel à l'échéance n'existe. **[non implémenté]**

Le temps restant jusqu'à une échéance est la seule grandeur temporelle du produit à être recalculée à intervalle régulier — chaque seconde —, et non à la demande d'un calcul.

### L'année de naissance **[V2]**

La V1 enregistre un âge en années. La V2 enregistre l'**année de naissance** : un âge se périme d'un anniversaire à l'autre, une année de naissance non. L'âge redevient une valeur dérivée, jamais stockée.

```
bornes(annéeCourante) = { min: annéeCourante − 130, max: annéeCourante − 1 }   // âge 1 à 130
```

L'année courante est fournie par l'appelant : la règle de bornes ne lit pas l'horloge, ce qui la rend testable et indépendante du moment où elle s'exécute. Valeur de départ : 1980.

> **Exemple.**
>
> Camille est née en 1978. En 2026, les bornes acceptent 1896 à 2025 ; son âge, 48 ans, se recalcule à chaque lecture et n'est écrit nulle part.

**Cas limites**

Une chaîne de date mal formée n'est jamais devinée : le décalage la rend inchangée, l'écart entre deux jours rend zéro, la lecture stricte rend « absent ».

Un rang de semaine est absent aussi bien pour une date de départ à venir que pour une date illisible, ou dont l'année, le mois ou le quantième est nul ou non numérique.

Une heure dont les minutes dépassent 59, ou qui n'a pas la forme `HH:MM`, traverse l'arrondi sans être modifiée ; une heure dont les *heures* dépassent 23 est arrondie normalement et reste enregistrable, sauf en sommeil et en repas.

Une heure absente vaut midi pour l'ordre et les instants, minuit pour « déjà survenu », et la chaîne vide dans la sélection des entrées récentes — où elle passe alors *après* celles de son jour qui en portent une. Les trois règles coexistent.

Un réveil antérieur ou égal à l'endormissement rend une durée de zéro : aucun passage de minuit n'est deviné à partir des seules heures. En revanche, le temps d'éveil, lui, enjambe minuit par construction, puisqu'il ajoute 1 440 minutes quand le coucher précède le réveil.

Une nuit qui enjambe un changement d'heure garde sa durée d'horloge murale : la différence des instants réels n'est jamais calculée.

Reculer de *n* jours par quantième ou par triplet est insensible au changement d'heure ; le faire en retranchant `n × 86 400 000` ms ne l'est pas. Les deux résultats diffèrent d'un jour quand un changement d'heure tombe dans l'intervalle et que l'instant courant est à moins d'une heure de minuit.

Une fenêtre réglable à durée fixe n'a pas de borne haute : une entrée datée du futur y est retenue, sauf si le calcul applique en plus « déjà survenu ». Deux fenêtres fixes en posent une, elles : la sélection des entrées récentes et les deux moitiés de la progression d'activité.

Une entrée peut être datée avant la date de première ouverture : rien ne l'interdit. Le repère, une fois écrit, ne bouge plus, ni par antidatation ni par suppression.

« Aujourd'hui » est lu sur l'horloge à chaque calcul, jamais rafraîchi au passage de minuit. Seul le temps restant jusqu'à une échéance se recalcule à intervalle régulier.

Une année bissextile et une fin de mois ne sont l'objet d'aucune règle : la normalisation du triplet les traite seule.

## 5. Les capacités

Ce chapitre énumère ce qu'une personne peut faire des données décrites au chapitre précédent : pour chaque verbe, ses préconditions, ce qu'il écrit, et ce qui le fait refuser. Il est rangé par domaine de relevé ; les règles d'écriture communes à tous les domaines sont posées une fois, en tête.

### Trois variantes, un seul modèle

Le dépôt de la V1 livre **trois variantes** qui partagent le même modèle de données et les mêmes écritures — `initiale`, `cartes`, `mixte` — et divergent sur les chemins d'écriture réellement câblés. Ce chapitre décrit la variante `mixte`, la plus complète, et nomme la variante chaque fois qu'une capacité n'existe que dans l'une d'elles.

| Capacité | initiale | cartes | mixte |
| --- | --- | --- | --- |
| Saisie rapide (cinq domaines) | Oui | Non | Non |
| Consigner un relevé de pas | Oui, par la saisie rapide seule | Non | Non |
| Composer une image de partage | Oui, quatre matières | Oui, quatre matières | Non |
| Document médical, sommeil, temps pour soi, menus favoris | Non | Non | Oui |

### Ce qu'une capacité engage

Une capacité est un verbe qui lit l'état des données, juge une saisie, et écrit ou refuse d'écrire. Elle ne rend jamais un résultat partiel : ou bien tout l'effet a lieu, ou bien rien n'est écrit et un refus est formulé. Les refus sont de quatre natures — hors bornes, journée pleine, unicité violée, cohérence temporelle violée — et aucune n'existe pour juger le corps de qui que ce soit : les bornes n'écartent que l'absurde.

| Règle d'écriture | Portée |
| --- | --- |
| Toute heure retenue est ramenée à la plus grande valeur de {0, 10, 15, 20, 30, 40, 45, 50} minutes inférieure ou égale à la minute donnée. | Les *journaux*, à l'ajout comme à la modification : la règle vit dans la fonction d'écriture qui les sert, et s'applique à la valeur enregistrée. **Les heures de rappel n'y passent pas** : elles sont écrites telles quelles dans le profil, et seul l'ensemble des valeurs atteignables les contraint. |
| Le poids d'une pesée et le poids de départ sont arrondis au dixième de kilogramme. | Pesée, poids de départ. **Le poids visé, lui, est tronqué** à la première décimale : 72,49 y devient 72,4 là où une pesée donnerait 72,5. L'écart est un défaut du code, non une règle. |
| Une date est un jour local `AAAA-MM-JJ`, une heure un `HH:MM` local. Fuseau et langue sont indépendants. | Toutes. |
| Une suppression retire la ligne de la sauvegarde. Il n'y a pas de suppression logique : rien ne subsiste marqué supprimé. | Toutes. |
| Une modification fusionne : une grandeur absente de la charge conserve sa valeur d'avant. | Tous les journaux *sauf les prises alimentaires*, dont la modification **remplace la ligne entière** par la charge reçue. Aucun appelant ne s'en aperçoit aujourd'hui : tous envoient un objet complet. |
| Une valeur absente reste absente. Elle ne devient jamais zéro, ni une moyenne, ni un repli. | Mensurations, notes, distance, valeurs nutritionnelles inconnues. |
| Aucune valeur de santé — poids, dose, composition, note — ne quitte l'appareil. | Toutes. Les envois demandés sont ceux du chapitre « Les retours ». **Deux écritures distantes partent sans geste** : la fiche d'échec de production du document médical et le courrier d'alerte de plafond. Ni l'une ni l'autre ne porte de valeur de santé ; la fiche d'échec porte en revanche le *volume* de chaque journal sur la période, c'est-à-dire une mesure de ce qui a été consigné. |

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
  sinon                           → signaler le plafond atteint,
                                    PUIS remplacer la dernière ligne de duJour
```

Quatre journaux remplacent, six refusent. L'invariant énoncé pour le produit est que rien ne détruit une donnée hors une destruction demandée et confirmée : les quatre remplacements sont l'écart à cet invariant, non la règle. **[arbitrage non validé]** Ce document propose de les aligner sur le refus.

**Cas limites**

Une suppression rend sa place au décompte du jour : le plafond ne mémorise rien, il compte.

Les quotas de création (aliments, recettes, menus) ne comptent que les entrées qui portent un instant de création ; une entrée antérieure à l'apparition de cet instant ne consomme aucun quota.

Modifier une entrée ne consomme jamais de quota de création.

Déplacer une ligne vers une autre date, c'est l'ajouter à cette date : le plafond de la date visée s'applique.

Le signalement du plafond précède le remplacement : ce qui manque n'est pas son antériorité, c'est la possibilité d'y répondre — la ligne est écrasée quoi qu'il arrive.

### Le compte et la session

Un compte identifie la personne auprès du service qui reçoit ses retours et qui, seul, peut supprimer son identité. Il ne détient aucune donnée de santé.

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Ouvrir une session | Une adresse non vide après rognage et un secret non vide — **le secret n'est pas rogné** : un secret fait d'espaces passe le contrôle local et part en tentative distante. Ou bien un fournisseur d'identité tiers. | La session est mémorisée jusqu'à sa fermeture. | Adresse vide après rognage, ou secret strictement vide : refusé sans tentative distante. Identifiants inconnus, adresse mal formée, compte désactivé, trop de tentatives, réseau injoignable : refusés, chacun avec sa cause. |
| Recueillir de quoi ouvrir un compte **[V2]** **[non implémenté]** | **Une seule** : un secret déjà commencé fait huit signes au moins. Ni majuscule, ni chiffre, ni signe particulier n'est imposé. Un secret vide n'empêche pas d'entrer. Prénom et adresse sont recueillis mais *jamais contrôlés*. | **Aucun** : les réponses vivent en mémoire vive et disparaissent au rechargement. Aucun service n'est appelé, aucun compte n'est créé, rien n'est persisté. Le terme du recueil ne fait qu'arrêter la progression sur la dernière étape. | Un secret commencé mais plus court que huit signes bloque la progression. |
| Fermer la session | Une session ouverte. | La session tombe. Aucune donnée n'est touchée. | — |
| Supprimer le compte et toutes les données | Une confirmation explicite, distincte du geste qui ouvre la capacité. | Dans cet ordre : le compte distant est supprimé, puis l'intégralité du stockage local est effacée. Le second geste ne part que si le premier a réussi. | Si la suppression distante échoue, *rien n'est effacé* et l'échec le dit. Une session trop ancienne exige d'en rouvrir une avant de recommencer. |
| Attester avoir pris connaissance de l'avertissement médical | Une attestation explicite. | Un marqueur booléen persistant est posé, une fois pour toutes. | Tant qu'il n'est pas posé, aucune autre capacité n'est atteignable. |

**Cas limites**

Quand aucun service d'authentification n'est configuré, le verrou ne mord pas : tout est atteignable sans session, et rien ne part.

L'effacement local emporte la session avec le reste : il n'y a pas de déconnexion à faire ensuite.

Deux capacités n'existent nulle part en V1 : récupérer un secret oublié, et ouvrir un compte.

### Qui l'on est

Le profil porte ce qui ne se relève pas : l'identité, le corps de référence et l'objectif. Chacune de ces grandeurs se modifie à tout moment, indépendamment des autres.

| Grandeur | Type et bornes | Refus |
| --- | --- | --- |
| Prénom ou pseudonyme | Texte, non vide après rognage. | Vide ou uniquement des espaces. |
| Âge | Entier, 1 à 130 ans. | Hors bornes, illisible, vide. |
| Année de naissance **[V2]** | Entier. Les bornes sont celles de l'âge rapportées à l'année en cours : de `année − 130` à `année − 1`. Défaut 1980. L'année en cours est passée par l'appelant ; le domaine ne lit pas l'horloge. | Hors bornes. |
| Taille | Entier, 50 à 300 cm. Toujours stockée en centimètres ; convertie à la lecture et à la saisie selon le système d'unités (fourchette en pouces : 20 à 118). | Hors bornes. |
| Genre | Femme, homme, ou neutre. | — |
| Poids visé | Nombre strictement positif, tronqué à la première décimale. | Vide, illisible, nul ou négatif, au-delà de 1 000 kg. |

**Cas limites**

Le système d'unités décide de l'unité de saisie et de lecture. En V1, le stockage est métrique sans exception (kg, cm, g, ml) et ne porte aucune étiquette d'unité.

**La V2 déroge pour le poids**, et c'est le seul endroit où le système impérial existe : la taille se convertit aux deux bouts, mais *le poids est gardé dans l'unité choisie*, en livres si le système est impérial, sans conversion ni étiquette. Deux fonctions seulement connaissent le pouce ; aucune ne connaît la livre. **[V2]**

Le séparateur décimal de saisie suit la langue ; la forme stockée porte toujours un point.

> **Exemple.**
>
> Camille est née en 1978 et mesure 168 cm. En système impérial, la même taille se lit 66 pouces et se ressaisit dans cette unité ; la valeur stockée reste 168. Son poids, lui, serait gardé tel quel : 211,6 si elle le choisit en livres.

### L'avatar et la photographie

L'avatar est une composition de sept grandeurs, non un identifiant choisi parmi des dessins tout faits : forme du visage, teinte de peau, teinte des yeux, coiffure, teinte des cheveux, présence de lunettes, expression. **Le genre est la huitième dimension de l'avatar** : il se compose avec les autres, et le choisir aligne le genre du profil.

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Composer ou modifier son avatar | Chaque grandeur appartient à son ensemble clos : 4 formes de visage, 6 teintes de peau, 5 teintes d'yeux, 6 coiffures, 6 teintes de cheveux, 4 expressions, un booléen de lunettes, 3 genres. | Les huit grandeurs sont écrites dans le profil. Changer de genre retient la coiffure de départ propre à ce genre. En V1, le genre du profil est dérivé de celui de l'avatar : c'est le seul endroit où il se choisit. | Aucun : rien d'hors ensemble n'est atteignable. |
| Attacher une photographie (V1) | Un fichier d'un des cinq types acceptés — JPEG, PNG, WebP, GIF, AVIF — et d'au plus 12 Mio. | Le profil porte une image encodée en `data:`. Toute retouche de l'avatar composé efface la photographie. | **Cinq refus nommés**, dans cet ordre : type non accepté (le HEIC des téléphones en est exclu et le refus le dit) ; fichier au-delà de 12 Mio, refusé sans être lu ; décodage impossible ; réencodage impossible ; les trois qualités épuisées sans passer sous 300 Kio. |
| Tirer un avatar au hasard (V1) | — | Les huit grandeurs sont retirées au sort. | — |

La V2 conserve la composition et **supprime les deux autres capacités** : ni photographie, ni tirage au hasard. **[V2]**

**Cas limites**

Traitement d'image, hors du modèle : le carré retenu est centré, réduit à 256 unités de côté au plus — jamais agrandi —, puis réencodé aux qualités 0,82 ; 0,70 ; 0,55 jusqu'à tenir sous 300 Kio.

Une photographie enregistrée par un code plus ancien sous forme de renvoi éphémère n'est plus lisible : elle est écartée, et l'avatar composé reprend sa place.

### Ce que l'on suit

Sept domaines de relevé s'allument et s'éteignent indépendamment : l'alimentation, les pas, l'activité physique, le temps pour soi, le sommeil, le traitement, les ressentis. Deux drapeaux par domaine : *actif* et *masqué*.

| Capacité | Précondition | Effet |
| --- | --- | --- |
| Activer ou désactiver un domaine | Aucune. | Le drapeau d'activité est inversé. Rallumer un domaine remet son drapeau de masquage à faux. |
| Poser le drapeau de masquage d'un domaine | Le domaine est éteint. | Un second booléen est écrit. Il ne gouverne que la restitution, et ne mord que sur un domaine éteint : sur un domaine actif il est ignoré, quelle que soit sa valeur. |

**La valeur d'un drapeau absent n'est pas la même pour les sept domaines.** C'est la conséquence de leur histoire : les sauvegardes anciennes n'ont pas de drapeau, et lire « éteint » pour le traitement les amputerait du motif même du carnet.

| Domaine | Drapeau | Valeur quand le drapeau est absent |
| --- | --- | --- |
| Traitement | Facultatif | **Actif** |
| Ressentis | Facultatif | **Actif** |
| Temps pour soi | Facultatif | Éteint |
| Sommeil | Facultatif | Éteint |
| Alimentation | Obligatoire | Sans objet : semé à faux à la création du profil |
| Pas | Obligatoire | Sans objet : semé à faux |
| Activité physique | Obligatoire | Sans objet : semé à faux |

**Éteindre un domaine ne détruit rien** : ses relevés restent, cessent d'être atteignables à la saisie et sortent des décomptes transversaux. Le rallumer les y ramène tels quels.

**Cas limites**

Un identifiant qui n'est associé à aucun des sept drapeaux est réputé actif : la règle du défaut ne vaut que pour les domaines de relevé.

Le document médical ne propose une rubrique que si son domaine est actif *et* porte au moins une donnée sur la période.

Un domaine à régularité non nulle est allumé par la génération de données d'administration ; un domaine à régularité nulle est laissé tel qu'il était.

### Le traitement déclaré

Le profil porte l'identifiant d'un traitement, jamais son nom. Le catalogue est fermé et chaque forme s'y termine par une entrée « Autre » : la liste des spécialités bouge plus vite qu'une application, il faut pouvoir répondre quand la sienne n'y est pas. Un identifiant absent ou inconnu vaut « aucun traitement ».

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Déclarer ou changer son traitement | L'identifiant appartient au catalogue. | Le profil porte le nouvel identifiant. **Les prises déjà consignées gardent le leur** : changer de traitement n'en réécrit aucune. | Un identifiant hors catalogue n'est pas atteignable : le traitement se choisit, il ne se saisit pas. |
| Attester d'un essai clinique (V1) | La spécialité choisie porte le drapeau correspondant — une seule le porte. | Sans l'attestation, le choix n'est pas écrit. Elle n'est pas redemandée quand la spécialité choisie est déjà celle du profil. | Attestation absente. |

Le catalogue de la V1 compte **treize entrées : onze spécialités nommées et deux entrées génériques « Autre »**, plus une quatorzième valeur, « aucun traitement », tenue à part parce que ce n'est pas un traitement mais un état. Chaque entrée porte une forme (injectable ou orale), des paliers de dose et des paramètres de cinétique ; **la molécule est absente des deux entrées génériques et de « aucun traitement »** — le type la déclare nullable pour cela.

Le catalogue de la V2 en compte treize aussi, mais **ne porte que le nom et la forme** — aucune posologie, aucune cinétique, aucune molécule : l'application demande ce qu'on prend, elle ne dit pas quoi prendre. **[V2]** Le drapeau d'essai clinique n'y existe pas non plus.

**Cas limites**

Conversion : à la lecture d'une sauvegarde, tout libellé historique est ramené à un identifiant. Un libellé inconnu retombe sur l'entrée « Autre » de la famille qu'il évoque, et sur « aucun traitement » quand il en dit l'absence. La conversion s'applique au profil comme à chaque prise.

La forme se lit sur l'entrée du catalogue, jamais sur le nom : c'est elle qui décide du mot employé pour une prise et de la zone par défaut.

Une prise sans identifiant de traitement est réputée relever du traitement du profil.

Un identifiant ne suit pas un renommage de marque : l'entrée orale de l'orforglipron porte le nom « Foundayo » et garde l'identifiant `orforglipron`, qui atteint les prises déjà consignées.

### Les prises de traitement

Une prise consigne le fait d'avoir pris son traitement à un instant. Elle vaut pour les deux formes : injection ou comprimé.

| Grandeur | Type | Bornes et défaut |
| --- | --- | --- |
| Date | Jour local | Obligatoire. Proposée : aujourd'hui. |
| Heure | `HH:MM` local | Obligatoire. Proposée : maintenant, ramené à la minute ronde inférieure. |
| Dose | Nombre, en milligrammes | 0,001 ≤ dose ≤ 1 000 000, trois décimales au plus. Proposée : le premier palier de la spécialité. |
| Zone | Une valeur close : abdomen gauche, abdomen droit, cuisse gauche, cuisse droite, bras gauche, bras droit, voie orale | Obligatoire. « Voie orale » pour une forme orale ; sinon une zone proposée par tirage. |
| Notes | Texte facultatif | Vide après rognage vaut absente. |
| Traitement | Identifiant du catalogue | Voir « Modifier une prise » : les deux chemins n'écrivent pas la même chose. |

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Consigner une prise | Une date non vide, et une dose qui est un nombre fini strictement positif. | Une ligne à la date visée, sous le plafond de deux par jour, heure ramenée à la minute ronde. L'identifiant de traitement est écrit *depuis le profil*. | Dose vide, illisible, nulle ou négative : refus formulé, levé dès que la dose est reprise. Rien n'est écrit. |
| Modifier une prise, chemin du recueil complet | Une dose finie strictement positive. **Rien d'autre** : ni comparaison à l'état d'avant, ni contrôle de la date. | Dose, zone, date, heure, notes sont écrites, et **l'identifiant de traitement est réécrit depuis le profil** : modifier une prise ancienne la rattache au traitement courant. | Dose non finie ou ≤ 0. |
| Modifier une prise, chemin de l'édition en place | Une dose lisible et ≥ 0, une date non vide, *et* au moins une des cinq grandeurs changée. | Fusion dans la ligne visée. **L'identifiant de traitement d'origine est conservé.** | Dose illisible ou négative, date vide, ou aucune grandeur changée : rien n'est écrit, en silence. |
| Se voir proposer une zone | Une forme injectable. | Une zone est **tirée au sort** parmi celles qui ne sont ni la zone de la prise passée la plus proche, ni celle de la prise future la plus proche ; s'il n'en reste aucune, toutes redeviennent candidates. Deux appels successifs ne rendent pas la même zone. | Retenir malgré tout la zone de la dernière prise n'est pas refusé : c'est signalé, et le signalement tombe dès que la zone change. |
| Supprimer une prise | — | Retrait franc. | — |
| Vider le journal des prises | Confirmation explicite. | Le journal devient vide. Rien n'est préservé. | — |

**Cas limites**

Une prise peut être datée dans le futur : rien ne l'interdit. Les décomptes de la cure en cours l'écartent ; la lecture du journal ne l'écarte pas.

Une prise dont l'heure manque est ordonnée comme s'il était midi.

Le plafond de deux par jour vaut par date visée ; consigner une troisième prise sur une journée déjà pleine remplace la dernière ligne de cette journée.

La V1 tient un journal des prises par personne, non par traitement : les prises d'un traitement abandonné restent, avec leur identifiant d'origine — sauf si elles passent par le chemin du recueil complet, qui les rattache au traitement courant.

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
| Fixer le poids visé | Nombre strictement positif, au plus 1 000. | Le profil le porte, tronqué à la première décimale. | Vide, illisible, nul, négatif, au-delà de 1 000. |

**Le poids visé n'est jamais lié au poids courant.** Ce sont deux grandeurs indépendantes : elles peuvent partir de la même valeur, elles ne se recopient jamais l'une dans l'autre, dans aucun sens. **[V2]**

**Les mensurations.** Neuf grandeurs facultatives en centimètres, attachées à une pesée : poitrine, taille, hanches, bras, sous-poitrine, fesses, cuisses, genoux, mollets. Chacune vaut entre 1 et 300 cm, une décimale, et le vide est permis — *vide n'est pas zéro*. Une mensuration ne s'efface qu'en la vidant explicitement sur la pesée qui la porte.

En V2, l'ensemble des poids atteignables est fini et borné : les entiers de 1 à 999 en métrique, de 1 à 2 000 en impérial, chacun assorti d'un dixième de 0 à 9. Deux plafonds ronds, choisis chacun dans son unité, et non la conversion l'un de l'autre. **Il n'y a donc plus de valeur incorrecte à refuser : il n'y en a plus d'atteignable.** Le plafond de 2 000 lb est bien un plafond de la valeur *stockée*, puisque le poids est gardé dans l'unité choisie. **[V2]**

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
| Famille | Six valeurs historiques déclarées : petit-déjeuner, déjeuner, dîner, en-cas *ancien*, repas, en-cas. | Obligatoire. Deux familles seulement sont écrites par les capacités d'aujourd'hui : repas et en-cas. |
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

**Modifier une prise.** Composition, famille, date, heure, faim. Les cinq valeurs sont recalculées, l'heure re-arrondie, et *la ligne entière est remplacée* par la charge reçue. Déplacer une prise vers une date déjà pleine est refusé et la prise reste à sa date d'origine.

**La reprise d'une prise ancienne écrase sa famille.** Quand une prise est rouverte pour modification, tout type autre que l'en-cas *actuel* devient « repas » — **y compris l'en-cas historique**, pourtant déclaré et libellé « En-cas ». Rouvrir un en-cas ancien et valider en fait un repas. C'est un défaut du code, non une règle : la retombée des six valeurs historiques sur deux familles n'est juste qu'à la lecture.

**Retirer une ligne de composition.** Retirer la dernière supprime la prise : une prise porte toujours au moins un aliment.

**Supprimer une prise**, ou **vider le journal** après confirmation explicite.

**Cas limites**

Un type inconnu est *lu* comme un en-cas ; il est *réécrit* comme un repas.

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
| Retrouver un aliment par son code-barres | Un code non vide, saisi à la main. | Trois recherches, dans l'ordre : la bibliothèque personnelle — l'entrée trouvée devient celle que la modification vise ; puis le catalogue ; puis un service distant. Ce qui revient sert de valeurs de départ à une création. | Code vide. Service injoignable, service en défaut, réponse illisible : chacun a sa cause, et la saisie à la main reste ouverte. |
| Créer un menu favori | Un titre non vide et unique après normalisation ; une composition. | Une entrée portant titre, famille et composition — *ni date, ni heure, ni faim*. Les lignes sont recopiées avec de nouvelles identités. | Titre vide ou déjà pris ; cinquantième création du jour dépassée. |
| Reprendre un menu favori | — | Sa composition et sa famille sont *copiées* dans une prise en cours. Aucun lien n'est créé : modifier le menu plus tard ne touche à aucune prise. | — |

```
valeurs_pour_100(recette) :
  masse = Σ quantités des ingrédients
  si masse ≤ 0 → les cinq valeurs valent 0
  sinon        → valeur = apport_total × 100 / masse, arrondi à l'entier
```

Une prise dont la composition est *identique* à celle d'un menu — même longueur, mêmes références aux mêmes rangs, mêmes quantités, l'ordre compris — est reconnue comme relevant de ce menu. La famille n'entre pas dans la comparaison.

La lecture d'un code-barres par l'appareil photo n'existe pas. **[non implémenté]** Un vrai lecteur, avec la saisie à la main en repli et chaque échec journalisé anonymement, est décidé pour la conversion en application native.

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

**Consigner une séance.** Préconditions : une durée entière strictement positive dans les bornes ; une distance, si elle est renseignée, dans les bornes de son unité. Une durée hors bornes et une distance hors bornes sont refusées, chacune avec sa cause, et les refus tombent dès que la grandeur fautive est reprise. Changer d'activité lève les deux refus, remet la durée à sa valeur proposée et *rend la distance absente*. Plafond : quinze par date, avec remplacement.

**Invariant.** Une distance renseignée écarte l'intensité du calcul de la dépense — l'effort se lit alors sur l'allure. Rendre la distance absente ramène l'intensité à « douce ». L'édition en place ne sait que *changer* une distance déjà écrite : elle n'en ajoute pas à une séance qui n'en porte pas.

**Modifier**, **supprimer** une séance, **vider le journal** après confirmation.

**Cas limites**

Si l'activité change dans le même geste qu'une modification, la distance est conservée quand la nouvelle activité l'accepte, supprimée sinon.

Une durée non entière ou nulle n'écrit rien, en silence, sans refus formulé.

Une activité hors du catalogue reçoit un coût métabolique de repli ; le catalogue n'est pas extensible par la personne.

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
| Qualité | Entier 0 à 5 | Proposée à 3, et toujours écrite. |

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

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Consigner un moment | Une activité de la liste active ; une durée entière strictement positive, au plus 480 ; une date non vide. | Une ligne à la date visée, heure ramenée à la minute ronde, sous un plafond de quinze par date — au-delà, la dernière ligne de la date est remplacée. | Durée non entière, nulle ou négative : rien n'est écrit, *en silence*, sans refus formulé. Hors bornes hautes : refus formulé. |
| Modifier un moment | Mêmes règles ; au moins une grandeur changée. | Fusion dans la ligne visée. | Mêmes refus ; aucune grandeur changée : rien n'est écrit. |
| Supprimer un moment | — | Retrait franc. | — |
| Vider le journal des moments | Confirmation explicite. | Le journal devient vide. | — |

### Les pas

Un relevé de pas porte une date et un nombre de pas. Il n'a pas d'heure. **Plusieurs relevés d'une même date s'additionnent** : il n'y a pas d'unicité par jour, et aucun plafond quotidien.

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Consigner un relevé de pas — variante `initiale` seulement, par la saisie rapide | Un nombre de pas entier strictement positif ; une date. | Une ligne de plus dans le journal. Aucune fusion avec un relevé du même jour, aucun plafond. | Valeur illisible, nulle ou négative : rien n'est écrit, en silence. |
| Modifier un relevé | — | Fusion dans la ligne visée. | — |
| Supprimer un relevé | — | Retrait franc. | — |
| Vider le journal des pas | Confirmation explicite. | Le journal devient vide. | — |
| Fixer la date depuis laquelle le cumul se compte | Un jour local. | La date est persistée et gouverne le cumul et les moyennes par jour. À défaut, le cumul part du plus ancien relevé. | — |

**Les variantes `cartes` et `mixte` n'offrent aucune capacité de consigner un relevé de pas.** **[non implémenté]** Le verbe existe dans le modèle, et il est même passé aux consommateurs de ces deux variantes, mais aucun ne l'appelle : leur journal des pas ne se remplit que par la génération de données d'administration. Ce qui est décidé pour la V2 est le podomètre réel du téléphone, à la conversion en application native.

L'objectif quotidien de pas vaut 8 000 et **ne se règle pas** : c'est la seule des quatre grandeurs à objectif qui ne soit pas réglable.

### La saisie rapide

La variante `initiale` porte un second chemin d'écriture, ouvert par un drapeau du profil, qui vise cinq domaines et **n'applique pas les mêmes préconditions que le recueil complet**. Les trois premiers raccourcis existent toujours ; les deux autres n'existent que si leur domaine est actif.

| Domaine visé | Précondition | Écart avec le recueil complet |
| --- | --- | --- |
| Prise de traitement | **Aucune.** Rien n'est jugé. | La dose n'est pas contrôlée. La zone part à « abdomen gauche », sans tirage. L'identifiant de traitement est écrit depuis le profil. |
| Pesée | Poids lisible et strictement positif. | Ni borne haute, ni mensurations. |
| Ressenti | Aucune. Un type « Autre » laissé vide après rognage devient le texte « Effet indésirable ». | L'intensité part à 2, non à 0. Le type peut être un texte libre, hors de la liste de référence. |
| Relevé de pas | Entier strictement positif. | Seul chemin d'écriture des pas de tout le produit. |
| Séance d'activité physique | Durée lisible et strictement positive. | Ni distance, ni borne haute. |

Les plafonds quotidiens et les minutes rondes s'appliquent malgré tout : ils vivent dans l'écriture du journal, non dans le recueil.

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

Deux rappels se règlent. **[non implémenté]** Leur réglage est enregistré dans le profil ; **rien ne les déclenche** : aucun code ne lit ces valeurs pour produire quoi que ce soit. De vraies notifications du téléphone sont décidées pour la conversion en application native.

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Régler le rappel de prise, régime hebdomadaire | Un jour de semaine dans 0..6 (0 dimanche) et une heure prise dans l'ensemble des minutes rondes. | Trois grandeurs écrites dans le profil : le régime, le jour, l'heure. **L'heure part telle quelle**, sans passer par la règle des minutes rondes : seul l'ensemble des valeurs atteignables la contraint. | **Aucun.** Il n'y a rien d'invalide à atteindre. |
| Régler le rappel de prise, régime périodique | Un entier N dans 1..30, une date de départ, une heure. | Quatre grandeurs écrites dans le profil. | **Aucun** : N est choisi dans un ensemble de trente valeurs, il ne se saisit pas. |
| Régler le rappel de rendez-vous | Aucune. | Cinq grandeurs écrites dans le profil : actif ou non, nom du praticien (texte libre), date, heure, préavis parmi une heure, deux heures, un jour, deux jours, trois jours, sept jours. | **Aucun.** Un nom de praticien vide et une date de rendez-vous vide sont acceptés et enregistrés. |
| Activer ou désactiver un rappel | Aucune. | Un booléen du profil est inversé. Les autres grandeurs du rappel sont conservées. | — |

| Rappel | Valeurs en l'absence de réglage |
| --- | --- |
| Prise de traitement | Inactif ; hebdomadaire ; dimanche ; 20:00 ; N = 7 ; départ aujourd'hui. |
| Rendez-vous | Inactif ; nom vide ; date vide ; 10:00 ; un jour. |

### Les fenêtres d'observation

Capacité transversale : borner dans le temps ce que l'on regarde. Elle n'écrit aucune donnée de santé — seulement une préférence.

| Fenêtre | Définition |
| --- | --- |
| 7, 14, 30, 90 derniers jours | Inclusive du jour courant : la coupure vaut `aujourd'hui − (n − 1)`. « 7 derniers jours » contient donc aujourd'hui et les six jours précédents. |
| Depuis le début | Aucune coupure. |
| Bornes libres | Deux jours locaux, chacun facultatif. Une borne absente est illimitée de son côté. |

La comparaison est lexicographique sur `AAAA-MM-JJ` — c'est exact pour ce format et n'exige aucun calcul de fuseau. Chaque restitution qui fait usage d'une fenêtre mémorise son choix indépendamment des autres ; le défaut est de trente jours. Fixer une borne fait basculer la fenêtre en bornes libres.

**Cas limites**

Un relevé daté dans le futur n'est jamais refusé. Certains décomptes l'écartent explicitement — la série du traitement en cours, les distinctions —, d'autres non. L'écart est réel et n'a pas de règle unique.

Une fenêtre bornée sur un journal vide n'est pas une erreur : elle rend un ensemble vide, et une valeur absente se tait.

### Le document médical

Deux capacités produisent, à partir des relevés d'une période, un document destiné à un soignant. Le document est **remis à la personne** ; il n'est transmis à personne.

| Capacité | Précondition | Rubriques retenues |
| --- | --- | --- |
| Produire le document complet | Une période. | **Tout ce qui est disponible** sur la période, sans choix. Deux rubriques en sont exclues quel que soit l'état des données : le temps pour soi, et les équivalences insolites. |
| Produire le document sur mesure | Une période et un choix de rubriques. | L'intersection du choix et du disponible : une rubrique cochée dont la période ne contient rien ne produit rien. Le temps pour soi et les équivalences insolites y sont cochables ; les équivalences le sont mais décochées d'avance. Les prises de traitement et les pesées y figurent toujours. |

**Le disponible** d'un domaine est vrai quand son domaine est actif *et* qu'au moins un relevé tombe dans la période. La borne de début vaut, à défaut, la plus ancienne donnée tous journaux confondus ; la borne de fin, aujourd'hui.

**Effets.** Un document nommé d'après les deux bornes, remis à la personne. Un échec de production consigne à distance une fiche : étape atteinte, période et nombre de jours qu'elle couvre, rubriques demandées, rubriques effectivement écrites, **volume de chaque journal et volume total**, durée écoulée, message d'erreur et pile tronqués. **Cette fiche ne porte aucune valeur de santé**, et rien n'est consigné si personne n'est connecté. Elle part *sans geste de la personne*, et un courrier d'alerte l'accompagne.

Le nombre de journées documentées d'une période est le nombre de dates distinctes portées par les journaux inclus — un relevé de pas nul ne fait pas une journée documentée. Une période du 1er au 1er couvre une journée, pas zéro.

### Le partage

Capacité des variantes `initiale` et `cartes` : composer une représentation d'un chiffre de progression et la remettre au mécanisme de partage de l'appareil. La variante `mixte` ne la porte pas.

| Capacité | Précondition | Effet | Refus |
| --- | --- | --- | --- |
| Remettre au mécanisme de partage de l'appareil | L'appareil déclare savoir partager un fichier. Un geste explicite, toujours. | Une composition est produite depuis un chiffre, son libellé et une légende, puis remise à l'appareil avec l'adresse du produit. | Appareil sans mécanisme de partage : la capacité n'est pas offerte. |
| Copier la légende | — | La légende, qui ne porte aucun chiffre, est remise à la personne sous forme de texte. Rien n'est écrit dans les données. | — |
| Remettre la composition à la personne comme fichier | La composition est prête. | Un fichier nommé d'après le chiffre est remis. | Composition non prête : rien. |
| Adresser la légende à un service tiers | — | Une adresse externe est ouverte, portant la légende et l'adresse du produit. **Aucune donnée de santé ne l'accompagne** : ni le chiffre, ni la composition. | — |

**Quatre matières** alimentent cette capacité : la perte de poids, la journée alimentaire, la séance d'activité physique, et le chiffre de progression du récapitulatif. Chacune n'emporte qu'un chiffre, son libellé, une équivalence facultative et le nom du traitement.

La variante `mixte` porte en outre **quinze compositions de partage à l'état d'étude** — trois équivalences, les distinctions, un repas, une journée alimentaire, une recette, une pesée, une prise de traitement, un moment pour soi, une séance, deux séries de mesures, un sommeil, un ressenti. **[non implémenté]** Aucune ne produit de fichier ni ne part nulle part : ce sont des études d'apparence, sans aucune capacité de partage attachée.

**Ce que ces études imprimeraient**, et qui contredit la promesse souvent faite : la composition de pesée imprime *les neuf mensurations*, et cinq d'entre elles impriment *la note libre* du relevé — prise de traitement, temps pour soi, activité physique, sommeil, ressenti. Seules les notes de faim ne sont jamais imprimées. **[arbitrage non validé]**

La matière est le relevé le plus récent du domaine choisi, par date puis par heure. En l'absence de relevé, un exemple figé sert de matière ; **rien dans la donnée ne dit qu'il s'agit d'un exemple**. La qualité d'exemple est recalculée ailleurs, à partir de la vacuité du journal, et n'est jamais portée par la matière elle-même — c'est délibéré : la composition doit rester exactement ce que la personne obtiendrait.

Il n'existe aucune capacité de comparer son état à celui d'une autre personne, ni d'atteindre les données d'autrui.

### Les distinctions

Quatre distinctions constatent une régularité sur une fenêtre courte. Cinq paliers ordonnés : aucun < éveil < bronze < argent < or. Une distinction n'est évaluée que si le domaine dont elle dépend est actif.

| Distinction | Domaine | Journée réussie | Paliers |
| --- | --- | --- | --- |
| Activité physique | Activité physique | Minutes pondérées par l'intensité : *équivalent intensif* ×1 / ×0,67 / ×0,33 ; *équivalent modéré* ×1,5 / ×1 / ×0,5. | Or : ≥ 180 min intensives sur 7 jours. Argent : ≥ 180 sur 10 jours. Bronze : ≥ 120 modérées sur 10 jours. Éveil : au moins une séance aujourd'hui ou hier. |
| Fibres | Alimentation | Total du jour ≥ 25 g. | Or 7 journées sur 7, argent 5, bronze 4, éveil aujourd'hui ou hier. |
| Protéines | Alimentation | Total du jour ≥ `arrondi(poids courant × 1,5)` g. | Or 7 sur 7, argent 5, bronze 4, éveil aujourd'hui ou hier. |
| Pas | Pas | Total du jour ≥ 8 000. | Or 5 journées sur 7, argent 4, bronze 3, éveil aujourd'hui ou hier. |

**Seules les entrées déjà survenues comptent** : une date passée, ou aujourd'hui à une heure déjà atteinte.

**Mémoriser le palier atteint** est une écriture persistée, et non un simple constat. Précondition : une évaluation des quatre distinctions. Effet : une table *distinction → palier* est écrite dans le stockage local, en partant de la table déjà connue plutôt qu'en la reconstruisant — ce qui préserve le palier d'un domaine éteint. Une montée n'est reconnue que sur un palier *déjà observé une fois* : un palier jamais observé est une découverte, il est écrit en silence. Une descente réécrit la table sans rien reconnaître.

Capacité annexe : un booléen du profil, écrit sans autre précondition, qui gouverne la restitution d'une cinquième distinction. Aucune règle d'obtention de celle-ci n'existe dans le code.

### Les retours

Deux capacités adressent quelque chose au dehors *sur un geste explicite*, et deux autres partent sans geste. **Aucune ne porte de valeur de santé.**

| Capacité | Geste | Précondition | Effet | Refus |
| --- | --- | --- | --- | --- |
| Adresser un avis, une idée ou un signalement | Explicite | Un texte non vide après rognage. Une nature : avis, idée, signalement. | Consigné d'abord localement, puis transmis *sans attente et sans compte rendu d'échec* : l'ordre garantit que rien ne se perd si la transmission échoue. Le consentement à être recontactée accompagne l'envoi et retombe à faux après. | Texte vide. Onzième envoi du jour local : refus, et le refus dit que les envois reprennent le lendemain. |
| Répondre au questionnaire, ou modifier sa réponse | Explicite | — | Sept notes entières de 0 à 5 et une suggestion libre. **Une seule réponse existe** : la modifier la réécrit. Le décompte des reprises est incrémenté au dehors, dans une transaction. | Même plafond de dix envois par jour local, décompté sur les instants d'envoi. |
| Supprimer un envoi de son historique local | Explicite | — | Retrait franc. La place est rendue au décompte du jour. | — |
| Signaler le plafond atteint | **Aucun** | Un compte connecté, un service configuré, et aucun signalement déjà posé pour ce compte ce jour local. | Un courrier est déposé dans une boîte d'envoi distante. La marque du jour est posée *avant* l'envoi : au pire l'alerte du jour manque, jamais dix alertes identiques ne partent. | Aucun compte connecté, ou service non configuré : rien ne part, et le refus opposé à la personne ne dépend pas de cet envoi. |
| Consigner l'échec de production du document médical | **Aucun** | Un compte connecté, un service configuré, une production échouée. | Une fiche d'incident, puis un courrier d'alerte, tous deux à distance. Les deux sont indépendants : l'un peut manquer sans emporter l'autre. Voir « Le document médical » pour son contenu. | Aucun compte connecté : rien n'est consigné. Toute erreur d'écriture est avalée : cette capacité n'aggrave jamais l'incident qu'elle rapporte. |

**Ce qui accompagne un envoi**, au-delà de son contenu : la version du produit et le mode de compilation ; la provenance du geste et celle d'avant ; les quatre préférences de restitution retenues — apparence, accueil, repères, jeu de polices ; les dimensions de la surface de restitution, sa finesse et celles de l'appareil ; la langue de l'environnement, toutes celles qu'il annonce, et celle du produit ; la signature de l'environnement ; l'instant de l'envoi sous quatre formes, le jour local, le fuseau et son décalage en minutes. Le courrier joint en outre **l'adresse électronique du compte** comme adresse de réponse, quand le compte en porte une.

### Effacer

Trois portées, trois régimes. La règle qui les gouverne toutes : **rien ne détruit une donnée hors une destruction demandée et confirmée.**

| Portée | Confirmation | Ce qui survit |
| --- | --- | --- |
| Une ligne | Non — le retrait est franc et immédiat. | Rien de la ligne. Exception : la pesée de départ n'offre pas cette capacité. |
| Un journal entier | Oui, explicite. | Rien, sauf pour les pesées, où la pesée de départ est épargnée : elle sert de référence à la perte totale, aux distinctions et au document médical. |
| Le compte et toutes les données | Oui, explicite, et la suppression distante d'abord. | Rien. Voir « Le compte et la session ». |

Les quatre plafonds quotidiens qui remplacent la dernière ligne d'une journée sont le seul endroit du produit où une donnée disparaît sans confirmation. Le signalement *précède* l'écrasement, mais il n'ouvre aucune possibilité d'y répondre : la ligne est remplacée quoi qu'il arrive.

**Cas limites**

Une sauvegarde illisible n'est jamais écrasée : elle est recopiée sous une clé de secours, une seule fois, et plus rien n'est écrit de la session. C'est la seule situation où l'application refuse d'enregistrer quoi que ce soit.

Les capacités de suppression totale d'un journal peuvent être retirées par un drapeau du profil ; leur absence ne retire rien à la suppression ligne à ligne.

Une quatrième portée existe en administration, hors du périmètre de ce document : vider tous les journaux d'un coup en ne gardant que la pesée de départ, et sans toucher au profil.

### Ce que la V2 sait faire aujourd'hui

La V2 est repartie de zéro. Ses capacités se comptent : elle recueille des réponses, et **n'en persiste aucune**. Un rechargement perd tout ; aucun service n'est appelé ; le domaine ne lit pas l'horloge. Les lignes marquées **[V2]** ailleurs dans ce chapitre décrivent des *règles* déjà écrites en V2, pas des données déjà enregistrées.

| Capacité | Précondition | Effet sur les réponses |
| --- | --- | --- |
| Choisir une apparence | Un identifiant du catalogue fermé des apparences. | Une réponse remplacée. Préférence de restitution, hors du périmètre de ce chapitre. |
| Choisir une langue | Un identifiant de langue. | **Deux réponses changent d'un coup** : la langue, et le système d'unités qu'elle amène — français, métrique ; anglais, impérial. Le dernier geste l'emporte : rechoisir la langue efface un système réglé à la main juste avant. La langue est recueillie mais pas encore branchée. **[non implémenté]** |
| Choisir un système d'unités | Métrique ou impérial. | Une réponse remplacée. Décide de l'unité de saisie de la taille et de l'unité *de stockage* du poids. |
| Choisir un objectif | Perdre ou stabiliser. | Une réponse remplacée. « Stabiliser » **retire l'étape du poids visé de la suite du parcours** : la liste des étapes se recalcule à chaque réponse. |
| Choisir un poids, un poids visé | Une valeur de l'ensemble atteignable. Deux réponses distinctes, initialisées à 95,0 chacune et **jamais recopiées l'une dans l'autre**. | Une chaîne « entier.dixième », séparateur point quelle que soit la langue. |
| Déclarer avoir commencé un traitement, sa forme, sa spécialité | Pour avancer au-delà de la spécialité : forme *et* spécialité choisies toutes deux. C'est **la seule étape qui bloque** hors du secret. | Trois réponses liées, qui se défont ensemble : « non » efface la forme et la spécialité ; changer de forme efface la spécialité. « Oui » est retenu d'avance. « Non » retire l'étape de la spécialité de la suite du parcours. |
| Composer un avatar | Chaque grandeur dans son ensemble clos. | Huit grandeurs, genre compris. |
| Renseigner qui l'on est | Aucune sur le prénom, l'année de naissance ni la taille. Défauts : 1980, 165 cm, prénom vide. | Trois réponses. La taille est toujours en centimètres, quelle que soit l'unité de saisie. |
| Revenir en arrière | Ne pas être à la première étape. | Le rang recule d'une étape visible. Aucune réponse n'est effacée. |
| Sauter une question | Aucune, sauf sur les deux étapes qui bloquent. | La réponse garde son défaut. Rien n'est obligatoire. |

Le rang dans le parcours est borné à chaque lecture, non au moment de la réponse : changer d'objectif peut raccourcir la liste des étapes visibles, et le rang retombe alors sur la dernière plutôt que sur rien.

> **Exemple.**
>
> Camille choisit l'anglais : le système passe à l'impérial et son poids se choisit en livres, jusqu'à 2 000. Elle repasse au français : le système redevient métrique, et le plafond redevient 999.

## 6. Les dérivations

Ce chapitre énumère les grandeurs que le produit calcule à partir des journaux et du profil : leur formule, leurs entrées, leur unité canonique, leur fenêtre de temps et leur dénominateur. Chacune dit aussi ce qu'elle rend quand ses entrées manquent, parce que c'est la moitié de sa définition.

### La règle du silence, et ses trois exceptions

La règle : une grandeur dérivable se recalcule à chaque lecture depuis les journaux et le profil, et n'est pas conservée. Corriger une entrée corrige alors du même geste toutes les grandeurs qui en dépendent.

Trois grandeurs dérivables sont malgré tout conservées, et c'est ce qui fait de la règle une règle et non un invariant. Les voici, avec l'endroit où le cache peut diverger de sa source.

| Grandeur conservée | Où | Recalcul depuis la source | Divergence possible |
| --- | --- | --- | --- |
| Calories, protéines, glucides, lipides, fibres d'un repas | Champs de la ligne de repas | Recalculés depuis les aliments du repas *à chaque écriture de ce repas*, jamais à la lecture | Modifier la table nutritionnelle des aliments ne recorrige aucun repas déjà écrit |
| Attribution des équivalences insolites et compteurs d'usage par objet | Stockage local | Recalculée quand la signature de la pesée la plus récente change, ou quand les poids traduits (au dixième) changent | Une attribution écrite avant l'ajout des poids à la clé est tenue pour périmée et recalculée une fois |
| Dernier palier observé de chaque distinction | Stockage local | Jamais : c'est une mémoire, pas un cache. Sans elle, aucune montée de palier ne serait détectable d'une session à l'autre | Un palier conservé survit à l'extinction de son domaine, délibérément |

Le cas de l'attribution insolite est instructif : tant que sa clé de conservation ne portait que l'identifiant de la pesée la plus récente, corriger ou supprimer une pesée *passée* changeait les pertes sans changer la clé, et l'attribution conservée restait celle d'autres poids. Les poids traduits ont été ajoutés à la clé pour refermer ce trou.

Une dérivation dont les entrées manquent rend en général une absence et non un zéro : `null` pour une grandeur numérique indisponible, une liste vide pour une décomposition impossible. Un zéro serait une mesure — « zéro kilocalorie » se lit comme un jeûne, « zéro pas » comme une journée immobile. La règle a des dérogations, listées ici parce qu'un lecteur qui ne verrait que le nombre les lirait comme des mesures :

| Dérivation | Ce qu'elle rend faute d'entrées |
| --- | --- |
| IMC, taille inconnue ou nulle | `0` |
| Nom court de catégorie d'IMC | « Insuffisance pondérale » — ce jeu de noms n'a aucune branche pour un IMC nul ou négatif |
| Date de franchissement d'un rang d'IMC | chaîne vide |
| Poids actif à une date | une chaîne de replis qui finit par 80 kg |
| Métabolisme de base | 42 ans, 170 cm, genre « femme » |
| Concentration sanguine courante | `{ concentration: 0, multiple: faux }` si aucun groupe actif, `{ concentration: 0, multiple: vrai }` si plusieurs |
| Vitesse de marche moyenne sans aucun relevé | la constante 4,2 km/h |
| Part d'un objectif chiffré atteinte (forme bornée) | `0` si l'objectif est nul ou négatif |

| Convention | Règle |
| --- | --- |
| Signe d'une variation de poids | Négatif quand le poids descend, positif quand il monte. La grandeur nommée « perte » suit la convention inverse : positive quand on a perdu. |
| Précision d'un poids | Un dixième de kilogramme, la précision d'une balance ; appliqué à l'écriture de la pesée, donc hérité par tout ce qui la lit. |
| Précision d'une distance | Un dixième de kilomètre au plus, arrondi dans le calcul et non à la restitution. |
| Unités canoniques | kilogramme, centimètre, gramme, millilitre, milligramme, mètre (distance d'une séance), minute (durée), kilocalorie, pas. |
| Jour | Date locale `AAAA-MM-JJ`. Un écart de jours se calcule composante par composante, jamais par une différence d'instants, pour absorber les jours de 23 et 25 heures. |
| Ce qui a eu lieu | Une entrée est « survenue » si sa date est antérieure à aujourd'hui, ou si elle est d'aujourd'hui et que son heure est passée. Une heure absente vaut minuit, donc survenue. |

**Une heure absente ne vaut pas la même chose partout**, et trois conventions coexistent. C'est un écart de code, pas une doctrine.

| Heure absente | Vaut | Où |
| --- | --- | --- |
| Test « a eu lieu » | minuit (donc survenue) | filtre commun des paliers, des séries, des comptes |
| Ordre des journaux, départage de deux pesées du même jour, instant d'une prise dans la cinétique | midi | tri chronologique, dernière pesée d'un jour, concentration |
| Tri de la série du traitement, clé d'attribution insolite, pesée la plus récente | minuit | coupure de traitement, attribution des objets |

Conséquence directe : deux pesées du même jour dont une seule porte une heure ne se départagent pas de la même façon selon la grandeur qui les lit. **[arbitrage non validé]**

Les entrées datées dans l'avenir sont écartées de la plupart des dérivations : paliers de badge, projection de poids, série du traitement en cours, fréquence de prise, corrélation, score d'activité. Elles ne sont pas écartées du bilan énergétique sur sept jours ni des moyennes de journal, qui filtrent seulement par date — ni du journal des pesées lu par l'objectif de protéines du palier correspondant.

### Le poids actif à une date

Presque toutes les dépenses énergétiques ont besoin d'un poids au jour considéré. Le poids actif d'un jour est la dernière pesée dont la date est inférieure ou égale à ce jour.

```
poidsActif(jour) = dernière pesée p telle que p.date <= jour
sinon, journal non vide  : poids de départ, sinon poids cible du profil,
                           sinon pesée la plus ancienne, sinon 80 kg
sinon, journal vide      : poids de départ, sinon poids cible, sinon 80 kg
```

La chaîne de repli compte donc quatre maillons quand le journal n'est pas vide, trois quand il est vide, et elle contredit la règle du silence : cette dérivation ne se tait jamais. Le poids de départ est celui de la pesée portant le drapeau de départ, pas la pesée la plus ancienne.

Le poids « actuel » d'un profil, lui, est la pesée la plus récente *par date et heure*, et non la dernière saisie ; une pesée antidatée ajoutée après coup ne devient pas le poids actuel. Deux pesées le même jour se départagent par l'heure la plus tardive, jamais par leur moyenne : une pesée du matin et une du soir ne décrivent pas le même poids. Une exception subsiste, décrite au paragraphe des paliers de badge.

### IMC et catégories

```
imc = poidsKg / (tailleCm / 100)²      arrondi au dixième
imc = 0 si la taille est inconnue ou nulle
```

Les bornes de catégorie sont identiques dans les deux jeux de noms qui les habillent, mais les deux jeux ne se comportent pas pareil aux bords : seul le jeu long connaît un rang « inconnu » et le rend pour un IMC nul ou négatif. Le jeu court n'a pas de branche pour ce cas et rend « Insuffisance pondérale ». Seul le jeu long porte un rang, et c'est ce rang qui sert à comparer deux catégories.

| Rang | Borne | Nom court | Nom long |
| --- | --- | --- | --- |
| 0 | < 18,5 | Insuffisance pondérale | Insuffisance pondérale |
| 1 | 18,5 à < 25 | Corpulence normale | Corpulence normale |
| 2 | 25 à < 30 | Surpoids | Surpoids |
| 3 | 30 à < 35 | Obésité I | Obésité modérée (Classe I) |
| 4 | 35 à < 40 | Obésité II | Obésité sévère (Classe II) |
| 5 | ≥ 40 | Obésité III | Obésité très sévère (Classe III) |
| 99 | ≤ 0 | Insuffisance pondérale (pas de branche) | Inconnu |

Les **points d'IMC gagnés ou perdus** depuis le départ se calculent sur la différence de poids, jamais en retranchant deux IMC déjà arrondis :

```
pointsImc = (poidsActuel − poidsDepart) / (tailleM)²   arrondi au dixième
null si tailleM <= 0 ou poidsDepart <= 0
```

Le signe est celui de la variation : perdre du poids donne un nombre négatif.

La **date de franchissement** d'un rang visé est la date de la première pesée, dans l'ordre chronologique, dont le rang d'IMC est inférieur ou égal au rang visé — à condition que le rang du poids de départ lui soit strictement supérieur. Le rang se juge sur l'IMC *non arrondi*. Sans franchissement, la dérivation rend une chaîne vide : entrer déjà dans la catégorie visée n'est pas un franchissement.

> **Exemple.**
>
> Camille, 168 cm : à 96 kg son IMC vaut 96 / 1,68² = 34,0 — rang 3, « Obésité I ». À 88 kg il vaut 31,2, même rang ; les points d'IMC valent (88 − 96) / 2,8224 = −2,8. Le rang 2 demande un IMC strictement inférieur à 30, soit un poids strictement inférieur à 30 × 2,8224 = 84,672 kg : à 84,7 kg l'IMC non arrondi vaut encore 30,01, le franchissement se produit à 84,6 kg.

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

La dérivation ne borne rien à zéro : le plancher `max(0, …)` n'existe que chez l'appelant qui lit un relevé de pas du journal, et le bilan énergétique sur sept jours appelle la formule sans lui. Taille absente : 170 cm chez cet appelant.

**Les séances.** Une séance porte un sport, une intensité ressentie (douce, modérée, intensive), une durée en minutes et une distance facultative en mètres. Le facteur d'intensité vaut 0,8 / 1,0 / 1,3.

```
kcal = arrondi(MET × poidsKg × durée_h)
MET  = MET_catalogue(sport) × facteur(intensité)          sans distance
MET  = MET_allure(sport, distance/durée)                   avec distance
kcal = arrondi(0,05 × facteur(intensité) × poidsKg × étages)   montée d'escaliers
```

La montée d'escaliers est le seul sport dont la durée ne compte pas des minutes mais des **étages** ; partout où des minutes s'additionnent, un étage vaut une demi-minute. Un sport absent du catalogue prend 4,5 MET.

Quand une distance est renseignée sur un sport qui en accepte une, l'allure *remplace* l'intensité ressentie : la multiplier encore compterait deux fois le même effort. Le MET se lit par interpolation linéaire sur une table d'ancrages allure → MET propre au sport, bloquée aux extrémités — ce qui rend une distance absurde inoffensive. Les huit sports à distance sont la marche, la randonnée, la course à pied, le vélo, la natation, le rameur, le ski de fond et le patinage.

**Six tables sur huit** contiennent un ancrage dont le MET vaut exactement le MET du catalogue : à cette allure de référence, le résultat est celui du calcul par intensité modérée. Deux n'en ont pas, et l'égalité n'y existe à aucune allure : la course à pied vaut 8,0 MET au catalogue et ses ancrages voisins sont 6,0 à 6,4 km/h puis 8,3 à 8,0 km/h ; le rameur vaut 6,0 MET au catalogue et ses ancrages voisins sont 4,8 à 9 km/h puis 7,0 à 12 km/h.

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

Le facteur tiré de l'allure est borné exactement à la plage du ressenti, sans quoi une journée renseignée avec distance ne se comparerait plus à une journée renseignée sans. Le plafond de 10 fait qu'une séance de trois heures ne vaut pas trois journées : la mesure récompense la régularité. La provenance du facteur — allure ou ressenti — est rendue avec lui, parce qu'une allure très vive rend exactement 1,3 et qu'on ne peut pas la déduire du nombre.

**Le score d'une fenêtre est la somme des scores journaliers**, jamais le score du cumul des séances de la fenêtre : c'est le plafond appliqué jour par jour qui donne son sens à la mesure. Les séances non survenues sont écartées ; ni le sport hors catalogue ni la montée d'escaliers ne le sont, puisque le MET ne sert pas.

Quatre fenêtres servent la comparaison, deux échelles calculées toutes les deux, sans jour commun entre une fenêtre et sa précédente :

| Échelle | Fenêtre courante | Fenêtre précédente |
| --- | --- | --- |
| Semaine | J−6 → J | J−13 → J−7 |
| Mois | J−29 → J | J−59 → J−30 |

### La balance énergétique

Sur les sept derniers jours, aujourd'hui compris, jour par jour :

| Grandeur du jour | Définition | Unité |
| --- | --- | --- |
| poids | poids actif à cette date | kg |
| mb | métabolisme de base sur ce poids | kcal, arrondi |
| ingéré | somme des calories des repas de la date | kcal, arrondi |
| kcalSéances | somme des dépenses des séances de la date | kcal |
| kcalPas | somme des dépenses des relevés de pas de la date, sans plancher à zéro | kcal |
| dépenseActive | kcalSéances + kcalPas | kcal |
| dépenseTotale | mb + dépenseActive | kcal, arrondi |

```
sortie = arrondi(Σ mb + Σ dépenseActive)
balance = Σ ingéré − sortie          positif = surplus, négatif = déficit
```

Le sens de la balance est nommé par bandes, sur sa valeur absolue en kilocalories cumulées sur sept jours :

| \|balance\| | Sens | Nom |
| --- | --- | --- |
| ≤ 4 000 | stable | Stable |
| ≤ 8 000 | perte / prise | Légère perte de poids · Légère prise de poids |
| ≤ 14 000 | perte / prise | Perte de poids · Prise de poids |
| > 14 000 | perte / prise | Perte de poids marquée · Prise de poids marquée |

Les calories d'un repas ne sont pas ré-estimées ici : ce sont les champs conservés de la ligne de repas, recalculés depuis ses aliments à chaque écriture de celle-ci, et lus tels quels.

### La projection de poids

La même balance énergétique, traduite en grammes, sur les sept derniers jours et en écartant cette fois toute saisie non survenue.

```
dépenses     = arrondi(Σ mb) + arrondi(Σ kcalPas) + arrondi(Σ kcalSéances)
différentiel = Σ ingéré − dépenses                      kcal
grammes      = arrondi(différentiel / 8000 × 1000)      g
```

Le taux de conversion — 8 000 kcal pour un kilogramme — est une constante du produit, posée par l'utilisatrice ; ce n'est pas la valeur physiologique usuelle. Les trois dépenses sont arrondies *avant* d'être sommées pour que la soustraction posée retombe exactement sur le différentiel restitué.

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

**La cadence sur un intervalle borné.** Même formule, mais le dénominateur est `joursEntre(début, fin)` — l'écart entre les deux bornes, *sans* le « + 1 » qui définit ailleurs la longueur d'un intervalle.

```
cadence = (dernièrePeséeDedans − premièrePeséeDedans) × 7 / joursEntre(début, fin)
null si moins de deux pesées dans l'intervalle
null si joursEntre(début, fin) < 7
```

Conséquence à connaître : un intervalle de sept jours de calendrier — lundi à dimanche, longueur 7 au sens du chapitre — donne `joursEntre = 6`, et la dérivation se tait. Il lui faut huit jours de calendrier pour parler. Le seuil de sept est le même partout : ramener un écart de trois jours à la semaine le multiplie par 2,3, alors que le bruit d'un jour à l'autre domine la mesure. Ce calcul retient **une pesée par jour, la dernière**, comme le découpage en tranches.

**La perte par tranche de sept jours.** Un découpage en tranches consécutives de sept jours, ancrées soit sur la première pesée, soit sur le début de la période demandée. Une pesée par jour, la dernière — règle partagée avec la cadence bornée. La règle propre à ce seul calcul est l'**interpolation** : le poids d'un jour sans pesée est interpolé linéairement entre les deux pesées qui l'encadrent, et vaut la pesée la plus proche au-delà des bornes. Chaque tranche rend son poids de fin et sa perte, définie comme poids de début moins poids de fin — donc positive quand on a perdu. Le nombre de tranches est le plafond entier du nombre de jours divisé par sept, au moins une. La dernière tranche d'une période de trente jours *déborde* la période : ses trente-cinquième jours n'existent pas, son poids de fin est bloqué sur la dernière pesée connue.

**Le résumé d'une suite de tranches.**

```
totalKg       = Σ pertes des tranches           (= poids d'entrée − poids de sortie)
poidsEntrée   = poids de fin de la 1re tranche + sa perte
pctDuDépart   = totalKg / poidsEntrée × 100     null si poidsEntrée <= 0
parSemaine    = totalKg / nombre de tranches
pctParSemaine = arrondi_centième(pctDuDépart / nombre de tranches)
```

La référence du pourcentage est le poids d'*entrée de période*, jamais le poids de départ de la cure. Conséquence assumée du découpage : une période de trente jours compte cinq tranches, dont une qui déborde, et la moyenne par semaine s'en trouve diluée.

**La variation en pourcentage du poids de départ**, elle, est indépendante des tranches :

```
pct = (poidsActuel − poidsDepart) / poidsDepart × 100     0 si poidsDepart <= 0
```

Enfin, le **lissage** entre les pesées est une spline cubique monotone de Fritsch–Carlson : elle passe exactement par chaque pesée et ne dépasse jamais les deux qui l'encadrent — pas de rebond sous le poids plancher. Elle ne rend rien hors de l'intervalle [première pesée, dernière pesée] : le lissage ne s'invente pas de prolongement.

> **Exemple.**
>
> Camille est partie de 96,0 kg en mai 2026. Au 112ᵉ jour elle pèse 88,0 kg : la cadence depuis le départ vaut (88,0 − 96,0) × 7 / 112 = −0,5 kg par semaine, et la variation −8,3 % du poids de départ.

### L'avancement vers la cible

```
écart = poidsDepart − poidsCible
si écart > 0 : avancement = borne(0, 100, (poidsDepart − poidsActuel) / écart × 100)
sinon        : avancement = 100 si poidsActuel <= poidsCible, 0 sinon
```

Une cible incohérente — au-dessus du poids de départ — ne rend pas d'erreur : elle rend 0, sauf si la cible est déjà tenue. Le trajet départ → cible se décrit aussi par son écart signé, en kilogrammes et en pourcentage du poids de départ, indéfini si l'un des deux poids manque.

Deux autres formes d'avancement servent les objectifs chiffrés — pas, calories, protéines, fibres — et elles ne coïncident pas :

| Forme | Formule | Objectif nul ou négatif |
| --- | --- | --- |
| Bornée | `borne(0, 100, arrondi(valeur / objectif × 100))` | `0` |
| Non bornée | `arrondi(valeur / objectif × 100)` | `null`, et aussi si l'objectif n'est pas un nombre fini |

### La concentration sanguine

La quantité de principe actif présente à un instant se modélise par un compartiment unique et un modèle de Bateman, appliqué sur toute la trajectoire — montée et descente. Chaque traitement du catalogue porte trois paramètres : demi-vie d'élimination, demi-vie d'absorption, et une part de dose utile qui représente la biodisponibilité relative (1 par défaut).

```
ke = ln2 / demiVieElimination
ka = ln2 / demiVieAbsorption
tMax = ln(ka/ke) / (ka − ke)
normalisation = 1 / (e^(−ke·tMax) − e^(−ka·tMax))
contribution(dose, h) = dose × partUtile × (e^(−ke·h) − e^(−ka·h)) × normalisation
contribution = 0 si h < 0
concentration(t) = Σ contribution(dose_i, (t − instant_i)/3600000) pour instant_i <= t
```

La normalisation fait que le pic d'une prise isolée vaut exactement la dose utile ; l'unité est donc un milligramme-équivalent, pas une concentration plasmatique. Loin du pic le terme d'absorption devient négligeable et la quantité décroît exactement selon la demi-vie d'élimination. L'heure d'une prise absente vaut midi.

**Le cumul se fait par molécule, pas par marque ni par forme.** Deux prises de la même molécule s'additionnent quels que soient leur nom commercial et leur forme ; chacune garde la cinétique de sa propre fiche, ce que la part de dose utile rend légitime. Un traitement générique, de molécule inconnue, ne s'additionne à rien et forme son propre groupe.

**La concentration courante** se calcule en deux temps, et la fenêtre de soixante jours ne joue que dans le premier :

1. *Choix des molécules à considérer* : les prises des soixante derniers jours, ou tout l'historique si cette fenêtre est vide, sont groupées par molécule.
2. *Calcul de chaque groupe* : sur **tout l'historique** de la molécule, pas seulement ses prises récentes — une prise d'il y a soixante-dix jours contribue encore.

Les groupes dont la concentration résiduelle est inférieure ou égale à 0,001 mg sont écartés. Le résultat est un couple : la concentration et un drapeau « plusieurs ».

| Situation | concentration | plusieurs |
| --- | --- | --- |
| Journal de prises vide | 0 | faux |
| Aucun groupe au-dessus de 0,001 mg | 0 | faux |
| Un seul groupe actif | sa concentration | faux |
| Plusieurs groupes actifs | 0 | vrai |

Le zéro accompagné du drapeau n'est pas une mesure : additionner deux molécules n'aurait pas de sens, et c'est le drapeau, non le nombre, qui porte l'information.

La **fenêtre du pic** est une dérivation distincte : elle se calcule sur les seules prises *déjà faites*, une prise programmée étant une prévision et non un fait, et sa largeur dépend de la forme — orale ou injectable — de la dernière prise faite. Sans aucune prise faite, la forme retenue est l'injection.

Le **rythme de prise usuel** d'une fiche est sa valeur déclarée, à défaut 1 jour pour un comprimé et 7 jours pour une injection.

| Fiche | Molécule | Forme | Demi-vie élimination | Demi-vie absorption | Part de dose utile |
| --- | --- | --- | --- | --- | --- |
| Sémaglutide injectable | sémaglutide | injection | 168 h | 15 h | 1 |
| Sémaglutide oral | sémaglutide | oral | 160 h | 0,1 h | 0,008 |
| Tirzépatide | tirzépatide | injection | 120 h | 12 h | 1 |
| Liraglutide | liraglutide | injection | 13 h | 2,5 h | 1 |
| Dulaglutide | dulaglutide | injection | 113 h | 14 h | 1 |
| Rétatrutide | rétatrutide | injection | 144 h | 12 h | 1 |
| Orforglipron | orforglipron | oral | 36 h | 0,7 h | 1 |
| Autre traitement (injection) | aucune | injection | 168 h | 15 h | 1 |
| Autre traitement (comprimé) | aucune | oral | 160 h | 1,5 h | 1 |
| Pas de traitement | aucune | injection | 168 h | 15 h | 1 |

« Pas de traitement » n'est pas un traitement mais un état, hors des deux familles du catalogue ; c'est aussi la fiche de repli. Un identifiant absent ou inconnu y retombe, et hérite donc de la cinétique du sémaglutide injectable, sans qu'aucun nom de médicament soit inventé.

> **Exemple.**
>
> Camille est sous sémaglutide injectable : ke = 0,004126 h⁻¹, ka = 0,046210 h⁻¹, pic à 57,4 h — un peu moins de deux jours et demi après l'injection — et normalisation 1,391. Une dose de 1 mg atteint donc 1,00 mg-équivalent à son pic ; en rythme hebdomadaire, les doses successives s'accumulent vers un plateau d'environ le double d'une dose isolée.

### La série du traitement

Trois grandeurs répondent à la même question — quelles prises comptent aujourd'hui — et sortent donc d'un seul calcul. Deux règles, dans cet ordre :

1. les prises non survenues sont écartées, date et heure comprises ;
2. **un changement de traitement est une coupure** : en remontant depuis la fin, on garde les prises du traitement courant jusqu'à la première prise d'un autre traitement. Revenir à un traitement déjà pris ne rouvre pas son ancien épisode.

Le filtre passe devant la coupure : sans cela, une prise future d'un autre traitement — un changement planifié — viderait la série entière. L'ordre chronologique de ce calcul lit une heure absente comme minuit. Une prise sans marque est réputée du traitement courant.

| Grandeur | Définition | Absence |
| --- | --- | --- |
| compte | nombre de prises de la série | 0 |
| dose initiale | dose de la première prise de la série, en mg | null si série vide |
| dose actuelle | dose de la dernière prise de la série, en mg | null si série vide |
| cumul | somme des doses, figée au centième | 0 |

La **fréquence de prise** se mesure sur tout l'historique et non sur la seule série courante, en comptant des *journées* de prise et non des lignes :

```
fréquence = joursEntre(1re journée, dernière journée) / (nombre de journées − 1)   jours
null si moins de deux journées de prise survenues, ou si l'écart est nul
```

Deux prises le même jour — une correction, un doublon, une dose scindée — ne font pas deux prises espacées de zéro jour. C'est la moyenne des écarts et non leur médiane : elle ne dépend que des deux extrémités, et n'efface donc pas les semaines sautées.

L'**ancienneté** se compte sur deux ancrages : la pesée de départ pour la cure, la première prise du traitement courant pour le traitement.

```
joursTotal = joursEntre(ancrage, aujourd'hui)      minuits locaux
semaine    = plancher(joursTotal / 7) + 1
null si l'ancrage n'existe pas ou est daté du futur
```

Le jour de l'ancrage se dit « 1 jour », jamais « 0 jour ». La durée d'une perte se dit en jours en deçà de sept jours, en semaines arrondies à l'entier le plus proche au-delà ; elle ne se dit pas quand la borne de début manque, quand elle dépasse la borne de fin, ou quand les deux bornes sont à moins d'un jour d'écart.

Le délai depuis la dernière prise est un nombre entier de jours entre minuits ; il peut être négatif si la seule prise connue est datée dans l'avenir, et il est alors lu comme un délai *jusqu'à* la prochaine.

### Les fenêtres et les dénominateurs

Une moyenne n'a de sens que par son dénominateur, et le produit n'en emploie pas un seul. La règle générale : **on divise par les journées renseignées quand le silence est un oubli, par les jours écoulés quand le silence est une information.** Une journée sans repas saisi est une journée non tenue, pas un jeûne ; une semaine sans séance est une semaine sans séance.

| Grandeur | Fenêtre | Dénominateur | Absence |
| --- | --- | --- | --- |
| Repas, en-cas, kcal, protéines, fibres par jour | tout l'historique | journées portant au moins un repas | null si aucune |
| kcal, protéines, fibres par jour, récent | de J−7 à J−1 (hier inclus, aujourd'hui exclu) | journées portant au moins un repas dans la fenêtre | null si aucune |
| Pas par jour | tout l'historique, ou J−6 à J | journées dont le total de pas est > 0 | null si aucune |
| Pas, distance, durée, kcal, avancement — depuis une date | de la date choisie à la fin | nombre de relevés retenus | zéros — sauf la vitesse, qui vaut alors 4,2 km/h |
| Minutes et séances d'activité par semaine | 1re séance → aujourd'hui, ou période choisie | jours de la fenêtre / 7 | null si la fenêtre couvre moins de 7 jours ; total exact dès la 1re séance |
| Durée de nuit moyenne | tout l'historique, ou J−6 à J | journées portant une nuit de durée non nulle | null si aucune |
| Sommeil moyen d'une journée | idem | journées renseignées, siestes comprises | null si aucune |
| Moments pour soi, effets secondaires par semaine | 1re entrée → aujourd'hui, bornes comprises | jours / 7 | null si journal vide ou recul < 7 jours |
| Comptes à sept jours (séances, effets, moments) | J−6 à J, aujourd'hui compris | — | 0 |

Une journée à zéro pas est un podomètre éteint, pas une journée immobile : elle ne compte ni au numérateur ni au dénominateur. Une nuit de zéro minute n'est pas une nuit blanche : même traitement. Deux relevés de pas le même jour s'additionnent sans compter deux journées ; deux nuits le même jour aussi. Les moments pour soi se comptent en *entrées* et non en journées : deux moments dans la même journée font deux.

Les fenêtres nommées valent 7, 14, 30 et 90 jours ; « depuis le début » et une paire de bornes libres n'ont pas de longueur connue et se disent sans nombre de jours. La longueur d'une paire de bornes est `joursEntre(début, fin) + 1`, indéfinie si une borne manque ou si la fin précède le début. Attention : la cadence sur intervalle borné, elle, divise par `joursEntre` sans le « + 1 ».

**Deux points de départ pour une même durée nommée.** Une fenêtre de « 30 derniers jours » appliquée à la série des pesées recule depuis *aujourd'hui* ; la même appliquée aux tranches de perte hebdomadaire retient les tranches dont les bornes tombent dans la fenêtre et recule donc depuis la *dernière semaine connue*. Sans cela, une personne qui n'a pas pesé depuis un mois n'aurait aucune tranche à lire.

Le total de pas d'une période peut recevoir une valeur **figée** pour la journée en cours : le compte du jour bouge encore, et un total qui varierait entre deux lectures serait faux deux fois. Le figement n'est pas une propriété du calcul mais un paramètre que l'appelant lui fournit — il relève la journée en cours une seule fois, à l'ouverture ; changer de période recalcule le total sans rafraîchir cette valeur. Si la période ne contient pas aujourd'hui, la valeur figée n'entre pas dans le total.

Une distance de marche connaît **deux formules distinctes** : le journal des pas la calcule à 0,00076 km par pas, tandis que la dépense énergétique la recalcule depuis la taille. Elles ne coïncident pas.

La durée de marche vaut `arrondi(pas / 95)` minutes. La vitesse restituée dépend du calcul : la constante de 4,2 km/h est celle qu'emploie la dépense énergétique et celle qui sert de repli quand la durée est nulle, mais le bilan cumulé des pas la *calcule*, distance sur durée — et les deux constantes du journal donnent 0,00076 × 95 × 60 ≈ 4,33 km/h. Le chiffre restitué là est donc environ 4,3, pas 4,2.

### Les objectifs nutritionnels

Trois objectifs quotidiens, chacun remplaçable par une valeur du profil, plus l'objectif de pas :

| Objectif | Défaut | Unité |
| --- | --- | --- |
| Calories | 1 400 | kcal |
| Protéines | arrondi(poidsActuel × 1,5) | g |
| Fibres | 25 | g |
| Pas | 8 000 | pas |

L'objectif de protéines est le seul dérivé d'une autre donnée. Sa formule est la même que celle du palier de badge correspondant, mais **pas son entrée** : ici le poids actuel est la pesée la plus récente par date et heure ; là c'est la dernière ligne du journal. Une pesée antidatée ajoutée après coup fait diverger les deux objectifs le même jour.

Les totaux d'une journée sont les sommes des calories, protéines et fibres des repas de cette date, lues dans les champs conservés des lignes de repas ; les fibres sont toujours du nombre.

### Les effets et leurs paliers

Un effet secondaire porte une sévérité entière de 1 à 5. Les paliers sont uniques dans le produit :

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

Les instants se lisent composante par composante depuis une date locale et une heure, jamais par interprétation d'une chaîne, qui décalerait d'un jour selon le fuseau. La durée de nuit d'une journée est la somme de ses entrées de type nuit, indéfinie s'il n'y en a aucune ; la durée de sieste, la somme des siestes, nulle s'il n'y en a pas.

La qualité moyenne d'un ensemble d'entrées est **pondérée par leur durée**, arrondie au dixième : une sieste de vingt minutes ne pèse pas autant qu'une nuit de huit heures. Elle est indéfinie si la durée totale est nulle. Les entrées de durée nulle ou négative ne pèsent rien. Deux dérivations en découlent : la qualité d'une *journée* pondère toutes ses entrées, la qualité de la *nuit* ne pondère que celles de type nuit.

Le **temps d'éveil** d'une journée J court du réveil de la nuit datée J à l'endormissement de la nuit datée J+1, moins les siestes de J.

```
réveil   = le plus tardif des réveils des nuits de J
coucher  = le plus précoce des endormissements des nuits de J+1
brut     = coucher > réveil ? coucher − réveil : coucher + 1440 − réveil
éveil    = brut − siestes(J)
null si J ou J+1 ne porte aucune nuit, ou si éveil <= 0
```

La lecture concurrente — vingt-quatre heures moins le sommeil — est écartée : elle donnerait vingt-quatre heures d'éveil à une journée où rien n'a été enregistré. Un trou dans les données ne s'invente pas.

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

Quatre distinctions, cinq paliers ordonnés — aucun, éveil, bronze, argent, or. L'ordre est unique et sert à comparer. Un palier supérieur écrase les inférieurs ; l'évaluation rend toujours le plus haut palier atteint.

Le palier « éveil » est le critère du badge rempli sur **une seule journée**, la journée en cours ou la précédente — les deux seules journées que ce palier regarde.

| Distinction | Journal | Éveil | Bronze | Argent | Or |
| --- | --- | --- | --- | --- | --- |
| Activité physique | séances | une séance aujourd'hui ou hier | 120 min modérées-équivalent / 10 j | 180 min intensives-équivalent / 10 j | 180 min intensives-équivalent / 7 j |
| Fibres | repas | 25 g aujourd'hui ou hier | 25 g atteints 4 j / 7 | 5 j / 7 | 7 j / 7 |
| Protéines | repas | objectif atteint aujourd'hui ou hier | objectif atteint 4 j / 7 | 5 j / 7 | 7 j / 7 |
| Pas | relevés de pas | 8 000 pas aujourd'hui ou hier | 8 000 pas 3 j / 7 | 4 j / 7 | 5 j / 7 |

Les équivalences d'activité sont des coefficients appliqués à la durée : vers l'intensif, 1,0 / 0,67 / 0,33 pour intensive, modérée, douce ; vers le modéré, 1,5 / 1,0 / 0,5. Ce sont des coefficients propres aux paliers, distincts du facteur d'intensité des dépenses (0,8 / 1,0 / 1,3) et du score d'activité. La durée entre ici brute, sans conversion des étages.

**Les entrées non survenues sont écartées des repas, des séances et des pas — mais pas des pesées.** L'objectif de protéines du palier lit le journal des pesées brut : une pesée datée dans l'avenir, écrite en dernière ligne, fixe donc l'objectif. Cet objectif est le poids actuel × 1,5 g arrondi, où le poids actuel est la *dernière ligne* du journal, non la pesée la plus récente par date ; le poids de départ à défaut, et 70 kg en dernier ressort.

Une distinction dépend de l'activation de son domaine : l'activité et les pas sont réputés actifs sauf refus explicite, les repas sont réputés inactifs sauf accord explicite. Une distinction dont le domaine est éteint n'est pas évaluée.

La **montée de palier** est un rang strictement supérieur au dernier rang *observé* pour cette distinction, et c'est la seconde moitié de la règle qui la définit : **un palier jamais observé n'est pas une montée mais une découverte, enregistrée en silence**. Sans elle, un historique importé ferait monter quatre distinctions d'un coup, et rallumer un domaine éteint en ferait monter une. La mémoire des paliers observés part de l'état connu et n'est jamais reconstruite depuis les seuls domaines actifs : un palier observé traverse donc l'extinction de son domaine. Rallumé au même palier, rien ne monte ; rallumé plus haut, la montée est réelle et n'a lieu qu'une fois. Un palier qui baisse est enregistré sans être une montée.

> **Exemple.**
>
> Camille marche 8 200 pas hier et 6 000 aujourd'hui, et n'a pas d'autre relevé sur les sept derniers jours : la distinction des pas est au palier éveil — un jour sur sept, il en faut trois pour le bronze.

### Les équivalences insolites

Un poids en kilogrammes se traduit en une combinaison de **un ou deux objets** d'un catalogue de 222 entrées — 71 objets courants et 151 insolites — dont les masses vont de 1 g à 200 kg. Chaque entrée porte un nom au singulier avec son article, un pluriel, une masse en kilogrammes et une catégorie. Un attribut facultatif « animal » existe dans le type mais **aucune des 222 entrées ne le renseigne** : tout filtre qui le lit ne trouve rien.

La recherche est exhaustive et déterministe : toutes les combinaisons d'un et de deux objets sont énumérées, et la meilleure est celle dont l'écart absolu au poids visé est le plus faible ; à égalité, la première du catalogue. L'énumération des paires autorise le même indice deux fois : **une combinaison peut donc être deux fois le même objet**, y compris à l'intérieur de la tolérance. Une combinaison est admissible si elle compte au plus deux objets, au plus deux insolites, et — dès qu'elle contient un insolite — au moins un insolite de moins d'un kilogramme.

**L'équivalence doit être vraie à 200 g près.** C'est un écart absolu, le même à 0,8 kg qu'à 30 kg : au-delà, ce n'est plus une équivalence. Les bandes de tolérance relatives essayées d'abord — 5 %, 15 %, 40 % du poids visé — sont supprimées : à 30 kg, 40 % autorisaient une erreur de douze kilos.

Deux règles supplémentaires ne s'appliquent qu'à l'intérieur de cette tolérance, et **seulement quand l'appelant fournit une liste d'exclusion ou des compteurs d'usage** ; sans elles, le catalogue rend simplement la combinaison la plus juste :

1. **exclusion** — une combinaison ne reprend pas un objet déjà attribué à une autre équivalence attribuée en même temps ; la priorité va à l'équivalence « depuis le début », dont le repère ne doit pas changer d'une semaine à l'autre, et c'est la dernière perte qui cède. Si aucune autre combinaison vraie n'existe, la règle cède, et jamais au prix d'une équivalence fausse ;
2. **rotation** — parmi les combinaisons vraies restantes, celle dont les objets ont été attribués le moins souvent gagne ; à usage égal, la plus juste ; à justesse égale, la première du catalogue.

Un poids nul ou négatif ne rend aucune combinaison : rien plutôt que du faux. Un poids que le catalogue n'approche pas à 200 g près n'a aucun candidat admissible ; la combinaison la plus juste est alors rendue telle quelle, répétition comprise.

Une **attribution** est rattachée à la pesée la plus récente par date et heure — une heure absente valant minuit ici — identifiée par l'identifiant, la date et l'heure de cette pesée, et par les poids qu'elle traduit, arrondis au dixième. Ces poids font partie de la clé parce que la pesée la plus récente ne suffit pas : corriger une pesée passée change les poids traduits sans changer la pesée la plus récente. Une attribution vaut jusqu'à la pesée suivante : chaque nouvelle pesée réattribue, même à poids identique. Chaque attribution incrémente de un le compteur d'usage de chacun de ses objets — c'est ce compteur que la règle de rotation lit, et il est conservé.

> **Exemple.**
>
> Camille a perdu 8,0 kg. Le catalogue doit rendre une combinaison d'un ou deux objets pesant entre 7,8 et 8,2 kg ; si l'un d'eux sert déjà à traduire sa dernière perte, la règle d'exclusion en choisit une autre du même intervalle.

**Cas limites**

Taille inconnue ou nulle : l'IMC vaut 0, le nom long de sa catégorie est « Inconnu » et le nom court « Insuffisance pondérale » ; les points d'IMC ne se disent pas, la date de franchissement rend une chaîne vide.

Aucune pesée : le poids actif retombe sur le poids de départ, puis sur le poids cible, puis sur 80 kg — cette dérivation ne se tait jamais. Journal non vide sans pesée antérieure à la date visée : la pesée la plus ancienne s'intercale avant les 80 kg.

Âge, taille ou genre absents du profil : le métabolisme de base emploie 42 ans, 170 cm et « femme » plutôt que de se taire.

Moins de sept jours de recul : aucune moyenne hebdomadaire n'est rendue, mais les totaux le sont.

Intervalle borné de sept jours de calendrier : `joursEntre` vaut 6, la cadence bornée se tait alors que la longueur de l'intervalle est 7.

Une seule pesée dans un intervalle : aucune cadence sur cet intervalle.

Aucune pesée dans un intervalle, mais des pesées avant et après : le découpage en tranches interpole et rend une variation, là où la cadence bornée se tait.

Plusieurs molécules actives simultanément : la concentration rendue est 0 et le drapeau « plusieurs » est levé — c'est le drapeau qui porte l'information, pas le nombre.

Toutes les prises datées de plus de soixante jours : la fenêtre de soixante jours cède et l'historique entier sert à choisir les molécules. La concentration d'un groupe se calcule de toute façon sur tout son historique.

Identifiant de traitement absent ou inconnu : fiche « Pas de traitement », donc cinétique du sémaglutide injectable et aucun nom de médicament.

Deux prises la même journée : elles comptent pour une journée dans la fréquence, pour deux dans le compte de la série.

Une seule journée de prise : aucune fréquence.

Prise ou pesée datée dans l'avenir : écartée de la projection, de la série, de la fréquence, de la corrélation et des paliers — sauf du journal des pesées lu par l'objectif de protéines du palier, qui n'est pas filtré. Le délai depuis la dernière prise devient négatif et se lit comme un délai jusqu'à la prochaine.

Journal de repas vide sur la fenêtre : aucune moyenne, ni de calories, ni de protéines, ni de fibres.

Relevé de pas à zéro, nuit de durée nulle : traités comme des relevés absents, exclus du numérateur et du dénominateur.

Aucun relevé de pas depuis la date choisie : toutes les moyennes valent 0, sauf la vitesse, qui vaut 4,2 km/h.

Journée sans nuit, ou lendemain sans nuit : aucun temps d'éveil.

Siestes plus longues que le temps disponible : aucun temps d'éveil.

Moins de sept paires complètes, ou une série constante : aucun verdict de corrélation.

Poids nul ou négatif : aucune équivalence insolite.

Objectif nul ou négatif : l'avancement borné vaut 0, l'avancement non borné n'est pas rendu.

Cible au-dessus du poids de départ : l'avancement vaut 0, sauf si la cible est déjà tenue, auquel cas 100.

Palier jamais observé pour une distinction : découverte, enregistrée en silence, jamais une montée.

Bornes d'une perte tombant le même jour : la durée ne se dit pas.

## 7. États et transitions

Ce chapitre énumère ce qui, dans le produit, porte un état : ses valeurs possibles, sa valeur initiale, ce qui le fait changer et si le changement se défait. Un état y est toujours une propriété des données — une valeur enregistrée, ou une valeur dérivée par une règle — jamais une apparence.

### Ce qui porte un état

Les états se distinguent par ce qui les porte, par ce qui les fait changer et par ce qui les efface. Trois familles : les propriétés du profil, qui vivent dans la sauvegarde ; les mémoires de mécanisme, qui vivent à côté d'elle ; et les valeurs dérivées, qui ne vivent nulle part.

| État | Porté par | Nature | Durée de vie |
| --- | --- | --- | --- |
| Module de suivi (7) | Deux booléens du profil par module | Enregistré dans la sauvegarde | Jusqu'à effacement total |
| Traitement déclaré | `profile.glp1Brand` — un identifiant de catalogue | Enregistré dans la sauvegarde | Jusqu'à effacement total |
| Badge mystère restitué | `profile.mysteryBadgeHidden` | Enregistré dans la sauvegarde | Jusqu'à effacement total |
| Palier d'un badge (4) | Rien — recalculé à chaque lecture des journaux | Dérivé | Instantané |
| Palier connu d'un badge | `glp1_badge_tiers_connus` : identifiant → palier | Mémoire de mécanisme | Jusqu'à effacement total |
| Rang d'IMC déjà signalé | `glp1_notified_bmi_tier_index` : un entier écrit en chaîne | Mémoire de mécanisme | Jusqu'à effacement total |
| Paliers nutritifs déjà signalés | `glp1_paliers_nutritifs_fetes` : une date et une liste | Mémoire de mécanisme | Jusqu'au changement de journée |
| Assignation et compteurs des objets insolites | `glow_ludic_usage` : `counts` et `assignment` | Mémoire de mécanisme | Assignation jusqu'à la pesée suivante, compteurs jusqu'à effacement total |
| Acceptation de l'avertissement | `hasAcceptedMedicalDisclaimer_v1` : une chaîne nue | Mémoire de mécanisme | Jusqu'à effacement total |
| Ancienneté d'usage | `glp1_first_open_date` : une date | Mémoire de mécanisme, dérivée au besoin | Jusqu'à effacement total |
| Déverrouillage signalé | `glp1_dynamique_celebrated` : une chaîne nue | Mémoire de mécanisme | Jusqu'à effacement total |
| Session | Le service d'authentification | Enregistré hors du produit | Jusqu'à déconnexion |
| Session en lecture seule | Rien — décidé au chargement | Volatil | Une exécution |

Une **mémoire de mécanisme** est conservée à côté du document unique qui porte le profil et les journaux, sous une clé propre. Ces valeurs ne sont pas des données de la personne mais l'état d'un mécanisme ; elles ne partent ni dans une exportation ni dans un partage, et la migration de chargement ne les touche pas. Un seul geste les emporte toutes : la suppression du compte, qui efface l'intégralité du stockage local de l'appareil sans énumérer les clés.

Deux clés de même nature ne sont plus jamais écrites et ne subsistent que pour être effacées : `glp1_last_celebrated_weight` et `glp1_last_celebrated_weight_id`, qui retenaient la dernière pesée signalée.

Six booléens du profil portent chacun un état avec son propre défaut mais ne se règlent que depuis la surface d'administration, hors périmètre de ce document : `quickAddEnabled`, `insoliteLibraryEnabled`, `deleteAllButtonsEnabled`, `homeCornerButtonsEnabled`, `colorblindModeEnabled`, et `easyReadingMode`, qui ne commande plus rien et n'est conservé que pour les sauvegardes existantes et les versions gelées.

### Un module de suivi

Sept domaines sont modulaires : traitement, effets secondaires, alimentation, pas, activité physique, temps pour soi, sommeil. La pesée n'en est pas un — elle est toujours disponible.

| Module | Drapeau d'activation | Absent vaut | Drapeau de masquage | Absent vaut |
| --- | --- | --- | --- | --- |
| Traitement | `treatmentTrackingEnabled` | allumé | `treatmentModuleHidden` | non masqué |
| Effets secondaires | `sideEffectsTrackingEnabled` | allumé | `sideEffectsModuleHidden` | non masqué |
| Alimentation | `foodTrackingEnabled` | éteint | `foodModuleHidden` | non masqué |
| Pas | `stepsTrackingEnabled` | éteint | `stepsModuleHidden` | non masqué |
| Activité physique | `sportTrackingEnabled` | éteint | `sportModuleHidden` | non masqué |
| Temps pour soi | `meTimeTrackingEnabled` | éteint | `meTimeModuleHidden` | non masqué |
| Sommeil | `sleepTrackingEnabled` | éteint | `sleepModuleHidden` | non masqué |

Les deux drapeaux composent trois états mutuellement exclusifs : **allumé**, **éteint**, **éteint et masqué**. Le masquage ne mord jamais sur un module allumé.

```
allume(m)  = drapeau(m) == null ? (m ∈ {traitement, effets secondaires}) : Boolean(drapeau(m))
masque(m)  = !allume(m) && Boolean(drapeauMasquage(m))
```

Valeur initiale d'un profil neuf : traitement et effets secondaires allumés (drapeau non écrit) ; les cinq autres explicitement éteints ; aucun drapeau de masquage écrit.

| Transition | Précondition | Effet sur les données | Réversible |
| --- | --- | --- | --- |
| Basculer un module | aucune | Écrit `drapeau = !allume(m)`. Si le module était éteint, écrit dans la même opération `drapeauMasquage = false`. | oui |
| Masquer / démasquer | module éteint | Écrit `drapeauMasquage = !drapeauMasquage`. | oui |
| Allumage implicite | domaine ∈ {alimentation, pas, activité physique} et drapeau faux ou absent | Écrit `drapeau = true` à l'entrée dans le domaine par un chemin ordinaire. **Ne touche pas au drapeau de masquage.** | oui (par la bascule) |

L'allumage implicite ne concerne que ces trois modules ; il existe aussi un chemin d'entrée qui n'écrit rien, réservé à la consultation d'un domaine éteint. Le traitement, les effets secondaires, le temps pour soi et le sommeil ne s'allument jamais implicitement.

**Invariant.** L'état d'un module ne conditionne aucune donnée : éteindre n'efface rien, ne supprime aucune entrée déjà enregistrée et n'invalide aucun calcul. Les journaux d'un module éteint restent lus par tout ce qui les consulte — la déduction de l'ancienneté d'usage les parcourt tous, et le palier d'un badge continue de se calculer sur eux dès que sa catégorie redevient évaluable.

**Cas limites**

La bascule est le seul chemin qui efface le masquage : rallumer par elle un module éteint et masqué écrit les deux drapeaux ensemble.

L'allumage implicite, lui, laisse le drapeau de masquage tel quel : un module allumé par ce chemin garde un masquage enregistré, inerte tant qu'il est allumé, qui reprend effet dès l'extinction suivante.

Le masquage se lit sur l'état effectif du module, pas sur le drapeau nu : un traitement dont le drapeau d'activation n'a jamais été écrit est allumé, donc jamais masqué, quelle que soit la valeur de son drapeau de masquage.

Un identifiant de domaine sans drapeau associé (la pesée) est toujours allumé et jamais masqué.

> **Exemple.**
>
> Camille éteint le module Sommeil après trois semaines de saisie. Ses nuits enregistrées restent dans le journal, la déduction de son ancienneté d'usage continue de les voir, et rallumer le module les retrouve toutes.

### Le traitement déclaré

Le profil porte un **identifiant de traitement** dans `glp1Brand`, jamais un nom. L'absence de traitement est une valeur du catalogue (`aucun`), pas une valeur absente : il y a donc toujours une réponse.

| Donnée | Type | Valeur initiale |
| --- | --- | --- |
| `profile.glp1Brand` | identifiant du catalogue (14 valeurs, `aucun` compris) | `aucun` |
| `brand` d'une prise du journal des injections | identifiant, facultatif | écrit à l'enregistrement, jamais absent sur une prise saisie |

```
traitementDe(fiche) = catalogue[id] ?? catalogue['aucun']   // repli de LECTURE seul
traitementResolu(prise, profil) = prise.brand || profil.glp1Brand || 'aucun'
```

| Transition | Précondition | Effet | Réversible |
| --- | --- | --- | --- |
| Déclarer ou changer | pour un traitement portant l'exigence d'essai clinique — un seul dans le catalogue, le rétatrutide —, une attestation explicite de participation | Écrit l'identifiant dans le profil. Rien d'autre n'est touché. | oui, vers n'importe quel identifiant, `aucun` compris |
| Migrer | au chargement d'une sauvegarde | Convertit en identifiant toute valeur historique du profil et de chaque prise ; un profil sans valeur devient `aucun` ; une prise sans valeur reste sans valeur ; une valeur inconnue devient `autre-comprime` ou `autre-injection` selon son libellé, ou `aucun` si le libellé dit l'absence. | non |
| Enregistrer ou modifier une prise | aucune | Écrit dans la prise l'identifiant du profil *au moment de l'écriture*. | oui, en réécrivant la prise |

Redéclarer le traitement déjà déclaré ne demande aucune attestation, même pour un traitement qui l'exige : l'exigence porte sur le changement, pas sur la valeur. **L'attestation n'est pas un état** : elle n'est jamais enregistrée, ni dans le profil ni ailleurs, et repart de « non donnée » à chaque fois qu'un changement vers ce traitement est entamé. Quitter le rétatrutide puis y revenir la redemande.

**Ce que le changement fait aux dérivés.** Les prises déjà enregistrées gardent leur identifiant. La *série du traitement en cours* est le suffixe final du journal des prises, trié par date puis heure, dont l'identifiant résolu égale celui du profil : changer de traitement la vide, et elle repart de la première prise enregistrée sous le nouvel identifiant. Si la dernière prise du journal relève d'un autre traitement que celui du profil, la série est vide.

**Cas limites**

Modifier une prise ancienne après un changement de traitement lui donne le traitement *courant* : une prise d'Ozempic corrigée alors que le profil dit Mounjaro devient une prise de Mounjaro.

Une prise sans identifiant est réputée relever du traitement du profil ; sa lecture change donc quand le profil change.

Le repli sur `aucun` ne joue qu'à la lecture d'une fiche de catalogue. Un identifiant inconnu enregistré ne l'atteint pas : la migration de chargement, qui passe avant toute lecture, l'a déjà réécrit en `autre-injection` ou `autre-comprime`.

Revenir à un traitement déjà utilisé ne recolle pas les deux périodes : la série repart de la première prise du retour.

> **Exemple.**
>
> Camille déclare Ozempic en mai 2026, puis passe à Mounjaro le 12 août. Ses prises de mai à août gardent l'identifiant `ozempic` ; la série du traitement en cours ne compte plus que les prises postérieures au 12 août. Repasser à Ozempic le 1er septembre ne ressuscite pas la série de mai : elle recommence au 1er septembre.

### Le palier d'un badge

Quatre badges existent. Chacun a un **palier** pris dans une échelle ordonnée de cinq valeurs, et une **catégorie** dont dépend son évaluation.

```
paliers, du plus bas au plus haut : ['aucun', 'eveil', 'bronze', 'argent', 'or']
rang(p) = index de p dans cette liste   // 0 … 4
```

Le palier n'est jamais enregistré : il se recalcule à chaque lecture, à partir des journaux et de l'instant présent. Valeur initiale sur des journaux vides : `aucun`. Il monte et il redescend — une journée qui sort de la fenêtre de calcul fait baisser le palier sans autre geste.

| Badge | Catégorie évaluable si | Éveil | Bronze | Argent | Or |
| --- | --- | --- | --- | --- | --- |
| Kangourou Musclé (activité physique) | `sportTrackingEnabled !== false` | ≥ 1 séance survenue aujourd'hui ou hier | équivalent modéré ≥ 120 min sur 10 j | équivalent intensif ≥ 180 min sur 10 j | équivalent intensif ≥ 180 min sur 7 j |
| Lapin des Fibres (alimentation) | `foodTrackingEnabled === true` | ≥ 25 g de fibres aujourd'hui ou hier | 4 journées sur 7 | 5 journées sur 7 | 7 journées sur 7 |
| Requin protéiné (alimentation) | `foodTrackingEnabled === true` | cible protéines du badge atteinte aujourd'hui ou hier | 4 journées sur 7 | 5 journées sur 7 | 7 journées sur 7 |
| Hérisson Marcheur (pas) | `stepsTrackingEnabled !== false` | ≥ 8 000 pas aujourd'hui ou hier | 3 journées sur 7 | 4 journées sur 7 | 5 journées sur 7 |

```
fenetre(N)      = [aujourd'hui, … , aujourd'hui − (N−1) jours]   // dates locales
fenetreEveil    = fenetre(2)                                      // aujourd'hui et hier
equivIntensif   = duree × (intensive 1 | moderee 0,67 | douce 0,33)
equivModere     = duree × (intensive 1,5 | moderee 1 | douce 0,5)
cibleProteinesDuBadge = round(poidsActuel × 1,5) g                // le profil n'est PAS lu
palier          = premier seuil satisfait en descendant : or, argent, bronze, eveil, sinon aucun
```

**Deux cibles de protéines coexistent et ne sont pas la même.** Celle du profil, `dailyProteinGoal`, est réglable et vaut `round(poidsActuel × 1,5)` quand elle est absente ; c'est elle que lisent les totaux quotidiens. Celle du badge est toujours `round(poidsActuel × 1,5)` : le badge ne lit jamais `dailyProteinGoal`. Un profil qui abaisse sa cible à 100 g ne décroche pas le Requin protéiné plus facilement.

`poidsActuel` est la *dernière ligne* du journal des pesées — le dernier élément de la suite, non la pesée la plus récente par date. La cascade a deux termes seulement : à défaut de ligne, 70 kg. Le poids de départ n'est consulté que sur un journal vide, où il n'existe précisément pas. Le total d'une journée est la somme des entrées portant cette date. Seules les entrées **déjà survenues** comptent : date antérieure à aujourd'hui, ou date du jour avec une heure ≤ l'heure courante ; les pas, qui n'ont pas d'heure, ne sont écartés que s'ils sont datés dans le futur.

Un badge dont la catégorie n'est pas évaluable n'a pas de palier : il n'est pas calculé du tout, et son palier connu est conservé tel quel.

**Cas limites**

Les deux badges d'alimentation exigent le drapeau *strictement* vrai, tandis que les deux autres se contentent d'un drapeau *non faux* : un drapeau absent rendrait l'activité physique et les pas évaluables, l'alimentation non. Après chargement d'une sauvegarde, les cinq drapeaux de suivi sont toujours écrits, la différence ne se manifeste donc pas.

La condition d'évaluation lit le drapeau nu, non l'état effectif du module : le masquage n'entre pas dans le calcul.

Le palier éveil se calcule sur deux jours et les autres sur sept ou dix : un palier supérieur atteint l'emporte, l'éveil n'est donc pas un passage obligé.

Aucune fenêtre ne regarde plus loin que dix jours : un historique ancien ne maintient aucun palier.

> **Exemple.**
>
> Camille, 96 kg au départ et 88,4 kg à sa dernière pesée, a pour cible de badge round(88,4 × 1,5) = 133 g par jour, même si elle a réglé sa cible de profil ailleurs. Quatre journées à 140 g sur les sept derniers jours lui donnent le palier bronze du Requin protéiné ; une seule journée sortie de la fenêtre le ramène à éveil si l'une des deux dernières journées tient encore la cible, à `aucun` sinon.

### La mémoire des paliers

À côté des paliers calculés, le produit retient le **dernier palier observé** de chaque badge : une table identifiant de badge → palier, enregistrée hors de la sauvegarde. C'est elle, et non le palier lui-même, qui décide de ce qui se signale comme progression.

Valeur initiale : table absente, c'est-à-dire aucun badge observé. Une passe d'évaluation se déroule ainsi :

```
suivants = { …connus }                       // on PART du connu, on ne le reconstruit pas
pour chaque badge dont la catégorie est évaluable :
    p = palier(badge)
    suivants[badge] = p
    si connus[badge] est absent            → rien à signaler   (découverte)
    sinon si rang(p) > rang(connus[badge]) → à signaler        (progression)
    sinon                                  → rien à signaler   (stable ou baisse)
```

La passe n'est pas liée aux bornes de l'exécution : elle se rejoue à **chaque changement des données de la session**. Enregistrer un repas, corriger une pesée, basculer un module la déclenchent immédiatement — c'est ainsi qu'un palier décroché en cours d'exécution se signale sans attendre la suivante. Au premier passage d'une exécution, l'état connu vient du stockage ; ensuite, de la mémoire de la session.

| Situation | Palier connu après la passe | Signalement |
| --- | --- | --- |
| Badge jamais observé, quel que soit son palier | écrit | non |
| Palier observé qui monte | écrit | oui, une fois |
| Palier observé qui baisse | écrit | non |
| Catégorie non évaluable | inchangé, conservé | non |
| Catégorie rallumée au même palier | inchangé | non |
| Catégorie rallumée à un palier supérieur | écrit | oui, une fois |

Deux conséquences tiennent de ce seul critère, sans cas particulier. Une installation qui démarre sur un historique déjà fourni ne signale rien : les quatre badges sont des découvertes. Éteindre puis rallumer une catégorie ne rejoue pas un signalement déjà eu, y compris d'une exécution à l'autre, parce que le palier connu traverse l'extinction.

**Cas limites**

Une entrée de la table dont la valeur n'est pas un palier connu est ignorée à la lecture, badge par badge : le badge redevient « jamais observé » et sa prochaine évaluation est une découverte.

Une table absente et une table vide se comportent identiquement.

Un palier qui baisse puis remonte au même niveau se signale de nouveau : la remontée est une progression réelle.

La table ne se purge jamais : la passe part de la table connue et n'en retire aucune entrée. L'entrée d'un badge retiré du catalogue y resterait indéfiniment, sans jamais être relue.

### Les autres mémoires de mécanisme

Trois autres valeurs suivent exactement le même contrat que le palier connu : hors sauvegarde, écrites par un mécanisme, effacées par le seul effacement total, absentes des exportations.

| Mémoire | Valeurs | Valeur initiale | Ce qui l'écrit |
| --- | --- | --- | --- |
| Rang d'IMC déjà signalé | un entier de 0 à 5, écrit en chaîne ; le rang décroît quand l'IMC baisse | clé absente, lue comme 99 | Un franchissement de palier vers le bas : IMC ≥ 19, rang courant < rang de la pesée précédente et < rang déjà signalé. La lecture du rang précédent porte sur les deux pesées les plus récentes par date et heure, la valeur de départ tenant lieu de seconde s'il n'y en a qu'une. |
| Paliers nutritifs déjà signalés | `{ date, nutriments ⊆ {proteines, fibres} }` | clé absente | Le franchissement, dans la journée, de la recommandation de protéines ou de fibres — celle du profil, cette fois. Une date différente périme l'état entier : l'ensemble repart vide au changement de journée. Une recommandation nulle ou négative ne se franchit pas. |
| Objets insolites | `counts` : compteur par nom d'objet ; `assignment` : `{signature, totalKg, lastKg, total[], last[]}` | compteurs vides, aucune assignation | Chaque nouvelle pesée réassigne, même à poids inchangé : la signature est l'identifiant de la ligne de pesée la plus récente par date et heure. Une assignation compte pour 1 par objet, une seule fois, et les objets ne bougent plus jusqu'à la pesée suivante. Une assignation écrite sans `totalKg` ni `lastKg` est tenue pour périmée et recalculée une fois. |

> **Exemple.**
>
> Camille passe de 88,4 kg à 87,9 kg. Son IMC franchit 30 vers le bas : le rang 2 est signalé et enregistré. Redescendre encore dans le même palier ne signalera plus rien ; remonter au-dessus de 30 puis redescendre non plus, le rang 2 étant déjà signalé.

### L'acceptation de l'avertissement

Un drapeau unique, enregistré hors de la sauvegarde, dit si l'avertissement médical a été accepté. Deux valeurs seulement : accepté, non accepté.

| Valeur enregistrée | Signification |
| --- | --- |
| `"true"` | accepté |
| toute autre valeur, ou clé absente | non accepté |

Valeur initiale : non accepté. Tant qu'elle vaut cela, aucune autre capacité du produit n'est accessible : l'avertissement est la seule chose à laquelle on puisse répondre.

| Transition | Précondition | Effet | Réversible |
| --- | --- | --- | --- |
| Accepter | attestation explicite de lecture | Écrit le drapeau à `"true"`. | non |
| Consulter à nouveau | accepté | Aucun. La consultation ne réécrit rien et ne peut pas être refusée. | sans objet |
| Supprimer le compte | voir la session | Efface tout le stockage local, ce drapeau compris : l'acceptation redevient à donner. | non |

**Cas limites**

L'acceptation est propre à l'appareil : elle n'est pas attachée au compte et ne suit pas une connexion sur un autre appareil.

Le drapeau vaut une chaîne nue et non une valeur structurée : une réécriture au format JSON, qui ajouterait les guillemets à la chaîne, serait lue comme « non accepté ».

### La session

Le produit se verrouille derrière un compte lorsque, et seulement lorsque, l'identifiant d'accès de la configuration d'authentification est non vide. Cette configuration est une constante du source, non une valeur fournie à l'installation, et le test porte sur ce seul identifiant. **Telle qu'elle est livrée dans le dépôt, la valeur est renseignée : le verrou est actif.** Ce n'est pas un état modifiable en cours d'usage.

| Verrou | États possibles |
| --- | --- |
| inactif (identifiant d'accès vide) | un seul état : ouvert, sans compte. Aucune identité, aucune écriture distante. |
| actif (le cas du dépôt) | `restauration` → `déconnecté` \| `connecté {identifiant, e-mail?, nom?}` |

Valeur initiale, verrou actif : `restauration`. La session précédente est mémorisée par le service d'authentification et restaurée au démarrage ; la transition suivante est donc automatique et ne demande rien.

| Transition | Précondition | État atteint | Réversible |
| --- | --- | --- | --- |
| Restauration terminée | — | `connecté` ou `déconnecté` | sans objet |
| Se connecter | couple e-mail / mot de passe non vides, ou fournisseur externe | `connecté` | oui |
| Se déconnecter | `connecté` | `déconnecté` | oui |
| Supprimer le compte | `connecté`, et session récente | compte détruit, puis stockage local effacé, puis `déconnecté` | non |

Il n'existe pas de création de compte dans le produit : la connexion suppose un compte déjà existant. **[non implémenté]**

**Ce que l'identité commande.** Une seule chose : signer les écritures distantes. Un retour ou une réponse d'enquête n'est déposé à distance que si la configuration de base de données est renseignée *et* qu'un compte est connecté ; sinon l'enregistrement local a lieu seul, en silence. Aucune donnée de suivi ne passe par là.

**Ordre imposé de la suppression.** Le compte est détruit d'abord, les données ensuite. Deux refus sont distingués : aucune session courante, et session trop ancienne — ce dernier exige une reconnexion préalable. Tant que la destruction du compte n'a pas réussi, aucune donnée n'est touchée.

**Invariant.** Aucune donnée de suivi ne dépend de la session : profil, journaux, paliers connus, acceptation et ancienneté vivent sur l'appareil, non dans le compte. Se déconnecter et se reconnecter avec un autre compte, sur le même appareil, retrouve exactement les mêmes données.

**Cas limites**

Verrou inactif : la suppression du compte n'a pas de compte à détruire ; elle efface le stockage local et rien d'autre.

La session mémorisée vit dans le même stockage que les données : l'effacement total emporte aussi la session.

L'état `restauration` n'est jamais atteint deux fois dans une exécution.

### La session en lecture seule

Le chargement de la sauvegarde a trois issues, et la dernière change l'état de toute l'exécution.

| Issue du chargement | Données | Écriture |
| --- | --- | --- |
| Sauvegarde absente | profil d'usine, journaux vides, une pesée de départ semée à 95,0 kg datée de la veille | autorisée |
| Sauvegarde lisible | profil et journaux restaurés, migrations appliquées | autorisée |
| Sauvegarde illisible | **identiques à la première ligne** : le chemin d'échec retombe dans le même résultat, pesée de départ semée comprise | **interdite pour toute l'exécution** |

Seule l'écriture sépare les deux issues sans sauvegarde lisible. Valeur initiale : écriture autorisée. La transition vers la lecture seule est unique, automatique et sans retour possible avant une nouvelle exécution.

```
si l'analyse de la sauvegarde échoue :
    si la clé de secours « <clé>__secours » est ABSENTE (=== null) → y recopier la sauvegarde brute, telle quelle
    marquer la session en lecture seule
    plus aucune écriture du document de sauvegarde n'a lieu
```

La copie de secours ne s'écrit qu'une fois : un second échec ne recouvre pas le premier sauvetage, qui porte les vraies données. Rien n'est perdu, rien n'est écrasé ; le produit fonctionne sur des données neuves plutôt que d'effacer ce qu'il n'a pas su lire.

**Cas limites**

Le test porte sur l'absence de la clé, non sur sa vacuité : une clé de secours présente et contenant une chaîne vide bloque définitivement le sauvetage, et la sauvegarde illisible n'est alors recopiée nulle part.

La lecture seule ne concerne que le document de sauvegarde. Les mémoires de mécanisme — paliers connus, acceptation, date de première exécution, rang d'IMC, objets insolites — restent écrites.

Si le stockage lui-même est indisponible, toute écriture échoue en silence : aucun état ne se retient d'une exécution à l'autre.

### Les réécritures d'ensemble

Deux transitions ne portent sur aucun état en particulier : elles remplacent d'un coup le profil — donc les sept modules, le traitement déclaré et le badge mystère — et tous les journaux. Elles s'appliquent au seul document de sauvegarde ; aucune mémoire de mécanisme n'est touchée, et les paliers connus qui en découlent deviennent aussitôt incohérents avec les journaux, ce que la première passe d'évaluation corrige.

| Transition | Précondition | Effet | Réversible |
| --- | --- | --- | --- |
| Écrire un jeu de données fabriqué | la sauvegarde courante a pu être copiée sous une clé horodatée *et* la copie relue à l'identique | Remplace la sauvegarde entière. Un index des copies est tenu à jour. | oui, par une restauration |
| Restaurer une copie | la copie visée existe, *et* l'état courant a lui-même pu être copié et vérifié | Remplace la sauvegarde entière par la copie, puis relit pour vérifier. | oui, la copie de sûreté est en place |

**Invariant.** Si la mise à l'abri échoue — stockage plein, indisponible —, rien n'est écrit du tout. Une écriture est toujours relue avant d'être tenue pour faite, l'échec silencieux du stockage étant le mode de défaillance attendu.

### L'ancienneté d'usage

Une lecture agrégée sur les sept derniers jours est conditionnée à l'ancienneté : elle est **verrouillée** tant que sept jours entiers ne se sont pas écoulés depuis la date de première exécution, **déverrouillée** ensuite. Une seconde valeur retient si l'événement du déverrouillage a déjà été signalé.

```
premiereExecution = date enregistrée
                    ?? plus ancienne date de TOUS les journaux, si elle est ≤ aujourd'hui
                    ?? aujourd'hui
anciennete   = max(0, jours entiers entre premiereExecution et aujourd'hui)   // dates locales
deverrouille = anciennete ≥ 7
```

**Une installation neuve part déjà à 1.** La pesée de départ semée au premier chargement est datée de la veille, et c'est elle que la déduction retient comme origine : l'ancienneté vaut 1 dès la première exécution, et le seuil est atteint six jours après l'installation, non sept. Le troisième repli ne s'atteint que sur des journaux réellement vides — situation qu'une installation neuve ne produit pas.

La date retenue est écrite une fois pour toutes, et la déduction ne se refait plus *dès lors qu'elle a été écrite*. Une entrée datée dans le futur n'est pas retenue comme origine. Les journaux de tous les modules sont parcourus, éteints compris : une donnée est une preuve de présence.

| Transition | Déclencheur | Réversible |
| --- | --- | --- |
| Poser la date de première exécution | Une exécution qui atteint l'un des deux points du produit qui la posent, sans date déjà enregistrée. Ces deux points appartiennent à la version Mixte. | non |
| verrouillé → déverrouillé | écoulement du temps : le septième jour compté depuis l'origine retenue | non, en pratique |
| Marquer le déverrouillage signalé | L'acquittement du signalement par la personne — un geste, non une exécution. Voir le signalement sans l'acquitter laisse la clé absente, et il reparaît à l'exécution suivante. | non |

**Cas limites**

Vider tous les journaux ne reverrouille pas *si* la date a été enregistrée. Une exécution qui n'atteint aucun des deux points qui la posent n'écrit rien : la déduction se refait alors à chaque lecture, et vider les journaux y ramène l'origine à aujourd'hui.

Six jours et vingt-trois heures ne font pas sept jours : la comparaison porte sur des dates locales, pas sur des durées.

Une installation qui porte déjà des mois de données est déverrouillée dès la première exécution, par la déduction sur les journaux.

Le drapeau de signalement est une chaîne nue `"true"`, comme celui de l'avertissement : toute autre valeur vaut « non signalé ».

> **Exemple.**
>
> Camille installe l'application le 20 mai 2026 et y importe aussitôt une pesée du 3 mai. L'origine retenue est le 3 mai : la lecture agrégée est déverrouillée immédiatement. Sans cet import, l'origine aurait été le 19 mai — la veille semée — et le déverrouillage serait tombé le 26.

### Les états sans effet

Trois valeurs sont enregistrées dans le profil, modifiables, et ne commandent rien d'autre que la manière dont elles se redisent.

| État | Valeurs | Valeur initiale | Effet |
| --- | --- | --- | --- |
| Rappel de prise | actif / inactif, plus une périodicité hebdomadaire (jour, heure) ou libre (tous les N jours, date de départ, heure) | inactif ; jour = dimanche ; heure = 20:00 ; N = 7 | aucun : rien ne planifie ni ne déclenche de rappel **[non implémenté]** |
| Rappel de rendez-vous médical | actif / inactif, plus date, heure, praticien, délai ∈ {1 h, 2 h, 1 j, 2 j, 3 j, 7 j} | inactif ; heure = 10:00 ; délai = 1 j | aucun **[non implémenté]** |
| Badge mystère | restitué / non restitué | restitué (drapeau absent) | conditionne la seule reprise d'un badge non encore décroché **[arbitrage non validé]** |

### Ce que la V2 décide autrement

La V2 tranche à rebours sur quatre points ; ce qu'elle dit prévaut. **[V2]**

| Sujet | V1 | V2 |
| --- | --- | --- |
| Persistance | Tout état survit à la fin de l'exécution, dans le stockage de l'appareil. | Aucun état n'est enregistré : le stockage local n'est touché nulle part, et le parcours d'entrée se perd entièrement à la fin de l'exécution. Aucun des états persistés ci-dessus n'existe encore. |
| Absence de traitement | Une valeur du catalogue, `aucun`. | Trois réponses liées : un booléen « traitement commencé » (vrai par défaut), une forme (`injection` \| `comprime`) et une spécialité, les deux dernières nulles tant qu'elles ne sont pas données. Répondre « non » remet forme et spécialité à nul ; changer de forme remet la spécialité à nul. |
| Catalogue | 14 entrées, dont `aucun` ; une entrée exige une attestation d'essai clinique ; chaque entrée porte paliers de dose et paramètres cinétiques. | 13 entrées, aucune entrée d'absence, aucune attestation, aucune posologie ni cinétique : identifiant, nom et forme seulement. Chaque forme finit par « Autre ». |
| Suivi modulaire, badges, avertissement, compte | Sept modules, quatre badges, un avertissement à accepter, un verrou de session. | Aucun des quatre n'existe à ce jour. |

La V2 porte en revanche un état que la V1 n'a pas : la **progression dans le parcours d'entrée** — le couple (réponses, rang). La suite des étapes se recalcule à chaque réponse, et le rang est borné à chaque lecture sur la liste des étapes encore visibles : une réponse qui raccourcit le parcours ramène le rang sur la dernière étape au lieu de le laisser hors des bornes.

**Deux étapes bloquent l'avancée**, et non une seule. L'étape « quel traitement » bloque tant que la forme *ou* la spécialité est nulle. L'étape finale bloque si un mot de passe entamé fait moins de huit signes ; un mot de passe vide ne bloque pas. L'étape « avez-vous commencé un traitement » ne bloque jamais, « oui » y étant retenu d'avance ; toute autre étape se saute sans réponse. Un commentaire du code affirme encore qu'une seule étape bloque : il est périmé.

| Réponse | Valeur initiale |
| --- | --- |
| langue | `fr` |
| système d'unités | `metrique` — lié à la langue : choisir la langue réécrit le système, le dernier geste l'emportant |
| objectif | `perdre` (premier de `['perdre', 'stabiliser']`) |
| poids | `'95.0'` |
| poids cible | `'95.0'` — deux valeurs distinctes, jamais liées l'une à l'autre |
| traitement commencé | `true` |
| forme, spécialité | `null`, `null` |
| année de naissance | `1980` |
| taille | `165` cm — toujours en centimètres, quelle que soit l'unité de saisie |
| prénom, e-mail, mot de passe | vides |
| rang | `0` |

> **Exemple.**
>
> Camille, née en 1978 et haute de 168 cm, doit corriger les deux valeurs par défaut ; son poids de 96 kg remplace le 95,0 proposé, et son poids cible reste à 95,0 tant qu'elle ne le change pas — les deux ne se suivent jamais.

## 8. Persistance, effacement, portabilité

Tout ce que le produit retient tient sur l'appareil, dans un magasin de paires clé-valeur, et n'en sort que par un geste explicite ou par une recherche de code-barres. Ce chapitre dit ce qui est conservé, sous quelle forme, ce qui arrive quand la lecture ou l'écriture échoue, ce que l'effacement emporte et dans quel ordre, et ce qui franchit ou ne franchit jamais la limite de l'appareil.

### Le document unique

Le profil et les journaux forment un seul document, sérialisé en JSON, conservé sous une seule clé : `glp1_app_companion_data`. Il n'a ni numéro de schéma, ni horodatage, ni signature : les conversions de chargement se reconnaissent à la forme des données, pas à une version déclarée. Il est conservé en clair.

| Propriété | Type | Cardinalité | Contenu |
| --- | --- | --- | --- |
| `profile` | objet | 1, obligatoire | identité (prénom, genre, âge en années, taille en centimètres), silhouette, poids cible, avatar, rappels, drapeaux des sept suivis activables, traitement en cours (identifiant du catalogue), date d'échéance, objectifs quotidiens (calories, protéines, fibres) — et onze drapeaux qui ne portent pas sur les données : `deleteAllButtonsEnabled` conditionne l'accès au vidage d'un journal, les dix autres (`homeCornerButtonsEnabled`, `colorblindModeEnabled`, `mysteryBadgeHidden`, sept `*ModuleHidden`) ne règlent que ce qui est montré du carnet |
| `weightHistory` | liste | 0..n, obligatoire | pesées ; chacune porte le drapeau de pesée de départ, dont l'unicité n'est pas structurellement imposée (voir plus bas) |
| `dailyLogs` | liste | 0..n, obligatoire | journal quotidien hérité |
| `injectionHistory` | liste | 0..n, obligatoire | prises : dose, traitement, zone |
| `savedMeals` | liste | 0..n, facultative | repas et en-cas : type, libellé du type, composition, valeurs nutritionnelles, deux niveaux de faim |
| `sideEffectHistory` | liste | 0..n, facultative | effets ressentis : type, intensité 1–5, note libre |
| `stepLogs` | liste | 0..n, facultative | pas comptés par jour |
| `sportLogs` | liste | 0..n, facultative | séances : sport (son nom, qui lui sert de clé), intensité parmi trois, durée en minutes, distance facultative **en mètres**, note libre. **Aucune calorie n'est conservée** : la dépense se recalcule à chaque lecture depuis le MET du catalogue, retrouvé par le nom du sport |
| `meTimeLogs` | liste | 0..n, facultative | moments pour soi : activité (son nom), durée en minutes, note libre |
| `sleepLogs` | liste | 0..n, facultative | nuits et siestes |

« Facultative » ne vaut qu'une fois. Sur une installation neuve, sept propriétés seulement sont écrites — ni `sportLogs`, ni `meTimeLogs`, ni `sleepLogs`. Dès le premier chargement réussi d'un document existant, les neuf journaux sont matérialisés en listes vides par la conversion qui retire les lignes de démonstration, puis réécrits ainsi : l'absence ne survit pas à une ouverture. Toute lecture retombe de toute façon sur une liste vide.

Rien de dérivable n'y est conservé, à deux exceptions près, toutes deux dans le repas : ses valeurs nutritionnelles (calories, protéines, glucides, lipides, fibres), recalculées depuis sa composition à chaque écriture, et le **libellé de son type** à côté de son type — un nom déduit d'un identifiant, écrit à chaque enregistrement par la fonction pure qui le calcule. Cette seconde exception contredit deux règles à la fois : ne rien conserver de dérivable, et référencer par identifiant plutôt que par nom. **[arbitrage non validé]**

Ce document ne contient pas : la base des aliments et recettes personnalisés, les repas mis de côté, les compteurs de sélection d'aliments, les listes de sports, d'effets et de moments suivis, les paliers déjà franchis, les compteurs d'objets ludiques, les retours et les réponses au questionnaire, l'acceptation du cadre médical, ni les choix de présentation indépendants du compte. Chacun de ces ensembles a sa propre clé. En revanche il porte, dans le profil, les onze drapeaux ci-dessus : le partage est explicite dans le code — ce qui règle l'affichage *des données* suit le profil, ce qui relève de la présentation seule reste sur l'appareil.

### Ce qui vit hors du document

| Clé | Voie | Contenu |
| --- | --- | --- |
| `glp1_user_custom_foods` | JSON, liste | aliments et recettes créés ; seul ensemble portant un lien référentiel (une recette vers ses ingrédients) |
| `glp1_favorite_meals` | JSON, liste | compositions mises de côté pour être rejouées |
| `glp1_food_selection_counts` | JSON, dictionnaire | nombre de fois qu'un aliment a été retenu |
| `glp1_active_sports`, `glp1_active_side_effects`, `glp1_active_me_time` | JSON, listes de chaînes | ce qui est suivi dans chacun des trois catalogues |
| `glp1_badge_tiers_connus` | JSON, dictionnaire | dernier palier observé par distinction, pour ne fêter qu'une fois |
| `glp1_paliers_nutritifs_fetes` | JSON | paliers nutritionnels déjà salués |
| `glow_ludic_usage` | JSON, objet | compteurs par objet et assignation courante (signature de la pesée, deux pertes en kilos, deux décompositions) |
| `glow_onboarding_sim_mixte` | JSON, objet | **les réponses du questionnaire d'accueil** — prénom, genre, poids de départ et sa date, poids actuel, cible, taille, âge, activité, séances, cahier alimentaire, suivis souhaités —, l'étape en cours et l'achèvement. Données personnelles conservées hors du document unique et **jamais versées au profil** : rien de ce qui y est répondu n'atteint le carnet |
| `glp1_first_open_date` | chaîne `AAAA-MM-JJ` | premier jour d'usage, posé une fois |
| `glp1_dynamique_celebrated` | chaîne `'true'` | déblocage déjà salué |
| `glp1_notified_bmi_tier_index` | chaîne d'un entier | dernier palier d'IMC signalé ; absent vaut 99 |
| `hasAcceptedMedicalDisclaimer_v1` | chaîne `'true'` | acceptation du cadre médical |
| `glp1_meal_edit_notice_dismissed` | chaîne `'true'` | la mise en garde sur la modification d'un repas a été refusée pour de bon |
| `steps_custom_start_date` | **JSON**, chaîne | origine choisie pour le cumul des pas ; passe par la voie JSON, le magasin contient donc les guillemets |
| `glow_report_include_v2` | JSON, objet | les huit ensembles de données retenus pour le prochain bilan ; paramètre de ce qui sortira de l'appareil. Le suffixe de version est délibéré : la clé antérieure n'est ni lue ni effacée |
| `glp1_user_feedbacks` | JSON, liste | retours écrits : type, ressenti, catégorie, message, instant d'envoi, consentement de recontact |
| `glp1_user_survey_v2` | JSON, objet | sept notes 0–5, suggestion libre, journal des envois (instants en millisecondes, deux jours gardés) |
| `glp1_user_survey` | JSON, objet | format antérieur du questionnaire : lu en repli, jamais réécrit |
| `glp1_send_cap_alert` | chaîne `identifiant:AAAA-MM-JJ` | jour où l'alerte de plafond d'envoi est déjà partie |
| clés de présentation : `glp1_period_…` (dont `glp1_period_blood_level_by_brand`, une entrée par molécule), `glp1_view_…`, `glp1_*_history_view`, une douzaine de clés `glow_…` | JSON ou chaîne nue | périodes retenues, modes de lecture, parure, disposition, bascules de tendance. Aucune n'a d'effet sur les données. Hors périmètre de ce document, citées ici parce que l'effacement total les emporte |
| `glp1_meals_cleared`, `glp1_last_celebrated_weight`, `glp1_last_celebrated_weight_id` | chaînes nues | héritées : plus jamais écrites, jamais lues, conservées seulement pour être emportées par l'effacement total |
| `<clé>__secours`, `<clé>__secours-<horodatage>`, `<clé>__secours-index` | chaînes brutes et JSON | copies de secours du document unique et leur inventaire |

Deux conventions d'accès coexistent et ne sont pas interchangeables : une valeur écrite en JSON se relit en JSON, une chaîne nue se relit telle quelle. Faire passer un drapeau `'true'` par la voie JSON le réécrirait `"true"` et rendrait illisible ce qui est déjà conservé sur les appareils. Le choix de la voie est fixé par clé, et ne se change pas.

Un troisième magasin existe, à durée de session : trois clés d'outillage réservé (`glow_ciqual_admin_summary`, `…_return_tab`, `…_page_state`) y traversent un redémarrage. Elles n'appartiennent pas au carnet, et l'effacement total ne les touche pas.

### Quand l'écriture a lieu

Le document unique est réécrit intégralement à chaque changement de son contenu, y compris au tout premier instant qui suit un chargement réussi. Il n'y a ni écriture différée, ni écriture partielle, ni journal d'opérations : la dernière écriture gagne, et une écriture porte tout le document. Les ensembles hors du document suivent la même règle, chacun pour sa clé.

L'écriture peut échouer sans que rien ne le signale : magasin indisponible, place épuisée. La couche d'accès avale l'erreur — une lecture ratée rend « absent », une écriture ratée ne rend rien. Trois capacités seulement corrigent ce silence, en relisant ce qu'elles viennent d'écrire et en comparant caractère pour caractère : la mise à l'abri, l'écriture sous protection, la remise d'une copie. Toutes trois sont réservées à un outillage hors périmètre ; les écritures ordinaires ne relisent jamais.

Un geste qui touche à la fois le document et une clé secondaire les écrit séparément : il n'y a aucune atomicité entre clés, et un demi-état est possible — le document réécrit sans la clé secondaire, ou l'inverse. Rien ne le détecte, rien ne le rattrape. **[arbitrage non validé]**

**Cas limites**

- Magasin indisponible : chaque lecture rend « absent », donc les valeurs par défaut ; le produit fonctionne, sans rien conserver.
- Une valeur illisible sous une clé secondaire vaut valeur par défaut, sans trace ni copie de secours ; seul le document unique bénéficie du garde-fou.
- Deux exécutions simultanées du produit sur le même appareil écrivent la même clé sans arbitrage : la dernière écrase.
- La comparaison de relecture porte sur des caractères, pas sur des octets ; la taille inscrite à l'inventaire des copies est elle aussi un nombre de caractères.

### Le chargement et ses conversions

Le document est lu comme une chaîne, puis analysé, afin de distinguer un document absent d'un document illisible — les deux mènent à des états vides, mais pas aux mêmes conséquences. L'analyse réussie, une chaîne de conversions s'applique, dans cet ordre, toutes idempotentes : les rejouer sur un document déjà converti ne le change plus.

| # | Conversion | Effet |
| --- | --- | --- |
| 1 | Retrait des ensembles supprimés | le suivi hydrique et les objectifs de poids à paliers quittent le document, ainsi que trois propriétés du profil qui leur appartenaient : deux drapeaux (`hydrationTrackingEnabled`, `weightGoalsEnabled`) et une quantité (`dailyWaterGoalMl`, un objectif en millilitres) |
| 2 | Complétion du profil | le profil lu recouvre le profil d'usine, propriété par propriété ; l'avatar est fusionné de la même façon ; `stepLogs` est matérialisé en liste vide s'il manque |
| 3 | Écart des repas d'avant la bascule | un repas est retenu si et seulement s'il porte une liste de composants ; le critère est l'absence de la liste, jamais une liste vide |
| 4 | Retrait des lignes de démonstration | neuf journaux traversés et tous reconstruits, donc matérialisés ; une ligne part si son identifiant commence par l'un des cinq préfixes de démonstration |
| 5 | Passage des traitements aux identifiants | le profil et chaque prise portaient un libellé, ils portent un identifiant du catalogue. Un libellé connu se convertit ; un libellé qui évoque l'absence de traitement donne `aucun` ; **un libellé inconnu rejoint `autre-comprime` ou `autre-injection`** selon ce que son nom laisse deviner, et le nom saisi est perdu. Seule une valeur absente reste absente : au profil elle devient `aucun`, à une prise elle signifie « celui du profil » |
| 6 | Purge des lignes marquées supprimées | sept journaux traversés ; les lignes marquées quittent le document et la marque est retirée des autres. Irréversible : les lignes marquées étaient déjà inaccessibles |
| 7 | Fusion des deux textes libres d'un effet | l'ancien texte se replie dans la note ; la note l'emporte quand les deux existent ; un texte vide vaut absence de note |
| 8 | Fusion de deux noms de sport | deux libellés désignant le même sport n'en font plus qu'un ; sans quoi les séances retomberaient sur le repli du catalogue (4,5 MET) et leur dépense, recalculée à chaque lecture, changerait après coup |
| 9 | Complétion des deux niveaux de faim d'un repas | une ligne qui porte déjà ses deux valeurs n'est jamais retouchée ; sinon les deux se déduisent du moment de la journée, de la taille du repas et de l'identifiant de la ligne — donc stables d'un chargement à l'autre |
| 10 | Assurance de la pesée de départ | le drapeau est posé sur chaque pesée ; s'il s'en trouve au moins une de marquée, la conversion s'arrête là. Sinon, et si l'ancien profil déclarait un poids de départ, une pesée est créée à 08:00, avec ce poids et **les mensurations de départ de l'ancien profil**, à la date déclarée, ou à défaut la veille de la plus ancienne pesée — et **hier** si l'historique est vide |

**L'unicité de la pesée de départ n'est pas tenue.** Le drapeau la porte, aucun code ne l'impose : la conversion s'arrête dès qu'une ligne est marquée, rien ne dédoublonne, et un document peut en porter zéro ou plusieurs. La lecture prend la première marquée dans l'ordre de la liste. **[arbitrage non validé]**

Document absent : le produit part du **profil d'usine** et d'une seule pesée, marquée départ, à 95,0 kg, datée de la veille à 08:00 ; les autres journaux sont vides. Le profil d'usine n'est pas un profil vide mais une personne fictive complète — un prénom, femme, 42 ans, 168 cm, cible 72,0 kg, silhouette en sablier, un avatar entier (teint, yeux verts, cheveux longs châtains), un rappel hebdomadaire le dimanche à 20:00, une échéance au 15 novembre 2026, aucun traitement, tous les suivis facultatifs éteints. La pesée semée existe parce que la perte totale, les distinctions et le bilan n'auraient sinon aucune référence.

> **Exemple.**
>
> Le document de Camille a été écrit avant l'arrivée des identifiants de traitement : son profil porte le libellé « Ozempic » et douze prises aussi. Au premier chargement, tous deviennent l'identifiant `ozempic`, et le document réécrit ne contient plus un seul libellé. Le chargement suivant traverse la même conversion sans rien changer. Si son profil avait porté un nom saisi à la main, absent du catalogue, il serait devenu `autre-injection` et le nom serait perdu.

### Quand le document ne se lit pas

Une lecture ratée ne doit jamais détruire ce qu'elle n'a pas su lire. Trois effets, ensemble :

```
lecture échouée →
  1. copie brute sous « <clé>__secours », UNE seule fois (si la clé est libre)
  2. aucune écriture de toute la session : mayPersist(chargementRaté) = faux
  3. l'état est déclaré : rien n'est perdu, rien ne sera enregistré
```

Le produit fonctionne alors sur des données vides — profil d'usine et pesée de départ semée — sans jamais les conserver.

**Rien ne répare cet état.** Le document illisible n'est ni retiré, ni renommé, ni remplacé, ni marqué : chaque démarrage relit la même chaîne et échoue de la même façon. La seule issue est une intervention sur le magasin depuis l'extérieur du produit — aucune capacité offerte ne retire la clé ni ne remet la copie en place. Le message donné à la personne annonce pourtant un retour à la normale au prochain démarrage : il est faux. **[arbitrage non validé]**

**Cas limites**

- Un second échec ne recouvre pas le premier sauvetage : la clé de secours ne s'écrit que si elle est libre, et c'est la première copie qui porte les vraies données.
- La copie de secours ne peut être remise en place par aucune capacité offerte à la personne : elle existe pour être récupérable, pas pour être restaurée depuis le produit. **[non implémenté]**
- Si l'écriture de la copie échoue elle aussi, la session reste en lecture seule : le refus d'écrire ne dépend pas de la réussite du sauvetage.

> **Exemple.**
>
> Le document de Camille est tronqué. Au démarrage suivant, elle retrouve le profil d'usine — un autre prénom, 42 ans, cible 72 kg — et une pesée de départ à 95,0 kg datée de la veille, un chiffre qui ressemble à ses 96 kg de mai 2026 sans en être un. Ses données réelles sont intactes sous `glp1_app_companion_data__secours`, rien de ce qu'elle enregistrerait ne serait conservé, et le démarrage suivant lui rendra exactement le même état.

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
- Ces deux capacités n'ont d'appelant que dans un outillage réservé à la fabrication de données, hors périmètre ; le modèle, lui, les porte. La copie du sauvetage de lecture, elle, n'a aucun appelant de remise.

> **Exemple.**
>
> Le 18 août 2026 à 14 h 32 min 05 s, l'état de Camille est mis à l'abri sous `glp1_app_companion_data__secours-2026-08-18-143205`, et l'inventaire retient le motif et la taille de la copie.

### Quand la place manque

Le magasin a une capacité bornée — de l'ordre de cinq mégaoctets sur le socle actuel — et rien ne prévient de son approche. La conséquence est une écriture qui échoue en silence, indistinguable d'une écriture réussie pour qui ne relit pas.

Le produit ne mesure jamais la place occupée : aucun seuil, aucune alerte anticipée, aucune purge, aucune borne au nombre de copies de secours. La seule taille qu'il connaisse est celle qu'il inscrit à l'inventaire au moment d'une copie, en caractères. La seule parade est la relecture : une capacité qui remplace le document ne se déclare réussie qu'après avoir relu et comparé ; à défaut, elle refuse et l'état antérieur est intact.

Le refus demande de supprimer d'anciennes copies de secours. **Aucune capacité ne le permet.** La seule suppression de clé qu'offre le produit est celle des repas mis de côté ; nulle part une clé `__secours-…` n'est retirée, ni son entrée d'inventaire. Le geste demandé n'existe que hors du produit. **[non implémenté]**

**Cas limites**

- Les écritures ordinaires du document unique ne relisent pas : une saisie perdue faute de place ne se signale pas. **[arbitrage non validé]**
- Une copie de secours qui ne tient pas en place fait échouer le geste qu'elle protégeait, jamais l'inverse.
- Chaque mise à l'abri double au moins la place occupée par le document le temps de la copie ; la saturation se rapproche donc plus vite qu'on ne l'écrit.

### Effacer

Supprimer supprime : aucune ligne n'est marquée, aucune n'est conservée hors de vue. Une suppression retire la ligne de sa liste par identifiant, et le document réécrit ne la contient plus.

| Geste | Portée | Ce qui survit |
| --- | --- | --- |
| Supprimer une ligne | un journal | tout le reste ; rien n'est récupérable |
| Vider le journal des pesées | toutes les pesées | **la pesée de départ**, épargnée : elle est la référence de la perte totale, des distinctions et du bilan |
| Vider un autre journal | prises, effets, pas, séances, moments, sommeil, repas | rien de ce journal ; la liste devient vide |
| Retirer les repas mis de côté | la clé entière | — |
| Supprimer un aliment | la base personnalisée | refusé si une recette l'utilise comme ingrédient ; le refus nomme les recettes concernées |
| Supprimer un retour | l'inventaire local des retours | l'envoi distant déjà parti, qui n'est pas repris |
| Tout effacer | le magasin persistant de l'origine, en une fois | ce qui vit ailleurs : magasin de session, base indexée, témoins de connexion |

**L'ordre de l'effacement total est fixe, et il est le sujet.**

```
1. si un compte distant est configuré → le supprimer
     échec → RIEN n'est effacé, l'état antérieur est intact, la cause est dite
2. effacer le magasin persistant local en une fois, toutes clés confondues
3. redémarrer le produit à zéro
```

Le compte d'abord : le service distant peut refuser (session trop ancienne, réseau coupé), et effacer avant de savoir laisserait une personne sans données mais avec un compte — un demi-état qu'aucun message ne rattrape. Sans compte distant configuré, l'étape 1 n'existe pas et le reste est identique.

L'effacement est total et non sélectif, délibérément : les clés naissent dans une vingtaine d'endroits, et une liste écrite à la main vieillirait mal — la première clé ajoutée ailleurs survivrait à l'effacement sans que rien ne le signale. Il emporte donc aussi les copies de secours, l'acceptation du cadre médical, les réponses du questionnaire d'accueil, les choix de présentation et les clés héritées.

**Sa portée s'arrête là.** Le geste vide le magasin persistant d'une seule origine. Il ne touche ni le magasin de session, ni la base indexée, ni les témoins de connexion. Rien dans le code ne fixe où le service d'authentification range sa session mémorisée : aucune persistance n'est choisie, et le socle distant en décide seul — la version employée la range hors du magasin effacé. L'affirmation qu'une session mémorisée part avec le reste ne repose que sur un commentaire, pas sur du code. **[arbitrage non validé]**

Ce qui est déjà parti ne part pas : les retours, les réponses au questionnaire, les fiches d'échec de bilan et les courriers déposés dans la file d'envoi restent dans la base distante, rangés sous l'identifiant du compte. La suppression du compte ne supprime que le compte d'authentification. Aucune capacité n'efface ces documents. **[non implémenté]**

**Cas limites**

- Session trop ancienne : la suppression du compte est refusée ; seule une reconnexion débloque le geste, et rien n'a été effacé.
- Aucune session ouverte alors qu'un compte est configuré : refus, rien n'est effacé.
- Le redémarrage est le seul moyen sûr de ne rien laisser en mémoire vive d'un compte qui n'existe plus.
- Les copies de secours partent avec le reste : après un effacement total, aucun sauvetage n'existe plus dans le magasin persistant.

> **Exemple.**
>
> Camille efface tout. Son compte est supprimé, puis les 96 kg de mai, les prises d'Ozempic, les repas, les effets, l'année 1978 et les 168 cm quittent le magasin persistant en une fois, copies de secours comprises. Au redémarrage, le produit ne la connaît plus — mais il ne présente pas une page blanche : il repart du profil d'usine, une autre personne, avec sa pesée de départ à 95,0 kg. Ses trois retours écrits, eux, sont toujours dans la base distante.

### Ce qui sort de l'appareil

Aucun geste ne synchronise : il n'existe aucune remontée du carnet, aucun rétablissement depuis un serveur, aucun partage entre appareils. Une seule sortie n'est pas déclenchée pour elle-même : la recherche d'un code-barres.

| Sortie | Contenu | Destination |
| --- | --- | --- |
| Bilan de suivi | document nommé `Bilan_GLP1_<début>_<fin>.pdf` : identité (prénom ou « Patiente non nommée »), genre, taille, IMC, cible, reste à parcourir, traitement, puis les ensembles retenus parmi huit (pesées, repas, effets, pas, séances, sommeil, moments pour soi, équivalences ludiques), bornés à la période retenue | l'appareil lui-même : le document est produit localement et enregistré, il n'est envoyé nulle part |
| Image de progression | une image et le texte qui l'accompagne, portant la valeur mise en avant (une perte en kilos, par exemple), plus l'adresse du produit | enregistrée sur l'appareil, ou remise au partage du système, ou déposée sur un service tiers dont l'adresse est ouverte avec le texte |
| Texte seul | le même texte | presse-papiers de l'appareil |
| **Recherche d'un code-barres** | le code scanné ou saisi, et rien d'autre ; en-tête d'agent `MealTrackerApp - Web - Version 1.0` | `https://world.openfoodfacts.org/api/v0/product/<code>.json`, délai armé à 10 000 ms, corps compris. Interrogé **en dernier recours seulement** : si le code est porté par un aliment créé ou par la base embarquée, aucune requête ne part. Code inconnu du service : rien n'est prérempli. Échec : deux causes distinguées, service injoignable ou réponse mauvaise, et rien n'est enregistré ni signalé au service |
| Réponse au questionnaire | sept notes 0–5, suggestion libre, nombre de reprises, instants d'envoi ; auteur (identifiant, adresse, nom) ; contexte technique | `surveys/<identifiant du compte>` : un document par compte, fusionné à chaque envoi |
| Retour écrit | type, ressenti, catégorie, message, consentement de recontact ; auteur ; contexte technique | `feedbacks/<identifiant>/messages` : un document par message |
| Fiche d'un bilan qui a échoué | nature et pile de l'erreur, étape, bornes de la période, ensembles demandés et ensembles effectivement retenus, **comptes** d'entrées, options du tirage, durée écoulée | `reportErrors/<identifiant>/failures` : un document par échec |
| Courrier d'accompagnement | reprise du contenu ci-dessus, mis en forme, échappé ; l'adresse de l'auteur en réponse | la collection `mail`, file lue par un service tiers d'expédition, vers une adresse fixe |
| Connexion | adresse et mot de passe, ou passage par un fournisseur tiers | le service d'authentification ; la session revient et est mémorisée sur l'appareil, à un emplacement que le produit ne choisit pas |

Le contexte technique joint aux trois envois ne contient que : version, provenance, choix de présentation, dimensions, langues déclarées par le socle, instant en **quatre** formes (millisecondes, forme universelle, forme locale lisible, jour local), fuseau et décalage en minutes, identification du socle, mode de compilation. Aucune donnée de santé.

Les envois distants sont un ajout, jamais un obstacle : l'enregistrement local a lieu le premier, et rien de ce qui suit ne peut l'empêcher ni le défaire. Aucun envoi ne peut faire échouer un geste, aucun ne se signale en cas d'échec. Sans configuration du service distant, rien n'est même tenté. La recherche de code-barres échappe à cette règle : c'est elle qui conditionne le préremplissage, et son échec se dit.

**Cas limites**

- Plafond de dix envois par jour local ; au-delà, refus, et une alerte part une seule fois par compte et par jour. Un envoi supprimé le jour même rend sa place.
- Au-delà de dix reprises du questionnaire, une alerte part au franchissement, une seule fois.
- Un retour supprimé localement ne retire pas le document déjà envoyé.
- Le partage vers un service tiers emporte le texte et l'adresse du produit, jamais un fichier.
- Une fiche du service alimentaire n'est jamais crue sur parole : chaque valeur est vérifiée, convertie, bornée, et ce qui ne tient pas est écarté plutôt que rabattu sur une valeur plausible.

### Ce qui n'en sort jamais

Poids et mensurations, prises et doses, repas et leur composition, effets ressentis et leurs notes, pas, séances, sommeil, moments pour soi, distinctions, avatar, identité : rien de tout cela ne quitte l'appareil, sinon dans le bilan et l'image de progression, que la personne produit et destine elle-même.

La seule donnée qui parte sans geste dédié est un code-barres, et il ne dit rien de la personne : ni ce qu'elle en fait, ni la quantité, ni l'heure, ni si l'aliment finit dans un repas. Il dit qu'un produit a été scanné, à cet instant, depuis cette adresse.

La fiche d'un bilan qui a échoué ne connaît du carnet que sa taille : des comptes et deux bornes de période, jamais une valeur, jamais une date d'entrée de journal. La seule chose que la taille d'un carnet dit de sa propriétaire, c'est depuis combien de temps elle s'en sert.

### Les contraintes du portage

Le magasin n'est connu que d'une couche unique, qui expose six verbes : lire en JSON, écrire en JSON, lire une chaîne nue, écrire une chaîne nue, retirer une clé, tout effacer. Lire et écrire sont deux gestes chacun, et le choix de la voie est fixé par clé. Aucune autre partie du produit ne sait comment ni où c'est conservé, ce qui fait du remplacement du magasin un changement d'un seul endroit. La même clôture vaut pour l'authentification, pour la base distante, pour le presse-papiers, pour le partage, pour l'enregistrement d'un fichier et pour la génération d'identifiants. Elle souffre une exception, dans un outillage réservé hors périmètre, qui s'adresse directement au magasin de session.

Les identifiants sont des UUID version 7 : 48 bits d'horodatage en tête, 74 bits d'aléatoire, ordonnables lexicographiquement à la milliseconde. Le motif antérieur, fondé sur l'instant seul, produisait deux fois la même valeur pour deux créations dans la même milliseconde. Seuls les repas emploient le nouveau motif ; pesées, prises, effets, pas, séances, moments et sommeil emploient encore l'ancien. **[arbitrage non validé]**

**[V2]** Ce que la V2 a arrêté et qui prévaut :

- Rien n'est encore conservé : aucune écriture n'existe, aucune couche de magasin n'existe, un redémarrage perd tout. Ce chapitre décrit donc l'état de la V1, sauf mention contraire.
- Le stockage est toujours métrique — kilogrammes, centimètres, grammes, millilitres, mètres — et ne porte aucune étiquette d'unité ; la conversion se fait aux deux bouts. Le séparateur décimal conservé est le point.
- La taille est conservée en centimètres ; l'année de naissance remplace l'âge, qui se périme.
- Les dates conservées sont locales (`AAAA-MM-JJ`, `HH:MM`) ; une conversion universelle recule d'un jour en soirée.
- Le format déjà enregistré ne se change pas sans migration.
- Rien de dérivable n'est conservé ; on référence par identifiant, jamais par nom ; supprimer supprime ; une valeur absente se tait plutôt que de valoir zéro.
- Aucune synchronisation multi-appareils : le carnet reste lié à un appareil.

**[V2]** Exigences posées pour la conversion vers le socle natif, qui n'aura lieu qu'une fois : surface d'attaque minimale ; **données de santé chiffrées** ; secrets hors du paquet livré ; aucune permission native non justifiée ; dépendances auditées ; liens profonds validés ; revue de sécurité avant toute distribution. Aucune n'est tenue aujourd'hui, et aucune n'est spécifiée : le document est conservé en clair ; la configuration du service distant vit dans le code livré — elle n'est pas un secret, la protection tenant aux règles du service et à la liste des comptes autorisés, mais rien ne dit ce qui *est* un secret aujourd'hui ni ce qui devra sortir du paquet demain ; et les trois permissions qu'appelleront les capacités promises dans le même paragraphe — appareil photo pour le scan réel, notifications du téléphone, données de mouvement pour le podomètre réel — ne sont ni nommées ni justifiées une à une. **[non implémenté]**

**Cas limites**

- Le chiffrement au repos changera la forme de ce qui est conservé : il appelle une migration, donc une conversion de plus dans la chaîne de chargement. Rien ne dit encore ce qui est chiffré (le seul document, toutes les clés, les copies de secours), où vit la clé, si elle survit à une réinstallation, ni ce qu'il advient des copies déjà posées en clair sur les appareils.
- Le magasin natif n'offre pas les mêmes garanties de capacité : la relecture de vérification reste la seule parade portable.
- « Tout effacer » ne recouvrira pas la même chose sur le socle natif : la portée devra être redite, magasin par magasin.
- Un appareil perdu est un carnet perdu.

## 9. Les invariants

Ce chapitre énonce les dix-sept propriétés que les données doivent vérifier après une écriture, et pour chacune l'endroit exact du code qui la tient : une fonction d'écriture du modèle, le code appelant en dehors du modèle, une conversion au chargement, une règle de la base distante — ou rien. Quatre d'entre elles ne sont pas tenues par le modèle, et sont énoncées ici avec cette réserve : une réimplémentation qui les croirait structurelles les perdrait.

### Où chaque propriété est tenue

Une propriété tenue par une fonction d'écriture du modèle survit à n'importe quel appelant ; une propriété tenue par l'appelant disparaît avec lui, et un appelant de plus, ou une reprise de sauvegarde, la rompt sans que rien ne s'y oppose.

| Propriété | Tenue par | Réserve |
| --- | --- | --- |
| 1. Rien de dérivable n'est stocké | modèle | une exception : les cinq attributs nutritionnels d'une prise alimentaire |
| 2. Référence par identifiant | modèle | trois journaux référencent encore par nom |
| 3. Supprimer supprime | modèle + conversion au chargement | — |
| 4. Une valeur absente se tait | fonctions de lecture | trois définitions distinctes du dénominateur |
| 5. Aucune branche ne se ferme sur un silence | modèle (V1) ; partiellement (V2) | l'effacement des réponses d'une étape sautée n'existe pas en V2 |
| 6. Unités canoniques | convention | aucune fonction ne la vérifie |
| 7. Dates locales | modèle | cinq lectures en temps universel subsistent |
| 8. L'ordre est celui des dates | fonctions de tri, à la lecture | au moins trois lectures prennent encore le dernier rang |
| 9. Minutes rondes | modèle, en huit endroits d'écriture | une écriture hors de ces huit y échapperait |
| 10. Une seule pesée par jour | modèle à l'ajout ; appelant à la modification | la modification ne l'applique pas |
| 11. Le départ est la pesée la plus ancienne | modèle sur deux chemins d'écriture sur cinq | l'unicité du drapeau n'est garantie par aucune écriture |
| 12. Deux sommeils ne se recouvrent pas | appelant, et seulement si la plage a changé | ce n'est pas un invariant des données |
| 13. Les fibres ne manquent nulle part | types et fonctions de calcul | glucides et lipides manquent aux totaux du jour |
| 14. Une seule personne par installation | stockage local unique + règles de la base | changer de compte n'efface pas l'historique local |
| 15. Le format ne change pas sans conversion | conversion au chargement | — |
| 16. Forme d'une date et d'une heure | rien | aucune écriture ne la vérifie |
| 17. Bornes d'une valeur | modèle (V2) ; rien (V1) | les échelles graduées ne sont pas typées |

### 1. Rien de dérivable n'est stocké

Aucune grandeur calculable à partir d'autres attributs ne possède d'attribut à elle. La durée d'un sommeil n'existe nulle part : elle se calcule des deux instants complets par `sleepMinutesBetween` (`src/features/sleep/sleep.utils.ts`), qui est la seule fonction à la produire. L'apport d'un repas se calcule de sa composition par `computeItemsNutrition` (`src/shared/food/food.nutrition.ts`). L'IMC, la perte totale, la dépense d'une séance, le poids courant se calculent à la lecture. En V2, l'âge est remplacé par l'année de naissance (`src/domaine/mesures.ts`) — un âge se périme, une année de naissance non. **[V2]**

```
duree_sommeil = instant(reveil) − instant(endormissement)   // jamais un attribut enregistré
nutrition_repas = Σ computeQuantityNutrition(item.qty, fiche(item.foodId))
```

**Une exception subsiste dans le code :** une prise alimentaire porte cinq attributs nutritionnels (`calories`, `protein`, `carbs`, `fat`, `fiber`), déclarés transitoires dans `src/types.ts` et inscrits au « Reste à faire » de `CONVENTIONS.md`. **[arbitrage non validé]** L'invariant vérifiable qui reste sur eux est plus faible, et il est vrai :

```
prise.{calories,protein,carbs,fat,fiber} = computeItemsNutrition(prise.items, fiches)
                                            AU MOMENT DE LA DERNIÈRE ÉCRITURE de la prise
```

Ce cache est recalculé à l'ajout et à la modification d'une prise (`src/app/useAppData.ts`), jamais entre deux. Il n'est pas un détail de mise en œuvre : c'est lui, et non la composition, que lisent les totaux du jour (`nutritionTotalsOn`, `src/features/home/homeOverview.ts`), les moyennes alimentaires (`src/features/meal-journal/mealAverages.ts`), la composition repas/en-cas (`src/features/meal-charts/mealVsSnack.ts`) et la synthèse du rapport. Un seul module recalcule à la lecture, celui du journal des repas (`src/versions/mixte/features/meal-journal/MealDayGroup.tsx`). Corriger une fiche d'aliment ne corrige donc pas l'historique déjà enregistré : elle ne change une prise qu'à la prochaine écriture de cette prise.

**S'il tombe :** deux valeurs existent pour une même grandeur et divergent à la première correction. C'est déjà le cas ici, et l'écart est borné par l'invariant faible ci-dessus.

> **Exemple.**
>
> Camille corrige la fiche d'un yaourt de 60 à 54 kcal pour 100 g. Ses totaux du jour, ses moyennes et son rapport ne bougent pas : ils lisent le cache des prises. Seul le journal des repas, qui recalcule, rend la valeur corrigée. Rouvrir un repas et le réenregistrer aligne sa ligne sur la fiche corrigée.

### 2. On référence par identifiant, jamais par nom

Une ligne qui désigne une entrée d'un catalogue en porte l'identifiant, pas le libellé. Un composant de repas porte `foodId` et `isCustomFood` ; une prise de traitement et le profil portent un identifiant du catalogue des traitements (`src/shared/medication/treatment.catalog.ts`), résolu par `getTreatment`, qui rend `aucun` pour un identifiant inconnu. Les libellés hérités sont convertis une fois au chargement par `toTreatmentId`. En V2, le traitement se choisit dans le catalogue (`src/domaine/traitements.ts`) et ne se saisit jamais librement. **[V2]**

| Référence | Forme stockée | Tenu |
| --- | --- | --- |
| Aliment d'une composition | `foodId` + `isCustomFood` | oui |
| Traitement d'une prise, traitement du profil | identifiant du catalogue | oui |
| Type d'un effet indésirable | nom (`type: string`) | non |
| Discipline d'une séance | nom (`sport: string`) | non |
| Activité d'un temps pour soi | nom (`activity: string`) | non |

**Trois écarts sont constatés dans le code** : les types `SideEffectType` et `SportType` sont déclarés dans `src/types.ts` sans table correspondante, et les trois journaux ci-dessus gardent un nom là où la règle demande un identifiant. La dette n'est écrite qu'en partie : le « Reste à faire » de `CONVENTIONS.md` ne nomme que `SideEffectLog` et son `type: string` ; celle du temps pour soi ne vit que dans un commentaire de `src/types.ts` ; celle de la discipline d'une séance n'est écrite nulle part. **[arbitrage non validé]**

L'identifiant lui-même n'est pas un identifiant de catalogue mais une clé de ligne, et sa fabrication n'est pas uniforme. Les prises alimentaires emploient un UUID v7 (`newId`, `src/shared/platform/id.ts`), dont les 74 bits aléatoires rendent la collision impraticable ; six journaux emploient un préfixe suivi de l'horloge — `w-`, `inj-`, `se-`, `step-`, `sport-`, `metime-`, `sleep-` — dans `src/app/useAppData.ts`. Deux écritures dans la même milliseconde y produiraient le même identifiant ; rien ne l'empêche et rien ne le détecte.

**S'il tombe :** renommer une entrée casse l'historique qui la citait, et le nom stocké interdit toute traduction — deux langues donneraient deux valeurs pour la même chose. Et sur les identifiants de ligne : deux lignes indiscernables, une modification qui en touche deux, une suppression qui en emporte deux.

### 3. Supprimer supprime

La ligne supprimée quitte la sauvegarde. `removeLogById` (`src/shared/model/logbook.ts`) filtre le tableau ; plus aucune écriture ne pose de marque de suppression. Les sauvegardes antérieures ont été nettoyées une fois au chargement par `purgeDeleted` (`src/shared/model/purgeDeleted.ts`), qui retire les lignes marquées et l'attribut de marque des autres.

```
∀ journal, ∀ id : après supprimer(journal, id), aucune ligne de journal n'a cet id
```

**Trois suppressions sont refusées, et par trois autorités différentes.** Le modèle refuse la suppression d'un aliment personnalisé qui est ingrédient d'une recette (`recipesUsingFood`, `src/features/custom-food/customFood.utils.ts`), au nom de l'intégrité référentielle : le recalcul de la recette ignorerait silencieusement ce qu'il ne résout pas. Le code appelant refuse la suppression de la pesée de départ — `removeLogById` l'exécuterait sans broncher, on ne la lui demande jamais (invariant 11). La base distante refuse la suppression d'une réponse au sondage et d'un message de retour d'usage : `allow delete: if false` dans `firestore.rules`.

**Cas limites**

- Un journal absent vaut le journal vide : les sauvegardes anciennes ne portent pas tous les journaux.
- `purgeDeleted` traverse sept journaux (pesées, journalier, prises de traitement, prises alimentaires, effets indésirables, pas, séances) ; les journaux du temps pour soi et du sommeil, nés après l'abandon de la suppression logique, n'y figurent pas.
- La suppression du compte efface d'abord le compte distant, puis tout le stockage local ; si l'effacement du compte échoue, rien n'est effacé (`src/versions/mixte/components/DeleteAccountBlock.tsx`).
- Une consigne périmée survit dans la documentation de `isDayTaken` (`src/features/weight/weight.utils.ts`), qui demande encore qu'on lui passe une liste filtrée « car les pesées supprimées n'occupent plus leur jour ». Il n'y a plus de lecture filtrée ; la consigne contredit l'invariant à l'endroit précis où l'unicité de la pesée du jour se joue. **[arbitrage non validé]**

**S'il tombe :** chaque lecture doit filtrer, et une seule qui l'oublie compte des lignes mortes. C'est arrivé : les plafonds quotidiens comptaient les lignes marquées, une journée vidée était déclarée pleine, et l'écriture suivante écrasait une ligne invisible.

### 4. Une valeur absente se tait

Une grandeur calculée sur un ensemble vide rend l'absence, jamais zéro, jamais une moyenne de remplacement. `nightMinutesOn` rend `null` quand aucune nuit ne porte cette date ; les moyennes alimentaires rendent `null` sans journée renseignée (`src/features/meal-journal/mealAverages.ts`) ; une famille de prises sans ligne n'a pas de valeur plutôt qu'une valeur nulle (`src/features/meal-charts/mealVsSnack.ts`).

```
agréger(∅) = absence      // et non 0
0 mesuré ≠ absence        // un zéro saisi est une valeur
```

Le dénominateur d'une moyenne n'est jamais le nombre de jours de la période, mais il n'a pas la même définition partout — trois règles coexistent, chacune dans sa fonction.

| Moyenne | Dénominateur | Où |
| --- | --- | --- |
| Alimentation par jour | les dates portant au moins une prise | `mealDailyAverages` |
| Durée d'une nuit | les dates portant au moins une nuit *de durée strictement positive* | `nightMinutesDailyAverage`, `src/features/sleep/sleep.utils.ts` |
| Qualité d'un sommeil | la somme des durées, chaque entrée pesant la sienne ; `null` si la durée totale est nulle | `weightedQuality` |

La réciproque tient aussi : un zéro enregistré est une donnée. La déduction de la faim ne touche pas une prise qui porte déjà ses deux valeurs, zéro compris.

**S'il tombe :** un zéro se lit comme une nuit blanche ou un jeûne, c'est-à-dire comme une mesure ; le produit affirmerait une chose que personne n'a saisie.

> **Exemple.**
>
> Camille n'a rien enregistré du 14 septembre : sa moyenne de fibres de la semaine se calcule sur les six journées renseignées, et sa nuit du 14 n'existe pas — elle ne vaut pas zéro minute. Une nuit du 15 saisie avec un réveil antérieur à l'endormissement ne compterait pas non plus au dénominateur de sa durée moyenne de nuit.

### 5. Aucune branche ne se ferme sur un silence

Une question sans réponse ne décide rien ; seule une réponse explicite ouvre ou ferme une suite. En V1, les conditions qui posent une étape s'écrivent en égalité stricte à une réponse — `started === true`, `hasSessions === true`, `foodDiary === true` (`src/features/onboarding/onboarding.steps.ts`) — et jamais en simple vérité d'une valeur possiblement absente ; quand la condition doit rester ouverte au silence, elle s'écrit en négation d'une réponse donnée (`started !== true`, `goal !== 'stabiliser'`). Ce que les réponses activent suit la même règle : un suivi devient actif sur un `true` explicite, jamais sur une absence. Sauter une étape efface les réponses qu'elle portait (`clearStepAnswers`), pour qu'une valeur orpheline ne survive pas à la question retirée.

```
condition(étape) = f(réponses explicites)      // jamais f(absence)
sauter(étape) ⇒ effacer(réponses de l'étape)   // V1 seulement
```

En V2 (`onboarding/parcours.ts`, `onboarding/reponses.ts`, `src/app/useParcours.ts`), la mécanique est celle d'une condition par étape et d'une condition de validation par étape, mais elle diverge sur deux points, et l'invariant n'y est pas tenu tel quel. **[V2]**

- La condition de l'étape du poids visé est bien une égalité stricte (`objectif === 'perdre'`) ; celle de l'étape du traitement est une simple vérité de valeur (`reponses.traitementCommence`) — exactement la forme que l'invariant interdit. Elle n'est sûre que par une propriété du type, non énoncée : `traitementCommence` est un booléen non nullable, retenu d'avance à `true`. **[arbitrage non validé]**
- Rien n'efface les réponses d'une étape retirée. Répondre « stabiliser » retire l'étape du poids visé, mais `poidsCible` garde sa valeur de départ `'95.0'`. Seules les trois réponses du traitement se défont ensemble : répondre « non » remet la forme et la spécialité à `null`, changer de forme remet la spécialité à `null`. **[arbitrage non validé]**

Deux étapes, et non une, rendent la condition de validation fausse : celle du traitement tant que la forme et la spécialité manquent toutes deux, et la dernière quand un mot de passe est commencé sans tenir ses huit signes. Un mot de passe vide la laisse vraie. Le commentaire du code, qui n'en annonce qu'une, est périmé.

**S'il tombe :** une question sautée décide à la place de la personne, et le produit lui attribue un état qu'elle n'a pas déclaré — ou conserve une réponse à une question qui ne lui a jamais été posée.

### 6. Les unités stockées sont canoniques

Chaque grandeur a une unité de stockage unique, et aucune étiquette d'unité n'accompagne une valeur enregistrée. Le système d'unités choisi ne décide que de la saisie et de la restitution ; il ne touche jamais la valeur écrite. Aucune fonction ne vérifie cette propriété : elle tient par convention et par la localisation des conversions.

| Grandeur | Unité stockée |
| --- | --- |
| Poids, mesures corporelles | kilogramme (une décimale), centimètre |
| Taille | centimètre |
| Quantité d'aliment | gramme pour un solide, millilitre pour un liquide |
| Dose d'un traitement | milligramme |
| Durée d'une séance, d'un temps pour soi, d'un sommeil | minute |
| Distance d'une séance | mètre |
| Énergie, macronutriments, fibres | kilocalorie, gramme |

Litres, kilomètres, livres, pouces et portions n'existent qu'aux deux bouts. En V2, la conversion du pouce vit dans `tailleAffichee` et `tailleEnCm` (`src/domaine/unites.ts`), qui se disent en commentaire « les seuls endroits où le pouce existe » ; c'est inexact — `TAILLE_BORNES` écrit les bornes en pouces (20 à 118) dans `src/domaine/mesures.ts`, et `UNITES_DU_SYSTEME` associe `'in'` au système impérial dans `unites.ts`. **[arbitrage non validé]** Le plafond du poids, 999 kg ou 2000 lb, vit dans `mesures.ts` et non dans `unites.ts` : deux nombres ronds choisis chacun dans son unité, et non la conversion l'un de l'autre. **[V2]**

**S'il tombe :** changer de système d'unités change la valeur des mesures déjà prises, et une même table mêle des grandeurs qui ne se comparent pas.

> **Exemple.**
>
> Camille mesure 168 cm : c'est ce qui est stocké, quel que soit le système choisi ; en impérial elle lit 66 in. L'aller-retour n'est pas fidèle pour autant — les deux conversions arrondissent à l'entier : 167 cm se lisent aussi 66 in, et 66 in ressaisis valent 168 cm. Une taille peut donc gagner un centimètre en repassant par une saisie impériale ; 168 est l'une des rares valeurs stables.

### 7. Les dates sont locales

Un jour s'écrit `AAAA-MM-JJ` et une heure `HH:MM`, sans fuseau : ce sont des heures murales, celles que la personne a vécues. Elles se produisent et se lisent segment par segment — `getLocalDateStr` lit l'année, le mois et le jour locaux ; `instantMinutes` découpe la chaîne plutôt que de la donner à un constructeur de date, qui l'interpréterait en temps universel.

```
jour = AAAA-MM-JJ local        // jamais toISOString().split('T')[0]
comparaison de jours = comparaison de chaînes
```

**Cinq lectures au moins construisent encore une date depuis une chaîne de jour nue**, ce qui la lit en temps universel et décale d'un jour à l'ouest de Greenwich : `src/features/home/homeOverview.ts:225` (l'écart depuis la dernière prise de traitement), `src/features/steps/steps.utils.ts:170`, `src/features/injections/injections.utils.ts:140`, `src/shared/body-metrics/bodyMetrics.utils.ts:18` (le tri des mesures corporelles) et `src/shared/date/date.relative.ts:21` — dans le format de date lui-même. **[arbitrage non validé]**

Les instants absolus en millisecondes existent, et pas seulement en métadonnée technique. On en compte trois familles : `createdAt` et `updatedAt` sur les recettes et les aliments personnalisés ; l'instant d'envoi d'un retour d'usage et d'une réponse au sondage, ramené à un jour local pour compter les envois du jour (`countSendsOn`, `src/features/feedback/sendDailyCap.ts`) ; l'horodatage d'un échec de génération du rapport, qui est une heure serveur (`failedAt: serverTime()`, `src/features/feedback/remoteSubmit.ts`). Aucune ligne d'un journal de suivi n'en porte.

**S'il tombe :** une pesée du soir se range au lendemain, et le décalage varie avec le fuseau de la personne — donc avec ses voyages.

### 8. L'ordre est celui des dates

Aucun calcul ne doit se fier au rang d'une ligne dans son journal. L'ordre qui compte est celui porté par les lignes : `byDateTimeAsc` et `byDateTimeDesc` (`src/shared/model/logOrder.ts`) comparent la clé `date + T + heure`, l'heure absente valant midi ; à clé égale, l'ordre du tableau subsiste. Les journaux s'écrivent par ajout en fin de tableau : leur rang est l'ordre de création, et une ligne antidatée y arrive en dernier tout en appartenant au passé.

```
cle(ligne) = `${ligne.date}T${ligne.time || '12:00'}`
poids courant = pesée maximale pour cle, jamais pesées[pesées.length − 1]
```

**L'écart est structurel, non ponctuel.** Au moins trois lectures du code vivant prennent la dernière ligne du tableau pour le poids courant, dont deux dans un module partagé par toutes les versions : `src/utils/badgeSystem.ts:272` et `:285` (l'objectif protéique et le badge qui en dépend) et `src/versions/mixte/components/PlusMenu.tsx:40` ; une douzaine d'autres vivent dans les versions gelées. Une pesée antidatée y fausse la perte annoncée. **[arbitrage non validé]**

**Cas limites**

- La modification d'une pesée ne retrie pas le journal : le rang stocké cesse de suivre les dates, et seul le tri à la lecture rétablit l'ordre. L'écart est assumé et couvert par un test dans `src/features/weight/weighInWrites.ts`. **[arbitrage non validé]**
- L'ajout d'une pesée, lui, retrie le tableau par date avant de l'écrire.

**S'il tombe :** une pesée antidatée passe pour la plus récente ; la perte, l'IMC et le rapport se calculent depuis le mauvais point.

### 9. Les heures tombent sur des minutes rondes

Toute heure enregistrée appartient à l'ensemble `0, 10, 15, 20, 30, 40, 45, 50`, arrondie vers le bas. La règle vaut pour la valeur écrite, pas seulement pour celle proposée : `snapToRoundedMinutes` (`src/shared/date/date.local.ts`) est appelée en huit endroits, et en huit seulement.

| Écriture | Où l'arrondi est appliqué |
| --- | --- |
| Fusion d'une modification de ligne | `applyLogUpdate` → `snapLogTime`, `src/shared/model/logbook.ts:32` |
| Ajout sous plafond quotidien | `addLogWithinDailyCap` → `snapLogTime`, mêmes lignes |
| Ajout d'une pesée | `src/features/weight/weighInWrites.ts:129` |
| Modification d'une pesée | `src/features/weight/weighInWrites.ts:195` |
| Les deux heures d'un sommeil | `snapSleepTimes`, `src/features/sleep/sleep.utils.ts:98` |
| Ajout d'une prise alimentaire | `src/app/useAppData.ts:440` |
| Modification d'une prise alimentaire | `src/app/useAppData.ts:494` |
| Les deux heures de rappel du profil | `src/app/useAppData.ts:205` et `:207` |

```
minutes(heure enregistrée) ∈ {0,10,15,20,30,40,45,50}
14:37 → 14:30    14:47 → 14:45    23:59 → 23:50    14:07 → 14:00
```

Il n'existe pas de fonction d'ajout générique hors plafond : une écriture qui n'emprunterait aucun des huit chemins échapperait à la règle. C'est exactement la raison d'être de `snapSleepTimes` — l'ajout d'un sommeil n'emprunte ni `applyLogUpdate` ni `addLogWithinDailyCap`, et `snapLogTime` ne connaît de toute façon que l'attribut `time`, jamais `bedTime`.

**Cas limites**

- Une chaîne qui n'est pas `HH:MM`, ou dont les minutes dépassent 59, ressort telle quelle (voir l'invariant 16).
- Une ligne sans attribut d'heure ressort inchangée ; un total journalier de pas n'en porte pas.
- L'heure proposée par défaut est l'heure locale ainsi arrondie : elle n'est donc jamais dans le futur.

**S'il tombe :** deux heures voisines qui décrivent le même moment ne se regroupent plus, et l'ensemble des instants cesse d'être commun à tous les journaux.

### 10. Une seule pesée par jour

À l'ajout, le journal des pesées porte au plus une ligne par date. Enregistrer une pesée sur une date déjà prise met à jour la ligne du jour au lieu d'en créer une seconde (`addWeighIn`, `src/features/weight/weighInWrites.ts`) : elle garde son identifiant, son drapeau de départ, et les mesures corporelles que la nouvelle saisie ne fournit pas — une mesure non fournie n'est pas un effacement.

```
∀ date d : |{ p ∈ pesées : p.date = d }| ≤ 1      // garanti par addWeighIn SEUL
```

**La modification ne tient pas la règle.** `updateWeighIn` ne cherche pas si la date visée est occupée : déplacer une pesée sur un jour pris n'écrase rien et produit deux lignes. Ce qui l'empêche est hors du modèle : `isDayTaken` (`src/features/weight/weight.utils.ts`), appelée par trois modules appelants seulement — `InlineWeighInRow.tsx:86`, `WeightCalendar.tsx:174`, `WeightTracker.tsx:373`, sous `src/versions/mixte/features/weight/`. Un quatrième appelant, ou une reprise de sauvegarde, produirait deux pesées le même jour sans que rien ne s'y oppose. **[arbitrage non validé]**

**Cas limites**

- Le remplacement conserve la nature de la ligne remplacée : se peser le jour du départ met à jour le départ, qui reste le départ.
- Aucun autre journal ne porte cette contrainte ; les autres ont des plafonds quotidiens (2 prises de traitement, 15 effets indésirables, 15 séances, 15 temps pour soi, 15 sommeils par date de réveil, 30 prises alimentaires), dont les quatre premiers écrasent la dernière ligne du jour et les deux derniers refusent l'écriture.
- Déplacer une prise alimentaire vers une autre date la compte contre le plafond de la date visée, et le refus laisse la prise à sa date d'origine.

**S'il tombe :** deux poids coexistent pour un même jour et aucune règle ne dit lequel est le poids de ce jour ; la perte quotidienne, la cadence hebdomadaire et le rapport deviennent ambigus.

> **Exemple.**
>
> Camille, pesée à 85,2 kg le 12 septembre au matin, se repèse le soir à 85,1 : la ligne du 12 passe à 85,1 kg, garde son identifiant et garde le tour de taille saisi le matin. Si elle avait à la place modifié la pesée du 11 pour la dater du 12, rien dans le modèle ne l'en aurait empêchée.

### 11. Le poids de départ est la pesée la plus ancienne, et ne se supprime pas

Après un ajout ou une modification de pesée, le drapeau de départ est reposé sur la plus ancienne ligne du journal par `keepStartingOnOldest` (`src/features/weight/weighInWrites.ts`). Le départ se reconnaît à son drapeau, jamais à sa valeur : repasser par ce poids, ou le dépasser, ne fait pas d'une pesée ordinaire un départ (`findStartingWeighIn`, `src/shared/model/startingWeighIn.ts`).

```
depart = min(journal, byDateTimeAsc)      // à date égale, le départ en place le reste
vider(journal des pesées) = { p : p.estDepart }
```

**L'unicité du drapeau n'est garantie par aucune écriture.** `keepStartingOnOldest` cherche la *première* ligne marquée du tableau et sort sans rien réécrire si elle est la plus ancienne ou du même jour qu'elle. Un journal portant deux drapeaux dont le premier trouvé est le plus ancien ressort tel quel, avec ses deux drapeaux. La propriété « exactement une pesée porte le drapeau » n'est donc pas un invariant du modèle. **[arbitrage non validé]**

**Deux chemins d'écriture sur cinq seulement reposent le drapeau.** `addWeighIn` et `updateWeighIn` appellent `keepStartingOnOldest` ; les trois autres ne la traversent pas (`src/app/useAppData.ts`) :

| Écriture du journal des pesées | Repose le drapeau | Effet sur le départ |
| --- | --- | --- |
| Ajouter une pesée | oui | une ligne antidatée devient le départ |
| Modifier une pesée | oui | antidater une pesée lui donne le départ |
| Supprimer une pesée (`removeLogById`) | non | si la ligne marquée disparaît, le journal reste sans départ |
| Vider le journal (`removeAllWeightsButStarting`) | non | filtre *sur le drapeau* : un journal sans drapeau devient vide |
| Écrire le poids de départ depuis le profil (`setStartingWeight`) | non | modifie la ligne marquée ; sans ligne marquée, en fabrique une, datée de la veille de la plus ancienne |

La non-suppression du départ est tenue hors du modèle : `removeLogById` exécuterait la suppression, mais aucun appelant ne la lui demande sur la ligne marquée (`InlineWeighInRow.tsx:259`, `WeightCalendar.tsx:122`). Le refus de dater le départ après une autre pesée l'est de même, en trois endroits appelants (`InlineWeighInRow.tsx:77`, `WeightCalendar.tsx:169`, `WeightTracker.tsx:357`). **[arbitrage non validé]**

**Cas limites**

- Un journal vide reste vide : il n'y a rien à marquer.
- La première pesée d'un journal vide devient le départ, puisqu'elle est la seule.
- La conversion d'une sauvegarde ancienne (`ensureStartingWeighIn`) pose le drapeau à faux sur toutes les lignes, sauf celle qui portait l'identifiant historique `starting-weight-log`, et ne fabrique une ligne de départ que si l'ancien profil portait un poids de départ strictement positif ; elle est idempotente.

**S'il tombe :** la perte totale, la progression d'IMC, les paliers et le rapport se comptent depuis une pesée qui n'est plus la première ; et si le drapeau disparaît en silence, vider le journal des pesées le vide entièrement.

> **Exemple.**
>
> Camille est partie de 96,0 kg en mai 2026. Elle retrouve une pesée du 28 avril à 97,2 kg et l'enregistre : `addWeighIn` repose le drapeau, cette ligne devient le départ, la ligne de mai le perd, et la perte totale se recompte depuis 97,2.

### 12. Deux plages de sommeil ne se recouvrent pas — règle d'écriture, non invariant

Une entrée de sommeil est une plage entre deux instants complets — jour et heure de l'endormissement, jour et heure du réveil, tous les quatre écrits, aucun déduit. La règle est écrite dans le domaine, par `sleepRangesOverlap` et `findOverlappingSleep` (`src/features/sleep/sleep.utils.ts`), mais **aucune écriture du modèle ne l'applique** : ni l'ajout ni la modification d'un sommeil (`src/app/useAppData.ts:394-416`) ne les appellent. Le contrôle vit chez trois appelants — `src/features/sleep/useSleepForm.ts:437`, `src/versions/mixte/features/sleep/JournalEntryCard.tsx:111`, `SleepCalendar.tsx:210` — et il ne court que **si la plage a changé**, ce que le code assume : deux lignes déjà en conflit dans l'historique ne sont pas touchées, et leurs autres attributs restent modifiables. Un journal peut donc contenir, et conserver indéfiniment, des plages qui se recouvrent. **[arbitrage non validé]**

```
recouvre(a, b) = aDebut < bFin ∧ bDebut < aFin      // inégalités strictes
règle appliquée à l'écriture : ¬∃ ligne du journal, hors la ligne éditée, recouvrant la plage candidate
                               — et seulement si la plage candidate diffère de l'ancienne
```

Les inégalités sont strictes : le bout-à-bout est permis — se rendormir à l'heure exacte d'un réveil n'est pas dormir deux fois. Une plage sans étendue (réveil antérieur ou égal à l'endormissement) ne recouvre rien : c'est la règle de la durée nulle qui la refuse, chaque refus gardant son propre motif. La date d'une entrée est celle du réveil, ce qui fait que la nuit précédant un jour porte, par construction, la date de ce jour.

**Cas limites**

- La ligne en cours de modification est exclue de la recherche de conflit (`excludeId`), faute de quoi elle se verrait elle-même et toute retouche serait refusée.
- Une plage dont un des quatre repères est illisible ne recouvre rien : `instantMinutes` rend `null` et `sleepRangesOverlap` rend faux (voir l'invariant 16).
- Le journal du sommeil refuse au-delà de quinze entrées portant la même date de réveil, sans rien écrire ; ce plafond-là, lui, est bien tenu par le modèle.
- Aucune borne haute ne pèse sur la durée d'une plage : plusieurs jours sont acceptables pour le modèle.

**S'il tombe :** le sommeil cumulé d'une journée peut dépasser la journée, et le temps d'éveil — du réveil du matin à l'endormissement du soir, moins les siestes — devient négatif.

> **Exemple.**
>
> Camille dort du 12 septembre 23:10 au 13 septembre 07:00. Une sieste du 13 de 06:30 à 08:00 est refusée ; une sieste du 13 de 07:00 à 08:00 est acceptée, parce qu'elle touche la nuit sans la recouvrir. Si deux plages en conflit existaient déjà dans son journal, elle pourrait en changer la qualité ou les notes sans que le refus ne se déclenche.

### 13. Les fibres ne manquent nulle part

Les fibres sont un nutriment à part entière et ne sont jamais rangées avec les glucides. Le type `Nutrition` et sa valeur nulle portent cinq attributs — `calories`, `protein`, `carbs`, `fat`, `fiber` ; `computeQuantityNutrition` et `computeItemsNutrition` les calculent tous les cinq ; une fiche d'aliment, personnalisée ou non, donne ses fibres pour 100 g comme le reste ; le profil porte un objectif quotidien de fibres, à 25 g par défaut (`dailyNutritionGoals`, `src/features/home/homeOverview.ts`) ; un palier du jour est franchi pour les protéines et pour les fibres indépendamment, avec deux mémoires distinctes (`src/features/meal-form/paliersNutritifs.ts`) ; la répartition calorique compte les fibres à part, à 2 kcal par gramme (`KCAL_PER_GRAM`, `src/features/meal-charts/mealVsSnack.ts`).

```
Nutrition = { calories, protein, carbs, fat, fiber }              // cinq
DailyNutritionGoals = MealDailyAverages = { calories, protein, fiber }   // trois
```

**La symétrie s'arrête là.** Le type des totaux journaliers et des objectifs n'en porte que trois — énergie, protéines, fibres — et c'est lui que lisent le total du jour (`nutritionTotalsOn`), les objectifs du profil (`dailyNutritionGoals`) et les moyennes du journal des repas (`MealDailyAverages`, `src/features/meal-journal/mealAverages.ts`). Glucides et lipides manquent à ces trois endroits ; les fibres, elles, ne manquent nulle part. **[arbitrage non validé]**

**S'il tombe :** une composition dont les macronutriments ne rendent pas l'énergie annoncée, un objectif quotidien muet sur le nutriment que le traitement rend justement critique, et une répartition qui range les fibres avec les glucides.

### 14. Une seule personne par installation

Le modèle porte un profil, un jeu de journaux, une installation. Il n'existe ni profils multiples, ni partage de compte, ni rôle tiers, ni comparaison entre personnes. Les données de suivi vivent sur l'appareil, sous une clé de stockage unique (`STORAGE_KEY = 'glp1_app_companion_data'`, `src/app/useAppData.ts`), derrière une couche de stockage unique (`src/shared/platform/storage.ts`) ; il n'y a ni base distante ni synchronisation pour elles, et changer d'appareil ne transporte pas l'historique. Les règles de la base distante (`firestore.rules`) ne déclarent aucune collection de santé : sondage, messages de retour d'usage, journal des échecs d'export, chacun rangé sous l'identifiant du compte, chacun illisible par un autre compte.

**L'énoncé exact du flux sortant est négatif :** aucun flux sortant ne porte de donnée de santé. Il est faux de dire que le seul flux sortant est un document produit et transmis par la personne. Trois écritures distantes partent sans transmission explicite ou sans être un document : un message de retour d'usage et une réponse au sondage vont en base ; un échec de génération du rapport écrit de lui-même, dans un `catch`, un document sous `reportErrors/{uid}/failures` et met en file un courrier d'alerte (`recordReportExportFailure`, `src/features/feedback/remoteSubmit.ts`). Ce qu'ils portent est borné et vérifié : des comptes, des bornes et des réglages, jamais un poids, une dose, un contenu de repas ni une note. **[arbitrage non validé]**

**Le point de rupture est ailleurs :** le compte est distant (authentification Firebase) tandis que les données sont locales, et l'effacement local n'est déclenché qu'à la suppression du compte — `clearAll()` n'a qu'un seul appelant, `src/versions/mixte/components/DeleteAccountBlock.tsx`. Se déconnecter ne touche à rien ; se connecter avec un autre compte sur le même appareil laisse en place l'historique du précédent, et la seconde personne le lit comme le sien. **[arbitrage non validé]**

La V2 reprend l'énoncé mot pour mot dans ses principes : aucune donnée de santé ne quitte l'appareil sans une demande explicite de la personne, aucune restitution ne peut se lire comme une recommandation médicale, aucune synchronisation multi-appareils. **[V2]**

**S'il tombe :** la promesse tombe avec lui — et avec elle la raison pour laquelle une personne accepte d'enregistrer son poids, ses effets indésirables et ses doses.

### 15. Le format ne change pas sans conversion

Une sauvegarde écrite par une version antérieure reste lisible. Le chargement (`src/app/useAppData.ts`) procède en trois temps, dans cet ordre.

1. **Les traces des fonctionnalités supprimées sont retirées de l'objet analysé, avant toute conversion** : `waterLogs`, `milestones`, et dans le profil `hydrationTrackingEnabled`, `dailyWaterGoalMl`, `weightGoalsEnabled`. Sans cela, la recopie de l'objet les propagerait sans fin.
2. Le profil est fusionné avec ses valeurs par défaut, et les prises alimentaires antérieures à la bascule vers les compositions sont écartées (`dropPreMigrationMeals`).
3. La chaîne de conversions s'applique, du plus profond au plus extérieur : `dropSeedData` (retrait des lignes d'exemple), `migrateTreatmentIds` (libellés de traitement en identifiants), `purgeDeleted` (lignes marquées supprimées), `mergeSideEffectNotes` (fusion des notes d'effet indésirable), `mergeTableTennisSport` (fusion de deux disciplines en une), `fillMealHunger` (déduction de la faim manquante), `ensureStartingWeighIn` (mise en place de la pesée de départ). Chaque étape rend le même résultat appliquée deux fois.

```
charger(charger(sauvegarde)) = charger(sauvegarde)
```

**Le corollaire est un garde-fou, et il porte sur l'écriture, pas sur l'état.** Si la sauvegarde est illisible, elle est recopiée telle quelle sous une clé de secours — une seule fois, et seulement si cette clé est libre. L'état chargé en mémoire est bien, alors, un profil d'usine avec sa pesée de départ semée : ce que le garde-fou empêche, c'est de l'*écrire* par-dessus la sauvegarde. Un drapeau posé avant l'initialisation coupe toute persistance de la session (`mayPersist`, `src/shared/model/loadGuard.ts`), et l'état est signalé plutôt que tu.

**S'il tombe :** une conversion appliquée deux fois abîme les données qu'elle devait sauver, ou une lecture ratée efface un historique en le remplaçant par des valeurs d'usine.

### 16. Aucune écriture ne vérifie la forme d'une date ou d'une heure

Toute ligne devrait porter une date `AAAA-MM-JJ` lisible et, quand elle en porte une, une heure `HH:MM`. Rien ne le tient : les deux lecteurs du dépôt se taisent au lieu de refuser.

| Fonction | Entrée mal formée | Ce qu'elle rend |
| --- | --- | --- |
| `snapToRoundedMinutes` | chaîne hors `HH:MM`, ou minutes > 59 | la chaîne, telle quelle |
| `minutesOfDay` | idem, ou heures > 23 | `null` |
| `instantMinutes` | date hors `AAAA-MM-JJ`, ou heure illisible | `null` |
| `sleepMinutesBetween` | un des quatre repères illisible | `0` |
| `sleepRangesOverlap` | un repère illisible | `false` |

Les commentaires du code renvoient la vérification aux appelants (« c'est aux validations des saisies de la refuser »). **[arbitrage non validé]**

**S'il tombe — c'est-à-dire dès qu'une date illisible entre :** l'invariant 12 s'annule en silence sur la ligne concernée, sa durée vaut zéro, elle sort du dénominateur des moyennes de nuit, et rien ne la signale.

### 17. Une valeur graduée reste dans son échelle, une mesure dans ses bornes

La V2 tient les bornes dans le domaine, hors de toute saisie, pour que la même règle vaille partout (`src/domaine/mesures.ts`). **[V2]**

| Grandeur | Bornes V2 | Bornes V1 |
| --- | --- | --- |
| Poids | `POIDS_MAX` : 999 kg, 2000 lb | aucune |
| Taille | `TAILLE_BORNES` : 50–300 cm, 20–118 in | aucune |
| Âge | `AGE_MIN` 1, `AGE_MAX` 130, rapportés à l'année en cours par `bornesAnneeNaissance` | aucune |
| Qualité d'un sommeil | — | `number` |
| Sévérité d'un effet indésirable | — | `number` (`SeverityLevel` = 1\|2\|3\|4\|5, déclaré, jamais employé) |
| Faim avant et après une prise | — | `number` (`HungerLevel` = 0\|…\|5, déclaré, jamais employé) |

En V2, ces bornes ne valident plus une saisie libre : elles bornent la liste des valeurs choisissables, si bien qu'il n'y a plus de valeur incorrecte à refuser. En V1, une valeur graduée hors échelle est écrite sans résistance ; la dette est au « Reste à faire » de `CONVENTIONS.md`. **[arbitrage non validé]**

**S'il tombe :** une moyenne pondérée par la qualité, une répartition des sévérités ou une déduction de la faim se calculent sur une valeur qui n'appartient pas à leur échelle, sans qu'aucune lecture ne puisse le détecter.

### Ce que devient une violation déjà enregistrée

Les invariants ci-dessus parlent de ce qui suit une écriture. Sur une sauvegarde qui les viole déjà, le code applique trois politiques différentes, et n'en énonce aucune.

| Violation déjà en place | Politique | Où |
| --- | --- | --- |
| Drapeau de départ absent, ou posé ailleurs que sur la plus ancienne | réparée rétroactivement, à la prochaine pesée ajoutée ou modifiée | `keepStartingOnOldest` |
| Deux drapeaux de départ | non réparée si le premier trouvé est le plus ancien | `keepStartingOnOldest` |
| Lignes marquées supprimées | purgées une fois, au chargement, sur sept journaux | `purgeDeleted` |
| Plages de sommeil qui se recouvrent | tolérées explicitement ; seules les intersections nouvelles sont refusées | `JournalEntryCard.tsx:104-110` |
| Deux pesées le même jour, date illisible, valeur hors échelle | aucune politique : rien ne les cherche | — |

Aucune vérification d'ensemble ne rejoue les invariants sur une sauvegarde chargée : le chargement convertit et répare au coup par coup.

## 10. Ce que le modèle ne fait pas

Ce chapitre borne le modèle : ce qu'aucune entité ne porte, ce qu'aucune capacité n'écrit, ce que les types déclarent sans que rien ne l'emploie, et ce qu'une décision déjà prise coûterait en réécriture. Trois assemblages du produit lisent et écrivent le même agrégat et un seul est livré : les bornes énoncées ici sont celles de l'assemblage livré, et chaque fois qu'un assemblage gelé garde une capacité que le livré n'a plus, c'est dit.

### La forme de l'agrégat

Une installation porte un agrégat unique, sous une clé unique.

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

Aucune propriété de cet agrégat ne désigne un propriétaire, une version, une origine ni un appareil. Un profil n'a ni identifiant, ni instant de création, ni instant de modification. Une installation neuve n'écrit que six des neuf collections — `sportLogs`, `meTimeLogs` et `sleepLogs` sont absents de l'objet initial, et le restent tant qu'aucune ligne n'y est ajoutée.

Cet agrégat n'est pas tout ce qui est conservé : une dizaine d'autres clés du même stockage portent des tables que l'agrégat référence sans les contenir.

### Ce que le stockage porte hors de l'agrégat

| Clé | Ce qu'elle porte | Nature |
| --- | --- | --- |
| `glp1_app_companion_data` | `AppData`, l'agrégat entier. | Le carnet. |
| `glp1_user_custom_foods` | La bibliothèque des aliments créés : un tableau de `CiqualFood` (`alim_code`, `alim_nom_fr`, cinq valeurs nutritionnelles pour 100 g ou 100 ml, `unit?`, `isLiquid?`, `isUserCustom?`, `isRecipe?`, `recipeIngredients?: FoodQuantity[]`, `barcode?`, `createdAt?: number`). | Contenu écrit par la personne. Toute composition de repas la référence. |
| `glp1_favorite_meals` | `FavoriteMealItem { id, title, type: 'repas' \| 'snack', items: FoodQuantity[], createdAt?: number }`. | Contenu écrit par la personne. |
| `glp1_active_sports`, `glp1_active_me_time`, `glp1_active_side_effects` | Trois tableaux de noms : les entrées retenues dans chacun des trois catalogues. | Contenu écrit par la personne, en noms libres. |
| `glp1_food_selection_counts` | `Record<string, number>` : combien de fois chaque aliment a été choisi. | Dérivé accumulé, jamais reconstructible depuis les repas puisque les suppressions ne le décomptent pas. |
| `glp1_badge_tiers_connus`, `glp1_paliers_nutritifs_fetes`, `glp1_dynamique_celebrated`, `glp1_notified_bmi_tier_index`, `glp1_last_celebrated_weight`, `glp1_last_celebrated_weight_id` | Ce qui a déjà été fêté, pour ne pas l'être deux fois. | État de célébration. Aucune date d'obtention. |
| `glp1_first_open_date` | La date de première ouverture, `AAAA-MM-JJ`. | La seule date d'installation du produit. |
| `glp1_user_survey_v2`, `glp1_user_feedbacks`, `glp1_send_cap_alert` | Une réponse de sondage, réécrite à chaque envoi ; les messages envoyés avec leur instant d'envoi ; le drapeau d'alerte de plafond. | Contenu, et la seule source du décompte des envois du jour. |
| `<clé>__secours-index`, `<clé>__secours-<AAAA-MM-JJ-HHMMSS>` | Un index de `BackupEntry { key, stamp, reason, size }` et une copie intégrale de l'agrégat par entrée. | Une collection à part entière, jamais purgée automatiquement. |
| `<clé>__secours` | La copie unique d'une sauvegarde illisible. | Écrite une seule fois, jamais recouverte. |
| `glp1_period_blood_level_by_brand`, `glp1_*_history_view`, `glp1_meal_edit_notice_dismissed` | Des préférences de lecture. | Hors modèle : voir « inventions ». |

Aucune de ces tables ne porte de propriétaire, de version, de numéro de schéma ni de marque de suppression : une entrée retirée l'est franchement. Aucune n'a de chemin de restauration commun avec le carnet — les copies de secours ne portent que sur `glp1_app_companion_data`. La seule métadonnée réellement enregistrée quelque part est `createdAt?: number`, sur un aliment créé et sur un menu favori, en millisecondes depuis l'époque Unix ; elle ne sert qu'à compter les créations du jour, et les entrées antérieures à son arrivée n'en portent pas.

### Ce qu'aucune entité ne porte

| Absent du modèle | Ce que le modèle porte à la place | Conséquence |
| --- | --- | --- |
| Une deuxième personne | Un `UserProfile` unique. Un soignant n'existe que comme `medicalReminderDoctor?: string`, un nom libre posé sur un rappel. | Aucune donnée n'est attribuable à quelqu'un d'autre : ni partage, ni rôle, ni comparaison entre personnes. |
| Un fuseau horaire | Des dates `AAAA-MM-JJ` et des heures `HH:MM`, heures murales locales, sans décalage ni suffixe. | Deux prises notées à 08:00 en deux lieux sont identiques dans les données ; aucune propriété ne permet de les distinguer. |
| Une prescription | `UserProfile.glp1Brand: string`, un identifiant de catalogue. La dose vit sur chaque prise (`InjectionLog.dose`, en mg). `Treatment.dosePresets: number[]` et `Treatment.doseIntervalDays?: number` appartiennent au catalogue, pas à la personne. | Rien ne dit ce qui est prescrit, ni quelle dose est attendue quand. Le rythme se déduit des prises enregistrées. |
| Un épisode de traitement | Rien. La série courante se déduit du journal : on remonte les prises de la plus récente à la plus ancienne et on s'arrête au premier `brand` différent (`currentTreatmentInjections`). | Ni début, ni fin, ni date de changement. Une prise sans `brand` vaut « celui du profil au moment de la lecture » : changer `glp1Brand` réécrit la lecture du passé. |
| Une valeur d'absence de traitement distincte de l'inconnu | `DEFAULT_TREATMENT_ID = NO_TREATMENT.id = 'aucun'`. Un profil neuf porte `glp1Brand: 'aucun'`. `toTreatment` retombe sur cette entrée pour tout identifiant inconnu. | Une prise sans `brand` enregistrée sur un profil neuf est rattachée à « aucun », qui est une entrée du catalogue avec ses paliers de dose et sa pharmacocinétique. |
| Une date de début de cure | La date de la pesée qui porte `isStartingWeight: true`. `cureWeek` compte les semaines depuis elle. | Un historique sans pesée de départ n'a pas de semaine de cure. Le drapeau se repose sur la pesée la plus ancienne à la prochaine écriture de pesée, jamais à la suppression. |
| Une date de naissance | `UserProfile.age: number`, en années révolues. | L'âge ne vieillit pas seul : il reste celui du jour où il a été écrit. **[V2]** La V2 conserve `anneeNaissance: number`, bornée par l'âge 1–130 rapporté à l'année courante. |
| Une mensuration sans pesée | `BodyMeasurements` est un `Pick` de `WeightLog` sur neuf propriétés facultatives, toutes en centimètres. `WeightLog.weight: number` est requis. | Enregistrer un tour de taille impose d'enregistrer un poids à la même date. |
| Une mesure du corps autre que le poids et neuf tours | Rien. Pas de glycémie, pas de tension, pas de résultat d'analyse, pas de température. | Le document transmissible ne peut rien porter de biologique. |
| Un coût, un stock, un cycle menstruel, une humeur | Rien. Aucune entité ne porte de prix, de quantité restante, de date de règles ni d'état affectif. | Ni suivi de dépense, ni alerte de fin de stylo, ni corrélation avec un cycle. |
| Une pièce jointe | Aucun journal ne porte de fichier. La seule image du modèle est `AvatarConfig.customPhotoUrl?: string`, une chaîne unique qui porte l'image encodée dans l'adresse elle-même. | Ni photographie d'un repas, ni ordonnance, ni cliché d'un pèse-personne. L'image compte dans le plafond du stockage. |
| Un moment dans une journée de pas | `StepLog { id, date, steps: number, isSimulated?: boolean }` — pas d'heure. | Un total par journée, jamais une répartition. `isSimulated` distingue le jeu de démonstration du reste ; aucune propriété ne nomme l'appareil ou la méthode de comptage. |
| Une note libre sur quatre des neuf journaux | `notes?: string` existe sur `InjectionLog`, `SideEffectLog`, `SportLog`, `MeTimeLog` et `SleepLog`. | `WeightLog`, `SavedMealLog`, `StepLog` et `DailyLog` n'ont aucune propriété où écrire un mot. |
| Une unité ou une borne appliquée sur deux échelles | `SideEffectLog.severity: number` et `SleepLog.quality: number` — deux entiers nus. Le commentaire annonce 0 à 5 pour la qualité, rien ne l'applique à l'écriture. | Une valeur hors échelle est enregistrée telle quelle et entre dans les moyennes. |
| Une hydratation | Rien. `waterLogs`, `profile.hydrationTrackingEnabled` et `profile.dailyWaterGoalMl` sont retirés à chaque chargement et disparaissent à l'écriture suivante. | Supprimée le 2026-08-07. **[V2]** La V2 la range parmi ce qu'on ne réintroduit pas. |
| Un objectif de poids à paliers | Rien. `milestones` et `profile.weightGoalsEnabled` sont retirés au chargement comme les traces d'hydratation. Il reste `UserProfile.targetWeight: number`, un seul poids visé en kg. | Supprimé le 2026-08-09. **[V2]** Même règle en V2. |
| Un objectif de pas | `DEFAULT_DAILY_GOAL_STEPS = 8000`, une constante du domaine. Les seuls objectifs du profil sont `dailyCaloriesGoal?` (kcal, absent vaut 1 400), `dailyProteinGoal?` (g, absent vaut le poids courant × 1,5 arrondi) et `dailyFiberGoal?` (g, absent vaut 25). | Aucune propriété du profil ne porte cet objectif : il vaut 8 000 pour toute installation. |
| Un historique du profil | Un enregistrement unique et muable, sans `createdAt`, `updatedAt` ni numéro de version. | Changer `targetWeight`, `height` ou `glp1Brand` n'en garde aucune trace : la valeur d'hier est perdue. |
| Un badge | Rien dans l'agrégat. Les paliers (`'aucun' \| 'eveil' \| 'bronze' \| 'argent' \| 'or'`) se recalculent à chaque lecture depuis les journaux. | Ni date de décrochage, ni ordre d'obtention. Seuls les derniers paliers observés sont retenus hors de l'agrégat, sous `glp1_badge_tiers_connus`. |
| Une récurrence | Onze propriétés du profil : `reminderEnabled: boolean`, `reminderDay: number` (0–6), `reminderTime: HH:MM`, `injectionReminderType?: 'weekly' \| 'custom'`, `injectionReminderDaysInterval?: number`, `injectionReminderStartDate?`, et cinq propriétés de rappel médical (`medicalReminderEnabled`, `medicalReminderDate?`, `medicalReminderTime?`, `medicalReminderDoctor?`, `medicalReminderNotifyBefore?`). | Un exemplaire de chaque famille, jamais deux. Aucune occurrence n'est matérialisée, aucune n'est marquée faite ou manquée. |
| Un nom de traitement hors catalogue | Chaque famille du catalogue finit par une entrée « Autre ». | Un traitement absent du catalogue perd son nom : rien ne le conserve. |

### Une entité que rien ne crée

`DailyLog { id, date }` ne porte plus aucun contenu : elle a successivement porté les effets secondaires notés de 0 à 10, quatre repas en texte libre et le total d'hydratation du jour, tous retirés. Aucune capacité ordinaire n'en écrit une ; seule la génération de données de démonstration en pose, une par jour actif. Cinq lectures la parcourent : deux y cherchent la date la plus ancienne de toutes les collections (`oldestDataDate`, qui alimente le déverrouillage d'une célébration, et le calcul de la borne de début du document transmissible), et trois comptent ses lignes (`filteredDaily.length` dans deux assemblages, `data.dailyLogs?.length` dans le compte de la génération). Une ligne de journée plus ancienne que toute autre *recule* la borne de départ vers le passé ; un compte de lignes qui vaut zéro en usage réel est le second effet.

### Ce qu'aucune capacité n'écrit

| Geste absent | Ce que le code porte | Conséquence |
| --- | --- | --- |
| Créer un compte | L'authentification n'expose que six verbes : s'abonner à l'état de connexion, lire le compte courant, se connecter par courriel et mot de passe, se connecter par Google, se déconnecter, supprimer le compte. | Aucune inscription par courriel, aucune réinitialisation de mot de passe, aucun changement d'adresse. **[V2]** La V2 recueille courriel et mot de passe — huit signes au moins, seule contrainte — sans les enregistrer ni vérifier l'adresse. |
| Synchroniser | Tout est écrit dans le stockage local de l'appareil, en une clé pour l'agrégat et une dizaine d'autres pour les tables énumérées plus haut. La base distante ne reçoit que quatre collections : `surveys/{uid}`, `feedbacks/{uid}/messages/{id}`, `reportErrors/{uid}/failures/{id}` et `mail/{id}`, la boîte d'envoi dont les documents portent le corps du message et une adresse de destination en dur. Le contexte joint ne contient aucune donnée de santé. | Changer d'appareil ne transporte rien. Vider le stockage efface tout. Une écriture refusée par le stockage échoue en silence. |
| Exporter le carnet sous une forme relisible | Deux sorties : un document PDF et une image PNG. Aucune des deux ne se relit. | Aucune capacité n'importe de données depuis l'extérieur de l'appareil. |
| Émettre un rappel | Les rappels sont des propriétés du profil. Aucun appel à une interface de notification n'existe dans le code. | Un rappel est une préférence conservée, jamais un événement. Rien ne se déclenche à l'heure dite. |
| Lire un code-barres optiquement | Le code EAN-13 ou UPC-A est enregistré en chiffres, puis cherché chez Open Food Facts. | Un code illisible sur l'emballage ne peut pas entrer autrement. Le code est conservé en chaîne pour garder ses zéros de tête. |
| Recevoir des pas d'un podomètre ou d'une plateforme de santé | `StepLog.steps` s'écrit à la main, ou par la génération de démonstration. | Aucune connexion à un objet connecté. Une journée à zéro pas est traitée comme un compteur éteint et n'entre dans aucune moyenne. |
| Choisir son système d'unités | `UserProfile.measurementSystem?: 'metric' \| 'imperial'` est déclaré et n'est ni lu ni écrit nulle part. | Tout est conservé en unités métriques : kg, cm, g, ml, mg, minutes, mètres. **[V2]** La V2 recueille le système (`'metrique' \| 'imperial'`), avec un défaut apporté par la langue, et ne l'enregistre pas encore. |
| Modifier un aliment de la base de référence | Seuls les aliments créés depuis l'application se modifient ; un code-barres déjà connu rouvre sa fiche au lieu d'en créer une seconde. | Vrai du produit livré. Un chemin d'écriture directe dans `src/data/ciqual.json` existe dans le dépôt, disponible en développement seulement (`isCiqualAdminAvailable = import.meta.env.DEV`) : il change la table livrée à tout le monde, pas un stockage d'appareil. |

Deux capacités réécrivent en revanche l'agrégat entier, depuis le stockage de l'appareil. `restoreBackup(storageKey, key)` relit une copie de secours et la réécrit par-dessus l'agrégat ; `writeWithBackup(storageKey, payload, reason)` écrit une charge arbitraire dans l'agrégat après avoir mis l'existant à l'abri. Les deux sont appelées depuis l'assemblage livré, par la génération de données. Une copie antérieure à une suppression remet donc en place l'état complet, lignes effacées comprises ; les copies ne sont jamais purgées automatiquement. La restauration ne porte que sur l'agrégat : les tables énumérées plus haut ne sont ni copiées ni remises.

### Les plafonds quotidiens

| Ce qui est plafonné | Plafond par journée | Comportement au-delà |
| --- | --- | --- |
| Prises | 2 | Remplacement. `addLogWithinDailyCap` écrase **la dernière ligne du jour dans le tableau**, c'est-à-dire la dernière insérée, et non la plus récente par l'heure. |
| Effets secondaires, séances, moments pour soi | 15 chacun | Remplacement. `addLogWithinDailyCap` écrase **la dernière ligne du jour dans le tableau**, c'est-à-dire la dernière insérée, et non la plus récente par l'heure. |
| Sommeils | 15 | Refus. La ligne n'est pas écrite. |
| Repas et en-cas | 30, comptés à la *date visée* par la saisie et non au jour courant | Refus. La ligne n'est pas écrite. |
| Aliments créés | 50 | Refus. La ligne n'est pas écrite. |
| Recettes créées | 20 | Refus. La ligne n'est pas écrite. |
| Menus favoris créés | 50 | Refus. La ligne n'est pas écrite. |
| Envois de sondage et de message | 10 | Refus. Le décompte porte sur les envois enregistrés ; supprimer un message du jour rend sa place. |
| Pesées | 1 | La pesée du jour est remplacée en gardant sa nature de départ et les mensurations que la nouvelle saisie ne porte pas. La règle vaut à l'ajout, pas à la modification. |

Les plafonds des aliments, des recettes et des menus ne comptent que les entrées portant `createdAt` : celles enregistrées avant l'arrivée de cette propriété ne consomment aucun quota.

### Déclaré sans être employé

Ces déclarations existent dans les types et ne gouvernent rien : la donnée réelle est plus lâche, ou n'a pas de place où vivre.

| Déclaration | Ce que porte la donnée réelle |
| --- | --- |
| `HungerLevel = 0 \| 1 \| 2 \| 3 \| 4 \| 5` | `SavedMealLog.hungerBefore?: number` et `hungerAfter?: number` — un nombre quelconque. **[non implémenté]** |
| `SeverityLevel = 1 \| 2 \| 3 \| 4 \| 5` | `SideEffectLog.severity: number` — un nombre quelconque. **[non implémenté]** |
| `SideEffectType { id, label, createdAt, updatedAt }` | Aucune collection `sideEffectTypes` dans l'agrégat ; `SideEffectLog.type: string` porte un nom. **[non implémenté]** |
| `SportType { id, label, met, createdAt, updatedAt }` | Aucune collection `sportTypes` ; `SportLog.sport: string` porte un nom, et le MET se relit dans un catalogue constant à partir de ce nom. **[non implémenté]** |
| `SportLog.distance?: number`, canonique en **mètres** | Renseignée, elle change la méthode de calcul des calories : la dépense se lit sur l'allure (distance ÷ durée) et non plus sur l'intensité. Absente sur toutes les séances enregistrées jusqu'ici, et proposée aux seuls sports de `SPORTS_WITH_DISTANCE`. |
| `Recipe` et `CustomFood`, le modèle cible des aliments | Le stockage garde la forme héritée de la base de référence (`alim_code`, `alim_nom_fr`), qu'un adaptateur convertit à la lecture. **[non implémenté]** |
| `MeasurementSystem` et `UserProfile.measurementSystem?` | Aucune lecture, aucune écriture. **[non implémenté]** |
| `UserProfile.silhouetteType: SilhouetteType` (huit valeurs) | Écrit au profil d'usine et par la génération de démonstration. Deux assemblages le relisent, dans un état de session qui n'est jamais reporté à l'enregistrement du profil : la valeur ne peut donc pas changer. |
| `UserProfile.easyReadingMode?: boolean \| number` | Conservé pour les sauvegardes existantes. Le chemin livré ne le lit plus depuis le 2026-08-27 ; des assemblages gelés l'écrivent encore, en booléen hérité ou en niveau 0, 1, 2. |
| `JournalViewMode = 'survol' \| 'vue' \| 'plongee'` | Un état de session d'un module partagé, initialisé à `'vue'` et modifiable par `setViewMode`. Jamais conservé dans aucune clé ; l'assemblage livré n'appelle pas ce module. |
| `BODY_MAP_SITES` : six zones du corps avec leur code | Une table constante consommée par les seuls assemblages gelés, assortie de valeurs de placement qui n'appartiennent pas au modèle. `InjectionLog.site: string` n'est contraint par aucun de ces six codes. |

Les métadonnées `createdAt` et `updatedAt` — instants absolus, en millisecondes depuis l'époque Unix — ne sont déclarées que sur `Recipe`, `CustomFood`, `SideEffectType` et `SportType`, quatre types qu'aucune donnée enregistrée n'emploie. De ce qui est réellement conservé, seuls un aliment créé et un menu favori portent `createdAt?`, et pour le seul décompte des plafonds ; `updatedAt` n'existe nulle part. Aucun journal, ni `UserProfile`, ni `AvatarConfig` ne porte l'un ou l'autre : on ne peut pas savoir quand une ligne a été écrite, seulement à quelle date et à quelle heure elle se rapporte.

### Des noms là où la règle veut des identifiants

Le premier principe du modèle demande de référencer par identifiant et jamais par nom. Cinq endroits y dérogent, un sixième conserve une valeur dérivable.

- `SideEffectLog.type: string` — le nom du symptôme.
- `SportLog.sport: string` — le nom du sport. Dans le catalogue des sports, la clé *est* le libellé français : `value === label`.
- `MeTimeLog.activity: string` — le nom de l'activité, même règle.
- `InjectionLog.site: string` — le site de la prise, sans table de référence : le type énonce les sept valeurs attendues dans un commentaire de fin de ligne, puis accepte `string`.
- `SavedMealLog.typeLabel: string` — recalculé depuis `type` à chaque écriture, et conservé quand même.
- À l'inverse, `UserProfile.glp1Brand` et `InjectionLog.brand?` portent bien un identifiant de catalogue, sous un nom de « marque » qui n'est plus le bon.

Les trois listes d'entrées actives, conservées hors de l'agrégat, portent elles aussi des noms et non des identifiants. Conséquence directe, mesurée : renommer une entrée de catalogue impose de réécrire l'historique. La fusion de deux noms d'un même sport a exigé une conversion appliquée à chaque chargement ; sans elle, les séances des deux anciens noms seraient retombées sur l'entrée de repli à 4,5 MET et leurs calories auraient changé après coup. Conséquence indirecte : ces valeurs ne se traduisent pas.

### Le seul lien référentiel n'est pas garanti

Le modèle n'a qu'une référence entre tables : `FoodQuantity { id, foodId, isCustomFood, qty }`, qui pointe vers `CiqualFood.id` quand `isCustomFood` est faux et vers la bibliothèque des aliments créés sinon. Cette bibliothèque vit dans une autre clé et se supprime franchement ; rien n'empêche la suppression d'un aliment référencé.

```
resolveFood(ref, customFoods) === undefined  // référence morte : cas courant, non exceptionnel
```

Les deux consommateurs de la référence ne s'en tirent pas de la même façon. Un repas porte ses cinq valeurs nutritionnelles déjà calculées : la composition perd une ligne, les totaux tiennent. Une recette se recompose depuis `recipeIngredients` et `computeItemsNutrition` ignore silencieusement l'ingrédient introuvable : la rouvrir puis la ré-enregistrer abaisse ses valeurs sans le dire. Défaut connu, non traité. Aucune capacité ne compte les références mortes, aucune ne les répare.

### Les conversions déjà passées

Chaque chargement enchaîne sept conversions, plus cinq effacements de propriétés. Toutes sont idempotentes ; celles qui jettent ou déduisent une donnée ne peuvent pas revenir en arrière.

| Conversion | Ce qu'elle fait | Réversible |
| --- | --- | --- |
| Effacements directs | `delete waterLogs`, `milestones`, `profile.hydrationTrackingEnabled`, `dailyWaterGoalMl`, `weightGoalsEnabled`. | Non |
| `dropPreMigrationMeals` | Jette tout repas sans propriété `items` — ceux qui portaient leur composition dans une phrase. | Non |
| `dropSeedData` | Retire les données semées. | Non |
| `migrateTreatmentIds` | Remplace les libellés de traitement par leurs identifiants de catalogue, au profil et sur chaque prise. Un identifiant inconnu retombe sur `'aucun'`. | Non |
| `purgeDeleted` | Retire les lignes portant l'ancienne marque de suppression. | Non |
| `mergeSideEffectNotes` | Replie `description` dans `notes` ; `notes` gagne quand les deux sont remplis. | Non |
| `mergeTableTennisSport` | Réécrit deux anciens noms de sport en un seul. | Non |
| `fillMealHunger` | Fabrique `hungerBefore` et `hungerAfter` pour tout repas qui n'en porte pas les deux, et les écrit. Déduits du moment du repas, de ses calories et d'un écart tiré des lettres de l'identifiant, bornés à 0–5. Une ligne qui les porte déjà n'est jamais retouchée. | Non — une absence est devenue une valeur |
| `ensureStartingWeighIn` | Repose `isStartingWeight` ; à défaut de tout drapeau, recrée la pesée de départ depuis l'ancienne propriété du profil, s'il existe. | Sans perte |

### Ce qui demanderait une migration

Ces points sont décidés ; le stockage porte encore l'ancienne forme, et le passage réécrit des données déjà enregistrées.

| Décision | Ce que le stockage porte | Ce que coûte le passage |
| --- | --- | --- |
| Un horodatage unique `localDateTime`, heure murale locale sans fuseau | `date: AAAA-MM-JJ` et `time: HH:MM` séparés, sur tous les journaux. `SleepLog` en porte quatre — `bedDate`, `bedTime`, `date`, `time` — et matérialise déjà un intervalle : deux instants complets, dont l'ordre est vérifié à la saisie. | Réécrire chaque ligne et chaque lecture ; pour le sommeil, deux horodatages et l'invariant qui les ordonne. **[non implémenté]** **[V2]** La V2 garde les deux séparés. |
| Référencer les symptômes, les sports et les sites de prise par `typeId` | Des noms libres, sans table où les ranger, dans l'agrégat comme dans les trois listes d'entrées actives | Créer une entrée par nom distinct rencontré, puis réécrire chaque ligne et chaque liste. **[non implémenté]** |
| Ne rien stocker de dérivable | Cinq valeurs nutritionnelles sur `SavedMealLog` (`calories`, `protein`, `carbs`, `fat`, `fiber`), plus `typeLabel` | Les retirer et recalculer partout, ce qui suppose que chaque lecture dispose de la bibliothèque des aliments créés — et que les références mortes soient traitées. |
| Des identifiants UUIDv7 et des métadonnées sur toutes les tables | Des identifiants fabriqués par préfixe et horodatage ; aucune métadonnée, sauf `createdAt?` sur les aliments créés et les menus favoris | Décider d'abord si les métadonnées s'étendent aux journaux. |
| Le stockage des aliments créés au nouveau modèle | La forme héritée de la base de référence | Convertir la table locale, puis retirer l'adaptateur de lecture. **[non implémenté]** |
| Un drapeau nommé au positif pour le badge mystère | `mysteryBadgeHidden?: boolean`, dont la polarité est retournée deux fois dans le même chemin — à la lecture et à l'écriture — et relue telle quelle ailleurs | Un renommage sans migration de données : aucune sauvegarde n'est à ménager, absent valant « non masqué » des deux côtés. **[non implémenté]** |

### Ce que la V2 a retiré, ou n'a pas repris

Sur ces points, la V2 tranche et l'emporte. **[V2]**

- La V2 n'écrit dans aucun stockage : ce qu'elle recueille vit en mémoire le temps du processus et n'existe plus après. **[non implémenté]**
- Son catalogue de traitements ne porte que des noms et des formes — ni paliers de dose, ni demi-vies. Aucune concentration active, aucun escalier de doses ne s'y calcule.
- Ni poids de départ, ni date de départ : deux valeurs indépendantes, poids actuel et poids visé, qui ne se recopient jamais l'une dans l'autre.
- L'avatar se compose, il ne se photographie pas et ne se tire pas au hasard. Le genre en fait partie et n'est plus une réponse à part.
- Ni niveau d'activité, ni souhait d'activité : supprimés, à ne pas réintroduire.
- Ni suivi hydrique, ni objectifs de poids à paliers, ni enregistrement d'un repas depuis un modèle préenregistré.
- La taille est conservée en centimètres, `tailleCm: number`, et convertie aux deux bouts ; l'année de naissance est un `number`. Seuls le poids et le poids visé sont recueillis en texte, avec un point décimal quelle que soit la langue — `poids: string`, `poidsCible: string`.
- La langue est recueillie sans être branchée : l'application parle la langue détectée. **[non implémenté]**

**Cas limites**

Une sauvegarde illisible n'est pas écrasée : elle est recopiée une fois sous une clé de secours, et plus rien n'est écrit de la session.

Le stockage local plafonne autour de 5 Mo pour toutes les clés réunies, image d'avatar et copies de secours comprises ; rien ne prévient avant le refus, et une écriture refusée est silencieuse.

Une mise à l'abri qui ne se relit pas à l'identique interdit l'écriture qu'elle protégeait : rien n'est écrit plutôt qu'écrire sans filet.

Une pesée antidatée plus ancienne que la pesée de départ devient la pesée de départ ; à date égale, le départ en place le reste.

Supprimer la pesée de départ est possible : la capacité de suppression ne lit pas `isStartingWeight`. L'historique reste alors sans départ jusqu'à la prochaine écriture de pesée, qui repose le drapeau sur la plus ancienne. Seul le vidage complet du journal l'épargne explicitement.

Une prise sans identifiant de traitement est réputée du traitement courant, y compris quand ce traitement a changé depuis, et « aucun » sur un profil neuf.

Les journaux acceptent des lignes datées du futur ; seules les analyses les écartent.

La durée d'un sommeil et les calories d'une séance ne sont jamais conservées : elles se recalculent à chaque lecture.

Une valeur absente reste absente et n'est remplacée par aucune valeur de repli — sauf les deux niveaux de faim d'un repas, que le chargement fabrique et écrit.

> **Exemple.**
>
> Camille, née en 1978, 168 cm, partie de 96 kg en mai 2026, sous Ozempic. Son profil conserve `age: 48` : en 2028 il vaudra toujours 48. Ses dix-neuf prises portent l'identifiant d'Ozempic, écrit à l'enregistrement ; une prise plus ancienne qui n'en porterait aucun serait relue sous le traitement du profil du jour de la lecture. Sa semaine de cure se compte depuis la date de sa pesée à 96 kg. Son objectif de pas vaut 8 000, qu'aucune propriété du profil ne peut porter. Ses repas référencent par identifiant les aliments qu'elle a créés, conservés sous une autre clé que son carnet : copier le carnet seul laisserait ces repas sans composition résoluble.

Ce qui n'a pas pu être fondé sur le code est rangé à part : la migration des noms vers des tables de référence (*inspirations*), le typage du site d'une prise (*inspirations*), l'émission réelle des rappels (*inspirations*), la reprise d'un carnet sur un autre appareil (*inspirations*), le sort des tables qui vivent hors de l'agrégat (*inspirations*), le sort du mécanisme de sauvegarde et de restauration (*inspirations*), l'intégrité des références vers les aliments (*inspirations*), l'harmonisation des plafonds quotidiens (*inspirations*), l'historique des changements de profil (*inspirations*), l'objectif de pas réglable (*inspirations*), le sort de l'entité de journée (*inspirations*).
