# Brouillons — NE PAS LIRE COMME LA SPÉCIFICATION

Ce dossier met à l'abri, dans le dépôt, tout ce que les agents ont produit et
qui n'est pas encore dans les documents finaux. Rien ici n'est vérifié.

- `inventaire-v1.json` — l'inventaire de la V1 Mixte par neuf lecteurs (écrans,
  fonctionnalités, règles, entités, arbitrages), chaque entrée citant son
  fichier. C'est la source des chapitres.
- `chapitre-<id>.html` — les 21 chapitres de la spec fonctionnelle, **écrits,
  réfutés contre le code, puis corrigés** (2026-09-13). Ce que le code ne
  fondait pas en a été retiré et rangé dans les inventions. Ils ne passent dans
  `spec-fonctionnelle.html` qu'après sa relecture à elle. On les lit assemblés
  dans `docs/brouillons.html`, engendré par `scripts/assembler-chapitres.mjs`.
- `chapitre-<id>.json` — pour chaque chapitre : les inventions relevées par le
  rédacteur (matière du futur `inspirations.html`), son glossaire, son index,
  ses captures attendues.
- `refutation-<id>.json` — les deux réfutations rendues avant le clear du
  2026-09-13 (compte, onboarding). Toutes les autres ont été appliquées
  directement par les correcteurs et ne sont pas conservées à part.
- `captures-manifeste.json` — pour chaque capture de `docs/captures/`, l'écran
  qu'elle montre et ce qu'on y voit.

Ce dossier disparaît quand les quatre documents sont finis.
