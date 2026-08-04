import { ProfileService } from '@/types/user-types';
import { authRepository } from '../auth/auth.repository';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';
import { profileRepository } from './profile.repository';

/** Implémentation de {@link ProfileService}. */
export const profileService: ProfileService = {
  /**
   * Change le mot de passe de l'utilisateur actuellement connecté.
   * @throws AppError si aucune session n'est active
   */
  setPassword: async function (newPassword: string) {
    const session = await authRepository.getSession();
    if (!session) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND);
    }
    await profileRepository.setPassword(session.user.id, newPassword);
  },

  updateUser: async function (username: string) {
    return await profileRepository.updateUser(username);
  },

  changeEmail: async function (newEmail: string) {
    return await profileRepository.changeEmail(newEmail);
  },
};
