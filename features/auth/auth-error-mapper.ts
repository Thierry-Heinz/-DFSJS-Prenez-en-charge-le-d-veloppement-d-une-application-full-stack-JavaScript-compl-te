import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';
import { APIError } from 'better-auth/api';

const betterAuthErrorMap: Record<string, keyof typeof ErrorMessages> = {
  INVALID_EMAIL_OR_PASSWORD: 'INVALID_CREDENTIALS',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'USER_ALREADY_EXISTS',
};

export async function withBetterAuthErrorHandling<T>(
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.body);
      const key = betterAuthErrorMap[error.body?.code ?? ''];
      throw new AppError(
        key ? ErrorMessages[key] : ErrorMessages.UNKNOWN_AUTH_ERROR,
      );
    }
    throw error;
  }
}
