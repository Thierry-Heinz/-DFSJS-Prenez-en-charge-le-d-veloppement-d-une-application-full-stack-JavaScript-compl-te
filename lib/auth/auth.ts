import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { username } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { PrismaClient } from '@/src/generated/prisma/client';
import { prisma } from '../prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), nextCookies()],
});
