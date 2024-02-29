import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { NavLink as RouterLink } from 'react-router-dom';
import { useState } from 'react';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import SvgColor from '../svg-color';

// ----------------------------------------------------------------------
const icon = (name) => <SvgColor src={`/assets/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;
export default function NavSectionTaacher({ ...other }) {
  const item = {
    title: 'Déconnecter',
    icon: icon('log-out-svgrepo-com'),
    subItems: [],
  };
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        <NavItem key="Déconnecter" item={item} />
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  // closeSubItems: PropTypes.func.isRequired,
};

function NavItem({ item }) {
  const { title, icon, info, subItems } = item;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    // Clear session
    Cookies.remove('userID');

    // Reload the page
    window.location.reload();
  };

  return (
    <>
      <StyledNavItem
        component={RouterLink}
        onClick={handleClick}
        sx={{
          // Style for items with sub-items
          color:
            subItems && subItems.length > 0
              ? isExpanded
                ? 'primary.main'
                : 'text.primary'
              : 'text.primary',
          fontWeight:
            subItems && subItems.length > 0
              ? isExpanded
                ? 'fontWeightBold'
                : 'fontWeightRegular'
              : 'fontWeightRegular',
        }}
      >
        {/* Render your item content */}
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
        <ListItemText primary={title} />
        {info && info}
      </StyledNavItem>
    </>
  );
}
