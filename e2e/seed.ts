/**
 * Insère les données de référence dans `mdd_e2e_db` : un utilisateur, des
 * topics, un article et un commentaire. Exécuté comme sous-processus Node
 * via `tsx` (voir `global-setup.ts`), jamais importé directement par
 * Playwright — le client Prisma généré utilise `import.meta`, incompatible
 * avec le chargeur TypeScript interne de Playwright.
 */
import { auth } from '../lib/auth/auth';
import { prisma } from '../lib/prisma';
import {
  E2E_USER,
  E2E_TOPICS,
  E2E_POST_TITLE,
  E2E_POST_TITLE_2,
  E2E_COMMENT_TEXT,
} from './test-data';

async function seed() {
  const { user } = await auth.api.signUpEmail({
    body: {
      email: E2E_USER.email,
      password: E2E_USER.password,
      name: E2E_USER.username,
      username: E2E_USER.username,
    },
  });

  const topics = await Promise.all(
    E2E_TOPICS.map((topic) => prisma.topic.create({ data: topic })),
  );

  const post = await prisma.post.create({
    data: {
      title: E2E_POST_TITLE,
      content:
        "Contenu de l'article de test e2e, utilisé pour vérifier l'affichage du détail et des commentaires.",
      userId: user.id,
      topicId: topics[0].id,
    },
  });

  // Un second article, créé après le premier, pour que le tri par date ait
  // un effet observable (ordre inversé entre les deux tris).
  await prisma.post.create({
    data: {
      title: E2E_POST_TITLE_2,
      content: 'Contenu du deuxième article de test e2e.',
      userId: user.id,
      topicId: topics[1].id,
    },
  });

  await prisma.comment.create({
    data: {
      comment: E2E_COMMENT_TEXT,
      userId: user.id,
      postId: post.id,
    },
  });
}

seed()
  .then(() => {
    console.log('[e2e] seed terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[e2e] échec du seed', error);
    process.exit(1);
  });
