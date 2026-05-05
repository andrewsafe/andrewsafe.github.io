import { lazy, Suspense, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/nav/Nav";
import About from "./components/about/About";
import Experience from "./components/experience/Experience";
import Services from "./components/services/Services";
import Projects from "./components/project/Projects";
import Kaggle from "./components/kaggle/Kaggle";
import LocalAI from "./components/local-ai/LocalAI";
import Testimonials from "./components/testimonials/Testimonials";
import Contact from "./components/contact/Contact";
import Footer from "./components/footer/Footer";
import Resume from "./components/resume/Resume";
import Certifications from "./components/certifications/Certifications";
import CursorGlow from "./components/cursor-glow/CursorGlow";
import BackToTop from "./components/back-to-top/BackToTop";
import NotFound from "./components/not-found/NotFound";
import CommandPalette from "./components/command-palette/CommandPalette";
import EasterEgg from "./components/easter-egg/EasterEgg";
import NoiseOverlay from "./components/noise-overlay/NoiseOverlay";
import useDynamicFavicon from "./hooks/useDynamicFavicon";
import usePerformanceTier from "./hooks/usePerformanceTier";

const MarketButton = lazy(() => import("./components/market-button/MarketButton"));

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
                <Resume />
              </motion.div>
            }
          />
          <Route
            path="/certifications"
            element={
              <motion.div {...pageTransition}>
                <Certifications />
              </motion.div>
            }
          />
          <Route
            path="/market-button"
            element={
              <Suspense fallback={<PageLoader />}>
                <MarketButton />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <motion.div {...pageTransition}>
                <NotFound />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const AppChrome = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname.startsWith("/market-button");

  return (
    <>
      {!isStandalonePage && (
        <>
          <CursorGlow />
          <BackToTop />
          <CommandPalette />
          <EasterEgg />
          <NoiseOverlay />
        </>
      )}
      <AnimatedRoutes />
    </>
  );
};

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
