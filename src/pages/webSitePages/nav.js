import React, { useState, useEffect } from "react";
import { getSchoolData } from '../../RequestManagement/webSiteManagement';

function NavSection() {
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
            <nav className="site-nav mb-5">

                <div className="sticky-nav js-sticky-header">
                    <div className="container position-relative">
                        <div className="site-navigation text-center">
                            <a href="/home" className="logo menu-absolute m-0">DADAM School<span className="text-primary">.</span></a>
                            <ul className="js-clone-nav d-none d-lg-inline-block site-menu">
                                <li className="active"><a href="/home">Home</a></li>
                                <li><a href="/home#categpry">Catégories</a></li>
                                <li><a href="/home#Services">Services</a></li>
                                <li><a href="/home#Recent">Le Plus Récent</a></li>
                                <li><a href="home/categories/0">Programmes</a></li>
                            </ul>
                            <a href="/login" className="btn-book btn btn-secondary btn-sm menu-absolute">Log In</a>
                            <a href="#" className="burger ml-auto float-right site-menu-toggle js-menu-toggle d-inline-block d-lg-none light" data-toggle="collapse" data-target="#main-navbar">
                                <span />
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavSection;
