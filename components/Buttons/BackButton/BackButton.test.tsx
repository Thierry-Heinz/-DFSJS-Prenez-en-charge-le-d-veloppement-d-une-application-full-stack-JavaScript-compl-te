import { render, screen } from '@testing-library/react';
import BackButton from './BackButton';

describe('BackButton', () => {
  it('should render a link pointing to the given url', () => {
    render(<BackButton url="/dashboard" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/dashboard');
  });

  it('should render the back arrow icon', () => {
    render(<BackButton url="/dashboard" />);
    expect(screen.getByAltText('Flèche de retour')).toBeInTheDocument();
  });
});
