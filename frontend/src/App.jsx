import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

// =========================================================
// CANDIDATE PROFILE DATA
// =========================================================

const CANDIDATE = {
  name: "Sumit Kumar",
  shortName: "Sumit",
  role: "Full-Stack & AI Engineer",
  college: "NIT Jamshedpur (MCA)",
  location: "India",
  status: "Open to Opportunities",
};

const CANDIDATE_FACTS = [
  { label: "Education", value: "MCA @ NIT Jamshedpur" },
  { label: "Specialization", value: "AI/ML & Full-Stack Development" },
  { label: "Core Stack", value: "Python, FastAPI, React, Node.js" },
  { label: "DSA & Problem Solving", value: "C++, Data Structures & Algorithms" },
  { label: "Key ML Focus", value: "LLM Orchestration, NLP, Cosine Matchers" },
];

const STARTER_FILES = [
  { name: "projects.md", type: "md", prompt: "What projects has Sumit built?", label: "Key Projects" },
  { name: "skills.json", type: "json", prompt: "What is Sumit's technical skillset and background?", label: "Tech Stack" },
  { name: "education.md", type: "md", prompt: "Tell me about his education and internship experience", label: "Education & Exp" },
  { name: "about_hindi.txt", type: "txt", prompt: "sumit kon hai batana", label: "Hindi / Hinglish" },
];

const STARTER_PROMPTS = [
  {
    icon: "🚀",
    title: "Key Projects",
    desc: "AI Resume Matcher, Draw.Together, Online Book Store, Movie Recommender",
    prompt: "What projects has Sumit built?",
  },
  {
    icon: "⚡",
    title: "Tech Stack",
    desc: "Python, React, Node.js, FastAPI, C++, PyMuPDF, Groq LLM",
    prompt: "What is Sumit's technical skillset and background?",
  },
  {
    icon: "🎓",
    title: "College & Experience",
    desc: "NIT Jamshedpur (MCA) & Shikom Software Internship",
    prompt: "Tell me about his education and internship experience",
  },
  {
    icon: "💬",
    title: "Hindi / Hinglish",
    desc: "Sumit ke baare me simple Hindi / Hinglish me jaaniye",
    prompt: "sumit kon hai batana",
  },
];

const CHECKLIST_ITEMS = [
  "Core Technical Skills",
  "Relevant Experience",
  "Key Projects Alignment",
  "Minimum Requirements",
  "Identified Skill Gaps",
  "Overall Role Suitability",
];

// =========================================================
// SVG ICONS
// =========================================================

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3.5 10.5H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v0.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path
        d="M13.5 8A5.5 5.5 0 1 1 11.9 4.1M13.5 2.5v3.5H10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1.5v1.6M8 12.9v1.6M14.5 8h-1.6M3.1 8H1.5M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1M12.4 12.4l-1.1-1.1M4.7 4.7 3.6 3.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SidebarToggleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

// =========================================================
// SCORE → METADATA
// =========================================================

function scoreMeta(score) {
  const value = Math.max(0, Math.min(100, Math.round(score || 0)));
  if (value >= 75) {
    return { value, tag: "STRONG FIT", text: "Excellent match for requirements", colorVar: "--mint", badgeClass: "badge-mint" };
  }
  if (value >= 50) {
    return { value, tag: "PARTIAL FIT", text: "Moderate alignment, some review needed", colorVar: "--amber", badgeClass: "badge-amber" };
  }
  return { value, tag: "GAP IDENTIFIED", text: "Notable skill or experience gaps", colorVar: "--rose", badgeClass: "badge-rose" };
}

