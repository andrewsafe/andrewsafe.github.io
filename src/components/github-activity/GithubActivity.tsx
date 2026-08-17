import "./github-activity.css";
import AnimatedSection from "../animated-section/AnimatedSection";
import ScrambleText from "../scramble-text/ScrambleText";
import { FaGithub } from "react-icons/fa";

const GITHUB_USERNAME = "andrewsaifnoorian";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

const GRAPH_SRC =
  `https://github-readme-activity-graph.vercel.app/graph?username=${GITHUB_USERNAME}` +
  "&theme=react-dark&hide_border=true&bg_color=00000000&color=8b93a7" +
  "&line=4facfe&point=4facfe&area=true&area_color=2563eb&title_color=f5f5f7";

const GithubActivity = () => (
  <section id="github-activity">
    <h5>Live from GitHub</h5>
    <ScrambleText text="Activity" />
    <AnimatedSection>
      <div className="container gh-activity_container">
        <p className="gh-activity_intro">
          Commit activity across every public repo, pulled live from GitHub.
        </p>
        <div className="gh-activity_card">
          <img
            className="gh-activity_graph"
            src={GRAPH_SRC}
            alt="Andrew Saifnoorian's GitHub contribution activity graph"
            loading="lazy"
          />
        </div>
        <div className="gh-activity_ctas">
          <a href={GITHUB_PROFILE_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
            <FaGithub /> View GitHub Profile
          </a>
        </div>
      </div>
    </AnimatedSection>
  </section>
);

export default GithubActivity;
