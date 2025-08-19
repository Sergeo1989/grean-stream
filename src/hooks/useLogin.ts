// src/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { loginSchema } from '../lib/validators';
import z from 'zod';
import { LoginCredentials } from '../types/api.types';

export const useLogin = () =>
  useMutation({
    mutationFn: async (data: LoginCredentials) => {
      try {
        // Valider les données avec Zod
        const parsed = loginSchema.parse(data);

        // Utiliser la méthode login de l'ApiService au lieu de post directement
        const response = await api.login(parsed as LoginCredentials);

        return response.data;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error('Données de formulaire invalides!');
        }
        console.error(error);
        throw error;
      }
    },
  });
