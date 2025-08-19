// src/lib/validation.ts
// Utilitaires de validation utilisant les types stricts

import { 
  PaymentMethod, 
  ValidationRule, 
  ErrorMessage,
  MeterType
} from '@/types/enums';

/**
 * Interface pour les règles de validation
 */
export interface ValidationError {
  field: string;
  message: string;
  rule: ValidationRule;
}

/**
 * Interface pour les résultats de validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validations de base
 */
export class Validator {
  private errors: ValidationError[] = [];

  constructor(private fieldName: string) {}

  /**
   * Valide qu'un champ n'est pas vide
   */
  required(value: any): this {
    if (value === null || value === undefined || value === '') {
      this.errors.push({
        field: this.fieldName,
        message: ErrorMessage.REQUIRED_FIELD,
        rule: ValidationRule.REQUIRED
      });
    }
    return this;
  }

  /**
   * Valide un email
   */
  email(value: string): this {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      this.errors.push({
        field: this.fieldName,
        message: ErrorMessage.INVALID_EMAIL,
        rule: ValidationRule.EMAIL
      });
    }
    return this;
  }

  /**
   * Valide un numéro de téléphone
   */
  phone(value: string): this {
    const phoneRegex = /^(\+237|237)?[6-9]\d{8}$/; // Format camerounais
    if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
      this.errors.push({
        field: this.fieldName,
        message: ErrorMessage.INVALID_PHONE,
        rule: ValidationRule.PHONE
      });
    }
    return this;
  }

  /**
   * Valide la longueur minimale
   */
  minLength(value: string, min: number): this {
    if (value && value.length < min) {
      this.errors.push({
        field: this.fieldName,
        message: ErrorMessage.MIN_LENGTH.replace('{min}', min.toString()),
        rule: ValidationRule.MIN_LENGTH
      });
    }
    return this;
  }

  /**
   * Valide la longueur maximale
   */
  maxLength(value: string, max: number): this {
    if (value && value.length > max) {
      this.errors.push({
        field: this.fieldName,
        message: ErrorMessage.MAX_LENGTH.replace('{max}', max.toString()),
        rule: ValidationRule.MAX_LENGTH
      });
    }
    return this;
  }

  /**
   * Valide qu'une valeur est numérique
   */
  numeric(value: any): this {
    if (value && (isNaN(Number(value)) || Number(value) < 0)) {
      this.errors.push({
        field: this.fieldName,
        message: 'Doit être un nombre valide',
        rule: ValidationRule.NUMERIC
      });
    }
    return this;
  }

  /**
   * Valide qu'une valeur est positive
   */
  positive(value: number): this {
    if (value !== undefined && value !== null && value <= 0) {
      this.errors.push({
        field: this.fieldName,
        message: 'Doit être un nombre positif',
        rule: ValidationRule.POSITIVE
      });
    }
    return this;
  }

  /**
   * Valide qu'une méthode de paiement est valide
   */
  paymentMethod(value: string): this {
    if (value && !Object.values(PaymentMethod).includes(value as PaymentMethod)) {
      this.errors.push({
        field: this.fieldName,
        message: 'Méthode de paiement invalide',
        rule: ValidationRule.REQUIRED
      });
    }
    return this;
  }

  /**
   * Valide qu'un type de compteur est valide
   */
  meterType(value: number): this {
    if (value && !Object.values(MeterType).includes(value)) {
      this.errors.push({
        field: this.fieldName,
        message: 'Type de compteur invalide',
        rule: ValidationRule.REQUIRED
      });
    }
    return this;
  }

  /**
   * Retourne les erreurs de validation
   */
  getErrors(): ValidationError[] {
    return this.errors;
  }

  /**
   * Vérifie si la validation est réussie
   */
  isValid(): boolean {
    return this.errors.length === 0;
  }
}

/**
 * Fonction utilitaire pour créer un validateur
 */
export const validate = (fieldName: string): Validator => {
  return new Validator(fieldName);
};

/**
 * Validations spécialisées pour les formulaires
 */
export class FormValidator {
  private errors: ValidationError[] = [];

  /**
   * Valide les données de connexion
   */
  validateLoginData(data: { email: string; password: string }): ValidationResult {
    this.errors = [];

    // Email
    const emailValidator = validate('email');
    emailValidator.required(data.email).email(data.email);
    this.errors.push(...emailValidator.getErrors());

    // Mot de passe
    const passwordValidator = validate('password');
    passwordValidator.required(data.password).minLength(data.password, 6);
    this.errors.push(...passwordValidator.getErrors());

    return {
      isValid: this.errors.length === 0,
      errors: this.errors
    };
  }

