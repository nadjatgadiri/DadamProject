import React, { Component } from "react";

// import "./js/jquery-3.4.1.min.js"
// import "./js/popper.min.js"
// import "./js/owl.carousel.min.js"
// import "./js/jquery.animateNumber.min.js"
// import "./js/jquery.waypoints.min.js"
// import "./js/jquery.fancybox.min.js"
// import "./js/jquery.sticky.js"
// import "./js/aos.js"
// import "./js/custom.js"

function Header() {

    return (
        <div>
            <nav className="site-nav mb-5">
                <div className="pb-2 top-bar mb-3">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-6 col-lg-9">
                                <a href="#" className="small mr-3"><span className="icon-question-circle-o mr-2" /> <span className="d-none d-lg-inline-block">Have a questions?</span></a>
                                <a href="#" className="small mr-3"><span className="icon-phone mr-2" /> <span className="d-none d-lg-inline-block">10 20 123 456</span></a>
                                <a href="#" className="small mr-3"><span className="icon-envelope mr-2" /> <span className="d-none d-lg-inline-block">info@mydomain.com</span></a>
                            </div>
                            <div className="col-6 col-lg-3 text-right">
                                <a href="login.html" className="small mr-3">
                                    <span className="icon-lock" />
                                    Log In
                                </a>
                                <a href="register.html" className="small">
                                    <span className="icon-person" />
                                    Register
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sticky-nav js-sticky-header">
                    <div className="container position-relative">
                        <div className="site-navigation text-center">
                            <a href="index.html" className="logo menu-absolute m-0">Learner<span className="text-primary">.</span></a>
                            <ul className="js-clone-nav d-none d-lg-inline-block site-menu">
                                <li className="active"><a href="index.html">Home</a></li>
                                <li className="has-children">
                                    <a href="#">Dropdown</a>
                                    <ul className="dropdown">
                                        <li><a href="elements.html">Elements</a></li>
                                        <li className="has-children">
                                            <a href="#">Menu Two</a>
                                            <ul className="dropdown">
                                                <li><a href="#">Sub Menu One</a></li>
                                                <li><a href="#">Sub Menu Two</a></li>
                                                <li><a href="#">Sub Menu Three</a></li>
                                            </ul>
                                        </li>
                                        <li><a href="#">Menu Three</a></li>
                                    </ul>
                                </li>
                                <li><a href="staff.html">Our Staff</a></li>
                                <li><a href="news.html">News</a></li>
                                <li><a href="gallery.html">Gallery</a></li>
                                <li><a href="about.html">About</a></li>
                                <li><a href="contact.html">Contact</a></li>
                            </ul>
                            <a href="#" className="btn-book btn btn-secondary btn-sm menu-absolute">Enroll Now</a>
                            <a href="#" className="burger ml-auto float-right site-menu-toggle js-menu-toggle d-inline-block d-lg-none light" data-toggle="collapse" data-target="#main-navbar">
                                <span />
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
export default Header;
