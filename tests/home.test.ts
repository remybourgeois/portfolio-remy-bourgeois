import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/home');
});

test('has correct page title', async ({ page }) => {
  await expect(page).toHaveTitle(/Rémy Bourgeois/);
});

test('shows Senior Product Designer heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Senior Product Designer/ })).toBeVisible();
});

test('shows impact counters section', async ({ page }) => {
  await expect(page.getByText(/Années d'expérience/)).toBeVisible();
  // Scroll to counters to trigger IntersectionObserver, then wait for animation
  await page.evaluate(() => document.querySelector('[aria-label^="0+"]')?.scrollIntoView());
  await expect(page.locator('[aria-label="13+"]')).toBeVisible({ timeout: 10000 });
});

test('shows contact section with email link', async ({ page }) => {
  await expect(page.getByRole('link', { name: /remy.bourgeois@gmail.com/ })).toBeVisible();
});

test('shows featured projects with links to case studies', async ({ page }) => {
  await expect(page.locator('a[href^="/projects/"]')).toHaveCount(6);
});

test('scroll-to-top button appears after scrolling', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(page.getByRole('button', { name: /Remonter en haut/ })).toBeVisible();
});

test('testimonial expand/collapse works', async ({ page }) => {
  const expandBtn = page.getByRole('button', { name: /Lire le témoignage/ }).first();
  await expandBtn.click();
  await expect(page.getByRole('button', { name: /Réduire/ }).first()).toBeVisible();
});
