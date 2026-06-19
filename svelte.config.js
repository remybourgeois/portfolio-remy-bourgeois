import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    prerender: {
      entries: ['/', '/home', '/projects'],
      handleMissingId: 'ignore',
      handleHttpError: ({ path, message }) => {
        // Ignore missing static assets (e.g. videos not yet committed)
        if (path.startsWith('/assets/')) {
          console.warn(`[prerender] asset not found — skipping: ${path}`);
          return;
        }
        throw new Error(message);
      }
    }
  }
};
