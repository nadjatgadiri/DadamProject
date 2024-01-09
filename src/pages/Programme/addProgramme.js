import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import "react-toastify/dist/ReactToastify.css";
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from "react-toastify";
import {
     Card,  Stack,  Button, Checkbox,  MenuItem,
    Container, Typography,
    TextField, Grid, Autocomplete, Select, FormControl, InputLabel, FormControlLabel, FormGroup
} from '@mui/material';
import {
    Unstable_NumberInput as NumberInput,
    numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import Iconify from '../../components/iconify';
import { selectedListCategories } from "../../RequestManagement/categorieManagement"
import { addNewPrograme } from "../../RequestManagement/programManagement"
import './style.css'; // Import the CSS file

const steps = ['Informations Générales', 'Configuration De Temps', 'Confirmation'];

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
export default function AddProgramme() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [editorState, setEditorState] = useState(null);
    // first step states
    const [data, setData] = useState([]);
    const [title, setTitle] = useState("");
    const [lib, setLib] = useState("");
    const [type, setType] = useState("");
    const [prix, setPrix] = useState(0.00);
    const [typeOfPaiment, setTypeOfPaiment] = useState("Total");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [errors, setErrors] = useState({
        "title": false,
        "cat": false,
        "type": false,
    });
    const [isPublished, setIsPublished] = useState(false);
    const [errorsFormation, setErrorsFormation] = useState({
        "sDate": false,
        "fDate": false,
    });
    const [errorsCour, setErrorsCour] = useState({
        "nmbSession": false,
        "duree": false,
    });
    // second step states
    // for formation form
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [finSubDate1, setFinSubDate1] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [nmbParticipant, setNMBParticipant] = useState(null);
    // for cours form
    const [nmbSession, setNMBSession] = useState(0);
    const [duree, setDuree] = useState(null);
    const [finSubDate2, setFinSubDate2] = useState(null);
    // skip
    const [isSkip, setIsSkip] = useState(false);
    const handleAutocompleteChange = (event, newValue) => {
        console.log(newValue);
        setSelectedCategory(newValue);
    };
    // const StyledContent = styled('div')(({ theme }) => ({
    //     maxWidth: 480,
    //     margin: 'auto',
    //     minHeight: '10vh',
    //     display: 'flex',
    //     justifyContent: 'center',
    //     flexDirection: 'column',
    // }));
    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (title && selectedCategory && type) {
                setErrors({
                    "title": false,
                    "cat": false,
                    "type": false,
                });
                console.log(editorState);
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
                    "title": false,
                    "cat": false,
                    "type": false,
                };
                if (!title) {
                    er.title = true;
                } if (!selectedCategory) {
                    er.cat = true;
                } if (!type) {
                    er.type = true;
                }
                setErrors(er);
            }
        }
        else if (activeStep === 1) {
            if (type === "formation") {
                if (startDate && endDate) {
                    setErrorsFormation({
                        "sDate": false,
                        "fDate": false
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
                        "fDate": false
                    };
                    if (!startDate) {
                        er.sDate = true;
                    } if (!endDate) {
                        er.fDate = true;
                    }
                    setErrorsFormation(er);
                }
            }
            else if (type === "cour") {
                if (nmbSession && duree) {
                    setErrorsCour({
                        "nmbSession": false,
                        "duree": false
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
                        "nmbSession": false,
                        "duree": false
                    };
                    if (!nmbSession) {
                        er.nmbSession = true;
                    } if (!duree) {
                        er.duree = true;
                    }
                    setErrorsCour(er);
                }
            }
        }
        else if (activeStep === 2) {
            handleSubmit();
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setIsSkip(false);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
        setIsSkip(true);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    // api
    const fetchData = async () => {
        const result = await selectedListCategories();
        if (result.code === 200) {

            const categories = await Promise.all(result.categories.map(async cat => ({
                id: cat.ID_ROWID,
                label: cat.title,
            })));
            if (categories) {
                setData(categories);
            }
        }
        else {
            // when we got an error 
            console.log(result);
            toast.error(`Error! + ${result.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

    };
    const handleSubmit = async () => {

        const dataProgram = {
            "title": title,
            "discription": lib,
            "categID": selectedCategory.id,
            "type": type,
            "isSkip": isSkip,
            "isPublished": isPublished,
            "prix": prix,
            "typeOfPaiment": typeOfPaiment
        };
        let dataType = {};
        if (type === "formation") {
            dataType = {
                "startDay": startDate,
                "endDay": endDate,
                "inscriptionEndDay": finSubDate1,
                "isLimited": isChecked,
                "nbrParticipat": isChecked ? nmbParticipant : 0
            }
        }
        else if (type === "cour") {
            dataType = {
                "inscriptionEndDay": finSubDate2,
                "nbrSession": nmbSession,
                "hoursBySession": duree
            }
        }
        try {

            const response = await addNewPrograme(dataProgram, dataType);
            if (response && response.code === 200) {
                toast.success(`L'utilisateur est ajouté avec succès!`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                // Optionally reset form fields here
                navigate(`/dashboard/ProgrameProfile/${response.programId}`, { replace: true });
            }
        } catch (error) {
            console.log(error);
            toast.error('Erreur! Une erreur s\'est produite. Veuillez réessayer.', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

    };
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this effect runs once when component mounts

    return (
        <>

            <Container>
                <ToastContainer />
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Nouveau Programme
                    </Typography>
                    <Link to="/dashboard/Programme">
                        <Button variant="contained" startIcon={<Iconify icon="ri:arrow-go-back-fill" />}>Return</Button>
                    </Link>
                </Stack>

                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            if (isStepOptional(index)) {
                                labelProps.optional = (
                                    <Typography variant="caption">Optional</Typography>
                                );
                            }
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <div>
                        {activeStep === 0 && (
                            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <Card style={{ padding: '20px', width: '100%' }}>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                name="title"
                                                label="Titre"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                                fullWidth
                                                error={errors.title}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                name="lib"
                                                label="Déscription"
                                                value={lib}
                                                onChange={(e) => setLib(e.target.value)}
                                                rows={3}
                                                multiline
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth
                                                error={errors.type}
                                            >
                                                <InputLabel htmlFor="role">Type De Programme</InputLabel>
                                                <Select
                                                    name="type"
                                                    label="Type"
                                                    value={type}
                                                    onChange={(e) => setType(e.target.value)}
                                                    inputProps={{
                                                        id: 'role',
                                                    }}
                                                    required

                                                >
                                                    <MenuItem value="formation">Formation</MenuItem>
                                                    <MenuItem value="cour">Cours</MenuItem>
                                                    <MenuItem value="activité">Activité</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}
                                            sx={{ position: 'relative' }}>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                name="supperCat"
                                                options={data}
                                                renderInput={(params) => <TextField error={errors.cat}
                                                    {...params} label="Catégorie De Programme" />}
                                                value={selectedCategory} // Set the value prop
                                                onChange={handleAutocompleteChange} // Handle change event

                                            />

                                        </Grid>
                                        <Grid item xs={6}
                                            sx={{ position: 'relative' }}>
                                            <TextField
                                                id="outlined-number"
                                                label="Prix"
                                                type="number"
                                                value={prix}
                                                onChange={(e) => {
                                                    setPrix(e.target.value);
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                fullWidth
                                                defaultValue={0.0}
                                            />
                                        </Grid>
                                        <Grid item xs={6}
                                            sx={{ position: 'relative' }}>
                                            <FormControl fullWidth
                                                error={errors.type}
                                            >
                                                <InputLabel htmlFor="role">Type De Programme</InputLabel>
                                                <Select
                                                    name="type"
                                                    label="Type De Programme"
                                                    value={typeOfPaiment}
                                                    onChange={(e) => setTypeOfPaiment(e.target.value)}
                                                    inputProps={{
                                                        id: 'role',
                                                    }}
                                                    required

                                                >
                                                    <MenuItem value="Total">Total</MenuItem>
                                                    <MenuItem value="Mensuel">Mensuel</MenuItem>
                                                    <MenuItem value="activité">Par Séance</MenuItem>
                                                </Select> </FormControl>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Checkbox checked={isPublished} onChange={(e) => setIsPublished(!isPublished)} />}
                                                    label="Publier"
                                                />
                                            </FormGroup>
                                        </Grid>
                                        {(errors.cat || errors.type || errors.title) ?
                                            (<Grid paddingLeft={3} xs={12}>
                                                <Typography variant="body2" color="error">Il existe des zones vides obligatoires.</Typography>
                                            </Grid>) : null}

                                    </Grid>

                                </Card>
                            </div>
                        )}
                        {activeStep === 1 && (
                            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <Card style={{ padding: '20px', width: '100%' }}>
                                    {/* form for formation */}
                                    {type === "formation" ?
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <InputLabel htmlFor="role">Date De Commencement</InputLabel>

                                                <TextField
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    fullWidth
                                                    required
                                                    error={errorsFormation.sDate}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <InputLabel htmlFor="role">Date D'Expiration</InputLabel>
                                                <TextField
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    fullWidth
                                                    required
                                                    error={errorsFormation.fDate}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <InputLabel htmlFor="role">Date D'Expiration D'Inscription</InputLabel>

                                                <TextField
                                                    type="date"
                                                    value={finSubDate1}
                                                    onChange={(e) => setFinSubDate1(e.target.value)}
                                                    fullWidth
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <></>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormGroup style={{ paddingTop: '20px' }}>
                                                    <FormControlLabel control={<Checkbox checked={isChecked} onChange={(e) => setIsChecked(!isChecked)} />} label="Limiter le nombre des participants" />
                                                </FormGroup>
                                            </Grid>
                                            {isChecked ?
                                                <Grid item xs={6}>
                                                    <InputLabel htmlFor="role">Nombre Des Participants</InputLabel>
                                                    <CustomNumberInput
                                                        aria-label="Demo number input"
                                                        placeholder="Type a number…"
                                                        value={nmbParticipant}
                                                        onChange={(event, val) => setNMBParticipant(val)}

                                                    />
                                                </Grid>
                                                : null}
                                            {(errorsFormation.fDate || errorsFormation.sDate) ?
                                                (<Grid paddingLeft={3} xs={12}>
                                                    <Typography variant="body2" color="error">Il existe des zones vides obligatoires.</Typography>
                                                </Grid>) : null}
                                        </Grid>
                                        : null}
                                    {type === "cour" ?
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <InputLabel htmlFor="role">Nombre Des Séance</InputLabel>

                                                <CustomNumberInput
                                                    aria-label="Demo number input"
                                                    placeholder="Type a number…"
                                                    value={nmbSession}
                                                    onChange={(event, val) => setNMBSession(val)}
                                                    error={errorsCour.nmbSession}
                                                    className={errorsCour.nmbSession ? 'error-border' : ''} />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <InputLabel htmlFor="role">Durée Par Séance</InputLabel>
                                                <TextField
                                                    type="time"
                                                    value={duree}
                                                    onChange={(e) => setDuree(e.target.value)}
                                                    fullWidth
                                                    required
                                                    error={errorsCour.duree}
                                                />

                                            </Grid>
                                            <Grid item xs={6}>
                                                <InputLabel htmlFor="role">Date D'Expiration D'Inscription</InputLabel>

                                                <TextField
                                                    type="date"
                                                    value={finSubDate2}
                                                    onChange={(e) => setFinSubDate2(e.target.value)}
                                                    fullWidth
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={6}><></></Grid>
                                            {(errorsCour.duree || errorsCour.nmbSession) ?
                                                (<Grid paddingLeft={3} xs={12}>
                                                    <Typography variant="body2" color="error">Il existe des zones vides obligatoires.</Typography>
                                                </Grid>) : null}
                                        </Grid>
                                        : null}
                                </Card>
                            </div>
                        )}
                        {activeStep === 2 && (
                            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <Card style={{ padding: '20px', width: '100%' }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} style={{ paddingLeft: '50px', paddingTop: '50px', paddingBottom: '50px' }}>
                                            <Grid container spacing={3}>
                                                <Grid xs={12}>
                                                    <InputLabel >Informations Géneral</InputLabel>
                                                </Grid>
                                                <Grid xs={3} paddingTop={2}>
                                                    <Typography level="body-sm" justifySelf="flex-end">Titre</Typography>
                                                </Grid>
                                                <Grid xs={9} paddingTop={2}>{title}

                                                </Grid>
                                                <Grid xs={3} paddingTop={2}>
                                                    <Typography level="body-sm" justifySelf="flex-end">Description</Typography>
                                                </Grid>
                                                <Grid xs={9} paddingTop={2}>
                                                    {lib}
                                                </Grid>
                                                <Grid xs={3} paddingTop={2}>
                                                    <Typography level="body-sm" justifySelf="flex-end">Type</Typography>
                                                </Grid>
                                                <Grid xs={9} paddingTop={2}>
                                                    {type}
                                                </Grid>
                                                <Grid xs={3} paddingTop={2}>
                                                    <Typography level="body-sm" justifySelf="flex-end">Catégorie</Typography>
                                                </Grid>
                                                <Grid xs={9} paddingTop={2}>
                                                    {selectedCategory.label}
                                                </Grid>
                                                <Grid xs={3} paddingTop={2}>
                                                    <Typography level="body-sm" justifySelf="flex-end">Prix {typeOfPaiment}</Typography>
                                                </Grid>
                                                <Grid xs={9} paddingTop={2}>
                                                    {prix}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={6} style={{ paddingLeft: '50px', paddingTop: '50px', paddingBottom: '50px' }}>
                                            <Grid container spacing={3}>
                                                <Grid xs={12}>
                                                    <InputLabel >Informations De Configuration</InputLabel>
                                                </Grid>
                                                {isSkip ?
                                                    (<Grid xs={12} paddingTop={2}>
                                                        <Typography level="body-sm" justifySelf="flex-end">Vous avez sauté cette étape</Typography>
                                                    </Grid>)
                                                    :
                                                    (
                                                        type === "formation" ?
                                                            <>
                                                                <Grid xs={6} paddingTop={2}>
                                                                    <Typography level="body-sm" justifySelf="flex-end">Date De Commencement</Typography>
                                                                </Grid>
                                                                <Grid xs={6} paddingTop={2}>
                                                                    {startDate}
                                                                </Grid>
                                                                <Grid xs={6} paddingTop={2}>
                                                                    <Typography level="body-sm" justifySelf="flex-end">Date D'Expiration</Typography>
                                                                </Grid>
                                                                <Grid xs={6} paddingTop={2}>
                                                                    {endDate}
                                                                </Grid>

                                                                <Grid xs={6} paddingTop={2}>
                                                                    <Typography level="body-sm" justifySelf="flex-end">Date D'Expiration D'Inscription</Typography>
                                                                </Grid>
                                                                <Grid xs={6} paddingTop={2}>
                                                                    {finSubDate1}
                                                                </Grid>
                                                                <Grid xs={6} paddingTop={2}>
                                                                    <Typography level="body-sm" justifySelf="flex-end">Nombre Des Participant</Typography>
                                                                </Grid>
                                                                <Grid xs={6} paddingTop={2}>
                                                                    {isChecked ? nmbParticipant : "Ilimité"}
                                                                </Grid>
                                                            </>
                                                            : type === "cour" ?
                                                                <>
                                                                    <Grid xs={6} paddingTop={2}>
                                                                        <Typography level="body-sm" justifySelf="flex-end">Nombre Des Séance</Typography>
                                                                    </Grid>
                                                                    <Grid xs={6} paddingTop={2}>
                                                                        {nmbSession}
                                                                    </Grid>
                                                                    <Grid xs={6} paddingTop={2}>
                                                                        <Typography level="body-sm" justifySelf="flex-end">Durée Par Séance</Typography>
                                                                    </Grid>
                                                                    <Grid xs={6} paddingTop={2}>
                                                                        {duree}
                                                                    </Grid>
                                                                    <Grid xs={6} paddingTop={2}>
                                                                        <Typography level="body-sm" justifySelf="flex-end">Date D'Expiration D'Inscription</Typography>
                                                                    </Grid>
                                                                    <Grid xs={6} paddingTop={2}>
                                                                        {finSubDate2}
                                                                    </Grid>
                                                                </>
                                                                : null)}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </div>
                        )}
                    </div>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        {activeStep !== 0 && (
                            <Button onClick={handleBack} sx={{ mr: 1 }}>
                                Back
                            </Button>
                        )}
                        {isStepOptional(activeStep) && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSkip}
                                sx={{ mr: 1 }}
                            >
                                Skip
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                        >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </Box>

            </Container >
        </>
    );
}
