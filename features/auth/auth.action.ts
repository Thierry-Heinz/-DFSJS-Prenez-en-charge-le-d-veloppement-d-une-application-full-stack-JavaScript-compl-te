'use server';

import { withActionErrorHandling } from '@/lib/errors/withActionErrorHandling';
import { authService } from './auth.service';
import { loginSchema } from './dto/login.schema';
import { redirect } from 'next/navigation';
import z from 'zod';
import { registerSchema } from './dto/register.schema';
import { ValidationError } from '@/lib/errors/validation-error';

/**
 * Server Action appelée par le formulaire de connexion.
 * Accepte indifféremment un email ou un nom d'utilisateur comme identifiant.
 */
async function loginHandler(prevState: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new ValidationError(z.flattenError(parsed.error).fieldErrors);
  }
  await authService.login(parsed.data);
  return redirect('/dashboard');
}

export const login = withActionErrorHandling(loginHandler);

/**
 * Server Action appelée par le formulaire d'inscription.
 * Valide les données puis crée le compte et la session associée.
 */
async function registerHandler(prevState: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new ValidationError(z.flattenError(parsed.error).fieldErrors);
  }
  await authService.register(parsed.data);
  return redirect('/dashboard');
}

export const register = withActionErrorHandling(registerHandler);
