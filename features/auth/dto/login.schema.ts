import { z } from 'zod';

/** Validation du formulaire de connexion. `identifier` accepte un email ou un nom d'utilisateur. */
export const loginSchema = z.object({
  identifier: z.string().min(3, 'Au moins 3 caractères'),
  password: z.string().min(8, 'Au moins 8 caractères'),
});

export type LoginInput = z.infer<typeof loginSchema>;
