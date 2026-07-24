'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { login } from '@/features/auth/auth.action';
import { useActionState } from 'react';

const LoginForm = (): React.ReactNode => {
  const [state, formAction, isPending] = useActionState(login, undefined);
  const errors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-4 py-8">
      {state?.success === false && state.error && (
        <div className="bg-red-100 ">{state.error}</div>
      )}
      <Field className="gap-1">
        <FieldLabel htmlFor="identifier">
          E-mail ou nom d&apos;utilisateur
        </FieldLabel>
        <Input id="identifier" name="identifier" />
        {errors?.identifier && <FieldError>{errors.identifier[0]}</FieldError>}
      </Field>
      <Field className="gap-1">
        <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
        <Input id="password" name="password" type="password" />
        {errors?.password && <FieldError>{errors.password[0]}</FieldError>}
      </Field>
      <Button type="submit" disabled={isPending} className="inline">
        {isPending ? '...' : 'Se connecter'}
      </Button>
    </form>
  );
};

export default LoginForm;
