import { render, screen } from '@testing-library/react';
import NavButton from './NavButton';

describe('NavButton', () => {
  it('should render the button text', () => {
    render(<NavButton text="Créer un article" />);
    screen.getByText('Créer un article');
  });

  it('should render a link to the given url when provided', () => {
    render(<NavButton text="Créer un article" url="/post/create" />);
    expect(
      screen.getByRole('link', { name: 'Créer un article' }),
    ).toHaveAttribute('href', '/post/create');
  });

  it('should not render a link when no url is provided', () => {
    render(<NavButton text="Créer un article" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should apply the default className when none is provided', () => {
    render(<NavButton text="Créer un article" />);
    expect(screen.getByRole('button')).toHaveClass('text-white');
  });

  it('should apply a custom className when provided', () => {
    render(<NavButton text="Créer un article" className="text-black" />);
    expect(screen.getByRole('button')).toHaveClass('text-black');
  });
});
