import { commentService } from './comment.service';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';

jest.mock('./comment.repository', () => ({
  commentRepository: {
    createComment: jest.fn(),
  },
}));

jest.mock('../post/post.service', () => ({
  postService: {
    getPostById: jest.fn(),
  },
}));

jest.mock('../auth/auth.service', () => ({
  authService: {
    getSession: jest.fn(),
  },
}));

import { commentRepository } from './comment.repository';
import { postService } from '../post/post.service';
import { authService } from '../auth/auth.service';

describe('comment.service - create', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const input = { postId: 1, comment: 'Un commentaire' };

  const existingPost = {
    id: 1,
    userId: 'author-1',
    topicId: 1,
    title: 'Titre',
    content: 'Contenu',
    createdAt: new Date('2026-01-01'),
  };

  it('should throw a post not found error if the post does not exist', async () => {
    jest.mocked(postService.getPostById).mockResolvedValue(null);

    const promise = commentService.create(input);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.Post_Not_Found.code,
      status: ErrorMessages.Post_Not_Found.status,
    });
    expect(postService.getPostById).toHaveBeenCalledWith(1);
    expect(authService.getSession).not.toHaveBeenCalled();
    expect(commentRepository.createComment).not.toHaveBeenCalled();
  });

  it('should throw a user not found error if there is no session', async () => {
    jest.mocked(postService.getPostById).mockResolvedValue(existingPost);
    jest.mocked(authService.getSession).mockResolvedValue(null);

    const promise = commentService.create(input);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.USER_NOT_FOUND.code,
      status: ErrorMessages.USER_NOT_FOUND.status,
    });
    expect(commentRepository.createComment).not.toHaveBeenCalled();
  });

  it('should trigger a server error', async () => {
    jest.mocked(postService.getPostById).mockResolvedValue(existingPost);
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    jest
      .mocked(commentRepository.createComment)
      .mockRejectedValue(new Error('DB connection failed'));

    await expect(commentService.create(input)).rejects.toThrow(
      'DB connection failed',
    );
  });

  it('should create the comment using the id returned by getPostById rather than the raw input', async () => {
    jest
      .mocked(postService.getPostById)
      .mockResolvedValue({ ...existingPost, id: 42 });
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    const createdComment = {
      id: 1,
      comment: 'Un commentaire',
      author: { name: 'Auteur' },
    };
    jest.mocked(commentRepository.createComment).mockResolvedValue(createdComment);

    const response = await commentService.create(input);

    expect(response).toEqual(createdComment);
    expect(commentRepository.createComment).toHaveBeenCalledWith({
      userId: 'user-1',
      postId: 42,
      comment: 'Un commentaire',
    });
  });
});
