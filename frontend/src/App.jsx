import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

// =========================================================
// CANDIDATE DATA
// =========================================================

const CANDIDATE = {
  name: "Sumit Kumar",
  role: "Full-Stack Developer & AI Engineer",
  college: "NIT Jamshedpur (MCA)",
  location: "India",
  status: "Available for Roles",
  skills: {
    languages: ["Python", "JavaScript (ES6+)", "TypeScript", "C++", "SQL", "HTML/CSS"],
    frameworks: ["React.js", "Node.js", "Express.js", "FastAPI", "Tailwind CSS", "Streamlit"],
    ai_ml: ["LLM Orchestration", "Groq API", "PyMuPDF", "NLP", "Cosine Similarity", "Pandas", "NumPy"],
    tools: ["Git / GitHub", "MongoDB", "PostgreSQL", "Docker", "RESTful APIs", "JWT Auth"]
  }
};

const STARTER_PROMPTS = [
  {
    icon: "🚀",
    title: "Key Projects",
    desc: "AI Resume Matcher, Draw.Together, Online Book Store, Movie Recommender",
    prompt: "What projects has Sumit built?",
  },
  {
    icon: "⚡",
    title: "Tech Stack & Skills",
    desc: "Python, FastAPI, React, Node.js, C++ DSA, Groq LLM, PyMuPDF",
    prompt: "What is Sumit's technical skillset and background?",
  },
  {
    icon: "🎓",
    title: "Education & Experience",
    desc: "MCA at NIT Jamshedpur & Shikom Software Internship",
    prompt: "Tell me about his education and internship experience",
  },
  {
    icon: "💬",
    title: "Hindi / Hinglish",
    desc: "Sumit ke baare me simple Hindi me baat karein",
    prompt: "sumit kon hai batana",
  },
];

const SUGGESTION_CHIPS = [
  "Show me his AI Resume Matcher project",
  "What is his DSA and coding proficiency?",
  "What was his role at Shikom?",
  "How can I contact or hire Sumit?"
];

// =========================================================
// DYNAMIC COLORFUL PARTICLE CANVAS (ALIVE BACKGROUND)
// =========================================================

