import React, { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import api from '../lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Recharge } from '@/types/api.types';
import { showSuccess, showError } from '@/lib/alerts';
import { PaymentMethod, DashboardTab } from '@/types/enums';
import { formValidator } from '@/lib/validation';
import { useFormSubmission } from '@/hooks/useFormSubmission';

// Import dashboard components
import {
  DashboardHeader,
  DashboardTabs,
  UserProfile,
  RechargeForm,
  StatsGrid,
  TransactionHistory
} from '@/components/dashboard';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.PROFILE);
  
  // Hooks de gestion des formulaires
  const profileSubmission = useFormSubmission();
  const rechargeSubmission = useFormSubmission();
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    email: user?.email || '',
  });
  const [rechargeForm, setRechargeForm] = useState({
    meter: '',
    amount: '',
    payment_method: PaymentMethod.CASH,
    subscriberMsisdn: '',
  });

  // Fonction pour charger les recharges avec pagination
  const fetchRecharges = async (page: number = 1) => {
    try {
      if (user?.id) {
        const rechargesResponse = await api.getRechargeHistory(
          user.id, 
          page, 
          paginationData.perPage
        );
        
        const data = rechargesResponse.data;
        setRecharges(data.data || []);
        setPaginationData({
          currentPage: data.current_page,
          lastPage: data.last_page,
          perPage: data.per_page,
          total: data.total,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des recharges', error);
    }
  };

  // Fonction pour obtenir les compteurs disponibles
  const getAvailableMeters = () => {
    if (user?.meters && user.meters.length > 0) {
      return user.meters.filter(meter => meter && typeof meter.number !== 'undefined');
    }
    // Fallback vers l'ancien système avec un seul compteur
    if (user?.meter && typeof user.meter.number !== 'undefined') {
      return [user.meter];
    }
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchRecharges(1);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  // Initialiser le compteur par défaut
  useEffect(() => {
    if (user && !loading) {
      const meters = getAvailableMeters();
      console.log('Debug - Available meters:', meters);
      if (meters.length > 0 && meters[0]?.number !== undefined && !rechargeForm.meter) {
        console.log('Debug - Setting default meter:', meters[0].number);
        setRechargeForm((prev) => ({
          ...prev,
          meter: meters[0].number.toString(),
        }));
      }
    }
  }, [user, loading, rechargeForm.meter]);

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Déconnexion réussie', 'À bientôt !');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await profileSubmission.handleSubmit(async () => {
      if (!user?.id) {
        showError('Erreur', 'Informations utilisateur manquantes');
        return;
      }

      const updateData = {
        id: user.id,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
      };

      await api.updateProfile(updateData);
      showSuccess('Succès', 'Profil mis à jour avec succès');
    });
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    await rechargeSubmission.handleSubmit(async () => {
      if (!user?.id) {
        showError('Erreur', 'Informations utilisateur manquantes');
        return;
      }

      // Validation avec le FormValidator
      const validationResult = formValidator.validateRechargeData({
        meter: parseInt(rechargeForm.meter),
        amount: parseFloat(rechargeForm.amount),
        payment_method: rechargeForm.payment_method,
        subscriberMsisdn: rechargeForm.subscriberMsisdn,
      });

      if (!validationResult.isValid) {
        const errorMessages = validationResult.errors.map(error => error.message).join('\n');
        showError('Erreur de validation', errorMessages);
        return;
      }

      const rechargeData = {
        user_id: user.id,
        meter: parseInt(rechargeForm.meter),
        amount: parseFloat(rechargeForm.amount),
        payment_method: rechargeForm.payment_method,
        subscriberMsisdn: rechargeForm.subscriberMsisdn,
      };

      const response = await api.makeRecharge(rechargeData);
      showSuccess(
        'Recharge initiée',
        `Recharge initiée avec succès! Statut: ${response.data.status}`
      );

      // Recharger l'historique (retour à la page 1)
      await fetchRecharges(1);

      // Reset form
      setRechargeForm({
        meter: '',
        amount: '',
        payment_method: PaymentMethod.CASH,
        subscriberMsisdn: '',
      });
    });
  };

  // Fonction pour gérer le changement de page
  const handlePageChange = async (page: number) => {
    await fetchRecharges(page);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header avec navigation */}
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        {/* Navigation par onglets */}
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Contenu des onglets */}
        {activeTab === DashboardTab.PROFILE && (
          <div className='space-y-6'>
            {/* Statistiques */}
            <StatsGrid recharges={recharges} />
            
            {/* Profil utilisateur */}
            <UserProfile
              user={user}
              profileData={profileData}
              onProfileDataChange={setProfileData}
              onSubmit={handleProfileUpdate}
              isLoading={profileSubmission.isLoading}
            />
          </div>
        )}

        {/* Onglet Recharge */}
        {activeTab === DashboardTab.RECHARGE && (
          <RechargeForm
            user={user}
            rechargeForm={rechargeForm}
            onRechargeFormChange={setRechargeForm}
            onSubmit={handleRecharge}
            isLoading={rechargeSubmission.isLoading}
          />
        )}

        {/* Onglet Historique */}
        {activeTab === DashboardTab.HISTORY && (
          <TransactionHistory
            recharges={recharges}
            paginationData={paginationData}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;