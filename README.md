# AI-Powered Personal Health Copilot 🩺✨

> An intelligent, privacy-first personal health copilot designed to help individuals understand, organize, and manage their healthcare journey.
>
> Developed for the **AItrix Labs** Challenge.

![Health Copilot Logo](assets/logo.jpg)

---

## 🌟 Overview & Problem Statement

> *"Design and develop an AI-powered Personal Health Copilot that helps individuals understand, organize, and manage their healthcare journey."*

Modern healthcare can feel overwhelming. Patients frequently leave clinic consultations with complex lab results, disjointed medication schedules, and unresolved questions.

**Health Copilot** bridges this gap by providing an intuitive, empathetic, and clinically grounded digital partner that:
1. **Demystifies Laboratory Biomarkers:** Translates complex blood panels (CMP, Lipid Panels, HbA1c) into plain-English explanations with visual ranges and clear lifestyle guidance.
2. **Triages Symptoms with Acuity Scoring:** Evaluates user-reported symptoms into clinical urgency tiers (**Emergency (911)**, **Urgent Care**, **Routine Clinic**, or **Self-Care**).
3. **Manages Medications & Safety Alerts:** Tracks daily adherence streaks and actively flags potential drug-drug or food-drug interactions (e.g., Lisinopril + Potassium, Statin + Grapefruit).
4. **Prepares Doctor Consultation Sheets:** Automatically compiles vitals telemetry, out-of-range lab findings, and tailored questions to maximize time with healthcare providers.

---

## 🚀 Live Demo & Hosting

This project is built as a zero-dependency, static web application designed to run seamlessly on **GitHub Pages**:
- **Hosting URL:** `https://munnaluriharini1477-wq.github.io/HealthCopilot/`
- **Zero Cloud Costs:** Runs offline-first with client-side **IndexedDB & LocalStorage**.
- **Privacy-First:** Patient data remains strictly within the user's browser sandbox.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, Modern Vanilla CSS3 | Ultra-responsive dark glassmorphic design, custom gauges, and micro-animations. |
| **Client Engine** | Modular JavaScript (ES6 Modules) | Sub-millisecond routing, reactive events, and zero build toolchain overhead. |
| **Local Database** | IndexedDB & LocalStorage | Offline persistence for vitals, medications, lab reports, and chat transcripts. |
| **Clinical Intelligence** | Dual-Mode AI Engine | **Mode 1:** Heuristic clinical rule matrix & 40+ biomarker knowledge dictionary.<br>**Mode 2:** Optional live Google Gemini 1.5 Flash API integration. |
| **CI/CD** | GitHub Actions | Automated zero-click deployment workflow to GitHub Pages on push to `main`. |

---

## 💡 Key Features

### 1. 📊 Command Center Dashboard
- Real-time patient overview with wellness score calculation.
- Instant symptom quick-triage search bar.
- Daily vitals telemetry snapshot (BP, Fasting Glucose, Resting Heart Rate).
- Medication checklist for today with instant toggle.

### 2. 🔬 Diagnostic Lab Explainer
- One-click loading of preset standard panels (Comprehensive Metabolic Panel, Lipid Panel, HbA1c).
- Raw text paste parser for custom test reports.
- Visual three-tier range gauges (Low, Normal, Elevated) with current value marker.
- Plain-English breakdown explaining *"What this means"*, *"Potential causes"*, and *"Actionable next steps"*.
- Dedicated *"Discuss with Health Copilot"* button to deep dive into specific biomarkers.

### 3. 💬 Clinical Copilot & Symptom Triage Chat
- Interactive conversation with medical empathy and clinical risk stratification.
- Emergency red-flag detection with direct 911 dispatch alert banner.
- Speech Synthesis (Text-to-Speech) for accessible audio playback.
- Prompt chips for instant clinical scenarios.

### 4. 💊 Medication & Vitals Tracker
- Daily medication schedule (Morning, Afternoon, Bedtime).
- Adherence percentage meter with daily streak tracking.
- Automated safety scanner for drug-drug interactions.
- Interactive SVG telemetry trend charts for blood pressure and glucose.

### 5. 📋 Doctor Visit Prep & Health Summary
- Executive clinical briefing consolidating active conditions, abnormal lab values, and medication history.
- Top 5 prioritized, personalized questions to ask your physician.
- Print / Export to PDF formatted styling.

---

## 💻 Local Development

No complex node installation or build steps required! Simply serve the directory with any static server:

```bash
# Clone the repository
git clone https://github.com/munnaluriharini1477-wq/HealthCopilot.git
cd HealthCopilot

# Run using Python built-in HTTP server
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

---

## 📄 License & Disclaimer

**Educational & Demonstration Project**: This application is built as an assistive personal health copilot. It is not intended to replace professional medical diagnosis, treatment, or clinical consultation. Always consult a qualified healthcare provider for acute medical concerns.