function AnimatedConstellationCanvas({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const isMobile = width < 768;
    const particleCount = isMobile ? 32 : 65;

    const colorsDark = [
      "rgba(139, 92, 246, ",  // Violet
      "rgba(6, 182, 212, ",   // Cyan
      "rgba(236, 72, 153, ",  // Pink
      "rgba(16, 185, 129, ",  // Emerald
      "rgba(245, 158, 11, ",  // Amber
    ];

    const colorsLight = [
      "rgba(99, 102, 241, ",  // Indigo
      "rgba(14, 165, 233, ",  // Sky Blue
      "rgba(217, 70, 239, ",  // Magenta
      "rgba(16, 185, 129, ",  // Emerald
      "rgba(245, 158, 11, ",  // Amber
    ];

    const palette = theme === "light" ? colorsLight : colorsDark;

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.2,
        colorBase: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.5 + 0.35,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      const maxDist = isMobile ? 85 : 125;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${particles[i].colorBase}${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.pulseVal += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulseVal) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorBase}${Math.max(0.1, currentAlpha)})`;
        ctx.shadowColor = `${p.colorBase}0.8)`;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="animated-neural-canvas" />;
}

// =========================================================
// SVG ICONS
// =========================================================

function AiSparkleOrb() {
  return (
    <div className="ai-core-orb">
      <div className="orb-ring ring-1" />
      <div className="orb-ring ring-2" />
      <div className="orb-ring ring-3" />
      <div className="orb-center-glow" />
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function UserBadgeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CloseDrawerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// =========================================================
// MAIN COMPONENT
// =========================================================

function App() {
  // Chat state
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chat_messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Layout & UI
  const [mode, setMode] = useState("chat"); // 'chat' | 'match'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  // Job match state
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync messages
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem("chat_messages", JSON.stringify(messages));
      }
    } catch {
      // Ignore
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const toggleTheme = () => {
    setTheme((c) => (c === "dark" ? "light" : "dark"));
  };

  const handleCopy = (text, index) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([]);
    setInput("");
    try {
      localStorage.removeItem("chat_messages");
    } catch {
      // Ignore
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = useCallback(async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const priorHistory = messages;
    setMessages([...priorHistory, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
          history: priorHistory,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit reached. Please wait a few seconds before asking again.");
        }
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedAnswer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let chunkCount = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamedAnswer += chunk;
        chunkCount += 1;

        if (chunkCount % 3 === 0) {
          const currentText = streamedAnswer;
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = { ...updated[lastIndex], content: currentText };
            return updated;
          });
        }
      }

      const finalText = streamedAnswer;
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = { ...updated[lastIndex], content: finalText };
        return updated;
      });
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = error.message?.includes("Rate limit")
        ? "⚠️ Rate limit reached. Please wait a few moments before asking your next question."
        : "Sorry, I encountered an issue generating the response. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // =========================================================
  // MATCH JOB
  // =========================================================

  const handleMatchCheck = async () => {
    if (!jobDescription.trim()) return;

    setMatchLoading(true);
    setMatchResult(null);
    setMatchError("");

    try {
      const response = await fetch(`${API_URL}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: jobDescription }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment before trying again.");
        }
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setMatchResult(data);
    } catch (error) {
      console.error("Match error:", error);
      setMatchError(error.message || "Job analysis failed. Please verify the backend is running.");
    } finally {
      setMatchLoading(false);
    }
  };

  return (
    <div className="modern-app">
      {/* Dynamic Animated Colorful Neural Particles Canvas */}
      <AnimatedConstellationCanvas theme={theme} />

      {/* Luminous Glow Overlays */}
      <div className="ambient-glow glow-top" />
      <div className="ambient-glow glow-bottom" />

      {/* =====================================================
          FLOATING TOP NAVIGATION BAR
      ===================================================== */}
      <header className="floating-navbar">
        <div className="nav-container">
          {/* Brand Left */}
          <div className="nav-brand" onClick={() => setMode("chat")}>
            <div className="brand-orb-mini">
              <span className="orb-dot" />
            </div>
            <div className="brand-text">
              <span className="brand-title">Sumit<span className="brand-accent">.ai</span></span>
              <span className="brand-sub">NIT Jamshedpur</span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="nav-tabs">
            <button
              className={`tab-pill ${mode === "chat" ? "active" : ""}`}
              onClick={() => setMode("chat")}
            >
              <ChatIcon />
              <span>Chat</span>
            </button>
            <button
              className={`tab-pill ${mode === "match" ? "active" : ""}`}
              onClick={() => setMode("match")}
            >
              <TargetIcon />
              <span>Fit Matcher</span>
            </button>
          </div>

          {/* Actions Right */}
          <div className="nav-actions">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn-pill resume-btn"
              title="Open Sumit's Resume"
            >
              <span>Resume PDF</span>
              <ExternalLinkIcon />
            </a>

            <button
              className="action-icon-btn"
              onClick={() => setDrawerOpen(true)}
              title="View Profile & Skills"
              aria-label="Profile"
            >
              <UserBadgeIcon />
            </button>

            {mode === "chat" && messages.length > 0 && (
              <button
                className="action-icon-btn"
                onClick={handleResetChat}
                title="New Chat Session"
                aria-label="Reset chat"
              >
                <ResetIcon />
              </button>
            )}

            <button
              className="action-icon-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          SLIDE-OUT PROFILE & SKILLS DRAWER
      ===================================================== */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-brand">
                <div className="drawer-avatar">SK</div>
                <div>
                  <h3 className="drawer-name">Sumit Kumar</h3>
                  <p className="drawer-role">Full-Stack & AI Engineer</p>
                </div>
              </div>
              <button
                className="action-icon-btn close-drawer-btn"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close drawer"
              >
                <CloseDrawerIcon />
              </button>
            </div>

            <div className="drawer-body">
              <div className="drawer-card bio-card">
                <span className="card-badge">Education & Status</span>
                <p className="bio-highlight">🎓 Master of Computer Applications (MCA)</p>
                <p className="bio-sub">National Institute of Technology, Jamshedpur (NIT)</p>
                <p className="bio-status">● {CANDIDATE.status}</p>
              </div>

              <div className="drawer-actions">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-resume-btn"
                >
                  <span>Open Full Resume PDF</span>
                  <ExternalLinkIcon />
                </a>
              </div>

              <div className="skills-group">
                <h4 className="skills-heading">Technical Skills</h4>
                
                <div className="skill-category">
                  <span className="skill-cat-title">AI & ML</span>
                  <div className="chip-wrap">
                    {CANDIDATE.skills.ai_ml.map((s) => (
                      <span key={s} className="tech-chip ai-chip">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="skill-category">
                  <span className="skill-cat-title">Frameworks & Libraries</span>
                  <div className="chip-wrap">
                    {CANDIDATE.skills.frameworks.map((s) => (
                      <span key={s} className="tech-chip">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="skill-category">
                  <span className="skill-cat-title">Languages</span>
                  <div className="chip-wrap">
                    {CANDIDATE.skills.languages.map((s) => (
                      <span key={s} className="tech-chip">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="skill-category">
                  <span className="skill-cat-title">Databases & Tools</span>
                  <div className="chip-wrap">
                    {CANDIDATE.skills.tools.map((s) => (
                      <span key={s} className="tech-chip">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MAIN INTERACTION STAGE
      ===================================================== */}
      <main className="main-stage">
        {/* ===================================================
            1. CHAT MODE
        =================================================== */}
        {mode === "chat" && (
          <div className="chat-view">
            {/* Scrollable conversation */}
            <div className="conversation-container" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="hero-landing">
                  {/* Glowing Animated AI Core */}
                  <AiSparkleOrb />

                  <h1 className="hero-heading">
                    Explore <span className="text-shimmer">Sumit's Portfolio</span>
                  </h1>

                  <p className="hero-description">
                    Full-Stack Developer & AI Engineer at <strong>NIT Jamshedpur</strong>. Ask anything about his projects, coding stack, or experience.
                  </p>

                  {/* 4 Clean Prompt Cards */}
                  <div className="prompt-cards-grid">
                    {STARTER_PROMPTS.map((item) => (
                      <button
                        key={item.title}
                        className="prompt-card"
                        onClick={() => sendMessage(item.prompt)}
                        disabled={loading}
                      >
                        <span className="card-emoji">{item.icon}</span>
                        <div className="card-content">
                          <h4 className="card-heading">{item.title}</h4>
                          <p className="card-text">{item.desc}</p>
                        </div>
                        <span className="card-arrow">↗</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="messages-thread">
                  {messages.map((message, index) => {
                    const isLast = index === messages.length - 1;
                    const isStreaming = loading && isLast && message.role === "assistant";
                    const isWaitingFirstToken = isStreaming && !message.content;

                    return (
                      <div
                        key={index}
                        className={`chat-row ${message.role === "user" ? "row-user" : "row-ai"}`}
                      >
                        {message.role === "assistant" && (
                          <div className="ai-row-avatar">
                            <span className="avatar-spark">✦</span>
                          </div>
                        )}

                        <div className={`message-bubble ${message.role === "user" ? "user-bubble" : "ai-bubble"}`}>
                          {message.role === "user" ? (
                            <div className="user-text">{message.content}</div>
                          ) : isWaitingFirstToken ? (
                            <div className="thinking-bubble">
                              <span className="dot-wave" />
                              <span className="dot-wave" />
                              <span className="dot-wave" />
                              <span className="thinking-msg">Thinking...</span>
                            </div>
                          ) : (
                            <div className="ai-markdown-content">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                              </ReactMarkdown>

                              {isStreaming && <span className="stream-caret">▊</span>}

                              {!isStreaming && message.content && (
                                <div className="bubble-actions">
                                  <button
                                    className="copy-action-btn"
                                    onClick={() => handleCopy(message.content, index)}
                                    title="Copy response"
                                  >
                                    {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
                                    <span>{copiedIndex === index ? "Copied" : "Copy"}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips (when chat has started) */}
            {messages.length > 0 && !loading && (
              <div className="suggestion-chips-bar">
                {SUGGESTION_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    className="chip-suggestion"
                    onClick={() => sendMessage(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Floating Glass Input Bar */}
            <div className="input-dock-wrapper">
              <div className="floating-input-card">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask about projects, skills, experience, or hire Sumit...`}
                  rows={1}
                  disabled={loading}
                  className="modern-textarea"
                />

                <button
                  className={`send-action-button ${input.trim() ? "can-send" : ""}`}
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  aria-label="Send query"
                >
                  <SendIcon />
                </button>
              </div>

              <div className="input-subhint">
                <span>Press <strong>Enter</strong> to send · <strong>Shift + Enter</strong> for new line</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            2. JOB FIT MATCHER MODE
        =================================================== */}
        {mode === "match" && (
          <div className="matcher-view">
            <div className="matcher-header-card">
              <div className="matcher-title-row">
                <div className="target-badge">
                  <TargetIcon />
                </div>
                <div>
                  <h2 className="matcher-title">Resume Fit & Requirement Analyzer</h2>
                  <p className="matcher-subtitle">
                    Paste any job description to evaluate suitability, detect matched technical requirements, and identify gaps.
                  </p>
                </div>
              </div>
            </div>

            <div className="matcher-grid">
              {/* Left Column: Textarea input */}
              <div className="matcher-editor-card">
                <div className="editor-top-row">
                  <span className="editor-tag">Job Description (JD)</span>
                  {jobDescription && (
                    <button
                      className="clear-text-btn"
                      onClick={() => setJobDescription("")}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <textarea
                  className="jd-textarea"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job posting requirements, roles, or tech stack here..."
                  spellCheck="false"
                />

                <div className="editor-bottom-bar">
                  <button
                    className="run-match-btn"
                    onClick={handleMatchCheck}
                    disabled={matchLoading || !jobDescription.trim()}
                  >
                    {matchLoading ? "Analyzing Candidate Fit..." : "⚡ Run AI Match Analysis"}
                  </button>
                </div>

                {matchError && (
                  <div className="error-alert">
                    <span>⚠ {matchError}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Results */}
              <div className="matcher-results-column">
                {matchResult ? (
                  <div className="match-card">
                    {/* Score Bar */}
                    <div className="score-hero">
                      <div className="score-number-wrap">
                        <span className="score-big">{matchResult.suitability_score}%</span>
                        <span className="score-desc">Compatibility Score</span>
                      </div>
                      <div className="score-track-bar">
                        <div
                          className="score-fill-bar"
                          style={{
                            width: `${Math.min(100, Math.round(matchResult.suitability_score))}%`,
                            background:
                              matchResult.suitability_score >= 75
                                ? "linear-gradient(90deg, #10b981, #06b6d4)"
                                : matchResult.suitability_score >= 50
                                ? "linear-gradient(90deg, #f59e0b, #eab308)"
                                : "linear-gradient(90deg, #f43f5e, #fb7185)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="recommendation-box">
                      <span className="micro-tag">Recommendation</span>
                      <p className="rec-text">{matchResult.recommendation}</p>
                    </div>

                    {/* Matched vs Missing */}
                    <div className="skills-compare-row">
                      <div className="compare-card matches-card">
                        <h5 className="compare-head">✓ Matched Skills ({matchResult.matched_skills?.length || 0})</h5>
                        <div className="pill-container">
                          {(matchResult.matched_skills || []).map((skill, i) => (
                            <span key={i} className="chip match-chip">{skill}</span>
                          ))}
                        </div>
                      </div>

                      <div className="compare-card gaps-card">
                        <h5 className="compare-head">− Skill Gaps ({matchResult.missing_skills?.length || 0})</h5>
                        <div className="pill-container">
                          {(matchResult.missing_skills || []).map((skill, i) => (
                            <span key={i} className="chip gap-chip">{skill}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Considerations */}
                    <div className="bullet-insights-row">
                      <div className="insight-card">
                        <h5 className="insight-head">Candidate Strengths</h5>
                        <ul className="insight-list">
                          {(matchResult.candidate_strengths || []).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="insight-card">
                        <h5 className="insight-head">Considerations</h5>
                        <ul className="insight-list">
                          {(matchResult.candidate_gaps || []).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div className="reasoning-box">
                      <span className="micro-tag">Detailed Fit Rationale</span>
                      <p className="reason-text">{matchResult.explanation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="matcher-empty-card">
                    <span className="empty-badge">Target AI Screener</span>
                    <h3 className="empty-title">Instant Role Fit Analysis</h3>
                    <p className="empty-desc">
                      Paste any Job Description on the left and click <strong>Run AI Match Analysis</strong>. The engine will match Sumit's technical proficiencies, education at NIT Jamshedpur, and projects to compute an objective score.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;