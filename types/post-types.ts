import { CreatePostInput } from '@/features/post/dto/createPost.schema';
import { User } from '@/src/generated/prisma/client';

export type Post = {
  id: number;

  userId: string;
  topicId: number;
  title: string;
  content: string;
  createdAt: Date;
};

type CreatePost = Omit<Post, 'id' | 'author' | 'createdAt'> & {
  userId: string;
};

type PostWithAuthor = Post & { author: { name: string } };

export interface PostService {
  create(input: CreatePostInput): Promise<CreatePost | null>;
  getPosts(): Promise<PostWithAuthor[]>;
  getPostByIdWithDetails(id: number): Promise<Post | null>;
}

export interface PostRepository {
  createPost({
    userId,
    topicId,
    title,
    content,
  }: CreatePost): Promise<CreatePost | null>;
  findAllPosts(): Promise<PostWithAuthor[]>;
  findPostByIdWithDetails(id: number): Promise<Post | null>;
}
