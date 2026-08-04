type Topic = {
  id: number;
  name: string;
  description: string | null;
};

/** Topic enrichi de l'état d'abonnement de l'utilisateur courant. */
export type TopicWithSubscription = Topic & {
  isSubscribed: boolean;
};

/** Logique métier des topics et de leur état d'abonnement pour l'utilisateur courant. */
export interface TopicService {
  getTopics(): Promise<Topic[]>;
  getTopicById(id: number): Promise<Topic | null>;
  /**
   * Liste tous les topics avec leur état d'abonnement pour l'utilisateur connecté.
   * @throws AppError si aucune session n'est active
   */
  getAllUserTopics(): Promise<TopicWithSubscription[]>;
}

/** Accès aux données de topics. */
export interface TopicRepository {
  findAllTopics(): Promise<Topic[]>;
  findTopicById(id: number): Promise<Topic | null>;
  findAllWithSubscriptionStatus(
    userId: string,
  ): Promise<TopicWithSubscription[]>;
}
