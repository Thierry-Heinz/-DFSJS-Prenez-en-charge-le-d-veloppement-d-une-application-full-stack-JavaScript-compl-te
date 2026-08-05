import { createComment } from './comment.action';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';

jest.mock('./comment.service', () => ({
  commentService: {
    create: jest.fn(),
  },
}));

import { commentService } from './comment.service';

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

function buildFormData(fields: Record<string, string>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  return formData;
}

describe('comment.action - createComment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to / and not create the comment when there is no session', async () => {
    jest.mocked(authService.getSession).mockResolvedValue(null);
    const formData = buildFormData({ comment: 'Un commentaire' });

    await expect(createComment(1, undefined, formData)).rejects.toThrow(
      'NEXT_REDIRECT:/',
    );
    expect(redirect).toHaveBeenCalledWith('/');
    expect(commentService.create).not.toHaveBeenCalled();
  });

  it('should display a field error when the comment is missing', async () => {
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    const formData = buildFormData({});

    const response = await createComment(1, undefined, formData);

    expect(response).toMatchObject({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { comment: expect.any(Array) },
    });
    expect(commentService.create).not.toHaveBeenCalled();
  });

  it('should display an error if the post does not exist', async () => {
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    jest
      .mocked(commentService.create)
      .mockRejectedValue(new AppError(ErrorMessages.Post_Not_Found));
    const formData = buildFormData({ comment: 'Un commentaire' });

    const response = await createComment(999, undefined, formData);

    expect(response).toEqual({
      success: false,
      error: 'Article introuvable',
    });
  });

  it('should declare a server error', async () => {
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    jest
      .mocked(commentService.create)
      .mockRejectedValue(new Error('DB connection failed'));
    const formData = buildFormData({ comment: 'Un commentaire' });

    await expect(createComment(1, undefined, formData)).rejects.toThrow(
      'DB connection failed',
    );
  });

  it('should create the comment and revalidate the post page on success', async () => {
    jest.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>);
    jest.mocked(commentService.create).mockResolvedValue({
      id: 1,
      comment: 'Un commentaire',
      author: { name: 'Auteur' },
    });
    const formData = buildFormData({ comment: 'Un commentaire' });

    const response = await createComment(1, undefined, formData);

    expect(response).toEqual({
      success: true,
      data: {
        id: 1,
        comment: 'Un commentaire',
        author: { name: 'Auteur' },
      },
    });
    expect(commentService.create).toHaveBeenCalledWith({
      postId: 1,
      comment: 'Un commentaire',
    });
    expect(revalidatePath).toHaveBeenCalledWith('/post/1');
  });
});
