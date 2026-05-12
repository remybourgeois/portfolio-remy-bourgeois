# Portfolio v2 — Design Spec

**Date :** 2026-05-12  
**Branche :** claude/distracted-hawking-c19aae  
**Stack :** SvelteKit + Svelte 5 · Tailwind v4 · Three.js · TypeScript · Netlify  

---

## Contexte

Le portfolio v1 (Rémy Bourgeois, Senior Product Designer & Expert IA) est fonctionnel et déployé. La v2 vise une **optimisation et modernisation** sans réécriture complète : architecture plus propre, meilleure expérience mobile, typographie premium, case studies, et modernisation technique Svelte 5.

La v2 est développée sur une branche dédiée — la v1 reste intacte sur `main`.

---

## Décisions clés

| Dimension | v1 | v2 |
|---|---|---|
| Architecture routes | Intro wrappée dans home (`/`) | Routes séparées : `/` intro, `/home` portfolio |
| Typographie | system-ui | DM Sans (Google Fonts, variable font) |
| Intro 3D | Particules Three.js (texture CDN) | Particules améliorées (trails, texture locale, densité adaptive mobile) |
| Case studies | Modal sur `/projects` | Pages `/projects/[id]` — URL partageable, SEO friendly |
| Home sections | Hero · Marquee · Témoignages · Expertises · Impact · Projets · Contact | Identiques — conservées telles quelles |
| Tech | Svelte stores + `$:` réactif | Svelte 5 runes (`$state`, `$derived`) + View Transitions API |
| Responsive | Tailwind `md:` prefixes | Mobile-first contrainte transversale — 100% mobile validé |
| SEO | Meta description seule | Open Graph complet (title, description, image) sur toutes les pages |

---

## Architecture des routes

```
/                        Intro seule (Three.js + 10 clics) → goto('/home') au finish
/home                    Page portfolio complète
/projects                Grille de projets (cards cliquables → /projects/[id])
/projects/[id]           Case study par projet
```

**Fichiers affectés :**

```
src/routes/+page.svelte               Intro seule, perd le slot home
src/routes/home/+page.svelte          Nouveau — contenu v1 home migré ici
src/routes/projects/+page.svelte      Grille sans modal, cards → route
src/routes/projects/[id]/+page.svelte Nouveau — case study
src/routes/+layout.svelte             Nav visible sur /home et /projects uniquement
```

**État `introDone` :** remplacé par `sessionStorage.setItem('introSeen', '1')`. Le bouton "Recommencer" efface la clé et recharge `/`. Supprime le store Svelte cross-route.

**`body { overflow: hidden }` :** supprimé globalement. Chaque page gère son propre scroll.

---

## Composants — modifications

### IntroScene.svelte
- Perd le `<slot>` et le div `#main-content`
- À la fin du 10e clic (après le fade) : `goto('/home')` via SvelteKit
- Texture spark : déplacée de `https://threejs.org/examples/textures/sprites/spark1.png` vers `/static/assets/spark.png` (asset local)
- Densité particules adaptative :
  - `prefers-reduced-motion` → N = 500 (existant)
  - `window.innerWidth < 768` → N = 1200
  - Sinon → N = 2800
- Trails : maintien d'un buffer des 3 positions précédentes par particule, dessinés avec `opacity` décroissante pour simuler un sillage lors des transitions de forme

### Nav.svelte
- Condition de visibilité : `pathname !== '/'` (l'intro n'a pas de nav)
- Migration vers `$state` / `$derived` Svelte 5
- Tap targets mobiles ≥ 44px vérifiés

### home/+page.svelte (nouveau fichier)
- Contenu identique à la v1 `+page.svelte` actuelle
- Migration vers runes Svelte 5 (`$state`, `$derived`)
- `on:click` → syntaxe Svelte 5 `onclick`
- La logique modal projet est **supprimée** — les cards renvoient vers `/projects/[id]`
- View Transitions API sur les liens sortants vers `/projects`

### projects/+page.svelte
- Cards cliquables → `href="/projects/{project.id}"` (plus de modal)
- View Transitions API
- Migration runes Svelte 5

### projects/[id]/+page.svelte (nouveau)
Voir section Case Studies ci-dessous.

---

## Case Studies (`/projects/[id]`)

### Data model — `projects.ts`

```ts
export interface Project {
  id: number;
  client: string;
  logo: string;
  title: string;
  tags: string[];
  description: string;
  color: string;
  image: string;
  // v2 — optionnels, extensibles
  images?: string[];
  role?: string;
  year?: string;
  url?: string;
}
```

