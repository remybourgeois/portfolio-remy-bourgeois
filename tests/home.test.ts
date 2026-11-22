import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
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

test('the contact block opens an email to the right address', async ({ page }) => {
  // L'adresse n'est plus écrite en clair : c'est le bouton qui la porte.
  const write = page.getByRole('link', { name: "M'écrire" }).last();
  await write.scrollIntoViewIfNeeded();
  await expect(write).toBeVisible();
  await expect(write).toHaveAttribute('href', 'mailto:remy.bourgeois@gmail.com');
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

test('the top bar names the site owner and carries no sound control', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Navigation principale' });
  // La place de gauche est celle de la marque : un visiteur arrivé de Google
  // sur une page intérieure doit savoir chez qui il est avant le pied de page.
  await expect(nav.getByRole('link', { name: 'Rémy Bourgeois' })).toHaveAttribute('href', '/');
  // Hors /intro le moteur audio est coupé : un bouton son y était un contrôle
  // sans effet, donc retiré.
  await expect(nav.getByRole('button', { name: /son/i })).toHaveCount(0);
});

test('the top bar links to the Lab subdomain', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const nav = page.getByRole('navigation', { name: 'Navigation principale' });
  await expect(nav.getByRole('link', { name: 'Lab', exact: true })).toHaveAttribute(
    'href',
    'https://lab.remybourgeois.com'
  );
});

test('the hero offers a way to get in touch above the fold', async ({ page }) => {
  // Le premier lien vers l'e-mail était en bas d'une page de 6 000 px.
  const write = page.getByRole('link', { name: "M'écrire" }).first();
  await expect(write).toBeVisible();
  await expect(write).toHaveAttribute('href', /^mailto:/);
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

test('a tall section reveals as soon as it enters the viewport on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  // La section Projets fait ~4 000 px sur mobile : avec un seuil de 10 %,
  // elle restait invisible alors que son haut occupait déjà la moitié de l'écran.
  const wrapper = page.locator('main > div.w-full', {
    has: page.getByRole('heading', { name: 'Projets', level: 2 })
  });
  await wrapper.evaluate((el) =>
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 844 + 200)
  );
  await expect(wrapper).toHaveClass(/opacity-100/, { timeout: 1000 });
});

test('a featured project fans out its screens on hover', async ({ page }) => {
  const title = page.getByRole('link', { name: 'Crédit Agricole', exact: true });
  await title.scrollIntoViewIfNeeded();
  const card = page.locator('[data-fan]').filter({ has: title });
  await expect(card.locator('.fan-sheet')).toHaveCount(3);
  await card.hover();
  await expect(card).toHaveAttribute('data-fan-open', '');
  await expect(async () => {
    const [left, front, right] = await Promise.all(
      ['.fan-sheet-l', '.fan-sheet-front', '.fan-sheet-r'].map((s) => card.locator(s).boundingBox())
    );
    expect(left!.x).toBeLessThan(front!.x - 20);
    expect(right!.x + right!.width).toBeGreaterThan(front!.x + front!.width + 20);
  }).toPass({ timeout: 5000 });
});

