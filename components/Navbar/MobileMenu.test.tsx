import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MobileMenu from './MobileMenu';

const navItems = [
  { label: 'Thèmes', href: '/themes' },
  { label: 'Articles', href: '/dashboard' },
];

describe('MobileMenu', () => {
  it('should render the toggle button and no dialog when closed', () => {
    render(<MobileMenu onLogout={jest.fn()} navItems={navItems} />);

    expect(screen.getByLabelText('Ouvrir le menu')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should open the dialog with the nav items and logout button when the toggle is clicked', () => {
    render(<MobileMenu onLogout={jest.fn()} navItems={navItems} />);

    fireEvent.click(screen.getByLabelText('Ouvrir le menu'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Thèmes')).toBeInTheDocument();
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Se déconnecter')).toBeInTheDocument();
  });

  it('should close the dialog when the backdrop is clicked', async () => {
    render(<MobileMenu onLogout={jest.fn()} navItems={navItems} />);

    fireEvent.click(screen.getByLabelText('Ouvrir le menu'));
    fireEvent.click(screen.getByLabelText('Fermer le menu'));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('should close the dialog when the Escape key is pressed', async () => {
    render(<MobileMenu onLogout={jest.fn()} navItems={navItems} />);

    fireEvent.click(screen.getByLabelText('Ouvrir le menu'));
    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('should call onLogout when the logout button is clicked', () => {
    const onLogout = jest.fn();
    render(<MobileMenu onLogout={onLogout} navItems={navItems} />);

    fireEvent.click(screen.getByLabelText('Ouvrir le menu'));
    fireEvent.click(screen.getByText('Se déconnecter'));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('should close the dialog when a nav link is clicked', async () => {
    render(<MobileMenu onLogout={jest.fn()} navItems={navItems} />);

    fireEvent.click(screen.getByLabelText('Ouvrir le menu'));
    fireEvent.click(screen.getByText('Thèmes'));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('should restore focus to the toggle button when the dialog closes', async () => {
    render(<MobileMenu onLogout={jest.fn()} navItems={navItems} />);

    const toggleButton = screen.getByLabelText('Ouvrir le menu');
    fireEvent.click(toggleButton);
    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => expect(toggleButton).toHaveFocus());
  });
});
