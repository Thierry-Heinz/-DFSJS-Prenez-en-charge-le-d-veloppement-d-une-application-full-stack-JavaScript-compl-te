import { authService } from './auth.service';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';

jest.mock('./auth.repository', () => ({
  authRepository: {
    loginWithEmail: jest.fn(),
    loginWithUsername: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    getSession: jest.fn(),
  },
}));

import { authRepository } from './auth.repository';

describe('auth.service - login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger a server error', async () => {
    jest
      .mocked(authRepository.loginWithEmail)
      .mockRejectedValue(new Error('DB connection failed'));

    await expect(
      authService.login({ identifier: 'test@test.com', password: 'Test!1234' }),
    ).rejects.toThrow('DB connection failed');
  });

  it('should respond  with success if identifier is email with loginWithEmail', async () => {
    const input = {
      identifier: 'test@test.com',
      password: 'Test!1234',
    };

    const resolvedValue = {
      redirect: true,
      token: 'mock-token',
      user: {
        id: 'mock-id',
        createdAt: new Date('2026-06-13'),
        updatedAt: new Date('2026-06-13'),
        email: 'test@test.com',
        emailVerified: false,
        name: 'test',
      },
    };

    jest.mocked(authRepository.loginWithEmail).mockResolvedValue(resolvedValue);

    const response = await authService.login(input);

    expect(response).toEqual(resolvedValue);
    expect(authRepository.loginWithEmail).toHaveBeenCalledWith(
      input.identifier,
      input.password,
    );
    expect(authRepository.loginWithUsername).not.toHaveBeenCalled();
  });

  it('should respond  with success if identifier is username with loginWithUsername', async () => {
    const input = {
      identifier: 'Test',
      password: 'Test!1234',
    };

    const resolvedValue = {
      redirect: true,
      token: 'mock-token',
      url: undefined,
      user: {
        id: 'mock-id',
        createdAt: new Date('2026-06-13'),
        updatedAt: new Date('2026-06-13'),
        email: 'test@test.com',
        emailVerified: false,
        name: 'test',
        username: 'test',
        displayUsername: 'test',
      },
    };

    jest
      .mocked(authRepository.loginWithUsername)
      .mockResolvedValue(resolvedValue);

    const response = await authService.login(input);

    expect(response).toEqual(resolvedValue);
    expect(authRepository.loginWithUsername).toHaveBeenCalledWith(
      input.identifier,
      input.password,
    );
    expect(authRepository.loginWithEmail).not.toHaveBeenCalled();
  });
});

describe('auth.service - register', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger an error if email is already taken', async () => {
    const input = {
      username: 'Test',
      email: 'test@test.com',
      password: 'Test!1234',
    };

    jest
      .mocked(authRepository.register)
      .mockRejectedValue(new AppError(ErrorMessages.USER_ALREADY_EXISTS));
    await expect(authService.register(input)).rejects.toThrow(
      'Un compte existe déjà avec cet email',
    );
  });

  it('should propagate a generic error from the repository', async () => {
    const input = {
      username: 'Test',
      email: 'test@test.com',
      password: 'Test!1234',
    };

    jest
      .mocked(authRepository.register)
      .mockRejectedValue(new AppError(ErrorMessages.UNKNOWN_AUTH_ERROR));
    await expect(authService.register(input)).rejects.toThrow(
      "Une erreur d'authentification est survenue",
    );
  });

  it('should trigger a server error', async () => {
    const input = {
      username: 'Test',
      email: 'test@test.com',
      password: 'Test!1234',
    };
    jest
      .mocked(authRepository.register)
      .mockRejectedValue(new Error('DB connection failed'));

    await expect(authService.register(input)).rejects.toThrow(
      'DB connection failed',
    );
  });

  it('should respond with success if credentials are valid', async () => {
    const input = {
      username: 'Test',
      email: 'test@test.com',
      password: 'Test!1234',
    };

    const resolvedValue = {
      token: 'mock-token',
      user: {
        id: 'mock-id',
        createdAt: new Date('2026-06-13'),
        updatedAt: new Date('2026-06-13'),
        email: 'test@test.com',
        emailVerified: false,
        name: 'test',
        username: 'test',
        displayUsername: 'test',
      },
    };

    jest.mocked(authRepository.register).mockResolvedValue(resolvedValue);
    const response = await authService.register(input);

    await expect(response).toEqual(resolvedValue);
    await expect(authRepository.register).toHaveBeenCalledWith(
      input.username,
      input.email,
      input.password,
    );
  });
});

describe('auth.service - getSession', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the session from the repository', async () => {
    const session = {
      user: { id: 'mock-id', email: 'test@test.com' },
    } as Awaited<ReturnType<typeof authRepository.getSession>>;
    jest.mocked(authRepository.getSession).mockResolvedValue(session);

    const response = await authService.getSession();

    expect(response).toEqual(session);
    expect(authRepository.getSession).toHaveBeenCalledTimes(1);
  });

  it('should return null when there is no session', async () => {
    jest.mocked(authRepository.getSession).mockResolvedValue(null);

    const response = await authService.getSession();

    expect(response).toBeNull();
  });
});

describe('auth.service - logout', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate to the repository', async () => {
    jest.mocked(authRepository.logout).mockResolvedValue({ success: true });

    await authService.logout();

    expect(authRepository.logout).toHaveBeenCalledTimes(1);
  });
});
