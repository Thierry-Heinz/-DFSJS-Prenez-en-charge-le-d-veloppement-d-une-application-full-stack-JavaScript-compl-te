import { CreateCommentInput } from '@/features/comment/dto/createComment.schema';

export type Comment = {
  id: number;
  comment: string;
};

/** Commentaire enrichi du nom de son auteur, tel que renvoyé pour l'affichage. */
export type CommentWithAuthor = Comment & {
  author: {
    name: string;
  };
};

/** Logique métier de création de commentaires. */
export interface CommentService {
  /**
   * Crée un commentaire après vérification de l'existence de l'article
   * et de la session utilisateur.
   * @param input - Données validées du formulaire de commentaire
   * @throws AppError si l'article n'existe pas ou si l'utilisateur n'est pas authentifié
   */
  create(input: CreateCommentInput): Promise<CommentWithAuthor>;
}

type CreateComment = {
  userId: string;
  postId: number;
  comment: string;
};

/** Accès aux données de commentaires. */
export interface CommentRepository {
  createComment({
    userId,
    postId,
    comment,
  }: CreateComment): Promise<CommentWithAuthor>;
}
