import 'server-only';

import { prisma } from '@/lib/prisma';
import { PostRepository } from '@/types/post-types';

export const postRepository: PostRepository = {
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

  findAllPosts: async function () {
    return await prisma.post.findMany({
      include: {
        author: true,
      },
    });
  },

  findPostByIdWithDetails: async function (id) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        topic: true,
        comments: {
          include: { author: true }, // si tu affiches l'auteur de chaque comment
        },
      },
    });
  },
};
