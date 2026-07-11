import 'server-only';

import { headers } from 'next/headers';
import { AuthRepository } from '@/types/auth-types';
import { auth } from '@/lib/auth/auth';
import { withBetterAuthErrorHandling } from './auth-error-mapper';

export const authRepository: AuthRepository = {
  loginWithEmail: async function (email, password) {
    return withBetterAuthErrorHandling(() =>
      auth.api.signInEmail({
        body: {
          email,
          password,
        },
      }),
    );
  },

  loginWithUsername: async function (username, password) {
    return withBetterAuthErrorHandling(() =>
      auth.api.signInUsername({
        body: {
          username,
          password,
        },
      }),
    );
  },

  logout: async function () {
    return withBetterAuthErrorHandling(async () =>
      auth.api.signOut({ headers: await headers() }),
    );
  },

  getSession: async function () {
    return withBetterAuthErrorHandling(async () =>
      auth.api.getSession({ headers: await headers() }),
    );
  },
};
