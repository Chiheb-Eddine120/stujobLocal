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
        variant={selectedRole === 'etudiant' ? 'outlined' : 'contained'}
        onClick={() => onChange('etudiant')}
        sx={{
          px: 4,
          py: 1.2,
          borderRadius: 2,
          fontWeight: 'bold',
          backgroundColor: selectedRole === 'etudiant' ? '#fff' : '#9333EA',
          color: selectedRole === 'etudiant' ? '#9333EA' : '#fff',
          border: '1.5px solid #9333EA',
          boxShadow: selectedRole === 'etudiant' ? '0 2px 8px rgba(147,51,234,0.08)' : 'none',
          transition: 'background-color 0.3s, color 0.3s',
          '&:hover': {
            backgroundColor: selectedRole === 'etudiant' ? '#f3e8ff' : '#7928CA',
          },
        }}
      >
        Étudiant
      </Button>
      <Button
        className="role-btn"
        variant={selectedRole === 'entreprise' ? 'outlined' : 'contained'}
        onClick={() => onChange('entreprise')}
        sx={{
          px: 4,
          py: 1.2,
          borderRadius: 2,
          fontWeight: 'bold',
          backgroundColor: selectedRole === 'entreprise' ? '#fff' : '#9333EA',
          color: selectedRole === 'entreprise' ? '#9333EA' : '#fff',
          border: '1.5px solid #9333EA',
          boxShadow: selectedRole === 'entreprise' ? '0 2px 8px rgba(147,51,234,0.08)' : 'none',
          transition: 'background-color 0.3s, color 0.3s',
          '&:hover': {
            backgroundColor: selectedRole === 'entreprise' ? '#f3e8ff' : '#7928CA',
          },
        }}
      >
        Entreprise
      </Button>
    </Box>
  );
};

export default RoleSwitchBar; 