import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Divider, List, ListItem } from '@mui/material';

const pages = [
  {
    date: 'date',
    lib: 'Products',
  },
  {
    date: 'date',
    lib: 'Products',
  },
  {
    date: 'date',
    lib: 'Products',
  },
  {
    date: 'date',
    lib: 'Products',
  },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [selectedPage, setSelectedPage] = React.useState(0);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handlePageSelect = (page) => {
    console.log(page);
    setSelectedPage(page);
    handleCloseNavMenu();
  };

  return (
    <div className="card">
      <div className="table-responsive table-card ">
        <AppBar position="static" sx={{ backgroundColor: 'white' }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box
                component="nav"
                aria-label="My site"
                sx={{
                  flexGrow: 1,
                  display: { xs: 'flex', md: 'none' },
                }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="blue"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map(
                    (page, index) =>
                      index !== selectedPage && (
                        <MenuItem
                          key={index}
                          selected={selectedPage === index}
                          onClick={() => handlePageSelect(index)}
                        >
                          <Typography textAlign="center">{page.lib}</Typography>
                        </MenuItem>
                      )
                  )}
                </Menu>
                <List
                  role="menubar"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%', // Set equal width for all list items
                  }}
                >
                  <ListItem>
                    <Button
                      aria-label={pages[selectedPage].lib}
                      variant="contained"
                      sx={{ width: '100%' }} // Ensure all buttons have equal width
                    >
                      {pages[selectedPage].lib}
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button
                      aria-label="more"
                      variant="text"
                      sx={{ width: '100%' }} // Ensure all buttons have equal width
                    >
                      More
                    </Button>
                  </ListItem>
                </List>
              </Box>
              <Box
                component="nav"
                aria-label="My site"
                sx={{
                  flexGrow: 1,
                  display: { xs: 'none', md: 'flex' },
                  backgroundColor: 'white',
                  color: 'black',
                }}
              >
                <List
                  role="menubar"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%', // Set equal width for all list items
                  }}
                >
                  {pages.map((page, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <Button
                          aria-label={page.lib}
                          selected={selectedPage === index}
                          onClick={() => handlePageSelect(index)}
                          variant={selectedPage === index ? 'contained' : 'outlined'}
                          sx={{ width: '100%' }} // Ensure all buttons have equal width
                        >
                          {page.lib}
                        </Button>
                      </ListItem>
                    </React.Fragment>
                  ))}
                  <ListItem>
                    <Button
                      aria-label="more"
                      variant="text"
                      sx={{ width: '100%' }} // Ensure all buttons have equal width
                    >
                      More
                    </Button>
                  </ListItem>
                </List>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <table className="table mb-0 text-nowrap table-centered">
          <tbody>
            <tr>
              <td>session data / </td>
              <td className="text-end">13:00 - 14:00</td>
              <td className="ps-0">selectioner</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResponsiveAppBar;
