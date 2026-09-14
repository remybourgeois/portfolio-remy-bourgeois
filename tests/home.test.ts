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

test('impact counters settle on their final value', async ({ page }) => {
  await expect(page.getByText(/Années d'expérience/)).toBeVisible();
  await page.getByText(/Années d'expérience/).scrollIntoViewIfNeeded();
  // On vise la valeur finale, pas une étape intermédiaire de l'easing :
  // l'ancienne assertion sur "13+" ne passait que par accident de timing.
  await expect(page.getByText('14+', { exact: true }).first()).toBeVisible({ timeout: 10000 });
});

test('shows contact section with email link', async ({ page }) => {
  await expect(page.getByRole('link', { name: /remy.bourgeois@gmail.com/ })).toBeVisible();
});

test('featured projects expose one accessible link each', async ({ page }) => {
  // Chaque carte porte deux liens vers la même cible (image + titre), mais
  // l'image est aria-hidden : un lecteur d'écran ne doit en annoncer qu'un.
  const named = page.getByRole('link', { name: /Ofelia|iPify|Aldebaran|Crédit Agricole/ });
  await expect(named).toHaveCount(4);
});

test('projects are reachable from the top bar', async ({ page }) => {
  const link = page.getByRole('link', { name: 'Projets', exact: true });
  await expect(link).toBeVisible();
  await link.click();
  await page.waitForURL(/\/projects$/);
});

test('scroll-to-top button appears after scrolling', async ({ page }) => {
  const btn = page.getByRole('button', { name: /Remonter en haut/ });
  await expect(btn).toBeHidden();

  // Le bouton dépend d'un IntersectionObserver enregistré dans onMount, alors
  // que `goto` rend la main dès `load` — SvelteKit hydratant via un import()
  // dynamique, qui ne bloque pas cet événement. Un scroll émis avant
  // l'enregistrement de l'observer ne déclenchait donc rien, ce qui rendait le
  // test instable (constaté en CI). On réémet le scroll jusqu'à ce que
  // l'observer réponde : l'assertion reste la même, elle n'est plus une course.
  await expect(async () => {
    await page.evaluate(() => window.scrollTo(0, 800));
    await expect(btn).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });

  // Et il disparaît en revenant en haut.
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(btn).toBeHidden();
});

test('testimonial expand/collapse works', async ({ page }) => {
  const expandBtn = page.getByRole('button', { name: /Lire le témoignage/ }).first();
  await expandBtn.click();
  await expect(page.getByRole('button', { name: /Réduire/ }).first()).toBeVisible();
});
