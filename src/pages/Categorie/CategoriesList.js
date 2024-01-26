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
    TextField,
    Grid,
    Box,
    Popper,
    Autocomplete,
    DialogTitle,
    FormGroup,
    FormControlLabel,
    List,
    ListItem,
    ListItemIcon,
} from '@mui/material';
import { InlineIcon } from '@iconify/react';
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
import {
    getAllCategories,
    addNewCategory,
    updateCategoryData,
    deleteCategory,
} from '../../RequestManagement/categorieManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'title', label: 'Titre', alignRight: false },
    { id: 'isPublished', label: 'Publié', alignRight: false },
    { id: 'publishedAt', label: 'Date de publication', alignRight: false },
    { id: 'princCategorie', label: 'Catégories principales', alignRight: false },
    { id: 'subCatégories', label: 'Sous-catégories', alignRight: false },
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
export default function CategoriePage() {
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
    const [selectList, setSelectList] = useState([]);

    const [iconsList, setIconsList] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    /*--------------------------*/
    /** dialogs */
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false); // Set an initial value, if needed
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [title, setTitle] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpen2, setIsDialogOpen2] = useState(false);
    /** end */

    /** api */
    const fetchData = async () => {
        const result = await getAllCategories();
        if (result.code === 200) {
            const categories = await Promise.all(
                result.categories.map(async (cat) => ({
                    id: cat.ID_ROWID,
                    title: cat.title, // Concatenating first name and last name
                    publishedAt: cat.publishedAt,
                    isPublished: cat.isPublished,
                    princCategorie: await result.categories.find(
                        (princCat) => princCat.ID_ROWID === cat.supperCatID
                    ),
                    subCategories: cat.categories,
                    icon: cat.icon,
                }))
            );
            setError('');
            const data = await Promise.all(
                categories.map(async (cat) => ({
                    id: cat.id,
                    label: cat.title,
                }))
            );
            console.log(data);
            if (categories) {
                setData(categories);
                setAllCat(categories);
                setSelectList(data);
            }
        } else {
            // when we got an error
            console.log(result);
            toast.error(`Error! + ${result.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const fetchIcons = async () => {
        try {
            const response = await fetch(`https://api.iconify.design/search?query=home`);
            const data = await response.json();
            console.log(data);
            setIconsList(data.icons);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching icons:', error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
        // fetchIcons();
    }, []); // Empty dependency array means this effect runs once when component mounts

    const handleSearch = async (event) => {
        const inputText = event.target.value.toLowerCase();
        setSearchText(inputText);

        setLoading(true);
        try {
            const response = await fetch(`https://api.iconify.design/search?query=${inputText}`);
            const data = await response.json();
            setIconsList(data.icons);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching icons:', error);
        }
        setLoading(false);
    };

    const handleMenuItemClick = (icon) => {
        setSelectedIcon(icon);
    };
    /** end api */
    /** dialog handdel */
    // add
    const handleCancelAddDialogClick = () => {
        setIsAddDialogOpen(false);
        setIsUpdateDialogOpen(false);
        setIsChecked(false);
        setSelectedCategory(null);
        setTitle('');
        setSelectedIcon('');
    };
    // update
    const handleCancelUpdateDialogClick = () => {
        setIsUpdateDialogOpen(false);
        setIsChecked(false);
        setSelectedCategory(null);
        setTitle('');
        setSelectedIcon('');
    };
    const handleAutocompleteChange = (event, newValue) => {
        console.log(newValue);
        setSelectedCategory(newValue);
    };
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
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
        if (menuTargetRow && menuTargetRow.id) {
            onSubmitDeleteCategory(menuTargetRow.id);
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
    const onSubmitAdd = async (e) => {
        e.preventDefault(); // Prevents the default behavior of form submission
        const data = {
            "title": title,
            "supperCatID": selectedCategory?.id,
            "isPublished": isChecked,
            "icon": selectedIcon,
        };
        // Additional logic to handle form submission
        try {
            const response = await addNewCategory(data);
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
            toast.error("Erreur! Une erreur s'est produite. Veuillez réessayer.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        // Close the dialog or perform any other actions
        handleCancelAddDialogClick();
    };
    const onSubmitUpdate = async (e) => {
        e.preventDefault(); // Prevents the default behavior of form submission
        const data = {
            "title": title,
            "supperCatID": selectedCategory?.id,
            "isPublished": isChecked,
            "icon": selectedIcon,
        };
        console.log(data);
        // Additional logic to handle form submission
        try {
            const response = await updateCategoryData(menuTargetRow.id, data);
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
            toast.error("Erreur! Une erreur s'est produite. Veuillez réessayer.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        // Close the dialog or perform any other actions
        handleCancelAddDialogClick();
    };
    const onSubmitDeleteCategory = async (catId) => {
        try {
            const response = await deleteCategory(catId);

            if (response.code === 200) {
                // Delete was successful, now remove the cat from your local state
                toast.success(`La categorie est bien supprimer.`, {
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
        await Promise.all(selected.map((id) => onSubmitDeleteCategory(id)));
        await fetchData();
        setSelected([]); // Clear the selection after deleting
    };
    /** end submit */
    /** default used */
    const handleSubCatClick = async (categories, title) => {
        const result = await allCat.filter((A) => categories.some((B) => B.ID_ROWID === A.id));
        setIsSub(true);
        setCatTitle(title);
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
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
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
                        {isSub ? `Sous-Categories De ${catTitle}` : 'Categories'}
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => {
                            setIsAddDialogOpen(true);
                        }}
                    >
                        Nouvelle Categorie
                    </Button>
                </Stack>
                <Card>
                    <UserListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        onDeleteSelected={() => {
                            handleDeleteClick2();
                        }}
                        isSub={isSub}
                        onClearSelected={() => {
                            clearSelectedSubcategory();
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
                                    {filtered
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const { id, title, publishedAt, isPublished, princCategorie, subCategories } =
                                                row;
                                            // const isEditing = editedUser && editedUser.id === row.id;

                                            const selectedUser = selected.indexOf(title) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={selectedUser}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selected.indexOf(id) !== -1}
                                                            onChange={(event) => handleClick(event, id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell width={'15%'}>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {title}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Label color={!isPublished ? 'error' : 'success'}>
                                                            {isPublished ? 'Publier' : 'Non-Publier'}
                                                        </Label>
                                                    </TableCell>
                                                    <TableCell align="left">{publishedAt}</TableCell>
                                                    <TableCell align="left">{princCategorie?.title}</TableCell>
                                                    <TableCell align="center">
                                                        {subCategories?.length !== 0 ? (
                                                            <Button
                                                                variant="light"
                                                                onClick={() => handleSubCatClick(subCategories, title)}
                                                                startIcon={<Iconify icon={'ep:list'} sx={{ mr: 2 }} />}
                                                            >
                                                                Lister
                                                            </Button>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                handleOpenMenu(e);
                                                                setMenuTargetRow(row);
                                                                setSelectedForUpdate(
                                                                    selectList.filter((option) => option.id !== row.id)
                                                                );
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
                <MenuItem
                    onClick={() => {
                        setIsUpdateDialogOpen(true);
                        setTitle(menuTargetRow.title);
                        setIsChecked(menuTargetRow.isPublished);
                        setSelectedIcon(menuTargetRow.icon);
                        setSelectedCategory({
                            id: menuTargetRow.princCategorie.id,
                            label: menuTargetRow.princCategorie.title,
                        });
                        handleCloseMenu();
                    }}
                >
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
            {/* dialog for adding a new Categorie */}
            <Dialog
                open={isAddDialogOpen}
                onClose={handleCancelAddDialogClick}
                aria-labelledby="form-dialog-title"
            >
                <DialogContent>
                    <DialogTitle paddingBottom={2}> Ajouter Catégorie.</DialogTitle>
                    <form onSubmit={onSubmitAdd}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    name="title"
                                    label="Titre"
                                    required
                                    value={title} // Set the value prop
                                    onChange={(e) => setTitle(e.target.value)} // Handle change event
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ position: 'relative' }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    name="supperCat"
                                    options={selectList}
                                    PopperComponent={(props) => (
                                        <Popper {...props} placement="top" sx={{ maxHeight: 150 }}>
                                            {props.children}
                                        </Popper>
                                    )}
                                    renderInput={(params) => <TextField {...params} label="Catécorie principale" />}
                                    value={selectedCategory} // Set the value prop
                                    onChange={handleAutocompleteChange} // Handle change event
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Search Icon"
                                    variant="outlined"
                                    value={searchText}
                                    onChange={handleSearch}
                                    fullWidth
                                />
                                <List style={{ display: 'flex', alignItems: 'center' }}>
                                    {selectedIcon !== '' && (
                                        <>
                                            <p style={{ color: 'black' }}>Icône sélectionnée:</p>
                                            <ListItem
                                                button
                                                key={selectedIcon}
                                                onClick={() => handleMenuItemClick('')}
                                                selected={selectedIcon}
                                                style={{
                                                    width: '60%',
                                                    backgroundColor: 'white',
                                                    alignItems: 'center',
                                                    marginLeft: '10px',
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <InlineIcon
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            padding: '10px',
                                                            backgroundColor: '#d0d0d0',
                                                            borderRadius: '10px',
                                                        }}
                                                        icon={selectedIcon}
                                                    />
                                                </ListItemIcon>
                                            </ListItem>
                                        </>
                                    )}
                                </List>

                                <List
                                    style={{
                                        padding: '10px',
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                                        backgroundColor: 'white',
                                    }}
                                >
                                    {iconsList?.map((icon, index) => (
                                        <ListItem
                                            button
                                            key={index}
                                            onClick={() => handleMenuItemClick(icon)}
                                            selected={selectedIcon === icon}
                                            style={{
                                                backgroundColor: selectedIcon === icon ? '#d0d0d0' : '',
                                                borderRadius: '10px',
                                                paddingLeft: '10px',
                                                paddingRight: '15px',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <ListItemIcon>
                                                <InlineIcon style={{ width: '30px', height: '30px' }} icon={icon} />
                                            </ListItemIcon>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid item xs={12}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                                        label="Publier"
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        style={{ backgroundColor: 'blue', color: 'white' }}
                                    >
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
            <Dialog
                open={isUpdateDialogOpen}
                onClose={handleCancelUpdateDialogClick}
                aria-labelledby="form-dialog-title"
            >
                <DialogContent>
                    <DialogTitle paddingBottom={2}> Update Catégorie.</DialogTitle>
                    <form onSubmit={onSubmitUpdate}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    name="title"
                                    label="Titre"
                                    required
                                    value={title} // Set the value prop
                                    onChange={(e) => setTitle(e.target.value)} // Handle change event
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ position: 'relative' }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    name="supperCat"
                                    options={selectedForUpdate}
                                    PopperComponent={(props) => (
                                        <Popper {...props} placement="top" sx={{ maxHeight: 150 }}>
                                            {props.children}
                                        </Popper>
                                    )}
                                    renderInput={(params) => <TextField {...params} label="Catécorie principale" />}
                                    value={selectedCategory} // Set the value prop
                                    onChange={handleAutocompleteChange} // Handle change event
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Search Icon"
                                    variant="outlined"
                                    value={searchText}
                                    onChange={handleSearch}
                                    fullWidth
                                />
                                <List style={{ display: 'flex', alignItems: 'center' }}>
                                    {selectedIcon !== '' && (
                                        <>
                                            <p style={{ color: 'black' }}>Icône sélectionnée:</p>
                                            <ListItem
                                                button
                                                key={selectedIcon}
                                                onClick={() => handleMenuItemClick('')}
                                                selected={selectedIcon}
                                                style={{
                                                    width: '60%',
                                                    backgroundColor: 'white',
                                                    alignItems: 'center',
                                                    marginLeft: '10px',
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <InlineIcon
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            padding: '10px',
                                                            backgroundColor: '#d0d0d0',
                                                            borderRadius: '10px',
                                                        }}
                                                        icon={selectedIcon}
                                                    />
                                                </ListItemIcon>
                                            </ListItem>
                                        </>
                                    )}
                                </List>

                                <List
                                    style={{
                                        padding: '10px',
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                                        backgroundColor: 'white',
                                    }}
                                >
                                    {iconsList?.map((icon, index) => (
                                        <ListItem
                                            button
                                            key={index}
                                            onClick={() => handleMenuItemClick(icon)}
                                            selected={selectedIcon === icon}
                                            style={{
                                                backgroundColor: selectedIcon === icon ? '#d0d0d0' : '',
                                                borderRadius: '10px',
                                                paddingLeft: '10px',
                                                paddingRight: '15px',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <ListItemIcon>
                                                <InlineIcon style={{ width: '30px', height: '30px' }} icon={icon} />
                                            </ListItemIcon>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid item xs={12}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                                        label="Publier"
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        style={{ backgroundColor: 'blue', color: 'white' }}
                                    >
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
                    <DialogTitle>Êtes-vous sûr de vouloir supprimer cet élément ?</DialogTitle>
                    La suppression de cette catégorie devrait également supprimer toutes les sous-catégories et programmes associés.                </DialogContent>
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
                    La suppression de ces catégories doit également supprimer toutes les sous-catégories
                    associées et programmes associés.
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
