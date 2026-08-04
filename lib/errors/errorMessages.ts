/**
 * Catalogue centralisé des erreurs métier applicatives : code, message
 * utilisateur et statut HTTP associé. Source utilisée pour construire les
 * instances de `AppError`.
 */
export const ErrorMessages = {
  // --- Auth ---
  UNAUTHORIZED: { code: 'UNAUTHORIZED', message: 'Unauthorized', status: 401 },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Identifiant ou mot de passe incorrect',
    status: 401,
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    message: 'Un compte existe déjà avec cet email',
    status: 422,
  },
  UNKNOWN_AUTH_ERROR: {
    code: 'UNKNOWN_AUTH_ERROR',
    message: "Une erreur d'authentification est survenue",
    status: 500,
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

  // --- Posts ---
  Post_Not_Found: {
    code: 'POST_NOT_FOUND',
    message: 'post not found',
    status: 404,
  },

  // --- Topics ---
  TOPIC_NOT_FOUND: {
    code: 'TOPIC_NOT_FOUND',
    message: 'topic not found',
    status: 404,
  },
} as const;
