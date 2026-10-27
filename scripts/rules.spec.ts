// scripts/rules.spec.ts
//
// Chaque règle a ses cas qui passent et ses cas qui échouent. Une règle sans
// test est une règle dont personne ne sait ce qu'elle attrape : c'est elle qui
// décide si une PR est rouge, elle doit donc être vérifiée comme du code.
//
// `node --test` exécute ce fichier directement : Node lit le TypeScript sans
// transpilation, il n'y a pas de framework de test à installer.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  blankComments,
  hasEscape,
  extractHtmlExpressions,
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

/* ───────────────────────── blankComments ───────────────────────── */

test('blankComments garde les positions', () => {
  const text = 'const a = 1; // note\nconst b = 2;';
  const out = blankComments(text, 'script');
  assert.equal(out.length, text.length);
  assert.equal(out.split('\n').length, 2);
  assert.ok(out.startsWith('const a = 1; '));
  assert.ok(!out.includes('note'));
});

test('blankComments ne prend pas un // de URL pour un commentaire', () => {
  const text = "const u = 'https://exemple.fr/a';";
  assert.equal(blankComments(text, 'script'), text);
});

test('blankComments garde les chaînes', () => {
  const text = "const s = 'texte visible'; /* caché */";
  const out = blankComments(text, 'script');
  assert.ok(out.includes('texte visible'));
  assert.ok(!out.includes('caché'));
});

test('blankComments traite le markup et le script séparément', () => {
  const text = [
    '<script lang="ts">',
    '  // caché',
    "  const a = 'gardé';",
    '</script>',
    '',
    '<!-- masqué -->',
    '<p>visible</p>'
  ].join('\n');
  const out = blankComments(text, 'svelte');
  assert.ok(!out.includes('caché'));
  assert.ok(!out.includes('masqué'));
  assert.ok(out.includes('gardé'));
  assert.ok(out.includes('visible'));
});

test('blankComments laisse en markup un <script> indenté dans un littéral', () => {
  // L'injection JSON-LD des routes : si ce <script> ouvrait une région de code,
  // tout le markup qui suit serait lu comme du JavaScript.
  const text = [
    '<svelte:head>',
    '  {@html `<script>${x}<\\/script>`}',
    '</svelte:head>',
    "<p>L'intro</p>"
  ].join('\n');
  const out = blankComments(text, 'svelte');
  assert.ok(out.includes("<p>L'intro</p>"));
});

/* ───────────────────────── hasEscape ───────────────────────── */

test('hasEscape accepte la ligne et celle du dessus, mais exige une raison', () => {
  const lines = [
    '<!-- ds-allow-color: dégradé de marque -->',
    'fill="#706bfe"',
    'autre',
    '<!-- ds-allow-color: -->',
    'encore'
  ];
  assert.equal(hasEscape(lines, 1, 'ds-allow-color'), true);
  assert.equal(hasEscape(lines, 2, 'ds-allow-color'), false);
  assert.equal(
    hasEscape(lines, 4, 'ds-allow-color'),
    false,
    'un marqueur sans raison ne vaut pas échappatoire'
  );
});

/* ───────────────────────── Contraste ───────────────────────── */

test('scanContrast signale sous 50 et laisse passer au-dessus', () => {
  const text = [
    '<p class="text-white/40">bas</p>',
    '<p class="text-white/50">plancher</p>',
    '<p class="text-white/70">haut</p>'
  ].join('\n');
  const v = scanContrast(text, 'a.svelte', 'ds-allow-contrast');
  assert.equal(v.length, 1);
  assert.equal(v[0].line, 1);
});

test('scanContrast comprend la forme arbitraire', () => {
  const v = scanContrast('<p class="text-white/[0.35]">x</p>', 'a.svelte', 'ds-allow-contrast');
  assert.equal(v.length, 1);
});

test('scanContrast respecte une échappatoire motivée', () => {
  const text = [
    '<!-- ds-allow-contrast: piste du cercle de progression, pas du texte -->',
    '<path class="text-white/10" />'
  ].join('\n');
  assert.deepEqual(scanContrast(text, 'a.svelte', 'ds-allow-contrast'), []);
});

test('scanContrast ignore un exemple écrit en commentaire', () => {
  assert.deepEqual(
    scanContrast('<!-- ne pas écrire text-white/20 -->', 'a.svelte', 'ds-allow-contrast'),
    []
  );
});

/* ───────────────────────── Autoplay ───────────────────────── */

test('scanAutoplay signale un autoplay nu', () => {
  const v = scanAutoplay('<video src="a.mp4" autoplay />', 'a.svelte', 'ds-allow-autoplay');
  assert.equal(v.length, 1);
});

