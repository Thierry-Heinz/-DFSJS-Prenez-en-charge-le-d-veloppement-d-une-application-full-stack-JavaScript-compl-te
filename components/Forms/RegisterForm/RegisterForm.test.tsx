import { fireEvent, render, screen } from '@testing-library/react';
import RegisterForm from './RegisterForm';

jest.mock('../../../features/auth/auth.action', () => ({
  register: jest.fn(),
}));

import { register } from '../../../features/auth/auth.action';

describe('RegisterForm', () => {
  beforeEach(() => {
    render(<RegisterForm />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should mount', () => {
    screen.getByLabelText("Nom d'utilisateur");
    screen.getByLabelText('E-mail');
    screen.getByLabelText('Mot de passe');
  });

  function fillForm({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    fireEvent.change(screen.getByLabelText("Nom d'utilisateur"), {
      target: { value: username },
    });
    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: email },
    });
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: password },
    });
  }

  it('should display error if the email is already taken', async () => {
    jest.mocked(register).mockResolvedValue({
      success: false,
      error: 'Un compte existe déjà avec cet email',
    });

    fillForm({ username: 'Test', email: 'test@test.com', password: 'Test!1234' });
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    expect(
      await screen.findByText('Un compte existe déjà avec cet email'),
    ).toBeInTheDocument();
  });

  it('should display error if the username is already taken', async () => {
    jest.mocked(register).mockResolvedValue({
      success: false,
      error: 'User already exists',
    });

    fillForm({ username: 'Test', email: 'test@test.com', password: 'Test!1234' });
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    expect(await screen.findByText('User already exists')).toBeInTheDocument();
  });

  it('should display error if the email is invalid', async () => {
    jest.mocked(register).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { email: ['Invalid email format'] },
    });

    fillForm({ username: 'Test', email: 'test@test', password: 'Test!1234' });
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    expect(await screen.findByText('Invalid email format')).toBeInTheDocument();
  });

  it('should display error if the username is too short', async () => {
    jest.mocked(register).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { username: ['Too small: expected string to have >=3 characters'] },
    });

    fillForm({ username: 'Te', email: 'test@test.com', password: 'Test!1234' });
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    expect(
      await screen.findByText('Too small: expected string to have >=3 characters'),
    ).toBeInTheDocument();
  });

  it('should display error if the password is too short', async () => {
    jest.mocked(register).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { password: ['Au moins 8 caractères'] },
    });

    fillForm({ username: 'Test', email: 'test@test.com', password: 'T!1234' });
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    expect(await screen.findByText('Au moins 8 caractères')).toBeInTheDocument();
  });

  it('should display error if the password has no lowercase character', async () => {
    jest.mocked(register).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { password: ['Au moins une lettre minuscule'] },
    });

    fillForm({ username: 'Test', email: 'test@test.com', password: 'TEST!1234' });
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    expect(
      await screen.findByText('Au moins une lettre minuscule'),
    ).toBeInTheDocument();
  });

  it('should display error if the password has no uppercase character', async () => {
    jest.mocked(register).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { password: ['Au moins une lettre majuscule'] },
    });

    fillForm({ username: 'Test', email: 'test@test.com', password: 'test!1234' });
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    expect(
      await screen.findByText('Au moins une lettre majuscule'),
    ).toBeInTheDocument();
  });

  it('should display error if the password has no number', async () => {
    jest.mocked(register).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { password: ['Au moins un chiffre'] },
    });

    fillForm({ username: 'Test', email: 'test@test.com', password: 'test!test' });
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    expect(await screen.findByText('Au moins un chiffre')).toBeInTheDocument();
  });

  it('should display error if the password has no special character', async () => {
    jest.mocked(register).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { password: ['Au moins un caractère spécial'] },
    });

    fillForm({ username: 'Test', email: 'test@test.com', password: 'test1234' });
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    expect(
      await screen.findByText('Au moins un caractère spécial'),
    ).toBeInTheDocument();
  });
});
