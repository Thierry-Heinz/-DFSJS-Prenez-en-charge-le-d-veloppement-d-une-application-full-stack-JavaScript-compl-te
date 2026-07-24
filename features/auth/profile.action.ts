'use server';

import { withAuth } from '@/lib/auth/withAuth';
import { ValidationError } from '@/lib/errors/validation-error';
import { withActionErrorHandling } from '@/lib/errors/withActionErrorHandling';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { changeEmailSchema } from './dto/changeEmail.schema';
import { setPasswordSchema } from './dto/setPassword.schema';
import { updateProfileSchema } from './dto/updateProfile.schema';
import { authService } from './auth.service';

async function saveProfileHandler(
  currentEmail: string,
  prevState: unknown,
  formData: FormData,
) {
  const raw = Object.fromEntries(formData);
  const fieldErrors: Record<string, string[]> = {};

  const identity = updateProfileSchema.safeParse({ username: raw.username });
  if (!identity.success) {
    Object.assign(fieldErrors, z.flattenError(identity.error).fieldErrors);
  }

  const newEmail = typeof raw.newEmail === 'string' ? raw.newEmail : '';
  const wantsEmailChange = newEmail !== currentEmail;
  const email = wantsEmailChange
    ? changeEmailSchema.safeParse({ newEmail })
    : undefined;
  if (email && !email.success) {
    Object.assign(fieldErrors, z.flattenError(email.error).fieldErrors);
  }

  const newPassword = typeof raw.newPassword === 'string' ? raw.newPassword : '';
  const wantsPasswordChange = newPassword !== '';
  const password = wantsPasswordChange
    ? setPasswordSchema.safeParse({ newPassword })
    : undefined;
  if (password && !password.success) {
    Object.assign(fieldErrors, z.flattenError(password.error).fieldErrors);
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new ValidationError(fieldErrors);
  }

  if (identity.success) {
    await authService.updateUser(identity.data.username);
  }

  if (email?.success) {
    await authService.changeEmail(email.data.newEmail);
  }

  if (password?.success) {
    await authService.setPassword(password.data.newPassword);
  }

  revalidatePath('/profile');
}

export const saveProfile = withAuth(withActionErrorHandling(saveProfileHandler));
