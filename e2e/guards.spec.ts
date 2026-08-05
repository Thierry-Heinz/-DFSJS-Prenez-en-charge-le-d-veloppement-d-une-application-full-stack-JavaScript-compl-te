import { test, expect } from '@playwright/test';

const protectedRoutes = ['/dashboard', '/topics', '/profile', '/post/create'];

for (const route of protectedRoutes) {
  test(`accès non authentifié à ${route} redirige vers /`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page).toHaveURL('/');
  });
}
