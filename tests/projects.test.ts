// tests/projects.test.ts
import { test, expect } from '@playwright/test';

test('shows projects grid', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('link', { name: /Voir le projet/ }).first()).toBeVisible();
});

test('back link goes to /home', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('link', { name: /Retour/ })).toHaveAttribute('href', '/home');
});

test('project card navigates to case study', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('link', { name: /Voir le projet/ }).first().click();
  await expect(page.url()).toMatch(/\/projects\/\d+/);
});
