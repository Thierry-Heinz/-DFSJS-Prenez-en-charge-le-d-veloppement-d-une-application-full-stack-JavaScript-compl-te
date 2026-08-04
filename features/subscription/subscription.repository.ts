import 'server-only';

import { prisma } from '@/lib/prisma';
import { SubscriptionRepository } from '@/types/subscription-types';

/** Implémentation de {@link SubscriptionRepository} au-dessus de Prisma. */
export const subscriptionRepository: SubscriptionRepository = {
  create: async function (topicId, userId) {
    return await prisma.subscription.create({
      data: {
        topicId,
        userId,
      },
    });
  },

  delete: async function (topicId, userId) {
    return await prisma.subscription.delete({
      where: { userId_topicId: { userId, topicId } },
    });
  },

  findByUserId: async function (userId) {
    return await prisma.subscription.findMany({ where: { userId } });
  },
};
