# 🛠️ RADIX Talent Match — Team Setup & Onboarding Guide

Welcome to the team setup guide for **RADIX Talent Match**. Follow these step-by-step instructions to get both the backend microservices and frontend client running smoothly on your local machine.

---

## 📋 Prerequisites
Ensure you have the following installed before starting:
* **Python 3.10+** (verify with `python --version`)
* **Node.js 18+ & npm** (verify with `node -v` and `npm -v`)
* **Git**

---

## ⚡ Quick Start (3 Steps)

### Step 1: Backend Setup (Terminal 1)

1. Open your terminal in the cloned repository and enter the backend directory:
   ```powershell
   cd backend
   ```

2. *(Recommended)* Create and activate a Python virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
   > **Note for Windows users:** If PowerShell blocks script execution, run:
   > ```powershell
   > Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   > ```

3. Install all required dependencies:
   ```powershell
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. Create a `.env` file inside the `backend/` folder:
   * **File Path:** `backend/.env`
   * **Contents:**
     ```env
     OPENROUTER_API_KEY=<YOUR_OPENROUTER_API_KEY>
     OPENROUTER_MODEL=nvidia/nemotron-3.5-super-vl:free
     PORT=8000
     ```

5. Start the backend server:
   ```powershell
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   * The backend API will be live at: `http://127.0.0.1:8000`
   * Interactive API docs will be at: `http://127.0.0.1:8000/docs`

---

### Step 2: Frontend Setup (Terminal 2)

1. Open a **new terminal window** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create a `.env` file inside the `frontend/` folder to resolve database warnings:
   * **File Path:** `frontend/.env`
   * **Contents:**
     ```env
     VITE_SUPABASE_URL=https://gopyodujrpfbdutlagaf.supabase.co
     VITE_SUPABASE_ANON_KEY=sb_publishable_eVAB3VtCN7ZQ5MbQ1NKCdA_5yLWfDJ4
     VITE_API_URL=http://127.0.0.1:8000
     VITE_ROLE5_API_URL=http://127.0.0.1:8000
     VITE_ROLE2_API_URL=http://127.0.0.1:8000
     ```

3. Install Node dependencies:
   ```bash
   npm install
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   * The React application will be accessible at: `http://localhost:5173`

---

## 🔍 Troubleshooting Common Issues

### ❌ Issue 1: `uvicorn : The term 'uvicorn' is not recognized`
* **Cause:** Python's global `Scripts` directory is not included in Windows system `PATH`, or packages haven't been installed.
* **Fix:** 
  1. Ensure you ran `pip install -r requirements.txt`.
  2. Always start the server using `python -m uvicorn ...` instead of plain `uvicorn ...`. The `python -m` flag tells Python to invoke the module directly from your active Python installation.

---

### ❌ Issue 2: `Database Not Configured` / Supabase Connection Error
* **Cause:** Environment files (`.env`) are excluded from Git commits via `.gitignore` to prevent credential exposure.
* **Fix:** 
  Ensure `frontend/.env` exists and contains the valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as specified in Step 2. Restart the Vite dev server (`npm run dev`) after creating the file.

---

### ❌ Issue 3: `cannot be loaded because running scripts is disabled on this system`
* **Cause:** Windows PowerShell default execution policy prevents activating Python virtual environments.
* **Fix:**
  Run this command inside PowerShell:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
  Then re-run `.\venv\Scripts\Activate.ps1`.

---

### ❌ Issue 4: Port 8000 or 5173 already in use
* **Fix:**
  To free up port 8000 in Windows PowerShell:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
  ```

---

## 🗺️ System Architecture & Ports Summary

| Component | Technology | Default Port / URL | Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Vite + Tailwind | `http://localhost:5173` | Unified UI, Job Explorer, Candidate Profiles, Reports |
| **Backend API** | FastAPI + Uvicorn | `http://127.0.0.1:8000` | Microservices for JD Parsing, Resume Extraction, Skill Matching |
| **Database** | Supabase (PostgreSQL) | Cloud (`*.supabase.co`) | Candidate Profiles, Saved Evaluation Reports |
