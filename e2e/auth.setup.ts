import { test as setup, expect } from '@playwright/test';
import { E2E_USER } from './test-data';

const authFile = 'e2e/.auth/user.json';

/**
 * Projet Playwright "setup" : contrairement à `globalSetup`, un projet de
 * test attend toujours que `webServer` soit prêt avant de s'exécuter — donc
 * la connexion via l'UI se fait ici, pas dans `global-setup.ts`.
 */
setup('authenticate', async ({ page }) => {
  // Le check de disponibilité de `webServer` peut se déclencher avant que
  // Next.js n'accepte vraiment des connexions (race connue avec `next dev`,
  // notamment en UI mode) : on retente la première navigation plutôt que
  // de dépendre uniquement de cette garantie.
  await expect(async () => {
    await page.goto('/login', { timeout: 5_000 });
  }).toPass({ timeout: 60_000 });
  await page.getByLabel("E-mail ou nom d'utilisateur").fill(E2E_USER.email);
  await page.getByLabel('Mot de passe').fill(E2E_USER.password);
  await page.getByRole('button', { name: 'Se connecter' }).click();

  await expect(page).toHaveURL('/dashboard');

  await page.context().storageState({ path: authFile });
});
