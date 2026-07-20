'use server';

import { withAuth } from '@/lib/auth/withAuth';
import { ValidationError } from '@/lib/errors/validation-error';
import { withActionErrorHandling } from '@/lib/errors/withActionErrorHandling';
import { createPostSchema } from './dto/createPost.schema';
import { postService } from './post.service';
import z from 'zod';
import { redirect } from 'next/navigation';

async function createPostHandler(prevState: unknown, formData: FormData) {
  const parsed = createPostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new ValidationError(z.flattenError(parsed.error).fieldErrors);
  }
  await postService.create(parsed.data);
  redirect('/dashboard');
}

export const createPost = withAuth(withActionErrorHandling(createPostHandler));
