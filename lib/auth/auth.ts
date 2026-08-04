import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { prisma } from '../prisma';

/**
 * Instance serveur `better-auth` : configuration de l'adaptateur Prisma,
 * de l'authentification email/mot de passe et des plugins (username, cookies Next.js).
 * @remarks
 * `updateEmailWithoutVerification` est activé car aucune intégration d'envoi
 * d'email n'existe encore dans l'application pour délivrer un lien de confirmation ;
 * le changement d'email est donc appliqué immédiatement.
 */
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
      updateEmailWithoutVerification: true,
    },
  },
  plugins: [username(), nextCookies()],
});
