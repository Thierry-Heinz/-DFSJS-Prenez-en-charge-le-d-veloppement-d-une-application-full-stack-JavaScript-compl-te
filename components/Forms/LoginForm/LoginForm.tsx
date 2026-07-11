'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { login } from '@/features/auth/auth.action';
import { useActionState } from 'react';

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(login, undefined);
  const errors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction}>
      <Field>
        <FieldLabel htmlFor="identifier">
          E-mail ou nom d'utilisateur
        </FieldLabel>
        <Input id="identifier" />
        {errors?.identifier && <FieldError>{errors.identifier[0]}</FieldError>}
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
        <Input id="password" type="password" />
        {errors?.password && <FieldError>{errors.password[0]}</FieldError>}
      </Field>
      <Button type="submit" disabled={isPending}>
        {isPending ? '...' : 'Se connecter'}
      </Button>
    </form>
  );
};

export default LoginForm;
