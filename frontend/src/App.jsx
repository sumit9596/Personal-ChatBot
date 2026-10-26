import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL;

// =========================================================
// EDIT ME — candidate config
// =========================================================

const CANDIDATE = {
  name: "Sumit",
  role: "Full-Stack Developer",
};

const CANDIDATE_JSON = [
  { key: "education", value: "MCA" },
  { key: "focus", value: "Full-stack development" },
  { key: "stack", value: "React, Node.js, Python" },
  { key: "location", value: "India" },
];

const STARTER_FILES = [
  { name: "about.md", type: "md", prompt: "What projects has Sumit built?" },
  { name: "skills.json", type: "json", prompt: "What's his tech stack?" },
  { name: "education.md", type: "md", prompt: "Tell me about his education" },
  { name: "experience.log", type: "log", prompt: "Tell me about his experience" },
];

const CHECKLIST_ITEMS = [
  "Skills",
  "Experience",
  "Projects",
  "Requirements",
  "Gaps",
  "Overall fit",
];


// =========================================================
// ICONS
// =========================================================

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3.5 10.5H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v0.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"></line>
      <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M13.5 8A5.5 5.5 0 1 1 11.9 4.1M13.5 2.5v3.5H10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1.5v1.6M8 12.9v1.6M14.5 8h-1.6M3.1 8H1.5M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1M12.4 12.4l-1.1-1.1M4.7 4.7 3.6 3.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}


// =========================================================
// SCORE → status mapping (git-CI style verdicts)
// =========================================================

function scoreMeta(score) {
  const value = Math.max(0, Math.min(100, Math.round(score || 0)));

  if (value >= 75) {
    return { value, tag: "PASS", text: "Strong match", colorVar: "--mint" };
  }
  if (value >= 50) {
    return { value, tag: "REVIEW", text: "Partial match", colorVar: "--amber" };
  }
  return { value, tag: "GAP", text: "Limited match", colorVar: "--rose" };
}


// =========================================================
// MAIN APP
// =========================================================

