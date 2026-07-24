import { prisma } from '@/lib/prisma';
import { TopicRepository } from '@/types/topic-types';

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
};
