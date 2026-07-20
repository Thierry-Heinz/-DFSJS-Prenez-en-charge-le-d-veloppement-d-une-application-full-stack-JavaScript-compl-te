import { createPost } from './post.action';
import { redirect } from 'next/navigation';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';

jest.mock('./post.service', () => ({
  postService: {
    create: jest.fn(),
  },
}));

import { postService } from './post.service';

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

function buildFormData(fields: Record<string, string>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  return formData;
}

describe('post.action - createPost', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to / and not create the post when there is no session', async () => {
    jest.mocked(authService.getSession).mockResolvedValue(null);
    const formData = buildFormData({
      topicId: '1',
      title: 'Titre',
      content: 'Contenu',
    });

    await expect(createPost(undefined, formData)).rejects.toThrow(
      'NEXT_REDIRECT:/',
    );
    expect(redirect).toHaveBeenCalledWith('/');
    expect(postService.create).not.toHaveBeenCalled();
  });

  it('should display field errors when a required field is missing', async () => {
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    const formData = buildFormData({ topicId: '1', content: 'Contenu' });

    const response = await createPost(undefined, formData);

    expect(response).toMatchObject({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { title: expect.any(Array) },
    });
    expect(postService.create).not.toHaveBeenCalled();
  });

  it('should display an error if the topic does not exist', async () => {
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    jest
      .mocked(postService.create)
      .mockRejectedValue(new AppError(ErrorMessages.TOPIC_NOT_FOUND));
    const formData = buildFormData({
      topicId: '999',
      title: 'Titre',
      content: 'Contenu',
    });

    const response = await createPost(undefined, formData);

    expect(response).toEqual({
      success: false,
      error: 'topic not found',
    });
  });

  it('should declare a server error', async () => {
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    jest
      .mocked(postService.create)
      .mockRejectedValue(new Error('DB connection failed'));
    const formData = buildFormData({
      topicId: '1',
      title: 'Titre',
      content: 'Contenu',
    });

    await expect(createPost(undefined, formData)).rejects.toThrow(
      'DB connection failed',
    );
  });

  it('should create the post and redirect to /dashboard on success', async () => {
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    jest.mocked(postService.create).mockResolvedValue({
      userId: 'user-1',
      topicId: 1,
      title: 'Titre',
      content: 'Contenu',
    });
    const formData = buildFormData({
      topicId: '1',
      title: 'Titre',
      content: 'Contenu',
    });

    await expect(createPost(undefined, formData)).rejects.toThrow(
      'NEXT_REDIRECT:/dashboard',
    );
    expect(postService.create).toHaveBeenCalledWith({
      topicId: '1',
      title: 'Titre',
      content: 'Contenu',
    });
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });
});
