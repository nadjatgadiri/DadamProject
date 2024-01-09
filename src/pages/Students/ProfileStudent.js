import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import {
    Typography, Container, Paper, Table, Link, TableBody, TableCell, TableRow, TableContainer
} from '@mui/material';
import '../Programme/theme.css';
import { Buffer } from "buffer";
import { getGroups } from "../../RequestManagement/groupManagement"
import { getAllSessionsForStudent } from "../../RequestManagement/sessionsManagement"
import { getStudentHistory, getStudent } from '../../RequestManagement/studentManagement'
import MyCalendar from '../Programme/calendar/calendar'
import useResponsive from '../../hooks/useResponsive';

const StudentProfile = () => {
    const isDesktop = useResponsive('up', 'sm');
    const { id } = useParams();
    const [userData, setUserData] = useState('');
    const [historyData, setHistoryData] = useState([]);
    const [groups, setGroups] = useState([]);
    const [events, setEvents] = useState([]);
    const [data, setData] = useState([
        { label: 'Phone', value: '' },
        { label: 'Email', value: '' },
        { label: 'Date of Birth', value: '' }
        // Add more data as needed
    ])
    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false // Use 24-hour format
        };
        return date.toLocaleDateString('fr-FR', options);
    }

    /** api */
    const fetchData = async () => {

        const result2 = await getGroups();
        if (result2.code === 200) {
            const data = await result2.groups.map(group => ({
                id: group.ID_ROWID,
                name: group.GroupeName
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
        console.log(usersData);

        const image = usersData.personProfile2.imagePath !== null && usersData.personProfile2.imagePath !== '' ?
            `data:image/jpeg;base64,${Buffer.from(
                usersData.personProfile2.imagePath).toString("base64")}` : "../../assets/images/avatars/avatar_10.jpg";

        const user = {
            id: usersData.ID_ROWID,
            name: `${usersData.personProfile2.firstName} ${usersData.personProfile2.lastName}`,
            code: usersData.studentCode,
            image, // shorthand notation for image: image
        };
        setData([
            { label: 'Phone', value: usersData.personProfile2.phoneNumber },
            { label: 'Email', value: usersData.personProfile2.mail },
            { label: 'Date of Birth', value: usersData.personProfile2.dateOfBirth }
        ])
        setUserData(user); // Putting user in an array, assuming setUserData expects an array
        // history
        const result4 = await getStudentHistory(id);
        if (result4.code === 200) {
            const history = result4.mergedList;
            await history.sort((a, b) => new Date(b.date) - new Date(a.date));
            setHistoryData(history);
        }
    };
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this effect runs once when component mounts
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
                <title> Utilisateurs</title>
            </Helmet>

            <Container className="app-content-area">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                    {/* <!-- Bg --> */}
                    <div className="pt-20 rounded-top" style={{
                        background: `url('../../../assets/images/covers/cover_9.jpg')`,
                        backgroundSize: "cover",
                        backgroundRepeat: 'no-repeat' // Adding 'no-repeat' to prevent repetition
                    }}
                    />
                    <div className="card rounded-bottom rounded-0 smooth-shadow-sm mb-5">
                        <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
                            <div className="d-flex align-items-center">
                                {/* <!-- avatar --> */}
                                <div className="avatar-xxl  me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                                    <img src={userData.image} className="avatar-xxl rounded-circle border border-2 " alt="" />
                                </div>
                                {/* <!-- text --> */}
                                <div className="lh-1">
                                    <Typography className="mb-0 " variant="h3">
                                        {userData.name}
                                    </Typography>
                                    <p className="mb-0 d-block">{userData.code}</p>
                                </div>
                            </div>

                        </div>
                        {/* <!-- nav --> */}

                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-5 col-lg-12 col-md-12 col-12 mb-5">
                        {/* <!-- card --> */}
                        <div className="card" style={{ height: "240px" }}>
                            {/* <!-- card body --> */}
                            <div className="card-header">
                                <Typography className="mb-0 " variant="h6">À propos de moi</Typography>
                            </div>
                            {/* <!-- row --> */}
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
                    <div className="col-xl-7 col-lg-12 col-md-12 col-12 mb-5">
                        {/* <!-- card --> */}
                        <div className="card" style={{ height: "240px" }}>
                            <div className="card-header">
                                <Typography className="mb-0 " variant="h6">Historique</Typography>
                            </div>
                            {/* <!-- card body --> */}
                            <TableContainer component={Paper} style={{ padding: "10px" }}>
                                <Table aria-label="simple table">
                                    <TableBody>
                                        {historyData.map((data, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <img src={`../../../assets/svg/${data.logo}`} alt="data.id" width={20} />
                                                </TableCell>
                                                <TableCell>{
                                                    data.type !== 'AccountCreation' ?
                                                        (<Link to={`/dashboard/ProgrameProfile/${data.ID_ROWID}`}>

                                                            <Typography variant="subtitle2" noWrap>
                                                                {data.title}
                                                            </Typography>
                                                        </Link>) :
                                                        data.title
                                                }</TableCell>
                                                <TableCell>
                                                    {formatDate(data.date)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </div>
                    </div >
                </div>
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-12">
                        {/* <!-- card --> */}
                        <div className="card" style={{ height: isDesktop ? '650px' : '750px' }}>
                            <MyCalendar colorMap={groups} events={events} fetchEvents={fetchData} />
                        </div>
                    </div>

                </div>
            </Container >
        </>
    )
}

export default StudentProfile;