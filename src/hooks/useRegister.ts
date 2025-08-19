// src/hooks/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { registerSchema } from '../lib/validators';
import { RegisterData } from '../types/api.types';
import z from 'zod';

export const useRegister = () =>
  useMutation({
    mutationFn: async (data: RegisterData) => {
      try {
        // Validate data with Zod
        const parsed = registerSchema.parse(data);

        // Use the register method from ApiService
        const response = await api.register(parsed as RegisterData);

        return response.data;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error('Invalid form data');
        }
        throw error;
      }
    },
  });
