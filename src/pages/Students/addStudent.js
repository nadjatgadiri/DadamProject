import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Stack,
  Card,
  Container,
  Typography,
  Box,
  Button,
  Avatar,
  TextField,
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Select,
  FormControl,
  ListItemText,
  MenuItem,
  InputLabel,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { addNewStudent } from '../../RequestManagement/studentManagement';
import { listLevelWYearEduc } from '../../RequestManagement/educLevelMAnagement';
import LevelSetting from './LevelEducationComponent';
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
  const [files, setFiles] = useState([]);
  const [levels, setLevels] = useState([]);
  const [isLevelSetting, setIsLevelSetting] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [yearsEd, setYearsEd] = useState([]);
  const [feedback, setFeedback] = useState(''); // For displaying feedback to the user after a submit
  const location = useLocation();
  const [newStudentId, setNewStudentId] = useState('');
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    // Create a FileReader object to read the file
    const originalFileName = file.name; // Get the original filename
    console.log(originalFileName);
    const reader = new FileReader();
    reader.onload = (e) => {
      // Read the image file and update the state with the data URL
      setImage(e.target.result);
      // Send the image file to the backend
    };
    // Read the file as a data URL
    reader.readAsDataURL(file);
  };
  const handleFilesUpload = async (e) => {
    const file = e.target.files[0];
    // Create a FileReader object to read the file
    const originalFileName = file.name; // Get the original filename
    console.log(originalFileName);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileDataUrl = e.target.result; // Get the file data URL
      // Add the file object to the state array
      await setFiles((prevFiles) => [
        ...prevFiles,
        {
          name: originalFileName,
          data: fileDataUrl,
        },
      ]);
    };
    console.log(files);
    // Read the file as a data URL
    await reader.readAsDataURL(file);
  };
  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1); // Remove the file at the specified index
      return updatedFiles;
    });
  };
  const handleGoBack = () => {
    console.log('location in AddStudent:', location);
    const query = new URLSearchParams(location.search);
    const referrer = query.get('referrer');
    if (referrer === 'addRegistration') {
      if (newStudentId) {
        navigate('/dashboard/addRegistration', {
          state: { newStudentId },
        });
      } else {
        navigate('/dashboard/addRegistration');
      }
    } else {
      navigate('/dashboard/student');
    }
  };
  const validatePhoneNumber = (value) => {
    const phoneNumberError = /^(0|\+213)[567]\d{8}$/.test(value)
      ? ''
      : 'Please enter a valid phone number starting with 5, 6, or 7 and containing 8 digits';
    setPhoneNumberError(phoneNumberError);
    return /^(0|\+213)[567]\d{8}$/.test(value);
  };
  const handleSubmit = async (e) => {
    setFeedback('');
    e.preventDefault();
    if (validatePhoneNumber(phoneNumber)) {
      const data = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        dateOfBirth: dateOfBirth,
        mail: mail,
        image: image,
        files: files,
        levelID: selectedLevel,
        yearID: selectedYear === '' ? null : selectedYear,
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
          setFeedback("Erreur: L'email est déjà utilisé.");
        } else {
          setFeedback(response.message || "Erreur lors de l'ajout de l'étudiant.");
        }
      } catch (error) {
        setFeedback(error.message || "Une erreur s'est produite. Veuillez réessayer.");
      }
    } else {
      setFeedback('Veuillez corriger les erreurs.');
    }
  };
  const handleOpenSetingsLevelEd = () => {
    setIsLevelSetting(true);
  };
  const handleCancelClick = async () => {
    setIsLevelSetting(false);
    await fetchLevelsData();
  };
  const Demo = styled('div')(({ theme }) => ({
    border: `1px solid #d0d7de`, // Change the color as per your requirement
    borderRadius: '8px', // Makes the corners circular
    width: '100%', // Adjust width as needed
    marginLeft: '50px',
    marginRight: '50px',
  }));
  /** api */
  const fetchLevelsData = async () => {
    const result = await listLevelWYearEduc();
    if (result.code === 200) {
      await setLevels(result.allLevels);
      if (selectedLevel) {
        const foundElement = result.allLevels.find(
          (item) => item.ID_ROWID.toString() === selectedLevel
        );
        if (foundElement) {
          await setYearsEd(foundElement.studyYears);
        } else {
          await setYearsEd('');
        }
      }
    }
  };
  useEffect(() => {
    fetchLevelsData();
  }, []); // Empty dependency array means this effect runs once when component mounts

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} container justifyContent="center" alignItems="center">
                {image && (
                  <Avatar
                    src={image}
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
                  name="image"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                  Télécharger Une Image
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
                  type="date"
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
              <Grid item xs={6} />
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="role">Niveau d'Etudes</InputLabel>
                  <Select
                    name="level"
                    label="Niveau d'Etudes"
                    value={selectedLevel}
                    onChange={async (e) => {
                      if (e.target.value !== '') {
                        await setSelectedLevel(e.target.value);
                        const foundElement = levels.find(
                          (item) => item.ID_ROWID.toString() === e.target.value
                        );

                        if (foundElement) {
                          await setYearsEd(foundElement.studyYears);
                        } else {
                          await setYearsEd('');
                        }
                      }
                    }}
                    required
                  >
                    <MenuItem onClick={handleOpenSetingsLevelEd} value="">
                      <Typography
                        variant="title"
                        style={{ color: 'blue' }}
                        gutterBottom
                        component="div"
                      >
                        Paramètres du Niveau d'Éducation
                      </Typography>
                    </MenuItem>

                    {levels.map((level) => {
                      return (
                        <MenuItem key={level.ID_ROWID} value={`${level.ID_ROWID}`}>
                          {level.lib}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="role">Année d'Études</InputLabel>
                  <Select
                    name="year"
                    label="Année d'Études"
                    value={selectedYear}
                    onChange={async (e) => {
                      if (e.target.value !== '') setSelectedYear(e.target.value);
                    }}
                    inputProps={{
                      id: 'role',
                    }}
                  >
                    <MenuItem onClick={handleOpenSetingsLevelEd} value="">
                      <Typography
                        variant="title"
                        style={{ color: 'blue' }}
                        gutterBottom
                        component="div"
                      >
                        Paramètres du Niveau d'Éducation
                      </Typography>
                    </MenuItem>

                    {yearsEd?.map((year) => {
                      return (
                        <MenuItem key={year.ID_ROWID} value={`${year.ID_ROWID}`}>
                          {year.lib}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} container>
                {files.length !== 0 && (
                  <>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                      Les Document Télécharger
                    </Typography>
                    <Demo>
                      {files.map((file, index) => {
                        return (
                          <List key={{ index }}>
                            <ListItem
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleDeleteFile(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              }
                            >
                              <ListItemAvatar>
                                <Avatar>
                                  <FolderIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={`${file.name}`}
                                // secondary={secondary ? 'Secondary text' : null}
                              />
                            </ListItem>
                          </List>
                        );
                      })}
                    </Demo>
                  </>
                )}
              </Grid>
              <Grid item xs={12} container justifyContent="center" alignItems="center">
                <input
                  type="file"
                  name="docs"
                  id="docs-upload"
                  accept="image/*, application/pdf"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                  Télécharger Des Documents Supplémentaire
                  <VisuallyHiddenInput
                    id="image-upload"
                    type="file"
                    accept="image/*, application/pdf"
                    onChange={handleFilesUpload}
                  />
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="error">
                {feedback}
              </Typography>
            </Grid>
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
      <LevelSetting
        isOpen={isLevelSetting}
        handleCancelClick={handleCancelClick}
        handelReFetch={fetchLevelsData}
      />
    </Container>
  );
}

export default AddStudent;
