import { topicService } from './topic.service';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';

jest.mock('./topic.repository', () => ({
  topicRepository: {
    findAllTopics: jest.fn(),
    findTopicById: jest.fn(),
    findAllWithSubscriptionStatus: jest.fn(),
  },
}));

jest.mock('../auth/auth.service', () => ({
  authService: {
    getSession: jest.fn(),
  },
}));

import { topicRepository } from './topic.repository';
import { authService } from '../auth/auth.service';

describe('topic.service - getTopics', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the topics from the repository', async () => {
    const topics = [
      { id: 1, name: 'JavaScript', description: null },
      { id: 2, name: 'TypeScript', description: null },
    ];
    jest.mocked(topicRepository.findAllTopics).mockResolvedValue(topics);

    const response = await topicService.getTopics();

    expect(response).toEqual(topics);
    expect(topicRepository.findAllTopics).toHaveBeenCalledTimes(1);
  });
});

describe('topic.service - getTopicById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the topic from the repository', async () => {
    const topic = { id: 1, name: 'JavaScript', description: null };
    jest.mocked(topicRepository.findTopicById).mockResolvedValue(topic);

    const response = await topicService.getTopicById(1);

    expect(response).toEqual(topic);
    expect(topicRepository.findTopicById).toHaveBeenCalledWith(1);
  });

  it('should return null when the topic does not exist', async () => {
    jest.mocked(topicRepository.findTopicById).mockResolvedValue(null);

    const response = await topicService.getTopicById(999);

    expect(response).toBeNull();
  });
});

describe('topic.service - getAllUserTopics', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw a user not found error if there is no session', async () => {
    jest.mocked(authService.getSession).mockResolvedValue(null);

    const promise = topicService.getAllUserTopics();

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.USER_NOT_FOUND.code,
      status: ErrorMessages.USER_NOT_FOUND.status,
    });
    expect(topicRepository.findAllWithSubscriptionStatus).not.toHaveBeenCalled();
  });

  it('should return the topics with subscription status for the current user', async () => {
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    const topics = [
      { id: 1, name: 'JavaScript', description: null, isSubscribed: true },
    ];
    jest
      .mocked(topicRepository.findAllWithSubscriptionStatus)
      .mockResolvedValue(topics);

    const response = await topicService.getAllUserTopics();

    expect(response).toEqual(topics);
    expect(topicRepository.findAllWithSubscriptionStatus).toHaveBeenCalledWith(
      'user-1',
    );
  });
});
