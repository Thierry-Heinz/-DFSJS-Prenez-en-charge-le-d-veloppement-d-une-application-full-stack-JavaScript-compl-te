'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { register } from '@/features/auth/auth.action';
import React, { useActionState } from 'react';

/** Formulaire d'inscription : nom d'utilisateur, email et mot de passe. */
const RegisterForm = (): React.ReactNode => {
  const [state, formAction, isPending] = useActionState(register, undefined);
  const errors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-4 py-8">
      {state?.success === false && state.error && (
        <div className="bg-red-100 ">{state.error}</div>
      )}
      <Field className="gap-1">
        <FieldLabel htmlFor="username">Nom d&apos;utilisateur</FieldLabel>
        <Input id="username" name="username" />
        {errors?.username && <FieldError>{errors.username[0]}</FieldError>}
      </Field>
      <Field className="gap-1">
        <FieldLabel htmlFor="email">E-mail</FieldLabel>
        <Input id="email" name="email" />
        {errors?.email && <FieldError>{errors.email[0]}</FieldError>}
      </Field>
      <Field className="gap-1">
        <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
        <Input id="password" type="password" name="password" />
        {errors?.password && <FieldError>{errors.password[0]}</FieldError>}
      </Field>
      <Button type="submit" disabled={isPending}>
        {isPending ? '...' : "S'inscrire"}
      </Button>
    </form>
  );
};

export default RegisterForm;
