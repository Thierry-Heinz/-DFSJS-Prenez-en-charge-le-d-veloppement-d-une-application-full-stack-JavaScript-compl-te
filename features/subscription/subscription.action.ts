'use server';

import { withAuth } from '@/lib/auth/withAuth';
import { subscriptionService } from './subscription.service';
import { withActionErrorHandling } from '@/lib/errors/withActionErrorHandling';
import { subscribeSchema } from './dto/subscribe.schema';
import { ValidationError } from '@/lib/errors/validation-error';
import z from 'zod';
import { revalidatePath } from 'next/cache';

/**
 * Server Action d'abonnement à un topic, appelée depuis la liste des topics.
 * Revalide les pages `/topics` et `/profile` après succès.
 */
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

/**
 * Server Action de désabonnement d'un topic, appelée depuis la liste des topics.
 * Revalide les pages `/topics` et `/profile` après succès.
 */
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
