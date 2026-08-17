import { Link } from "react-router-dom";
import "./resume.css";

const Resume = () => {
  return (
    <section className="resume_page">
      <h1>Oops... Awkward.</h1>
      <p>
        Hey, sorry about that! I'm currently <strong>not</strong> looking for a job, but I
        appreciate the curiosity!
      </p>
      <p>
        For any serious inquiries, feel free to reach me at{" "}
        <a href="mailto:andrewsafe@gmail.com">andrewsafe@gmail.com</a>
      </p>
      <Link to="/" className="btn btn-primary">
        Take me back
      </Link>
    </section>
  );
};

export default Resume;
