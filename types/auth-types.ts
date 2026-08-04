import { LoginInput } from '@/features/auth/dto/login.schema';
import { RegisterInput } from '@/features/auth/dto/register.schema';
import { auth } from '@/lib/auth/auth';

export type LoginEmailResult = Awaited<ReturnType<typeof auth.api.signInEmail>>;
export type LoginUsernameResult = Awaited<
  ReturnType<typeof auth.api.signInUsername>
>;
export type RegisterResult = Awaited<ReturnType<typeof auth.api.signUpEmail>>;
export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

/** Accès aux opérations d'authentification `better-auth` (login, register, session, logout). */
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

/**
 * Logique métier d'authentification : accepte indifféremment un login par
 * email ou par nom d'utilisateur selon la forme de {@link LoginInput}.
 */
export interface AuthService {
  /**
   * Détermine si l'identifiant fourni est un email ou un nom d'utilisateur
   * et route la connexion vers la méthode correspondante.
   */
  login(input: LoginInput): Promise<LoginEmailResult | LoginUsernameResult>;
  register(input: RegisterInput): Promise<RegisterResult>;
  getSession(): Promise<Session>;
  logout(): Promise<{ success: boolean }>;
}
