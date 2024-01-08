import React, { useState, useEffect } from "react";
import { getSchoolData } from '../../RequestManagement/webSiteManagement';

function FooterSection() {
    const [schoolData, setSchoolData] = useState({});
    /** api */
    const fetchData = async () => {
        const result = await getSchoolData();
        if (result.code === 200) {
            setSchoolData(result.data);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>

            <div className="site-footer">
                <div className="container ">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 mr-auto">
                            <div className="widget">
                                <h3>Qui Sommes-Nous ?<span className="text-primary">.</span> </h3>
                                <p>
                                    {schoolData.lib}
                                </p>
                            </div> {/* /.widget */}

                        </div> {/* /.col-lg-4 */}
                        <div className="col-lg-3 ml-auto">
                            <div className="widget">
                                <h3>Projects</h3>
                                <ul className="list-unstyled float-left links">
                                    <li><i className="bx bx-chevron-right" style={{ marginRight: "10px" }} /><a href="/home">Home</a></li>
                                    <li><i className="bx bx-chevron-right" style={{ marginRight: "10px" }} /> <a href="/home#categpry">Categories</a></li>
                                    <li><i className="bx bx-chevron-right" style={{ marginRight: "10px" }} /> <a href="/home#Services">Services</a></li>
                                    <li><i className="bx bx-chevron-right" style={{ marginRight: "10px" }} /> <a href="/home#Recent">Le Plus Récent</a></li>
                                    <li><i className="bx bx-chevron-right" style={{ marginRight: "10px" }} /> <a href="/home/categories/0">Explorer Programmes</a></li>
                                </ul>
                            </div> {/* /.widget */}
                        </div> {/* /.col-lg-2 */}
                        <div className="col-lg-3">
                            <div className="widget">
                                <h3>Contact</h3>
                                <p>{schoolData.address}</p>
                                <ul className="list-unstyled links mb-4">
                                    <li><a href={`tel://${schoolData.contacts?.phone}`}>{schoolData.contacts?.phone || ''}</a></li>
                                    <li><a href={`mailto:${schoolData.contacts?.mail}`}>{schoolData.contacts?.mail || ''}</a></li>
                                </ul>
                            </div> {/* /.widget */}
                        </div>
                        <div className="col-lg-2">
                            <div className="widget">
                                <h3>Connect</h3>
                                <ul className="list-unstyled social">
                                    <li>
                                        <a href={schoolData.contacts?.twitter} target="_blank" rel="noopener noreferrer">
                                            <i className="bx bxl-twitter" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href={schoolData.contacts?.instagram} target="_blank" rel="noopener noreferrer">
                                            <i className="bx bxl-instagram" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href={schoolData.contacts?.facebook} target="_blank" rel="noopener noreferrer">
                                            <i className="bx bxl-facebook" />
                                        </a>
                                    </li>

                                </ul>
                            </div> {/* /.widget */}
                        </div> {/* /.col-lg-4 */}
                    </div> {/* /.row */}

                </div> {/* /.container */}
            </div> {/* /.site-footer */}
        </>
    );
};

export default FooterSection;
