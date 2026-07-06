import { useState } from "react";
import useModalLock from "../../hooks/useModalLock";
import { AnimatePresence, motion } from "framer-motion";
import "./kaggle.css";
import TiltCard from "../tilt-card/TiltCard";
import { useIsLowPerformance } from "../../hooks/usePerformanceTier";
import useIsMobile from "../../hooks/useIsMobile";
import useStickyPanelScroll from "../../hooks/useStickyPanelScroll";

const KAGGLE_PROFILE_URL = "https://www.kaggle.com/andrewsafe";

interface KaggleExpandedContent {
  overview: string;
  approach: string[];
  result: string;
}

interface KaggleCompetition {
  id: number;
  title: string;
  description: string;
  techniques: string[];
  score: string;
  scoreLabel: string;
  rank: string;
  tags: string[];
  colab: string;
  runtime?: string;
  accentHue: number;
  expandedContent: KaggleExpandedContent;
}

const competitions: KaggleCompetition[] = [
  {
    id: 1,
    title: "DNA Sequence Classification",
    description:
      "Binary classification of bacterial DNA sequences as virulent or benign using multi-source feature fusion.",
    techniques: [
      "k-mer features (k=3,4,5)",
      "Biological features (CpG, reading frames, homopolymers)",
      "TF-IDF char n-grams (4–7)",
      "LogReg + 5-seed DNN ensemble",
    ],
    score: "0.9873",
    scoreLabel: "AUC",
    rank: "Rank 1 (tied)",
    tags: ["Bioinformatics", "NLP"],
    colab: "",
    runtime: "T4 GPU",
    accentHue: 220,
    expandedContent: {
      overview:
        "The core insight was treating DNA as a natural language: each sequence was tokenized into overlapping k-mers (k=3,4,5) to capture local motifs, then combined with TF-IDF character n-grams for longer-range patterns. Biological domain features like CpG dinucleotide ratio, open reading frame count, GC content, and homopolymer run length injected knowledge the model couldn't learn from sequence statistics alone.",
      approach: [
        "Built 1,344 k-mer count features from 3/4/5-mer vocabularies (4³+4⁴+4⁵ combinations)",
        "Added TF-IDF char n-gram matrix (4–7-gram range, 50K features via max_features)",
        "Engineered 8 biological features: CpG ratio, ORF count, GC content, homopolymer run length",
        "Trained 5-seed DNN (Dense 128→64→1, sigmoid) per random seed for ensemble diversity",
        "Final prediction: soft-vote average across 5 DNNs + Logistic Regression",
      ],
      result:
        "0.9873 AUC on the held-out test set, tied for first place. The ensemble's diversity (linear vs. deep, different seeds) was the key driver. The biological features alone contributed ~0.008 AUC improvement over pure k-mer features.",
    },
  },
  {
    id: 2,
    title: "Bacteria Classification",
    description:
      "5-class bacterial species classification from 286-dimensional k-mer count frequency features.",
    techniques: [
      "StandardScaler + class-weight balancing",
      "DNN: Dense(128) → BN → Dropout(0.3) → Dense(64)",
      "Nadam optimizer",
      "EarlyStopping + ReduceLROnPlateau",
    ],
    score: "0.9621",
    scoreLabel: "F1",
    rank: "Rank 1",
    tags: ["Bioinformatics"],
    colab: "",
    runtime: "T4 GPU",
    accentHue: 160,
    expandedContent: {
      overview:
        "Five bacterial species separated using only 286-dimensional k-mer count frequency vectors. The key challenge was class imbalance, with certain species underrepresented 3× relative to the majority. A compact DNN with BatchNorm and Dropout was sufficient; the real lever was reweighting the cross-entropy loss with sklearn's class_weight='balanced'.",
      approach: [
        "StandardScaler normalized all 286 k-mer counts to zero mean, unit variance",
        "Architecture: Dense(128) → BatchNorm → Dropout(0.3) → Dense(64) → Softmax(5)",
        "class_weight='balanced' computed inverse-frequency weights per species",
        "EarlyStopping (patience=15) monitored val_loss to prevent overfitting",
        "ReduceLROnPlateau halved the learning rate after 8 epochs without improvement",
        "Nadam optimizer (Adam + Nesterov momentum) for smoother gradient updates",
      ],
      result:
        "0.9621 macro-F1 across all 5 species, achieving first place. Without class reweighting, macro-F1 dropped to ~0.89, with the minority species misclassified almost entirely. BatchNorm was the second most impactful change (+0.02 F1 over vanilla Dense layers).",
    },
  },
  {
    id: 3,
    title: "Radon Level Prediction",
    description:
      "Regression task predicting indoor radon concentration (pCi/L) from EPA SRRS survey data with geographic, structural, and uranium features.",
    techniques: [
      "RandomForest (300 trees) + GradientBoosting ensemble",
      "log1p target transform",
      "County-level Bayesian shrinkage aggregates",
      "33 engineered features (basement, state, log transforms, interactions)",
    ],
    score: "24.19",
    scoreLabel: "MSE",
    rank: "Rank 3 of 16",
    tags: ["Regression", "Geospatial", "Environment"],
    colab: "",
    accentHue: 75,
    expandedContent: {
      overview:
        "The dataset is the EPA SRRS (State Radon Survey), the same dataset used in Gelman & Hill's multilevel modeling textbook. The target (indoor radon in pCi/L) is heavily right-skewed (mean=4.72, max=282). The baseline drops all categorical features via select_dtypes and uses a 5-neuron DNN. The strategy here was to recover basement type, state geography, and county-level geology, then replace the DNN with a RandomForest + GradientBoosting ensemble trained on a log-transformed target.",
      approach: [
        "Recovered 3 dropped categoricals: has_basement (Y/N), is_basement_floor (floor=0), and 7 one-hot state indicators",
        "County-level Bayesian shrinkage: smoothed mean radon per FIPS code (n=5 toward global mean) to capture local geology without overfitting small counties",
        "Log-transformed skewed inputs: log1p(Uppm), log1p(pcterr), log1p(adjwt) to stabilize tree splits",
        "Interaction features: basement × Uppm, floor × Uppm, lat × Uppm to model combined structural/spatial effects",
        "Target transform: log1p(Y) reduces target skewness from ~2.9 to ~0.2; predictions back-transformed with expm1",
        "RF (300 trees, max_depth=15, min_samples_leaf=2) + GBR (200 trees, max_depth=4, lr=0.1, subsample=0.8)",
        "Ensemble: 70% RF + 30% GBR; entire pipeline runs in ~35s (within the 60s runtime limit)",
      ],
      result:
        "24.19 MSE on the public leaderboard, rank 3 of 16. RF feature importance revealed log_pcterr and pcterr as dominant predictors (~48% each); measurement error correlates with true radon levels since high-radon environments are harder to measure precisely. County aggregates and has_basement contributed meaningful marginal improvements. Without the log target transform, RF MSE on raw Y was ~10 vs. ~6.6 with it.",
    },
  },
  {
    id: 9,
    title: "Venus vs Mars (Gender Classification)",
    description:
      "Binary classification of 5,000 facial images as female or male using fine-tuned ConvNeXtBase with horizontal flip augmentation.",
    techniques: [
      "ConvNeXtBase (ImageNet-22K pretrained)",
      "RandomFlip augmentation + crop_to_aspect_ratio",
      "GlobalAvgPooling2D → Dense(256) → Sigmoid",
      "mixed_float16 precision, full dataset training",
    ],
    score: "0.9752",
    scoreLabel: "Accuracy",
    rank: "Rank 3 of 9",
    tags: ["Computer Vision", "Image Classification"],
    colab: "",
    runtime: "T4 GPU",
    accentHue: 320,
    expandedContent: {
      overview:
        "5,000 labeled facial images (2,500 female, 2,500 male) at 178×218px. ConvNeXtBase, pretrained on ImageNet-22K with 14M images, was frozen and used as a feature extractor. Only the classification head was trained, making it the sole learnable component mapping 1024-channel feature maps to the binary output. The head was widened to 256 units (vs. the 64-unit baseline) to avoid an information bottleneck when decoding ConvNeXt's richer feature space.",
      approach: [
        "Loaded all 5,000 images via image_dataset_from_directory with crop_to_aspect_ratio=True to preserve facial proportions",
        "RandomFlip('horizontal') applied on-the-fly during training to make the model orientation-invariant without doubling storage",
        "Mixed float16 precision enabled to reduce memory usage and accelerate T4 GPU throughput",
        "Removed the 80/20 validation split, all data used for training to maximize exposure in a competition setting",
        "Frozen ConvNeXtBase backbone (259 layers, 87.8M params); only Dense(256) → Dropout(0.3) → Dense(1) head trained",
        "Compiled with binary cross-entropy and Adam (lr=1e-3); trained for 2 epochs (Phase 1 head-only fine-tuning)",
      ],
      result:
        "0.9752 accuracy on the held-out test set, rank 3 of 9 teams, well above the baseline (0.4072). The combination of horizontal flip augmentation, aspect-ratio cropping, and full-dataset training improved accuracy by 0.32% over the frozen-backbone baseline. ConvNeXt's larger kernels (7×7) and LayerNorm throughout made it significantly more accurate than EfficientNet variants, which plateaued at 90–94% despite completing within the runtime limit.",
    },
  },
  {
    id: 4,
    title: "Diamond Price Prediction",
    description:
      "Regression task predicting prices of 40K diamonds from 9 physical and quality characteristics.",
    techniques: [
      "RidgeCV with log-target transform",
      "Degree-2 polynomial feature expansion",
      "One-hot categorical encoding",
      "Quantile-matching post-processing",
    ],
    score: "570.19",
    scoreLabel: "RMSE",
    rank: "Rank 4 of 16",
    tags: ["Regression", "Tabular"],
    colab: "",
    accentHue: 190,
    expandedContent: {
      overview:
        "Diamond prices span $326–$18,823 with a heavy right skew. Applying log1p to the target stabilizes variance and shifts the loss focus to percentage error rather than absolute error, critical when a $500 mistake on a $1K diamond matters as much as a $5,000 mistake on a $10K diamond. Degree-2 polynomial features capture the non-linear carat effect (price scales roughly as carat²·²).",
      approach: [
        "Applied log1p(price) target transform to reduce skewness from ~2.9 to ~0.2",
        "One-hot encoded cut (5), color (7), clarity (8) → 20 binary columns",
        "PolynomialFeatures(degree=2, interaction_only=False) expanded 12 → 90 features",
        "RidgeCV auto-selected α from [0.001, 0.01, 0.1, 1, 10, 100] via 5-fold CV",
        "Post-processing: quantile-matching shifted the predicted distribution to align with training targets",
      ],
      result:
        "570.19 RMSE on the private leaderboard, 4th of 16 teams, beating the baseline (1087.59). The log-transform alone reduced RMSE by ~18% vs. linear regression on raw price. Quantile-matching post-processing contributed additional reduction by correcting systematic under-prediction on high-value diamonds.",
    },
  },
  {
    id: 5,
    title: "Purchase Intent Classification",
    description:
      "Binary classification of online purchase intent from 17 behavioral e-commerce session features.",
    techniques: [
      "Wide & Deep DNN (512→256→128→64)",
      "93 engineered features (PgVal interactions, frequency encoding)",
      "SGDR cosine warm restarts",
      "Nadam optimizer",
    ],
    score: "0.9927",
    scoreLabel: "Accuracy",
    rank: "Rank 6 of 14",
    tags: ["Tabular", "Business"],
    colab: "",
    runtime: "T4 GPU",
    accentHue: 260,
    expandedContent: {
      overview:
        "17 raw session features (bounce rate, page duration, visitor type, etc.) were expanded to 93 via interaction terms and frequency encoding. A Wide & Deep architecture captured both memorization (raw features in the 'wide' linear layer) and generalization (cross-feature interactions in the deep stack).",
      approach: [
        "Frequency-encoded 4 high-cardinality categoricals: Browser, OS, Region, Traffic Type",
        "Engineered interaction features: PageValues × Duration, PageValues × BounceRate, Duration ratios",
        "Wide layer: raw + crossed features fed directly to a linear output unit",
        "Deep stack: Dense(512) → Dense(256) → Dense(128) → Dense(64) with BatchNorm and Dropout(0.3)",
        "Outputs merged and passed through a final sigmoid for binary classification",
        "SGDR cosine annealing warm restarts (T₀=10 epochs) to escape local minima",
      ],
      result:
        "0.9927 accuracy, ranking 6th of 14. The Wide & Deep architecture improved accuracy by ~0.4% over a plain deep network. The 'wide' memorization component was especially effective for high-PageValues sessions, which are strong purchase intent signals.",
    },
  },
  {
    id: 6,
    title: "Collaborative Filtering (Netflix)",
    description:
      "Movie rating prediction on a 128K-user × 380-movie sparse matrix using matrix factorization.",
    techniques: [
      "Truncated SVD (k=5 latent dimensions, 10 iterations)",
      "User-bias imputation",
      "Optimized rating threshold rounding",
    ],
    score: "0.4200",
    scoreLabel: "Accuracy",
    rank: "Rank 6 of 14",
    tags: ["Recommender Systems"],
    colab: "",
    accentHue: 0,
    expandedContent: {
      overview:
        "A 128K-user × 380-movie rating matrix (~94% sparse) was factorized into k=5 latent user and item embedding vectors using Truncated SVD. Before decomposition, missing ratings were imputed with each user's mean so the model learns deviations from a user's baseline preference rather than predicting from zero.",
      approach: [
        "Built explicit sparse matrix: rows = users, cols = movies, values = ratings 1–5",
        "Imputed missing entries with per-user mean rating before factorization",
        "TruncatedSVD(n_components=5, n_iter=10): factored as U × Σ × Vᵀ",
        "Reconstructed ratings: U × Σ × Vᵀ, clipped to [1, 5]",
        "Optimized per-boundary rounding thresholds on a validation split vs. nearest-integer",
        "Threshold search: grid of [1.5, 2.5, 3.5, 4.5] boundaries via brute-force accuracy maximization",
      ],
      result:
        "0.4200 accuracy, rank 6 of 14. Threshold optimization improved accuracy by ~2pp over naive rounding. The low absolute accuracy reflects the fundamental difficulty of 5-class exact-match: a model off by 0.4 on every prediction fails every sample regardless of direction.",
    },
  },
  {
    id: 7,
    title: "Stellar Classification",
    description:
      "Multi-class classification of astronomical objects (stars, galaxies, quasars) from spectroscopic survey data.",
    techniques: ["Linear Discriminant Analysis (LDA)", "Custom redshift-split model"],
    score: "0.9647",
    scoreLabel: "Accuracy",
    rank: "Rank 7 of 16",
    tags: ["Astronomy", "Tabular"],
    colab: "",
    accentHue: 280,
    expandedContent: {
      overview:
        "SDSS (Sloan Digital Sky Survey) spectroscopic data provides 5 photometric band magnitudes (u, g, r, i, z) plus redshift and derived features. LDA was the natural first choice: the three object classes (stars, galaxies, and quasars) are known to separate linearly in astronomical color space (u−g vs. g−r, etc.).",
      approach: [
        "Engineered standard astronomical color indices: u−g, g−r, r−i, i−z",
        "Linear Discriminant Analysis finds the 2D projection maximizing between-class vs. within-class variance",
        "Custom redshift-split: separate LDA classifiers for z < 0.5 and z ≥ 0.5",
        "Stars cluster at z ≈ 0; quasars at z > 0.5; galaxies span both; the split enforces this prior",
        "Final classifier routes each object to the appropriate sub-model based on its redshift",
      ],
      result:
        "0.9647 accuracy on the private leaderboard, 7th of 16 teams, beating the baseline (0.9103). The redshift-split boosted accuracy on the quasar class specifically, which the single global LDA model frequently confused with high-redshift galaxies.",
    },
  },
  {
    id: 10,
    title: "Crypto Price Forecasting",
    description:
      "Time-series regression forecasting cryptocurrency closing prices from 500K+ OHLCV observations using a two-layer LSTM with embargo splitting.",
    techniques: [
      "LSTM (100 units × 2 layers) + Dropout(0.2)",
      "Huber loss for outlier-robust training",
      "Return & rolling-window feature engineering (5/10/20 steps)",
      "Embargo train/val split to prevent temporal leakage",
    ],
    score: "0.4612",
    scoreLabel: "Correlation",
    rank: "Rank 7 of 9",
    tags: ["Time Series", "Finance"],
    colab: "",
    runtime: "T4 GPU",
    accentHue: 45,
    expandedContent: {
      overview:
        "500K OHLCV (Open, High, Low, Close, Volume, VWAP, Count) observations for a single cryptocurrency. The raw Close series is non-stationary and noisy, so the model predicts delta (price change) rather than absolute price. Sequences of 128 time steps are fed to a two-layer LSTM that outputs 50-step-ahead delta forecasts. An embargo gap of 50 steps between train and validation prevents look-ahead leakage, a critical detail for financial time-series evaluation.",
      approach: [
        "Engineered 20 features from raw OHLCV: delta, log_return, OC_diff, HL_diff, rolling std/momentum/slope over 5, 10, and 20-step windows, and binary direction",
        "Embargo split: 80% train / 20% val with a 50-step gap between them to prevent temporal leakage",
        "Sequences: Nx=128 input steps, Ny=50 output steps, step=5 stride, generating ~100K training sequences",
        "Architecture: LSTM(100, return_sequences=True) → Dropout(0.2) → LSTM(100) → Dropout(0.2) → Dense(50)",
        "Huber loss (δ=1) instead of MSE to down-weight the gradient contribution of extreme crypto price spikes",
        "Adam optimizer, 20 epochs with early stopping monitored on validation Huber loss",
      ],
      result:
        "0.4612 weighted Pearson correlation on the leaderboard, rank 7 of 9, beating the baseline (0.1314). The return-based feature engineering was the most impactful change: predicting delta rather than raw Close stabilized training and allowed the LSTM to focus on directional dynamics rather than drifting price levels. Huber loss provided additional stability by preventing extreme residuals from dominating gradient updates.",
    },
  },
  {
    id: 8,
    title: "Audio Classification (Phonemes)",
    description:
      "5-class phoneme classification from 256-point log-periodogram spectral features across 50K utterances.",
    techniques: [
      "StandardScaler on full training set",
      "LightGBM (200 trees, num_leaves=63)",
      "Balanced class weights",
    ],
    score: "0.9284",
    scoreLabel: "Accuracy",
    rank: "Rank 8 of 18",
    tags: ["Audio", "Speech"],
    colab: "",
    accentHue: 30,
    expandedContent: {
      overview:
        "50K utterances, each represented as a 256-point log-periodogram (power spectral density in dB). LightGBM was chosen over a DNN because gradient-boosted trees handle structured, fixed-length spectral features more efficiently at this scale, and they don't require tuning a sequence model for a fixed-width input.",
      approach: [
        "Computed log-periodogram: 10 × log₁₀(|FFT|²) for 256 frequency bins per utterance",
        "StandardScaler fit on training set; applied to train and test",
        "LightGBM: 200 estimators, num_leaves=63, learning_rate=0.05, subsample=0.8",
        "class_weight='balanced' for 5-class imbalance across phoneme types",
        "Early stopping: 50 rounds patience on 15% stratified validation split",
        "Feature importance confirmed low-frequency bins (0–80 Hz) as most discriminative",
      ],
      result:
        "0.9284 accuracy, rank 8 of 18. Given only spectral energy features with no temporal context, this is near the practical ceiling for this representation. MFCC features or a CNN over mel-spectrograms would likely push accuracy higher by leveraging temporal structure.",
    },
  },
];

