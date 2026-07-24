import z from 'zod';

export const createCommentSchema = z.object({
  postId: z.number(),
  comment: z.string().min(3),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
