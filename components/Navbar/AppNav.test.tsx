import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AppNav from './AppNav';
import { authClient } from '../../lib/auth/auth-client';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
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

  it('should open the mobile menu when the toggle button is clicked', () => {
    render(<AppNav />);

    expect(screen.queryByText('Se déconnecter')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Ouvrir le menu'));

    expect(screen.getByText('Se déconnecter')).toBeInTheDocument();
  });

  it('should play the exit transition before removing the mobile menu', () => {
    render(<AppNav />);

    fireEvent.click(screen.getByLabelText('Ouvrir le menu'));
    fireEvent.click(screen.getAllByLabelText('Fermer le menu')[0]);

    expect(screen.getByText('Se déconnecter')).toBeInTheDocument();

    fireEvent.transitionEnd(screen.getByTestId('mobile-menu-panel'));

    expect(screen.queryByText('Se déconnecter')).not.toBeInTheDocument();
  });

  it('should sign out and redirect to /login on logout', async () => {
    render(<AppNav />);

    fireEvent.click(screen.getByLabelText('Ouvrir le menu'));
    fireEvent.click(screen.getByText('Se déconnecter'));

    expect(authClient.signOut).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(push).toHaveBeenCalledWith('/login'));
  });
});
