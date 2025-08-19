// src/types/api.types.ts
import type { User } from './User';
import { 
  PaymentMethod, 
  TransactionStatus, 
  TransactionMode,
  PriceUnit,
  PriceCategory 
} from './enums';

export interface Transaction {
  created_at: string;
  cust_tel: string;
  id: number;
  message: string | null;
  pay_token: string;
  recharge_id: number;
  status: TransactionStatus;
  txnid: string;
  txnmode: TransactionMode | null;
  updated_at: string;
}

export interface Recharge {
  id: number;
  user_id: number;
  meter_id: number;
  company_id: number;
  total_paid: number;
  payment_method: PaymentMethod;
  status: number;
  price_unit: PriceUnit;
  rate: number;
  created_at: string;
  updated_at: string;
  token: string | null;
  total_unit: number | null;
  price_categories: PriceCategory | null;
  unit: string | null;
  payment_id: number | null;
  transaction: Transaction | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
}

export interface ProfileUpdateResponse {
  user: User;
}

export interface RechargeResponse {
  status: TransactionStatus;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  code: string;
  phone: string;
  address: string;
  meter_type: number;
}

export interface ProfileUpdateData {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  meter_type?: number;
}

export interface RechargeData {
  user_id: number;
  meter: number;
  amount: number;
  payment_method: PaymentMethod;
  subscriberMsisdn?: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
