import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  SelectChangeEvent,
  IconButton,
  Snackbar,
} from '@mui/material';
import { demandeService } from '../services/demandeService';
import { Demande, NiveauPriorite, Competence, NiveauUrgence, Secteur } from '../types';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';

const sectors: Secteur[] = [
  'Restauration',
  'Vente',
  'Logistique',
  'IT',
  'Autre',
];

const competencesPredefinies = [
  'Communication',
  'Travail en équipe',
  'Autonomie',
  'Résolution de problèmes',
  'Gestion du temps',
  'Leadership',
  'Créativité',
  'Analyse',
  'Organisation',
  'Adaptabilité',
] as const;

const niveauxPriorite: NiveauPriorite[] = ['Essentiel', 'Important', 'Optionnel'];
const niveauxUrgence: NiveauUrgence[] = ['Normal', 'Urgent', 'Très urgent'];

const DemandeForm: React.FC = () => {
  const [formData, setFormData] = useState<Omit<Demande, 'id' | 'created_at'>>({
    entreprise: '',
    secteur: 'Autre' as Secteur,
    profil: '',
    urgence: 'Normal' as NiveauUrgence,
    ville: '',
    email: '',
    telephone: '',
    remarques: '',
    status: 'en_attente',
    description_projet: '',
    competences_requises: [],
    niveau_priorite: 'Important' as NiveauPriorite,
    duree_mission: '',
    date_debut_souhaitee: '',
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showLegalDialog, setShowLegalDialog] = useState<boolean>(false);
  const [newCompetence, setNewCompetence] = useState<Competence>({
    nom: '',
    priorite: 'Important' as NiveauPriorite,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUrgenceChange = (e: SelectChangeEvent<NiveauUrgence>) => {
    const value = e.target.value as NiveauUrgence;
    setFormData((prev) => ({
      ...prev,
      urgence: value,
    }));
  };

  const handlePrioriteChange = (e: SelectChangeEvent<NiveauPriorite>) => {
    const value = e.target.value as NiveauPriorite;
    setFormData((prev) => ({
      ...prev,
      niveau_priorite: value,
    }));
  };

  const handleSecteurChange = (event: SelectChangeEvent<Secteur>) => {
    setFormData(prev => ({
      ...prev,
      secteur: event.target.value as Secteur
    }));
  };

  const handleCompetenceTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompetence((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompetencePrioriteChange = (e: SelectChangeEvent<NiveauPriorite>) => {
    const value = e.target.value as NiveauPriorite;
    setNewCompetence((prev) => ({
      ...prev,
      priorite: value,
    }));
  };

  const handleAddCompetence = () => {
    if (newCompetence.nom) {
      setFormData((prev) => ({
        ...prev,
        competences_requises: [...prev.competences_requises, { ...newCompetence }],
      }));
      setNewCompetence({ nom: '', priorite: 'Important' as NiveauPriorite });
    }
  };

  const handleRemoveCompetence = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      competences_requises: prev.competences_requises.filter((_, i) => i !== index),
    }));
  };

  const handleSelectPredefinedCompetence = (competence: string) => {
    const newComp: Competence = {
      nom: competence,
      priorite: 'Important' as NiveauPriorite,
    };
    setFormData((prev) => ({
      ...prev,
      competences_requises: [...prev.competences_requises, newComp],
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowLegalDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowLegalDialog(false);
    setLoading(true);
    setError('');

    try {
      const result = await demandeService.createDemande(formData);
      setTrackingNumber(result.id);
      setSubmitted(true);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
      console.error('Erreur lors de la création de la demande:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrackingNumber = async () => {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: 'white',
      '&:hover fieldset': {
        borderColor: '#9333EA',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#9333EA',
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#9333EA',
    }
  };

  const selectStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: 'white',
      '&:hover fieldset': {
        borderColor: '#9333EA',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#9333EA',
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#9333EA',
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Merci pour votre demande !
            </Alert>
            <Typography variant="h6" gutterBottom>
              Votre numéro de suivi :
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h4" color="primary">
                {trackingNumber}
              </Typography>
              <IconButton 
                onClick={handleCopyTrackingNumber}
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Un email de confirmation a été envoyé à {formData.email}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href={`/suivi/${trackingNumber}`}
              sx={{ mt: 2 }}
            >
              Suivre ma demande
            </Button>
          </Paper>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message="Numéro de suivi copié !"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        align="center"
        sx={{ 
          mb: 6,
          fontWeight: 700,
          background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Faire une demande de recrutement
      </Typography>

      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          maxWidth: '800px', 
          mx: 'auto',
          p: 4,
          borderRadius: 4,
          background: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: '#FF4D8D'
              }
            }}
          >
            {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <TextField
              required
              fullWidth
              label="Nom de l'entreprise"
              name="entreprise"
              value={formData.entreprise}
              onChange={handleTextChange}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Secteur</InputLabel>
              <Select
                value={formData.secteur}
                onChange={handleSecteurChange}
                label="Secteur"
                sx={selectStyles}
              >
                {sectors.map((sector) => (
                  <MenuItem key={sector} value={sector}>
                    {sector}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1F1F1F', fontWeight: 600 }}>
              Compétences recherchées
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {competencesPredefinies.map((comp) => (
                  <Chip
                    key={comp}
                    label={comp}
                    onClick={() => handleSelectPredefinedCompetence(comp)}
                    sx={{
                      borderRadius: '20px',
                      bgcolor: '#F3E8FF',
                      color: '#9333EA',
                      '&:hover': {
                        bgcolor: '#9333EA',
                        color: 'white',
                      }
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  label="Compétence"
                  name="nom"
                  value={newCompetence.nom}
                  onChange={handleCompetenceTextChange}
                  sx={inputStyles}
                />
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Priorité</InputLabel>
                  <Select
                    value={newCompetence.priorite}
                    onChange={handleCompetencePrioriteChange}
                    label="Priorité"
                    sx={selectStyles}
                  >
                    {niveauxPriorite.map((niveau) => (
                      <MenuItem key={niveau} value={niveau}>
                        {niveau}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  onClick={handleAddCompetence}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
                    borderRadius: '12px',
                    minWidth: '48px',
                    height: '48px',
                    p: 0,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #7928CA 0%, #E6447E 100%)',
                    }
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.competences_requises.map((comp, index) => (
                <Chip
                  key={index}
                  label={`${comp.nom} (${comp.priorite})`}
                  onDelete={() => handleRemoveCompetence(index)}
                  sx={{
                    borderRadius: '20px',
                    bgcolor: '#FDF8FF',
                    color: '#9333EA',
                    border: '1px solid #9333EA',
                  }}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description du projet"
              name="description_projet"
              value={formData.description_projet}
              onChange={handleTextChange}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Niveau de priorité</InputLabel>
              <Select
                value={formData.niveau_priorite}
                onChange={handlePrioriteChange}
                label="Niveau de priorité"
                sx={selectStyles}
              >
                {niveauxPriorite.map((niveau) => (
                  <MenuItem key={niveau} value={niveau}>
                    {niveau}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Urgence</InputLabel>
              <Select
                value={formData.urgence}
                onChange={handleUrgenceChange}
                label="Urgence"
                sx={selectStyles}
              >
                {niveauxUrgence.map((niveau) => (
                  <MenuItem key={niveau} value={niveau}>
                    {niveau}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Durée de la mission"
              name="duree_mission"
              value={formData.duree_mission}
              onChange={handleTextChange}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="Date de début souhaitée"
              name="date_debut_souhaitee"
              value={formData.date_debut_souhaitee}
              onChange={handleTextChange}
              InputLabelProps={{ shrink: true }}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Profil recherché"
              name="profil"
              value={formData.profil}
              onChange={handleTextChange}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Ville ou zone géographique"
              name="ville"
              value={formData.ville}
              onChange={handleTextChange}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleTextChange}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Téléphone"
              name="telephone"
              value={formData.telephone}
              onChange={handleTextChange}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Remarques additionnelles"
              name="remarques"
              value={formData.remarques}
              onChange={handleTextChange}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
                borderRadius: '12px',
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(90deg, #7928CA 0%, #E6447E 100%)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Envoyer la demande'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Dialog 
        open={showLegalDialog} 
        onClose={() => setShowLegalDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: '500px',
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#1F1F1F',
          fontWeight: 600,
          background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          //color: 'transparent',
        }}>
          Conditions légales
        </DialogTitle>
        <DialogContent>
          <Typography 
            paragraph
            sx={{ 
              color: '#1F1F1F',
              fontWeight: 500,
              mb: 2
            }}
          >
            En soumettant cette demande, vous acceptez les conditions suivantes :
          </Typography>
          <Typography component="div" variant="body2" paragraph>
            <Box component="ul" sx={{ 
              pl: 2,
              '& li': {
                mb: 1,
                color: '#666'
              }
            }}>
              <li>Respect du RGPD et de la protection des données personnelles</li>
              <li>Engagement à traiter équitablement les candidats</li>
              <li>Confidentialité des informations partagées</li>
              <li>Respect des conditions générales d'utilisation de Stujob</li>
            </Box>
          </Typography>
          <FormHelperText sx={{ color: '#666', mt: 2 }}>
            En cliquant sur "Confirmer", vous acceptez ces conditions.
          </FormHelperText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setShowLegalDialog(false)}
            sx={{
              color: '#666',
              '&:hover': {
                background: '#F5F5F5'
              }
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleConfirmSubmit} 
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
              borderRadius: '12px',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(90deg, #7928CA 0%, #E6447E 100%)',
              }
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DemandeForm; 