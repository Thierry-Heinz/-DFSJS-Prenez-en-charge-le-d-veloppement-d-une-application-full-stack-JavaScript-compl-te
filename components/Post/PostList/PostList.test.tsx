import { fireEvent, render, screen } from '@testing-library/react';
import PostList from './PostList';
import { PostWithAuthor } from '@/types/post-types';

function buildPost(overrides: Partial<PostWithAuthor>): PostWithAuthor {
  return {
    id: 1,
    author: { name: 'Auteur' },
    userId: 'user-1',
    topicId: 1,
    title: 'Titre',
    content: 'Contenu',
    createdAt: new Date('2026-01-01'),
    ...overrides,
  };
}

const posts: PostWithAuthor[] = [
  buildPost({ id: 1, title: 'Premier', createdAt: new Date('2026-01-01') }),
  buildPost({ id: 2, title: 'Deuxième', createdAt: new Date('2026-03-01') }),
  buildPost({ id: 3, title: 'Troisième', createdAt: new Date('2026-02-01') }),
];

function getRenderedTitles() {
  return screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent);
}

describe('PostList', () => {
  it('should render a PostExcerpt for each post', () => {
    render(<PostList posts={posts} />);
    expect(getRenderedTitles()).toHaveLength(3);
  });

  it('should render the "Créer un article" link to /post/create', () => {
    render(<PostList posts={posts} />);
    expect(
      screen.getByRole('link', { name: 'Créer un article' }),
    ).toHaveAttribute('href', '/post/create');
  });

  it('should sort posts ascending by date by default', () => {
    render(<PostList posts={posts} />);
    expect(getRenderedTitles()).toEqual(['Premier', 'Troisième', 'Deuxième']);
  });

  it('should reverse the sort order when the sort button is clicked', () => {
    render(<PostList posts={posts} />);

    fireEvent.click(screen.getByRole('button', { name: /Trier par/ }));

    expect(getRenderedTitles()).toEqual(['Deuxième', 'Troisième', 'Premier']);
  });

  it('should sort ascending again when the sort button is clicked twice', () => {
    render(<PostList posts={posts} />);

    fireEvent.click(screen.getByRole('button', { name: /Trier par/ }));
    fireEvent.click(screen.getByRole('button', { name: /Trier par/ }));

    expect(getRenderedTitles()).toEqual(['Premier', 'Troisième', 'Deuxième']);
  });
});
