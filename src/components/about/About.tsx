import { useRef } from "react";
import { Link } from "react-router-dom";
import "./about.css";
import Me from "../../assets/me.webp";
import { FaAward, FaCertificate, FaFolder, FaBrain, FaGraduationCap } from "react-icons/fa";
import AnimatedSection from "../animated-section/AnimatedSection";
import MagneticButton from "../magnetic-button/MagneticButton";
import BlurImage from "../blur-image/BlurImage";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import useIsMobile from "../../hooks/useIsMobile";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import { useIsLowPerformance } from "../../hooks/usePerformanceTier";
import useTypewriter from "../../hooks/useTypewriter";
import useCountingAnimation from "../../hooks/useCountingAnimation";

interface CountingStatProps {
  target: number;
  suffix: string;
  label: string;
}

const CountingStat = ({ target, suffix, label }: CountingStatProps) => {
  const lowPerf = useIsLowPerformance();
  const { ref, display } = useCountingAnimation(target, lowPerf);

  return (
    <small ref={ref}>
      {display}
      {suffix} {label}
    </small>
  );
};

interface WordProps {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}

const Word = ({ children, range, progress }: WordProps) => {
  const opacity = useTransform(progress, range, [0.65, 1]);
  return (
    <motion.span className="word-reveal_word" style={{ opacity }}>
      {children}{" "}
    </motion.span>
  );
};

const WordReveal = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const isMobile = useIsMobile(1024);
  const lowPerf = useIsLowPerformance();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.95", "start 0.65"],
  });

  const words = text.split(" ");

  if (isMobile || lowPerf) {
    return <p>{text}</p>;
  }

  return (
    <p ref={containerRef} className="word-reveal">
      {words.map((word, i) => {
        const start = (i / words.length) * 0.75;
        const end = ((i + 1) / words.length) * 0.75;
        return (
          <Word key={i} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const About = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const lowPerf = useIsLowPerformance();
  const { displayed, done } = useTypewriter("Andrew Saifnoorian", 90, prefersReducedMotion);
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(600);

  const { scrollYProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  const heroContent = (
    <>
      <h5 className="hero_greeting">Hey I'm</h5>
      <h1 className="hero_name">
        <span className={done ? "hero_name--gradient" : ""}>{displayed}</span>
        <span className={`hero_caret ${done ? "blink" : ""}`}>|</span>
      </h1>
      <p className="hero_subtitle text-light">
        Full-Stack Software Engineer | Enterprise Apps & AI
      </p>
    </>
  );

  return (
    <section id="about">
      <div className="hero_wrapper" ref={heroWrapperRef}>
        {lowPerf ? (
          <div className="hero">{heroContent}</div>
        ) : (
          <motion.div
            className="hero"
            style={
              isMobile
                ? { opacity: heroOpacity }
                : { opacity: heroOpacity, scale: heroScale }
            }
          >
            {heroContent}
          </motion.div>
        )}
      </div>

      <AnimatedSection>
        <div className="container about_container">
          <div className="about_me">
            <div className="about_me-image">
              <BlurImage src={Me} alt="About me" />
            </div>
          </div>
          <div className="about_content">
            <div className="about_cards">
              <a
                className="about_card about_card--link"
                href="https://www.linkedin.com/in/andrewsaifnoorian/#experience"
                target="_blank"
                rel="noreferrer"
                aria-label="View experience on LinkedIn"
              >
                <FaAward className="about_icon" />
                <h5>Experience</h5>
                <CountingStat target={3} suffix="+" label="Years Working" />
              </a>
              <Link
                className="about_card about_card--link"
                to="/certifications"
                aria-label="View certifications"
              >
                <FaCertificate className="about_icon" />
                <h5>Certificates</h5>
                <CountingStat target={4} suffix="" label="" />
              </Link>
              <a
                className="about_card about_card--link"
                href="#project"
                aria-label="See my projects"
              >
                <FaFolder className="about_icon" />
                <h5>Projects</h5>
                <CountingStat target={10} suffix="+" label="projects completed" />
              </a>
              <a
                className="about_card about_card--link"
                href="#ai-ml-ops"
                aria-label="See my AI/ML Ops work"
              >
                <FaBrain className="about_icon" />
                <h5>AI/ML Ops</h5>
                <small>Enterprise adoption</small>
              </a>
              <a
                className="about_card about_card--link"
                href="#doctorate"
                aria-label="See my doctoral research"
              >
                <FaGraduationCap className="about_icon" />
                <h5>Doctorate</h5>
                <small>Johns Hopkins</small>
              </a>
            </div>
            <WordReveal text="Software engineer at JPMorganChase building enterprise AI systems and full-stack platforms. Deep learning research: extended Monodepth2 with per-pixel uncertainty for specular surface depth estimation. Running local 26B MoE inference on RTX 5080 via Docker and Ollama. AWS Solutions Architect Associate candidate." />
            <div className="about_ctas">
              <MagneticButton>
                <a href="#project" className="btn btn-primary">
                  See my projects
                </a>
              </MagneticButton>
              <MagneticButton>
                <a href="#kaggle" className="btn">
                  See my Kaggle
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default About;
