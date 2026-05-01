import { useEffect, useRef, useState } from "react";
import useModalLock from "../../hooks/useModalLock";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import "./local-ai.css";
import AnimatedSection from "../animated-section/AnimatedSection";
import ScrambleText from "../scramble-text/ScrambleText";
import { useIsLowPerformance } from "../../hooks/usePerformanceTier";
import useIsMobile from "../../hooks/useIsMobile";

interface LAIExpandedContent {
  overview: string;
  approach: string[];
  result: string;
}

interface LAIEntry {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  tags: string[];
  accentHue: number;
  expandedContent: LAIExpandedContent;
}

const entries: LAIEntry[] = [
  {
    id: 1,
    title: "Docker Compose Stack",
    subtitle: "Containerized Infrastructure",
    description:
      "The entire stack runs via a single Docker Compose file, an isolated bridge network (172.30.0.0/24) with static IPs for both services, health checks gating startup order, and a Makefile + bash helper for developer operations.",
    details: [
      "Custom bridge network (172.30.0.0/24): Ollama at 172.30.0.10, Open WebUI at 172.30.0.11",
      "Health checks on both services, Open WebUI waits on Ollama's condition: service_healthy",
      "JSON-file logging: Ollama capped at 20 MB × 5 files; Open WebUI at 10 MB × 3",
      "NVIDIA GPU passthrough ready: deploy.resources block in compose, enabled via OLLAMA_GPU_MODE=all",
      "Makefile targets: up, down, restart, logs, status, pull-model, shell, clean",
      "scripts/manage.sh: pre-flight Docker daemon check, port conflict detection, colored output",
    ],
    tags: ["Docker Compose", "Bridge Network", "Health Checks", "GPU Passthrough", "Makefile"],
    accentHue: 200,
    expandedContent: {
      overview:
        "The stack is defined in a single docker-compose.yml that provisions two services, ollama and open-webui, on a dedicated bridge network with static IPv4 assignments. Service startup is gated by health checks: open-webui has a depends_on condition set to service_healthy on ollama, so the frontend never starts until Ollama is confirmed alive via `ollama list`. This prevents the common race condition where Open WebUI boots before the inference backend is ready to serve. All environment variables (port, image tag, container name, default model, GPU mode) are externalized to a .env file and imported by both the Makefile and Compose, making the stack fully tunable without touching any source files.",
      approach: [
        "Defined a named bridge network `ollama-bridge` with subnet 172.30.0.0/24 and gateway 172.30.0.1, static IPs assigned per service",
        "Ollama health check: `ollama list` polled every 30s, 5 retries, 15s start period; Open WebUI's depends_on condition blocks on this",
        "Open WebUI health check: `curl -f http://localhost:8080/health`, same polling interval, 20s start period for the Python/FastAPI boot",
        "GPU passthrough: `deploy.resources.reservations.devices` block ready to uncomment; `OLLAMA_GPU_MODE=all` in .env activates NVIDIA Container Toolkit passthrough",
        "Makefile wraps all docker compose commands: `make up`, `make pull-model`, `make status` (shows container health + netstat port binding), `make clean` (destructive, prompts confirmation before wiping model volume)",
        "scripts/manage.sh provides the same ops with colored terminal output, Docker daemon pre-flight, and a `prompt` command that sends a one-shot curl request to /api/generate and pretty-prints the JSON response",
      ],
      result:
        "A reproducible, one-command deployment: `make up` starts the full stack, `make pull-model` downloads the configured model, and the system is serving at http://localhost:3000 within ~30 seconds on a machine with the weights already cached. The static network topology means inter-service communication uses predictable IPs rather than DNS resolution, and the health check chain ensures the frontend is never reachable before the backend is ready.",
    },
  },
  {
    id: 2,
    title: "Ollama + Gemma",
    subtitle: "Inference Backend & Model",
    description:
      "Ollama serves the Gemma model family (4b / 12b / 27b) via a local REST API compatible with the OpenAI spec. GGUF quantization, GPU layer offloading, and a Modelfile system for per-model configuration, all contained behind a single endpoint at localhost:11434.",
    details: [
      "OpenAI-compatible REST API at localhost:11434, /v1/chat/completions, /api/generate, /api/chat",
      "Gemma model family: 4b (~3 GB VRAM), 12b (~10 GB), 27b (~20 GB), switch via OLLAMA_DEFAULT_MODEL",
      "GGUF quantization: Q4_K_M default (low VRAM), Q8_0 for max fidelity, pull via ollama pull",
      "Modelfile system: custom system prompts, num_ctx (context window), temperature per model",
      "OLLAMA_ORIGINS=* and OLLAMA_HOST=0.0.0.0 enable cross-container requests from Open WebUI",
      "Token hygiene guide: role-tag prompts, trim RAG chunks to 300–400 tokens, disable streaming for orchestrator-to-orchestrator calls",
    ],
    tags: ["Ollama", "Gemma 4", "GGUF", "OpenAI API", "LangChain-Compatible"],
    accentHue: 135,
    expandedContent: {
      overview:
        "Ollama wraps llama.cpp into a Docker-friendly service that exposes a local REST API on port 11434. The API has two modes: the native Ollama format (`/api/generate`, `/api/chat`) and an OpenAI-compatible shim (`/v1/chat/completions`). The OpenAI shim is what makes this stack plug-and-play with any tool that already speaks OpenAI: Open WebUI, LangChain, LlamaIndex, AutoGen, CrewAI, and VS Code extensions all work by pointing their base URL at localhost:11434. The model family running on this stack is Gemma (Google DeepMind), available at three parameter scales: 4b for consumer hardware, 12b for a mid-range GPU, and 27b for a workstation-class card.",
      approach: [
        "Pulled model via `make pull-model` which runs `docker exec ollama ollama pull gemma4`, downloads ~3 GB of GGUF weights into the mounted volume at ./volumes/ollama",
        "OLLAMA_HOST=0.0.0.0 binds the API to all interfaces inside the container (not just loopback) so requests from the Open WebUI container on the bridge network reach it",
        "OLLAMA_ORIGINS=* disables CORS restrictions, required for browser-based clients like Open WebUI to call the API directly",
        "Created a Modelfile to set a persistent system prompt and num_ctx=8192 for the 4b model, applied once via `ollama create` inside the container",
        "Benchmarked Q4_K_M vs Q8_0: Q4 cuts weight size by ~40% with <2% quality degradation on instruction-following tasks; Q8 is preferred for math-heavy or code generation tasks",
        "Tested orchestrator integration: LangChain's ChatOllama and OpenAI-compatible constructors both worked without modification by pointing base_url at http://localhost:11434; documented token hygiene rules for agentic loop efficiency (strip boilerplate, use role tags, cap RAG chunks at 300–400 tokens, disable streaming for inter-agent calls)",
      ],
      result:
        "A production-adjacent inference endpoint serving Gemma at 25–40 tokens/second on consumer GPU hardware, with zero API costs and no data leaving the machine. The OpenAI-compatible API made integration with the broader LLM tooling ecosystem seamless, any tool expecting OpenAI just works. The token hygiene guidelines documented in the README reduced per-call overhead in agentic loops by 20–40% by eliminating redundant prompt boilerplate and static system prompt re-transmission.",
    },
  },
  {
    id: 3,
    title: "Open WebUI + CI/CD",
    subtitle: "Chat Interface & DevOps Pipeline",
    description:
      "Open WebUI provides the browser-based chat frontend with persistent conversation history, model switching, RAG, and a custom theme. The project is wired to a GitLab CI/CD pipeline with five stages: lint → build → test → scan (SonarQube + Trivy) → deploy.",
    details: [
      "Open WebUI on port 3000, auth disabled (single-user mode), telemetry fully off (SCARF, DO_NOT_TRACK, ANONYMIZED_TELEMETRY)",
      "Conversation history persisted in SQLite at ./volumes/open-webui/webui.db, survives container restarts",
      "Custom theme via theme/custom.css injected into Open WebUI for local branding (WEBUI_NAME=LocalAI)",
      "GitLab CI: 5 stages, lint (compose + yaml), build (image pull/inspect), test (API healthcheck), scan, deploy",
      "SonarQube static analysis + Trivy vulnerability scan (HIGH/CRITICAL) on Ollama image, both on main branch",
      "deploy:local is manual-trigger only, prevents accidental force-recreate on every push",
    ],
    tags: ["Open WebUI", "GitLab CI", "SonarQube", "Trivy", "Docker-in-Docker"],
    accentHue: 270,
    expandedContent: {
      overview:
        "Open WebUI is the React + FastAPI application that wraps the Ollama API in a full-featured chat interface. It's configured here in single-user mode (WEBUI_AUTH=False) with all telemetry disabled: SCARF_NO_ANALYTICS, DO_NOT_TRACK, and ANONYMIZED_TELEMETRY are all set to prevent any outbound analytics. Conversation history is stored in a SQLite database at ./volumes/open-webui/webui.db, which is bind-mounted so data persists across container restarts and rebuilds. On the DevOps side, the project has a full GitLab CI/CD pipeline with five stages, Docker-in-Docker for build and test stages, SonarQube code quality scanning, and Trivy vulnerability scanning against the Ollama base image.",
      approach: [
        "Deployed Open WebUI pointing OLLAMA_BASE_URL at http://ollama:11434, uses the container name on the bridge network rather than localhost, so the request routes correctly between containers",
        "WEBUI_AUTH=False disables the mandatory account creation on first launch, the instance is single-user and private, so the auth layer adds friction without security benefit",
        "Disabled three separate telemetry systems: SCARF_NO_ANALYTICS (package analytics), DO_NOT_TRACK (standard browser header propagation), and ANONYMIZED_TELEMETRY (Open WebUI's own usage reporting)",
        "Custom theme: theme/custom.css is mounted into the Open WebUI container and loaded at runtime, allows persistent CSS overrides (colors, fonts, logo) without rebuilding the image",
        "GitLab CI/CD pipeline stages: lint:compose (validates docker-compose.yml), lint:yaml (yamllint on CI and compose files), build:image-check (pulls and inspects Ollama image on main), test:api-healthcheck (spins up stack, hits /api/tags, tears down, gated on MR events), scan:sonarqube (SonarQube analysis on main), scan:trivy (Trivy HIGH/CRITICAL scan against Ollama image), deploy:local (manual trigger, force-recreates containers from pulled images)",
        "SonarQube runs on a self-hosted runner with Docker executor; Trivy scanner uses the aquasecurity/trivy image and outputs SARIF for report archiving",
      ],
      result:
        "A fully self-contained local AI chat stack with a production-grade DevOps pipeline. The CI/CD pipeline catches compose file syntax errors, validates the API is live after a cold start, and flags any new HIGH or CRITICAL CVEs in the Ollama base image before they reach the local deployment. The manual deploy gate means a `git push` never accidentally restarts the running inference server mid-session.",
    },
  },
];

