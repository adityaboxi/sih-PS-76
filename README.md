# 🇮🇳 JanSetu AI | AI-Based Citizen Grievance Prioritization & Routing System
### Smart India Hackathon (SIH) — Problem Statement 76 (PS 76)

**JanSetu AI** is a production-grade, highly scalable, multilingual citizen grievance redressal platform engineered to ingest, categorize, prioritize, detect duplicates, and route complaints across 10+ public departments in real-time with zero data loss.

---

## 🌟 Key Capabilities & Hackathon Innovations

1. **Multilingual & Vernacular Speech Ingestion (12+ Indian Languages)**:
   - Native support for **Bengali (বাংলা), Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Marathi (मराठी), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼িଆ), Assamese (অসমীয়া), and English**.
   - Built-in **Voice-to-Text Speech Recognition** allows rural citizens to speak directly in their regional mother tongue.
2. **Zero-Discard False Grievance & Spam Safeguard**:
   - Prevents catastrophic loss of genuine emergency grievances.
   - **Tri-Tier Confidence Triage**: High Confidence ($\ge 80$), Ambiguous/Low-Specificity ($40\text{--}79$), and Review Queue ($< 40$) where suspected spam/gibberish complaints are routed to a human officer triage queue rather than permanently discarded.
3. **Cross-Lingual Semantic Duplicate Detection & Clustering**:
   - Utilizes dense multilingual vector cosine similarity to identify and group repeat complaints (e.g., 50 citizens in the same ward reporting a burst water pipe) under a single **Master Ticket** with a "+N citizens impacted" indicator.
4. **Transparent Explainable AI (XAI)**:
   - Every routing and urgency decision generates a bilingual audit justification in both the citizen's native language and English, citing exact trigger keywords and government policy rules.
5. **Interactive City GIS Heatmap**:
   - Real-time geospatial mapping of grievances and duplicate clusters across municipal wards for district collectors and nodal officers.
6. **Multilingual Conversational RAG Assistant ("Nagrik Sahayak / নাগরিক সহায়ক")**:
   - Floating RAG assistant providing instant answers about government procedures, required document checklists, and real-time ticket tracking in the user's native language.

---

## 🏗️ System Architecture & Port Mapping

```
                 [Citizen & Officer Web Portal]
                 (React 19 + Tailwind v4 + Vite)
                         │ Port: 5173
                         ▼
        [Node.js Express & Socket.io CRUD Backend]
                         │ Port: 3000
                         ├─► [Persistent JSON / PostgreSQL Store]
                         ▼
       [Python FastAPI & LangChain AI Microservice]
                         │ Port: 4000
       ├── 1. Multilingual Language Engine (IndicTrans/Bhashini)
       ├── 2. Multi-Department Classifier & Urgency Scorer (0-100)
       ├── 3. Semantic Duplicate Vector Cosine Matcher
       ├── 4. Zero-Discard Tri-Tier Spam Safeguard
       ├── 5. Explainable AI (XAI) Transparent Reasoner
       └── 6. Multilingual Conversational RAG Engine
```

---

## 🚀 Quick Start Guide

### Option 1: Run with Docker (Recommended)

Run a single command from the project root:

```bash
docker compose up --build
```

*(To run in detached background mode: `docker compose up --build -d`)*

---

### Option 2: Run Locally (Native Script)

```bash
./start_all.sh
```

---

### Option 3: Run Services Individually

1. **AI Microservice (Python FastAPI)**:
   ```bash
   cd ai_service
   pip install -r requirements.txt
   python app/main.py
   # Runs at http://localhost:4000 (Swagger docs at /docs)
   ```

2. **Backend Server (Node.js & Socket.io)**:
   ```bash
   cd server
   npm install
   npm start
   # Runs at http://localhost:3000/api
   ```

3. **Frontend Client (React Vite)**:
   ```bash
   cd client
   npm install
   npm run dev
   # Runs at http://localhost:5173
   ```

---

## 🌐 Live Access Endpoints

| Component | Local URL | Description |
| :--- | :--- | :--- |
| **Frontend Portal** | `http://localhost:5173` | Citizen grievance wizard, tracking stepper, officer board & GIS heatmap |
| **Backend API** | `http://localhost:3000/api` | Express REST routes & Socket.io WebSocket server |
| **AI Swagger Docs** | `http://localhost:4000/docs` | Interactive OpenAPI documentation for AI triage & RAG endpoints |

---

## 🧪 Demo Test Cases for Hackathon Judges

Try clicking the **1-Click Judge Demo Presets** in the submission form:

1. **Bengali (Water Emergency — Critical)**:
   > *"আমাদের যাদবপুর ৮ নম্বর ওয়ার্ডে গত তিন দিন ধরে প্রধান পাইপ ফেটে পানীয় জল নষ্ট হচ্ছে এবং জল সরবরাহ বন্ধ। শিশুরা পানীয় জলের অভাবে অসুস্থ হয়ে পড়ছে।"*
   - **AI Result**: Water Supply & Sanitation | Priority: **CRITICAL (Score 95)** | SLA: **4 Hours** | Full XAI generated in Bengali & English.

2. **Hindi (Electrical Fire Hazard — Emergency)**:
   > *"मेन रोड पर 11KV का बिजली का तार टूटकर नीचे गिर गया है और उसमें स्पार्क हो रहा है। बहुत बड़ा खतरा है!"*
   - **AI Result**: Electricity & Power Distribution | Priority: **CRITICAL (Score 98)** | SLA: **2 Hours**.

3. **Cross-Lingual Duplicate Incident Clustering**:
   - File another complaint in English: *"Water pipe burst in Jadavpur Ward 8 near bus stand"*.
   - **AI Result**: Automatically groups as a duplicate child incident under the earlier Bengali master ticket!

4. **Zero-Discard Review Queue**:
   - Type random characters like *"asdfghjk 12345 testing"*.
   - **AI Result**: Routed safely to the **Review Queue** for officer validation rather than being discarded.

5. **Transparent Explainable AI (XAI)**:
   - Click the **"Inspect AI Reasoning"** button on any grievance card to view highlighted trigger keywords and policy justification.

---

## 📂 Project Directory Structure

```
SIH/
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── README.md
├── start_all.sh
│
├── client/                     # React Frontend (Port 5173)
│   ├── .env                    # VITE_API_BASE_URL=http://localhost:3000/api
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx             # Main tab controller
│       ├── components/         # GrievanceForm, Tracker, OfficerDashboard, GISHeatmap, XAIDrawer, ChatAssistant
│       ├── locales/            # 12+ Indian language dictionaries
│       └── services/           # Embedded client AI engine & Socket.io client
│
├── server/                     # Node.js CRUD & Socket.io Backend (Port 3000)
│   ├── .env                    # PORT=3000, AI_SERVICE_URL=http://localhost:4000
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js           # Express + Socket.io Server
│       ├── controllers/        # Grievance, Department, Chat controllers
│       ├── db/                 # Persistent store
│       └── routes/             # REST Endpoints
│
└── ai_service/                 # Python FastAPI & LangChain Engine (Port 4000)
    ├── .env                    # PORT=4000, HOST=0.0.0.0
    ├── Dockerfile
    ├── requirements.txt
    └── app/
        ├── main.py             # FastAPI Server
        ├── schemas.py          # Pydantic data models
        ├── core/               # App configuration & settings
        ├── data/               # Citizen charter knowledge base
        └── pipelines/          # Language Engine, Classifier, Duplicate Engine, Spam Guard, XAI, RAG
```
