import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';

type ApiErrorBody = { code?: string; message?: string };

jest.mock('better-auth/api', () => {
  class APIError extends Error {
    body?: ApiErrorBody;

    constructor(_status: number, body?: ApiErrorBody) {
      super(body?.message);
      this.body = body;
    }
  }

  return { APIError };
});

import { withBetterAuthErrorHandling } from './auth-error-mapper';
import { APIError } from 'better-auth/api';

describe('withBetterAuthErrorHandling', () => {
  it('should resolve with the value returned by fn when it succeeds', async () => {
    const fn = jest.fn().mockResolvedValue('success');

    const result = await withBetterAuthErrorHandling(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should rethrow the original error when it is not an APIError', async () => {
    const error = new Error('DB connection failed');
    const fn = jest.fn().mockRejectedValue(error);

    await expect(withBetterAuthErrorHandling(fn)).rejects.toBe(error);
  });

  it('should map INVALID_EMAIL_OR_PASSWORD to an AppError with INVALID_CREDENTIALS', async () => {
    const fn = jest.fn().mockRejectedValue(
      new APIError(400, {
        code: 'INVALID_EMAIL_OR_PASSWORD',
        message: 'Invalid email or password',
      }),
    );

    const promise = withBetterAuthErrorHandling(fn);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.INVALID_CREDENTIALS.code,
      message: ErrorMessages.INVALID_CREDENTIALS.message,
      status: ErrorMessages.INVALID_CREDENTIALS.status,
    });
  });

  it('should map USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL to an AppError with USER_ALREADY_EXISTS', async () => {
    const fn = jest.fn().mockRejectedValue(
      new APIError(422, {
        code: 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
        message: 'User already exists. Use another email.',
      }),
    );

    const promise = withBetterAuthErrorHandling(fn);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.USER_ALREADY_EXISTS.code,
      message: ErrorMessages.USER_ALREADY_EXISTS.message,
      status: ErrorMessages.USER_ALREADY_EXISTS.status,
    });
  });

  it('should map an unknown APIError code to UNKNOWN_AUTH_ERROR', async () => {
    const fn = jest.fn().mockRejectedValue(
      new APIError(500, {
        code: 'SOME_UNMAPPED_CODE',
        message: 'Something else went wrong',
      }),
    );

    const promise = withBetterAuthErrorHandling(fn);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.UNKNOWN_AUTH_ERROR.code,
      message: ErrorMessages.UNKNOWN_AUTH_ERROR.message,
      status: ErrorMessages.UNKNOWN_AUTH_ERROR.status,
    });
  });

  it('should map an APIError without a body code to UNKNOWN_AUTH_ERROR', async () => {
    const fn = jest.fn().mockRejectedValue(new APIError(500));

    const promise = withBetterAuthErrorHandling(fn);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.UNKNOWN_AUTH_ERROR.code,
    });
  });
});
