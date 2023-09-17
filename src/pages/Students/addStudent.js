import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { Grid, Stack, Card, Container, Typography, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { addNewStudent } from '../../RequestManagement/studentManagement';

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

function AddStudent() {
  const navigate = useNavigate();
  const [mail, setMail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [image, setImage] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [feedback, setFeedback] = useState('');  // For displaying feedback to the user after a submit

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };
  const handleGoBack = () => {
    navigate("/dashboard/student");
}
  const validatePhoneNumber = (value) => {
    const phoneNumberError = /^(0|\+213)[567]\d{8}$/.test(value)
      ? ''
      : 'Please enter a valid phone number starting with 5, 6, or 7 and containing 8 digits';
    setPhoneNumberError(phoneNumberError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validatePhoneNumber(phoneNumber);
    if (phoneNumberError === '') {
        const data = {
        "firstName": firstName,
        "lastName": lastName,
        "phoneNumber": phoneNumber,
        "dateOfBirth": dateOfBirth,
        "mail": mail,
        "image": image
        };
        
        try {
            console.log(data);
            const response = await addNewStudent(data);
            if (response && response.code === 200) {
                setFeedback('Étudiant ajouté avec succès!');
                // Optionally reset form fields here
            } else if (response && response.code === 409) {
                setFeedback('Erreur: L\'email est déjà utilisé.');
            } else {
                setFeedback(response.message || 'Erreur lors de l\'ajout de l\'étudiant.');
            }
        } catch (error) {
            setFeedback('Une erreur s\'est produite. Veuillez réessayer.');
        }
    } else {
        setFeedback('Veuillez corriger les erreurs.');
    }
};

return (
    <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
                Nouveau Étudiant
            </Typography>
        </Stack>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <Card style={{ padding: '20px' }}>
                <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                <Grid item xs={5.5} container justifyContent="center" alignItems="center" >
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Télécharger l'image
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
              </Grid>
              <Grid item xs={12}>
    <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
        <Button 
            variant="contained" 
            style={{ backgroundColor: 'yellow', color: 'black' }} 
            onClick={handleGoBack}>
            Back to Students List
        </Button>

        <Button 
            type="submit" 
            variant="contained" 
            style={{ backgroundColor: 'blue', color: 'white' }}>
            Ajouter
        </Button>
    </Box>
</Grid>
                    
                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">{feedback}</Typography>
                    </Grid>
                </form>
            </Card>
        </div>
    </Container>
);
}

export default AddStudent;