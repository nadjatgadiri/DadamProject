import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Link, Stack, Card, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../components/iconify';

function AddUser() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '10vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  }));
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Vous pouvez traiter les données du formulaire ici, par exemple :
    console.log('Données soumises :', formData);
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
          <Card style={{ maxWidth: '800px', width: '100%' }}>
            <StyledContent style={{ padding: '20px' }}>
              <Stack spacing={3}>
                <TextField name="lastname" label="Nom de secrétaire" />
                <TextField name="firstname" label="Prénom de secrétaire" />
                <TextField name="email" label="Email" />
                <TextField name="phone" label="numéro de téléphone" />
                <FormControl>
                  <InputLabel htmlFor="role">Role</InputLabel>
                  <Select
                    name="role"
                    label="Role"
                    value={formData.role}
                    onChange={handleInputChange}
                    inputProps={{
                      id: 'role',
                    }}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="secretaire">Secrétaire</MenuItem>
                  </Select>
                </FormControl>
                <Link to="/dashboard/user">
                  <Button variant="contained">Ajouter</Button>
                </Link>
              </Stack>
            </StyledContent>
          </Card>
        </div>
      </Container>
    </>
  );
}

export default AddUser;
