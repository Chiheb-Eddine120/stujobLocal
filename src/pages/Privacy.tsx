import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import Logo from '../components/Logo';

const Privacy: React.FC = () => {
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
          Politique de Confidentialité
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'white' }}>
        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F' }}>
          1. Objet
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          La présente politique détaille la collecte, l'utilisation, la conservation et la protection des données personnelles des utilisateurs de la Plateforme, conformément au RGPD et à la législation belge.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          2. Données Collectées
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          • Pour les étudiants : Photo de profil, email, nom, prénom, numéro de téléphone, date de naissance, adresse, CV (optionnel), biographie.<br/>
          • Pour les professionnels : Photo de profil, nom professionnel, numéro d'entreprise, numéro de téléphone du référant, adresse du siège social, dénomination sociale, secteur d'activité, rôle et coordonnées du contact.<br/>
          • Pour les particuliers : Photo de profil, email, nom, prénom, numéro de téléphone, adresse, biographie.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          3. Finalités du Traitement
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          • Identification des utilisateurs.<br/>
          • Mise en relation et personnalisation de l'offre (via géolocalisation).<br/>
          • Complément d'information pour les profils (ex. : CV pour les étudiants).<br/>
          • Facturation et établissement des documents commerciaux.<br/>
          • Vérification de l'âge (minimum 15 ans).
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          4. Fondements Légaux
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Le traitement des données repose sur :<br/>
          • L'exécution du contrat (mise en relation, facturation).<br/>
          • Le consentement explicite (pour la personnalisation, certaines fonctionnalités).<br/>
          • L'obligation légale (facturation, contrôle de l'âge).
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          5. Droits des Utilisateurs
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Les utilisateurs disposent des droits suivants : accès, rectification, suppression, opposition, portabilité et retrait du consentement. Les demandes seront traitées dans un délai maximum de 30 jours. Pour exercer ces droits, contactez le DPO à dpo@stujob.be.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          6. Durée de Conservation des Données
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          • Étudiants : Données conservées jusqu'à l'âge de 25 ans, sauf demande expresse de suppression.<br/>
          • Autres utilisateurs : Données conservées pendant 3 ans, renouvelable tacitement, sauf demande expresse de suppression.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          7. Sécurité
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          StuJob met en œuvre des mesures techniques et organisationnelles (chiffrement AES-256, sauvegardes quotidiennes, surveillance des accès) pour protéger les données personnelles.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          8. Transferts Internationaux
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Les données peuvent être transférées hors UE sous clauses contractuelles types ou décisions d'adéquation.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Privacy; 