import type { ComponentType } from "react";
import "./experience.css";
import { motion } from "framer-motion";
import AnimatedSection from "../animated-section/AnimatedSection";
import ScrambleText from "../scramble-text/ScrambleText";
import { useIsLowPerformance } from "../../hooks/usePerformanceTier";
import {
  SiAnthropic,
  SiOpenai,
  SiGooglegemini,
  SiGooglecloud,
  SiDatabricks,
  SiGithub,
  SiReact,
  SiAngular,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiNodedotjs,
  SiPostgresql,
  SiApachemaven,
  SiDocker,
  SiFastapi,
} from "react-icons/si";
import { FaMicrosoft, FaJava, FaDatabase, FaCog, FaAmazon } from "react-icons/fa";

type Level = "Expert" | "Experienced" | "Proficient";

const LEVEL_DOTS: Record<Level, number> = {
  Proficient: 3,
  Experienced: 4,
  Expert: 5,
};

type Skill = { Icon: ComponentType<{ className?: string }>; name: string; level: Level };

const aiCloudSkills: Skill[] = [
  { Icon: SiAnthropic, name: "Claude", level: "Expert" },
  { Icon: SiOpenai, name: "ChatGPT", level: "Expert" },
  { Icon: SiGithub, name: "GitHub Copilot", level: "Expert" },
  { Icon: SiGooglegemini, name: "Gemini", level: "Experienced" },
  { Icon: FaAmazon, name: "AWS", level: "Expert" },
  { Icon: FaMicrosoft, name: "Azure", level: "Experienced" },
  { Icon: SiGooglecloud, name: "GCP", level: "Experienced" },
  { Icon: FaDatabase, name: "Oracle", level: "Experienced" },
  { Icon: SiDatabricks, name: "Databricks", level: "Experienced" },
];

const frontendSkills: Skill[] = [
  { Icon: SiReact, name: "React", level: "Expert" },
  { Icon: SiTypescript, name: "TypeScript", level: "Expert" },
  { Icon: SiAngular, name: "Angular", level: "Expert" },
  { Icon: FaCog, name: "ServiceNow", level: "Expert" },
  { Icon: SiHtml5, name: "HTML", level: "Expert" },
  { Icon: SiCss, name: "CSS", level: "Expert" },
  { Icon: SiJavascript, name: "JavaScript", level: "Expert" },
];

const backendSkills: Skill[] = [
  { Icon: FaJava, name: "Java", level: "Expert" },
  { Icon: SiApachemaven, name: "Maven", level: "Expert" },
  { Icon: SiPython, name: "Python", level: "Experienced" },
  { Icon: SiFastapi, name: "FastAPI", level: "Experienced" },
  { Icon: SiNodedotjs, name: "Node.js", level: "Experienced" },
  { Icon: SiDocker, name: "Docker", level: "Experienced" },
  { Icon: FaDatabase, name: "SQL", level: "Expert" },
  { Icon: SiPostgresql, name: "PostgreSQL", level: "Expert" },
];

const LevelDots = ({ level }: { level: Level }) => {
  const filled = LEVEL_DOTS[level];
  return (
    <div className="experience_level" aria-label={level}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`experience_level-dot${i < filled ? " experience_level-dot--filled" : ""}`}
        />
      ))}
    </div>
  );
};

const IconSkillCard = ({ Icon, name, level, index }: Skill & { index: number }) => {
  const lowPerf = useIsLowPerformance();
  const Tag = lowPerf ? "article" : motion.article;
  const motionProps = lowPerf
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.35, delay: index * 0.06 },
      };

  return (
    <Tag className="experience_details" {...motionProps}>
      <div className="experience_details-icon-wrap">
        <Icon className="experience_details-svg-icon" />
      </div>
      <div>
        <h4>{name}</h4>
        <LevelDots level={level} />
      </div>
    </Tag>
  );
};

const Experience = () => {
  return (
    <section id="experience">
      <h5>What I use</h5>
      <ScrambleText text="My Skills" />
      <AnimatedSection>
        <div className="container experience_container">
          <div className="experience_ai-cloud experience_full-width">
            <h3>Artificial Intelligence & Cloud</h3>
            <div className="experience_content">
              {aiCloudSkills.map((skill, i) => (
                <IconSkillCard key={skill.name} {...skill} index={i} />
              ))}
            </div>
          </div>
          <div className="experience_frontend">
            <h3>Frontend Development</h3>
            <div className="experience_content">
              {frontendSkills.map((skill, i) => (
                <IconSkillCard key={skill.name} {...skill} index={i} />
              ))}
            </div>
          </div>
          <div className="experience_backend">
            <h3>Backend Development</h3>
            <div className="experience_content">
              {backendSkills.map((skill, i) => (
                <IconSkillCard key={skill.name} {...skill} index={i} />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default Experience;
