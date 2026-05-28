// src/routes/projects/[slug]/+page.ts
import { PROJECTS } from '$lib/data/projects';
import { error } from '@sveltejs/kit';

export const prerender = true;

export function entries() {
  return PROJECTS.map(p => ({ slug: p.slug }));
}

export function load({ params }: { params: { slug: string } }) {
  const idx = PROJECTS.findIndex(p => p.slug === params.slug);
  if (idx === -1) throw error(404, 'Projet non trouvé');
  return {
    project: PROJECTS[idx],
    prev: idx > 0 ? PROJECTS[idx - 1] : null,
    next: idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null,
    index: idx
  };
}
