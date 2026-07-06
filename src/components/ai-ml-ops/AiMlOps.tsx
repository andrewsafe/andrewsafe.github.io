import "./ai-ml-ops.css";
import AnimatedSection from "../animated-section/AnimatedSection";
import ScrambleText from "../scramble-text/ScrambleText";

interface Metric {
  value: string;
  label: string;
}

const metrics: Metric[] = [
  {
    value: "25",
    label: "Engineering teams onboarded to an agentic AI coding pipeline within 24 hours",
  },
  {
    value: "4",
    label: "LLMs orchestrated through one unified interface: Claude, GPT-4, Gemini, and Codex",
  },
  {
    value: "All levels",
    label: "Hands-on AI skill sessions delivered org-wide, from new grads to senior staff",
  },
];

const tools = [
  "Amazon Bedrock",
  "Claude",
  "GPT-4",
  "Gemini",
  "OpenAI Codex",
  "Claude Code",
  "Dynatrace",
  "iPerform",
];

const AiMlOps = () => {
  return (
    <section id="ai-ml-ops">
      <h5>Applied AI Engineering</h5>
      <ScrambleText text="AI/ML Ops" />
      <AnimatedSection>
        <div className="container aiops_container">
          <div className="aiops_body">
            <p>
              Beyond shipping individual AI features, most of my recent work has been about how an
              entire engineering organization adopts AI safely and effectively. That means
              evaluating which models and reasoning strategies actually fit a given workflow,
              designing context and prompting patterns that hold up under enterprise compliance
              requirements, and packaging the results into reusable, versioned skills that any team
              can pick up without reinventing the process.
            </p>
            <p>
              I built and rolled out an agentic AI pipeline that turns a Jira ticket into a
              production-ready pull request, routing each task to the right model across Amazon
              Bedrock and enforcing every team's own architectural and security standards through a
              persistent, self-improving instructions file. I've also contributed key mobile
              experiences for manager and advisor workflows and solution overview enhancements on
              JPMorganChase's iPerform platform, while supporting platform reliability and
              observability work such as Dynatrace instrumentation to keep those systems production
              ready.
            </p>
            <p>
              Just as much of the work has been teaching it. I've led hands-on AI skill-building
              sessions for engineers at every level, walking through practical techniques for model
              selection, reasoning strategies, and context design so teams can apply AI to their own
              work with confidence instead of guesswork. Shipping real AI systems while also
              teaching the organization how to use them well was recognized company-wide, including
              a shoutout during a recent leadership town hall for driving AI adoption across the
              org.
            </p>
            <div className="aiops_tags">
              {tools.map((tool) => (
                <span className="aiops_tag" key={tool}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div className="aiops_metrics">
            {metrics.map((metric) => (
              <article className="aiops_metric" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default AiMlOps;
