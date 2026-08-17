import "./writing.css";
import AnimatedSection from "../animated-section/AnimatedSection";
import ScrambleText from "../scramble-text/ScrambleText";
import TiltCard from "../tilt-card/TiltCard";
import { FaFileAlt } from "react-icons/fa";

interface Paper {
  title: string;
  description: string;
  meta: string;
  pages: number;
  href: string;
}

const papers: Paper[] = [
  {
    title: "When and Where You Compute Is What You Emit",
    description:
      "Carbon-aware MLOps capstone: data engineering through a real dataset deprecation, algorithm selection, an honest evaluation of a regression model that missed its target, and Azure ML deployment for a scheduling advisor. Graded 100/100.",
    meta: "M.S. Artificial Intelligence Capstone, Johns Hopkins",
    pages: 15,
    href: "/carbon-aware-mlops-paper.pdf",
  },
  {
    title: "Decoding Visual Imagery from MEG Signals using Multi-Pathway Ensemble Learning",
    description:
      "A 6-decoder weighted ensemble exploiting auditory-to-auditory same-modality transfer to bypass the perception-imagery domain gap in a 306-channel brain-decoding Kaggle competition.",
    meta: "Deep Neural Networks, Johns Hopkins · Kaggle Competition",
    pages: 13,
    href: "/meg-decoding-paper.pdf",
  },
  {
    title: "Evaluating Depth Estimation on Reflective Surfaces",
    description:
      "Extending Monodepth2 with a per-pixel log-variance uncertainty head to down-weight specular pixels and improve monocular depth estimation on mirrors, glass, and chrome.",
    meta: "Deep Learning Research",
    pages: 8,
    href: "/monodepth2-uncertainty-paper.pdf",
  },
  {
    title: "LocalAI Infrastructure Guide",
    description:
      "A complete walkthrough of building a self-hosted local AI inference stack with Ollama, Gemma, Docker, and Open WebUI, from system architecture through GPU passthrough tuning.",
    meta: "Infrastructure Guide",
    pages: 18,
    href: "/localai-guide.pdf",
  },
  {
    title: "NN Classification for Targeted Advertising",
    description:
      "Comparing single- and multi-layer feedforward network architectures for classifying advertising campaign ROI, with threshold optimization for decision-support use.",
    meta: "Neural Networks, Johns Hopkins",
    pages: 10,
    href: "/nn-final-project.pdf",
  },
];

const Writing = () => (
  <section id="writing">
    <h5>Long-form</h5>
    <ScrambleText text="Writing" />
    <AnimatedSection>
      <div className="container writing_container">
        <p className="writing_intro">
          Every project on this site is backed by a full write-up: methodology, results, and
          honest limitations, not just a demo. A few of them, below.
        </p>
        <div className="writing_grid">
          {papers.map((paper) => (
            <TiltCard key={paper.title}>
              <a className="writing_card" href={paper.href} target="_blank" rel="noreferrer">
                <FaFileAlt className="writing_card-icon" />
                <h3 className="writing_card-title">{paper.title}</h3>
                <p className="writing_card-desc">{paper.description}</p>
                <div className="writing_card-footer">
                  <span className="writing_card-meta">{paper.meta}</span>
                  <span className="writing_card-pages">{paper.pages} pages</span>
                </div>
              </a>
            </TiltCard>
          ))}
        </div>
      </div>
    </AnimatedSection>
  </section>
);

export default Writing;
