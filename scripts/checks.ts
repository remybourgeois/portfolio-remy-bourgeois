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
//     mode par défaut pour le CI (la base de la PR comparée à sa tête).
//
// Usage :
//   node scripts/checks.ts              toutes les règles, diff contre la base
//   node scripts/checks.ts --staged     mode hook : l'index git
//   node scripts/checks.ts --base <ref> impose la base du diff

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import {
  type Violation,
  parseAddedLines,
  scanContrast,
  scanAutoplay,
  scanEmDash,
  scanGoogleFonts,
  scanHtmlSources,
  scanIntroSceneImport,
  scanVersionPins,
  findLiteralColors,
  findSmallType,
  baseAfterIgnoredRevs,
  parseIgnoreRevs
} from './rules.ts';

const IGNORE_REVS = '.checks-ignore-revs';

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
  versionPinFiles: ['netlify.toml', '.github/workflows/ci.yml']
};

const args = process.argv.slice(2);
const staged = args.includes('--staged');
const baseArg = args.indexOf('--base');
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

/**
 * La base du diff. En CI, DS_BASE_REF porte le merge-base calculé par le
 * workflow : la pointe de `main` ferait rougir toutes les PR ouvertes dès
 * qu'une autre fusionne. En local, on retombe sur origin/main puis main.
 * Base introuvable : la règle de diff est sautée, jamais durcie.
 */
function diffBase(): string | null {
  if (baseArg !== -1 && args[baseArg + 1]) return args[baseArg + 1];

  // DS_BASE_REF est le `base.sha` de l'événement GitHub : il est figé à
  // l'ouverture de la PR, donc il attribuerait à la PR tout ce que `main` a reçu
  // depuis. C'est le merge-base avec la vraie tête qui fait foi.
  if (process.env.DS_BASE_REF) {
    try {
      return git(['merge-base', process.env.DS_BASE_REF, process.env.DS_HEAD_REF || 'HEAD']).trim();
    } catch {
      return null;
    }
  }

  for (const ref of ['origin/main', 'main']) {
    try {
      return git(['merge-base', ref, 'HEAD']).trim();
    } catch {
      /* ref absente : on essaie la suivante */
    }
  }
  return null;
}

function addedLines(): { lines: ReturnType<typeof parseAddedLines>; skipped: string | null } {
  if (staged) {
    return { lines: parseAddedLines(git(['diff', '--staged', '--unified=0'])), skipped: null };
  }
  const base = diffBase();
  if (!base) {
    return { lines: [], skipped: 'base introuvable (ni origin/main ni main)' };
  }
  const head = process.env.DS_HEAD_REF || 'HEAD';
  const from = skipReformatting(base, head);
  return {
    lines: parseAddedLines(git(['diff', '--unified=0', `${from}...${head}`])),
    skipped: null
  };
}

/**
 * Un passage de formateur sur tout le dépôt réécrit chaque ligne. Les commits
 * listés dans `.checks-ignore-revs` ne sont donc imputables à personne : la base
 * du diff avance jusqu'au plus récent d'entre eux présent dans l'intervalle.
 * Le même fichier sert à `git blame` (blame.ignoreRevsFile).
 */
function skipReformatting(base: string, head: string): string {
  const file = join(root, IGNORE_REVS);
  if (!existsSync(file)) return base;
  const revisions = git(['rev-list', `${base}..${head}`]).split('\n');
  const resolved = parseIgnoreRevs(readFileSync(file, 'utf8')).flatMap((rev) => {
    try {
      return [git(['rev-parse', rev]).trim()];
    } catch {
      return []; // révision absente de ce clone : elle ne concerne pas cet intervalle
    }
  });
  return baseAfterIgnoredRevs(revisions, resolved) ?? base;
}

/* ───────────────────────── Exécution ───────────────────────── */

type Result = { name: string; violations: Violation[]; skipped: string | null };
const results: Result[] = [];

const run = (name: string, fn: () => Violation[]) => {
  results.push({ name, violations: fn(), skipped: null });
};
const skip = (name: string, why: string) => {
  results.push({ name, violations: [], skipped: why });
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

const { lines, skipped } = addedLines();
if (skipped) {
  skip('Couleur littérale ajoutée', skipped);
  skip('Pas de typo ajouté', skipped);
} else {
  const svelteAdded = lines.filter((l) => l.file.endsWith('.svelte'));
  run('Couleur littérale ajoutée', () => findLiteralColors(svelteAdded, CONFIG.markers.color));
  run('Pas de typo ajouté', () =>
    findSmallType(svelteAdded, CONFIG.markers.typography, CONFIG.minTypePx)
  );
}

/* ───────────────────────── Rapport ───────────────────────── */

const width = Math.max(...results.map((r) => r.name.length));
let failed = 0;

for (const r of results) {
  const label = r.name.padEnd(width);
  if (r.skipped) console.log(`⚠️  ${label}  sautée : ${r.skipped}`);
  else if (r.violations.length === 0) console.log(`✅ ${label}`);
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
