import { Link } from "react-router-dom";
import "./resume.css";
import { FaDownload } from "react-icons/fa";

const RESUME_PDF = "/resume-2026.pdf";

const Resume = () => {
  return (
    <section className="resume_page">
      <div className="resume_header">
        <h1>Resume</h1>
        <p className="text-light">
          Andrew Saifnoorian &middot; Software Engineer II, JPMorganChase
        </p>
        <div className="resume_actions">
          <a
            href={RESUME_PDF}
            download="Andrew-Saifnoorian-Resume-2026.pdf"
            className="btn btn-primary"
          >
            <FaDownload /> Download Resume
          </a>
          <Link to="/" className="btn">
            Back to portfolio
          </Link>
        </div>
      </div>
      <div className="resume_viewer">
        <object data={RESUME_PDF} type="application/pdf" aria-label="Andrew Saifnoorian resume">
          <p>
            Your browser can't preview this PDF. <a href={RESUME_PDF}>Download it here</a> instead.
          </p>
        </object>
      </div>
    </section>
  );
};

export default Resume;
