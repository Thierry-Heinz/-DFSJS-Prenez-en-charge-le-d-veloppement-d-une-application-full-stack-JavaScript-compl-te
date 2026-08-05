import { test, expect } from '@playwright/test';
import { E2E_TOPICS, E2E_POST_TITLE, E2E_COMMENT_TEXT } from './test-data';

test('créer un article le fait apparaître sur le dashboard', async ({
  page,
}) => {
  const title = `Article créé par Playwright ${Date.now()}`;

  await page.goto('/post/create');
  await page.getByLabel('Thème').click();
  await page.getByRole('option', { name: E2E_TOPICS[0].name }).click();
  await page.getByLabel('Titre').fill(title);
  await page.getByLabel('Contenu').fill('Contenu généré par le test e2e.');
  await page.getByRole('button', { name: 'Créer' }).click();

  // `createPost` redirige vers /dashboard, jamais vers /post/[id].
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('link', { name: title })).toBeVisible();
});

test('la création échoue si aucun thème n’est sélectionné', async ({
  page,
}) => {
  // `createPostSchema` (features/post/dto/createPost.schema.ts) n'impose
  // aucune contrainte de non-vacuité sur titre/contenu (juste `z.string()`),
  // donc ce n'est pas un chemin d'échec observable actuellement. Le vrai
  // échec métier se produit quand aucun thème n'est choisi : le service
  // rejette alors avec une erreur générique "topic not found".
  await page.goto('/post/create');
  await page.getByLabel('Titre').fill('Titre sans thème sélectionné');
  await page.getByLabel('Contenu').fill('Contenu sans thème sélectionné.');
  await page.getByRole('button', { name: 'Créer' }).click();

  await expect(page).toHaveURL('/post/create');
  await expect(page.getByText('topic not found')).toBeVisible();
});

test('ouvrir un article depuis le dashboard affiche son détail et ses commentaires', async ({
  page,
}) => {
  await page.goto('/dashboard');
  await page.getByRole('link', { name: E2E_POST_TITLE, exact: true }).click();

  // Attend la fin de la navigation client-side avant d'interroger le DOM :
  // sinon les <h3> du dashboard peuvent encore matcher brièvement en même
  // temps que le <h1> de la page de détail (violation de "strict mode").
  await expect(page).toHaveURL(/\/post\/\d+/);
  await expect(
    page.getByRole('heading', { name: E2E_POST_TITLE, exact: true }),
  ).toBeVisible();
  await expect(page.getByText(E2E_COMMENT_TEXT)).toBeVisible();
});

test('ajouter un commentaire le fait apparaître sous l’article', async ({
  page,
}) => {
  await page.goto('/dashboard');
  await page.getByRole('link', { name: E2E_POST_TITLE, exact: true }).click();

  const commentText = `Commentaire Playwright ${Date.now()}`;
  await page.getByLabel('Commentaire').fill(commentText);
  await page
    .locator('button:has(img[alt="créer un commentaire"])')
    .click();

  await expect(page.getByText(commentText)).toBeVisible();
});

test('un commentaire trop court affiche une erreur et n’est pas ajouté', async ({
  page,
}) => {
  await page.goto('/dashboard');
  await page.getByRole('link', { name: E2E_POST_TITLE, exact: true }).click();

  await page.getByLabel('Commentaire').fill('ab');
  await page
    .locator('button:has(img[alt="créer un commentaire"])')
    .click();

  await expect(page.locator('#comment-error')).toBeVisible();
});
