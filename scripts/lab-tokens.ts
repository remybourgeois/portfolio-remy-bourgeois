// scripts/lab-tokens.ts
//
// Régénère lab/tokens.css depuis le bloc @theme de src/app.css. À lancer après
// toute modification d'une couleur ou d'un halo du design system :
//   npm run lab:tokens
// La règle « Tokens du Lab » (scripts/checks.ts) fait échouer le CI si on l'oublie.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { labTokensCss } from './rules.ts';

const root = join(import.meta.dirname, '..');
const css = labTokensCss(readFileSync(join(root, 'src/app.css'), 'utf8'));
if (css === null) {
  console.error('src/app.css ne contient pas de bloc @theme.');
  process.exit(1);
}
writeFileSync(join(root, 'lab/tokens.css'), css);
console.log('lab/tokens.css régénéré depuis src/app.css.');
