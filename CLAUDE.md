# CLAUDE.md

Portfolio SvelteKit (Svelte 5 runes, `adapter-static`, Tailwind v4, Three.js sur l'intro).
Déployé sur **Netlify** en **déploiement continu depuis `main`**.

## Workflow git — OBLIGATOIRE

**Ne jamais committer ni pousser directement sur `main`** (branche protégée, CI requis).
Pour TOUTE modification demandée, suivre cette procédure :

1. Partir de `main` à jour, créer une branche :
   `git checkout main && git pull && git checkout -b <type>/<sujet>`
   (types : `feat`, `fix`, `chore`, `docs`, `refactor`)
2. Implémenter le changement.
3. **Vérifier en local avant de pousser** : `npm run check` puis `npm run test:e2e` (doivent passer).
4. `git commit` → `git push -u origin <branche>` → `gh pr create --fill`.
5. Attendre le **CI vert** sur la PR (`gh pr checks`), puis merger : `gh pr merge --squash --delete-branch`.
6. Revenir à jour en local : `git checkout main && git pull`.

Le merge n'est autorisé que si le CI (`build-and-test`) passe. Le merge sur `main`
déclenche automatiquement le déploiement Netlify (et chaque PR génère une preview).

## Commandes

- `npm run dev` — serveur de dev
- `npm run build` — build prod → `build/`
- `npm run preview` — prévisualiser le build
- `npm run check` — svelte-check (types + a11y)
- `npm run test:e2e` — tests Playwright

## Invariants à ne pas casser

- **Audio** : `audioStore` ne charge rien au niveau module. Seul `IntroScene`
  appelle `engine.prime()`, et `IntroScene` ne vit que sur `/intro`. Les autres
  pages n'émettent aucun son et ne doivent télécharger aucun MP3
  (`tests/perf.test.ts` le vérifie). Ne pas monter `IntroScene` sur `/` : ça
  remettrait 2,5 Mo de MP3 sur la page la plus stratégique du site.
- **Vidéos** : jamais d'`autoplay`. Utiliser `preload="none"` + `use:playInView`
  sur les cartes, et la lecture pilotée par `carIndex` dans la case study.
- **Contraste** : plancher à `text-white/50` pour tout texte sur `#020205`.
  Pour un accent violet sur fond sombre, utiliser `#a8a5ff`, pas `#706bfe` dilué.
  `tests/a11y.test.ts` passe axe-core sur six gabarits.
- **Icônes** : `name` est typé par l'union `IconName`. Une icône non dessinée
  fait échouer `npm run check` au lieu de rendre un `<svg>` vide.
- **Responsive** : vérifié à 390, 820 et 1440 px, aucun débordement horizontal.
- **SEO/GEO** : `/` est la page indexable principale — ne jamais y remettre de
  `noindex`, et ne pas réintroduire de page `/home`. Une seule entité `Person`
  est déclarée, dans `src/lib/data/person.ts`, et toutes les pages la
  référencent par `@id`. Les meta descriptions des projets viennent du champ
  `seoDescription`, jamais d'une troncature de `description`. Les compteurs
  doivent rendre leur valeur finale dès le prérendu. `tests/seo.test.ts`
  verrouille l'ensemble.

## Repères

- Pages : `src/routes/` — `/` (portfolio, page indexable principale), `/intro`
  (intro WebGL, `noindex`), `/services`, `/a-propos`, `/projects`,
  `/projects/[slug]`. `/home` est redirigé en 301 vers `/` (`netlify.toml`).
- Contenu : `src/lib/data/` · Médias : `static/assets/` (images **WebP**, audio **MP3**)
- Images projet : variantes responsives 768/1280/1920 via `src/lib/utils/img.ts` (`projectSrcset`)
- Sitemap généré depuis les données : `src/routes/sitemap.xml/+server.ts`
- `llms.txt` généré lui aussi depuis les données : `src/routes/llms.txt/+server.ts`
- Entité et JSON-LD partagés : `src/lib/data/person.ts` · constantes : `src/lib/data/site.ts`
- Prestations et FAQ : `src/lib/data/services.ts`
- Police DM Sans **auto-hébergée** (`@fontsource-variable/dm-sans`) — ne pas réintroduire Google Fonts
- Image OG sociale : `static/assets/og-cover.jpg` (1200×630, **JPG** — pas de WebP pour l'OG)
- Posters vidéo : champ `videoPoster` (hero) et `poster` (media) dans `projects.ts`.
  Les trois fichiers `poster-ofelia*.webp` sont produits et renseignés.
- Les `width`/`height` déclarés pour les vidéos sont les dimensions **d'affichage**
  (les sources ont des pixels non carrés) — ne pas les « corriger » d'après `ffprobe`.

## Reste à faire

- **Ré-encoder `ofelia-2.mp4`** si besoin (1,9 Mo pour 22 s). `ofelia-3.mp4` est
  déjà passé de 8,0 à 2,4 Mo (CRF 32, 24 fps, 1112×1080 en pixels carrés) ; en
  descendre davantage dégrade visiblement le texte de l'interface montrée.
- **Search Console / Bing Webmaster** : comptes à créer et sitemap à soumettre —
  à faire depuis les comptes de Rémy, non automatisable depuis le dépôt.
