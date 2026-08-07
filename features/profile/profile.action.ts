'use server';

import { authService } from '@/features/auth/auth.service';
import { withAuth } from '@/lib/auth/withAuth';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';
import { collectErrors, ValidationError } from '@/lib/errors/validation-error';
import { withActionErrorHandling } from '@/lib/errors/withActionErrorHandling';
import { revalidatePath } from 'next/cache';
import {
  changeEmailSchema,
  setPasswordSchema,
  updateProfileSchema,
} from './dto/updateProfile.schema';
import { profileService } from './profile.service';

/**
 * Server Action appelée par le formulaire de profil.
 * Valide indépendamment l'identité (nom d'utilisateur, seulement s'il a
 * changé), l'email (seulement s'il a changé) et le mot de passe (seulement
 * s'il est renseigné), agrège les erreurs de tous les champs avant de lever
 * une seule {@link ValidationError}, puis applique uniquement les
 * changements validés. L'utilisateur courant est lu depuis la session, pas
 * depuis le client, pour fiabiliser la détection de changement.
 */
async function saveProfileHandler(prevState: unknown, formData: FormData) {
  const session = await authService.getSession();
  if (!session) {
    throw new AppError(ErrorMessages.USER_NOT_FOUND);
  }
  const { username: currentUsername, email: currentEmail } = session.user;

  const raw = Object.fromEntries(formData);
  const fieldErrors: Record<string, string[]> = {};

  const newUsername = typeof raw.username === 'string' ? raw.username : '';
  const wantsUsernameChange = newUsername !== currentUsername;
  const identity = wantsUsernameChange
    ? updateProfileSchema.safeParse({ username: newUsername })
    : undefined;
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

  if (identity?.success) {
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
