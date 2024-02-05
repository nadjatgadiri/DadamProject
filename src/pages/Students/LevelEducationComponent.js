import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from 'react';
import {
    Grid, Stack, Card, Container, Typography,
    Box, Button, Avatar, TextField, List, ListItem,
    IconButton, ListItemAvatar, Select, FormControl,
    ListItemText, MenuItem, Dialog, DialogContent,
    DialogContentText, TableRow, TableCell, InputLabel,
    DialogActions, Table, TableBody, Collapse
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import {
    listLevelWYearEduc,
    addEducationLevel, addStudyYear,
    updateEducationLevel, updateStudyYear,
    removeLevelEduc, removeYearEduc
} from '../../RequestManagement/educLevelMAnagement';
import Iconify from '../../components/iconify';

function LevelSetting(props) {
    const { isOpen } = props;
    const [levels, setLevels] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [LibLevel, setLibLevel] = useState("");
    const [error, setError] = useState("");
    /** api */
    const fetchLevelsData = async () => {

        const result = await listLevelWYearEduc();
        if (result.code === 200) {
            setLevels(result.allLevels);
            console.log(result.allLevels);
        }

    };
    useEffect(() => {
        fetchLevelsData();
    }, []);
    const handelDelete = async (id) => {
        const result = await removeLevelEduc(id);
        if (result.code === 200) {
            fetchLevelsData();
            setError("");
        } else if (result.code === 401) {
            setError("La suppression de ce niveau n'est pas possible car il est déjà utilisé par les étudiants.");
        }
    };
    const onSubmitAdd = async (e) => {
        e.preventDefault(); // Prevents the default behavior of form submission
        const data = {
            "lib": LibLevel,
        };
        // Additional logic to handle form submission
        try {
            const response = await addEducationLevel(data);
            if (response && response.code === 200) {
                // Optionally reset form fields here
                fetchLevelsData();
                setLibLevel('');
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
    };
    const handelError = async (error) => {
        setError(error);
    };
    return (
        <Dialog open={isOpen} onClose={props.handleCancelClick}>
            <DialogContent>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom component="div">
                            Paramètres du Niveau d'Éducation
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Table aria-label="simple table" >
                            <TableBody>
                                {levels.map((level) => {
                                    return (
                                        <Row key={`${level.ID_ROWID}Level`} row={level} handelDelete={handelDelete} fetchLevelsData={fetchLevelsData} handelError={handelError} />
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Grid>

                    {addMode &&
                        <Grid item xs={12}>
                            <form onSubmit={onSubmitAdd}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        name="lastname"
                                        label="Nom"
                                        value={LibLevel}
                                        onChange={(e) => setLibLevel(e.target.value)}
                                        required
                                        fullWidth
                                    />

                                    <IconButton size="small" type="submit">
                                        <Iconify icon="icon-park-solid:correct" style={{ color: 'blue', margin: '2px' }} />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => { setAddMode(false) }} >
                                        <Iconify icon="foundation:x" style={{ color: 'red', margin: '2px' }} />
                                    </IconButton>
                                </div>
                            </form>
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <Typography variant="body2" color="error">{error}</Typography>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                {!addMode &&
                    (<Button onClick={() => { setAddMode(true) }} color="primary">
                        Ajouter Un Niveau d'Éducation
                    </Button>)}
                <Button onClick={props.handleCancelClick} color="primary">
                    Annuler
                </Button>

            </DialogActions>
        </Dialog>
    );
}
export default LevelSetting;

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [addMode, setAddMode] = useState(false);
    const [LibYear, setLibYear] = useState("");
    const handelDeleteYear = async (id) => {
        const result = await removeYearEduc(id);
        if (result.code === 200) {
            props.fetchLevelsData();
        } else if (result.code === 401) {
            props.handelError("Cette information ne peut pas être supprimée car elle est déjà utilisée par les étudiants.");
        }
    };
    const onSubmitAdd = async (e) => {
        e.preventDefault(); // Prevents the default behavior of form submission
        const data = {
            "lib": LibYear,
            "levelID": row.ID_ROWID
        };
        // Additional logic to handle form submission
        try {
            const response = await addStudyYear(data);
            if (response && response.code === 200) {
                // Optionally reset form fields here
                props.fetchLevelsData();
                setLibYear('');
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
    };
    return (
        <>
            <TableRow key={`${row.ID_ROWID}`} sx={{ display: 'flex', alignItems: 'center', '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" sx={{ width: '50%' }}>
                    {row.lib}
                </TableCell>
                <TableCell sx={{ width: '25%' }}>
                    <IconButton size="small"
                        onClick={(e) => {
                            props.handelDelete(row.ID_ROWID)
                        }}
                    >
                        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2, alignItems: 'center' }} />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow key={`${row.ID_ROWID}Year`} sx={{ display: 'flex', alignItems: 'center', '& > *': { borderBottom: 'unset' } }}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ marginLeft: 2, marginRight: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Année d'Études
                                {!addMode && <IconButton size="small" onClick={() => { setAddMode(true) }}>
                                    <Iconify icon="basil:add-solid" style={{ color: 'blue', margin: '2px' }} />
                                </IconButton>}
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    <TableRow key={"addMode"}>
                                        {addMode &&
                                            <TableCell>
                                                <form onSubmit={onSubmitAdd}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <TextField
                                                            name="libyear"
                                                            value={LibYear}
                                                            onChange={(e) => setLibYear(e.target.value)}
                                                            required
                                                            fullWidth
                                                        />

                                                        <IconButton size="small" type="submit">
                                                            <Iconify icon="icon-park-solid:correct" style={{ color: 'blue', margin: '2px' }} />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => { setAddMode(false) }} >
                                                            <Iconify icon="foundation:x" style={{ color: 'red', margin: '2px' }} />
                                                        </IconButton>
                                                    </div>
                                                </form>
                                            </TableCell>
                                        }
                                    </TableRow>
                                    {row.studyYears.map((year, index) => (
                                        <TableRow key={`${year.ID_ROWID}Year`}>
                                            <TableCell component="th" scope="row">
                                                {year.lib}
                                            </TableCell>
                                            <TableCell align='center'>
                                                <IconButton size="small"
                                                    onClick={(e) => {
                                                        handelDeleteYear(year.ID_ROWID);
                                                    }}
                                                >
                                                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                                                </IconButton>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
