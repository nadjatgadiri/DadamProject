import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import {
   Select, Card, Table, Paper, Stack,Button, Checkbox, TableRow, MenuItem, TableBody, TableCell, Container, Typography, TableContainer, TablePagination,
   Autocomplete, TextField 
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Link ,useLocation} from 'react-router-dom';
import Scrollbar from '../../components/scrollbar';
import { UserListHead} from '../../sections/@dashboard/user';
import { getRegistrablePrograms , addNewRegistration} from '../../RequestManagement/registrationManagement';
import { getAllStudents} from '../../RequestManagement/studentManagement'; //

const TABLE_HEAD = [
  { id: 'title', label: 'Titre', alignRight: false },
  { id: 'endInscriptionDay', label: 'Fin de l\'inscription', alignRight: false },
  { id: '' },


];
export default function ProgramPage() {
  const [programs, setPrograms] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('title');
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dialogReason, setDialogReason] = useState(''); // can be 'add' or 'select'
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const storedSelectedStudents = localStorage.getItem('selectedStudents');
  const [selectedStudents, setSelectedStudents] = useState(() => {
    return storedSelectedStudents ? JSON.parse(storedSelectedStudents) : [];
});
const location = useLocation();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await getRegistrablePrograms();
        if (response.code === 200) {
          setPrograms(response.programs);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        setError(error.message);
        toast.error(`Error: ${error.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    fetchPrograms();
    const storedProgramId = localStorage.getItem('selectedProgramId');
    if (storedProgramId) {
        setSelectedProgramId(storedProgramId);
    }
   
  }, []);

useEffect(() => {
  if (location.state && location.state.newStudentId) {
      const newStudent = students.find(s => s.id === location.state.newStudentId);
      if (newStudent) {
        // Fetch previously selected students from localStorage.
        const storedSelectedStudents = localStorage.getItem('selectedStudents');
        
        // Parse the fetched students.
        let previousSelectedStudents = [];
        if (storedSelectedStudents) {
            previousSelectedStudents = JSON.parse(storedSelectedStudents);
        }

        // Combine the fetched students with the new student.
        const updatedSelectedStudents = [...previousSelectedStudents, newStudent];
        console.log(updatedSelectedStudents);

        // Update the selectedStudents state.
        setSelectedStudents(updatedSelectedStudents);
        location.state = null;  
  }
  setDialogOpen(true);
}
}, [students, location.state]);

  useEffect(() => {
    if(dialogOpen) {
        const fetchStudents = async () => {
            try {
                const response = await getAllStudents();
                if(response.code === 200) {
                    const processedStudents = response.students.map(student => ({
                      id: student.ID_ROWID,
                      name: `${student.personProfile2.firstName} ${student.personProfile2.lastName}`,
                      // ... other fields as needed
                    }));
                    setStudents(processedStudents);
                } else {
                    toast.error(`Failed to fetch students. ${response.message}`, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            } catch(error) {
                toast.error(`Error: ${error.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
        fetchStudents();
    }
}, [dialogOpen]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = programs.map((program) => program.id);
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (programId) => {
    setSelectedProgramId(programId);
    localStorage.setItem('selectedProgramId', programId.toString());
    setDialogReason('select'); // specify reason
    setDialogOpen(true);
};
const handleCloseDialog = () => {
  localStorage.removeItem('selectedStudents');
  localStorage.removeItem('selectedProgramId');
  setSelectedStudents([]); 
  setDialogOpen(false);

};
 const handleSelectedStudents= () =>{
  localStorage.setItem('selectedStudents', JSON.stringify(selectedStudents)); 
  console.log(localStorage.getItem('selectedStudents'));
};
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
        return filter(array, (program) => program.title.toLowerCase().includes(query.toLowerCase()));
    }
    return stabilizedThis.map((el) => el[0]);
}
const handleRegister = async () => {
  // Log the selectedProgramId for debugging purposes
  console.log("Program ID from localStorage:", localStorage.getItem('selectedProgramId'));

  // Prepare the registration data for each student
  const registrationPromises = selectedStudents.map(async (student) => {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const registrationData = {
          IDstudent: student.id,
          Idprogram: localStorage.getItem('selectedProgramId'),
          date: formattedDate,
      };

      return addNewRegistration(registrationData);
  });

  // Log the selected students for debugging purposes
  console.log("Selected Students:", selectedStudents);

  try {
      const responses = await Promise.all(registrationPromises);

      // Process the responses
      let success = true; // Assuming all registrations are successful
      responses.forEach(response => {
          switch(response.code) {
              case 200: 
                  toast.success('Successfully registered.', {
                      position: toast.POSITION.TOP_RIGHT,
                  });
                  break;
              case 409:  // Conflict, meaning student is already registered
                  success = false; // At least one registration failed
                  toast.warn('A student is already registered for this program.', {
                      position: toast.POSITION.TOP_RIGHT,
                  });
                  break;
              default:
                  success = false; // At least one registration failed
                  toast.error(`Failed to register. ${response.message}`, {
                      position: toast.POSITION.TOP_RIGHT,
                  });
          }
      });

      if (success) { // If all registrations were successful
          // Clear the stored program ID and selected students from localStorage
          localStorage.removeItem('selectedProgramId');
          localStorage.removeItem('selectedStudents');
          setSelectedStudents([]); // Also clear selected students from the state
          handleCloseDialog();
      }

  } catch(error) {
      toast.error(`Error: ${error.message}`, {
          position: toast.POSITION.TOP_RIGHT,
      });
  }
};



  return (
    <>
        <Helmet>
            <title>Programmes | Minimal UI</title>
        </Helmet>
        
        <Container>
            <ToastContainer />
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Programmes
                </Typography>
                <TextField
                    size="small"
                    placeholder="Rechercher programme"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                />
            </Stack>
            
            <Card>
                {programs.length === 0 ? (
                    <Typography style={{ padding: '20px' }} variant="h6">
                        Aucun programme disponible pour l'inscription.
                    </Typography>
                ) : (
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
    <UserListHead
        order={order}
        orderBy={orderBy}
        headLabel={TABLE_HEAD}
        rowCount={programs.length}
        onRequestSort={handleRequestSort}
        onSelectAllClick={handleSelectAllClick}
    />
    <TableBody>
        {applySortFilter(programs, getComparator(order, orderBy), filterName)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((program) => (
                <TableRow hover key={program.id}>
                    <TableCell padding="checkbox">
                        <Checkbox
                            checked={selected.indexOf(program.id) !== -1}
                            onChange={(event) => handleClick(event, program.id)}
                        />
                    </TableCell>
                    <TableCell>{program.title}</TableCell>
                    <TableCell>{new Date(program.EndInsciptionDate
).toLocaleDateString()}</TableCell>
                    <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog(program.ID_ROWID)}>
    S'inscrire
</Button>

                    </TableCell>
                </TableRow>
            ))}
    </TableBody>
</Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={programs.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Scrollbar>
                )}
            </Card>
        </Container>
        
        {/* Dialog for program registration */}
        <Dialog
                open={dialogOpen}
                onClose={() => {
                    handleCloseDialog();
                    if (location.state && location.state.newStudentId) {
                        location.state.newStudentId = null;  // Reset the newStudentId from location state
                    }
                }}
                PaperProps={{
                    style: {
                        width: '50%',
                        maxHeight: '70vh',
                    },
                }}
            >
                <DialogContent>
                    <Stack spacing={3}> {/* Increased spacing */}
                        <DialogContentText>
                            Sélectionnez un étudiant pour l'inscription:
                        </DialogContentText>

                        <Autocomplete
   multiple
   disablePortal
   id="combo-box-student"
   options={students}
   getOptionLabel={(option) => option ? option.name : ""}
   getOptionSelected={(option, value) => option.id === value.id}
     value={selectedStudents}
     onChange={(event, newValues) => {
      console.log('Autocomplete onChange - New Values:', newValues);
      setSelectedStudents(newValues);
      console.log(selectedStudents);
  }}
    renderInput={(params) => <TextField {...params} label="Étudiants" variant="outlined" fullWidth />}
    PaperComponent={({ children }) => (
        <Paper square>{children}</Paper>
    )}
    ListboxProps={{ style: { maxHeight: '250px', overflow: 'auto' } }} 
    noOptionsText="Aucun étudiant trouvé"
/>

                    </Stack>
                </DialogContent>

    <DialogActions>
      <Stack direction="row" spacing={2}>
          <Button color="primary" variant="contained" onClick={handleRegister}>
              Ajouter
          </Button>

          <Link to={{
              pathname: "/dashboard/addStudent",
              search: "?referrer=addRegistration",
          }}>
              <Button color="primary" variant="contained" onClick={handleSelectedStudents}>
                  Nouveau étudiant
              </Button>
          </Link>

          <Button onClick={handleCloseDialog} color="secondary">
              Annuler
          </Button>
      </Stack>
    </DialogActions>
</Dialog>


    </>
);
    }