# GLP1LOW — le modèle en bref

*Ce que l'application enregistre, ce qu'elle permet, ce qu'elle calcule, et ce
qu'elle refuse de faire. Sans un mot d'interface.*

Synthèse de la spécification abstraite, qui fait dix chapitres et 493 ko. Tout
ce qui suit y est développé, avec les preuves prises dans le code. Rien n'est
ajouté ici qui n'y soit.

---

## 1. Ce que le produit est

Un carnet de suivi personnel pour une personne sous traitement GLP-1, en
injection ou en comprimé. Il enregistre ce qui se passe pendant la cure, le
restitue en totaux, moyennes, séries et échéances, et produit un document
destiné à un professionnel de santé. Une seule personne par installation.
Toutes les données de suivi vivent sur l'appareil.

Le modèle tient en trois pièces. Un **profil** : qui est la personne, ce
qu'elle prend, ce qu'elle vise, ce qu'elle suit. Des **journaux** : des
collections de lignes datées, une ligne par fait relevé. Des **référentiels** :
les listes que la personne compose elle-même, et auxquelles ses lignes
renvoient par identifiant.

Le profil et les journaux forment un document unique, sous une clé de stockage
unique. Les référentiels vivent à côté, une clé chacun. Aucune structure ne
porte plus d'un profil, et aucune ligne ne porte d'identifiant de personne :
l'appartenance des données est celle de l'appareil, pas celle d'un compte.

### Les six non-buts

| Non-but | Ce qu'il exclut |
| --- | --- |
| Pas de diagnostic | Aucun état de santé n'est déduit d'un relevé. Une seule exception, nommée : l'indice de masse corporelle est rangé en six catégories cliniques. C'est la seule qualification de normalité du modèle. |
| Pas de posologie | Aucune dose n'est corrigée ni prescrite. Le catalogue porte cependant des paliers de dose destinés à la saisie, et l'un d'eux est retenu d'avance. |
| Pas de conseil | Aucune recommandation nutritionnelle, sportive ou médicamenteuse n'est engendrée. Les objectifs quotidiens sont des valeurs modifiables, pas des prescriptions. |
| Pas de comparaison | Aucune donnée d'une autre personne n'entre dans le modèle. Ni classement, ni moyenne de population, ni réseau. |
| Pas de synchronisation | Aucun compte partagé, aucun accès soignant, aucune copie distante des journaux. |
| Pas de capteur | Aucune connexion à un objet connecté ni à une plateforme de santé. Tout relevé est écrit par la personne. |

---

## 2. Ce qu'il enregistre

Huit domaines de relevé. Sept portent un drapeau d'activation ; le poids n'en a
pas et ne se désactive pas. Chaque ligne porte un identifiant, un jour, et le
plus souvent une heure.

| Domaine | Ce qu'une ligne enregistre | Par jour |
| --- | --- | --- |
| Poids | Poids en kilogrammes, jusqu'à neuf mensurations en centimètres, un drapeau de départ. | une seule, les suivantes fusionnent |
| Traitement | Dose en milligrammes, zone d'administration, note, identifiant du traitement. | deux |
| Effets secondaires | Type d'effet, sévérité entière de 1 à 5, note. | quinze |
| Alimentation | Famille du repas, composition en quantités d'aliments, faim avant et après de 0 à 5. | trente, au-delà c'est refusé |
| Pas | Un nombre de pas. Pas d'heure. | sans plafond ni unicité |
| Activité physique | Nom de l'activité, intensité ressentie, durée en minutes, distance facultative. | quinze |
| Sommeil | Deux bords, coucher et réveil, nature nuit ou sieste, qualité de 0 à 5. | sans plafond, sans recouvrement |
| Temps pour soi | Nom du moment, durée en minutes. | quinze |

Les référentiels sont au nombre de six : les aliments personnalisés, les
compteurs de choix, les repas favoris, les types d'effets actifs, les activités
actives et les moments actifs. Une recette n'est pas un type à part : c'est un
aliment personnalisé qui porte sa composition et une marque. La création
d'aliments est plafonnée par jour, cinquante aliments et vingt recettes, quotas
indépendants.

---

## 3. Ce qu'on peut faire

Quatre familles de verbes, et rien d'autre.

- **Enregistrer** : créer, modifier et supprimer une ligne dans l'un des huit
  journaux, créer, modifier et supprimer une entrée de référentiel, modifier le
  profil.
- **Dériver** : calculer des totaux, des moyennes, des séries, des échéances,
  des paliers et des projections à partir des lignes, sans jamais rien
  réécrire.
- **Importer** : verser dans les référentiels une fiche nutritionnelle obtenue
  d'une base ouverte à partir d'un code-barres, et une photographie choisie sur
  l'appareil.
- **Rendre transmissible** : produire, sur une période choisie, un document
  destiné à un professionnel de santé.

Trois écritures seulement n'ont pas pour cause un geste de la personne : la
pesée de départ semée à l'installation, le jeu de données de démonstration, et
les conversions de forme rejouées à chaque chargement d'une sauvegarde.

---

## 4. Ce qu'il calcule

