export const MerlinShowcase = () => {
  // Production serves the docs under /docs. Mintlify prefixes links itself, so
  // hrefs stay root-relative, but image sources are not rewritten and need the
  // base added at runtime. Local dev and previews serve from the root.
  // null until mounted, so the image never requests the wrong path first.
  const [base, setBase] = useState(null);
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const trackRef = useRef(null);
  const reelRef = useRef(null);
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 });

  const Spark = ({ className }) => (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0c.4 3.9 2.1 6.4 8 8-5.9 1.6-7.6 4.1-8 8-.4-3.9-2.1-6.4-8-8C5.9 6.4 7.6 3.9 8 0Z"
      />
    </svg>
  );

  const Prompt = ({ children }) => (
    <div className="mv-prompt">
      <Spark className="mv-spark" />
      <span>
        “{children}”<i className="mv-caret" />
      </span>
    </div>
  );

  const Bar = ({ w, strong }) => (
    <span className={strong ? "mv-bar mv-bar--strong" : "mv-bar"} style={{ width: w }} />
  );

  // Every prompt, label, and sample string below is quoted from the linked
  // guide. Output areas that the docs don't specify are drawn as skeleton bars.
  const slides = [
    {
      key: "designer",
      eyebrow: "Designer",
      title: "Turn a description into a banner",
      desc: "Describe the visual you want and get a campaign banner sized for email, in-app, push, and social placements.",
      href: "/user-guide/ai-and-intelligence/merlin-ai/merlin-ai-designer/merlin-ai-designer",
      tone: "deep",
      visual: (
        <>
          <Prompt>A dynamic, high-energy shot of a person in sleek, colourful activewear, captured mid-run…</Prompt>
          {/* A real Designer output for this prompt, from the Merlin AI Designer docs. */}
          <div className="mv-banner">
            {base !== null && (
              <img className="mv-banner-img" src={base + "/images/merlin-designer-activewear-banner.jpg"} alt="" loading="lazy" draggable={false} />
            )}
          </div>
        </>
      ),
    },
    {
      key: "copywriter",
      eyebrow: "Copywriter",
      title: "Write copy in your brand tone",
      desc: "Give the campaign context, audience, and tone, and get push, email, in-app, and on-site message copy.",
      href: "/user-guide/ai-and-intelligence/merlin-ai/merlin-ai-copywriter/merlin-ai-copywriter",
      tone: "bolt",
      visual: (
        <>
          <div className="mv-panel mv-form">
            <span className="mv-label">Audience</span>
            <Bar w="72%" />
            <span className="mv-label">Tone</span>
            <Bar w="46%" />
            <span className="mv-label">Style</span>
            <Bar w="58%" />
          </div>
          <div className="mv-panel mv-notif">
            <span className="mv-notif-icon" />
            <span className="mv-notif-lines">
              <Bar w="62%" strong />
              <Bar w="92%" />
              <Bar w="70%" />
            </span>
          </div>
          <div className="mv-chips">
            <span className="mv-chip">Push</span>
            <span className="mv-chip">Email</span>
            <span className="mv-chip">In-app</span>
            <span className="mv-chip">On-site</span>
          </div>
        </>
      ),
    },
    {
      key: "in-app",
      eyebrow: "In-App Template Generator",
      title: "Generate in-app templates from a prompt",
      desc: "Build responsive pop-ups with coupon codes, countdown timers, spin-the-wheel games, and survey forms.",
      href: "/user-guide/ai-and-intelligence/merlin-ai/merlin-ai-in-app-template-generator/merlin-ai-in-app-template-generator",
      tone: "flow",
      visual: (
        <>
          <div className="mv-chips">
            <span className="mv-chip">Nudge</span>
            <span className="mv-chip">First-purchase conversion</span>
          </div>
          <div className="mv-phone">
            <div className="mv-popup">
              <span className="mv-popup-x">×</span>
              <span className="mv-popup-title">Welcome! Here's 15% off your first order.</span>
              <span className="mv-popup-sub">Use the code at checkout. Valid for 7 days.</span>
              <span className="mv-popup-code">
                <b>WELCOME15</b>
                <em>Copy code</em>
              </span>
              <span className="mv-popup-btn">Shop now</span>
            </div>
          </div>
        </>
      ),
    },
    {
      key: "flows",
      eyebrow: "Flows Assist",
      title: "Sketch a journey in one sentence",
      desc: "Describe a goal and get a flow on the canvas with triggers, channels, and timing chosen from your data.",
      href: "/user-guide/ai-and-intelligence/merlin-ai/merlin-ai-flows-assist",
      tone: "deep",
      visual: (
        <>
          <Prompt>My campaign has high cart abandonment; create a flow to handle this</Prompt>
          <div className="mv-flow">
            <span className="mv-node mv-node--start">Trigger</span>
            <span className="mv-arrow">→</span>
            <span className="mv-node">Push</span>
            <span className="mv-arrow">→</span>
            <span className="mv-node">Email</span>
            <span className="mv-arrow">→</span>
            <span className="mv-node mv-node--end">Exit</span>
          </div>
        </>
      ),
    },
    {
      key: "segment",
      eyebrow: "Segment Assist",
      title: "Describe the audience you want",
      desc: "Type the audience in plain English and get the matching event and attribute filters.",
      href: "/user-guide/ai-and-intelligence/merlin-ai/merlin-ai-segment-assist",
      tone: "bolt",
      visual: (
        <>
          <Prompt>Segment users who opened the app in the last 7 days.</Prompt>
          <div className="mv-panel mv-filters">
            <span className="mv-filter">
              <span className="mv-label">Event</span>
              <Bar w="54%" strong />
            </span>
            <span className="mv-and">and</span>
            <span className="mv-filter">
              <span className="mv-label">Time</span>
              <Bar w="40%" strong />
            </span>
          </div>
        </>
      ),
    },
    {
      key: "jinja",
      eyebrow: "Jinja Assistant",
      title: "Get personalization code from plain English",
      desc: "Describe the logic you need and get working Jinja for your message.",
      href: "/user-guide/ai-and-intelligence/merlin-ai/merlin-ai-jinja-generator/merlin-ai-jinja-assistant",
      tone: "flow",
      visual: (
        <>
          <Prompt>Print all the values from the event attribute["Product Titles"] of array data type.</Prompt>
          <pre className="mv-code">
            <span className="t">{"{%"}</span> <span className="k">for</span> title <span className="k">in</span> EventAttribute[<span className="s">'Product Titles'</span>] <span className="t">{"%}"}</span>
            {"\n  "}
            <span className="t">{"{{"}</span> title <span className="t">{"}}"}</span>
            {"\n"}
            <span className="t">{"{%"}</span> <span className="k">endfor</span> <span className="t">{"%}"}</span>
          </pre>
        </>
      ),
    },
    {
      key: "insights",
      eyebrow: "Campaign Insights Agent",
      title: "Ask why a metric moved",
      desc: "Ask about a campaign's performance and get answers grounded in your own workspace history.",
      href: "/user-guide/ai-and-intelligence/merlin-ai/campaign-insights-agent",
      tone: "deep",
      visual: (
        <>
          <span className="mv-bubble mv-bubble--me">Why is the click rate low?</span>
          <div className="mv-bubble mv-bubble--ai">
            <Spark className="mv-spark" />
            <span className="mv-funnel">
              <span><i>Sent</i><b style={{ width: "100%" }} /></span>
              <span><i>Delivered</i><b style={{ width: "84%" }} /></span>
              <span><i>Opened</i><b style={{ width: "46%" }} /></span>
              <span><i>Clicked</i><b className="hot" style={{ width: "12%" }} /></span>
            </span>
          </div>
        </>
      ),
    },
    {
      key: "agents",
      eyebrow: "Custom Agents",
      title: "Build agents that work together",
      desc: "Create agents for jobs like quality control, localization, and analysis, and let a coordinator delegate to them.",
      href: "/user-guide/ai-and-intelligence/merlin-ai/custom-agents/custom-agents-overview",
      tone: "bolt",
      visual: (
        <div className="mv-agents">
          <span className="mv-coord">
            <Spark className="mv-spark" />
            Coordinator
          </span>
          <span className="mv-wires" />
          <span className="mv-subs">
            <span className="mv-sub">Quality control</span>
            <span className="mv-sub">Localization</span>
            <span className="mv-sub">Data analysis</span>
            <span className="mv-sub">Campaign drafting</span>
          </span>
        </div>
      ),
    },
    {
      key: "mcp",
      eyebrow: "MoEngage MCP Server",
      title: "Work from Claude or ChatGPT",
      desc: "Connect your AI assistant to your workspace to build campaigns, manage segments, and analyze performance.",
      href: "/user-guide/ai-and-intelligence/merlin-ai/moengage-mcp-server",
      tone: "flow",
      visual: (
        <>
          <div className="mv-chips">
            <span className="mv-chip mv-chip--on">
              <svg className="mv-logo" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
              </svg>
              Claude
            </span>
            <span className="mv-chip">
              <svg className="mv-logo" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
              </svg>
              ChatGPT
            </span>
          </div>
          <span className="mv-bubble mv-bubble--me">What's the CTR for my email campaigns over the last 2 weeks?</span>
          <span className="mv-tool">get_campaign_stats</span>
          <div className="mv-bubble mv-bubble--ai mv-bubble--lines">
            <Bar w="88%" />
            <Bar w="64%" />
          </div>
        </>
      ),
    },
    {
      key: "context",
      eyebrow: "Context Hub",
      title: "Teach Merlin AI your brand",
      desc: "Store brand guidelines, voice, and business context once, and reuse them across MoEngage workflows.",
      href: "/user-guide/ai-and-intelligence/merlin-ai/context-hub",
      tone: "deep",
      visual: (
        <div className="mv-panel mv-context">
          <span className="mv-context-head">
            <Spark className="mv-spark" />
            AI Inferred context
          </span>
          <span className="mv-swatches">
            <i style={{ background: "#2554CC" }} />
            <i style={{ background: "#0E1F4D" }} />
            <i style={{ background: "#FFF9EE" }} />
            <i style={{ background: "#DAFF02" }} />
          </span>
          <span className="mv-context-row"><span className="mv-label">Visual system</span><Bar w="38%" /></span>
          <span className="mv-context-row"><span className="mv-label">Identity</span><Bar w="52%" /></span>
          <span className="mv-context-row"><span className="mv-label">Brand voice and tone</span><Bar w="30%" /></span>
          <span className="mv-context-row"><span className="mv-label">Formatting</span><Bar w="44%" /></span>
        </div>
      ),
    },
  ];

  const total = slides.length + 1;
  const fmt = (n) => String(n).padStart(2, "0");

  useEffect(() => {
    const p = window.location.pathname;
    setBase(p === "/docs" || p.startsWith("/docs/") ? "/docs" : "");
  }, []);

  const cards = () => (trackRef.current ? Array.from(trackRef.current.querySelectorAll("[data-merlin-slide]")) : []);
  const padLeft = () => (trackRef.current ? parseFloat(getComputedStyle(trackRef.current).paddingLeft) || 0 : 0);

  const nearest = () => {
    const el = trackRef.current;
    if (!el) return 0;
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) return total - 1;
    const edge = el.getBoundingClientRect().left + padLeft();
    let best = 0;
    let bestDist = Infinity;
    cards().forEach((c, i) => {
      const d = Math.abs(c.getBoundingClientRect().left - edge);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };

  const goTo = (i) => {
    const el = trackRef.current;
    const list = cards();
    if (!el || !list.length) return;
    const idx = Math.max(0, Math.min(total - 1, i));
    // Update right away so rapid clicks advance from the target, not from
    // wherever the smooth scroll happens to be. Scrolling then confirms it.
    setActive(idx);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: list[idx].offsetLeft - padLeft(), behavior: reduce ? "auto" : "smooth" });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(nearest()));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Autoplay: the active dot fills over a few seconds, and when it finishes
  // the reel moves on, wrapping back to the first card. Hovering, focusing, or
  // dragging holds it, and so does scrolling the reel out of view. Reduced
  // motion turns the fill off, which turns autoplay off with it.
  useEffect(() => {
    const el = reelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const advance = () => goTo(active + 1 >= total ? 0 : active + 1);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  // Mouse drag-to-swipe. Touch and trackpads already scroll natively.
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { down: true, moved: false, startX: e.clientX, startLeft: trackRef.current.scrollLeft };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      trackRef.current.classList.add("is-dragging");
      try {
        trackRef.current.setPointerCapture(e.pointerId);
      } catch (err) {
        // Capture is a nicety; dragging still works without it.
      }
    }
    if (d.moved) trackRef.current.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (d.moved) {
      trackRef.current.classList.remove("is-dragging");
      goTo(nearest());
    }
  };
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <section
      ref={reelRef}
      className={"merlin-reel not-prose" + (hold || offscreen ? " is-paused" : "")}
      aria-labelledby="merlin-reel-title"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHold(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHold(false)}
    >
      <div className="merlin-reel-head">
        <div className="merlin-reel-intro">
          <p className="merlin-eyebrow">
            {/* The Merlin AI wordmark from logo/merlin-logo.svg, in its brand gradient. */}
            <svg className="merlin-wordmark" viewBox="0 0 384 88" role="img" aria-label="Merlin AI">
              <defs>
                <linearGradient id="merlin-wordmark-grad" x1="0.5" y1="44" x2="383.5" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF6316" />
                  <stop offset="0.5" stopColor="#FF5FCE" />
                  <stop offset="1" stopColor="#7239FF" />
                </linearGradient>
              </defs>
              <g fill="url(#merlin-wordmark-grad)">
              <path d="M349.115 87.8468H323.249L292.973 1.47476H318.839L349.115 87.8468Z" />
              <path d="M383.5 87.8465H356.993L337.536 31.4793H363.573L383.5 87.8465Z" />
              <path d="M346.235 26.0539C353.409 26.0539 359.224 20.2215 359.224 13.0269C359.224 5.83236 353.409 0 346.235 0C339.062 0 333.247 5.83236 333.247 13.0269C333.247 20.2215 339.062 26.0539 346.235 26.0539Z" />
              <path d="M292.974 72.6936C300.147 72.6936 305.962 66.8612 305.962 59.6666C305.962 52.4721 300.147 46.6397 292.974 46.6397C285.8 46.6397 279.985 52.4721 279.985 59.6666C279.985 66.8612 285.8 72.6936 292.974 72.6936Z" />
              <path d="M63.2981 86.5602V38.7633L43.7383 86.5602H32.7151L13.1553 39.1576V86.5602H0.5V18.383H17.9491L38.372 67.6197L58.3163 18.383H76.338V86.5602H63.2981Z" />
              <path d="M130.984 73.0019C128.583 81.178 121.106 88 109.51 88C96.5645 88 85.1567 78.6755 85.1567 62.7089C85.1567 47.6079 96.2825 37.8034 108.357 37.8034C122.935 37.8034 131.651 47.128 131.651 62.3232C131.651 64.1487 131.463 66.077 131.463 66.2656H97.7095C98.0001 72.5134 103.272 77.0385 109.596 77.0385C115.543 77.0385 118.799 74.056 120.337 69.8309L130.976 73.0019H130.984ZM119.098 57.5238C118.91 52.8101 115.842 48.1993 108.553 48.1993C101.939 48.1993 98.2906 53.1958 98.0086 57.5238H119.098Z" />
              <path d="M168.95 51.9444C167.515 51.653 166.267 51.5587 165.113 51.5587C158.594 51.5587 152.937 54.7298 152.937 64.9285V86.5686H140.187V39.2603H152.552V46.2794C155.432 40.0316 161.952 38.8746 165.977 38.8746C167.028 38.8746 167.993 38.9689 168.95 39.0717V51.953V51.9444Z" />
              <path d="M175.666 86.5605V16.9436H188.415V86.5605H175.666Z" />
              <path d="M206.053 15.7865C210.463 15.7865 213.915 19.3432 213.915 23.7655C213.915 28.1878 210.463 31.5559 206.053 31.5559C201.644 31.5559 198.192 27.9992 198.192 23.7655C198.192 19.5317 201.738 15.7865 206.053 15.7865ZM199.73 86.5604V39.2521H212.479V86.5604H199.73Z" />
              <path d="M236.542 86.561H223.793V39.2527H236.157V45.1148C239.037 40.2126 244.694 38.0014 249.77 38.0014C261.468 38.0014 266.834 46.3661 266.834 56.7533V86.561H254.085V58.9645C254.085 53.6766 251.496 49.5371 245.36 49.5371C239.798 49.5371 236.542 53.8651 236.542 59.3416V86.561Z" />
              </g>
            </svg>
          </p>
          <h2 id="merlin-reel-title" className="merlin-headline">
            Say what you need. <strong>Merlin AI drafts, builds, and explains.</strong>
          </h2>
        </div>
        <div className="merlin-controls">
          <span className="merlin-counter" aria-hidden="true">
            {fmt(active + 1)} / {fmt(total)}
          </span>
          <button type="button" className="merlin-arrow" aria-label="Previous capability" disabled={active === 0} onClick={() => goTo(active - 1)}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
          </button>
          <button type="button" className="merlin-arrow" aria-label="Next capability" disabled={active === total - 1} onClick={() => goTo(active + 1)}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="merlin-track"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Merlin AI capabilities. Use the left and right arrow keys to move between cards."
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {slides.map((s, i) => (
          <a
            key={s.key}
            href={s.href}
            className="merlin-card"
            data-merlin-slide=""
            draggable={false}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}: ${s.eyebrow}. ${s.title}.`}
          >
            <div className={`mv mv--${s.tone}`} aria-hidden="true">
              {s.visual}
            </div>
            <div className="merlin-card-body">
              <span className="merlin-card-title">{s.title}</span>
              <span className="merlin-card-desc">{s.desc}</span>
              <span className="merlin-card-cta">Open the {s.eyebrow} guide</span>
            </div>
          </a>
        ))}

        <a
          href="/user-guide/ai-and-intelligence/overview"
          className="merlin-card merlin-card--end"
          data-merlin-slide=""
          draggable={false}
          role="group"
          aria-roledescription="slide"
          aria-label={`${total} of ${total}: Explore AI and Intelligence`}
        >
          <Spark className="merlin-end-spark" />
          <span className="merlin-end-title">There's more beyond the prompt box.</span>
          <span className="merlin-end-desc">
            Predictions, campaign decisioning, send-time optimization, and A/B testing.
          </span>
          <span className="merlin-btn">Explore the guide</span>
        </a>
      </div>

      <div className="merlin-dots">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            className="merlin-dot"
            aria-label={`Go to card ${i + 1} of ${total}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => goTo(i)}
            onAnimationEnd={i === active ? advance : undefined}
          />
        ))}
      </div>

      <p className="merlin-sr" aria-live="polite">
        {`Card ${active + 1} of ${total}`}
      </p>
    </section>
  );
};