test('the logo strip has its final width before the logos load', async ({ page }) => {
  // Logos retenus : c'est l'état d'une première visite, cache vide. La piste
  // défile sur 50 % de sa largeur, une largeur qui change la fait sauter.
  let release = () => {};
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route(/\/assets\/[a-z]+\.(png|svg|webp)$/, async (route) => {
    await held;
    await route.continue();
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const track = page.locator('.marquee-track');
  const width = () => track.evaluate((el) => el.scrollWidth);
  const before = await width();
  expect(before).toBeGreaterThan(2000);
  release();
  await page.waitForLoadState('load');
  expect(await width()).toBe(before);
});

test('the logo strip carries no filter on its moving track', async ({ page }) => {
  // Le filtre qui blanchit les logos est porté par chaque image. Posé sur la
  // piste, il obligeait Safari à filtrer d'un bloc un calque animé de plus de
  // 3 000 px de large, qui restait vide sur iPhone.
  const track = page.locator('.marquee-track');
  await expect(track).toHaveCSS('filter', 'none');
  await expect(track.locator('img').first()).toHaveCSS('filter', 'brightness(0) invert(1)');
});

test('the top bar marks the current page with a single indicator', async ({ page }) => {
  await page.goto('/projects');
  const bar = page.getByRole('navigation', { name: 'Navigation principale' });
  const link = bar.getByRole('link', { name: 'Projets', exact: true });
  const indicator = bar.locator('.nav-indicator');
  await expect(indicator).toHaveCSS('opacity', '1');
  // Le trait arrive avec un ressort : on attend qu'il soit posé sous le lien.
  await expect(async () => {
    const [a, b] = await Promise.all([link.boundingBox(), indicator.boundingBox()]);
    expect(Math.abs(a!.x - b!.x)).toBeLessThan(1);
    expect(Math.abs(a!.width - b!.width)).toBeLessThan(1);
  }).toPass({ timeout: 5000 });
});

test('a button sinks while pressed and comes back when released', async ({ page }) => {
  const button = page.getByRole('link', { name: 'Voir les projets', exact: true });
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(button).toHaveAttribute('data-pressed', '');
  await expect.poll(async () => (await button.boundingBox())!.width).toBeLessThan(box.width - 2);
  // On quitte le bouton sans relâcher dessus : relâcher suivrait le lien.
  await page.mouse.move(0, 0);
  await expect(button).not.toHaveAttribute('data-pressed', '');
  await page.mouse.up();
});

test('an expertise card reacts to a tap without replaying its reveal', async ({ page }) => {
  const card = page.locator('.tap-card').filter({ hasText: 'Design systems et tokens' });
  await card.scrollIntoViewIfNeeded();
  // Le tracé de l'icône demande une longueur normalisée sur chaque forme.
  await expect(card.locator('svg > *').first()).toHaveAttribute('pathLength', '1');
  const shivering = () =>
    card.evaluate((el) => el.getAnimations().some((a) => a.id === 'tap-shiver'));
  // On attend la fin de l'apparition de la section avant de toucher.
  await expect.poll(() => card.evaluate((el) => el.getAnimations().length)).toBe(0);
  expect(await shivering()).toBe(false);
  await card.click();
  expect(await shivering()).toBe(true);
  // Une fois le frisson passé, plus rien ne tourne : ni lui, ni l'animation
  // d'apparition de la carte ou de son icône, qu'un toucher faisait rejouer.
  await expect
    .poll(() =>
      card.evaluate((el) => el.getAnimations({ subtree: true }).map((a) => a.playState).length)
    )
    .toBe(0);
  await expect(card).toHaveCSS('opacity', '1');
});

test('the hero title keeps its words apart for readers and crawlers', async ({ page, request }) => {
  // Le titre est découpé en mots pour son animation : il doit rester une
  // phrase, avec ses espaces, à l'écran comme dans le HTML prérendu.
  await expect(
    page.getByRole('heading', { level: 1, name: /Lead Design System & Senior Product Designer/ })
  ).toBeVisible();
  const html = await (await request.get('/')).text();
  const text = html
    .match(/<h1[\s\S]*?<\/h1>/)![0]
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
  expect(text).toContain('Lead Design System & Senior Product Designer');
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('the menu button turns into a cross and the links come in', async ({ page }) => {
    const bar = page.getByRole('navigation', { name: 'Navigation principale' });
    const toggle = bar.getByRole('button', { name: 'Menu' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.tap();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle.locator('.burger')).toHaveClass(/is-open/);
    const link = bar.locator('#mobile-menu').getByRole('link', { name: 'Projets', exact: true });
    await expect(link).toBeVisible();
    // Une fois l'entrée jouée, le lien est pleinement lisible.
    await expect(link).toHaveCSS('opacity', '1');
    await toggle.tap();
    await expect(bar.locator('#mobile-menu')).toHaveCount(0);
  });

  test('the tags of a project card come in when the card is seen', async ({ page }) => {
    const title = page.getByRole('link', { name: 'iPify', exact: true });
    const tags = page.locator('[data-fan]').filter({ has: title }).locator('.tag-cascade');
    // Sous l'écran, la rangée attend, masquée : elle ne joue qu'une fois vue.
    await expect(tags).toHaveAttribute('data-seen-pending', '');
    await tags.scrollIntoViewIfNeeded();
    await expect(tags).toHaveAttribute('data-seen', '');
    await expect(tags).not.toHaveAttribute('data-seen-pending', '');
    await expect(tags.locator('> *').last()).toHaveCSS('opacity', '1');
  });
});
