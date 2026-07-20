import 'server-only';

import { prisma } from '@/lib/prisma';
import { PostRepository } from '@/types/post-types';

export const postRepository: PostRepository = {
  getAllPosts: async function () {
    return await prisma.post.findMany({
      include: {
        author: true,
      },
    });
  },

  createPost: async function ({ userId, topicId, title, content }) {
    return await prisma.post.create({
      data: {
        userId,
        topicId,
        title,
        content,
      },
    });
  },
};
