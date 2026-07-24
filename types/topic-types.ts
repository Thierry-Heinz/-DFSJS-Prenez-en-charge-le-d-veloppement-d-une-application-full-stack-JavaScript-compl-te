type Topic = {
  id: number;
  name: string;
  description: string | null;
};

export type TopicWithSubscription = Topic & {
  isSubscribed: boolean;
};

export interface TopicService {
  getTopics(): Promise<Topic[]>;
  getTopicById(id: number): Promise<Topic | null>;
  getAllUserTopics(): Promise<TopicWithSubscription[]>;
}

export interface TopicRepository {
  findAllTopics(): Promise<Topic[]>;
  findTopicById(id: number): Promise<Topic | null>;
  findAllWithSubscriptionStatus(
    userId: string,
  ): Promise<TopicWithSubscription[]>;
}
