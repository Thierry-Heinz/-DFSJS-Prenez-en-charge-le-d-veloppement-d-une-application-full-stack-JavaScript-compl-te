import { fireEvent, render, screen } from '@testing-library/react';
import ProfileForm from './ProfileForm';

jest.mock('../../../features/auth/profile.action', () => ({
  saveProfile: jest.fn(),
}));

import { saveProfile } from '../../../features/auth/profile.action';

function getInput(container: HTMLElement, name: string) {
  return container.querySelector(`input[name="${name}"]`) as HTMLInputElement;
}

describe('ProfileForm', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = render(
      <ProfileForm username="johndoe" email="user@test.com" />,
    ).container;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should mount pre-filled with the current username and email, password field empty and visible', () => {
    expect(getInput(container, 'username')).toHaveValue('johndoe');
    expect(getInput(container, 'newEmail')).toHaveValue('user@test.com');
    const passwordInput = getInput(container, 'newPassword');
    expect(passwordInput).toHaveValue('');
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('should display a general error message when the submission fails', async () => {
    jest.mocked(saveProfile).mockResolvedValue({
      success: false,
      error: 'Une erreur est survenue',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }));

    expect(
      await screen.findByText('Une erreur est survenue'),
    ).toBeInTheDocument();
  });

  it('should display a field error under the relevant input', async () => {
    jest.mocked(saveProfile).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { username: ['Au moins 3 caractères'] },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }));

    expect(
      await screen.findByText('Au moins 3 caractères'),
    ).toBeInTheDocument();
  });

  it('should submit the form fields and pass the current email to saveProfile', async () => {
    jest.mocked(saveProfile).mockResolvedValue({ success: true, data: undefined });

    fireEvent.change(getInput(container, 'username'), {
      target: { value: 'newusername' },
    });
    fireEvent.change(getInput(container, 'newPassword'), {
      target: { value: 'NewPassword1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }));

    await screen.findByText('Profil mis à jour.');

    const [email, , formData] = jest.mocked(saveProfile).mock.calls[0];
    expect(email).toBe('user@test.com');
    expect(formData.get('username')).toBe('newusername');
    expect(formData.get('newEmail')).toBe('user@test.com');
    expect(formData.get('newPassword')).toBe('NewPassword1!');
  });

  it('should clear the password field on success', async () => {
    jest.mocked(saveProfile).mockResolvedValue({ success: true, data: undefined });

    fireEvent.change(getInput(container, 'newPassword'), {
      target: { value: 'NewPassword1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }));

    await screen.findByText('Profil mis à jour.');

    expect(getInput(container, 'newPassword')).toHaveValue('');
  });

  it('should display the newPassword field error when validation fails', async () => {
    jest.mocked(saveProfile).mockResolvedValue({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { newPassword: ['Au moins 8 caractères'] },
    });

    fireEvent.change(getInput(container, 'newPassword'), {
      target: { value: 'weak' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }));

    expect(
      await screen.findByText('Au moins 8 caractères'),
    ).toBeInTheDocument();
  });
});
