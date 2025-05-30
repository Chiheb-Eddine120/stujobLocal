import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  //IconButton,
} from '@mui/material';
//import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Disponibilite } from '../types';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const PERIODES = [
  { id: 'matin', label: 'Matin' },
  { id: 'apres_midi', label: 'Après-midi' },
  { id: 'soir', label: 'Soir' },
  { id: 'journee', label: 'Journée complète' }
];

interface DisponibiliteDialogProps {
  open: boolean;
  disponibilites: Disponibilite[];
  onClose: () => void;
  onSave: (disponibilites: Disponibilite[]) => void;
}

const DisponibiliteDialog: React.FC<DisponibiliteDialogProps> = ({ open, disponibilites, onClose, onSave }) => {
  const [localDispos, setLocalDispos] = useState<Disponibilite[]>(disponibilites);

  const handlePeriodChange = (jour: string, periode: string, checked: boolean) => {
    setLocalDispos(prev => {
      // Si on coche "Journée complète", on décoche les autres périodes et on coche celle-ci
      if (periode === 'journee' && checked) {
        return prev.filter(d => d.jour !== jour)
          .concat({ jour, debut: 'journee', fin: 'journee' });
      }
      // Si on coche une autre période alors que "Journée complète" est cochée, on la décoche
      if (periode !== 'journee' && checked) {
        const filtered = prev.filter(d => d.jour !== jour || d.debut !== 'journee');
        return [...filtered, { jour, debut: periode, fin: periode }];
      }
      // Si on décoche une période
      if (!checked) {
        return prev.filter(d => !(d.jour === jour && d.debut === periode));
      }
      return prev;
    });
  };

  const isPeriodChecked = (jour: string, periode: string) => {
    return localDispos.some(d => d.jour === jour && d.debut === periode);
  };

  const handleSave = () => {
    onSave(localDispos);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mes disponibilités</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Sélectionnez vos périodes de disponibilité pour chaque jour de la semaine.
        </Typography>
        {JOURS.map(jour => (
          <Box key={jour} sx={{ mb: 3, borderBottom: '1px solid #eee', pb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>{jour}</Typography>
            <FormGroup>
              {PERIODES.map(periode => (
                <FormControlLabel
                  key={periode.id}
                  control={
                    <Checkbox
                      checked={isPeriodChecked(jour, periode.id)}
                      onChange={(e) => handlePeriodChange(jour, periode.id, e.target.checked)}
                    />
                  }
                  label={periode.label}
                />
              ))}
            </FormGroup>
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