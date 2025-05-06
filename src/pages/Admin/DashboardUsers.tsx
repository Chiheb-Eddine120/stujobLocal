import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { authService } from '../../services/authService';
import { UserRole } from '../../types';
import DashboardBackButton from '../../components/DashboardBackButton';

interface User {
  id: string;
  email: string;
  role: UserRole;
  nom: string;
  prenom: string;
  telephone: string;
  created_at: string;
}

interface EditUserData {
  nom: string;
  prenom: string;
  telephone: string;
  role: UserRole;
}

interface AdminConfirmationData {
  userId: string;
  password: string;
}

const DashboardUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<EditUserData>({
    nom: '',
    prenom: '',
    telephone: '',
    role: 'student',
  });
  const [adminConfirmation, setAdminConfirmation] = useState<AdminConfirmationData | null>(null);
  const [adminPasswordError, setAdminPasswordError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await authService.getAllUsers();
      setUsers(response);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditData({
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone,
      role: user.role,
    });
  };

  const handleEditClose = () => {
    setEditingUser(null);
  };

  const handleEditSave = async () => {
    if (!editingUser) return;

    try {
      await authService.updateUser(editingUser.id, editData);
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'utilisateur');
      console.error(err);
    }
  };

  const handleDeleteClick = async (userId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await authService.deleteUser(userId);
      await loadUsers();
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      console.error(err);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === 'admin') {
      setAdminConfirmation({
        userId: editingUser!.id,
        password: ''
      });
    } else {
      setEditData({ ...editData, role: newRole });
    }
  };

  const handleAdminConfirmationClose = () => {
    setAdminConfirmation(null);
    setAdminPasswordError(null);
  };

  const handleAdminConfirmation = async () => {
    try {
      setLoading(true);
      if (!adminConfirmation) return;

      await authService.updateUser(
        adminConfirmation.userId,
        { role: 'admin' },
        adminConfirmation.password
      );

      // Recharger les données
      await loadUsers();
      setAdminConfirmation(null);
      setAdminPasswordError('');
    } catch (error) {
      console.error('Erreur lors de la promotion en admin:', error);
      setAdminPasswordError('Mot de passe administrateur invalide');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <DashboardBackButton />
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des Utilisateurs
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Rechercher"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
          <TextField
            select
            label="Rôle"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">Tous les rôles</MenuItem>
            <MenuItem value="student">Étudiant</MenuItem>
            <MenuItem value="entreprise">Entreprise</MenuItem>
            <MenuItem value="admin">Administrateur</MenuItem>
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Date d'inscription</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{`${user.prenom} ${user.nom}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telephone}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role === 'student' ? 'Étudiant' : user.role === 'entreprise' ? 'Entreprise' : 'Admin'}
                      color={user.role === 'admin' ? 'error' : user.role === 'entreprise' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(user)} size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteClick(user.id)} 
                      size="small" 
                      color="error"
                      disabled={user.role === 'admin'}
                      sx={{ opacity: user.role === 'admin' ? 0.5 : 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={!!editingUser} onClose={handleEditClose}>
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Prénom"
              value={editData.prenom}
              onChange={(e) => setEditData({ ...editData, prenom: e.target.value })}
              fullWidth
            />
            <TextField
              label="Nom"
              value={editData.nom}
              onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
              fullWidth
            />
            <TextField
              label="Téléphone"
              value={editData.telephone}
              onChange={(e) => setEditData({ ...editData, telephone: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Rôle"
              value={editData.role}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              fullWidth
              disabled={editingUser?.role === 'admin'}
              helperText={editingUser?.role === 'admin' ? "Le rôle administrateur ne peut pas être modifié" : ""}
            >
              <MenuItem value="student">Étudiant</MenuItem>
              <MenuItem value="entreprise">Entreprise</MenuItem>
              <MenuItem value="admin">Administrateur</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Annuler</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!adminConfirmation} onClose={handleAdminConfirmationClose}>
        <DialogTitle>Confirmation administrateur</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography>
              Pour promouvoir un utilisateur en administrateur, veuillez entrer le mot de passe administrateur.
            </Typography>
            <TextField
              type="password"
              label="Mot de passe administrateur"
              value={adminConfirmation?.password || ''}
              onChange={(e) => setAdminConfirmation(prev => prev ? { ...prev, password: e.target.value } : null)}
              fullWidth
              error={!!adminPasswordError}
              helperText={adminPasswordError}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdminConfirmationClose}>Annuler</Button>
          <Button onClick={handleAdminConfirmation} variant="contained" color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DashboardUsers; 