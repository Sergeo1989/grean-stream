import React from 'react';
import { FaUser, FaCreditCard, FaHistory } from 'react-icons/fa';
import { DashboardTab } from '@/types/enums';

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: DashboardTab.PROFILE,
      name: 'Mon Profil',
      shortName: 'Profil',
      icon: FaUser,
    },
    {
      id: DashboardTab.RECHARGE,
      name: 'Recharger',
      shortName: 'Recharge',
      icon: FaCreditCard,
    },
    {
      id: DashboardTab.HISTORY,
      name: 'Historique',
      shortName: 'Historique',
      icon: FaHistory,
    },
  ];

  return (
    <div className='mb-6 sm:mb-8'>
      <nav
        className='flex flex-wrap gap-2 sm:gap-0 sm:space-x-6 lg:space-x-8'
        aria-label='Tabs'
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            } py-2 px-3 sm:px-1 border-b-2 sm:border-b-2 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 rounded-t-lg sm:rounded-none transition-colors`}
          >
            <tab.icon className='w-3 h-3 sm:w-4 sm:h-4' />
            <span className='sm:hidden'>{tab.shortName}</span>
            <span className='hidden sm:inline'>{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardTabs;