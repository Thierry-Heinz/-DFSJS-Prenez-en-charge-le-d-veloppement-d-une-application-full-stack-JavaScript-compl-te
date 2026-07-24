import { LoginInput } from '@/features/auth/dto/login.schema';
import { RegisterInput } from '@/features/auth/dto/register.schema';
import { auth } from '@/lib/auth/auth';

export type LoginEmailResult = Awaited<ReturnType<typeof auth.api.signInEmail>>;
export type LoginUsernameResult = Awaited<
  ReturnType<typeof auth.api.signInUsername>
>;
export type RegisterResult = Awaited<ReturnType<typeof auth.api.signUpEmail>>;
export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;
export type UpdateUserResult = Awaited<ReturnType<typeof auth.api.updateUser>>;
export type ChangeEmailResult = Awaited<ReturnType<typeof auth.api.changeEmail>>;

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
  setPassword(userId: string, newPassword: string): Promise<void>;
  updateUser(username: string): Promise<UpdateUserResult>;
  changeEmail(newEmail: string): Promise<ChangeEmailResult>;
}

export interface AuthService {
  login(input: LoginInput): Promise<LoginEmailResult | LoginUsernameResult>;
  register(input: RegisterInput): Promise<RegisterResult>;
  getSession(): Promise<Session>;
  logout(): Promise<{ success: boolean }>;
  setPassword(newPassword: string): Promise<void>;
  updateUser(username: string): Promise<UpdateUserResult>;
  changeEmail(newEmail: string): Promise<ChangeEmailResult>;
}
