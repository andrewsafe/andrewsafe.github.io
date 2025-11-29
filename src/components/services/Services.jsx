import React from "react";
import "./services.css";
import { FaCheckSquare } from "react-icons/fa";

const Services = () => {
  return (
    <section id="services">
      <h5>What I Offer</h5>
      <h2>Services</h2>

      <div className="container services_container">
        {/* --- SERVICE 1 --- */}
        <article className="services">
          <div className="service_head">
            <h3>
              Workflow Automation, Batch Processing & Platform Modernization
            </h3>
          </div>
          <ul className="service_list">
            <li>
              <FaCheckSquare className="service_list-icon" />
              <p>
<<<<<<< HEAD
                Refactoring PDF batch processing algorithms to enhance
                scalability and efficiency across diverse file structures and
                organizational hierarchies with Java Springboot and SQL 20.
=======
                Refactoring and modernizing Java/Spring Boot batch-processing
                systems, boosting throughput up to 4x and cutting runtimes from
                20 minutes to under 5.
>>>>>>> fix2
              </p>
            </li>
            <li>
              <FaCheckSquare className="service_list-icon" />
              <p>
                Leading release management, orchestrating RFC cycles, cutovers,
                rollback plans, and stakeholder approvals for production
                deployments.
              </p>
            </li>
            <li>
              <FaCheckSquare className="service_list-icon" />
              <p>
                Building Selenium/Cucumber automation that reduced regression
                workload by 2–3 days per cycle and surfaced 17+ critical issues
                pre-production.
              </p>
            </li>
          </ul>
        </article>

        {/* --- SERVICE 2 --- */}
        <article className="services">
          <div className="service_head">
            <h3>Full-Stack Development for Secure & Scalable Applications</h3>
          </div>
          <ul className="service_list">
            <li>
              <FaCheckSquare className="service_list-icon" />
              <p>
                Developing full-stack applications with React + TypeScript,
                Java/Spring Boot, and AWS (Aurora/Postgres), with a strong focus
                on security and performance.
              </p>
            </li>
            <li>
              <FaCheckSquare className="service_list-icon" />
              <p>
                Migration and modernization of legacy Angular apps (v8/v10 →
                v19), removing technical debt, improving first-paint speed by
                35%, and integrating MSAL SSO with OAuth 2.0 + PKCE.
              </p>
            </li>
            <li>
              <FaCheckSquare className="service_list-icon" />
              <p>
                Designing RESTful APIs, scalable database schemas, and seamless
                authentication flows to support enterprise-level workflows and
                payment-secure systems.
              </p>
            </li>
          </ul>
        </article>

        {/* --- SERVICE 3 --- */}
        <article className="services">
          <div className="service_head">
            <h3>
              DevOps, CI/CD Automation & Application Performance Optimization
            </h3>
          </div>
          <ul className="service_list">
            <li>
              <FaCheckSquare className="service_list-icon" />
              <p>
                Implementing GitLab CI/CD pipelines with SonarQube, Docker, and
                AWS integrations to automate deployments, testing, and quality
                gates.
              </p>
            </li>
            <li>
              <FaCheckSquare className="service_list-icon" />
              <p>
                Improving application stability through rigorous debugging, log
                analysis, code reviews, and real-time error monitoring.
              </p>
            </li>
            <li>
              <FaCheckSquare className="service_list-icon" />
              <p>
                Optimizing frontend and backend performance, enhancing user
                experience, reducing latency, and strengthening system
                reliability.
              </p>
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
};

export default Services;
