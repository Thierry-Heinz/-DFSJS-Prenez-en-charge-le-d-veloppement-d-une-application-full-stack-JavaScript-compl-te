export class ValidationError extends Error {
  fieldErrors: Record<string, string[]>;
  constructor(fieldErrors: Record<string, string[]>) {
    super('Validation échouée');
    this.fieldErrors = fieldErrors;
  }
}
