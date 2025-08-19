// src/lib/api.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import {
  LoginCredentials,
  LoginResponse,
  ProfileUpdateData,
  ProfileUpdateResponse,
  RechargeData,
  RechargeResponse,
  RegisterData,
  RegisterResponse,
  Recharge,
  PaginatedResponse,
} from '../types/api.types';

class ApiService {
  private readonly api: AxiosInstance;
  private static instance: ApiService;
  private readonly TOKEN_STORAGE_KEY = 'authToken';
  private readonly TOKEN_EXPIRY_DAYS = 7;

  private constructor() {
    this.api = axios.create({
      baseURL: 'http://www.gs.montviewfarm.net/api/',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 15000, // 15 secondes
      withCredentials: true, // Important pour les cookies HTTP-only
    });

    // Intercepteur pour gérer les erreurs globalement
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.removeToken();
          // window.location.href = '/login';
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }


  private formatError(error: AxiosError): Error {
    if (error.response?.data) {
      const serverError = error.response.data as { message?: string };
      if (serverError.message) {
        return new Error(serverError.message);
      }
    }
    return error;
  }

  /**
   * Stocke le token d'authentification de manière sécurisée
   * @param token Le token à stocker
   */
  public setAuthToken(token: string | null): void {
    if (token) {
      // 1. Configurer l'en-tête pour les requêtes futures
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 2. Stocker le token en utilisant un cookie avec des options de sécurité
      Cookies.set(this.TOKEN_STORAGE_KEY, token, {
        expires: this.TOKEN_EXPIRY_DAYS,
        secure: process.env.NODE_ENV === 'production', // Cookies sécurisés en production
        sameSite: 'strict', // Protection CSRF
      });
    } else {
      this.removeToken();
    }
  }

  /**
   * Supprime le token d'authentification
   */
  private removeToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
    Cookies.remove(this.TOKEN_STORAGE_KEY);
  }

  /**
   * Initialise l'API avec le token stocké
   */
  public initializeFromStorage(): void {
    const token = Cookies.get(this.TOKEN_STORAGE_KEY);
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  /**
   * Authentification utilisateur
   * @param credentials Les identifiants de connexion
   * @returns La réponse contenant l'utilisateur et le token
   */
  public async login(
    credentials: LoginCredentials
  ): Promise<AxiosResponse<LoginResponse>> {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email et mot de passe requis');
    }

    const response = await this.api.post<LoginResponse>('/login', credentials);
    this.setAuthToken(response.data.token);
    return response;
  }

  /**
   * Inscription d'un nouvel utilisateur
   * @param userData Les données d'inscription
   * @returns La réponse contenant les informations de l'utilisateur créé
   */
  public async register(
    userData: RegisterData
  ): Promise<AxiosResponse<RegisterResponse>> {
    // Validation des données
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'password',
      'code',
    ];
    for (const field of requiredFields) {
      if (!userData[field as keyof RegisterData]) {
        throw new Error(`Le champ ${field} est requis`);
      }
    }

    if (!this.isValidEmail(userData.email)) {
      throw new Error("Format d'email invalide");
    }
    const response = await this.api.post<RegisterResponse>(
      '/register',
      userData
    );
    const responseData = response.data as RegisterResponse & {
      errors?: string[];
    };
    if (responseData.errors && responseData.errors.length > 0) {
      throw new Error(responseData.errors[0]);
    }
    return response;
  }

  /**
   * Mise à jour du profil utilisateur
   * @param profileData Les données à mettre à jour
   * @returns La réponse contenant les informations mises à jour
   */
  public async updateProfile(
    profileData: ProfileUpdateData
  ): Promise<AxiosResponse<ProfileUpdateResponse>> {
    if (Object.keys(profileData).length === 0) {
      throw new Error('Aucune donnée à mettre à jour');
    }

    if (profileData.email && !this.isValidEmail(profileData.email)) {
      throw new Error("Format d'email invalide");
    }

    return await this.api.post<ProfileUpdateResponse>('/profile', profileData);
  }

  /**
   * Récupération de l'historique des recharges avec pagination
   * @param userId L'identifiant de l'utilisateur
   * @param page Numéro de la page (défaut: 1)
   * @param perPage Nombre d'éléments par page (défaut: 10)
   * @returns La réponse paginée avec la liste des recharges
   */
  public async getRechargeHistory(
    userId: string | number,
    page: number = 1,
    perPage: number = 10
  ): Promise<AxiosResponse<PaginatedResponse<Recharge>>> {
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    return await this.api.get<PaginatedResponse<Recharge>>(
      `/recharges/${userId}?${params.toString()}`
    );
  }

  /**
   * Effectuer une recharge
   * @param rechargeData Les données de recharge
   * @returns Le statut de la recharge
   */
  public async makeRecharge(
    rechargeData: RechargeData
  ): Promise<AxiosResponse<RechargeResponse>> {
    // Validation des données
    const requiredFields = [
      'user_id',
      'meter',
      'amount',
      'payment_method',
    ];
    for (const field of requiredFields) {
      if (!rechargeData[field as keyof RechargeData]) {
        throw new Error(`Le champ ${field} est requis`);
      }
    }

    // Validation des montants
    if (rechargeData.amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }

    // Validation des méthodes de paiement
    const validPaymentMethods = ['cash', 'om', 'momo'];
    if (!validPaymentMethods.includes(rechargeData.payment_method)) {
      throw new Error('Méthode de paiement invalide');
    }

    // Validation du numéro de téléphone pour les paiements mobiles
    if (
      ['om', 'momo'].includes(rechargeData.payment_method) &&
      !rechargeData.subscriberMsisdn
    ) {
      throw new Error('Numéro du payeur requis pour les paiements mobiles');
    }

    return await this.api.post<RechargeResponse>('/recharge', rechargeData);
  }

  /**
   * Déconnexion de l'utilisateur
   */
  public logout(): void {
    this.removeToken();
  }

  /**
   * Vérification de la validité d'un email
   * @param email L'email à vérifier
   * @returns true si l'email est valide, false sinon
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Obtient une référence à l'instance axios pour des requêtes personnalisées
   */
  public getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

// Exporter une instance unique
const apiService = ApiService.getInstance();
export default apiService;

// Initialiser depuis le stockage lors de l'importation
apiService.initializeFromStorage();
