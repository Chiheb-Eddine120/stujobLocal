import React, { useState } from 'react';
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
} from '@mui/material';

const sectors = [
  'Restauration',
  'Vente',
  'Logistique',
  'IT',
  'Autre',
];

const DemandeForm = () => {
  const [formData, setFormData] = useState({
    entreprise: '',
    secteur: '',
    profil: '',
    urgence: '',
    ville: '',
    email: '',
    telephone: '',
    remarques: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateTrackingNumber = () => {
    const prefix = 'STU';
    const random = Math.floor(Math.random() * 100000);
    return `${prefix}-${random}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTrackingNumber = generateTrackingNumber();
    setTrackingNumber(newTrackingNumber);
    setSubmitted(true);
    
    // Ici, vous pourriez ajouter la logique pour envoyer les données à votre backend
    console.log('Données du formulaire:', formData);
    console.log('Numéro de suivi:', newTrackingNumber);
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
                >
                  {sectors.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Type de profil recherché"
                  name="profil"
                  value={formData.profil}
                  onChange={handleChange}
                  helperText="Décrivez les compétences ou tâches recherchées"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Date de début souhaitée"
                  name="urgence"
                  type="date"
                  value={formData.urgence}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  Envoyer la demande
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default DemandeForm; 