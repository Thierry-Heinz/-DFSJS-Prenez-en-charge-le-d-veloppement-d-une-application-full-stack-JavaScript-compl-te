import { render, screen } from '@testing-library/react';
import PostExcerpt from './PostExcerpt';

describe('PostExcerpt', () => {
  it('should render the title, author and content', () => {
    render(
      <PostExcerpt
        id={1}
        title="Titre de l'article"
        author="Auteur"
        date="2026-07-16"
        content="Contenu de l'article"
      />
    );

    screen.getByText("Titre de l'article");
    screen.getByText('Auteur');
    screen.getByText("Contenu de l'article");
  });

  it('should format the date in French locale', () => {
    render(
      <PostExcerpt
        id={1}
        title="Titre"
        author="Auteur"
        date="2026-07-16"
        content="Contenu"
      />
    );

    screen.getByText('16/07/2026');
  });
});
