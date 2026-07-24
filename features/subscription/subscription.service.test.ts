import { subscriptionService } from './subscription.service';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';

jest.mock('./subscription.repository', () => ({
  subscriptionRepository: {
    create: jest.fn(),
    delete: jest.fn(),
    findByUserId: jest.fn(),
  },
}));

jest.mock('../auth/auth.service', () => ({
  authService: {
    getSession: jest.fn(),
  },
}));

import { subscriptionRepository } from './subscription.repository';
import { authService } from '../auth/auth.service';

function mockSession() {
  jest.mocked(authService.getSession).mockResolvedValue({
    user: { id: 'user-1' },
  } as Awaited<ReturnType<typeof authService.getSession>>);
}

describe('subscription.service - subscribe', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw a user not found error if there is no session', async () => {
    jest.mocked(authService.getSession).mockResolvedValue(null);

    const promise = subscriptionService.subscribe(1);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.USER_NOT_FOUND.code,
      status: ErrorMessages.USER_NOT_FOUND.status,
    });
    expect(subscriptionRepository.create).not.toHaveBeenCalled();
  });

  it('should create the subscription with the session user id', async () => {
    mockSession();
    const subscription = { id: 1, topicId: 1, userId: 'user-1' };
    jest.mocked(subscriptionRepository.create).mockResolvedValue(subscription);

    const response = await subscriptionService.subscribe(1);

    expect(response).toEqual(subscription);
    expect(subscriptionRepository.create).toHaveBeenCalledWith(1, 'user-1');
  });
});

describe('subscription.service - unsubscribe', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw a user not found error if there is no session', async () => {
    jest.mocked(authService.getSession).mockResolvedValue(null);

    const promise = subscriptionService.unsubscribe(1);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.USER_NOT_FOUND.code,
      status: ErrorMessages.USER_NOT_FOUND.status,
    });
    expect(subscriptionRepository.delete).not.toHaveBeenCalled();
  });

  it('should delete the subscription with the session user id', async () => {
    mockSession();
    const subscription = { id: 1, topicId: 1, userId: 'user-1' };
    jest.mocked(subscriptionRepository.delete).mockResolvedValue(subscription);

    const response = await subscriptionService.unsubscribe(1);

    expect(response).toEqual(subscription);
    expect(subscriptionRepository.delete).toHaveBeenCalledWith(1, 'user-1');
  });
});

describe('subscription.service - getUserSubscriptions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw a user not found error if there is no session', async () => {
    jest.mocked(authService.getSession).mockResolvedValue(null);

    const promise = subscriptionService.getUserSubscriptions();

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.USER_NOT_FOUND.code,
      status: ErrorMessages.USER_NOT_FOUND.status,
    });
    expect(subscriptionRepository.findByUserId).not.toHaveBeenCalled();
  });

  it('should return the subscriptions for the session user id', async () => {
    mockSession();
    const subscriptions = [{ id: 1, topicId: 1, userId: 'user-1' }];
    jest
      .mocked(subscriptionRepository.findByUserId)
      .mockResolvedValue(subscriptions);

    const response = await subscriptionService.getUserSubscriptions();

    expect(response).toEqual(subscriptions);
    expect(subscriptionRepository.findByUserId).toHaveBeenCalledWith('user-1');
  });
});
