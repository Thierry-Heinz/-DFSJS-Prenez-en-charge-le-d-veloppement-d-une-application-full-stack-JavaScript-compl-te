import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { prisma } from '../prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      // No email-sending integration exists in this app yet, so there is no
      // way to deliver a confirmation link. Applying the change immediately
      // is the only usable option until a verification flow is added.
      updateEmailWithoutVerification: true,
    },
  },
  plugins: [username(), nextCookies()],
});
