import { auth } from '@/lib/auth/auth';

export type User = {
  username: string;
  email: string;
};

export type UpdateUserResult = Awaited<ReturnType<typeof auth.api.updateUser>>;
export type ChangeEmailResult = Awaited<
  ReturnType<typeof auth.api.changeEmail>
>;

/** Logique métier de gestion du profil utilisateur connecté. */
export interface ProfileService {
  updateUser(username: string): Promise<UpdateUserResult>;
  changeEmail(newEmail: string): Promise<ChangeEmailResult>;

  /**
   * Change le mot de passe de l'utilisateur actuellement connecté.
   * @throws AppError si aucune session n'est active
   */
  setPassword(newPassword: string): Promise<void>;
  updateUser(username: string): Promise<UpdateUserResult>;
  changeEmail(newEmail: string): Promise<ChangeEmailResult>;
}

/** Accès aux données de profil utilisateur (délègue à `better-auth` pour l'essentiel). */
export interface ProfileRepository {
  /** Hache le nouveau mot de passe et le persiste sur le compte `credential` de l'utilisateur. */
  setPassword(userId: string, newPassword: string): Promise<void>;
  updateUser(username: string): Promise<UpdateUserResult>;
  changeEmail(newEmail: string): Promise<ChangeEmailResult>;
}
