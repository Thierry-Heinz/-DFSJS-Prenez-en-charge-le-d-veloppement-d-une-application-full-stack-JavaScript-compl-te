import { execSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Exécuté une seule fois avant toute la suite Playwright. Ne dépend pas du
 * `webServer` (Next.js) : ne fait que parler à Postgres directement, ce qui
 * évite tout problème d'ordonnancement entre `globalSetup` et `webServer`.
 * Réinitialise entièrement le schéma de `mdd_e2e_db` puis réinsère les
 * données de référence, pour que chaque run parte d'un état connu.
 *
 * `seed.ts` est lancé via `tsx`, en sous-processus, plutôt qu'importé
 * directement : il tire le client Prisma généré (`import.meta`), que le
 * chargeur TypeScript interne de Playwright ne sait pas exécuter.
 */
async function globalSetup() {
  const rootDir = path.resolve(__dirname, '..');
  dotenv.config({ path: path.resolve(rootDir, '.env.test') });

  execSync(
    'npx prisma db push --schema=prisma/schema.prisma --force-reset',
    { stdio: 'inherit', env: process.env, cwd: rootDir },
  );

  execSync('npx tsx e2e/seed.ts', {
    stdio: 'inherit',
    env: process.env,
    cwd: rootDir,
  });
}

export default globalSetup;
