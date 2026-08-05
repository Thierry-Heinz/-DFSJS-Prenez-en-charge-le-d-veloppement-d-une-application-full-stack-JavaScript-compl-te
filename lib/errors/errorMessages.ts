/**
 * Catalogue centralisé des erreurs métier applicatives : code, message
 * utilisateur et statut HTTP associé. Source utilisée pour construire les
 * instances de `AppError`.
 */
export const ErrorMessages = {
  // --- Auth ---
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
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'Utilisateur introuvable',
    status: 404,
  },

  // --- Posts ---
  Post_Not_Found: {
    code: 'POST_NOT_FOUND',
    message: 'Article introuvable',
    status: 404,
  },

  // --- Topics ---
  TOPIC_NOT_FOUND: {
    code: 'TOPIC_NOT_FOUND',
    message: 'Thème introuvable',
    status: 404,
  },
} as const;
