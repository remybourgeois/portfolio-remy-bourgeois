// scripts/checks.ts
//
// Point d'entrée unique des invariants du projet. Ceux du CLAUDE.md qui
// n'étaient écrits qu'en prose sont vérifiés ici ; ceux qui demandent un
// navigateur (contraste réel mesuré par axe, absence de MP3 hors /intro,
// structure SEO) restent dans les tests Playwright, qui sont le bon outil.
//
// Propriétés tenues, reprises du ds-check du kit :
//
//   - toutes les règles s'exécutent, sans s'arrêter à la première violation,
//     et le rapport est unique : une ligne par règle, puis le détail ;
//   - déterministe : pas d'horloge, pas de réseau, pas d'aléatoire ;
//   - chaque règle est une fonction pure, testée dans rules.spec.ts, séparée
//     de ce « runner » qui est le seul à lire git et le disque ;
//   - deux modes, le même code : `--staged` pour le hook (l'index git) et le
//     mode par défaut pour le CI (tous les fichiers suivis).
//
// Toutes les règles sont des scans complets. Les règles « Couleur littérale »
// et « Pas de typo sous 12 px » tournaient en mode diff tant que l'existant
// était sale ; il a été migré vers les rôles de `@theme`, et le mode diff, sa
// base, son merge-base et `.checks-ignore-revs` ont été retirés avec lui.
//
// Usage :
//   node scripts/checks.ts              toutes les règles, tous les fichiers suivis
//   node scripts/checks.ts --staged     mode hook : l'index git

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, openSync, readSync, closeSync } from 'node:fs';
import { join } from 'node:path';

import {
  type Violation,
  scanContrast,
  scanAutoplay,
  scanEmDash,
  scanGoogleFonts,
  scanHtmlSources,
  scanIntroSceneImport,
  scanVersionPins,
  scanLiteralColors,
  scanSmallType,
  scanEmphasis,
  scanFaststart
} from './rules.ts';

const CONFIG = {
  minTypePx: 12,
  introSceneDir: 'src/routes/intro/',
  htmlSources: ['md', 'jsonLd'],
  markers: {
    contrast: 'ds-allow-contrast',
    autoplay: 'ds-allow-autoplay',
    html: 'ds-allow-html',
    color: 'ds-allow-color',
    typography: 'ds-allow-typography'
  },
  // La scène WebGL passe ses couleurs à Three.js en JavaScript, où une classe
  // Tailwind n'existe pas : ses hex sont des constantes de scène, pas du style.
  literalColorExempt: ['src/lib/components/IntroScene.svelte'],
  versionPinFiles: ['netlify.toml', '.github/workflows/ci.yml']
};

const args = process.argv.slice(2);
const staged = args.includes('--staged');
const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();

function git(argv: string[]): string {
  return execFileSync('git', argv, { cwd: root, encoding: 'utf8' });
}

function read(file: string): string {
  return readFileSync(join(root, file), 'utf8');
}

/** Les fichiers suivis par git dans un périmètre, ou ceux de l'index en mode hook. */
function filesIn(prefixes: string[], extensions: string[]): string[] {
  const listing = staged
    ? git(['diff', '--staged', '--name-only', '--diff-filter=d'])
    : git(['ls-files']);

  return listing
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)
    .filter((f) => prefixes.some((p) => f.startsWith(p)))
    .filter((f) => extensions.some((e) => f.endsWith(e)))
    .filter((f) => existsSync(join(root, f)));
}

/* ───────────────────────── Exécution ───────────────────────── */

type Result = { name: string; violations: Violation[] };
const results: Result[] = [];

const run = (name: string, fn: () => Violation[]) => {
  results.push({ name, violations: fn() });
};

const svelteFiles = filesIn(['src/'], ['.svelte']);
const contentFiles = filesIn(['src/lib/data/'], ['.ts']);

run('Contraste', () =>
  svelteFiles.flatMap((f) => scanContrast(read(f), f, CONFIG.markers.contrast))
);

run('Autoplay', () =>
  svelteFiles.flatMap((f) => scanAutoplay(read(f), f, CONFIG.markers.autoplay))
);

run('Tiret cadratin', () => [
  ...svelteFiles.flatMap((f) => scanEmDash(read(f), f, 'svelte')),
  ...contentFiles.flatMap((f) => scanEmDash(read(f), f, 'script'))
]);

run('Police auto-hébergée', () =>
  filesIn(['src/'], ['.svelte', '.html', '.css', '.ts']).flatMap((f) => scanGoogleFonts(read(f), f))
);

run('Sources de {@html}', () =>
  svelteFiles.flatMap((f) => scanHtmlSources(read(f), f, CONFIG.markers.html, CONFIG.htmlSources))
);

run('IntroScene hors /intro', () =>
  svelteFiles.flatMap((f) => scanIntroSceneImport(read(f), f, CONFIG.introSceneDir))
);

run('Version de Node', () =>
  scanVersionPins(
    CONFIG.versionPinFiles
      .filter((f) => existsSync(join(root, f)))
      .map((f) => ({ file: f, text: read(f) }))
  )
);

run('Vidéo faststart', () =>
  filesIn(['static/assets/'], ['.mp4']).flatMap((f) => {
    // 64 Ko suffisent : avec faststart, `moov` suit immédiatement `ftyp`.
    const fd = openSync(join(root, f), 'r');
    const head = new Uint8Array(65536);
    const n = readSync(fd, head, 0, head.length, 0);
    closeSync(fd);
    return scanFaststart(head.subarray(0, n), f);
  })
);

run('Emphase', () => [
  ...svelteFiles.flatMap((f) => scanEmphasis(read(f), f, 'svelte')),
  ...contentFiles.flatMap((f) => scanEmphasis(read(f), f, 'script'))
]);

run('Couleur littérale', () =>
  svelteFiles
    .filter((f) => !CONFIG.literalColorExempt.includes(f))
    .flatMap((f) => scanLiteralColors(read(f), f, CONFIG.markers.color))
);

run('Pas de typo sous 12 px', () =>
  svelteFiles.flatMap((f) => scanSmallType(read(f), f, CONFIG.markers.typography, CONFIG.minTypePx))
);

/* ───────────────────────── Rapport ───────────────────────── */

const width = Math.max(...results.map((r) => r.name.length));
let failed = 0;

for (const r of results) {
  const label = r.name.padEnd(width);
  if (r.violations.length === 0) console.log(`✅ ${label}`);
  else {
    failed += r.violations.length;
    console.log(`❌ ${label}  ${r.violations.length}`);
  }
}

if (failed > 0) {
  console.log('');
  for (const r of results) {
    for (const v of r.violations) {
      console.log(`   ${v.file}:${v.line}: ${v.message}`);
    }
  }
  console.log('');
  console.log(
    `${failed} violation(s). Une exception légitime s'écrit avec sa raison, par exemple :\n` +
      `   <!-- ds-allow-autoplay: lightbox ouverte par un clic du visiteur -->`
  );
  process.exit(1);
}

console.log(`\n${results.length} règle(s), aucune violation.`);
