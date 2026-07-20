import { topicService } from './topic.service';

jest.mock('./topic.repository', () => ({
  topicRepository: {
    findAllTopics: jest.fn(),
    findTopicById: jest.fn(),
  },
}));

import { topicRepository } from './topic.repository';

describe('topic.service - getTopics', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the topics from the repository', async () => {
    const topics = [
      { id: 1, name: 'JavaScript' },
      { id: 2, name: 'TypeScript' },
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
    const topic = { id: 1, name: 'JavaScript' };
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
