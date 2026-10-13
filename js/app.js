/**
 * AI-Powered Personal Health Copilot
 * Main Application Orchestrator & UI Router
 */

import { db } from './db.js';
import { ClinicalAIEngine } from './ai-engine.js';
import { LabAnalyzer } from './lab-analyzer.js';
import { SymptomChat } from './symptom-chat.js';
import { MedsVitalsTracker } from './meds-tracker.js';
import { DoctorVisitSummary } from './doctor-summary.js';

class HealthCopilotApp {
  constructor() {
    this.db = db;
    this.aiEngine = new ClinicalAIEngine(this.db);
    this.activeTab = "overview";
  }

  init() {
    this.bindNavigation();
    this.bindSettings();
    this.bindQuickTriage();

    // Initialize Submodules
    this.chat = new SymptomChat(this.db, this.aiEngine);
    this.chat.init();

    this.labAnalyzer = new LabAnalyzer(this.db, (questionText) => {
      this.switchTab("copilot");
      setTimeout(() => {
        this.chat.sendMessage(questionText);
      }, 150);
    });
    this.labAnalyzer.init();

    this.medsTracker = new MedsVitalsTracker(this.db);
    this.medsTracker.init();

    this.doctorSummary = new DoctorVisitSummary(this.db);
    this.doctorSummary.init();

    // Initial Dashboard Render
    this.renderOverviewDashboard();

    // Listen to DB updates
    window.addEventListener("health-db-updated", () => {
      this.renderOverviewDashboard();
    });

    // Check URL hash for direct tab linking
    const hash = window.location.hash.replace("#", "");
    if (hash && ["overview", "labs", "copilot", "meds", "doctor", "settings"].includes(hash)) {
      this.switchTab(hash);
    }
  }

  bindNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = item.getAttribute("data-tab");
        if (tab) this.switchTab(tab);
      });
    });

    // Mobile navigation toggle
    const menuToggle = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector(".app-sidebar");
    if (menuToggle && sidebar) {
      menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    window.location.hash = tabId;

    // Update active nav link
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.toggle("active", item.getAttribute("data-tab") === tabId);
    });

    // Show active view section
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.toggle("active-view", sec.id === `view-${tabId}`);
    });

    // Close mobile menu if open
    const sidebar = document.querySelector(".app-sidebar");
    if (sidebar) sidebar.classList.remove("open");

    // Re-render specific tab if needed
    if (tabId === "overview") this.renderOverviewDashboard();
    if (tabId === "doctor") this.doctorSummary.generateSummary();
  }

  bindQuickTriage() {
    const quickInput = document.getElementById("quickTriageInput");
    const quickBtn = document.getElementById("quickTriageBtn");

    const handleTriage = () => {
      const text = quickInput.value.trim();
      if (text) {
        this.switchTab("copilot");
        setTimeout(() => {
          this.chat.sendMessage(text);
          quickInput.value = "";
        }, 150);
      }
    };

    if (quickBtn) quickBtn.addEventListener("click", handleTriage);
    if (quickInput) {
      quickInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleTriage();
      });
    }
  }

  bindSettings() {
    const settings = this.db.getSettings();
    const apiKeyInput = document.getElementById("geminiApiKeyInput");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    const resetDemoBtn = document.getElementById("resetDemoDataBtn");

    if (apiKeyInput) apiKeyInput.value = settings.geminiApiKey || "";

    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener("click", () => {
        const apiKey = apiKeyInput.value.trim();
        this.db.saveSettings({ geminiApiKey: apiKey });
        this.showToast("Settings saved successfully!");
      });
    }

    if (resetDemoBtn) {
      resetDemoBtn.addEventListener("click", () => {
        if (confirm("Reset all patient data, lab reports, and vitals back to default demo state?")) {
          this.db.resetToDefaults();
          window.location.reload();
        }
      });
    }
  }

  renderOverviewDashboard() {
    const patient = this.db.getPatient();
    const vitals = this.db.getVitals();
    const meds = this.db.getMedications();
    const labs = this.db.getLabReports();

    // Patient Banner
    const patientNameEl = document.getElementById("dashPatientName");
    const patientConditionsEl = document.getElementById("dashConditionsList");
    if (patientNameEl) patientNameEl.textContent = patient.name;
    if (patientConditionsEl) {
      patientConditionsEl.innerHTML = patient.conditions.map(c => `<span class="condition-chip">${c}</span>`).join("");
    }

    // Health Wellness Score Calculation
    let score = 88;
    const todayStr = new Date().toISOString().split("T")[0];
    let takenMeds = 0;
    meds.forEach(m => {
      if (m.adherence && m.adherence[todayStr]) takenMeds++;
    });

    const latestBP = vitals.find(v => v.type === "blood_pressure");
    const latestGlucose = vitals.find(v => v.type === "glucose");

    if (latestBP && (latestBP.systolic > 135 || latestBP.diastolic > 85)) score -= 5;
    if (latestGlucose && latestGlucose.value > 120) score -= 6;
    if (meds.length > 0 && takenMeds < meds.length) score -= 4;

    const scoreNumEl = document.getElementById("wellnessScoreNum");
    if (scoreNumEl) scoreNumEl.textContent = `${score}`;

    // Vitals Snapshot Cards
    const bpCard = document.getElementById("dashBPSnapshot");
    const glucoseCard = document.getElementById("dashGlucoseSnapshot");
    const hrCard = document.getElementById("dashHRSnapshot");

    if (bpCard && latestBP) {
      bpCard.innerHTML = `
        <span class="snapshot-val">${latestBP.systolic}/${latestBP.diastolic} <small>mmHg</small></span>
        <span class="snapshot-status ${latestBP.status}">${latestBP.status.toUpperCase()}</span>
      `;
    }

    if (glucoseCard && latestGlucose) {
      glucoseCard.innerHTML = `
        <span class="snapshot-val">${latestGlucose.value} <small>mg/dL</small></span>
        <span class="snapshot-status ${latestGlucose.status}">${latestGlucose.status.toUpperCase()}</span>
      `;
    }

    const latestHR = vitals.find(v => v.type === "heart_rate");
    if (hrCard && latestHR) {
      hrCard.innerHTML = `
        <span class="snapshot-val">${latestHR.value} <small>bpm</small></span>
        <span class="snapshot-status ${latestHR.status}">RESTING</span>
      `;
    }

    // Today's Medication Overview
    const medsOverviewList = document.getElementById("dashMedsTodayList");
    if (medsOverviewList) {
      medsOverviewList.innerHTML = meds.slice(0, 3).map(m => {
        const taken = m.adherence && m.adherence[todayStr];
        return `
          <div class="dash-med-item ${taken ? 'taken' : ''}">
            <span class="med-status-icon">${taken ? '✅' : '⏳'}</span>
            <div class="med-desc">
              <strong>${m.name} ${m.dosage}</strong>
              <small>${m.timing || 'Daily'}</small>
            </div>
            <button class="btn-dash-toggle-med" data-med-id="${m.id}">${taken ? 'Taken' : 'Mark Taken'}</button>
          </div>
        `;
      }).join("");

      medsOverviewList.querySelectorAll(".btn-dash-toggle-med").forEach(btn => {
        btn.addEventListener("click", () => {
          const medId = btn.getAttribute("data-med-id");
          this.db.toggleMedAdherence(medId, todayStr);
        });
      });
    }

    // Recent Lab Flag Alert
    const labAlertContainer = document.getElementById("dashLabAlerts");
    if (labAlertContainer && labs.length > 0) {
      const latestLab = labs[0];
      const flagged = (latestLab.biomarkers || []).filter(b => b.status === "high" || b.status === "low");

      labAlertContainer.innerHTML = `
        <div class="dash-lab-card">
          <div class="lab-title-row">
            <h4>${latestLab.title}</h4>
            <span class="lab-date">${latestLab.date}</span>
          </div>
          <p class="lab-summary-text">${latestLab.summary}</p>
          <div class="flagged-badges">
            ${flagged.map(f => `<span class="flag-chip ${f.status}">⚠️ ${f.name}: ${f.value} ${f.unit}</span>`).join("")}
          </div>
          <button class="btn-dash-view-lab" id="dashViewLabBtn">View Full Biomarker Breakdown →</button>
        </div>
      `;

      const viewLabBtn = document.getElementById("dashViewLabBtn");
      if (viewLabBtn) {
        viewLabBtn.addEventListener("click", () => this.switchTab("labs"));
      }
    }
  }

  showToast(message) {
    let toast = document.getElementById("globalToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "globalToast";
      toast.className = "toast-notification";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("visible");
    setTimeout(() => toast.classList.remove("visible"), 3000);
  }
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new HealthCopilotApp();
  window.app.init();
});
