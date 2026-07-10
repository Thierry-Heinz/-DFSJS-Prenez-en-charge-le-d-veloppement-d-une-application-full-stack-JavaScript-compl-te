export const ErrorMessages = {
  // --- Auth ---
  UNAUTHORIZED: { code: 'UNAUTHORIZED', message: 'Unauthorized', status: 401 },
  PASSWORD_NOT_MATCHING: {
    code: 'PASSWORD_NOT_MATCHING',
    message: 'Password does not match',
    status: 401,
  },

  // --- Users ---
  USER_CONFLICT: {
    code: 'USER_CONFLICT',
    message: 'User already exists',
    status: 409,
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    status: 404,
  },
  EMAIL_NOT_FOUND: {
    code: 'EMAIL_NOT_FOUND',
    message: 'Email not found',
    status: 404,
  },

  // --- Rentals ---
  RENTAL_NOT_FOUND: {
    code: 'RENTAL_NOT_FOUND',
    message: 'Rental not found',
    status: 404,
  },
  RENTAL_NOT_CREATED: {
    code: 'RENTAL_NOT_CREATED',
    message: 'Rental could not be created',
    status: 500,
  },
  RENTAL_NOT_UPDATED: {
    code: 'RENTAL_NOT_UPDATED',
    message: 'Rental could not be updated',
    status: 500,
  },
  OWNER_NOT_FOUND: {
    code: 'OWNER_NOT_FOUND',
    message: 'Owner not found',
    status: 404,
  },

  // --- Messages ---
  MESSAGE_NOT_FOUND: {
    code: 'MESSAGE_NOT_FOUND',
    message: 'Message not found',
    status: 404,
  },
  MESSAGE_NOT_CREATED: {
    code: 'MESSAGE_NOT_CREATED',
    message: 'Message could not be created',
    status: 500,
  },
} as const;
