import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { AccountProfile } from '../profile/account-profile';
import { AccountProfileDetails } from '../profile/account-profile-details';

function SchoolProfilePage() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2}>
          <div>
            <Typography variant="h4">Informations générales de l'école</Typography>
          </div>
          <div>
            <Grid container spacing={3}>
              <Grid xs={12} md={6} lg={5}>
                <AccountProfile />
              </Grid>
              <Grid xs={12} md={6} lg={7}>
                <AccountProfileDetails />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  );
}

export default SchoolProfilePage;
