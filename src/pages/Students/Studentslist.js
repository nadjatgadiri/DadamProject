import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// @mui
import {
  Badge, Select, Card, Table, Stack, Paper, Avatar, Button, Popover, Checkbox, TableRow, MenuItem, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

// components
import { Buffer } from "buffer";
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';

// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user'; // 

// to load data 
import { getAllStudents, updateStudentData, deleteStudent } from '../../RequestManagement/studentManagement'; //

const TABLE_HEAD = [
  { id: '' },
  { id: 'name', label: 'Nom', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Numéro de téléphone', alignRight: false },
  { id: 'dateOfBirth', label: 'Date de naissance', alignRight: false },
  { id: 'status', label: 'Statut', alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function StudentPage() {
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 23,
    height: 23,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.background.paper}`,

  }));
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState('');
  const [editedStudent, setEditedStudent] = useState(null);
  const [menuTargetRow, setMenuTargetRow] = useState(null);


  /* start load data */
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllStudents();
      if (result.code === 200) {
        const students = result.students.map(student => ({
          id: student.ID_ROWID,
          name: `${student.personProfile2.firstName} ${student.personProfile2.lastName}`,
          phone: student.personProfile2.phoneNumber,
          email: student.personProfile2.mail,
          dateOfBirth: student.personProfile2.dateOfBirth,
          status: student.isActive ? 'Active' : 'Inactive',
          image: student.personProfile2.imagePath !== null && student.personProfile2.imagePath !== '' ?
            `data:image/jpeg;base64,${Buffer.from(
              student.personProfile2.imagePath.data).toString("base64")}` : ''
        }));
        setData(students);
      } else {
        setError(result.message);
        toast.error(`Error! + ${result.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
    fetchData();
  }, []); // Empty dependency array means this effect runs once when component mounts
  /* end load data */

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleUpdateClick = async (studentId) => {
    try {
      // Call the function to update the student's information
      console.log(studentId);
      const updatedData = {
        firstName: editedStudent.name.split(' ')[0], // assuming the name format is "FirstName LastName"
        lastName: editedStudent.name.split(' ')[1],
        mail: editedStudent.email,
        phoneNumber: editedStudent.phone,
        dateOfBirth: editedStudent.dateOfBirth, // Assuming this exists in studentToEdit
        status: editedStudent.status,
        image: editedStudent.image
      };
      const response = await updateStudentData(studentId, updatedData);

      if (response.code === 200) {
        // Refresh the data or manipulate the local state to reflect the changes
        // For example, if you just want to update the local state:
        toast.success(`Les données d'étudiant ${updatedData.firstName} ${updatedData.lastName} sont actualisées avec succès.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        const updatedStudents = data.map(student =>
          student.id === studentId
            ? { ...student, ...editedStudent }
            : student
        );
        setData(updatedStudents);
        setEditedStudent(null); // Resetting the edited student state
      } else {
        toast.error(`Error! + ${response.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Error updating student:", response.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
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
      const newSelecteds = data.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditedStudent({ ...editedStudent, image: reader.result })
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);

  const handleDeleteClick = (student) => {
    setMenuTargetRow(student);
    setIsDialogOpen(true);
  };
  const handleDeleteClick2 = () => {
    setIsDialogOpen2(true);
  };
  const handleDeleteStudent = async (studentId) => {
    try {
      const response = await deleteStudent(studentId);

      if (response.code === 200) {
        // Delete was successful, now remove the student from your local state
        toast.success(`L'étudiant a été bien supprimer.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        const updatedStudents = data.filter(student => student.id !== studentId);
        setData(updatedStudents);
      } else {
        toast.error(`Error! + ${response.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Error deleting student:", response.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleCancelClick = () => {
    setIsDialogOpen(false);
  };
  const handleCancelClick2 = () => {
    setIsDialogOpen2(false);
  };
  const handleDeleteMultiple = async () => {
    // Using Promise.all to make simultaneous delete requests for each selected student
    await Promise.all(selected.map(id => handleDeleteStudent(id)));

    // After all delete requests have been made, filter out the deleted students from local data
    const remainingStudents = data.filter(student => !selected.includes(student.id));

    setData(remainingStudents);
    setSelected([]);  // Clear the selection after deleting
  };

  const handleConfirmClick = () => {
    if (menuTargetRow && menuTargetRow.id) {
      handleDeleteStudent(menuTargetRow.id);
    }
    setIsDialogOpen(false); // close the dialog after deleting
    setMenuTargetRow(null); // reset the target row
  };

  const handleConfirmClick2 = () => {
    handleDeleteMultiple();
    setIsDialogOpen2(false); // close the dialog after deleting
  };
  return (
    <>

      <Helmet>
        <title> Étudiants</title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Étudiants
          </Typography>
          <Link to="/dashboard/addStudent">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Nouveau Étudiant
            </Button>
          </Link>
        </Stack>

        <Card>
          {error ? (
            <Typography variant="h6" paragraph style={{ padding: '20px' }}>
              {error}
            </Typography>
          ) : (
            data.length === 0 ? (
              <Typography style={{ padding: '20px' }} variant="h6" paragraph>
                Aucun résultat n'a été trouvé.
              </Typography>
            ) : (
              <>
                <UserListToolbar
                  numSelected={selected.length}
                  filterName={filterName}
                  onFilterName={handleFilterByName}
                  // onDeleteSelected={handleDeleteMultiple}
                  onDeleteSelected={() => { handleDeleteClick2() }}
                />
                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <UserListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={data.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                      />
                      <TableBody>
                        {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                          const { id, name, email, phone, status, dateOfBirth, image } = row;
                          const isEditing = editedStudent && editedStudent.id === row.id;

                          return (
                            <TableRow hover key={id}>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={selected.indexOf(id) !== -1}
                                  onChange={(event) => handleClick(event, id)}
                                />
                              </TableCell>
                              <TableCell component="th" scope="row" padding="1">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <>
                                    {isEditing ? (
                                      <Badge
                                        overlap="circular"
                                        badgeContent={
                                          <>
                                            <div style={{ position: 'absolute', top: 40, right: -3 }}>
                                              <SmallAvatar>
                                                <Button component="label" variant="text" >
                                                  <EditIcon
                                                    style={{ color: 'blue', width: '17px', height: '17px' }}
                                                  />
                                                  <input
                                                    type="file"
                                                    id="image-upload"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={handleImageChange}
                                                  />
                                                </Button>
                                              </SmallAvatar>
                                            </div>
                                            <div style={{ position: 'absolute', bottom: 0, right: -3 }}>
                                              <SmallAvatar>
                                                <DeleteIcon
                                                  onClick={() => setEditedStudent({ ...editedStudent, image: null })}
                                                  style={{ color: 'red', width: '17px', height: '17px' }}
                                                />
                                              </SmallAvatar>
                                            </div>
                                          </>
                                        }
                                      >
                                        <Avatar alt={name} src={editedStudent.image} style={{ width: '60px', height: '60px' }} />
                                      </Badge>
                                    ) : (

                                      <Avatar alt={name} src={image} style={{ width: '60px', height: '60px' }} />

                                    )}
                                  </>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  {isEditing ? (
                                    <TextField
                                      size="small"
                                      defaultValue={name}
                                      onChange={(e) => setEditedStudent({ ...editedStudent, name: e.target.value })}
                                    />
                                  ) : (
                                    <Typography variant="subtitle2" noWrap>
                                      {name}
                                    </Typography>
                                  )}
                                </Stack>
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <TextField
                                    size="small"
                                    defaultValue={email}
                                    onChange={(e) => setEditedStudent({ ...editedStudent, email: e.target.value })}
                                  />
                                ) : (
                                  email
                                )}
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <TextField
                                    size="small"
                                    defaultValue={phone}
                                    onChange={(e) => setEditedStudent({ ...editedStudent, phone: e.target.value })}
                                  />
                                ) : (
                                  phone
                                )}
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <TextField
                                    size="small"
                                    type="date"
                                    defaultValue={dateOfBirth
                                    }
                                    onChange={(e) => setEditedStudent({ ...editedStudent, dateOfBirth: e.target.value })}
                                  />
                                ) : (
                                  new Date(dateOfBirth).toLocaleDateString()
                                  // Displaying date in a readable format
                                )}
                              </TableCell>
                              <TableCell>
                                {isEditing ? (

                                  <Select
                                    fullWidth
                                    size="small"
                                    value={editedStudent.status}
                                    onChange={(e) => setEditedStudent({
                                      ...editedStudent,
                                      status: e.target.value // Stored value
                                    })}
                                  >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                  </Select>
                                ) : (

                                  <Label color={status === 'Inactive' ? 'error' : 'success'}>
                                    {status}
                                  </Label>
                                )}
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton size="small" onClick={() => handleUpdateClick(row.id)} >
                                      <Iconify icon="icon-park-solid:correct" style={{ color: 'blue', margin: '2px' }} />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => setEditedStudent(null)} >
                                      <Iconify icon="foundation:x" style={{ color: 'red', margin: '2px' }} />
                                    </IconButton>
                                  </div>

                                ) : (
                                  <IconButton size="small" onClick={(e) => {
                                    handleOpenMenu(e);
                                    setMenuTargetRow(row);
                                  }}>
                                    <Iconify icon={'eva:more-vertical-fill'} />
                                  </IconButton>

                                )}
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
                                  <strong>&quot;{filterName}&quot;</strong>.
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
            )
          )}
        </Card>
      </Container>

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

        <MenuItem onClick={() => {
          console.log("Editing for row:", menuTargetRow); // Debugging log
          setEditedStudent(menuTargetRow);
          handleCloseMenu();
        }}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Modifier
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => {
          handleDeleteClick(menuTargetRow);
          handleCloseMenu();
        }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Supprimer
        </MenuItem>
      </Popover>
      {/* dialog for deleting one item */}
      <Dialog open={isDialogOpen} onClose={handleCancelClick}>
        <DialogContent>
          <DialogContentText>Êtes-vous sûr de vouloir supprimer cet élément ?</DialogContentText>
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
          <DialogContentText>Êtes-vous sûr de vouloir supprimer ces éléments ?</DialogContentText>
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
}