Les champs optionnels sont ajoutés sans données pour l'instant — la page s'adapte à leur présence/absence.

### Layout case study (mobile-first)

```
┌─────────────────────────────────────┐
│  ← Retour aux projets               │
├─────────────────────────────────────┤
│  [Logo]  Titre                      │
│  Tags · Année · Rôle                │
├─────────────────────────────────────┤
│  Image principale (pleine largeur)  │
│  (mesh gradient bg, shadow violet)  │
├─────────────────────────────────────┤
│  Description (whitespace-pre-line)  │
├─────────────────────────────────────┤
│  ← Préc.              Suiv. →       │
└─────────────────────────────────────┘
```

- Navigation prev/next : calculée à partir de l'index dans `PROJECTS[]`
- SEO : `og:image` = `project.image`, `og:title` = `project.title`
- Pas de galerie pour l'instant (prête dès que `images[]` est rempli)

---

## Typographie — DM Sans

```html
<!-- app.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&display=swap" rel="stylesheet">
```

```css
/* app.css */
body {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
}
```

Fallback `system-ui` pendant le chargement. `display=swap` évite le FOIT.

---

## Responsive mobile — contrainte transversale

Chaque composant nouveau ou modifié est validé à ces breakpoints :
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (tablette portrait)
- 1280px (desktop)

**Règles spécifiques :**

| Composant | Règle mobile |
|---|---|
| Intro bouton progression | `min-height: 44px`, centré en bas de l'écran sur mobile |
| Particules | N = 1200 sur `innerWidth < 768` |
| Case study image | `width: 100%`, pas de padding latéral sur mobile |
| Case study prev/next | Boutons `min-height: 44px`, pleine largeur sur mobile (`flex-col`) |
| View Transitions | Désactivées si `navigator.connection?.effectiveType === '2g'` |
| Nav hamburger | Tap target ≥ 44px, testé avec DM Sans |

---

## SEO — Open Graph

Chaque route obtient dans `<svelte:head>` :

```html
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Rémy Bourgeois — Portfolio" />
<meta property="og:title" content="[titre de la page]" />
<meta property="og:description" content="[description]" />
<meta property="og:image" content="[image absolue]" />
<meta name="twitter:card" content="summary_large_image" />
```

Les URLs `og:image` doivent être absolues. Définir une constante dans `src/lib/data/site.ts` :

```ts
export const SITE_URL = 'https://remybourgeois.netlify.app'; // à ajuster si domaine custom
```

Image OG par défaut (home, projects) : `${SITE_URL}/assets/1_Photo Remy Bourgeois Pro.jpg`.  
Pour les case studies : `${SITE_URL}${project.image}`.

---

## Migration Svelte 5 runes

Syntaxe cible pour les fichiers migrés :

```svelte
<!-- Avant (v1) -->
let selected = null;
$: isMuted = $audioStore.isMuted;

<!-- Après (v2) -->
let selected = $state<Project | null>(null);
let isMuted = $derived($audioStore.isMuted);
```

`on:click` → `onclick`, `on:scroll` → `onscroll`, etc.

Le store `audioStore` reste un store writable standard — partagé cross-composants, les runes ne remplacent pas ça. Le store `introDone` (`stores/intro.ts`) est **supprimé** en v2 : il est remplacé par `sessionStorage` comme décrit dans la section Architecture.

---

## View Transitions API

```ts
function navigate(url: string) {
  const conn = (navigator as any).connection;
  const slowConnection = conn?.effectiveType === '2g';
  if (!document.startViewTransition || slowConnection || prefersReducedMotion) {
    goto(url);
    return;
  }
  document.startViewTransition(() => goto(url));
}
```

Appliqué sur : home → projects, projects → case study, case study → projects.

---

## Tests Playwright — mises à jour

| Fichier | Changement |
|---|---|
| `tests/home.test.ts` | URL cible `/home` au lieu de `/` ; skip l'intro via `sessionStorage` |
| `tests/projects.test.ts` | Tests modal → tests navigation `/projects/[id]` |

Helper de test pour bypasser l'intro :
```ts
await page.addInitScript(() => sessionStorage.setItem('introSeen', '1'));
await page.goto('/home');
```

---

## Hors scope v2.0

- Images WebP / srcset
- Filtres sur la page projets
- Formulaire de contact
- Page "About" dédiée
- Contenu enrichi des case studies (role, year, galerie)
- Dark/light mode
