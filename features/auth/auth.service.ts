import 'server-only';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

type LoginResult = Awaited<ReturnType<typeof auth.api.signInEmail>>;
type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

interface AuthService {
  login(email: string, password: string): Promise<LoginResult>;
  logout(): Promise<{ success: boolean }>;
  getSession(): Promise<Session>;
}

const authService: AuthService = {
  login: async function (email, password) {
    const response = await auth.api.signInEmail({
      body: {
        email,
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
};
