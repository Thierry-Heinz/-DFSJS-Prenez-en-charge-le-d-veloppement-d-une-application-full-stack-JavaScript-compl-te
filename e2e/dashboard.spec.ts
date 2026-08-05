import { test, expect } from '@playwright/test';
import { E2E_POST_TITLE, E2E_POST_TITLE_2 } from './test-data';

test('le dashboard affiche les articles existants', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(
    page.getByRole('link', { name: E2E_POST_TITLE, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: E2E_POST_TITLE_2 }),
  ).toBeVisible();
});

test("le tri par date inverse l'ordre des deux articles seedés", async ({
  page,
}) => {
  await page.goto('/dashboard');

  // Tri par défaut (desc) : le second article seedé (le plus récent) apparaît en premier.
  await expect(page.locator('article h3').first()).toHaveText(
    E2E_POST_TITLE_2,
  );

  await page.getByRole('button', { name: 'Trier par date' }).click();

  await expect(page.locator('article h3').first()).toHaveText(
    E2E_POST_TITLE,
  );
});
