import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AppNav from './AppNav';
import { authClient } from '../../lib/auth/auth-client';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/dashboard',
}));

jest.mock('../../lib/auth/auth-client', () => ({
  authClient: { signOut: jest.fn().mockResolvedValue(undefined) },
}));

describe('AppNav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the nav links', () => {
    render(<AppNav />);
    expect(screen.getAllByText('Thèmes').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Articles').length).toBeGreaterThan(0);
  });

  it('should render the desktop logout button', () => {
    render(<AppNav />);
    expect(screen.getByLabelText('Se déconnecter')).toBeInTheDocument();
  });

  it('should sign out and redirect to / when the desktop logout button is clicked', async () => {
    render(<AppNav />);

    fireEvent.click(screen.getByLabelText('Se déconnecter'));

    expect(authClient.signOut).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
  });

  it('should open the mobile menu when the toggle button is clicked', () => {
    render(<AppNav />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Ouvrir le menu'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should play the exit transition before removing the mobile menu', () => {
    render(<AppNav />);

    fireEvent.click(screen.getByLabelText('Ouvrir le menu'));
    fireEvent.click(screen.getAllByLabelText('Fermer le menu')[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.transitionEnd(screen.getByTestId('mobile-menu-panel'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should sign out and redirect to / on logout', async () => {
    render(<AppNav />);

    fireEvent.click(screen.getByLabelText('Ouvrir le menu'));
    fireEvent.click(
      within(screen.getByRole('dialog')).getByText('Se déconnecter'),
    );

    expect(authClient.signOut).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
  });
});
