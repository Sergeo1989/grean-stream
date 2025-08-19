import React from 'react';
import { FaExclamationTriangle, FaClock, FaSignOutAlt, FaUserClock } from 'react-icons/fa';
import { Button } from './button';

interface AutoLogoutModalProps {
  isOpen: boolean;
  countdown: number;
  onExtendSession: () => void;
  onLogoutNow: () => void;
}

const AutoLogoutModal: React.FC<AutoLogoutModalProps> = ({
  isOpen,
  countdown,
  onExtendSession,
  onLogoutNow,
}) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          
          {/* Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mb-4">
            <FaExclamationTriangle className="h-6 w-6 text-orange-600" />
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-2">
              Session expirée bientôt
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Votre session expirera automatiquement dans :
              </p>
              
              {/* Countdown display */}
              <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <FaClock className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-mono font-bold text-orange-600">
                  {formatTime(countdown)}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              Vous serez déconnecté automatiquement si vous ne répondez pas.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={onExtendSession}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FaUserClock className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Rester connecté</span>
              <span className="sm:hidden">Rester</span>
            </Button>
            
            <Button
              onClick={onLogoutNow}
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <FaSignOutAlt className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Me déconnecter</span>
              <span className="sm:hidden">Sortir</span>
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${((60 - countdown) / 60) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoLogoutModal;