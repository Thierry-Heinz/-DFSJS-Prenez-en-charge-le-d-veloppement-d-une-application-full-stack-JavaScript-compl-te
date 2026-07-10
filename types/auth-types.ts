import { auth } from '@/lib/auth/auth';

export type LoginEmailResult = Awaited<ReturnType<typeof auth.api.signInEmail>>;
export type LoginUsernameResult = Awaited<
  ReturnType<typeof auth.api.signInUsername>
>;
export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export interface AuthRepository {
  loginWithEmail(email: string, password: string): Promise<LoginEmailResult>;
  loginWithUsername(
    username: string,
    password: string,
  ): Promise<LoginUsernameResult>;
  logout(): Promise<{ success: boolean }>;
  getSession(): Promise<Session>;
  withApiError(): Promise<void>;
}

export interface AuthService {
  login(
    identifier: string,
    password: string,
  ): Promise<LoginEmailResult | LoginUsernameResult>;
}
