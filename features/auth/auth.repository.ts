import 'server-only';

import { headers } from 'next/headers';
import { AuthRepository } from '@/types/auth-types';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword } from 'better-auth/crypto';
import { withBetterAuthErrorHandling } from './auth-error-mapper';

export const authRepository: AuthRepository = {
  loginWithEmail: function (email, password) {
    return withBetterAuthErrorHandling(() =>
      auth.api.signInEmail({
        body: {
          email,
          password,
        },
      }),
    );
  },

  loginWithUsername: function (username, password) {
    return withBetterAuthErrorHandling(() =>
      auth.api.signInUsername({
        body: {
          username,
          password,
        },
      }),
    );
  },

  logout: function () {
    return withBetterAuthErrorHandling(async () =>
      auth.api.signOut({ headers: await headers() }),
    );
  },

  register: function (username, email, password) {
    return withBetterAuthErrorHandling(() =>
      auth.api.signUpEmail({
        body: {
          email,
          password,
          name: username,
          username,
        },
      }),
    );
  },

  getSession: function () {
    return withBetterAuthErrorHandling(async () =>
      auth.api.getSession({ headers: await headers() }),
    );
  },

  setPassword: async function (userId, newPassword) {
    const passwordHash = await hashPassword(newPassword);
    await prisma.account.updateMany({
      where: { userId, providerId: 'credential' },
      data: { password: passwordHash },
    });
  },

  updateUser: function (username) {
    return withBetterAuthErrorHandling(async () =>
      auth.api.updateUser({
        body: { username },
        headers: await headers(),
      }),
    );
  },

  changeEmail: function (newEmail) {
    return withBetterAuthErrorHandling(async () =>
      auth.api.changeEmail({
        body: { newEmail },
        headers: await headers(),
      }),
    );
  },
};
