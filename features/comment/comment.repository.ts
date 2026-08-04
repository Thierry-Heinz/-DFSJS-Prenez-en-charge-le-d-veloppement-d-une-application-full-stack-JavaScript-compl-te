import 'server-only';

import { prisma } from '@/lib/prisma';
import { CommentRepository } from '@/types/comment-types';

/** Implémentation de {@link CommentRepository} au-dessus de Prisma. */
export const commentRepository: CommentRepository = {
  createComment: async function ({ userId, postId, comment }) {
    return await prisma.comment.create({
      data: {
        userId,
        postId,
        comment,
      },
      include: {
        author: true,
      },
    });
  },
};
