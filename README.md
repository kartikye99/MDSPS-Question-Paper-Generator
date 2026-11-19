# MDSPS Handwritten Question Paper Converter
> **Maharshi Dayanand Saraswati Public School**
> AI-Powered Handwritten Examination Paper Digitizer & Printable A4 Formatter

---

## 📌 Project Overview
The **MDSPS Question Paper Converter** is a streamlined 3-step document conversion tool inspired by NoteOCR. It allows teachers to convert handwritten examination papers into clean, professionally formatted printable A4 documents in minutes:

- **STEP 1**: Upload handwritten question paper (JPG, PNG, or PDF; multiple pages supported) and provide basic examination details.
- **STEP 2**: AI reads and transcribes English, Hindi (Devanagari), and mixed text, preserving original wording, equations, question order, section headings, and marks.
- **STEP 3**: Directly view the final formatted examination paper with one-click **PRINT QUESTION PAPER** and **DOWNLOAD PDF** actions.

---

## 🏗️ Architecture & Directory Structure

```text
mdsp/
├── client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── public/                 # Static assets & SVG school logo
│   ├── src/
│   │   ├── components/         # Modular UI components
│   │   │   ├── Header.jsx      # Compact MDSPS school header
│   │   │   ├── ExamDetailsForm.jsx # 6 core exam fields (School, Type, Class, Subject, Time, Max Marks)
│   │   │   ├── FileUploadArea.jsx # NoteOCR-inspired large drag-and-drop zone
│   │   │   ├── FinalExaminationPaper.jsx # Typeset A4 examination paper with Print & PDF actions
│   │   │   ├── SystemStatusModal.jsx # Discrete system & API health drawer
│   │   │   ├── ApiKeyNoticeModal.jsx # Helpful Gemini API setup guidance
│   │   │   └── LogoPlaceholder.jsx # Vector school emblem
│   │   ├── services/
│   │   │   └── api.js          # Unified API service layer
│   │   ├── App.jsx             # 3-Step workflow orchestrator
│   │   ├── index.css           # Tailwind CSS directives & A4 print CSS
│   │   └── main.jsx            # React root mount
│   ├── index.html              # HTML entry with Devanagari fonts
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # School branding colors & typography
│   └── vite.config.js          # Vite config with API reverse proxy
│
├── server/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/        # Request handling logic
│   │   │   ├── health.controller.js # Health diagnostic endpoint
│   │   │   └── upload.controller.js # Multipart file upload & verification
│   │   ├── services/           # AI Vision & business services
│   │   │   └── gemini.service.js # Google Gemini Vision bilingual OCR
│   │   ├── middlewares/        # Error & upload handling
│   │   │   ├── errorHandler.js # Centralized error & 404 handler
│   │   │   └── upload.middleware.js # Multer configuration & validation
│   │   ├── routes/             # Express API routes
│   │   │   ├── health.routes.js# GET /api/health
│   │   │   └── upload.routes.js# POST /api/upload
│   │   └── index.js            # Express server entry point
│   ├── .env.example            # Environment template
│   ├── .env                    # Local environment config
│   └── package.json            # Backend dependencies
│
├── .gitignore                  # Git ignore rules
├── package.json                # Root workspace scripts (runs both client & server)
└── README.md                   # Project documentation & execution guide
```

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, Multer, Cors, Dotenv
- **AI Vision OCR**: Google Gemini Vision API (`@google/generative-ai`)
- **Document Output**: CSS `@media print` A4 engine & PDF generation
- **State Storage**: LocalStorage initially (zero-friction, no login required)

---

## ⚙️ Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v26)
- **npm**: v9.0.0 or higher

---

## 🚀 Installation & Setup

### 1. Install All Dependencies
From the project root:

```bash
# Install root, server, and client dependencies in one command
npm run install:all
```

*Or install them individually:*
```bash
# Root dependencies
npm install

# Backend dependencies
cd server && npm install && cd ..

# Frontend dependencies
cd client && npm install && cd ..
```

---

## 🔑 Environment Configuration
The backend uses environment variables located in `server/.env`. A template is provided at `server/.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Google Gemini API Key (Vision & OCR Extraction)
# Obtain your key from: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** The server will start and serve the `/api/health` endpoint even before adding the Gemini API key. Once ready for Step 2, obtain a Gemini API key and add it to `server/.env`.

---

## 💻 Running the Application

### Option A: Run Both Frontend and Backend Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```

### Option B: Run Services Separately
**Start Backend Server:**
```bash
npm run dev:server
# or: cd server && npm run dev
```
Backend will start on: **http://localhost:5000**
Health check endpoint: **http://localhost:5000/api/health**

**Start Frontend Application:**
```bash
npm run dev:client
# or: cd client && npm run dev
```
Frontend will start on: **http://localhost:5173**

---

## 🩺 Verifying Health Check Endpoint
To test the backend health check directly via curl:
```bash
curl http://localhost:5000/api/health
```

Expected JSON response:
```json
{
  "status": "healthy",
  "message": "MDSPS Question Paper Generator API is running",
  "school": {
    "name": "Maharshi Dayanand Saraswati Public School",
    "shortName": "MDSPS"
  },
  "version": "1.0.0",
  "timestamp": "2026-11-19T...",
  "uptime": "12s",
  "environment": "development",
  "services": {
    "api": "online",
    "geminiVision": "pending_api_key"
  }
}
```

The frontend will automatically display this operational state under the **System & API Health Status** dashboard widget.
