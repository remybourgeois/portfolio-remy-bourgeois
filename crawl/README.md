# Crawl of remybourgeois.com

Crawled 2026-11-10, read only, one request at a time, 0.5 s between requests.
User agent: `seo-audit-crawler/1.0 (read-only site audit; Claude Code)`.
Everything below comes from `crawl/summary.json`; each URL also has its own `crawl/url-<path>.json`.

## Coverage

- Start: `robots.txt`, which declares one sitemap (`/sitemap.xml`, 9 URLs), then internal links from the homepage.
- 11 URLs crawled. The 2,000 URL limit was not hit.
- `robots.txt` blocks nothing (`Allow: /` for every user agent).
- All 11 URLs return 200 directly. No internal link points to a redirect or an error.
- No language versions: every page is `lang="fr"`, no `hreflang` anywhere.

## Templates

| Template      | Pattern             | Count | Examples                                                     | Indexable |
| ------------- | ------------------- | ----- | ------------------------------------------------------------ | --------- |
| home          | `/`                 | 1     | `/`                                                          | yes       |
| service       | `/accompagnement`   | 1     | `/accompagnement`                                            | yes       |
| project-index | `/projects`         | 1     | `/projects`                                                  | yes       |
| case-study    | `/projects/<slug>`  | 5     | `/projects/ofelia`, `/projects/ipify`, `/projects/aldebaran` | yes       |
| about         | `/a-propos`         | 1     | `/a-propos`                                                  | yes       |
| intro         | `/intro`            | 1     | `/intro`                                                     | noindex   |
| legal         | `/mentions-legales` | 1     | `/mentions-legales`                                          | noindex   |

## Per template

| Template      | Sitemap URLs that are noindex, redirected or not 200 | Linked but missing from sitemap | Pages with 0 or 1 inbound link (header and footer ignored) |
| ------------- | ---------------------------------------------------- | ------------------------------- | ---------------------------------------------------------- |
| home          | 0                                                    | 0                               | 0                                                          |
| service       | 0                                                    | 0                               | 0                                                          |
| project-index | 0                                                    | 0                               | 0                                                          |
| case-study    | 0                                                    | 0                               | 0 (lowest: `/projects/highlight`, 3 pages)                 |
| about         | 0                                                    | 0                               | 1 (0 inbound, header link only)                            |
| intro         | 0                                                    | 1 (noindex)                     | 1 (0 inbound, header link only)                            |
| legal         | 0                                                    | 1 (noindex)                     | 1 (0 inbound, footer link only)                            |

## Internal links (header and footer ignored)

| Page                        | Linking pages | Of which main content | Anchors in main content                                                               |
| --------------------------- | ------------- | --------------------- | ------------------------------------------------------------------------------------- |
| `/`                         | 10            | 2                     | "Accéder au portfolio", "Passer l'intro", "remybourgeois.com"; breadcrumb "Accueil"   |
| `/projects`                 | 8             | 3                     | "Voir les projets", "Découvrir tous les projets", "Voir les études de cas"            |
| `/accompagnement`           | 7             | 7                     | "Voir comment je travaille" (6 pages), "Voir les trois façons de travailler ensemble" |
| `/projects/ipify`           | 6             | 4                     | "iPify", "Étude de cas iPify", card text, one image link with no text                 |
| `/projects/credit-agricole` | 6             | 4                     | "Crédit Agricole", "Étude de cas Crédit Agricole", card text, one image link          |
| `/projects/ofelia`          | 5             | 4                     | "Ofelia", "Étude de cas Ofelia", card text, one link with no text                     |
| `/projects/aldebaran`       | 5             | 3                     | "Aldebaran Robotics", "Étude de cas Aldebaran", card text, one image link             |
| `/projects/highlight`       | 3             | 2                     | "Étude de cas Highlight", card text. Not linked from the homepage                     |
| `/a-propos`                 | 0             | 0                     | none (header: "À propos")                                                             |
| `/intro`                    | 0             | 0                     | none (header: "Vivre l'expérience")                                                   |
| `/mentions-legales`         | 0             | 0                     | none (footer: "Mentions légales")                                                     |

Case studies link to each other only through previous and next links, in one chain:
ofelia, ipify, aldebaran, credit-agricole, highlight.

## Money template checks

Money templates were not supplied, so these four are assumed: home, service, project-index, case-study.
Pages opened: `/`, `/accompagnement`, `/projects`, `/projects/ofelia`, `/projects/ipify`, `/projects/credit-agricole`.

- **Indexable:** all six return 200, carry no `noindex` (meta or `X-Robots-Tag`), are not blocked, and have a self canonical.
- **Readable:** verified by fetching the raw HTML with no script execution. `<main>` holds 109 to 1,002 words and every internal link is a plain `<a href>` in the source.
- **Structure:** exactly one H1 on each. The H1 is only the client name on the 5 case studies, and a single generic word on `/projects` ("Projets") and `/accompagnement` ("Accompagnement").
- **Titles:** present and unique. Over 600 px: `/` (659 px, 69 characters), `/projects` (651 px), `/accompagnement` (650 px), `/projects/credit-agricole` (606 px).
- **Links out:** none redirect, none return an error.
- **Language versions:** none.

## URL variants probed

`/home`, trailing slash, `www` and `http` all answer 301 to the canonical URL. Two invented URLs answer 404.

## Method limits

- Title width is measured with Liberation Sans at 20 px, an approximation of Google's desktop rendering.
- A link's region comes from its HTML ancestors: `<nav>`, `<header>` and `<footer>` outside `<main>` count as header or footer; a `<nav>` inside `<main>` is a breadcrumb or previous and next link.
- `/intro` has no `<main>`; its two links to `/` are counted as main content.
