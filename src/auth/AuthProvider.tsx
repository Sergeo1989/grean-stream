import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import { User } from '../types/User';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useNavigate } from 'react-router';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = async (): Promise<void> => {
    try {
      // Appel à l'API pour invalider le token côté serveur
      await api.getAxiosInstance().post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    } finally {
      // Nettoyer le stockage local
      localStorage.removeItem('authToken');
      // Réinitialiser l'état utilisateur
      setUser(null);
      // Note: L'instance API sera réinitialisée lors du prochain appel
      // Rediriger vers la page de connexion
      navigate('/login');
    }
  };

  useEffect(() => {
    api.initializeFromStorage();
    api
      .getAxiosInstance()
      .get<{ user: User }>('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
