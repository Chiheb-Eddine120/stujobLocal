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
  //Autocomplete,
  Tooltip,
} from '@mui/material';
import { demandeService } from '../../services/demandeService';
import { Demande, Secteur } from '../../types';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
//import AddIcon from '@mui/icons-material/Add';
import competencesData from '../../data/competences.json';
import citiesData from '../../data/restructured_cities1.json';
import CityAutocomplete from '../../components/CityAutocomplete';

const sectors: Secteur[] = [
  'Restauration',
  'Vente',
  'Logistique',
  'IT',
  'Autre',
];

const DemandeForm: React.FC = () => {
  const [formData, setFormData] = useState<Omit<Demande, 'id' | 'created_at'>>({
    entreprise: '',
    numero_entreprise: '',
    adresse: '',
    secteur: 'Autre' as Secteur,
    email: '',
    delai_recrutement: '',
    duree_mission: '',
    nombre_personnes: 1,
    remarques: '',
    status: 'en_attente',
    description_demande: '',
    suggestions_competences: [],
    competences_personnalisees: [],
    telephone: '',
    ville: '',
    code_demande: '',
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showLegalDialog, setShowLegalDialog] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [newCustomCompetence, setNewCustomCompetence] = useState({
    competence: '',
    priorite: 'Flexible' as 'Obligatoire' | 'Flexible' | 'Optionnel'
  });

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrioriteChange = (index: number, priorite: 'Obligatoire' | 'Flexible' | 'Optionnel') => {
    setFormData((prev) => ({
      ...prev,
      suggestions_competences: prev.suggestions_competences.map((comp, i) => 
        i === index ? { ...comp, priorite } : comp
      ),
    }));
  };

  const handleSecteurChange = (event: SelectChangeEvent<Secteur>) => {
    setFormData(prev => ({
      ...prev,
      secteur: event.target.value as Secteur
    }));
  };

  const handleSelectPredefinedCompetence = (competence: string) => {
    if (!formData.suggestions_competences.some(comp => comp.competence === competence)) {
      setFormData((prev) => ({
        ...prev,
        suggestions_competences: [...prev.suggestions_competences, {
          competence,
          priorite: 'Flexible'
        }],
      }));
    }
  };

  const handleRemoveCompetence = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      suggestions_competences: prev.suggestions_competences.filter((_, i) => i !== index),
    }));
  };

  const handleAddCustomCompetence = () => {
    if (newCustomCompetence.competence.trim()) {
      setFormData((prev) => ({
        ...prev,
        competences_personnalisees: [...prev.competences_personnalisees, newCustomCompetence]
      }));
      setNewCustomCompetence({
        competence: '',
        priorite: 'Flexible'
      });
    }
  };

  const handleRemoveCustomCompetence = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      competences_personnalisees: prev.competences_personnalisees.filter((_, i) => i !== index)
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
      setTrackingNumber(result.code_demande);
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
        Introduire une demande de recrutement
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
          <Grid item xs={12}>
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

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Numéro d'entreprise / TVA"
              name="numero_entreprise"
              value={formData.numero_entreprise}
              onChange={handleTextChange}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CityAutocomplete
              citiesData={citiesData}
              formData={formData}
              setFormData={setFormData}
              inputStyles={inputStyles}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Adresse complète"
              name="adresse"
              value={formData.adresse}
              onChange={handleTextChange}
              sx={inputStyles}
              placeholder="Rue, numéro, boîte"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
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
              type="number"
              label="Nombre de personnes à recruter"
              name="nombre_personnes"
              value={formData.nombre_personnes}
              onChange={handleTextChange}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Téléphone (optionnel)"
              name="telephone"
              value={formData.telephone}
              onChange={handleTextChange}
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1F1F1F', fontWeight: 600 }}>
              Suggestions de compétences
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {competencesData.competences.map((comp) => (
                  <Tooltip 
                    key={comp.label} 
                    title={comp.description}
                    arrow
                    placement="top"
                  >
                    <Chip
                      label={comp.label}
                      onClick={() => handleSelectPredefinedCompetence(comp.label)}
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
                  </Tooltip>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.suggestions_competences.map((comp, index) => {
                  const competenceInfo = competencesData.competences.find(c => c.label === comp.competence);
                  return (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip 
                        title={competenceInfo?.description}
                        arrow
                        placement="top"
                      >
                        <Chip
                          label={comp.competence}
                          onDelete={() => handleRemoveCompetence(index)}
                          sx={{
                            borderRadius: '20px',
                            bgcolor: '#FDF8FF',
                            color: '#9333EA',
                            border: '1px solid #9333EA',
                          }}
                        />
                      </Tooltip>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={comp.priorite}
                          onChange={(e) => handlePrioriteChange(index, e.target.value as 'Obligatoire' | 'Flexible' | 'Optionnel')}
                          sx={{
                            borderRadius: '12px',
                            bgcolor: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#9333EA',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#9333EA',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#9333EA',
                            },
                          }}
                        >
                          <MenuItem value="Obligatoire">Obligatoire</MenuItem>
                          <MenuItem value="Flexible">Flexible</MenuItem>
                          <MenuItem value="Optionnel">Optionnel</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1F1F1F', fontWeight: 600 }}>
              Vous n'avez pas trouvé la compétence que vous cherchez ?
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Nouvelle compétence personnalisée"
                  value={newCustomCompetence.competence}
                  onChange={(e) => setNewCustomCompetence(prev => ({ ...prev, competence: e.target.value }))}
                  sx={inputStyles}
                />
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Priorité</InputLabel>
                  <Select
                    value={newCustomCompetence.priorite}
                    onChange={(e) => setNewCustomCompetence(prev => ({ 
                      ...prev, 
                      priorite: e.target.value as 'Obligatoire' | 'Flexible' | 'Optionnel' 
                    }))}
                    label="Priorité"
                    sx={selectStyles}
                  >
                    <MenuItem value="Obligatoire">Obligatoire</MenuItem>
                    <MenuItem value="Flexible">Flexible</MenuItem>
                    <MenuItem value="Optionnel">Optionnel</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleAddCustomCompetence}
                  disabled={!newCustomCompetence.competence.trim()}
                  sx={{
                    background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
                    borderRadius: '12px',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #7928CA 0%, #E6447E 100%)',
                    }
                  }}
                >
                  Ajouter
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.competences_personnalisees.map((comp, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={comp.competence}
                      onDelete={() => handleRemoveCustomCompetence(index)}
                      sx={{
                        borderRadius: '20px',
                        bgcolor: '#FDF8FF',
                        color: '#9333EA',
                        border: '1px solid #9333EA',
                      }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={comp.priorite}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            competences_personnalisees: prev.competences_personnalisees.map((c, i) => 
                              i === index ? { ...c, priorite: e.target.value as 'Obligatoire' | 'Flexible' | 'Optionnel' } : c
                            )
                          }));
                        }}
                        sx={{
                          borderRadius: '12px',
                          bgcolor: 'white',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#9333EA',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#9333EA',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#9333EA',
                          },
                        }}
                      >
                        <MenuItem value="Obligatoire">Obligatoire</MenuItem>
                        <MenuItem value="Flexible">Flexible</MenuItem>
                        <MenuItem value="Optionnel">Optionnel</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description de la demande"
              name="description_demande"
              value={formData.description_demande}
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