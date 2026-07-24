import { auth } from '@/lib/auth/auth';

export type User = {
  username: string;
  email: string;
};

export type UpdateUserResult = Awaited<ReturnType<typeof auth.api.updateUser>>;
export type ChangeEmailResult = Awaited<
  ReturnType<typeof auth.api.changeEmail>
>;

export interface ProfileService {
  updateUser(username: string): Promise<UpdateUserResult>;
  changeEmail(newEmail: string): Promise<ChangeEmailResult>;

  setPassword(newPassword: string): Promise<void>;
  updateUser(username: string): Promise<UpdateUserResult>;
  changeEmail(newEmail: string): Promise<ChangeEmailResult>;
}

export interface ProfileRepository {
  setPassword(userId: string, newPassword: string): Promise<void>;
  updateUser(username: string): Promise<UpdateUserResult>;
  changeEmail(newEmail: string): Promise<ChangeEmailResult>;
}
