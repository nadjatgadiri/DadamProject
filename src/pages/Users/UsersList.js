import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// @mui
import {
  Card, Table, Stack, Paper, Avatar, Button, Popover, Checkbox, TableRow, MenuItem, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Link } from 'react-router-dom';
// components
import { Buffer } from "buffer";
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// to load data 
import { getAllUsers } from '../../RequestManagement/userManagement'
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nom', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Numéro de téléphone', alignRight: false },
  { id: 'role', label: 'Position', alignRight: false },
  { id: 'status', label: 'Statut', alignRight: false },
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

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllUsers();
      if (result.code === 200) {

        const users = await result.allUsers.map(user => ({
          id: user.ID_ROWID,
          name: `${user.personProfile.firstName} ${user.personProfile.lastName}`, // Concatenating first name and last name
          phone: user.personProfile.phoneNumber,
          email: user.personProfile.mail,
          status: user.isConnected !== "true" ? 'Inactive' : 'Active',
          role: user.role,
          image: user.personProfile.imagePath !== null || user.personProfile.imagePath !== '' ?
            `data:image/jpeg;base64,${Buffer.from(
              user.personProfile.imagePath.data).toString("base64")}` : ''
        }));

        console.log(users);
        setError('');
        if (users) {
          setData(users);
        }
      }
      else {
        // when we got an error 
        setError(result.message);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleCancelClick = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmClick = () => {
    // Mettez ici la logique pour effectuer la suppression
    // Une fois la suppression effectuée, fermez la boîte de dialogue
    setIsDialogOpen(false);
  };

  return (
    <>
      <Helmet>
        <title> Utilisateurs | Minimal UI </title>
      </Helmet>

      <Container>
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
                  Résultat non trouvé
                </Typography>
                :
                <>
                  <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
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
                            const { id, name, email, phone, role, status, image } = row;

                            const selectedUser = selected.indexOf(name) !== -1;

                            return (
                              <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                <TableCell padding="checkbox">
                                  <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                                </TableCell>

                                <TableCell component="th" scope="row" padding="none">
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar alt={name} src={image} />
                                    <Typography variant="subtitle2" noWrap>
                                      {name}
                                    </Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell align="left">{email}</TableCell>
                                <TableCell align="left">{phone}</TableCell>
                                <TableCell align="left">{role}</TableCell>

                                <TableCell align="left">
                                  <Label color={status === 'Inactive' ? 'error' : 'success'}>{status}</Label>
                                </TableCell>

                                <TableCell align="right">
                                  <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
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
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Modifier
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteClick}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Supprimer
        </MenuItem>
      </Popover>
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
    </>
  );
}
