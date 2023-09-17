import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
  Select, Card, Table, Stack, Paper, Avatar, Button, Popover, Checkbox, TableRow, MenuItem, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination,
TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Link } from 'react-router-dom';

// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';

// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user'; // 

// to load data 
import { getAllStudents, updateStudentData, deleteStudent} from '../../RequestManagement/studentManagement'; //

const TABLE_HEAD = [
  { id: 'name', label: 'Nom', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Numéro de téléphone', alignRight: false },
  {id: 'dateOfBirth', label: 'Date de naissance', alignRight: false },
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
          dateOfBirth:student.personProfile2.dateOfBirth,
          status: student.isActive ? 'Active' : 'Inactive',
          
        }));
        setData(students);
       
      } else {
        setError(result.message);
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
          status:editedStudent.status
      };
        const response = await updateStudentData(studentId, updatedData);

        if (response.code === 200) {
            // Refresh the data or manipulate the local state to reflect the changes
            // For example, if you just want to update the local state:
            const updatedStudents = data.map(student => 
                student.id === studentId 
                ? { ...student, ...editedStudent } 
                : student
            );
            setData(updatedStudents);
            setEditedStudent(null); // Resetting the edited student state
        } else {
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

  const handleDeleteClick = (student) => {
    setMenuTargetRow(student);
    setIsDialogOpen(true);
};

  const handleDeleteStudent = async (studentId) => {
    try {
      const response = await deleteStudent(studentId);
      
      if (response.code === 200) {
        // Delete was successful, now remove the student from your local state
        const updatedStudents = data.filter(student => student.id !== studentId);
        setData(updatedStudents);
      } else {
        console.error("Error deleting student:", response.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleCancelClick = () => {
    setIsDialogOpen(false);
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
  

  return (
    <>
      <Helmet>
        <title> Étudiants | Minimal UI </title>
      </Helmet>

      <Container>
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
                Résultat non trouvé
              </Typography>
            ) : (
              <>
                <UserListToolbar
                  numSelected={selected.length}
                  filterName={filterName}
                  onFilterName={handleFilterByName}
                  onDeleteSelected={handleDeleteMultiple}
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
    const { id, name, email, phone, status, dateOfBirth } = row;
    const isEditing = editedStudent && editedStudent.id === row.id;

    return (
      <TableRow hover key={id}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected.indexOf(id) !== -1}
            onChange={(event) => handleClick(event, id)}
          />
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={row.avatarUrl} />
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
              defaultValue={new Date(dateOfBirth).toLocaleDateString()
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
            <>
              <Button variant="contained" color="primary" onClick={() => handleUpdateClick(row.id)}>Save</Button>
              <Button variant="outlined" color="secondary" onClick={() => setEditedStudent(null)}>Cancel</Button>
            </>
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
