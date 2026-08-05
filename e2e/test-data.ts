/**
 * Constantes des données de test e2e. Séparées de `seed.ts` pour que les
 * specs et `auth.setup.ts` (chargés par Playwright, en CJS) puissent les
 * importer sans tirer transitivement le client Prisma généré, qui utilise
 * `import.meta` et casse le chargeur TypeScript interne de Playwright.
 */

export const E2E_USER = {
  username: 'e2e_user',
  email: 'e2e@example.com',
  password: 'E2eTest123!',
};

/**
 * Topics pré-créés : aucun flow UI ne permet d'en créer, donc ils doivent
 * exister avant toute exécution des tests (abonnement, création d'article).
 */
export const E2E_TOPICS = [
  { name: 'JavaScript', description: 'Le langage du web' },
  { name: 'TypeScript', description: 'JavaScript typé' },
];

export const E2E_POST_TITLE = 'Article de test e2e';
export const E2E_POST_TITLE_2 = 'Deuxième article de test e2e';
export const E2E_COMMENT_TEXT = 'Premier commentaire de test e2e.';
