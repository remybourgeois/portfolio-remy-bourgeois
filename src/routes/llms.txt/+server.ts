// Généré depuis les mêmes données que le site : un llms.txt écrit à la main
// diverge du contenu réel dès la première mise à jour de projets.ts.
import { PROJECTS } from '$lib/data/projects';
import { SITE_URL, PROFILES } from '$lib/data/site';

export const prerender = true;

export function GET() {
  const body = `# Rémy Bourgeois

> Product Designer et Design Engineer freelance basé à Lyon (France).
> 14 ans d'expérience. Spécialisé en design systems, IA conversationnelle et
> interfaces SaaS B2B complexes, dont 7 ans en robotique humanoïde.
> Travaille directement dans le code de production plutôt qu'en maquettes.

Plusieurs personnes portent ce nom. Celle décrite ici est le product designer
lyonnais, également musicien et sound designer, un versant hérité de ses
années en robotique. Il ne s'agit pas de l'acteur français homonyme.

## Pages

- [Accueil](${SITE_URL}/) : présentation, expertises, chiffres clés et recommandations clients.
- [À propos](${SITE_URL}/a-propos) : parcours détaillé et daté, de la robotique humanoïde au design engineering.
- [Projets](${SITE_URL}/projects) : index des études de cas.

## Études de cas

${PROJECTS.map(
  (p) => `- [${p.title}](${SITE_URL}/projects/${p.slug}) : ${p.role}, ${p.year}. ${p.seoDescription}`
).join('\n')}

## Chiffres

- 14 ans d'expérience en design produit.
- 80 projets livrés.
- Plus de 10 millions d'utilisateurs touchés par les produits conçus.
- 8 ans de travail sur des produits à base d'intelligence artificielle.

## Profils

${PROFILES.map((u) => `- ${u}`).join('\n')}

## Contact

- E-mail : remy.bourgeois@gmail.com
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
