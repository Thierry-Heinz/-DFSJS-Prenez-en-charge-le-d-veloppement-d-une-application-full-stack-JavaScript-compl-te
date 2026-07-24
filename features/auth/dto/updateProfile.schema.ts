import { z } from 'zod';

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Au moins 3 caractères')
    .max(30, 'Maximum 30 caractères')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Uniquement lettres, chiffres, "_" et "."'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
