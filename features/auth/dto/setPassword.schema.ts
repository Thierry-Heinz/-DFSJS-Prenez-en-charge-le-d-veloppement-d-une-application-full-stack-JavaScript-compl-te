import { z } from 'zod';

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
