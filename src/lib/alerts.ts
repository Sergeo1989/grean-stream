// src/lib/alerts.ts
import Swal from 'sweetalert2';

/**
 * Configuration par défaut pour SweetAlert2 avec style personnalisé
 */
const defaultConfig = {
  confirmButtonColor: '#3B82F6', // blue-500
  cancelButtonColor: '#EF4444', // red-500
  buttonsStyling: true,
  showCloseButton: false,
  allowOutsideClick: true,
  allowEscapeKey: true,
  customClass: {
    popup: 'swal2-popup',
    title: 'swal2-title',
    htmlContainer: 'swal2-html-container',
    confirmButton: 'swal2-confirm',
    cancelButton: 'swal2-cancel',
    actions: 'swal2-actions',
  },
  showClass: {
    popup: 'swal2-show',
  },
};

/**
 * Affiche une alerte de succès
 */
export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK',
  });
};

/**
 * Affiche une alerte d'erreur
 */
export const showError = (title: string, text?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
  });
};

/**
 * Affiche une alerte d'information
 */
export const showInfo = (title: string, text?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'info',
    title,
    text,
    confirmButtonText: 'OK',
  });
};

/**
 * Affiche une alerte d'avertissement
 */
export const showWarning = (title: string, text?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'OK',
  });
};

/**
 * Affiche une alerte de confirmation avec boutons Oui/Non
 */
export const showConfirm = (title: string, text?: string, confirmText: string = 'Oui', cancelText: string = 'Non') => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
};

/**
 * Affiche une toast notification (petite notification en coin)
 */
export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
};

/**
 * Affiche une alerte avec loader pour les opérations async
 */
export const showLoading = (title: string = 'Traitement en cours...') => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

/**
 * Ferme l'alerte actuelle
 */
export const closeAlert = () => {
  Swal.close();
};