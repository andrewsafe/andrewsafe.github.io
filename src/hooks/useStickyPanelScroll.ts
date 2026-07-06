import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const STEP_MS = 500; // ms between sequential panel steps (matches enter animation)

/**
 * Drives the "pin the section, step through panels as you scroll" pattern shared
 * by LocalAI, Kaggle, and Projects: scroll progress across `outerRef` maps to a
 * discrete `activeIndex` that advances one panel at a time, plus a `scrollToPanel`
 * helper for direct (dot-nav) navigation.
 */
const useStickyPanelScroll = (totalPanels: number) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);

  // Refs so the step closure always reads the latest values
  const activeIndexRef = useRef(0);
  const targetIndexRef = useRef(0);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressRef = useRef(false); // ignore scroll events during dot-click smooth scroll

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // stepRef holds the latest version of the step function to avoid stale closures
  const stepRef = useRef<() => void>(() => {});
  stepRef.current = () => {
    stepTimerRef.current = null;
    const current = activeIndexRef.current;
    const target = targetIndexRef.current;
    if (current === target) return;

    // If the section has scrolled out of view, snap immediately and stop
    if (outerRef.current) {
      const rect = outerRef.current.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
        activeIndexRef.current = target;
        setActiveIndex(target);
        return;
      }
    }

    const next = current < target ? current + 1 : current - 1;
    activeIndexRef.current = next;
    setActiveIndex(next);

    if (next !== target) {
      stepTimerRef.current = setTimeout(() => stepRef.current(), STEP_MS);
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (suppressRef.current) return;
    const idx = Math.min(Math.floor(v * totalPanels), totalPanels - 1);
    targetIndexRef.current = idx;
    // Only start a new step sequence if none is running
    if (stepTimerRef.current === null && activeIndexRef.current !== idx) {
      stepRef.current();
    }
  });

  useEffect(() => {
    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, []);

  const scrollToPanel = (i: number) => {
    if (!outerRef.current) return;

    // Cancel any ongoing sequential stepping and jump directly
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    targetIndexRef.current = i;
    activeIndexRef.current = i;
    setActiveIndex(i);

    // Suppress scroll-driven updates while smooth scroll is in flight
    suppressRef.current = true;
    const rect = outerRef.current.getBoundingClientRect();
    const totalHeight = outerRef.current.offsetHeight - window.innerHeight;
    const targetScroll =
      window.scrollY + rect.top + (i / totalPanels) * totalHeight + totalHeight / totalPanels / 2;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
    setTimeout(() => {
      suppressRef.current = false;
    }, 800);
  };

  return { activeIndex, outerRef, scrollToPanel };
};

export default useStickyPanelScroll;
