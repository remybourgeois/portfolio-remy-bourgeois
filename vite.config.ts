import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    fs: {
      // Autorise l'accès au node_modules dans le dossier parent (worktree)
      allow: ['../../..', '.']
    }
  }
});
