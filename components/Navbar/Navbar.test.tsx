import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('should render its children', () => {
    render(
      <Navbar>
        <div>Nav content</div>
      </Navbar>,
    );
    expect(screen.getByText('Nav content')).toBeInTheDocument();
  });

  it('should render a nav element without children', () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  it('should apply the given className', () => {
    const { container } = render(<Navbar className="hidden lg:block" />);
    expect(container.querySelector('nav')).toHaveClass('hidden', 'lg:block');
  });
});
