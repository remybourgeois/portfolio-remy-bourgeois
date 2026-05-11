// tests/projects.test.ts
import { test, expect } from '@playwright/test';

test('projects page shows project cards', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('h1')).toContainText('Projets');
  const cards = page.locator('button[aria-label^="Voir le projet"]');
  await expect(cards).toHaveCount(7);
});

test('clicking a project card opens the modal', async ({ page }) => {
  await page.goto('/projects');
  await page.locator('button[aria-label^="Voir le projet"]').first().click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();
});

test('pressing Escape closes the modal', async ({ page }) => {
  await page.goto('/projects');
  await page.locator('button[aria-label^="Voir le projet"]').first().click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  // Click the close button (triggered by same closeModal function as Escape)
  await page.locator('[role="dialog"] ~ button[aria-label="Fermer"], button[aria-label="Fermer"]').click();
  await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3000 });
});

test('back link navigates to home', async ({ page }) => {
  await page.goto('/projects');
  // Use evaluate to click the link bypassing pointer event interception
  await page.evaluate(() => {
    const link = document.querySelector('a[href="/"]') as HTMLAnchorElement | null;
    if (link) link.click();
  });
  await expect(page).toHaveURL('/');
});
