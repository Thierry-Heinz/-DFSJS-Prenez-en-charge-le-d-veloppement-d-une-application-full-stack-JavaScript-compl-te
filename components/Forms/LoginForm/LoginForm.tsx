'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { login } from '@/features/auth/auth.action';
import { useActionState } from 'react';

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <form action={formAction}>
      <Field>
        <FieldLabel htmlFor="identifier">
          E-mail ou nom d'utilisateur
        </FieldLabel>
        <Input id="identifier" />
        <FieldError>Mauvais E-mail ou nom d'utilisateur.</FieldError>
      </Field>
      <Input id="password" type="password" />
      <Button type="submit" disabled={isPending}>
        {isPending ? '...' : 'Se connecter'}
      </Button>
    </form>
  );
};

export default LoginForm;
