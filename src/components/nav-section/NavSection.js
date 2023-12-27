import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
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
  const { title, path, icon, info, subItems } = item;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded((prev) => !prev); // Toggle the visibility of sub-items
  };



  return (
    <>
      <StyledNavItem
        component={RouterLink}
        to={path}
        onClick={handleClick}
        sx={{
          // Style for items with sub-items
          color: subItems && subItems.length > 0 ? (isExpanded ? 'primary.main' : 'text.primary') : 'text.primary',
          fontWeight: subItems && subItems.length > 0 ? (isExpanded ? 'fontWeightBold' : 'fontWeightRegular') : 'fontWeightRegular',
        }}
      >
        {/* Render your item content */}
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
        <ListItemText primary={title} />
        {info && info}
      </StyledNavItem>

      {isExpanded && subItems && subItems.length > 0 && (
        <List>
          {subItems.map((subItem) => (
            <NavItem
              key={subItem.title}
              item={subItem}
            // closeSubItems={closeSubItems}
            />
          ))}
        </List>
      )}
    </>
  );
}