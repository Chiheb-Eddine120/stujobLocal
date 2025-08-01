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
  //InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';
import { demandeService } from '../../services/demandeService';
import { matchService } from '../../services/matchService';
import { Demande, Etudiant, Match } from '../../types';
import DashboardBackButton from '../../components/DashboardBackButton';
import { etudiantService } from '../../services/etudiantService';

/*interface FilterState {
  competences: string[];
  niveauMin: NiveauCompetence | '';
  typeMission: string;
}*/

interface MatchWithEtudiant extends Match {
  etudiant: Etudiant;
  score?: number;
}

interface DemandeWithMatches extends Demande {
  matches: MatchWithEtudiant[];
  matchCount: number;
}

interface EtudiantAvecScore extends Etudiant {
  score: number;
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
  const [comparingStudents, setComparingStudents] = useState<EtudiantAvecScore[]>([]);
  const [openCompetenceDialog, setOpenCompetenceDialog] = useState(false);
  const [competenceDetails, setCompetenceDetails] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  // Charger tous les étudiants une seule fois au démarrage
  useEffect(() => {
    const loadAllStudents = async () => {
      try {
        const students = await etudiantService.getAllEtudiants();
        setAllStudents(students);
      } catch (error) {
        console.error('Erreur lors du chargement de tous les étudiants:', error);
        setNotification({
          open: true,
          message: 'Erreur lors du chargement des étudiants',
          severity: 'error'
        });
      }
    };

    loadAllStudents();
  }, []);

