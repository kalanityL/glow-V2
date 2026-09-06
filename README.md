# V2

Nouvelle version de l'application, repartie de zéro : rien n'est repris du dépôt
précédent (`REPO-GIT-LOCAL`). Aujourd'hui, l'application affiche une page
blanche, et c'est tout — aucune page, aucune fonctionnalité, aucun thème, aucun
template.

## Faire tourner

```sh
npm install
npm run dev        # serveur de développement
npm run build      # typecheck + build de production dans dist/
npm run typecheck  # TypeScript seul
```

Socle technique : React 19, TypeScript, Vite. Rien d'autre — pas de Tailwind,
pas de Firebase, pas de bibliothèque de composants. On ajoutera au fur et à
mesure, jamais par recopie.
