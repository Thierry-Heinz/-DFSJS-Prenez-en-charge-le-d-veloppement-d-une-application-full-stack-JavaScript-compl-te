import { authService } from '@/features/auth/auth.service';
import { redirect } from 'next/navigation';

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
