'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createPost } from '@/features/post/post.action';
import { useActionState } from 'react';

const CreatePostForm = (): React.ReactNode => {
  const [state, formAction, isPending] = useActionState(createPost, undefined);
  const errors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-4 py-8 w-[281]">
      {state?.success === false && state.error && (
        <div className="bg-red-100 ">{state.error}</div>
      )}
      <Field className="gap-1 ">
        <Select>
          <SelectTrigger className="w-full border-2 border-primary text-xl h-10">
            <SelectValue placeholder="Sélectionner un thème" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/*  {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))} */}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors?.topics && <FieldError>{errors.topics[0]}</FieldError>}
      </Field>
      <Field className="gap-1">
        <Input
          id="title"
          name="title"
          placeholder="Titre de l'article"
          className="border-2 border-primary text-xl h-10"
        />
        {errors?.title && <FieldError>{errors.title[0]}</FieldError>}
      </Field>
      <Field className="gap-1">
        <Textarea
          id="content"
          name="content"
          placeholder="Contenu de l'article"
          className="h-24 border-2 border-primary text-xl"
        />
        {errors?.content && <FieldError>{errors.content[0]}</FieldError>}
      </Field>
      <Button type="submit" disabled={isPending} className="inline-block">
        {isPending ? '...' : 'Créer'}
      </Button>
    </form>
  );
};

export default CreatePostForm;
