// scripts/rules.ts
//
// Les invariants du projet, en fonctions pures : du texte en entrée, des
// violations en sortie. Aucune lecture de disque, aucun appel à git, aucune
// horloge : tout l'accès au monde extérieur est dans checks.ts. C'est ce qui
// rend ces règles testables une par une (rules.spec.ts).

export type Violation = {
  file: string;
  line: number;
  message: string;
};

/* ───────────────────────── Outillage commun ───────────────────────── */

/**
 * Blanchit les commentaires en gardant les positions : chaque caractère retiré
 * devient une espace, les sauts de ligne sont conservés. Les numéros de ligne et
 * de colonne restent donc exacts, et une règle ne peut pas confondre un exemple
 * écrit en commentaire avec du code réel.
 *
 * Les chaînes, elles, sont conservées : le contenu visible du site vit dans des
 * littéraux (`src/lib/data/*.ts`), et plusieurs règles doivent le voir.
 *
 * Le découpage markup / script est volontairement simple : seul un `<script` ou
 * un `<style` en début de ligne ouvre une région de code. Un `<script>` écrit
 * dans un littéral de gabarit (l'injection JSON-LD des routes) est indenté, donc
 * il reste du markup — ce qui est le comportement voulu.
 */
export function blankComments(text: string, kind: 'svelte' | 'script'): string {
  const out = text.split('');

  const blank = (from: number, to: number) => {
    for (let i = from; i < to && i < out.length; i++) {
      if (out[i] !== '\n') out[i] = ' ';
    }
  };

  const regions: Array<{ start: number; end: number; code: boolean }> = [];
  if (kind === 'script') {
    regions.push({ start: 0, end: text.length, code: true });
  } else {
    const opener = /^<(script|style)\b[^>]*>/gm;
    let cursor = 0;
    let m: RegExpExecArray | null;
    while ((m = opener.exec(text)) !== null) {
      const bodyStart = m.index + m[0].length;
      const closeTag = `</${m[1]}>`;
      const closeAt = text.indexOf(closeTag, bodyStart);
      const bodyEnd = closeAt === -1 ? text.length : closeAt;
      regions.push({ start: cursor, end: m.index, code: false });
      regions.push({ start: bodyStart, end: bodyEnd, code: true });
      cursor = bodyEnd;
      opener.lastIndex = bodyEnd;
    }
    regions.push({ start: cursor, end: text.length, code: false });
  }

  for (const region of regions) {
    if (region.code) blankCodeComments(text, region.start, region.end, blank);
    else blankHtmlComments(text, region.start, region.end, blank);
  }

  return out.join('');
}

function blankHtmlComments(
  text: string,
  start: number,
  end: number,
  blank: (a: number, b: number) => void
) {
  let i = start;
  while (i < end) {
    const open = text.indexOf('<!--', i);
    if (open === -1 || open >= end) return;
    const close = text.indexOf('-->', open + 4);
    const stop = close === -1 ? end : Math.min(close + 3, end);
    blank(open, stop);
    i = stop;
  }
}

function blankCodeComments(
  text: string,
  start: number,
  end: number,
  blank: (a: number, b: number) => void
) {
  let i = start;
  let quote: string | null = null;

  while (i < end) {
    const c = text[i];

    if (quote) {
      if (c === '\\') i += 2;
      else {
        if (c === quote) quote = null;
        i++;
      }
      continue;
    }

    if (c === "'" || c === '"' || c === '`') {
      quote = c;
      i++;
      continue;
    }

    if (c === '/' && text[i + 1] === '/') {
      const nl = text.indexOf('\n', i);
      const stop = nl === -1 ? end : Math.min(nl, end);
      blank(i, stop);
      i = stop;
      continue;
    }

    if (c === '/' && text[i + 1] === '*') {
      const close = text.indexOf('*/', i + 2);
      const stop = close === -1 ? end : Math.min(close + 2, end);
      blank(i, stop);
      i = stop;
      continue;
    }

    i++;
  }
}

/**
 * Une échappatoire s'écrit `<marqueur>: <raison>` sur la ligne signalée ou sur
 * la ligne au-dessus. La ligne au-dessus est acceptée parce que Prettier déplace
 * volontiers les attributs d'un élément long sur leurs propres lignes : sans ça,
 * une échappatoire posée avec l'attribut se retrouverait détachée de lui.
 *
 * Une raison est obligatoire : un marqueur nu ne vaut pas échappatoire.
 */
