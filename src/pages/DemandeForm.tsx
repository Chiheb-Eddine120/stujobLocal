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
} from '@mui/material';
import { demandeService } from '../services/demandeService';
import { Demande, NiveauPriorite } from '../types';

const sectors = [
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
];

const niveauxPriorite: NiveauPriorite[] = ['Essentiel', 'Important', 'Optionnel'];

const DemandeForm: React.FC = () => {
  const [formData, setFormData] = useState<Omit<Demande, 'id' | 'created_at'>>({
    entreprise: '',
    secteur: '',
    profil: '',
    urgence: 'Normal',
    ville: '',
    email: '',
    telephone: '',
    remarques: '',
    status: 'en_attente',
    description_projet: '',
    competences_requises: [],
    niveau_priorite: 'Normal',
    duree_mission: '',
    date_debut_souhaitee: '',
    budget: '',
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showLegalDialog, setShowLegalDialog] = useState<boolean>(false);
  const [newCompetence, setNewCompetence] = useState<{nom: string; priorite: NiveauPriorite}>({
    nom: '',
    priorite: 'Important',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Omit<Demande, 'id' | 'created_at'>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompetenceChange = (e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNewCompetence((prev: {nom: string; priorite: NiveauPriorite}) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleAddCompetence = () => {
    if (newCompetence.nom) {
      setFormData((prev) => ({
        ...prev,
        competences_requises: [...prev.competences_requises, newCompetence.nom],
      }));
      setNewCompetence({ nom: '', priorite: 'Important' });
    }
  };

  const handleRemoveCompetence = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      competences_requises: prev.competences_requises.filter((_, i) => i !== index),
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
            <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
              {trackingNumber}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Un email de confirmation a été envoyé à {formData.email}
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Faire une demande de recrutement
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nom de l'entreprise"
                  name="entreprise"
                  value={formData.entreprise}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Secteur"
                  name="secteur"
                  value={formData.secteur}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {sectors.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Compétences recherchées
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Compétence"
                        name="nom"
                        value={newCompetence.nom}
                        onChange={(e) => handleCompetenceChange(e as ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>)}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Priorité</InputLabel>
                        <Select
                          name="priorite"
                          value={newCompetence.priorite}
                          onChange={(e) => handleCompetenceChange(e as ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>)}
                          label="Priorité"
                          disabled={loading}
                        >
                          {niveauxPriorite.map((niveau) => (
                            <MenuItem key={niveau} value={niveau}>
                              {niveau}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Button
                        variant="contained"
                        onClick={handleAddCompetence}
                        disabled={loading || !newCompetence.nom}
                        fullWidth
                        sx={{ height: '100%' }}
                      >
                        Ajouter
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.competences_requises.map((comp, index) => (
                    <Chip
                      key={index}
                      label={comp}
                      onDelete={() => handleRemoveCompetence(index)}
                      disabled={loading}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Description du projet"
                  name="description_projet"
                  value={formData.description_projet}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Niveau de priorité</InputLabel>
                  <Select
                    name="niveau_priorite"
                    value={formData.niveau_priorite}
                    onChange={(e) => handleChange(e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                    label="Niveau de priorité"
                    disabled={loading}
                  >
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Urgent">Urgent</MenuItem>
                    <MenuItem value="Très urgent">Très urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Urgence</InputLabel>
                  <Select
                    name="urgence"
                    value={formData.urgence}
                    onChange={(e) => handleChange(e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                    label="Urgence"
                    disabled={loading}
                  >
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Urgent">Urgent</MenuItem>
                    <MenuItem value="Très urgent">Très urgent</MenuItem>
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
                  onChange={handleChange}
                  placeholder="Ex: 3 mois, 6 mois, 1 an..."
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Ex: 1000€/mois, 5000€..."
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Date de début souhaitée"
                  name="date_debut_souhaitee"
                  type="date"
                  value={formData.date_debut_souhaitee}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Profil recherché"
                  name="profil"
                  value={formData.profil}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Ville ou zone géographique"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Téléphone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  disabled={loading}
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
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      <Dialog open={showLegalDialog} onClose={() => setShowLegalDialog(false)}>
        <DialogTitle>Conditions légales</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            En soumettant cette demande, vous acceptez les conditions suivantes :
          </Typography>
          <Typography component="div" variant="body2" paragraph>
            <ul>
              <li>Respect du RGPD et de la protection des données personnelles</li>
              <li>Engagement à traiter équitablement les candidats</li>
              <li>Confidentialité des informations partagées</li>
              <li>Respect des conditions générales d'utilisation de Stujob</li>
            </ul>
          </Typography>
          <FormHelperText>
            En cliquant sur "Confirmer", vous acceptez ces conditions.
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLegalDialog(false)}>Annuler</Button>
          <Button onClick={handleConfirmSubmit} variant="contained" color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DemandeForm; 