  useEffect(() => {
    if (compareAll && selectedDemande) {
      handleCompareWithAllStudents(selectedDemande);
    } else {
      setComparingStudents([]);
    }
    // eslint-disable-next-line
  }, [compareAll, selectedDemande, allStudents]);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  function normalize(str: string) {
    return str
      .normalize('NFD')
      .replace(/[ -\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  const calculateMatchScore = (etudiant: Etudiant, competencesRequises: Array<{ competence: string; priorite: 'Obligatoire' | 'Flexible' | 'Optionnel' }>) => {
    if (!etudiant.competences || etudiant.competences.length === 0 || !competencesRequises || competencesRequises.length === 0) {
      return 0;
    }

    let score = 0;
    let totalWeight = 0;
    
    // Définir les poids selon la priorité
    const poidsPriorite = {
      'Obligatoire': 3,
      'Flexible': 2,
      'Optionnel': 1
    };

    for (const requise of competencesRequises) {
      const match = etudiant.competences.some(comp => {
        if (!comp) return false;
        let nomComp = '';
        if (typeof comp === 'object') {
          nomComp = comp.label || comp.nom || '';
        } else if (typeof comp === 'string') {
          nomComp = comp;
        }
        return normalize(nomComp) === normalize(requise.competence);
      });

      if (match) {
        score += poidsPriorite[requise.priorite];
      }
      totalWeight += poidsPriorite[requise.priorite];
    }

    return Math.round((score / totalWeight) * 100);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      if (compareAll) {
        const students = await etudiantService.getAllEtudiants();
        setAllStudents(students);
      }
      
      const demandesData = (await demandeService.getDemandesEnAttente() as unknown) as Demande[];

      const demandesWithMatches = await Promise.all(
        demandesData.map(async (demande) => {
          if (!demande.id) return { ...demande, matches: [], matchCount: 0 };
          
          try {
            let matchesData = await matchService.getMatchesByDemande(demande.id);
            console.log('Matches reçus pour la demande', demande.id, matchesData);

            if (!matchesData || matchesData.length === 0) {
              const generatedMatches = await matchService.generateMatchesForDemande(demande);
              if (generatedMatches && generatedMatches.length > 0) {
                matchesData = await matchService.getMatchesByDemande(demande.id);
                console.log('Matches générés pour la demande', demande.id, matchesData);
              }
            }

            // Mapping robuste du champ etudiant + filtre anti-doublon
            const seen = new Set();
            const matchesWithEtudiant = (matchesData || [])
              .map(m => ({
                ...m,
                etudiant: m.etudiant || m.etudiants || m.all_students || null
              }))
              .filter(m => {
                // On ne garde qu'un seul match par étudiant (par id)
                if (!m.etudiant || !m.etudiant.id) return false;
                if (seen.has(m.etudiant.id)) return false;
                seen.add(m.etudiant.id);
                return true;
              });

            return {
              ...demande,
              matches: matchesWithEtudiant,
              matchCount: matchesWithEtudiant.length || 0
            };
          } catch (err) {
            return { ...demande, matches: [], matchCount: 0 };
          }
        })
      );
      
      setDemandes(demandesWithMatches);
    } catch (err) {
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
    }
  };

  const handleReject = async (matchId: string) => {
    try {
      await matchService.updateMatch(matchId, { statut: 'refusé' });
      await loadData();
    } catch (err) {
      setError('Erreur lors du refus du match');
    }
  };

  const handleDemandeClick = (demande: DemandeWithMatches) => {
    setSelectedDemande(demande);
  };

  const handleCloseDetails = () => {
    setSelectedDemande(null);
  };

  const handleCompareAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompareAll(event.target.checked);
  };

  const handleCompareWithAllStudents = async (demande: DemandeWithMatches) => {
    if (!compareAll || !allStudents.length) return;

    try {
      // On prend tous les étudiants, sans filtrer
      const competencesRequises = demande.suggestions_competences || [];
      const etudiantsCompatibles = allStudents;

      // Calculer le score pour chaque étudiant
      const etudiantsAvecScore = etudiantsCompatibles.map(etudiant => ({
        ...etudiant,
        score: calculateMatchScore(etudiant, competencesRequises)
      }));

      // Trier par score décroissant
      etudiantsAvecScore.sort((a, b) => b.score - a.score);

      // Exclure les étudiants déjà en match avec cette demande
      const etudiantsDejaEnMatch = demande.matches.map(match => match.etudiant?.id).filter(Boolean);
      const etudiantsNonMatches = etudiantsAvecScore.filter(etudiant => 
        !etudiantsDejaEnMatch.includes(etudiant.id)
      );

      setComparingStudents(etudiantsNonMatches as EtudiantAvecScore[]);
    } catch (error) {
      console.error('Erreur lors de la comparaison avec tous les étudiants:', error);
      setNotification({
        open: true,
        message: 'Erreur lors de la comparaison avec tous les étudiants',
        severity: 'error'
      });
    }
  };

  const handleOpenCompetenceDialog = (competences: any[]) => {
    setCompetenceDetails(competences);
    setOpenCompetenceDialog(true);
  };
  const handleCloseCompetenceDialog = () => {
    setOpenCompetenceDialog(false);
  };

  const filteredDemandes = demandes.filter(demande => 
    (demande.description_projet?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (demande.entreprise?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    demande.suggestions_competences.some((comp) => 
      comp.competence.toLowerCase().includes(searchTerm.toLowerCase())
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
                      {demande.suggestions_competences.map((comp, index) => (
                        <Chip
                          key={index}
                          label={`${comp.competence} (${comp.priorite})`}
                          size="small"
                          color="default"
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
                  {selectedDemande.suggestions_competences.map((comp, index) => (
                    <Chip
                      key={index}
                      label={`${comp.competence} (${comp.priorite})`}
                      size="small"
                      color="default"
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

              {compareAll && comparingStudents.length > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Mode comparaison étendue :</strong> Affichage de tous les étudiants avec leur score de compatibilité. 
                    Les étudiants déjà en match avec cette demande sont inclus.
                  </Typography>
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
                      ? comparingStudents.map((student) => {
                          const score = student.score ?? 0;
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
                                      {student.nom} {student.prenom}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {student.telephone}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{ maxWidth: 585, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                onClick={() => handleOpenCompetenceDialog(student.competences || [])}
                              >
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                  {(student.competences || []).map((comp, index) => {
                                    const nom = typeof comp === 'string' ? comp : comp?.label || comp?.nom || 'Inconnu';
                                    const niveau = typeof comp === 'object' && comp?.niveau ? comp.niveau : '';
                                    const description = typeof comp === 'object' && comp?.description ? ` (${comp.description})` : '';
                                    return (
                                      <Chip
                                        key={index}
                                        label={`${nom}${niveau ? ' - ' + niveau : ''}${description}`}
                                        size="small"
                                        sx={{ bgcolor: '#9333EA20', color: '#9333EA' }}
                                      />
                                    );
                                  })}
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
                                        window.location.href = `mailto:${student.email}`;
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
                      : selectedDemande.matches
                          .filter(match => !!match.etudiant)
                          .map((match) => (
                            <TableRow key={match.id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <PersonIcon color="primary" />
                                  <Box>
                                    <Typography variant="subtitle1">
                                      {match.etudiant ? `${match.etudiant.nom ?? ''} ${match.etudiant.prenom ?? ''}` : <span style={{ color: 'red' }}>Profil manquant</span>}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {match.etudiant?.telephone ?? ''}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{ maxWidth: 585, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                onClick={() => handleOpenCompetenceDialog(match.etudiant?.competences || [])}
                              >
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                  {(match.etudiant?.competences || []).map((comp, index) => {
                                    const nom = typeof comp === 'string' ? comp : comp?.label || comp?.nom || 'Inconnu';
                                    const niveau = typeof comp === 'object' && comp?.niveau ? comp.niveau : '';
                                    const description = typeof comp === 'object' && comp?.description ? ` (${comp.description})` : '';
                                    return (
                                      <Chip
                                        key={index}
                                        label={`${nom}${niveau ? ' - ' + niveau : ''}${description}`}
                                        size="small"
                                        sx={{ bgcolor: '#9333EA20', color: '#9333EA' }}
                                      />
                                    );
                                  })}
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
                                    <IconButton color="primary" disabled={!match.etudiant || !match.etudiant.email}>
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

      <Dialog open={openCompetenceDialog} onClose={handleCloseCompetenceDialog} maxWidth={false} PaperProps={{ sx: { maxWidth: 635 } }}>
        <DialogTitle>Détail des compétences</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {competenceDetails.length === 0 && <Typography>Aucune compétence renseignée.</Typography>}
            {competenceDetails.map((comp, idx) => (
              <Box key={idx} sx={{ p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {typeof comp === 'string' ? comp : comp?.label || comp?.nom || 'Inconnu'}
                </Typography>
                {typeof comp === 'object' && comp?.niveau && (
                  <Typography variant="body2">Niveau : {comp.niveau}</Typography>
                )}
                {typeof comp === 'object' && comp?.description && (
                  <Typography variant="body2">Description : {comp.description}</Typography>
                )}
              </Box>
            ))}
          </Box>
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