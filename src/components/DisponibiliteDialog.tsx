import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Disponibilite } from '../types/etudiant';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

interface DisponibiliteDialogProps {
  open: boolean;
  disponibilites: Disponibilite[];
  onClose: () => void;
  onSave: (disponibilites: Disponibilite[]) => void;
}

const DisponibiliteDialog: React.FC<DisponibiliteDialogProps> = ({ open, disponibilites, onClose, onSave }) => {
  const [localDispos, setLocalDispos] = useState<Disponibilite[]>(disponibilites);

  const handleAddCreneau = (jour: string) => {
    setLocalDispos(prev => ([
      ...prev,
      { jour, debut: '', fin: '' }
    ]));
  };

  const handleChangeCreneau = (index: number, field: 'debut' | 'fin', value: string) => {
    setLocalDispos(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d));
  };

  const handleRemoveCreneau = (index: number) => {
    setLocalDispos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Filtrer les créneaux vides
    onSave(localDispos.filter(d => d.jour && d.debut && d.fin));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mes disponibilités</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Sélectionnez vos créneaux de disponibilité pour chaque jour de la semaine.
        </Typography>
        {JOURS.map(jour => (
          <Box key={jour} sx={{ mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ flex: 1 }}>{jour}</Typography>
              <IconButton size="small" onClick={() => handleAddCreneau(jour)}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            {localDispos.map((d, idx) => d.jour === jour && (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TextField
                  type="time"
                  label="Début"
                  value={d.debut}
                  onChange={e => handleChangeCreneau(idx, 'debut', e.target.value)}
                  size="small"
                  sx={{ width: 120 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="time"
                  label="Fin"
                  value={d.fin}
                  onChange={e => handleChangeCreneau(idx, 'fin', e.target.value)}
                  size="small"
                  sx={{ width: 120 }}
                  InputLabelProps={{ shrink: true }}
                />
                <IconButton size="small" onClick={() => handleRemoveCreneau(idx)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSave} variant="contained">Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisponibiliteDialog; 