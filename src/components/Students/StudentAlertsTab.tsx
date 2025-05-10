import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  NotificationsActive as NotificationsActiveIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Star as StarIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'job' | 'school' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface StudentAlertsTabProps {
  notifications: Notification[];
  onNotificationRead: (id: string) => void;
  onNotificationDelete: (id: string) => void;
}

const StudentAlertsTab: React.FC<StudentAlertsTabProps> = ({
  notifications,
  onNotificationRead,
  onNotificationDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = React.useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = () => {
    if (selectedNotification) {
      onNotificationRead(selectedNotification);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedNotification) {
      onNotificationDelete(selectedNotification);
    }
    handleMenuClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <WorkIcon sx={{ color: '#9333EA' }} />;
      case 'school':
        return <SchoolIcon sx={{ color: '#9333EA' }} />;
      default:
        return <StarIcon sx={{ color: '#9333EA' }} />;
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: '#FDF8FF',
          border: '1px solid #F3E8FF',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <NotificationsActiveIcon sx={{ color: '#9333EA', mr: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
        </Box>

        <List>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="Aucune notification"
                secondary="Vous n'avez pas encore de notifications"
                sx={{ textAlign: 'center', color: 'text.secondary' }}
              />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'rgba(147, 51, 234, 0.04)',
                    borderRadius: 2,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {notification.message}
                        </Typography>
                        <br />
                        <Typography component="span" variant="caption" color="text.secondary">
                          {new Date(notification.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </>
                    }
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {!notification.read && (
                      <Chip
                        label="Nouveau"
                        size="small"
                        sx={{
                          backgroundColor: '#9333EA',
                          color: 'white',
                          mr: 1,
                        }}
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, notification.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem onClick={handleMarkAsRead}>
          Marquer comme lu
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Supprimer
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default StudentAlertsTab; 