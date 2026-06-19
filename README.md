# Portfolio — Rémy Bourgeois

Site portfolio de **Rémy Bourgeois**, Senior Product Designer & Expert IA.
Une expérience immersive (intro WebGL) suivie d'études de cas, en SvelteKit prérendu.

🔗 **Live** : https://remybourgeois.netlify.app

## Stack

- **SvelteKit 2** (Svelte 5 runes) + **adapter-static** — site 100 % prérendu
- **Tailwind CSS v4**
- **Three.js** — scène de particules de l'intro (chargée uniquement sur `/`)
- **TypeScript** · **Playwright** (tests e2e)
- Déploiement **Netlify**

## Développement

```bash
npm install
npm run dev        # serveur de dev
npm run build      # build de production -> build/
npm run preview    # prévisualiser le build
npm run check      # type & a11y check (svelte-check)
npm run test:e2e   # tests end-to-end (Playwright)
```

## Structure

- `src/routes/` — pages : `/` (intro), `/home`, `/projects`, `/projects/[slug]`
- `src/lib/components/` — composants (IntroScene, Nav, …)
- `src/lib/data/` — contenu (projets, témoignages, expertises…)
- `static/assets/` — médias (images WebP, audio MP3, vidéos)

## CI / Déploiement

- **GitHub Actions** : `svelte-check` + tests Playwright à chaque push / PR.
- **Netlify** : `main` se déploie automatiquement ; chaque PR génère une preview.
