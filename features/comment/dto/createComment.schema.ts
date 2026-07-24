import z from 'zod';

export const createCommentSchema = z.object({
  postId: z.number(),
  comment: z.string(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
