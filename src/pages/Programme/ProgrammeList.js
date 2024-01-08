import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
} from '@mui/material';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// api importation
import { getAllProgrammes, deleteProgramme } from '../../RequestManagement/programManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'programme', label: 'Programme', alignRight: false },
    { id: 'type', label: 'Type', alignRight: false },
    { id: 'category', label: 'Catégorie', alignRight: false },
    { id: 'prix', label: 'prix', alignRight: false },
    { id: 'stat', label: 'Statut Des Données', alignRight: false },
    { id: 'isPublished', label: 'Publié', alignRight: false },
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
        return filter(array, (_cat) => _cat.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}
/** end */
export default function ProgrammePage() {
    const navigate = useNavigate();

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
    /*--------------------------*/
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const filtered = applySortFilter(data, getComparator(order, orderBy), filterName);

    const isNotFound = !filtered.length && !!filterName;

    /*--------------------------*/
    /** dialogs */
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpen2, setIsDialogOpen2] = useState(false);
    /** end */

    /** api */
    const fetchData = async () => {
        const result = await getAllProgrammes();
        if (result.code === 200) {
            setData(result.programs);
        } else {
            // when we got an error
            console.log(result);
            toast.error(`Error! + ${result.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this effect runs once when component mounts

    /** end api */
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
        try {
            console.log(progId);
            const response = await deleteProgramme(progId);

            if (response.code === 200) {
                // Delete was successful, now remove the cat from your local state
                toast.success(`Le programme est bien supprimer.`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                fetchData();
            } else {
                toast.error(`Error! + ${response.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                console.error('Error deleting student:', response.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
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
            <Helmet>
                <title> Utilisateurs</title>
            </Helmet>

            <Container>
                <ToastContainer />
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Programmes
                    </Typography>

                    <Link to="/dashboard/addProgramme">
                        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                            Nouveau Programme
                        </Button>
                    </Link>
                </Stack>
                <Card>
                    <UserListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        onDeleteSelected={() => {
                            handleDeleteClick2();
                        }}
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
                                    {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { ID_ROWID, title, type, isPublished, isSkiped, categorie, prix, typeOfPaiment } = row;
                                        // const isEditing = editedUser && editedUser.ID_ROWID === row.ID_ROWID;

                                        const selectedUser = selected.indexOf(title) !== -1;

                                        return (
                                            <TableRow hover key={ID_ROWID} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selected.indexOf(ID_ROWID) !== -1}
                                                        onChange={(event) => handleClick(event, ID_ROWID)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Link to={`/dashboard/ProgrameProfile/${ID_ROWID}`}>

                                                        <Typography variant="subtitle2" noWrap>
                                                            {title}
                                                            <Iconify icon={'mingcute:link-fill'} sx={{ mr: 1 }} style={{ margin: "5px" }} />
                                                        </Typography>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {type}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {categorie.title}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {prix} DA {typeOfPaiment}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Label color={isSkiped ? 'error' : 'success'}>{isSkiped ? 'Incomplet' : 'Complet'}</Label>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Label color={!isPublished ? 'error' : 'success'}>
                                                        {isPublished ? 'Publier' : 'Non-Publier'}
                                                    </Label>
                                                </TableCell>

                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            handleOpenMenu(e);
                                                            setMenuTargetRow(row);
                                                            console.log(row);
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
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container >

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
                <MenuItem onClick={() => { navigate(`/dashboard/updateProgramme/${menuTargetRow.ID_ROWID}`, { replace: true }); }}>
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
