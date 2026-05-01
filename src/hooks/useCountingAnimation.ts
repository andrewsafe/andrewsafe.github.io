import { useRef, useState, useEffect } from "react";
import { useMotionValue, useInView, animate } from "framer-motion";

const useCountingAnimation = (
  target: number,
  skip = false,
): { ref: React.RefObject<HTMLElement | null>; display: string } => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(skip ? target.toString() : "0");

  useEffect(() => {
    if (!inView || skip || target === 0) return;
    const controls = animate(count, target, {
      duration: 2,
      ease: "easeOut",
    });
    const unsubscribe = count.on("change", (v) => {
      setDisplay(Math.round(v).toString());
    });
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [inView, target, skip]); // `count` is a stable MotionValue ref, excluded intentionally

  return { ref, display };
};

export default useCountingAnimation;