test('scanAutoplay respecte une échappatoire motivée', () => {
  const text = [
    '<!-- ds-allow-autoplay: lightbox ouverte par un clic du visiteur -->',
    '<video src="a.mp4" controls autoplay />'
  ].join('\n');
  assert.deepEqual(scanAutoplay(text, 'a.svelte', 'ds-allow-autoplay'), []);
});

test('scanAutoplay ne se déclenche pas sur le mot dans un commentaire', () => {
  assert.deepEqual(
    scanAutoplay("<!-- les vidéos n'ont pas d'autoplay -->", 'a.svelte', 'ds-allow-autoplay'),
    []
  );
});

/* ───────────────────────── Tiret cadratin ───────────────────────── */

test('scanEmDash signale le contenu et épargne les commentaires', () => {
  const text = ['// un commentaire — toléré', "const titre = 'Design — et code';"].join('\n');
  const v = scanEmDash(text, 'a.ts', 'script');
  assert.equal(v.length, 1);
  assert.equal(v[0].line, 2);
});

test('scanEmDash épargne un commentaire HTML', () => {
  assert.deepEqual(scanEmDash('<!-- Header — version A -->', 'a.svelte', 'svelte'), []);
});

/* ───────────────────────── Google Fonts ───────────────────────── */

test('scanGoogleFonts attrape les deux domaines', () => {
  const text = [
    '<link href="https://fonts.googleapis.com/css2?family=X" />',
    '<link href="https://fonts.gstatic.com/s/x.woff2" />'
  ].join('\n');
  assert.equal(scanGoogleFonts(text, 'app.html').length, 2);
});

test('scanGoogleFonts laisse passer la police auto-hébergée', () => {
  assert.deepEqual(scanGoogleFonts("@import '@fontsource-variable/dm-sans';", 'app.css'), []);
});

/* ───────────────────────── Sources de {@html} ───────────────────────── */

test('extractHtmlExpressions suit une expression multiligne', () => {
  const text = [
    '<svelte:head>',
    '  {@html `<script>${jsonLd({',
    '    "a": { "b": 1 }',
    '  })}<\\/script>`}',
    '</svelte:head>'
  ].join('\n');
  const found = extractHtmlExpressions(text);
  assert.equal(found.length, 1);
  assert.equal(found[0].line, 2);
  assert.ok(found[0].expr.includes('jsonLd('));
});

test('scanHtmlSources accepte md() et jsonLd(), refuse le reste', () => {
  const ok = [
    '<p>{@html md(project.description)}</p>',
    '{@html `<script>${jsonLd({ a: 1 })}<\\/script>`}'
  ].join('\n');
  assert.deepEqual(scanHtmlSources(ok, 'a.svelte', 'ds-allow-html', ['md', 'jsonLd']), []);

  const ko = '<p>{@html project.description}</p>';
  assert.equal(scanHtmlSources(ko, 'a.svelte', 'ds-allow-html', ['md', 'jsonLd']).length, 1);
});

test('scanHtmlSources refuse un gabarit qui recompose du HTML à la main', () => {
  const ko = '<p>{@html `<b>${titre}</b>`}</p>';
  assert.equal(scanHtmlSources(ko, 'a.svelte', 'ds-allow-html', ['md', 'jsonLd']).length, 1);
});

/* ───────────────────────── IntroScene ───────────────────────── */

test("scanIntroSceneImport n'accepte l'import que sous /intro", () => {
  const line = "  import IntroScene from '$lib/components/IntroScene.svelte';";
  assert.deepEqual(
    scanIntroSceneImport(line, 'src/routes/intro/+page.svelte', 'src/routes/intro/'),
    []
  );
  assert.equal(
    scanIntroSceneImport(line, 'src/routes/+page.svelte', 'src/routes/intro/').length,
    1
  );
});

/* ───────────────────────── Versions de Node ───────────────────────── */

test('scanVersionPins attrape les deux formes de doublon', () => {
  const v = scanVersionPins([
    { file: 'netlify.toml', text: '[build.environment]\n  NODE_VERSION = "20"' },
    { file: 'ci.yml', text: '        with:\n          node-version: 20' }
  ]);
  assert.equal(v.length, 2);
});

test('scanVersionPins laisse passer node-version-file', () => {
  const v = scanVersionPins([
    { file: 'ci.yml', text: '          node-version-file: .node-version' }
  ]);
  assert.deepEqual(v, []);
});

/* ───────────────────────── Diff ───────────────────────── */

