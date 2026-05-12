import { useEffect, useRef, useState } from "react";
import useModalLock from "../../hooks/useModalLock";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import "./project.css";
import IMG1 from "../../assets/primedtNJ.webp";
import IMG2 from "../../assets/NN-Final-Project.webp";
import IMG3 from "../../assets/devopsCourseProject.webp";
import IMG4 from "../../assets/heroesLLCpic.webp";
import IMG5 from "../../assets/cluegame.webp";
import IMG6 from "../../assets/poker5hand.webp";
import IMG7 from "../../assets/underMSRP.webp";
import IMG8 from "../../assets/CarM.webp";
import IMG9 from "../../assets/tasksapp.webp";
import IMG10 from "../../assets/monodepth2-uncertainty.webp";
import IMG11 from "../../assets/monodepth2-disp.webp";
import IMG12 from "../../assets/localai-stack.webp";
import IMG13 from "../../assets/meg-decoding.webp";
import AnimatedSection from "../animated-section/AnimatedSection";
import TiltCard from "../tilt-card/TiltCard";
import BlurImage from "../blur-image/BlurImage";
import ScrambleText from "../scramble-text/ScrambleText";
import { useIsLowPerformance } from "../../hooks/usePerformanceTier";
import useIsMobile from "../../hooks/useIsMobile";

interface ProjectExpandedContent {
  overview: string;
  approach: string[];
  result: string;
}

interface Project {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  accentHue: number;
  paper?: string;
  expandedContent: ProjectExpandedContent;
}

