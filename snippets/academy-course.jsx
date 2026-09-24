export const AcademyCourse = ({ title, duration, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.875rem 1.25rem",
        border: "1px solid var(--gray-200, #e5e7eb)",
        borderRadius: "0.75rem",
        textDecoration: "none",
        color: "inherit",
        margin: "0 0 1.25rem",
      }}
    >
      <img
        src="/images/academy/moengage-academy-logo-purple.jpg"
        alt="MoEngage Academy"
        width="112"
        style={{
          flexShrink: 0,
          height: "48px",
          width: "auto",
          borderRadius: "0.5rem",
          margin: 0,
        }}
      />
      <span>
        <strong style={{ display: "block", fontSize: "1rem", lineHeight: 1.3 }}>
          {title}
        </strong>
        <span style={{ fontSize: "0.875rem", opacity: 0.7 }}>
          E-Learning Course{duration ? ` · ${duration}` : ""}
        </span>
      </span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, marginLeft: "auto", opacity: 0.5 }}
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </a>
  );
};
