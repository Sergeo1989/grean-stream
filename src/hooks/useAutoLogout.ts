import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';

interface UseAutoLogoutOptions {
  warningTime?: number; // Temps avant avertissement (en millisecondes)
  logoutTime?: number; // Temps après avertissement pour déconnexion automatique (en millisecondes)
}

export const useAutoLogout = ({
  warningTime = 25 * 60 * 1000, // 25 minutes par défaut
  logoutTime = 5 * 60 * 1000, // 1 minute par défaut
}: UseAutoLogoutOptions = {}) => {
  const { logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(logoutTime / 1000);

  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );
  const lastActivityRef = useRef<number>(Date.now());

  // Fonction pour réinitialiser les timers
  const resetTimers = () => {
    lastActivityRef.current = Date.now();

    // Nettoyer les timers existants
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    // Cacher l'avertissement si visible
    setShowWarning(false);

    // Démarrer le timer d'avertissement
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(logoutTime / 1000);

      // Démarrer le compte à rebours
      let timeLeft = logoutTime / 1000;
      countdownTimerRef.current = setInterval(() => {
        timeLeft--;
        setCountdown(timeLeft);

        if (timeLeft <= 0) {
          if (countdownTimerRef.current)
            clearInterval(countdownTimerRef.current);
          handleAutoLogout();
        }
      }, 1000);
    }, warningTime);
  };

  // Fonction pour gérer la déconnexion automatique
  const handleAutoLogout = async () => {
    setShowWarning(false);
    await logout();
  };

  // Fonction pour prolonger la session
  const extendSession = () => {
    resetTimers();
  };

  // Fonction pour gérer l'activité de l'utilisateur
  const handleUserActivity = () => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // Réinitialiser seulement si l'utilisateur était inactif depuis au moins 1 minute
    if (timeSinceLastActivity > 60000) {
      resetTimers();
    } else {
      lastActivityRef.current = now;
    }
  };

  useEffect(() => {
    // Events à écouter pour détecter l'activité
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Ajouter les event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Initialiser les timers
    resetTimers();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });

      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [warningTime, logoutTime]);

  return {
    showWarning,
    countdown,
    extendSession,
    handleAutoLogout,
  };
};
