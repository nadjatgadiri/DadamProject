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
import SubscribersComponnent from './programeComponnent/subscribersComponnent';
import GroupesComponnent from './programeComponnent/groupesComponnent';
import { getProgGroups } from '../../RequestManagement/groupManagement';


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
                    <SubscribersComponnent idProg={id} groups={groupsData} />

                </div>
                <div className="row">
                    <GroupesComponnent idProg={id} groups={groupsData} />

                </div>
            </Container>


        </>
    );
}
export default ProgrameProfile;