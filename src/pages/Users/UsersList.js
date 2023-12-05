import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// @mui
import {
  Badge, Card, Table, Stack, Paper, Avatar, Button, Popover, Checkbox, TableRow, MenuItem,
  TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination,
  TextField, Select,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Link } from 'react-router-dom';
// components
import { Buffer } from "buffer";
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// to load data 
import { getAllUsers, updateUserData, deleteUser } from '../../RequestManagement/userManagement'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '' },
  { id: 'name', label: 'Nom', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Numéro de téléphone', alignRight: false },
  { id: 'dateOfBirth', label: 'date de naissance', alignRight: false },
  { id: 'role', label: 'Position', alignRight: false },
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

export default function UserPage() {
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
  /* start load data */
  const [data, setData] = useState([]);
  /** update and delete */
  const [editedUser, setEditedUser] = useState(null);
  const [menuTargetRow, setMenuTargetRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllUsers();
      if (result.code === 200) {
        const users = await result.allUsers.map(user => ({
          id: user.ID_ROWID,
          name: `${user.personProfile.firstName} ${user.personProfile.lastName}`, // Concatenating first name and last name
          phone: user.personProfile.phoneNumber,
          email: user.personProfile.mail,
          status: user.isConnected,
          role: user.role,
          dateOfBirth: user.personProfile.dateOfBirth,
          image: user.personProfile.imagePath !== null && user.personProfile.imagePath !== '' ?
            `data:image/jpeg;base64,${Buffer.from(
              user.personProfile.imagePath).toString("base64")}` : ''
        }));
        setError('');
        if (users) { 
          console.log(users);
          setData(users);
        }
      }
      else {
        // when we got an error 
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
  /** start update  */
  const handleUpdateClick = async (userId) => {
    try {
      // Call the function to update the user's information
      const updatedData = {
        userID: userId,
        firstName: editedUser.name.split(' ')[0], // assuming the name format is "FirstName LastName"
        lastName: editedUser.name.split(' ')[1],
        mail: editedUser.email,
        phoneNumber: editedUser.phone,
        dateOfBirth: editedUser.dateOfBirth, // Assuming this exists in userToEdit
        role: editedUser.role,
        image: editedUser.image
      };
      const response = await updateUserData(updatedData);

      if (response.code === 200) {
        toast.success(`Les données d'utilisateur ${updatedData.firstName} ${updatedData.lastName} sont actualisées avec succès.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Refresh the data or manipulate the local state to reflect the changes
        // For example, if you just want to update the local state:
        const updatedUsers = data.map(user =>
          user.id === userId
            ? { ...user, ...editedUser }
            : user
        );
        setData(updatedUsers);
        setEditedUser(null); // Resetting the edited user state
      } else {
        toast.error(`Error! + ${response.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Error updating user:", response.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditedUser({ ...editedUser, image: reader.result })
      };
      reader.readAsDataURL(file);
    }
  };
  /** end update  */
  /** start delete */
  const handleDeleteClick = (user) => {

    setMenuTargetRow(user);
    setIsDialogOpen(true);
  };
  const handleDeleteClick2 = () => {
    setIsDialogOpen2(true);
  };
  const handleDeleteUser = async (userId) => {
    try {
      const response = await deleteUser(userId);

      if (response.code === 200) {
        // Delete was successful, now remove the User from your local state
        toast.success(`L'utilisateur est bien supprimer.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        const updatedUser = data.filter(user => user.id !== userId);
        setData(updatedUser);
      } else {
        toast.error(`Error! + ${response.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Error deleting the user:", response.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleDeleteMultiple = async () => {
    // Using Promise.all to make simultaneous delete requests for each selected User
    await Promise.all(selected.map(id => handleDeleteUser(id)));

    // After all delete requests have been made, filter out the deleted Users from local data
    const remainingUsers = data.filter(user => !selected.includes(user.id));

    setData(remainingUsers);
    setSelected([]);  // Clear the selection after deleting
  };
  /** end delete */
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);

  const handleCancelClick = () => {
    setIsDialogOpen(false);
  };
  const handleCancelClick2 = () => {
    setIsDialogOpen2(false);
  };
  const handleConfirmClick = () => {
    // Mettez ici la logique pour effectuer la suppression
    // Une fois la suppression effectuée, fermez la boîte de dialogue
    if (menuTargetRow && menuTargetRow.id) {
      handleDeleteUser(menuTargetRow.id);
    }
    setMenuTargetRow(null);
    setIsDialogOpen(false);
  };
  const handleConfirmClick2 = () => {
    handleDeleteMultiple();
    setIsDialogOpen2(false); // close the dialog after deleting
  };
  return (
    <>

      <Helmet>
        <title> Utilisateurs | Minimal UI </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Utilisateurs
          </Typography>
          <Link to="/dashboard/addUser">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Nouveau Utilisateur
            </Button>
          </Link>
        </Stack>

        <Card>
          {error !== '' ?
            (<Typography variant="h6" paragraph style={{ padding: '20px' }}>
              {error}
            </Typography>)
            :
            (
              data.length === 0 ?
                <Typography style={{ padding: '20px' }} variant="h6" paragraph>
                  Aucun résultat n'a été trouvé.
                </Typography>
                :
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
                            const { id, name, email, phone, role, status, image, dateOfBirth } = row;
                            const isEditing = editedUser && editedUser.id === row.id;

                            const selectedUser = selected.indexOf(name) !== -1;

                            return (
                              <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selected.indexOf(id) !== -1}
                                    onChange={(event) => handleClick(event, id)} />
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
                                                    onClick={() => setEditedUser({ ...editedUser, image: null })}
                                                    style={{ color: 'red', width: '17px', height: '17px' }}
                                                  />
                                                </SmallAvatar>
                                              </div>
                                            </>
                                          }
                                        >
                                          <Avatar alt={name} src={editedUser.image} style={{ width: '60px', height: '60px' }} />
                                        </Badge>
                                      ) : (
                                        status ?
                                          (<StyledBadge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            variant="dot"
                                          >
                                            <Avatar alt={name} src={image} style={{ width: '60px', height: '60px' }} />
                                          </StyledBadge>) :
                                          <Avatar alt={name} src={image} style={{ width: '60px', height: '60px' }} />

                                      )}
                                    </>
                                  </Stack>
                                </TableCell>

                                <TableCell component="th" scope="row" padding="none">
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    {isEditing ? (
                                      <TextField
                                        size="small"
                                        defaultValue={name}
                                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
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
                                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
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
                                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
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
                                      defaultValue={dateOfBirth}
                                      onChange={(e) => setEditedUser({ ...editedUser, dateOfBirth: e.target.value })}
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
                                      value={editedUser.role}
                                      onChange={(e) => setEditedUser({
                                        ...editedUser,
                                        role: e.target.value // Stored value
                                      })}
                                    >
                                      <MenuItem value="Admin">Admin</MenuItem>
                                      <MenuItem value="Secretaire">Secrétaire</MenuItem>
                                    </Select>
                                  ) : (
                                    <TableCell align="left">
                                      {role === "Admin" ? "Admin" : "Secrétaire"}</TableCell>

                                  )}
                                </TableCell>

                                <TableCell>
                                  {isEditing ? (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <IconButton size="small" onClick={() => handleUpdateClick(row.id)} >
                                        <Iconify icon="icon-park-solid:correct" style={{ color: 'blue', margin: '2px' }} />
                                      </IconButton>
                                      <IconButton size="small" onClick={() => setEditedUser(null)} >
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
                                {/* <TableCell align="right">
                                  <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                    <Iconify icon={'eva:more-vertical-fill'} />
                                  </IconButton>
                                </TableCell> */}
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
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
            )
          }

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
          setEditedUser(menuTargetRow);
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
