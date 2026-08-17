import { Link } from "react-router-dom";
import "./resume.css";
import { FaEnvelope } from "react-icons/fa";

const RESUME_EMAIL = "andrewsafe@gmail.com";

const Resume = () => {
  return (
    <section className="resume_page">
      <div className="resume_header">
        <h1>Resume</h1>
        <p className="text-light">
          Andrew Saifnoorian &middot; Software Engineer II, JPMorganChase
        </p>
        <p className="resume_note text-light">
          My resume isn't posted publicly, but I'm happy to send a copy. Email me and I'll get it
          right over.
        </p>
        <div className="resume_actions">
          <a href={`mailto:${RESUME_EMAIL}?subject=Resume request`} className="btn btn-primary">
            <FaEnvelope /> Email me for my resume
          </a>
          <Link to="/" className="btn">
            Back to portfolio
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Resume;
