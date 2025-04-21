import { supabase } from '../lib/supabase';

interface UserStats {
  totalUsers: number;
  studentCount: number;
  entrepriseCount: number;
  adminCount: number;
}

interface DemandeStats {
  totalDemandes: number;
  demandesParMois: { mois: string; total: number }[];
}

interface MatchStats {
  totalMatches: number;
  matchesReussis: number;
  tauxReussite: number;
  matchesParMois: { mois: string; total: number }[];
}

export const statisticsService = {
  async getUserStats(): Promise<UserStats> {
    const { data, error } = await supabase
      .from('profiles')
      .select('role');

    if (error) throw error;

    const stats = {
      totalUsers: data.length,
      studentCount: data.filter(user => user.role === 'student').length,
      entrepriseCount: data.filter(user => user.role === 'entreprise').length,
      adminCount: data.filter(user => user.role === 'admin').length,
    };

    return stats;
  },

  async getDemandeStats(): Promise<DemandeStats> {
    const { data, error } = await supabase
      .from('demandes')
      .select('created_at');

    if (error) throw error;

    // Grouper par mois
    const demandesParMois = data.reduce((acc: { [key: string]: number }, demande) => {
      const mois = new Date(demande.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
      acc[mois] = (acc[mois] || 0) + 1;
      return acc;
    }, {});

    return {
      totalDemandes: data.length,
      demandesParMois: Object.entries(demandesParMois).map(([mois, total]) => ({ mois, total })),
    };
  },

  async getMatchStats(): Promise<MatchStats> {
    const { data, error } = await supabase
      .from('matches')
      .select('*');

    if (error) throw error;

    const matchesReussis = data.filter(match => match.status === 'accepted').length;
    
    // Grouper par mois
    const matchesParMois = data.reduce((acc: { [key: string]: number }, match) => {
      const mois = new Date(match.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
      acc[mois] = (acc[mois] || 0) + 1;
      return acc;
    }, {});

    return {
      totalMatches: data.length,
      matchesReussis,
      tauxReussite: data.length > 0 ? (matchesReussis / data.length) * 100 : 0,
      matchesParMois: Object.entries(matchesParMois).map(([mois, total]) => ({ mois, total })),
    };
  },
}; 