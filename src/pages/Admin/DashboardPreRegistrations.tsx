import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { supabase } from '../../services/supabase';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PreRegistration {
  id: string;
  email: string;
  created_at: string;
  notified: boolean;
  notified_at: string | null;
  role: 'student' | 'entreprise';
}

export default function DashboardPreRegistrations() {
  const [preRegistrations, setPreRegistrations] = useState<PreRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPreRegistrations(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsNotified = async (id: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_notifications')
        .update({
          notified: true,
          notified_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      await fetchPreRegistrations();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPreRegistrations();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Pré-inscriptions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date d'inscription</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date de notification</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preRegistrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>{registration.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={registration.role === 'student' ? 'Étudiant' : 'Entreprise'}
                    color={registration.role === 'student' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(registration.created_at), 'dd MMMM yyyy HH:mm', { locale: fr })}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={registration.notified ? 'Notifié' : 'En attente'}
                    color={registration.notified ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {registration.notified_at 
                    ? format(new Date(registration.notified_at), 'dd MMMM yyyy HH:mm', { locale: fr })
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  <Tooltip title="Envoyer un email">
                    <IconButton 
                      color="primary"
                      onClick={() => window.location.href = `mailto:${registration.email}`}
                    >
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                  {!registration.notified && (
                    <Tooltip title="Marquer comme notifié">
                      <IconButton 
                        color="success"
                        onClick={() => markAsNotified(registration.id)}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 