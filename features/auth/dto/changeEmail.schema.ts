import { z } from 'zod';

/** Validation du formulaire de changement d'adresse email. */
export const changeEmailSchema = z.object({
  newEmail: z.email('Adresse e-mail invalide'),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
