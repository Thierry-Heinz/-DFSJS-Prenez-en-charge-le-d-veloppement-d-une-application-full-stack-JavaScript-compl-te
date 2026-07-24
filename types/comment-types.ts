import { CreateCommentInput } from '@/features/comment/dto/createComment.schema';

export type Comment = {
  id: number;
  comment: string;
};

export type CommentWithAuthor = Comment & {
  author: {
    name: string;
  };
};

export interface CommentService {
  create(input: CreateCommentInput): Promise<CommentWithAuthor>;
}

type CreateComment = {
  userId: string;
  postId: number;
  comment: string;
};

export interface CommentRepository {
  createComment({
    userId,
    postId,
    comment,
  }: CreateComment): Promise<CommentWithAuthor>;
}