function App() {

  // --- chat state ---
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

  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem("chat_messages", JSON.stringify(messages));
      }
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  function handleCopy(text, index) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  // --- mode state ---
  const [mode, setMode] = useState("chat");
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");

  const scrollRef = useRef(null);
  const gutterRef = useRef(null);

  // --- theme (light / dark) ---
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);


  // =========================================================
  // SEND CHAT MESSAGE
  // =========================================================

  async function sendMessage(overrideText) {

    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };

    setInput("");

    // Prior messages before adding current user message (fixes duplication bug)
    const priorHistory = messages;
    setMessages([...priorHistory, userMessage]);
    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: userMessage.content,
            history: priorHistory,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment before sending another message.");
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

        // Throttle UI re-renders every 3 chunks to eliminate DOM stutter on mobile
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

      // Final commit ensuring 100% of streamed tokens are rendered
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
        : "Sorry, something went wrong while generating the response. Please try again.";

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
  // JOB DESCRIPTION MATCHING
  // =========================================================

  async function checkJobMatch() {

    if (!jobDescription.trim()) return;

    setMatchLoading(true);
    setMatchResult(null);
    setMatchError("");

    try {

      const response = await fetch(
        `${API_URL}/match`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_description: jobDescription }),
        }
      );

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
  // UI
  // =========================================================

  return (

    <div className="app">

      {/* =====================================================
          WINDOW CHROME
      ===================================================== */}

      <div className="window-chrome">

        <div className="chrome-dots">
          <span className="dot dot--rose" />
          <span className="dot dot--amber" />
          <span className="dot dot--mint" />
        </div>

        <div className="chrome-title">sumit — ai-assistant</div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle light and dark mode"
        >
          {theme === "dark" ? <MoonIcon /> : <SunIcon />}
        </button>

        <div className="chrome-status">
          <span className="status-dot" />
          live
        </div>

      </div>


      {/* =====================================================
          WORKSPACE
      ===================================================== */}

      <div className="workspace">


        {/* =================================================
            SIDEBAR — file explorer
        ================================================= */}

        <aside className="sidebar">

          <p className="sidebar-label">Explorer</p>

          <div className="file-tree">

            <p className="tree-folder">profile</p>

            {STARTER_FILES.map((file) => (
              <button
                key={file.name}
                className="tree-file"
                onClick={() => handleStarterPrompt(file.prompt)}
                disabled={loading}
              >
                <span className={`file-dot file-dot--${file.type}`} />
                {file.name}
              </button>
            ))}

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="tree-file"
              style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}
              title="View / Download Sumit's Resume (PDF)"
            >
              <span className="file-dot" style={{ background: "#f43f5e" }} />
              resume.pdf ↗
            </a>

          </div>

          <p className="sidebar-label sidebar-label--spaced">candidate.json</p>

          <div className="json-card">

            <div className="json-line">
              <span className="json-punct">{"{"}</span>
            </div>

            <div className="json-line json-line--indent">
              <span className="json-key">"name"</span>
              <span className="json-punct">: </span>
              <span className="json-string">"{CANDIDATE.name}"</span>
              <span className="json-punct">,</span>
            </div>

            <div className="json-line json-line--indent">
              <span className="json-key">"role"</span>
              <span className="json-punct">: </span>
              <span className="json-string">"{CANDIDATE.role}"</span>
              <span className="json-punct">,</span>
            </div>

            {CANDIDATE_JSON.map((fact) => (
              <div className="json-line json-line--indent" key={fact.key}>
                <span className="json-key">"{fact.key}"</span>
                <span className="json-punct">: </span>
                <span className="json-string">"{fact.value}"</span>
                <span className="json-punct">,</span>
              </div>
            ))}

            <div className="json-line json-line--indent">
              <span className="json-key">"status"</span>
              <span className="json-punct">: </span>
              <span className="json-string json-string--status">"online"</span>
            </div>

            <div className="json-line">
              <span className="json-punct">{"}"}</span>
            </div>

          </div>

        </aside>


        {/* =================================================
            MAIN
        ================================================= */}

        <main className="main">

          <div className="tab-bar">

            <div className="tabs">

              <button
                className={mode === "chat" ? "tab active" : "tab"}
                onClick={() => setMode("chat")}
              >
                <span className="tab-dot tab-dot--chat" />
                chat.tsx
              </button>

              <button
                className={mode === "match" ? "tab active" : "tab"}
                onClick={() => setMode("match")}
              >
                <span className="tab-dot tab-dot--match" />
                match.run
              </button>

            </div>

            {mode === "chat" && messages.length > 0 && (
              <button className="tab-action" onClick={handleNewChat} aria-label="Restart session">
                <RestartIcon />
              </button>
            )}

          </div>


          {/* ===============================================
              CHAT MODE
          =============================================== */}

          {mode === "chat" && (

            <>

              <div className="console" ref={scrollRef}>

                {messages.length === 0 && (
                  <div className="motd">
                    <div className="motd-badge">
                      <span className="badge-pulse" />
                      <span>Online · Sumit Kumar Portfolio AI</span>
                    </div>

                    <h1 className="motd-headline">
                      Hi! Ask me anything about <span className="text-gradient">Sumit</span>
                    </h1>

                    <p className="motd-desc">
                      MCA student at <strong>NIT Jamshedpur</strong> specializing in <strong>AI/ML Engineering</strong> and <strong>Full-Stack Development</strong>. Type your question below or click a starter:
                    </p>

                    <div className="motd-starters">
                      <button
                        className="starter-card"
                        onClick={() => handleStarterPrompt("What projects has Sumit built?")}
                      >
                        <span className="starter-icon">🚀</span>
                        <div className="starter-info">
                          <span className="starter-title">Projects</span>
                          <span className="starter-query">AI Resume Matcher, Draw.Together...</span>
                        </div>
                      </button>

                      <button
                        className="starter-card"
                        onClick={() => handleStarterPrompt("What is Sumit's technical skillset and background?")}
                      >
                        <span className="starter-icon">⚡</span>
                        <div className="starter-info">
                          <span className="starter-title">Tech Stack</span>
                          <span className="starter-query">Python, React, Node.js, C++ DSA...</span>
                        </div>
                      </button>

                      <button
                        className="starter-card"
                        onClick={() => handleStarterPrompt("Tell me about his education and internship experience")}
                      >
                        <span className="starter-icon">🎓</span>
                        <div className="starter-info">
                          <span className="starter-title">Experience & College</span>
                          <span className="starter-query">NIT Jamshedpur (MCA) & Shikom Intern</span>
                        </div>
                      </button>

                      <button
                        className="starter-card"
                        onClick={() => handleStarterPrompt("sumit kon hai batana")}
                      >
                        <span className="starter-icon">💬</span>
                        <div className="starter-info">
                          <span className="starter-title">Hindi / Hinglish</span>
                          <span className="starter-query">Sumit ke baare me Hindi me jaano</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                <div className="log">
                  {messages.map((message, index) => {
                    const isLast = index === messages.length - 1;
                    const isStreamingThis = loading && isLast && message.role === "assistant";
                    const isWaitingFirstToken = isStreamingThis && !message.content;

                    return (
                      <div
                        key={index}
                        className={`log-line log-line--${message.role}`}
                      >
                        <span className="log-prefix">
                          {message.role === "user" ? "$" : ">"}
                        </span>

                        <div className="log-content">
                          {message.role === "user" ? (
                            <span className="log-text">{message.content}</span>
                          ) : isWaitingFirstToken ? (
                            <div className="ai-thinking">
                              <span className="thinking-pulse" />
                              <span className="thinking-text">Thinking...</span>
                            </div>
                          ) : (
                            <div className="ai-bubble">
                              <div className="ai-response">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                                {isStreamingThis && <span className="streaming-cursor">▊</span>}
                              </div>
                              {!isStreamingThis && message.content && (
                                <div className="ai-actions">
                                  <button
                                    className="action-btn copy-btn"
                                    onClick={() => handleCopy(message.content, index)}
                                    title="Copy response"
                                  >
                                    {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
                                    <span>{copiedIndex === index ? "Copied!" : "Copy"}</span>
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

              </div>

              <div className="input-dock">
                <div className="input-box">
                  <div className="input-prefix">
                    <span className="terminal-symbol">$</span>
                  </div>

                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask about ${CANDIDATE.name}...`}
                    rows="1"
                    disabled={loading}
                  />

                  <button
                    className={`send-btn ${input.trim() ? "send-btn--active" : ""}`}
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                  >
                    <SendArrowIcon />
                  </button>
                </div>
              </div>

            </>

          )}


          {/* ===============================================
              JOB MATCH MODE
          =============================================== */}

          {mode === "match" && (

            <div className="console match-console">

              <div className="match-intro">
                <p className="match-heading">Run a fit check</p>
                <p className="match-sub">
                  Paste a job description below and see how {CANDIDATE.name}
                  {" "}lines up, requirement by requirement.
                </p>
              </div>

              <div className="editor-card">

                <label htmlFor="jd" className="editor-label">
                  job_description.txt
                </label>

                <div className="editor-body">

                  <div className="gutter" ref={gutterRef}>
                    {lineNumbers.map((n) => (
                      <div key={n}>{n}</div>
                    ))}
                  </div>

                  <textarea
                    id="jd"
                    className="editor-textarea"
                    value={jobDescription}
                    onChange={(event) => setJobDescription(event.target.value)}
                    onScroll={handleJdScroll}
                    placeholder={"Paste the job description here…"}
                    spellCheck="false"
                  />

                </div>

                <button
                  className="run-analysis-btn"
                  onClick={checkJobMatch}
                  disabled={matchLoading || !jobDescription.trim()}
                >
                  {matchLoading ? "Running…" : "▶ Run analysis"}
                </button>

                {matchError && (
                  <div style={{
                    marginTop: "12px",
                    padding: "10px 14px",
                    background: "rgba(244, 63, 94, 0.12)",
                    border: "1px solid rgba(244, 63, 94, 0.35)",
                    borderRadius: "6px",
                    color: "#fb7185",
                    fontSize: "13px",
                    lineHeight: "1.4"
                  }}>
                    ⚠ {matchError}
                  </div>
                )}

              </div>

              {matchResult && (

                <div className="match-output">

                  <div className="meter-card">

                    <div className="meter-head">
                      <span className="meter-label">overall_fit</span>
                      <span className="meter-value" style={{ color: `var(${meta.colorVar})` }}>
                        {meta.value}%
                      </span>
                    </div>

                    <div className="meter-track">
                      <div
                        className="meter-fill"
                        style={{
                          width: `${meta.value}%`,
                          background: `var(${meta.colorVar})`,
                        }}
                      />
                    </div>

                    <p className="meter-status" style={{ color: `var(${meta.colorVar})` }}>
                      [{meta.tag}] {meta.text}
                    </p>

                  </div>

                  <div className="log-block">
                    <span className="log-tag">recommendation</span>
                    <p>{matchResult.recommendation || "No recommendation available."}</p>
                  </div>

                  <div className="diff-card">

                    <div className="diff-col diff-col--add">
                      <p className="diff-head">+ matches</p>
                      {(matchResult.matched_skills || []).map((skill, index) => (
                        <p className="diff-line diff-line--add" key={index}>+ {skill}</p>
                      ))}
                    </div>

                    <div className="diff-col diff-col--del">
                      <p className="diff-head">− gaps</p>
                      {(matchResult.missing_skills || []).map((skill, index) => (
                        <p className="diff-line diff-line--del" key={index}>− {skill}</p>
                      ))}
                    </div>

                  </div>

                  <div className="notes-columns">

                    <div className="notes-card notes-card--mint">
                      <p className="notes-head"># strengths</p>
                      {(matchResult.candidate_strengths || []).map((item, index) => (
                        <p className="notes-line" key={index}>— {item}</p>
                      ))}
                    </div>

                    <div className="notes-card notes-card--amber">
                      <p className="notes-head"># considerations</p>
                      {(matchResult.candidate_gaps || []).map((item, index) => (
                        <p className="notes-line" key={index}>— {item}</p>
                      ))}
                    </div>

                  </div>

                  <div className="comment-block">
                    <p className="comment-head">/* why this score */</p>
                    <p className="comment-text">
                      {matchResult.explanation || "No explanation available."}
                    </p>
                  </div>

                </div>

              )}

              {!matchResult && !matchLoading && (

                <div className="checklist-card">

                  <p className="checklist-head">// this checks</p>

                  <div className="checklist">
                    {CHECKLIST_ITEMS.map((item) => (
                      <p className="checklist-item" key={item}>
                        <span className="checkbox" />
                        {item}
                      </p>
                    ))}
                  </div>

                </div>

              )}

            </div>

          )}

        </main>

      </div>

    </div>
  );
}


export default App;