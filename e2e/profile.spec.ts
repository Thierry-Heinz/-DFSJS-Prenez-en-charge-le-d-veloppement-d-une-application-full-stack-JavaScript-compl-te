import { test, expect } from '@playwright/test';
import { E2E_USER } from './test-data';

test('le profil est pré-rempli avec les données de l’utilisateur connecté', async ({
  page,
}) => {
  await page.goto('/profile');

  await expect(page.getByLabel("Nom d'utilisateur")).toHaveValue(
    E2E_USER.username,
  );
  await expect(page.getByLabel('Adresse e-mail')).toHaveValue(E2E_USER.email);
});

test('mettre à jour le nom d’utilisateur affiche un message de succès', async ({
  page,
}) => {
  await page.goto('/profile');

  const newUsername = `e2e_user_${Date.now()}`;
  await page.getByLabel("Nom d'utilisateur").fill(newUsername);
  await page.getByRole('button', { name: 'Sauvegarder' }).click();

  await expect(page.getByText('Profil mis à jour.')).toBeVisible();
  await expect(page.getByLabel("Nom d'utilisateur")).toHaveValue(newUsername);

  // On restaure le nom d'utilisateur d'origine pour ne pas impacter les
  // autres specs (login par email uniquement, donc sans effet sur eux,
  // mais on garde l'état des fixtures stable).
  await page.getByLabel("Nom d'utilisateur").fill(E2E_USER.username);
  await page.getByRole('button', { name: 'Sauvegarder' }).click();
  await expect(page.getByText('Profil mis à jour.')).toBeVisible();
});

test('un nom d’utilisateur invalide affiche une erreur de champ', async ({
  page,
}) => {
  await page.goto('/profile');

  await page.getByLabel("Nom d'utilisateur").fill('a');
  await page.getByRole('button', { name: 'Sauvegarder' }).click();

  await expect(page.locator('#username-error')).toBeVisible();
  await expect(page.getByText('Profil mis à jour.')).not.toBeVisible();
});

test('changer le mot de passe affiche un succès et vide le champ', async ({
  page,
}) => {
  await page.goto('/profile');

  const temporaryPassword = 'NouveauMotDePasse123!';
  await page.getByLabel('Nouveau mot de passe').fill(temporaryPassword);
  await page.getByRole('button', { name: 'Sauvegarder' }).click();

  await expect(page.getByText('Profil mis à jour.')).toBeVisible();
  await expect(page.getByLabel('Nouveau mot de passe')).toHaveValue('');

  // Restaure le mot de passe d'origine : `auth.spec.ts` (projet `no-auth`)
  // se connecte avec `E2E_USER.password`, sans garantie d'ordre entre
  // projets Playwright.
  await page.getByLabel('Nouveau mot de passe').fill(E2E_USER.password);
  await page.getByRole('button', { name: 'Sauvegarder' }).click();
  await expect(page.getByText('Profil mis à jour.')).toBeVisible();
});
