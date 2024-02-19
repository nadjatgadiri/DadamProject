import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
// @mui
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Collapse,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  TableHead,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import '../Programme/theme.css';
import { Buffer } from 'buffer';
import { getGroups } from '../../RequestManagement/groupManagement';
import { getAllSessionsForStudent } from '../../RequestManagement/sessionsManagement';
import { getStudentHistory, getStudent } from '../../RequestManagement/studentManagement';
import { getSessionAttRecForStuent } from '../../RequestManagement/sessionAttRecManagement';
import { getStudentBills, getUnpaidBills } from '../../RequestManagement/billsManagement';

import MyCalendar from '../Programme/calendar/calendar';
import useResponsive from '../../hooks/useResponsive';
// components
import Iconify from '../../components/iconify';

const StudentProfile = () => {
  const isDesktop = useResponsive('up', 'sm');
  const { id } = useParams();
  const [userData, setUserData] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [files, setFiles] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [bills, setBills] = useState([]);
  const [unpaidBills, setUnpaidBills] = useState({});
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([
    { label: 'Phone', value: '' },
    { label: 'Email', value: '' },
    { label: 'Date of Birth', value: '' },
    // Add more data as needed
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

  const fetchSessionData = async () => {
    const result3 = await getAllSessionsForStudent(id);
    if (result3.code === 200) {
      setEvents(result3.events);
    }
  };
  const openDocument = (data) => {
    // Create a blob from the data
    const blob = new Blob([Buffer.from(data.data)], { type: data.type });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    // Open the URL in a new tab
    window.open(url, '_blank');
  };
  useEffect(() => {
    const fetchData = async () => {
      const result2 = await getGroups();
      if (result2.code === 200) {
        const data = await result2.groups.map((group) => ({
          id: group.ID_ROWID,
          name: group.GroupeName,
        }));
        setGroups(ColorGenerator(data));
      }
      const result3 = await getAllSessionsForStudent(id);
      if (result3.code === 200) {
        setEvents(result3.events);
      }
      // user Data
      const usersData1 = await getStudent(id);
      const usersData = usersData1.student;
      const image =
        usersData.personProfile2.imagePath !== null && usersData.personProfile2.imagePath !== ''
          ? `data:image/jpeg;base64,${Buffer.from(usersData.personProfile2.imagePath).toString(
              'base64'
            )}`
          : '../../assets/images/avatars/avatar_10.jpg';

      const user = {
        id: usersData.ID_ROWID,
        name: `${usersData.personProfile2.firstName} ${usersData.personProfile2.lastName}`,
        code: usersData.studentCode,
        image, // shorthand notation for image: image
      };
      setData([
        { label: 'Téléphone', value: usersData.personProfile2.phoneNumber },
        { label: 'Email', value: usersData.personProfile2.mail },
        { label: 'Date de naissance', value: usersData.personProfile2.dateOfBirth },
        { label: "Niveau d'étude", value: usersData.studentLevel?.educationalLevel?.lib },
        { label: "Année d'étude", value: usersData.studentLevel?.studyYear?.lib },
      ]);
      setFiles(usersData1.files);

      setUserData(user); // Putting user in an array, assuming setUserData expects an array
      // history
      const result4 = await getStudentHistory(id);
      if (result4.code === 200) {
        const history = result4.mergedList;
        await history.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistoryData(history);
      }

      // get student session recoreding
      const resultSessionAttRec = await getSessionAttRecForStuent(id);
      if (resultSessionAttRec.code === 200) {
        setSessions(resultSessionAttRec.sessionAttRec);
      }
      // get student bills
      const resultStudentBills = await getStudentBills(id);
      if (resultStudentBills.code === 200) {
        setBills(resultStudentBills.bills);
      }
      // get student unpaid bills
      const resultStudentUnpaidBills = await getUnpaidBills(id);
      if (resultStudentUnpaidBills.code === 200) {
        handleSumTotal(resultStudentUnpaidBills.unpaidBills);
        setUnpaidBills(resultStudentUnpaidBills.unpaidBills);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this effect runs once when component mounts
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
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // checkBox handels

  const handleSelectSession = (progID, sessionIndex) => {
    const updatedUnpaidBills = { ...unpaidBills };

    if (updatedUnpaidBills[progID]) {
      const program = updatedUnpaidBills[progID];

      // Toggle isChecked for the event
      program.events = program.events.map((event) => {
        if (event.id === sessionIndex) {
          return { ...event, isChecked: !event.isChecked };
        }
        return event;
      });

      // Check if all events are checked or not
      program.isChecked = program.events.every((event) => event.isChecked);

      setUnpaidBills(updatedUnpaidBills);
      handleSumMontant();
    }
  };
  const handleSelectProgram = (progID) => {
    const updatedUnpaidBills = { ...unpaidBills };

    if (updatedUnpaidBills[progID]) {
      const program = updatedUnpaidBills[progID];

      if (program.type !== 'Total') {
        // Toggle isChecked for the event
        program.events = program.events.map((event) => {
          return { ...event, isChecked: !program.isChecked };
        });
      }
      program.isChecked = !program.isChecked;

      setUnpaidBills(updatedUnpaidBills);
      handleSumMontant();
    }
  };
  // calculate montant general
  const handleSumMontant = () => {
    const updatedUnpaidBills = { ...unpaidBills };

    Object.keys(updatedUnpaidBills).forEach((programId) => {
      const program = updatedUnpaidBills[programId];
      let montant = 0;
      let total = 0;
      if (program.type === 'Total' && program.isChecked) {
        montant = program.prix;
      } else if (program.type !== 'Total') {
        // Filter events where isChecked is true
        const checkedEvents = program.events.filter((event) => event.isChecked);
        // Calculate montant based on prix * number of checked events
        montant = program.prix * checkedEvents.length;
      }
      // Update the montant for the program
      program.montant = montant;
      program.quantite = program.events.filter((event) => event.isChecked).length;
      total += montant;
      setTotal(total);
    });

    setUnpaidBills(updatedUnpaidBills);
  };
  const handleSumTotal = (data) => {
    const updatedUnpaidBills = { ...data };

    Object.keys(updatedUnpaidBills).forEach((programId) => {
      const program = updatedUnpaidBills[programId];
      let montant = 0;
      let total = 0;
      if (program.type === 'Total' && program.isChecked) {
        montant = program.prix;
      } else if (program.type !== 'Total') {
        // Filter events where isChecked is true
        const checkedEvents = program.events.filter((event) => event.isChecked);
        // Calculate montant based on prix * number of checked events
        montant = program.prix * checkedEvents.length;
      }
      total += montant;
      setTotal(total);
    });
  };
  return (
    <>
      <Helmet>
        <title> Utilisateurs</title>
      </Helmet>

      <Container className="app-content-area">
        <div className="col-xl-12 col-lg-12 col-md-12 col-12">
          {/* <!-- Bg --> */}
          <div
            className="pt-20 rounded-top"
            style={{
              background: `url('../../../assets/images/covers/cover_9.jpg')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat', // Adding 'no-repeat' to prevent repetition
            }}
          />
          <div className="card rounded-bottom rounded-0 smooth-shadow-sm mb-5">
            <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
              <div className="d-flex align-items-center ">
                {/* <!-- avatar --> */}
                <div className="avatar-xxl  me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                  <img
                    src={userData.image}
                    className="avatar-xxl rounded-circle border border-2 "
                    alt=""
                  />
                </div>
                {/* <!-- text --> */}

                <div className="row">
                  <div className="col-lg-12 col-md-12 col-12">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                      <div className="mb-2 mb-lg-0">
                        <Typography className="mb-0 " variant="h3">
                          {userData.name}
                        </Typography>
                        <p className="mb-0 d-block">{userData.code}</p>
                      </div>
                      {/* Button aligned to the bottom-right */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="lh-1 align-self-end ml-auto">
                <Link to={`/dashboard/updateStudent/${id}`}>
                  <Button variant="contained">Modifier</Button>
                </Link>
              </div>
            </div>
            {/* <!-- nav --> */}
          </div>
        </div>
        <div className="row">
          {/* info general */}
          <div className="col-xl-5 col-lg-12 col-md-12 col-12 mb-5">
            {/* <!-- card --> */}
            <div className="card">
              {/* <!-- card body --> */}
              <div className="card-header">
                <Typography className="mb-0 " variant="h6">
                  À propos de moi
                </Typography>
              </div>
              {/* <!-- row --> */}
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
          {/* end info general */}
          {/* list des documment */}
          <div className="col-xl-7 col-lg-12 col-md-12 col-12 mb-5">
            {/* <!-- card --> */}
            <div className="card" style={{ height: '345px' }}>
              {/* <!-- card body --> */}
              <div className="card-header">
                <Typography className="mb-0 " variant="h6">
                  Document
                </Typography>
              </div>
              {/* <!-- row --> */}
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                <Table aria-label="simple table">
                  <TableBody>
                    {files.map((row, index) => (
                      <TableRow key={index} onClick={() => openDocument(row)}>
                        <TableCell component="th" scope="row" style={{ color: 'blue' }}>
                          {row.name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          {/* end list des documment */}
          {/* list des bills */}
          <div className="col-xl-5 col-lg-12 col-md-12 col-12 mb-5">
            {/* <!-- card --> */}
            <div className="card" style={{ height: '345px' }}>
              {/* <!-- card body --> */}
              <div className="card-header">
                <Typography className="mb-0 " variant="h6">
                  Factures
                </Typography>

                <Button variant="outlined" onClick={handleClickOpen}>
                  Ajouter une facture
                </Button>
              </div>
              {/* <!-- row --> */}
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                {bills.length !== 0 ? (
                  <Table aria-label="simple table">
                    <TableBody>
                      {bills?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell noWrap>
                            <Typography variant="subtitle1">{row.totalAmount} DA</Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="subtitle2" noWrap>
                              {formatDate2(row.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {/* telecharger facture  */}
                            <Button variant="contained">Télecharge</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography style={{ padding: '20px' }} variant="h6" paragraph>
                    Aucune facture n'a été affectée.
                  </Typography>
                )}
              </TableContainer>
            </div>
          </div>
          {/* end list des bills */}
          {/* list des séance */}
          <div className="col-xl-7 col-lg-12 col-md-12 col-12 mb-5">
            {/* <!-- card --> */}
            <div className="card" style={{ height: '345px' }}>
              {/* <!-- card body --> */}
              <div className="card-header">
                <Typography className="mb-0 " variant="h6">
                  Enregistrements des Participation
                </Typography>
              </div>
              {/* <!-- row --> */}
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                {sessions.length !== 0 ? (
                  <Table aria-label="simple table">
                    <TableBody>
                      {sessions?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell noWrap>
                            <Typography variant="subtitle1">
                              {row.title}
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
          {/* end list des séance */}
          {/* list de vos activiter */}
          <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-5">
            {/* <!-- card --> */}
            <div className="card" style={{ height: '345px' }}>
              <div className="card-header">
                <Typography className="mb-0 " variant="h6">
                  Historique
                </Typography>
              </div>
              {/* <!-- card body --> */}
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                <Table aria-label="simple table">
                  <TableBody>
                    {historyData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <img src={`../../../assets/svg/${data.logo}`} alt="data.id" width={20} />
                        </TableCell>
                        <TableCell>
                          {data.type !== 'AccountCreation' ? (
                            <>
                              <Typography variant="subtitle2" noWrap>
                                {data.title}
                                <Link
                                  style={{ color: 'blue' }}
                                  to={`/dashboard/ProgrameProfile/${data.progID}`}
                                >
                                  <Iconify
                                    icon={'akar-icons:link-out'}
                                    sx={{ mr: 1 }}
                                    style={{ marginLeft: '20px' }}
                                  />
                                </Link>
                              </Typography>
                            </>
                          ) : (
                            data.title
                          )}
                        </TableCell>
                        <TableCell>{formatDate(data.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          {/* end de vos activiter */}
        </div>
        {/* calandrier */}
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-12">
            {/* <!-- card --> */}
            <div className="card" style={{ height: isDesktop ? '650px' : '750px' }}>
              <MyCalendar colorMap={groups} events={events} fetchEvents={fetchSessionData} />
            </div>
          </div>
        </div>
        {/* end */}
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: 'left' }}>
          Facture <Box sx={{ flexGrow: 1 }} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
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
                </TableRow>
              </TableBody>
            </Table>
            <Table maxWidth="300px">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '40%' }}>Programme</TableCell>
                  <TableCell sx={{ width: '15%' }}>Prix</TableCell>
                  <TableCell sx={{ width: '15%' }}>Quantité</TableCell>
                  <TableCell sx={{ width: '30%' }}>Montant Total</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(unpaidBills).map((key) => {
                  const data = unpaidBills[key];
                  return <Row data={data} />;
                })}
              </TableBody>
            </Table>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
  function Row(props) {
    const { data } = props;
    const [open, setOpen] = useState(data.type !== 'Total');
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
          <TableCell>{data.prix} DA</TableCell>
          <TableCell>{data.type !== 'Total' ? data.quantite : 'Total'}</TableCell>
          <TableCell>{data.montant} DA</TableCell>
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
                  ${event.end.slice(0, 5)} 
                  ${formatDate2(event.date)}`}
                            />
                          </TableCell>
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

export default StudentProfile;
