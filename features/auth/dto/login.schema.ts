import { z } from 'zod';

/** Validation du formulaire de connexion. `identifier` accepte un email ou un nom d'utilisateur. */
export const loginSchema = z.object({
  identifier: z.string().min(3, 'Identifier too short'),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;
