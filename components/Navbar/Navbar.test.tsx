import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('should mount', () => {
    render(<Navbar />);
    screen.getByAltText('Monde de Dév');
  });

  it('should render the logo', () => {
    render(<Navbar />);
    expect(screen.getByAltText('Monde de Dév')).toBeInTheDocument();
  });

  it('should render its children', () => {
    render(
      <Navbar>
        <div>Nav content</div>
      </Navbar>,
    );
    expect(screen.getByText('Nav content')).toBeInTheDocument();
  });

  it('should render without children', () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
