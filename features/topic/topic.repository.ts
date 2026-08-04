import { prisma } from '@/lib/prisma';
import { TopicRepository, TopicWithSubscription } from '@/types/topic-types';

/**
 * Convertit un topic Prisma (avec ses abonnements filtrés par utilisateur)
 * en {@link TopicWithSubscription}, en dérivant `isSubscribed` de la présence
 * d'au moins un abonnement dans le tableau.
 */
function toDomainTopic(raw: {
  id: number;
  name: string;
  description: string | null;
  subscriptions: { id: number }[];
}): TopicWithSubscription {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    isSubscribed: raw.subscriptions.length > 0,
  };
}

/** Implémentation de {@link TopicRepository} au-dessus de Prisma. */
export const topicRepository: TopicRepository = {
  findAllTopics: async function () {
    return await prisma.topic.findMany({
      orderBy: {
        name: 'desc',
      },
    });
  },

  findTopicById: async function (id: number) {
    return await prisma.topic.findUnique({
      where: {
        id,
      },
    });
  },

  findAllWithSubscriptionStatus: async function (userId: string) {
    const topics = await prisma.topic.findMany({
      include: {
        subscriptions: {
          where: {
            userId,
          },
        },
      },
    });
    return topics.map(toDomainTopic);
  },
};
