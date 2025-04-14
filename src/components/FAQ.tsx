import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Comment fonctionne le processus de recrutement ?',
    answer: 'Le processus est simple : 1) L\'entreprise fait une demande via notre formulaire, 2) Nous analysons le besoin sous 24h, 3) Nous recherchons les étudiants correspondants, 4) Nous présentons les profils à l\'entreprise, 5) L\'entreprise choisit et nous gérons la mise en relation.',
  },
  {
    question: 'Quels types de missions sont proposées ?',
    answer: 'Nous proposons tous types de missions adaptées aux étudiants : jobs saisonniers, missions ponctuelles, contrats à temps partiel, stages, etc. Les secteurs sont variés : restauration, vente, logistique, IT, etc.',
  },
  {
    question: 'Combien de temps faut-il pour trouver un étudiant ?',
    answer: 'En moyenne, nous trouvons un étudiant correspondant à vos critères en moins de 72h. Ce délai peut varier selon la spécificité du profil recherché.',
  },
  {
    question: 'Quels sont les avantages pour les entreprises ?',
    answer: 'Les avantages sont nombreux : gain de temps dans le recrutement, accès à un réseau d\'étudiants pré-sélectionnés, flexibilité dans les missions, coût maîtrisé, et accompagnement personnalisé.',
  },
  {
    question: 'Comment sont sélectionnés les étudiants ?',
    answer: 'Nous vérifions rigoureusement chaque profil étudiant : identité, situation académique, expérience, disponibilités, et références. Seuls les étudiants répondant à nos critères de qualité sont acceptés dans notre réseau.',
  },
  {
    question: 'Y a-t-il des frais de service ?',
    answer: 'Notre service est gratuit pour les entreprises. Nous prenons une commission uniquement sur les missions réalisées avec succès.',
  },
];

const FAQ: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Questions fréquentes
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {faqs.slice(0, 3).map((faq, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{
                  mb: 2,
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            {faqs.slice(3).map((faq, index) => (
              <Accordion
                key={index + 3}
                expanded={expanded === `panel${index + 3}`}
                onChange={handleChange(`panel${index + 3}`)}
                sx={{
                  mb: 2,
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FAQ; 