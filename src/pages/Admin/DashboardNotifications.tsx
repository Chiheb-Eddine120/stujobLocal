import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DashboardBackButton from '../../components/DashboardBackButton';
import { notificationService } from '../../services/notificationService';
import { useTheme as useMuiTheme } from '@mui/material/styles';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  target_role: 'all' | 'student' | 'entreprise' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
}

const DashboardNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    target_role: 'all' as 'all' | 'student' | 'entreprise' | 'admin',
    status: 'active' as 'active' | 'inactive',
  });

  const muiTheme = useMuiTheme();
  //const isDarkMode = muiTheme.palette.mode === 'dark';

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAllNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Erreur lors du chargement des notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (notification?: Notification) => {
    if (notification) {
      setSelectedNotification(notification);
      setFormData({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        target_role: notification.target_role,
        status: notification.status,
      });
    } else {
      setSelectedNotification(null);
      setFormData({
        title: '',
        message: '',
        type: 'info',
        target_role: 'all',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNotification(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedNotification) {
        await notificationService.updateNotification(selectedNotification.id, formData);
      } else {
        await notificationService.createNotification(formData);
      }
      handleCloseDialog();
      loadNotifications();
    } catch (err) {
      setError('Erreur lors de la sauvegarde de la notification');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      loadNotifications();
    } catch (err) {
      setError('Erreur lors de la suppression de la notification');
      console.error(err);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return '#2196F3';
      case 'success': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <DashboardBackButton />
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des Notifications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<NotificationsIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #7928CA 0%, #E6447E 100%)',
            }
          }}
        >
          Créer une notification
        </Button>
      </Box>

      <Grid container spacing={3}>
        {notifications.map((notification) => (
          <Grid item xs={12} key={notification.id}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                borderRadius: 4,
                background: muiTheme.palette.background.paper,
                border: `1px solid ${muiTheme.palette.divider}`,
                color: muiTheme.palette.text.primary,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {notification.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={notification.type}
                      size="small"
                      sx={{ 
                        bgcolor: getTypeColor(notification.type) + '20',
                        color: getTypeColor(notification.type),
                        fontWeight: 500
                      }}
                    />
                    <Chip 
                      label={notification.target_role}
                      size="small"
                      sx={{ bgcolor: '#9333EA20', color: '#9333EA', fontWeight: 500 }}
                    />
                    <Chip 
                      label={notification.status}
                      size="small"
                      sx={{ 
                        bgcolor: notification.status === 'active' ? '#4CAF5020' : '#75757520',
                        color: notification.status === 'active' ? '#4CAF50' : '#757575',
                        fontWeight: 500
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <IconButton 
                    onClick={() => handleOpenDialog(notification)}
                    sx={{ color: '#9333EA' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(notification.id)}
                    sx={{ color: '#FF4D8D' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {notification.message}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          {selectedNotification ? 'Modifier la notification' : 'Créer une notification'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Titre"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'info' | 'success' | 'warning' | 'error' })}
                    label="Type"
                  >
                    <MenuItem value="info">Information</MenuItem>
                    <MenuItem value="success">Succès</MenuItem>
                    <MenuItem value="warning">Avertissement</MenuItem>
                    <MenuItem value="error">Erreur</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Destinataires</InputLabel>
                  <Select
                    value={formData.target_role}
                    onChange={(e) => setFormData({ ...formData, target_role: e.target.value as 'all' | 'student' | 'entreprise' | 'admin' })}
                    label="Destinataires"
                  >
                    <MenuItem value="all">Tous</MenuItem>
                    <MenuItem value="student">Étudiants</MenuItem>
                    <MenuItem value="entreprise">Entreprises</MenuItem>
                    <MenuItem value="admin">Administrateurs</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    label="Statut"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ color: '#666' }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #7928CA 0%, #E6447E 100%)',
              }
            }}
          >
            {selectedNotification ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DashboardNotifications;