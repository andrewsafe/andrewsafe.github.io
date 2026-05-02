import { Link } from "react-router-dom";
import "./contact.css";
import { FaFileAlt, FaLinkedin } from "react-icons/fa";
import AnimatedSection from "../animated-section/AnimatedSection";
import ScrambleText from "../scramble-text/ScrambleText";

const Contact = () => {
  return (
    <section id="contact">
      <h5>Get in Touch</h5>
      <ScrambleText text="Contact Me" />
      <AnimatedSection>
        <div className="container contact_container">
          <div className="contact_options">
            <article className="contact_option">
              <Link to="/resume">
                <FaFileAlt className="contact_option-icon" />
                <h4>Check out my resume!</h4>
              </Link>
            </article>
            <article className="contact_option">
              <a
                href="https://www.linkedin.com/in/andrewsaifnoorian/"
                target="_blank"
                rel="noreferrer"
                className="contact_option-link"
              >
                <FaLinkedin className="contact_option-icon" />
                <h4>Send a message to my LinkedIn!</h4>
              </a>
            </article>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default Contact;
