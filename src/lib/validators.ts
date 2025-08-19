// src/lib/validators.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  code: z.string().min(1),
  phone: z.string().min(8),
  address: z.string().min(3),
  meter_type: z.number().int(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