// =========================================================
// MAIN APP COMPONENT
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

  // Layout & UI state
  const [mode, setMode] = useState("chat"); // "chat" | "match"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  // Job match state
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");

  const scrollRef = useRef(null);
  const gutterRef = useRef(null);

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
      // Ignore storage errors
    }
  }, [messages]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  function toggleTheme() {
    setTheme((curr) => (curr === "dark" ? "light" : "dark"));
  }

  function handleCopy(text, index) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function handleNewChat() {
    setMessages([]);
    setInput("");
    try {
      localStorage.removeItem("chat_messages");
    } catch {
      // Ignore
    }
  }

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  async function sendMessage(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    setInput("");

    const priorHistory = messages;
    setMessages([...priorHistory, userMessage]);
    setLoading(true);

    // Close mobile menu if open
    if (mobileMenuOpen) setMobileMenuOpen(false);

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

        // Throttle UI re-renders every 3 chunks for high-fps streaming
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

      // Final commit
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
        ? "⚠️ Rate limit reached. Please wait a few seconds before asking your next question."
        : "Sorry, something went wrong while communicating with Sumit's AI agent. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function handleStarterPrompt(prompt) {
    if (loading) return;
    sendMessage(prompt);
  }

  // =========================================================
  // JOB MATCHING
  // =========================================================

  async function checkJobMatch() {
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
          throw new Error("Rate limit exceeded. Please wait a moment before running fit analysis again.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Match API error: ${response.status}`);
      }

      const data = await response.json();
      setMatchResult(data);
    } catch (error) {
      console.error("Job matching error:", error);
      setMatchError(error.message || "Job matching failed. Please verify that the backend server is running.");
    } finally {
      setMatchLoading(false);
    }
  }

  function handleJdScroll(event) {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = event.target.scrollTop;
    }
  }

  const lineCount = Math.max(jobDescription.split("\n").length + 1, 14);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);
  const meta = matchResult ? scoreMeta(matchResult.suitability_score) : null;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-is-collapsed" : ""}`}>
      {/* Dynamic Animated Aurora Background */}
      <div className="ambient-background" aria-hidden="true">
        <div className="aurora-orb orb-purple" />
        <div className="aurora-orb orb-cyan" />
        <div className="aurora-orb orb-rose" />
        <div className="aurora-orb orb-gold" />
        <div className="ambient-mesh-pattern" />
      </div>

      {/* Main Container Card */}
      <div className="app-canvas">
        {/* ===================================================
            HEADER NAVIGATION BAR
        =================================================== */}
        <header className="app-header">
          <div className="header-left">
            {/* Mobile Menu Toggle */}
            <button
              className="btn-icon mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              className="btn-icon desktop-sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label="Toggle Sidebar"
              title="Toggle Sidebar"
            >
              <SidebarToggleIcon />
            </button>

            {/* Brand Logo & Status */}
            <div className="brand-group">
              <div className="brand-avatar">
                <span className="brand-avatar-text">SK</span>
                <span className="live-indicator-dot" />
              </div>
              <div className="brand-info">
                <div className="brand-name-row">
                  <span className="brand-title">Sumit Kumar</span>
                  <span className="brand-badge">AI Assistant</span>
                </div>
                <div className="brand-status-row">
                  <span className="status-ping" />
                  <span className="status-label">Online · NIT Jamshedpur</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Tabs: Chat vs Matcher */}
          <div className="header-center">
            <nav className="mode-nav-pill">
              <button
                className={`nav-pill-btn ${mode === "chat" ? "active" : ""}`}
                onClick={() => setMode("chat")}
              >
                <ChatBubbleIcon />
                <span>AI Chat</span>
              </button>
              <button
                className={`nav-pill-btn ${mode === "match" ? "active" : ""}`}
                onClick={() => setMode("match")}
              >
                <TargetIcon />
                <span>Job Fit Check</span>
              </button>
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="header-right">
            {mode === "chat" && messages.length > 0 && (
              <button
                className="btn-icon btn-action"
                onClick={handleNewChat}
                title="Restart chat session"
                aria-label="Restart chat"
              >
                <RestartIcon />
                <span className="btn-label-desktop">Clear</span>
              </button>
            )}

            <button
              className="btn-icon btn-action"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </header>

        {/* ===================================================
            MAIN WORKSPACE BODY
        =================================================== */}
        <div className="app-body">
          {/* Mobile Overlay Backdrop */}
          {mobileMenuOpen && (
            <div
              className="mobile-drawer-overlay"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* =================================================
              SIDEBAR (Desktop Panel & Mobile Slide-Out Drawer)
          ================================================= */}
          <aside className={`app-sidebar ${mobileMenuOpen ? "drawer-open" : ""}`}>
            <div className="sidebar-scrollable">
              {/* Profile Card */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="profile-avatar-large">
                    <span>SK</span>
                  </div>
                  <div className="profile-details">
                    <h3 className="profile-name">Sumit Kumar</h3>
                    <p className="profile-role">Full-Stack & AI Engineer</p>
                    <span className="profile-badge-pill">NIT Jamshedpur (MCA)</span>
                  </div>
                </div>

                <div className="profile-actions">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-resume-download"
                    title="Open Sumit's Resume in a new tab"
                  >
                    <span>View Resume (PDF)</span>
                    <ExternalArrowIcon />
                  </a>
                </div>
              </div>

              {/* Quick Knowledge Base / Explorer */}
              <div className="sidebar-section">
                <div className="section-title-row">
                  <span className="section-title">Knowledge Explorer</span>
                  <span className="section-count">4 files</span>
                </div>

                <div className="file-list">
                  {STARTER_FILES.map((file) => (
                    <button
                      key={file.name}
                      className="file-item-btn"
                      onClick={() => handleStarterPrompt(file.prompt)}
                      disabled={loading}
                    >
                      <div className="file-icon-box">
                        <DocumentIcon />
                      </div>
                      <div className="file-text-box">
                        <span className="file-name">{file.name}</span>
                        <span className="file-prompt-hint">{file.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Candidate Info Highlights */}
              <div className="sidebar-section">
                <div className="section-title-row">
                  <span className="section-title">Profile Highlights</span>
                </div>

                <div className="facts-card">
                  {CANDIDATE_FACTS.map((fact) => (
                    <div className="fact-row" key={fact.label}>
                      <span className="fact-label">{fact.label}</span>
                      <span className="fact-val">{fact.value}</span>
                    </div>
                  ))}
                  <div className="fact-row">
                    <span className="fact-label">Status</span>
                    <span className="fact-val fact-status">● {CANDIDATE.status}</span>
                  </div>
                </div>
              </div>

              {/* Slogan / Footer note in sidebar */}
              <div className="sidebar-footer">
                <p>Powered by Groq LLM & FastAPI</p>
                <p className="tech-credit">Sumit Kumar Portfolio 2026</p>
              </div>
            </div>
          </aside>

          {/* =================================================
              MAIN CONTENT CANVAS
          ================================================= */}
          <main className="app-main-content">
            {/* ===============================================
                1. CHAT MODE
            =============================================== */}
            {mode === "chat" && (
              <div className="chat-container">
                {/* Scrollable Message Feed */}
                <div className="chat-messages-area" ref={scrollRef}>
                  {messages.length === 0 ? (
                    <div className="hero-empty-state">
                      <div className="hero-badge">
                        <SparkleIcon />
                        <span>Interactive AI Portfolio Assistant</span>
                      </div>

                      <h1 className="hero-title">
                        Explore <span className="gradient-text">Sumit Kumar's</span> Work & Skills
                      </h1>

                      <p className="hero-subtitle">
                        MCA at <strong>NIT Jamshedpur</strong>. Building full-stack web applications, AI resume screening engines, and ML systems.
                      </p>

                      {/* Prompt Cards Grid */}
                      <div className="starter-grid">
                        {STARTER_PROMPTS.map((promptItem) => (
                          <button
                            key={promptItem.title}
                            className="starter-prompt-card"
                            onClick={() => handleStarterPrompt(promptItem.prompt)}
                            disabled={loading}
                          >
                            <span className="starter-emoji">{promptItem.icon}</span>
                            <div className="starter-content">
                              <h4 className="starter-card-title">{promptItem.title}</h4>
                              <p className="starter-card-desc">{promptItem.desc}</p>
                            </div>
                            <span className="starter-arrow">→</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="messages-stream">
                      {messages.map((message, index) => {
                        const isLast = index === messages.length - 1;
                        const isStreamingThis = loading && isLast && message.role === "assistant";
                        const isWaitingFirstToken = isStreamingThis && !message.content;

                        return (
                          <div
                            key={index}
                            className={`message-bubble-row message-row--${message.role}`}
                          >
                            {message.role === "assistant" && (
                              <div className="message-avatar assistant-avatar">
                                <SparkleIcon />
                              </div>
                            )}

                            <div className={`message-bubble bubble--${message.role}`}>
                              {message.role === "user" ? (
                                <div className="user-message-text">{message.content}</div>
                              ) : isWaitingFirstToken ? (
                                <div className="thinking-indicator">
                                  <span className="thinking-dot" />
                                  <span className="thinking-dot" />
                                  <span className="thinking-dot" />
                                  <span className="thinking-label">Sumit.ai is thinking...</span>
                                </div>
                              ) : (
                                <div className="assistant-message-content">
                                  <div className="markdown-render-zone">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {message.content}
                                    </ReactMarkdown>
                                    {isStreamingThis && <span className="pulsing-cursor">▋</span>}
                                  </div>

                                  {!isStreamingThis && message.content && (
                                    <div className="message-footer-actions">
                                      <button
                                        className="btn-copy-bubble"
                                        onClick={() => handleCopy(message.content, index)}
                                        title="Copy response to clipboard"
                                      >
                                        {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
                                        <span>{copiedIndex === index ? "Copied" : "Copy"}</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {message.role === "user" && (
                              <div className="message-avatar user-avatar">
                                <span>You</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Floating Modern Input Dock */}
                <div className="chat-input-dock">
                  <div className="input-bar-wrapper">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Ask anything about Sumit's projects, tech stack, or experience...`}
                      rows={1}
                      disabled={loading}
                      className="chat-textarea"
                    />

                    <button
                      className={`btn-send-message ${input.trim() ? "btn-send-active" : ""}`}
                      onClick={() => sendMessage()}
                      disabled={loading || !input.trim()}
                      aria-label="Send message"
                      title="Send message"
                    >
                      <SendArrowIcon />
                    </button>
                  </div>

                  <div className="input-shortcut-hint">
                    <span>Press <strong>Enter ↵</strong> to send · <strong>Shift + Enter</strong> for new line</span>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================
                2. JOB MATCH MODE
            =============================================== */}
            {mode === "match" && (
              <div className="match-mode-container">
                <div className="match-banner">
                  <div className="match-banner-icon">
                    <TargetIcon />
                  </div>
                  <div>
                    <h2 className="match-banner-title">Resume Fit & Job Compatibility Analyzer</h2>
                    <p className="match-banner-desc">
                      Paste a Job Description (JD) below to compute suitability, matched requirements, skill gaps, and tailored recommendations.
                    </p>
                  </div>
                </div>

                <div className="match-content-grid">
                  {/* Left: Input Textarea Card */}
                  <div className="match-input-card">
                    <div className="card-top-bar">
                      <span className="card-title">Job Description (JD)</span>
                      {jobDescription && (
                        <button
                          className="btn-clear-jd"
                          onClick={() => setJobDescription("")}
                        >
                          Clear Text
                        </button>
                      )}
                    </div>

                    <div className="editor-container">
                      <div className="editor-gutter" ref={gutterRef}>
                        {lineNumbers.map((n) => (
                          <div key={n}>{n}</div>
                        ))}
                      </div>

                      <textarea
                        className="editor-textarea"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        onScroll={handleJdScroll}
                        placeholder="Paste the full job description or requirements list here..."
                        spellCheck="false"
                      />
                    </div>

                    <div className="editor-footer">
                      <button
                        className="btn-run-analysis"
                        onClick={checkJobMatch}
                        disabled={matchLoading || !jobDescription.trim()}
                      >
                        {matchLoading ? (
                          <>
                            <span className="btn-spinner" />
                            <span>Analyzing Fit...</span>
                          </>
                        ) : (
                          <>
                            <span>⚡ Run AI Suitability Analysis</span>
                          </>
                        )}
                      </button>
                    </div>

                    {matchError && (
                      <div className="match-error-banner">
                        <span>⚠ {matchError}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Results or Checklist */}
                  <div className="match-results-pane">
                    {matchResult ? (
                      <div className="match-results-card">
                        {/* Overall Score Meter */}
                        <div className="score-summary-box">
                          <div className="score-row">
                            <span className="score-label">Overall Match Score</span>
                            <span className="score-number" style={{ color: `var(${meta.colorVar})` }}>
                              {meta.value}%
                            </span>
                          </div>

                          <div className="score-progress-track">
                            <div
                              className="score-progress-fill"
                              style={{
                                width: `${meta.value}%`,
                                backgroundColor: `var(${meta.colorVar})`,
                              }}
                            />
                          </div>

                          <div className="verdict-row">
                            <span className={`verdict-tag ${meta.badgeClass}`}>
                              {meta.tag}
                            </span>
                            <span className="verdict-desc">{meta.text}</span>
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className="analysis-card recommendation-card">
                          <span className="card-micro-label">Recommendation</span>
                          <p className="recommendation-text">{matchResult.recommendation}</p>
                        </div>

                        {/* Matched vs Missing Skills */}
                        <div className="skills-diff-grid">
                          <div className="skills-column matched-skills-box">
                            <h4 className="skills-column-title">
                              <span className="diff-symbol-plus">+</span> Matched Skills ({(matchResult.matched_skills || []).length})
                            </h4>
                            <div className="skills-pill-wrap">
                              {(matchResult.matched_skills || []).length > 0 ? (
                                matchResult.matched_skills.map((skill, i) => (
                                  <span key={i} className="skill-pill pill-match">
                                    ✓ {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="empty-subtext">No direct skill matches found.</span>
                              )}
                            </div>
                          </div>

                          <div className="skills-column missing-skills-box">
                            <h4 className="skills-column-title">
                              <span className="diff-symbol-minus">−</span> Skill Gaps ({(matchResult.missing_skills || []).length})
                            </h4>
                            <div className="skills-pill-wrap">
                              {(matchResult.missing_skills || []).length > 0 ? (
                                matchResult.missing_skills.map((skill, i) => (
                                  <span key={i} className="skill-pill pill-gap">
                                    − {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="empty-subtext">No significant gaps detected!</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Strengths & Considerations */}
                        <div className="strengths-considerations-grid">
                          <div className="card-box strengths-box">
                            <h4 className="box-title">Key Strengths</h4>
                            <ul className="bullet-list">
                              {(matchResult.candidate_strengths || []).map((str, i) => (
                                <li key={i}>{str}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="card-box gaps-box">
                            <h4 className="box-title">Considerations</h4>
                            <ul className="bullet-list">
                              {(matchResult.candidate_gaps || []).map((gap, i) => (
                                <li key={i}>{gap}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Detailed Reasoning */}
                        <div className="analysis-card reasoning-card">
                          <span className="card-micro-label">Detailed Analysis Breakdown</span>
                          <p className="reasoning-text">{matchResult.explanation}</p>
                        </div>
                      </div>
                    ) : (
                      /* Empty State Checklist */
                      <div className="match-idle-placeholder">
                        <div className="idle-badge">
                          <TargetIcon />
                          <span>AI Assessment Criteria</span>
                        </div>
                        <h3 className="idle-title">How the Fit Analyzer Works</h3>
                        <p className="idle-desc">
                          The backend compares the requirements against Sumit's real resume data, coursework at NIT Jamshedpur, project experience, and technical proficiencies:
                        </p>

                        <div className="criteria-checklist">
                          {CHECKLIST_ITEMS.map((item) => (
                            <div className="criteria-item" key={item}>
                              <span className="criteria-check">✓</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        <div className="idle-tip-box">
                          💡 <strong>Tip:</strong> You can paste any tech stack job posting (e.g. Full-Stack Developer, AI/Python Engineer, React Developer) to check compatibility instantly.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;