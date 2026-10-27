// tests/projects.test.ts
import { test, expect } from '@playwright/test';

test('shows projects grid', async ({ page }) => {
  await page.goto('/projects');
  // Le nom accessible d'une carte est son contenu visible, titre compris : c'est
  // ce que WCAG 2.5.3 impose, et donc ce sur quoi le test doit s'appuyer.
  await expect(page.getByRole('link', { name: /Ofelia/ }).first()).toBeVisible();
});

test('back link goes to the home page', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('link', { name: /Retour/ })).toHaveAttribute('href', '/');
});

test('project card navigates to case study', async ({ page }) => {
  await page.goto('/projects');
  await page
    .getByRole('link', { name: /Ofelia/ })
    .first()
    .click();
  // waitForURL attend la navigation (page.url() ne patiente pas → flaky)
  await page.waitForURL(/\/projects\/[\w-]+/); // slugs, ex. /projects/ofelia
});
