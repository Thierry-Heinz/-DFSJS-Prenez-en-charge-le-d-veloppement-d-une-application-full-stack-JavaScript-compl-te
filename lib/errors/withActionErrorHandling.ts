import { AppError } from './app-error';
import { ValidationError } from './validation-error';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export function withActionErrorHandling<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
) {
  return async (...args: Args): Promise<ActionResult<T>> => {
    try {
      const data = await fn(...args);
      return { success: true, data };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          success: false,
          error: error.message,
          fieldErrors: error.fieldErrors,
        };
      }
      if (error instanceof AppError) {
        return { success: false, error: error.message };
      }
      throw error;
    }
  };
}
