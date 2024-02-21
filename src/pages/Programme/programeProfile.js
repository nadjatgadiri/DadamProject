import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import {
  Autocomplete,
  Dialog,
  MenuItem,
  DialogActions,
  DialogContent,
  DialogContentText,
  Paper,
  Button,
  Container,
  Typography,
  TextField,
  Chip,
} from '@mui/material';
import './theme.css';

import { Buffer } from 'buffer';
import { jsPDF as JsPDF } from 'jspdf';
import { getProgramme } from '../../RequestManagement/programManagement';
import Iconify from '../../components/iconify';
import SubscribersComponnent from './programeComponnent/subscribersComponnent';
import GroupesComponnent from './programeComponnent/groupesComponnent';
import AppointmentsAjustements from './programeComponnent/AppointmentsAjustements';
import PaymentComponent from './programeComponnent/payedStudentComponnent';
import { getProgGroups } from '../../RequestManagement/groupManagement';
import {
  addNewPayment,
  getPaymentsInfoForProgram,
} from '../../RequestManagement/paymentManagement';
import { getProgRegistrations } from '../../RequestManagement/registrationManagement';
import { getStatistiqueDataForProgProfile } from '../../RequestManagement/dataManagment';
import { getAllSessionsInProg } from '../../RequestManagement/sessionsManagement';
// ----------------------------------------------------------------------

