import { CommentService } from '@/types/comment-types';
import { CreateCommentInput } from './dto/createComment.schema';
import { postService } from '../post/post.service';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';
import { authService } from '../auth/auth.service';
import { commentRepository } from './comment.repository';

export const commentService: CommentService = {
  create: async function (input: CreateCommentInput) {
    const { postId, comment } = input;

    const postExists = await postService.getPostById(postId);
    if (!postExists) {
      throw new AppError(ErrorMessages.Post_Not_Found);
    }

    const userExists = await authService.getSession();
    if (!userExists) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND);
    }

    const commentCreated = await commentRepository.createComment({
      userId: userExists.user.id,
      postId: postExists.id,
      comment,
    });
    return commentCreated;
  },
};
