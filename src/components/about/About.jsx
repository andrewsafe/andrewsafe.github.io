import React from "react";
import "./about.css";
import Me from "../../assets/me.png";
import { FaAward, FaCertificate, FaFolder } from "react-icons/fa";

const About = () => {
  return (
    <section id="about">
      <h5>Hey I'm</h5>
      <h2>Andrew Saifnoorian</h2>
      <div className="container about_container">
        <div className="about_me">
          <div className="about_me-image">
            <img src={Me} alt="About me" />
          </div>
        </div>
        <div className="about_content">
          <div className="about_cards">
            <article className="about_card">
              <FaAward className="about_icon" />
              <h5>Experience</h5>
              <small>2+ Years Working</small>
            </article>
            <article className="about_card">
              <FaCertificate className="about_icon" />
              <h5>Certificates</h5>
              <small>3</small>
            </article>
            <article className="about_card">
              <FaFolder className="about_icon" />
              <h5>Projects</h5>
              <small>10+ projects completed</small>
            </article>
          </div>
          <p>
            Full-stack software engineer focused on building secure, scalable
            applications using React + TypeScript, Java/Spring Boot, and AWS
            (Aurora/Postgres). Strong interest in neural networks and machine
            learning, currently preparing for the AWS Solutions Architect -
            Associate certification and completing Anthropic’s Claude training
            courses on applied AI and model capability.
          </p>
          <a href="#project" className="btn btn-primary">
            {" "}
            See my projects
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
