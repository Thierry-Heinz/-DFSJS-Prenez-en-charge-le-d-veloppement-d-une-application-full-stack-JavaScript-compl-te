import { ErrorMessages } from './errorMessages';

type AppErrorDefinition = (typeof ErrorMessages)[keyof typeof ErrorMessages];

export class AppError extends Error {
  code: AppErrorDefinition['code'];
  status: AppErrorDefinition['status'];

  constructor(error: AppErrorDefinition) {
    super(error.message);
    this.code = error.code;
    this.status = error.status;
  }
}
