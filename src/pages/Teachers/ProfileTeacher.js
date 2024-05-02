import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
// @mui
import {
  Typography,
  Container,
  Collapse,
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import '../Programme/theme.css';
import { Buffer } from 'buffer';
import { getTeacherData } from '../../RequestManagement/teacherManagement'; // Import the function to fetch teacher data
import { getGroups } from '../../RequestManagement/groupManagement'; // Import the function to fetch group data
import { getAllSessionsForTeacher } from '../../RequestManagement/sessionsManagement';
import { getTeacherSessionAttendance } from '../../RequestManagement/sessionAttRecManagement';
import {
  getTeacherSalaires,
  getUnpaidSailare,
  payTeacherSalaire,
} from '../../RequestManagement/salaireManagment';
import MyCalendar from '../Programme/calendar/calendar'; //
import useResponsive from '../../hooks/useResponsive';

// components
import Iconify from '../../components/iconify';

const TeacherProfile = () => {
  const isDesktop = useResponsive('up', 'sm');
  const [groups, setGroups] = useState([]); // State to hold group data
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [salaires, setSalaires] = useState([]);
  const [unpaidSalaire, setUnpaidSalaire] = useState({});
  const [sessionsParticipated, setSessionsParticipated] = useState([]);
  const { id } = useParams();
  console.log(id);
  const [userData, setUserData] = useState('');
  // const [files, setFiles] = useState([' ']); // Commented out files related state
  const [data, setData] = useState([
    { label: 'Phone', value: '' },
    { label: 'Email', value: '' },
    { label: 'Date of Birth', value: '' },
    { label: 'Matier', value: '' }, // Added label for subject
  ]);
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false, // Use 24-hour format
    };
    return date.toLocaleDateString('fr-FR', options);
  }
  function formatDate2(inputDate) {
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
    // Fetch sessions participated by the teacher
    const sessionAttendanceResult = await getTeacherSessionAttendance(id);
    if (sessionAttendanceResult.code === 200) {
      setSessionsParticipated(sessionAttendanceResult.sessionAttRec);
      console.log(sessionAttendanceResult.sessionAttRec);
    }

    const result3 = await getAllSessionsForTeacher(id);
    console.log(result3);
    if (result3.code === 200) {
      setEvents(result3.events);
    }
    // Fetch teacher data
    const teacherData1 = await getTeacherData(id);
    const teacherData = teacherData1.teacher;
    console.log(teacherData);
    // Process teacher data
    const image =
      teacherData.personProfile2.imagePath !== null && teacherData.personProfile2.imagePath !== ''
        ? `data:image/jpeg;base64,${Buffer.from(teacherData.personProfile2.imagePath).toString(
            'base64'
          )}`
        : '../../assets/images/avatars/avatar_10.jpg';

    const user = {
      id: teacherData.ID_ROWID,
      name: `${teacherData.personProfile2.firstName} ${teacherData.personProfile2.lastName}`,
      image,
    };
    setData([
      { label: 'Téléphone', value: teacherData.personProfile2.phoneNumber },
      { label: 'Email', value: teacherData.personProfile2.mail },
      { label: 'Date de naissance', value: teacherData.personProfile2.dateOfBirth },
      { label: 'Matier', value: teacherData.subject }, // Set value for subject
      // Add more data fields if needed
    ]);
    // setFiles(teacherData.files); // Commented out files related state update
    console.log(user);
    setUserData(user);

    // Fetch groups data
    const result = await getGroups();
    if (result.code === 200) {
      const data = result.groups.map((group) => ({
        id: group.ID_ROWID,
        name: group.GroupeName,
      }));
      setGroups(ColorGenerator(data));
    }
    // get teacher salaire
    const resultTeacherSalaires = await getTeacherSalaires(id);
    console.log(resultTeacherSalaires);
    // if (resultTeacherSalaires.code === 200) {
    //   setBills(resultTeacherSalaires.salaire);
    // }
    // get teacher unpaid salaire
    const resultTeacherUnpaidSalaire = await getUnpaidSailare(id);
    if (resultTeacherUnpaidSalaire.code === 200) {
      //   await handleSumTotal(resultTeacherUnpaidSalaire.unpaidSalaire);
      await setUnpaidSalaire(resultTeacherUnpaidSalaire.unpaidSalaire);
      await handleSumMontant();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
  const handleSelectSession = async (id, sessionIndex) => {
    const updatedUnpaidSalaire = { ...unpaidSalaire };

    if (updatedUnpaidSalaire[id]) {
      const data = { ...updatedUnpaidSalaire[id] }; // Make a copy of data

      // Toggle isChecked for the event
      data.events = data.events.map((event) => {
        if (event.id === sessionIndex) {
          return { ...event, isChecked: !event.isChecked };
        }
        return event;
      });
      let q = 0;
      data.quantite = data.events.map((event) => {
        if (event.isChecked) {
          q += event.NumberOfAttendees;
        }
        return q;
      });
      data.totalAmount = data.amountByStudent * q;
      // Check if all events are checked or not
      data.isChecked = data.events.every((event) => event.isChecked);
      // Update the specific entry in updatedUnpaidSalaire
      updatedUnpaidSalaire[id] = data;
      setUnpaidSalaire(updatedUnpaidSalaire);

      handleSumMontant();
    }
  };
  // calculate montant general
  const handleSumMontant = () => {
    const updatedUnpaidSalaire = { ...unpaidSalaire };
    let total = 0;
    Object.keys(updatedUnpaidSalaire).forEach((id) => {
      const bill = updatedUnpaidSalaire[id];
      total += bill.totalAmount;
    });
    setTotal(total);
  };
  const handleSelectProgram = (id) => {
    const updatedUnpaidSalaire = { ...unpaidSalaire };

    if (updatedUnpaidSalaire[id]) {
      const data = { ...updatedUnpaidSalaire[id] }; // Make a copy of data

      data.events = data.events.map((event) => {
        return { ...event, isChecked: !data.isChecked };
      });
      data.isChecked = !data.isChecked;
      let q = 0;
      data.quantite = data.events.map((event) => {
        if (event.isChecked) {
          q += event.NumberOfAttendees;
        }
        return q;
      });
      data.totalAmount = data.amountByStudent * q;
      // Update the specific entry in updatedUnpaidSalaire
      updatedUnpaidSalaire[id] = data;
      setUnpaidSalaire(updatedUnpaidSalaire);
      handleSumMontant();
    }
  };
  const payTeacherSalaire = async () => {
    const data = {
      teacherID: id,
      paimentRecord: unpaidSalaire,
      total,
    };
    console.log(data);
    const result = await payTeacherSalaire(data);

    if (result.code === 200) {
      // get teacher salaire
      const resultTeacherSalaires = await getTeacherSalaires(id);
      console.log(resultTeacherSalaires);
      // if (resultTeacherSalaires.code === 200) {
      //   setBills(resultTeacherSalaires.salaire);
      // }
      // get teacher unpaid salaire
      const resultTeacherUnpaidSalaire = await getUnpaidSailare(id);
      if (resultTeacherUnpaidSalaire.code === 200) {
        //   await handleSumTotal(resultTeacherUnpaidSalaire.unpaidSalaire);
        await setUnpaidSalaire(resultTeacherUnpaidSalaire.unpaidSalaire);
        await handleSumMontant();
      }
      // Fetch sessions participated by the teacher
      const sessionAttendanceResult = await getTeacherSessionAttendance(id);
      if (sessionAttendanceResult.code === 200) {
        setSessionsParticipated(sessionAttendanceResult.sessionAttRec);
        console.log(sessionAttendanceResult.sessionAttRec);
      }
    }
  };
  return (
    <>
      <Helmet>
        <title>Profil de l'enseignant</title>
      </Helmet>

      <Container className="app-content-area">
        <div className="col-xl-12 col-lg-12 col-md-12 col-12">
          {/* Background */}
          <div
            className="pt-20 rounded-top"
            style={{
              background: `url('../../../assets/images/covers/cover_9.jpg')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="card rounded-bottom rounded-0 smooth-shadow-sm mb-5">
            <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
              <div className="d-flex align-items-center">
                <div className="avatar-xxl me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                  <img
                    src={userData.image}
                    className="avatar-xxl rounded-circle border border-2"
                    alt=""
                  />
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-12">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                      <div className="mb-2 mb-lg-0">
                        <Typography className="mb-0" variant="h3">
                          {userData.name}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-5 col-lg-12 col-md-12 col-12 mb-5">
            <div className="card">
              <div className="card-header">
                <Typography className="mb-0" variant="h6">
                  À propos de moi
                </Typography>
              </div>
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                <Table aria-label="simple table">
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.label}
                        </TableCell>
                        <TableCell>{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          {/* List des séances */}
          <div className="col-xl-7 col-lg-12 col-md-12 col-12 mb-5">
            <div className="card" style={{ height: '345px' }}>
              <div className="card-header">
                <Typography className="mb-0" variant="h6">
                  Enregistrements des Participations
                </Typography>
              </div>
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                {sessionsParticipated.length !== 0 ? (
                  <Table aria-label="simple table">
                    <TableBody>
                      {sessionsParticipated.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell noWrap>
                            <Typography variant="subtitle1">
                              {row.title}
                              {row.type === 'normal' && (
                                <Link
                                  style={{ color: 'blue' }}
                                  to={`/dashboard/ProgrameProfile/${row.prog.id}`}
                                >
                                  <Iconify
                                    icon={'akar-icons:link-out'}
                                    sx={{ mr: 1 }}
                                    style={{ marginLeft: '20px' }}
                                  />
                                </Link>
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" noWrap>
                              {row?.start?.slice(0, 5)} - {row?.end?.slice(0, 5)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" noWrap>
                              {formatDate2(row.date)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={!row.isPaid ? 'non payé' : 'déjà payé'}
                              size="medium"
                              color={!row.isPaid ? 'error' : 'success'}
                              style={{
                                color: 'white',
                                fontSize: '14px',
                                fontFamily: 'Arial',
                                fontWeight: 'bold',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography style={{ padding: '20px' }} variant="h6" paragraph>
                    Aucune Séance n'a été enregistrée.
                  </Typography>
                )}
              </TableContainer>
            </div>
          </div>

          {/* Statistiques */}
          <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-5">
            <div className="card">
              <div className="card-header">
                <Typography className="mb-0" variant="h6">
                  Statistiques des Séances
                </Typography>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <div className="card d-flex justify-content-center align-items-center">
                      <div className="card-body text-center">
                        <Typography variant="subtitle1">Nombre de Séances associées</Typography>
                        <Typography variant="h5" style={{ color: '#17a2b8', lineHeight: '3rem' }}>
                          {events.length}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card d-flex justify-content-center align-items-center">
                      <div className="card-body text-center">
                        <Typography variant="subtitle1">Nombre de Séances Présentées</Typography>
                        <Typography variant="h5" style={{ color: '#28a745', lineHeight: '3rem' }}>
                          {sessionsParticipated.length}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card d-flex justify-content-center align-items-center">
                      <div className="card-body text-center">
                        <Typography variant="subtitle1">Nombre de Séances Payées</Typography>
                        <Typography variant="h5" style={{ color: '#28a745', lineHeight: '3rem' }}>
                          {sessionsParticipated.filter((session) => session.isPaid).length}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card d-flex justify-content-center align-items-center">
                      <div className="card-body text-center">
                        <Typography variant="subtitle1">Nombre de Séances Non Payées</Typography>
                        <Typography variant="h5" style={{ color: '#dc3545', lineHeight: '3rem' }}>
                          {sessionsParticipated.filter((session) => !session.isPaid).length}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Paiment de Salaire Form */}
          <div className="col-xl-7 col-lg-12 col-md-12 col-12 mb-5">
            <div className="card" style={{ height: '500px' }}>
              <div className="card-header">
                <Typography className="mb-0" variant="h6">
                  Enregistrements des Participations
                </Typography>
              </div>
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                <Table>
                  <TableBody>
                    <TableRow style={{ position: 'sticky', top: 0, backgroundColor: '#eaeef2' }}>
                      <TableCell>
                        <Typography variant="h6">Total</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" color="primary">
                          {total} DA
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button onClick={payTeacherSalaire} autoFocus>
                          Affectée
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Table maxWidth="300px">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '40%' }}>Programme</TableCell>
                      <TableCell sx={{ width: '25%' }}>Montant Par Person</TableCell>
                      <TableCell sx={{ width: '15%' }}>Quantité</TableCell>
                      <TableCell sx={{ width: '15%' }}>Montant Total</TableCell>
                      <TableCell align="right" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(unpaidSalaire).map((key) => {
                      const data = unpaidSalaire[key];
                      // return true;
                      return <Row data={data} />;
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          <div className="card-body">
            {/* Render your calendar component here */}
            <MyCalendar colorMap={groups} events={events} />
          </div>
        </div>
      </Container>
    </>
  );
  function Row(props) {
    const { data } = props;
    const [open, setOpen] = useState(data.eventT === 'normal' && data.type !== 'Total');
    return (
      <Fragment key={data.id}>
        <TableRow>
          <TableCell>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.isChecked}
                    onChange={() => handleSelectProgram(data.id)}
                  />
                }
                label={`Programme ${data.title}`}
              />
            </FormGroup>
          </TableCell>
          <TableCell>
            <TextField
              id="outlined-number"
              type="number"
              value={data.amountByStudent}
              onChange={async (e) => {
                const updatedUnpaidSalaire = { ...unpaidSalaire };
                if (updatedUnpaidSalaire[id]) {
                  const data = { ...updatedUnpaidSalaire[id] }; // Make a copy of data
                  data.amountByStudent = e.target.value;
                  data.totalAmount = data.amountByStudent * data.quantite;
                  // Update the specific entry in updatedUnpaidSalaire
                  updatedUnpaidSalaire[id] = data;
                  let total = 0;
                  Object.keys(updatedUnpaidSalaire).forEach((id) => {
                    const bill = updatedUnpaidSalaire[id];
                    total += bill.totalAmount;
                  });
                  setTotal(total);
                  setUnpaidSalaire(updatedUnpaidSalaire);
                }
              }}
              // InputLabelProps={{
              //   shrink: true,
              // }}
              fullWidth
            />
            {/* {data.amountByStudent} DA */}
          </TableCell>
          <TableCell>{data.quantite}</TableCell>
          <TableCell>{data.totalAmount} DA</TableCell>
          <TableCell>
            {data.type !== 'Total' && (
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Séance
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    {data.type !== 'Total' &&
                      data.events.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={event.isChecked}
                                  onChange={() => handleSelectSession(data.id, event.id)}
                                />
                              }
                              label={`${event.start.slice(0, 5)} - 
                      ${event.end.slice(0, 5)} le 
                      ${formatDate2(event.date)}`}
                            />
                          </TableCell>
                          <TableCell>{event.NumberOfAttendees} étudiants</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  }
};

export default TeacherProfile;
