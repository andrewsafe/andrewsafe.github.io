import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useModalLock from "../../hooks/useModalLock";
import type { BentoCard } from "./servicesData";
import { workTools, personalTools } from "./servicesData";
import TiltCard from "../tilt-card/TiltCard";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import useCountingAnimation from "../../hooks/useCountingAnimation";

/* ── MetricCard ── */
const MetricCard = ({ value, label }: { value: string; label: string }) => {
  const reducedMotion = usePrefersReducedMotion();

  const numericMatch = value.match(/^(\d+)/);
  const numericPart = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const textPart = numericMatch ? value.slice(numericMatch[1].length) : value;

  const { ref, display } = useCountingAnimation<HTMLDivElement>(numericPart, reducedMotion);

  return (
    <div ref={ref} className="bento-metric">
      <span className="bento-metric__value">
        {numericPart > 0 ? display : value}
        {numericPart > 0 && textPart}
      </span>
      <span className="bento-metric__label">{label}</span>
    </div>
  );
};

/* ── TechCard ── */
const TechCardContent = ({
  icons,
  reducedMotion,
}: {
  icons: { icon: React.ComponentType<{ className?: string }>; name: string }[];
  reducedMotion: boolean;
}) => (
  <div className="bento-tech">
    {icons.map(({ icon: Icon, name }) => (
      <motion.div
        key={name}
        className="bento-tech__item"
        whileHover={reducedMotion ? undefined : { scale: 1.15, y: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Icon className="bento-tech__icon" />
        <span className="bento-tech__name">{name}</span>
      </motion.div>
    ))}
  </div>
);

/* ── ShowcaseCard ── */
const ShowcaseCardContent = ({ title, description }: { title: string; description: string }) => (
  <div className="bento-showcase">
    <h4 className="bento-showcase__title">{title}</h4>
    <p className="bento-showcase__desc">{description}</p>
  </div>
);

/* ── DevTools Modal ── */
const DevToolsModal = ({ onClose }: { onClose: () => void }) => {
  useModalLock(onClose);

  return (
    <motion.div
      className="dt-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="dt-modal"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="dt-modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <p className="dt-modal__eyebrow">Development Environment</p>
        <h2 className="dt-modal__headline">
          Two worlds.
          <br />
          One engineer.
        </h2>
        <p className="dt-modal__subtext">
          My toolkit shifts depending on context: enterprise-grade and battle-tested at work,
          cutting-edge AI-native at home.
        </p>

        <div className="dt-modal__split">
          <div className="dt-modal__env dt-modal__env--work">
            <span className="dt-modal__env-label">Professional</span>
            <h3 className="dt-modal__env-headline">Built for scale.</h3>
            <p className="dt-modal__env-copy">
              At work I live in <strong>VS Code</strong> and <strong>IntelliJ IDEA</strong>, the
              industry standard IDEs for full-stack development across React/TypeScript and
              Java/Spring Boot. <strong>GitHub Copilot</strong> runs as an inline assistant,
              auto-completing boilerplate, generating test stubs, and surfacing docs without
              breaking flow.
            </p>
            <div className="dt-modal__tools">
              {workTools.map(({ icon: Icon, name }) => (
                <div key={name} className="dt-modal__tool">
                  <Icon className="dt-modal__tool-icon" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dt-modal__divider" />

          <div className="dt-modal__env dt-modal__env--personal">
            <span className="dt-modal__env-label">Personal &amp; School</span>
            <h3 className="dt-modal__env-headline">Built for the frontier.</h3>
            <p className="dt-modal__env-copy">
              At home and in grad school, I run top-of-the-line AI-native environments:
              <strong> Antigravity</strong>, <strong>Claude Code</strong>, and{" "}
              <strong>Codex</strong>. These tools reason over entire codebases, execute multi-step
              plans, and pull the latest data from the web in real time, no context switching, no
              copy-paste, just intent-driven development.
            </p>
            <div className="dt-modal__tools">
              {personalTools.map(({ icon: Icon, name }) => (
                <div key={name} className="dt-modal__tool">
                  <Icon className="dt-modal__tool-icon" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── DevToolsCard ── */
const DevToolsCardContent = () => {
  const [showModal, setShowModal] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <>
      <div className="bento-dev-tools">
        <div className="bento-dev-tools__header">
          <p className="bento-dev-tools__eyebrow">Development Environment</p>
          <h4 className="bento-dev-tools__title">Tools of the Trade</h4>
        </div>

        <div className="bento-dev-tools__split">
          <div className="bento-dev-tools__group">
            <span className="bento-dev-tools__group-label">Professional</span>
            <div className="bento-dev-tools__icons">
              {workTools.map(({ icon: Icon, name }) => (
                <motion.div
                  key={name}
                  className="bento-dev-tools__icon-item"
                  whileHover={reducedMotion ? undefined : { scale: 1.15, y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Icon className="bento-dev-tools__icon" />
                  <span>{name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bento-dev-tools__sep" />

          <div className="bento-dev-tools__group">
            <span className="bento-dev-tools__group-label">Personal &amp; School</span>
            <div className="bento-dev-tools__icons">
              {personalTools.map(({ icon: Icon, name }) => (
                <motion.div
                  key={name}
                  className="bento-dev-tools__icon-item"
                  whileHover={reducedMotion ? undefined : { scale: 1.15, y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Icon className="bento-dev-tools__icon" />
                  <span>{name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <button className="bento-dev-tools__cta" onClick={() => setShowModal(true)}>
          Learn More <span className="bento-dev-tools__cta-arrow">→</span>
        </button>
      </div>

      <AnimatePresence>
        {showModal && <DevToolsModal key="dt-modal" onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
};

/* ── BentoGrid ── */
interface BentoGridProps {
  cards: BentoCard[];
  highlightedId: string | null;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" as const },
  }),
};

const BentoGrid = ({ cards, highlightedId }: BentoGridProps) => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="bento-grid">
      {cards.map((card, i) => {
        const isHighlighted = highlightedId === card.id;

        const inner = (() => {
          switch (card.type) {
            case "metric":
              return <MetricCard value={card.value} label={card.label} />;
            case "tech":
              return <TechCardContent icons={card.icons} reducedMotion={reducedMotion} />;
            case "showcase":
              return <ShowcaseCardContent title={card.title} description={card.description} />;
            case "dev-tools":
              return <DevToolsCardContent />;
          }
        })();

        const content = (
          <motion.div
            className={`bento-card bento-card--${card.size} bento-card--${card.type} ${
              isHighlighted ? "bento-card--highlight" : ""
            }`}
            custom={i}
            initial={reducedMotion ? false : "hidden"}
            animate="visible"
            variants={reducedMotion ? undefined : cardVariants}
            data-card-id={card.id}
          >
            {inner}
          </motion.div>
        );

        if (card.type === "dev-tools")
          return (
            <div key={card.id} className="bento-card--full">
              {content}
            </div>
          );
        return card.type === "showcase" ? (
          <TiltCard key={card.id}>{content}</TiltCard>
        ) : (
          <div key={card.id}>{content}</div>
        );
      })}
    </div>
  );
};

export default BentoGrid;
