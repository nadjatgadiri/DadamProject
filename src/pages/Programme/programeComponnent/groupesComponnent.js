import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';
import {
  OutlinedInput,
  Select,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  DialogTitle,
  Grid,
  Box,
  TextField,
  InputLabel,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// sections
import { UserListHead, UserListToolbarP } from '../../../sections/@dashboard/user';
// api importation
import { listTeachersForGroup } from '../../../RequestManagement/teacherManagement';
import { addGroupe, updateGroupe, deleteGroupe } from '../../../RequestManagement/groupManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nom', alignRight: false },
  { id: 'createdDate', label: 'Date De Creation', alignRight: false },
  { id: 'nbrPaces', label: 'Nombre De Places', alignRight: false },
  { id: 'teachers', label: 'Enseignantes', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

const blue = {
  100: '#daecff',
  200: '#b6daff',
  300: '#66b2ff',
  400: '#3399ff',
  500: '#007fff',
  600: '#0072e5',
  700: '#0059B2',
  800: '#004c99',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputRoot = styled('div')(
  ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 400;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[500]};
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  `
);

const StyledInput = styled('input')(
  ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.375;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${
      theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    };
    border-radius: 8px;
    margin: 0 8px;
    padding: 10px 12px;
    outline: 0;
    min-width: 0;
    width: 4rem;
    text-align: center;
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
    }
  
    &:focus-visible {
      outline: 0;
    }
  `
);

const StyledButton = styled('button')(
  ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    line-height: 1.5;
    border: 1px solid;
    border-radius: 999px;
    border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    width: 32px;
    height: 32px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      cursor: pointer;
      background: ${theme.palette.mode === 'dark' ? blue[700] : blue[500]};
      border-color: ${theme.palette.mode === 'dark' ? blue[500] : blue[400]};
      color: ${grey[50]};
    }
  
    &:focus-visible {
      outline: 0;
    }
  
    &.increment {
      order: 1;
    }
  `
);

/** table functions  */
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

function applySortFilter(array, comparator, query, filterGroup) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_cat) => _cat.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  if (filterGroup === 'aucun') {
    return filter(array, (item) => item.group === null);
  }
  if (filterGroup !== '') {
    return filter(array, (item) => item.group === filterGroup);
  }
  return stabilizedThis.map((el) => el[0]);
}
function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

/** end */
// multiselect
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const GroupesComponnent = (props) => {
  const { idProg, groups } = props; // Accessing id from props

  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [menuTargetRow, setMenuTargetRow] = useState(null);
  /* start load data */
  const [data, setData] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [filterGroup, setFilterGroup] = useState(''); // Add a state for the selected group filter
  const handleSortClick = (value) => {
    setFilterGroup(value);
  };
  /* -------------------------- */
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filtered = applySortFilter(data, getComparator(order, orderBy), filterName, filterGroup);

  const isNotFound = !filtered.length && !!filterName;
  /** ------------------------ */
  const [pieGroupData, setPieGroupData] = useState(null);
  /* -------------------------- */
  /** dialogs */
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  /** end */

  /** api */

  const fetchTeachersList = async () => {
    //  fetch teachers list
    const result = await listTeachersForGroup();
    if (result.code === 200) {
      const teachers = await Promise.all(
        result.teachers.map(async (teacher) => ({
          ID_ROWID: teacher.ID_ROWID,
          name: `${teacher.personProfile2.firstName} ${teacher.personProfile2.lastName}`, // Concatenating first name and last name
        }))
      );
      setTeachersList(teachers);
      console.log(result);
    } else {
      // when we got an error

      toast.error(`Error! + ${result.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  useEffect(() => {
    setData(groups);
    /** start Groups Pie */

    // Convert groupCounts into an array of objects
    const groupData = groups.map((group) => ({
      label: `Group ${group.name}`,
      value: group.nbrStudents,
    }));
    /** end Groups Pie */
    setPieGroupData(groupData);
  }, [groups]); // Supprimer fetchData du tableau de dépendances
  useEffect(() => {
    fetchTeachersList();
  }, []);
  /** end api */

  // multiselect
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const [title, setTitle] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormOpen2, setIsFormOpen2] = useState(false);
  const [capacity, setCapacity] = useState(0);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    // Assuming 'teachersList' is an array of objects with 'ID_ROWID' as the unique identifier
    const selectedTeacherIDs = typeof value === 'string' ? value.split(',') : value;

    // Now 'selectedTeacherIDs' contains an array of selected teacher IDs.
    setPersonName(selectedTeacherIDs);
    // You can use 'selectedTeacherIDs' for any further processing.
    console.log(personName);
  };
  const NumberInput = React.forwardRef((props, ref) => {
    return (
      <BaseNumberInput
        slots={{
          root: StyledInputRoot,
          input: StyledInput,
          incrementButton: StyledButton,
          decrementButton: StyledButton,
        }}
        slotProps={{
          incrementButton: {
            children: <AddIcon fontSize="small" />,
            className: 'increment',
          },
          decrementButton: {
            children: <RemoveIcon fontSize="small" />,
          },
        }}
        {...props}
        value={capacity}
        onChange={(event, val) => setCapacity(val)}
        ref={ref}
      />
    );
  });
  /** add Groups */
  const handleSubmit = async (e) => {
    setFeedback('');
    e.preventDefault();

    if (!capacity) {
      setFeedback('la capacity est obligatoire!');
    } else {
      const body = {
        GroupeName: title,
        capacity,
        teachers: personName,
        progID: idProg,
      };
      try {
        const response = await addGroupe(body);
        if (response && response.code === 200) {
          toast.success(`Le goupe est ajouté avec succès!`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setCapacity(0);
          setTitle('');
          setPersonName([]);
          setFeedback('');
          await props.updateData();
        } else {
          setFeedback(response.message || "Erreur lors de l'ajout du groupe.");
        }
      } catch (error) {
        setFeedback(error.message || "Une erreur s'est produite. Veuillez réessayer.");
      }
    }
  };

  const handleSubmitUpdate = async (e) => {
    setFeedback('');
    e.preventDefault();

    if (!capacity) {
      setFeedback('la capacity est obligatoire!');
    } else {
      const body = {
        GroupeName: title,
        capacity,
        teachers: personName,
        progID: idProg,
      };
      try {
        const response = await updateGroupe(body, menuTargetRow.id);
        if (response && response.code === 200) {
          await props.updateData();
          toast.success(`Le goupe a été modifier avec succès!`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setCapacity(0);
          setTitle('');
          setPersonName([]);
          setFeedback('');

          setIsFormOpen2(false);
        } else {
          setFeedback(response.message || 'Erreur lors de la modife du groupe.');
        }
      } catch (error) {
        setFeedback(error.message || "Une erreur s'est produite. Veuillez réessayer.");
      }
    }
  };
  /** end  */
  /** dialog handdel */

  // delete
  const handleDeleteClick = (student) => {
    setMenuTargetRow(student);
    setIsDialogOpen(true);
  };
  const handleDeleteClick2 = () => {
    setIsDialogOpen2(true);
  };
  const handleCancelClick = () => {
    setIsDialogOpen(false);
  };
  const handleCancelClick2 = () => {
    setIsDialogOpen2(false);
  };
  const handleConfirmClick = async () => {
    if (menuTargetRow && menuTargetRow.id) {
      onSubmitDeleteProgram(menuTargetRow.id);
    }
    setIsDialogOpen(false); // close the dialog after deleting
    setMenuTargetRow(null); // reset the target row
    await props.updateData();
  };
  const handleConfirmClick2 = () => {
    onSubmitDeleteMultiple();
    setIsDialogOpen2(false); // close the dialog after deleting
  };
  /** end */
  /** submit */
  const onSubmitDeleteProgram = async (groupId) => {
    try {
      const response = await deleteGroupe(groupId);

      if (response.code === 200) {
        // Delete was successful, now remove the cat from your local state
        await props.updateData();
        toast.success(`Le groupe est bien supprimer.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error(`Error! + ${response.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error('Error deleting group:', response.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  const onSubmitDeleteMultiple = async () => {
    // Using Promise.all to make simultaneous delete requests for each selected student
    await Promise.all(selected.map((id) => onSubmitDeleteProgram(id)));
    setSelected([]); // Clear the selection after deleting
    await props.updateData();
  };
  /** end submit */
  /** default used */

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  /** end */

  return (
    <>
      {isFormOpen && (
        <>
          <div className="col-md-12 col-xl-12 col-12">
            <div className="row">
              {/* <!-- card --> */}
              <div className="col-md-12 mb-5">
                <div
                  className="card"
                  style={{
                    padding: '20px',
                  }}
                >
                  <IconButton
                    style={{ position: 'absolute', top: 0, right: 0 }}
                    aria-label="close"
                    onClick={() => {
                      setIsFormOpen(false);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                      <Grid item xs={3.5}>
                        <InputLabel htmlFor="role" style={{ paddingBottom: '10px' }}>
                          Groupe Name
                        </InputLabel>
                        <TextField
                          name="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={0.25} />
                      <Grid item xs={2}>
                        <InputLabel htmlFor="role" style={{ paddingBottom: '10px' }}>
                          Nombre De Place
                        </InputLabel>
                        <NumberInput aria-label="Quantity Input" min={0} />
                      </Grid>
                      <Grid item xs={0.25} />
                      <Grid item className="col-sm-5 col-md-6">
                        <InputLabel htmlFor="role" style={{ paddingBottom: '10px' }}>
                          Les Enseignantes
                        </InputLabel>
                        <Select
                          style={{ width: '100%' }}
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          multiple
                          value={personName}
                          onChange={handleChange}
                          input={<OutlinedInput />}
                          MenuProps={MenuProps}
                        >
                          {teachersList.map((teacher) => (
                            <MenuItem
                              key={teacher.ID_ROWID}
                              value={teacher.ID_ROWID}
                              style={getStyles(teacher.name, personName, theme)}
                            >
                              {teacher.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="error">
                        {feedback}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
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
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {isFormOpen2 && (
        <>
          <div className="col-md-12 col-xl-12 col-12">
            <div className="row">
              {/* <!-- card --> */}
              <div className="col-md-12 mb-5">
                <div
                  className="card"
                  style={{
                    padding: '20px',
                  }}
                >
                  <IconButton
                    style={{ position: 'absolute', top: 0, right: 0 }}
                    aria-label="close"
                    onClick={() => {
                      setIsFormOpen2(false);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <form onSubmit={handleSubmitUpdate}>
                    <Grid container spacing={1}>
                      <Grid item xs={3.5}>
                        <InputLabel htmlFor="role" style={{ paddingBottom: '10px' }}>
                          Groupe Name
                        </InputLabel>
                        <TextField
                          name="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={0.25} />
                      <Grid item xs={2}>
                        <InputLabel htmlFor="role" style={{ paddingBottom: '10px' }}>
                          Nombre De Place
                        </InputLabel>
                        <NumberInput aria-label="Quantity Input" min={0} />
                      </Grid>
                      <Grid item xs={0.25} />
                      <Grid item className="col-sm-5 col-md-6">
                        <InputLabel htmlFor="role" style={{ paddingBottom: '10px' }}>
                          Les Enseignantes
                        </InputLabel>
                        <Select
                          style={{ width: '100%' }}
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          multiple
                          value={personName}
                          onChange={handleChange}
                          input={<OutlinedInput />}
                          MenuProps={MenuProps}
                        >
                          {teachersList.map((teacher) => (
                            <MenuItem
                              key={teacher.ID_ROWID}
                              value={teacher.ID_ROWID}
                              style={getStyles(teacher.name, personName, theme)}
                            >
                              {teacher.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="error">
                        {feedback}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                      <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                        <Button
                          type="submit"
                          variant="contained"
                          style={{ backgroundColor: 'blue', color: 'white' }}
                        >
                          Modifier
                        </Button>
                      </Box>
                    </Grid>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {!isFormOpen && !isFormOpen2 ? (
        !data.length ? (
          <>
            <div className="col-md-12 col-xl-12 col-12">
              <div className="row">
                <div className="col-md-12 mb-5">
                  <div
                    className="card bg-light-primary"
                    style={{
                      padding: '20px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <Typography variant="h6" paragraph>
                        Il n'y a pas des groupes
                      </Typography>
                      <Button
                        className=""
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => {
                          setIsFormOpen(true);
                        }}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-md-12 col-xl-8 col-12">
              <div className="row">
                <div className="col-md-12 mb-5">
                  {/* <!-- card --> */}
                  <div className="card">
                    {/* <!-- card body --> */}

                    <UserListToolbarP
                      title="Liste des groupes"
                      numSelected={selected.length}
                      filterName={filterName}
                      onFilterName={handleFilterByName}
                      onDeleteSelected={() => {
                        handleDeleteClick2();
                      }}
                      selectList={groups}
                      isFilterd={false}
                      onGroupSelected={(value) => {
                        handleSortClick(value);
                      }}
                    />
                    {/* <!-- table --> */}
                    <>
                      <Scrollbar>
                        <TableContainer sx={{ maxWidth: 790, height: 300 }}>
                          <Table>
                            <UserListHead
                              order={order}
                              orderBy={orderBy}
                              headLabel={TABLE_HEAD}
                              rowCount={filtered.length}
                              numSelected={selected.length}
                              onRequestSort={handleRequestSort}
                              onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                              {filtered
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                  const { id, name, teachers, createdAt, capacity } = row;

                                  return (
                                    <TableRow hover key={id}>
                                      <TableCell padding="checkbox">
                                        <Checkbox
                                          checked={selected.indexOf(id) !== -1}
                                          onChange={(event) => handleClick(event, id)}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Stack direction="row" alignItems="center">
                                          <Typography variant="subtitle2" noWrap>
                                            {name}
                                          </Typography>
                                        </Stack>
                                      </TableCell>
                                      <TableCell>{formatDate(createdAt)}</TableCell>
                                      <TableCell>{capacity}</TableCell>
                                      <TableCell>
                                        {teachers?.map((teacher, index) => (
                                          <span key={index}>{`${teacher.personProfile2.firstName} ${
                                            teacher.personProfile2.lastName
                                          }${index !== teachers.length - 1 ? ', ' : ''}`}</span>
                                        ))}
                                      </TableCell>

                                      <TableCell>
                                        <IconButton
                                          size="small"
                                          onClick={(e) => {
                                            handleOpenMenu(e);
                                            setMenuTargetRow(row);
                                          }}
                                        >
                                          <Iconify icon={'eva:more-vertical-fill'} />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                  <TableCell colSpan={6} />
                                </TableRow>
                              )}
                            </TableBody>

                            {isNotFound && (
                              <TableBody>
                                <TableRow>
                                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                    <Paper
                                      sx={{
                                        textAlign: 'center',
                                      }}
                                    >
                                      <Typography variant="h6" paragraph>
                                        Résultat non trouvé
                                      </Typography>

                                      <Typography variant="body2">
                                        aucun résultat trouvé ! &nbsp;
                                        <strong>&quot;{filterName}&quot;</strong>.
                                        <br /> Réssayez.
                                      </Typography>
                                    </Paper>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            )}
                          </Table>
                        </TableContainer>
                      </Scrollbar>

                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filtered.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-xl-4 col-12">
              <div className="card">
                {/* Card header */}
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{ height: '62px' }}
                >
                  <div>
                    <Typography className="mb-0 " variant="h6">
                      Les Abonnés Par Groupe
                    </Typography>
                  </div>
                </div>
                {/* Card body */}
                <div className="card-body">
                  {pieGroupData !== null ? (
                    <PieChart
                      series={[
                        {
                          paddingAngle: 1,
                          outerRadius: 90,
                          data: pieGroupData,
                        },
                      ]}
                      width={300}
                      height={265}
                      margin={{ top: 80, bottom: 10 }}
                      slotProps={{
                        legend: {
                          direction: 'row',
                          position: { vertical: 'top', horizontal: 'middle' },
                          itemMarkWidth: 20,
                          itemMarkHeight: 2,
                          markGap: 5,
                          itemGap: 10,
                          labelStyle: {
                            fontSize: 14,
                          },
                        },
                      }}
                    />
                  ) : null}
                  <Button
                    className=""
                    variant="contained"
                    style={{ width: '100%' }}
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => {
                      setIsFormOpen(true);
                    }}
                  >
                    Ajouter Groupe
                  </Button>
                </div>
              </div>
            </div>
          </>
        )
      ) : null}

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setTitle(menuTargetRow.name);
            setCapacity(menuTargetRow.capacity);
            const list = menuTargetRow.teachers.map((teacher) => teacher.ID_ROWID);
            setPersonName(list);
            setIsFormOpen2(true);
            handleCloseMenu();
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Modifier
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => {
            handleDeleteClick(menuTargetRow);
            handleCloseMenu();
          }}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Supprimer
        </MenuItem>
      </Popover>

      {/* dialog for deleting one item */}
      <Dialog open={isDialogOpen} onClose={handleCancelClick}>
        <DialogContent>
          <DialogTitle>Êtes-vous sûr de vouloir supprimer cet élément ?</DialogTitle>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmClick} color="error">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      {/* end */}
      {/* dialog for deleting many items */}
      <Dialog open={isDialogOpen2} onClose={handleCancelClick2}>
        <DialogContent>
          <DialogTitle>Êtes-vous sûr de vouloir supprimer ces éléments ?</DialogTitle>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick2} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmClick2} color="error">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      {/* end */}
    </>
  );
};
GroupesComponnent.propTypes = {
  idProg: PropTypes.string.isRequired,
  groups: PropTypes.array,
  updateData: PropTypes.func.isRequired,
};
export default GroupesComponnent;
