// tests/projects.test.ts
import { test, expect } from '@playwright/test';

test('shows projects grid', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('link', { name: /Voir le projet/ }).first()).toBeVisible();
});

test('the breadcrumb leads back to the home page', async ({ page }) => {
  await page.goto('/projects');
  // Le fil d'Ariane visible a remplacé le lien « Retour », qui doublonnait la
  // barre permanente sans dire où l'on était.
  const crumbs = page.getByRole('navigation', { name: "Fil d'Ariane" });
  await expect(crumbs.getByRole('link', { name: 'Accueil' })).toHaveAttribute('href', '/');
  await expect(crumbs.getByText('Projets')).toHaveAttribute('aria-current', 'page');
});

test('project card navigates to case study', async ({ page }) => {
  await page.goto('/projects');
  await page
    .getByRole('link', { name: /Voir le projet/ })
    .first()
    .click();
  // waitForURL attend la navigation (page.url() ne patiente pas → flaky)
  await page.waitForURL(/\/projects\/[\w-]+/); // slugs, ex. /projects/ofelia
});

test('a case study ends on a contact block', async ({ page }) => {
  await page.goto('/projects/ofelia');
  // La page se terminait sur « Suivant » : le parcours s'arrêtait là où il
  // devrait aboutir.
  await expect(page.getByRole('link', { name: "M'écrire" })).toBeVisible();
});

test.describe('on a touch device', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test('carousel arrows are visible without hover', async ({ page }) => {
    await page.goto('/projects/ofelia');
    // `group-hover` n'existe pas au doigt : les flèches étaient à opacity-0
    // pour toujours, et seul le balayage, qu'aucun indice n'annonçait, faisait
    // avancer le carousel.
    const next = page.getByRole('button', { name: 'Suivant' }).first();
    await expect(next).toBeVisible();
    await expect(next).toHaveCSS('opacity', '1');
  });

  test('the lightbox gives the media most of the screen width', async ({ page }) => {
    await page.goto('/projects/ofelia');
    await page.locator('button[aria-label^="Voir"]').first().click();
    const dialog = page.getByRole('dialog', { name: 'Aperçu plein écran' });
    await expect(dialog).toBeVisible();
    // Les flèches posées à côté du média lui laissaient 230 px sur 390 : la
    // vidéo était plus petite en « plein écran » que dans le carousel.
    const box = await dialog.locator('video, img').first().boundingBox();
    expect(box, 'média absent de la lightbox').not.toBeNull();
    expect(box!.width).toBeGreaterThan(390 * 0.75);
  });
});
