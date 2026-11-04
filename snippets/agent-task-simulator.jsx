// An illustration of what an agent task looks like while it runs.
//
// Every element shown here is taken from the agent documentation: the tool
// call cards, the reasoning lines between calls, the memory step labels, the
// generated file cards, and the footer. Tool names, parameters and durations
// are the ones quoted in "Anatomy of a Task Transcript". The figures in the
// replies are illustrative, and the component says so on screen.
export const AgentTaskSimulator = () => {
  const scenarios = [
    {
      key: "qc",
      agent: "Custom Agent",
      chip: "QC yesterday's push campaigns",
      prompt:
        "QC yesterday's push campaigns and email me the findings with the subject “Daily Push QC”.",
      steps: [
        { type: "tool", name: "search_campaigns", params: 'context="Finding all sent/active campaigns"', time: "4.9s" },
        { type: "think", text: "Campaign confirmed as Push channel. I need to run the personalization preview…" },
        { type: "tool", name: "get_campaign_meta", params: 'channel="push"', time: "2.1s" },
        { type: "memory", text: "Reading memory" },
        { type: "file", name: "Daily Push QC.xlsx", kind: "Spreadsheet", size: "48 KB" },
        { type: "reply", text: "**Verdict: go with fixes.** 6 of 7 campaigns passed. One has a locale gap: the fr-FR variant is missing a fallback on the Jinja token in the title. Summary emailed to you." },
      ],
    },
    {
      key: "retention",
      agent: "Global Agent",
      chip: "Analyze user retention",
      prompt: "Analyze user retention over the last 15 days.",
      steps: [
        { type: "tool", name: "Read campaign analytics", params: 'window="last 15 days"', time: "3.4s" },
        { type: "think", text: "Retention pulled for the window. Breaking the numbers down by day…" },
        { type: "file", name: "Retention analysis.docx", kind: "Document", size: "120 KB" },
        { type: "reply", text: "Day 1 retention is **6.5%**, against **11.2%** for the previous period. The drop concentrates in users who did not complete onboarding. Ask a follow-up in this task to go deeper." },
      ],
    },
    {
      key: "overlap",
      agent: "Global Agent",
      chip: "Export a segment overlap",
      prompt: "Export the segment overlap to a spreadsheet and email it to me with a one-paragraph summary.",
      steps: [
        { type: "tool", name: "Read segment data", params: 'segments="2"', time: "1.8s" },
        { type: "memory", text: "Searching memory" },
        { type: "file", name: "Segment overlap.xlsx", kind: "Spreadsheet", size: "36 KB" },
        { type: "reply", text: "The two segments share **18,420 users**, which is 31% of the smaller segment. Spreadsheet attached to the summary email sent to you." },
      ],
    },
  ];

  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(scenarios[0].steps.length); // first scenario renders complete
  const [running, setRunning] = useState(false);
  const timers = useRef([]);

  const reduceMotion = () => {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (err) {
      return false;
    }
  };

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const play = (index) => {
    clearTimers();
    setActive(index);
    const total = scenarios[index].steps.length;
    if (reduceMotion()) {
      setShown(total);
      setRunning(false);
      return;
    }
    setShown(0);
    setRunning(true);
    for (let i = 1; i <= total; i += 1) {
      timers.current.push(
        setTimeout(() => {
          setShown(i);
          if (i === total) setRunning(false);
        }, i * 620)
      );
    }
  };

  useEffect(() => clearTimers, []);

  const current = scenarios[active];
  const visible = current.steps.slice(0, shown);

  const Check = () => (
    <svg className="ats-check" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.2 3.2L13 5" />
    </svg>
  );

  const FileIcon = () => (
    <svg className="ats-fileicon" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" d="M9.2 1.6H4.3a1 1 0 0 0-1 1v10.8a1 1 0 0 0 1 1h7.4a1 1 0 0 0 1-1V5.1z" />
      <path fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" d="M9.2 1.6V5.1h3.5" />
    </svg>
  );

  // Bold spans marked with ** in the reply text, so figures stand out.
  const renderReply = (text) =>
    text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));

  return (
    <section className="ats not-prose" aria-labelledby="ats-title">
      <header className="ats-head">
        <div>
          <div className="ats-eyebrow" id="ats-title">
            What a task looks like
          </div>
          <div className="ats-sub">
            Choose a request to watch the agent work through it. The figures are illustrative.
          </div>
        </div>
        <button
          type="button"
          className="ats-replay"
          onClick={() => play(active)}
          disabled={running}
        >
          {running ? "Running…" : "Replay"}
        </button>
      </header>

      <div className="ats-chips" role="group" aria-label="Sample requests">
        {scenarios.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={i === active}
            className={"ats-chip" + (i === active ? " is-on" : "")}
            onClick={() => play(i)}
          >
            {s.chip}
          </button>
        ))}
      </div>

      <div className="ats-panel">
        <div className="ats-bar">
          <span className="ats-agent">{current.agent}</span>
          <span className="ats-state">{running ? "Running" : "Idle"}</span>
        </div>

        <div className="ats-prompt">{current.prompt}</div>

        <ol className="ats-steps" aria-live="polite">
          {visible.map((step, i) => {
            if (step.type === "tool") {
              return (
                <li key={i} className="ats-step ats-step--tool">
                  <Check />
                  <code className="ats-tool">{step.name}</code>
                  <span className="ats-params">{step.params}</span>
                  <span className="ats-time">{step.time}</span>
                </li>
              );
            }
            if (step.type === "memory") {
              return (
                <li key={i} className="ats-step ats-step--memory">
                  {step.text}
                </li>
              );
            }
            if (step.type === "think") {
              return (
                <li key={i} className="ats-step ats-step--think">
                  {step.text}
                </li>
              );
            }
            if (step.type === "file") {
              return (
                <li key={i} className="ats-step ats-step--file">
                  <FileIcon />
                  <span className="ats-filename">{step.name}</span>
                  <span className="ats-filemeta">
                    {step.kind} &middot; {step.size}
                  </span>
                </li>
              );
            }
            return (
              <li key={i} className="ats-step ats-step--reply">
                {renderReply(step.text)}
              </li>
            );
          })}
        </ol>

        <div className="ats-foot">Agents can make mistakes. Verify any figure that drives a decision.</div>
      </div>
    </section>
  );
};
