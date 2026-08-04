import z from 'zod';

/** Validation de l'identifiant de topic pour un (dés)abonnement. */
export const subscribeSchema = z.object({
  topicId: z.number().int().positive(),
});