const projects: Project[] = [
  {
    id: 14,
    image: IMG12,
    title: "Otto — Enterprise AI Developer Agent",
    category: "AI Engineering / Enterprise",
    description:
      "Internal enterprise AI coding agent at JPMorganChase that ingests Jira tickets, generates repository-aware code via Amazon Bedrock (Claude Sonnet/Opus, GPT-4, Gemini, Codex), and ships production-ready pull requests to Bitbucket — operationalizing AI-assisted SDLC delivery across engineering teams at scale.",
    techStack: ["Amazon Bedrock", "Claude", "OpenAI Codex", "Python", "Jira", "Bitbucket", "AI Governance"],
    accentHue: 260,
    expandedContent: {
      overview:
        "Otto is an internal enterprise AI developer agent platform built at JPMorganChase that connects Jira, Amazon Bedrock, and Bitbucket into a closed-loop autonomous SDLC pipeline. A developer creates a Jira ticket; Otto ingests it, pulls the relevant repository context, selects the best LLM for the task (Claude Sonnet/Opus, OpenAI Codex, GPT-4, or Gemini), generates code changes, and opens a production-ready pull request — all without a human writing a single line. The architecture is model-agnostic by design: any new LLM can be swapped in without changing downstream orchestration logic.",
      approach: [
        "Jira-to-PR pipeline: webhooks capture ticket creation/update events, extract acceptance criteria and linked code context, and route to the appropriate LLM via Amazon Bedrock's unified API — one interface across Claude Sonnet/Opus, OpenAI Codex, GPT-4, and Gemini",
        "Repository-scoped AI governance: each repository optionally defines a .otto/instructions.md file injected as a persistent system prompt for every generation request — constraining LLM output to the team's architectural patterns, security policies, and coding standards without sacrificing multi-model flexibility",
        "Self-reinforcing organizational memory: a post-merge hook reads PR reviewer comments and propagates accepted feedback as permanent additions to .otto/instructions.md — each merged PR makes future generations smarter; alignment improves automatically without manual instruction updates",
        "Human-in-the-loop design: Otto opens PRs for human review rather than auto-merging; the reviewer is the final gate — AppSec compliance is maintained because no AI output reaches production without engineer sign-off",
        "Multi-model orchestration: task routing selects the model based on task type (Claude for reasoning-heavy refactors, Codex for completion-heavy boilerplate, GPT-4 for cross-file synthesis) — each model runs through Bedrock's unified API so orchestration is model-agnostic",
        "Enterprise AI enablement: delivered AI adoption presentations to 25 teams within 24 hours covering governance frameworks, meta-prompting strategies, and Claude Code/Copilot workflows — onboarded 4 engineering teams in a single day and measurably compressed development velocity across the organization",
      ],
      result:
        "Otto is in active use across engineering teams at JPMorganChase, operationalizing AI-assisted development at enterprise scale. The persistent instruction injection system achieved AppSec-compliant AI code generation — meeting a compliance requirement that initially seemed at odds with multi-LLM flexibility. The self-reinforcing memory mechanism means the system gets progressively better aligned to each team's engineering standards with zero manual maintenance: reviewer feedback automatically becomes institutional AI knowledge. The platform was presented to 25 teams within 24 hours and has driven measurable compression of development velocity across the organization.",
    },
  },
  {
    id: 15,
    image: IMG3,
    title: "Full-Stack Algorithmic Trading Platform",
    category: "Full Stack / Open Source",
    description:
      "Multi-user algorithmic trading platform with strategy backtesting, live deployment management, and real-time performance analytics. Contributed OIDC authentication, user profile management API (GET + PATCH /api/users/me), live deployment control UI, and a full settings page to an open-source collaborative build.",
    techStack: ["Next.js", "FastAPI", "PostgreSQL", "SQLAlchemy", "TypeScript", "Python", "OIDC"],
    accentHue: 150,
    expandedContent: {
      overview:
        "An open-source multi-user algorithmic trading platform enabling teams to write, backtest, and deploy trading strategies with paper and live trading support. The platform consists of a Next.js frontend, FastAPI backend, PostgreSQL database with SQLAlchemy ORM, and Alembic migrations. Contributed several full-stack features: OIDC authentication, user settings and profile management (backend API + frontend page), and a live deployment management UI for monitoring running strategies.",
      approach: [
        "OIDC authentication: implemented the full authorization code + PKCE flow — Next.js frontend stores tokens in sessionStorage, apiFetch() wrapper attaches Bearer headers on every request, fires auth:unauthorized events on 401s so AuthProvider can redirect to login; FastAPI Depends(get_current_user) gates every protected route",
        "User profile API: GET + PATCH /api/users/me using the service-layer pattern — UserService owns all database logic (with_for_update() for race-safe writes, flush-before-commit for immediate return of updated state); FastAPI routes handle Pydantic validation (field_validators strip whitespace, coerce empty strings to null) and 404/401 error translation",
        "Settings page: react-hook-form + zod for client-side validation with zodResolver, live avatar preview via form.watch() subscribing to field changes in real time, Sonner toast notifications, and auth context refresh() after save to synchronize the header display name without a page reload",
        "Deployment management UI: frontend interface for listing active strategy deployments, showing real-time status (running/paused/stopped), triggering pause/resume/delete, and displaying performance statistics (Sharpe ratio, max drawdown, win rate, P&L) from the statistics API with cursor-based pagination",
        "Centralized API client: all backend calls flow through apiFetch() which attaches auth headers, dispatches auth:unauthorized on 401, and exposes typed helpers (getUserProfile, updateUserProfile, listDeployments, listStatistics) for type-safe consumption — adding a new API endpoint is a single typed function",
      ],
      result:
        "Live contributions to an open-source algorithmic trading platform on GitHub. The user profile and settings system is on the platform's main branch (PR #11). The deployment management UI gives traders real-time visibility into running strategies with one-click control. The OIDC authentication and centralized API client provide a clean, extensible foundation for every future API surface the platform adds. Demonstrates full-stack ownership — from SQLAlchemy model to polished Next.js UI — within an existing production codebase without regressions.",
    },
  },
  {
    id: 3,
    image: IMG10,
    title: "Evaluating Depth Estimation on Reflective Surfaces",
    category: "Deep Learning / Research",
    description:
      "Extended Monodepth2 with a Poggi-style per-pixel log-variance uncertainty head to improve depth on specular and reflective indoor surfaces. Fine-tuned on the Booster dataset and evaluated with 7 depth metrics plus sparsification analysis (AUSE/AURG). Best checkpoint achieves Abs Rel 0.244, a1 0.533 — an 11% improvement over the fine-tuned baseline.",
    techStack: ["Python", "PyTorch", "Monodepth2", "Booster Dataset", "TensorBoard", "AUSE/AURG"],
    accentHue: 280,
    paper: "/monodepth2-uncertainty-paper.pdf",
    expandedContent: {
      overview:
        "Standard self-supervised monocular depth estimation (SS-MDE) relies on photometric consistency between views as its training signal — an assumption that breaks on mirrors, glass, and metallic surfaces where specular reflections are view-dependent. This project extended Monodepth2 (Godard et al., ICCV 2019) with a per-pixel log-variance uncertainty head following Poggi et al. (CVPR 2020). The uncertainty head predicts per-pixel photometric uncertainty and uses it to modulate the NLL loss, automatically down-weighting specular pixels during training without requiring any reflective-surface annotations. The full pipeline was evaluated on the Booster dataset: a high-resolution indoor stereo benchmark with 228 images across 38 scenes containing mirrors, chrome, glass, and other non-Lambertian surfaces.",
      approach: [
        "Architecture: augmented the Monodepth2 decoder with a parallel 'uncertconv' convolutional head outputting a log-variance map at multiple scales alongside the standard disparity head — one forward pass yields both a depth prediction and a per-pixel uncertainty map with no shared weights between the two heads",
        "NLL loss: replaced the standard photometric term with L_log(x) = (1/2) * pe(x) * exp(-log_var(x)) + (1/2) * log_var(x), where pe is the SSIM+L1 photometric error; the exp(-log_var) factor down-weights uncertain (specular) pixels and the log_var regularizer prevents the trivial solution of infinite uncertainty everywhere",
        "Training: stereo-only mode with fixed known baseline (no PoseNet), initialized from KITTI-pretrained weights then fine-tuned on Booster; encoder frozen, decoder updated only; best uncertainty checkpoint selected by validation at epoch 4 (512x384) with learning rate 2e-5",
        "Evaluation pipeline: 7 standard depth metrics (Abs Rel, Sq Rel, RMSE, RMSE log, delta<1.25/1.25^2/1.25^3) on 46 test images from 28 scenes with per-scene stereo baseline scaling to recover metric depth; sparsification curves (AUSE/AURG) to assess whether uncertainty ranks high-error pixels correctly",
        "Sparsification protocol (Poggi et al.): pixels sorted by predicted uncertainty and progressively removed; AUSE = area under sparsification error curve (lower = better); AURG = AUSE(random) - AUSE(method) (positive = better than random removal)",
        "Qualitative validation: predicted uncertainty maps visually highlight mirrors, chrome fixtures, and glass without any annotation supervision, confirming the model learns photometric unreliability as a proxy for non-Lambertian regions; MC Dropout (stochastic forward passes) used as an independent uncertainty baseline for sparsification comparison",
      ],
      result:
        "Fine-tuning Monodepth2 on Booster alone reduced RMSE from 0.99m to 0.317m and Abs Rel from 0.44 to 0.18 vs. the KITTI-pretrained baseline, confirming the importance of in-domain adaptation. Adding the NLL uncertainty head further improved the best result to Abs Rel 0.244, Sq Rel 0.151, RMSE 0.390, a1 0.533 (512x384, epoch 4) — an 11% relative improvement in Abs Rel and 27% in a1 over the fine-tuned baseline (0.274 / 0.419). Sparsification: NLL log-var AUSE 0.102 / AURG -0.019; MC Dropout AUSE 0.146 / AURG -0.024. Both AURGs are slightly negative, revealing that the learned photometric uncertainty does not perfectly rank depth errors — the model flags specular pixels as uncertain because the photometric training signal is corrupted there, but ground-truth LiDAR depth at those pixels is still accurate, so removing them slightly hurts aggregate metrics. Photometric uncertainty captures appearance unreliability, not geometric error — a key distinction for downstream risk-aware applications.",
    },
  },
  {
    id: 13,
    image: IMG13,
    title: "MEG Brain Decoding: Imagined Concept Classification",
    category: "Deep Learning / Kaggle Competition",
    description:
      "Competed in the IMAGINE Decoding Challenge (Kaggle, Johns Hopkins DNN course) — a 10-class classification task decoding mentally imagined concepts from 306-channel MEG brain recordings. Built a 6-decoder weighted ensemble exploiting auditory-to-auditory same-modality transfer to bypass the perception-imagery domain gap. Final: 27th/169 teams, LB 0.133.",
    techStack: ["Python", "MNE-Python", "scikit-learn", "GloVe Embeddings", "MEG", "Kaggle"],
    accentHue: 185,
    paper: "/meg-decoding-paper.pdf",
    expandedContent: {
      overview:
        "The IMAGINE Decoding Challenge (Kaggle, hosted by Dr. Gordon Feld, Central Institute of Mental Health) required predicting which of 10 imagined concepts — apple, bicycle, brush, cake, clown, cup, desk, foot, mountain, zebra — a subject was mentally visualizing, based on 306-channel MEG (Magnetoencephalography) recordings. The dataset contained 15 training subjects with localizer trials (visual perception, 480 labeled epochs per subject) and imagine trials (mental imagery, 50 epochs per subject), plus 14 unlabeled test subjects. The core challenge is a cross-brain-state domain gap: classifiers must be trained on visual perception signals and applied to mental imagery — a related but neurologically distinct brain process that prior literature shows overlaps only partially with visual perception. Chance level was 10% (10 classes); the $600 prize required >=20% accuracy, which no team in our cohort reached.",
      approach: [
        "Key insight: the localizer epoch contains both a pre-visual auditory window (-1s to 0s, subjects hear the word cue) and a visual window (0-0.6s). The imagine epoch also begins with the same auditory cue (0-1s). Training on the localizer auditory window and applying it to the imagine auditory window is same-modality transfer — both capture the brain's response to an identical acoustic stimulus, completely bypassing the perception-imagery domain gap",
        "6-decoder weighted ensemble: Auditory Sliding OvR (w=3.0), Auditory Full-Window classifier (w=2.0), Auditory GloVe embedding regression (w=1.5), Visual Sliding OvR (w=1.0), Visual Full-Window (w=0.5), Visual GloVe embedding regression (w=0.5). Final prediction = weighted sum of all six softmax probability outputs followed by argmax",
        "Sliding window OvR bank: trains a separate L1-penalized One-vs-Rest logistic regression at every 10ms time step (50ms windows) across the training window. CV pruning discards windows where 3-fold CV accuracy <= 11%, keeping only discriminative time points. Null data injection — pre-stimulus baseline epochs labeled as a null class — sharpens class boundaries by teaching the model what neural activity is NOT class-relevant",
        "Feature engineering: temporal windows (mean + std per channel across 5 sub-windows = 2040 features), band-power (theta 4-8 Hz, alpha 8-13 Hz, beta 13-30 Hz, gamma 30-45 Hz via Hilbert envelope = 816 features). PCA reduces to 50 components before logistic regression",
        "GloVe word embedding regression: Ridge regression (alpha=100) predicts the 300-dim GloVe embedding of the target class from MEG features. At test time, the predicted embedding is matched to the 10 target words by cosine distance with temperature-scaled softmax — encodes semantic geometry (e.g., apple is closer to cake than to zebra) unavailable to flat 10-class classifiers",
        "Gradiometers only (204/306 channels) after ablation study: magnetometers capture deep/diffuse sources and add inter-subject noise without improving single-trial class discrimination. ICA artifact removal was tested but excluded — it degraded performance because the MEGIN system's SSS preprocessing already removes environmental interference, and ICA risks removing task-relevant neural components",
      ],
      result:
        "Final LB accuracy 0.133, rank 27/169 teams (top 16%), 34 submissions over 13 modules. Started from 59th/92 with an SVC baseline at 0.108 (week 2). Key lessons: (1) domain shift dominates over model complexity — the auditory-to-auditory same-modality decoder outperforms all cross-modal approaches regardless of sophistication; (2) Riemannian covariance features achieve 0.238 mean CV accuracy on localizer but collapse to 0.095 (chance) on imagery, showing spatial covariance structure does not generalize across brain states; (3) alpha-band log-variance decoder performs at chance both cross-task and within imagery (5-fold CV 0.088), ruling out sustained alpha suppression as a class-discriminating feature at this scale; (4) subject sub-26 exhibited degenerate prediction collapse (48/50 trials = 'zebra'), revealing a known per-subject OvR failure mode when one class's training distribution dominates a subject's brain geometry.",
    },
  },
  {
    id: 1,
    image: IMG2,
    title: "Targeted Advertising ROI Classification Using Neural Networks",
    category: "ML / Research",
    description:
      "Research project applying feedforward neural networks to classify advertising ROI across digital channels. Includes data preprocessing, model training, and evaluation with confusion matrices and accuracy metrics.",
    techStack: ["Python", "TensorFlow", "Pandas", "NumPy", "Matplotlib"],
    accentHue: 250,
    paper: "/nn-final-project.pdf",
    expandedContent: {
      overview:
        "The central question was whether a feedforward neural network could outperform classical classifiers on predicting ROI tier (low/medium/high) from digital advertising campaign features. The dataset included channel type, spend, impressions, clicks, and conversion metrics across multiple campaigns.",
      approach: [
        "Data preprocessing pipeline: StandardScaler normalization, label encoding for categorical channel types",
        "Handled class imbalance via class_weight='balanced' in the loss function",
        "Compared 2-layer vs. 3-layer FFNNs with ReLU activations and dropout regularization",
        "Final architecture: Dense(128) → Dropout(0.3) → Dense(64) → Dropout(0.2) → Softmax(3)",
        "Evaluated with confusion matrices, precision/recall/F1, and training loss/accuracy curves",
        "Visualized decision boundaries and feature importance via gradient-based attribution",
      ],
      result:
        "Published as a research paper (PDF). The 3-layer FFNN achieved ~87% classification accuracy, outperforming Logistic Regression by ~6pp. Precision was the primary metric due to the cost of misclassifying high-ROI campaigns as low-ROI and under-investing in them.",
    },
  },
  {
    id: 12,
    image: IMG12,
    title: "Local AI Inference Stack",
    category: "AI Infrastructure / DevOps",
    description:
      "Containerized local inference environment running Gemma 4 (26B MoE) and Kimi K2.6 on an RTX 5080 with GPU passthrough via Docker. Exposes an OpenAI-compatible REST API and an Open WebUI chat interface — fully air-gapped, no cloud dependency.",
    techStack: ["Docker", "Ollama", "Gemma 4", "Kimi K2.6", "Open WebUI", "NVIDIA RTX 5080"],
    accentHue: 160,
    expandedContent: {
      overview:
        "A production-adjacent, self-hosted LLM inference stack designed to run state-of-the-art open models on consumer hardware without any cloud dependency. The stack pairs Ollama (inference runtime) with Open WebUI (browser chat interface) behind a Docker Compose bridge network. GPU passthrough is enabled via Docker Desktop's WSL2 NVIDIA integration, giving the inference container direct access to the RTX 5080's 16 GB of GDDR7 VRAM. The environment runs two models simultaneously: Google's Gemma 4 (26B MoE — ~4B active parameters per token at Q4, ~14 GB VRAM) as the primary reasoning engine, and Moonshot AI's Kimi K2.6 (state-of-the-art open model with leading coding and agentic capabilities, accessed via Ollama's cloud endpoint) as a second inference target.",
      approach: [
        "Docker Compose stack: ollama service on 172.30.0.10:11434 with NVIDIA GPU passthrough (deploy.resources.reservations), Open WebUI on 172.30.0.11→localhost:3000 with health-gated startup",
        "GPU configuration: OLLAMA_FLASH_ATTENTION=1 (Blackwell tensor-core path, ~30% throughput gain), OLLAMA_NUM_PARALLEL=2, OLLAMA_MAX_LOADED_MODELS=2 — keeps both Gemma 4 and Kimi K2.6 resident in VRAM simultaneously",
        "Model selection: gemma4:26b (Mixture of Experts — only ~4B parameters activate per forward pass, so the 26B model runs at 4B cost in VRAM throughput), VRAM budget ~14 GB leaving headroom for the second model",
        "Kimi K2.6 integration: Moonshot AI's open model with state-of-the-art coding and agentic benchmarks, accessed via 'ollama launch claude --model kimi-k2.6:cloud' — no separate API key required",
        "Makefile automation: make up / make pull-all / make models / make status — operational runbook encoded as targets so the stack is reproducible from a cold machine in under 5 minutes",
        "OpenAI-compatible API at localhost:11434/api/chat — any LangChain, LlamaIndex, or AutoGen orchestrator can route to the local stack by changing a single base_url; no code changes needed",
        "Prompt engineering guide in README: token hygiene rules for orchestrator-to-model calls — strip boilerplate from instruction-tuned models, use role arrays not concatenated strings, cap RAG chunks at 300–400 tokens, disable streaming for agent-to-agent calls",
        "CPU tuning: OLLAMA_NUM_THREAD=6 pins inference threads to 6 of the 9800X3D's 8 cores (the 3D V-Cache makes these the fastest consumer CPU cores for matrix operations), leaving 2 for the host OS",
      ],
      result:
        "A fully self-hosted inference environment capable of running 26B-parameter MoE models at consumer-GPU speeds with zero cloud cost. The RTX 5080 + Gemma 4 26B configuration delivers interactive-speed token generation (~40–60 tok/s at Q4) — competitive with hosted API latency for single-user workloads. Kimi K2.6 is available as a second model on the same endpoint for coding and agentic tasks where its benchmark numbers lead the open-model field. The entire stack comes up from scratch with 'make up && make pull-all' and exposes a chat UI at localhost:3000 and a raw REST API at localhost:11434 — no API keys, no rate limits, no data leaving the machine.",
    },
  },
  {
    id: 4,
    image: IMG3,
    title: "DevOps & Secure Software Development",
    category: "DevOps / Security",
    description:
      "End-to-end CI/CD pipeline implementation with security best practices including static analysis, dependency scanning, containerization, and automated deployments.",
    techStack: ["Docker", "Jenkins", "AWS", "SonarQube", "Terraform"],
    accentHue: 30,
    expandedContent: {
      overview:
        "A DevSecOps reference implementation covering the full software delivery lifecycle, from code commit to containerized production deployment, with automated security gates at each stage. Completed as part of a graduate-level Secure Software Development course.",
      approach: [
        "Jenkins declarative pipeline with stages: Build → Test → SAST → Dependency Scan → Containerize → Deploy",
        "SonarQube static analysis enforcing quality gates (0 critical vulnerabilities to pass)",
        "OWASP Dependency-Check scanning all third-party libraries against the CVE database",
        "Multi-stage Docker builds to minimize final image attack surface and size",
        "Terraform IaC provisioning reproducible AWS EC2 + S3 infrastructure",
        "Secrets management via environment variables and AWS Secrets Manager (no hardcoded credentials)",
      ],
      result:
        "A complete DevSecOps pipeline with documented stages, security scan reports, and live AWS deployment. Demonstrated how security tooling integrates into CI/CD without blocking development velocity; all security checks automated as pipeline gates.",
    },
  },
  {
    id: 2,
    image: IMG8,
    title: "Car Maintenance App",
    category: "Full Stack",
    description:
      "Full-stack MERN application for tracking vehicle maintenance schedules, service history, and upcoming reminders. Features user authentication and a dashboard for managing multiple vehicles.",
    techStack: ["React", "Node.js", "MongoDB", "Express"],
    accentHue: 210,
    expandedContent: {
      overview:
        "A production-grade MERN stack application built to replace scattered spreadsheets and app reminders for vehicle owners. Users can register, add multiple vehicles, log service events, and see upcoming maintenance windows based on mileage and time intervals.",
      approach: [
        "React frontend with React Router for multi-page navigation and component-based architecture",
        "Express REST API with full CRUD endpoints for vehicles, service records, and users",
        "MongoDB with Mongoose schemas modeling vehicle specs, service types, and interval rules",
        "JWT authentication with bcrypt password hashing for secure session management",
        "Maintenance reminder logic: compares current mileage/date against last service + interval rules",
        "Responsive CSS grid dashboard for managing multiple vehicles in one view",
      ],
      result:
        "A fully functional multi-user app with persistent data storage, authentication, and automated reminder logic. Built as a collaborative project demonstrating full-stack architecture, REST API design, and MongoDB data modeling.",
    },
  },
  {
    id: 10,
    image: IMG11,
    title: "Monodepth3: Depth Disparity Estimation",
    category: "Deep Learning / Research",
    description:
      "Self-supervised monocular depth estimation using the Monodepth3 baseline. Trained on KITTI with the reprojection-based photometric loss, producing dense per-pixel disparity maps from a single RGB image at inference time.",
    techStack: ["Python", "PyTorch", "Monodepth3", "KITTI", "TensorBoard"],
    accentHue: 200,
    expandedContent: {
      overview:
        "Monodepth3 is a self-supervised monocular depth estimation framework that learns depth and camera pose jointly from unlabeled video sequences, using reprojection-based photometric consistency as the training signal, no depth ground truth required. The model outputs a per-pixel disparity map from a single RGB image, which can be converted to metric depth given the camera's known baseline. This entry focuses on the baseline system and its disparity outputs before the uncertainty head extension was added.",
      approach: [
        "Trained the Monodepth3 encoder-decoder depth network on KITTI Eigen split using the standard monocular self-supervised loss: minimum reprojection loss + edge-aware smoothness regularization",
        "Used the ResNet-18 encoder pretrained on ImageNet for fast convergence; the decoder outputs 4-scale disparity maps (1/4 to full resolution)",
        "Applied the auto-masking technique from Godard et al. to exclude static pixels (where the camera hasn't moved relative to the scene) from the photometric loss",
        "Evaluated on the Eigen test split using the standard 7 depth metrics: Abs Rel, Sq Rel, RMSE, RMSE log, and δ < 1.25 / 1.25² / 1.25³ thresholds",
        "Visualized disparity maps with the plasma colormap, warmer colors = closer objects, cooler = farther away",
        "Used TensorBoard for monitoring per-epoch loss curves and qualitative disparity map outputs on held-out validation frames",
      ],
      result:
        "A working self-supervised depth estimation pipeline producing dense disparity maps from single monocular images. The baseline system demonstrated Monodepth3's key innovation of training on raw video without depth labels, achieving competitive benchmark numbers on the KITTI Eigen split. These disparity outputs serve as the depth signal that the uncertainty extension (a separate project) is evaluated against.",
    },
  },
  {
    id: 5,
    image: IMG4,
    title: "Heroes Movement LLC",
    category: "Frontend",
    description:
      "Professional business website for a community organization. Designed and built a responsive landing page with modern UI/UX, contact forms, and mobile-first layout.",
    techStack: ["React", "CSS3", "JavaScript", "Responsive Design"],
    accentHue: 170,
    expandedContent: {
      overview:
        "A marketing and community outreach website for Heroes Movement LLC, a local nonprofit organization. The goal was a clean, mission-driven web presence that communicates the organization's values and makes it easy for community members to get involved.",
      approach: [
        "React SPA with component-based page structure for easy content updates",
        "Mobile-first CSS with custom properties, flexbox, and grid for consistent layout",
        "Contact form with client-side validation and submission handling",
        "Image optimization and lazy loading for fast initial load on mobile networks",
        "Semantic HTML5 with ARIA labels for accessibility compliance",
        "SEO-optimized with meta tags, Open Graph, and structured data markup",
      ],
      result:
        "A live business website serving the Heroes Movement LLC community. The mobile-first design ensured a strong experience for the majority of visitors coming from social media links on mobile devices.",
    },
  },
  {
    id: 6,
    image: IMG1,
    title: "Prime Detailing NJ",
    category: "Frontend",
    description:
      "Business website for a New Jersey auto detailing company. Features service listings, pricing packages, image gallery, and SEO-optimized pages.",
    techStack: ["React", "CSS3", "JavaScript", "SEO"],
    accentHue: 10,
    expandedContent: {
      overview:
        "A client website for a New Jersey auto detailing business. The brief was to build a fast, professional site that ranked in local search and converted visitors to booking inquiries. Performance and local SEO were top priorities.",
      approach: [
        "React with React Router for service-specific landing pages (ceramic coating, paint correction, etc.)",
        "Custom CSS3 with brand color system and smooth scroll interactions",
        "Image gallery with lazy loading and WebP format for optimal page speed",
        "Local SEO: location-specific keywords, Google Business schema, and city-targeted meta tags",
        "Contact/booking section with phone click-to-call and form submission",
        "Google PageSpeed optimizations: code splitting, font preloading, image compression",
      ],
      result:
        "A live client website driving booking inquiries for the business. Achieved Google PageSpeed scores consistently in the 90s on mobile. The local SEO implementation helped the business appear in 'auto detailing near me' searches in Northern NJ.",
    },
  },
  {
    id: 7,
    image: IMG5,
    title: "Clue Game",
    category: "Full Stack",
    description:
      "Interactive web-based version of the classic Clue board game. Players can make accusations, track clues, and solve the mystery through a clean, intuitive UI.",
    techStack: ["React", "TypeScript", "CSS3", "Netlify"],
    accentHue: 140,
    expandedContent: {
      overview:
        "A browser-playable implementation of the classic Clue (Cluedo) board game built entirely in React + TypeScript. The entire game state, including suspect/weapon/room tracking, card distribution, accusation logic, and win conditions, all managed client-side.",
      approach: [
        "TypeScript interfaces modeling all game entities: Suspect, Weapon, Room, Card, Player",
        "Custom React hooks for game state (useGameState) and player turn management (useTurnManager)",
        "Accusation validation logic checks suggestions against the solution envelope and opponent hands",
        "CSS Grid-based board layout with responsive card layout for detective notes",
        "AnimatePresence transitions for room navigation and accusation reveal",
        "Deployed to Netlify with automated CI from the main branch",
      ],
      result:
        "A fully playable Clue implementation in the browser supporting multi-player turn-based gameplay. The project was primarily a TypeScript architecture exercise, modeling a complex board game with strict type safety and well-separated game logic.",
    },
  },
  {
    id: 8,
    image: IMG6,
    title: "5 Hand Poker",
    category: "Backend / Java",
    description:
      "Poker hand evaluator that analyzes five-card hands, determines hand rankings, and compares multiple hands to find the winner using classic poker rules.",
    techStack: ["Java", "OOP", "JUnit"],
    accentHue: 40,
    expandedContent: {
      overview:
        "A Java command-line application that parses five-card poker hands, evaluates their ranking according to standard rules, and compares multiple hands to determine the winner. The focus was clean OOP design and comprehensive test coverage of all hand types.",
      approach: [
        "Card class with Rank (Enum, 2–Ace) and Suit (Enum, ♠♥♦♣) for type-safe representation",
        "Hand class with evaluation logic using rank frequency maps and suit-match checks",
        "Full ranking hierarchy implementation: High Card → One Pair → Two Pair → ... → Royal Flush",
        "Comparator pattern for hand-vs-hand comparison with tiebreaker rules (kicker evaluation)",
        "JUnit 5 test suite with test cases for every hand type, including edge cases (A-2-3-4-5 straight, etc.)",
        "Deck class with shuffle and deal methods for full game simulation",
      ],
      result:
        "A well-tested Java program with full coverage of all 10 hand types and their tiebreaker logic. The project was primarily an OOP and unit testing exercise, demonstrating clean class design, the Comparator pattern, and rigorous edge-case testing.",
    },
  },
  {
    id: 9,
    image: IMG7,
    title: "Under MSRP App",
    category: "Full Stack",
    description:
      "Automated bulk email tool for vehicle dealerships, helping them reach potential customers with under-MSRP offers. Includes template management and email tracking.",
    techStack: ["React", "Node.js", "SendGrid", "Netlify"],
    accentHue: 190,
    expandedContent: {
      overview:
        "A business tool automating bulk email outreach for vehicle dealerships. Dealers upload a contact list (CSV), customize an email template with vehicle-specific merge fields, and trigger a SendGrid campaign, all from a clean React dashboard.",
      approach: [
        "React frontend with template editor, CSV upload, and campaign preview",
        "CSV parsing and contact segmentation: filter by zip code, vehicle interest, previous purchase",
        "Node.js/Express backend orchestrating SendGrid Transactional Email API calls",
        "SendGrid dynamic templates with Handlebars merge fields: {{vehicle}}, {{price}}, {{dealer}}",
        "Rate-limited batch sending to stay within SendGrid's hourly API limits",
        "Deployment: React frontend on Netlify, Express API on a separate server",
      ],
      result:
        "A functional dealership marketing tool that reduced manual outreach work significantly. The CSV-to-campaign pipeline cut campaign setup time from hours of manual emails to a few minutes per batch.",
    },
  },
  {
    id: 11,
    image: IMG9,
    title: "Tasks Web App",
    category: "Frontend / React",
    description:
      "A clean, minimalist task management application with CRUD operations, task categorization, and persistent storage for organizing daily workflows.",
    techStack: ["React", "TypeScript", "CSS3"],
    accentHue: 280,
    expandedContent: {
      overview:
        "A minimalist task manager built as a TypeScript architecture exercise. The focus was on clean custom hook design, strict type safety, and smooth UI interactions, not feature breadth. Tasks persist across sessions via localStorage serialization.",
      approach: [
        "TypeScript interfaces: Task (id, title, category, completed, createdAt) with strict typing",
        "Custom useTasks hook encapsulating all CRUD operations and localStorage sync",
        "useLocalStorage generic hook for type-safe persistence with JSON serialization/deserialization",
        "Category filtering with a tabbed interface: All, Active, Completed views",
        "CSS3 transitions for task add/complete/remove animations (opacity + translate)",
        "Keyboard accessibility: Enter to add, Delete key support, focus management",
      ],
      result:
        "A clean, fast-loading productivity tool with zero dependencies beyond React. The project demonstrated TypeScript best practices, including generic hooks, discriminated unions for task state, and strict null checks, in a small but well-structured codebase.",
    },
  },
];

