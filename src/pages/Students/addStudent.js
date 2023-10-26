import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { Grid, Stack, Card, Container, Typography, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useNavigate, Link ,useLocation} from 'react-router-dom';
import { addNewStudent } from '../../RequestManagement/studentManagement';
import Iconify from '../../components/iconify';

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
  const location = useLocation();
  const [newStudentId, setNewStudentId] = useState('');
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    // Create a FileReader object to read the file
    const reader = new FileReader();
    reader.onload = (e) => {
      // Read the image file and update the state with the data URL
      setImage(e.target.result)
      // Send the image file to the backend
    };
    // Read the file as a data URL
    reader.readAsDataURL(file);
  };
  const handleGoBack = () => {
    console.log("location in AddStudent:", location);
    const query = new URLSearchParams(location.search);
    const referrer = query.get("referrer");
    if (referrer === "addRegistration") {
      if (newStudentId) {
        navigate("/dashboard/addRegistration", {
          state: { newStudentId}
        });
      } else {
        navigate("/dashboard/addRegistration"
        );
      }
    } else {
        navigate("/dashboard/student");
    }
};

  const validatePhoneNumber = (value) => {
    const phoneNumberError = /^(0|\+213)[567]\d{8}$/.test(value)
      ? ''
      : 'Please enter a valid phone number starting with 5, 6, or 7 and containing 8 digits';
    setPhoneNumberError(phoneNumberError);
  };

  const handleSubmit = async (e) => {
    setFeedback('');
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
        const response = await addNewStudent(data);
        if (response && response.code === 200) {
          toast.success(`L'étudiant est ajouté avec succès!`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setNewStudentId(response.studentId); 
          // Optionally reset form fields here
        } else if (response && response.code === 409) {
          setFeedback('Erreur: L\'email est déjà utilisé.');
        } else {
          setFeedback(response.message || 'Erreur lors de l\'ajout de l\'étudiant.');
        }
      } catch (error) {
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
          Nouveau Étudiant
        </Typography>
        <Button 
    variant="contained" 
    startIcon={<Iconify icon="ri:arrow-go-back-fill" />} 
    onClick={handleGoBack}
>
    Return
</Button>
      </Stack>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <Card style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} container justifyContent="center" alignItems="center">
                {image && <Avatar src={image} alt="Uploaded"
                  style={{
                    maxWidth: '300px',
                    marginTop: '20px',
                    border: '5px solid #BFBFBF', // Add this line to set border properties
                    borderRadius: '50%' // Add this line to make it a circle
                  }}
                  sx={{ width: 100, height: 100 }} />}
              </Grid>
              <Grid item xs={12} container justifyContent="center" alignItems="center" >
                <input type="file" name="image" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                  Upload image
                  <VisuallyHiddenInput
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
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
              <Typography variant="body2" color="error">{feedback}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: 'blue', color: 'white' }}>
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

export default AddStudent;