import { prisma } from '@/lib/prisma';
import { ProfileRepository } from '@/types/user-types';
import { hashPassword } from 'better-auth/crypto';
import { withBetterAuthErrorHandling } from '../auth/auth-error-mapper';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth/auth';

export const profileRepository: ProfileRepository = {
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
        body: { username, name: username },
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
