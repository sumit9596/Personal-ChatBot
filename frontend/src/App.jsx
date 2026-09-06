import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

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

function EnterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path
        d="M13 4v3.5a1.5 1.5 0 0 1-1.5 1.5H4M4 9l3-3M4 9l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- mode state ---
  const [mode, setMode] = useState("chat");
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

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
    if (!text) return;

    const userMessage = { role: "user", content: text };

    setInput("");

    const conversationHistory = [...messages, userMessage];
    setMessages(conversationHistory);
    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: userMessage.content,
            history: conversationHistory,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantAnswer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {

        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantAnswer += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = { ...updated[lastIndex], content: assistantAnswer };
          return updated;
        });

      }

    } catch (error) {

      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
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
  }


  // =========================================================
  // JOB DESCRIPTION MATCHING
  // =========================================================

  async function checkJobMatch() {

    if (!jobDescription.trim()) return;

    setMatchLoading(true);
    setMatchResult(null);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/match",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_description: jobDescription }),
        }
      );

      if (!response.ok) {
        throw new Error(`Match API error: ${response.status}`);
      }

      const data = await response.json();
      setMatchResult(data);

    } catch (error) {

      console.error("Job matching error:", error);
      alert("Job matching failed. Please check whether the backend is running.");

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
                    <p className="motd-title">
                      <span className="motd-accent">sumit-ai</span> v1.0
                    </p>
                    <p className="motd-sub">
                      Ask a question below, or open a file from the explorer.
                    </p>
                    <p className="motd-prompt">
                      <span className="prompt-amber">$</span>
                      <span className="cursor-blink" />
                    </p>
                  </div>

                )}

                <div className="log">

                  {messages.map((message, index) => (

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
                        ) : (
                          <div className="ai-response">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}

                      </div>

                    </div>

                  ))}

                  {loading && (

                    <div className="log-line log-line--assistant">
                      <span className="log-prefix">&gt;</span>
                      <div className="log-content log-content--pending">
                        generating response
                        <span className="cursor-blink" />
                      </div>
                    </div>

                  )}

                </div>

              </div>

              <div className="input-dock">

                <div className="input-line">

                  <span className="input-prompt">$</span>

                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask about ${CANDIDATE.name}...`}
                    rows="1"
                    disabled={loading}
                  />

                  <button
                    className="run-btn"
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                  >
                    <EnterIcon />
                  </button>

                </div>

                <p className="disclaimer">
                  // answers are generated only from the candidate profile
                </p>

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