import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Grid } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo/CLASSFLOW.png';
// sections
import { AppWidgetLoginChoise } from '../sections/@dashboard/app';
import { LoginForm } from '../sections/auth/login';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const [role, setRole] = useState('');
  return (
    <>
      <Helmet>
        <title> Login</title>
      </Helmet>

      <StyledRoot>
        {mdUp && role !== '' && (
          <StyledSection>
            <center>
              <img src={Logo} alt="" width={150} height={150} style={{ marginTop: '20px' }} />

              <img src="/assets/illustrations/illustration_login.png" alt="login" />
            </center>
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            {role !== '' ? (
              <>
                <Typography variant="h4" gutterBottom>
                  Se connecter
                </Typography>
                <LoginForm role={role} />
              </>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={6} sm={6} md={6}>
                  <AppWidgetLoginChoise
                    icon={'twemoji:man-office-worker-medium-skin-tone'}
                    onClick={() => setRole('Employé')}
                    title={'Employé'}
                  />
                </Grid>

                <Grid item xs={6} sm={6} md={6}>
                  <AppWidgetLoginChoise
                    onClick={() => setRole('Enseignant')}
                    color="info"
                    icon={'twemoji:man-teacher-medium-skin-tone'}
                    title={'Enseignant'}
                  />
                </Grid>
              </Grid>
            )}
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