export function hasEscape(lines: string[], index: number, marker: string): boolean {
  if (hasReason(lines[index] ?? '', marker)) return true;
  if (hasReason(lines[index - 1] ?? '', marker)) return true;

  // Prettier éclate les attributs d'un élément long sur leurs propres lignes :
  // l'échappatoire posée au-dessus de l'élément se retrouve alors à plusieurs
  // lignes de l'attribut signalé. On remonte jusqu'à l'ouverture de l'élément,
  // et on accepte le marqueur juste avant elle.
  const open = openingTagLine(lines, index);
  return open !== null && hasReason(lines[open - 1] ?? '', marker);
}

/** Remonte jusqu'à la ligne qui ouvre l'élément contenant `index`, s'il y en a une. */
function openingTagLine(lines: string[], index: number): number | null {
  const LIMIT = 30;
  for (let i = index; i >= 0 && index - i < LIMIT; i--) {
    const line = (lines[i] ?? '').trim();
    if (line.startsWith('<')) return i;
    // Une ligne qui ferme un élément ou un bloc : on n'est pas dans un attribut.
    if (line.endsWith('>') || line === '' || line.startsWith('{')) return null;
  }
  return null;
}

/**
 * Une raison est le texte qui suit `<marqueur>:`, une fois retirée la fermeture
 * du commentaire qui la porte. Sans ce nettoyage, `<!-- ds-allow-color: -->`
 * passerait pour motivé : `-->` est un caractère non blanc.
 */
