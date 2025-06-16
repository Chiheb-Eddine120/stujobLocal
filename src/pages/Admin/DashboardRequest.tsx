import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardBackButton from '../../components/DashboardBackButton';
import { demandeService } from '../../services/demandeService';
import { Demande } from '../../types';
import DemandeForm from './DemandeForm';

const DashboardRequest: React.FC = () => {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [demandeToEdit, setDemandeToEdit] = useState<Demande | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [demandeToDelete, setDemandeToDelete] = useState<Demande | null>(null);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(5);

  useEffect(() => {
    const fetchDemandes = async () => {
      setLoading(true);
      try {
        const data = await demandeService.getAllDemandes();
        setDemandes(data);
      } catch (err) {
        setError('Erreur lors du chargement des demandes');
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
  }, []);

  const handleVoir = (demande: Demande) => {
    setSelectedDemande(demande);
    setDialogOpen(true);
  };
  const handleFermerDialog = () => {
    setDialogOpen(false);
    setSelectedDemande(null);
  };

  const handleEdit = (demande: Demande) => {
    setDemandeToEdit(demande);
    setEditDialogOpen(true);
  };
  const handleEditClose = () => {
    setEditDialogOpen(false);
    setDemandeToEdit(null);
  };
  const handleEditSave = async (updated: Partial<Demande>) => {
    if (!demandeToEdit) return;
    await demandeService.updateDemande(demandeToEdit.id, updated);
    setEditDialogOpen(false);
    setDemandeToEdit(null);
    // Rafraîchir la liste
    const data = await demandeService.getAllDemandes();
    setDemandes(data);
  };

  const handleDelete = (demande: Demande) => {
    setDemandeToDelete(demande);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    setDeleteCountdown(5);
    setConfirmDeleteDialogOpen(true);
    // Lancer le compte à rebours
    let count = 5;
    const interval = setInterval(() => {
      count--;
      setDeleteCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDemandeToDelete(null);
  };

  const handleFinalDelete = async () => {
    if (!demandeToDelete) return;
    await demandeService.deleteDemande(demandeToDelete.id);
    setConfirmDeleteDialogOpen(false);
    setDemandeToDelete(null);
    // Rafraîchir la liste
    const data = await demandeService.getAllDemandes();
    setDemandes(data);
  };
  const handleFinalDeleteCancel = () => {
    setConfirmDeleteDialogOpen(false);
    setDemandeToDelete(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <DashboardBackButton />
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Gestion des demandes
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center', alignItems: 'center', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AssignmentIcon />}
          sx={{ px: 4, py: 2, fontSize: 18, borderRadius: 3 }}
          onClick={() => navigate('/demande')}
        >
          Introduire une demande
        </Button>
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          sx={{ px: 4, py: 2, fontSize: 18, borderRadius: 3 }}
          onClick={() => navigate('/suivi')}
        >
          Suivre une demande
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Entreprise</TableCell>
                <TableCell>Secteur</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {demandes.map((demande) => (
                <TableRow key={demande.id}>
                  <TableCell>{demande.code_demande}</TableCell>
                  <TableCell>{demande.entreprise}</TableCell>
                  <TableCell>{demande.secteur}</TableCell>
                  <TableCell>{demande.email}</TableCell>
                  <TableCell>{demande.status}</TableCell>
                  <TableCell>{new Date(demande.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Tooltip title="Voir la demande" arrow>
                      <IconButton onClick={() => handleVoir(demande)} color="info">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier" arrow>
                      <IconButton color="primary" onClick={() => handleEdit(demande)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer" arrow>
                      <IconButton color="error" onClick={() => handleDelete(demande)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Dialog de détails */}
      <Dialog open={dialogOpen} onClose={handleFermerDialog} maxWidth="md" fullWidth>
        <DialogTitle>Détails de la demande</DialogTitle>
        <DialogContent dividers>
          {selectedDemande && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography><b>Numéro de suivi :</b> {selectedDemande.code_demande}</Typography>
              <Typography><b>Entreprise :</b> {selectedDemande.entreprise}</Typography>
              {selectedDemande.personne_contact && (
                <Typography><b>Personne de contact :</b> {selectedDemande.personne_contact}</Typography>
              )}
              <Typography><b>Email :</b> {selectedDemande.email}</Typography>
              {selectedDemande.telephone && (
                <Typography><b>Téléphone :</b> {selectedDemande.telephone}</Typography>
              )}
              <Typography><b>Secteur :</b> {selectedDemande.secteur}</Typography>
              <Typography><b>Statut :</b> {selectedDemande.status === 'en_attente' ? 'En Attente' : selectedDemande.status}</Typography>
              <Typography><b>Date :</b> {new Date(selectedDemande.created_at).toLocaleString()}</Typography>
              <Typography><b>Adresse :</b> {selectedDemande.adresse}</Typography>
              <Typography><b>Ville :</b> {selectedDemande.ville}</Typography>
              <Typography><b>Nombre de personnes :</b> {selectedDemande.nombre_personnes}</Typography>
              <Typography><b>Deadline :</b> {selectedDemande.delai_recrutement}</Typography>
              <Typography><b>Description :</b> {selectedDemande.description_demande}</Typography>
              <Typography><b>Remarques :</b> {selectedDemande.remarques}</Typography>
              <Typography><b>Compétences suggérées :</b> {selectedDemande.suggestions_competences.map(c => `${c.competence} (${c.priorite})`).join(', ')}</Typography>
              <Typography><b>Compétences personnalisées :</b> {selectedDemande.competences_personnalisees.map(c => `${c.competence} (${c.priorite})`).join(', ')}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFermerDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog édition */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Modifier la demande</DialogTitle>
        <DialogContent dividers>
          {demandeToEdit && (
            <DemandeForm
              initialValues={demandeToEdit}
              isEdit
              onSubmit={handleEditSave}
              onCancel={handleEditClose}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* Dialog suppression */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer cette demande ?
          {demandeToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <b>Numéro de suivi :</b> {demandeToDelete.code_demande}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Entreprise :</b> {demandeToDelete.entreprise}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} sx={{ color: '#9333EA', fontWeight: 600 }}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog suppression définitive */}
      <Dialog open={confirmDeleteDialogOpen} onClose={handleFinalDeleteCancel}>
        <DialogTitle>Suppression définitive</DialogTitle>
        <DialogContent>
          <Typography color="error" fontWeight={600} mb={2}>
            Attention : Cette action est irréversible !
          </Typography>
          <Typography>
            La suppression de cette demande est <b>définitive</b> et il n'y aura <b>aucun retour en arrière possible</b>.<br/>
            Êtes-vous sûr de vouloir continuer ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFinalDeleteCancel} sx={{ color: '#9333EA', fontWeight: 600 }}>Annuler</Button>
          <Button
            onClick={handleFinalDelete}
            color="error"
            disabled={deleteCountdown > 0}
            sx={{ fontWeight: 700 }}
          >
            {deleteCountdown > 0 ? `Supprimer définitivement (${deleteCountdown})` : 'Supprimer définitivement'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DashboardRequest; 