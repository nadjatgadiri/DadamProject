import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Link, Grid, Stack, Card, Container, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { addNewUser } from '../../RequestManagement/userManagement';

const VisuallyHiddenInput = styled('input')({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});
function AddUser() {
  const navigate = useNavigate();
  const [mail, setMail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [image, setImage] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '10vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  }));
  const handleInputChange = (e) => {
    setRole(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };
  const validatePhoneNumber = (value) => {
    const phoneNumberError = /^(0|\+213)[567]\d{8}$/.test(value)
      ? ''
      : 'Please enter a valid phone number starting with 5, 6, or 7 and containing 8 digits';
    setPhoneNumberError(phoneNumberError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    validatePhoneNumber(phoneNumber);
    if (phoneNumberError === '') {
      const data = {
        "firstName": firstName,
        "lastName": lastName,
        "phoneNumber": phoneNumber,
        "dateOfBirth": dateOfBirth,
        "mail": mail,
        "role": role,
        "image": image
      };
      console.log(data);
      await addNewUser(data);
    }
    // Vous pouvez traiter les données du formulaire ici, par exemple :
    // console.log('Données soumises :', formData);
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Nouveau Utilisateur
          </Typography>
        </Stack>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <Card style={{ padding: '20px' }}>
            <form onSubmit={handleSubmit}>

              <Grid container spacing={3}>
                <Grid item xs={5.5} container justifyContent="center" alignItems="center" >
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Upload file
                    <VisuallyHiddenInput
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Grid>
                <Grid item xs={6} container justifyContent="left" alignItems="left">
                  {image && <Avatar src={image} alt="Uploaded" style={{ maxWidth: '100px', marginTop: '10px' }} sx={{ width: 80, height: 80 }} />}
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="lastname"
                    label="Nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="firstname"
                    label="Prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="email"
                    type="email"
                    label="Email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="phone"
                    label="numéro de téléphone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    fullWidth
                    error={!!phoneNumberError}
                    helperText={phoneNumberError}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type='date'
                    name="date"
                    label="Date de naissance"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="role">Role</InputLabel>
                    <Select
                      name="role"
                      label="Role"
                      value={role}
                      onChange={handleInputChange}
                      inputProps={{
                        id: 'role',
                      }}
                      required
                    >
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="Secretaire">Secrétaire</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained">Ajouter</Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </div>
      </Container >
    </>
  );
}

export default AddUser;
