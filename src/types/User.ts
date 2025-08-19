// src/types/User.ts
import { MeterType, UserRole } from './enums';

export interface Meter {
  id: number;
  type: MeterType;
  number: number;
  name: string;
  account_id: number;
  customer_id: number;
}

export interface Company {
  id: number;
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  status: number;
  created_at: string;
  updated_at: string;
  reference: string;
}

export interface User {
  id: number;
  name: string;
  address: string;
  phone: string;
  reference: string | null;
  meter_type: MeterType | null;
  distributor_id: number | null;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  company_id: number;
  can_be_trash: number;
  accountId: string;
  role?: UserRole;
  meter?: Meter; // Compteur principal pour rétrocompatibilité
  meters?: Meter[]; // Tous les compteurs de l'utilisateur
  company?: Company;
}
