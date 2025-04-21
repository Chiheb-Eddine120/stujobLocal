import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  Assignment as AssignmentIcon,
  HandshakeOutlined as HandshakeIcon,
} from '@mui/icons-material';
import { statisticsService } from '../services/statisticsService';
import DashboardBackButton from '../components/DashboardBackButton';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: `linear-gradient(45deg, ${color}22 30%, ${color}11 90%)`,
      border: `1px solid ${color}33`,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box sx={{ 
        p: 1, 
        borderRadius: 1, 
        display: 'flex',
        alignItems: 'center',
        color: color 
      }}>
        {icon}
      </Box>
      <Typography variant="h6" sx={{ ml: 1, color: 'text.primary' }}>
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color }}>
      {typeof value === 'number' && !Number.isInteger(value) 
        ? value.toFixed(1) 
        : value}
    </Typography>
  </Paper>
);

const DashboardStats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [demandeStats, setDemandeStats] = useState<any>(null);
  const [matchStats, setMatchStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [users, demandes, matches] = await Promise.all([
          statisticsService.getUserStats(),
          statisticsService.getDemandeStats(),
          statisticsService.getMatchStats(),
        ]);
        setUserStats(users);
        setDemandeStats(demandes);
        setMatchStats(matches);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <DashboardBackButton />
      <Typography variant="h4" component="h1" gutterBottom>
        Statistiques de la Plateforme
      </Typography>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Utilisateurs"
            value={userStats.totalUsers}
            icon={<PeopleIcon />}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Étudiants"
            value={userStats.studentCount}
            icon={<SchoolIcon />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Entreprises"
            value={userStats.entrepriseCount}
            icon={<BusinessIcon />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Administrateurs"
            value={userStats.adminCount}
            icon={<AdminIcon />}
            color="#F44336"
          />
        </Grid>
      </Grid>

      {/* Statistiques des demandes et matches */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Demandes"
            value={demandeStats.totalDemandes}
            icon={<AssignmentIcon />}
            color="#9C27B0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Matches"
            value={matchStats.totalMatches}
            icon={<HandshakeIcon />}
            color="#009688"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Taux de Réussite"
            value={`${matchStats.tauxReussite}%`}
            icon={<HandshakeIcon />}
            color="#673AB7"
          />
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Demandes par Mois
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demandeStats.demandesParMois}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Demandes" fill="#9C27B0" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Matches par Mois
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={matchStats.matchesParMois}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Matches"
                  stroke="#009688"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardStats; 