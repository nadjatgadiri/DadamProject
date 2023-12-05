import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
// @mui
import {  Autocomplete,  Dialog,  DialogActions, DialogContent,   DialogContentText,Badge, Card, Table, Stack, Paper, Avatar, Button, Popover, Checkbox, TableRow, MenuItem, TableBody, TableCell, Container, Typography, TableContainer, TablePagination,TextField, Select,
} from '@mui/material';
import './theme.css';
import { Buffer } from "buffer";

import { addDays, subDays, isAfter } from 'date-fns';
import { getProgramme } from "../../RequestManagement/programManagement"
import Iconify from '../../components/iconify';
import SubscribersComponnent from './programeComponnent/subscribersComponnent';
import GroupesComponnent from './programeComponnent/groupesComponnent';
import PaymentComponent from './programeComponnent/payedStudentComponnent';

import { getProgGroups } from '../../RequestManagement/groupManagement';
import { addNewPayment,getPaymentsInfoForProgram  } from '../../RequestManagement/paymentManagement';
import { getProgRegistrations} from '../../RequestManagement/registrationManagement';


// ----------------------------------------------------------------------

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


const ProgrameProfile = () => {
    // programe id
    const { id } = useParams();
    // first step states
    const [data, setData] = useState([]);
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
    const [totalPayments, setTotalPayments] = useState(null);
const [last30DaysPayments, setLast30DaysPayments] = useState(null);
    // Groups 
    const [groupsData, setGroupsData] = useState([]);
    // api
    const fetchData = async () => {
        console.log(id);

        const dataResult = await getProgramme(id);
        if (dataResult.code === 200) {
            const programeData = dataResult.program;
            const secondStepData = dataResult.data;
            if (programeData) {

                setTitle(programeData.title);
                setLib(programeData.discription);
                setType(programeData.type);
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
                    }
                    else if (programeData.type === "cour") {
                        setNMBSession(secondStepData.sessionsNumber);
                        setDuree(secondStepData.sessionTiming);
                        setFinSubDate2(programeData.EndInsciptionDate);
                    }
                }
            }
        }
        else {
            // when we got an error 
            console.log(dataResult);
            toast.error(`Error! + ${dataResult.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        const result2 = await getProgGroups(id);
        if (result2.code === 200) {
            console.log(result2.groups);
            const groups = await result2.groups.map(group => ({
                id: group.ID_ROWID,
                name: group.GroupeName,
                teachers: group.teachers,
                nbrPlaces: 0,
                nbrStudents: group.students.length,
                createdAt: group.createdAt,
            }));
            setGroupsData(groups);
            console.log(groups);
        } else {
            // when we got an error
            toast.error(`Error! + ${result2.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
 // Fetch program registrations
 const result3 = await getProgRegistrations(id);
 console.log(result3);
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
   setStudents(subscribe); } else {
    // Handle the case when there's an error in the API response for program registrations
    console.error(result3);
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

         setTotalPayments(totalPayments);
    setLast30DaysPayments(paymentsLast30Days);
    } else {
        // Handle errors
        console.error(paymentsInfo);
        toast.error(`Error! ${paymentsInfo.message}`, {
            position: toast.POSITION.TOP_RIGHT,
        });
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
    setPaymentAmount(0); // Reset payment amount
    setSelectedStudents([]);
  };

  // Function to add payments for selected students
  const handleAddPayment = async () => {
    // Prepare the payment data for each selected student
    const paymentPromises = selectedStudents.map(async (student) => {
      const paymentData = {
        montant: paymentAmount,
        IDstudent: [student.id], // Create an array with the current student
        Idprogram:id,
      };
      console.log(paymentData);
      return addNewPayment(paymentData);
    });
  
    console.log("Selected Students for Payment:", selectedStudents);
  
    try {
      const responses = await Promise.all(paymentPromises);
  
      // Process the responses
      let success = true; // Assuming all payments are successful
      responses.forEach((response) => {
        if (response.code !== 200 && response.code  !== 409) {
          success = false; // At least one payment failed
          toast.error(`Failed to add payment: ${response.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        else if (response.code  === 409) {
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
                <title> Utilisateurs | Minimal UI </title>
            </Helmet>

            <Container className="app-content-area">
            <ToastContainer />

                <div className="bg-primary pt-10 pb-21 mt-n5 mx-n14" />
                <div className=" mt-n22 ">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            {/* Page header */}
                            <div className="d-flex justify-content-between align-items-center mb-5">
  <div className="mb-2 mb-lg-0">
    <h3 className="mb-0 text-white">
      {type === "cour" ? "Cour De " : null}
      {type === "formation" ? "Formation De " : null}
      {title}
    </h3>
  </div>
  <div>
    <a href="#!" className="btn btn-white">Create New Project</a> 
  
  </div>
  <div>  <Button
      variant="contained"
      color="primary"
      onClick={handleOpenPaymentDialog}
    >
      Add Payment
    </Button></div>
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
                                            <h4 className="mb-0">Etudiant</h4>
                                        </div>
                                        <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                                            <Iconify icon="ph:student" width="40px" />
                                        </div>
                                    </div>
                                    {/* <!-- project number --> */}
                                    <div className="lh-1">
                                        <h1 className=" mb-1 fw-bold">18</h1>
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
                                            <h4 className="mb-0">Professeur</h4>
                                        </div>
                                        <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                                            <Iconify icon="la:chalkboard-teacher" width="40px" />                                        </div>
                                    </div>
                                    {/* <!-- project number --> */}
                                    <div className="lh-1">
                                        <h1 className="  mb-1 fw-bold">132</h1>
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
                                            <h4 className="mb-0">Group</h4>
                                        </div>
                                        <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                                            <Iconify icon="material-symbols:group-outline" width="40px" />
                                        </div>
                                    </div>
                                    {/* <!-- project number --> */}
                                    <div className="lh-1">
                                        <h1 className="  mb-1 fw-bold">12</h1>
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
                                                <h4 className="mb-0">Description</h4>
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
                                                                <h5 className="mb-0 ">Date De Commencement</h5>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{formatDate(startDate)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <h5 className="mb-0 ">Date D'Expiration</h5>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{formatDate(endDate)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <h5 className="mb-0 ">Date D'Expiration D'Inscription</h5>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{formatDate(finSubDate1)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item  px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <h5 className="mb-0 ">Prix</h5>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">12 DA</p>
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
                                                                <h5 className="mb-0 ">Nombre Des Séance</h5>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{nmbSession}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <h5 className="mb-0 ">Durée Par Séance</h5>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{duree}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <h5 className="mb-0 ">Date D'Expiration D'Inscription</h5>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">{formatDate(finSubDate2)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item  px-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">

                                                            <div>
                                                                <h5 className="mb-0 ">Prix</h5>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p className="text-dark mb-0">12 DA</p>
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
                                    <h4 className="mb-0">Bénéfices De Programme
                                    </h4>
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
                    <SubscribersComponnent idProg={id} groups={groupsData} />

                </div>
                <div className="row">
                    <GroupesComponnent idProg={id} groups={groupsData} />

                </div>

                <div className="row">
                    <PaymentComponent idProg={id} groups={groupsData} />
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
    inputProps={{
      min: "0",
      step: "50",
    }}
    fullWidth
    onBlur={(e) => {
      const inputValue = e.target.value;
      const roundedValue = Math.round(inputValue / 50) * 50;
      setPaymentAmount(roundedValue);
    }}
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