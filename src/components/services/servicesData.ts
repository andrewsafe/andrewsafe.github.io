import { IconType } from "react-icons";
import { FaBuilding, FaFlask, FaServer, FaJava, FaCode, FaRocket, FaBrain, FaAmazon } from "react-icons/fa";
import {
  SiReact,
  SiAngular,
  SiJavascript,
  SiPython,
  SiNodedotjs,
  SiPostgresql,
  SiDocker,
  SiGitlab,
  SiSonarqubeserver,
  SiSelenium,
  SiTerraform,
  SiVscodium,
  SiIntellijidea,
  SiGithubcopilot,
} from "react-icons/si";
import { TbBrandOpenai } from "react-icons/tb";

/* ── Card Types ── */
export type BentoSize = "sm" | "md" | "lg";

interface BentoCardBase {
  id: string;
  size: BentoSize;
}

export interface MetricBentoCard extends BentoCardBase {
  type: "metric";
  value: string;
  label: string;
}

export interface TechBentoCard extends BentoCardBase {
  type: "tech";
  icons: { icon: IconType; name: string }[];
}

export interface ShowcaseBentoCard extends BentoCardBase {
  type: "showcase";
  title: string;
  description: string;
}

export interface DevToolsBentoCard extends BentoCardBase {
  type: "dev-tools";
}

export type BentoCard = MetricBentoCard | TechBentoCard | ShowcaseBentoCard | DevToolsBentoCard;

export interface TimelineNode {
  year: string;
  text: string;
  linkedCardId: string;
}

export interface TabData {
  id: string;
  label: string;
  shortLabel: string;
  icon: IconType;
  timeline: TimelineNode[];
  bento: BentoCard[];
}

export interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

/* ── Tab Definitions ── */
export const tabs: TabData[] = [
  {
    id: "enterprise",
    label: "Enterprise Engineering",
    shortLabel: "Enterprise",
    icon: FaBuilding,
    timeline: [
      { year: "2024", text: "Angular v8 → v19 Migration", linkedCardId: "ent-paint" },
      {
        year: "2025",
        text: "Spring Boot Batch Overhaul: 5x Throughput",
        linkedCardId: "ent-throughput",
      },
      { year: "2025", text: "OAuth 2.0 + PKCE SSO Integration", linkedCardId: "ent-throughput" },
      {
        year: "2026",
        text: "Joined JPMorganChase as Software Engineer II",
        linkedCardId: "ent-tech",
      },
    ],
    bento: [
      {
        id: "ent-throughput",
        type: "metric",
        size: "sm",
        value: "5x",
        label: "Throughput Improvement",
      },
      { id: "ent-paint", type: "metric", size: "sm", value: "36%", label: "Faster First Paint" },
      {
        id: "ent-tech",
        type: "tech",
        size: "sm",
        icons: [
          { icon: SiReact, name: "React" },
          { icon: SiJavascript, name: "TypeScript" },
          { icon: SiAngular, name: "Angular" },
          { icon: FaJava, name: "Java" },
          { icon: SiNodedotjs, name: "Spring Boot" },
          { icon: FaAmazon, name: "AWS Aurora" },
        ],
      },
    ],
  },
  {
    id: "academic",
    label: "Academic & AI Research",
    shortLabel: "AI Research",
    icon: FaFlask,
    timeline: [
      {
        year: "2019",
        text: "Rutgers Honors College: Presidential Scholar",
        linkedCardId: "acad-dnn",
      },
      { year: "2024", text: "Started MS at Johns Hopkins", linkedCardId: "acad-dnn" },
      { year: "2024", text: "Neural Network ROI Research", linkedCardId: "acad-dnn" },
      { year: "2025", text: "Anthropic Claude AI Courses", linkedCardId: "acad-ai" },
    ],
    bento: [
      {
        id: "acad-dnn",
        type: "showcase",
        size: "sm",
        title: "Deep Neural Networks",
        description: "Feedforward NN for ad ROI classification",
      },
      {
        id: "acad-tech",
        type: "tech",
        size: "sm",
        icons: [
          { icon: SiPython, name: "Python" },
          { icon: SiJavascript, name: "TensorFlow" },
          { icon: SiPostgresql, name: "Pandas" },
          { icon: SiNodedotjs, name: "NumPy" },
        ],
      },
      {
        id: "acad-ai",
        type: "showcase",
        size: "sm",
        title: "Applied AI",
        description: "Claude courses, prompt engineering, model evaluation",
      },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Cloud",
    shortLabel: "DevOps",
    icon: FaServer,
    timeline: [
      { year: "2023", text: "GitLab CI/CD Pipeline Architecture", linkedCardId: "devops-issues" },
      { year: "2023", text: "Selenium/Cucumber Test Automation", linkedCardId: "devops-saved" },
      { year: "2024", text: "Docker + SonarQube Quality Gates", linkedCardId: "devops-tech" },
      { year: "2024", text: "AWS Infrastructure & Monitoring", linkedCardId: "devops-tech" },
    ],
    bento: [
      {
        id: "devops-issues",
        type: "metric",
        size: "sm",
        value: "18+",
        label: "Critical Issues Caught Pre-Prod",
      },
      {
        id: "devops-saved",
        type: "metric",
        size: "sm",
        value: "3-4 days",
        label: "Regression Saved Per Cycle",
      },
      {
        id: "devops-tech",
        type: "tech",
        size: "sm",
        icons: [
          { icon: SiDocker, name: "Docker" },
          { icon: FaAmazon, name: "AWS" },
          { icon: SiGitlab, name: "GitLab" },
          { icon: SiSonarqubeserver, name: "SonarQube" },
          { icon: SiSelenium, name: "Selenium" },
          { icon: SiTerraform, name: "Terraform" },
        ],
      },
    ],
  },
  {
    id: "devtools",
    label: "Dev Environment",
    shortLabel: "Tools",
    icon: FaCode,
    timeline: [
      {
        year: "2023",
        text: "VS Code + IntelliJ as daily enterprise drivers",
        linkedCardId: "dt-split",
      },
      {
        year: "2024",
        text: "GitHub Copilot integrated into production workflow",
        linkedCardId: "dt-split",
      },
      {
        year: "2025",
        text: "AI-first IDEs adopted for research & personal projects",
        linkedCardId: "dt-split",
      },
      {
        year: "2026",
        text: "Claude Code + Codex as primary home/school environment",
        linkedCardId: "dt-split",
      },
    ],
    bento: [{ id: "dt-split", type: "dev-tools", size: "lg" }],
  },
];

/* ── Dev Tools data (consumed by BentoGrid DevToolsCard) ── */
export interface DevTool {
  icon: IconType;
  name: string;
}

export const workTools: DevTool[] = [
  { icon: SiVscodium, name: "VS Code" },
  { icon: SiGithubcopilot, name: "Copilot" },
  { icon: SiIntellijidea, name: "IntelliJ" },
];

export const personalTools: DevTool[] = [
  { icon: FaRocket, name: "Antigravity" },
  { icon: FaBrain, name: "Claude Code" },
  { icon: TbBrandOpenai, name: "Codex" },
];

/* ── Stat Bar ── */
export const stats: StatItem[] = [
  { target: 5, suffix: "x", label: "Throughput" },
  { target: 36, suffix: "%", label: "Faster First Paint" },
  { target: 18, suffix: "+", label: "Bugs Caught Pre-Prod" },
  { target: 4, suffix: "", label: "Certifications" },
];
