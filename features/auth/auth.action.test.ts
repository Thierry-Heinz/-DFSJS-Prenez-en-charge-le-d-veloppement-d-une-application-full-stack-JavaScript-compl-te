import { login, register } from './auth.action';
import { redirect } from 'next/navigation';
import { AppError } from '@/lib/errors/app-error';
import { ErrorMessages } from '@/lib/errors/errorMessages';

jest.mock('./auth.service', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

import { authService } from './auth.service';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

function buildFormData(fields: Record<string, string>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  return formData;
}

describe('auth.action - login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display error if the email is wrong', async () => {
    jest
      .mocked(authService.login)
      .mockRejectedValue(new AppError(ErrorMessages.INVALID_CREDENTIALS));
    const loginFormData = buildFormData({
      identifier: 'test@test.com',
      password: 'Test!1234',
    });

    const response = await login(undefined, loginFormData);
    expect(response).toEqual({
      success: false,
      error: 'Identifiant ou mot de passe incorrect',
    });
  });

  it('should display error if the email is invalid', async () => {
    jest
      .mocked(authService.login)
      .mockRejectedValue(new AppError(ErrorMessages.INVALID_CREDENTIALS));
    const loginFormData = buildFormData({
      identifier: 'test@test',
      password: 'Test!1234',
    });

    const response = await login(undefined, loginFormData);
    expect(response).toEqual({
      success: false,
      error: 'Identifiant ou mot de passe incorrect',
    });
  });

  it('should display error if the username is wrong', async () => {
    jest
      .mocked(authService.login)
      .mockRejectedValue(new AppError(ErrorMessages.INVALID_CREDENTIALS));
    const loginFormData = buildFormData({
      identifier: 'test',
      password: 'Test!1234',
    });

    const response = await login(undefined, loginFormData);
    expect(response).toEqual({
      success: false,
      error: 'Identifiant ou mot de passe incorrect',
    });
  });

  it('should display error if the username is too short', async () => {
    jest
      .mocked(authService.login)
      .mockRejectedValue(new AppError(ErrorMessages.INVALID_CREDENTIALS));
    const loginFormData = buildFormData({
      identifier: 'te',
      password: 'Test!1234',
    });

    const response = await login(undefined, loginFormData);
    expect(response).toEqual({
      success: false,
      error: 'Validation échouée',
      fieldErrors: {
        identifier: ['Au moins 3 caractères'],
      },
    });
  });

  it('should display error if the password is wrong', async () => {
    jest
      .mocked(authService.login)
      .mockRejectedValue(new AppError(ErrorMessages.INVALID_CREDENTIALS));
    const loginFormData = buildFormData({
      identifier: 'test@test.com',
      password: 'Test!1235',
    });

    const response = await login(undefined, loginFormData);
    expect(response).toEqual({
      success: false,
      error: 'Identifiant ou mot de passe incorrect',
    });
  });

  it('should display error if the password is too short', async () => {
    jest
      .mocked(authService.login)
      .mockRejectedValue(new AppError(ErrorMessages.INVALID_CREDENTIALS));
    const loginFormData = buildFormData({
      identifier: 'test@test.com',
      password: 'Test!',
    });

    const response = await login(undefined, loginFormData);
    expect(response).toMatchObject({
      success: false,
      fieldErrors: { password: expect.any(Array) },
    });
  });

  it('should declare a server error', async () => {
    jest
      .mocked(authService.login)
      .mockRejectedValue(new Error('DB connection failed'));
    const loginFormData = buildFormData({
      identifier: 'test@test.com',
      password: 'Test!1234',
    });

    await expect(login(undefined, loginFormData)).rejects.toThrow(
      'DB connection failed',
    );
  });

  it('should redirect to dashboard if success', async () => {
    jest.mocked(authService.login).mockResolvedValue({
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
    });
    const loginFormData = buildFormData({
      identifier: 'test@test.com',
      password: 'Test!1234',
    });

    await login(undefined, loginFormData);
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });
});

