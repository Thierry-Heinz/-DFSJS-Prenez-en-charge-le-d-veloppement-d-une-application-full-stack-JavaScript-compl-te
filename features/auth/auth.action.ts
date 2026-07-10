'use server';

import { withActionErrorHandling } from '@/lib/error/error-utils';
import { authService } from './auth.service';
import { loginSchema } from './dto/login.schema';
import { redirect } from 'next/navigation';
import z from 'zod';

async function loginHandler(prevState: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return { success: false, error: 'Validation échouée', fieldErrors };
  }
  await authService.login(parsed.data.identifier, parsed.data.password);
  return redirect('/dashboard');
}

export const login = withActionErrorHandling(loginHandler);
