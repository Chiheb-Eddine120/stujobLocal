import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Profile, Etudiant, Experience } from '../types';

interface StudentProfileFormProps {
  profile: Profile;
  etudiant?: Etudiant;
  onSubmit: (data: Partial<Etudiant>) => Promise<void>;
}

const niveauxCompetence = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  profile,
  etudiant,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Etudiant>>({
    profile_id: profile.id,
    competences_techniques: [],
    competences_soft: [],
    experiences: [],
  });
  const [newCompetence, setNewCompetence] = useState({ nom: '', niveau: '' });
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({});
  const [isCompetenceDialogOpen, setIsCompetenceDialogOpen] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [competenceType, setCompetenceType] = useState<'technique' | 'soft'>('technique');

  useEffect(() => {
    if (etudiant) {
      setFormData({
        ...etudiant,
        profile_id: profile.id,
      });
    } else {
      setFormData({
        profile_id: profile.id,
        cv_url: '',
        lettre_motivation_url: '',
        competences_techniques: [],
        competences_soft: [],
        experiences: [],
        disponibilite: '',
        niveau_etudes: '',
        ecole: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }, [profile, etudiant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompetenceDialogOpen = (type: 'technique' | 'soft') => {
    setCompetenceType(type);
    setNewCompetence({ nom: '', niveau: '' });
    setIsCompetenceDialogOpen(true);
  };

  const handleAddCompetence = () => {
    if (newCompetence.nom && newCompetence.niveau) {
      const competenceField = competenceType === 'technique' 
        ? 'competences_techniques' 
        : 'competences_soft';
      
      setFormData(prev => ({
        ...prev,
        [competenceField]: [...(prev[competenceField] || []), newCompetence],
      }));
      setIsCompetenceDialogOpen(false);
      setNewCompetence({ nom: '', niveau: '' });
    }
  };

  const handleRemoveCompetence = (type: 'technique' | 'soft', index: number) => {
    const field = type === 'technique' ? 'competences_techniques' : 'competences_soft';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceDialogOpen = () => {
    setNewExperience({});
    setIsExperienceDialogOpen(true);
  };

  const handleAddExperience = () => {
    if (newExperience.titre && newExperience.entreprise && newExperience.date_debut) {
      setFormData(prev => ({
        ...prev,
        experiences: [...(prev.experiences || []), newExperience as Experience],
      }));
      setIsExperienceDialogOpen(false);
      setNewExperience({});
    }
  };

  const handleRemoveExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Informations personnelles (depuis votre profil)
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prénom"
              value={profile.prenom}
              disabled
              sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              value={profile.nom}
              disabled
              sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={profile.email}
              disabled
              sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Téléphone"
              value={profile.telephone}
              disabled
              sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Formation
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Niveau d'études"
              name="niveau_etudes"
              value={formData.niveau_etudes || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="École"
              name="ecole"
              value={formData.ecole || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Compétences techniques
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => handleCompetenceDialogOpen('technique')}
          >
            Ajouter
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.competences_techniques?.map((comp, index) => (
            <Chip
              key={index}
              label={`${comp.nom} - ${comp.niveau}`}
              onDelete={() => handleRemoveCompetence('technique', index)}
              sx={{ bgcolor: '#9333EA20', color: '#9333EA' }}
            />
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Soft skills
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => handleCompetenceDialogOpen('soft')}
          >
            Ajouter
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.competences_soft?.map((comp, index) => (
            <Chip
              key={index}
              label={`${comp.nom} - ${comp.niveau}`}
              onDelete={() => handleRemoveCompetence('soft', index)}
              sx={{ bgcolor: '#FF4D8D20', color: '#FF4D8D' }}
            />
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Expériences
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={handleExperienceDialogOpen}
          >
            Ajouter
          </Button>
        </Box>
        {formData.experiences?.map((exp, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              mb: 2,
              border: '1px solid #E0E0E0',
              borderRadius: 2,
              position: 'relative'
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleRemoveExperience(index)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <DeleteIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {exp.titre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {exp.entreprise} • {exp.date_debut} - {exp.date_fin || 'Présent'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {exp.description}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Documents
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL du CV"
              name="cv_url"
              value={formData.cv_url || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL de la lettre de motivation"
              name="lettre_motivation_url"
              value={formData.lettre_motivation_url || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Disponibilité
        </Typography>
        <TextField
          fullWidth
          label="Disponibilité"
          name="disponibilite"
          value={formData.disponibilite || ''}
          onChange={handleInputChange}
          required
        />
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            bgcolor: '#9333EA',
            '&:hover': { bgcolor: '#7928CA' }
          }}
        >
          Enregistrer
        </Button>
      </Box>

      {/* Dialog pour ajouter une compétence */}
      <Dialog open={isCompetenceDialogOpen} onClose={() => setIsCompetenceDialogOpen(false)}>
        <DialogTitle>
          Ajouter une {competenceType === 'technique' ? 'compétence technique' : 'soft skill'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom"
              value={newCompetence.nom}
              onChange={(e) => setNewCompetence(prev => ({ ...prev, nom: e.target.value }))}
            />
            <FormControl fullWidth>
              <InputLabel>Niveau</InputLabel>
              <Select
                value={newCompetence.niveau}
                label="Niveau"
                onChange={(e) => setNewCompetence(prev => ({ ...prev, niveau: e.target.value }))}
              >
                {niveauxCompetence.map((niveau) => (
                  <MenuItem key={niveau} value={niveau}>
                    {niveau}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCompetenceDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleAddCompetence} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour ajouter une expérience */}
      <Dialog open={isExperienceDialogOpen} onClose={() => setIsExperienceDialogOpen(false)}>
        <DialogTitle>Ajouter une expérience</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Titre du poste"
              value={newExperience.titre || ''}
              onChange={(e) => setNewExperience(prev => ({ ...prev, titre: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Entreprise"
              value={newExperience.entreprise || ''}
              onChange={(e) => setNewExperience(prev => ({ ...prev, entreprise: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Date de début"
              value={newExperience.date_debut || ''}
              onChange={(e) => setNewExperience(prev => ({ ...prev, date_debut: e.target.value }))}
              placeholder="YYYY-MM"
            />
            <TextField
              fullWidth
              label="Date de fin"
              value={newExperience.date_fin || ''}
              onChange={(e) => setNewExperience(prev => ({ ...prev, date_fin: e.target.value }))}
              placeholder="YYYY-MM (optionnel)"
            />
            <TextField
              fullWidth
              label="Description"
              value={newExperience.description || ''}
              onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsExperienceDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleAddExperience} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentProfileForm; 