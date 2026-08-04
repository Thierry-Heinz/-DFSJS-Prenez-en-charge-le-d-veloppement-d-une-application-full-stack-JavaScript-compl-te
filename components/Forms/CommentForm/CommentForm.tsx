'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { createComment } from '@/features/comment/comment.action';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useActionState } from 'react';

/**
 * Formulaire d'ajout de commentaire sur l'article courant, dont l'id est lu
 * depuis les paramètres de route.
 */
const CommentForm = (): React.ReactNode => {
  const params = useParams<{ id: string }>();
  const [state, formAction, isPending] = useActionState(
    createComment.bind(null, +params.id),
    undefined,
  );

  const errors = state && !state.success ? state.fieldErrors : undefined;
  return (
    <form action={formAction} className="flex flex-row gap-2 md:p-8">
      {state?.success === false && state.error && (
        <div className="bg-red-100 ">{state.error}</div>
      )}
      <Field className="gap-1 ">
        <FieldLabel htmlFor="comment" className="sr-only">
          Commentaire
        </FieldLabel>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Écrivez ici votre commentaire"
          className="h-[120px] border-1 border-black text-xl w-full"
          required
          aria-invalid={!!errors?.comment}
          aria-describedby={errors?.comment ? 'comment-error' : undefined}
        />
        {errors?.comment && (
          <FieldError id="comment-error">{errors.comment[0]}</FieldError>
        )}
      </Field>
      <Button
        type="submit"
        disabled={isPending}
        className="inline-block bg-transparent hover:bg-transparent/90 cursor-pointer hover:scale-115"
      >
        <Image
          src="/icon_send.png"
          alt="créer un commentaire"
          width={43}
          height={43}
        />
      </Button>
    </form>
  );
};

export default CommentForm;
