import React from 'react';
import Pagination from '@/components/ui/Pagination';
import { Recharge } from '@/types/api.types';
import {
  PaymentMethodLabels,
  TransactionStatusLabels,
  statusCodeToStatus,
} from '@/types/enums';

interface TransactionHistoryProps {
  recharges: Recharge[];
  paginationData: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  recharges,
  paginationData,
  onPageChange,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Réinitialiser les heures pour comparer seulement les dates
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Calculer la différence en jours
    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Formatage de l'heure
    const timeFormat = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    if (diffDays === 0) {
      return `Aujourd'hui à ${timeFormat}`;
    } else if (diffDays === 1) {
      return `Hier à ${timeFormat}`;
    } else if (diffDays > 1 && diffDays <= 7) {
      // Afficher le jour de la semaine pour la dernière semaine
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      return `${capitalizedDay} à ${timeFormat}`;
    } else {
      // Format de date complet pour les dates plus anciennes
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const getStatusBadgeColor = (status: number) => {
    switch (status) {
      case 1: // Succès
        return 'bg-green-100 text-green-800';
      case 0: // En attente
        return 'bg-yellow-100 text-yellow-800';
      default: // Échec
        return 'bg-red-100 text-red-800';
    }
  };

  if (!Array.isArray(recharges) || recharges.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
        <div className='text-gray-400 mb-4'>
          <svg
            className='w-16 h-16 mx-auto'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          Aucun historique disponible
        </h3>
        <p className='text-gray-500'>
          Vos recharges apparaîtront ici une fois effectuées.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
      <div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
        <h3 className='text-base sm:text-lg font-semibold text-gray-900'>
          Historique des recharges
        </h3>
        <p className='text-sm text-gray-600 mt-1'>
          {paginationData.total} transaction(s) au total
        </p>
      </div>

      {/* Table desktop */}
      <div className='hidden sm:block overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Date
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Compteur
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Montant
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Méthode
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Statut
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Transaction ID
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {recharges.map((recharge) => (
              <tr key={recharge.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {formatDate(recharge.updated_at)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  N°{recharge.meter_id}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {recharge.total_paid} XAF
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  <span className='inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800'>
                    {PaymentMethodLabels[recharge.payment_method]}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                      recharge.status
                    )}`}
                  >
                    {
                      TransactionStatusLabels[
                        statusCodeToStatus(recharge.status)
                      ]
                    }
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono'>
                  {recharge.transaction?.txnid || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className='sm:hidden divide-y divide-gray-200'>
        {recharges.map((recharge) => (
          <div key={recharge.id} className='p-4 space-y-3'>
            <div className='flex justify-between items-start'>
              <div>
                <div className='text-sm font-medium text-gray-900'>
                  {formatDate(recharge.updated_at)}
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Compteur N°{recharge.meter_id}
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                  recharge.status
                )}`}
              >
                {TransactionStatusLabels[statusCodeToStatus(recharge.status)]}
              </span>
            </div>

            <div className='flex justify-between items-center'>
              <div>
                <div className='text-lg font-bold text-gray-900'>
                  {recharge.total_paid} XAF
                </div>
                <div className='text-xs text-gray-500'>
                  {PaymentMethodLabels[recharge.payment_method]}
                </div>
              </div>
            </div>

            {recharge.transaction?.txnid && (
              <div className='text-xs text-gray-400 font-mono'>
                ID: {recharge.transaction.txnid}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {paginationData.lastPage > 1 && (
        <div className='border-t border-gray-200'>
          <Pagination
            currentPage={paginationData.currentPage}
            lastPage={paginationData.lastPage}
            total={paginationData.total}
            perPage={paginationData.perPage}
            onPageChange={onPageChange}
            className='p-4'
          />
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
