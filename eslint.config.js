import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      // `_` marque un paramètre délibérément ignoré, par exemple l'élément d'un
      // {#each} dont seul l'index sert.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
      ],

      // Un ternaire en position d'instruction (`cond ? a() : b()`) est une forme
      // utilisée dans les boucles chaudes de la scène WebGL : lisible et sans effet
      // de bord caché.
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true }
      ]
    }
  },

  // Lint typé sur les sources seulement. Le service de projet ne voit que ce que
  // couvre le tsconfig généré par SvelteKit (src et tests) : `scripts/` et les
  // fichiers de configuration en sont absents et le feraient échouer. Ils restent
  // lintés, sans les règles qui demandent les types.
  {
    files: ['src/**/*.ts', 'src/**/*.svelte'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: ts.parser,
        svelteConfig
      }
    },
    rules: {
      // Garde les formes dépréciées de Svelte 5 et SvelteKit 2 hors du code neuf.
      '@typescript-eslint/no-deprecated': 'error'
    }
  },

  {
    files: ['**/*.svelte'],
    rules: {
      // goto/pushState/replaceState passent par resolve(). Les liens sont laissés
      // de côté : le site est prérendu et ses href sont littéraux.
      'svelte/no-navigation-without-resolve': ['error', { ignoreLinks: true }],

      // Le site n'a aucune entrée utilisateur : tout `{@html}` rend du contenu du
      // dépôt, et les deux seules sources autorisées échappent le HTML (`md()`) ou
      // les chevrons (`jsonLd()`). Plutôt qu'une dérogation par site d'appel, la
      // règle « html-sources » de scripts/checks.ts vérifie qu'aucune autre
      // expression n'arrive dans un `{@html}`.
      'svelte/no-at-html-tags': 'off',

      // `<\/script>` dans un littéral de gabarit n'est pas un échappement inutile :
      // sans lui, le `</script>` fermerait la balise qui contient l'expression.
      'no-useless-escape': 'off',

      // ESLint ne reproduit pas tous les avertissements du compilateur Svelte : il
      // a déclaré « inutile » un svelte-ignore dont le retrait fait réapparaître
      // l'avertissement dans `npm run check`. C'est svelte-check qui fait autorité
      // sur les directives svelte-ignore.
      'svelte/no-unused-svelte-ignore': 'off',

      // Les listes du site sont des tableaux constants, prérendus, qui ne sont
      // jamais réordonnés ni filtrés à l'exécution : une clé n'apporterait rien
      // et l'index en tiendrait lieu. À réactiver le jour où une liste devient
      // dynamique.
      'svelte/require-each-key': 'off'
    }
  },

  // Les tests pilotent un navigateur : console et expressions de Playwright y sont normales.
  {
    files: ['tests/**/*.ts', 'scripts/**/*.ts'],
    rules: { 'no-console': 'off' }
  },

  {
    ignores: [
      'build/',
      '.svelte-kit/',
      'node_modules/',
      'test-results/',
      'playwright-report/',
      'static/'
    ]
  }
);
