'use server';

import { withAuth } from '@/lib/auth/withAuth';
import { ValidationError } from '@/lib/errors/validation-error';
import { withActionErrorHandling } from '@/lib/errors/withActionErrorHandling';
import z from 'zod';
import { createCommentSchema } from './dto/createComment.schema';
import { commentService } from './comment.service';
import { revalidatePath } from 'next/cache';

async function createCommentHandler(
  postId: number,
  prevState: unknown,
  formData: FormData,
) {
  const parsed = createCommentSchema.safeParse({
    ...Object.fromEntries(formData),
    postId,
  });
  if (!parsed.success) {
    throw new ValidationError(z.flattenError(parsed.error).fieldErrors);
  }
  const comment = await commentService.create(parsed.data);

  revalidatePath(`/post/${postId}`);

  return comment;
}

export const createComment = withAuth(
  withActionErrorHandling(createCommentHandler),
);
