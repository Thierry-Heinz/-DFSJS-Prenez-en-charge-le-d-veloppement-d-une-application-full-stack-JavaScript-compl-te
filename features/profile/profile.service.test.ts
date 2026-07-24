import { profileService } from './profile.service';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';

jest.mock('./profile.repository', () => ({
  profileRepository: {
    setPassword: jest.fn(),
    updateUser: jest.fn(),
    changeEmail: jest.fn(),
  },
}));

jest.mock('../auth/auth.repository', () => ({
  authRepository: {
    getSession: jest.fn(),
  },
}));

import { profileRepository } from './profile.repository';
import { authRepository } from '../auth/auth.repository';

describe('profile.service - setPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw a user not found error if there is no session', async () => {
    jest.mocked(authRepository.getSession).mockResolvedValue(null);

    const promise = profileService.setPassword('NewPassword1!');

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      code: ErrorMessages.USER_NOT_FOUND.code,
      status: ErrorMessages.USER_NOT_FOUND.status,
    });
    expect(profileRepository.setPassword).not.toHaveBeenCalled();
  });

  it('should delegate to the repository with the session user id', async () => {
    jest.mocked(authRepository.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authRepository.getSession>>);
    jest.mocked(profileRepository.setPassword).mockResolvedValue(undefined);

    await profileService.setPassword('NewPassword1!');

    expect(profileRepository.setPassword).toHaveBeenCalledWith(
      'user-1',
      'NewPassword1!',
    );
  });
});

describe('profile.service - updateUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate to the repository', async () => {
    jest
      .mocked(profileRepository.updateUser)
      .mockResolvedValue({ status: true });

    const response = await profileService.updateUser('johndoe');

    expect(response).toEqual({ status: true });
    expect(profileRepository.updateUser).toHaveBeenCalledWith('johndoe');
  });
});

describe('profile.service - changeEmail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate to the repository', async () => {
    jest
      .mocked(profileRepository.changeEmail)
      .mockResolvedValue({ status: true });

    const response = await profileService.changeEmail('new@test.com');

    expect(response).toEqual({ status: true });
    expect(profileRepository.changeEmail).toHaveBeenCalledWith('new@test.com');
  });
});
