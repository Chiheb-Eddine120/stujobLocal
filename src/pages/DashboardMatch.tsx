import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { demandeService } from '../services/demandeService';
import { matchService } from '../services/matchService';
import { DemandeRecrutement, Etudiant, Match, NiveauCompetence } from '../types';

interface FilterState {
  competences: string[];
  niveauMin: NiveauCompetence | '';
  typeMission: string;
}

interface MatchWithEtudiant extends Match {
  etudiant: Etudiant & {
    profiles: {
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
    };
  };
  score?: number;
}

const DashboardMatch: React.FC = () => {
  const [demandes, setDemandes] = useState<DemandeRecrutement[]>([]);
  const [matches, setMatches] = useState<MatchWithEtudiant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    competences: [],
    niveauMin: '',
    typeMission: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [demandesData, matchesData] = await Promise.all([
        demandeService.getDemandesEnAttente(),
        matchService.getMatchesByDemande(demandes[0]?.id || ''),
      ]);
      setDemandes(demandesData as unknown as DemandeRecrutement[]);
      setMatches(matchesData as MatchWithEtudiant[]);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
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

  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.etudiant.profiles.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.etudiant.profiles.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.etudiant.competences_techniques.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilters = 
      (!filters.competences.length || 
        match.etudiant.competences_techniques.some(c => filters.competences.includes(c))) &&
      (!filters.niveauMin || 
        match.etudiant.competences_techniques.some(c => {
          const niveaux = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'] as const;
          return niveaux.indexOf(c as typeof niveaux[number]) >= niveaux.indexOf(filters.niveauMin as typeof niveaux[number]);
        }));

    return matchesSearch && matchesFilters;
  });

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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard des Mises en Relation
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Rechercher"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Niveau minimum</InputLabel>
                  <Select
                    value={filters.niveauMin}
                    onChange={(e) => handleFilterChange('niveauMin', e.target.value as NiveauCompetence)}
                    label="Niveau minimum"
                  >
                    <MenuItem value="">Tous les niveaux</MenuItem>
                    <MenuItem value="Débutant">Débutant</MenuItem>
                    <MenuItem value="Intermédiaire">Intermédiaire</MenuItem>
                    <MenuItem value="Avancé">Avancé</MenuItem>
                    <MenuItem value="Expert">Expert</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setFilters({ competences: [], niveauMin: '', typeMission: '' })}
                >
                  Réinitialiser les filtres
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
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
              {filteredMatches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle1">
                          {match.etudiant.profiles.prenom} {match.etudiant.profiles.nom}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {match.etudiant.profiles.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {match.etudiant.competences_techniques.map((comp, index) => (
                        <Chip
                          key={index}
                          label={comp}
                          size="small"
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default DashboardMatch; 