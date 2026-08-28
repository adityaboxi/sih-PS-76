# JanSetu AI | AI-Based Citizen Grievance Prioritization and Routing System
### Smart India Hackathon (SIH) — Problem Statement 76

JanSetu AI is an end-to-end, production-grade, highly scalable multilingual citizen grievance portal built to process, prioritize, classify, and route complaints across 10+ public departments with zero data loss.

---

## 🌟 Key Capabilities & Hackathon Innovations

1. **All Major Indian Languages Supported**:
   - Native support for **Bengali (বাংলা), Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Marathi (मराठी), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼ିଆ), Assamese (অসমীয়া), and English**.
   - Citizens can type or use the **built-in microphone button** to speak in their regional dialect.
2. **Zero-Discard False Grievance & Spam Filter**:
   - Prevents catastrophic loss of genuine emergency grievances.
   - Tri-Tier Confidence Triage: High Confidence ($\ge 80$), Low-Specificity ($40	ext{--}79$), and Review Queue ($< 40$) where ambiguous cases are queued for officer inspection rather than discarded.
3. **Semantic Duplicate Detection & Clustering**:
   - Uses cross-lingual vector cosine similarity to group repeated complaints (e.g. 50 citizens reporting the same broken water pipe) under a single **Master Ticket**.
4. **Transparent Explainable AI (XAI)**:
   - For every routing and urgency decision, the AI highlights exact trigger words and generates a bilingual justification in both the citizen's mother tongue and English.
5. **Multilingual Conversational RAG Assistant ("Nagrik Sahayak")**:
   - Floating chat assistant providing instant SOP guidance, required document checklists, and live grievance tracking.
6. **High-Scale Decoupled Architecture (Scalable to Lakhs of Users)**:
   - Separates lightweight Node.js CRUD I/O operations from heavy Python ML inference.

---

## 🏗️ Architecture & Tech Stack

```
[React.js Client (i18n Multilingual)]
          │ (Port 3000)
          ▼
[Node.js / Express CRUD Server] ──── (Port 5000)
          │
          ├─► [In-Memory / PostgreSQL Database (Persistent JSON Store)]
          │
          ▼
[Python FastAPI & LangChain AI Microservice] ──── (Port 8000)
    ├── Multilingual Language Detector & Concept Normalizer
    ├── Multi-Department Classifier & Urgency Scoring Engine (0-100)
    ├── Semantic Duplicate Vector Matcher
    ├── Zero-Discard Spam Filter
    ├── XAI Transparent Reasoning Generator
    └── Multilingual Conversational RAG Assistant
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Launch All Services (One-Click)
```bash
./start_all.sh
```

### 2. Or Launch Services Individually:

**A. Python AI Service (Port 8000):**
```bash
cd ai_service
pip install -r requirements.txt
python app/main.py
```

**B. Node.js CRUD Backend (Port 5000):**
```bash
cd server
npm install
npm run dev
```

**C. React Client (Port 3000):**
```bash
cd client
npm install
npm run dev
```

---

## 🧪 Demo Test Cases for Hackathon Judges

Try submitting these sample grievances:

1. **Bengali (Water Emergency - High Urgency)**:
   > *"আমাদের যাদবপুর ৮ নম্বর ওয়ার্ডে গত তিন দিন ধরে প্রধান পাইপ ফেটে পানীয় জল নষ্ট হচ্ছে এবং জল সরবরাহ বন্ধ। শিশুরা পানীয় জলের অভাবে অসুস্থ হয়ে পড়ছে।"*
   - **Expected AI Output**: Water Supply & Sanitation | Priority: CRITICAL (Score 92) | SLA: 4 Hours | XAI generated in Bengali & English.

2. **Hindi (Electrical Fire Hazard - Emergency)**:
   > *"मेन रोड पर 11KV का बिजली का तार टूटकर नीचे गिर गया है और उसमें स्पार्क हो रहा है। बहुत बड़ा खतरा है!"*
   - **Expected AI Output**: Electricity & Power Distribution | Priority: CRITICAL (Score 98) | SLA: 2 Hours.

3. **Duplicate Check Demo**:
   - Submit another complaint about *"Water pipe burst in Jadavpur Ward 8"*.
   - **Expected AI Output**: AI automatically links it as a duplicate child incident under the earlier master ticket!

4. **Transparent XAI Inspection**:
   - Click the **"Inspect AI Reasoning"** button on any grievance card to view highlighted trigger keywords and policy justification.
