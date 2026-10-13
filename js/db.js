/**
 * AI-Powered Personal Health Copilot
 * Local Persistence Engine (IndexedDB & LocalStorage)
 */

import {
  PRESET_PATIENT,
  PRESET_VITALS,
  PRESET_MEDICATIONS,
  PRESET_LAB_REPORTS,
  PRESET_CHAT_CONVERSATIONS
} from '../data/preset-samples.js';

const STORAGE_KEYS = {
  PATIENT: "healthcopilot_patient_profile",
  VITALS: "healthcopilot_vitals_records",
  MEDICATIONS: "healthcopilot_medications",
  LABS: "healthcopilot_lab_reports",
  CHAT: "healthcopilot_chat_history",
  SETTINGS: "healthcopilot_settings"
};

class HealthDB {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PATIENT)) {
      this.resetToDefaults();
    }
  }

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(PRESET_PATIENT));
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(PRESET_VITALS));
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(PRESET_MEDICATIONS));
    localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(PRESET_LAB_REPORTS));
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(PRESET_CHAT_CONVERSATIONS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
      theme: "dark",
      geminiApiKey: "",
      enableVoice: true,
      units: "imperial"
    }));
  }

  // Patient Profile
  getPatient() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENT);
      return data ? JSON.parse(data) : PRESET_PATIENT;
    } catch {
      return PRESET_PATIENT;
    }
  }

  savePatient(patientData) {
    localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(patientData));
    window.dispatchEvent(new CustomEvent("health-db-updated", { detail: { type: "patient" } }));
  }

  // Vitals
  getVitals() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VITALS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addVital(vitalRecord) {
    const vitals = this.getVitals();
    const newRecord = {
      id: "v_" + Date.now(),
      date: vitalRecord.date || new Date().toISOString().split("T")[0],
      time: vitalRecord.time || new Date().toTimeString().slice(0, 5),
      ...vitalRecord
    };
    vitals.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
    window.dispatchEvent(new CustomEvent("health-db-updated", { detail: { type: "vitals", record: newRecord } }));
    return newRecord;
  }

  deleteVital(vitalId) {
    let vitals = this.getVitals();
    vitals = vitals.filter(v => v.id !== vitalId);
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
    window.dispatchEvent(new CustomEvent("health-db-updated", { detail: { type: "vitals" } }));
  }

  getLatestVital(type) {
    const vitals = this.getVitals();
    return vitals.find(v => v.type === type) || null;
  }

  // Medications
  getMedications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addMedication(medData) {
    const meds = this.getMedications();
    const newMed = {
      id: "med_" + Date.now(),
      adherence: {},
      ...medData
    };
    meds.push(newMed);
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
    window.dispatchEvent(new CustomEvent("health-db-updated", { detail: { type: "medications" } }));
    return newMed;
  }

  toggleMedAdherence(medId, dateStr = null) {
    const meds = this.getMedications();
    const targetDate = dateStr || new Date().toISOString().split("T")[0];
    const med = meds.find(m => m.id === medId);
    if (med) {
      if (!med.adherence) med.adherence = {};
      med.adherence[targetDate] = !med.adherence[targetDate];
      localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
      window.dispatchEvent(new CustomEvent("health-db-updated", { detail: { type: "medications" } }));
      return med.adherence[targetDate];
    }
    return false;
  }

  deleteMedication(medId) {
    let meds = this.getMedications();
    meds = meds.filter(m => m.id !== medId);
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
    window.dispatchEvent(new CustomEvent("health-db-updated", { detail: { type: "medications" } }));
  }

  // Lab Reports
  getLabReports() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LABS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveLabReport(report) {
    const labs = this.getLabReports();
    const newReport = {
      id: "lab_" + Date.now(),
      date: report.date || new Date().toISOString().split("T")[0],
      ...report
    };
    labs.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(labs));
    window.dispatchEvent(new CustomEvent("health-db-updated", { detail: { type: "labs", report: newReport } }));
    return newReport;
  }

  deleteLabReport(labId) {
    let labs = this.getLabReports();
    labs = labs.filter(l => l.id !== labId);
    localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(labs));
    window.dispatchEvent(new CustomEvent("health-db-updated", { detail: { type: "labs" } }));
  }

  // Chat History
  getChatHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveChatMessage(message) {
    const chat = this.getChatHistory();
    const newMsg = {
      id: "msg_" + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...message
    };
    chat.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chat));
    return newMsg;
  }

  clearChatHistory() {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent("health-db-updated", { detail: { type: "chat" } }));
  }

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { theme: "dark", geminiApiKey: "" };
    } catch {
      return { theme: "dark", geminiApiKey: "" };
    }
  }

  saveSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("health-db-updated", { detail: { type: "settings" } }));
  }
}

export const db = new HealthDB();
