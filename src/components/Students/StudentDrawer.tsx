import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Drawer,
  IconButton,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { Profile, Etudiant } from '../../types';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import ConfirmLogoutDialog from './ConfirmLogoutDialog';
import { supabase } from '../../services/supabase';
import { profileService } from '../../services/profileService';

interface StudentDrawerProps {
  profile: Profile;
  etudiant: Etudiant;
  onLogout: () => Promise<void>;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  variant?: 'permanent' | 'temporary';
  onProfileUpdate?: (profile: Profile) => void;
}

const StudentDrawer: React.FC<StudentDrawerProps> = ({
  profile,
  etudiant,
  onLogout,
  mobileOpen,
  onMobileClose,
  variant = 'permanent',
  onProfileUpdate
}) => {
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload l'image vers Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (error) throw error;

      // Récupère l'URL publique de l'image
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Met à jour le profil avec la nouvelle URL d'avatar
      const updatedProfile = await profileService.updateProfile(profile.id, {
        avatar_url: publicUrl
      });

      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'avatar:', error);
    }
  };

  const drawerContent = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={profile.avatar_url}
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              border: '4px solid #9333EA',
              fontSize: 36,
              bgcolor: '#F3F4F6',
              color: '#9333EA',
              cursor: 'pointer',
            }}
            onClick={handleAvatarClick}
          >
            {profile.prenom[0]}{profile.nom[0]}
          </Avatar>
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              bgcolor: '#9333EA',
              color: 'white',
              '&:hover': {
                bgcolor: '#7928CA',
              },
            }}
            onClick={handleAvatarClick}
          >
            <PhotoCameraIcon />
          </IconButton>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, textTransform: 'capitalize', mb: 0.5 }}>
          {profile.prenom} {profile.nom}
        </Typography>
        {/* Email */}
        <Box sx={{ width: '100%', px: 2, py: 1, borderRadius: 2, background: '#F9FAFB', mb: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <MailOutlineIcon fontSize="small" sx={{ color: '#9333EA', mt: '2px' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Email :
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
              {profile.email}
            </Typography>
          </Box>
        </Box>
        {/* Téléphone */}
        <Box sx={{ width: '100%', px: 2, py: 1, borderRadius: 2, background: '#F9FAFB', mb: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <PhoneIcon fontSize="small" sx={{ color: '#9333EA', mt: '2px' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Téléphone :
            </Typography>
            <Typography variant="body2" color={profile.telephone ? 'text.primary' : 'text.secondary'} sx={{ pl: 1 }}>
              {profile.telephone || 'Non renseigné'}
            </Typography>
          </Box>
        </Box>
        {/* Date de naissance */}
        <Box sx={{ width: '100%', px: 2, py: 1, borderRadius: 2, background: '#F9FAFB', mb: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <CakeIcon fontSize="small" sx={{ color: '#9333EA', mt: '2px' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Date de naissance :
            </Typography>
            <Typography variant="body2" color={etudiant.date_naissance ? 'text.primary' : 'text.secondary'} sx={{ pl: 1 }}>
              {etudiant.date_naissance
                ? new Date(etudiant.date_naissance).toLocaleDateString('fr-FR')
                : 'Non renseignée'}
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Bouton Déconnexion */}
      <Box sx={{ mt: 4, px: 2 }}>
        <Box
          component="button"
          onClick={() => setLogoutDialogOpen(true)}
          sx={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#e53935',
            fontWeight: 600,
            fontSize: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            py: 1.5,
            px: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transition: 'color 0.2s',
            '&:hover': {
              color: '#b71c1c',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1, color: 'inherit' }} />
          Déconnexion
        </Box>
        <ConfirmLogoutDialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          onConfirm={onLogout}
        />
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      anchor="left"
      open={mobileOpen}
      onClose={onMobileClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: variant === 'temporary' ? 'block' : 'none', md: variant === 'permanent' ? 'block' : 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 260,
          ...(variant === 'permanent' && {
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            position: 'absolute',
            top: 275,
            height: '65vh',
            overflow: 'auto',
            zIndex: 1000,
            backgroundColor: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default StudentDrawer; 