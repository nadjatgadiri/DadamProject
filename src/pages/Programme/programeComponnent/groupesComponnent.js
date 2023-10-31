import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';
import {
    Toolbar, Tooltip, OutlinedInput, InputAdornment,
    Avatar,
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
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    DialogTitle,
    Grid, Card, Box, TextField, InputLabel, FormControl, Chip
} from '@mui/material';
import { Buffer } from "buffer";
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
    Unstable_NumberInput as NumberInput,
    numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// sections
import { UserListHead, UserListToolbarP } from '../../../sections/@dashboard/user';
// api importation
import { listTeachersForGroup } from '../../../RequestManagement/teacherManagement';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Nom', alignRight: false },
    { id: 'createdDate', label: "Date De Creation", alignRight: false },
    { id: 'nbrPaces', label: 'Nombre De Places', alignRight: false },
    { id: 'teachers', label: 'Enseignantes', alignRight: false },
    { id: '' },
];

// ----------------------------------------------------------------------
const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
};
const StyledInputRoot = styled('div')(
    ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 400;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    display: grid;
    grid-template-columns: 1fr 19px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    height:55px;
    &:hover {
        border-color: black;
      }
    &.${numberInputClasses.focused} {
      border: 2px solid blue;
    }
    // firefox
    &:focus-visible {
      outline: 0;
    }
`
);

const StyledInputElement = styled('input')(
    ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    grid-column: 1/2;
    grid-row: 1/3;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `,
);

