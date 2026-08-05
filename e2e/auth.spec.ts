import { test, expect } from '@playwright/test';
import { E2E_USER } from './test-data';

test.describe('Inscription', () => {
  test("un nouvel utilisateur peut s'inscrire et arrive sur le dashboard", async ({
    page,
  }) => {
    await page.goto('/register');
    await page.getByLabel("Nom d'utilisateur").fill('nouvel_utilisateur');
    await page.getByLabel('E-mail').fill('nouvel.utilisateur@example.com');
    await page.getByLabel('Mot de passe').fill('MotDePasse123!');

    await page.getByRole('button', { name: "S'inscrire" }).click();

    await expect(page).toHaveURL('/dashboard');
  });

  test('un mot de passe trop faible affiche une erreur de champ', async ({
    page,
  }) => {
    await page.goto('/register');
    await page.getByLabel("Nom d'utilisateur").fill('autre_utilisateur');
    await page.getByLabel('E-mail').fill('autre.utilisateur@example.com');
    await page.getByLabel('Mot de passe').fill('faible');
    await page.getByRole('button', { name: "S'inscrire" }).click();

    await expect(page.getByText('Au moins 8 caractères')).toBeVisible();
    await expect(page).toHaveURL('/register');
  });
});

test.describe('Connexion', () => {
  test("l'utilisateur de test peut se connecter et arrive sur le dashboard", async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByLabel("E-mail ou nom d'utilisateur").fill(E2E_USER.email);
    await page.getByLabel('Mot de passe').fill(E2E_USER.password);
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page).toHaveURL('/dashboard');
  });

  test('un mauvais mot de passe affiche une erreur et reste sur /login', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByLabel("E-mail ou nom d'utilisateur").fill(E2E_USER.email);
    await page.getByLabel('Mot de passe').fill('MauvaisMotDePasse123!');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(
      page.getByText('Identifiant ou mot de passe incorrect'),
    ).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});

test('la déconnexion ramène à un état non authentifié', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel("E-mail ou nom d'utilisateur").fill(E2E_USER.email);
  await page.getByLabel('Mot de passe').fill(E2E_USER.password);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL('/dashboard');

  await page.getByRole('button', { name: 'Se déconnecter' }).click();
  await expect(page).toHaveURL('/');

  // Une route protégée redirige désormais vers `/`.
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/');
});
