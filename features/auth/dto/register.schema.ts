import { z } from 'zod';

/**
 * Validation du formulaire d'inscription : email, nom d'utilisateur
 * (3-30 caractères alphanumériques, `_` et `.`) et mot de passe fort
 * (min. 8 caractères, majuscule, minuscule, chiffre, caractère spécial).
 */
export const registerSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
  username: z
    .string()
    .min(3, 'Au moins 3 caractères')
    .max(30, 'Maximum 30 caractères')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Uniquement lettres, chiffres, "_" et "."'),
  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/[a-z]/, 'Au moins une lettre minuscule')
    .regex(/[A-Z]/, 'Au moins une lettre majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre')
    .regex(/[^a-zA-Z0-9]/, 'Au moins un caractère spécial'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
