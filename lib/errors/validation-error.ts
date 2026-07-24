import z from 'zod';

export class ValidationError extends Error {
  fieldErrors: Record<string, string[]>;
  constructor(fieldErrors: Record<string, string[]>) {
    super('Validation échouée');
    this.fieldErrors = fieldErrors;
  }
}

export function collectErrors<T>(
  result: z.ZodSafeParseResult<T> | undefined,
  fieldErrors: Record<string, string[]>,
) {
  if (result && !result.success) {
    Object.assign(fieldErrors, z.flattenError(result.error).fieldErrors);
  }
}
