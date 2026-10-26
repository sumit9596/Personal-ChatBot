import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

// =========================================================
// CANDIDATE & BENTO CONTENT DATA
// =========================================================

const CANDIDATE = {
  name: "Sumit Kumar",
  role: "Full-Stack Developer & AI Engineer",
  education: "NIT Jamshedpur (MCA)",
  location: "India",
  status: "Open to Opportunities",
};

const BENTO_PROJECTS = [
  {
    title: "AI Resume Matcher",
    tag: "AI/ML & NLP",
    desc: "Extracts resume data using PyMuPDF, matches requirements via NLP & cosine similarity.",
    color: "#8b5cf6",
    prompt: "Tell me all about your AI Resume Matcher project: architecture, tech stack, and how cosine similarity is used.",
  },
  {
    title: "Draw.Together",
    tag: "Full-Stack & WebSockets",
    desc: "Real-time collaborative whiteboard and canvas editor with multi-user sync & JWT auth.",
    color: "#06b6d4",
    prompt: "Explain the Draw.Together collaborative canvas project and how real-time sync works.",
  },
  {
    title: "Online Book Store",
    tag: "MERN Stack",
    desc: "E-commerce platform with JWT authentication, shopping cart, and admin inventory CRUD.",
    color: "#ec4899",
    prompt: "Describe your Online Book Store project, authentication model, and database design.",
  },
  {
    title: "Movie Recommender",
    tag: "ML & Streamlit",
    desc: "Content-based recommendation engine powered by TMDB API and cosine similarity.",
    color: "#f59e0b",
    prompt: "How does your Movie Recommender application calculate movie similarities?",
  },
];

const TECH_BADGES = [
  { name: "Python", cat: "ai" },
  { name: "FastAPI", cat: "backend" },
  { name: "React.js", cat: "frontend" },
  { name: "Node.js", cat: "backend" },
  { name: "C++ (DSA)", cat: "core" },
  { name: "PyMuPDF", cat: "ai" },
  { name: "Cosine Matcher", cat: "ai" },
  { name: "MongoDB", cat: "backend" },
  { name: "Tailwind CSS", cat: "frontend" },
  { name: "Streamlit", cat: "ai" },
];

const SUGGESTION_PILLS = [
  "What is Sumit's educational background?",
  "Tell me about his internship at Shikom",
  "How does he handle DSA problem solving?",
  "What are his core strengths in Full-Stack?",
];

// =========================================================
// SVG ICONS
// =========================================================

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
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

function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
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
// MAIN APP COMPONENT
// =========================================================

