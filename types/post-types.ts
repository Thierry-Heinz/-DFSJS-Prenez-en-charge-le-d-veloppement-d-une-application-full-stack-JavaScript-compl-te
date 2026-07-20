import { CreatePostInput } from '@/features/post/dto/createPost.schema';
import { User } from '@/src/generated/prisma/client';

export type Post = {
  id: number;
  author: { name: string };
  userId: string;
  topicId: number;
  title: string;
  content: string;
  createdAt: Date;
};

type CreatePost = Omit<Post, 'id' | 'author' | 'createdAt'> & {
  userId: string;
};

export interface PostService {
  getPosts(): Promise<Post[]>;
  create(input: CreatePostInput): Promise<CreatePost | null>;
}

export interface PostRepository {
  getAllPosts(): Promise<Post[]>;
  createPost({
    userId,
    topicId,
    title,
    content,
  }: CreatePost): Promise<CreatePost | null>;
}
