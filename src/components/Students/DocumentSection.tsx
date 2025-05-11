import React from 'react';
import { Paper, Typography, Box, Link } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

interface CVFile {
  url: string;
}

interface DocumentSectionProps {
  cv?: CVFile;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({ cv }) => {
  if (!cv) return null;
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, background: '#FDF8FF', border: '1px solid #F3E8FF', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Documents
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Link
          href={cv.url}
          target="_blank"
          sx={{ display: 'flex', alignItems: 'center', color: '#9333EA', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          <DescriptionIcon sx={{ mr: 1 }} />
          Voir CV
        </Link>
      </Box>
    </Paper>
  );
};

export default DocumentSection; 