import { PrismaPromise } from '@prisma/client';

type Topic = {
  name: string;
  id: number;
};

export interface TopicService {
  getTopics(): Promise<Topic[]>;
  getTopicById(id: number): Promise<Topic | null>;
}

export interface TopicRepository {
  findAllTopics(): Promise<Topic[]>;
  findTopicById(id: number): Promise<Topic | null>;
}
