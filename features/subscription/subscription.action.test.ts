import { subscribeAction, unsubscribeAction } from './subscription.action';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

jest.mock('./subscription.service', () => ({
  subscriptionService: {
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  },
}));

import { subscriptionService } from './subscription.service';

jest.mock('../auth/auth.service', () => ({
  authService: {
    getSession: jest.fn(),
  },
}));

import { authService } from '../auth/auth.service';

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

function mockSession() {
  jest.mocked(authService.getSession).mockResolvedValue({
    user: { id: 'user-1' },
  } as Awaited<ReturnType<typeof authService.getSession>>);
}

describe('subscription.action - subscribeAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to / and not subscribe when there is no session', async () => {
    jest.mocked(authService.getSession).mockResolvedValue(null);

    await expect(
      subscribeAction(1, undefined, new FormData()),
    ).rejects.toThrow('NEXT_REDIRECT:/');
    expect(redirect).toHaveBeenCalledWith('/');
    expect(subscriptionService.subscribe).not.toHaveBeenCalled();
  });

  it('should return a field error when the topic id is invalid', async () => {
    mockSession();

    const response = await subscribeAction(-1, undefined, new FormData());

    expect(response).toMatchObject({
      success: false,
      fieldErrors: { topicId: expect.any(Array) },
    });
    expect(subscriptionService.subscribe).not.toHaveBeenCalled();
  });

  it('should declare a server error', async () => {
    mockSession();
    jest
      .mocked(subscriptionService.subscribe)
      .mockRejectedValue(new Error('DB connection failed'));

    await expect(
      subscribeAction(1, undefined, new FormData()),
    ).rejects.toThrow('DB connection failed');
  });

  it('should subscribe and revalidate the topics and profile pages on success', async () => {
    mockSession();
    jest
      .mocked(subscriptionService.subscribe)
      .mockResolvedValue({ id: 1, topicId: 1, userId: 'user-1' });

    const response = await subscribeAction(1, undefined, new FormData());

    expect(response).toEqual({ success: true, data: undefined });
    expect(subscriptionService.subscribe).toHaveBeenCalledWith(1);
    expect(revalidatePath).toHaveBeenCalledWith('/topics');
    expect(revalidatePath).toHaveBeenCalledWith('/profile');
  });
});

describe('subscription.action - unsubscribeAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to / and not unsubscribe when there is no session', async () => {
    jest.mocked(authService.getSession).mockResolvedValue(null);

    await expect(
      unsubscribeAction(1, undefined, new FormData()),
    ).rejects.toThrow('NEXT_REDIRECT:/');
    expect(redirect).toHaveBeenCalledWith('/');
    expect(subscriptionService.unsubscribe).not.toHaveBeenCalled();
  });

  it('should return a field error when the topic id is invalid', async () => {
    mockSession();

    const response = await unsubscribeAction(-1, undefined, new FormData());

    expect(response).toMatchObject({
      success: false,
      fieldErrors: { topicId: expect.any(Array) },
    });
    expect(subscriptionService.unsubscribe).not.toHaveBeenCalled();
  });

  it('should declare a server error', async () => {
    mockSession();
    jest
      .mocked(subscriptionService.unsubscribe)
      .mockRejectedValue(new Error('DB connection failed'));

    await expect(
      unsubscribeAction(1, undefined, new FormData()),
    ).rejects.toThrow('DB connection failed');
  });

  it('should unsubscribe and revalidate the topics and profile pages on success', async () => {
    mockSession();
    jest
      .mocked(subscriptionService.unsubscribe)
      .mockResolvedValue({ id: 1, topicId: 1, userId: 'user-1' });

    const response = await unsubscribeAction(1, undefined, new FormData());

    expect(response).toEqual({ success: true, data: undefined });
    expect(subscriptionService.unsubscribe).toHaveBeenCalledWith(1);
    expect(revalidatePath).toHaveBeenCalledWith('/topics');
    expect(revalidatePath).toHaveBeenCalledWith('/profile');
  });
});
