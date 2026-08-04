import { ErrorMessages } from './errorMessages';

type AppErrorDefinition = (typeof ErrorMessages)[keyof typeof ErrorMessages];

/**
 * Erreur métier typée, construite à partir d'une entrée de {@link ErrorMessages}.
 * Portée par un code et un statut HTTP, elle est interceptée et convertie en
 * réponse d'échec par `withActionErrorHandling`.
 */
export class AppError extends Error {
  code: AppErrorDefinition['code'];
  status: AppErrorDefinition['status'];

  constructor(error: AppErrorDefinition) {
    super(error.message);
    this.code = error.code;
    this.status = error.status;
  }
}
