'use server';

import { withAuth } from '@/lib/auth/withAuth';
import { collectErrors, ValidationError } from '@/lib/errors/validation-error';
import { withActionErrorHandling } from '@/lib/errors/withActionErrorHandling';
import { revalidatePath } from 'next/cache';
import { changeEmailSchema } from '../auth/dto/changeEmail.schema';
import { setPasswordSchema } from '../auth/dto/setPassword.schema';
import { updateProfileSchema } from '../auth/dto/updateProfile.schema';
import { profileService } from './profile.service';

async function saveProfileHandler(
  currentEmail: string,
  prevState: unknown,
  formData: FormData,
) {
  const raw = Object.fromEntries(formData);
  const fieldErrors: Record<string, string[]> = {};

  const identity = updateProfileSchema.safeParse({ username: raw.username });
  collectErrors(identity, fieldErrors);

  const newEmail = typeof raw.newEmail === 'string' ? raw.newEmail : '';
  const wantsEmailChange = newEmail !== currentEmail;
  const email = wantsEmailChange
    ? changeEmailSchema.safeParse({ newEmail })
    : undefined;
  collectErrors(email, fieldErrors);

  const newPassword =
    typeof raw.newPassword === 'string' ? raw.newPassword : '';
  const wantsPasswordChange = newPassword !== '';
  const password = wantsPasswordChange
    ? setPasswordSchema.safeParse({ newPassword })
    : undefined;
  collectErrors(password, fieldErrors);

  if (Object.keys(fieldErrors).length > 0) {
    throw new ValidationError(fieldErrors);
  }

  if (identity.success) {
    await profileService.updateUser(identity.data.username);
  }
  if (email?.success) {
    await profileService.changeEmail(email.data.newEmail);
  }
  if (password?.success) {
    await profileService.setPassword(password.data.newPassword);
  }

  revalidatePath('/profile');
}

export const saveProfile = withAuth(
  withActionErrorHandling(saveProfileHandler),
);
