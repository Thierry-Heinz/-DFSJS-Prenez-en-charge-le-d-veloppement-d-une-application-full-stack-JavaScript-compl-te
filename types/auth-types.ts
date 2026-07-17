import { LoginInput } from '@/features/auth/dto/login.schema';
import { RegisterInput } from '@/features/auth/dto/registerSchema';
import { auth } from '@/lib/auth/auth';

export type LoginEmailResult = Awaited<ReturnType<typeof auth.api.signInEmail>>;
export type LoginUsernameResult = Awaited<
  ReturnType<typeof auth.api.signInUsername>
>;
export type RegisterResult = Awaited<ReturnType<typeof auth.api.signUpEmail>>;
export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export interface AuthRepository {
  loginWithEmail(email: string, password: string): Promise<LoginEmailResult>;
  loginWithUsername(
    username: string,
    password: string,
  ): Promise<LoginUsernameResult>;
  logout(): Promise<{ success: boolean }>;
  register(
    username: string,
    email: string,
    password: string,
  ): Promise<RegisterResult>;
  getSession(): Promise<Session>;
}

export interface AuthService {
  login(input: LoginInput): Promise<LoginEmailResult | LoginUsernameResult>;
  register(input: RegisterInput): Promise<RegisterResult>;
  getSession(): Promise<Session>;
  logout(): Promise<{ success: boolean }>;
}