Rien de ce qui suit n'est stocké. Chaque grandeur est recalculée depuis les
journaux, et chacune dit ce qu'elle rend quand ses entrées manquent — ce qui
fait la moitié de sa définition.

- Le poids actif à une date, et l'indice de masse corporelle avec ses six
  catégories.
- Le métabolisme de base, par la formule de Mifflin-St Jeor.
- Les dépenses actives, celles des pas et celles des séances.
- La balance énergétique et sa tendance.
- La projection de poids et la cadence de perte.
- Les deux pertes, depuis le début et depuis la dernière pesée, et leurs
  durées.
- L'avancement vers la cible.
- La concentration sanguine du traitement, depuis les demi-vies du catalogue.
- Les objectifs nutritionnels du jour, fibres comprises.
- Les paliers des quatre distinctions, sur des fenêtres comptées.
- Les équivalences insolites d'un poids perdu, en objets.

---

## 5. Les règles qui tiennent l'ensemble

### Grandeurs

Une valeur se conserve en unité métrique de base, sans étiquette : kilogrammes,
centimètres, grammes ou millilitres, milligrammes, minutes, mètres. Le système
d'unités choisi ne décide que de l'unité vers l'extérieur. Les bornes n'écartent
que l'absurde et ne disent jamais à quelqu'un quel corps il a le droit d'avoir.

> **La faille.** Cette doctrine n'est réellement tenue que pour la taille, seule
> grandeur à disposer de fonctions de conversion. Pour le poids, aucun code ne
> la tient : la V2 le conserve sous forme de chaîne, dans l'unité affichée, sans
> conversion. C'est la principale faille du modèle, et elle est nommée comme
> telle.

### Temps

Tout est daté par un jour local et, le plus souvent, par une heure murale.
Jamais d'UTC : une date universelle recule d'un jour en soirée. Le fuseau et la
langue sont indépendants. Les heures retenues tombent sur des minutes rondes.
L'instant de référence est toujours injecté par l'appelant, jamais lu par la
fonction qui calcule.

### Les dix-neuf invariants

Ils priment sur toute règle particulière : une capacité qui les contredirait
n'est pas une capacité du produit.

1. Rien de dérivable n'est stocké.
2. On référence par identifiant, jamais par nom.
3. L'identifiant d'une ligne est unique et stable.
4. Supprimer supprime.
5. Un journal absent vaut le journal vide.
6. Une valeur absente se tait.
7. Aucune suite ne se décide sur un silence.
8. Les unités stockées sont canoniques.
9. Les bornes n'écartent que l'absurde.
10. Les dates sont locales.
11. L'ordre est celui des dates.
12. Les heures tombent sur des minutes rondes.
13. Une seule pesée par jour.
14. Le poids de départ est la pesée la plus ancienne.
15. Le poids de départ ne se supprime pas.
16. Deux plages de sommeil ne se recouvrent pas.
17. Les fibres comptent partout.
18. Une seule personne par installation.
19. Une sauvegarde ancienne reste lisible.

---

## 6. Où vivent les données, et ce qui en sort

Tout tient sur l'appareil, dans un magasin de paires clé-valeur. Une sauvegarde
illisible n'est jamais écrasée : sa chaîne brute est recopiée sous une clé de
secours. Quand la place manque, l'écriture échoue. Changer d'appareil ne
transporte rien, et effacer le stockage local efface l'historique.

| Ce qui sort | Vers où |
| --- | --- |
| Le bilan de suivi, document paginé borné à une période | l'appareil lui-même : il est produit localement, il n'est envoyé nulle part |
| Une image de progression et sa légende | l'appareil, le partage du système, ou un service tiers si la personne le choisit |
| Une réponse au questionnaire, un retour écrit | une base distante, rangés sous l'identifiant du compte |

Ne sortent jamais : les journaux eux-mêmes. Il n'existe aucune remontée du
carnet, aucun rétablissement depuis un serveur, aucun partage entre appareils.

> **Le compte ne porte rien.** Il ouvre l'accès quand il est configuré, et c'est
> tout. La sauvegarde n'est pas indexée par compte : deux comptes ouverts tour à
> tour sur le même appareil lisent et écrivent le même document. Sans
> configuration d'authentification, l'accès est ouvert sans compte.

---

## 7. Ce que le modèle ne fait pas

Des limites vérifiées dans le code, pas des regrets. Une collection est déclarée
et morte : elle ne porte qu'un identifiant et une date, aucun geste n'y écrit.
Plusieurs types sont déclarés sans qu'aucune donnée soit derrière. Quatre
endroits dérogent au premier principe et référencent par un nom là où il faut un
identifiant — le type d'un effet, le nom d'un sport, celui d'un moment pour soi,
et le libellé d'une famille de repas conservé alors qu'il se recalcule. La
conséquence est mesurée : renommer une entrée de catalogue impose de réécrire
l'historique. Le système d'unités, enfin, est déclaré dans le profil sans être
ni lu ni écrit nulle part.

Ce qui attend une décision plutôt qu'un constat — 105 arbitrages pris sans
validation et 348 idées que le code ne fonde pas — est rassemblé dans le
document *Inspirations*.
