import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Demande } from '../types';

interface City {
  post_code: number;
  municipality: {
    french: string | null;
    dutch: string | null;
    german: string | null;
  };
  sub_municipality: {
    french: string | null;
    dutch: string | null;
    german: string | null;
  };
  region: {
    french: string | null;
    dutch: string | null;
    german: string | null;
  };
  province: {
    french: string | null;
    dutch: string | null;
    german: string | null;
  };
}

interface Props {
  citiesData: City[];
  formData: Omit<Demande, 'id' | 'created_at'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Demande, 'id' | 'created_at'>>>;
  inputStyles: any;
  required?: boolean;
}

const CityAutocomplete: React.FC<Props> = ({ citiesData, formData, setFormData, inputStyles, required }) => {
  // Éviter les doublons en utilisant la clé unique (ville + code postal)
  const uniqueCities = Array.from(
    new Map(
      citiesData.map((city) => {
        const ville = city.municipality.french || city.municipality.dutch || '';
        const label = `${ville} (${city.post_code})`;
        return [label, city]; // Utilise la string comme clé unique
      })
    ).values()
  );

  return (
    <Autocomplete
      freeSolo
      options={uniqueCities}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return `${option.municipality.french || option.municipality.dutch || ''} (${option.post_code})`;
      }}
      isOptionEqualToValue={(option, value) => {
        if (typeof option === 'string' || typeof value === 'string') return option === value;
        return (
          option.post_code === value.post_code &&
          (option.municipality.french || option.municipality.dutch) ===
            (value.municipality.french || value.municipality.dutch)
        );
      }}
      value={formData.ville || ''}
      onInputChange={(_, value) => setFormData((prev: any) => ({ ...prev, ville: value }))}
      filterOptions={(options, { inputValue }) => {
        const searchValue = inputValue.toLowerCase().trim();
        if (!searchValue) return options;

        return options.filter(option => {
          const label = typeof option === 'string' 
            ? option 
            : `${option.municipality.french || option.municipality.dutch || ''} (${option.post_code})`;
          return label.toLowerCase().includes(searchValue);
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label="Ville"
          name="ville"
          required={required}
          aria-label="Champ de sélection de ville"
          sx={inputStyles}
        />
      )}
    />
  );
};

export default CityAutocomplete; 