import React from 'react';
import { FaCreditCard, FaHistory, FaCalendarAlt, FaBolt } from 'react-icons/fa';
import StatCard from '@/components/ui/StatCard';
import { Recharge } from '@/types/api.types';
import { PaymentMethodLabels, TransactionStatusLabels, statusCodeToStatus } from '@/types/enums';

interface StatsGridProps {
  recharges: Recharge[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ recharges }) => {
  const getTotalRecharges = () => {
    if (!Array.isArray(recharges)) return 0;
    return recharges.reduce((sum, recharge) => sum + recharge.total_paid, 0);
  };

  const getLastRecharge = () => {
    if (!Array.isArray(recharges) || recharges.length === 0) return null;
    return recharges.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
  };

  const getRechargeCount = () => {
    return Array.isArray(recharges) ? recharges.length : 0;
  };

  const getSuccessfulRecharges = () => {
    if (!Array.isArray(recharges)) return 0;
    return recharges.filter(recharge => recharge.status === 1).length;
  };

  const getSuccessRate = () => {
    const total = getRechargeCount();
    if (total === 0) return 0;
    return Math.round((getSuccessfulRecharges() / total) * 100);
  };

  const getMostUsedPaymentMethod = () => {
    if (!Array.isArray(recharges) || recharges.length === 0) return 'N/A';
    
    const paymentMethodCounts = recharges.reduce((acc, recharge) => {
      acc[recharge.payment_method] = (acc[recharge.payment_method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsed = Object.entries(paymentMethodCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return mostUsed ? PaymentMethodLabels[mostUsed[0] as keyof typeof PaymentMethodLabels] : 'N/A';
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8'>
      {/* Total des recharges */}
      <StatCard
        icon={<FaCreditCard />}
        label='Total recharges'
        badgeText='XAF'
        value={getTotalRecharges()}
        iconColor='text-green-500'
        borderColor='border-green-500'
        unit='XAF'
      />

      {/* Nombre de recharges */}
      <StatCard
        icon={<FaHistory />}
        label='Nombre de recharges'
        badgeText='Total'
        value={getRechargeCount()}
        iconColor='text-blue-500'
        borderColor='border-blue-500'
      />

      {/* Dernière recharge */}
      <StatCard
        icon={<FaCalendarAlt />}
        label='Dernière recharge'
        badgeText={
          getLastRecharge() 
            ? TransactionStatusLabels[statusCodeToStatus(getLastRecharge()!.status)]
            : 'N/A'
        }
        value={
          getLastRecharge()
            ? `${getLastRecharge()?.total_paid} XAF`
            : 'Aucune'
        }
        iconColor='text-purple-500'
        borderColor='border-purple-500'
      />

      {/* Méthode préférée */}
      <StatCard
        icon={<FaBolt />}
        label='Méthode préférée'
        badgeText={`${getSuccessRate()}% succès`}
        value={getMostUsedPaymentMethod()}
        iconColor='text-yellow-500'
        borderColor='border-yellow-500'
      />
    </div>
  );
};

export default StatsGrid;