import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import Logo from '../components/Logo';

const CGU: React.FC = () => {
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
          Conditions Générales d'Utilisation (CGU) de StuJob
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'white' }}>
        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F' }}>
          Préambule
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Les présentes CGU définissent les conditions dans lesquelles les utilisateurs (étudiants, professionnels ou particuliers) peuvent accéder et utiliser la plateforme StuJob. En utilisant la Plateforme, l'utilisateur accepte l'intégralité des présentes conditions.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          Article 1 – Définitions
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          • « StuJob » : La plateforme éditrice et responsable du service.<br/>
          • « Utilisateur » : Toute personne physique ou morale utilisant la Plateforme.<br/>
          • « Partenaire » : Toute entité intervenant dans le traitement des données ou la fourniture de services techniques et de paiement.<br/>
          • « Services » : L'ensemble des prestations offertes via la Plateforme (mise en relation, publication d'annonces, accès à des fonctionnalités premium, etc.).
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          Article 2 – Objet
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          La Plateforme a pour objet de mettre en relation des demandeurs de services (professionnels et particuliers) avec des prestataires (étudiants) sans constituer un lien de subordination ni établir de contrat de travail.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          Article 3 – Accès, Inscription et Validation de l'Âge
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          • Inscription : L'accès à la Plateforme nécessite une inscription préalable avec fourniture d'informations exactes et à jour.<br/><br/>
          • Catégories d'utilisateurs :<br/>
          o Étudiants : inscription avec photo de profil, email, nom, prénom, numéro de téléphone, date de naissance, adresse, CV (optionnel) et biographie.<br/>
          o Professionnels : inscription avec photo de profil, nom professionnel, numéro d'entreprise, numéro de téléphone du référant, adresse du siège social, dénomination sociale, secteur d'activité, rôle et coordonnées du contact.<br/>
          o Particuliers : inscription avec photo de profil, email, nom, prénom, numéro de téléphone, adresse et biographie.<br/><br/>
          • Validation de l'âge : En s'inscrivant et en acceptant les présentes CGU, l'utilisateur atteste être âgé de plus de 15 ans. La date de naissance fournie sera utilisée pour cette vérification.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          Article 11 – Résiliation du Compte
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          • L'utilisateur peut à tout moment résilier son compte via son espace personnel ou en contactant le support.<br/><br/>
          • Conséquences de la résiliation :<br/>
          o Suppression des données personnelles sous 30 jours,<br/>
          o Conservation des données légalement requises (factures, etc.),<br/>
          o Conservation des données en cas de bannissement pour abus ou comportement inapproprié afin d'éviter la création de nouveaux comptes.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          Article 12 – Modification des Conditions
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          StuJob se réserve le droit de modifier les présentes CGU à tout moment. Les modifications seront communiquées aux utilisateurs via la Plateforme ou par email. L'utilisation continue de la Plateforme après modification implique l'acceptation des nouvelles conditions.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          Article 13 – Droit Applicable et Juridiction Compétente
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Les présentes CGU sont régies par le droit belge. En cas de litige, les tribunaux compétents seront ceux du ressort du siège social de StuJob, sauf disposition impérative contraire.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          Article 14 – Disclaimer et Propriété Intellectuelle
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          • Tout le contenu de la Plateforme (textes, images, logos, etc.) est protégé par le droit d'auteur et ne peut être reproduit sans autorisation écrite.<br/>
          • La Plateforme peut contenir des liens vers des sites tiers, dont le contenu n'est pas sous le contrôle de StuJob.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          Article 15 – Contact et Support
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Pour toute question relative aux CGU, les utilisateurs peuvent contacter le support via l'adresse contact@stujob.be.
        </Typography>
      </Paper>
    </Container>
  );
};

export default CGU;