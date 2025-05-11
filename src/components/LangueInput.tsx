import React, { useState } from 'react';
import { Autocomplete, TextField, Box, MenuItem, Chip, Typography, Paper, IconButton } from '@mui/material';
import { Langue } from '../types/etudiant';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const LANGUES_SUGGESTIONS = [
  'Français',
  'Anglais',
  'Néerlandais',
  'Allemand',
  'Arabe',
  'Chinois',
  'Espagnol',
  'Italien', 
  'Japonais',
  'Portugais',
  'Russe',
];

const NIVEAUX = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

interface LangueInputProps {
  langues: Langue[];
  onLanguesChange: (langues: Langue[]) => void;
  error?: boolean;
}

const LangueInput: React.FC<LangueInputProps> = ({ langues, onLanguesChange, error }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedLangue, setSelectedLangue] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState<number>(0);

  const handleAddLangue = () => {
    if (selectedLangue && !langues.some(l => l.nom === selectedLangue)) {
      onLanguesChange([
        ...langues,
        { nom: selectedLangue, niveau: selectedNiveau }
      ]);
      setSelectedLangue('');
      setSelectedNiveau(0);
      setInputValue('');
    }
  };

  const handleRemoveLangue = (index: number) => {
    const newLangues = [...langues];
    newLangues.splice(index, 1);
    onLanguesChange(newLangues);
  };

  const handleStarClick = (star: number) => {
    setSelectedNiveau(star);
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Langues parlées
      </Typography>
      <Box sx={{ mb: 2 }}>
        {langues.map((langue, idx) => (
          <Chip
            key={langue.nom}
            label={`${langue.nom} - ${langue.niveau} étoile${langue.niveau > 1 ? 's' : ''}`}
            onDelete={() => handleRemoveLangue(idx)}
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Autocomplete
          freeSolo
          options={LANGUES_SUGGESTIONS}
          value={selectedLangue}
          inputValue={inputValue}
          onInputChange={(_, value) => setInputValue(value)}
          onChange={(_, value) => setSelectedLangue(typeof value === 'string' ? value : value || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Nouvelle langue"
              variant="outlined"
              error={error && langues.length === 0}
              helperText={error && langues.length === 0 ? 'Veuillez ajouter au moins une langue' : ''}
            />
          )}
          sx={{ flex: 1 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {[1,2,3,4,5].map((star) => (
            <IconButton
              key={star}
              onClick={() => handleStarClick(star)}
              color={star <= selectedNiveau ? 'warning' : 'default'}
              size="small"
            >
              {star <= selectedNiveau ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          ))}
        </Box>
        <button
          type="button"
          onClick={handleAddLangue}
          disabled={!selectedLangue}
          style={{
            background: 'linear-gradient(90deg, #9333EA 0%, #E355A3 50%, #FF8366 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontWeight: 600,
            cursor: selectedLangue ? 'pointer' : 'not-allowed',
            marginLeft: 8
          }}
        >
          Ajouter
        </button>
      </Box>
    </Paper>
  );
};

export default LangueInput; 