import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/auth/AuthProvider';
import { AutoLogoutProvider } from '@/components/auth/AutoLogoutProvider';

const ProtectedRoutes = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to='/login' />;
  }
  
  return (
    <AutoLogoutProvider>
      <Outlet />
    </AutoLogoutProvider>
  );
};

export default ProtectedRoutes;
