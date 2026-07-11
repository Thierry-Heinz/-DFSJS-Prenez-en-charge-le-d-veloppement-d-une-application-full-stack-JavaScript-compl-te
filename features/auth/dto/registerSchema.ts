import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email(),
  username: z.string().min(1),
  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/[a-z]/, 'Au moins une lettre minuscule')
    .regex(/[A-Z]/, 'Au moins une lettre majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre')
    .regex(/[^a-zA-Z0-9]/, 'Au moins un caractère spécial'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
