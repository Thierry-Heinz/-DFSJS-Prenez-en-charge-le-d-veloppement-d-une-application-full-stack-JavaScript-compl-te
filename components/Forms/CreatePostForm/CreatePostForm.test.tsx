import { fireEvent, render, screen } from '@testing-library/react';
import CreatePostForm from './CreatePostForm';

jest.mock('../../../features/post/post.action', () => ({
  createPost: jest.fn(),
}));

import { createPost } from '../../../features/post/post.action';

const topics = [
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'TypeScript' },
];

describe('CreatePostForm', () => {
  beforeEach(() => {
    render(<CreatePostForm topics={topics} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should mount with the topic select, title, content and submit button', () => {
    screen.getByLabelText('Thème');
    screen.getByText('Sélectionner un thème');
    screen.getByLabelText('Titre');
    screen.getByLabelText('Contenu');
    screen.getByRole('button', { name: 'Créer' });
  });

  it('should display a general error message when the submission fails', async () => {
    jest.mocked(createPost).mockResolvedValue({
      success: false,
      error: 'Une erreur est survenue',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

    expect(
      await screen.findByText('Une erreur est survenue'),
    ).toBeInTheDocument();
  });

  it('should display a field error under the topic select', async () => {
    jest.mocked(createPost).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { topicId: ['Thème requis'] },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

    expect(await screen.findByText('Thème requis')).toBeInTheDocument();
  });

  it('should display a field error under the title input', async () => {
    jest.mocked(createPost).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { title: ['Titre requis'] },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

    expect(await screen.findByText('Titre requis')).toBeInTheDocument();
  });

  it('should display a field error under the content textarea', async () => {
    jest.mocked(createPost).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { content: ['Contenu requis'] },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

    expect(await screen.findByText('Contenu requis')).toBeInTheDocument();
  });

  it('should submit the title and content typed by the user', async () => {
    jest.mocked(createPost).mockResolvedValue({
      success: false,
      error: 'Une erreur est survenue',
    });

    fireEvent.change(screen.getByLabelText('Titre'), {
      target: { value: 'Mon titre' },
    });
    fireEvent.change(screen.getByLabelText('Contenu'), {
      target: { value: 'Mon contenu' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

    await screen.findByText('Une erreur est survenue');

    const [, formData] = jest.mocked(createPost).mock.calls[0];
    expect(formData.get('title')).toBe('Mon titre');
    expect(formData.get('content')).toBe('Mon contenu');
  });
});
