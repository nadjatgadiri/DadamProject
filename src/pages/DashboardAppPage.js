import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';
// @mui
import { Buffer } from 'buffer';
import {
  Grid,
  Container,
  Typography,
  Card,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  TextField,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Autocomplete,
  Paper,
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';
import SessionAttRec from './sessionAttRec';
// sections
import { AppWidgetSummary } from '../sections/@dashboard/app';
import MyCalendar from './Programme/calendar/calendar';
import { getStatistiqueDataForDashbaord1 } from '../RequestManagement/dataManagment';
import { getGroups } from '../RequestManagement/groupManagement';
import { getAllSessions } from '../RequestManagement/sessionsManagement';
import { getUser } from '../RequestManagement/userManagement';
import { getGeneralSchoolData } from '../RequestManagement/schoolManagement'; // Update the import paths
import { getAllStudents } from '../RequestManagement/studentManagement';
import { getAllTeachers } from '../RequestManagement/teacherManagement';
import { addPrivateSessions } from '../RequestManagement/privateSessionManagement';
import useResponsive from '../hooks/useResponsive';
import './Programme/theme.css';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const isDesktop = useResponsive('up', 'sm');
  const [dataStatistique, setDataStatistique] = useState({
    nmbStudents: 0,
    nmbTeachers: 0,
    nmbPrograms: 0,
    nmbClasses: 0,
  });
  const [userData, setUserData] = useState('');
  const [schoolData, setSchoolData] = useState('');
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [data, setData] = useState({
    date: new Date().toISOString().split('T')[0],
    startAt: '08:00',
    endAt: '09:30',
    isSessionInClass: false,
    defaultPrice: '0',
    comments: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const storedSelectedStudents = localStorage.getItem('selectedStudents');
  const [selectedStudents, setSelectedStudents] = useState(() => {
    return storedSelectedStudents ? JSON.parse(storedSelectedStudents) : [];
  });
  const storedSelectedTeachers = localStorage.getItem('selectedTeachers');
  const [selectedTeachers, setSelectedTeachers] = useState(() => {
    return storedSelectedTeachers ? JSON.parse(storedSelectedTeachers) : [];
  });
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('fr-FR', options);
  }
  /** api */
  const fetchData = async () => {
    const result = await getStatistiqueDataForDashbaord1();
    if (result.code === 200) {
      setDataStatistique(result.staticData);
    }
    const result2 = await getGroups();
    if (result2.code === 200) {
      const data = await result2.groups.map((group) => ({
        id: group.ID_ROWID,
        name: group.GroupeName,
      }));
      setGroups(ColorGenerator(data));
    }
    const result3 = await getAllSessions();
    if (result3.code === 200) {
      setEvents(result3.events);
    }
    // user Data
    const usersData1 = await getUser(Cookies.get('userID'));
    const usersData = usersData1.userData;
    const image =
      usersData.personProfile.imagePath !== null && usersData.personProfile.imagePath !== ''
        ? `data:image/jpeg;base64,${Buffer.from(usersData.personProfile.imagePath).toString(
            'base64'
          )}`
        : '../../../../assets/images/avatars/avatar_10.jpg';
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
    console.log(user);
    setUserData(user); // Putting user in an array, assuming setUserData expects an array
    // school

    const dataSchool = await getGeneralSchoolData();
    const school = {
      name: dataSchool.data.name || '',
      email: dataSchool.data.contacts?.mail || '',
      phone: dataSchool.data.contacts?.phone || '',
      logo: dataSchool.data.logo || '',
    };
    setSchoolData(school);
  };
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this effect runs once when component mounts
  useEffect(() => {
    if (openDialog) {
      const fetchStudents = async () => {
        try {
          const response = await getAllStudents();
          if (response.code === 200) {
            const processedStudents = response.students.map((student) => ({
              id: student.ID_ROWID,
              name: `${student.personProfile2.firstName} ${student.personProfile2.lastName}`,
              dateOfBirth: student.personProfile2.dateOfBirth,
              // ... other fields as needed
            }));
            setStudents(processedStudents);
          } else {
            toast.error(`Failed to fetch students. ${response.message}`, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        } catch (error) {
          toast.error(`Error: ${error.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      };
      const fetchTeachers = async () => {
        try {
          const response = await getAllTeachers();
          if (response.code === 200) {
            const processedTeachers = response.teachers.map((teacher) => ({
              id: teacher.ID_ROWID,
              name: `${teacher.personProfile2.firstName} ${teacher.personProfile2.lastName}`,
              dateOfBirth: teacher.personProfile2.dateOfBirth,
              // ... other fields as needed
            }));
            setTeachers(processedTeachers);
          } else {
            toast.error(`Failed to fetch Teachers. ${response.message}`, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        } catch (error) {
          toast.error(`Error: ${error.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      };
      fetchStudents();
      fetchTeachers();
    }
  }, [openDialog]);
  const stringToColor = (name) => {
    const hashCode = name
      .toString()
      .split('')
      .reduce((acc, char) => {
        acc = acc * 31 + char.charCodeAt(0) + 100;
        return acc;
      }, 0);
    const color = `#${((hashCode & 0xffffff) << 0).toString(16).padStart(6, '0')}`; // eslint-disable-line no-bitwise
    return color;
  };

  const ColorGenerator = (data) => {
    const colors = {};

    data?.forEach((option) => {
      colors[option.id] = stringToColor(`${option.name}${option.id}`);
    });
    return colors;
  };

  const handleAddEvent = async () => {
    setError('');
    // Validate form fields
    if (!data.date || !data.startAt || !data.endAt) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Create new event object
    const newEvent = {
      date: data.date,
      startAt: data.startAt,
      endAt: data.endAt,
      defaultPrice: data.defaultPrice,
      comments: data.comments,
      isSessionInClass: data.isSessionInClass,
      students: selectedStudents.map((student) => student.id),
      teachers: selectedTeachers.map((teacher) => teacher.id),
    };
    console.log(newEvent);
    try {
      const response = await addPrivateSessions(newEvent);
      if (response.code === 200) {
        toast.success(`Private Session has been add successfully.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error(`Failed to fetch students. ${response.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const fetchTeachers = async () => {
    try {
      const response = await getAllTeachers();
      if (response.code === 200) {
        const processedTeachers = response.teachers.map((teacher) => ({
          id: teacher.ID_ROWID,
          name: `${teacher.personProfile2.firstName} ${teacher.personProfile2.lastName}`,
          dateOfBirth: teacher.personProfile2.dateOfBirth,
          // ... other fields as needed
        }));
        setTeachers(processedTeachers);
      } else {
        toast.error(`Failed to fetch Teachers. ${response.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  return (
    <>
      <Helmet>
        <title> Dashboard</title>
      </Helmet>

      <Container maxWidth="xl">
        <ToastContainer />
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bienvenue
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Étudiants"
              total={dataStatistique.nmbStudents}
              icon={'ph:student-fill'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Professeurs"
              total={dataStatistique.nmbTeachers}
              color="info"
              icon={'ph:chalkboard-teacher-fill'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Programmes"
              total={dataStatistique.nmbPrograms}
              color="warning"
              icon={'solar:programming-bold'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Salles"
              total={dataStatistique.nmbClasses}
              color="error"
              icon={'mdi:dining-room'}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={7}>
            <div className="card">
              {/* <!-- card body --> */}
              <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                {/* <!-- card title --> */}
                <List
                  sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                  }}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        src={userData?.image}
                        alt={userData?.name}
                        className="avatar-xl mr-3" // Increase size with the class
                      />
                    </ListItemAvatar>
                    <ListItemText
                      style={{ paddingLeft: '16px' }}
                      primary={<Typography variant="h5">{userData.name}</Typography>}
                      secondary={<Typography variant="body1">{userData.role}</Typography>}
                    />
                  </ListItem>
                  <Divider component="li" style={{ marginBottom: '10px' }} />
                  <ListItem>
                    <ListItemText
                      primary={<Typography variant="subtitle2">Téléphone</Typography>}
                      secondary={<Typography variant="body1">{userData?.phone}</Typography>}
                    />
                    <ListItemText
                      style={{ paddingLeft: '10px' }}
                      primary={<Typography variant="subtitle2">Mail</Typography>}
                      secondary={<Typography variant="body1">{userData?.email}</Typography>}
                    />

                    <ListItemText
                      style={{ paddingLeft: '10px' }}
                      primary={<Typography variant="subtitle2">Date De Naissance</Typography>}
                      secondary={<Typography variant="body1">{userData?.dateOfBirth}</Typography>}
                    />
                  </ListItem>
                </List>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <div className="card">
              {/* <!-- card body --> */}
              <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                {/* <!-- card title --> */}
                <List
                  sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                  }}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <img
                        src={schoolData.logo}
                        alt="logo"
                        width={100}
                        height={79}
                        // Increase size with the class
                      />
                    </ListItemAvatar>
                    <ListItemText
                      style={{ paddingLeft: '16px' }}
                      primary={<Typography variant="h5">École : {schoolData.name}</Typography>}
                    />
                  </ListItem>
                  <Divider component="li" style={{ marginBottom: '10px' }} />
                  <ListItem>
                    <ListItemText
                      primary={<Typography variant="subtitle2">Téléphone</Typography>}
                      secondary={<Typography variant="body1">{schoolData.phone}</Typography>}
                    />
                    <ListItemText
                      style={{ paddingLeft: '10px' }}
                      primary={<Typography variant="subtitle2">Mail</Typography>}
                      secondary={<Typography variant="body1">{schoolData.email}</Typography>}
                    />
                  </ListItem>
                </List>
              </div>
            </div>
          </Grid>
          <Grid container spacing={3} item xs={12} md={12} lg={12}>
            <SessionAttRec />

            {/* <div className="card-body" style={{ display: 'flex', alignItems: 'center' }}></div> */}
          </Grid>
          {/* <DashboardSessionComponent /> */}

          <Grid item xs={12} md={12} lg={12}>
            <Card style={{ height: '750px' }}>
              <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <MyCalendar colorMap={groups} events={events} fetchEvents={fetchData} />
              </div>
              <div style={{ margin: '20px' }}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                    <Button
                      variant="contained"
                      onClick={() => setOpenDialog(true)}
                      style={{ backgroundColor: 'blue', color: 'white' }}
                    >
                      Ajouter Une Séance Privé
                    </Button>
                  </Box>
                </Grid>
              </div>
            </Card>
          </Grid>

          {/* Dialog to add new event for private session */}
          <Dialog
            open={openDialog}
            onClose={() => {
              setOpenDialog(false);
            }}
          >
            <>
              <DialogTitle>
                <div>Ajouter une séance privé</div>
              </DialogTitle>
              <DialogContent>
                <DialogContent>
                  <form
                  // onSubmit={ }
                  >
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                      <Grid xs={12} item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                        <Autocomplete
                          multiple
                          disablePortal
                          id="combo-box-student"
                          options={students}
                          getOptionLabel={(option) =>
                            option ? `${option.name}\n(${formatDate(option.dateOfBirth)})` : ''
                          }
                          getOptionSelected={(option, value) => option.id === value.id}
                          value={selectedStudents}
                          onChange={(event, newValues) => {
                            console.log('Autocomplete onChange - New Values:', newValues);
                            setSelectedStudents(newValues);
                            console.log(students);
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Étudiants" variant="outlined" fullWidth />
                          )}
                          PaperComponent={({ children }) => <Paper square>{children}</Paper>}
                          ListboxProps={{ style: { maxHeight: '250px', overflow: 'auto' } }}
                          noOptionsText="Aucun étudiant trouvé"
                        />
                      </Grid>
                      <Grid xs={12} item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                        <Autocomplete
                          multiple
                          disablePortal
                          id="combo-box-teachers"
                          options={teachers}
                          getOptionLabel={(option) =>
                            option ? `${option.name}\n(${formatDate(option.dateOfBirth)})` : ''
                          }
                          getOptionSelected={(option, value) => option.id === value.id}
                          value={selectedTeachers}
                          onChange={(event, newValues) => {
                            console.log('Autocomplete onChange - New Values:', newValues);
                            setSelectedTeachers(newValues);
                            console.log(selectedTeachers);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Enseignants"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                          PaperComponent={({ children }) => <Paper square>{children}</Paper>}
                          ListboxProps={{ style: { maxHeight: '250px', overflow: 'auto' } }}
                          noOptionsText="Aucun étudiant trouvé"
                        />
                      </Grid>
                      <Grid xs={6} item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                        <InputLabel htmlFor="role">Prix De Séance </InputLabel>
                        <TextField
                          id="defaultPrice"
                          type="number"
                          value={data.defaultPrice || ''}
                          onChange={(e) => {
                            setData({
                              ...data,
                              defaultPrice: e.target.value,
                            });
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid xs={6} item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                        <InputLabel htmlFor="role">Le Jour</InputLabel>
                        <TextField
                          type="date"
                          value={data?.date}
                          onChange={(e) => {
                            setData({
                              ...data,
                              date: e.target.value,
                            });
                          }}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid xs={6} item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                        <InputLabel htmlFor="role">Débuté à </InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={['MobileTimePicker']}>
                            <MobileTimePicker
                              value={dayjs(`2023-01-01T${data.startAt}:00`)}
                              onChange={(newTime) => {
                                setData({
                                  ...data,
                                  startAt: newTime.format('HH:mm'),
                                });
                              }}
                              slotProps={{ textField: { fullWidth: true } }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </Grid>
                      <Grid xs={6} item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                        <InputLabel htmlFor="role">Terminé à </InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={['MobileTimePicker']}>
                            <MobileTimePicker
                              value={dayjs(`2023-01-01T${data.endAt}:00`)}
                              onChange={(newTime) => {
                                setData({
                                  ...data,
                                  endAt: newTime.format('HH:mm'),
                                });
                              }}
                              slotProps={{ textField: { fullWidth: true } }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </Grid>

                      <Grid xs={12} item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                        <TextField
                          name="comments"
                          label="Description"
                          value={data?.comments}
                          onChange={(e) => {
                            setData({
                              ...data,
                              comments: e.target.value,
                            });
                          }}
                          minRows={2}
                          maxRows={10}
                          multiline
                          fullWidth
                        />
                      </Grid>
                      <Grid item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={data.isSessionInClass}
                                onChange={() => {
                                  setData({
                                    ...data,
                                    isSessionInClass: !data.isSessionInClass,
                                  });
                                }}
                              />
                            }
                            label="Planifier des sessions dans les salles"
                          />
                        </FormGroup>
                      </Grid>

                      <Grid item xs={12} sx={{ alignItems: 'center', paddingTop: '10px' }}>
                        <Typography variant="body2" color="error">
                          {error}
                        </Typography>
                      </Grid>
                    </Grid>
                  </form>
                </DialogContent>
              </DialogContent>
              <DialogActions>
                <>
                  <Button onClick={handleAddEvent} color="error">
                    Ajouter
                  </Button>

                  <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
                </>
              </DialogActions>
            </>
          </Dialog>
        </Grid>
      </Container>
    </>
  );
}
