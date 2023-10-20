import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';

// @mui
import {
    Badge, Card, Table, Stack, Paper, Avatar, Button, Popover, Checkbox, TableRow, MenuItem,
    TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination,
    TextField, Select,
} from '@mui/material';
import './theme.css';
import { getProgramme } from "../../RequestManagement/programManagement"

import Iconify from '../../components/iconify';


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
    return (
        <>

            <Helmet>
                <title> Utilisateurs | Minimal UI </title>
            </Helmet>

            <Container className="app-content-area">
                <div className="bg-primary pt-10 pb-21 mt-n5 mx-n14" />
                <div className=" mt-n22 ">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            {/* Page header */}
                            <div className="d-flex justify-content-between align-items-center mb-5">
                                <div className="mb-2 mb-lg-0">
                                    <h3 className="mb-0  text-white">
                                        {type === "cour" ? "Cour De " : null}
                                        {type === "formation" ? "Formation De " : null}
                                        {title}</h3>
                                </div>
                                <div>
                                    <a href="#!" className="btn btn-white">Create New Project</a>
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
                                <div className="card">
                                    <div className="card-header ">
                                        <div className="d-flex justify-content-betweenalign-items-center">
                                            <div>
                                                <h4 className="mb-0">Description</h4>
                                            </div>

                                        </div>


                                    </div>
                                    <div className="card-body">
                                        <p>{lib}</p>
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
                                                <h2 className="h1  mb-0">52,000DA</h2>
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
                                                <h2 className="h1  mb-0">43,230DA</h2>
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
                    <div className="col-md-12 col-xl-8 col-12">
                        <div className="row">
                            <div className="col-md-12 mb-5">
                                {/* <!-- card --> */}
                                <div className="card">
                                    {/* <!-- card body --> */}

                                    <div className="card-header">
                                        <h4 className="mb-0">Liste des abonnés</h4>
                                    </div>
                                    {/* <!-- table --> */}
                                    <div className="card-body">
                                        <div className="table-responsive overflow-y-hidden table-card">
                                            <table className="table mb-0 text-nowrap table-centered">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Member</th>
                                                        <th>Task</th>
                                                        <th>Deadline </th>


                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="avatar avatar-sm" />
                                                                <div className="ms-2">
                                                                    <h5 className="mb-0"><a href="#!" className="text-inherit">Eleanor Pena</a> </h5>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            Design a Dash UI Figma
                                                        </td>
                                                        <td>
                                                            30 Aug, 2023
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">

                                                                <div className="progress flex-auto" style={{ height: "6px" }}>
                                                                    <div className="progress-bar bg-success " role="progressbar" style={{ width: "62%" }} aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" />
                                                                </div>
                                                                <div className="ms-2"> <span>62%</span></div>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="avatar avatar-sm" />
                                                                <div className="ms-2" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            Dash UI Webpack Workflow
                                                        </td>
                                                        <td>
                                                            24 Sept, 2023
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">

                                                                <div className="progress flex-auto" style={{ height: "6px" }}>
                                                                    <div className="progress-bar bg-success " role="progressbar" style={{ width: '45%' }} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" />
                                                                </div>
                                                                <div className="ms-2"> <span>45%</span></div>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-2">
                                                                    <h5 className="mb-0"> <a href="#!" className="text-inherit">Wade Warren</a></h5>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            Dash UI React version
                                                        </td>
                                                        <td>
                                                            30 Sept, 2023
                                                        </td>


                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-2">
                                                                    <h5 className="mb-0"><a href="#!" className="text-inherit"> Courtney Henry</a></h5>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            Dash UI Documents Improve
                                                        </td>
                                                        <td>
                                                            20 Dec, 2023
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">

                                                                <div className="progress flex-auto" style={{ height: "6px" }}>
                                                                    <div className="progress-bar bg-success " role="progressbar" style={{ width: "10px" }} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" />
                                                                </div>
                                                                <div className="ms-2"> <span>10%</span></div>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex align-items-center">

                                                                <div className="ms-2">
                                                                    <h5 className="mb-0"><a href="#!" className="text-inherit">Brooklyn Simmons</a></h5>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            Ecommerce Design Dash UI
                                                        </td>
                                                        <td>
                                                            25 Jan, 2023
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">

                                                                <div className="progress flex-auto" style={{ height: "6px" }}>
                                                                    <div className="progress-bar bg-success " role="progressbar" style={{ width: "8%" }} aria-valuenow="8" aria-valuemin="0" aria-valuemax="100" />
                                                                </div>
                                                                <div className="ms-2"> <span>8%</span></div>
                                                            </div>
                                                        </td>

                                                    </tr>


                                                </tbody>
                                            </table>
                                        </div>
                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-xl-4 col-12">
                        <div className="card">
                            {/* <!-- Card header --> */}
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">Recent Activity
                                    </h4>
                                </div>
                                <div><a href="#!" className="btn btn-primary btn-sm">View All</a></div>
                            </div>
                            {/* <!-- Card body --> */}
                            <div className="card-body">
                                {/* <!-- List group --> */}
                                <ul className="list-group list-group-flush ">
                                    <li className="list-group-item px-0 pt-0 border-0 pb-6">
                                        <div className="row position-relative">
                                            <div className="col-auto">
                                                <div className="icon-shape icon-md bg-primary-soft text-primary rounded-circle">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check icon-xs"><polyline points="20 6 9 17 4 12" /></svg>
                                                </div>
                                            </div>
                                            <div className="col ms-n2">
                                                <h4 className="mb-0 h5">Task Finished</h4>
                                                <p className="mb-0 ">Paula finished figma task</p>

                                            </div>
                                            <div className="col-auto">
                                                <span className="text-muted fs-6">2 mins ago</span>

                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item px-0 pt-0 border-0 pb-6">
                                        <div className="row position-relative">
                                            <div className="col-auto">
                                                <div className="icon-shape icon-md bg-primary-soft text-primary rounded-circle line-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square icon-xs"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                                </div>
                                            </div>
                                            <div className="col ms-n2">
                                                <h4 className="mb-0 h5">New Comment</h4>
                                                <p className="mb-0 ">Georg commented on task.</p>

                                            </div>
                                            <div className="col-auto">
                                                <span className="text-muted fs-6">1 hour ago</span>

                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item px-0 pt-0 border-0 pb-6">
                                        <div className="row position-relative">
                                            <div className="col-auto">
                                                <div className="icon-shape icon-md bg-primary-soft text-primary rounded-circle line-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-triangle icon-xs"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                                </div>
                                            </div>
                                            <div className="col ms-n2">
                                                <h4 className="mb-0 h5">Task Overdue</h4>
                                                <p className="mb-0 ">Task <a href="#!"><u>status updatd for board</u></a>
                                                    is overdue.</p>

                                            </div>
                                            <div className="col-auto">
                                                <span className="text-muted fs-6">1 day</span>

                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item px-0 pt-0 border-0">
                                        <div className="row position-relative">
                                            <div className="col-auto">
                                                <div className="icon-shape icon-md bg-primary-soft text-primary rounded-circle line-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail icon-xs"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="col ms-n2">
                                                <h4 className="mb-0 h5">Update Send to Client</h4>
                                                <p className="mb-0 ">Jitu send email to update design
                                                    for client Dash UI.</p>

                                            </div>
                                            <div className="col-auto">
                                                <span className="text-muted fs-6">1 day</span>

                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>


        </>
    );
}
export default ProgrameProfile;