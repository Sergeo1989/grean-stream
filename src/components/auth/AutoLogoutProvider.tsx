import React, { createContext, useContext } from 'react';
import { useAutoLogout } from '@/hooks/useAutoLogout';
import AutoLogoutModal from '@/components/ui/AutoLogoutModal';

interface AutoLogoutContextType {
  extendSession: () => void;
  showWarning: boolean;
  countdown: number;
}

const AutoLogoutContext = createContext<AutoLogoutContextType | undefined>(
  undefined
);

export const useAutoLogoutContext = () => {
  const context = useContext(AutoLogoutContext);
  if (context === undefined) {
    throw new Error(
      'useAutoLogoutContext must be used within an AutoLogoutProvider'
    );
  }
  return context;
};

interface AutoLogoutProviderProps {
  children: React.ReactNode;
  warningTime?: number;
  logoutTime?: number;
}

export const AutoLogoutProvider: React.FC<AutoLogoutProviderProps> = ({
  children,
  warningTime = 5 * 60 * 1000, // 25 minutes par défaut
  logoutTime = 1 * 60 * 1000, // 1 minute par défaut
}) => {
  const { showWarning, countdown, extendSession, handleAutoLogout } =
    useAutoLogout({
      warningTime,
      logoutTime,
    });

  return (
    <AutoLogoutContext.Provider
      value={{ extendSession, showWarning, countdown }}
    >
      {children}

      {/* Modal global pour la déconnexion automatique */}
      <AutoLogoutModal
        isOpen={showWarning}
        countdown={countdown}
        onExtendSession={extendSession}
        onLogoutNow={handleAutoLogout}
      />
    </AutoLogoutContext.Provider>
  );
};
