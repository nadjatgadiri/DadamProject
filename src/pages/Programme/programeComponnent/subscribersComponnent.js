import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';
import {
    Toolbar, Tooltip, OutlinedInput, InputAdornment,
    InputLabel,
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
    Grid, Box, FormGroup, FormControlLabel
} from '@mui/material';
import { Buffer } from "buffer";
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';

// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
// sections
import { UserListHead, UserListToolbarP } from '../../../sections/@dashboard/user';
// api importation
import { getProgRegistrations, updateRegestraion, deleteRegistration, affectation } from '../../../RequestManagement/registrationManagement';
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
    const [updateMode, setUpdateMode] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

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
    const [checkedItems, setCheckedItems] = useState({}); // State to keep track of checked items
    const [subWithOutGroup, setSubWithOutGroup] = useState(0); // State to keep of the number track of subscribers without groups
    const [selectedPlacesNMB, setSelectedPlacesNMB] = useState(0); // State to keep track of the number new selected places in the groups
    const [isDesabled, setIsDesabled] = useState(false); // State to keep track of the number new selected places in the groups

    /* -------------------------- */
    const [selectdGroup, setSelectdGroup] = useState(false);
    /** dialogs */
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpen2, setIsDialogOpen2] = useState(false);
    /** end */

    /** api */
    const fetchData = async () => {
        setGroupPie1(null);
        setCheckedItems({}); // State to keep track of checked items
        setSubWithOutGroup(0); // State to keep of the number track of subscribers without groups
        setSelectedPlacesNMB(0); // State to keep track of the number new selected places in the groups
        setIsDesabled(false); // State to keep track of the number new selected places in the groups

        const result = await getProgRegistrations(idProg);
        if (result.code === 200) {

            const subscribe = result.registrations.map(registraion => ({
                id: registraion.ID_ROWID,
                idStudent: registraion.students.ID_ROWID,
                name: `${registraion.students.personProfile2.firstName} ${registraion.students.personProfile2.lastName}`,
                image: registraion.students.personProfile2.imagePath !== null && registraion.students.personProfile2.imagePath !== '' ?
                    `data:image/jpeg;base64,${Buffer.from(
                        registraion.students?.personProfile2.imagePath.data).toString("base64")}` : '',
                group: registraion.students.groupes[0] ? {
                    id: registraion.students.groupes[0].ID_ROWID,
                    name: registraion.students.groupes[0].GroupeName,
                } : null,
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

            // Convert groupCounts into an array of objects
            const groupData1 = Object.entries(groupCounts).map(([groupName, count]) => ({
                name: groupName,
                label: groupName === "with Group" ? "avec Groupe" : "sans groupe",
                value: count,
            }));
            console.log(groupData1?.find(entry => entry.name === 'without Group') === undefined);
            if (groupData1?.find(entry => entry.name === 'without Group') === undefined || groupPie1?.find(entry => entry.name === 'without Group')?.value === 0) {
                console.log("a");
                setIsDesabled(true);
            } else {
                console.log("b");
                setIsDesabled(false);
            }
            setGroupPie1(groupData1);
            setSubWithOutGroup(groupData1.find(entry => entry.name === 'without Group')?.value || 0);
            setData(subscribe);

        } else {
            // when we got an error
            toast.error(`Error! + ${result.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };
    useEffect(() => {
        fetchData();
    }, [groups]); // Empty dependency array means this effect runs once when component mounts

    /** end api */
    /** dialog handdel */
    // update
    const handleUpdateClick = async () => {
        try {

            const updatedData = {
                "idRegestarion": menuTargetRow.id, // assuming the name format is "FirstName LastName"
                "idGroup": menuTargetRow.group ? menuTargetRow.group.id : null,
                "idStudent": menuTargetRow.idStudent,
                "idProg": idProg
            };
            const response = await updateRegestraion(updatedData);

            if (response.code === 200) {
                toast.success("Le groupe de l'abonnée à été changer", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                await props.updateData();
                setUpdateMode(false);
                setMenuTargetRow(null);
                setSelectdGroup(null);
            } else {
                toast.error(`Error! + ${response.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                console.error("Error updating Le groupe de l'abonnée:", response.message);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
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
    };
    const handleCancelClick2 = () => {
        setIsDialogOpen2(false);
    };
    const handleConfirmClick = () => {
        console.log(menuTargetRow);
        if (menuTargetRow && menuTargetRow.id) {
            onSubmitDeleteProgram(menuTargetRow.id);
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
    const onSubmitDeleteProgram = async (id) => {
        try {
            const response = await deleteRegistration(id);

            if (response.code === 200) {
                // Delete was successful, now remove the cat from your local state
                toast.success(`L'abonnement est bien supprimer.`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                fetchData();
            } else {
                toast.error(`Error! + ${response.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                console.error('Error deleting abonnement:', response.message);
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
    // form part 

    const handleCheckboxChange = async (option) => {
        const leftedPlaces = option.capacity - option.nbrStudents;
        let nmbPTaked;
        if (!checkedItems[option.id]?.value === true) {
            const result = (subWithOutGroup - leftedPlaces) < 0 ? 0 : subWithOutGroup - leftedPlaces;
            nmbPTaked = subWithOutGroup - result;
            const added = subWithOutGroup - result + selectedPlacesNMB;
            setSelectedPlacesNMB(added);
            setSubWithOutGroup(result);
        }
        else if (selectedPlacesNMB) {
            const result = selectedPlacesNMB + checkedItems[option.id] ? checkedItems[option.id].take : 0;
            setSubWithOutGroup(result);
            nmbPTaked = 0;
            const prices = selectedPlacesNMB - checkedItems[option.id] ? checkedItems[option.id].take : 0;
            setSelectedPlacesNMB(prices);
        }

        setCheckedItems(prevState => ({
            ...prevState,
            [option.id]: {
                id: option.id,
                value: !prevState[option.id]?.value,
                take: nmbPTaked
            } // Toggle the checked state
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const sendData = { "groups": checkedItems, "idProg": idProg };
            console.log(sendData);
            const response = await affectation(sendData);
            if (response && response.code === 200) {
                toast.success(`Les abonnées sont affecter avec succès!`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                await props.updateData();

                // fetchData();
            } else {
                toast.error('Une erreur s\'est produite. Veuillez réessayer.', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } catch (error) {
            toast.error(error.message || 'Une erreur s\'est produite. Veuillez réessayer.', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

    };
    return (
        <>
            {/*  form part */}
            {isFormOpen ?
                <div className="col-md-12 col-xl-12 col-12">
                    <div className="row">
                        {/* <!-- card --> */}
                        <div className="col-md-12 mb-5">
                            <div className="card" style={{ padding: '20px' }}>
                                <IconButton style={{ position: 'absolute', top: 0, right: 0 }} aria-label="close"
                                    onClick={() => { setIsFormOpen(false) }} >
                                    <CloseIcon />
                                </IconButton>
                                <div className="d-flex justify-content-betweenalign-items-center" style={{ padding: '10px' }}>
                                    <div>
                                        <h4 className="mb-0">
                                            Nous avons enregistré {groupPie1?.find(entry => entry.name === 'without Group')?.value || 0} inscriptions qui ne sont pas rattachées à un groupe.
                                        </h4>
                                    </div>

                                </div>
                                <form
                                    onSubmit={handleSubmit}
                                >
                                    <Grid container spacing={1} >
                                        {
                                            groups.map((option) => (
                                                (option.capacity !== option.nbrStudents) && (
                                                    <Grid item xs={(groups.length < 4 && 12) || (groups.length >= 4 && groups.length < 7 && 6) || 3} key={option.id}>

                                                        <FormGroup>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={checkedItems[option.id]?.value || false}
                                                                    disabled={subWithOutGroup === 0 && (!checkedItems[option.id]?.value)}
                                                                    onChange={() => handleCheckboxChange(option)} />}
                                                                label={`Groupe ${option.name} [${option.capacity - option.nbrStudents} Places Libre]`}
                                                            />
                                                        </FormGroup>
                                                    </Grid>

                                                )))
                                        }

                                    </Grid>
                                    <Grid item xs={12}>
                                        Il y a {selectedPlacesNMB} places qui ont été définies.
                                    </Grid>
                                    <Grid item xs={12} style={{ paddingTop: "10px" }}>
                                        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                style={(subWithOutGroup !== 0) ? { backgroundColor: 'gray', color: 'white' } : { backgroundColor: 'blue', color: 'white' }}
                                                disabled={subWithOutGroup !== 0}
                                            >
                                                Affecter
                                            </Button>
                                        </Box>
                                    </Grid>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                :
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
                                                            const isEditing = updateMode && menuTargetRow && menuTargetRow.id === row.id;
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
                                                                        {isEditing ? (

                                                                            <Select
                                                                                fullWidth
                                                                                size="small"
                                                                                value={menuTargetRow.group ? menuTargetRow.group.id : "aucun"}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    if (value === "aucun") {
                                                                                        setMenuTargetRow({
                                                                                            ...menuTargetRow,
                                                                                            group: null // Stored value
                                                                                        })
                                                                                    }
                                                                                    else {
                                                                                        const obj = groups.find(obj => obj.id === value)
                                                                                        setMenuTargetRow({
                                                                                            ...menuTargetRow,
                                                                                            group: obj // Stored value
                                                                                        })
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <MenuItem key="aucun" value="aucun">
                                                                                    Non spécifié
                                                                                </MenuItem>
                                                                                {
                                                                                    groups.map((option) => (
                                                                                        (option.capacity !== option.nbrStudents || option.id === selectdGroup) && (
                                                                                            <MenuItem key={option.id} value={option.id}>
                                                                                                {option.name}
                                                                                            </MenuItem>
                                                                                        )
                                                                                    ))
                                                                                }

                                                                            </Select>
                                                                        ) :
                                                                            (group !== null ? group.name :
                                                                                <>
                                                                                    <Label color='success'>Non Spécifié</Label>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </TableCell>


                                                                    <TableCell >
                                                                        {isEditing ? (
                                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                <IconButton size="small"
                                                                                    onClick={() => handleUpdateClick()}
                                                                                >
                                                                                    <Iconify icon="icon-park-solid:correct" style={{ color: 'blue', margin: '2px' }} />
                                                                                </IconButton>
                                                                                <IconButton size="small"
                                                                                    onClick={() => {
                                                                                        setUpdateMode(false);
                                                                                        setMenuTargetRow(null);
                                                                                        setSelectdGroup(null);
                                                                                    }}
                                                                                >
                                                                                    <Iconify icon="foundation:x" style={{ color: 'red', margin: '2px' }} />
                                                                                </IconButton>
                                                                            </div>

                                                                        ) : (
                                                                            <IconButton size="small" onClick={(e) => {
                                                                                handleOpenMenu(e);
                                                                                setUpdateMode(false);
                                                                                setMenuTargetRow(row);
                                                                                setSelectdGroup(row.group?.id);
                                                                            }}>
                                                                                <Iconify icon={'eva:more-vertical-fill'} />
                                                                            </IconButton>)}

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
                                    <Typography className="mb-0 " variant="h6">Répartition Des Abonnés
                                    </Typography>
                                </div>
                            </div>
                            {/* <!-- Card body --> */}
                            <div className="card-body" >
                                {(groupPie1 !== null) ?
                                    <PieChart
                                        series={[
                                            {
                                                paddingAngle: 1,
                                                outerRadius: 90,
                                                data: groupPie1,
                                            },
                                        ]}
                                        width={300}
                                        height={265}
                                        margin={{ top: 80, bottom: 10, }}
                                        slotProps={{
                                            legend: {
                                                direction: 'row',
                                                position: { vertical: 'top', horizontal: 'middle' },
                                                itemMarkWidth: 20,
                                                itemMarkHeight: 2,
                                                markGap: 5,
                                                itemGap: 10,
                                                labelStyle: {
                                                    fontSize: 14,
                                                },
                                            },
                                        }}
                                    /> : null}
                                <Button className="" variant="contained" disabled={isDesabled} style={{ width: "100%" }} startIcon={<Iconify icon="eva:plus-fill" />}
                                    onClick={() => { setIsFormOpen(true) }}

                                >
                                    Affecter Les Abonnée Aux Groupes
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
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
                <MenuItem onClick={() => {
                    setUpdateMode(true);
                    handleCloseMenu();
                }}>
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
