/**
 * AI-Powered Personal Health Copilot
 * Medication Manager & Vitals Telemetry Tracker
 */

export class MedsVitalsTracker {
  constructor(db) {
    this.db = db;
  }

  init() {
    this.bindEvents();
    this.renderMedications();
    this.renderVitals();
    this.checkInteractions();
  }

  bindEvents() {
    // Add Medication Form
    const medForm = document.getElementById("addMedForm");
    if (medForm) {
      medForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("medNameInput").value.trim();
        const dosage = document.getElementById("medDosageInput").value.trim();
        const frequency = document.getElementById("medFreqInput").value;
        const timing = document.getElementById("medTimingInput").value;
        const purpose = document.getElementById("medPurposeInput").value.trim();
        const instructions = document.getElementById("medInstructionsInput").value.trim();

        if (name && dosage) {
          this.db.addMedication({
            name,
            dosage,
            frequency,
            timing,
            purpose: purpose || "General health management",
            instructions: instructions || "Take with water"
          });
          medForm.reset();
          const modal = document.getElementById("addMedModal");
          if (modal) modal.style.display = "none";
          this.renderMedications();
          this.checkInteractions();
        }
      });
    }

    // Add Vital Form
    const vitalForm = document.getElementById("addVitalForm");
    if (vitalForm) {
      vitalForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = document.getElementById("vitalTypeSelect").value;
        const notes = document.getElementById("vitalNotesInput").value.trim();

        let record = { type, notes };
        if (type === "blood_pressure") {
          const sys = parseInt(document.getElementById("vitalSystolicInput").value, 10);
          const dia = parseInt(document.getElementById("vitalDiastolicInput").value, 10);
          if (isNaN(sys) || isNaN(dia)) return;
          let status = "normal";
          if (sys >= 140 || dia >= 90) status = "high";
          else if (sys >= 120 || dia >= 80) status = "elevated";
          record = { ...record, systolic: sys, diastolic: dia, unit: "mmHg", status };
        } else if (type === "glucose") {
          const val = parseFloat(document.getElementById("vitalValueInput").value);
          if (isNaN(val)) return;
          let status = "normal";
          if (val >= 126) status = "high";
          else if (val >= 100) status = "elevated";
          else if (val < 70) status = "low";
          record = { ...record, value: val, unit: "mg/dL", status };
        } else if (type === "heart_rate") {
          const val = parseInt(document.getElementById("vitalValueInput").value, 10);
          if (isNaN(val)) return;
          let status = "normal";
          if (val > 100) status = "high";
          else if (val < 60) status = "low";
          record = { ...record, value: val, unit: "bpm", status };
        } else if (type === "spo2") {
          const val = parseInt(document.getElementById("vitalValueInput").value, 10);
          if (isNaN(val)) return;
          let status = val >= 95 ? "normal" : "low";
          record = { ...record, value: val, unit: "%", status };
        }

        this.db.addVital(record);
        vitalForm.reset();
        const modal = document.getElementById("addVitalModal");
        if (modal) modal.style.display = "none";
        this.renderVitals();
      });
    }

    // Modal open/close controls
    const openMedBtn = document.getElementById("openAddMedBtn");
    const closeMedBtn = document.getElementById("closeAddMedBtn");
    const medModal = document.getElementById("addMedModal");

    if (openMedBtn && medModal) {
      openMedBtn.addEventListener("click", () => medModal.style.display = "flex");
    }
    if (closeMedBtn && medModal) {
      closeMedBtn.addEventListener("click", () => medModal.style.display = "none");
    }

    const openVitalBtn = document.getElementById("openAddVitalBtn");
    const closeVitalBtn = document.getElementById("closeAddVitalBtn");
    const vitalModal = document.getElementById("addVitalModal");

    if (openVitalBtn && vitalModal) {
      openVitalBtn.addEventListener("click", () => vitalModal.style.display = "flex");
    }
    if (closeVitalBtn && vitalModal) {
      closeVitalBtn.addEventListener("click", () => vitalModal.style.display = "none");
    }

    // Toggle dynamic input fields based on vital type
    const vitalSelect = document.getElementById("vitalTypeSelect");
    if (vitalSelect) {
      vitalSelect.addEventListener("change", (e) => {
        const bpFields = document.getElementById("bpSpecificFields");
        const singleField = document.getElementById("singleValueField");
        if (e.target.value === "blood_pressure") {
          if (bpFields) bpFields.style.display = "grid";
          if (singleField) singleField.style.display = "none";
        } else {
          if (bpFields) bpFields.style.display = "none";
          if (singleField) singleField.style.display = "block";
        }
      });
    }

    // Listen for global database update events
    window.addEventListener("health-db-updated", (e) => {
      if (e.detail?.type === "medications") this.renderMedications();
      if (e.detail?.type === "vitals") this.renderVitals();
    });
  }

  renderMedications() {
    const listContainer = document.getElementById("medicationsList");
    const adherencePercentEl = document.getElementById("todayAdherencePct");
    const todayStr = new Date().toISOString().split("T")[0];

    const meds = this.db.getMedications();
    if (!listContainer) return;

    if (meds.length === 0) {
      listContainer.innerHTML = `<div class="empty-state"><p>No medications recorded yet. Click 'Add Medication' to begin tracking.</p></div>`;
      if (adherencePercentEl) adherencePercentEl.textContent = "0%";
      return;
    }

    let takenCount = 0;
    meds.forEach(m => {
      if (m.adherence && m.adherence[todayStr]) takenCount++;
    });

    const pct = Math.round((takenCount / meds.length) * 100);
    if (adherencePercentEl) adherencePercentEl.textContent = `${pct}%`;

    listContainer.innerHTML = meds.map(med => {
      const isTakenToday = med.adherence && med.adherence[todayStr];

      return `
        <div class="med-card ${isTakenToday ? 'med-taken' : 'med-pending'}" id="${med.id}">
          <div class="med-checkbox-col">
            <button class="btn-check-med ${isTakenToday ? 'checked' : ''}" data-med-id="${med.id}" title="Toggle taken status for today">
              ${isTakenToday ? '✓' : ''}
            </button>
          </div>
          <div class="med-info-col">
            <div class="med-main-row">
              <h4 class="med-name">${med.name} <span class="med-dosage">${med.dosage}</span></h4>
              <span class="med-timing-badge">${med.timing || 'Daily'}</span>
            </div>
            <p class="med-purpose">🎯 ${med.purpose}</p>
            <p class="med-instructions">ℹ️ ${med.instructions}</p>
          </div>
          <div class="med-action-col">
            <button class="btn-delete-med" data-med-id="${med.id}" title="Remove medication">🗑️</button>
          </div>
        </div>
      `;
    }).join("");

    // Bind check button listeners
    listContainer.querySelectorAll(".btn-check-med").forEach(btn => {
      btn.addEventListener("click", () => {
        const medId = btn.getAttribute("data-med-id");
        this.db.toggleMedAdherence(medId, todayStr);
      });
    });

    // Bind delete button listeners
    listContainer.querySelectorAll(".btn-delete-med").forEach(btn => {
      btn.addEventListener("click", () => {
        const medId = btn.getAttribute("data-med-id");
        if (confirm("Remove this medication?")) {
          this.db.deleteMedication(medId);
        }
      });
    });

    this.checkInteractions();
  }

  checkInteractions() {
    const alertBox = document.getElementById("drugInteractionAlert");
    if (!alertBox) return;

    const meds = this.db.getMedications();
    const names = meds.map(m => m.name.toLowerCase());

    const warnings = [];

    if (names.some(n => n.includes("lisinopril")) && names.some(n => n.includes("potassium"))) {
      warnings.push("⚠️ <strong>Lisinopril + Potassium:</strong> ACE inhibitors reduce potassium excretion. High supplementary potassium may cause hyperkalemia.");
    }
    if (names.some(n => n.includes("metformin")) && names.some(n => n.includes("alcohol"))) {
      warnings.push("⚠️ <strong>Metformin + High Alcohol Intake:</strong> Increases risk of lactic acidosis. Limit alcohol consumption.");
    }
    if (names.some(n => n.includes("atorvastatin")) && names.some(n => n.includes("grapefruit"))) {
      warnings.push("⚠️ <strong>Atorvastatin + Grapefruit:</strong> Inhibits CYP3A4 metabolism, increasing circulating statin concentration.");
    }

    if (warnings.length > 0) {
      alertBox.innerHTML = `
        <div class="interaction-card">
          <div class="interaction-icon">⚠️</div>
          <div>
            <h4>Potential Drug Safety & Interaction Notice</h4>
            ${warnings.map(w => `<p>${w}</p>`).join("")}
          </div>
        </div>
      `;
      alertBox.style.display = "block";
    } else {
      alertBox.style.display = "none";
    }
  }

  renderVitals() {
    const tableBody = document.getElementById("vitalsTableBody");
    const chartContainer = document.getElementById("vitalsChartContainer");
    const vitals = this.db.getVitals();

    if (!tableBody) return;

    if (vitals.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="empty-cell">No vitals logged yet. Click 'Log Vital' to record today's measurements.</td></tr>`;
      return;
    }

    // Render table
    tableBody.innerHTML = vitals.slice(0, 10).map(v => {
      let displayVal = "";
      if (v.type === "blood_pressure") {
        displayVal = `${v.systolic}/${v.diastolic} ${v.unit}`;
      } else {
        displayVal = `${v.value} ${v.unit}`;
      }

      const typeLabels = {
        blood_pressure: "Blood Pressure",
        glucose: "Blood Glucose",
        heart_rate: "Resting Heart Rate",
        spo2: "Oxygen Saturation (SpO2)"
      };

      const statusBadges = {
        normal: `<span class="vital-badge badge-normal">OPTIMAL</span>`,
        elevated: `<span class="vital-badge badge-elevated">ELEVATED</span>`,
        high: `<span class="vital-badge badge-high">HIGH</span>`,
        low: `<span class="vital-badge badge-low">LOW</span>`
      };

      return `
        <tr>
          <td>${v.date} <span class="vital-time">${v.time || ''}</span></td>
          <td><strong>${typeLabels[v.type] || v.type}</strong></td>
          <td class="vital-value-cell">${displayVal}</td>
          <td>${statusBadges[v.status] || `<span class="vital-badge">${v.status}</span>`}</td>
          <td>${v.notes || '-'}</td>
          <td><button class="btn-del-vital" data-vital-id="${v.id}">×</button></td>
        </tr>
      `;
    }).join("");

    // Bind delete vital
    tableBody.querySelectorAll(".btn-del-vital").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-vital-id");
        this.db.deleteVital(id);
      });
    });

    // Render SVG sparkline trend chart
    if (chartContainer) {
      this.renderSVGChart(chartContainer, vitals);
    }
  }

  renderSVGChart(container, vitals) {
    // Filter glucose and blood pressure
    const bpList = vitals.filter(v => v.type === "blood_pressure").slice(0, 7).reverse();
    const glucoseList = vitals.filter(v => v.type === "glucose").slice(0, 7).reverse();

    if (bpList.length < 2 && glucoseList.length < 2) {
      container.innerHTML = `<p class="chart-empty">Log at least two readings to generate trend telemetry.</p>`;
      return;
    }

    // Create SVG chart representation
    const width = 600;
    const height = 180;
    const padding = 35;

    // Glucose line
    let glucosePolyline = "";
    if (glucoseList.length >= 2) {
      const minG = 70;
      const maxG = 160;
      const pts = glucoseList.map((g, idx) => {
        const x = padding + (idx / (glucoseList.length - 1)) * (width - padding * 2);
        const y = height - padding - ((g.value - minG) / (maxG - minG)) * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ");
      glucosePolyline = `<polyline fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" points="${pts}" />`;
    }

    // BP Systolic line
    let bpPolyline = "";
    if (bpList.length >= 2) {
      const minBP = 100;
      const maxBP = 160;
      const pts = bpList.map((b, idx) => {
        const x = padding + (idx / (bpList.length - 1)) * (width - padding * 2);
        const y = height - padding - ((b.systolic - minBP) / (maxBP - minBP)) * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ");
      bpPolyline = `<polyline fill="none" stroke="#06B6D4" stroke-width="3" stroke-linecap="round" points="${pts}" />`;
    }

    container.innerHTML = `
      <div class="chart-wrapper">
        <div class="chart-legend">
          <span class="legend-item"><span class="dot" style="background:#06B6D4"></span> Systolic BP (mmHg)</span>
          <span class="legend-item"><span class="dot" style="background:#F59E0B"></span> Fasting Glucose (mg/dL)</span>
        </div>
        <svg viewBox="0 0 ${width} ${height}" class="telemetry-svg">
          <!-- Background Grid Lines -->
          <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.08)" />
          <line x1="${padding}" y1="${height/2}" x2="${width - padding}" y2="${height/2}" stroke="rgba(255,255,255,0.08)" />
          <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.08)" />
          
          <!-- Polylines -->
          ${bpPolyline}
          ${glucosePolyline}
        </svg>
      </div>
    `;
  }
}
