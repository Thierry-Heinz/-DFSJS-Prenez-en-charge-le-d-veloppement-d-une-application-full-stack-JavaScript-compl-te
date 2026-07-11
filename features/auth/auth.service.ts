import 'server-only';
import { AuthService } from '@/types/auth-types';
import { isValidEmail } from '@/lib/utils';
import { authRepository } from './auth.repository';
import { LoginInput } from './dto/login.schema';
import { RegisterInput } from './dto/registerSchema';

export const authService: AuthService = {
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
};