// ── Animation variants ───────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

const panelVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: EASE } },
};

const itemVariants = (i: number) => ({
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE, delay: i * 0.04 } },
});

// ── Detail modal ─────────────────────────────────────────────────────────────
const LAIDetailModal = ({ entry, onClose }: { entry: LAIEntry; onClose: () => void }) => {
  useModalLock(onClose);

  return (
    <motion.div
      className="lai-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="lai-modal"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="lai-modal-close" onClick={onClose} aria-label="Close details">
          ×
        </button>

        <div className="lai-modal-header">
          <p className="lai-eyebrow">{entry.subtitle}</p>
          <h3 className="lai-modal-title">{entry.title}</h3>
          <div className="lai-tags" style={{ marginTop: "0.25rem" }}>
            {entry.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="lai-modal-body">
          <p className="lai-modal-overview">{entry.expandedContent.overview}</p>

          <div className="lai-modal-section">
            <h4 className="lai-modal-section-title">Technical Approach</h4>
            <ul className="lai-modal-approach">
              {entry.expandedContent.approach.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="lai-modal-section">
            <h4 className="lai-modal-section-title">Result & Insights</h4>
            <p className="lai-modal-result">{entry.expandedContent.result}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Fallback card (mobile / low-perf) ────────────────────────────────────────
const LAICard = ({ entry, onExpand }: { entry: LAIEntry; onExpand: (e: LAIEntry) => void }) => (
  <article className="lai-card" onClick={() => onExpand(entry)}>
    <div className="lai-card-header">
      <p className="lai-card-subtitle">{entry.subtitle}</p>
      <h3 className="lai-card-title">{entry.title}</h3>
    </div>
    <p className="lai-card-desc">{entry.description}</p>
    <ul className="lai-card-details">
      {entry.details.slice(0, 3).map((d, i) => (
        <li key={i}>{d}</li>
      ))}
    </ul>
    <div className="lai-card-footer">
      <div className="lai-tags">
        {entry.tags.slice(0, 3).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <button
        className="btn lai-expand-btn"
        onClick={(e) => {
          e.stopPropagation();
          onExpand(entry);
        }}
      >
        Details ↗
      </button>
    </div>
  </article>
);

const LAIFallbackGrid = () => {
  const [expandedEntry, setExpandedEntry] = useState<LAIEntry | null>(null);

  return (
    <section id="local-ai">
      <h5>Personal Project · AI Infrastructure</h5>
      <ScrambleText text="Local AI Stack" />
      <AnimatedSection>
        <div className="container lai-fallback-grid">
          {entries.map((entry) => (
            <LAICard key={entry.id} entry={entry} onExpand={setExpandedEntry} />
          ))}
        </div>
      </AnimatedSection>
      <AnimatePresence>
        {expandedEntry && (
          <LAIDetailModal
            key="lai-detail-modal"
            entry={expandedEntry}
            onClose={() => setExpandedEntry(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// ── Intro panel ──────────────────────────────────────────────────────────────
const LAIIntroPanel = () => (
  <motion.div
    className="lai-panel lai-panel--intro"
    style={{ "--lai-accent-hue": 220 } as React.CSSProperties}
    variants={panelVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    <div className="lai-bg-wash" />
    <div className="lai-intro-inner">
      <p className="lai-eyebrow">Personal Project · AI Infrastructure</p>
      <h2 className="lai-intro-heading">
        Local
        <br />
        AI Stack
      </h2>
      <p className="lai-intro-body">
        A fully self-hosted LLM stack: Ollama for inference, Google's Gemma model as the backend,
        and Open WebUI as the chat interface. Containerized with Docker Compose on an isolated
        bridge network, with a GitLab CI/CD pipeline covering lint, build, test, security scanning,
        and deployment. Frontier AI running entirely on local hardware: no API keys, no data leaving
        the machine, no rate limits.
      </p>
      <div className="lai-spec-strip">
        <span>Gemma 4 · 26B MoE</span>
        <span>~14 GB VRAM</span>
        <span>128K context</span>
        <span>Kimi K2.6</span>
        <span>RTX 5080 GPU</span>
        <span>100% private</span>
      </div>
      <motion.p
        className="lai-scroll-hint"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll to explore ↓
      </motion.p>
    </div>
  </motion.div>
);

// ── Entry panel ──────────────────────────────────────────────────────────────
const LAIEntryPanel = ({
  entry,
  index,
  total,
  onExpand,
}: {
  entry: LAIEntry;
  index: number;
  total: number;
  onExpand: (e: LAIEntry) => void;
}) => (
  <motion.div
    key={entry.id}
    className="lai-panel"
    style={{ "--lai-accent-hue": entry.accentHue } as React.CSSProperties}
    variants={panelVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    <div className="lai-bg-wash" />
    <div className="lai-panel-inner">
      <div className="lai-left">
        <p className="lai-eyebrow">{entry.subtitle}</p>
        <h2 className="lai-title">{entry.title}</h2>
        <p className="lai-desc">{entry.description}</p>
        <ul className="lai-details">
          {entry.details.map((detail, i) => (
            <motion.li key={i} {...itemVariants(i)}>
              {detail}
            </motion.li>
          ))}
        </ul>
        <div className="lai-footer">
          <div className="lai-tags">
            {entry.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="lai-footer-actions">
            <button className="btn lai-expand-btn" onClick={() => onExpand(entry)}>
              Details ↗
            </button>
          </div>
        </div>
      </div>

      <div className="lai-right">
        <motion.div
          className="lai-number-block"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 120, damping: 14, delay: 0.15 },
          }}
        >
          <span className="lai-number-value">0{index + 1}</span>
          <span className="lai-number-label">of {total}</span>
        </motion.div>
        <span className="lai-layer-label">{entry.subtitle}</span>
      </div>
    </div>
  </motion.div>
);

// ── Sticky scroll showcase ────────────────────────────────────────────────────
const TOTAL_PANELS = entries.length + 1;
const STEP_MS = 500;

const LAIShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedEntry, setExpandedEntry] = useState<LAIEntry | null>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const activeIndexRef = useRef(0);
  const targetIndexRef = useRef(0);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const stepRef = useRef<() => void>(() => {});
  stepRef.current = () => {
    stepTimerRef.current = null;
    const current = activeIndexRef.current;
    const target = targetIndexRef.current;
    if (current === target) return;

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
    const idx = Math.min(Math.floor(v * TOTAL_PANELS), TOTAL_PANELS - 1);
    targetIndexRef.current = idx;
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
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    targetIndexRef.current = i;
    activeIndexRef.current = i;
    setActiveIndex(i);

    suppressRef.current = true;
    const rect = outerRef.current.getBoundingClientRect();
    const totalHeight = outerRef.current.offsetHeight - window.innerHeight;
    const targetScroll =
      window.scrollY + rect.top + (i / TOTAL_PANELS) * totalHeight + totalHeight / TOTAL_PANELS / 2;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
    setTimeout(() => {
      suppressRef.current = false;
    }, 800);
  };

  return (
    <section id="local-ai">
      <div className="lai-outer" ref={outerRef}>
        <div className="lai-sticky">
          <AnimatePresence mode="sync">
            {activeIndex === 0 ? (
              <LAIIntroPanel key="intro" />
            ) : (
              <LAIEntryPanel
                key={entries[activeIndex - 1].id}
                entry={entries[activeIndex - 1]}
                index={activeIndex - 1}
                total={entries.length}
                onExpand={setExpandedEntry}
              />
            )}
          </AnimatePresence>

          <nav className="lai-dots" aria-label="Local AI section progress">
            {Array.from({ length: TOTAL_PANELS }, (_, i) => (
              <button
                key={i}
                className={`lai-dot${i === activeIndex ? " lai-dot--active" : ""}${i === 0 ? " lai-dot--intro" : ""}`}
                aria-label={i === 0 ? "Introduction" : `Layer ${i}: ${entries[i - 1].title}`}
                onClick={() => scrollToPanel(i)}
              />
            ))}
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {expandedEntry && (
          <LAIDetailModal
            key="lai-detail-modal"
            entry={expandedEntry}
            onClose={() => setExpandedEntry(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// ── Export ────────────────────────────────────────────────────────────────────
const LocalAI = () => {
  const isMobile = useIsMobile(1024);
  const lowPerf = useIsLowPerformance();

  if (isMobile || lowPerf) return <LAIFallbackGrid />;
  return <LAIShowcase />;
};

export default LocalAI;
