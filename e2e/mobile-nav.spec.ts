import { test, expect } from '@playwright/test';
import { E2E_USER } from './test-data';

test('le menu mobile permet de naviguer vers un autre onglet', async ({
  page,
}) => {
  await page.goto('/dashboard');

  // Sous le breakpoint `lg`, seul le déclencheur du menu mobile est visible
  // (le nav desktop d'AppNav est `hidden lg:flex`).
  await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await dialog.getByRole('link', { name: 'Thèmes' }).click();

  await expect(page).toHaveURL('/topics');
  await expect(dialog).not.toBeVisible();
});

test('le menu mobile se ferme au clic sur le fond', async ({ page }) => {
  await page.goto('/dashboard');

  await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  // Radix marque ce bouton de fond `aria-hidden="true"` (bonne pratique :
  // un backdrop purement visuel ne doit pas être exposé aux lecteurs
  // d'écran) : `getByRole` ne le voit pas, et Playwright refuse même un
  // clic normal sur un élément aria-hidden (il le traite comme non
  // interactif, par cohérence avec l'accessibilité). `force: true` est
  // légitime ici : on simule précisément un clic souris sur ce fond.
  // Le panneau (`w-3/4 max-w-xs`, ancré à droite) recouvre le centre de
  // l'écran sur ce viewport étroit : on clique à gauche du panneau.
  await page
    .locator('[aria-label="Fermer le menu"]')
    .click({ position: { x: 10, y: 10 }, force: true });
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test.describe('déconnexion depuis le menu mobile', () => {
  // Session dédiée (pas le storageState partagé du projet `mobile`) : se
  // déconnecter invalide la session côté serveur, ce qui casserait les
  // autres tests de ce fichier s'ils partageaient le même cookie.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('ramène à un état non authentifié', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel("E-mail ou nom d'utilisateur").fill(E2E_USER.email);
    await page.getByLabel('Mot de passe').fill(E2E_USER.password);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL('/dashboard');

    await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Se déconnecter' })
      .click();

    await expect(page).toHaveURL('/');
  });
});
