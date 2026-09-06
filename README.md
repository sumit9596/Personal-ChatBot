# 🤖 Personal AI ChatBot

An AI-powered personal portfolio chatbot that allows recruiters and visitors to interact with my professional profile through natural language.

Instead of manually browsing through a resume, users can simply ask questions such as:

* What projects has Sumit built?
* Tell me about his education.
* What are his technical skills?
* What is his internship experience?
* What are his career goals?
* What are his strengths?
* Why should we hire him?
* Is Sumit suitable for an AI Engineer role?

The chatbot uses an LLM to understand the user's question and generate a natural-language response based on my professional profile.

## 🚀 Live Demo

**Frontend:**
https://personal-chat-bot-psi.vercel.app

**Backend API:**
https://personal-chatbot-backend-bam4.onrender.com

**API Documentation:**
https://personal-chatbot-backend-bam4.onrender.com/docs

## ✨ Features

* 💬 AI-powered conversational interface
* 👨‍💻 Personal profile-based responses
* 🎓 Education and academic information
* 🛠️ Technical skills
* 🚀 Project information
* 💼 Internship and professional experience
* 🤝 Soft skills and professional preferences
* 🎯 Short-term and long-term career goals
* 🤖 AI/ML experience
* 📊 Role and eligibility-related questions
* 🔗 GitHub and LinkedIn information
* 📱 Responsive chat interface
* ⚡ FastAPI backend
* 🔐 API key stored securely using environment variables

## 🧠 How It Works

The application follows a simple client-server architecture:

```text
                    User
                      │
                      ▼
              React Frontend
                      │
                      │ POST /chat
                      ▼
              FastAPI Backend
                      │
                      ▼
             Profile Information
                      │
                      ▼
                 LLM / Groq
                      │
                      ▼
              Generated Response
                      │
                      ▼
              React Chat UI
```

### Request Flow

1. User enters a question in the chat interface.
2. React sends the question to the FastAPI backend.
3. FastAPI receives the request through the `/chat` endpoint.
4. The backend provides the relevant profile context to the LLM.
5. The LLM generates a natural-language response.
6. The response is returned to the React frontend.
7. The frontend displays the answer in the chat interface.

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript
* Vite
* Tailwind CSS
* HTML/CSS

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

### AI

* Large Language Model (LLM)
* Groq API
* Prompt-based profile grounding

### Deployment

* Vercel — Frontend
* Render — Backend
* GitHub — Source Code & Version Control

## 📁 Project Structure

```text
Personal-ChatBot/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 🔌 API

### POST `/chat`

Used to send a user question to the AI chatbot.

Example request:

```json
{
  "message": "What projects has Sumit built?"
}
```

Example response:

```json
{
  "response": "Sumit has built three major projects: Draw.Together, Movie Recommender App, and AI Resume Matcher..."
}
```

### GET `/`

Used to check whether the backend is running.

Response:

```json
{
  "message": "AI Resume Portfolio API is running!"
}
```

## ⚙️ Environment Variables

### Backend

Create a `.env` file inside the backend directory:

```env
GROQ_API_KEY=your_groq_api_key
```

### Frontend

For local development:

```env
VITE_API_URL=http://127.0.0.1:8000
```

For production:

```env
VITE_API_URL=https://personal-chatbot-backend-bam4.onrender.com
```

The frontend uses `VITE_API_URL` to communicate with the deployed FastAPI backend.

## 💻 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/sumit9596/Personal-ChatBot.git

cd Personal-ChatBot
```

### 2. Setup Backend

```bash
cd backend

python -m venv .venv
```

Activate the virtual environment on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend:

```bash
python -m uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

## 🎯 Example Questions

The chatbot can answer questions related to my professional profile.

### About Me

```text
Tell me about Sumit.
Who is Sumit?
Give me a brief introduction.
```

### Education

```text
Where did Sumit study?
What is his degree?
What is his CGPA?
```

### Projects

```text
What projects has Sumit built?
Tell me about the AI Resume Matcher.
Explain Draw.Together.
What technologies did he use?
```

### Experience

```text
Tell me about his internship.
Where did Sumit work?
What did he do during his internship?
```

### Skills

```text
What are Sumit's technical skills?
What programming languages does he know?
Does he know React?
Does he have AI/ML experience?
```

### HR / Behavioral Questions

```text
What are Sumit's strengths?
What are his weaknesses?
What is his short-term goal?
What is his long-term goal?
Why should we hire Sumit?
How does he work in a team?
How does he handle challenges?
What kind of work environment does he prefer?
How does he approach learning new technologies?
```

## 🧩 Key Learning

This project helped me understand:

* Building REST APIs with FastAPI
* Connecting React with a Python backend
* Working with LLM APIs
* Prompt engineering
* Structuring profile information for AI responses
* Environment variable management
* API integration
* CORS and frontend-backend communication
* Production deployment
* Deploying frontend on Vercel
* Deploying backend on Render
* Git and GitHub workflow

## 🔮 Future Improvements

Some planned improvements include:

* Resume upload functionality
* Semantic search using embeddings
* Vector database integration
* Retrieval-Augmented Generation (RAG)
* Conversation memory
* Better response formatting
* Role-specific candidate matching
* Resume-job description matching
* Authentication and admin dashboard
* Analytics for frequently asked recruiter questions

## 👨‍💻 About Me

**Sumit Kumar**
M.C.A — National Institute of Technology Jamshedpur

Interested in:

* Artificial Intelligence
* Machine Learning
* LLM Applications
* Full Stack Development

### Connect With Me

**GitHub:**
https://github.com/sumit9596

**LinkedIn:**
https://linkedin.com/in/sumit9596/

---

⭐ If you find this project interesting, feel free to explore the repository and connect with me.
