import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';

jest.mock('../../../features/auth/auth.action', () => ({
  login: jest.fn(),
}));

import { login } from '../../../features/auth/auth.action';

describe('LoginForm', () => {
  beforeEach(() => {
    render(<LoginForm />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should mount', () => {
    screen.getByLabelText("E-mail ou nom d'utilisateur");
    screen.getByLabelText('Mot de passe');
  });

  it('should display error if email is invalid', async () => {
    jest.mocked(login).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { identifier: ['Invalid email format'] },
    });

    fireEvent.change(screen.getByLabelText("E-mail ou nom d'utilisateur"), {
      target: { value: 'test@test' },
    });
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'Test!1234' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(await screen.findByText('Invalid email format')).toBeInTheDocument();
  });

  it('should display error if identifier email is wrong', async () => {
    jest.mocked(login).mockResolvedValue({
      success: false,
      error: 'Identifiant ou mot de passe incorrect',
    });

    fireEvent.change(screen.getByLabelText("E-mail ou nom d'utilisateur"), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'Test!1234' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(
      await screen.findByText('Identifiant ou mot de passe incorrect'),
    ).toBeInTheDocument();
  });

  it('should display error if username is invalid', async () => {
    jest.mocked(login).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { identifier: ['Identifier too short'] },
    });

    fireEvent.change(screen.getByLabelText("E-mail ou nom d'utilisateur"), {
      target: { value: 'Te' },
    });
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'Test!1234' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(await screen.findByText('Identifier too short')).toBeInTheDocument();
  });
  it('should display error if identifier username is wrong', async () => {
    jest.mocked(login).mockResolvedValue({
      success: false,
      error: 'Identifiant ou mot de passe incorrect',
    });

    fireEvent.change(screen.getByLabelText("E-mail ou nom d'utilisateur"), {
      target: { value: 'Tessst' },
    });
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'Test!1234' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(
      await screen.findByText('Identifiant ou mot de passe incorrect'),
    ).toBeInTheDocument();
  });

  it('should display error if password is too short', async () => {
    jest.mocked(login).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: {
        password: ['Too small: expected string to have >=8 characters'],
      },
    });

    fireEvent.change(screen.getByLabelText("E-mail ou nom d'utilisateur"), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'Test4568' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(
      await screen.findByText(
        'Too small: expected string to have >=8 characters',
      ),
    ).toBeInTheDocument();
  });
});
