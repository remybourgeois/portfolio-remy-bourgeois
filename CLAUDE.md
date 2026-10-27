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
3. **Vérifier en local avant de pousser** : `npm run verify` (lint, types, règles,
   invariants, e2e) doit passer.
4. `git commit` → `git push -u origin <branche>` → `gh pr create --fill`.
5. Attendre le **CI vert** sur la PR (`gh pr checks`), puis merger : `gh pr merge --squash --delete-branch`.
6. Revenir à jour en local : `git checkout main && git pull`.

Les messages de commit suivent **Conventional Commits** (`type(scope): sujet`) :
le hook `commit-msg` les valide en local, et le job `commits` du CI rejoue le même
hook sur chaque commit de la PR.

Le merge n'est autorisé que si le CI passe (`build-and-test`, `commits`,
`actionlint`). Le merge sur `main` déclenche automatiquement le déploiement
Netlify (et chaque PR génère une preview).

### Activer les hooks (une fois par clone)

```
git config core.hooksPath .githooks
```

Le hook `pre-commit` formate les fichiers indexés avec Prettier et lance les
invariants sur l'index. Un outil absent qu'il peut laisser au CI ne bloque pas :
il avertit. Prettier est l'exception, puisque le CI refuserait de toute façon un
fichier mal formaté.

## Commandes

- `npm run dev` — serveur de dev
- `npm run build` — build prod → `build/`
- `npm run preview` — prévisualiser le build
- `npm run check` — svelte-check (types + a11y)
- `npm run lint` — Prettier (vérification) puis ESLint
- `npm run format` — Prettier en écriture
- `npm run rules` — invariants du projet (scripts/checks.ts)
- `npm run check:rules` — tests des règles (`node --test`)
- `npm run test:e2e` — tests Playwright
- `npm run verify` — tout ce que le CI lance, dans l'ordre

## Invariants à ne pas casser

Chacun de ces invariants est **vérifié**, pas seulement écrit ici : `scripts/checks.ts`
pour les règles statiques, les tests Playwright pour ce qui demande un navigateur.
Une exception légitime s'écrit sur place, avec sa raison, et non en retirant la
règle : `<!-- ds-allow-autoplay: la lightbox ne s'ouvre que sur un clic du visiteur -->`.
Les marqueurs sont `ds-allow-contrast`, `ds-allow-autoplay`, `ds-allow-html`,
`ds-allow-color` et `ds-allow-typography` ; un marqueur sans raison ne vaut pas
échappatoire. Toutes les règles sont des scans complets des fichiers suivis.

- **Audio** : `audioStore` ne charge rien au niveau module. Seul `IntroScene`
  appelle `engine.prime()`, et `IntroScene` ne vit que sur `/intro`. Les autres
  pages n'émettent aucun son et ne doivent télécharger aucun MP3
  (`tests/perf.test.ts` le vérifie). Elles ne portent donc ni bouton son ni
  effet sonore sur les liens : hors intro, ces contrôles n'avaient aucun effet. Ne pas monter `IntroScene` sur `/` : ça
  remettrait 2,5 Mo de MP3 sur la page la plus stratégique du site.
- **Vidéos** : jamais d'`autoplay` (règle « Autoplay »). Utiliser `preload="none"`
  - `use:playInView` sur les cartes, et la lecture pilotée par `carIndex` dans la
    case study. Seule la lightbox déroge, puisqu'un clic du visiteur l'ouvre.
- **Contraste** : plancher à `text-white/50` pour tout texte sur le fond
  (règle « Contraste »). Pour un accent violet lisible sur fond sombre, le rôle
  est `accent`, pas `primary` dilué. `tests/a11y.test.ts` passe axe-core sur six
  gabarits. Le contraste non textuel (pastilles, bordures porteuses de sens)
  n'est pas mesuré par axe : viser 3:1 à la main, `bg-white/35` au minimum.
