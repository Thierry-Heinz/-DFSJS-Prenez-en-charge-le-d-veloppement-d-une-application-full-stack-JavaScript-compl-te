import 'server-only';
import { AuthService } from '@/types/auth-types';
import { isValidEmail } from '@/lib/utils';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';
import { authRepository } from './auth.repository';
import { LoginInput } from './dto/login.schema';
import { RegisterInput } from './dto/register.schema';

/** Implémentation de {@link AuthService}. */
export const authService: AuthService = {
  /**
   * Détermine si l'identifiant fourni est un email ou un nom d'utilisateur
   * et route la connexion vers la méthode correspondante.
   */
  login: async function (input: LoginInput) {
    const { identifier, password } = input;
    const isEmail = isValidEmail(identifier);
    let response;

    if (isEmail) {
      response = await authRepository.loginWithEmail(identifier, password);
    } else {
      response = await authRepository.loginWithUsername(identifier, password);
    }
    return response;
  },

  register: async function (input: RegisterInput) {
    const { username, email, password } = input;
    return await authRepository.register(username, email, password);
  },

  getSession: async function () {
    return await authRepository.getSession();
  },

  logout: async function () {
    return await authRepository.logout();
  },
};