const ProgrameProfile = () => {
  // programe id
  const { id } = useParams();
  const [headData, setHeadData] = useState({
    nmbStudent: 0,
    nmbTeachers: 0,
    nmbGroup: 0,
  });
  // first step states
  const [data, setData] = useState(null);
  const [title, setTitle] = useState('');
  const [lib, setLib] = useState('');
  const [type, setType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [Sessions, setSessions] = useState([]);
  const [prix, setPrix] = useState(0.0);
  const [typeOfPaiment, setTypeOfPaiment] = useState('Total');

  // second step states
  // for formation && workshop form
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [finSubDate1, setFinSubDate1] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [nmbParticipant, setNMBParticipant] = useState(0);
  // end

  // workshop
  const [materials, setMaterials] = useState('');

  // for cours form
  const [nmbSession, setNMBSession] = useState(0);
  const [dureeCour, setDureeCour] = useState('01:00');

  // activity form
  const [dureeActivity, setDureeActivity] = useState('01:00');
  const [emplacement, setEmplacement] = useState('');

  const [weekOptions, setWeekOptions] = useState([]);
  // skip
  const [isSkip, setIsSkip] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(0); // Payment amount state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [totalPayments, setTotalPayments] = useState(0);
  const [last30DaysPayments, setLast30DaysPayments] = useState(0);
  const [weekInputValue, setWeekInputValue] = useState(
    weekOptions.length > 0 ? weekOptions[0].value : ''
  );
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
        setTypeOfPaiment(programeData.typeOfPaiment);
        setSelectedCategory({
          id: programeData.categorie.ID_ROWID,
          label: programeData.categorie.title,
        });
        setIsPublished(programeData.isPublished);
        setIsSkip(programeData.isSkiped);
        // if (!isSkip && secondStepData) {
        //     if (programeData.type === "formation") {
        //         setStartDate(secondStepData.startDate);
        //         setEndDate(secondStepData.endDate);
        //         setFinSubDate1(programeData.EndInsciptionDate);
        //         setIsChecked(secondStepData.isLimited);
        //         setNMBParticipant(secondStepData.nbrStudent);

        //     }
        //     else if (programeData.type === "cour") {
        //         setNMBSession(secondStepData.sessionsNumber);
        //         setDuree(secondStepData.sessionTiming);
        //         setFinSubDate2(programeData.EndInsciptionDate);

        //     }
        // }
        if (!isSkip && secondStepData) {
          if (programeData.type === 'formation') {
            setStartDate(secondStepData.startDate);
            setEndDate(secondStepData.endDate);
            setFinSubDate1(programeData.EndInsciptionDate);
            setIsChecked(secondStepData.isLimited);
            setNMBParticipant(secondStepData.nbrStudent);
            setData({
              type: 'formation',
              SDate: startDate,
              FDate: endDate,
            });
          } else if (programeData.type === 'cour') {
            setNMBSession(secondStepData.sessionsNumber);
            setDureeCour(secondStepData.sessionTiming);
            setFinSubDate1(programeData.EndInsciptionDate);
            setData({
              type: 'cour',
              nmbSession: secondStepData.sessionsNumber,
              duree: secondStepData.sessionTiming,
            });
          } else if (programeData.type === 'workshop') {
            setStartDate(secondStepData.startDate);
            setEndDate(secondStepData.endDate);
            setFinSubDate1(programeData.EndInsciptionDate);
            setIsChecked(secondStepData.isLimited);
            setNMBParticipant(secondStepData.nbrStudent);
            setMaterials(secondStepData.Materials);
            setData({
              type: 'workshop',
              SDate: startDate,
              FDate: endDate,
            });
          } else if (programeData.type === 'activity') {
            setDureeActivity(secondStepData.timing);
            setFinSubDate1(programeData.EndInsciptionDate);
            setEmplacement(secondStepData.emplacement);
            setData({
              type: 'activity',
              duree: secondStepData.timing,
            });
          }
        }
      }
    } else {
      // when we got an error
      toast.error(`Error! + ${dataResult.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    const result2 = await getProgGroups(id);
    if (result2.code === 200) {
      const groups = await result2.groups.map((group) => ({
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
              ).toString('base64')}`
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
      if (totalPayments) setTotalPayments(totalPayments);
      if (paymentsLast30Days) setLast30DaysPayments(paymentsLast30Days);
    } else {
      // Handle errors
      toast.error(`Error! ${paymentsInfo.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    const headInfo = await getStatistiqueDataForProgProfile(id);
    if (headInfo.code === 200) {
      setHeadData(headInfo.staticData);
    }
    const sessionsResponse = await getAllSessionsInProg(id);

    if (sessionsResponse.code === 200) {
      // For example, you can set the sessions in state
      setSessions(sessionsResponse.events);
    } else {
      // Handle the case when there's an error in the API response for sessions
      toast.error(`Error! + ${sessionsResponse.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  useEffect(() => {
    // Get the current date
    const currentDate = new Date();
    // Calculate the difference between the current day and Sunday (0 index-based)

    // Find the current Sunday
    const startOfWeek = new Date(currentDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    // Find the next Saturday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Initialize an array to hold the week options
    const options = [];

    // Generate the last three weeks
    for (let i = 3; i >= 1; i -= 1) {
      const start = new Date(startOfWeek);
      start.setDate(start.getDate() - 7 * i);

      const end = new Date(endOfWeek);
      end.setDate(end.getDate() - 7 * i);

      options.push({
        value: `${start.toLocaleDateString('en-US', { day: '2-digit' })}-${end.toLocaleDateString(
          'en-US',
          { day: '2-digit' }
        )} ${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.toLocaleDateString(
          'en-US',
          { month: 'short' }
        )}`,
      });
    }
    // Add the current week
    options.push({
      value: `${startOfWeek.toLocaleDateString('en-US', {
        day: '2-digit',
      })}-${endOfWeek.toLocaleDateString('en-US', {
        day: '2-digit',
      })} ${startOfWeek.toLocaleDateString('en-US', {
        month: 'short',
      })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short' })}`,
    });
    // Generate the next four weeks
    for (let i = 1; i <= 4; i += 1) {
      const start = new Date(startOfWeek);
      start.setDate(start.getDate() + 7 * i);

      const end = new Date(endOfWeek);
      end.setDate(end.getDate() + 7 * i);

      options.push({
        value: `${start.toLocaleDateString('en-US', { day: '2-digit' })}-${end.toLocaleDateString(
          'en-US',
          { day: '2-digit' }
        )} ${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.toLocaleDateString(
          'en-US',
          { month: 'short' }
        )}`,
      });
    }
    setWeekOptions(options);
    fetchData();
  }, []);

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

    try {
      const responses = await Promise.all(paymentPromises);
      // Process the responses
      let success = true; // Assuming all payments are successful
      responses.forEach((response) => {
        if (response.code !== 200 && response.code !== 409) {
          success = false; // At least one payment failed
          toast.error(`Failed to add payment: ${response.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (response.code === 409) {
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

  const handleGenerateSchedule = async () => {
    await fetchData(); // Wait for fetchData() to complete
    await fetchData(); // Wait for fetchData() to complete
    // Use the week input value and sessions data to generate the schedule PDF
    generateSchedulePDF(weekInputValue, Sessions, type, title);
};

  const generateSchedulePDF = (weekInput, sessions, type, title) => {
    const isValidWeekInput = /^(\d{1,2}-\d{1,2} [a-zA-Z]+ - [a-zA-Z]+)$/.test(weekInput);

    if (!isValidWeekInput) {
      console.error('Invalid weekInput format');
      return;
    }

    const [startDay, endDay, startMonth, endMonth] = weekInput
      .match(/(\d{1,2})-(\d{1,2}) ([a-zA-Z]+) - ([a-zA-Z]+)/)
      .slice(1);
    const currentYear = new Date().getFullYear();
    const startDate = new Date(`${startMonth} ${startDay}, ${currentYear} 00:00:00 GMT+00:00`);
    const endDate = new Date(
      `${endMonth} ${endDay}, ${
        startMonth === 'Dec' ? currentYear + 1 : currentYear
      } 23:59:59 GMT+00:00`
    );

    // Filter sessions for the given week
    const weekSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.start);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
    // Group filtered sessions by their groups
    const groupedSessions = {};
    weekSessions.forEach((session) => {
      const groupName = session.groupename || 'Sans Groupe';
      if (!groupedSessions[groupName]) {
        groupedSessions[groupName] = [];
      }
      groupedSessions[groupName].push(session);
    });

    const pdf = new JsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Generate pages for each group
    Object.entries(groupedSessions).forEach(([groupName, groupSessions], index) => {
      if (index !== 0) {
        pdf.addPage();
      }

      pdf.setFont('Helvetica', 'normal');
      pdf.setTextColor(index === 0 ? '#3498db' : '#3498db');
      pdf.setFontSize(index === 0 ? 32 : 28);
      pdf.setFont('Helvetica', 'bold');
      pdf.text(
        `Emplois du temps de ${type} du ${title} \n groupe ${groupName} `,
        pdf.internal.pageSize.width / 2,
        20,
        { align: 'center' }
      );
      const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      pdf.setFontSize(index === 0 ? 24 : 20);

      pdf.setFillColor(220, 220, 220);
      const tableHeaders = [['Heures', ...days]];
      // For header section
      pdf.autoTable({
        head: tableHeaders,
        startY: 40,
        margin: { top: 40 },
        theme: 'grid',
        styles: {
          fontSize: 10, // Increase header font size
          cellPadding: 10, // Increase cell padding
          overflow: 'linebreak',
          valign: 'middle',
          cellWidth: 40, // Set absolute cell width
        },
        headStyles: {
          fillColor: '#3498db',
          textColor: '#ffffff',
          halign: 'center',
        },
        columnStyles: {
          0: { halign: 'center' },
        },
      });

      for (let hour = 8; hour <= 20; hour += 2) {
        const rowData = [`${hour}:00 - ${hour + 2}:00`];

        days.forEach((day) => {
          const sessionAtHour = groupSessions.find((session) => {
            const sessionStartDate = new Date(session.start);
            const sessionEndDate = new Date(session.end);
            const sessionDay = sessionStartDate
              .toLocaleDateString('fr-FR', { weekday: 'long' })
              .replace(/^\w/, (c) => c.toUpperCase());
              const sessionStartTime = sessionStartDate.getHours(); // Get session start hour
              const sessionEndTime = sessionEndDate.getHours(); // Get session end hour
              
              // Check if the session overlaps with the hour range
              return sessionStartTime>= 8 && (sessionStartTime < hour + 2) && (sessionEndTime >= hour) && sessionEndTime<=20 && sessionDay === day;
              
          });
          if (sessionAtHour) {
            console.log(sessionAtHour);
            const salleName = sessionAtHour.title.split(' - ')[1] || 'No Salle';

            // Parse the string dates into Date objects
            const startTime = new Date(sessionAtHour.start);
            const endTime = new Date(sessionAtHour.end);

            // Check if parsing was successful
            const timing = `${startTime.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })} - ${endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
            rowData.push(`${salleName}\n${timing}`);
          } else {
            rowData.push('');
          }
        });

        // For body section
        pdf.autoTable({
          body: [rowData],
          startY: pdf.autoTable.previous.finalY,
          margin: { top: 10 },
          theme: 'grid',
          styles: {
            fontSize: 10, // Increase body font size
            cellPadding: 6,
            valign: 'middle',
            cellWidth: 40, // Set absolute cell width
            overflow: 'linebreak', // Set overflow to 'linebreak' to handle long text
          },
          columnStyles: {
            0: { halign: 'center' },
          },
        });
      }
    });

    const filename = `Emplois_du_temps_${weekInput.replace(' ', '_')}.pdf`;
    pdf.save(filename);
  };

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
                    {type === 'cour' && 'Cour De '}
                    {type === 'formation' && 'Formation De '}
                    {type === 'workshom' && 'Atelier De '}
                    {type === 'activity' && 'Activitie De '}
                    {title}
                    <Chip
                      label={isSkip ? 'Incomplet' : 'Complet'}
                      size="small"
                      color={isSkip ? 'error' : 'success'}
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        marginLeft: '20px',
                      }}
                    />
                    <Chip
                      label={isPublished ? 'Publier' : 'Non-Publier'}
                      size="small"
                      color={!isPublished ? 'error' : 'success'}
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        marginLeft: '10px',
                      }}
                    />
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
            <div className="col-xl-2 col-lg-0 col-md-0 col-0 mb-0" />
            <div className="col-xl-3 col-lg-4 col-md-4 col-12 mb-4">
              {/* <!-- card --> */}
              <div className="card h-100 card-lift">
                {/* <!-- card body --> */}
                <div className="card-body">
                  {/* <!-- heading --> */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <Typography className="mb-0 " variant="h6">
                        Etudiant
                      </Typography>
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
            <div className="col-xl-3 col-lg-4 col-md-4 col-12 mb-4">
              {/* <!-- card --> */}
              <div className="card h-100 card-lift">
                {/* <!-- card body --> */}
                <div className="card-body">
                  {/* <!-- heading --> */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <Typography className="mb-0 " variant="h6">
                        Professeur
                      </Typography>
                    </div>
                    <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                      <Iconify icon="la:chalkboard-teacher" width="40px" />{' '}
                    </div>
                  </div>
                  {/* <!-- project number --> */}
                  <div className="lh-1">
                    <h1 className="  mb-1 fw-bold">{headData.nmbTeachers}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-4 col-12 mb-4">
              {/* <!-- card --> */}
              <div className="card h-100 card-lift">
                {/* <!-- card body --> */}
                <div className="card-body">
                  {/* <!-- heading --> */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <Typography className="mb-0 " variant="h6">
                        Group
                      </Typography>
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
            <div className="col-xl-1 col-lg-0 col-md-0 col-0 mb-0" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-xl-8 col-12">
            <div className="row">
              <div className="col-12 mb-5">
                <div className="card">
                  <div className="card-header ">
                    <div className="d-flex justify-content-betweenalign-items-center">
                      <div>
                        <Typography className="mb-0 " variant="h6">
                          Description
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ maxHeight: '100px', minHeight: '100px', overflow: 'auto' }}>
                      <p>{lib}</p>
                    </div>
                    {type === 'formation' && (
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Date De Commencement
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">
                                  {isSkip ? '--/--/----' : formatDate(startDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Date De Clôture
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">
                                  {isSkip ? '--/--/----' : formatDate(endDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Date De Clôture D'Inscription
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">
                                  {isSkip ? '--/--/----' : formatDate(finSubDate1)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item  px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Prix {typeOfPaiment}
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">{prix} DA</p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item  px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Participant
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">
                                  {isChecked ? nmbParticipant : 'Illimitée'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    )}
                    {type === 'cour' && (
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Nombre Des Séance
                                </Typography>
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
                                <Typography className="mb-0" variant="subtitle1">
                                  Durée Par Séance
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">{isSkip ? '--:--' : dureeCour}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Date De Clôture D'Inscription
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">
                                  {isSkip ? '--/--/----' : formatDate(finSubDate1)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item  px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Prix {typeOfPaiment}
                                </Typography>
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
                    )}
                    {type === 'workshop' && (
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Date De Commencement
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">
                                  {isSkip ? '--/--/----' : formatDate(startDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Date De Clôture
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">
                                  {isSkip ? '--/--/----' : formatDate(endDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Date De Clôture D'Inscription
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">
                                  {isSkip ? '--/--/----' : formatDate(finSubDate1)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item  px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Prix {typeOfPaiment}
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">{prix} DA</p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item  px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Participant
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">
                                  {isSkip ? (isChecked ? nmbParticipant : 'Illimitée') : '--'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item  px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Materials
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">{isSkip ? materials : '--'}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    )}
                    {type === 'activity' && (
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Durée Par Séance
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">{isSkip ? '--:--' : dureeActivity}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  L'Emplacement De Séance
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">{isSkip ? '--' : emplacement}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Date De Clôture D'Inscription
                                </Typography>
                              </div>
                            </div>
                            <div>
                              <div>
                                <p className="text-dark mb-0">
                                  {isSkip ? '--/--/----' : formatDate(finSubDate1)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item  px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div>
                                <Typography className="mb-0" variant="subtitle1">
                                  Prix {typeOfPaiment}
                                </Typography>
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
                    )}
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
                  <Typography className="mb-0 " variant="h6">
                    Bénéfices De Programme
                  </Typography>
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
                          <Iconify icon="gg:dollar" width="40px" />
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
                          <Iconify
                            icon="streamline:interface-calendar-date-month-thirty-thirty-calendar-date-week-day-month"
                            width="40px"
                          />
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

        <div>
          <div className="container mt-5">
            <div className="row mb-3">
              <div className="col-lg-6 col-md-6 col-12">
                <TextField
                  select
                  label="Selectionnez une semaine"
                  variant="outlined"
                  fullWidth
                  size="medium"
                  value={weekInputValue}
                  onChange={(e) => setWeekInputValue(e.target.value)}
                >
                  {weekOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-end">
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  onClick={handleGenerateSchedule}
                >
                  Generate Schedule
                </Button>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 col-md-12 col-12">
                <AppointmentsAjustements idProg={id} progData={data} groups={groupsData} />
              </div>
            </div>
          </div>
        </div>
      </Container>
      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={handleClosePaymentDialog}
        PaperProps={{ style: { width: '50%', maxHeight: '70vh' } }}
      >
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
};
export default ProgrameProfile;
