import { CreatePostInput } from '@/features/post/dto/createPost.schema';
import { CommentWithAuthor } from './comment-types';

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

/** Article enrichi du nom de son auteur, tel que renvoyé pour les listes. */
export type PostWithAuthor = Post & { author: { name: string } };
/** Article enrichi de son auteur, son topic et ses commentaires, pour la page de détail. */
type PostWithDetails = Post & {
  author: { name: string };
  topic: {
    id: number;
    name: string;
  };
  comments: CommentWithAuthor[];
};

/** Logique métier des articles (création, listing, détail). */
export interface PostService {
  /**
   * Crée un nouvel article après vérification de l'existence du topic
   * et de la session utilisateur.
   * @param input - Données validées du formulaire de création d'article
   * @throws AppError si le topic n'existe pas ou si l'utilisateur n'est pas authentifié
   */
  create(input: CreatePostInput): Promise<CreatePost | null>;
  getPosts(): Promise<PostWithAuthor[]>;
  getPostByIdWithDetails(id: number): Promise<PostWithDetails | null>;
  getPostById(id: number): Promise<Post | null>;
}

/** Accès aux données d'articles. */
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
