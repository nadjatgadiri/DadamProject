import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import "react-toastify/dist/ReactToastify.css";
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from "react-toastify";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';

import {
    Badge, Card, Table, Stack, Paper, Avatar, Button, Popover, Checkbox, TableRow, MenuItem, CircularProgress,
    TableBody, TableCell, TableHead, Container, Typography, IconButton, TableContainer, TablePagination,
    TextField, Grid, Popper, Autocomplete, Select, FormControl, InputLabel, label, FormControlLabel, FormGroup, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { getAvailableSessions, addSessions, getAllSessionsInProg } from "../../../RequestManagement/sessionsManagement"
import '../style.css'; // Import the CSS file
import Iconify from '../../../components/iconify';
import MyCalendar from '../calendar/calendar'

const steps = ['Première Étape', 'Deuxième Étape', 'Dernière Étape'];

const blue = {
    100: '#daecff',
    200: '#b6daff',
    300: '#66b2ff',
    400: '#3399ff',
    500: '#007fff',
    600: '#0072e5',
    700: '#0059B2',
    800: '#004c99',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const StyledInputRoot = styled('div')(
    ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 400;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[500]};
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  `,
);

const StyledInput = styled('input')(
    ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.375;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
        };
    border-radius: 8px;
    margin: 0 8px;
    padding: 10px 12px;
    outline: 0;
    min-width: 0;
    width: 4rem;
    text-align: center;
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
    }
  
    &:focus-visible {
      outline: 0;
    }
  `,
);

const StyledButton = styled('button')(
    ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    line-height: 1.5;
    border: 1px solid;
    border-radius: 999px;
    border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    width: 40px;
    height: 40px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      cursor: pointer;
      background: ${theme.palette.mode === 'dark' ? blue[700] : blue[500]};
      border-color: ${theme.palette.mode === 'dark' ? blue[500] : blue[400]};
      color: ${grey[50]};
    }
  
    &:focus-visible {
      outline: 0;
    }
  
    &.increment {
      order: 1;
    }
  `,
);
function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <fragment style={{ width: '100%' }}>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ width: '20%' }} component="th" scope="row" >
                    {row.day}
                </TableCell>
                <TableCell sx={{ width: '50%' }} align="right">Répétition de ce jours est : {row.Frequence} fois.</TableCell>
                <TableCell >
                    <IconButton size="small"
                        onClick={(e) => {
                            props.openDialog1(row.codeDay)
                        }}
                    >
                        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    </IconButton>

                </TableCell>

            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Zones horaires
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '40%' }}>Commencé à</TableCell>
                                        <TableCell sx={{ width: '40%' }}>Fini à</TableCell>
                                        <TableCell align="right" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.timeZones.map((timeZonesRow, index) => (
                                        <TableRow key={row.codeDay}>
                                            <TableCell component="th" scope="row">
                                                {timeZonesRow.timeStart}
                                            </TableCell>
                                            <TableCell>{timeZonesRow.timeEnd}</TableCell>
                                            <TableCell align='center'>
                                                <IconButton size="small"
                                                    onClick={(e) => {
                                                        props.openDialog2(row.codeDay, index)
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
        </fragment>
    );
}
// convert date
function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}
function RowStep3(props) {
    const { row, id } = props;
    console.log(props);
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    return (
        <>
            <TableRow >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    {getFrenchDay(id)}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Les Plans
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell >Titre</TableCell>
                                        <TableCell >Début</TableCell>
                                        <TableCell >Fin</TableCell>
                                        <TableCell >Disponibilité</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(row).map(([key, value]) => (
                                        <Row2 row={value} id={key} />
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
function Row2(props) {
    const { row, id } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <TableRow key={id}>
                <TableCell sx={{ width: '30%' }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                            setOpen(!open)
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>

                    {id}
                </TableCell>
                <TableCell>
                    {row.start.substring(0, 5)}
                </TableCell>
                <TableCell>{row.end.substring(0, 5)}</TableCell>
                <TableCell>{row.used} fois</TableCell>
            </TableRow>
            <TableRow >
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell >Date</TableCell>
                                        <TableCell >Salles</TableCell>
                                        <TableCell align="right" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.data.map((rowData, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            <TableCell scope="row">
                                                {formatDate(rowData.day)}
                                            </TableCell>
                                            <TableCell>
                                                {rowData.classes.map((classe, index) => (
                                                    <span key={index}>
                                                        {`${classe.name}${index < rowData.classes.length - 1 ? ", " : ""}`}
                                                    </span>
                                                ))}
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
Row2.propTypes = {
    row: PropTypes.shape({
        day: PropTypes.string.isRequired, // Prop 'day' utilisée dans le composant Row
        Frequence: PropTypes.number.isRequired, // Prop 'Frequence' utilisée dans le composant Row
        timeZones: PropTypes.arrayOf(PropTypes.shape({
            timeStart: PropTypes.string.isRequired,
            timeEnd: PropTypes.string.isRequired,
        })).isRequired, // Prop 'timeZones' utilisée dans le composant Row
    }).isRequired,
};
Row.propTypes = {
    row: PropTypes.shape({
        day: PropTypes.string.isRequired, // Prop 'day' utilisée dans le composant Row
        Frequence: PropTypes.number.isRequired, // Prop 'Frequence' utilisée dans le composant Row
        timeZones: PropTypes.arrayOf(PropTypes.shape({
            timeStart: PropTypes.string.isRequired,
            timeEnd: PropTypes.string.isRequired,
        })).isRequired, // Prop 'timeZones' utilisée dans le composant Row
    }).isRequired,
};
RowStep3.propTypes = {
    row: PropTypes.shape({
        day: PropTypes.string.isRequired, // Prop 'day' utilisée dans le composant Row
        Frequence: PropTypes.number.isRequired, // Prop 'Frequence' utilisée dans le composant Row
        timeZones: PropTypes.arrayOf(PropTypes.shape({
            timeStart: PropTypes.string.isRequired,
            timeEnd: PropTypes.string.isRequired,
        })).isRequired, // Prop 'timeZones' utilisée dans le composant Row
    }).isRequired,
};
function Row4(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    console.log(row);
    return (
        <fragment style={{ width: '100%' }} >
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ width: '20%' }} component="th" scope="row" >
                    {row.groupName}
                </TableCell>
                <TableCell >
                    <IconButton size="small"
                        onClick={(e) => {
                            props.openDialog1(row.codeDay)
                        }}
                    >
                        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    </IconButton>

                </TableCell>

            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>

                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '40%' }}>Jour</TableCell>
                                        <TableCell sx={{ width: '40%' }}>Débuté à</TableCell>
                                        <TableCell sx={{ width: '40%' }}>Terminée à</TableCell>
                                        <TableCell align="right" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.values(row.days).map((day) => (
                                        Object.entries(day.plans).map(([planKey, plan]) => (
                                            <TableRow key={day.codeDay}>
                                                <TableCell component="th" scope="row">
                                                    {getFrenchDay(day.codeDay)}
                                                </TableCell>
                                                <TableCell>{plan.start}</TableCell>
                                                <TableCell>{plan.end}</TableCell>
                                            </TableRow>
                                        ))
                                    ))}
                                </TableBody>

                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </fragment >
    );
}
Row4.propTypes = {
    row: PropTypes.shape({
        day: PropTypes.string.isRequired, // Prop 'day' utilisée dans le composant Row
        Frequence: PropTypes.number.isRequired, // Prop 'Frequence' utilisée dans le composant Row
        timeZones: PropTypes.arrayOf(PropTypes.shape({
            timeStart: PropTypes.string.isRequired,
            timeEnd: PropTypes.string.isRequired,
        })).isRequired, // Prop 'timeZones' utilisée dans le composant Row
    }).isRequired,
};
function getFrenchDay(dayIndex) {
    const frenchDays = [
        "Lundi",    // Monday
        "Mardi",    // Tuesday
        "Mercredi", // Wednesday
        "Jeudi",    // Thursday
        "Vendredi", // Friday
        "Samedi",   // Saturday
        "Dimanche", // Sunday
    ];

    if (dayIndex >= 1 && dayIndex <= 7) {
        return frenchDays[dayIndex - 1];
    }
    return "Invalid day index";

};

const AppointmentsAjustements = (props) => {
    const { progData, idProg } = props;
    const NumberInput = React.forwardRef((props, ref) => {
        return (
            <BaseNumberInput
                slots={{
                    root: StyledInputRoot,
                    input: StyledInput,
                    incrementButton: StyledButton,
                    decrementButton: StyledButton,
                }}
                slotProps={{
                    incrementButton: {
                        children: <AddIcon fontSize="small" />,
                        className: 'increment',
                    },
                    decrementButton: {
                        children: <RemoveIcon fontSize="small" />,
                    },
                }}
                {...props}
                value={nmbSessionParWeek}
                onChange={(event, val) => setNmbSessionParWeek(val)}
                style={{ paddingTop: "5px" }}
                ref={ref}
            />
        );
    });
    /** dialogs */
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowID, setRowID] = useState(null);
    const [isDialogOpen2, setIsDialogOpen2] = useState(false);
    const [timeZoneID, setTimeZoneID] = useState(null);
    /** end */
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [data, setData] = useState([]);
    // for formation form

    // first step 
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [nmbSessionParWeek, setNmbSessionParWeek] = useState(0);
    const [errorsStep1, setErrorsStep1] = useState({
        "sDate": false,
        "endDate": false,
        "nmbSessionParWeek": false
    });
    // second step
    const [scheduleData, setScheduleData] = useState({});
    const [codeDay, setCodeDay] = useState(0);
    const [timeStart, setTimeStart] = useState('07:00');
    const [timeEnd, setTimeEnd] = useState('12:00');
    const [errorsStep2, setErrorsStep2] = useState(false);
    // third step 
    const [plansResult, setPlansResult] = useState({});
    const [selectedPlan, setSelectedPlan] = useState("0");// plan name
    const [selectedGroupId, setSelectedGroupId] = useState("0"); // group id
    const [selectedGroupName, setSelectedGroupName] = useState(""); // group id
    const [codeDay2, setCodeDay2] = useState("0");// code day
    const [selectedPlansList, setSelectedPlansList] = useState({});
    const [isSkip, setIsSkip] = useState(false);
    // loading Calander data
    const [isModeAdd, setIsModeAdd] = useState(false);
    const [colorMap, setColorMap] = useState({});
    const [events, setEvents] = useState([]);

    // handlers
    const handleDialogOpen1 = (id) => {
        setIsDialogOpen(true);
        setRowID(id);
    };
    const handleDialogOpen2 = (idRow, idTZ) => {
        setIsDialogOpen2(true);
        setRowID(idRow);
        setTimeZoneID(idTZ)
    };
    const handleCancelClick = () => {
        setIsDialogOpen(false);
    };
    const handleCancelClick2 = () => {
        setIsDialogOpen2(false);
    };
    const handleConfirmClick = () => {
        if (rowID) {
            // Create a copy of scheduleData
            const updatedScheduleData = { ...scheduleData };

            // Check if the key exists in scheduleData
            if (rowID in updatedScheduleData) {
                // Use the delete operator to remove the object with the specified key
                delete updatedScheduleData[rowID];

                // Update the state with the modified scheduleData
                setScheduleData(updatedScheduleData);
            } else {
                // Handle case where the key doesn't exist
                console.error(`Key ${rowID} does not exist in scheduleData`);
            }
        }
        setIsDialogOpen(false); // close the dialog after deleting
        setRowID(null); // reset the target row
    };
    const handleConfirmClick2 = () => {
        if (rowID) {
            // Create a copy of scheduleData
            const updatedScheduleData = { ...scheduleData };

            // Check if the key exists in scheduleData
            if (rowID in updatedScheduleData) {
                // Check if the index is within the bounds of the timeZones array
                if (updatedScheduleData[rowID].timeZones.length > timeZoneID) {
                    // Remove the timeZones object at the specified index
                    updatedScheduleData[rowID].timeZones.splice(timeZoneID, 1);

                    // Log the updated object
                    setScheduleData(updatedScheduleData);
                    // Now updatedData[key] will not have the timeZones object at the specified index
                } else {
                    console.error("Index out of bounds or timeZones array is empty");
                }
                if (updatedScheduleData[rowID].timeZones.length) {
                    handleConfirmClick();
                }
            } else {
                // Handle case where the key doesn't exist
                console.error(`Key ${rowID} does not exist in scheduleData`);
            }
        }
        setIsDialogOpen2(false); // close the dialog after deleting
        setRowID(null); // reset the target row
    };
    // end
    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (startDate !== null && endDate !== null && nmbSessionParWeek !== 0) {
                setErrorsStep1({
                    "sDate": false,
                    "endDate": false,
                    "nmbSessionParWeek": false
                });
                let newSkipped = skipped;
                if (isStepSkipped(activeStep)) {
                    newSkipped = new Set(newSkipped.values());
                    newSkipped.delete(activeStep);
                }
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setSkipped(newSkipped);
            }
            else {
                const er = {
                    "sDate": false,
                    "endDate": false,
                    "nmbSessionParWeek": false
                };
                if (startDate === null) {
                    er.sDate = true;
                } if (endDate === null) {
                    er.endDate = true;
                } if (!nmbSessionParWeek) {
                    er.nmbSessionParWeek = true;
                }
                setErrorsStep1(er);
            }
        }
        else if (activeStep === 1) {
            if (Object.keys(scheduleData).length !== 0) {
                setErrorsStep2(false);
                let newSkipped = skipped;
                if (isStepSkipped(activeStep)) {
                    newSkipped = new Set(newSkipped.values());
                    newSkipped.delete(activeStep);
                }
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setSkipped(newSkipped);
                handleGetAvailableSessionsTiming();
            }
            else { setErrorsStep2(true); }
        }
        else if (activeStep === 2) {
            setIsModeAdd(false);
            handleSubmit();
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setIsSkip(false);
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

    const ColorGenerator = () => {
        const data = props.groups;
        const colors = {};

        data?.forEach((option) => {
            colors[option.id] = stringToColor(`${option.name}${option.id}`);
        });
        return colors;
    };
    // add session
    const handleChange = (event) => {
        setCodeDay(event.target.value);
    };

    const handleAddData = () => {
        if (startDate !== null && endDate !== null && codeDay !== 0 && timeStart !== '' && timeEnd !== '') {

            setScheduleData((prevData) => ({
                ...prevData,
                [codeDay]: {
                    "codeDay": codeDay,
                    "day": getFrenchDay(codeDay),
                    "Frequence": getNumberOfDayInPeriod(codeDay),
                    "timeZones": [
                        ...(prevData[codeDay]?.timeZones || []),
                        { "timeStart": timeStart, "timeEnd": timeEnd },
                    ],
                },
            }));

            // Clear the input fields after adding data
            setCodeDay(0);
            setTimeStart('07:00');
            setTimeEnd('12:00');
            setErrorsStep2(false);

        }
        console.log(scheduleData);
    }
    const handleSubmit = async () => {
        if (selectedPlansList.length !== 0) {
            const response = await addSessions(selectedPlansList);
            if (response && response.code === 200) {
                console.log(response.message);
                await fetchData();// add toast a wissaaaaaaam
            }
        }
    }
    function reloadingDaysData() {
        const updatedScheduleData = {};
        Object.keys(scheduleData).forEach((key) => {
            updatedScheduleData[key] = {
                ...scheduleData[key],
                "Frequence": getNumberOfDayInPeriod(key),
            };
        });
        console.log(updatedScheduleData);
        setScheduleData(updatedScheduleData);
    }
    function getNumberOfDayInPeriod(dayCode) {
        const startD = new Date(startDate);
        const endD = new Date(endDate);
        let count = 0;
        const currentDate = startD;

        // Loop through each day within the date range
        while (currentDate <= endD) {
            // Check if the day of the week matches the provided day code
            if (currentDate.getDay() === dayCode - 1) {
                count += 1;
            }
            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return count;
    }
    const handleChangeSelectedPlan = (event) => {
        setSelectedPlan(event.target.value);
    };
    const handleChangeSelectedGroup = (event) => {
        setSelectedGroupId(event.target.value);
        // Find the selected group object from props.groups based on the selected value
        const selectedGroup = props.groups.find(group => group.id === event.target.value);
        setSelectedGroupName(selectedGroup.name);
    };
    const handleChange2 = (event) => {
        setCodeDay2(event.target.value);
        if (event.target.value === "0") setSelectedPlan("0");
    };
    const handleAddToList = async () => {
        console.log("sss");
        // const list = {
        //     "selectedGroupId":
        //     {
        //         codeDay2: {
        //             selectedPlan: { plans }
        //         },
        //     }
        // };
        // get the plan from scheduleData
        const plan = getKeyAndPlanData(codeDay2, selectedPlan);
        if (plan) {
            await updatePlansResult(codeDay2, selectedPlan);
            const list = selectedPlansList;
            console.log(list);
            if (list[selectedGroupId]) {
                // If selectedGroupId already exists in the list
                if (list[selectedGroupId].days[codeDay2]) {
                    // If codeDay2 already exists under selectedGroupId
                    Object.assign(list[selectedGroupId].days[codeDay2].plans, { [selectedPlan]: plan });
                } else {
                    // If codeDay2 does not exist under selectedGroupId
                    list[selectedGroupId].days[codeDay2] = {
                        codeDay: codeDay2,
                        plans: { [selectedPlan]: plan }
                    };
                }
            } else {
                // If selectedGroupId does not exist in the list
                list[selectedGroupId] = {
                    groupID: selectedGroupId,
                    groupName: selectedGroupName,
                    days: {
                        [codeDay2]: {
                            codeDay: codeDay2,
                            plans: { [selectedPlan]: plan }
                        }
                    }
                };
            }
        
        await setSelectedPlansList(list);
            setCodeDay2("0");
            setSelectedPlan("0");
            setSelectedGroupId("0");
        }
    }

    // To get data for a specific key 'x' and plan 'y'
    const getKeyAndPlanData = (key, plan) => {
        if (plansResult[key] && plansResult[key][plan]) {
            const planData = plansResult[key][plan].data;
            if (planData && planData.length > 0) {
                const newData = planData.map(item => {
                    const newClasses = (item.classes && item.classes.length > 0) ? [item.classes[0]] : [];
                    return {
                        ...item,
                        classes: newClasses
                    };
                });

                return {
                    ...plansResult[key][plan],
                    data: newData
                };
            }
        }
        return null; // Key, plan, or classes not found

        // result exmple:
        // {
        //     "start": "07:00:00",
        //         "end": "08:40:00",
        //             "used": 2,
        //                 "data": [
        //                     {
        //                         "day": "2023-12-04",
        //                         "classes": [
        //                             {
        //                                 "id": 1,
        //                                 "name": "a"
        //                             }
        //                         ]
        //                     },
        //                     {
        //                         "day": "2023-12-11",
        //                         "classes": [
        //                             {
        //                                 "id": 1,
        //                                 "name": "a"
        //                             }
        //                         ]
        //                     },
        //                     {
        //                         "day": "2023-12-18",
        //                         "classes": [
        //                             {
        //                                 "id": 1,
        //                                 "name": "a"
        //                             }
        //                         ]
        //                     },
        //                     {
        //                         "day": "2023-12-25",
        //                         "classes": [
        //                             {
        //                                 "id": 1,
        //                                 "name": "a"
        //                             }
        //                         ]
        //                     }
        //                 ]
        // }
    };
    const updatePlansResult = (key, plan) => {
        const dataPlans = plansResult;
        if (dataPlans[key] && dataPlans[key][plan]) {
            const planData = dataPlans[key][plan].data;
            if (planData && planData.length > 0) {
                const newData = planData.map(item => {
                    const newClasses = (item.classes && item.classes.length > 1) ? item.classes.slice(1) : [];
                    return {
                        ...item,
                        classes: newClasses
                    };
                });

                dataPlans[key][plan].used = Math.max(dataPlans[key][plan].used - 1, 0);
                dataPlans[key][plan].data = newData;
                setPlansResult(dataPlans);
            }

        }

    };
    // api
    const fetchData = async () => {
        //  fetch sessions list
        const result = await getAllSessionsInProg(idProg);
        console.log(result);
        if (result.code === 200) {
            setEvents(result.events);
        }
    };
    useEffect(() => {
        if (props.groups) {
            // set color pallet
            setColorMap(ColorGenerator());
            // get all sessions
            fetchData();
        }
    }, [props.groups]);
    const handleGetAvailableSessionsTiming = async () => {

        const dataDays = {
            "startDate": startDate, "endDate": endDate, "days": scheduleData, "duration": progData.duree
        }
        try {

            const response = await getAvailableSessions(dataDays);
            if (response && response.code === 200) {
                console.log(response.plans);
                setPlansResult(response.plans);
            }
        } catch (error) {
            console.log(error);
            toast.error('Erreur! Une erreur s\'est produite. Veuillez réessayer.', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

    };
    // useEffect(() => {
    //     fetchData();
    // }, [progData]); // Empty dependency array means this effect runs once when component mounts

    return (
        <>
            <div className="col-md-12 col-xl-12 col-12">
                <div className="row">
                    <div className="col-md-12 mb-5">
                        {isModeAdd ?
                            (<div className="card bg-light-primary" style={{
                                padding: '20px'
                            }}>
                                <IconButton style={{ position: 'absolute', top: 0, right: 0 }} aria-label="close"
                                    onClick={() => { setIsModeAdd(false) }} >
                                    <CloseIcon />
                                </IconButton>
                                <div style={{ textAlign: 'center', }}>
                                    <div className="col-md-12 col-xl-12 col-12">
                                        <div className="row">
                                            <div>

                                                <Stepper activeStep={activeStep} style={{
                                                    padding: '20px'
                                                }}>
                                                    {steps.map((label, index) => {
                                                        const stepProps = {};
                                                        const labelProps = {};

                                                        return (
                                                            <Step key={label} {...stepProps}>
                                                                <StepLabel {...labelProps}>{label}</StepLabel>
                                                            </Step>
                                                        );
                                                    })}
                                                </Stepper>
                                            </div>
                                            {/* <!-- card --> */}
                                            <div className="col-md-12 mb-5">
                                                <div className="card" style={{
                                                    padding: '20px'
                                                }}>

                                                    {activeStep === 0 && (
                                                        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                                            {/* {progData.type} */}
                                                            <Grid container spacing={1} justifyContent="center" alignItems="center">
                                                                {/* <Grid item xs={11}>
                                                                <InputLabel style={{ padding: '20px' }} htmlFor="inputStatus">Informations Sur Les Séances</InputLabel>
                                                            </Grid> */}
                                                                <Grid xs={12} sm={6} md={3} sx={{ alignItems: 'center', paddingLeft: "20px" }}>
                                                                    <InputLabel htmlFor="role">Date De Commencement</InputLabel>

                                                                    <TextField
                                                                        type="date"
                                                                        value={startDate}
                                                                        onChange={(e) => {
                                                                            setStartDate(e.target.value);
                                                                            reloadingDaysData();
                                                                        }}
                                                                        fullWidth
                                                                        required
                                                                        error={errorsStep1.sDate}
                                                                    />
                                                                </Grid>
                                                                <Grid xs={12} sm={6} md={3} sx={{ alignItems: 'center', paddingLeft: "20px" }}>
                                                                    <InputLabel htmlFor="role">Date De Fin</InputLabel>
                                                                    <TextField
                                                                        type="date"
                                                                        value={endDate}
                                                                        onChange={(e) => {
                                                                            setEndDate(e.target.value);
                                                                            reloadingDaysData();
                                                                        }}
                                                                        fullWidth required
                                                                        error={errorsStep1.endDate} />
                                                                </Grid>
                                                                <Grid xs={12} sm={6} md={3} sx={{ alignItems: 'center', paddingLeft: "20px" }}>
                                                                    <InputLabel htmlFor="role">Nombre De Séances Par Semaine</InputLabel>
                                                                    <NumberInput aria-label="Quantity Input" min={0} defaultValue={0} />
                                                                </Grid>
                                                                {(errorsStep1.end || errorsStep1.endDate || errorsStep1.nmbSessionParWeek) ?
                                                                    (<Grid paddingLeft={3} xs={12}>
                                                                        <Typography variant="body2" color="error">Vous devez remplir les champs vides.</Typography>
                                                                    </Grid>) : null}
                                                            </Grid>

                                                        </div>
                                                    )}
                                                    {activeStep === 1 && (
                                                        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                                            {/* {progData.type} */}
                                                            <Grid container spacing={1} justifyContent="center" alignItems="center">

                                                                <Grid container spacing={1} justifyContent="center" alignItems="center">
                                                                    {/* <Grid item xs={11}>
                                                                    <InputLabel style={{ padding: '20px' }} htmlFor="inputStatus">Sélectionnez Les Zones Horaires</InputLabel>
                                                                </Grid> */}
                                                                    <Grid xs={0} sm={0} md={1.55} />
                                                                    <Grid item xs={12} sm={6} md={3} sx={{ alignItems: 'center', paddingRight: "10px", paddingLeft: "10px" }}>
                                                                        <InputLabel htmlFor="role">Jour</InputLabel>
                                                                        <Select
                                                                            labelId="demo-simple-select-label"
                                                                            id="demo-simple-select"
                                                                            value={codeDay}
                                                                            onChange={handleChange}
                                                                            fullWidth
                                                                            defaultValue={0}
                                                                        >
                                                                            <MenuItem value={0}> <em>Choisissez un jour</em></MenuItem>
                                                                            <MenuItem value={1}>Lundi</MenuItem>
                                                                            <MenuItem value={2}>Mardi</MenuItem>
                                                                            <MenuItem value={3}>Mercredi</MenuItem>
                                                                            <MenuItem value={4}>Jeudi</MenuItem>
                                                                            <MenuItem value={5}>Vendredi</MenuItem>
                                                                            <MenuItem value={6}>Samedi</MenuItem>
                                                                            <MenuItem value={7}>Dimanche</MenuItem>
                                                                        </Select>
                                                                    </Grid>
                                                                    <Grid xs={12} sm={6} md={3} sx={{ alignItems: 'center', paddingRight: "10px", paddingLeft: "10px" }}>
                                                                        <InputLabel htmlFor="role">Débuté à	</InputLabel>
                                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                            <DemoContainer components={['MobileTimePicker']}>
                                                                                <MobileTimePicker
                                                                                    value={dayjs(`2023-01-01T${timeStart}:00`)}
                                                                                    onChange={(newTime) => {
                                                                                        const selectedTime = newTime.format('HH:mm');
                                                                                        console.log(selectedTime);
                                                                                        setTimeStart(selectedTime);
                                                                                    }}
                                                                                    slotProps={{ textField: { fullWidth: true } }}
                                                                                />
                                                                            </DemoContainer>
                                                                        </LocalizationProvider>
                                                                    </Grid>
                                                                    <Grid xs={12} sm={6} md={3} sx={{ alignItems: 'center', paddingRight: "10px", paddingLeft: "10px" }}>
                                                                        <InputLabel htmlFor="role">Terminée à</InputLabel>

                                                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                                            <DemoContainer components={['MobileTimePicker']}>
                                                                                <MobileTimePicker
                                                                                    value={dayjs(`2023-01-01T${timeEnd}:00`)}
                                                                                    onChange={(newTime) => {
                                                                                        const selectedTime = newTime.format('HH:mm');
                                                                                        setTimeEnd(selectedTime);
                                                                                    }
                                                                                    }
                                                                                    slotProps={{ textField: { fullWidth: true } }}
                                                                                />
                                                                            </DemoContainer>
                                                                        </LocalizationProvider>
                                                                    </Grid>
                                                                    <Grid xs={12} sm={6} md={1.1} sx={{ alignItems: 'center', justifyContent: 'center', paddingTop: "10px", paddingLeft: "10px", }}>
                                                                        <InputLabel htmlFor="role" />
                                                                        <Button
                                                                            variant="contained"
                                                                            color="primary"
                                                                            onClick={handleAddData}
                                                                            disabled={codeDay === 0}
                                                                        >
                                                                            <Iconify icon="eva:plus-fill" />
                                                                        </Button>
                                                                    </Grid>
                                                                    {/* {Object.keys(scheduleData).length !== 0 && */}
                                                                    {/* result : */}
                                                                    <Grid container spacing={2}>
                                                                        {Object.keys(scheduleData).length !== 0 &&
                                                                            Object.entries(scheduleData).map(([key, value]) => (
                                                                                <Grid item key={value.day} xs={12} sm={12} md={12} lg={6}>
                                                                                    <TableContainer sx={{ borderCollapse: 'collapse', maxHeight: 310 }} fullWidth>
                                                                                        <Table>
                                                                                            <TableBody>
                                                                                                <Row
                                                                                                    key={value.day} // Assuming `value.day` is unique for each row
                                                                                                    row={value}
                                                                                                    openDialog1={handleDialogOpen1}
                                                                                                    openDialog2={handleDialogOpen2}
                                                                                                />
                                                                                            </TableBody>
                                                                                        </Table>
                                                                                    </TableContainer>
                                                                                </Grid>
                                                                            ))}
                                                                    </Grid>
                                                                    {(errorsStep2) ?
                                                                        (<Grid paddingTom={10} xs={12}>
                                                                            <Typography variant="body2" color="error">Vous devez sélectionner au moins une zone horaire.</Typography>
                                                                        </Grid>) : null}
                                                                </Grid>

                                                            </Grid>

                                                        </div>
                                                    )}
                                                    {activeStep === 2 && (
                                                        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                                            {/* {progData.type} */}
                                                            <Grid container spacing={1} justifyContent="center" alignItems="center">

                                                                <Grid container spacing={1} justifyContent="center" alignItems="center">

                                                                    {Object.keys(plansResult).length !== 0 && (
                                                                        // Conditionally rendering content when scheduleData is not empty
                                                                        <Grid item xs={11}>
                                                                            {/* InputLabel for the table */}
                                                                            <InputLabel style={{ padding: '20px' }} htmlFor="inputStatus">
                                                                                Les Plans Proposer Pour Planifier Votre Emploit de Temp
                                                                            </InputLabel>

                                                                            {/* TableContainer and its contents */}
                                                                            <Grid container spacing={2}>
                                                                                {Object.entries(plansResult).map(([key, value]) => (
                                                                                    <Grid item key={value.day} xs={12} sm={12} md={6} lg={6}>
                                                                                        <TableContainer sx={{ borderCollapse: 'collapse', maxHeight: 310 }} fullWidth>
                                                                                            <Table aria-label="customized table">
                                                                                                <TableBody>
                                                                                                    <RowStep3
                                                                                                        id={key} // Assuming `value.day` is unique for each row
                                                                                                        row={value}

                                                                                                    />
                                                                                                </TableBody>
                                                                                            </Table>
                                                                                        </TableContainer>
                                                                                    </Grid>
                                                                                ))}
                                                                            </Grid>
                                                                        </Grid>
                                                                    )}
                                                                    <Grid item xs={11}>
                                                                        <InputLabel style={{ padding: '20px' }} htmlFor="inputStatus">
                                                                            Affecter Des Plans
                                                                        </InputLabel>

                                                                    </Grid>
                                                                    <Grid xs={3} sx={{ alignItems: 'center', paddingLeft: "20px" }}>
                                                                        <InputLabel htmlFor="role">Groupe</InputLabel>
                                                                        {/* select a groupe */}
                                                                        <Select
                                                                            labelId="demo-simple-select-label"
                                                                            id="demo-simple-select"
                                                                            value={selectedGroupId}
                                                                            onChange={handleChangeSelectedGroup}
                                                                            fullWidth
                                                                            defaultValue="0"
                                                                        >
                                                                            <MenuItem key="0" value="0"> <em>Choisissez un groupe</em></MenuItem>
                                                                            {
                                                                                props.groups?.map((option) => (

                                                                                    <MenuItem key={option.id} value={option.id} >
                                                                                        {option.name}
                                                                                    </MenuItem>

                                                                                ))
                                                                            }

                                                                        </Select>
                                                                    </Grid>
                                                                    <Grid xs={3} sx={{ alignItems: 'center', paddingLeft: "20px" }}>
                                                                        <InputLabel htmlFor="role">Jour</InputLabel>
                                                                        {/* select the day of the plan */}
                                                                        <Select
                                                                            labelId="demo-simple-select-label"
                                                                            id="demo-simple-select"
                                                                            value={codeDay2}
                                                                            onChange={handleChange2}
                                                                            fullWidth
                                                                            defaultValue="0"
                                                                        >
                                                                            <MenuItem key="0" value="0"> <em>Choisissez un jour</em></MenuItem>
                                                                            {plansResult?.[1] && (<MenuItem value={1}>Lundi</MenuItem>)}
                                                                            {plansResult?.[2] && (<MenuItem value={2}>Mardi</MenuItem>)}
                                                                            {plansResult?.[3] && (<MenuItem value={3}>Mercredi</MenuItem>)}
                                                                            {plansResult?.[4] && (<MenuItem value={4}>Jeudi</MenuItem>)}
                                                                            {plansResult?.[5] && (<MenuItem value={5}>Vendredi</MenuItem>)}
                                                                            {plansResult?.[6] && (<MenuItem value={6}>Samedi</MenuItem>)}
                                                                            {plansResult?.[7] && (<MenuItem value={7}>Dimanche</MenuItem>)}

                                                                        </Select>
                                                                    </Grid>

                                                                    <Grid xs={3} sx={{ alignItems: 'center', paddingLeft: "20px" }}>
                                                                        <InputLabel htmlFor="role">Plan</InputLabel>
                                                                        {/* select the plan */}
                                                                        <Select
                                                                            labelId="demo-simple-select-label"
                                                                            id="demo-simple-select"
                                                                            value={selectedPlan}
                                                                            onChange={handleChangeSelectedPlan}
                                                                            fullWidth
                                                                        >
                                                                            <MenuItem key="0" value="0"> <em>Choisissez un plan</em></MenuItem>
                                                                            {codeDay2 !== 0 && plansResult && plansResult[codeDay2] && Object.keys(plansResult[codeDay2]).length !== 0 && Object.entries(plansResult[codeDay2]).map(([key, value]) => (
                                                                                value.used !== 0 ?
                                                                                    (<MenuItem key={key} value={key}>
                                                                                        {key}
                                                                                    </MenuItem>) : null
                                                                            ))}
                                                                        </Select>

                                                                    </Grid>
                                                                    <Grid xs={12} sm={6} md={1.1} sx={{ alignItems: 'center', justifyContent: 'center', paddingTop: "10px", paddingLeft: "10px", }}>
                                                                        <InputLabel htmlFor="role" />
                                                                        <Button
                                                                            variant="contained"
                                                                            color="primary"
                                                                            onClick={handleAddToList}
                                                                            disabled={codeDay2 === "0" || selectedPlan === "0" || selectedGroupId === "0"}
                                                                        >
                                                                            <Iconify icon="eva:plus-fill" />
                                                                        </Button>
                                                                    </Grid>

                                                                    {Object.keys(selectedPlansList).length !== 0 && (
                                                                        // Conditionally rendering content when scheduleData is not empty
                                                                        <Grid item xs={11}>
                                                                            {/* InputLabel for the table */}
                                                                            <InputLabel style={{ padding: '20px' }} htmlFor="inputStatus">
                                                                                Les Plans Sélectionnés Pour Chaque Groupe
                                                                            </InputLabel>

                                                                            {/* TableContainer and its contents */}
                                                                            <Grid container spacing={2}>
                                                                                {Object.entries(selectedPlansList).map(([key, value]) => (
                                                                                    <Grid item key={key} xs={12} sm={12} md={6} lg={6}>
                                                                                        <TableContainer sx={{ borderCollapse: 'collapse', maxHeight: 310 }} fullWidth>
                                                                                            <Table aria-label="customized table">
                                                                                                <TableBody>
                                                                                                    <Row4
                                                                                                        id={key} // Assuming `value.day` is unique for each row
                                                                                                        row={value}
                                                                                                    />
                                                                                                </TableBody>
                                                                                            </Table>
                                                                                        </TableContainer>
                                                                                    </Grid>
                                                                                ))}
                                                                            </Grid>
                                                                        </Grid>
                                                                    )}
                                                                </Grid>

                                                            </Grid>

                                                        </div>
                                                    )}

                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                        {activeStep !== 0 && (
                                                            <Button onClick={handleBack} sx={{ mr: 1 }}>
                                                                Back
                                                            </Button>
                                                        )}
                                                        {/* {isStepOptional(activeStep) && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSkip}
                                                            sx={{ mr: 1 }}
                                                        >
                                                            Skip
                                                        </Button>
                                                    )} */}
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleNext}
                                                        >
                                                            {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                                                        </Button>
                                                    </Box>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>) :
                            (
                                <div className="card" style={{ minHeight: '700px', }}>
                                    <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                        <MyCalendar colorMap={colorMap} events={events} fetchEvents={fetchData} />
                                    </div>
                                    <div style={{ margin: "20px", }}>
                                        <Grid item xs={12}>
                                            <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                                                <Button
                                                    onClick={() => {
                                                        setIsModeAdd(true);
                                                    }}
                                                    variant="contained"
                                                    style={{ backgroundColor: 'blue', color: 'white' }}
                                                >
                                                    Ajouter Des Séances
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </div>
                                </div>


                            )}
                    </div>
                </div>
            </div>


            {/* dialog for deleting one day */}
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
            {/* dialog for deleting one time zone */}
            <Dialog open={isDialogOpen2} onClose={handleCancelClick2}>
                <DialogContent>
                    <DialogTitle>Êtes-vous sûr de vouloir supprimer cet zone horaires ?</DialogTitle>
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
export default AppointmentsAjustements;