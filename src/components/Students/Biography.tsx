import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkIcon from '@mui/icons-material/Work';
import BarChartIcon from '@mui/icons-material/BarChart';

interface BiographyProps {
  biographie?: string;
}

const Biography: React.FC<BiographyProps> = ({ biographie }) => {
  if (!biographie) return null;

  // Diviser la biographie en paragraphes
  const paragraphs = biographie.split('\n').filter(p => p.trim());

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        background: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        mb: 2 
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Biographie
      </Typography>
      <Box 
        component="ul" 
        sx={{ 
          m: 0, 
          p: 0, 
          listStyle: 'none',
          '& li': {
            display: 'flex',
            alignItems: 'flex-start',
            mb: 2,
            fontSize: '15px',
            lineHeight: 1.6,
            fontFamily: '"Inter", sans-serif',
          },
          '& li:last-child': {
            mb: 0
          }
        }}
      >
        {paragraphs.map((paragraph, index) => (
          <Box 
            component="li" 
            key={index}
            sx={{
              '&::before': {
                content: '""',
                display: 'inline-block',
                width: '24px',
                height: '24px',
                mr: 1,
                flexShrink: 0,
                backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                  index === 0 
                    ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#673ab7"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
                    : index === 1
                    ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#673ab7"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>'
                    : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#673ab7"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>'
                )}")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }
            }}
          >
            {paragraph}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default Biography; 