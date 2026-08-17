import { lazy, Suspense, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/nav/Nav";
import About from "./components/about/About";
import Experience from "./components/experience/Experience";
import Services from "./components/services/Services";
import Doctorate from "./components/doctorate/Doctorate";
import Projects from "./components/project/Projects";
import Kaggle from "./components/kaggle/Kaggle";
import LocalAI from "./components/local-ai/LocalAI";
import Testimonials from "./components/testimonials/Testimonials";
import Contact from "./components/contact/Contact";
import Footer from "./components/footer/Footer";
import CursorGlow from "./components/cursor-glow/CursorGlow";
import BackToTop from "./components/back-to-top/BackToTop";
import CommandPalette from "./components/command-palette/CommandPalette";
import EasterEgg from "./components/easter-egg/EasterEgg";
import NoiseOverlay from "./components/noise-overlay/NoiseOverlay";
import useDynamicFavicon from "./hooks/useDynamicFavicon";
import usePerformanceTier from "./hooks/usePerformanceTier";

const Resume = lazy(() => import("./components/resume/Resume"));
const Certifications = lazy(() => import("./components/certifications/Certifications"));
const NotFound = lazy(() => import("./components/not-found/NotFound"));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = barRef.current;
        if (!el) return;
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight =
          document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        el.style.width = `${pct}%`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={barRef} className="scroll-progress" />;
};

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const Home = () => (
  <>
    <ScrollProgress />
    <About />
    <Doctorate />
    <LocalAI />
    <Kaggle />
    <Projects />
    <Nav />
    <Experience />
    <Services />
    <Testimonials />
    <Contact />
    <Footer />
  </>
);

const PageLoader = () => <div className="page-loader" aria-label="Loading page" />;

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div {...pageTransition}>
                <Home />
              </motion.div>
            }
          />
          <Route
            path="/resume"
            element={
              <motion.div {...pageTransition}>
                <Suspense fallback={<PageLoader />}>
                  <Resume />
                </Suspense>
              </motion.div>
            }
          />
          <Route
            path="/certifications"
            element={
              <motion.div {...pageTransition}>
                <Suspense fallback={<PageLoader />}>
                  <Certifications />
                </Suspense>
              </motion.div>
            }
          />
          <Route
            path="*"
            element={
              <motion.div {...pageTransition}>
                <Suspense fallback={<PageLoader />}>
                  <NotFound />
                </Suspense>
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const AppChrome = () => (
  <>
    <CursorGlow />
    <BackToTop />
    <CommandPalette />
    <EasterEgg />
    <NoiseOverlay />
    <AnimatedRoutes />
  </>
);

const App = () => {
  useDynamicFavicon();
  const tier = usePerformanceTier();

  useEffect(() => {
    document.body.dataset.perfTier = tier;
  }, [tier]);

  return (
    <BrowserRouter>
      <AppChrome />
    </BrowserRouter>
  );
};

export default App;
