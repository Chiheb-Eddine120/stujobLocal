import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const stats: StatItem[] = [
  {
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    value: '1000+',
    label: 'Étudiants inscrits',
  },
  {
    icon: <BusinessIcon sx={{ fontSize: 40 }} />,
    value: '500+',
    label: 'Entreprises partenaires',
  },
  {
    icon: <WorkIcon sx={{ fontSize: 40 }} />,
    value: '2000+',
    label: 'Missions réalisées',
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
    value: '95%',
    label: 'Taux de satisfaction',
  },
];

const Stats: React.FC = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: 'primary.main', color: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  color: 'white',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    color: 'primary.light',
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Stats; 