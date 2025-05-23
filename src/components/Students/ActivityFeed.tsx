import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const ActivityFeed: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, background: '#FDF8FF', border: '1px solid #F3E8FF', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Alertes récentes
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Aucune alerte récente"
            sx={{ textAlign: 'center', color: 'text.secondary' }}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default ActivityFeed; 