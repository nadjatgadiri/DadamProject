import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo/CLASSFLOW.png';
// sections
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




  return (
    <>
      <Helmet>
        <title> Login</title>
      </Helmet>

      <StyledRoot>
        {mdUp && (
          <StyledSection>
            <center>
              <img src={Logo} alt="" width={150} height={150} style={{ marginTop: "20px" }} />


              <img src="/assets/illustrations/illustration_login.png" alt="login" />
            </center>
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Se connecter
            </Typography>
            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
