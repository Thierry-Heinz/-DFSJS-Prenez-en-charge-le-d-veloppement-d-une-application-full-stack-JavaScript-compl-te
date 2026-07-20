import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email(),
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
