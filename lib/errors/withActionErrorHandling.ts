import { AppError } from './app-error';
import { ValidationError } from './validation-error';

/**
 * Résultat normalisé d'une Server Action : soit les données produites,
 * soit un message d'erreur accompagné d'éventuelles erreurs de champ.
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Enveloppe une Server Action pour convertir les erreurs métier
 * ({@link AppError}, {@link ValidationError}) en {@link ActionResult} exploitable
 * côté client (via `useActionState`), plutôt que de laisser Next.js afficher
 * une page d'erreur. Les erreurs non reconnues sont re-lancées telles quelles.
 * @param fn - La Server Action à exécuter
 */
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
