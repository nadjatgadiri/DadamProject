import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
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
} from '@mui/material';
import { Buffer } from "buffer";
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
// sections
import { UserListHead, UserListToolbarP } from '../../../sections/@dashboard/user';
// api importation
import { getProgRegistrations } from '../../../RequestManagement/registrationManagement';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Nom', alignRight: false },
    { id: 'subDate', label: "Date D'Inscription", alignRight: false },
    { id: 'group', label: 'Group', alignRight: false },
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
const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
    width: 50,
    height: 40,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
        width: 300,
        boxShadow: theme.customShadows.z8,
    },
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
    },
}));
/** end */
const SubscribersComponnent = (props) => {
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
    const [filterGroup, setFilterGroup] = useState(''); // Add a state for the selected group filter
    const handleSortClick = (value) => {
        setFilterGroup(value);
    };
    /* -------------------------- */
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const filtered = applySortFilter(data, getComparator(order, orderBy), filterName, filterGroup);

    const isNotFound = !filtered.length && !!filterName;
    /** ------------------------ */
    const [groupPie1, setGroupPie1] = useState(null);
    /* -------------------------- */
    /** dialogs */
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpen2, setIsDialogOpen2] = useState(false);
    /** end */

    /** api */
    const fetchData = async () => {
        const result = await getProgRegistrations(idProg);
        console.log(result);
        if (result.code === 200) {

            const subscribe = result.registrations.map(registraion => ({
                id: registraion.ID_ROWID,
                name: `${registraion.students.personProfile2.firstName} ${registraion.students.personProfile2.lastName}`,
                image: registraion.students.personProfile2.imagePath !== null && registraion.students.personProfile2.imagePath !== '' ?
                    `data:image/jpeg;base64,${Buffer.from(
                        registraion.students?.personProfile2.imagePath).toString("base64")}` : '',
                group: registraion.students.groupes[0] ? registraion.students.groupes[0].GroupeName : null,
                subDate: registraion.createdAt

            }));
            /** Subscribre with groups vs Subscribre withOut groups */
            const groupCounts = await subscribe.reduce((acc, current) => {
                const { group } = current;
                if (group) {
                    acc["with Group"] = (acc["with Group"] || 0) + 1;
                }
                else {
                    acc["without Group"] = (acc["without Group"] || 0) + 1;
                }
                return acc;
            }, {});
            console.log(groupCounts)
            // Convert groupCounts into an array of objects
            const groupData1 = Object.entries(groupCounts).map(([groupName, count]) => ({
                name: groupName,
                label: groupName === "with Group" ? "avec Groupe" : "sans groupe",
                value: count,
            }));
            setGroupPie1(groupData1);

            setData(subscribe);

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
            <div className="col-md-12 col-xl-8 col-12">
                <div className="row">
                    <div className="col-md-12 mb-5">
                        {/* <!-- card --> */}
                        <div className="card" >
                            {/* <!-- card body --> */}

                            <UserListToolbarP
                                title="Liste des abonnés"
                                numSelected={selected.length}
                                filterName={filterName}
                                onFilterName={handleFilterByName}
                                onDeleteSelected={() => {
                                    handleDeleteClick2();
                                }}
                                isFilterd={1}
                                selectList={groups}
                                onGroupSelected={(value) => {
                                    handleSortClick(value);
                                }}
                            />
                            {/* <!-- table --> */}
                            <>

                                <Scrollbar>
                                    <TableContainer sx={{ width: "100%", height: 300 }}>
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
                                                    const { id, name, image, group, subDate } = row;

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
                                                                    <Avatar alt={name} src={image} style={{ width: '40px', height: '40px', marginRight: '5px' }} />

                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {name}
                                                                    </Typography>

                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell  >
                                                                {formatDate(subDate)}
                                                            </TableCell>
                                                            <TableCell >
                                                                {group !== null ? group :
                                                                    <>
                                                                        <Label color='success'>{"Non Spécifié"}</Label>
                                                                    </>}
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
                <div className="card mb-5">
                    {/* <!-- Card header --> */}
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="mb-0">Répartition des Abonnés par Groupe
                            </h4>
                        </div>
                    </div>
                    {/* <!-- Card body --> */}
                    <div className="card-body" style={{ display: 'flex', alignItems: 'center' }}>
                        {(groupPie1 !== null) ?
                            <PieChart
                                series={[
                                    {
                                        paddingAngle: 5,
                                        innerRadius: 50,
                                        outerRadius: 100,
                                        data: groupPie1,
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
export default SubscribersComponnent;
