import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import Logo from '../components/Logo';

const CGV: React.FC = () => {
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
          Conditions Générales de Vente (CGV)
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'white' }}>
        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F' }}>
          Définition du service proposé
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Par aide au "recrutement" ou "mise en relation", StuJob entend la recherche et la sélection d'un profil en vue de conclure une collaboration professionnelle encadrée par un contrat entre le candidat proposé (étudiant, stagiaire, alternant, freelance ou autre) et le client. La nature du contrat (job étudiant, stage, freelance, etc.) dépend exclusivement de l'accord final conclu entre les deux parties mises en relation. StuJob n'intervient pas dans la formalisation juridique de ce contrat, sauf mention explicite dans le devis.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          1. Objet
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Les présentes conditions régissent les prestations de recrutement sur mesure assurées par StuJob, consistant à mettre en relation des entreprises avec des étudiant(e)s ou jeunes profils pour des demandes ponctuelles, des stages ou toute autre demande spécifique.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          2. Devis et activation du service
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Un devis personnalisé est établi pour chaque demande, en fonction :<br/>
          • Du profil recherché<br/>
          • Du niveau de spécialisation ou du domaine d'activité demandé<br/>
          • Du délai de recrutement<br/>
          • Des services inclus (analyse, pré-sélection, entretiens, accompagnement)<br/><br/>
          Le devis est sans engagement tant qu'il n'a pas été validé par le client.<br/>
          Une fois accepté par écrit, il engage les deux parties à respecter les conditions stipulées.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          3. Paiement et facturation
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Le paiement est exigible dès la réalisation effective des engagements.<br/>
          Les frais de dossiers ou de suivi post-recrutement seront déduis de la facture si aucune candidature est retenu par le client.<br/><br/>
          Toutefois, si un(e) candidat(e) proposé(e) par StuJob est validé(e) par le client, une facture est émise conformément au devis. Cette facture couvre notamment :<br/>
          • L'analyse du besoin et ouverture de dossier<br/>
          • La recherche et sélection des candidats<br/>
          • La conduite des entretiens<br/>
          • La présentation des profils<br/>
          • Le suivi post-recrutement
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          4. Tarification
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Le tarif du service est défini dans le devis accepté. Il inclut :<br/>
          • La définition du besoin et ouverture du dossier<br/>
          • La recherche ciblée des candidats<br/>
          • Le tri et la sélection des candidatures<br/>
          • Les entretiens individuels<br/>
          • La présentation des profils<br/>
          • Le suivi post-recrutement
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          5. Garantie qualité
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Si un profil validé ne respecte pas son engagement ou s'avère manifestement inadapté dans les 7 jours calendriers suivant son recrutement, StuJob s'engage à proposer un nouveau candidat.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          6. Obligations du client
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Le client s'engage à :<br/>
          • Fournir une description claire du (des) besoin(s)<br/>
          • Informer StuJob de tout recrutement issu du processus engagé<br/>
          • Ne pas contacter directement un candidat transmis sans en informer StuJob<br/>
          • À l'exclusivité vis-à-vis de StuJob pour le délai convenu au préalable (30 jours)<br/><br/>
          Dans le non-respect de ses obligations, le client se verra une facturation de 50 % sur base du devis.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          7. Services pris en charge par StuJob
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          StuJob peut assurer tout ou partie du processus de recrutement pour le compte du client, incluant :<br/>
          • La diffusion des offres<br/>
          • Recherche du/des profil(s) demandé(s)<br/>
          • L'analyse de candidatures internes ou externes<br/>
          • La conduite d'entretiens<br/>
          • Le suivi post-recrutement<br/><br/>
          Le client peut transmettre à StuJob des documents internes (CV, bases de données, fiches de poste), utilisés exclusivement dans le cadre de la demande et dans le respect de la confidentialité.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          8. Données personnelles
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Les données collectées sont traitées conformément au RGPD, uniquement pour les besoins de la demande.<br/>
          StuJob s'engage à en garantir la confidentialité.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          9. Responsabilité
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          StuJob met en œuvre tous les moyens raisonnables pour garantir la qualité du recrutement, mais ne peut garantir la durée ni le succès de la collaboration entre le client et le ou les candidats.
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          10. Inclus dans le service
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Sauf mention contraire dans le devis, les éléments suivants sont inclus dans la prestation proposée par StuJob :<br/>
          • L'ouverture du dossier et l'analyse du besoin exprimé par le client<br/>
          • La rédaction et diffusion de l'annonce auprès de canaux adaptés<br/>
          • La recherche ciblée de profils étudiants via nos bases internes<br/>
          • La pré-sélection des profils : tri, évaluation, entretiens individuels<br/>
          • La présentation des profils pertinents avec un retour synthétique<br/>
          • Un appel de suivi post-recrutement dans les 7 jours<br/>
          • L'accompagnement et les échanges réguliers avec le client<br/>
          • Le respect de la confidentialité des données et des échanges
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          11. Non inclus dans le service
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Ne sont pas inclus, sauf mention explicite dans le devis :<br/>
          • La rédaction ou validation des contrats de travail ou conventions de stage<br/>
          • La gestion administrative liée à l'engagement<br/>
          • La mise à disposition d'un logiciel ou d'un accès plateforme<br/>
          • La rédaction d'offres d'emploi à diffuser hors des canaux gérés par StuJob<br/>
          • L'intégration du profil au sein des systèmes RH du client<br/>
          • La gestion du suivi du candidat au-delà du premier appel de suivi<br/>
          • Toute prestation supplémentaire après validation du devis initial
        </Typography>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          12. Litiges
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          En cas de désaccord, les parties s'engagent à rechercher une solution amiable.<br/>
          À défaut, le Tribunal de l'entreprise du Brabant Wallon sera seul compétent.
        </Typography>
      </Paper>
    </Container>
  );
};

export default CGV; 