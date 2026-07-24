export type Subscription = {
  topicId: number;
  userId: string;
  id: number;
};

export interface SubscriptionService {
  subscribe(topicId: number): Promise<Subscription>;
  unsubscribe(topicId: number): Promise<Subscription>;
  getUserSubscriptions(): Promise<Subscription[]>;
}

export interface SubscriptionRepository {
  create(topicId: number, userId: string): Promise<Subscription>;
  delete(topicId: number, userId: string): Promise<Subscription>;
  findByUserId(userId: string): Promise<Subscription[]>;
}
