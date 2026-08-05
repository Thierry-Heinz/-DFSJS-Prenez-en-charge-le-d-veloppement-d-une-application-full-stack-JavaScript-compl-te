import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { E2E_POST_TITLE } from './test-data';

const AUTHENTICATED_PAGES = ['/dashboard', '/topics', '/profile', '/post/create'];

for (const path of AUTHENTICATED_PAGES) {
  test(`${path} ne présente pas de violation d'accessibilité`, async ({
    page,
  }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual(
      [],
    );
  });
}

test("la page de détail d'un article ne présente pas de violation d'accessibilité", async ({
  page,
}) => {
  await page.goto('/dashboard');
  await page.getByRole('link', { name: E2E_POST_TITLE, exact: true }).click();
  await expect(page).toHaveURL(/\/post\/\d+/);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual(
    [],
  );
});
