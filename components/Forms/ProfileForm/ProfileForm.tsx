'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
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
        <Input
          key={username}
          id="username"
          name="username"
          defaultValue={username}
        />
        {errors?.username && <FieldError>{errors.username[0]}</FieldError>}
      </Field>

      <Field className="gap-1">
        <Input key={email} id="newEmail" name="newEmail" defaultValue={email} />
        {errors?.newEmail && <FieldError>{errors.newEmail[0]}</FieldError>}
      </Field>

      <Field className="gap-1">
        <Input
          ref={newPasswordRef}
          id="newPassword"
          name="newPassword"
          type="text"
          placeholder="Mot de passe"
        />
        {errors?.newPassword && (
          <FieldError>{errors.newPassword[0]}</FieldError>
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
