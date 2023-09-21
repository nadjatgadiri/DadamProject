import { Box, Button, Card, CardActions, CardContent, Divider, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import FaxIcon from '@mui/icons-material/Fax';
import EmailIcon from '@mui/icons-material/Email';

const adresse = {
  title: 'Adresse',
  desc: 'Tlemcen',
};

const telephone = {
  title: 'Numéro de téléphone',
  desc: '0712345678',
};

const fax = {
  title: 'Fax',
  desc: '043213456',
};

const email = {
  title: 'Adresse mail',
  desc: 'dadam@gmail.com',
};

const user = {
  description: "Ets d'enseignement et de formation",
  desc2: 'Formations scolaires et linguistiques & ateliers créatifs',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'DADAM School',
  timezone: 'GTM-7',
};

export const AccountProfile = () => (
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          component="img"
          src="../assets/img/logo_dadam.png"
          sx={{
            mb: 2,
          }}
        />
        <Typography gutterBottom variant="h5" sx={{ mb: 2 }}>
          {user.name}
        </Typography>
        <Typography color="text.primary" variant="body2" sx={{ mb: 2 }}>
          {user.description}
        </Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
          {user.desc2}
        </Typography>

        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            <LocationOnIcon sx={{ marginRight: '4px' }} /> {adresse.title}: {adresse.desc}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            <PhoneIcon sx={{ marginLeft: '8px' }} />
            {telephone.title}: {telephone.desc}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            <FaxIcon sx={{ marginLeft: '8px' }} />
            {fax.title}: {fax.desc}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            <EmailIcon sx={{ marginLeft: '8px' }} />
            {email.title}: {email.desc}
          </Typography>
        </Box>
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button fullWidth variant="text">
        Upload picture
      </Button>
    </CardActions>
  </Card>
);
