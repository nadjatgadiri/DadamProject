import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// @mui
import {
    Typography, Container, Paper, Table, TableBody, TableCell, TableRow, TableContainer, Button
} from '@mui/material';
import '../Programme/theme.css';
import { Buffer } from "buffer";
import { getTeacherData } from '../../RequestManagement/teacherManagement'; // Import the function to fetch teacher data
import { getGroups } from "../../RequestManagement/groupManagement"; // Import the function to fetch group data
import { getAllSessionsForTeacher } from "../../RequestManagement/sessionsManagement"

import MyCalendar from '../Programme/calendar/calendar'; // 
import useResponsive from '../../hooks/useResponsive';

const TeacherProfile = () => {
    const isDesktop = useResponsive('up', 'sm');
    const [groups, setGroups] = useState([]); // State to hold group data
    const [events, setEvents] = useState([]);
    const { id } = useParams();
    console.log(id);
    const [userData, setUserData] = useState('');
    // const [files, setFiles] = useState([' ']); // Commented out files related state
    const [data, setData] = useState([
        { label: 'Phone', value: '' },
        { label: 'Email', value: '' },
        { label: 'Date of Birth', value: '' },
        { label: 'Matier', value: '' } // Added label for subject
    ]);

    /** api */
    const fetchData = async () => {
        const result3 = await getAllSessionsForTeacher(id);
        console.log(result3);
        if (result3.code === 200) {
            setEvents(result3.events);
        }
        // Fetch teacher data
        const teacherData1 = await getTeacherData(id);
        const teacherData= teacherData1.teacher;
        console.log(teacherData);
        // Process teacher data
        const image = teacherData.personProfile2.imagePath !== null && teacherData.personProfile2.imagePath !== '' ?
            `data:image/jpeg;base64,${Buffer.from(
                teacherData.personProfile2.imagePath).toString("base64")}` : "../../assets/images/avatars/avatar_10.jpg";

        const user = {
            id: teacherData.ID_ROWID,
            name: `${teacherData.personProfile2.firstName} ${teacherData.personProfile2.lastName}`,
            image,
        };
        setData([
            { label: 'Téléphone', value: teacherData.personProfile2.phoneNumber },
            { label: 'Email', value: teacherData.personProfile2.mail },
            { label: 'Date de naissance', value: teacherData.personProfile2.dateOfBirth },
            { label: 'Matier', value: teacherData.subject }, // Set value for subject
            // Add more data fields if needed
        ]);
        // setFiles(teacherData.files); // Commented out files related state update
        console.log(user);
        setUserData(user);

           // Fetch groups data
           const result = await getGroups();
           if (result.code === 200) {
               const data = result.groups.map(group => ({
                   id: group.ID_ROWID,
                   name: group.GroupeName
               }));
               setGroups(ColorGenerator(data));
           }
    };

    // const openDocument = (data) => {
    //     const blob = new Blob([Buffer.from(data.data)], { type: data.type });
    //     const url = URL.createObjectURL(blob);
    //     window.open(url, '_blank');
    // };

    useEffect(() => {
        fetchData();
    }, []);

    const stringToColor = (name) => {
        const hashCode = name.toString().split('').reduce((acc, char) => {
            acc = (acc * 31) + char.charCodeAt(0) + 100;
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
    return (
        <>
            <Helmet>
                <title> Profil de l'enseignant</title>
            </Helmet>

            <Container className="app-content-area">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                    {/* Bg */}
                    <div className="pt-20 rounded-top" style={{
                        background: `url('../../../assets/images/covers/cover_9.jpg')`,
                        backgroundSize: "cover",
                        backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div className="card rounded-bottom rounded-0 smooth-shadow-sm mb-5">
                        <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
                            <div className="d-flex align-items-center">
                                <div className="avatar-xxl me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                                    <img src={userData.image} className="avatar-xxl rounded-circle border border-2" alt="" />
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-5">
                                            <div className="mb-2 mb-lg-0">
                                                <Typography className="mb-0" variant="h3">
                                                    {userData.name}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-5 col-lg-12 col-md-12 col-12 mb-5">
                        <div className="card">
                            <div className="card-header">
                                <Typography className="mb-0" variant="h6">À propos de moi</Typography>
                            </div>
                            <TableContainer component={Paper} style={{ padding: "10px" }}>
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
                    {/* <div className="col-xl-7 col-lg-12 col-md-12 col-12 mb-5">
                        <div className="card" style={{ height: "345px" }}>
                            <div className="card-header">
                                <Typography className="mb-0" variant="h6">Document</Typography>
                            </div>
                            <TableContainer component={Paper} style={{ padding: "10px" }}>
                                <Table aria-label="simple table">
                                    <TableBody>
                                        {files.map((row, index) => (
                                            <TableRow key={index} onClick={() => openDocument(row)}>
                                                <TableCell component="th" scope="row" style={{ color: "blue" }}>
                                                    {row.name}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div> */}
                     <div className="card-body">
                                {/* Render your calendar component here */}
                                <MyCalendar colorMap={groups} events={events} />
                            </div>
                </div>

               
            </Container>
        </>
    );
}

export default TeacherProfile;
