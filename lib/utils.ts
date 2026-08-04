import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusionne des classes Tailwind en résolvant les conflits (via `tailwind-merge`)
 * et en filtrant les valeurs falsy (via `clsx`).
 * @param inputs - Classes, objets conditionnels ou tableaux de classes
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Vérifie si une chaîne correspond à un format d'email valide.
 * @param email - L'adresse à valider
 * @returns `true` si le format est valide, sinon `false`
 */
export const isValidEmail = (email: string): boolean => {
  return emailRegex.test(email);
};
