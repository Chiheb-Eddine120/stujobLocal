import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { UserRole } from '../types';

interface AuthState {
  session: any;
  userRole: UserRole | null;
  isChecking: boolean;
  error: Error | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    userRole: null,
    isChecking: true,
    error: null
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        let userRole: UserRole | null = null;
        if (currentSession?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentSession.user.id)
            .single();
          userRole = profile?.role as UserRole;
        }

        setAuthState({
          session: currentSession,
          userRole,
          isChecking: false,
          error: null
        });
      } catch (err) {
        setAuthState(prev => ({
          ...prev,
          isChecking: false,
          error: err as Error
        }));
      }
    };

    checkSession();
  }, []);

  return authState;
}; 