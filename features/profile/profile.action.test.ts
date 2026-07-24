import { saveProfile } from './profile.action';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

jest.mock('../auth/auth.service', () => ({
  authService: {
    getSession: jest.fn(),
  },
}));

import { authService } from '../auth/auth.service';

jest.mock('./profile.service', () => ({
  profileService: {
    updateUser: jest.fn(),
    changeEmail: jest.fn(),
    setPassword: jest.fn(),
  },
}));

import { profileService } from './profile.service';

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

function buildFormData(fields: Record<string, string>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  return formData;
}

function mockSession() {
  jest.mocked(authService.getSession).mockResolvedValue({
    user: { id: 'user-1' },
  } as Awaited<ReturnType<typeof authService.getSession>>);
}

describe('profile.action - saveProfile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to / and change nothing when there is no session', async () => {
    jest.mocked(authService.getSession).mockResolvedValue(null);
    const formData = buildFormData({ username: 'johndoe', newEmail: 'user@test.com' });

    await expect(
      saveProfile('user@test.com', undefined, formData),
    ).rejects.toThrow('NEXT_REDIRECT:/');
    expect(redirect).toHaveBeenCalledWith('/');
    expect(profileService.updateUser).not.toHaveBeenCalled();
  });

  it('should return a field error when the username is invalid', async () => {
    mockSession();
    const formData = buildFormData({ username: 'ab', newEmail: 'user@test.com' });

    const response = await saveProfile('user@test.com', undefined, formData);

    expect(response).toMatchObject({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { username: expect.any(Array) },
    });
    expect(profileService.updateUser).not.toHaveBeenCalled();
  });

  it('should only update the username when the email is unchanged and no password is provided', async () => {
    mockSession();
    const formData = buildFormData({ username: 'johndoe', newEmail: 'user@test.com' });

    const response = await saveProfile('user@test.com', undefined, formData);

    expect(response).toEqual({ success: true, data: undefined });
    expect(profileService.updateUser).toHaveBeenCalledWith('johndoe');
    expect(profileService.changeEmail).not.toHaveBeenCalled();
    expect(profileService.setPassword).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/profile');
  });

  it('should not change the email when the newEmail field is missing from the form data', async () => {
    mockSession();
    const formData = buildFormData({ username: 'johndoe' });

    const response = await saveProfile('', undefined, formData);

    expect(response).toEqual({ success: true, data: undefined });
    expect(profileService.changeEmail).not.toHaveBeenCalled();
  });

  it('should change the email when it differs from the current one', async () => {
    mockSession();
    const formData = buildFormData({ username: 'johndoe', newEmail: 'new@test.com' });

    const response = await saveProfile('old@test.com', undefined, formData);

    expect(response).toEqual({ success: true, data: undefined });
    expect(profileService.changeEmail).toHaveBeenCalledWith('new@test.com');
  });

  it('should change the password when a new password is provided', async () => {
    mockSession();
    const formData = buildFormData({
      username: 'johndoe',
      newEmail: 'user@test.com',
      newPassword: 'NewPassword1!',
    });

    const response = await saveProfile('user@test.com', undefined, formData);

    expect(response).toEqual({ success: true, data: undefined });
    expect(profileService.setPassword).toHaveBeenCalledWith('NewPassword1!');
  });

  it('should return a field error when the new password is too weak', async () => {
    mockSession();
    const formData = buildFormData({
      username: 'johndoe',
      newEmail: 'user@test.com',
      newPassword: 'weak',
    });

    const response = await saveProfile('user@test.com', undefined, formData);

    expect(response).toMatchObject({
      success: false,
      error: 'Validation échouée',
      fieldErrors: { newPassword: expect.any(Array) },
    });
    expect(profileService.setPassword).not.toHaveBeenCalled();
  });

  it('should declare a server error', async () => {
    mockSession();
    jest
      .mocked(profileService.updateUser)
      .mockRejectedValue(new Error('DB connection failed'));
    const formData = buildFormData({ username: 'johndoe', newEmail: 'user@test.com' });

    await expect(
      saveProfile('user@test.com', undefined, formData),
    ).rejects.toThrow('DB connection failed');
  });
});
