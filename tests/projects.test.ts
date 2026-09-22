// tests/projects.test.ts
import { test, expect } from '@playwright/test';

test('shows projects grid', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('link', { name: /Voir le projet/ }).first()).toBeVisible();
});

test('back link goes to the home page', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('link', { name: /Retour/ })).toHaveAttribute('href', '/');
});

test('project card navigates to case study', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('link', { name: /Voir le projet/ }).first().click();
  // waitForURL attend la navigation (page.url() ne patiente pas → flaky)
  await page.waitForURL(/\/projects\/[\w-]+/); // slugs, ex. /projects/ofelia
});
