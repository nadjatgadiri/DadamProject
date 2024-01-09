import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// @mui
import {
  Card, Table, Stack, Paper, Button, Popover, Checkbox, TableRow, MenuItem,
    TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination,
    TextField, Grid, Box,  DialogTitle, 
} from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// api importation
import { getAllSalles, addNewSalle, updateSalleData, deleteSalle } from "../../RequestManagement/sallesManagement"
import { getAllSessionsInSalle } from "../../RequestManagement/sessionsManagement"
import { getGroups } from "../../RequestManagement/groupManagement"
import MyCalendar from '../Programme/calendar/calendar'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Nom', alignRight: false },
    { id: 'capacité', label: 'Capacité', alignRight: false },
    { id: 'createdAt', label: 'Date de creation', alignRight: false },
    { id: 'calendar', label: 'Séances', alignRight: false },
    { id: '' },
];

// ----------------------------------------------------------------------
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

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_class) => _class.className.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}
/** end */
export default function ClassPage() {
    // const useStyles = styled()({
    // paperFullWidth: {
    //     overflowY: 'visible'
    // },
    //     dialogContentRoot: {
    //         overflowY: 'visible'
    //     }
    // });
    const [open, setOpen] = useState(null);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [selectedForUpdate, setSelectedForUpdate] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [error, setError] = useState('');
    const [menuTargetRow, setMenuTargetRow] = useState(null);
    /* start load data */
    const [data, setData] = useState([]);
    /*--------------------------*/
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const filtered = applySortFilter(data, getComparator(order, orderBy), filterName);

    const isNotFound = !filtered.length && !!filterName;
    const [allCat, setAllCat] = useState(null);
    const [isSub, setIsSub] = useState(false);
    const [catTitle, setCatTitle] = useState(false);

    /*--------------------------*/
    /** dialogs */
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [selectedSalle, setSelectedSalle] = useState(null);
    const [title, setTitle] = useState('');
    const [capacite, setCapacite] = useState(20);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpen2, setIsDialogOpen2] = useState(false);
    const [isDialogOpen3, setIsDialogOpen3] = useState(false);
    const [events, setEvents] = useState([]);
    const [groups, setGroups] = useState([]);
    /** end */

    /** api */
    const fetchData = async () => {
        const result = await getAllSalles();
        if (result.code === 200) {
            const allClasses = result.allClasses;
            setError('');
            if (allClasses) {
                setData(allClasses);
            }
        }
        else {
            // when we got an error 
            console.log(result);
            toast.error(`Error! + ${result.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        const result2 = await getGroups();
        if (result2.code === 200) {
            const data = await result2.groups.map(group => ({
                id: group.ID_ROWID,
                name: group.GroupeName
            }));
            setGroups(ColorGenerator(data));
        }
    };
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this effect runs once when component mounts

    /** end api */
    /** dialog handdel */
    // add
    const handleCancelAddDialogClick = () => {
        setIsAddDialogOpen(false);
        setIsUpdateDialogOpen(false);
        setTitle('');
        setCapacite(20);
    };
    // update 
    const handleCancelUpdateDialogClick = () => {
        setIsUpdateDialogOpen(false);
        setTitle('');
        setCapacite(20);
    };


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
        setTitle('');
        setCapacite(20);
    };
    const handleCancelClick2 = () => {
        setIsDialogOpen2(false);
        setTitle('');
        setCapacite(20);
    };
    const handleCancelClick3 = () => {
        setIsDialogOpen3(false);
        setSelectedSalle(null);
        setEvents([])
    };
    const handleOpenCalendar = async (id) => {
        setIsDialogOpen3(true);
        // get events
        //  fetch sessions list
        setSelectedSalle(id);
        const result = await getAllSessionsInSalle(id);
        if (result.code === 200) {
            setEvents(result.events);
        }

    };
    // generat colors to all classes 
    const stringToColor = (name) => {
        const hashCode = name.toString().split('').reduce((acc, char) => {
            acc = (acc * 31) + char.charCodeAt(0) + 100;
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
    const handleConfirmClick = () => {
        if (menuTargetRow && menuTargetRow.ID_ROWID) {
            onSubmitdeleteSalle(menuTargetRow.ID_ROWID);
        }
        setTitle('');
        setCapacite(20);
        setIsDialogOpen(false); // close the dialog after deleting
        setMenuTargetRow(null); // reset the target row
    };
    const handleConfirmClick2 = () => {
        setTitle('');
        setCapacite(20);
        onSubmitDeleteMultiple();
        setIsDialogOpen2(false); // close the dialog after deleting
    };
    /** end */
    /** submit */
    const onSubmitAdd = async (e) => {
        e.preventDefault(); // Prevents the default behavior of form submission
        const data = {
            "className": title,
            "capacité": capacite,
        }

        // Additional logic to handle form submission
        try {
            const response = await addNewSalle(data);
            if (response && response.code === 200) {
                toast.success(`La catégorie est ajouté avec succès!`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                // Optionally reset form fields here
                fetchData();
            } else {
                toast.error(`Erreur! + ${response.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } catch (error) {
            toast.error('Erreur! Une erreur s\'est produite. Veuillez réessayer.', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        // Close the dialog or perform any other actions
        handleCancelAddDialogClick();
    };
    const onSubmitUpdate = async (e) => {
        e.preventDefault(); // Prevents the default behavior of form submission
        const data = {
            "className": title,
            "capacité": capacite,
        }
        console.log(data);
        // Additional logic to handle form submission
        try {
            const response = await updateSalleData(menuTargetRow.ID_ROWID, data);
            if (response && response.code === 200) {
                toast.success(`Les données de la catégorie est modifi avec succès!`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                // Optionally reset form fields here
                fetchData();
            } else {
                toast.error(`Erreur! + ${response.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } catch (error) {
            toast.error('Erreur! Une erreur s\'est produite. Veuillez réessayer.', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        // Close the dialog or perform any other actions
        handleCancelAddDialogClick();
    };
    const onSubmitdeleteSalle = async (catId) => {
        try {
            const response = await deleteSalle(catId);

            if (response.code === 200) {
                // Delete was successful, now remove the cat from your local state
                toast.success(`La salle est bien supprimer.`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                fetchData();
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
    const onSubmitDeleteMultiple = async () => {
        // Using Promise.all to make simultaneous delete requests for each selected student
        await Promise.all(selected.map(id => onSubmitdeleteSalle(id)));
        await fetchData();
        setSelected([]);  // Clear the selection after deleting
    };
    /** end submit */
    /** default used */
    const handleSubCatClick = async (categories, title) => {
        const result = await allCat.filter(A => categories.some(B => B.ID_ROWID === A.id));
        setIsSub(true);
        setCatTitle(title)
        await setData(result);
    };
    const clearSelectedSubcategory = () => {
        setData(allCat);
        setIsSub(false);
    };

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

            <Helmet>
                <title> Utilisateurs</title>
            </Helmet>

            <Container>
                <ToastContainer />
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Salles

                    </Typography>

                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => {
                            setIsAddDialogOpen(true);
                        }}>
                        Nouvelle Salle
                    </Button>
                </Stack>
                <Card>

                    <UserListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        onDeleteSelected={() => { handleDeleteClick2() }}
                        isSub={isSub}
                        onClearSelected={() => { clearSelectedSubcategory() }}
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
                                    {
                                        filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            const { ID_ROWID, className, capacité, createdAt } = row;
                                            // const isEditing = editedUser && editedUser.ID_ROWID === row.ID_ROWID;

                                            const selectedClass = selected.indexOf(className) !== -1;

                                            return (
                                                <TableRow hover key={ID_ROWID} tabIndex={-1} role="checkbox" selected={selectedClass}>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selected.indexOf(ID_ROWID) !== -1}
                                                            onChange={(event) => handleClick(event, ID_ROWID)} />
                                                    </TableCell>
                                                    <TableCell width={'15%'}>

                                                        <Typography variant="subtitle2" noWrap>
                                                            {className}
                                                        </Typography>

                                                    </TableCell>

                                                    <TableCell align="left">
                                                        {capacité}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {createdAt.split('T')[0]}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button variant="light" onClick={() => handleOpenCalendar(row.ID_ROWID)} startIcon={<Iconify icon={'uil:calender'} sx={{ mr: 2 }} />}>
                                                            Calendrier
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton size="small" onClick={(e) => {
                                                            handleOpenMenu(e);
                                                            setTitle(className);
                                                            setCapacite(capacité);
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
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

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
                    setIsUpdateDialogOpen(true);
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
            {/* dialog for adding a new Categorie */}
            <Dialog open={isAddDialogOpen} onClose={handleCancelAddDialogClick}
                aria-labelledby="form-dialog-title">
                <DialogContent >
                    <DialogTitle paddingBottom={2}> Ajouter Salle.</DialogTitle>
                    <form
                        onSubmit={onSubmitAdd}
                    >
                        <Grid container spacing={3}>

                            <Grid item xs={12} >
                                <TextField
                                    name="name"
                                    label="Nom De Salle"
                                    required
                                    value={title} // Set the value prop
                                    onChange={(e) => setTitle(e.target.value)} // Handle change event
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    name="capacite"
                                    label="Capacité"
                                    type="number"
                                    required
                                    value={capacite} // Set the value prop
                                    onChange={(e) => setCapacite(e.target.value)} // Handle change event
                                    fullWidth
                                />
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
                        </Grid>


                    </form>
                </DialogContent>
            </Dialog>
            {/* end */}
            {/* dialog for updating a new Categorie */}
            <Dialog open={isUpdateDialogOpen} onClose={handleCancelUpdateDialogClick}
                aria-labelledby="form-dialog-title">
                <DialogContent >
                    <DialogTitle paddingBottom={2}> Update Catégorie.</DialogTitle>
                    <form
                        onSubmit={onSubmitUpdate}
                    >
                        <Grid container spacing={3}>

                            <Grid item xs={12} >
                                <TextField
                                    name="name"
                                    label="Nom De Salle"
                                    required
                                    value={title} // Set the value prop
                                    onChange={(e) => setTitle(e.target.value)} // Handle change event
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    name="capacite"
                                    label="Capacité"
                                    type="number"
                                    required
                                    value={capacite} // Set the value prop
                                    onChange={(e) => setCapacite(e.target.value)} // Handle change event
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        style={{ backgroundColor: 'blue', color: 'white' }}>
                                        Modifier
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>


                    </form>
                </DialogContent>
            </Dialog>
            {/* end */}
            {/* dialog for deleting one item */}
            <Dialog open={isDialogOpen} onClose={handleCancelClick}>
                <DialogContent>
                    <DialogTitle>Êtes-vous sûr de vouloir supprimer cet élément ?
                    </DialogTitle>
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
            <Dialog open={isDialogOpen2} scroll="body" onClose={handleCancelClick2}>
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

            {/* dialog for calendar */}
            <Dialog open={isDialogOpen3} onClose={handleCancelClick3} fullWidth
                maxWidth="lg">
                <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <MyCalendar colorMap={groups} events={events} fetchEvents={fetchData} />
                </div>
            </Dialog>
            {/* end */}
        </>
    );
}