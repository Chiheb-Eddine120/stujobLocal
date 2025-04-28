import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMaintenance } from '../hooks/useMaintenance';
import { supabase } from '../services/supabase';
import { UserRole } from '../types';
import MaintenanceMode from '../pages/MaintenanceMode';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { isMaintenance, isLoading } = useMaintenance();
  const [session, setSession] = React.useState<any>(null);
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        if (currentSession?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentSession.user.id)
            .single();
          setUserRole(profile?.role as UserRole);
        }
      } catch (err) {
        console.error('Erreur de récupération de session:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading || isChecking) {
    return <div>Chargement...</div>;
  }

  // Maintenance active : seuls les admins peuvent accéder
  if (isMaintenance && (!session || userRole !== 'admin')) {
    return <MaintenanceMode />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Vérification des rôles autorisés
  if (!session || !userRole || !requiredRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 