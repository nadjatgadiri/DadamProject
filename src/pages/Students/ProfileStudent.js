import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
// @mui
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Collapse,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  TableHead,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import '../Programme/theme.css';
import { Buffer } from 'buffer';
import { jsPDF as JsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getGroups } from '../../RequestManagement/groupManagement';
import { getAllSessionsForStudent } from '../../RequestManagement/sessionsManagement';
import { getStudentHistory, getStudent } from '../../RequestManagement/studentManagement';
import { getSessionAttRecForStuent } from '../../RequestManagement/sessionAttRecManagement';
import {
  getStudentBills,
  getUnpaidBills,
  payStudentBillsMultiMode,
} from '../../RequestManagement/billsManagement';
import { getGeneralSchoolData } from '../../RequestManagement/schoolManagement';

import MyCalendar from '../Programme/calendar/calendar';
import useResponsive from '../../hooks/useResponsive';
// components
import Iconify from '../../components/iconify';

const StudentProfile = () => {
  const isDesktop = useResponsive('up', 'sm');
  const { id } = useParams();
  const [userData, setUserData] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [files, setFiles] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [bills, setBills] = useState([]);
  const [unpaidBills, setUnpaidBills] = useState({});
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([
    { label: 'Phone', value: '' },
    { label: 'Email', value: '' },
    { label: 'Date of Birth', value: '' },
    // Add more data as needed
  ]);
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false, // Use 24-hour format
    };
    return date.toLocaleDateString('fr-FR', options);
  }
  function formatDate2(inputDate) {
    const date = new Date(inputDate);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('fr-FR', options);
  }
  /** api */

  const fetchSessionData = async () => {
    const result3 = await getAllSessionsForStudent(id);
    if (result3.code === 200) {
      setEvents(result3.events);
    }
  };
  const payStudentBills = async () => {
    const data = {
      studentID: id,
      paimentRecord: unpaidBills,
      total,
    };
    console.log(data);
    const result = await payStudentBillsMultiMode(data);

    if (result.code === 200) {
      // get student session recoreding
      const resultSessionAttRec = await getSessionAttRecForStuent(id);
      if (resultSessionAttRec.code === 200) {
        setSessions(resultSessionAttRec.sessionAttRec);
      }
      // get student bills
      const resultStudentBills = await getStudentBills(id);
      if (resultStudentBills.code === 200) {
        setBills(resultStudentBills.bills);
      }
      // get student unpaid bills
      const resultStudentUnpaidBills = await getUnpaidBills(id);
      if (resultStudentUnpaidBills.code === 200) {
        await handleSumTotal(resultStudentUnpaidBills.unpaidBills);
        setUnpaidBills(resultStudentUnpaidBills.unpaidBills);
      }
      setOpen(false);
    }
  };
  const openDocument = (data) => {
    // Create a blob from the data
    const blob = new Blob([Buffer.from(data.data)], { type: data.type });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    // Open the URL in a new tab
    window.open(url, '_blank');
  };
  useEffect(() => {
    const fetchData = async () => {
      const result2 = await getGroups();
      if (result2.code === 200) {
        const data = await result2.groups.map((group) => ({
          id: group.ID_ROWID,
          name: group.GroupeName,
        }));
        setGroups(ColorGenerator(data));
      }
      const result3 = await getAllSessionsForStudent(id);
      if (result3.code === 200) {
        setEvents(result3.events);
      }
      // user Data
      const usersData1 = await getStudent(id);
      const usersData = usersData1.student;
      const image =
        usersData.personProfile2.imagePath !== null && usersData.personProfile2.imagePath !== ''
          ? `data:image/jpeg;base64,${Buffer.from(usersData.personProfile2.imagePath).toString(
              'base64'
            )}`
          : '../../assets/images/avatars/avatar_10.jpg';

      const user = {
        id: usersData.ID_ROWID,
        name: `${usersData.personProfile2.firstName} ${usersData.personProfile2.lastName}`,
        code: usersData.studentCode,
        niveau: usersData.studentLevel?.educationalLevel?.lib,
        image, // shorthand notation for image: image
      };
      setData([
        { label: 'Téléphone', value: usersData.personProfile2.phoneNumber },
        { label: 'Email', value: usersData.personProfile2.mail },
        { label: 'Date de naissance', value: usersData.personProfile2.dateOfBirth },
        { label: "Niveau d'étude", value: usersData.studentLevel?.educationalLevel?.lib },
        { label: "Année d'étude", value: usersData.studentLevel?.studyYear?.lib },
      ]);
      setFiles(usersData1.files);

      setUserData(user); // Putting user in an array, assuming setUserData expects an array
      // history
      const result4 = await getStudentHistory(id);
      if (result4.code === 200) {
        const history = result4.mergedList;
        await history.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistoryData(history);
      }

      // get student session recoreding
      const resultSessionAttRec = await getSessionAttRecForStuent(id);
      if (resultSessionAttRec.code === 200) {
        setSessions(resultSessionAttRec.sessionAttRec);
      }
      // get student bills
      const resultStudentBills = await getStudentBills(id);
      console.log(resultStudentBills);
      if (resultStudentBills.code === 200) {
        setBills(resultStudentBills.bills);
      }
      // get student unpaid bills
      const resultStudentUnpaidBills = await getUnpaidBills(id);
      if (resultStudentUnpaidBills.code === 200) {
        handleSumTotal(resultStudentUnpaidBills.unpaidBills);
        setUnpaidBills(resultStudentUnpaidBills.unpaidBills);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once when component mounts
  const stringToColor = (name) => {
    const hashCode = name
      .toString()
      .split('')
      .reduce((acc, char) => {
        acc = acc * 31 + char.charCodeAt(0) + 100;
        return acc;
      }, 0);
    const color = `#${((hashCode & 0xffffff) << 0).toString(16).padStart(6, '0')}`; // eslint-disable-line no-bitwise
    return color;
  };

  const ColorGenerator = (data) => {
    const colors = {};

    data?.forEach((option) => {
      colors[option.id] = stringToColor(`${option.name}${option.id}`);
    });
    return colors;
  };
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // checkBox handels

  const handleSelectSession = (progID, sessionIndex) => {
    const updatedUnpaidBills = { ...unpaidBills };

    if (updatedUnpaidBills[progID]) {
      const program = updatedUnpaidBills[progID];

      // Toggle isChecked for the event
      program.events = program.events.map((event) => {
        if (event.id === sessionIndex) {
          return { ...event, isChecked: !event.isChecked };
        }
        return event;
      });

      // Check if all events are checked or not
      program.isChecked = program.events.every((event) => event.isChecked);

      setUnpaidBills(updatedUnpaidBills);
      handleSumMontant();
    }
  };
  const handleSelectProgram = (progID) => {
    const updatedUnpaidBills = { ...unpaidBills };

    if (updatedUnpaidBills[progID]) {
      const program = updatedUnpaidBills[progID];

      if (program.type !== 'Total') {
        // Toggle isChecked for the event
        program.events = program.events.map((event) => {
          return { ...event, isChecked: !program.isChecked };
        });
      }
      program.isChecked = !program.isChecked;

      setUnpaidBills(updatedUnpaidBills);
      handleSumMontant();
    }
  };
  // calculate montant general
  const handleSumMontant = () => {
    const updatedUnpaidBills = { ...unpaidBills };
    let total = 0;

    Object.keys(updatedUnpaidBills).forEach((billId) => {
      const bill = updatedUnpaidBills[billId];
      let montant = 0;
      if (bill.eventT === 'normal') {
        if (bill.type === 'Total' && bill.isChecked) {
          montant = bill.prix;
        } else if (bill.type !== 'Total') {
          // Filter events where isChecked is true
          const checkedEvents = bill.events.filter((event) => event.isChecked);
          // Calculate montant based on prix * number of checked events
          montant = bill.prix * checkedEvents.length;
        }
      } else if (bill.eventT === 'private' && bill.isChecked) {
        montant = bill.prix;
      }
      // Update the montant for the bill
      bill.montant = montant;
      bill.quantite = bill.events.filter((event) => event.isChecked).length;
      total += montant;
    });
    setTotal(total);
    setUnpaidBills(updatedUnpaidBills);
  };
  const handleSumTotal = (data) => {
    const updatedUnpaidBills = { ...data };
    let total = 0;
    Object.keys(updatedUnpaidBills).forEach((billId) => {
      const bill = updatedUnpaidBills[billId];
      console.log(bill);
      let montant = 0;

      if (bill.eventT === 'normal') {
        if (bill.type === 'Total' && bill.isChecked) {
          montant = bill.prix;
        } else if (bill.type !== 'Total') {
          // Filter events where isChecked is true
          const checkedEvents = bill.events.filter((event) => event.isChecked);
          // Calculate montant based on prix * number of checked events
          montant = bill.prix * checkedEvents.length;
        }
      } else if (bill.eventT === 'private' && bill.isChecked) {
        montant = bill.prix;
      }
      total += montant;
    });
    console.log(total);
    setTotal(total);
  };
  const Telechargerpdf = async (data) => {
    // Fetch school data
    let Schooldata;
    try {
      const response = await getGeneralSchoolData();
      if (response.code === 200) {
        Schooldata = response;
      } else {
        throw new Error('Failed to fetch school data');
      }
    } catch (error) {
      console.error('Error fetching school data:', error);
      // Show toast with error message
      toast.error('Failed to fetch school data. Please try again later.');
      return; // Exit the function early if there's an error
    }
    console.log(data);
    const pdf = new JsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Create a promise to wait for logo image loading
    const logoPromise = new Promise((resolve, reject) => {
      const logo = new Image();
      const defaultLogoPath = '../../assets/img/logo_dadam.png';
      logo.src = defaultLogoPath;
      logo.onload = function () {
        resolve(logo);
      };
      logo.onerror = function (error) {
        console.error('Error loading logo:', error);
        reject(error);
      };
    });
    let logoBottom;
    try {
      // Wait for logo image to load
      const logo = await logoPromise;
      // Adjust logo size
      const logoWidth = 50; // New width for the logo
      const logoHeight = (logo.height / logo.width) * logoWidth; // Maintain aspect ratio
      // Calculate x-coordinate to center logo horizontally
      const logoX = (pdf.internal.pageSize.width - logoWidth) / 2;
      // Add logo to the PDF
      pdf.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight); // Adjust coordinates and dimensions as needed

      // Add customer information below the logo
      pdf.setTextColor('#000000'); // Black color for customer information
      pdf.setFontSize(12);
      pdf.setFont('Helvetica', 'italy'); // Set font style to normal

      const [firstName, lastName] = userData.name.split(' '); // Splitting the full name
      logoBottom = 10 + logoHeight + 5; // Bottom position of the logo with a small margin
      pdf.text(`Nom: ${firstName}`, 10, logoBottom + 5); // Adjust y-coordinate to move below the logo
      pdf.text(`Prénom: ${lastName}`, 10, logoBottom + 15); // Adjust y-coordinate to move below the logo
      pdf.text(`Niveau d'étude: ${userData.niveau}`, 10, logoBottom + 25); // Adjust y-coordinate to move below the logo

      // Title
      const title = 'Facture';
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor('#E5B80B'); // Golden color for title
      pdf.text(title, pdf.internal.pageSize.width / 2, 75, { align: 'center' }); // Adjust y-coordinate as needed
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
      // Show toast with error message
      toast.error('Error adding logo to PDF. Please try again later.');
      return; // Exit the function early if there's an error
    }

    // Table Headers
    const headers = ['Programme', 'Session', 'Prix de session', 'Montant total'];
    const tableData = [];

    // Initialize an object to store payment data by program ID
    const programData = {};

    // Iterate through payment session modes and organize by program ID
    data.paymentSessionModes.forEach((sessionMode) => {
      const programID = sessionMode?.student?.groupes[0]?.program?.ID_ROWID;
      if (programID) {
        if (!programData[programID]) {
          programData[programID] = {
            program: sessionMode.student.groupes[0].program,
            paymentSessionModes: [],
            paymentTotalModes: [],
          };
        }
        programData[programID].paymentSessionModes.push(sessionMode);
      }
    });

    // Iterate through payment total modes and organize by program ID
    data.paymentTotalModes.forEach((totalMode) => {
      const programID = totalMode?.program?.ID_ROWID;
      if (programID) {
        if (!programData[programID]) {
          programData[programID] = {
            program: totalMode.program,
            totalAmount: totalMode.program.prix,
            paymentSessionModes: [],
            paymentTotalModes: [],
          };
        }
        programData[programID].paymentTotalModes.push(totalMode);
      }
    });
    data.student?.privateSessions?.forEach((Session) => {
      // if (Session.studentsInPrivateSession.billD === data.ID_ROWID) {
      // const programID = totalMode?.program?.ID_ROWID;
      // if (programID) {
      //   if (!programData[programID]) {
      //     programData[programID] = {
      //       program: totalMode.program,
      //       totalAmount: totalMode.program.prix,
      //       paymentSessionModes: [],
      //       paymentTotalModes: [],
      //     };
      //   }
      //   programData[programID].paymentTotalModes.push(totalMode);
      // }
      // }
    });

    // Iterate through programData object
    Object.values(programData).forEach((program) => {
      const {
        program: { title },
        paymentSessionModes,
        paymentTotalModes,
      } = program;
      const session = paymentSessionModes.length || 'Tout';
      let prixDuSession = 0; // Initialize prixDuSession

      // Calculate prixDuSession differently for session payment and total payment
      if (paymentSessionModes.length > 0) {
        prixDuSession = paymentSessionModes[0].amount;
      } else if (paymentTotalModes.length > 0) {
        prixDuSession = '/'; // Placeholder for total payment
      }

      let totalAmount = 0; // Initialize totalAmount

      // Calculate totalAmount differently for session payment and total payment
      if (paymentSessionModes.length > 0) {
        totalAmount = session * prixDuSession; // For session payment
      } else if (paymentTotalModes.length > 0) {
        totalAmount = paymentTotalModes.reduce((acc, curr) => acc + curr.program.prix, 0) || 0; // For total payment
      }

      tableData.push([title, session, prixDuSession, totalAmount]);
    });

    // Calculate total sum of total amounts
    const totalSum = tableData.reduce((acc, row) => acc + row[3], 0);

    // Merge cells for the last row
    const totalRow = [
      { content: `Total: ${totalSum} DA`, colSpan: 4, styles: { halign: 'center' } },
    ];

    // Generating the table
    pdf.autoTable({
      head: [headers],
      body: [...tableData, totalRow],
      startY: logoBottom + 45, // Adjust as needed
      margin: { top: 65 },
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: '#FFD700', // Golden color for table header background
        textColor: '#000000', // Black color for table header text
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { fontStyle: 'bold' }, // Bold font for the first column
        3: { fontStyle: 'bold' }, // Bold font for the last column
      },
    });
    pdf.setTextColor('#000000'); // Black color for signature
    pdf.setFontSize(12);
    const tableBottom = pdf.previousAutoTable.finalY + 3; // Bottom position of the table with a small space
    pdf.text('Signature', 30, tableBottom + 15); // Adjust coordinates to move below the table

    // Add extraction date text below the table
    const extractionDate = `Extrait le ${data.createdAt.split('T')[0]}`;
    pdf.setFontSize(8); // Decrease font size for extraction date
    pdf.text(extractionDate, 10, pdf.internal.pageSize.height - 30);

    // Footer separator
    pdf.setLineWidth(0.8);
    pdf.line(
      10,
      pdf.internal.pageSize.height - 20,
      pdf.internal.pageSize.width - 10,
      pdf.internal.pageSize.height - 20
    );
    pdf.setFontSize(9); // Decrease font size for extraction date

    // Footer values
    const footerLabels = ['Phone', 'Email', 'Facebook', 'Address'];
    const footerValues = [
      Schooldata.data.contacts.phone,
      Schooldata.data.contacts.mail,
      Schooldata.data.contacts.facebook,
      Schooldata.data.address,
    ];

    const startX = 15; // X coordinate for labels
    const startY = pdf.internal.pageSize.height - 12; // Y coordinate for footer, below the separator line
    let currentX = startX; // Initial X coordinate for labels

    // Add labels and values to the footer
    const firstLineLabels = footerLabels.slice(0, 2); // First line labels
    const firstLineValues = footerValues.slice(0, 2); // First line values
    firstLineLabels.forEach((label, index) => {
      const labelValue = `${label}: ${firstLineValues[index]}`; // Combine label and value
      pdf.text(labelValue, currentX, startY); // Add label and value
      currentX += 100; // Add space between label and value
    });

    // Reset X coordinate for second line
    currentX = startX;

    // Second line labels and values
    const secondLineLabels = footerLabels.slice(2); // Second line labels
    const secondLineValues = footerValues.slice(2); // Second line values
    const secondLineY = startY + 7; // Y coordinate for second line
    secondLineLabels.forEach((label, index) => {
      const labelValue = `${label}: ${secondLineValues[index]}`; // Combine label and value
      pdf.text(labelValue, currentX, secondLineY); // Add label and value
      currentX += 100; // Add space between label and value
    });

    // Save the PDF
    pdf.save('facture.pdf');
  };

  return (
    <>
      <Helmet>
        <title> Utilisateurs</title>
      </Helmet>

      <Container className="app-content-area">
        <ToastContainer />

        <div className="col-xl-12 col-lg-12 col-md-12 col-12">
          {/* <!-- Bg --> */}
          <div
            className="pt-20 rounded-top"
            style={{
              background: `url('../../../assets/images/covers/cover_9.jpg')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat', // Adding 'no-repeat' to prevent repetition
            }}
          />
          <div className="card rounded-bottom rounded-0 smooth-shadow-sm mb-5">
            <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
              <div className="d-flex align-items-center ">
                {/* <!-- avatar --> */}
                <div className="avatar-xxl  me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                  <img
                    src={userData.image}
                    className="avatar-xxl rounded-circle border border-2 "
                    alt=""
                  />
                </div>
                {/* <!-- text --> */}

                <div className="row">
                  <div className="col-lg-12 col-md-12 col-12">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                      <div className="mb-2 mb-lg-0">
                        <Typography className="mb-0 " variant="h3">
                          {userData.name}
                        </Typography>
                        <p className="mb-0 d-block">{userData.code}</p>
                      </div>
                      {/* Button aligned to the bottom-right */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="lh-1 align-self-end ml-auto">
                <Link to={`/dashboard/updateStudent/${id}`}>
                  <Button variant="contained">Modifier</Button>
                </Link>
              </div>
            </div>
            {/* <!-- nav --> */}
          </div>
        </div>
        <div className="row">
          {/* info general */}
          <div className="col-xl-5 col-lg-12 col-md-12 col-12 mb-5">
            {/* <!-- card --> */}
            <div className="card">
              {/* <!-- card body --> */}
              <div className="card-header">
                <Typography className="mb-0 " variant="h6">
                  À propos de moi
                </Typography>
              </div>
              {/* <!-- row --> */}
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                <Table aria-label="simple table">
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.label}
                        </TableCell>
                        <TableCell>{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          {/* end info general */}
          {/* list des documment */}
          <div className="col-xl-7 col-lg-12 col-md-12 col-12 mb-5">
            {/* <!-- card --> */}
            <div className="card" style={{ height: '345px' }}>
              {/* <!-- card body --> */}
              <div className="card-header">
                <Typography className="mb-0 " variant="h6">
                  Document
                </Typography>
              </div>
              {/* <!-- row --> */}
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                <Table aria-label="simple table">
                  <TableBody>
                    {files.map((row, index) => (
                      <TableRow key={index} onClick={() => openDocument(row)}>
                        <TableCell component="th" scope="row" style={{ color: 'blue' }}>
                          {row.name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          {/* end list des documment */}
          {/* list des bills */}
          <div className="col-xl-5 col-lg-12 col-md-12 col-12 mb-5">
            {/* <!-- card --> */}
            <div className="card" style={{ height: '345px' }}>
              {/* <!-- card body --> */}
              <div
                className="card-header"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
              >
                <Typography className="mb-0" variant="h6">
                  Factures
                </Typography>

                <Button variant="outlined" onClick={handleClickOpen}>
                  Ajouter une facture
                </Button>
              </div>

              {/* <!-- row --> */}
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                {bills.length !== 0 ? (
                  <Table aria-label="simple table">
                    <TableBody>
                      {bills?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell noWrap>
                            <Typography variant="subtitle1">{row.totalAmount} DA</Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="subtitle2" noWrap>
                              {formatDate2(row.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {/* telecharger facture  */}
                            {/*  infoes  i need for it  
                            students
                            sessions payed + programme
                            date 
                            */}
                            <Button variant="contained" onClick={() => Telechargerpdf(row)}>
                              Télecharger
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography style={{ padding: '20px' }} variant="h6" paragraph>
                    Aucune facture n'a été affectée.
                  </Typography>
                )}
              </TableContainer>
            </div>
          </div>
          {/* end list des bills */}
          {/* list des séance */}
          <div className="col-xl-7 col-lg-12 col-md-12 col-12 mb-5">
            {/* <!-- card --> */}
            <div className="card" style={{ height: '345px' }}>
              {/* <!-- card body --> */}
              <div className="card-header">
                <Typography className="mb-0 " variant="h6">
                  Enregistrements des Participation
                </Typography>
              </div>
              {/* <!-- row --> */}
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                {sessions.length !== 0 ? (
                  <Table aria-label="simple table">
                    <TableBody>
                      {sessions?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell noWrap>
                            <Typography variant="subtitle1">
                              {row.title}
                              {row.type === 'normal' && (
                                <Link
                                  style={{ color: 'blue' }}
                                  to={`/dashboard/ProgrameProfile/${row.prog.id}`}
                                >
                                  <Iconify
                                    icon={'akar-icons:link-out'}
                                    sx={{ mr: 1 }}
                                    style={{ marginLeft: '20px' }}
                                  />
                                </Link>
                              )}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="subtitle2" noWrap>
                              {row?.start?.slice(0, 5)} - {row?.end?.slice(0, 5)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" noWrap>
                              {formatDate2(row.date)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={!row.isPaid ? 'non payé' : 'déjà payé'}
                              size="medium"
                              color={!row.isPaid ? 'error' : 'success'}
                              style={{
                                color: 'white',
                                fontSize: '14px',
                                fontFamily: 'Arial',
                                fontWeight: 'bold',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography style={{ padding: '20px' }} variant="h6" paragraph>
                    Aucune Séance n'a été enregistrée.
                  </Typography>
                )}
              </TableContainer>
            </div>
          </div>
          {/* end list des séance */}
          {/* list de vos activiter */}
          <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-5">
            {/* <!-- card --> */}
            <div className="card" style={{ height: '345px' }}>
              <div className="card-header">
                <Typography className="mb-0 " variant="h6">
                  Historique
                </Typography>
              </div>
              {/* <!-- card body --> */}
              <TableContainer component={Paper} style={{ padding: '10px' }}>
                <Table aria-label="simple table">
                  <TableBody>
                    {historyData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <img src={`../../../assets/svg/${data.logo}`} alt="data.id" width={20} />
                        </TableCell>
                        <TableCell>
                          {data.type !== 'AccountCreation' ? (
                            <>
                              <Typography variant="subtitle2" noWrap>
                                {data.title}
                                <Link
                                  style={{ color: 'blue' }}
                                  to={`/dashboard/ProgrameProfile/${data.progID}`}
                                >
                                  <Iconify
                                    icon={'akar-icons:link-out'}
                                    sx={{ mr: 1 }}
                                    style={{ marginLeft: '20px' }}
                                  />
                                </Link>
                              </Typography>
                            </>
                          ) : (
                            data.title
                          )}
                        </TableCell>
                        <TableCell>{formatDate(data.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          {/* end de vos activiter */}
        </div>
        {/* calandrier */}
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-12">
            {/* <!-- card --> */}
            <div className="card" style={{ height: isDesktop ? '650px' : '750px' }}>
              <MyCalendar colorMap={groups} events={events} fetchEvents={fetchSessionData} />
            </div>
          </div>
        </div>
        {/* end */}
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: 'left' }}>
          Facture <Box sx={{ flexGrow: 1 }} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Table>
              <TableBody>
                <TableRow style={{ position: 'sticky', top: 0, backgroundColor: '#eaeef2' }}>
                  <TableCell>
                    <Typography variant="h6">Total</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" color="primary">
                      {total} DA
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table maxWidth="300px">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '40%' }}>Programme</TableCell>
                  <TableCell sx={{ width: '15%' }}>Prix</TableCell>
                  <TableCell sx={{ width: '15%' }}>Quantité</TableCell>
                  <TableCell sx={{ width: '30%' }}>Montant Total</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(unpaidBills).map((key) => {
                  const data = unpaidBills[key];
                  // return true;
                  return <Row data={data} />;
                })}
              </TableBody>
            </Table>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={payStudentBills} autoFocus>
            Affectée
          </Button>
          <Button onClick={handleClose}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </>
  );
  function Row(props) {
    const { data } = props;
    const [open, setOpen] = useState(data.eventT === 'normal' && data.type !== 'Total');
    return (
      <Fragment key={data.id}>
        <TableRow>
          <TableCell>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.isChecked}
                    onChange={() => handleSelectProgram(data.id)}
                  />
                }
                label={`Programme ${data.title}`}
              />
            </FormGroup>
          </TableCell>
          <TableCell>{data.prix} DA</TableCell>
          <TableCell>
            {data.eventT === 'normal' && data.type !== 'Total' ? data.quantite : 'Total'}
          </TableCell>
          <TableCell>{data.montant} DA</TableCell>
          <TableCell>
            {data.type !== 'Total' && (
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Séance
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    {data.type !== 'Total' &&
                      data.events.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={event.isChecked}
                                  onChange={() => handleSelectSession(data.id, event.id)}
                                />
                              }
                              label={`${event.start.slice(0, 5)} - 
                  ${event.end.slice(0, 5)} 
                  ${formatDate2(event.date)}`}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  }
};

export default StudentProfile;