function App() {
  // Chat State
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

  // Mode: "chat" | "match"
  const [mode, setMode] = useState("chat");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  // Job Match State
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

  // Sync chat messages to localStorage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem("chat_messages", JSON.stringify(messages));
      }
    } catch {
      // Ignore
    }
  }, [messages]);

  // Auto scroll
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

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 130)}px`;
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
          throw new Error("Rate limit reached. Please wait a moment before sending another message.");
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
        ? "⚠️ Rate limit reached. Please wait a few moments before sending another message."
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
  // JOB MATCHING
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
    <div className="bento-app">
      {/* Dynamic Animated Colorful Aurora Gradient Mesh in Background */}
      <div className="bento-ambient-mesh" aria-hidden="true">
        <div className="aurora-blob blob-violet" />
        <div className="aurora-blob blob-cyan" />
        <div className="aurora-blob blob-rose" />
        <div className="aurora-blob blob-amber" />
        <div className="ambient-grid-overlay" />
      </div>

      {/* =====================================================
          TOP NAVIGATION BAR
      ===================================================== */}
      <header className="bento-navbar">
        <div className="navbar-inner">
          {/* Brand Left */}
          <div className="nav-brand-group" onClick={() => { setMode("chat"); handleResetChat(); }}>
            <div className="brand-logo-pill">
              <span className="logo-sparkle">✦</span>
              <span className="logo-text">Sumit<span className="logo-ai">.ai</span></span>
            </div>
            <span className="live-status-pill">
              <span className="status-blip" />
              NIT Jamshedpur MCA
            </span>
          </div>

          {/* Navigation Mode Pill */}
          <nav className="mode-toggle-group">
            <button
              className={`mode-btn ${mode === "chat" ? "active" : ""}`}
              onClick={() => setMode("chat")}
            >
              <ChatIcon />
              <span>AI Chat</span>
            </button>
            <button
              className={`mode-btn ${mode === "match" ? "active" : ""}`}
              onClick={() => setMode("match")}
            >
              <TargetIcon />
              <span>Fit Matcher</span>
            </button>
          </nav>

          {/* Actions Right */}
          <div className="nav-actions-group">
            {mode === "chat" && messages.length > 0 && (
              <button
                className="action-pill-btn"
                onClick={handleResetChat}
                title="Return to Bento Hub"
              >
                <GridIcon />
                <span className="btn-hide-mobile">Bento Hub</span>
              </button>
            )}

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="action-pill-btn resume-action-btn"
              title="Open Sumit's Resume (PDF)"
            >
              <span>Resume PDF</span>
              <ExternalIcon />
            </a>

            <button
              className="theme-circle-btn"
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
          MAIN WORKSPACE
      ===================================================== */}
      <main className="bento-main">
        {/* ===================================================
            1. CHAT MODE
        =================================================== */}
        {mode === "chat" && (
          <div className="chat-interface">
            <div className="chat-scroll-zone" ref={scrollRef}>
              {messages.length === 0 ? (
                /* ===========================================
                   INTERACTIVE BENTO GRID HUB (EMPTY HERO)
                =========================================== */
                <div className="bento-hub-grid">
                  {/* Tile 1: Hero Persona Card (2 Columns Wide) */}
                  <div className="bento-tile tile-hero">
                    <div className="hero-top">
                      <div className="hero-avatar">
                        <span>SK</span>
                        <span className="hero-avatar-glow" />
                      </div>
                      <div className="hero-meta">
                        <span className="status-tag">● {CANDIDATE.status}</span>
                        <h2 className="hero-name">{CANDIDATE.name}</h2>
                        <p className="hero-role">{CANDIDATE.role}</p>
                      </div>
                    </div>

                    <p className="hero-bio">
                      Master of Computer Applications (MCA) student at <strong>NIT Jamshedpur</strong>. Building high-performance full-stack applications, intelligent AI matching systems, and scalable backend pipelines.
                    </p>

                    <div className="hero-footer-actions">
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bento-btn-primary"
                      >
                        <span>Download Official Resume</span>
                        <ExternalIcon />
                      </a>
                      <button
                        className="bento-btn-secondary"
                        onClick={() => sendMessage("Tell me about Sumit's complete background and education")}
                      >
                        Ask Background
                      </button>
                    </div>
                  </div>

                  {/* Tile 2: AI Core Interaction Card */}
                  <div
                    className="bento-tile tile-ai-core"
                    onClick={() => sendMessage("What makes Sumit stand out as a Full-Stack & AI engineer?")}
                  >
                    <div className="ai-core-graphic">
                      <div className="ai-core-ring ring-ext" />
                      <div className="ai-core-ring ring-mid" />
                      <div className="ai-core-center">✦</div>
                    </div>
                    <h3 className="tile-title">Portfolio AI Core</h3>
                    <p className="tile-desc">Instant answers on technical depth, problem-solving, and code quality.</p>
                    <span className="tile-action-link">Click to inquire →</span>
                  </div>

                  {/* Tile 3: Key Projects Showcase (Full Row / 3 Columns Wide) */}
                  <div className="bento-tile tile-projects">
                    <div className="tile-header-row">
                      <div>
                        <span className="tile-kicker">Featured Engineering</span>
                        <h3 className="tile-title">Key Projects Showcase</h3>
                      </div>
                      <span className="tile-badge">4 Featured</span>
                    </div>

                    <div className="bento-projects-subgrid">
                      {BENTO_PROJECTS.map((proj) => (
                        <div
                          key={proj.title}
                          className="project-subcard"
                          onClick={() => sendMessage(proj.prompt)}
                        >
                          <div className="proj-card-top">
                            <span className="proj-tag" style={{ color: proj.color, borderColor: `${proj.color}40`, background: `${proj.color}15` }}>
                              {proj.tag}
                            </span>
                            <span className="proj-arrow">↗</span>
                          </div>
                          <h4 className="proj-title">{proj.title}</h4>
                          <p className="proj-desc">{proj.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tile 4: Tech Stack Cloud */}
                  <div className="bento-tile tile-tech">
                    <span className="tile-kicker">Core Capabilities</span>
                    <h3 className="tile-title">Technical Matrix</h3>
                    <div className="tech-badge-cloud">
                      {TECH_BADGES.map((tech) => (
                        <button
                          key={tech.name}
                          className={`tech-badge-pill badge-${tech.cat}`}
                          onClick={() => sendMessage(`What is Sumit's proficiency and experience with ${tech.name}?`)}
                          title={`Ask about ${tech.name}`}
                        >
                          {tech.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tile 5: Fit Matcher Launchpad */}
                  <div
                    className="bento-tile tile-matcher-launch"
                    onClick={() => setMode("match")}
                  >
                    <div className="matcher-icon-box">
                      <TargetIcon />
                    </div>
                    <span className="tile-kicker">Role Compatibility</span>
                    <h3 className="tile-title">Resume Fit Screener</h3>
                    <p className="tile-desc">Paste your job description to calculate suitability & requirement alignment.</p>
                    <span className="tile-action-link">Open Analyzer →</span>
                  </div>

                  {/* Tile 6: Hindi Conversation */}
                  <div
                    className="bento-tile tile-hindi"
                    onClick={() => sendMessage("sumit kon hai batana")}
                  >
                    <span className="hindi-badge">💬 हिंदी / Hinglish</span>
                    <h3 className="tile-title">बातचीत करें</h3>
                    <p className="tile-desc">Sumit ke baare me simple Hindi me sawal puchein aur jaaniye.</p>
                    <span className="tile-action-link">Hindi me shuru karein →</span>
                  </div>
                </div>
              ) : (
                /* ===========================================
                   ACTIVE CONVERSATION FEED
                =========================================== */
                <div className="conversation-stream">
                  {messages.map((message, index) => {
                    const isLast = index === messages.length - 1;
                    const isStreaming = loading && isLast && message.role === "assistant";
                    const isWaitingFirstToken = isStreaming && !message.content;

                    return (
                      <div
                        key={index}
                        className={`message-row ${message.role === "user" ? "row-user" : "row-ai"}`}
                      >
                        {message.role === "assistant" && (
                          <div className="ai-badge-avatar">
                            <SparkleIcon />
                          </div>
                        )}

                        <div className={`bento-bubble ${message.role === "user" ? "bubble-user" : "bubble-ai"}`}>
                          {message.role === "user" ? (
                            <div className="user-text-content">{message.content}</div>
                          ) : isWaitingFirstToken ? (
                            <div className="thinking-row">
                              <span className="wave-dot" />
                              <span className="wave-dot" />
                              <span className="wave-dot" />
                              <span className="thinking-text">Sumit.ai is synthesizing answer...</span>
                            </div>
                          ) : (
                            <div className="ai-markdown-wrap">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                              </ReactMarkdown>

                              {isStreaming && <span className="streaming-cursor-bar">▋</span>}

                              {!isStreaming && message.content && (
                                <div className="bubble-footer-bar">
                                  <button
                                    className="copy-btn-minimal"
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

            {/* Quick Suggestion Pills (Available in chat) */}
            {messages.length > 0 && !loading && (
              <div className="pills-scroll-row">
                {SUGGESTION_PILLS.map((pill, i) => (
                  <button
                    key={i}
                    className="suggestion-pill-item"
                    onClick={() => sendMessage(pill)}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            )}

            {/* Floating Glass Input Bar */}
            <div className="bento-input-dock">
              <div className="dock-card">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about projects, technical depth, problem-solving, or hire Sumit..."
                  rows={1}
                  disabled={loading}
                  className="bento-textarea"
                />

                <button
                  className={`dock-send-btn ${input.trim() ? "dock-send-active" : ""}`}
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  title="Send message"
                >
                  <SendIcon />
                </button>
              </div>

              <div className="dock-hint-line">
                <span>Press <strong>Enter</strong> to send · <strong>Shift + Enter</strong> for new line</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            2. JOB FIT MATCHER MODE
        =================================================== */}
        {mode === "match" && (
          <div className="matcher-workspace">
            <div className="matcher-banner-card">
              <div className="matcher-icon-circle">
                <TargetIcon />
              </div>
              <div>
                <h2 className="matcher-heading">Resume Fit & Requirement Screener</h2>
                <p className="matcher-subheading">
                  Paste any job description (JD) or list of requirements to calculate candidate suitability, matched skills, and recommendations.
                </p>
              </div>
            </div>

            <div className="matcher-layout-grid">
              {/* Left Column: Input Card */}
              <div className="matcher-card editor-pane">
                <div className="pane-header">
                  <span className="pane-title">Job Description / Requirements</span>
                  {jobDescription && (
                    <button className="btn-text-clear" onClick={() => setJobDescription("")}>
                      Clear
                    </button>
                  )}
                </div>

                <textarea
                  className="jd-editor-textarea"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description, roles, or key skill requirements here..."
                  spellCheck="false"
                />

                <div className="pane-footer">
                  <button
                    className="btn-analyze-match"
                    onClick={handleMatchCheck}
                    disabled={matchLoading || !jobDescription.trim()}
                  >
                    {matchLoading ? "Analyzing Candidate Fit..." : "⚡ Run AI Match Analysis"}
                  </button>
                </div>

                {matchError && (
                  <div className="error-badge-box">
                    <span>⚠ {matchError}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Scorecard & Breakdown */}
              <div className="matcher-card results-pane">
                {matchResult ? (
                  <div className="results-wrapper">
                    {/* Score Bar */}
                    <div className="scorecard-top">
                      <div className="scorecard-row">
                        <span className="scorecard-label">Suitability Rating</span>
                        <span className="scorecard-big">{matchResult.suitability_score}%</span>
                      </div>
                      <div className="scorecard-track">
                        <div
                          className="scorecard-fill"
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
                    <div className="insight-card rec-card">
                      <span className="kicker-tag">Recommendation</span>
                      <p className="rec-body">{matchResult.recommendation}</p>
                    </div>

                    {/* Skills Breakdown */}
                    <div className="skills-split-row">
                      <div className="skill-bucket bucket-match">
                        <h5 className="bucket-title">✓ Matched Skills ({matchResult.matched_skills?.length || 0})</h5>
                        <div className="bucket-pills">
                          {(matchResult.matched_skills || []).map((s, i) => (
                            <span key={i} className="chip-pill pill-green">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="skill-bucket bucket-gap">
                        <h5 className="bucket-title">− Skill Gaps ({matchResult.missing_skills?.length || 0})</h5>
                        <div className="bucket-pills">
                          {(matchResult.missing_skills || []).map((s, i) => (
                            <span key={i} className="chip-pill pill-red">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Considerations */}
                    <div className="points-split-row">
                      <div className="point-card">
                        <h5 className="point-title">Candidate Strengths</h5>
                        <ul className="point-list">
                          {(matchResult.candidate_strengths || []).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="point-card">
                        <h5 className="point-title">Considerations</h5>
                        <ul className="point-list">
                          {(matchResult.candidate_gaps || []).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Detailed Rationale */}
                    <div className="insight-card">
                      <span className="kicker-tag">Detailed Fit Rationale</span>
                      <p className="rec-body">{matchResult.explanation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="results-idle">
                    <span className="idle-pill">AI Evaluator</span>
                    <h3 className="idle-heading">How the Fit Analyzer Works</h3>
                    <p className="idle-text">
                      Paste a Job Description on the left and run analysis. The system parses requirements against Sumit's actual coursework at NIT Jamshedpur, verified projects, and full-stack technical competencies to deliver an objective compatibility report.
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