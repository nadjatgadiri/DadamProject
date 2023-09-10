import React, { Component } from "react";
import Footer from "./footer";
import Header from "./header";
import "../assets/css/style.css";
import About from "./about";
import Services from "./services";
import Contact from "./contact";
// import Contact from "./contact";

export default class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        <About />
        <Services />
        <Contact />
        <Footer />
      </div>
    );
  }
}
