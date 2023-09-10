import React, { Component } from "react";

import "../assets/css/style.css";

export default class Header extends Component {
  render() {
    return (
      <div>
        {/* ======= Header ======= */}
        <header id="header" className="fixed-top">
          <div className="container d-flex align-items-center justify-content-lg-between">
            <div className="logo-container me-auto me-lg-0">
              <a href="index.html">
                <img
                  src="../assets/img/logo_dadam.png"
                  alt="Logo de l'école"
                  class="logo bounce"
                />
              </a>
            </div>

            {/* Uncomment below if you prefer to use an image logo */}
            {/* <a href="index.html" class="logo me-auto me-lg-0"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>*/}
            <nav id="navbar" className="navbar order-last order-lg-0">
              <ul>
                <li>
                  <a className="nav-link scrollto active" href="#hero">
                    Accueil
                  </a>
                </li>
                <li>
                  <a className="nav-link scrollto" href="#about">
                    A propos
                  </a>
                </li>
                <li>
                  <a className="nav-link scrollto" href="#services">
                    Services
                  </a>
                </li>
                <li>
                  <a className="nav-link scrollto " href="#portfolio">
                    Activités
                  </a>
                </li>
                {/* <li>
                  <a className="nav-link scrollto" href="#team">
                    Team
                  </a>
                </li>
                <li className="dropdown">
                  <a href="#">
                    <span>Drop Down</span> <i className="bi bi-chevron-down" />
                  </a>
                  <ul>
                    <li>
                      <a href="#">Drop Down 1</a>
                    </li>
                    <li className="dropdown">
                      <a href="#">
                        <span>Deep Drop Down</span>{" "}
                        <i className="bi bi-chevron-right" />
                      </a>
                      <ul>
                        <li>
                          <a href="#">Deep Drop Down 1</a>
                        </li>
                        <li>
                          <a href="#">Deep Drop Down 2</a>
                        </li>
                        <li>
                          <a href="#">Deep Drop Down 3</a>
                        </li>
                        <li>
                          <a href="#">Deep Drop Down 4</a>
                        </li>
                        <li>
                          <a href="#">Deep Drop Down 5</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Drop Down 2</a>
                    </li>
                    <li>
                      <a href="#">Drop Down 3</a>
                    </li>
                    <li>
                      <a href="#">Drop Down 4</a>
                    </li>
                  </ul>
                </li> */}
                <li>
                  <a className="nav-link scrollto" href="#contact">
                    Contact
                  </a>
                </li>
              </ul>
              <i className="bi bi-list mobile-nav-toggle" />
            </nav>
            {/* .navbar */}
            <a href="#about" className="get-started-btn scrollto">
              Se Connecter
            </a>
          </div>
        </header>
        {/* End Header */}

        {/* ======= Hero Section ======= */}
        <section
          id="hero"
          className="d-flex align-items-center justify-content-center"
        >
          <div className="container" data-aos="fade-up">
            <div
              className="row justify-content-center"
              data-aos="fade-up"
              data-aos-delay={150}
            >
              <div className="col-xl-8 col-lg-8">
                <span>
                  <h1>Ets d'enseignement et de formation</h1>
                </span>
                <h2>
                  formations scolaires et linguistiques & ateliers créatifs
                </h2>
              </div>
            </div>
            <div
              className="row gy-4 mt-5 justify-content-center"
              data-aos="zoom-in"
              data-aos-delay={250}
            >
              <div className="col-xl-3 col-md-4">
                <div className="icon-box">
                  <i className="ri-search-line" />

                  <h3>
                    <a href>Découverte</a>
                  </h3>
                </div>
              </div>
              <div className="col-xl-3 col-md-4">
                <div className="icon-box">
                  <i className="ri-hand-heart-line" />

                  <h3>
                    <a href>Accompagnement</a>
                  </h3>
                </div>
              </div>
              <div className="col-xl-3 col-md-4">
                <div className="icon-box">
                  <i className="ri-line-chart-line" />

                  <h3>
                    <a href>Développement des acquisitions</a>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End Hero */}
      </div>
    );
  }
}
