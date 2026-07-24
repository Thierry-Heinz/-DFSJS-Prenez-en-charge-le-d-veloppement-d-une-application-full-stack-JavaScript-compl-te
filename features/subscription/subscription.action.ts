'use server';

import { withAuth } from '@/lib/auth/withAuth';
import { subscriptionService } from './subscription.service';
import { withActionErrorHandling } from '@/lib/errors/withActionErrorHandling';
import { subscribeSchema } from './dto/subscribe.schema';
import { ValidationError } from '@/lib/errors/validation-error';
import z from 'zod';
import { revalidatePath } from 'next/cache';

// subscription.action.ts
async function subscribeHandler(
  topicId: number,
  prevState: unknown,
  formData: FormData,
) {
  const parsed = subscribeSchema.safeParse({ topicId });
  if (!parsed.success) {
    throw new ValidationError(z.flattenError(parsed.error).fieldErrors);
  }
  await subscriptionService.subscribe(topicId);
  revalidatePath('/topics');
  revalidatePath('/profile');
}

export const subscribeAction = withAuth(
  withActionErrorHandling(subscribeHandler),
);

async function unsubscribeHandler(
  topicId: number,
  prevState: unknown,
  formData: FormData,
) {
  const parsed = subscribeSchema.safeParse({ topicId });
  if (!parsed.success) {
    throw new ValidationError(z.flattenError(parsed.error).fieldErrors);
  }
  await subscriptionService.unsubscribe(topicId);
  revalidatePath('/topics');
  revalidatePath('/profile');
}

export const unsubscribeAction = withAuth(
  withActionErrorHandling(unsubscribeHandler),
);
