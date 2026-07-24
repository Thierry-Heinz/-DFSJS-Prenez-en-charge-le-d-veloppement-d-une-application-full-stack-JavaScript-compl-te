import { CreatePostInput } from '@/features/post/dto/createPost.schema';
import { Comment, CommentWithAuthor } from './comment-types';

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
type PostWithDetails = Post & {
  author: { name: string };
  topic: {
    id: number;
    name: string;
  };
  comments: CommentWithAuthor[];
};

export interface PostService {
  create(input: CreatePostInput): Promise<CreatePost | null>;
  getPosts(): Promise<PostWithAuthor[]>;
  getPostByIdWithDetails(id: number): Promise<PostWithDetails | null>;
  getPostById(id: number): Promise<Post | null>;
}

export interface PostRepository {
  createPost({
    userId,
    topicId,
    title,
    content,
  }: CreatePost): Promise<CreatePost | null>;
  findAllPosts(): Promise<PostWithAuthor[]>;
  findPostByIdWithDetails(id: number): Promise<PostWithDetails | null>;
  findPostById(id: number): Promise<Post | null>;
}
