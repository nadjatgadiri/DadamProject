import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Chip,
  AppBar,
  Toolbar,
  Menu,
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import { getSessionsInLast4Days } from '../RequestManagement/sessionsManagement';
import {
  updateSessionAttendanceRecording,
  getSessionAttendanceRecording,
} from '../RequestManagement/sessionAttRecManagement';
import {
  updatePrivateSessionAttendanceRecording,
  getPrivateSessionAttendanceRecording,
} from '../RequestManagement/privateSessionManagement';
import Iconify from '../components/iconify';

function SessionAttRec() {
  const [pages, setPages] = useState([]);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [selectedPage, setSelectedPage] = React.useState(0);
  const [selectAllStudents, setSelectAllStudents] = useState(false);
  const [selectAllProfessors, setSelectAllProfessors] = useState(false);
  const [studentCheckboxes, setStudentCheckboxes] = useState([]);
  const [professorCheckboxes, setProfessorCheckboxes] = useState([]);
  const frenchDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const [selectedRow, setSelectedRow] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleClick = async (event) => {
    setSelectedRow(event);
    if (event.type === 'normal') {
      const result = await getSessionAttendanceRecording(event.id);
      if (result.code === 200) {
        // Assuming you already have the data object

        // For student checkboxes
        const studentCheckboxesData = result.studentList.map((student) => ({
          id: student.ID_ROWID,
          label: `${student.personProfile2.firstName} ${student.personProfile2.lastName}`,
          checked: result.studentAttResList.some((record) => record.studentID === student.ID_ROWID),
        }));

        // For professor checkboxes
        const professorCheckboxesData = result.teacherList.map((teacher) => ({
          id: teacher.ID_ROWID,
          label: `${teacher.personProfile2.firstName} ${teacher.personProfile2.lastName}`,
          checked: result.teacherAttResList.some((record) => record.teacherID === teacher.ID_ROWID),
        }));

        // Now you can set these data into your state variables
        // Assuming you have state variables studentCheckboxes and professorCheckboxes and their corresponding setters
        setStudentCheckboxes(studentCheckboxesData);
        setProfessorCheckboxes(professorCheckboxesData);
        setIsError(false);
      } else {
        setIsError(true);
      }
    } else if (event.type === 'private') {
      const result = await getPrivateSessionAttendanceRecording(event.id);
      if (result.code === 200) {
        // For student checkboxes
        const studentCheckboxesData = result.studentList.map((student) => ({
          id: student.ID_ROWID,
          label: `${student.personProfile2.firstName} ${student.personProfile2.lastName}`,
          checked: student.studentsInPrivateSession?.isAttended,
        }));
        // For professor checkboxes
        const professorCheckboxesData = result.teacherList.map((teacher) => ({
          id: teacher.ID_ROWID,
          label: `${teacher.personProfile2.firstName} ${teacher.personProfile2.lastName}`,
          checked: teacher.teachersInPrivateSession?.isAttended,
        }));
        // Now you can set these data into your state variables
        // Assuming you have state variables studentCheckboxes and professorCheckboxes and their corresponding setters
        setStudentCheckboxes(studentCheckboxesData);
        setProfessorCheckboxes(professorCheckboxesData);
        setIsError(false);
      } else {
        setIsError(true);
      }
    }
  };

  const updateAttRecForSession = async () => {
    const studentAttRec = studentCheckboxes.filter((student) => student.checked);
    const teacherAttRes = professorCheckboxes.filter((teacher) => teacher.checked);
    if (selectedRow.type === 'normal') {
      const data = {
        studentList: studentAttRec,
        teacherList: teacherAttRes,
        idProg: selectedRow.prog?.id,
        id: selectedRow.id,
      };
      const result = await updateSessionAttendanceRecording(selectedRow.id, data);
      if (result.code === 200) {
        toast.success('La séance est bien enregistrée.', {
          position: toast.POSITION.TOP_RIGHT,
        }); // hanii zadta a nadjiiib
        await updatePage();
      }
    } else if (selectedRow.type === 'private') {
      const data = {
        studentList: studentAttRec,
        teacherList: teacherAttRes,
        id: selectedRow.id,
      };
      const result = await updatePrivateSessionAttendanceRecording(selectedRow.id, data);
      if (result.code === 200) {
        toast.success('La séance est bien enregistrée.', {
          position: toast.POSITION.TOP_RIGHT,
        }); // hanii zadta a nadjiiib
        await updatePage();
      }
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handlePageSelect = (page) => {
    setSelectedPage(page);
    handleCloseNavMenu();
  };
  const updatePage = async () => {
    const result = await getSessionsInLast4Days();
    if (result.code === 200) {
      const data = await Promise.all(
        result.lastFourDays.map(async (element, index) => {
          const day = new Date(element);
          return {
            date: element,
            lib: index === 0 ? "aujourd'hui" : frenchDays[day.getDay()],
            events: result.events.filter((event) => event.date === element),
          };
        })
      );

      setPages(data);
    }
  };
  // api
  useEffect(() => {
    const fetchData = async () => {
      const result = await getSessionsInLast4Days();
      if (result.code === 200) {
        const data = await Promise.all(
          result.lastFourDays.map(async (element, index) => {
            const day = new Date(element);
            return {
              date: element,
              lib: index === 0 ? "aujourd'hui" : frenchDays[day.getDay()],
              events: result.events.filter((event) => event.date === element),
            };
          })
        );
        console.log(result.events);
        console.log(data);
        setPages(data);
      }
    };

    fetchData();
  }, []);
  const handleSelectAllStudents = () => {
    const updatedCheckboxes = studentCheckboxes.map((checkbox) => ({
      ...checkbox,
      checked: !selectAllStudents,
    }));
    setStudentCheckboxes(updatedCheckboxes);
    setSelectAllStudents(!selectAllStudents);
  };

  const handleSelectAllProfessors = () => {
    const updatedCheckboxes = professorCheckboxes.map((checkbox) => ({
      ...checkbox,
      checked: !selectAllProfessors,
    }));
    setProfessorCheckboxes(updatedCheckboxes);
    setSelectAllProfessors(!selectAllProfessors);
  };

  const handleCheckboxChange = (index, isStudent) => {
    if (isStudent) {
      const updatedCheckboxes = [...studentCheckboxes];
      updatedCheckboxes[index].checked = !updatedCheckboxes[index].checked;
      setStudentCheckboxes(updatedCheckboxes);
    } else {
      const updatedCheckboxes = [...professorCheckboxes];
      updatedCheckboxes[index].checked = !updatedCheckboxes[index].checked;
      setProfessorCheckboxes(updatedCheckboxes);
    }
  };

  return (
    <>
      <Grid item xs={12} md={6} lg={6}>
        <div className="card" style={{ maxHeight: '500px' }}>
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
                      {pages?.map(
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
                      {pages.length && (
                        <ListItem>
                          <Button
                            aria-label={pages[selectedPage].lib}
                            variant="contained"
                            sx={{ width: '100%' }} // Ensure all buttons have equal width
                          >
                            {pages[selectedPage].lib}
                          </Button>
                        </ListItem>
                      )}
                      <ListItem>
                        <Link to="/dashboard/sessionAttRecList">
                          <Button
                            aria-label="Plus"
                            variant="text"
                            sx={{ width: '100%' }} // Ensure all buttons have equal width
                          >
                            Plus +
                          </Button>
                        </Link>
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
                        <Link to="/dashboard/sessionAttRecList">
                          <Button
                            aria-label="Plus"
                            variant="text"
                            sx={{ width: '100%' }} // Ensure all buttons have equal width
                          >
                            Plus +
                          </Button>
                        </Link>
                      </ListItem>
                    </List>
                  </Box>
                </Toolbar>
              </Container>
            </AppBar>
            <table className="table mb-0 text-nowrap table-centered">
              <tbody>
                {pages.length &&
                  pages[selectedPage].events?.map((event, index) => (
                    <tr
                      key={`${index}${selectedPage}`}
                      onClick={() => {
                        if (selectedRow?.id === event.id) {
                          setSelectedRow(null);
                        } else {
                          handleClick(event);
                        }
                      }}
                      style={{
                        backgroundColor: selectedRow?.id === event.id ? '#d0d7de' : 'white',
                      }}
                    >
                      <td>{event.title}</td>
                      <td className="text-end">
                        {event.start.slice(0, 5)} - {event.end.slice(0, 5)}
                      </td>
                      <td className="ps-0">
                        <Chip
                          label={event.isAchieved ? 'Enregistré' : 'Non-Enregistré'}
                          size="small"
                          color={!event.isAchieved ? 'error' : 'success'}
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontFamily: 'Arial',
                            fontWeight: 'bold',
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <div className="card" style={{ maxHeight: '500px' }}>
          {selectedRow != null ? (
            isError ? (
              <Paper
                sx={{
                  textAlign: 'center',
                  margin: '50px',
                }}
              >
                <Typography variant="h6" paragraph>
                  Une difficulté est survenue lors de la récupération des données de séance{' '}
                </Typography>
              </Paper>
            ) : (
              <div className="table-responsive table-card">
                <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
                  <Container maxWidth="xl">
                    <Toolbar>
                      {selectedRow.type === 'normal' ? (
                        <Link
                          style={{ color: 'black' }}
                          to={`/dashboard/ProgrameProfile/${selectedRow?.prog.id}`}
                        >
                          <Typography variant="h5" sx={{ flexGrow: 1 }}>
                            Programme
                            {selectedRow?.prog.name}- Groupe {selectedRow?.group.name}
                            <Iconify
                              icon={'akar-icons:link-out'}
                              sx={{ mr: 1 }}
                              style={{ marginLeft: '20px' }}
                            />
                          </Typography>
                        </Link>
                      ) : (
                        <Typography variant="h5" sx={{ flexGrow: 1 }}>
                          Séance privé
                        </Typography>
                      )}
                    </Toolbar>
                  </Container>
                </AppBar>
                {/* <table className="table mb-0 text-nowrap table-centered">
                  <tbody>
                    <div>
                      <List
                        sx={{
                          width: '100%',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <ListItem>
                          <FormGroup>
                            <ListItem>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectAllProfessors}
                                    onChange={handleSelectAllProfessors}
                                  />
                                }
                                label=""
                              />
                              <ListItemText
                                style={{ paddingLeft: '16px' }}
                                primary={<Typography variant="h5">List Des Professeurs</Typography>}
                              />
                            </ListItem>
                            <Divider component="li" style={{ marginBottom: '10px' }} />
                            <Grid container spacing={1} style={{ maxHeight: '200px' }}>
                              {professorCheckboxes?.map((checkbox, index) => (
                                <Grid
                                  item
                                  xs={12}
                                  md={(professorCheckboxes.length < 4 && 12) || 6}
                                  key={checkbox.id}
                                >
                                  <FormControlLabel
                                    key={checkbox.id}
                                    control={
                                      <Checkbox
                                        checked={checkbox.checked}
                                        onChange={() => handleCheckboxChange(index, false)}
                                      />
                                    }
                                    label={checkbox.label}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </FormGroup>
                        </ListItem>
                        <ListItem>
                          <FormGroup>
                            <ListItem>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectAllStudents}
                                    onChange={handleSelectAllStudents}
                                  />
                                }
                                label=""
                              />
                              <ListItemText
                                style={{ paddingLeft: '16px' }}
                                primary={<Typography variant="h5">List Des Professeurs</Typography>}
                              />
                            </ListItem>
                            <Divider component="li" style={{ marginBottom: '10px' }} />
                            <Grid container spacing={1} style={{ maxHeight: '200px' }}>
                              {studentCheckboxes?.map((checkbox, index) => (
                                <Grid
                                  item
                                  xs={12}
                                  md={(studentCheckboxes.length < 4 && 12) || 6}
                                  key={checkbox.id}
                                >
                                  <FormControlLabel
                                    key={checkbox.id}
                                    control={
                                      <Checkbox
                                        checked={checkbox.checked}
                                        onChange={() => handleCheckboxChange(index, true)}
                                      />
                                    }
                                    label={checkbox.label}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </FormGroup>
                        </ListItem>

                        <ListItem>
                          <Button variant="contained" onClick={updateAttRecForSession}>
                            Submit
                          </Button>
                        </ListItem>
                      </List>
                    </div>
                  </tbody>
                </table> */}
                <table className="table mb-0 text-nowrap table-centered">
                  <tbody>
                    <div>
                      <List
                        sx={{
                          width: '100%',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <ListItem>
                          <FormGroup>
                            <ListItem>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectAllProfessors}
                                    onChange={handleSelectAllProfessors}
                                  />
                                }
                                label=""
                              />
                              <ListItemText
                                style={{ paddingLeft: '16px' }}
                                primary={<Typography variant="h5">List Des Professeurs</Typography>}
                              />
                            </ListItem>
                            <Divider component="li" style={{ marginBottom: '10px' }} />
                            <Grid container spacing={1} style={{ maxHeight: '200px' }}>
                              {professorCheckboxes?.map((checkbox, index) => (
                                <Grid
                                  item
                                  xs={12}
                                  md={(professorCheckboxes.length < 4 && 12) || 6}
                                  key={checkbox.id}
                                >
                                  <FormControlLabel
                                    key={checkbox.id}
                                    control={
                                      <Checkbox
                                        checked={checkbox.checked}
                                        onChange={() => handleCheckboxChange(index, false)}
                                      />
                                    }
                                    label={checkbox.label}
                                  />
                                  <Link
                                    style={{ color: 'blue' }}
                                    to={`/dashboard/teacherProfile/${checkbox.id}`}
                                  >
                                    <Iconify
                                      icon={'akar-icons:link-out'}
                                      sx={{ mr: 1 }}
                                      style={{ marginLeft: '20px' }}
                                    />
                                  </Link>
                                </Grid>
                              ))}
                            </Grid>
                          </FormGroup>
                        </ListItem>
                        <ListItem>
                          <FormGroup>
                            <ListItem>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectAllStudents}
                                    onChange={handleSelectAllStudents}
                                  />
                                }
                                label=""
                              />
                              <ListItemText
                                style={{ paddingLeft: '16px' }}
                                primary={<Typography variant="h5">List Des Étudiants</Typography>}
                              />
                            </ListItem>
                            <Divider component="li" style={{ marginBottom: '10px' }} />
                            <Grid container spacing={1} style={{ maxHeight: '200px' }}>
                              {studentCheckboxes?.map((checkbox, index) => (
                                <Grid
                                  item
                                  xs={12}
                                  md={(studentCheckboxes.length < 4 && 12) || 6}
                                  key={checkbox.id}
                                >
                                  <FormControlLabel
                                    key={checkbox.id}
                                    control={
                                      <Checkbox
                                        checked={checkbox.checked}
                                        onChange={() => handleCheckboxChange(index, true)}
                                      />
                                    }
                                    label={checkbox.label}
                                  />
                                  <Link
                                    style={{ color: 'blue' }}
                                    to={`/dashboard/studentProfile/${checkbox.id}`}
                                  >
                                    <Iconify
                                      icon={'akar-icons:link-out'}
                                      sx={{ mr: 1 }}
                                      style={{ marginLeft: '20px' }}
                                    />
                                  </Link>
                                </Grid>
                              ))}
                            </Grid>
                          </FormGroup>
                        </ListItem>

                        <ListItem>
                          <Button variant="contained" onClick={updateAttRecForSession}>
                            Submit
                          </Button>
                        </ListItem>
                      </List>
                    </div>
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <Paper
              sx={{
                textAlign: 'center',
                margin: '50px',
              }}
            >
              <Typography variant="h6" paragraph>
                Il n'y a pas de séance sélectionnée
              </Typography>
            </Paper>
          )}
        </div>
      </Grid>
    </>
  );
}

export default SessionAttRec;
