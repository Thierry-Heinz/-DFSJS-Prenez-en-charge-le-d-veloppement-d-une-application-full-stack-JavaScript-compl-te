import { Page } from '@playwright/test';

/**
 * Scope les locators sur la carte d'un topic précis, identifiée par son
 * titre. Nécessaire car les libellés de bouton ("S'abonner", "Se
 * désabonner") se répètent sur toutes les cartes de `/topics` et `/profile`.
 */
export function topicCard(page: Page, name: string) {
  return page
    .locator('div')
    .filter({ has: page.getByRole('heading', { name, exact: true }) })
    .last();
}
