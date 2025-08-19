// src/types/enums.ts
// Enums et types stricts pour remplacer les string literals

/**
 * Méthodes de paiement disponibles
 */
export enum PaymentMethod {
  CASH = 'cash',
  OM = 'om',
  MOMO = 'momo',
}

/**
 * Statuts des transactions et recharges
 */
export enum TransactionStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCESSFUL = 'successful',
  EXPIRED = 'expired',
}

/**
 * Statuts numériques des recharges (utilisés par l'API)
 */
export enum RechargeStatusCode {
  PENDING = 0,
  SUCCESSFUL = 1,
  FAILED = 2,
  EXPIRED = 3,
}

/**
 * Types de compteurs disponibles
 */
export enum MeterType {
  PREPAID = 1,
  POSTPAID = 2,
}

/**
 * Rôles utilisateur
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

/**
 * Modes de transaction
 */
export enum TransactionMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MANUAL = 'manual',
}

/**
 * Types d'unités de prix
 */
export enum PriceUnit {
  KWH = 'kWh',
  FCFA = 'FCFA',
}

/**
 * Catégories de prix
 */
export enum PriceCategory {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  SOCIAL = 'social',
}

/**
 * Onglets du Dashboard
 */
export enum DashboardTab {
  PROFILE = 'profile',
  RECHARGE = 'recharge',
  HISTORY = 'history',
}

/**
 * Types de formulaires d'authentification
 */
export enum AuthFormType {
  LOGIN = 'login',
  REGISTER = 'register',
}

/**
 * Types de notifications/alertes
 */
export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Types de chargement/états
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * Types de validations de formulaire
 */
export enum ValidationRule {
  REQUIRED = 'required',
  EMAIL = 'email',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  PHONE = 'phone',
  NUMERIC = 'numeric',
  POSITIVE = 'positive',
}

/**
 * Messages d'erreur standardisés
 */
export enum ErrorMessage {
  REQUIRED_FIELD = 'Ce champ est obligatoire',
  INVALID_EMAIL = 'Adresse email invalide',
  INVALID_PHONE = 'Numéro de téléphone invalide',
  MIN_LENGTH = 'Minimum {min} caractères requis',
  MAX_LENGTH = 'Maximum {max} caractères autorisés',
  PASSWORDS_DONT_MATCH = 'Les mots de passe ne correspondent pas',
  INVALID_CREDENTIALS = 'Identifiants invalides',
  NETWORK_ERROR = 'Erreur de connexion réseau',
  UNAUTHORIZED = 'Non autorisé',
  SERVER_ERROR = 'Erreur serveur',
  INSUFFICIENT_FUNDS = 'Solde insuffisant',
  METER_NOT_FOUND = 'Compteur introuvable',
  INVALID_AMOUNT = 'Montant invalide',
}

/**
 * Messages de succès standardisés
 */
export enum SuccessMessage {
  LOGIN_SUCCESS = 'Connexion réussie',
  REGISTER_SUCCESS = 'Inscription réussie',
  PROFILE_UPDATED = 'Profil mis à jour avec succès',
  RECHARGE_SUCCESS = 'Recharge effectuée avec succès',
  LOGOUT_SUCCESS = 'Déconnexion réussie',
  PASSWORD_UPDATED = 'Mot de passe mis à jour',
  DATA_SAVED = 'Données sauvegardées',
}

/**
 * Types de requêtes HTTP
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * Codes de statut HTTP
 */
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Tailles d'écran pour le responsive design
 */
export enum ScreenSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = '2xl',
}

/**
 * Variantes de couleurs pour les composants UI
 */
export enum ColorVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
  MUTED = 'muted',
}

/**
 * Tailles de composants
 */
export enum ComponentSize {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

/**
 * Types d'animations/transitions
 */
export enum AnimationType {
  FADE = 'fade',
  SLIDE = 'slide',
  SCALE = 'scale',
  BOUNCE = 'bounce',
  NONE = 'none',
}

// Type guards pour la validation des enums
export const isPaymentMethod = (value: string): value is PaymentMethod => {
  return Object.values(PaymentMethod).includes(value as PaymentMethod);
};

export const isTransactionStatus = (value: string): value is TransactionStatus => {
  return Object.values(TransactionStatus).includes(value as TransactionStatus);
};

export const isDashboardTab = (value: string): value is DashboardTab => {
  return Object.values(DashboardTab).includes(value as DashboardTab);
};

export const isUserRole = (value: string): value is UserRole => {
  return Object.values(UserRole).includes(value as UserRole);
};

// Utilitaires pour les conversions
export const statusCodeToStatus = (code: number): TransactionStatus => {
  switch (code) {
    case RechargeStatusCode.PENDING:
      return TransactionStatus.PENDING;
    case RechargeStatusCode.SUCCESSFUL:
      return TransactionStatus.SUCCESSFUL;
    case RechargeStatusCode.FAILED:
      return TransactionStatus.FAILED;
    case RechargeStatusCode.EXPIRED:
      return TransactionStatus.EXPIRED;
    default:
      return TransactionStatus.PENDING;
  }
};

export const statusToStatusCode = (status: TransactionStatus): number => {
  switch (status) {
    case TransactionStatus.PENDING:
      return RechargeStatusCode.PENDING;
    case TransactionStatus.SUCCESSFUL:
      return RechargeStatusCode.SUCCESSFUL;
    case TransactionStatus.FAILED:
      return RechargeStatusCode.FAILED;
    case TransactionStatus.EXPIRED:
      return RechargeStatusCode.EXPIRED;
    default:
      return RechargeStatusCode.PENDING;
  }
};

// Labels français pour l'affichage
export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Espèces',
  [PaymentMethod.OM]: 'Orange Money',
  [PaymentMethod.MOMO]: 'MTN Mobile Money',
};

export const TransactionStatusLabels: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: 'En attente',
  [TransactionStatus.FAILED]: 'Échoué',
  [TransactionStatus.SUCCESSFUL]: 'Réussi',
  [TransactionStatus.EXPIRED]: 'Expiré',
};

export const MeterTypeLabels: Record<MeterType, string> = {
  [MeterType.PREPAID]: 'Prépayé',
  [MeterType.POSTPAID]: 'Postpayé',
};