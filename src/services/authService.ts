import { supabase } from '../lib/supabase';
import { Profile } from '../types';

export type UserRole = 'admin' | 'student' | 'entreprise' ;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  nom: string;
  prenom: string;
  telephone: string;
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

      // Si le profil n'existe pas, le créer avec les données de l'utilisateur
      if (profileError && profileError.code === 'PGRST116') {
        // 1. Créer le profil
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            role: 'student' as UserRole,
            email: user.email!,
            nom: user.user_metadata.nom || '',
            prenom: user.user_metadata.prenom || '',
            telephone: user.user_metadata.telephone || '',
          })
          .select()
          .single();

        if (createError) {
          console.error('Erreur lors de la création du profil:', createError);
          throw new Error('Erreur lors de la création du profil');
        }

        // 2. Créer l'entrée dans la table etudiants
        const { error: etudiantError } = await supabase
          .from('etudiants')
          .insert({
            profile_id: user.id
          });

        if (etudiantError) {
          console.error('Erreur lors de la création du profil étudiant:', etudiantError);
          // Ne pas échouer si la création du profil étudiant échoue
          // car le profil principal a été créé avec succès
        }

        return {
          id: user.id,
          email: user.email!,
          role: 'student',
          nom: user.user_metadata.nom || '',
          prenom: user.user_metadata.prenom || '',
          telephone: user.user_metadata.telephone || '',
          created_at: user.created_at,
        };
      }

      if (profileError) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      return {
        id: user.id,
        email: user.email!,
        role: profile.role as UserRole,
        nom: user.user_metadata.nom || '',
        prenom: user.user_metadata.prenom || '',
        telephone: user.user_metadata.telephone || '',
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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }

    return data as User;
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

  async hasRole(role: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === role;
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

  async signUp(email: string, password: string, profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'role' | 'email'>): Promise<{ message: string }> {
    try {
      // 1. Créer l'utilisateur dans Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'student',
            ...profileData // Stocker temporairement les données du profil dans les métadonnées
          }
        }
      });

      if (signUpError) {
        console.error('Erreur lors de la création du compte:', signUpError);
        throw new Error(`Erreur lors de la création du compte: ${signUpError.message}`);
      }
      
      if (!authData.user) {
        throw new Error('Erreur lors de la création du compte: utilisateur non créé');
      }

      // Retourner un message indiquant que l'utilisateur doit vérifier son email
      return {
        message: 'Un email de vérification a été envoyé. Veuillez vérifier votre boîte mail pour activer votre compte.'
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Nouvelle fonction pour créer le profil après vérification de l'email
  async createProfileAfterVerification(userId: string, email: string, profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'role' | 'email'>): Promise<User> {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          role: 'student' as UserRole,
          email,
          ...profileData
        })
        .select()
        .single();

      if (profileError) {
        console.error('Erreur lors de la création du profil:', profileError);
        throw new Error(`Erreur lors de la création du profil: ${profileError.message}`);
      }

      if (!profile) {
        throw new Error('Profil non créé');
      }

      return {
        id: userId,
        email,
        role: 'student',
        nom: profileData.nom || '',
        prenom: profileData.prenom || '',
        telephone: profileData.telephone || '',
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      throw error;
    }
  },

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }

    return data as User[];
  },

  async updateUser(userId: string, userData: Partial<User>, adminPassword?: string): Promise<void> {
    try {
      // Vérifier si on essaie de promouvoir en admin
      if (userData.role === 'admin') {
        const adminSecret = import.meta.env.ADMIN_SECRET;
        if (!adminPassword || adminPassword !== adminSecret) {
          throw new Error('Mot de passe administrateur invalide');
        }
      }

      // Vérifier si l'utilisateur est déjà admin
      const { data: currentUser, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      if (currentUser.role === 'admin') {
        // Supprimer toute tentative de modification du rôle pour un admin
        delete userData.role;
      }

      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    // Vérifier d'abord si l'utilisateur est admin
    const { data: user, error: checkError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (checkError) {
      console.error('Erreur lors de la vérification du rôle:', checkError);
      throw checkError;
    }

    if (user.role === 'admin') {
      throw new Error('Impossible de supprimer un compte administrateur');
    }

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },
}; 