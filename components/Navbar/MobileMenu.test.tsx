import { fireEvent, render, screen } from '@testing-library/react';
import MobileMenu from './MobileMenu';

const navItems = [
  { label: 'Thèmes', href: '/themes' },
  { label: 'Articles', href: '/dashboard' },
];

describe('MobileMenu', () => {
  it('should render nothing when closed', () => {
    const { container } = render(
      <MobileMenu isOpen={false} onClose={jest.fn()} onLogout={jest.fn()} navItems={navItems} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render the nav items and logout button when open', () => {
    render(
      <MobileMenu isOpen={true} onClose={jest.fn()} onLogout={jest.fn()} navItems={navItems} />,
    );

    expect(screen.getByText('Thèmes')).toBeInTheDocument();
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Se déconnecter')).toBeInTheDocument();
  });

  it('should call onClose when the backdrop is clicked', () => {
    const onClose = jest.fn();
    render(
      <MobileMenu isOpen={true} onClose={onClose} onLogout={jest.fn()} navItems={navItems} />,
    );

    fireEvent.click(screen.getAllByLabelText('Fermer le menu')[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the Escape key is pressed', () => {
    const onClose = jest.fn();
    render(
      <MobileMenu isOpen={true} onClose={onClose} onLogout={jest.fn()} navItems={navItems} />,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onLogout when the logout button is clicked', () => {
    const onLogout = jest.fn();
    render(
      <MobileMenu isOpen={true} onClose={jest.fn()} onLogout={onLogout} navItems={navItems} />,
    );

    fireEvent.click(screen.getByText('Se déconnecter'));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
