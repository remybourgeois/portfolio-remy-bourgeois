// tests/observers.test.ts
import { test, expect } from '@playwright/test';

/**
 * Un navigateur occupé ne livre pas les signaux d'un IntersectionObserver un
 * par un : il les accumule et les remet d'un seul lot. Pour un même élément,
 * le lot peut donc contenir « hors écran » puis « à l'écran ». Un code qui ne
 * lit que le premier signal du lot ne voit jamais l'élément arriver.
 *
 * C'est ce qui laissait des compteurs à « 0+ » et des sections invisibles sur
 * un téléphone chargé, et le bouton « remonter » absent dans le CI. Ce test
 * fabrique le lot : il retient tous les signaux jusqu'à `__io.flush()`.
 */
test('blocks still react when the browser delivers their signals in one batch', async ({
  page
}) => {
  await page.addInitScript(() => {
    const Native = window.IntersectionObserver;
    const io = { received: 0, held: true, pending: [] as (() => void)[], flush() {} };
    io.flush = () => {
      io.held = false;
      for (const deliver of io.pending.splice(0)) deliver();
    };
    (window as unknown as { __io: typeof io }).__io = io;
    window.IntersectionObserver = class extends Native {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        let queue: IntersectionObserverEntry[] = [];
        let scheduled = false;
        super((entries, observer) => {
          io.received += entries.length;
          if (!io.held) return callback(entries, observer);
          queue.push(...entries);
          if (scheduled) return;
          scheduled = true;
          io.pending.push(() => {
            const batch = queue;
            queue = [];
            callback(batch, observer);
          });
        }, options);
      }
    };
  });

  await page.goto('/');
  const received = () =>
    page.evaluate(() => (window as unknown as { __io: { received: number } }).__io.received);

  // Premier signal de chaque élément, page en haut : les sections et les
  // compteurs sont hors écran, la sentinelle du bouton « remonter » est visible.
  await expect.poll(received).toBeGreaterThan(0);
  const before = await received();

  // Second signal : on amène la section Impact à l'écran.
  await page
    .getByRole('heading', { name: 'Impact' })
    .evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await expect.poll(received).toBeGreaterThan(before);
  // Une image de marge : tous les observateurs ont rendu leur second signal.
  await page.waitForTimeout(300);

  // Les deux signaux arrivent maintenant d'un seul lot.
  await page.evaluate(() => (window as unknown as { __io: { flush(): void } }).__io.flush());

  await expect(page.getByRole('button', { name: /Remonter en haut/ })).toBeVisible();
  const impact = page.locator('[data-reveal]').filter({
    has: page.getByRole('heading', { name: 'Impact' })
  });
  await expect(impact).toHaveAttribute('data-reveal', 'shown');
  // Le chiffre affiché, pas son doublon pour lecteurs d'écran.
  await expect(impact.locator('.tabular-nums').first()).toHaveText('14+', { timeout: 10000 });
});
