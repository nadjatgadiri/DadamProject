import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// @mui
import {
  Badge, Card, Table, Stack, Button, Popover, Checkbox, TableRow, MenuItem, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination,
 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { Link } from 'react-router-dom';

// components

import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';

// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { getAllRegistrations, deleteRegistration } from '../../RequestManagement/registrationManagement';

const REGISTRATION_TABLE_HEAD = [
  { id: 'studentName', label: 'Nom d\'Étudiant', alignRight: false },
  { id: 'programTitle', label: 'Titre du programme', alignRight: false },
  { id: 'registrationDate', label: 'Date d\'inscription', alignRight: false },
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

export default function RegistrationPage() {

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
      try {
        const result = await getAllRegistrations();

        if (result.code === 200) {
          const registrations = result.registrations.map(registration => ({
            id: registration.ID_ROWID,
            studentName: `${registration.students.personProfile2.firstName} ${registration.students.personProfile2.lastName}`,
            programTitle: registration.programs.title,
            registrationDate: registration.createdAt, // using createdAt from the registration model
          }));

          setData(registrations);
        } else {
          setError(result.message);
          toast.error(`Error! + ${result.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (error) {
        console.error("Failed to fetch registrations:", error);
        toast.error("Error fetching registrations!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
    fetchData();
  }, []);


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
      const newSelecteds = data.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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

  const handleDeleteClick = (registration) => {
    setMenuTargetRow(registration);
    setIsDialogOpen(true);
  };
  const handleDeleteClick2 = () => {
    setIsDialogOpen2(true);
  };
  const handleDeleteRegistration = async (registrationId) => {
    try {
      const response = await deleteRegistration(registrationId);

      if (response.code === 200) {
        toast.success(`L'inscription a été supprimée avec succès.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        const updatedRegistrations = data.filter(registration => registration.id !== registrationId);
        setData(updatedRegistrations);
      } else {
        toast.error(`Erreur! ${response.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Erreur lors de la suppression de l'inscription:", response.message);
      }
    } catch (error) {
      console.error("Erreur:", error.message);
    }
  };
  const handleCancelClick = () => {
    setIsDialogOpen(false);
  };
  const handleCancelClick2 = () => {
    setIsDialogOpen2(false);
  };


  const handleDeleteMultiple = async () => {
    await Promise.all(selected.map(id => handleDeleteRegistration(id)));
    const remainingRegistrations = data.filter(registration => !selected.includes(registration.id));
    setData(remainingRegistrations);
    setSelected([]);  // Clear the selection after deleting
  };

  const handleConfirmClick = () => {
    if (menuTargetRow && menuTargetRow.id) {
      handleDeleteRegistration(menuTargetRow.id);
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
        <title> Inscriptions</title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Inscriptions
          </Typography>
          <Link to="/dashboard/addRegistration"> {/* Adjust this link to your Add Registration page */}
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Nouvelle Inscription
            </Button>
          </Link>
        </Stack>

        <Card>
          {/* ToolBar for filtering and multi delete */}
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteSelected={() => { handleDeleteClick2() }}
          />

          {/* Table to display registrations */}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={REGISTRATION_TABLE_HEAD}
                  rowCount={data.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, studentName, programTitle, registrationDate } = row;

                    return (
                      <TableRow hover key={id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.indexOf(id) !== -1}
                            onChange={(event) => handleClick(event, id)}
                          />
                        </TableCell>
                        <TableCell>{studentName}</TableCell>
                        <TableCell>{programTitle}</TableCell>
                        <TableCell>{new Date(registrationDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={(e) => {
                            handleOpenMenu(e);
                            setMenuTargetRow(row);
                          }}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      {/* Popover for row-specific actions */}
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
        <MenuItem sx={{ color: 'error.main' }} onClick={() => {
          handleDeleteClick(menuTargetRow);
          handleCloseMenu();
        }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Supprimer
        </MenuItem>
      </Popover>

      {/* Dialog for confirming deletion of a single registration */}
      <Dialog open={isDialogOpen} onClose={handleCancelClick}>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette inscription ?
          </DialogContentText>
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

      {/* Dialog for confirming deletion of multiple registrations */}
      <Dialog open={isDialogOpen2} onClose={handleCancelClick2}>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ces inscriptions ?
          </DialogContentText>
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

    </>
  );
}
