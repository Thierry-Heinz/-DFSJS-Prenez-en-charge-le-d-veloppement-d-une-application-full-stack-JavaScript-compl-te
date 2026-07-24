import { render, screen } from '@testing-library/react';
import CommentList from './CommentList';
import { CommentWithAuthor } from '@/types/comment-types';

function buildComment(overrides: Partial<CommentWithAuthor>): CommentWithAuthor {
  return {
    id: 1,
    comment: 'Un commentaire',
    author: { name: 'Auteur' },
    ...overrides,
  };
}

describe('CommentList', () => {
  it('should render nothing when there are no comments', () => {
    const { container } = render(<CommentList comments={[]} />);
    expect(container.querySelector('span')).not.toBeInTheDocument();
  });

  it('should render the author name and comment text for each comment', () => {
    const comments = [
      buildComment({ id: 1, comment: 'Premier commentaire', author: { name: 'Alice' } }),
      buildComment({ id: 2, comment: 'Deuxième commentaire', author: { name: 'Bob' } }),
    ];

    render(<CommentList comments={comments} />);

    screen.getByText('Alice');
    screen.getByText('Premier commentaire');
    screen.getByText('Bob');
    screen.getByText('Deuxième commentaire');
  });

  it('should alternate the row direction between even and odd comments', () => {
    const comments = [
      buildComment({ id: 1 }),
      buildComment({ id: 2 }),
      buildComment({ id: 3 }),
    ];

    const { container } = render(<CommentList comments={comments} />);
    const rows = container.querySelectorAll(':scope > div > div');

    expect(rows[0]).toHaveClass('flex-row');
    expect(rows[1]).toHaveClass('flex-row-reverse');
    expect(rows[2]).toHaveClass('flex-row');
  });
});