test('parseAddedLines numérote dans le fichier d’arrivée', () => {
  const diff = [
    'diff --git a/x.svelte b/x.svelte',
    '--- a/x.svelte',
    '+++ b/x.svelte',
    '@@ -10,3 +10,4 @@',
    ' contexte',
    '+ajoutée',
    ' contexte',
    '-retirée'
  ].join('\n');
  const added = parseAddedLines(diff);
  assert.equal(added.length, 1);
  assert.deepEqual(added[0], { file: 'x.svelte', line: 11, text: 'ajoutée' });
});

test('findLiteralColors ne regarde que ce que le diff ajoute', () => {
  const added = parseAddedLines(
    [
      '+++ b/x.svelte',
      '@@ -1,0 +1,2 @@',
      '+<div style="color: #706bfe" />',
      '+<div class="bg-[var(--color-primary)]" />'
    ].join('\n')
  );
  const v = findLiteralColors(added, 'ds-allow-color');
  assert.equal(v.length, 1);
  assert.equal(v[0].line, 1);
});

test('findLiteralColors respecte une échappatoire sur la ligne ajoutée', () => {
  const added = parseAddedLines(
    [
      '+++ b/x.svelte',
      '@@ -1,0 +1,1 @@',
      '+<stop stop-color="#706bfe" /> <!-- ds-allow-color: arrêt de dégradé -->'
    ].join('\n')
  );
  assert.deepEqual(findLiteralColors(added, 'ds-allow-color'), []);
});

test('findSmallType ne vise que text-[…] et laisse les cibles tactiles', () => {
  const added = parseAddedLines(
    [
      '+++ b/x.svelte',
      '@@ -1,0 +1,3 @@',
      '+<p class="text-[9px]">x</p>',
      '+<button class="min-h-[44px]">y</button>',
      '+<p class="text-[12px]">z</p>'
    ].join('\n')
  );
  const v = findSmallType(added, 'ds-allow-typography', 12);
  assert.equal(v.length, 1);
  assert.ok(v[0].message.includes('text-[9px]'));
});

test('findSmallType convertit les rem', () => {
  const added = parseAddedLines(
    ['+++ b/x.svelte', '@@ -1,0 +1,1 @@', '+<p class="text-[0.6rem]">x</p>'].join('\n')
  );
  assert.equal(findSmallType(added, 'ds-allow-typography', 12).length, 1);
});

/* ───────────────────────── Révisions non imputables ───────────────────────── */

test('parseIgnoreRevs lit les SHA et ignore commentaires et vide', () => {
  const text = [
    '# Reformatage initial',
    'bc8cb4e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
    '',
    '  deadbeef  # autre',
    'pas-un-sha'
  ].join('\n');
  assert.deepEqual(parseIgnoreRevs(text), ['bc8cb4e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7', 'deadbeef']);
});

test('baseAfterIgnoredRevs avance jusqu’au reformatage le plus récent', () => {
  // rev-list donne du plus récent au plus ancien.
  const revisions = ['aaa', 'bbb', 'ccc', 'ddd'];
  assert.equal(baseAfterIgnoredRevs(revisions, ['ccc']), 'ccc');
});

test('baseAfterIgnoredRevs garde les commits plus récents dans le périmètre', () => {
  // 'aaa' et 'bbb' restent évalués : la base devient 'ccc', pas 'aaa'.
  assert.equal(baseAfterIgnoredRevs(['aaa', 'bbb', 'ccc'], ['ccc', 'zzz']), 'ccc');
});

test('baseAfterIgnoredRevs ne touche à rien sans reformatage dans l’intervalle', () => {
  assert.equal(baseAfterIgnoredRevs(['aaa', 'bbb'], ['ccc']), null);
  assert.equal(baseAfterIgnoredRevs(['aaa', 'bbb'], []), null);
});

/* ───────────── Échappatoire et attributs éclatés par Prettier ───────────── */

test('hasEscape remonte à l’ouverture de l’élément', () => {
  const lines = [
    '<svg aria-hidden="true">',
    '  <!-- ds-allow-contrast: piste de progression, pas du texte -->',
    '  <path',
    '    class="text-white/10"',
    '  />'
  ];
  assert.equal(hasEscape(lines, 3, 'ds-allow-contrast'), true);
});

test('hasEscape ne traverse pas un élément fermé', () => {
  const lines = [
    '  <!-- ds-allow-autoplay: lightbox -->',
    '  <img src="a.webp" />',
    '  <video',
    '    autoplay'
  ];
  // L'échappatoire porte sur l'<img>, pas sur la <video> qui suit.
  assert.equal(hasEscape(lines, 3, 'ds-allow-autoplay'), false);
});

test('hasEscape reste vrai sur la ligne et celle du dessus', () => {
  assert.equal(hasEscape(['<!-- m: raison -->', 'x'], 1, 'm'), true);
  assert.equal(hasEscape(['x <!-- m: raison -->'], 0, 'm'), true);
});
