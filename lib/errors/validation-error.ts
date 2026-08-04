import z from 'zod';

/**
 * Erreur levée quand une entrée utilisateur échoue à la validation Zod.
 * Porte le détail des erreurs par champ, utilisé pour afficher les messages
 * au bon endroit dans le formulaire.
 */
export class ValidationError extends Error {
  fieldErrors: Record<string, string[]>;
  constructor(fieldErrors: Record<string, string[]>) {
    super('Validation échouée');
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Fusionne les erreurs de champ d'un résultat `safeParse` Zod dans un objet
 * `fieldErrors` accumulé, sans effet si le résultat est absent ou valide.
 * @param result - Résultat d'un `schema.safeParse(...)`, ou `undefined` si non exécuté
 * @param fieldErrors - Accumulateur mutable, mis à jour en place
 */
export function collectErrors<T>(
  result: z.ZodSafeParseResult<T> | undefined,
  fieldErrors: Record<string, string[]>,
) {
  if (result && !result.success) {
    Object.assign(fieldErrors, z.flattenError(result.error).fieldErrors);
  }
}
