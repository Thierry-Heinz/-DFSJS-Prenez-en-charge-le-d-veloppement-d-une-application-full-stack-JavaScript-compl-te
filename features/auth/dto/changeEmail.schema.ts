import { z } from 'zod';

export const changeEmailSchema = z.object({
  newEmail: z.email('Adresse e-mail invalide'),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
