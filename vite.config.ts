import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss(), sveltekit()],

  // Aucun console.log ni debugger dans le bundle de production : les traces du
  // moteur audio partaient jusque-là sur le site publié.
  esbuild: {
    drop: mode === 'production' ? (['console', 'debugger'] as const).slice() : []
  },

  server: {
    fs: {
      // Autorise l'accès au node_modules dans le dossier parent (worktree)
      allow: ['../../..', '.']
    }
  }
}));
