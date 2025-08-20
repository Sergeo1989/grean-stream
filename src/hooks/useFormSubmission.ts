import { useState, useCallback } from 'react';

export interface UseFormSubmissionOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export interface UseFormSubmissionReturn {
  isLoading: boolean;
  handleSubmit: (submitFn: () => Promise<void>) => Promise<void>;
}

/**
 * Hook personnalisé pour gérer l'état de loading des formulaires
 * et éviter les soumissions multiples
 */
export const useFormSubmission = (options?: UseFormSubmissionOptions): UseFormSubmissionReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (submitFn: () => Promise<void>) => {
    // Éviter les soumissions multiples
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await submitFn();
      options?.onSuccess?.();
    } catch (error) {
      options?.onError?.(error);
      throw error; // Re-throw pour permettre la gestion d'erreur spécifique
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, options]);

  return {
    isLoading,
    handleSubmit,
  };
};