const StyledButton = styled('button')(
    ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    padding: 0;
    width: 19px;
    height: 19px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1;
    box-sizing: border-box;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 0;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
      cursor: pointer;
    }
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 2/3;
      grid-row: 1/2;
    }
    &.${numberInputClasses.decrementButton} {
      grid-column: 2/3;
      grid-row: 2/3;
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  `,
);
const CustomNumberInput = React.forwardRef((props, ref) => {
    return (
        <NumberInput
            slots={{
                root: StyledInputRoot,
                input: StyledInputElement,
                incrementButton: StyledButton,
                decrementButton: StyledButton,
            }}
            slotProps={{
                incrementButton: {
                    children: <span className="arrow">▴</span>,
                },
                decrementButton: {
                    children: <span className="arrow">▾</span>,
                },
            }}
            {...props}
            ref={ref}
        />
    );
});
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
    if (filterGroup === "aucun") {
        return filter(array, (item) => item.group === null);
    }
    if (filterGroup !== "") {
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

const names = [
    { ID_ROWID: 1, name: 'Oliver Hansen' },
    { ID_ROWID: 2, name: 'Van Henry' },
    { ID_ROWID: 3, name: 'April Tucker' },
    { ID_ROWID: 4, name: 'Oliver' },
];

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
    const fetchData = async () => {
        setData(groups);
        console.log(data);
        /** start Groups Pie */

        // Convert groupCounts into an array of objects
        const groupData = groups.map((group) => ({
            label: `Group ${group.name}`,
            value: group.nbrStudents,
        }));
        /** end Groups Pie */
        setPieGroupData(groupData);
        //  fetch teachers list
        const result = await listTeachersForGroup();
        if (result.code === 200) {
            const teachers = await Promise.all(result.teachers.map(async teacher => ({
                ID_ROWID: teacher.ID_ROWID,
                name: `${teacher.personProfile2.firstName} ${teacher.personProfile2.lastName}`, // Concatenating first name and last name
            })));
            setTeachersList(teachers);
        }
        else {
            // when we got an error 
            console.log(result);
            toast.error(`Error! + ${result.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        console.log(teachersList);
    };
    useEffect(() => {
        // Check if groups have been received from props
        if (groups && groups.length > 0) {
            fetchData(); // Execute fetchData when groups are received
        }

    }, [groups]);
    /** end api */
    // multiselect
    const theme = useTheme();
    const [personName, setPersonName] = React.useState([]);

    // const handleChange = (event) => {
    //     const {
    //         target: { value },
    //     } = event;
    //     setPersonName(
    //         // On autofill we get a stringified value.
    //         typeof value === 'string' ? value.split(',') : value,
    //     );
    // };
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        // Assuming 'teachersList' is an array of objects with 'ID_ROWID' as the unique identifier
        const selectedTeacherIDs = typeof value === 'string' ? value.split(',') : value;

        // Now 'selectedTeacherIDs' contains an array of selected teacher IDs.
        setPersonName(selectedTeacherIDs);
        // You can use 'selectedTeacherIDs' for any further processing.
    };

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
    const handleConfirmClick = () => {
        if (menuTargetRow && menuTargetRow.ID_ROWID) {
            onSubmitDeleteProgram(menuTargetRow.ID_ROWID);
        }
        setIsDialogOpen(false); // close the dialog after deleting
        setMenuTargetRow(null); // reset the target row
    };
    const handleConfirmClick2 = () => {
        onSubmitDeleteMultiple();
        setIsDialogOpen2(false); // close the dialog after deleting
    };
    /** end */
    /** submit */
    const onSubmitDeleteProgram = async (progId) => {
        // try {
        //     console.log(progId);
        //     const response = await deleteProgramme(progId);

        //     if (response.code === 200) {
        //         // Delete was successful, now remove the cat from your local state
        //         toast.success(`Le programme est bien supprimer.`, {
        //             position: toast.POSITION.TOP_RIGHT,
        //         });
        //         fetchData();
        //     } else {
        //         toast.error(`Error! + ${response.message}`, {
        //             position: toast.POSITION.TOP_RIGHT,
        //         });
        //         console.error('Error deleting student:', response.message);
        //     }
        // } catch (error) {
        //     console.error('Error:', error.message);
        // }
    };
    const onSubmitDeleteMultiple = async () => {
        // Using Promise.all to make simultaneous delete requests for each selected student
        await Promise.all(selected.map((id) => onSubmitDeleteProgram(id)));
        await fetchData();
        setSelected([]); // Clear the selection after deleting
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
    /** end */

    return (
        <>
            <>
                <div className="col-md-12 col-xl-12 col-12">
                    <div className="row">
                        {/* <!-- card --> */}
                        <div className="col-md-12 mb-5">
                            <div className="card" style={{
                                padding: '20px'
                            }}>
                                <form
                                // onSubmit={handleSubmit}
                                >
                                    <Grid container spacing={1}>
                                        <Grid item xs={3}>
                                            <InputLabel htmlFor="role" style={{ paddingBottom: "10px" }}>Groupe Name</InputLabel>
                                            <TextField
                                                name="title"
                                                // label="Titre"
                                                // value={title}
                                                // onChange={(e) => setTitle(e.target.value)}
                                                required
                                                fullWidth
                                            // error={errors.title}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <InputLabel htmlFor="role" style={{ paddingBottom: "10px" }}>Nombre De Place</InputLabel>
                                            <CustomNumberInput
                                                aria-label="Demo number input"
                                                placeholder="Type a number…"
                                            // value={nmbParticipant}
                                            // onChange={(event, val) => setNMBParticipant(val)}
                                            />
                                        </Grid>
                                        <Grid item className="col-sm-5 col-md-6">
                                            <InputLabel htmlFor="role" style={{ paddingBottom: "10px" }}>Les Enseignantes</InputLabel>
                                            <Select
                                                style={{ width: "100%" }}
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
                                        {/* <Typography variant="body2" color="error">{feedback}</Typography> */}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                style={{ backgroundColor: 'blue', color: 'white' }}>
                                                Ajouter
                                            </Button>
                                        </Box>
                                    </Grid>
                                </form>
                            </div>
                        </div>
                    </div></div></>

            {data.length ?
                (<>
                    <div className="col-md-12 col-xl-12 col-12">
                        <div className="row">
                            <div className="col-md-12 mb-5">
                                <div className="card bg-light-primary" style={{
                                    padding: '20px'
                                }}>

                                    <div style={{ textAlign: 'center', }}>
                                        <Typography variant="h6" paragraph >
                                            Il n'y a pas des groupes
                                        </Typography>
                                        <Button className="" variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                            Ajouter
                                        </Button>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>


                </>)
                :
                (<>
                    <div className="col-md-12 col-xl-8 col-12">
                        <div className="row">
                            <div className="col-md-12 mb-5">
                                {/* <!-- card --> */}
                                <div className="card" >
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
                                                        {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                            const { id, name, teachers, createdAt, nbrPlaces } = row;

                                                            return (
                                                                <TableRow hover key={id}>
                                                                    <TableCell padding="checkbox" >
                                                                        <Checkbox
                                                                            checked={selected.indexOf(id) !== -1}
                                                                            onChange={(event) => handleClick(event, id)}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        <Stack direction="row" alignItems="center" >
                                                                            <Typography variant="subtitle2" noWrap>
                                                                                {name}
                                                                            </Typography>

                                                                        </Stack>
                                                                    </TableCell>
                                                                    <TableCell  >
                                                                        {formatDate(createdAt)}
                                                                    </TableCell>
                                                                    <TableCell  >
                                                                        {nbrPlaces}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {teachers?.map((teacher, index) => (
                                                                            <span key={index}>{`${teacher.personProfile2.firstName} ${teacher.personProfile2.lastName}${index !== teachers.length - 1 ? ', ' : ''}`}</span>
                                                                        ))}
                                                                    </TableCell>



                                                                    <TableCell >

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
                            {/* <!-- Card header --> */}
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">Nombre Des Abonnés Pour Chaque Groupe
                                    </h4>
                                </div>
                            </div>
                            {/* <!-- Card body --> */}
                            <div className="card-body">
                                {(pieGroupData !== null) ?
                                    <PieChart
                                        series={[
                                            {
                                                paddingAngle: 5,
                                                innerRadius: 50,
                                                outerRadius: 100,
                                                data: pieGroupData,
                                            },
                                        ]}
                                        width={350}
                                        height={300}
                                        margin={{ right: 150 }}
                                    // legend={{ hidden: true }}
                                    /> : null}
                            </div>
                        </div>
                    </div>
                </>)
            }

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
                <MenuItem onClick={() => { }}>
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
}
export default GroupesComponnent;
