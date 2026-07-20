import { postService } from './post.service';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';

jest.mock('./post.repository', () => ({
  postRepository: {
    getAllPosts: jest.fn(),
    createPost: jest.fn(),
  },
}));

jest.mock('../topic/topic.service', () => ({
  topicService: {
    getTopicById: jest.fn(),
  },
}));

jest.mock('../auth/auth.service', () => ({
  authService: {
    getSession: jest.fn(),
  },
}));

import { postRepository } from './post.repository';
import { topicService } from '../topic/topic.service';
import { authService } from '../auth/auth.service';

describe('post.service - getPosts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the posts from the repository', async () => {
    const posts = [
      {
        id: 1,
        author: { name: 'Auteur' },
        userId: 'user-1',
        topicId: 1,
        title: 'Titre',
        content: 'Contenu',
        createdAt: new Date('2026-07-16'),
      },
    ];
    jest.mocked(postRepository.getAllPosts).mockResolvedValue(posts);

    const response = await postService.getPosts();

    expect(response).toEqual(posts);
    expect(postRepository.getAllPosts).toHaveBeenCalledTimes(1);
  });
});

describe('post.service - create', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const input = { topicId: '1', title: 'Titre', content: 'Contenu' };

  it('should throw a topic not found error if the topic does not exist', async () => {
    jest.mocked(topicService.getTopicById).mockResolvedValue(null);

    const promise = postService.create(input);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.TOPIC_NOT_FOUND.code,
      status: ErrorMessages.TOPIC_NOT_FOUND.status,
    });
    expect(topicService.getTopicById).toHaveBeenCalledWith(1);
    expect(authService.getSession).not.toHaveBeenCalled();
    expect(postRepository.createPost).not.toHaveBeenCalled();
  });

  it('should throw a user not found error if there is no session', async () => {
    jest
      .mocked(topicService.getTopicById)
      .mockResolvedValue({ id: 1, name: 'JavaScript' });
    jest.mocked(authService.getSession).mockResolvedValue(null);

    const promise = postService.create(input);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.USER_NOT_FOUND.code,
      status: ErrorMessages.USER_NOT_FOUND.status,
    });
    expect(postRepository.createPost).not.toHaveBeenCalled();
  });

  it('should trigger a server error', async () => {
    jest
      .mocked(topicService.getTopicById)
      .mockResolvedValue({ id: 1, name: 'JavaScript' });
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    jest
      .mocked(postRepository.createPost)
      .mockRejectedValue(new Error('DB connection failed'));

    await expect(postService.create(input)).rejects.toThrow(
      'DB connection failed',
    );
  });

  it('should create the post with the session user id and the parsed topic id', async () => {
    jest
      .mocked(topicService.getTopicById)
      .mockResolvedValue({ id: 1, name: 'JavaScript' });
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);

    const createdPost = {
      userId: 'user-1',
      topicId: 1,
      title: 'Titre',
      content: 'Contenu',
    };
    jest.mocked(postRepository.createPost).mockResolvedValue(createdPost);

    const response = await postService.create(input);

    expect(response).toEqual(createdPost);
    expect(postRepository.createPost).toHaveBeenCalledWith({
      userId: 'user-1',
      topicId: 1,
      title: 'Titre',
      content: 'Contenu',
    });
  });
});
