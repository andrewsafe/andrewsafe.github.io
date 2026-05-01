import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaMapMarkerAlt, FaCalendarAlt, FaMedal } from "react-icons/fa";
import "./certifications.css";

interface Cert {
  id: number;
  name: string;
  issuer: string;
  date: string;
  location: string;
  locationDetail: string;
  credentialId: string;
  credentialUrl: string;
  linkedinPostUrl: string;
  description: string;
  skills: string[];
}

const certs: Cert[] = [
  {
    id: 4,
    name: "Model Context Protocol: Advanced Topics",
    issuer: "Anthropic",
    date: "April 23, 2026",
    location: "Jersey City, NJ",
    locationDetail: "Earned while at JPMorgan Chase in Jersey City",
    credentialId: "pending",
    credentialUrl: "#",
    linkedinPostUrl: "https://www.linkedin.com/in/andrewsaifnoorian/",
    description:
      "Completed Anthropic's advanced-level course on the Model Context Protocol, building on foundational MCP knowledge to cover complex server architecture, multi-tool orchestration, authentication and security patterns, production deployment strategies, and building sophisticated Claude-powered agentic workflows with real-world external integrations.",
    skills: [
      "Model Context Protocol (MCP)",
      "Agentic Workflows",
      "MCP Server Architecture",
      "Tool Orchestration",
      "Anthropic Claude",
    ],
  },
  {
    id: 1,
    name: "Introduction to Model Context Protocol",
    issuer: "Anthropic",
    date: "March 17, 2026",
    location: "Jersey City, NJ",
    locationDetail: "Earned while at JPMorgan Chase in Jersey City",
    credentialId: "he5xp2opte3x",
    credentialUrl: "https://verify.skilljar.com/c/he5xp2opte3x",
    linkedinPostUrl: "https://www.linkedin.com/in/andrewsaifnoorian/",
    description:
      "Completed Anthropic's official course on the Model Context Protocol, the open standard enabling AI models to securely connect with external tools, APIs, data sources, and services. Covers MCP architecture, server/client integration patterns, and building Claude-powered agentic workflows.",
    skills: ["Model Context Protocol (MCP)", "GitHub", "MCP Servers", "Anthropic Claude"],
  },
  {
    id: 2,
    name: "AI Fluency: Framework & Foundations",
    issuer: "Anthropic",
    date: "December 2025",
    location: "Buffalo, NY",
    locationDetail: "Earned while at M&T Bank in Buffalo",
    credentialId: "azmxudqvpxv3",
    credentialUrl: "https://verify.skilljar.com/c/azmxudqvpxv3",
    linkedinPostUrl: "https://www.linkedin.com/in/andrewsaifnoorian/",
    description:
      "Foundational Anthropic course covering AI capabilities, mental models for working with large language models, and responsible deployment frameworks. Addresses prompt engineering, model behavior, practical AI integration patterns, and building AI fluency for professional workflows.",
    skills: [
      "Artificial Intelligence",
      "Large Language Models",
      "Prompt Engineering",
      "Responsible AI",
    ],
  },
  {
    id: 3,
    name: "Certified Application Developer",
    issuer: "ServiceNow",
    date: "September 6, 2025",
    location: "Buffalo, NY",
    locationDetail: "Earned while at M&T Bank in Buffalo",
    credentialId: "27423584",
    credentialUrl: "#",
    linkedinPostUrl: "https://www.linkedin.com/in/andrewsaifnoorian/",
    description:
      "Validated expertise in designing and building custom applications on the ServiceNow platform. Covers application scoping, data modeling, UI/UX development with Service Portal and UI Builder, business rules, client scripts, and platform security best practices.",
    skills: ["ServiceNow", "Application Development", "Service Portal", "Platform Security"],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const CertCard = ({ cert, index }: { cert: Cert; index: number }) => (
  <motion.article
    className="cert-card"
    data-issuer={cert.issuer}
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: EASE, delay: index * 0.12 }}
  >
    <div className="cert-card__accent" />

    <div className="cert-card__header">
      <div className="cert-card__medal">
        <FaMedal className="cert-card__medal-icon" />
      </div>
      <div className="cert-card__meta">
        <p className="cert-card__issuer">{cert.issuer}</p>
        <h2 className="cert-card__name">{cert.name}</h2>
      </div>
    </div>

    <p className="cert-card__desc">{cert.description}</p>

    <div className="cert-card__tags">
      {cert.skills.map((s) => (
        <span key={s}>{s}</span>
      ))}
    </div>

    <div className="cert-card__info-row">
      <span className="cert-card__info-item">
        <FaCalendarAlt className="cert-card__info-icon" />
        {cert.date}
      </span>
      <span className="cert-card__info-item">
        <FaMapMarkerAlt className="cert-card__info-icon" />
        {cert.location}
      </span>
      <span className="cert-card__credential-id">ID: {cert.credentialId}</span>
      <span className="cert-card__location-detail">{cert.locationDetail}</span>
    </div>

    <div className="cert-card__actions">
      {cert.credentialUrl !== "#" ? (
        <a
          href={cert.credentialUrl}
          className="cert-card__btn cert-card__btn--primary"
          target="_blank"
          rel="noreferrer"
        >
          Verify Credential <FaExternalLinkAlt className="cert-card__btn-icon" />
        </a>
      ) : (
        <a
          href={cert.linkedinPostUrl}
          className="cert-card__btn cert-card__btn--primary"
          target="_blank"
          rel="noreferrer"
        >
          View on LinkedIn <FaExternalLinkAlt className="cert-card__btn-icon" />
        </a>
      )}
      <a href={cert.linkedinPostUrl} className="cert-card__btn" target="_blank" rel="noreferrer">
        LinkedIn Profile <FaExternalLinkAlt className="cert-card__btn-icon" />
      </a>
    </div>
  </motion.article>
);

const Certifications = () => (
  <div className="certs-page">
    <motion.div
      className="certs-hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <p className="certs-eyebrow">Licenses &amp; Certifications</p>
      <h1 className="certs-headline">Credentials</h1>
      <p className="certs-subtext">
        Two Anthropic MCP certifications earned at JPMorgan Chase in Jersey City, one Anthropic AI
        Fluency credential and a ServiceNow Certified Application Developer credential earned at M&T
        Bank in Buffalo.
      </p>
      <a href="/" className="certs-back">
        ← Back to portfolio
      </a>
    </motion.div>

    <div className="certs-grid">
      {certs.map((cert, i) => (
        <CertCard key={cert.id} cert={cert} index={i} />
      ))}
    </div>
  </div>
);

export default Certifications;
