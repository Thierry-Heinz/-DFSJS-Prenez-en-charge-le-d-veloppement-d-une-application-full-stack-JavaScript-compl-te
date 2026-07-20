import z from 'zod';

export const createPostSchema = z.object({
  topicId: z.string(),
  title: z.string(),
  content: z.string(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
