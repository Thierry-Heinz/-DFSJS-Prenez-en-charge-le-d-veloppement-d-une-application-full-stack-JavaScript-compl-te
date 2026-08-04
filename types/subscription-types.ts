export type Subscription = {
  topicId: number;
  userId: string;
  id: number;
};

/** Logique métier d'abonnement d'un utilisateur à des topics. Chaque méthode exige une session active. */
export interface SubscriptionService {
  /** @throws AppError si aucune session n'est active */
  subscribe(topicId: number): Promise<Subscription>;
  /** @throws AppError si aucune session n'est active */
  unsubscribe(topicId: number): Promise<Subscription>;
  /** @throws AppError si aucune session n'est active */
  getUserSubscriptions(): Promise<Subscription[]>;
}

/** Accès aux données d'abonnements. */
export interface SubscriptionRepository {
  create(topicId: number, userId: string): Promise<Subscription>;
  delete(topicId: number, userId: string): Promise<Subscription>;
  findByUserId(userId: string): Promise<Subscription[]>;
}
