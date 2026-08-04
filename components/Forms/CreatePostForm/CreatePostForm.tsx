'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createPost } from '@/features/post/post.action';

import { useActionState } from 'react';

type CreatePostFormProps = {
  /** Liste des topics disponibles à proposer dans le select */
  topics: { name: string; id: number }[];
};

/** Formulaire de création d'un article, avec sélection du topic associé. */
const CreatePostForm = ({ topics }: CreatePostFormProps): React.ReactNode => {
  const [state, formAction, isPending] = useActionState(createPost, undefined);
  const errors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-4 py-8 w-[281]">
      {state?.success === false && state.error && (
        <div className="bg-red-100 ">{state.error}</div>
      )}
      <Field className="gap-1 ">
        <FieldLabel htmlFor="topicId" className="sr-only">
          Thème
        </FieldLabel>
        <Select name="topicId">
          <SelectTrigger
            id="topicId"
            className="w-full border-2 border-primary  h-10"
            aria-required="true"
            aria-invalid={!!errors?.topicId}
            aria-describedby={errors?.topicId ? 'topicId-error' : undefined}
          >
            <SelectValue
              placeholder="Sélectionner un thème"
              className="text-xl"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={`${topic.id}`}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors?.topicId && (
          <FieldError id="topicId-error">{errors.topicId[0]}</FieldError>
        )}
      </Field>
      <Field className="gap-1">
        <FieldLabel htmlFor="title" className="sr-only">
          Titre
        </FieldLabel>
        <Input
          id="title"
          name="title"
          placeholder="Titre de l'article"
          className="border-2 border-primary text-xl h-10"
          aria-required="true"
          aria-invalid={!!errors?.title}
          aria-describedby={errors?.title ? 'title-error' : undefined}
        />
        {errors?.title && (
          <FieldError id="title-error">{errors.title[0]}</FieldError>
        )}
      </Field>
      <Field className="gap-1">
        <FieldLabel htmlFor="content" className="sr-only">
          Contenu
        </FieldLabel>
        <Textarea
          id="content"
          name="content"
          placeholder="Contenu de l'article"
          className="h-[212px] border-2 border-primary text-xl"
          aria-required="true"
          aria-invalid={!!errors?.content}
          aria-describedby={errors?.content ? 'content-error' : undefined}
        />
        {errors?.content && (
          <FieldError id="content-error">{errors.content[0]}</FieldError>
        )}
      </Field>
      <Button type="submit" disabled={isPending} className="inline-block">
        {isPending ? '...' : 'Créer'}
      </Button>
    </form>
  );
};

export default CreatePostForm;
