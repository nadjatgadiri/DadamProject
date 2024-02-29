import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Drawer } from '@mui/material';
// mock
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
// import Logo from '../../../components/logo';
import Logo from '../../../components/logo/CLASSFLOW.png';
import Scrollbar from '../../../components/scrollbar';
import { NavSection, NavSectionTeacher } from '../../../components/nav-section';
//
import navConfig from './config';

// ----------------------------------------------------------------------

const NAV_WIDTH = 270;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  // useEffect(() => {
  //   // if (isDesktop) {
  //   //   openNav = true;
  //   // }
  //   // console.log(isDesktop);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
        }}
      >
        {/* <Logo /> */}
        <img src={Logo} alt="" width={150} height={90} />
      </Box>
      {Cookies.get('role') === 'Worker' ? <NavSection data={navConfig} /> : <NavSectionTeacher />}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
        backgroundColor: 'white',
      }}
    >
      {isDesktop ? (
        <Drawer
          anchor="left"
          open={openNav}
          onClose={onCloseNav}
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'white',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
