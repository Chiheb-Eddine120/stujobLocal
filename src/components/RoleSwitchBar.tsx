import React from 'react';
import { Box, Button } from '@mui/material';

interface RoleSwitchBarProps {
  selectedRole: 'etudiant' | 'entreprise';
  onChange: (role: 'etudiant' | 'entreprise') => void;
}

const RoleSwitchBar: React.FC<RoleSwitchBarProps> = ({ selectedRole, onChange }) => {
  return (
    <Box
      className="role-switch"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        mt: 1.5,
        mb: 2,
      }}
    >
      <Button
        className="role-btn"
        variant={selectedRole === 'etudiant' ? 'contained' : 'outlined'}
        onClick={() => onChange('etudiant')}
        sx={{
          px: 4,
          py: 1.2,
          borderRadius: 2,
          fontWeight: 'bold',
          backgroundColor: selectedRole === 'etudiant' ? '#9333EA' : '#f0f0f0',
          color: selectedRole === 'etudiant' ? 'white' : '#9333EA',
          border: selectedRole === 'etudiant' ? 'none' : '1px solid #9333EA',
          boxShadow: selectedRole === 'etudiant' ? '0 2px 8px rgba(147,51,234,0.08)' : 'none',
          transition: 'background-color 0.3s, color 0.3s',
          '&:hover': {
            backgroundColor: selectedRole === 'etudiant' ? '#7928CA' : '#e0e0e0',
          },
        }}
      >
        Étudiant
      </Button>
      <Button
        className="role-btn"
        variant={selectedRole === 'entreprise' ? 'contained' : 'outlined'}
        onClick={() => onChange('entreprise')}
        sx={{
          px: 4,
          py: 1.2,
          borderRadius: 2,
          fontWeight: 'bold',
          backgroundColor: selectedRole === 'entreprise' ? '#9333EA' : '#f0f0f0',
          color: selectedRole === 'entreprise' ? 'white' : '#9333EA',
          border: selectedRole === 'entreprise' ? 'none' : '1px solid #9333EA',
          boxShadow: selectedRole === 'entreprise' ? '0 2px 8px rgba(147,51,234,0.08)' : 'none',
          transition: 'background-color 0.3s, color 0.3s',
          '&:hover': {
            backgroundColor: selectedRole === 'entreprise' ? '#7928CA' : '#e0e0e0',
          },
        }}
      >
        Entreprise
      </Button>
    </Box>
  );
};

export default RoleSwitchBar; 