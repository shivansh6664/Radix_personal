# RADIX Talent Match — AI Career Intelligence Platform

RADIX Talent Match is an end-to-end AI-powered career evaluation platform built for the **RADIX Talent Match Hackathon (October 2026)**. The tool flips the lens of traditional hiring: instead of filtering applicants from an employer's perspective, it empowers candidates to objectively evaluate how ready they actually are for specific tier-1 tech jobs across an industry-validated 12-skillset competency framework.

---

## 🏛️ System Architecture: 5 Roles Wired Into 1 Flow

```
+---------------------------------------------------------------------------------------+
|                                    RADIX TALENT MATCH                                 |
+---------------------------------------------------------------------------------------+
|  [ Upload JD ]             [ Upload Resume ]                                         |
|         │                          │                                                  |
|         ▼                          ▼                                                  |
|  Role 1: JD Analytics      Role 2: Resume Parser                                      |
|  (Extracts 12-skillset)    (Extracts skills & levels)                                 |
|         │                          │                                                  |
|         │                          ▼                                                  |
|         │                  Role 3: Profile Builder                                    |
|         │                  (Pre-fills & syncs profile)                                |
|         │                          │                                                  |
|         │                          ▼                                                  |
|         │                  Role 4: Talent Check ◄─── (Company Benchmarks JSON)       |
|         │                  (Weighted Readiness Score)                                 |
|         │                          │                                                  |
|         └──────────────┬───────────┘                                                  |
|                        ▼                                                              |
|               Role 5: Skill Matching                                                  |
|               (Fuzzy Token-Sort Fit & Actionable Gap Roadmap)                         |
+---------------------------------------------------------------------------------------+
```

1. **Role 1 — JD Analytics (`/api/extract/jd`):** Extracts required competencies from PDF/DOCX job descriptions with 12-category tagging and confidence ratings.
2. **Role 2 — Resume Parser (`/api/extract/resume`):** Parses PDF/DOCX resumes, maps skills to the 12 competencies, and establishes baseline skill levels (1–10).
3. **Role 3 — Profile Builder (Frontend + Supabase):** Pre-fills candidate details, enables interactive skill verification, and persists state.
4. **Role 4 — Talent Check (`/api/talent-check`):** Benchmarks candidate profile against calibrated corporate hiring bars (Google LLC, Microsoft, Oracle FSS) with weighted category ratios.
5. **Role 5 — Skill Matching (`/api/match`):** Performs fuzzy semantic matching (`thefuzz`, threshold 75) to compute match percentage, highlight quoted evidence, and generate actionable upskilling roadmaps.

---

## 📋 Prerequisites

- **Python 3.10+** (verify with `python --version`)
- **Node.js 18+ & npm** (verify with `node -v` and `npm -v`)
- **Git**

---

## 🚀 Quick Setup & Start Commands

### 1. Backend Service (Terminal 1)

```powershell
# Navigate to backend directory
cd backend

# (Optional) Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables (.env)
# Create backend/.env with:
# OPENROUTER_API_KEY=<your-key>
# OPENROUTER_MODEL=nvidia/nemotron-3.5-super-vl:free
# PORT=8000

# Start FastAPI backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive API Docs (Swagger): `http://127.0.0.1:8000/docs`

---

### 2. Frontend Web Application (Terminal 2)

```powershell
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Configure environment variables (.env)
# Create frontend/.env with:
# VITE_API_URL=http://127.0.0.1:8000
# VITE_ROLE5_API_URL=http://127.0.0.1:8000
# VITE_ROLE2_API_URL=http://127.0.0.1:8000
# VITE_SUPABASE_URL=https://gopyodujrpfbdutlagaf.supabase.co
# VITE_SUPABASE_ANON_KEY=sb_publishable_eVAB3VtCN7ZQ5MbQ1NKCdA_5yLWfDJ4

# Start Vite dev server
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🧪 Automated End-to-End Verification Test

To verify all 5 microservices in one automated sequence:
```powershell
python test_e2e_platform.py
```

---

## 📁 Sample Data Location

- **Job Descriptions:** `dataset_reference/Talent Match Hackathon/JDs/` (`PDF/` and `Word/`)
- **Candidate Resumes:** `dataset_reference/Talent Match Hackathon/Resumes/` (`PDF/` and `Word/`)
- **Company Benchmarks Dataset:** `talent_check_company_skillsets.json` (repository root)

---

## 🔒 Environment Variables (Names Only)

- **Backend:** `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `GEMINI_API_KEY`, `PORT`
- **Frontend:** `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
*(Never commit actual API secret keys into repository commits or submission zips).*
