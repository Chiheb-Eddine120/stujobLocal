import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import Logo from '../components/Logo';

const Cookies: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Logo variant="students" />
        <Typography variant="h1" component="h1" sx={{ 
          mt: 2,
          fontWeight: 900,
          fontSize: { xs: 28, md: 36 },
          textAlign: 'center',
          background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          Politique de Cookies
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'white' }}>
        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F' }}>
          1. Objet
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          La présente politique décrit l'utilisation des cookies et autres traceurs sur la Plateforme ainsi que les options offertes aux utilisateurs pour gérer leurs préférences.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          2. Qu'est-ce qu'un Cookie ?
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Un cookie est un petit fichier texte déposé sur l'appareil de l'utilisateur lors de la visite d'un site Web. Il permet au site de mémoriser des informations sur votre visite, comme votre langue préférée et d'autres paramètres, afin de faciliter votre prochaine visite et de rendre le site plus utile.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          3. Cookies Utilisés sur la Plateforme
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          • Cookies essentiels : Nécessaires au bon fonctionnement du site. Ils permettent d'utiliser les fonctionnalités principales du site et de sécuriser votre compte.<br/>
          • Cookies analytiques : Permettent de mesurer l'audience et la performance du site. Ils nous aident à comprendre comment les visiteurs interagissent avec notre site.<br/>
          • Cookies fonctionnels : Utilisés pour personnaliser l'expérience utilisateur. Ils mémorisent vos préférences et choix pour améliorer votre expérience de navigation.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          4. Consentement et Gestion
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          • Lors de la première visite, un bandeau de cookies est affiché pour recueillir le consentement de l'utilisateur.<br/>
          • L'utilisateur peut à tout moment modifier ses préférences via le panneau de configuration accessible sur chaque page.<br/>
          • Le consentement est valable pour une durée de 13 mois maximum.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          5. Durée de Conservation
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Les cookies sont conservés pendant des durées variables :<br/>
          • Cookies de session : supprimés à la fermeture du navigateur<br/>
          • Cookies persistants : conservés jusqu'à leur expiration ou leur suppression manuelle<br/>
          • Cookies analytiques : maximum 13 mois
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          6. Désactivation des Cookies
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          L'utilisateur peut désactiver les cookies via les paramètres de son navigateur. Toutefois, cela peut affecter certaines fonctionnalités du site. Pour plus d'informations sur la gestion des cookies selon votre navigateur, consultez les liens suivants :<br/><br/>
          • <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: '#9333EA' }}>Google Chrome</a><br/>
          • <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" style={{ color: '#9333EA' }}>Mozilla Firefox</a><br/>
          • <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" style={{ color: '#9333EA' }}>Microsoft Edge</a><br/>
          • <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: '#9333EA' }}>Safari</a>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Cookies; 