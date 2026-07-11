'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { register } from '@/features/auth/auth.action';
import { useActionState } from 'react';

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(register, undefined);
  const errors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction}>
      <Field>
        <FieldLabel htmlFor="username">Nom d'utilisateur</FieldLabel>
        <Input id="username" name="username" />
        {errors?.username && <FieldError>{errors.username[0]}</FieldError>}
      </Field>
      <Field>
        <FieldLabel htmlFor="email">E-mail</FieldLabel>
        <Input id="email" name="email" />
        {errors?.email && <FieldError>{errors.email[0]}</FieldError>}
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
        <Input id="password" type="password" name="password" />
        {errors?.password && <FieldError>{errors.password[0]}</FieldError>}
      </Field>
      <Button type="submit" disabled={isPending}>
        {isPending ? '...' : 'Se connecter'}
      </Button>
    </form>
  );
};

export default RegisterForm;
