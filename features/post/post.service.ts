import 'server-only';

import { PostService } from '@/types/post-types';
import { CreatePostInput } from './dto/createPost.schema';
import { topicService } from '../topic/topic.service';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';
import { authService } from '../auth/auth.service';
import { postRepository } from './post.repository';

export const postService: PostService = {
  /**
   * Crée un nouvel article après vérification de l'existence du topic
   * et de la session utilisateur.
   * @param input - Données validées du formulaire de création d'article
   * @throws AppError si le topic n'existe pas ou si l'utilisateur n'est pas authentifié
   */
  create: async function (input: CreatePostInput) {
    const { topicId, title, content } = input;
    const intTopicId = +topicId;
    const topicExist = await topicService.getTopicById(intTopicId);

    if (!topicExist) {
      throw new AppError(ErrorMessages.TOPIC_NOT_FOUND);
    }

    const userExist = await authService.getSession();
    if (!userExist) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND);
    }

    const post = await postRepository.createPost({
      userId: userExist.user.id,
      topicId: intTopicId,
      title,
      content,
    });

    return post;
  },

  getPosts: async function () {
    return await postRepository.findAllPosts();
  },

  getPostByIdWithDetails: async function (id) {
    return await postRepository.findPostByIdWithDetails(id);
  },

  getPostById: async function (id) {
    return await postRepository.findPostById(id);
  },
};
