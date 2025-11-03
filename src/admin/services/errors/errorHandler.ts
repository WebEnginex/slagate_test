/**
 * Utilitaires pour gérer et transformer les erreurs
 */

import { PostgrestError } from '@supabase/supabase-js';
import {
  BuildsError,
  ValidationError,
  NetworkError,
  ConflictError,
  NotFoundError,
  DuplicateError,
  DatabaseError,
  AuthorizationError
} from './BuildsError';

/**
 * Codes d'erreur Supabase/Postgres
 */
export const SUPABASE_ERROR_CODES = {
  NOT_FOUND: 'PGRST116',           // Ressource non trouvée
  UNIQUE_VIOLATION: '23505',       // Contrainte UNIQUE violée
  FOREIGN_KEY_VIOLATION: '23503',  // Contrainte FK violée
  NOT_NULL_VIOLATION: '23502',     // Contrainte NOT NULL violée
  CHECK_VIOLATION: '23514',        // Contrainte CHECK violée
  AUTHORIZATION: 'PGRST301',       // Erreur d'autorisation
  INVALID_JSON: '22P02',           // JSON invalide
} as const;

/**
 * Transforme une erreur Supabase en erreur personnalisée
 */
export function handleSupabaseError(error: PostgrestError, context?: string): BuildsError {
  const errorMessage = `${context ? `${context}: ` : ''}${error.message}`;

  // Erreur de ressource non trouvée
  if (error.code === SUPABASE_ERROR_CODES.NOT_FOUND) {
    return new NotFoundError(
      errorMessage,
      context || 'Ressource',
      'unknown',
      error
    );
  }

  // Erreur de conflit de version
  if (error.code === SUPABASE_ERROR_CODES.NOT_FOUND && context?.includes('version')) {
    return new ConflictError(errorMessage, error);
  }

  // Contrainte UNIQUE violée (doublon)
  if (error.code === SUPABASE_ERROR_CODES.UNIQUE_VIOLATION) {
    const field = extractFieldFromError(error);
    return new DuplicateError(
      errorMessage,
      field,
      'unknown',
      error
    );
  }

  // Contrainte NOT NULL violée
  if (error.code === SUPABASE_ERROR_CODES.NOT_NULL_VIOLATION) {
    const field = extractFieldFromError(error);
    const validationError = new ValidationError(
      errorMessage,
      [`Le champ "${field}" est requis`],
      error
    );
    validationError.userMessage = `Le champ "${field}" ne peut pas être vide.`;
    return validationError;
  }

  // JSON invalide
  if (error.code === SUPABASE_ERROR_CODES.INVALID_JSON) {
    return new ValidationError(
      errorMessage,
      ['Format JSON invalide'],
      error
    );
  }

  // Erreur d'autorisation
  if (error.code === SUPABASE_ERROR_CODES.AUTHORIZATION) {
    return new AuthorizationError(errorMessage, error);
  }

  // Erreur générique de base de données
  return new DatabaseError(errorMessage, error.code, error);
}

/**
 * Transforme n'importe quelle erreur en BuildsError
 */
export function handleGenericError(error: unknown, context?: string): BuildsError {
  // Déjà une BuildsError
  if (error instanceof BuildsError) {
    return error;
  }

  // Erreur PostgrestError (Supabase)
  if (isPostgrestError(error)) {
    return handleSupabaseError(error, context);
  }

  // Erreur réseau
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new NetworkError('Erreur de connexion réseau', false, error);
  }

  // Timeout
  if (error instanceof Error && error.message.includes('timeout')) {
    return new NetworkError('Délai d\'attente dépassé', true, error);
  }

  // Erreur générique
  const message = error instanceof Error ? error.message : 'Erreur inconnue';
  return new BuildsError(
    `${context ? `${context}: ` : ''}${message}`,
    'UNKNOWN_ERROR',
    'Une erreur inattendue s\'est produite. Veuillez réessayer.',
    error
  );
}

/**
 * Vérifie si une erreur est une PostgrestError
 */
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  );
}

/**
 * Extrait le nom du champ depuis un message d'erreur Postgres
 */
function extractFieldFromError(error: PostgrestError): string {
  // Chercher le nom de colonne dans le message d'erreur
  const match = error.message.match(/column "([^"]+)"/i) ||
                error.message.match(/Key \(([^)]+)\)/i);
  
  return match ? match[1] : 'unknown';
}

/**
 * Formatte un message d'erreur pour l'utilisateur
 */
export function formatErrorMessage(error: BuildsError): string {
  let message = error.userMessage;

  // Ajouter les détails de validation si disponibles
  if (error instanceof ValidationError && error.validationErrors.length > 0) {
    message += '\n\nDétails :\n' + error.validationErrors.map(e => `• ${e}`).join('\n');
  }

  return message;
}

/**
 * Log une erreur avec contexte
 */
export function logError(error: BuildsError, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ [${error.name}] ${context || 'Error'}:`, {
      message: error.message,
      code: error.code,
      userMessage: error.userMessage,
      cause: error.cause
    });
  }
}
