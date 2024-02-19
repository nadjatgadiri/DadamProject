import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Chip,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Grid,
  FormGroup,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';

// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// sections
// import { SessionListHead } from '../sections/@dashboard/user/SessionListHead'; //
import { SessionListToolbar, SessionListHead } from '../sections/@dashboard/user'; //

// to load data
import { getAllSessionsInLastDays } from '../RequestManagement/sessionsManagement'; //
import {
  updateSessionAttendanceRecording,
  getSessionAttendanceRecording,
} from '../RequestManagement/sessionAttRecManagement';

const TABLE_HEAD = [
  { id: 'programme', label: 'Programme', alignRight: false },
  { id: 'groupe', label: 'Groupe', alignRight: false },
  { id: 'salle', label: 'Salle', alignRight: false },
  { id: 'periode', label: 'Période', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  // Add additional columns as needed
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.date.indexOf(query) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('fr-FR', options);
}
export default function SessionAttRecPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  //   const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [isError, setIsError] = useState(false);
  const [selectAllStudents, setSelectAllStudents] = useState(false);
  const [selectAllProfessors, setSelectAllProfessors] = useState(false);
  const [studentCheckboxes, setStudentCheckboxes] = useState([]);
  const [professorCheckboxes, setProfessorCheckboxes] = useState([]);
  /* start load data */
  const [data, setData] = useState([]);

  const handleClick = async (event) => {
    setSelectedRow(event);

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
      const card = document.getElementById('sessionDetailsCard');
      card.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsError(true);
    }
  };
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
  const updateAttRecForSession = async () => {
    const studentAttRec = studentCheckboxes.filter((student) => student.checked);
    const teacherAttRes = professorCheckboxes.filter((teacher) => teacher.checked);

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
  };
  const updatePage = async () => {
    const result = await getAllSessionsInLastDays();
    if (result.code === 200) {
      setData(result.events);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllSessionsInLastDays();
      if (result.code === 200) {
        setData(result.events);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once when component mounts
  /* end load data */

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const onDateChange = (event) => {
    setPage(0);
    setSelectedDate(event.target.value);
    console.log(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredData = applySortFilter(data, getComparator(order, orderBy), selectedDate);

  const isNotFound = !filteredData.length && !!selectedDate;

  return (
    <>
      <Helmet>
        <title>Séances</title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Séances
          </Typography>
        </Stack>

        <Card>
          {data.length === 0 ? (
            <Typography style={{ padding: '20px' }} variant="h6" paragraph>
              Aucun résultat n'a été trouvé.
            </Typography>
          ) : (
            <>
              <SessionListToolbar
                selectedDate={selectedDate}
                onDateChange={onDateChange}
                onClearDate={() => setSelectedDate('')}
              />
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <SessionListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      {filteredData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const { id, title, isAchieved, group, prog, salle, start, end, date } =
                            row;

                          return (
                            <TableRow
                              onClick={() => {
                                if (selectedRow?.id === id) {
                                  setSelectedRow(null);
                                } else {
                                  handleClick(row);
                                }
                              }}
                              style={{
                                backgroundColor: selectedRow?.id === id ? '#d0d7de' : 'white',
                              }}
                              hover
                              key={`${id}`}
                            >
                              <TableCell>
                                <Typography variant="subtitle2" noWrap>
                                  {prog.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" noWrap>
                                  {group.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" noWrap>
                                  {salle}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" noWrap>
                                  {start.slice(0, 5)} - {end.slice(0, 5)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" noWrap>
                                  {formatDate(date)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={isAchieved ? 'Enregistré' : 'Non-Enregistré'}
                                  size="small"
                                  color={!isAchieved ? 'error' : 'success'}
                                  style={{
                                    color: 'white',
                                    fontSize: '14px',
                                    fontFamily: 'Arial',
                                    fontWeight: 'bold',
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                      {isNotFound && (
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <Paper sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" paragraph>
                                Résultat non trouvé
                              </Typography>
                              <Typography variant="body2">
                                aucun résultat trouvé pour &nbsp;
                                <strong>&quot;{selectedDate}&quot;</strong>.
                                <br /> Réssayez.
                              </Typography>
                            </Paper>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Card>
        {selectedRow != null && (
          <Card style={{ marginTop: 30 }} id="sessionDetailsCard">
            {isError ? (
              <Paper
                sx={{
                  textAlign: 'center',
                  margin: '50px',
                }}
              >
                <Typography variant="h6" paragraph>
                  Une difficulté est survenue lors de la récupération des données de session{' '}
                </Typography>
              </Paper>
            ) : (
              <div className="table-responsive table-card">
                <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
                  <Container maxWidth="xl" style={{ backgroundColor: '#f6f8fa' }}>
                    <Toolbar>
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
                    </Toolbar>
                  </Container>
                </AppBar>
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
            )}
          </Card>
        )}
      </Container>
    </>
  );
}
