import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: '404.html' }),

    // CSP générée au build : SvelteKit calcule les hash des scripts qu'il inline
    // (hydratation, JSON-LD), donc pas de 'unsafe-inline' sur script-src.
    csp: {
      mode: 'hash',
      directives: {
        'default-src': ['self'],
        'script-src': ['self'],
        // Tailwind et les styles inlinés par Svelte imposent 'unsafe-inline' ici.
        'style-src': ['self', 'unsafe-inline'],
        'img-src': ['self', 'data:'],
        'media-src': ['self'],
        'font-src': ['self'],
        'connect-src': ['self'],
        // Pas de frame-ancestors ici : le site étant prérendu, SvelteKit pose la
        // CSP dans une balise <meta>, où cette directive est ignorée par les
        // navigateurs. C'est X-Frame-Options: DENY (netlify.toml) qui la porte.
        'base-uri': ['self'],
        'form-action': ['self'],
        'object-src': ['none']
      }
    },

    prerender: {
      entries: ['/', '/intro', '/a-propos', '/projects', '/sitemap.xml', '/llms.txt'],
      handleMissingId: 'ignore'
      // Plus de handleHttpError permissif : l'exception sur /assets/ laissait
      // partir en production toute image ou vidéo référencée mais absente.
      // Tous les médias sont committés, le build doit donc échouer si l'un manque.
    }
  }
};
