import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Chip,
  Box,
  Typography,
  Paper,
  IconButton,
  MenuItem,
  Collapse,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Competence } from '../types';
import competencesData from '../data/competences.json';

interface CompetenceInputProps {
  competences: Competence[];
  onCompetencesChange: (competences: Competence[]) => void;
}

const CompetenceInput: React.FC<CompetenceInputProps> = ({
  competences,
  onCompetencesChange,
}) => {
  const [suggestions, setSuggestions] = useState<Competence[]>([]);
  const [newCompetence, setNewCompetence] = useState<Competence>({
    nom: '',
    priorite: 'Important',
    niveau: 'Débutant',
    description: '',
  });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    const mappedSuggestions = competencesData.competences.map(comp => ({
      nom: comp.label,
      priorite: 'Important' as const,
      niveau: 'Débutant' as const,
      description: comp.description || ''
    }));
    setSuggestions(mappedSuggestions);
  }, []);

  const handleAddCompetence = () => {
    if (newCompetence.nom.trim() && (newCompetence.description || '').trim()) {
      onCompetencesChange([...competences, newCompetence]);
      setNewCompetence({ nom: '', priorite: 'Important', niveau: 'Débutant', description: '' });
      setIsAddingNew(false);
    }
  };

  const handleRemoveCompetence = (index: number) => {
    const newCompetences = [...competences];
    newCompetences.splice(index, 1);
    onCompetencesChange(newCompetences);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const handleUpdateCompetence = (index: number, updatedCompetence: Competence) => {
    const newCompetences = [...competences];
    newCompetences[index] = updatedCompetence;
    onCompetencesChange(newCompetences);
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Compétences
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        {competences.map((competence, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`${competence.nom || 'Compétence'} - ${competence.niveau || ''}`}
                onDelete={() => handleRemoveCompetence(index)}
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                sx={{ 
                  cursor: 'pointer',
                  border: competence.description ? '1px solid #4CAF50' : '1px solid transparent'
                }}
              />
              <IconButton
                size="small"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                {expandedIndex === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={expandedIndex === index}>
              <Box sx={{ mt: 1, ml: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description de votre expérience"
                  value={competence.description || ''}
                  onChange={(e) => handleUpdateCompetence(index, {
                    ...competence,
                    description: e.target.value
                  })}
                  helperText="Décrivez votre expérience avec cette compétence"
                />
              </Box>
            </Collapse>
          </Box>
        ))}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Autocomplete
            freeSolo
            options={suggestions}
            getOptionLabel={(option) => 
              typeof option === 'string' ? option : option.nom
            }
            value={newCompetence.nom}
            onChange={(_, newValue) => {
              if (typeof newValue === 'string') {
                setNewCompetence(prev => ({ ...prev, nom: newValue }));
              } else if (newValue) {
                setNewCompetence(prev => ({ ...prev, nom: newValue.nom }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nouvelle compétence"
                variant="outlined"
                fullWidth
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setIsAddingNew(true);
                  }
                }}
              />
            )}
            sx={{ flex: 1 }}
          />

          <TextField
            select
            label="Niveau"
            value={newCompetence.niveau}
            onChange={(e) => setNewCompetence(prev => ({ 
              ...prev, 
              niveau: e.target.value as 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert' 
            }))}
            sx={{ width: 200 }}
          >
            {['Débutant', 'Intermédiaire', 'Avancé', 'Expert'].map((niveau) => (
              <MenuItem key={niveau} value={niveau}>
                {niveau}
              </MenuItem>
            ))}
          </TextField>

          <IconButton
            color="primary"
            onClick={() => setIsAddingNew(!isAddingNew)}
            disabled={!newCompetence.nom.trim()}
          >
            {isAddingNew ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={isAddingNew}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description de votre expérience"
              value={newCompetence.description}
              onChange={(e) => setNewCompetence(prev => ({
                ...prev,
                description: e.target.value
              }))}
              helperText="Décrivez votre expérience avec cette compétence"
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsAddingNew(false);
                  setNewCompetence(prev => ({ ...prev, description: '' }));
                }}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                onClick={handleAddCompetence}
                disabled={!newCompetence.description?.trim()}
              >
                Ajouter
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default CompetenceInput; 