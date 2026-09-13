# Brouillons — NE PAS LIRE COMME LA SPÉCIFICATION

Ce dossier met à l'abri, dans le dépôt, tout ce que les agents ont produit et
qui n'est pas encore dans les documents finaux. Rien ici n'est vérifié.

- `inventaire-v1.json` — l'inventaire de la V1 Mixte par neuf lecteurs (écrans,
  fonctionnalités, règles, entités, arbitrages), chaque entrée citant son
  fichier. C'est la source des chapitres.
- `chapitre-<id>.html` — les chapitres ÉCRITS de la spec fonctionnelle, **non
  réfutés, non corrigés** : ils peuvent contenir des affirmations que le code
  ne fonde pas. Ils ne passent dans `spec-fonctionnelle.html` qu'après
  réfutation contre le code et correction.
- `chapitre-<id>.json` — pour chaque chapitre : les inventions relevées par le
  rédacteur (matière du futur `inspirations.html`), son glossaire, son index,
  ses captures attendues.
- `refutation-<id>.json` — les réfutations déjà rendues (compte, onboarding),
  pas encore appliquées.
- `captures-manifeste.json` — pour chaque capture de `docs/captures/`, l'écran
  qu'elle montre et ce qu'on y voit.

Ce dossier disparaît quand les quatre documents sont finis.