// ── Animation variants ──────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

const panelVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: EASE },
  },
};

const scoreVariants = {
  initial: { opacity: 0, scale: 0.85 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 120, damping: 14, delay: 0.15 },
  },
};

const techVariants = (i: number) => ({
  initial: { opacity: 0, x: -12 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, delay: 0.2 + i * 0.07, ease: EASE },
  },
});

// ── Detail modal ────────────────────────────────────────────────────────────
const KaggleDetailModal = ({
  competition,
  onClose,
}: {
  competition: KaggleCompetition;
  onClose: () => void;
}) => {
  const isRank1 = competition.rank.startsWith("Rank 1");

  useModalLock(onClose);

  return (
    <motion.div
      className="kgl-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="kgl-modal"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="kgl-modal-close" onClick={onClose} aria-label="Close details">
          ×
        </button>

        {/* Header */}
        <div className="kgl-modal-header">
          <p className="kgl-eyebrow">Deep Dive</p>
          <h3 className="kgl-modal-title">{competition.title}</h3>
          <div className="kgl-modal-meta">
            {competition.score !== "—" && (
              <div className="kgl-modal-score">
                <span className="kgl-modal-score-value">{competition.score}</span>
                {competition.scoreLabel && (
                  <span className="kgl-modal-score-label">{competition.scoreLabel}</span>
                )}
              </div>
            )}
            {competition.rank && (
              <span className={`kgl-rank${isRank1 ? " kgl-rank--gold" : ""}`}>
                {competition.rank}
              </span>
            )}
            <div className="kgl-tags">
              {competition.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
              {competition.runtime && (
                <span className="kgl-tags__runtime">{competition.runtime}</span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="kgl-modal-body">
          <p className="kgl-modal-overview">{competition.expandedContent.overview}</p>

          <div className="kgl-modal-section">
            <h4 className="kgl-modal-section-title">Technical Approach</h4>
            <ul className="kgl-modal-approach">
              {competition.expandedContent.approach.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="kgl-modal-section">
            <h4 className="kgl-modal-section-title">Result & Insights</h4>
            <p className="kgl-modal-result">{competition.expandedContent.result}</p>
          </div>
        </div>

        {/* Footer */}
        {competition.colab && (
          <div className="kgl-modal-footer">
            <a
              href={competition.colab}
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Open Notebook ↗
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ── Fallback grid (mobile / low-perf) ──────────────────────────────────────
const KaggleCard = ({
  competition,
  onExpand,
}: {
  competition: KaggleCompetition;
  onExpand: (comp: KaggleCompetition) => void;
}) => {
  const isRank1 = competition.rank.startsWith("Rank 1");

  return (
    <TiltCard>
      <article className={`kaggle_item${isRank1 ? " kaggle_item--highlight" : ""}`}>
        <div className="kaggle_item-header">
          {competition.score !== "—" ? (
            <div className="kaggle_item-score">
              <span className="kaggle_item-score-value">{competition.score}</span>
              {competition.scoreLabel && (
                <span className="kaggle_item-score-label">{competition.scoreLabel}</span>
              )}
            </div>
          ) : (
            <div className="kaggle_item-score">
              <span className="kaggle_item-score-value kaggle_item-score-value--placeholder">
                —
              </span>
            </div>
          )}
          {competition.rank && (
            <span className={`kaggle_item-rank${isRank1 ? " kaggle_item-rank--gold" : ""}`}>
              {competition.rank}
            </span>
          )}
        </div>

        <h3 className="kaggle_item-title">{competition.title}</h3>
        <p className="kaggle_item-desc">{competition.description}</p>

        <ul className="kaggle_item-techniques">
          {competition.techniques.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="kaggle_item-footer">
          <div className="kaggle_item-tags">
            {competition.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
            {competition.runtime && (
              <span className="kaggle_item-tags__runtime">{competition.runtime}</span>
            )}
          </div>
          <div className="kgl-footer-actions">
            {competition.colab && (
              <a href={competition.colab} className="btn" target="_blank" rel="noreferrer">
                Notebook
              </a>
            )}
            <button className="btn kgl-expand-btn" onClick={() => onExpand(competition)}>
              Details ↗
            </button>
          </div>
        </div>
      </article>
    </TiltCard>
  );
};

const KaggleFallbackGrid = () => {
  const [expandedComp, setExpandedComp] = useState<KaggleCompetition | null>(null);

  return (
    <section id="kaggle">
      <h5>Johns Hopkins University · ML Engineering</h5>
      <h2>Kaggle Competitions</h2>
      <div className="kgl-fallback-ctas">
        <a href={KAGGLE_PROFILE_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
          Kaggle Profile
        </a>
      </div>
      <div className="container kaggle_container">
        {competitions.map((comp) => (
          <KaggleCard key={comp.id} competition={comp} onExpand={setExpandedComp} />
        ))}
      </div>
      <AnimatePresence>
        {expandedComp && (
          <KaggleDetailModal
            key="detail-modal"
            competition={expandedComp}
            onClose={() => setExpandedComp(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// ── Intro panel ────────────────────────────────────────────────────────────
const KaggleIntroPanel = () => (
  <motion.div
    className="kgl-panel kgl-panel--intro"
    style={{ "--kgl-accent-hue": 220 } as React.CSSProperties}
    variants={panelVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    <div className="kgl-bg-wash" />
    <div className="kgl-intro-inner">
      <p className="kgl-eyebrow">Johns Hopkins University · ML Engineering</p>
      <h2 className="kgl-intro-heading">
        Kaggle
        <br />
        Competitions
      </h2>
      <p className="kgl-intro-body">
        Ten machine learning competitions completed as part of the Johns Hopkins ML Engineering
        program. The projects span DNA sequence classification, audio phoneme detection, radon level
        prediction, collaborative filtering, gender classification, and crypto price forecasting.
      </p>
      <div className="kgl-intro-ctas">
        <a href={KAGGLE_PROFILE_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
          Kaggle Profile
        </a>
      </div>
      <motion.p
        className="kgl-scroll-hint"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll to explore ↓
      </motion.p>
    </div>
  </motion.div>
);

// ── Showcase panel ─────────────────────────────────────────────────────────
const KagglePanel = ({
  comp,
  index,
  total,
  onExpand,
}: {
  comp: KaggleCompetition;
  index: number;
  total: number;
  onExpand: (comp: KaggleCompetition) => void;
}) => {
  const isRank1 = comp.rank.startsWith("Rank 1");

  return (
    <motion.div
      key={comp.id}
      className="kgl-panel"
      style={{ "--kgl-accent-hue": comp.accentHue } as React.CSSProperties}
      variants={panelVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Background radial wash */}
      <div className="kgl-bg-wash" />

      <div className="kgl-panel-inner">
        {/* Left column */}
        <div className="kgl-left">
          <p className="kgl-eyebrow">Johns Hopkins · ML Engineering</p>
          <h2 className="kgl-title">{comp.title}</h2>
          <p className="kgl-desc">{comp.description}</p>

          <ul className="kgl-techniques">
            {comp.techniques.map((t, i) => (
              <motion.li key={t} {...techVariants(i)}>
                {t}
              </motion.li>
            ))}
          </ul>

          <div className="kgl-footer">
            <div className="kgl-tags">
              {comp.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
              {comp.runtime && <span className="kgl-tags__runtime">{comp.runtime}</span>}
            </div>
            <div className="kgl-footer-actions">
              {comp.colab && (
                <a href={comp.colab} className="btn" target="_blank" rel="noreferrer">
                  Notebook
                </a>
              )}
              <button className="btn kgl-expand-btn" onClick={() => onExpand(comp)}>
                Details ↗
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="kgl-right">
          {comp.score !== "—" ? (
            <motion.div className="kgl-score-block" variants={scoreVariants}>
              <span className="kgl-score-value">{comp.score}</span>
              {comp.scoreLabel && <span className="kgl-score-label">{comp.scoreLabel}</span>}
            </motion.div>
          ) : (
            <motion.div className="kgl-score-block" variants={scoreVariants}>
              <span className="kgl-score-value kgl-score-value--placeholder">—</span>
            </motion.div>
          )}
          {comp.rank && (
            <span className={`kgl-rank${isRank1 ? " kgl-rank--gold" : ""}`}>{comp.rank}</span>
          )}
          <span className="kgl-counter">
            {index + 1} / {total}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Sticky scroll showcase ─────────────────────────────────────────────────
const TOTAL_PANELS = competitions.length + 1; // 1 intro + 10 competitions

const KaggleShowcase = () => {
  const [expandedComp, setExpandedComp] = useState<KaggleCompetition | null>(null);
  const { activeIndex, outerRef, scrollToPanel } = useStickyPanelScroll(TOTAL_PANELS);

  return (
    <section id="kaggle">
      <div className="kgl-outer" ref={outerRef}>
        <div className="kgl-sticky">
          {/* mode="sync": exit and enter animate simultaneously — no blank gap */}
          <AnimatePresence mode="sync">
            {activeIndex === 0 ? (
              <KaggleIntroPanel key="intro" />
            ) : (
              <KagglePanel
                key={competitions[activeIndex - 1].id}
                comp={competitions[activeIndex - 1]}
                index={activeIndex - 1}
                total={competitions.length}
                onExpand={setExpandedComp}
              />
            )}
          </AnimatePresence>

          {/* Progress dots — first dot = intro, rest = competitions */}
          <nav className="kgl-dots" aria-label="Kaggle section progress">
            {Array.from({ length: TOTAL_PANELS }, (_, i) => (
              <button
                key={i}
                className={`kgl-dot${i === activeIndex ? " kgl-dot--active" : ""}${i === 0 ? " kgl-dot--intro" : ""}`}
                aria-label={
                  i === 0 ? "Introduction" : `Competition ${i}: ${competitions[i - 1].title}`
                }
                onClick={() => scrollToPanel(i)}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Detail modal — rendered outside the sticky container */}
      <AnimatePresence>
        {expandedComp && (
          <KaggleDetailModal
            key="detail-modal"
            competition={expandedComp}
            onClose={() => setExpandedComp(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// ── Export ─────────────────────────────────────────────────────────────────
const Kaggle = () => {
  const lowPerf = useIsLowPerformance();
  const isMobile = useIsMobile(1024);

  if (isMobile || lowPerf) return <KaggleFallbackGrid />;
  return <KaggleShowcase />;
};

export default Kaggle;
