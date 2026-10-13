/**
 * AI-Powered Personal Health Copilot
 * Lab Report Analyzer & Biomarker Visualizer
 */

import { BIOMARKER_DICTIONARY } from './ai-engine.js';
import { PRESET_LAB_REPORTS } from '../data/preset-samples.js';

export class LabAnalyzer {
  constructor(db, onAskCopilot) {
    this.db = db;
    this.onAskCopilot = onAskCopilot;
    this.currentReport = null;
  }

  init() {
    this.bindEvents();
    this.loadInitialReport();
  }

  bindEvents() {
    const presetSelect = document.getElementById("labPresetSelect");
    if (presetSelect) {
      presetSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val) this.loadPreset(val);
      });
    }

    const analyzeBtn = document.getElementById("analyzeRawLabBtn");
    if (analyzeBtn) {
      analyzeBtn.addEventListener("click", () => this.analyzeRawText());
    }

    const filterRadios = document.querySelectorAll("input[name='labFilter']");
    filterRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        this.renderBiomarkers(e.target.value);
      });
    });
  }

  loadInitialReport() {
    const savedReports = this.db.getLabReports();
    if (savedReports && savedReports.length > 0) {
      this.currentReport = savedReports[0];
    } else {
      this.currentReport = PRESET_LAB_REPORTS[0];
    }
    this.renderCurrentReport();
  }

  loadPreset(presetId) {
    const found = PRESET_LAB_REPORTS.find(r => r.id === presetId);
    if (found) {
      this.currentReport = found;
      const rawInput = document.getElementById("rawLabInput");
      if (rawInput) rawInput.value = found.rawText;
      this.renderCurrentReport();
    }
  }

  analyzeRawText() {
    const rawInput = document.getElementById("rawLabInput");
    if (!rawInput || !rawInput.value.trim()) {
      alert("Please enter or paste your lab report text.");
      return;
    }

    const text = rawInput.value;
    const parsedBiomarkers = this.parseLabText(text);

    const newReport = {
      title: "User Uploaded Lab Report",
      date: new Date().toISOString().split("T")[0],
      facility: "Self-Uploaded Document",
      summary: `Parsed ${parsedBiomarkers.length} biomarker indicators. ${parsedBiomarkers.filter(b => b.status !== 'normal').length} flagged outside standard range.`,
      rawText: text,
      biomarkers: parsedBiomarkers
    };

    const saved = this.db.saveLabReport(newReport);
    this.currentReport = saved;
    this.renderCurrentReport();
  }

  parseLabText(text) {
    const lines = text.split("\n");
    const results = [];

    // Helper map of regex keys to canonical biomarker
    const biomarkerKeys = Object.keys(BIOMARKER_DICTIONARY);

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      for (const key of biomarkerKeys) {
        const dictEntry = BIOMARKER_DICTIONARY[key];
        const pattern = new RegExp(key, "i");
        if (pattern.test(trimmed)) {
          // Extract numbers
          const match = trimmed.match(/(\d+(?:\.\d+)?)/);
          if (match) {
            const val = parseFloat(match[1]);
            let status = "normal";
            if (val < dictEntry.min) status = "low";
            else if (val > dictEntry.max) status = "high";

            results.push({
              name: dictEntry.name,
              value: val,
              unit: dictEntry.unit,
              min: dictEntry.min,
              max: dictEntry.max,
              status: status,
              category: dictEntry.category,
              dictionaryKey: key
            });
            break;
          }
        }
      }
    });

    // Fallback if no matching standard biomarkers found
    if (results.length === 0) {
      // Parse general name: value line
      lines.forEach(line => {
        const parts = line.split(/[:\-]/);
        if (parts.length >= 2) {
          const name = parts[0].trim();
          const rest = parts[1].trim();
          const match = rest.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z\/%]*)/);
          if (match) {
            const val = parseFloat(match[1]);
            const unit = match[2] || "";
            results.push({
              name: name,
              value: val,
              unit: unit,
              min: 0,
              max: val * 1.5,
              status: "normal",
              category: "General Biomarker"
            });
          }
        }
      });
    }

    return results;
  }

  renderCurrentReport() {
    if (!this.currentReport) return;

    const titleEl = document.getElementById("reportTitleDisplay");
    const dateEl = document.getElementById("reportDateDisplay");
    const facilityEl = document.getElementById("reportFacilityDisplay");
    const summaryEl = document.getElementById("reportSummaryDisplay");
    const rawInput = document.getElementById("rawLabInput");

    if (titleEl) titleEl.textContent = this.currentReport.title;
    if (dateEl) dateEl.textContent = `Collected: ${this.currentReport.date}`;
    if (facilityEl) facilityEl.textContent = this.currentReport.facility || "Diagnostic Lab";
    if (summaryEl) summaryEl.textContent = this.currentReport.summary;
    if (rawInput && !rawInput.value) rawInput.value = this.currentReport.rawText;

    this.renderBiomarkers("all");
  }

  renderBiomarkers(filter = "all") {
    const container = document.getElementById("biomarkersContainer");
    if (!container || !this.currentReport) return;

    let markers = this.currentReport.biomarkers || [];
    if (filter === "abnormal") {
      markers = markers.filter(m => m.status === "high" || m.status === "low");
    } else if (filter === "normal") {
      markers = markers.filter(m => m.status === "normal");
    }

    if (markers.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No biomarkers found matching the filter '${filter}'.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = markers.map(marker => {
      const dictKey = marker.dictionaryKey || marker.name.toLowerCase().replace(/[^a-z]/g, "");
      const dictInfo = BIOMARKER_DICTIONARY[dictKey] || null;

      // Status styling
      let statusClass = "status-normal";
      let statusLabel = "OPTIMAL";
      let markerColor = "#10B981";

      if (marker.status === "high") {
        statusClass = "status-high";
        statusLabel = "ELEVATED";
        markerColor = "#EF4444";
      } else if (marker.status === "low") {
        statusClass = "status-low";
        statusLabel = "LOW";
        markerColor = "#3B82F6";
      }

      // Range calculation for gauge slider
      const min = marker.min || 0;
      const max = marker.max || 100;
      const rangeSpan = Math.max(max - min, 1);
      const displayMin = Math.max(0, min - rangeSpan * 0.25);
      const displayMax = max + rangeSpan * 0.25;
      const pct = Math.min(100, Math.max(0, ((marker.value - displayMin) / (displayMax - displayMin)) * 100));

      const explanation = dictInfo 
        ? dictInfo.interpretation[marker.status] 
        : (marker.status === "normal" ? "Reading is within reference standard boundaries." : `Reading is outside standard baseline of ${min} - ${max} ${marker.unit}.`);

      const lifestyle = dictInfo ? dictInfo.lifestyle : "Maintain regular balanced nutrition, daily hydration, and consult your physician.";

      return `
        <div class="biomarker-card ${statusClass}">
          <div class="biomarker-header">
            <div>
              <span class="biomarker-category">${marker.category || 'General'}</span>
              <h4 class="biomarker-title">${marker.name}</h4>
            </div>
            <span class="status-badge ${statusClass}">${statusLabel}</span>
          </div>

          <div class="biomarker-value-row">
            <div class="current-value">
              <span class="num">${marker.value}</span>
              <span class="unit">${marker.unit}</span>
            </div>
            <div class="ref-range">
              <span class="label">Reference Range</span>
              <span class="val">${min} – ${max} ${marker.unit}</span>
            </div>
          </div>

          <!-- Visual Range Gauge Bar -->
          <div class="gauge-track">
            <div class="gauge-zones">
              <div class="zone-low" style="width: 25%;"></div>
              <div class="zone-normal" style="width: 50%;"></div>
              <div class="zone-high" style="width: 25%;"></div>
            </div>
            <div class="gauge-indicator" style="left: ${pct}%; background-color: ${markerColor};">
              <div class="gauge-tooltip">${marker.value}</div>
            </div>
          </div>

          <!-- Plain English Insights Accordion / Details -->
          <div class="biomarker-insights">
            <div class="insight-block">
              <span class="insight-label">💡 Plain English Meaning:</span>
              <p class="insight-text">${explanation}</p>
            </div>
            <div class="insight-block">
              <span class="insight-label">🎯 Actionable Guidance:</span>
              <p class="insight-text">${lifestyle}</p>
            </div>
          </div>

          <div class="biomarker-footer">
            <button class="btn-ask-copilot" data-marker="${marker.name}" data-value="${marker.value}" data-status="${statusLabel}">
              💬 Discuss with Health Copilot
            </button>
          </div>
        </div>
      `;
    }).join("");

    // Attach click listener for 'Discuss with Copilot' buttons
    container.querySelectorAll(".btn-ask-copilot").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const markerName = e.target.getAttribute("data-marker");
        const markerVal = e.target.getAttribute("data-value");
        const status = e.target.getAttribute("data-status");
        if (this.onAskCopilot) {
          this.onAskCopilot(`Can you explain my ${markerName} reading of ${markerVal} (${status})? What does this mean for my health and what should I ask my doctor?`);
        }
      });
    });
  }
}
