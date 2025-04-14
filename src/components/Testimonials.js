import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const testimonials = [
  {
    name: 'Marie Dubois',
    role: 'Directrice RH, Restaurant Le Gourmet',
    image: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    text: 'Grâce à Stujob, nous avons trouvé des étudiants motivés et fiables pour nos emplois saisonniers. Le processus est simple et efficace.',
  },
  {
    name: 'Thomas Martin',
    role: 'Étudiant en Marketing',
    image: 'https://i.pravatar.cc/150?img=2',
    rating: 5,
    text: 'J\'ai trouvé plusieurs missions intéressantes qui correspondent parfaitement à mon emploi du temps étudiant. Un vrai gain de temps !',
  },
  {
    name: 'Gaspard Laurent',
    role: 'Gérant, Boutique Fitness',
    image: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    text: 'La qualité des candidats proposés est excellente. Les étudiants sont bien préparés et professionnels dès le premier jour.',
  },
];

const Testimonials = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Ce qu'ils disent de nous
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                  <FormatQuoteIcon
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontSize: 40,
                      color: 'primary.light',
                      opacity: 0.2,
                    }}
                  />
                  <Box sx={{ mb: 3 }}>
                    <Rating value={testimonial.rating} readOnly />
                  </Box>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ mb: 3, fontStyle: 'italic' }}
                  >
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={testimonial.image}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials; 