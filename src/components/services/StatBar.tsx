import { motion } from "framer-motion";
import { stats } from "./servicesData";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import useCountingAnimation from "../../hooks/useCountingAnimation";

const StatItem = ({
  target,
  suffix,
  label,
  index,
}: {
  target: number;
  suffix: string;
  label: string;
  index: number;
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const { ref, display } = useCountingAnimation<HTMLDivElement>(target, reducedMotion);

  return (
    <motion.div
      ref={ref}
      className="stat-bar__item"
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <span className="stat-bar__value">
        {display}
        {suffix}
      </span>
      <span className="stat-bar__label">{label}</span>
    </motion.div>
  );
};

const StatBar = () => (
  <div className="stat-bar">
    {stats.map((stat, i) => (
      <StatItem
        key={stat.label}
        target={stat.target}
        suffix={stat.suffix}
        label={stat.label}
        index={i}
      />
    ))}
  </div>
);

export default StatBar;
