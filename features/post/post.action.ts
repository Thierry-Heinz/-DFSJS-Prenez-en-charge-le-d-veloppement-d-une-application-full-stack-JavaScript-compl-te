'use server';

import { withAuth } from '@/lib/auth/withAuth';
import { ValidationError } from '@/lib/errors/validation-error';
import { withActionErrorHandling } from '@/lib/errors/withActionErrorHandling';

async function createPostHandler(prevState: unknown, formData: FormData) {
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new ValidationError(z.flattenError(parsed.error).fieldErrors);
  }
  await postService.create(parsed.data);
}

export const createPost = withAuth(withActionErrorHandling(createPostHandler));
