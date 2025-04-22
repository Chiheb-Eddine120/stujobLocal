import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';
import CookieIcon from '@mui/icons-material/Cookie';
import StorageIcon from '@mui/icons-material/Storage';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Privacy: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        align="center"
        sx={{ 
          mb: 6,
          fontWeight: 700,
          background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Politique de Confidentialité
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
      </Typography>

      <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: 4, background: '#FDF8FF' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#9333EA', fontWeight: 600 }}>
          Introduction
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: '#666' }}>
          Chez Stujob, nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre plateforme de mise en relation entre étudiants et entreprises.
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          En utilisant notre site, vous acceptez les pratiques décrites dans cette politique. Si vous n'êtes pas d'accord avec ces pratiques, veuillez ne pas utiliser notre plateforme.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, background: '#FDF8FF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ color: '#9333EA', mr: 1 }} />
              <Typography variant="h5" component="h2" sx={{ color: '#9333EA', fontWeight: 600 }}>
                Informations que nous collectons
              </Typography>
            </Box>
            <Typography variant="body1" paragraph sx={{ color: '#666' }}>
              Nous collectons différents types d'informations selon votre profil et votre utilisation de notre plateforme :
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Informations d'identification" 
                  secondary="Nom, prénom, adresse e-mail, numéro de téléphone, adresse postale" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Informations professionnelles" 
                  secondary="Pour les entreprises : nom de l'entreprise, secteur d'activité, taille, description" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Informations académiques" 
                  secondary="Pour les étudiants : établissement, niveau d'études, filière, compétences" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Données d'utilisation" 
                  secondary="Informations sur votre navigation, préférences, interactions avec la plateforme" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, background: '#FDF8FF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StorageIcon sx={{ color: '#9333EA', mr: 1 }} />
              <Typography variant="h5" component="h2" sx={{ color: '#9333EA', fontWeight: 600 }}>
                Utilisation de vos données
              </Typography>
            </Box>
            <Typography variant="body1" paragraph sx={{ color: '#666' }}>
              Nous utilisons vos informations pour les finalités suivantes :
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Gestion de votre compte" 
                  secondary="Création et administration de votre profil, authentification" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Mise en relation" 
                  secondary="Matching entre étudiants et entreprises selon les critères définis" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Communication" 
                  secondary="Envoi d'informations sur les opportunités, mises à jour du service" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Amélioration du service" 
                  secondary="Analyse des données pour optimiser notre plateforme et votre expérience" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: '#FDF8FF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CookieIcon sx={{ color: '#9333EA', mr: 1 }} />
              <Typography variant="h5" component="h2" sx={{ color: '#9333EA', fontWeight: 600 }}>
                Utilisation des cookies
              </Typography>
            </Box>
            <Typography variant="body1" paragraph sx={{ color: '#666' }}>
              Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez contrôler l'utilisation des cookies via les paramètres de votre navigateur ou via notre bannière de consentement.
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#666' }}>
              Nous utilisons les types de cookies suivants :
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Cookies strictement nécessaires" 
                  secondary="Indispensables au fonctionnement du site (session, authentification)" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Cookies de performance et d'analyse" 
                  secondary="Nous permettent d'analyser l'utilisation du site pour en améliorer les performances" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Cookies de personnalisation" 
                  secondary="Mémorisent vos préférences pour personnaliser votre expérience" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Cookies publicitaires et de suivi" 
                  secondary="Utilisés pour vous proposer des publicités pertinentes" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: '#FDF8FF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ color: '#9333EA', mr: 1 }} />
              <Typography variant="h5" component="h2" sx={{ color: '#9333EA', fontWeight: 600 }}>
                Protection de vos données
              </Typography>
            </Box>
            <Typography variant="body1" paragraph sx={{ color: '#666' }}>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données personnelles contre la perte, l'accès non autorisé, la divulgation, l'altération ou la destruction.
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#666' }}>
              Ces mesures comprennent :
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Chiffrement des données" 
                  secondary="Utilisation de protocoles de chiffrement pour sécuriser les transmissions" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Contrôle d'accès" 
                  secondary="Restriction de l'accès aux données personnelles aux seuls employés autorisés" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Formation du personnel" 
                  secondary="Sensibilisation régulière de nos équipes aux bonnes pratiques de sécurité" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Audits de sécurité" 
                  secondary="Évaluation régulière de nos systèmes et processus" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: '#FDF8FF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ color: '#9333EA', mr: 1 }} />
              <Typography variant="h5" component="h2" sx={{ color: '#9333EA', fontWeight: 600 }}>
                Vos droits
              </Typography>
            </Box>
            <Typography variant="body1" paragraph sx={{ color: '#666' }}>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants concernant vos données personnelles :
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Droit d'accès" 
                  secondary="Vous pouvez demander une copie des données personnelles que nous détenons à votre sujet" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Droit de rectification" 
                  secondary="Vous pouvez demander la correction de données inexactes ou incomplètes" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Droit à l'effacement" 
                  secondary="Vous pouvez demander la suppression de vos données personnelles dans certaines circonstances" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Droit à la limitation du traitement" 
                  secondary="Vous pouvez demander la limitation du traitement de vos données dans certaines circonstances" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Droit à la portabilité" 
                  secondary="Vous pouvez demander le transfert de vos données à un autre service" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Droit d'opposition" 
                  secondary="Vous pouvez vous opposer au traitement de vos données dans certaines circonstances" 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1F1F1F' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
            </List>
            <Typography variant="body1" sx={{ mt: 2, color: '#666' }}>
              Pour exercer ces droits, veuillez nous contacter à l'adresse suivante : <Link href="mailto:privacy@stujob.be" sx={{ color: '#9333EA' }}>privacy@stujob.be</Link>
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: '#FDF8FF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LockIcon sx={{ color: '#9333EA', mr: 1 }} />
              <Typography variant="h5" component="h2" sx={{ color: '#9333EA', fontWeight: 600 }}>
                Questions fréquentes
              </Typography>
            </Box>
            
            <Accordion elevation={0} sx={{ mb: 2, background: 'transparent' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                  Combien de temps conservons-nous vos données ?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: '#666' }}>
                  Nous conservons vos données personnelles aussi longtemps que nécessaire pour vous fournir nos services et respecter nos obligations légales. Lorsque nous n'avons plus besoin de vos données, nous les supprimons de manière sécurisée.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion elevation={0} sx={{ mb: 2, background: 'transparent' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                  Partageons-nous vos données avec des tiers ?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: '#666' }}>
                  Nous ne vendons jamais vos données personnelles à des tiers. Nous pouvons partager vos données avec des prestataires de services qui nous aident à fournir notre service (hébergement, analyse, etc.) ou si la loi l'exige. Ces tiers sont tenus de respecter des obligations de confidentialité strictes.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion elevation={0} sx={{ mb: 2, background: 'transparent' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                  Comment pouvez-vous modifier vos préférences de communication ?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: '#666' }}>
                  Vous pouvez modifier vos préférences de communication à tout moment en vous connectant à votre compte et en accédant aux paramètres de notification, ou en nous contactant directement.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion elevation={0} sx={{ background: 'transparent' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                  Que se passe-t-il en cas de modification de cette politique ?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: '#666' }}>
                  Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement significatif en publiant la nouvelle politique sur cette page et en mettant à jour la date de dernière modification. Nous vous encourageons à consulter régulièrement cette page pour rester informé de la façon dont nous protégeons vos informations.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à l'adresse suivante : <Link href="mailto:contact@stujob.be" sx={{ color: '#9333EA' }}>contact@stujob.be</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Privacy; 