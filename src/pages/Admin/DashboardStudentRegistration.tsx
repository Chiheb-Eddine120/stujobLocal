import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
//import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import Dropzone from 'react-dropzone';
import CompetenceInput from '../../components/CompetenceInput';
import LangueInput from '../../components/LangueInput';
import DisponibiliteDialog from '../../components/DisponibiliteDialog';
import SearchIcon from '@mui/icons-material/Search';
import DashboardBackButton from '../../components/DashboardBackButton';

// Types pour les champs complexes
interface Experience {
  titre: string;
  entreprise: string;
  date_debut: string;
  date_fin?: string;
  description: string;
}

interface Disponibilite {
  jour: string;
  debut: string;
  fin: string;
}

interface CVFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date_naissance: string;
  niveau_etudes: string;
  ecole: string;
  biographie: string;
  competences: any[];
  langues: any[];
  experiences: Experience[];
  disponibilite: { disponibilites: Disponibilite[] };
  cv_file: CVFile | null;
}

const DashboardStudentRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const [formData, setFormData] = useState<FormData>({
    nom: '', prenom: '', email: '', telephone: '', date_naissance: '',
    niveau_etudes: '', ecole: '', biographie: '', competences: [], langues: [],
    experiences: [], disponibilite: { disponibilites: [] }, cv_file: null,
  });

  const [dispoOpen, setDispoOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const path = `${userId}/cv_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('cvs').upload(path, file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage.from('cvs').getPublicUrl(path);
      setFormData(f => ({ ...f, cv_file: { url: data.publicUrl, name: file.name, size: file.size, type: file.type } }));
    }
  };

  const handleCompetencesChange = (newCompetences: any[]) => {
    setFormData(f => ({ ...f, competences: newCompetences }));
  };

  const handleLanguesChange = (newLangues: any[]) => {
    setFormData(f => ({ ...f, langues: newLangues }));
  };

  const handleDisponibilitesSave = (dispos: Disponibilite[]) => {
    setFormData(f => ({ ...f, disponibilite: { disponibilites: dispos } }));
  };

  const handleSearch = async (searchTerm?: string) => {
    try {
      let query = supabase
        .from('all_students')
        .select('*')
        .eq('is_admin_created', true);

      // Si un terme de recherche est fourni, ajouter le filtre email
      if (searchTerm) {
        query = query.ilike('email', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erreur lors de la recherche',
        severity: 'error'
      });
    }
  };

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    setFormData({
      nom: student.nom,
      prenom: student.prenom,
      email: student.email,
      telephone: student.telephone || '',
      date_naissance: student.date_naissance || '',
      niveau_etudes: student.niveau_etudes || '',
      ecole: student.ecole || '',
      biographie: student.biographie || '',
      competences: student.competences || [],
      langues: student.langues || [],
      experiences: student.experiences || [],
      disponibilite: student.disponibilite || { disponibilites: [] },
      cv_file: student.cv_file || null,
    });
    setShowForm(true);
    setSearchOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw authError || new Error("Utilisateur non authentifié");

      const userId = authData.user.id;

      // Vérifier email simple
      if (!formData.email.includes('@')) {
        throw new Error("Email invalide");
      }

      // Vérifier s'il existe déjà un étudiant avec cet email
      const { data: existing, error: fetchError } = await supabase
        .from('all_students')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (existing) {
        setNotification({
          open: true,
          message: "Un étudiant avec cet email existe déjà.",
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('all_students')
        .insert([
          {
            created_by_user_id: userId,
            created_by_role: 'admin',
            role: 'student',
            email: formData.email,
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone,
            date_naissance: formData.date_naissance,
            niveau_etudes: formData.niveau_etudes,
            ecole: formData.ecole,
            biographie: formData.biographie,
            competences: formData.competences,
            langues: formData.langues,
            experiences: formData.experiences,
            disponibilite: formData.disponibilite,
            cv_file: formData.cv_file || null,
            is_admin_created: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (insertError) throw insertError;

      setNotification({
        open: true,
        message: 'Étudiant enregistré avec succès !',
        severity: 'success'
      });

      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        date_naissance: '',
        niveau_etudes: '',
        ecole: '',
        biographie: '',
        competences: [],
        langues: [],
        experiences: [],
        disponibilite: { disponibilites: [] },
        cv_file: null,
      });

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setNotification({
        open: true,
        message: (error as any)?.message || 'Erreur lors de l\'enregistrement.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (!showForm) {
    return (
      <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
        <DashboardBackButton />
        <Typography variant="h5" mb={3}>Gestion des Étudiants</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Nouvel Étudiant
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Encoder un nouvel étudiant dans le système
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    setSelectedStudent(null);
                    setFormData({
                      nom: '', prenom: '', email: '', telephone: '', date_naissance: '',
                      niveau_etudes: '', ecole: '', biographie: '', competences: [], langues: [],
                      experiences: [], disponibilite: { disponibilites: [] }, cv_file: null,
                    });
                    setShowForm(true);
                  }}
                >
                  Créer
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Modifier un Étudiant
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rechercher et modifier un étudiant existant
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setSearchOpen(true);
                    handleSearch();
                  }}
                >
                  Rechercher
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={searchOpen} onClose={() => setSearchOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Rechercher un Étudiant</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <MuiTextField
                fullWidth
                label="Email de l'étudiant"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchEmail);
                  }
                }}
              />
              <Button 
                variant="contained" 
                onClick={() => handleSearch(searchEmail)}
                startIcon={<SearchIcon />}
              >
                Rechercher
              </Button>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              {searchResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Aucun étudiant trouvé
                </Typography>
              ) : (
                searchResults.map((student) => (
                  <Card key={student.id} sx={{ mb: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        {student.prenom} {student.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.email}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        onClick={() => handleSelectStudent(student)}
                      >
                        Modifier
                      </Button>
                    </CardActions>
                  </Card>
                ))
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSearchOpen(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    );
  }

  return (
    <Container component="form" onSubmit={handleSubmit} maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          {selectedStudent ? 'Modifier un Étudiant' : 'Nouvel Étudiant'}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => setShowForm(false)}
        >
          Retour
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField fullWidth label="Nom" name="nom" value={formData.nom} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Date de naissance" name="date_naissance" type="date" InputLabelProps={{ shrink: true }} value={formData.date_naissance} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Niveau d'études" name="niveau_etudes" value={formData.niveau_etudes} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="École" name="ecole" value={formData.ecole} onChange={handleChange} required /></Grid>
          </Grid>

          <Box sx={{ my: 2 }}>
            <Dropzone onDrop={(acceptedFiles: File[]) => handleDrop(acceptedFiles)} multiple={false}>
              {({ getRootProps, getInputProps }: any) => (
                <Box {...getRootProps()} sx={{ p: 2, border: '2px dashed #ccc', textAlign: 'center', cursor: 'pointer' }}>
                  <input {...getInputProps()} />
                  {formData.cv_file ? (
                    <Typography>{formData.cv_file.name}</Typography>
                  ) : (
                    <Typography>Glissez-déposez le CV ou cliquez pour importer</Typography>
                  )}
                </Box>
              )}
            </Dropzone>
          </Box>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Détails avancés</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ my: 2 }}>
                <TextField fullWidth multiline minRows={3} label="Biographie" name="biographie" value={formData.biographie} onChange={handleChange} />
              </Box>
              <Box sx={{ my: 2 }}><CompetenceInput competences={formData.competences} onCompetencesChange={handleCompetencesChange} /></Box>
              <Box sx={{ my: 2 }}><LangueInput langues={formData.langues} onLanguesChange={handleLanguesChange} /></Box>
              <Box sx={{ my: 2 }}>
                <Button variant="outlined" onClick={() => setDispoOpen(true)}>Éditer disponibilités</Button>
                <DisponibiliteDialog open={dispoOpen} disponibilites={formData.disponibilite.disponibilites} onClose={() => setDispoOpen(false)} onSave={handleDisponibilitesSave} />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1">Actions rapides</Typography>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DashboardStudentRegistration;
