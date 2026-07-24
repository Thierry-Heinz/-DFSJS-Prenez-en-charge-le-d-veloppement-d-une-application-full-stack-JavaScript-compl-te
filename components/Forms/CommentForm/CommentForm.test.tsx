import { fireEvent, render, screen } from '@testing-library/react';
import CommentForm from './CommentForm';

jest.mock('../../../features/comment/comment.action', () => ({
  createComment: jest.fn(),
}));

import { createComment } from '../../../features/comment/comment.action';

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '3' }),
}));

describe('CommentForm', () => {
  beforeEach(() => {
    render(<CommentForm />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should mount with the comment textarea and submit button', () => {
    screen.getByPlaceholderText('Écrivez ici votre commentaire');
    screen.getByRole('button', { name: 'créer un commentaire' });
  });

  it('should display a general error message when the submission fails', async () => {
    jest.mocked(createComment).mockResolvedValue({
      success: false,
      error: 'Une erreur est survenue',
    });

    fireEvent.change(
      screen.getByPlaceholderText('Écrivez ici votre commentaire'),
      { target: { value: 'Un commentaire' } },
    );
    fireEvent.click(screen.getByRole('button', { name: 'créer un commentaire' }));

    expect(
      await screen.findByText('Une erreur est survenue'),
    ).toBeInTheDocument();
  });

  it('should display a field error under the textarea', async () => {
    jest.mocked(createComment).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { comment: ['Commentaire requis'] },
    });

    fireEvent.change(
      screen.getByPlaceholderText('Écrivez ici votre commentaire'),
      { target: { value: 'Un commentaire' } },
    );
    fireEvent.click(screen.getByRole('button', { name: 'créer un commentaire' }));

    expect(await screen.findByText('Commentaire requis')).toBeInTheDocument();
  });

  it('should submit the comment typed by the user along with the post id from the route params', async () => {
    jest.mocked(createComment).mockResolvedValue({
      success: false,
      error: 'Une erreur est survenue',
    });

    fireEvent.change(
      screen.getByPlaceholderText('Écrivez ici votre commentaire'),
      { target: { value: 'Mon commentaire' } },
    );
    fireEvent.click(screen.getByRole('button', { name: 'créer un commentaire' }));

    await screen.findByText('Une erreur est survenue');

    const [postId, , formData] = jest.mocked(createComment).mock.calls[0];
    expect(postId).toBe(3);
    expect(formData.get('comment')).toBe('Mon commentaire');
  });
});
