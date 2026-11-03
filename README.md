# 🤖 Sumit Kumar — AI Portfolio & Career Representative

[![Live Frontend](https://img.shields.io/badge/Live-Vercel-black?style=flat&logo=vercel)](https://personal-chat-bot-psi.vercel.app)
[![Live Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render)](https://personal-chatbot-backend-jsnx.onrender.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev)
[![Groq](https://img.shields.io/badge/Groq_API-f55036?style=flat)](https://groq.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)

An autonomous, full-stack AI career platform representing **Sumit Kumar** (MCA candidate at **National Institute of Technology, Jamshedpur**).

Instead of sifting through static PDFs, recruiters and hiring managers can query technical coursework, algorithmic problem solving, flagship engineering projects, and internship experience via natural dialogue — in English or Hindi/Hinglish — or run an automated **Job Description Fit Analysis (`/match`)** to benchmark role suitability.

---

## 🚀 Live Deployments

* **Interactive Frontend:** [https://personal-chat-bot-psi.vercel.app](https://personal-chat-bot-psi.vercel.app)
* **Backend API Base:** [https://personal-chatbot-backend-jsnx.onrender.com](https://personal-chatbot-backend-jsnx.onrender.com)
* **Interactive API Docs (Swagger):** [https://personal-chatbot-backend-jsnx.onrender.com/docs](https://personal-chatbot-backend-jsnx.onrender.com/docs)
* **Health Check:** [https://personal-chatbot-backend-jsnx.onrender.com/health](https://personal-chatbot-backend-jsnx.onrender.com/health)

---

## ✨ Key Capabilities & Highlights

* **Multi-Provider AI Failover Engine:**
  - **Tier 1:** High-speed inference using Groq `llama-3.3-70b-versatile`.
  - **Tier 2:** Low-latency fallback on Groq `llama-3.1-8b-instant`.
  - **Tier 3:** Zero-downtime automated failover to Google Gemini (`gemini-3.5-flash`) via streaming SSE when rate limits are approached.
* **Job Description Fit Analyzer (`/match`):**
  - Evaluates uploaded/pasted Job Descriptions against verified candidate competencies.
  - Generates objective suitability scores (0–100%), matched skills, gap identification, candidate strengths, and a dynamically tailored resume preview.
* **Authenticity & Security Guardrails:**
  - Prompt injection protection prevents jailbreaks or persona tampering.
  - Grounded factual integrity: strictly responds from candidate's verified coursework, projects, and internship.
  - Sanitized public profile endpoint (`/profile`) masking private contact info against web scrapers.
  - In-memory sliding-window IP rate limiting preventing token depletion.
* **Bilingual & Conversational Intelligence:**
  - Understands and dynamically replies in the user's language — seamlessly switches between English and natural Hindi/Hinglish.
* **Terminal & Code-Editor UI:**
  - JetBrains Mono terminal aesthetic with dark/light themes, custom cyber "S" SVG brand mark, interactive luminous particle background, and real-time streaming tokens.
* **Full Mobile & Tablet Responsiveness:**
  - Horizontal swipeable starter chips on mobile, no-auto-zoom iOS input handling (`16px`), and touch-optimized action buttons.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 19, Vite 8, JavaScript (ES6+)
* **Styling & Effects:** Custom Modern CSS, CSS Variables, Theme Tokens, Canvas 2D Interactive Particle Background
* **Markdown Engine:** `react-markdown`, `remark-gfm` (custom secure external tab renderers)
* **Hosting:** Vercel Global Edge Network

### Backend & AI
* **Framework:** FastAPI, Uvicorn, Python 3
* **Validation & Schemas:** Pydantic v2
* **LLM Orchestration:** Groq SDK, Google Gemini REST API (HTTPX SSE Streaming)
* **Deployment & Proxy:** Render Linux Web Service, Gunicorn/Uvicorn, `X-Accel-Buffering: no` unbuffered SSE proxy streaming

---

## 🏗️ Architecture & Data Flow

```text
 ┌────────────────────────────────────────────────────────┐
 │                   Visitor / Recruiter                  │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │               React 19 Frontend (Vercel)              │
 │  - Terminal Shell      - Light/Dark Mode Toggle        │
 │  - Real-time Stream    - Mobile Swipeable File Chips   │
 └─────────────┬────────────────────────────┬─────────────┘
               │ POST /chat (Streaming SSE) │ POST /match (JSON)
               ▼                            ▼
 ┌────────────────────────────────────────────────────────┐
 │                FastAPI Backend (Render)                │
 │  - Rate Limiter        - Prompt Guardrails             │
 │  - candidate.json      - Regex CORS Middleware         │
 └─────────────┬────────────────────────────┬─────────────┘
               │                            │
      [Tier 1 & Tier 2]            [Tier 3 Automated Backup]
               ▼                            ▼
 ┌───────────────────────────┐    ┌───────────────────────┐
 │         Groq Cloud        │    │     Google Gemini     │
 │  - llama-3.3-70b          │───▶│  - gemini-3.5-flash   │
 │  - llama-3.1-8b (Fallback)│    │  - Streaming HTTPX    │
 └───────────────────────────┘    └───────────────────────┘
```

---

## 🔌 API Reference

### 1. `POST /chat`
Real-time token-streamed response regarding candidate background.

**Request Payload:**
```json
{
  "question": "What is Sumit's experience with Docker and Linux?",
  "history": [
    { "role": "user", "content": "Hi!" },
    { "role": "assistant", "content": "Hello! How can I help you explore Sumit's profile?" }
  ]
}
```

**Response:**
* Streams chunks of `text/plain; charset=utf-8` using Server-Sent Events.

---

### 2. `POST /match`
Evaluates job description compatibility and outputs structured fit analysis.

**Request Payload:**
```json
{
  "job_description": "We are seeking a Full-Stack Developer proficient in React, Node.js, and MongoDB..."
}
```

**Response:**
```json
{
  "suitability_score": 88.0,
  "matched_skills": ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
  "missing_skills": ["Docker in Production"],
  "candidate_strengths": ["Strong foundational full-stack projects", "NIT Jamshedpur MCA academic rigor"],
  "candidate_gaps": ["Active learner currently mastering containerized deployment"],
  "recommendation": "Strong candidate for full-stack web development roles.",
  "explanation": "Sumit possesses verified hands-on experience in React and Node.js with production internship delivery.",
  "tailored_resume": {
    "headline": "Full-Stack Web Developer",
    "summary": "Full-stack developer with hands-on experience in React, Node.js, Express, and MongoDB.",
    "highlighted_skills": ["React", "Node.js", "Express.js", "MongoDB", "C++"],
    "recommended_project_ids": ["online-book-store", "ai-database-query-assistant"],
    "relevance_highlights": ["Built responsive full-stack applications with JWT authentication and REST APIs."]
  }
}
```

---

### 3. `GET /profile`
Returns sanitized public candidate profile with masked phone numbers to protect against scrapers.

---

### 4. `GET /health`
Returns JSON status checking service uptime:
```json
{
  "status": "healthy",
  "candidate": "Sumit Kumar",
  "education": "M.C.A — NIT Jamshedpur",
  "message": "Sumit Kumar Career & AI Resume API is running!"
}
```

---

## 💻 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/sumit9596/Personal-ChatBot.git
cd Personal-ChatBot
```

### 2. Configure Backend
```bash
cd backend
python -m venv .venv

# Activate Virtual Environment:
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies:
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
ALLOW_ALL_ORIGINS=true
```

Run FastAPI backend:
```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Backend will be live at `http://127.0.0.1:8000`.

---

### 3. Configure Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the Vite development server:
```bash
npm run dev
```
Frontend will be live at `http://localhost:5173`.

---

## 📂 Project Structure

```text
Personal-ChatBot/
├── .gitignore                      # Top-level security ignore rule
├── README.md                       # Comprehensive project documentation
│
├── backend/
│   ├── .env.example                # Backend environment template
│   ├── candidate.json              # Verified knowledge base & role competencies
│   ├── main.py                     # FastAPI server, AI failover & endpoints
│   └── requirements.txt            # Python dependencies (UTF-8 standard)
│
└── frontend/
    ├── .env.example                # Frontend environment template
    ├── index.html                  # HTML entry point, SEO metadata & favicon
    ├── package.json                # React 19 & Vite dependencies
    ├── vite.config.js              # Vite configuration
    ├── public/
    │   ├── favicon.svg             # Cyber 'S' neon mark
    │   └── resume.pdf              # Candidate resume document
    └── src/
        ├── App.css                 # Terminal styles & tablet/mobile responsive system
        ├── App.jsx                 # Main React component, chat & match views
        ├── index.css               # Global reset
        ├── main.jsx                # React root mount
        └── components/
            └── InteractiveBackground.jsx # Luminous canvas tech particle effect
```

---

## 👨‍💻 About Sumit Kumar

* **Education:** Master of Computer Applications (M.C.A.) — **National Institute of Technology, Jamshedpur** (2024 – 2027)
* **Undergraduate:** Bachelor of Computer Applications (B.C.A.) — RLSY College, Aurangabad (8.50 CGPA)
* **Core Competencies:** Data Structures & Algorithms (C++), Full-Stack Web Development (React, Node.js, Express, MongoDB), AI/LLM Applications, DBMS, Operating Systems.
* **Problem Solving:** 300+ problems solved across LeetCode, GeeksforGeeks, and HackerRank (5★ Gold Badge in Problem Solving, C++, Java, SQL).

### Connect With Me
* **GitHub:** [@sumit9596](https://github.com/sumit9596)
* **LinkedIn:** [linkedin.com/in/sumit9596](https://linkedin.com/in/sumit9596/)
* **Email:** [officialsumit9596@gmail.com](mailto:officialsumit9596@gmail.com)
