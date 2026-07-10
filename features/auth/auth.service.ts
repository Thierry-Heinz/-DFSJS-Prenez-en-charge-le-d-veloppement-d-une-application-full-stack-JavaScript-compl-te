import 'server-only';
import { AuthService } from '@/types/auth-types';
import { isValidEmail } from '@/lib/utils';
import { authRepository } from './auth.repository';

export const authService: AuthService = {
  login: async function (identifier, password) {
    const isEmail = isValidEmail(identifier);
    let response;

    if (isEmail) {
      response = await authRepository.loginWithEmail(identifier, password);
    } else {
      response = await authRepository.loginWithUsername(identifier, password);
    }
    return response;
  },
};
