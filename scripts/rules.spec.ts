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
  scanContrast,
  scanAutoplay,
  scanEmDash,
  scanGoogleFonts,
  scanHtmlSources,
  scanIntroSceneImport,
  scanVersionPins,
  scanLiteralColors,
  scanSmallType,
  scanEmphasis
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

/* ───────────────────────── Couleurs et typo ───────────────────────── */

test('scanLiteralColors signale un hex et un rgba, laisse passer un rôle', () => {
  const text = [
    '<div style="color: #706bfe"></div>',
    '<div class="shadow-[0_0_8px_rgba(0,0,0,0.5)]"></div>',
    '<div class="bg-primary text-accent"></div>',
    '<div class="bg-[var(--color-primary)]"></div>'
  ].join('\n');
  const v = scanLiteralColors(text, 'x.svelte', 'ds-allow-color');
  assert.deepEqual(
    v.map((x) => x.line),
    [1, 2]
  );
});

test('scanLiteralColors respecte une échappatoire motivée', () => {
  const text = [
    '<!-- ds-allow-color: arrêt de dégradé -->',
    '<stop stop-color="#706bfe" />',
    '<stop stop-color="#38bdf8" /> <!-- ds-allow-color: idem -->'
  ].join('\n');
  assert.deepEqual(scanLiteralColors(text, 'x.svelte', 'ds-allow-color'), []);
});

test('scanLiteralColors ignore un hex écrit en commentaire, pas en chaîne', () => {
  const text = [
    '<!-- le fond est #020205 -->',
    '<script lang="ts">',
    '  // PRIMARY = #706bfe',
    "  const c = '#706bfe';",
    '</script>'
  ].join('\n');
  const v = scanLiteralColors(text, 'x.svelte', 'ds-allow-color');
  assert.deepEqual(
    v.map((x) => x.line),
    [4]
  );
});

test('scanSmallType ne vise que text-[…] et laisse les cibles tactiles', () => {
  const text = [
    '<p class="text-[9px]">x</p>',
    '<button class="min-h-[44px]">y</button>',
    '<p class="text-[12px]">z</p>'
  ].join('\n');
  const v = scanSmallType(text, 'x.svelte', 'ds-allow-typography', 12);
  assert.equal(v.length, 1);
  assert.equal(v[0].line, 1);
  assert.ok(v[0].message.includes('text-[9px]'));
});

test('scanSmallType convertit les rem et respecte une échappatoire', () => {
  assert.equal(
    scanSmallType('<p class="text-[0.6rem]">x</p>', 'x.svelte', 'ds-allow-typography', 12).length,
    1
  );
  const escaped = [
    '<!-- ds-allow-typography: badge décoratif aria-hidden -->',
    '<p class="text-[10px]" aria-hidden="true">x</p>'
  ].join('\n');
  assert.deepEqual(scanSmallType(escaped, 'x.svelte', 'ds-allow-typography', 12), []);
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

/* ───────────────────────── Emphase ───────────────────────── */

test('scanEmphasis signale deux gras dans un paragraphe de données, pas un seul', () => {
  const text = [
    '  description:',
    "    'Un **premier** point et un **second** point.\\n\\nUn seul **fait** ici.',"
  ].join('\n');
  const v = scanEmphasis(text, 'projects.ts', 'script');
  assert.equal(v.length, 1);
  assert.equal(v[0].line, 2);
});

test('scanEmphasis ne compte ni les chiffres ni les libellés de puces', () => {
  const text =
    "    'Adopté par **plus de 15 équipes** et **30 millions** de personnes.\\n\\n• **Un Lab** : pour prototyper.\\n• **Zéro maquette** : itérer dans le code.',";
  assert.deepEqual(scanEmphasis(text, 'projects.ts', 'script'), []);
});

test('scanEmphasis lit les <p> et les snippets lede des composants', () => {
  const text = [
    '<p class="x">',
    '  Un <strong>robot</strong> et un <strong>écran</strong>.',
    '</p>',
    '<p>Un seul <strong>fait</strong>.</p>',
    '{#snippet lede()}',
    '  <strong>IA</strong>, <strong>design system</strong>.',
    '{/snippet}',
    '<!-- <strong>a</strong> <strong>b</strong> en commentaire -->'
  ].join('\n');
  const v = scanEmphasis(text, 'x.svelte', 'svelte');
  assert.deepEqual(
    v.map((x) => x.line),
    [1, 5]
  );
});
