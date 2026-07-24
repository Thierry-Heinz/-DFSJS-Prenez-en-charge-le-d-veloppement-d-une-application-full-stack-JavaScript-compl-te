import 'server-only';

import { prisma } from '@/lib/prisma';
import { CommentRepository } from '@/types/comment-types';

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
