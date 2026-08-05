import { test, expect } from '@playwright/test';
import { E2E_TOPICS } from './test-data';
import { topicCard } from './fixtures';

const [subscribedTopic, freeTopic] = E2E_TOPICS;

test('la page topics affiche les topics existants', async ({ page }) => {
  await page.goto('/topics');

  for (const topic of E2E_TOPICS) {
    await expect(
      page.getByRole('heading', { name: topic.name, exact: true }),
    ).toBeVisible();
  }
});

test("s'abonner à un topic change le libellé de son bouton", async ({
  page,
}) => {
  await page.goto('/topics');

  const card = topicCard(page, freeTopic.name);
  await card.getByRole('button', { name: "S'abonner" }).click();
  await expect(card.getByRole('button', { name: 'Déjà abonné' })).toBeVisible();

  // Nettoyage : le bouton reste câblé sur l'action de désabonnement même
  // avec ce libellé sur /topics, on le recliquer pour repartir d'un état
  // propre pour les autres specs.
  await card.getByRole('button', { name: 'Déjà abonné' }).click();
  await expect(card.getByRole('button', { name: "S'abonner" })).toBeVisible();
});

test('se désabonner depuis /profile retire le topic de la liste des abonnements', async ({
  page,
}) => {
  // `subscribedTopic` (JavaScript) est associé à l'article seedé, mais
  // l'utilisateur de test n'y est pas abonné par défaut : on s'y abonne
  // d'abord depuis /topics avant de tester le désabonnement sur /profile.
  await page.goto('/topics');
  await topicCard(page, subscribedTopic.name)
    .getByRole('button', { name: "S'abonner" })
    .click();
  await expect(
    topicCard(page, subscribedTopic.name).getByRole('button', {
      name: 'Déjà abonné',
    }),
  ).toBeVisible();

  await page.goto('/profile');
  await expect(
    page.getByRole('heading', { name: subscribedTopic.name, exact: true }),
  ).toBeVisible();

  await topicCard(page, subscribedTopic.name)
    .getByRole('button', { name: 'Se désabonner' })
    .click();

  await expect(
    page.getByRole('heading', { name: subscribedTopic.name, exact: true }),
  ).not.toBeVisible();
});