- **Couleurs** : les rôles vivent dans le bloc `@theme` de `src/app.css`
  (`canvas`, `primary`, `primary-strong`, `primary-hover`, `accent`,
  `secondary`, `tertiary`, `overlay`, `panel-from`, `panel-to`) et s'emploient
  par leur nom : `bg-primary`, `text-accent`, `var(--color-canvas)`. Aucun hex
  ni `rgba()` dans un composant (règle « Couleur littérale », scan complet ;
  seule `IntroScene` est exemptée, ses hex allant à Three.js). Un halo passe
  par un token `--shadow-*` du même bloc. Faire correspondre par l'usage, jamais
  par la valeur la plus proche.
- **Typographie** : pas de `text-[…]` sous 12 px (règle « Pas de typo sous
  12 px », scan complet). Les libellés de section et de champ utilisent
  l'utilitaire `eyebrow` (12 px, capitales, interlettrage), avec leur couleur à
  côté.
- **Composants** : `Button` (primaire ou secondaire, `md` ou `sm`),
  `SectionTitle` (`align` centré sur l'accueil, gauche ailleurs), `PageShell`,
  `PageHeader`, `Breadcrumb`, `PageCta`, `Tag`. Avant d'écrire une pilule, un
  titre de section ou un conteneur de page à la main, regarder s'il existe ;
  s'il manque une variante, l'ajouter au composant plutôt que recopier ses
  classes.
- **Icônes** : `name` est typé par l'union `IconName`. Une icône non dessinée
  fait échouer `npm run check` au lieu de rendre un `<svg>` vide.
- **Responsive** : vérifié à 390, 820 et 1440 px, aucun débordement horizontal.
- **Rédaction** : pas de tiret cadratin (`—`) dans le contenu visible, il donne
  un ton « écrit par une IA ». Utiliser deux-points, virgule, point ou `|` selon
  le cas. Les commentaires de code ne sont pas concernés : la règle « Tiret
  cadratin » blanchit les commentaires avant de regarder.
- **Largeur des sections de la home** : `<main>` est en `flex items-center`, donc
  une section sans `w-full` se dimensionne sur son contenu. `RevealOnScroll`
  porte `w-full` pour que toutes les sections s'alignent sur `max-w-6xl`.
- **Injection HTML** : tout `{@html}` passe par `md()` ou `jsonLd()`, les deux
  seules fonctions qui échappent ce qu'elles rendent (règle « Sources de
  {@html} »). C'est pour ça que `svelte/no-at-html-tags` est désactivée dans
  `eslint.config.js` : la règle maison est plus précise qu'une dérogation par
  site d'appel.
- **Version de Node** : `.node-version` à la racine est la source unique. GitHub
  Actions la lit avec `node-version-file`, Netlify lit le fichier tout seul. Ne
  pas réintroduire `NODE_VERSION` dans `netlify.toml` ni de version littérale
  dans un workflow (règle « Version de Node »).
- **SEO/GEO** : `/` est la page indexable principale — ne jamais y remettre de
  `noindex`, et ne pas réintroduire de page `/home`. Une seule entité `Person`
  est déclarée, dans `src/lib/data/person.ts`, et toutes les pages la
  référencent par `@id`. Les meta descriptions des projets viennent du champ
  `seoDescription`, jamais d'une troncature de `description`. Les compteurs
  doivent rendre leur valeur finale dès le prérendu. `tests/seo.test.ts`
  verrouille l'ensemble.

## Repères

- Pages : `src/routes/` — `/` (portfolio, page indexable principale), `/intro`
  (intro WebGL, `noindex`), `/a-propos`, `/projects`, `/projects/[slug]`.
  `/home` est redirigé en 301 vers `/` (`netlify.toml`).
- Contenu : `src/lib/data/` · Médias : `static/assets/` (images **WebP**, audio **MP3**)
- Images projet : variantes responsives 768/1280/1920 via `src/lib/utils/img.ts` (`projectSrcset`)
- Sitemap généré depuis les données : `src/routes/sitemap.xml/+server.ts`
- `llms.txt` généré lui aussi depuis les données : `src/routes/llms.txt/+server.ts`
- Entité et JSON-LD partagés : `src/lib/data/person.ts` · constantes : `src/lib/data/site.ts`
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