  /**
   * Valide les données d'inscription
   */
  validateRegisterData(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
    code: string;
    meter_type: number;
  }): ValidationResult {
    this.errors = [];

    // Prénom
    validate('firstName').required(data.firstName).minLength(data.firstName, 2);
    this.errors.push(...validate('firstName').getErrors());

    // Nom
    validate('lastName').required(data.lastName).minLength(data.lastName, 2);
    this.errors.push(...validate('lastName').getErrors());

    // Email
    validate('email').required(data.email).email(data.email);
    this.errors.push(...validate('email').getErrors());

    // Mot de passe
    validate('password').required(data.password).minLength(data.password, 8);
    this.errors.push(...validate('password').getErrors());

    // Confirmation mot de passe
    if (data.password !== data.confirmPassword) {
      this.errors.push({
        field: 'confirmPassword',
        message: ErrorMessage.PASSWORDS_DONT_MATCH,
        rule: ValidationRule.REQUIRED
      });
    }

    // Téléphone
    validate('phone').required(data.phone).phone(data.phone);
    this.errors.push(...validate('phone').getErrors());

    // Adresse
    validate('address').required(data.address).minLength(data.address, 5);
    this.errors.push(...validate('address').getErrors());

    // Code
    validate('code').required(data.code).minLength(data.code, 3);
    this.errors.push(...validate('code').getErrors());

    // Type de compteur
    validate('meter_type').required(data.meter_type).meterType(data.meter_type);
    this.errors.push(...validate('meter_type').getErrors());

    return {
      isValid: this.errors.length === 0,
      errors: this.errors
    };
  }

  /**
   * Valide les données de recharge
   */
  validateRechargeData(data: {
    meter: number;
    amount: number;
    payment_method: PaymentMethod;
    subscriberMsisdn?: string;
  }): ValidationResult {
    this.errors = [];

    // Compteur
    validate('meter').required(data.meter).numeric(data.meter);
    this.errors.push(...validate('meter').getErrors());

    // Montant
    validate('amount').required(data.amount).numeric(data.amount).positive(data.amount);
    this.errors.push(...validate('amount').getErrors());

    // Méthode de paiement
    validate('payment_method').required(data.payment_method).paymentMethod(data.payment_method);
    this.errors.push(...validate('payment_method').getErrors());

    // Téléphone payeur (requis pour OM et MOMO)
    if ([PaymentMethod.OM, PaymentMethod.MOMO].includes(data.payment_method)) {
      validate('subscriberMsisdn').required(data.subscriberMsisdn).phone(data.subscriberMsisdn || '');
      this.errors.push(...validate('subscriberMsisdn').getErrors());
    }

    return {
      isValid: this.errors.length === 0,
      errors: this.errors
    };
  }

  /**
   * Valide les données de mise à jour de profil
   */
  validateProfileData(data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    meter_type?: number;
  }): ValidationResult {
    this.errors = [];

    // Nom (si fourni)
    if (data.name !== undefined) {
      validate('name').minLength(data.name, 2);
      this.errors.push(...validate('name').getErrors());
    }

    // Email (si fourni)
    if (data.email !== undefined) {
      validate('email').email(data.email);
      this.errors.push(...validate('email').getErrors());
    }

    // Téléphone (si fourni)
    if (data.phone !== undefined) {
      validate('phone').phone(data.phone);
      this.errors.push(...validate('phone').getErrors());
    }

    // Adresse (si fournie)
    if (data.address !== undefined) {
      validate('address').minLength(data.address, 5);
      this.errors.push(...validate('address').getErrors());
    }

    // Type de compteur (si fourni)
    if (data.meter_type !== undefined) {
      validate('meter_type').meterType(data.meter_type);
      this.errors.push(...validate('meter_type').getErrors());
    }

    return {
      isValid: this.errors.length === 0,
      errors: this.errors
    };
  }
}

/**
 * Instance globale du validateur de formulaires
 */
export const formValidator = new FormValidator();

/**
 * Utilitaires pour les types guards et conversions
 */
export const ValidationUtils = {
  /**
   * Vérifie si une string peut être convertie en nombre
   */
  isNumeric: (value: string): boolean => {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  },

  /**
   * Vérifie si un montant est valide pour une recharge
   */
  isValidRechargeAmount: (amount: number): boolean => {
    return amount >= 100 && amount <= 1000000; // Limites en FCFA
  },

  /**
   * Vérifie si un email a un format valide
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Vérifie si un numéro de téléphone camerounais est valide
   */
  isValidCameroonianPhone: (phone: string): boolean => {
    const phoneRegex = /^(\+237|237)?[6-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  /**
   * Formate un numéro de téléphone camerounais
   */
  formatCameroonianPhone: (phone: string): string => {
    const cleaned = phone.replace(/\s/g, '').replace(/^\+?237/, '');
    return `+237 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  },

  /**
   * Nettoie et normalise une string
   */
  sanitizeString: (value: string): string => {
    return value.trim().replace(/\s+/g, ' ');
  }
};