function hasReason(line: string, marker: string): boolean {
  const at = line.indexOf(`${marker}:`);
  if (at === -1) return false;
  const reason = line
    .slice(at + marker.length + 1)
    .replace(/-->|\*\//g, '')
    .trim();
  return reason.length > 0;
}

const toLines = (text: string) => text.split('\n');

/* ───────────────────────── Règles de scan ───────────────────────── */

/**
 * Plancher de contraste. Sur `#020205`, un texte blanc sous 50 % d'opacité passe
 * sous le seuil WCAG AA. Couvre `text-white/40` et `text-white/[0.4]`.
 */
export function scanContrast(text: string, file: string, marker: string): Violation[] {
  const lines = toLines(blankComments(text, 'svelte'));
  const raw = toLines(text);
  const out: Violation[] = [];
  const pattern = /text-white\/(\[([0-9.]+)\]|(\d+))/g;

  lines.forEach((line, i) => {
    for (const m of line.matchAll(pattern)) {
      const percent = m[2] !== undefined ? Number(m[2]) * 100 : Number(m[3]);
      if (percent >= 50) continue;
      if (hasEscape(raw, i, marker)) continue;
      out.push({
        file,
        line: i + 1,
        message: `\`${m[0]}\` passe sous le plancher de contraste (text-white/50 sur #020205).`
      });
    }
  });
  return out;
}

/** Aucune vidéo ni aucun son ne démarre tout seul. */
export function scanAutoplay(text: string, file: string, marker: string): Violation[] {
  const lines = toLines(blankComments(text, 'svelte'));
  const raw = toLines(text);
  const out: Violation[] = [];

  lines.forEach((line, i) => {
    if (!/\bautoplay\b/.test(line)) return;
    if (hasEscape(raw, i, marker)) return;
    out.push({
      file,
      line: i + 1,
      message: '`autoplay` : la lecture doit être déclenchée par le visiteur.'
    });
  });
  return out;
}

/**
 * Pas de tiret cadratin dans le contenu visible : il donne un ton « écrit par
 * une IA ». Les commentaires de code ne sont pas concernés, et c'est exactement
 * ce que le blanchiment préalable garantit.
 */
export function scanEmDash(text: string, file: string, kind: 'svelte' | 'script'): Violation[] {
  const lines = toLines(blankComments(text, kind));
  const out: Violation[] = [];

  lines.forEach((line, i) => {
    if (!line.includes('—')) return;
    out.push({
      file,
      line: i + 1,
      message: 'Tiret cadratin dans le contenu : utiliser deux-points, virgule, point ou `|`.'
    });
  });
  return out;
}

/** La police est auto-hébergée : aucune requête vers Google Fonts. */
export function scanGoogleFonts(text: string, file: string): Violation[] {
  const out: Violation[] = [];
  toLines(text).forEach((line, i) => {
    if (!/fonts\.(googleapis|gstatic)\.com/.test(line)) return;
    out.push({
      file,
      line: i + 1,
      message: 'Google Fonts : la police DM Sans est auto-hébergée (@fontsource-variable/dm-sans).'
    });
  });
  return out;
}

/**
 * Extrait les expressions `{@html …}` avec leur ligne. Compte les accolades en
 * ignorant celles qui sont dans une chaîne, pour suivre l'injection JSON-LD qui
 * s'étend sur une vingtaine de lignes.
 */
export function extractHtmlExpressions(text: string): Array<{ expr: string; line: number }> {
  const out: Array<{ expr: string; line: number }> = [];
  const open = '{@html';
  let from = 0;

  for (;;) {
    const at = text.indexOf(open, from);
    if (at === -1) return out;

    let depth = 1;
    let quote: string | null = null;
    let i = at + open.length;

    while (i < text.length && depth > 0) {
      const c = text[i];
      if (quote) {
        if (c === '\\') i++;
        else if (c === quote) quote = null;
      } else if (c === "'" || c === '"' || c === '`') {
        quote = c;
      } else if (c === '{') {
        depth++;
      } else if (c === '}') {
        depth--;
      }
      i++;
    }

    out.push({
      expr: text.slice(at + open.length, i - 1),
      line: text.slice(0, at).split('\n').length
    });
    from = i;
  }
}

/**
 * Tout `{@html}` passe par une fonction qui échappe ce qu'elle rend : `md()`
 * échappe le HTML, `jsonLd()` échappe les chevrons. C'est cette règle qui
 * remplace `svelte/no-at-html-tags`, désactivée dans eslint.config.js : plutôt
 * qu'une dérogation par site d'appel, l'invariant est vérifié ici.
 */
export function scanHtmlSources(
  text: string,
  file: string,
  marker: string,
  allowed: string[]
): Violation[] {
  const raw = toLines(text);
  const out: Violation[] = [];

  for (const { expr, line } of extractHtmlExpressions(blankComments(text, 'svelte'))) {
    if (allowed.some((fn) => expr.includes(`${fn}(`))) continue;
    if (hasEscape(raw, line - 1, marker)) continue;
    out.push({
      file,
      line,
      message: `\`{@html}\` doit passer par ${allowed.map((f) => `${f}()`).join(' ou ')}.`
    });
  }
  return out;
}

/**
 * La scène WebGL ne vit que sur /intro. La monter sur `/` y remettrait 2,5 Mo
 * de MP3 et le moteur Three.js, sur la page la plus stratégique du site.
 */
export function scanIntroSceneImport(text: string, file: string, allowedDir: string): Violation[] {
  const lines = toLines(blankComments(text, 'svelte'));
  const out: Violation[] = [];

  lines.forEach((line, i) => {
    if (!/import\s+\w+\s+from\s+['"].*IntroScene\.svelte['"]/.test(line)) return;
    if (file.startsWith(allowedDir)) return;
    out.push({
      file,
      line: i + 1,
      message: `IntroScene ne doit être monté que sous ${allowedDir} (audio et Three.js).`
    });
  });
  return out;
}

/**
 * `.node-version` est la source unique de la version de Node : GitHub Actions la
 * lit avec `node-version-file`, Netlify lit le fichier tout seul. Un pin écrit
 * en plus dans netlify.toml ou dans le workflow prend le pas sans prévenir et
 * les deux divergent en silence, ce qui était le cas (20 des deux côtés, sans
 * rien pour le vérifier).
 */
export function scanVersionPins(files: Array<{ file: string; text: string }>): Violation[] {
  const out: Violation[] = [];

  for (const { file, text } of files) {
    toLines(text).forEach((line, i) => {
      if (/^\s*NODE_VERSION\s*=/.test(line)) {
        out.push({
          file,
          line: i + 1,
          message: 'NODE_VERSION fait doublon : Netlify lit `.node-version` à la racine.'
        });
      }
      if (/^\s*node-version:\s*['"]?\d/.test(line)) {
        out.push({
          file,
          line: i + 1,
          message: 'Version littérale : utiliser `node-version-file: .node-version`.'
        });
      }
    });
  }
  return out;
}

/**
 * Aucune couleur littérale dans un composant : les rôles vivent dans le bloc
 * `@theme` de `src/app.css` et s'emploient par leur nom (`bg-primary`,
 * `text-accent`, `var(--color-canvas)`). Scan complet : le dépôt a été migré,
 * la règle n'a plus besoin du mode diff qui épargnait l'existant. Les
 * commentaires sont blanchis d'abord, un exemple écrit en commentaire ne
 * compte pas ; les chaînes restent lues, parce qu'un hex dans un `style=` ou
 * un attribut SVG est bien une couleur.
 */
export function scanLiteralColors(text: string, file: string, marker: string): Violation[] {
  const lines = toLines(blankComments(text, 'svelte'));
  const raw = toLines(text);
  // Pas de `\b` devant la fonction : dans une valeur arbitraire Tailwind,
  // l'espace devient `_` (`shadow-[0_0_8px_rgba(0,0,0,0.5)]`), et `_` est un
  // caractère de mot. Seule une lettre juste devant disqualifie le motif.
  const pattern = /#[0-9a-fA-F]{3,8}\b|(?<![A-Za-z])(rgba?|hsla?|oklch|lab)\(\s*[\d.]/;
  const out: Violation[] = [];

  lines.forEach((line, i) => {
    if (!pattern.test(line)) return;
    if (hasEscape(raw, i, marker)) return;
    out.push({
      file,
      line: i + 1,
      message: 'Couleur littérale : passer par un rôle du bloc @theme de src/app.css.'
    });
  });
  return out;
}

/**
 * Pas de pas de typographie sous 12 px. `min-h-[44px]` et compagnie ne sont
 * pas concernés : la règle ne regarde que `text-[…]`. Scan complet, comme la
 * règle des couleurs : les 26 pas sous le plancher ont été remplacés par
 * `text-xs` ou par l'utilitaire `eyebrow`.
 */
export function scanSmallType(
  text: string,
  file: string,
  marker: string,
  minPx: number
): Violation[] {
  const lines = toLines(blankComments(text, 'svelte'));
  const raw = toLines(text);
  const pattern = /text-\[([0-9.]+)(px|rem)\]/g;
  const out: Violation[] = [];

  lines.forEach((line, i) => {
    for (const m of line.matchAll(pattern)) {
      const px = m[2] === 'rem' ? Number(m[1]) * 16 : Number(m[1]);
      if (px >= minPx) continue;
      if (hasEscape(raw, i, marker)) continue;
      out.push({
        file,
        line: i + 1,
        message: `\`${m[0]}\` est sous le plancher de ${minPx} px.`
      });
    }
  });
  return out;
}

/**
 * Une emphase par paragraphe. Le gras est ce que le lecteur retient en
 * balayant la page : à trois mots violets par phrase, il ne retient plus rien
 * et le texte prend un ton d'argumentaire généré. Une seule mise en avant par
 * paragraphe, celle du fait à retenir. Les chiffres (« plus de 30 millions »)
 * ne comptent pas, ni les libellés qui ouvrent une puce (« • **Un Lab** : »),
 * qui sont une structure de liste et non une emphase.
 *
 * `script` lit les littéraux de `src/lib/data` : un paragraphe y est séparé
 * par un `\n\n` écrit en toutes lettres dans la chaîne. `svelte` lit chaque
 * `<p>` et chaque `{#snippet lede()}`.
 */
export function scanEmphasis(text: string, file: string, kind: 'svelte' | 'script'): Violation[] {
  const blanked = blankComments(text, kind);
  const out: Violation[] = [];
  const lineAt = (offset: number) => blanked.slice(0, offset).split('\n').length;
  const report = (offset: number, count: number) =>
    out.push({
      file,
      line: lineAt(offset),
      message: `${count} emphases dans un paragraphe : garder celle que le lecteur doit retenir.`
    });

  if (kind === 'script') {
    const lines = blanked.split('\n');
    let offset = 0;
    for (const line of lines) {
      for (const paragraph of line.split('\\n\\n')) {
        const prose = paragraph.split('\\n').filter((l) => !l.trimStart().startsWith('•'));
        const count = prose
          .flatMap((l) => [...l.matchAll(/\*\*(.+?)\*\*/g)].map((m) => m[1]))
          .filter((b) => !/\d/.test(b)).length;
        if (count > 1) report(offset, count);
      }
      offset += line.length + 1;
    }
    return out;
  }

  const blocks = /<p\b[^>]*>([\s\S]*?)<\/p>|\{#snippet lede\(\)\}([\s\S]*?)\{\/snippet\}/g;
  for (const m of blanked.matchAll(blocks)) {
    const body = m[1] ?? m[2] ?? '';
    const count = [...body.matchAll(/<strong\b[^>]*>([\s\S]*?)<\/strong>/g)]
      .map((x) => x[1])
      .filter((b) => !/\d/.test(b)).length;
    if (count > 1) report(m.index ?? 0, count);
  }
  return out;
}
