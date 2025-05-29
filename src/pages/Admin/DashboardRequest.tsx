import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import DashboardBackButton from '../../components/DashboardBackButton';
//import { useTheme as useMuiTheme } from '@mui/material/styles';

const DashboardRequest: React.FC = () => {
  const navigate = useNavigate();
  //const muiTheme = useMuiTheme();
  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <DashboardBackButton />
      
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          Gestion des demandes
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center', alignItems: 'center' }}>
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
      
    </Container>
  );
};

export default DashboardRequest; 