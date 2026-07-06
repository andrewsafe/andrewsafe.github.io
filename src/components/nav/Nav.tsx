import { useState, useCallback } from "react";
import "./nav.css";
import {
  FaHome,
  FaBook,
  FaProjectDiagram,
  FaRobot,
  FaWrench,
  FaBrain,
  FaGraduationCap,
} from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import { SiKaggle } from "react-icons/si";
import MagneticButton from "../magnetic-button/MagneticButton";
import useWindowScroll from "../../hooks/useWindowScroll";

const sectionIds = [
  "about",
  "doctorate",
  "local-ai",
  "kaggle",
  "project",
  "experience",
  "services",
  "ai-ml-ops",
  "contact",
];

const Nav = () => {
  const [activeSection, setActiveSection] = useState("about");
  const [visible, setVisible] = useState(false);

  useWindowScroll(
    useCallback(() => {
      setVisible(window.scrollY > 300);

      const scrollY = window.scrollY + window.innerHeight / 3;

      if (window.scrollY < 100) {
        setActiveSection("about");
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
    }, []),
  );

  return (
    <nav className={visible ? "nav--visible" : ""}>
      <MagneticButton>
        <a href="#about" className={activeSection === "about" ? "active" : ""} aria-label="About">
          <FaHome />
        </a>
      </MagneticButton>
      <MagneticButton>
        <a
          href="#doctorate"
          className={activeSection === "doctorate" ? "active" : ""}
          aria-label="Doctorate"
        >
          <FaGraduationCap />
        </a>
      </MagneticButton>
      <MagneticButton>
        <a
          href="#local-ai"
          className={activeSection === "local-ai" ? "active" : ""}
          aria-label="Local AI"
        >
          <FaRobot />
        </a>
      </MagneticButton>
      <MagneticButton>
        <a
          href="#kaggle"
          className={activeSection === "kaggle" ? "active" : ""}
          aria-label="Kaggle"
        >
          <SiKaggle />
        </a>
      </MagneticButton>
      <MagneticButton>
        <a
          href="#project"
          className={activeSection === "project" ? "active" : ""}
          aria-label="Projects"
        >
          <FaProjectDiagram />
        </a>
      </MagneticButton>
      <MagneticButton>
        <a
          href="#experience"
          className={activeSection === "experience" ? "active" : ""}
          aria-label="Experience"
        >
          <FaBook />
        </a>
      </MagneticButton>
      <MagneticButton>
        <a
          href="#services"
          className={activeSection === "services" ? "active" : ""}
          aria-label="Services"
        >
          <FaWrench />
        </a>
      </MagneticButton>
      <MagneticButton>
        <a
          href="#ai-ml-ops"
          className={activeSection === "ai-ml-ops" ? "active" : ""}
          aria-label="AI/ML Ops"
        >
          <FaBrain />
        </a>
      </MagneticButton>
      <MagneticButton>
        <a
          href="#contact"
          className={activeSection === "contact" ? "active" : ""}
          aria-label="Contact"
        >
          <MdContactMail />
        </a>
      </MagneticButton>
    </nav>
  );
};

export default Nav;
