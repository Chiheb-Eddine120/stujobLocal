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
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { authService } from '../../services/authService';
import { UserRole } from '../../types';
import DashboardBackButton from '../../components/DashboardBackButton';
import { useNavigate } from 'react-router-dom';
import { etudiantService } from '../../services/etudiantService';

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

interface AdminCreatedStudent {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  created_at: string;
  created_by_user_id: string;
  created_by_role: string;
  is_admin_created: boolean;
  original_profile_id: string;
  role: UserRole;
}

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  confirmed_at: string | null;
  email_confirmed_at: string | null;
  phone: string | null;
  phone_confirmed_at: string | null;
}

// Fonction utilitaire pour le taux de complétion
const getProfileCompletion = (profile: any, etudiant: any) => {
  if (!profile || !etudiant) return 0;
  const checks = [
    !!profile.prenom,
    !!profile.nom,
    !!profile.email,
    !!profile.telephone,
    !!etudiant.date_naissance,
    !!etudiant.niveau_etudes,
    !!etudiant.ecole,
    !!etudiant.biographie && etudiant.biographie.length > 30,
    Array.isArray(etudiant.competences) && etudiant.competences.length > 0,
    (etudiant.competence_description && Object.keys(etudiant.competence_description).length > 0) || (Array.isArray(etudiant.experiences) && etudiant.experiences.some((exp: any) => exp.description && exp.description.length > 0)),
    Array.isArray(etudiant.experiences) && etudiant.experiences.length > 0,
    (etudiant.cv_file && (etudiant.cv_file.cv || etudiant.cv_file.lettre_motivation)),
    etudiant.disponibilite && Array.isArray(etudiant.disponibilite.disponibilites) && etudiant.disponibilite.disponibilites.length > 0,
    Array.isArray(etudiant.langues) && etudiant.langues.length > 0,
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

const DashboardUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [adminCreatedStudents, setAdminCreatedStudents] = useState<AdminCreatedStudent[]>([]);
  const [authUsersWithoutProfile, setAuthUsersWithoutProfile] = useState<AuthUser[]>([]);
  const [etudiantsById, setEtudiantsById] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [currentTab, setCurrentTab] = useState(0);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<EditUserData>({
    nom: '',
    prenom: '',
    telephone: '',
    role: 'student',
  });
  const [adminConfirmation, setAdminConfirmation] = useState<AdminConfirmationData | null>(null);
  const [adminPasswordError, setAdminPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
    loadAdminCreatedStudents();
    loadAuthUsersWithoutProfile();
  }, []);

  // Charger les données etudiant pour chaque user
  useEffect(() => {
    const fetchEtudiants = async () => {
      const newMap: Record<string, any> = {};
      await Promise.all(users.map(async (user) => {
        try {
          const etu = await etudiantService.getEtudiant(user.id);
          if (etu) newMap[user.id] = etu;
        } catch {}
      }));
      setEtudiantsById(newMap);
    };
    if (users.length > 0) fetchEtudiants();
  }, [users]);

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

  const loadAdminCreatedStudents = async () => {
    try {
      const response = await authService.getAdminCreatedStudents();
      setAdminCreatedStudents(response);
    } catch (err) {
      console.error('Erreur lors du chargement des étudiants créés par admin:', err);
    }
  };

  const loadAuthUsersWithoutProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getAuthenticatedUsersWithoutProfile();
      // Filtrer pour n'avoir que les utilisateurs avec email non confirmé
      const unconfirmedUsers = response.filter(user => !user.email_confirmed_at);
      setAuthUsersWithoutProfile(unconfirmedUsers);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs auth sans profil:', err);
      setError('Erreur lors du chargement des utilisateurs authentifiés');
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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleDeleteAuthUser = async (userId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await authService.deleteUser(userId);
      await loadAuthUsersWithoutProfile();
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      console.error(err);
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

  const filteredAdminCreatedStudents = adminCreatedStudents.filter(student => {
    return (
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Tous les utilisateurs" />
          <Tab label="Étudiants créés par admin" />
          <Tab label="Utilisateurs sans profil" />
        </Tabs>

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
          {currentTab === 0 && (
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
          )}
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                {currentTab === 2 ? (
                  <>
                    <TableCell>Date de création</TableCell>
                    <TableCell>Dernière connexion</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>Nom</TableCell>
                    <TableCell>Profil</TableCell>
                    {currentTab === 0 ? (
                      <>
                        <TableCell>Rôle</TableCell>
                        <TableCell>Date d'inscription</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>Créé par</TableCell>
                        <TableCell>Date de création</TableCell>
                      </>
                    )}
                  </>
                )}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTab === 0 ? (
                filteredUsers.map((user) => {
                  // On suppose que user.id = profile_id
                  // Il faut charger les données étudiant pour chaque user (id = profile_id)
                  // Pour la démo, on affiche une icône grise (à remplacer par la vraie logique async si besoin)
                  // Idéalement, il faudrait précharger les etudiants dans un useEffect et les stocker dans un state
                  // Ici, on affiche un placeholder
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{`${user.prenom} ${user.nom}`}</TableCell>
                      <TableCell>
                        {/* Affichage dynamique de l'icône de complétion */}
                        {(() => {
                          const etu = etudiantsById[user.id];
                          const completion = getProfileCompletion(user, etu);
                          if (completion >= 50) {
                            return <CheckCircleIcon sx={{ color: '#43a047' }} />;
                          } else {
                            return <CancelIcon sx={{ color: '#e53935' }} />;
                          }
                        })()}
                      </TableCell>
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
                        <Tooltip title="Voir le profil de l'utilisateur" arrow>
                          <IconButton onClick={() => navigate(`/profil/${user.id}`)} size="small" color="info">
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier l'utilisateur" arrow>
                          <IconButton onClick={() => handleEditClick(user)} size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer l'utilisateur" arrow>
                          <IconButton 
                            onClick={() => handleDeleteClick(user.id)} 
                            size="small" 
                            color="error"
                            disabled={user.role === 'admin'}
                            sx={{ opacity: user.role === 'admin' ? 0.5 : 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : currentTab === 1 ? (
                filteredAdminCreatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{`${student.prenom} ${student.nom}`}</TableCell>
                    <TableCell>{student.telephone}</TableCell>
                    <TableCell>
                      <Chip
                        label="Admin"
                        color="error"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(student.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Modifier l'utilisateur" arrow>
                        <IconButton onClick={() => handleEditClick(student)} size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer l'utilisateur" arrow>
                        <IconButton 
                          onClick={() => handleDeleteClick(student.id)} 
                          size="small" 
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                authUsersWithoutProfile.map((user: AuthUser) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : 'Jamais connecté'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          component="a"
                          href={`mailto:${user.email}?subject=Confirmation de votre compte StuJob&body=Bonjour,%0D%0A%0D%0AVeuillez confirmer votre adresse email en cliquant sur le lien suivant :%0D%0A%0D%0A[LIEN_DE_CONFIRMATION]%0D%0A%0D%0ACordialement,%0D%0AL'équipe StuJob`}
                        >
                          Envoyer email
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteAuthUser(user.id)}
                        >
                          Supprimer
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
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