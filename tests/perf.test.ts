import { test, expect } from '@playwright/test';

/**
 * Garde-fou de non-régression sur la correction la plus lourde : le moteur
 * audio était un singleton de module chargé par le layout racine, donc les
 * 2,5 Mo de MP3 partaient sur chaque page, y compris celles sans aucun son.
 */
for (const route of ['/', '/a-propos', '/projects', '/projects/ofelia']) {
  test(`no audio is fetched on ${route}`, async ({ page }) => {
    const audio: string[] = [];
    page.on('request', (r) => {
      if (/\.mp3(\?|$)/.test(r.url())) audio.push(new URL(r.url()).pathname);
    });
    await page.goto(route, { waitUntil: 'networkidle' });
    expect(audio, `MP3 chargés sur ${route}`).toEqual([]);
  });
}

test('case study loads only the visible video', async ({ page }) => {
  const videos: string[] = [];
  page.on('request', (r) => {
    if (/\.mp4(\?|$)/.test(r.url())) videos.push(new URL(r.url()).pathname);
  });
  await page.goto('/projects/ofelia', { waitUntil: 'networkidle' });
  // Les deux vidéos des slides 2 et 3 ne doivent pas être téléchargées d'emblée.
  expect(videos).not.toContain('/assets/ofelia-2.mp4');
  expect(videos).not.toContain('/assets/ofelia-3.mp4');
});
