import 'server-only';

import { authService } from '@/features/auth/auth.service';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';
import { SubscriptionService } from '@/types/subscription-types';
import { subscriptionRepository } from './subscription.repository';

/**
 * Implémentation de {@link SubscriptionService}. Chaque méthode exige une
 * session utilisateur active.
 * @throws AppError si aucune session n'est active
 */
export const subscriptionService: SubscriptionService = {
  subscribe: async function (topicId) {
    const userExist = await authService.getSession();
    if (!userExist) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND);
    }

    const subscription = await subscriptionRepository.create(
      topicId,
      userExist.user.id,
    );
    return subscription;
  },
  unsubscribe: async function (topicId) {
    const userExist = await authService.getSession();
    if (!userExist) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND);
    }
    const unsubscription = await subscriptionRepository.delete(
      topicId,
      userExist.user.id,
    );
    return unsubscription;
  },
  getUserSubscriptions: async function () {
    const userExist = await authService.getSession();
    if (!userExist) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND);
    }
    const subscriptions = await subscriptionRepository.findByUserId(
      userExist.user.id,
    );
    return subscriptions;
  },
};
