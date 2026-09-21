import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  build: {
    /* LES SONS RESTENT DES FICHIERS (2026-09-21 au soir) : sous 4 Ko, Vite
       les incrusterait dans le code en `data:` — soixante-deux clics du
       catalogue, 130 Ko de plus dans le bundle pour deux sons employés.
       En fichiers, un son n'est chargé que quand il joue. */
    assetsInlineLimit: (fichier) => (fichier.endsWith('.wav') ? false : undefined),
  },
  test: {
    /* Les worktrees des agents (`.claude/worktrees/`) ont leur propre copie
       du dépôt : leurs tests ne sont pas ceux de cet arbre (2026-09-21). */
    exclude: [...configDefaults.exclude, '.claude/**'],
  },
});
