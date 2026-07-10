import 'server-only';

import { headers } from 'next/headers';
import { AuthRepository } from '@/types/auth-types';
import { auth } from '@/lib/auth/auth';

export const authRepository: AuthRepository = {
  loginWithEmail: async function (email, password) {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return response;
  },

  loginWithUsername: async function (username, password) {
    const response = await auth.api.signInUsername({
      body: {
        username,
        password,
      },
    });
    return response;
  },

  logout: async function () {
    return await auth.api.signOut({ headers: await headers() });
  },

  getSession: async function () {
    return await auth.api.getSession({ headers: await headers() });
  },

  withApiError: async function () {},
};
