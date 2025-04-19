import { supabase } from '../lib/supabase';
import { Profile } from '../types';

export type UserRole = 'admin' | 'student' | 'entreprise' ;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export const authService = {
  async signIn(email: string, password: string): Promise<User> {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error('Erreur lors de la connexion');
      }

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Récupérer le rôle de l'utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      return {
        id: user.id,
        email: user.email!,
        role: profile.role as UserRole,
        created_at: user.created_at,
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return null;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        return null;
      }

      return {
        id: session.user.id,
        email: session.user.email!,
        role: profile.role as UserRole,
        created_at: session.user.created_at,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return !error && !!session;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      return false;
    }
  },

  async hasRole(requiredRole: User['role']): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user?.role === requiredRole;
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle:', error);
      return false;
    }
  },

  async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  },

  async isEntreprise(): Promise<boolean> {
    return this.hasRole('entreprise');
  },

  async isEtudiant(): Promise<boolean> {
    return this.hasRole('student');
  },

  async signUp(email: string, password: string, profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'role' | 'email'>): Promise<User> {
    try {
      // 1. Créer l'utilisateur dans Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Erreur lors de la création du compte');

      // 2. Créer le profil dans la table profiles avec le client service
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          role: 'student' as UserRole,
          email,
          ...profileData
        })
        .select()
        .single();

      if (profileError) {
        console.error('Erreur détaillée lors de la création du profil:', profileError);
        throw new Error(`Erreur lors de la création du profil: ${profileError.message}`);
      }

      if (!profile) {
        throw new Error('Profil non créé');
      }

      return {
        id: authData.user.id,
        email: authData.user.email!,
        role: 'student',
        created_at: authData.user.created_at,
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }
}; 