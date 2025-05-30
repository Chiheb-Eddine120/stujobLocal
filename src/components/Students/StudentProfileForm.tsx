import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  //Chip,
  IconButton,
  //Dialog,
  //DialogTitle,
  //DialogContent,
  //DialogActions,
  //Select,
  MenuItem,
  //FormControl,
  //InputLabel,
  Stack,
  Collapse,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Profile, Etudiant, Experience, DocumentFile, Competence, Langue, Disponibilite } from '../../types';
import FileUpload from '../FileUpload';
import CompetenceInput from '../CompetenceInput';
import LangueInput from '../LangueInput';
import DisponibiliteDialog from '../DisponibiliteDialog';
import { supabase } from '../../services/supabaseClient';
import { keyframes } from '@emotion/react';

interface StudentProfileFormProps {
  profile: Profile;
  etudiant?: Etudiant;
  onSubmit: (data: Partial<Etudiant>) => Promise<void>;
}

const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  profile,
  etudiant,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Etudiant> & { telephone?: string }>({
    profile_id: profile.id
  });
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
  const [editExperience, setEditExperience] = useState<Partial<Experience> | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({});
  const [langueError, setLangueError] = useState(false);
  const [isDisponibiliteDialogOpen, setIsDisponibiliteDialogOpen] = useState(false);
  const [isCurrentJob, setIsCurrentJob] = useState(false);
  const [editIsCurrentJob, setEditIsCurrentJob] = useState(false);
  const [biographieError, setBiographieError] = useState(false);
  const [shakeBtn, setShakeBtn] = useState(false);

  const MONTHS = [
    { value: '01', label: 'Janvier' },
    { value: '02', label: 'Février' },
    { value: '03', label: 'Mars' },
    { value: '04', label: 'Avril' },
    { value: '05', label: 'Mai' },
    { value: '06', label: 'Juin' },
    { value: '07', label: 'Juillet' },
    { value: '08', label: 'Août' },
    { value: '09', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' },
  ];
  const CURRENT_YEAR = new Date().getFullYear();
  const YEARS = Array.from({ length: 50 }, (_, i) => CURRENT_YEAR - 40 + i);

  function splitYearMonth(val?: string) {
    if (!val) return { year: '', month: '' };
    const [year, month] = val.split('-');
    return { year, month };
  }

  function joinYearMonth(year: string, month: string) {
    return year && month ? `${year}-${month}` : '';
  }

  useEffect(() => {
    if (etudiant) {
      setFormData({
        ...etudiant,
        profile_id: profile.id,
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

  const handleFileUpload = async (type: 'cv' | 'lettre_motivation', file: DocumentFile) => {
    // Upload vers Supabase Storage (bucket 'cvs')
    const filePath = `${profile.id}/${type}_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('cvs').upload(filePath, file as any, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });
    if (error) {
      console.error('Erreur upload Supabase:', error);
      return;
    }
    // Récupérer l'URL publique
    const { data: publicUrlData } = supabase.storage.from('cvs').getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;
    setFormData(prev => ({
      ...prev,
      cv_file: {
        ...(prev.cv_file || { cv: undefined, lettre_motivation: undefined }),
        [type]: {
          url: publicUrl,
          name: file.name,
          size: file.size,
          type: file.type,
        },
      },
    }));
  };

  const handleFileDelete = (type: 'cv' | 'lettre_motivation') => {
    setFormData(prev => ({
      ...prev,
      cv_file: {
        ...(prev.cv_file || { cv: undefined, lettre_motivation: undefined }),
        [type]: undefined,
      },
    }));
  };

  const handleCompetencesChange = (newCompetences: Competence[]) => {
    setFormData(prev => ({
      ...prev,
      competences: newCompetences,
    }));
  };

  const handleLanguesChange = (newLangues: Langue[]) => {
    setFormData(prev => ({
      ...prev,
      langues: newLangues,
    }));
    if (newLangues.length > 0) setLangueError(false);
  };

  const handleEditExperience = (index: number) => {
    setEditingExperienceIndex(index);
    const exp = formData.experiences?.[index] || null;
    setEditExperience(exp);
    setEditIsCurrentJob(!exp?.date_fin);
  };

  const handleEditExperienceChange = (field: keyof Experience, value: string) => {
    setEditExperience(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSaveEditExperience = () => {
    if (editExperience && editExperience.titre && editExperience.entreprise && editStartYear && editStartMonth) {
      setFormData(prev => ({
        ...prev,
        experiences: prev.experiences?.map((exp, i) => i === editingExperienceIndex ? {
          ...editExperience,
          date_debut: joinYearMonth(editStartYear, editStartMonth),
          date_fin: editIsCurrentJob ? undefined : joinYearMonth(editEndYear, editEndMonth)
        } as Experience : exp)
      }));
      setEditingExperienceIndex(null);
      setEditExperience(null);
      setEditIsCurrentJob(false);
      setEditStartMonth(''); setEditStartYear(''); setEditEndMonth(''); setEditEndYear('');
    }
  };

  const handleCancelEditExperience = () => {
    setEditingExperienceIndex(null);
    setEditExperience(null);
  };

  const handleAddExperience = () => {
    if (newExperience.titre && newExperience.entreprise && startYear && startMonth) {
      setFormData(prev => ({
        ...prev,
        experiences: [...(prev.experiences || []), {
          ...newExperience,
          date_debut: joinYearMonth(startYear, startMonth),
          date_fin: isCurrentJob ? undefined : joinYearMonth(endYear, endMonth)
        } as Experience],
      }));
      setIsAddingExperience(false);
      setNewExperience({});
      setIsCurrentJob(false);
      setStartMonth(''); setStartYear(''); setEndMonth(''); setEndYear('');
    }
  };

  const handleCancelAddExperience = () => {
    setIsAddingExperience(false);
    setNewExperience({});
  };

  const handleRemoveExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences?.filter((_, i) => i !== index),
    }));
  };

  const handleDisponibilitesSave = (dispos: Disponibilite[]) => {
    setFormData(prev => ({
      ...prev,
      disponibilite: { disponibilites: dispos },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.langues || formData.langues.length === 0) {
      setLangueError(true);
      return;
    }
    if (!formData.biographie || formData.biographie.length < 30) {
      setBiographieError(true);
      return;
    } else {
      setBiographieError(false);
    }
    await onSubmit(formData);
  };

  const [startMonth, setStartMonth] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endYear, setEndYear] = useState('');

  const [editStartMonth, setEditStartMonth] = useState('');
  const [editStartYear, setEditStartYear] = useState('');
  const [editEndMonth, setEditEndMonth] = useState('');
  const [editEndYear, setEditEndYear] = useState('');

  useEffect(() => {
    if (isAddingExperience) {
      setStartMonth(''); setStartYear(''); setEndMonth(''); setEndYear('');
    }
  }, [isAddingExperience]);

  useEffect(() => {
    if (editExperience) {
      const { year: sy, month: sm } = splitYearMonth(editExperience.date_debut);
      setEditStartYear(sy || ''); setEditStartMonth(sm || '');
      const { year: ey, month: em } = splitYearMonth(editExperience.date_fin);
      setEditEndYear(ey || ''); setEditEndMonth(em || '');
    }
  }, [editExperience]);

  // Déclenche l'animation à chaque modification du formulaire
  useEffect(() => {
    if (!etudiant) return; // Ne pas shaker à l'initialisation
    setShakeBtn(true);
    const timeout = setTimeout(() => setShakeBtn(false), 600);
    return () => clearTimeout(timeout);
  }, [formData]);

  // Animation shake
  const shake = keyframes`
    0% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-8px); }
    80% { transform: translateX(8px); }
    100% { transform: translateX(0); }
  `;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Informations personnelles
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
              name="telephone"
              value={formData.telephone ?? profile.telephone ?? ''}
              onChange={handleInputChange}
              sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date de naissance"
              name="date_naissance"
              type="date"
              value={formData.date_naissance || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
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
        <Typography variant="h6" gutterBottom>
          Biographie
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Présentez-vous en quelques lignes (30 caractères minimum)"
          name="biographie"
          value={formData.biographie || ''}
          onChange={handleInputChange}
          error={biographieError}
          helperText={biographieError ? 'La biographie doit contenir au moins 30 caractères.' : ''}
          required
        />
      </Paper>

      <CompetenceInput
        competences={formData.competences || []}
        onCompetencesChange={handleCompetencesChange}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Expériences</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setIsAddingExperience(v => !v)}
            variant={isAddingExperience ? 'outlined' : 'contained'}
          >
            {isAddingExperience ? 'Annuler' : 'Ajouter une expérience'}
          </Button>
        </Box>
        <Collapse in={isAddingExperience}>
          <Box sx={{ p: 2, mb: 2, border: '1px solid #E0E0E0', borderRadius: 2, background: '#FAF7FF' }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Titre du poste"
                value={newExperience.titre || ''}
                onChange={e => setNewExperience(prev => ({ ...prev, titre: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Entreprise"
                value={newExperience.entreprise || ''}
                onChange={e => setNewExperience(prev => ({ ...prev, entreprise: e.target.value }))}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  select
                  label="Mois de début"
                  value={startMonth}
                  onChange={e => setStartMonth(e.target.value)}
                  sx={{ width: 160 }}
                >
                  {MONTHS.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                </TextField>
                <Autocomplete
                  freeSolo
                  options={YEARS.map(String)}
                  value={startYear}
                  onInputChange={(_, value) => setStartYear(value)}
                  onChange={(_, value) => setStartYear(value || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="Année de début" sx={{ width: 120 }} />
                  )}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  select
                  label="Mois de fin"
                  value={isCurrentJob ? '' : endMonth}
                  onChange={e => setEndMonth(e.target.value)}
                  sx={{ width: 160 }}
                  disabled={isCurrentJob}
                >
                  {MONTHS.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                </TextField>
                <Autocomplete
                  freeSolo
                  options={YEARS.map(String)}
                  value={isCurrentJob ? '' : endYear}
                  onInputChange={(_, value) => setEndYear(value)}
                  onChange={(_, value) => setEndYear(value || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="Année de fin" sx={{ width: 120 }} disabled={isCurrentJob} />
                  )}
                  disabled={isCurrentJob}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="checkbox"
                    checked={isCurrentJob}
                    onChange={e => setIsCurrentJob(e.target.checked)}
                    style={{ marginRight: 4 }}
                  />
                  Toujours en poste
                </label>
              </Stack>
              <TextField
                fullWidth
                label="Description"
                value={newExperience.description || ''}
                onChange={e => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={handleCancelAddExperience} variant="outlined">Annuler</Button>
                <Button onClick={handleAddExperience} variant="contained" disabled={!(newExperience.titre && newExperience.entreprise && startYear && startMonth)}>Ajouter</Button>
              </Box>
            </Stack>
          </Box>
        </Collapse>
        {formData.experiences?.map((exp, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              mb: 2,
              border: '1px solid #E0E0E0',
              borderRadius: 2,
              position: 'relative',
              background: editingExperienceIndex === index ? '#F3E8FF' : 'white',
              transition: 'background 0.2s'
            }}
          >
            {editingExperienceIndex === index ? (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Titre du poste"
                  value={editExperience?.titre || ''}
                  onChange={e => handleEditExperienceChange('titre', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Entreprise"
                  value={editExperience?.entreprise || ''}
                  onChange={e => handleEditExperienceChange('entreprise', e.target.value)}
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    label="Mois de début"
                    value={editStartMonth}
                    onChange={e => setEditStartMonth(e.target.value)}
                    sx={{ width: 160 }}
                  >
                    {MONTHS.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                  </TextField>
                  <Autocomplete
                    freeSolo
                    options={YEARS.map(String)}
                    value={editStartYear}
                    onInputChange={(_, value) => setEditStartYear(value)}
                    onChange={(_, value) => setEditStartYear(value || '')}
                    renderInput={(params) => (
                      <TextField {...params} label="Année de début" sx={{ width: 120 }} />
                    )}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    label="Mois de fin"
                    value={editIsCurrentJob ? '' : editEndMonth}
                    onChange={e => setEditEndMonth(e.target.value)}
                    sx={{ width: 160 }}
                    disabled={editIsCurrentJob}
                  >
                    {MONTHS.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                  </TextField>
                  <Autocomplete
                    freeSolo
                    options={YEARS.map(String)}
                    value={editIsCurrentJob ? '' : editEndYear}
                    onInputChange={(_, value) => setEditEndYear(value)}
                    onChange={(_, value) => setEditEndYear(value || '')}
                    renderInput={(params) => (
                      <TextField {...params} label="Année de fin" sx={{ width: 120 }} disabled={editIsCurrentJob} />
                    )}
                    disabled={editIsCurrentJob}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input
                      type="checkbox"
                      checked={editIsCurrentJob}
                      onChange={e => setEditIsCurrentJob(e.target.checked)}
                      style={{ marginRight: 4 }}
                    />
                    Toujours en poste
                  </label>
                </Stack>
                <TextField
                  fullWidth
                  label="Description"
                  value={editExperience?.description || ''}
                  onChange={e => handleEditExperienceChange('description', e.target.value)}
                  multiline
                  rows={3}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button onClick={handleCancelEditExperience} startIcon={<CloseIcon />} variant="outlined">Annuler</Button>
                  <Button onClick={handleSaveEditExperience} startIcon={<SaveIcon />} variant="contained" disabled={!(editExperience?.titre && editExperience?.entreprise && editStartYear && editStartMonth)}>Enregistrer</Button>
                </Box>
              </Stack>
            ) : (
              <>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveExperience(index)}
                  sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleEditExperience(index)}
                  sx={{ position: 'absolute', right: 40, top: 8 }}
                >
                  <EditIcon />
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
              </>
            )}
          </Box>
        ))}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Documents
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FileUpload
              type="cv"
              currentFile={formData.cv_file?.cv}
              onUpload={(file) => handleFileUpload('cv', file)}
              onDelete={() => handleFileDelete('cv')}
              userId={profile.id}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Disponibilité
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button variant="outlined" onClick={() => setIsDisponibiliteDialogOpen(true)}>
            Éditer mes disponibilités
          </Button>
          <Typography variant="body2" color="text.secondary">
            {formData.disponibilite?.disponibilites?.length
              ? formData.disponibilite.disponibilites.map(d => `${d.jour}: ${d.debut}-${d.fin}`).join(', ')
              : 'Aucune disponibilité renseignée'}
          </Typography>
        </Box>
        <DisponibiliteDialog
          open={isDisponibiliteDialogOpen}
          disponibilites={formData.disponibilite?.disponibilites || []}
          onClose={() => setIsDisponibiliteDialogOpen(false)}
          onSave={handleDisponibilitesSave}
        />
      </Paper>

      <LangueInput
        langues={formData.langues || []}
        onLanguesChange={handleLanguesChange}
        error={langueError}
      />

      <Box
        sx={{
          position: 'sticky',
          bottom: 32,
          right: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 100,
          background: 'transparent',
          pointerEvents: 'auto',
        }}
      >
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            bgcolor: '#9333EA',
            '&:hover': { bgcolor: '#7928CA' },
            borderRadius: '24px',
            boxShadow: 3,
            px: 4,
            py: 1.5,
            animation: shakeBtn ? `${shake} 0.6s` : 'none',
          }}
        >
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};

export default StudentProfileForm; 