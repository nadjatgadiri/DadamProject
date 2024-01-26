import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Iconify from '../../components/iconify';
import { getProgram } from "../../RequestManagement/webSiteManagement";
import FooterSection from './footer'
import NavSection from './nav'

export default function ProgrammeProfileHome() {
    const { progId } = useParams();
    // api
    // first step states
    const [data, setData] = useState(null);
    const [title, setTitle] = useState("");
    const [lib, setLib] = useState("");
    const [type, setType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState({
        "id": "",
        "label": ""
    });
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
    const fetchData = async () => {
        const dataResult = await getProgram(progId);
        if (dataResult.code === 200) {
            const programeData = dataResult.program;
            const secondStepData = dataResult.data;
            if (programeData) {

                setTitle(programeData.title);
                setLib(programeData.discription);
                setType(programeData.type);
                setPrix(programeData.prix);
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
    };
    useEffect(() => {
        fetchData();
    }, [progId]); // Empty dependency array means this effect runs once when component mounts
    // convert date

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    }
    return (
        <>
            <div className="site-mobile-menu">
                <div className="site-mobile-menu-header">
                    <div className="site-mobile-menu-close">
                        <span className="icofont-close js-menu-toggle" />
                    </div>
                </div>
                <div className="site-mobile-menu-body" />
            </div>
            <NavSection />
            <div className="untree_co-hero overlay"
                style={{ backgroundImage: 'url("../../assets/img/cat.jpg")' }}
            >
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-12">
                            <div className="row justify-content-center ">
                                <div className="col-lg-10 text-center ">
                                    <h1 className="mb-4 heading text-white" data-aos="fade-up" data-aos-delay={100}>Programme {title}</h1>
                                </div>
                            </div>
                        </div>
                    </div> {/* /.row */}
                </div> {/* /.container */}
            </div>

            {/* Hello world */}
            <div className="untree_co-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-xl-9 col-12">
                            <div className="row">
                                <div className="col-12 mb-5">
                                    <div className="card" >
                                        <div className="card-header" style={{ backgroundColor: "#da9938" }}>
                                            <div className="d-flex justify-content-betweenalign-items-center">
                                                <div>
                                                    <Typography className="mb-0 " style={{ color: "white" }} variant="h4">Description</Typography>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div style={{ minHeight: '125px', overflow: 'auto' }}>
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
                                                                    <Typography className="mb-0" variant="subtitle1">Date De Fin</Typography>
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
                                                </ul>
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-3 col-12">
                            <div className="card" style={{ marginBottom: "20px", backgroundColor: "#da9938", color: "white" }}>
                                <div className="card-body">
                                    {/* <!-- row --> */}
                                    <div className="row">
                                        {/* <!-- col --> */}
                                        <div className="mb-1">
                                            <div className="d-flex align-items-center justify-content-between p-2">
                                                <div>
                                                    <h2 className="h1  mb-0" style={{ color: "white" }}>{prix}DA</h2>
                                                    <h3 style={{ color: "white" }}>Prix {typeOfPaiment}</h3>
                                                </div>
                                                <div className="ms-3">
                                                    <div className="icon-shape icon-lg bg-primary-soft text-primary rounded-circle text-primary">
                                                        <Iconify
                                                            icon="gg:dollar" width="40px" style={{ color: "white" }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{ backgroundColor: "#da9938", color: "white" }}>
                                <div className="card-body">
                                    {/* <!-- row --> */}
                                    <div className="row">
                                        {/* <!-- col --> */}
                                        <div className="mb-1">
                                            <div className="d-flex align-items-center justify-content-between p-2">
                                                <div>
                                                    <h3 className="h1 mb-0" style={{ color: "white" }}>{type}</h3>
                                                </div>
                                                <div className="ms-1" >
                                                    <div className="icon-shape icon-lg bg-primary-soft text-primary rounded-circle text-primary">
                                                        <Iconify
                                                            icon="material-symbols:category" width="30px" style={{ color: "white" }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-1">
                                            <div className="d-flex align-items-center justify-content-between p-2">
                                                <div>
                                                    <h3 className="h1 mb-0" style={{ color: "white" }}>{selectedCategory.label}</h3>
                                                </div>
                                                <div className="ms-1">
                                                    <div className="icon-shape icon-lg bg-primary-soft text-primary rounded-circle text-primary">
                                                        <Iconify
                                                            icon="ph:path-bold" width="30px" style={{ color: "white" }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /.row */}
                </div>{" "}
                {/* /.container */}
            </div>{" "}
            {/* /.untree_co-section */}
            <FooterSection />
        </>

    );
}