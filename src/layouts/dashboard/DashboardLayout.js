import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 60;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 23,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  console.log(open);
  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />

      {open && <Nav openNav={open} onCloseNav={() => setOpen(false)} />}

      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
