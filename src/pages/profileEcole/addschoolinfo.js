import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Grid, Stack, Card, Container, Typography, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { updateGeneralSchoolData, getGeneralSchoolData } from '../../RequestManagement/schoolManagement'; // Update the import paths

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

function ManageSchool() {
  const navigate = useNavigate();
  const [schoolName, setSchoolName] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [schoolPhone, setSchoolPhone] = useState('');
  const [schoolFacebook, setSchoolFacebook] = useState('');
  const [schoolTwitter, setSchoolTwitter] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolInst, setSchoolInst] = useState('');
  const [schoolLib, setSchoolLib] = useState('');
  const [schoolFax, setSchoolFax] = useState('');
  const [schoolLogo, setSchoolLogo] = useState('');
  const [feedback, setFeedback] = useState('');
  const location = useLocation();
  const [phoneNumberError, setPhoneNumberError] = useState('');


  useEffect(() => {
    const fetchGeneralSchoolData = async () => {
      try {
        const data = await getGeneralSchoolData();

        // Check if data.contacts is defined before accessing its properties
        setSchoolName(data.data.name || '');
        setSchoolName(data.data.name || '');
        setSchoolLib(data.data.lib || '');
        setSchoolAddress(data.data.lib || '');
        setSchoolPhone(data.data.contacts?.fix || '');
        setSchoolFacebook(data.data.contacts?.facebook || '');
        setSchoolTwitter(data.data.contacts?.twitter || '');
        setSchoolInst(data.data.contacts?.instagram || '');
        setSchoolLogo(data.data.logo || '');

      } catch (error) {
        console.error("Failed to fetch general school data:", error);
      }
    };

    fetchGeneralSchoolData();
  }, []);
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    // Create a FileReader object to read the file
    const reader = new FileReader();
    reader.onload = (e) => {
      // Read the image file and update the state with the data URL
      setSchoolLogo(e.target.result)
      // Send the image file to the backend
    };
    // Read the file as a data URL
    reader.readAsDataURL(file);
  };

  const validatePhoneNumber = (value) => {
    const phoneNumberError = /^(0|\+213)[567]\d{8}$/.test(value)
      ? ''
      : 'Please enter a valid phone number starting with 5, 6, or 7 and containing 8 digits';
    setPhoneNumberError(phoneNumberError);
  };
  const handleGoBack = () => {
    navigate("/dashboard");

  };

  const handleSubmit = async (e) => {
    setFeedback('');
    e.preventDefault();
    // Implement form validation logic as needed
    validatePhoneNumber(schoolPhone);
    if (phoneNumberError === '') {
      const data = {
        "name": schoolName,
        "lib": schoolLib,
        "address": schoolAddress,
        "contacts": {
          "mail": schoolEmail,
          "phone": schoolPhone,
          "facebook": schoolFacebook,
          "twitter": schoolTwitter,
          "instagram": schoolInst
        },
        "logo": schoolLogo
      };

      try {
        const response = await updateGeneralSchoolData(data);
        console.log(response); // Add this line for logging
        if (response && response.code === 200) {
          toast.success(`L'école est modifié avec succès!`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          // Optionally reset form fields here
        } else if (response && response.code === 409) {
          setFeedback('Erreur: L\'email de l\'école est déjà utilisé.');
        } else {
          setFeedback(response.message || 'Erreur lors de l\'ajout de l\'école.');
        }
      } catch (error) {
        console.error(error); // Add this line for logging
        setFeedback(error.message || 'Une erreur s\'est produite. Veuillez réessayer.');
      }
    } else {
      setFeedback('Veuillez corriger les erreurs.');
    }
  };


  return (
    <Container>
      <ToastContainer />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Manage School
        </Typography>
        <Button variant="contained" onClick={handleGoBack}>
          Return
        </Button>
      </Stack>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} container justifyContent="center" alignItems="center">
                {schoolLogo && (
                  <Avatar
                    src={schoolLogo}
                    alt="Uploaded"
                    style={{
                      maxWidth: '300px',
                      marginTop: '20px',
                      border: '5px solid #BFBFBF', // Add this line to set border properties
                      borderRadius: '50%', // Add this line to make it a circle
                    }}
                    sx={{ width: 100, height: 100 }}
                  />
                )}
              </Grid>
              <Grid item xs={12} container justifyContent="center" alignItems="center">
                <input
                  type="file"
                  name="logo"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                  Upload logo
                  <VisuallyHiddenInput
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="schoolName"
                  label="Nom de l'école"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="schoolLib"
                  label="Déscription"
                  value={schoolLib}
                  onChange={(e) => setSchoolLib(e.target.value)}
                  required
                  fullWidth
                  rows={3}
                  multiline
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="schoolAddress"
                  label="L'adresse de l'école"
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="schoolEmail"
                  type="email"
                  label="Email de l'école"
                  value={schoolEmail}
                  onChange={(e) => setSchoolEmail(e.target.value)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="schoolPhone"
                  label="Numéro de téléphone de l'école"
                  value={schoolPhone}
                  onChange={(e) => setSchoolPhone(e.target.value)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="instagram"
                  label="Instagram"
                  value={schoolInst}
                  onChange={(e) => setSchoolInst(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: <InstagramIcon style={{ color: 'grey', marginRight: "10" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="facebook"
                  label="Facebook"
                  value={schoolFacebook}
                  onChange={(e) => setSchoolFacebook(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: <FacebookIcon style={{ color: 'grey', marginRight: "10" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="twitter"
                  label="Twitter"
                  value={schoolTwitter}
                  onChange={(e) => setSchoolTwitter(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: <TwitterIcon style={{ color: 'grey', marginRight: "10" }} />,
                  }}
                />
              </Grid>

            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="error">
                {feedback}
              </Typography>
            </Grid>
            <br />
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: 'blue', color: 'white' }}
                >
                  Ajouter
                </Button>
              </Box>
            </Grid>
          </form>
        </Card>
      </div>
    </Container>
  );

}

export default ManageSchool;