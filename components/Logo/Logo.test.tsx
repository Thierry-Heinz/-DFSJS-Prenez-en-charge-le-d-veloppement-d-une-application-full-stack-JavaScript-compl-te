import { render, screen } from '@testing-library/react';
import Logo from './Logo';

describe('Logo', () => {
  it('should mount', () => {
    render(<Logo />);
    screen.getByAltText('Monde de Dév');
  });

  it('should render the logo image with the expected src', () => {
    render(<Logo />);
    const image = screen.getByAltText('Monde de Dév');
    expect(image).toHaveAttribute('src', expect.stringContaining('logo_navbar.png'));
  });
});
