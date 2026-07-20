import { CreatePostInput } from '@/features/post/dto/createPost.schema';
import { string } from 'zod';

type Post = {
  topicId: number;
  title: string;
  content: string;
};

type CreatePost = Post & { userId: string };

export interface PostService {
  getPosts(): Promise<Post[]>;
  create(input: CreatePostInput): Promise<Post | null>;
}

export interface PostRepository {
  getAllPosts(): Promise<Post[]>;
  createPost({
    userId,
    topicId,
    title,
    content,
  }: CreatePost): Promise<Post | null>;
}
