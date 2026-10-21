export const HomeHero = () => {
  const ribbonRef = useRef(null);
  const boxRef = useRef(null);

  // The hero's brand scene, fixed to the viewport so it shifts gently as the
  // page scrolls.
  const Sky = () => (
    <span className="hp-sky" aria-hidden="true">
      <span className="hp-sky-scene">
        <span className="hp-pl hp-pl--1" />
        <span className="hp-pl hp-pl--2" />
        <span className="hp-pl hp-pl--3" />
        <span className="hp-pl hp-pl--4" />
        <span className="hp-pl hp-pl--5" />
        <span className="hp-sky-grain" />
      </span>
    </span>
  );

  const ICON = {
    globe: [<circle key="a" cx="12" cy="12" r="9" />, <path key="b" d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />],
    bell: [<path key="a" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />, <path key="b" d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />],
    cart: [<circle key="a" cx="9" cy="20" r="1" />, <circle key="b" cx="18" cy="20" r="1" />, <path key="c" d="M2 3h3l2.4 12.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 7H6" />],
    mail: [<rect key="a" x="2" y="4" width="20" height="16" rx="2" />, <path key="b" d="m22 7-10 6L2 7" />],
    bag: [<path key="a" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />, <path key="b" d="M3 6h18" />, <path key="c" d="M16 10a4 4 0 0 1-8 0" />],
    chat: [<path key="a" d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />],
  };
  const Icon = ({ name }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {ICON[name]}
    </svg>
  );

  // An illustrative lifecycle: the channels are ones MoEngage supports, and the
  // events are generic examples rather than product data. Messages sit above
  // the ribbon and the user's own actions below it.
  const VB_W = 600;
  const VB_H = 300;
  const MID = 150;
  const waveY = (x) => MID + 14 * Math.sin((2 * Math.PI * (x + 40)) / 420);
  const NODES = [
    { x: 44, icon: "globe", tag: "Event", label: "Visits your site", short: "Visit", side: "below", align: "start" },
    { x: 146, icon: "bell", tag: "Push", label: "Welcome offer", short: "Push", side: "above" },
    { x: 248, icon: "cart", tag: "Event", label: "Adds to cart", short: "Add to cart", side: "below" },
    { x: 350, icon: "mail", tag: "Email", label: "Cart reminder", short: "Email", side: "above" },
    { x: 452, icon: "bag", tag: "Event", label: "Purchases", short: "Purchase", side: "below" },
    { x: 556, icon: "chat", tag: "WhatsApp", label: "Order update", short: "WhatsApp", side: "above", align: "end" },
  ].map((n) => ({ ...n, y: waveY(n.x) }));
  // Card edges, in viewBox units: above-cards end here, below-cards start here.
  const ABOVE = 98;
  const BELOW = 202;
  let RIBBON = "";
  for (let x = -60; x <= 660; x += 10) {
    RIBBON += (x === -60 ? "M " : " L ") + x + " " + waveY(x).toFixed(2);
  }
  const GLYPHS = "{ } < / > ; : = + * # % ~ ^ $ @ [ ] | ! ? 0 1 0 1 ";
  const LANES = [
    { key: "c", dy: 0, size: 11, reps: 5, speed: 22 },
    { key: "a", dy: -21, size: 8.5, reps: 6, speed: 13 },
    { key: "b", dy: 21, size: 8.5, reps: 6, speed: 16 },
  ];

  // Glyphs drift along the ribbon without end: each lane repeats its pattern,
  // so shifting by one pattern width is seamless and nothing ever restarts.
  useEffect(() => {
    const root = ribbonRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lanes = LANES.map((l) => {
      const text = root.querySelector('[data-lane="' + l.key + '"]');
      return { ...l, text, tp: text && text.querySelector("textPath"), unit: 0 };
    }).filter((l) => l.tp);
    const measure = () => {
      lanes.forEach((l) => {
        l.unit = l.text.getComputedTextLength() / l.reps;
      });
    };
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    const start = performance.now();
    let raf = 0;
    let visible = true;
    const tick = (now) => {
      raf = 0;
      const t = (now - start) / 1000;
      lanes.forEach((l) => {
        if (l.unit > 0) l.tp.setAttribute("startOffset", String(((t * l.speed) % l.unit) - l.unit));
      });
      if (visible) raf = requestAnimationFrame(tick);
    };
    // Pause while the hero is scrolled out of view.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    if (boxRef.current) io.observe(boxRef.current);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  // Gentle mouse parallax on the shared scene's planes, page-wide.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    let raf = 0;
    let ev = null;
    const apply = () => {
      raf = 0;
      if (!ev) return;
      root.style.setProperty("--hp-mx", (ev.clientX / window.innerWidth - 0.5).toFixed(3));
      root.style.setProperty("--hp-my", (ev.clientY / window.innerHeight - 0.5).toFixed(3));
    };
    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      ev = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      root.style.removeProperty("--hp-mx");
      root.style.removeProperty("--hp-my");
    };
  }, []);

  // Open Mintlify's own search: click whichever header search button is
  // visible (desktop or mobile), and fall back to the keyboard shortcut.
  const openSearch = () => {
    const entry = ["search-bar-entry", "search-bar-entry-mobile"]
      .map((id) => document.getElementById(id))
      .find((el) => el && el.getBoundingClientRect().width > 0);
    if (entry) {
      entry.click();
      return;
    }
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", code: "KeyK", metaKey: true, ctrlKey: true, bubbles: true }));
  };

  const links = [
    { label: "User Guide", href: "/user-guide/introduction" },
    { label: "Developer Guide", href: "/developer-guide/introduction" },
    { label: "API Guide", href: "/api/introduction" },
    { label: "Partners", href: "/partner-guide/introduction" },
    { label: "Use Cases", href: "/use-cases/introduction" },
  ];

  return (
    <section className="hp-hero not-prose">
      <Sky />

      <div className="hp-hero-body">
        <h1 className="hp-hero-title">
          Engage your users with <strong>intelligent, cross-channel</strong> experiences
        </h1>

        <button type="button" className="hp-search" onClick={openSearch}>
          <svg className="hp-search-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="hp-search-text">Ask anything about MoEngage</span>
          <kbd className="hp-search-kbd">⌘K</kbd>
        </button>

        <nav className="hp-hero-links" aria-label="Documentation sections">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hp-chip">
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="hp-journey" aria-hidden="true">
        <div className="hp-journey-box" ref={boxRef}>
          <svg className="hp-journey-svg" viewBox={"0 0 " + VB_W + " " + VB_H} ref={ribbonRef}>
            <defs>
              <path id="hp-ribbon" d={RIBBON} />
              {/* The ribbon fades in from the left, so it seems to arrive from the copy. */}
              <linearGradient id="hp-rib-fade" gradientUnits="userSpaceOnUse" x1="-40" y1="0" x2="40" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="1" stopColor="#fff" stopOpacity="1" />
              </linearGradient>
              <mask id="hp-rib-mask" maskUnits="userSpaceOnUse" x="-80" y="0" width="760" height="300">
                <rect x="-80" y="0" width="760" height="300" fill="url(#hp-rib-fade)" />
              </mask>
            </defs>
            <g mask="url(#hp-rib-mask)">
            <use href="#hp-ribbon" className="hp-rib-glow" />
            <use href="#hp-ribbon" className="hp-rib-band" />
            {LANES.map((l) => (
              <g key={l.key} transform={"translate(0 " + l.dy + ")"}>
                <text data-lane={l.key} className={"hp-rib-text hp-rib-text--" + l.key} fontSize={l.size} dy={l.size * 0.35}>
                  <textPath href="#hp-ribbon" startOffset={-l.size * 30}>
                    {GLYPHS.repeat(l.reps)}
                  </textPath>
                </text>
              </g>
            ))}
            </g>
            {NODES.map((n, i) => (
              <g key={n.label} style={{ "--hp-i": i }}>
                <line className="hp-jline" x1={n.x} x2={n.x} y1={n.side === "above" ? n.y - 8 : n.y + 8} y2={n.side === "above" ? ABOVE : BELOW} />
                <circle className="hp-jhalo" cx={n.x} cy={n.y} r="11" />
                <circle className="hp-jnode" cx={n.x} cy={n.y} r="4.5" />
              </g>
            ))}
          </svg>
          {NODES.map((n) => (
            <div
              key={n.label}
              className={"hp-jcard hp-jcard--" + n.side + (n.align ? " hp-jcard--" + n.align : "")}
              style={{ left: (n.x / VB_W) * 100 + "%", top: ((n.side === "above" ? ABOVE : BELOW) / VB_H) * 100 + "%" }}
            >
              <span className="hp-jcard-ico">
                <Icon name={n.icon} />
              </span>
              <span className="hp-jcard-text">
                <span className="hp-jcard-tag">{n.tag}</span>
                <span className="hp-jcard-label">{n.label}</span>
              </span>
              <span className="hp-jcard-short">{n.short}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const HomeSections = () => {
  const [copied, setCopied] = useState(null);


  const ICON = {
    layout: [<rect key="a" x="3" y="3" width="18" height="18" rx="2" />, <path key="b" d="M3 9h18M9 21V9" />],
    list: [<path key="a" d="m9 11 3 3 8-8" />, <path key="b" d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />],
    database: [<ellipse key="a" cx="12" cy="5" rx="9" ry="3" />, <path key="b" d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" />, <path key="c" d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />],
    users: [<path key="a" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />, <circle key="b" cx="9" cy="7" r="4" />, <path key="c" d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />],
    send: [<path key="a" d="M22 2 11 13" />, <path key="b" d="M22 2l-7 20-4-9-9-4 20-7Z" />],
    flow: [<rect key="a" x="3" y="3" width="7" height="7" rx="1.5" />, <rect key="b" x="14" y="14" width="7" height="7" rx="1.5" />, <path key="c" d="M7 10v4a3 3 0 0 0 3 3h4" />],
    chart: [<path key="a" d="M3 3v18h18" />, <path key="b" d="m7 15 4-4 3 3 6-7" />],
    spark: [<path key="a" d="M12 3c.6 4.6 2.6 7.2 9 9-6.4 1.8-8.4 4.4-9 9-.6-4.6-2.6-7.2-9-9 6.4-1.8 8.4-4.4 9-9Z" />],
    wand: [<path key="a" d="m15 4 5 5L9 20H4v-5L15 4Z" />, <path key="b" d="m12 7 5 5" />],
    phone: [<rect key="a" x="6" y="2" width="12" height="20" rx="2.5" />, <path key="b" d="M11 18h2" />],
    globe: [<circle key="a" cx="12" cy="12" r="9" />, <path key="b" d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />],
    code: [<path key="a" d="m16 18 6-6-6-6" />, <path key="b" d="m8 6-6 6 6 6" />],
    box: [<path key="a" d="M21 8v8a2 2 0 0 1-1 1.7l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.7l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8Z" />, <path key="b" d="m3.3 7 8.7 5 8.7-5M12 22V12" />],
    message: [<path key="a" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />],
    chat: [<path key="a" d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />],
    mail: [<rect key="a" x="2" y="4" width="20" height="16" rx="2" />, <path key="b" d="m22 7-10 6L2 7" />],
    bell: [<path key="a" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />, <path key="b" d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />],
    layers: [<path key="a" d="m12 2 10 5-10 5L2 7l10-5Z" />, <path key="b" d="m2 12 10 5 10-5M2 17l10 5 10-5" />],
    bag: [<path key="a" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />, <path key="b" d="M3 6h18" />, <path key="c" d="M16 10a4 4 0 0 1-8 0" />],
    receipt: [<path key="a" d="M5 2v20l3-2 2 2 2-2 2 2 2-2 3 2V2l-3 2-2-2-2 2-2-2-2 2-3-2Z" />, <path key="b" d="M9 8h6M9 12h6" />],
    notes: [<path key="a" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />, <path key="b" d="M14 2v6h6M9 13h6M9 17h4" />],
  };
  const Icon = ({ name }) => (
    <svg className="hp-ico" viewBox="0 0 24 24" aria-hidden="true">
      {ICON[name]}
    </svg>
  );

  const openSearch = () => {
    const entry = ["search-bar-entry", "search-bar-entry-mobile"]
      .map((id) => document.getElementById(id))
      .find((el) => el && el.getBoundingClientRect().width > 0);
    if (entry) {
      entry.click();
      return;
    }
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", code: "KeyK", metaKey: true, ctrlKey: true, bubbles: true }));
  };

  // Claude and ChatGPT marks (Simple Icons, CC0), shown where the copy names
  // those assistants.
  const Logo = ({ name }) =>
    name === "claude" ? (
      <svg className="hp-logo hp-logo--claude" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
      </svg>
    ) : (
      <svg className="hp-logo hp-logo--openai" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
      </svg>
    );

  const copy = (key, text) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied((k) => (k === key ? null : k)), 1600);
    });
  };

  const Head = ({ title, em, aside, link }) => (
    <div className="hp-head">
      <hr className="hp-rule" />
      <div className="hp-head-row">
        <div>
          <h2 className="hp-h2">
            {title} <strong>{em}</strong>
          </h2>
        </div>
        {(aside || link) && (
          <div className="hp-head-aside">
            {aside && <p>{aside}</p>}
            {link && (
              <a className="hp-inline" href={link.href}>
                {link.label} <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const stages = [
    {
      num: "01",
      name: "Set up",
      blurb: "Get to know the dashboard, integrate the SDKs, and bring in your data.",
      cards: [
        { icon: "layout", title: "Dashboard overview", desc: "Familiarize yourself with the MoEngage dashboard, navigation, and key concepts.", href: "/user-guide/getting-started/initial-setup/dashboard-overview" },
        { icon: "list", title: "Integration checklist", desc: "Integrate MoEngage SDKs across Web, Android, iOS, and other platforms.", href: "/user-guide/getting-started/integration/integration-checklist" },
        { icon: "database", title: "Data", desc: "User and event data, imports, exports, privacy, and how data is modeled in MoEngage.", href: "/user-guide/data/key-concepts/overview-data" },
      ],
    },
    {
      num: "02",
      name: "Engage",
      blurb: "Build audiences and reach them across every channel.",
      cards: [
        { icon: "users", title: "Segments", desc: "Build and manage audiences with segmentation, reachability, and advanced segment tools.", href: "/user-guide/segment/getting-started/basics-of-segmentation" },
        { icon: "send", title: "Campaigns & channels", desc: "Email, push, SMS, WhatsApp, in-app, and cross-channel messaging from the dashboard.", href: "/user-guide/campaigns-and-channels/getting-started/introduction/moengage-channels" },
        { icon: "flow", title: "Flows", desc: "Cross-channel journeys: triggers, branches, experiments, and flow analytics.", href: "/user-guide/flows-cross-channel-messaging/getting-started/overview-flows/overview-flows" },
      ],
    },
    {
      num: "03",
      name: "Analyze and optimize",
      blurb: "Measure what works, then personalize and optimize with AI.",
      cards: [
        { icon: "chart", title: "Analytics", desc: "Dashboards, behavior, funnels, retention, and custom analysis for your users and campaigns.", href: "/user-guide/analyze/moengage-analytics/overview" },
        { icon: "spark", title: "AI & Intelligence", desc: "Generate campaign content with Merlin AI, forecast user behavior, and optimize send time and channel.", href: "/user-guide/ai-and-intelligence/overview" },
        { icon: "wand", title: "Personalize", desc: "Client- and server-side web personalization, editor capabilities, and split URL testing.", href: "/user-guide/personalize/overview/overview-personalize" },
      ],
    },
  ];

  const sdks = [
    { icon: "phone", label: "iOS", href: "/developer-guide/ios-sdk/sdk-integration/basic/sdk-integration" },
    { icon: "phone", label: "Android", href: "/developer-guide/android-sdk/sdk-integration/basic-integration/Install-Using-BOM" },
    { icon: "globe", label: "Web", href: "/developer-guide/web-sdk/web-sdk-overview/web-sdk-overview" },
    { icon: "code", label: "React Native", href: "/developer-guide/react-native-sdk/overview/getting-started-with-react-native-sdk" },
    { icon: "code", label: "Flutter", href: "/developer-guide/flutter-sdk/overview/getting-started-with-flutter-sdk" },
    { icon: "box", label: "Unity", href: "/developer-guide/unity-sdk/sdk-integration/sdk-installation/sdk-installation" },
    { icon: "notes", label: "API Guide", href: "/api/introduction" },
  ];

  // The product MCP connects an assistant to a MoEngage workspace; the docs
  // MCP connects it to this site. Values match the MCP server and agent access
  // pages.
  const mcp = [
    {
      key: "product",
      title: "MoEngage MCP",
      sub: "Your workspace",
      desc: "Build campaign drafts, create and count segments, read flows, and analyze performance through conversation.",
      rows: [{ key: "server", label: "Server", value: "https://mcp.moengage.com" }],
      external: { label: "Claude directory", href: "https://claude.ai/directory/moengage-mcp" },
      link: { label: "Connect your workspace", href: "/user-guide/ai-and-intelligence/merlin-ai/moengage-mcp-server" },
    },
    {
      key: "docs",
      title: "Docs MCP",
      sub: "This documentation",
      desc: "Search and fetch MoEngage docs from your IDE or chat while you integrate.",
      rows: [
        { key: "mcp", label: "MCP", value: "https://www.moengage.com/docs/mcp" },
        { key: "claude", label: "Claude Code", logo: "claude", value: "claude mcp add --transport http MoEngage-docs https://www.moengage.com/docs/mcp" },
        { key: "llms", label: "llms.txt", value: "https://www.moengage.com/docs/llms.txt" },
      ],
      link: { label: "Set up agent access", href: "/documentation-access-to-agents" },
    },
  ];

  const partners = [
    { icon: "message", title: "SMS Providers", desc: "Twilio, Infobip, Gupshup, Sinch, and Kaleyra.", href: "/partner-guide/messaging-channels/sms-providers/configure-twilio" },
    { icon: "chat", title: "WhatsApp Providers", desc: "Meta (direct), Gupshup, Infobip, and Kaleyra.", href: "/partner-guide/messaging-channels/whatsapp-providers/meta/configure-meta-sender" },
    { icon: "message", title: "RCS Providers", desc: "Gupshup, Infobip, Sinch India, and ValueFirst.", href: "/partner-guide/messaging-channels/rcs-providers/onboard-as-an-rcs-provider-in-moengage" },
    { icon: "mail", title: "Email Providers", desc: "Amazon SES, SendGrid, SparkPost, Mandrill, and Netcore.", href: "/partner-guide/messaging-channels/email-providers/configure-amazon-ses" },
    { icon: "database", title: "Data & Analytics", desc: "CDPs, analytics tools, warehouses, cloud storage, and attribution.", href: "/partner-guide/data-and-analytics/cdps/twillio-segment/getting-started/overview" },
    { icon: "flow", title: "Message Orchestration", desc: "Cross-channel journeys with Salesforce Marketing Cloud.", href: "/partner-guide/message-orchestration/marketing-cloud/salesforce-marketing-cloud-sfmc/overview" },
  ];

  const resources = [
    { icon: "bell", title: "Push Notifications", desc: "Configure and send push across iOS, Android, and web.", href: "/developer-guide/ios-sdk/push/basic/push-notifications" },
    { icon: "phone", title: "In-App Messages", desc: "Contextual messages inside your app with rich templates.", href: "/developer-guide/ios-sdk/in-app-messages/in-app-nativ" },
    { icon: "layers", title: "Cards", desc: "Persistent content cards for inbox-style messaging.", href: "/developer-guide/ios-sdk/cards/cards-in-i-os" },
    { icon: "bag", title: "Shopify Integration", desc: "Automated event tracking and product catalog sync.", href: "/developer-guide/ecommerce-platforms/shopify/shopify-20" },
    { icon: "wand", title: "Web Personalization", desc: "Personalized web experiences tailored to user behavior.", href: "/developer-guide/personalize-sdk/sdk-integration/web-personalization-v2" },
    { icon: "receipt", title: "Billing & Contract", desc: "Billing, usage metrics, invoicing, and subscription changes.", href: "/user-guide/settings/account/billing/billing-and-contract-faqs" },
    { icon: "spark", title: "Release Notes", desc: "The latest SDK changes, improvements, and new features.", href: "/release-notes/sdks/ios" },
  ];

  const Card = ({ c }) => (
    <a href={c.href} className="hp-card">
      <span className="hp-card-dot">
        <Icon name={c.icon} />
      </span>
      <span className="hp-card-title">{c.title}</span>
      <span className="hp-card-desc">{c.desc}</span>
    </a>
  );

  return (
    <div className="hp not-prose">
      <section className="hp-block" aria-label="Learn the platform">
        <Head
          title="Learn the"
          em="platform"
          aside="The path most teams take, from the first login to measuring what works."
          link={{ label: "Browse the User Guide", href: "/user-guide/introduction" }}
        />
        <div className="hp-stages">
          {stages.map((s) => (
            <div key={s.num} className="hp-stage">
              <div className="hp-stage-label">
                <span className="hp-stage-num">{s.num}</span>
                <h3 className="hp-stage-name">{s.name}</h3>
                <p className="hp-stage-blurb">{s.blurb}</p>
              </div>
              <div className="hp-stage-cards">
                {s.cards.map((c) => (
                  <Card key={c.href} c={c} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="hp-block" aria-label="For developers">
        <Head
          title="Integrate the"
          em="SDKs and APIs"
          aside="Step-by-step guides for SDK integration, data tracking, push notifications, in-app messaging, and the REST APIs."
          link={{ label: "Open the Developer Guide", href: "/developer-guide/introduction" }}
        />
        <div className="hp-pills">
          {sdks.map((s) => (
            <a key={s.href} href={s.href} className="hp-pill">
              <Icon name={s.icon} />
              {s.label}
            </a>
          ))}
        </div>

        <div className="hp-agents">
          <div className="hp-agents-copy">
            <h3 className="hp-agents-title">
              Work with <strong>agents</strong>
            </h3>
            <div className="hp-ai-logos">
              <a className="hp-ai-logo" href="https://claude.ai/directory/moengage-mcp" target="_blank" rel="noopener noreferrer" aria-label="MoEngage in the Claude connector directory" title="Claude">
                <Logo name="claude" />
              </a>
              <a className="hp-ai-logo" href="/user-guide/ai-and-intelligence/merlin-ai/moengage-mcp-server#personal-setup-per-user" aria-label="Connect ChatGPT to MoEngage" title="ChatGPT">
                <Logo name="openai" />
              </a>
            </div>
          </div>
          <div className="hp-mcp">
            {mcp.map((m) => (
              <div key={m.key} className="hp-term">
                <div className="hp-term-head">
                  <span className="hp-term-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="hp-term-title">{m.title}</span>
                  <span className="hp-term-sub">{m.sub}</span>
                </div>
                <p className="hp-term-desc">{m.desc}</p>
                <ul className="hp-term-rows">
                  {m.rows.map((a) => (
                    <li key={a.key} className="hp-term-row">
                      <span className="hp-term-key">
                        {a.logo && <Logo name={a.logo} />}
                        {a.label}
                      </span>
                      <code className="hp-term-code">{a.value}</code>
                      <button type="button" className="hp-copy" onClick={() => copy(a.key, a.value)} aria-label={`Copy ${a.label} value`}>
                        {copied === a.key ? "Copied" : "Copy"}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="hp-term-foot">
                  <a className="hp-inline hp-inline--light" href={m.link.href}>
                    {m.link.label} <span aria-hidden="true">→</span>
                  </a>
                  {m.external && (
                    <a className="hp-term-ext" href={m.external.href} target="_blank" rel="noopener noreferrer">
                      <Logo name="claude" />
                      {m.external.label} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-block" aria-label="Partner integrations">
        <Head
          title="Connect your"
          em="stack"
          aside="Configuration and setup for 200+ technology partners across messaging, data infrastructure, personalization, and CRM."
          link={{ label: "All partners", href: "/partner-guide/introduction" }}
        />
        <div className="hp-grid hp-grid--3">
          {partners.map((c) => (
            <Card key={c.href} c={c} />
          ))}
        </div>
      </section>

      <section className="hp-block" aria-label="Popular resources">
        <Head title="Pick up" em="where you left off" />
        <div className="hp-grid hp-grid--4">
          {resources.map((c) => (
            <Card key={c.href} c={c} />
          ))}
        </div>
      </section>

      <section className="hp-closing" aria-labelledby="hp-closing-title">
        <h2 id="hp-closing-title" className="hp-closing-title">
          Can't find what you need? <strong>Ask us.</strong>
        </h2>
        <div className="hp-closing-actions">
          <button type="button" className="hp-btn hp-btn--dark" onClick={openSearch}>
            Search the docs
          </button>
          <a className="hp-btn hp-btn--outline" href="/user-guide/contact-support/raise-a-support-ticket-through-moengage-dashboard">
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
};

// Wraps another home page section (the Merlin AI showcase) in the same
// neutral panel as the sections around it.
export const HomeWindow = ({ children }) => {
  return (
    <div className="hp-win not-prose">
      {children}
    </div>
  );
};
