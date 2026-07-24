import z from 'zod';

export const subscribeSchema = z.object({
  topicId: z.number().int().positive(),
});