// ── Animation variants ──────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

const panelVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: EASE } },
};

const imageVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 16, delay: 0.1 },
  },
};

// ── Detail modal ────────────────────────────────────────────────────────────
const ProjectDetailModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  useModalLock(onClose);

  return (
    <motion.div
      className="prj-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="prj-modal"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="prj-modal-close" onClick={onClose} aria-label="Close details">
          ×
        </button>

        <div className="prj-modal-header">
          <p className="prj-eyebrow">{project.category}</p>
          <h3 className="prj-modal-title">{project.title}</h3>
          <div className="prj-tags" style={{ marginTop: "0.25rem" }}>
            {project.techStack.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="prj-modal-body">
          <p className="prj-modal-overview">{project.expandedContent.overview}</p>

          <div className="prj-modal-section">
            <h4 className="prj-modal-section-title">Technical Approach</h4>
            <ul className="prj-modal-approach">
              {project.expandedContent.approach.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="prj-modal-section">
            <h4 className="prj-modal-section-title">Result & Insights</h4>
            <p className="prj-modal-result">{project.expandedContent.result}</p>
          </div>
        </div>

        {project.paper && (
          <div className="prj-modal-footer">
            <a href={project.paper} className="btn btn-primary" target="_blank" rel="noreferrer">
              View Paper ↗
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ── Fallback grid (mobile / low-perf) ──────────────────────────────────────
const ProjectCard = ({
  project,
  onExpand,
}: {
  project: Project;
  onExpand: (p: Project) => void;
}) => (
  <TiltCard>
    <article className="project_item" onClick={() => onExpand(project)}>
      <div className="project_item-image">
        <BlurImage src={project.image} alt={project.title} loading="lazy" />
      </div>
      <div className="project_item-info">
        <h3>{project.title}</h3>
        <div className="project_item-tech">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <button
          className="btn prj-expand-btn"
          onClick={(e) => {
            e.stopPropagation();
            onExpand(project);
          }}
        >
          Details ↗
        </button>
      </div>
    </article>
  </TiltCard>
);

const ProjectFallbackGrid = () => {
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);

  return (
    <section id="project">
      <h5>My Recent Work</h5>
      <ScrambleText text="Portfolio" />
      <AnimatedSection>
        <div className="container project_container">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onExpand={setExpandedProject} />
          ))}
        </div>
      </AnimatedSection>
      <AnimatePresence>
        {expandedProject && (
          <ProjectDetailModal
            key="prj-detail-modal"
            project={expandedProject}
            onClose={() => setExpandedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// ── Intro panel ────────────────────────────────────────────────────────────
const ProjectIntroPanel = () => (
  <motion.div
    className="prj-panel prj-panel--intro"
    style={{ "--prj-accent-hue": 220 } as React.CSSProperties}
    variants={panelVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    <div className="prj-bg-wash" />
    <div className="prj-intro-inner">
      <p className="prj-eyebrow">Software Engineering</p>
      <h2 className="prj-intro-heading">
        My
        <br />
        Projects
      </h2>
      <p className="prj-intro-body">
        Fifteen projects spanning enterprise AI systems, full-stack web applications, deep learning
        research, AI infrastructure, DevOps pipelines, and client work. Each one built end-to-end,
        from architecture decisions to deployment.
      </p>
      <div className="prj-intro-ctas">
        <a
          href="https://github.com/andrewsaifnoorian"
          className="btn btn-primary"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
      </div>
      <motion.p
        className="prj-scroll-hint"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll to explore ↓
      </motion.p>
    </div>
  </motion.div>
);

// ── Showcase panel ─────────────────────────────────────────────────────────
const ProjectPanel = ({
  project,
  index,
  total,
  onExpand,
}: {
  project: Project;
  index: number;
  total: number;
  onExpand: (p: Project) => void;
}) => (
  <motion.div
    key={project.id}
    className="prj-panel"
    style={{ "--prj-accent-hue": project.accentHue } as React.CSSProperties}
    variants={panelVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    <div className="prj-bg-wash" />
    <div className="prj-panel-inner">
      {/* Left column */}
      <div className="prj-left">
        <p className="prj-eyebrow">{project.category}</p>
        <h2 className="prj-title">{project.title}</h2>
        <p className="prj-desc">{project.description}</p>

        <div className="prj-tags">
          {project.techStack.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <div className="prj-footer">
          <div className="prj-footer-actions">
            {project.paper && (
              <a href={project.paper} className="btn" target="_blank" rel="noreferrer">
                View Paper ↗
              </a>
            )}
            <button className="btn prj-expand-btn" onClick={() => onExpand(project)}>
              Details ↗
            </button>
          </div>
          <span className="prj-counter">
            {index + 1} / {total}
          </span>
        </div>
      </div>

      {/* Right column — project image */}
      <div className="prj-right">
        <motion.div className="prj-image-frame" variants={imageVariants}>
          <img src={project.image} alt={project.title} />
        </motion.div>
      </div>
    </div>
  </motion.div>
);

// ── Sticky scroll showcase ─────────────────────────────────────────────────
const TOTAL_PANELS = projects.length + 1; // 1 intro + N projects
const STEP_MS = 500;

const ProjectShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);
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
    <section id="project">
      <div className="prj-outer" ref={outerRef}>
        <div className="prj-sticky">
          <AnimatePresence mode="sync">
            {activeIndex === 0 ? (
              <ProjectIntroPanel key="intro" />
            ) : (
              <ProjectPanel
                key={projects[activeIndex - 1].id}
                project={projects[activeIndex - 1]}
                index={activeIndex - 1}
                total={projects.length}
                onExpand={setExpandedProject}
              />
            )}
          </AnimatePresence>

          <nav className="prj-dots" aria-label="Projects section progress">
            {Array.from({ length: TOTAL_PANELS }, (_, i) => (
              <button
                key={i}
                className={`prj-dot${i === activeIndex ? " prj-dot--active" : ""}${i === 0 ? " prj-dot--intro" : ""}`}
                aria-label={i === 0 ? "Introduction" : `Project ${i}: ${projects[i - 1].title}`}
                onClick={() => scrollToPanel(i)}
              />
            ))}
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {expandedProject && (
          <ProjectDetailModal
            key="prj-detail-modal"
            project={expandedProject}
            onClose={() => setExpandedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// ── Export ─────────────────────────────────────────────────────────────────
const Projects = () => {
  const isMobile = useIsMobile(1024);
  const lowPerf = useIsLowPerformance();

  if (isMobile || lowPerf) return <ProjectFallbackGrid />;
  return <ProjectShowcase />;
};

export default Projects;
