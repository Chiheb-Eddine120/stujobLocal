import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { demandeService } from '../services/demandeService';
import { matchService } from '../services/matchService';
import { Demande, Etudiant, Match, Competence } from '../types';
import DashboardBackButton from '../components/DashboardBackButton';
import { etudiantService } from '../services/etudiantService';

/*interface FilterState {
  competences: string[];
  niveauMin: NiveauCompetence | '';
  typeMission: string;
}*/

interface MatchWithEtudiant extends Match {
  etudiant: Etudiant & {
    profile: {
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
    };
  };
  score?: number;
}

interface DemandeWithMatches extends Demande {
  matches: MatchWithEtudiant[];
  matchCount: number;
}

const DashboardMatch: React.FC = () => {
  const [demandes, setDemandes] = useState<DemandeWithMatches[]>([]);
  const [selectedDemande, setSelectedDemande] = useState<DemandeWithMatches | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [compareAll, setCompareAll] = useState(false);
  const [allStudents, setAllStudents] = useState<Etudiant[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  // Effet pour charger les étudiants quand compareAll change
  useEffect(() => {
    const loadStudents = async () => {
      if (compareAll) {
        try {
          setLoading(true);
          const students = await etudiantService.getAllEtudiants();
          console.log('Étudiants chargés:', students);
          setAllStudents(students);
        } catch (error) {
          console.error('Erreur chargement étudiants:', error);
          setNotification({
            open: true,
            message: 'Erreur lors du chargement des étudiants',
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
      } else {
        setAllStudents([]);
      }
    };

    loadStudents();
  }, [compareAll]);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const calculateMatchScore = (etudiant: Etudiant, requises: Competence[]) => {
    let score = 0;
    let total = requises.length;

    for (const requise of requises) {
      const match = (etudiant.competences || []).find(comp => comp.nom.toLowerCase() === requise.nom.toLowerCase());
      if (match) {
        score += 1;
      }
    }

    return Math.round((score / total) * 100);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('État de compareAll:', compareAll);
      if (compareAll) {
        console.log('Début de la récupération des étudiants');
        const students = await etudiantService.getAllEtudiants();
        console.log('Étudiants récupérés:', students);
        setAllStudents(students);
      }
      
      const demandesData = (await demandeService.getDemandesEnAttente() as unknown) as Demande[];
      console.log('Demandes récupérées:', demandesData);

      const demandesWithMatches = await Promise.all(
        demandesData.map(async (demande) => {
          if (!demande.id) return { ...demande, matches: [], matchCount: 0 };
          
          let matchesData = await matchService.getMatchesByDemande(demande.id);
          console.log('Matches pour demande', demande.id, ':', matchesData);
          
          if (!matchesData || matchesData.length === 0) {
            const generatedMatches = await matchService.generateMatchesForDemande(demande);
            console.log('Nouveaux matches générés:', generatedMatches);
            
            if (generatedMatches && generatedMatches.length > 0) {
              matchesData = await matchService.getMatchesByDemande(demande.id);
            }
          }
          
          return {
            ...demande,
            matches: matchesData as MatchWithEtudiant[],
            matchCount: matchesData?.length || 0
          };
        })
      );
      
      console.log('Demandes avec matches:', demandesWithMatches);
      setDemandes(demandesWithMatches);
    } catch (err) {
      console.error('Erreur détaillée lors du chargement des données:', err);
      setNotification({
        open: true,
        message: 'Erreur lors du chargement des données',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleContact = async (matchId: string) => {
    try {
      await matchService.updateMatch(matchId, { statut: 'accepté' });
      await loadData();
    } catch (err) {
      setError('Erreur lors de la mise en relation');
      console.error('Erreur:', err);
    }
  };

  const handleReject = async (matchId: string) => {
    try {
      await matchService.updateMatch(matchId, { statut: 'refusé' });
      await loadData();
    } catch (err) {
      setError('Erreur lors du refus du match');
      console.error('Erreur:', err);
    }
  };

  const handleDemandeClick = (demande: DemandeWithMatches) => {
    setSelectedDemande(demande);
  };

  const handleCloseDetails = () => {
    setSelectedDemande(null);
  };

  const handleCompareAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Switch changé à:', event.target.checked);
    setCompareAll(event.target.checked);
  };

  const filteredDemandes = demandes.filter(demande => 
    (demande.description_projet?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (demande.entreprise?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    demande.competences_requises.some((comp: Competence) => 
      (comp.nom || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <DashboardBackButton />
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des Matches
      </Typography>

      <Box sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
                <TextField
                  fullWidth
                label="Rechercher une demande"
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Entreprise</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Compétences requises</TableCell>
                <TableCell>Ville</TableCell>
                <TableCell>Étudiants compatibles</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDemandes.map((demande) => (
                <TableRow 
                  key={demande.id}
                  hover
                  onClick={() => handleDemandeClick(demande)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{demande.entreprise}</TableCell>
                  <TableCell>
                    <Typography noWrap style={{ maxWidth: 200 }}>
                      {demande.description_projet}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {demande.competences_requises.map((comp, index) => (
                        <Chip
                          key={index}
                          label={`${comp.nom} - ${comp.priorite}`}  
                          size="small"
                          color={comp.priorite === 'Essentiel' ? 'primary' : 'default'}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{demande.ville}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${demande.matchCount} étudiant${demande.matchCount > 1 ? 's' : ''}`}
                      color={demande.matchCount > 0 ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <KeyboardArrowDownIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={!!selectedDemande}
        onClose={handleCloseDetails}
        maxWidth="lg"
        fullWidth
        onSubmit={(e) => e.preventDefault()}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Étudiants compatibles - {selectedDemande?.entreprise}
            </Typography>
            <IconButton onClick={handleCloseDetails} size="small">
              <KeyboardArrowUpIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDemande && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Description du projet
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedDemande.description_projet}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {selectedDemande.competences_requises.map((comp, index) => (
                    <Chip
                      key={index}
                      label={`${comp.nom} (${comp.priorite})`}
                      color={comp.priorite === 'Essentiel' ? 'primary' : 'default'}
                    />
                  ))}
                </Box>
              </Box>

              <Box component="form" onSubmit={(e) => e.preventDefault()}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={compareAll}
                      onChange={handleCompareAllChange}
                      color="secondary"
                    />
                  }
                  label="Comparer avec tous les profils étudiants"
                  sx={{ mb: 2 }}
                />
              </Box>

              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress />
                </Box>
              )}

              {!loading && compareAll && allStudents.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Aucun profil étudiant disponible pour la comparaison
                </Alert>
              )}

              <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Étudiant</TableCell>
                <TableCell>Compétences</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                    {compareAll 
                      ? allStudents.map((student) => {
                          const score = selectedDemande ? calculateMatchScore(student, selectedDemande.competences_requises) : 0;
                          return (
                            <TableRow 
                              key={student.id}
                              sx={{
                                bgcolor: score >= 70 ? 'success.light' : 
                                        score >= 50 ? 'warning.light' : 
                                        'error.light',
                                opacity: 0.8
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <PersonIcon color="primary" />
                                  <Box>
                                    <Typography variant="subtitle1">
                                      {student.profile?.nom} {student.profile?.prenom}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {student.profile?.telephone}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                  {(student.competences || []).map((comp, index) => (
                                    <Chip
                                      key={index}
                                      label={`${comp.nom} - ${comp.niveau}${comp.description ? ` (${comp.description})` : ''}`}
                                      size="small"
                                      sx={{ bgcolor: '#9333EA20', color: '#9333EA' }}
                                    />
                                  ))}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="h6"
                                  color={
                                    score >= 70
                                      ? 'success.main'
                                      : score >= 50
                                      ? 'warning.main'
                                      : 'error.main'
                                  }
                                >
                                  {score}%
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={score >= 70 ? 'Très compatible' : score >= 50 ? 'Compatible' : 'Peu compatible'}
                                  color={score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error'}
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Tooltip title="Créer un match">
                                    <IconButton
                                      color="primary"
                                      onClick={async () => {
                                        if (selectedDemande && selectedDemande.id) {
                                          try {
                                            await matchService.createMatch({
                                              demande_id: selectedDemande.id,
                                              etudiant_id: student.id ?? '',
                                              statut: 'proposé',
                                              notes_admin: `Score de compatibilité: ${score}%`
                                            });
                                            await loadData();
                                            setNotification({
                                              open: true,
                                              message: 'Match créé avec succès',
                                              severity: 'success'
                                            });
                                          } catch (error) {
                                            console.error('Erreur lors de la création du match:', error);
                                            setNotification({
                                              open: true,
                                              message: 'Erreur lors de la création du match',
                                              severity: 'error'
                                            });
                                          }
                                        }
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Contacter">
                                    <IconButton 
                                      color="primary"
                                      onClick={() => {
                                        window.location.href = `mailto:${student.profile?.email}`;
                                      }}
                                    >
                                      <EmailIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      : selectedDemande.matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle1">
                                    {match.etudiant.profile?.nom} {match.etudiant.profile?.prenom}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                                    {match.etudiant.profile?.telephone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                {(match.etudiant.competences || []).map((comp, index) => (
                                  <Chip
                                    key={index}
                                    label={`${comp.nom} - ${comp.niveau}${comp.description ? ` (${comp.description})` : ''}`}
                                    size="small"
                                    sx={{ bgcolor: '#9333EA20', color: '#9333EA' }}
                                  />
                                ))}
                              </Box>
                            </TableCell>
                  <TableCell>
                    <Typography
                      variant="h6"
                      color={
                        (match.score || 0) >= 80
                          ? 'success.main'
                          : (match.score || 0) >= 60
                          ? 'warning.main'
                          : 'error.main'
                      }
                    >
                      {match.score || 0}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        match.statut === 'proposé'
                          ? 'En attente'
                          : match.statut === 'accepté'
                          ? 'Accepté'
                          : 'Refusé'
                      }
                      color={
                        match.statut === 'proposé'
                          ? 'default'
                          : match.statut === 'accepté'
                          ? 'success'
                          : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {match.statut === 'proposé' && (
                        <>
                          <Tooltip title="Accepter">
                            <IconButton
                              color="success"
                              onClick={() => handleContact(match.id)}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Refuser">
                            <IconButton
                              color="error"
                              onClick={() => handleReject(match.id)}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="Contacter">
                        <IconButton color="primary">
                          <EmailIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
                        ))
                    }
            </TableBody>
          </Table>
        </TableContainer>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar 
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DashboardMatch; 