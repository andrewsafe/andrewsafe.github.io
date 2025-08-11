import React from "react";
import "./project.css";
import IMG1 from "../../assets/heroesLLCpic.png";
import IMG2 from "../../assets/cluegame.png";
import IMG3 from "../../assets/poker5hand.png";
import IMG4 from "../../assets/underMSRP.png";
import IMG5 from "../../assets/CarM.png";
import IMG6 from "../../assets/tasksapp.png";

const projects = [
  {
    id: 1,
    image: IMG1,
    title: "Heroes Movement LLC",
    github: "",
    demo: "https://theheromovement.org/",
  },
  {
    id: 2,
    image: IMG2,
    title: "Clue Game",
    github: "https://github.com/andrewsafe/clue-game",
    demo: "https://67565c59e06325000836e7ec--clue-game.netlify.app/",
  },
  {
    id: 3,
    image: IMG3,
    title: "5 Hand Poker",
    github: "https://github.com/andrewsafe/project2_asaifnoorian",
    demo: "",
  },
  {
    id: 4,
    image: IMG4,
    title: "Under MSRP App",
    github: "https://github.com/andrewsafe/BulkEmails",
    demo: "https://undermsrp.netlify.app/",
  },
  {
    id: 5,
    image: IMG5,
    title: "Car Maintenance App",
    github: "https://github.com/SKhan2001/CarTracker",
    demo: "",
  },
  {
    id: 6,
    image: IMG6,
    title: "Tasks Web App",
    github: "https://github.com/andrewsafe/tasks-app",
    demo: "",
  },
];
const Projects = () => {
  return (
    <section id="project">
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>
      <div className="container project_container">
        {projects.map(({ id, image, title, github, demo }) => {
          return (
            <article key={id} className="project_item">
              <div className="project_item-image">
                <img src={image} alt={title} />
              </div>
              <h3>{title}</h3>
              <div className="project-item-cta">
                <a href={github} className="btn">
                  Github
                </a>
                <a
                  href={demo}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
