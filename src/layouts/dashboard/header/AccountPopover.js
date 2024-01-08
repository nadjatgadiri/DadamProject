import { useState, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Button } from '@mui/material';
// mocks_
import { useNavigate, Link } from 'react-router-dom';
import { Buffer } from "buffer";
import { getUser } from '../../../RequestManagement/userManagement'
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    path: '/dashboard/app',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    path: '/dashboard/schooledit',
  },
  {
    label: 'Change Password',
    icon: 'eva:lock-fill',
    path: '/dashboard/passwordedit', // Add this line for the new menu option
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [userData2, setUserData] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const usersData1 = await getUser(localStorage.getItem("userID"));
        const usersData = usersData1.userData;
        const image = usersData.personProfile.imagePath !== null && usersData.personProfile.imagePath !== '' ?
          `data:image/jpeg;base64,${Buffer.from(
            usersData.personProfile.imagePath).toString("base64")}` : '../../../../assets/images/avatars/avatar_10.jpg';

        const user = {
          id: usersData.ID_ROWID,
          name: `${usersData.personProfile.firstName} ${usersData.personProfile.lastName}`,
          phone: usersData.personProfile.phoneNumber,
          email: usersData.personProfile.mail,
          status: usersData.isConnected,
          role: usersData.role,
          dateOfBirth: usersData.personProfile.dateOfBirth,
          image, // shorthand notation for image: image
        };



        console.log("hi"); // Make sure this is in the right place based on your logic

        setUserData(user); // Putting user in an array, assuming setUserData expects an array

      } catch (error) {
        console.error(error);
      }
    }

    fetchUserData();
  }, []);

  const handleOpen = (event) => {
    console.log(userData2);

    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const handleLogout = () => {
    // Clear session
    localStorage.clear();

    // Reload the page
    window.location.reload();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={userData2.image} alt={userData2.name} />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}

        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userData2.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userData2.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => {
              handleClose();
              if (option.path) {
                navigate(option.path); // Use the `navigate` function to go to the specified path
              }
            }}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>

    </>
  );
}