describe('auth.action - register', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should display error if the email is already taken', async () => {
    jest
      .mocked(authService.register)
      .mockRejectedValue(new AppError(ErrorMessages.USER_ALREADY_EXISTS));
    const registerFormData = buildFormData({
      username: 'Test',
      email: 'test@test.com',
      password: 'Test!1234',
    });

    const response = await register(undefined, registerFormData);
    expect(response).toEqual({
      success: false,
      error: 'Un compte existe déjà avec cet email',
    });
  });

  it('should display error if the email is invalid', async () => {
    const registerFormData = buildFormData({
      username: 'Test',
      email: 'test@test',
      password: 'Test!1234',
    });

    const response = await register(undefined, registerFormData);
    expect(response).toMatchObject({
      success: false,
      fieldErrors: { email: expect.any(Array) },
    });
  });

  it('should display error if the username is wrong', async () => {
    const registerFormData = buildFormData({
      username: 'Te',
      email: 'test@test.com',
      password: 'Test!1234',
    });

    const response = await register(undefined, registerFormData);

    expect(response).toMatchObject({
      success: false,
      fieldErrors: { username: expect.any(Array) },
    });
  });

  it('should display a generic error from the service', async () => {
    jest
      .mocked(authService.register)
      .mockRejectedValue(new AppError(ErrorMessages.UNKNOWN_AUTH_ERROR));
    const registerFormData = buildFormData({
      username: 'Test',
      email: 'test@test.com',
      password: 'Test!1234',
    });

    const response = await register(undefined, registerFormData);

    expect(response).toEqual({
      success: false,
      error: "Une erreur d'authentification est survenue",
    });
  });

  it('should display error if the password is too short', async () => {
    const registerFormData = buildFormData({
      username: 'Test',
      email: 'test@test.com',
      password: 'T!1234',
    });

    const response = await register(undefined, registerFormData);

    expect(response).toMatchObject({
      success: false,
      fieldErrors: { password: expect.any(Array) },
    });
  });
  it('should display error if the password is has no lowercase character', async () => {
    const registerFormData = buildFormData({
      username: 'Test',
      email: 'test@test.com',
      password: 'TEST!1234',
    });

    const response = await register(undefined, registerFormData);

    expect(response).toMatchObject({
      success: false,
      fieldErrors: { password: expect.any(Array) },
    });
  });
  it('should display error if the password is has no uppercase character', async () => {
    const registerFormData = buildFormData({
      username: 'Test',
      email: 'test@test.com',
      password: 'test!1234',
    });

    const response = await register(undefined, registerFormData);

    expect(response).toMatchObject({
      success: false,
      fieldErrors: { password: expect.any(Array) },
    });
  });
  it('should display error if the password is has no number', async () => {
    const registerFormData = buildFormData({
      username: 'Test',
      email: 'test@test.com',
      password: 'test!test',
    });

    const response = await register(undefined, registerFormData);

    expect(response).toMatchObject({
      success: false,
      fieldErrors: { password: expect.any(Array) },
    });
  });
  it('should display error if the password is has no special character', async () => {
    const registerFormData = buildFormData({
      username: 'Test',
      email: 'test@test.com',
      password: 'test1234',
    });

    const response = await register(undefined, registerFormData);

    expect(response).toMatchObject({
      success: false,
      fieldErrors: { password: expect.any(Array) },
    });
  });
  it('should declare a server error', async () => {
    jest
      .mocked(authService.register)
      .mockRejectedValue(new Error('DB connection failed'));
    const registerFormData = buildFormData({
      username: 'Test',
      email: 'test@test.com',
      password: 'Test!1234',
    });

    await expect(register(undefined, registerFormData)).rejects.toThrow(
      'DB connection failed',
    );
  });

  it('should redirect to dashboard if success', async () => {
    jest.mocked(authService.register).mockResolvedValue({
      token: 'mock-token',
      user: {
        id: 'mock-id',
        createdAt: new Date('2026-06-13'),
        updatedAt: new Date('2026-06-13'),
        email: 'test@test.com',
        emailVerified: false,
        name: 'test',
      },
    });
    const registerFormData = buildFormData({
      username: 'Test',
      email: 'test@test.com',
      password: 'Test!1234',
    });

    await register(undefined, registerFormData);
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });
});
