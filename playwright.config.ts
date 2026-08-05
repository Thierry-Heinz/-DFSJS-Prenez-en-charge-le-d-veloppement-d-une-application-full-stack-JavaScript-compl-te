import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Charge explicitement les variables de l'environnement e2e (base de données
// dédiée mdd_e2e_db) pour que le serveur Next lancé par `webServer` et le
// `globalSetup` (db push + seed) ciblent la même base, jamais celle de dev.
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

// Port dédié au serveur Next.js lancé pour les tests e2e, distinct du 3000
// utilisé par `npm run dev` : évite tout conflit si un dev-server tourne déjà.
const E2E_PORT = 3100;
const E2E_BASE_URL = `http://localhost:${E2E_PORT}`;

const e2eEnv = {
  DATABASE_URL: process.env.DATABASE_URL!,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  BETTER_AUTH_URL: E2E_BASE_URL,
  PORT: String(E2E_PORT),
  // Next verrouille un seul `next dev` par `distDir` (pas par port) : sans
  // ça, lancer les tests e2e alors que `npm run dev` tourne déjà échoue
  // avec "Another next dev server is already running".
  NEXT_DIST_DIR: '.next-e2e',
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'html',
  globalSetup: require.resolve('./e2e/global-setup.ts'),

  use: {
    baseURL: E2E_BASE_URL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  webServer: {
    command: 'npm run dev',
    url: E2E_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: e2eEnv,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'no-auth',
      testMatch: ['auth.spec.ts', 'guards.spec.ts', 'accessibility-public.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'authenticated',
      testMatch: [
        'dashboard.spec.ts',
        'topics.spec.ts',
        'posts.spec.ts',
        'profile.spec.ts',
        'accessibility-authenticated.spec.ts',
      ],
      use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      // Viewport mobile (sous le breakpoint `lg` de Tailwind, 1024px) pour
      // couvrir le menu hamburger (MobileMenu.tsx), invisible en desktop.
      // Device Chromium (pas WebKit) pour rester cohérent avec le choix
      // "Chromium uniquement" déjà fait pour ce projet.
      name: 'mobile',
      testMatch: ['mobile-nav.spec.ts'],
      use: { ...devices['Pixel 5'], storageState: 'e2e/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
});
