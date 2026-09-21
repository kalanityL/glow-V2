import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    /* Les worktrees des agents (`.claude/worktrees/`) ont leur propre copie
       du dépôt : leurs tests ne sont pas ceux de cet arbre (2026-09-21). */
    exclude: [...configDefaults.exclude, '.claude/**'],
  },
});
