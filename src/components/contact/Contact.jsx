import React, { useRef } from "react";
import emailjs from "emailjs-com";
import "./contact.css";
import { FaFileAlt, FaLinkedin } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_xdthdyk",
        "template_xi8zwe7",
        form.current,
        "cTGWawCLI7aVlwsN2"
      )
      .then(
        (result) => {
          console.log(result.text);
          toast.success("Message sent successfully!");
        },
        (error) => {
          console.log(error.text);
          toast.error("Failed to send the message. Please try again.");
        }
      );
    e.target.reset();
  };

  return (
    <section id="contact">
      <Toaster />
      <h5>Get in Touch</h5>
      <h2>Contact Me</h2>
      <div className="container contact_container">
        <div className="contact_options">
          <article className="contact_option">
            <a
              href="https://andrewsafe.github.io/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFileAlt className="contact_option-icon" />
              <h4>Check out my resume!</h4>
            </a>
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
        <form ref={form} onSubmit={sendEmail}>
          <textarea
            name="message"
            rows="9"
            placeholder="Please include your full name, contact, and message here!"
            required
          ></textarea>
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
