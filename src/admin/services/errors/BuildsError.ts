/**
 * Classes d'erreurs personnalisées pour la gestion des builds
 * Permet une gestion d'erreurs granulaire et des messages utilisateur clairs
 */

/**
 * Erreur de base pour toutes les erreurs liées aux builds
 */
export class BuildsError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'BuildsError';
    Object.setPrototypeOf(this, BuildsError.prototype);
  }
}

/**
 * Erreur de validation des données
 */
export class ValidationError extends BuildsError {
  constructor(
    message: string,
    public validationErrors: string[],
    cause?: unknown
  ) {
    super(
      message,
      'VALIDATION_ERROR',
      'Les données du build sont invalides. Veuillez vérifier les champs.',
      cause
    );
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Erreur réseau ou de connexion
 */
export class NetworkError extends BuildsError {
  constructor(
    message: string,
    public isTimeout: boolean = false,
    cause?: unknown
  ) {
    super(
      message,
      'NETWORK_ERROR',
      isTimeout
        ? 'La requête a expiré. Vérifiez votre connexion internet.'
        : 'Erreur de connexion. Veuillez réessayer.',
      cause
    );
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Erreur de conflit de version (modification concurrent)
 */
export class ConflictError extends BuildsError {
  constructor(message: string, cause?: unknown) {
    super(
      message,
      'CONFLICT_ERROR',
      'Le build a été modifié par quelqu\'un d\'autre. Veuillez recharger la page.',
      cause
    );
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Erreur de ressource non trouvée
 */
export class NotFoundError extends BuildsError {
  constructor(
    message: string,
    public resourceType: string,
    public resourceId: number | string,
    cause?: unknown
  ) {
    super(
      message,
      'NOT_FOUND_ERROR',
      `${resourceType} #${resourceId} introuvable.`,
      cause
    );
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Erreur de duplication (contrainte UNIQUE violée)
 */
export class DuplicateError extends BuildsError {
  constructor(
    message: string,
    public field: string,
    public value: unknown,
    cause?: unknown
  ) {
    super(
      message,
      'DUPLICATE_ERROR',
      `Un build existe déjà pour ce chasseur.`,
      cause
    );
    this.name = 'DuplicateError';
    Object.setPrototypeOf(this, DuplicateError.prototype);
  }
}

/**
 * Erreur d'authentification/autorisation
 */
export class AuthorizationError extends BuildsError {
  constructor(message: string, cause?: unknown) {
    super(
      message,
      'AUTHORIZATION_ERROR',
      'Vous n\'avez pas les droits nécessaires pour effectuer cette action.',
      cause
    );
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Erreur de base de données
 */
export class DatabaseError extends BuildsError {
  constructor(
    message: string,
    public dbCode?: string,
    cause?: unknown
  ) {
    super(
      message,
      'DATABASE_ERROR',
      'Erreur lors de l\'accès à la base de données. Veuillez réessayer.',
      cause
    );
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Erreur de données de référence manquantes
 */
export class ReferenceDataError extends BuildsError {
  constructor(
    message: string,
    public missingData: string[],
    cause?: unknown
  ) {
    super(
      message,
      'REFERENCE_DATA_ERROR',
      `Données de référence manquantes : ${missingData.join(', ')}. Veuillez recharger la page.`,
      cause
    );
    this.name = 'ReferenceDataError';
    Object.setPrototypeOf(this, ReferenceDataError.prototype);
  }
}
