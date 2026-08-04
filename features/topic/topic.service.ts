import { TopicService } from '@/types/topic-types';
import { topicRepository } from './topic.repository';
import { authService } from '../auth/auth.service';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';

/** Implémentation de {@link TopicService}. */
export const topicService: TopicService = {
  getTopics: async function () {
    return await topicRepository.findAllTopics();
  },
  getTopicById: async function (id: number) {
    return await topicRepository.findTopicById(id);
  },

  /**
   * Liste tous les topics avec leur état d'abonnement pour l'utilisateur connecté.
   * @throws AppError si aucune session n'est active
   */
  getAllUserTopics: async function () {
    const userExist = await authService.getSession();
    if (!userExist) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND);
    }
    return await topicRepository.findAllWithSubscriptionStatus(
      userExist.user.id,
    );
  },
};
