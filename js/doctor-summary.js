/**
 * AI-Powered Personal Health Copilot
 * Doctor Visit Prep Sheet & Clinical Summary Generator
 */

export class DoctorVisitSummary {
  constructor(db) {
    this.db = db;
  }

  init() {
    this.bindEvents();
    this.generateSummary();
  }

  bindEvents() {
    const refreshBtn = document.getElementById("refreshSummaryBtn");
    const printBtn = document.getElementById("printSummaryBtn");
    const addTopicBtn = document.getElementById("addTopicBtn");

    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => this.generateSummary());
    }

    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }

    if (addTopicBtn) {
      addTopicBtn.addEventListener("click", () => {
        const input = document.getElementById("newTopicInput");
        if (input && input.value.trim()) {
          this.addCustomTopic(input.value.trim());
          input.value = "";
        }
      });
    }
  }

  addCustomTopic(topic) {
    const container = document.getElementById("doctorTopicsList");
    if (!container) return;

    const li = document.createElement("li");
    li.className = "prep-topic-item";
    li.innerHTML = `
      <span>📌 ${topic}</span>
      <button class="btn-remove-topic">×</button>
    `;
    li.querySelector(".btn-remove-topic").addEventListener("click", () => li.remove());
    container.appendChild(li);
  }

  generateSummary() {
    const patient = this.db.getPatient();
    const vitals = this.db.getVitals();
    const meds = this.db.getMedications();
    const labs = this.db.getLabReports();

    // Patient info
    const nameEl = document.getElementById("prepPatientName");
    const metaEl = document.getElementById("prepPatientMeta");
    const provEl = document.getElementById("prepProviderInfo");

    if (nameEl) nameEl.textContent = `${patient.name}`;
    if (metaEl) metaEl.textContent = `Age: ${patient.age} | Sex: ${patient.gender} | Blood: ${patient.bloodType || 'O+'} | Allergies: ${patient.allergies.join(", ")}`;
    if (provEl) provEl.textContent = `Primary Care: ${patient.primaryPhysician.name} (${patient.primaryPhysician.clinic})`;

    // Active conditions
    const condContainer = document.getElementById("prepConditionsList");
    if (condContainer) {
      condContainer.innerHTML = patient.conditions.map(c => `<li>${c}</li>`).join("");
    }

    // Vitals Averages
    const bpReadings = vitals.filter(v => v.type === "blood_pressure");
    const glucoseReadings = vitals.filter(v => v.type === "glucose");
    const hrReadings = vitals.filter(v => v.type === "heart_rate");

    let avgSys = 0, avgDia = 0;
    if (bpReadings.length > 0) {
      avgSys = Math.round(bpReadings.reduce((acc, r) => acc + r.systolic, 0) / bpReadings.length);
      avgDia = Math.round(bpReadings.reduce((acc, r) => acc + r.diastolic, 0) / bpReadings.length);
    }

    let avgGlucose = 0;
    if (glucoseReadings.length > 0) {
      avgGlucose = Math.round(glucoseReadings.reduce((acc, r) => acc + r.value, 0) / glucoseReadings.length);
    }

    let avgHR = 0;
    if (hrReadings.length > 0) {
      avgHR = Math.round(hrReadings.reduce((acc, r) => acc + r.value, 0) / hrReadings.length);
    }

    const vitalsSummaryEl = document.getElementById("prepVitalsMetrics");
    if (vitalsSummaryEl) {
      vitalsSummaryEl.innerHTML = `
        <div class="prep-metric-tile">
          <span class="metric-lbl">Avg Blood Pressure</span>
          <span class="metric-num">${avgSys ? `${avgSys}/${avgDia} mmHg` : 'No data'}</span>
          <span class="metric-sub">${bpReadings.length} readings</span>
        </div>
        <div class="prep-metric-tile">
          <span class="metric-lbl">Avg Fasting Glucose</span>
          <span class="metric-num">${avgGlucose ? `${avgGlucose} mg/dL` : 'No data'}</span>
          <span class="metric-sub">${glucoseReadings.length} readings</span>
        </div>
        <div class="prep-metric-tile">
          <span class="metric-lbl">Resting Heart Rate</span>
          <span class="metric-num">${avgHR ? `${avgHR} bpm` : 'No data'}</span>
          <span class="metric-sub">${hrReadings.length} readings</span>
        </div>
      `;
    }

    // Abnormal Lab Findings
    const abnormalLabsContainer = document.getElementById("prepAbnormalLabs");
    const abnormalMarkers = [];
    labs.forEach(l => {
      (l.biomarkers || []).forEach(b => {
        if (b.status === "high" || b.status === "low") {
          abnormalMarkers.push({ ...b, reportTitle: l.title, date: l.date });
        }
      });
    });

    if (abnormalLabsContainer) {
      if (abnormalMarkers.length === 0) {
        abnormalLabsContainer.innerHTML = `<p class="empty-text">No flagged abnormal biomarkers on record.</p>`;
      } else {
        abnormalLabsContainer.innerHTML = abnormalMarkers.slice(0, 6).map(m => `
          <div class="prep-lab-item">
            <div>
              <strong>${m.name}: ${m.value} ${m.unit}</strong>
              <span class="prep-lab-date">(${m.reportTitle}, ${m.date})</span>
            </div>
            <span class="prep-flag-badge ${m.status}">${m.status.toUpperCase()}</span>
          </div>
        `).join("");
      }
    }

    // Active Meds List
    const medsContainer = document.getElementById("prepMedsList");
    if (medsContainer) {
      medsContainer.innerHTML = meds.map(m => `
        <div class="prep-med-row">
          <strong>${m.name} ${m.dosage}</strong> — ${m.frequency} (${m.timing || 'Daily'})
          <span class="prep-med-purpose">Purpose: ${m.purpose}</span>
        </div>
      `).join("");
    }

    // Tailored Doctor Questions
    const questionsContainer = document.getElementById("prepGeneratedQuestions");
    if (questionsContainer) {
      const generated = [
        "Given my average blood pressure of " + (avgSys ? `${avgSys}/${avgDia}` : "recent readings") + ", is my current Lisinopril dosage optimal?",
        "My fasting glucose averaged " + (avgGlucose ? `${avgGlucose} mg/dL` : "elevated") + " — should we repeat an HbA1c test in 90 days?",
        "Are there any drug interactions between my daily medications and over-the-counter pain relievers?",
        "Do my recent liver enzymes (ALT) warrant any dietary changes or follow-up imaging?",
        "What specific threshold of blood pressure or blood sugar should trigger a direct call to your office?"
      ];

      questionsContainer.innerHTML = generated.map((q, idx) => `
        <li class="prep-question-item">
          <span class="q-number">${idx + 1}</span>
          <span class="q-text">"${q}"</span>
        </li>
      `).join("");
    }
  }
}
