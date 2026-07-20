import { TopicService } from '@/types/topic-types';
import { topicRepository } from './topic.repository';

export const topicService: TopicService = {
  getTopics: async function () {
    return await topicRepository.findAllTopics();
  },
  getTopicById: async function (id: number) {
    return await topicRepository.findTopicById(id);
  },
};
