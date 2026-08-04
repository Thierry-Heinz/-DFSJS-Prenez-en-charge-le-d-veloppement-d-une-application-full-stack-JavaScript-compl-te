'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { saveProfile } from '@/features/profile/profile.action';
import { User } from '@/types/user-types';
import { useActionState, useEffect, useRef } from 'react';

const ProfileForm = ({ username, email }: User): React.ReactNode => {
  const newPasswordRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(
    saveProfile.bind(null, email),
    undefined,
  );

  const errors = state && !state.success ? state.fieldErrors : undefined;

  useEffect(() => {
    if (state?.success && newPasswordRef.current) {
      newPasswordRef.current.value = '';
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 py-8 w-full md:max-w-md"
    >
      {state?.success === false && state.error && (
        <div className="bg-red-100">{state.error}</div>
      )}
      {state?.success === true && (
        <div className="bg-green-100">Profil mis à jour.</div>
      )}

      <Field className="gap-1">
        <FieldLabel htmlFor="username" className="sr-only">
          Nom d&apos;utilisateur
        </FieldLabel>
        <Input
          key={username}
          id="username"
          name="username"
          defaultValue={username}
          aria-invalid={!!errors?.username}
          aria-describedby={errors?.username ? 'username-error' : undefined}
        />
        {errors?.username && (
          <FieldError id="username-error">{errors.username[0]}</FieldError>
        )}
      </Field>

      <Field className="gap-1">
        <FieldLabel htmlFor="newEmail" className="sr-only">
          Adresse e-mail
        </FieldLabel>
        <Input
          key={email}
          id="newEmail"
          name="newEmail"
          defaultValue={email}
          aria-invalid={!!errors?.newEmail}
          aria-describedby={errors?.newEmail ? 'newEmail-error' : undefined}
        />
        {errors?.newEmail && (
          <FieldError id="newEmail-error">{errors.newEmail[0]}</FieldError>
        )}
      </Field>

      <Field className="gap-1">
        <FieldLabel htmlFor="newPassword" className="sr-only">
          Nouveau mot de passe
        </FieldLabel>
        <Input
          ref={newPasswordRef}
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="Mot de passe"
          aria-invalid={!!errors?.newPassword}
          aria-describedby={
            errors?.newPassword ? 'newPassword-error' : undefined
          }
        />
        {errors?.newPassword && (
          <FieldError id="newPassword-error">
            {errors.newPassword[0]}
          </FieldError>
        )}
      </Field>

      <Button
        type="submit"
        disabled={isPending}
        className="inline cursor-pointer"
      >
        {isPending ? '...' : 'Sauvegarder'}
      </Button>
    </form>
  );
};

export default ProfileForm;
