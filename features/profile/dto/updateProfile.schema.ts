import { z } from 'zod';

/** Validation du formulaire de mise à jour du nom d'utilisateur du profil. */
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Au moins 3 caractères')
    .max(30, 'Maximum 30 caractères')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Uniquement lettres, chiffres, "_" et "."'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/** Validation du formulaire de changement d'adresse email. */
export const changeEmailSchema = z.object({
  newEmail: z.email('Adresse e-mail invalide'),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

/** Validation du formulaire de changement de mot de passe (règles de force identiques à l'inscription). */
export const setPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/[a-z]/, 'Au moins une lettre minuscule')
    .regex(/[A-Z]/, 'Au moins une lettre majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre')
    .regex(/[^a-zA-Z0-9]/, 'Au moins un caractère spécial'),
});

export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
