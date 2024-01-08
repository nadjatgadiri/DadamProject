import React, { useState } from 'react';
import "./css/animate.min.css"
import "./css/owl.carousel.min.css"
import "./css/owl.theme.default.min.css"
import "./css/jquery.fancybox.min.css"
import "./css/style.css"
import CategoriesSection from './Categories';
import ServicesSection from './Service';
import ProgramSection from './LatestProgram';
import FooterSection from './footer'
import NavSection from './nav'

// Wrap all components together in a parent component
function home() {

    return (

        <>

            {/* Hello world */}
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
                style={{ backgroundImage: 'url("./assets/img/about.jpg")' }}
            >
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-12">
                            <div className="row justify-content-center ">
                                <div className="col-lg-6 text-center ">
                                    <h1 className="mb-4 heading text-white" data-aos="fade-up" data-aos-delay={100}>Ets d'enseignement et de formation</h1>
                                    <p className="caption mb-4 d-inline-block" data-aos="fade-up" data-aos-delay={100}>formations scolaires et linguistiques & ateliers créatifs</p>
                                    <p className="mb-0" data-aos="fade-up" data-aos-delay={300}><a href="home/categories/0" className="btn btn-secondary">Explorer Les Cours</a></p>
                                </div>
                            </div>
                        </div>
                    </div> {/* /.row */}
                </div> {/* /.container */}
            </div> {/* /.untree_co-hero */}
            <CategoriesSection />
            <ServicesSection />
            <ProgramSection />
            <FooterSection />
        </>
    );
}
;
export default home;
