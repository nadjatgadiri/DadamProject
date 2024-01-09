import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import {
    Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, Paper, Button, Container, Typography,  TextField, 
} from '@mui/material';
import './theme.css';
import { Buffer } from "buffer";

import { subDays, isAfter } from 'date-fns';
import { getProgramme } from "../../RequestManagement/programManagement"
import Iconify from '../../components/iconify';
import SubscribersComponnent from './programeComponnent/subscribersComponnent';
import GroupesComponnent from './programeComponnent/groupesComponnent';
import AppointmentsAjustements from './programeComponnent/AppointmentsAjustements';
import PaymentComponent from './programeComponnent/payedStudentComponnent';
import { getProgGroups } from '../../RequestManagement/groupManagement';
import { addNewPayment, getPaymentsInfoForProgram } from '../../RequestManagement/paymentManagement';
import { getProgRegistrations } from '../../RequestManagement/registrationManagement';
import { getStatistiqueDataForProgProfile } from '../../RequestManagement/dataManagment';

// ----------------------------------------------------------------------






const ProgrameProfile = () => {
    // programe id
    const { id } = useParams();
    const [headData, setHeadData] = useState({
        "nmbStudent": 0,
        "nmbTeachers": 0,
        "nmbGroup": 0,
    });
    // first step states
    const [data, setData] = useState(null);
    const [title, setTitle] = useState("");
    const [lib, setLib] = useState("");
    const [type, setType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isPublished, setIsPublished] = useState(false);
    // second step states
    // for formation form
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [finSubDate1, setFinSubDate1] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [nmbParticipant, setNMBParticipant] = useState(null);
    const [prix, setPrix] = useState(0.00);
    const [typeOfPaiment, setTypeOfPaiment] = useState("Total");
    // for cours form
    const [nmbSession, setNMBSession] = useState(0);
    const [duree, setDuree] = useState(null);
    const [finSubDate2, setFinSubDate2] = useState(null);
    // skip
    const [isSkip, setIsSkip] = useState(false);
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [paymentAmount, setPaymentAmount] = useState(0); // Payment amount state
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [totalPayments, setTotalPayments] = useState(0);
    const [last30DaysPayments, setLast30DaysPayments] = useState(0);
    // Groups 
    const [groupsData, setGroupsData] = useState([]);
    // api
    const fetchData = async () => {
        const dataResult = await getProgramme(id);
        if (dataResult.code === 200) {
            const programeData = dataResult.program;
            const secondStepData = dataResult.data;
            if (programeData) {

                setTitle(programeData.title);
                setLib(programeData.discription);
                setType(programeData.type);
                setPrix(programeData.prix);
                setPaymentAmount(programeData.prix);
                setTypeOfPaiment(programeData.typeOfPaiment)
                setSelectedCategory({
                    id: programeData.categorie.ID_ROWID,
                    label: programeData.categorie.title,
                });
                setIsPublished(programeData.isPublished);
                setIsSkip(programeData.isSkiped);
                if (!isSkip && secondStepData) {
                    if (programeData.type === "formation") {
                        setStartDate(secondStepData.startDate);
                        setEndDate(secondStepData.endDate);
                        setFinSubDate1(programeData.EndInsciptionDate);
                        setIsChecked(secondStepData.isLimited);
                        setNMBParticipant(secondStepData.nbrStudent);
                        setData({
                            "type": "formation",
                            "SDate": startDate,
                            "FDate": endDate,
                        })
                    }
                    else if (programeData.type === "cour") {
                        setNMBSession(secondStepData.sessionsNumber);
                        setDuree(secondStepData.sessionTiming);
                        setFinSubDate2(programeData.EndInsciptionDate);
                        setData({
                            "type": "cour",
                            "nmbSession": nmbSession,
                            "duree": secondStepData.sessionTiming,
                        })
                    }
                }
            }
        }
        else {
            // when we got an error 
            toast.error(`Error! + ${dataResult.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        const result2 = await getProgGroups(id);
        if (result2.code === 200) {
            const groups = await result2.groups.map(group => ({
                id: group.ID_ROWID,
                name: group.GroupeName,
                teachers: group.teachers,
                capacity: group.capacity,
                nbrStudents: group.students.length,
                createdAt: group.createdAt,
            }));
            setGroupsData(groups);
        } else {
            // when we got an error
            toast.error(`Error! + ${result2.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        // Fetch program registrations
        const result3 = await getProgRegistrations(id);
        if (result3.code === 200) {
            const subscribe = result3.registrations.map((registration) => ({
                id: registration.students.ID_ROWID,
                name: `${registration.students.personProfile2.firstName} ${registration.students.personProfile2.lastName}`,
                image:
                    registration.students.personProfile2.imagePath !== null &&
                        registration.students.personProfile2.imagePath !== ''
                        ? `data:image/jpeg;base64,${Buffer.from(
                            registration.students.personProfile2.imagePath
                        ).toString("base64")}`
                        : '',
                group: registration.students.groupes[0]
                    ? registration.students.groupes[0].GroupeName
                    : null,
                subDate: registration.createdAt,
            }));
            setStudents(subscribe);
        } else {
            // Handle the case when there's an error in the API response for program registrations
            toast.error(`Error! + ${result3.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }


        const paymentsInfo = await getPaymentsInfoForProgram(id);

        if (paymentsInfo.code === 200) {
            const { totalPayments, paymentsLast30Days } = paymentsInfo;
            // You can do something with the payment information here
            console.log("Total Payments:", totalPayments);
            console.log("Last 30 Days Payments:", paymentsLast30Days);
            if (totalPayments) setTotalPayments(totalPayments);
            if (paymentsLast30Days) setLast30DaysPayments(paymentsLast30Days);
        } else {
            // Handle errors
            console.error(paymentsInfo);
            toast.error(`Error! ${paymentsInfo.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        const headInfo = await getStatistiqueDataForProgProfile(id);
        console.log(headInfo);
        if (headInfo.code === 200) {
            setHeadData(headInfo.staticData);
        }
    };
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this effect runs once when component mounts
    // convert date



    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    }

    // Function to handle opening the payment dialog
    const handleOpenPaymentDialog = () => {
        setPaymentDialogOpen(true);
    };

    // Function to handle closing the payment dialog
    const handleClosePaymentDialog = () => {
        setPaymentDialogOpen(false);
        setSelectedStudents([]);
        setPaymentAmount(prix);
    };

    // Function to add payments for selected students
    const handleAddPayment = async () => {
        // Prepare the payment data for each selected student
        const paymentPromises = selectedStudents.map(async (student) => {
            const paymentData = {
                montant: paymentAmount,
                IDstudent: [student.id], // Create an array with the current student
                Idprogram: id,
            };
            return addNewPayment(paymentData);
        });

        console.log("Selected Students for Payment:", selectedStudents);

        try {
            const responses = await Promise.all(paymentPromises);
            console.log(responses);
            // Process the responses
            let success = true; // Assuming all payments are successful
            responses.forEach((response) => {
                if (response.code !== 200 && response.code !== 409) {
                    success = false; // At least one payment failed
                    toast.error(`Failed to add payment: ${response.message}`, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                else if (response.code === 409) {
                    success = false; // At least one payment failed
                    toast.warning(`Failed to add payment because : ${response.message}`, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            });

            if (success) {
                toast.success('Payments added successfully', {
                    position: toast.POSITION.TOP_RIGHT,

                });

                // Close the payment dialog
                handleClosePaymentDialog();
                window.location.reload();
                setPaymentAmount(prix);
            }

        } catch (error) {
            toast.error(`Error: ${error.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const today = new Date(); // Current date

    // Calculate the "Mois Dernier" date (30 days ago)
    const lastMonthDate = subDays(today, 30);

    // Calculate the "Total" and "Mois Dernier" amounts
    let totalAmount = 0;
    let lastMonthAmount = 0;

    students.forEach((student) => {
        const paymentDate = new Date(student.subDate);

        // Calculate the total amount
        totalAmount += student.montant;

        // Check if the payment date is within the last 30 days
        if (isAfter(paymentDate, lastMonthDate)) {
            lastMonthAmount += student.montant;
        }
    });

    return (
        <>

            <Helmet>
                <title> Utilisateurs</title>
            </Helmet>

            <Container className="app-content-area">
                <ToastContainer />

                <div className="bg-primary pt-10 pb-21 mt-n5 mx-n14" />
                <div className=" mt-n22 ">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div className="d-flex justify-content-between align-items-center mb-5">
                                <div className="mb-2 mb-lg-0">

                                    <Typography variant="h4" className="mb-0 text-white">
                                        {type === "cour" ? "Cour De " : null}
                                        {type === "formation" ? "Formation De " : null}
                                        {title}
                                    </Typography>
                                </div>
                                <div>
                                    <a href="#!" className="btn btn-white" onClick={handleOpenPaymentDialog}>
                                        Ajouter Une Facture
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-1 col-lg-6 col-md-12 col-12 mb-5" />

                        <div className="col-xl-3 col-lg-6 col-md-12 col-12 mb-5">
                            {/* <!-- card --> */}
                            <div className="card h-100 card-lift">
                                {/* <!-- card body --> */}
                                <div className="card-body">
                                    {/* <!-- heading --> */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <Typography className="mb-0 " variant="h6">Etudiant</Typography>
                                        </div>
                                        <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                                            <Iconify icon="ph:student" width="40px" />
                                        </div>
                                    </div>
                                    {/* <!-- project number --> */}
                                    <div className="lh-1">
                                        <h1 className=" mb-1 fw-bold">{headData.nmbStudent}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-12 col-12 mb-5">
                            {/* <!-- card --> */}
                            <div className="card h-100 card-lift">
                                {/* <!-- card body --> */}
                                <div className="card-body">
                                    {/* <!-- heading --> */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <Typography className="mb-0 " variant="h6">Professeur</Typography>
                                        </div>
                                        <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                                            <Iconify icon="la:chalkboard-teacher" width="40px" />                                        </div>
                                    </div>
                                    {/* <!-- project number --> */}
                                    <div className="lh-1">
                                        <h1 className="  mb-1 fw-bold">{headData.nmbTeachers}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-12 col-12 mb-5">
                            {/* <!-- card --> */}
                            <div className="card h-100 card-lift">
                                {/* <!-- card body --> */}
                                <div className="card-body">
                                    {/* <!-- heading --> */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <Typography className="mb-0 " variant="h6">Group</Typography>
                                        </div>
                                        <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                                            <Iconify icon="material-symbols:group-outline" width="40px" />
                                        </div>
                                    </div>
                                    {/* <!-- project number --> */}
                                    <div className="lh-1">
                                        <h1 className="  mb-1 fw-bold">{headData.nmbGroup}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-1 col-lg-6 col-md-12 col-12 mb-5" />
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-12 col-xl-8 col-12">
                        <div className="row">
                            <div className="col-12 mb-5">
                                <div className="card" >
                                    <div className="card-header ">
                                        <div className="d-flex justify-content-betweenalign-items-center">
                                            <div>
                                                <Typography className="mb-0 " variant="h6">Description</Typography>
                                            </div>

                                        </div>


                                    </div>
                                    <div className="card-body">
                                        <div style={{ maxHeight: '100px', minHeight: '100px', overflow: 'auto' }}>
                                            <p>{lib}

                                            </p>
                                        </div>

                                        {type === "formation" ?
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <Typography className="mb-0" variant="subtitle1">Date De Commencement</Typography>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{isSkip ? '--/--/----' : formatDate(startDate)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <Typography className="mb-0" variant="subtitle1">Date D'Expiration</Typography>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{isSkip ? '--/--/----' : formatDate(endDate)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <Typography className="mb-0" variant="subtitle1">Date D'Expiration D'Inscription</Typography>

                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{isSkip ? '--/--/----' : formatDate(finSubDate1)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item  px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <Typography className="mb-0" variant="subtitle1">Prix {typeOfPaiment}</Typography>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{prix} DA</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            : null}
                                        {type === "cour" ?
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <Typography className="mb-0" variant="subtitle1">Nombre Des Séance</Typography>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{isSkip ? '--' : nmbSession}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <Typography className="mb-0" variant="subtitle1">Durée Par Séance</Typography>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{isSkip ? '--:--' : duree}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <Typography className="mb-0" variant="subtitle1">Date D'Expiration D'Inscription</Typography>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{isSkip ? '--/--/----' : formatDate(finSubDate2)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item  px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <Typography className="mb-0" variant="subtitle1">Prix {typeOfPaiment}</Typography>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{prix} DA</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-xl-4 col-12">
                        <div className="card mb-5">
                            {/* <!-- Card header --> */}
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <Typography className="mb-0 " variant="h6">Bénéfices De Programme</Typography>
                                </div>
                            </div>
                            {/* <!-- Card body --> */}
                            <div className="card-body">

                                {/* <!-- row --> */}
                                <div className="row">

                                    {/* <!-- col --> */}
                                    <div className="mb-5 ">
                                        <div className="d-flex align-items-center justify-content-between p-4">
                                            <div>
                                                <h2 className="h1  mb-0">{totalPayments}DA</h2>
                                                <p className="mb-0">Total</p>

                                            </div>
                                            <div className="ms-3">
                                                <div className="icon-shape icon-lg bg-primary-soft text-primary rounded-circle text-primary">
                                                    <Iconify
                                                        icon="gg:dollar" width="40px" />

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- col --> */}
                                    <div className="mb-5">
                                        <div className="d-flex align-items-center justify-content-between p-4">
                                            <div>
                                                <h2 className="h1  mb-0">{last30DaysPayments}DA</h2>
                                                <p className="mb-0">Mois Dernier</p>

                                            </div>
                                            <div className="ms-3">
                                                <div className="icon-shape icon-lg bg-danger-soft text-danger rounded-circle">
                                                    <Iconify icon="streamline:interface-calendar-date-month-thirty-thirty-calendar-date-week-day-month" width="40px" />
                                                </div>

                                            </div>
                                        </div>

                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <SubscribersComponnent idProg={id} groups={groupsData} updateData={fetchData} />

                </div>
                <div className="row">
                    <GroupesComponnent idProg={id} groups={groupsData} updateData={fetchData} />
                </div>
                {totalPayments ? (
                    <div className="row">
                        <PaymentComponent idProg={id} groups={groupsData} />
                    </div>
                ) : null}

                <div className="row">
                    <AppointmentsAjustements idProg={id} progData={data} groups={groupsData} />
                </div>



            </Container>
            {/* Payment Dialog */}
            <Dialog open={paymentDialogOpen} onClose={handleClosePaymentDialog} PaperProps={{ style: { width: '50%', maxHeight: '70vh' } }}>
                <DialogContent>
                    <DialogContentText>
                        Sélectionnez un ou des étudiants pour ajouter un paiement:
                    </DialogContentText>

                    <Autocomplete
                        multiple
                        disablePortal
                        id="combo-box-student"
                        options={students}
                        getOptionLabel={(option) => (option ? option.name : '')}
                        getOptionSelected={(option, value) => option.id === value.id}
                        value={selectedStudents}
                        onChange={(event, newValues) => {
                            setSelectedStudents(newValues);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Étudiants" variant="outlined" fullWidth />
                        )}
                        PaperComponent={({ children }) => <Paper square>{children}</Paper>}
                        ListboxProps={{ style: { maxHeight: '250px', overflow: 'auto' } }}
                        noOptionsText="Aucun étudiant trouvé"
                    />

                    <div style={{ marginBottom: '10px' }} />

                    <TextField
                        type="number"
                        label="Montant"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        id="outlined-number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        defaultValue={0.0}
                    />
                </DialogContent>



                <DialogActions>
                    <Button color="primary" variant="contained" onClick={handleAddPayment}>
                        Ajouter Paiement
                    </Button>
                    <Button onClick={handleClosePaymentDialog} color="secondary">
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}
export default ProgrameProfile;