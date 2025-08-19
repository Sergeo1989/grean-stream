import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { User } from '@/types/User';

interface DashboardHeaderProps {
  user: User;
  onLogout: () => Promise<void>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout }) => {
  return (
    <div className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4'>
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-base sm:text-lg font-bold'>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900'>
                Tableau de bord
              </h1>
              <p className='text-xs sm:text-sm text-gray-600'>
                Bienvenue, {user?.name}
              </p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant='outline'
            className='flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm sm:text-base px-3 py-2 sm:px-4'
          >
            <FaSignOutAlt className='w-3 h-3 sm:w-4 sm:h-4' />
            <span className='hidden sm:inline'>Déconnexion</span>
            <span className='sm:hidden'>Exit</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;