import { authService } from '@/features/auth/auth.service';
import { redirect } from 'next/navigation';

/**
 * Enveloppe une Server Action pour exiger une session authentifiée.
 * Redirige vers la page d'accueil si aucune session n'est trouvée,
 * sinon délègue l'exécution à la fonction fournie.
 * @param fn - La Server Action à protéger
 */
export function withAuth<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
) {
  return async (...args: Args): Promise<T> => {
    const session = await authService.getSession();

    if (!session) {
      redirect('/');
    }

    return await fn(...args);
  };
}
