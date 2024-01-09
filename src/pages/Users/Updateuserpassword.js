import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid, Stack, Card, Container, Typography, Box } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { updatePassword } from '../../RequestManagement/userManagement';
import Iconify from '../../components/iconify';

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '10vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
}));

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirmNew: false,
  });


  const validatePasswordMatch = () => {
    const matchError = newPassword === confirmNewPassword ? '' : 'Passwords do not match';
    setPasswordMatchError(matchError);
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    validatePasswordMatch();

    setFeedback('');
    e.preventDefault();

    if (!passwordMatchError) {
      try {
        // Add a call to your API method here
        const userId = Cookies.get("userID");
        const data = {
          userID: userId,
          oldPSW: oldPassword,
          newPSW: newPassword
        }
        const response = await updatePassword(data);

        if (response && response.code === 200) {
          toast.success('Password updated successfully!', {
            position: toast.POSITION.TOP_RIGHT,
          });
          // Optionally reset form fields here
        } else if (response && response.code === 401) {
          setFeedback('Old password is incorrect.');
        } else {
          setFeedback(response.message || 'Error updating password.');
        }
      } catch (error) {
        setFeedback('An error occurred. Please try again.');
      }
    } else {
      setFeedback('Please correct the errors.');
    }
  };

  return (
    <>
      <Container>
        <ToastContainer />

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Update Password
          </Typography>
          <Link to="/dashboard/user">
            <Button variant="contained" startIcon={<Iconify icon="ri:arrow-go-back-fill" />}>Return</Button>
          </Link>
        </Stack>
        <StyledContent>
          <Card style={{ padding: '20px' }}>

            <form onSubmit={handleSubmit}>

              <Grid container spacing={3}>

                <Grid item xs={12}>

                  <TextField
                    name="oldPassword"
                    label="Ancien mot de passe"
                    type={showPassword.old ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleTogglePasswordVisibility('old')} edge="end">
                            <Iconify icon={showPassword.old ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    fullWidth
                  />

                </Grid>

                <Grid item xs={12}>

                  <TextField
                    name="newPassword"
                    label="Nouveau mot de passe"
                    type={showPassword.new ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleTogglePasswordVisibility('new')} edge="end">
                            <Iconify icon={showPassword.new ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    fullWidth
                  />


                </Grid>

                <Grid item xs={12}>

                  <TextField
                    name="confirmNewPassword"
                    label="Confirmer le nouveau mot de passe"
                    type={showPassword.confirmNew ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleTogglePasswordVisibility('confirmNew')} edge="end">
                            <Iconify icon={showPassword.confirmNew ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    fullWidth
                    error={!!passwordMatchError}
                    helperText={passwordMatchError}
                  />

                </Grid>
                {feedback !== '' && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="error">
                      {feedback}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      style={{ backgroundColor: 'blue', color: 'white' }}
                    >
                      Update Password
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Card>
        </StyledContent>
      </Container>
    </>
  );
}

export default UpdatePassword;
