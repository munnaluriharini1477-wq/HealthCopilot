/**
 * AI-Powered Personal Health Copilot
 * Preset Clinical Samples & Reference Data
 */

export const PRESET_PATIENT = {
  id: "patient_001",
  name: "Alex Morgan",
  age: 42,
  gender: "Male",
  bloodType: "O+",
  conditions: [
    "Stage 1 Hypertension (Controlled)",
    "Prediabetes (Diet & Lifestyle Managed)",
    "Mild Dyslipidemia"
  ],
  allergies: ["Penicillin", "Sulfa drugs"],
  emergencyContact: {
    name: "Sarah Morgan",
    relation: "Spouse",
    phone: "+1 (555) 382-9104"
  },
  primaryPhysician: {
    name: "Dr. Elena Rostova, MD",
    clinic: "Metro Health Internal Medicine",
    phone: "+1 (555) 492-1200"
  }
};

export const PRESET_VITALS = [
  { id: "v1", date: "2026-10-13", time: "08:15", type: "blood_pressure", systolic: 128, diastolic: 82, unit: "mmHg", status: "elevated", notes: "Morning reading before coffee" },
  { id: "v2", date: "2026-10-13", time: "08:20", type: "glucose", value: 112, unit: "mg/dL", status: "elevated", notes: "Fasting morning glucose" },
  { id: "v3", date: "2026-10-13", time: "08:25", type: "heart_rate", value: 72, unit: "bpm", status: "normal", notes: "Resting" },
  { id: "v4", date: "2026-10-13", time: "08:25", type: "spo2", value: 98, unit: "%", status: "normal", notes: "Room air" },

  { id: "v5", date: "2026-10-12", time: "08:00", type: "blood_pressure", systolic: 124, diastolic: 80, unit: "mmHg", status: "normal", notes: "Post-walk" },
  { id: "v6", date: "2026-10-12", time: "08:05", type: "glucose", value: 108, unit: "mg/dL", status: "elevated", notes: "Fasting" },
  { id: "v7", date: "2026-10-12", time: "08:10", type: "heart_rate", value: 70, unit: "bpm", status: "normal", notes: "Resting" },

  { id: "v8", date: "2026-10-11", time: "08:30", type: "blood_pressure", systolic: 132, diastolic: 85, unit: "mmHg", status: "elevated", notes: "Work stress" },
  { id: "v9", date: "2026-10-11", time: "08:35", type: "glucose", value: 118, unit: "mg/dL", status: "elevated", notes: "High carb dinner prior night" },
  { id: "v10", date: "2026-10-11", time: "08:40", type: "heart_rate", value: 76, unit: "bpm", status: "normal", notes: "Resting" },

  { id: "v11", date: "2026-10-10", time: "09:00", type: "blood_pressure", systolic: 122, diastolic: 78, unit: "mmHg", status: "normal", notes: "Weekend morning" },
  { id: "v12", date: "2026-10-10", time: "09:05", type: "glucose", value: 104, unit: "mg/dL", status: "normal", notes: "Fasting" },
  { id: "v13", date: "2026-10-10", time: "09:10", type: "heart_rate", value: 68, unit: "bpm", status: "normal", notes: "Resting" }
];

export const PRESET_MEDICATIONS = [
  {
    id: "med_1",
    name: "Lisinopril",
    dosage: "10 mg",
    frequency: "Once daily",
    timing: "Morning",
    purpose: "Blood pressure management",
    instructions: "Take with water with or without breakfast",
    adherence: {
      "2026-10-13": true,
      "2026-10-12": true,
      "2026-10-11": true,
      "2026-10-10": false,
      "2026-10-09": true
    }
  },
  {
    id: "med_2",
    name: "Metformin ER",
    dosage: "500 mg",
    frequency: "Twice daily",
    timing: "Morning & Evening",
    purpose: "Glycemic control (prediabetes)",
    instructions: "Take with meals to reduce stomach discomfort",
    adherence: {
      "2026-10-13": true,
      "2026-10-12": true,
      "2026-10-11": true,
      "2026-10-10": true,
      "2026-10-09": true
    }
  },
  {
    id: "med_3",
    name: "Atorvastatin",
    dosage: "20 mg",
    frequency: "Once daily",
    timing: "Bedtime",
    purpose: "Lipid / Cholesterol reduction",
    instructions: "Take at night for optimal liver enzyme synthesis",
    adherence: {
      "2026-10-13": false, // pending tonight
      "2026-10-12": true,
      "2026-10-11": true,
      "2026-10-10": true,
      "2026-10-09": true
    }
  },
  {
    id: "med_4",
    name: "CoQ10 + Omega-3",
    dosage: "100 mg / 1000 mg",
    frequency: "Once daily",
    timing: "Morning",
    purpose: "Cardiovascular & mitochondrial support",
    instructions: "Take with food containing healthy fats",
    adherence: {
      "2026-10-13": true,
      "2026-10-12": true,
      "2026-10-11": true,
      "2026-10-10": true,
      "2026-10-09": true
    }
  }
];

export const PRESET_LAB_REPORTS = [
  {
    id: "lab_cmp_01",
    title: "Comprehensive Metabolic Panel (CMP)",
    date: "2026-10-02",
    facility: "LabCorp Diagnostics",
    summary: "Elevated fasting glucose (118 mg/dL) and mild ALT elevation (44 U/L). Normal kidney function and electrolytes.",
    rawText: `Comprehensive Metabolic Panel (CMP)
Collection Date: 2026-10-02 07:45 AM
Fast Status: Fasting 12 hrs

Glucose: 118 mg/dL (Reference: 70 - 99 mg/dL) [HIGH]
BUN: 14 mg/dL (Reference: 7 - 20 mg/dL) [NORMAL]
Creatinine: 0.95 mg/dL (Reference: 0.70 - 1.30 mg/dL) [NORMAL]
eGFR: >90 mL/min/1.73m2 (Reference: >60 mL/min/1.73m2) [NORMAL]
Sodium: 140 mEq/L (Reference: 135 - 145 mEq/L) [NORMAL]
Potassium: 4.3 mEq/L (Reference: 3.5 - 5.1 mEq/L) [NORMAL]
Chloride: 102 mEq/L (Reference: 96 - 106 mEq/L) [NORMAL]
Carbon Dioxide (CO2): 25 mEq/L (Reference: 22 - 29 mEq/L) [NORMAL]
Calcium: 9.4 mg/dL (Reference: 8.6 - 10.2 mg/dL) [NORMAL]
Total Protein: 7.1 g/dL (Reference: 6.4 - 8.3 g/dL) [NORMAL]
Albumin: 4.5 g/dL (Reference: 3.5 - 5.0 g/dL) [NORMAL]
Bilirubin, Total: 0.6 mg/dL (Reference: 0.2 - 1.2 mg/dL) [NORMAL]
Alkaline Phosphatase: 68 U/L (Reference: 44 - 121 U/L) [NORMAL]
AST (SGOT): 32 U/L (Reference: 10 - 40 U/L) [NORMAL]
ALT (SGPT): 44 U/L (Reference: 7 - 35 U/L) [HIGH]`,
    biomarkers: [
      { name: "Fasting Glucose", value: 118, unit: "mg/dL", min: 70, max: 99, status: "high", category: "Metabolic" },
      { name: "BUN", value: 14, unit: "mg/dL", min: 7, max: 20, status: "normal", category: "Renal" },
      { name: "Creatinine", value: 0.95, unit: "mg/dL", min: 0.70, max: 1.30, status: "normal", category: "Renal" },
      { name: "Sodium", value: 140, unit: "mEq/L", min: 135, max: 145, status: "normal", category: "Electrolytes" },
      { name: "Potassium", value: 4.3, unit: "mEq/L", min: 3.5, max: 5.1, status: "normal", category: "Electrolytes" },
      { name: "Calcium", value: 9.4, unit: "mg/dL", min: 8.6, max: 10.2, status: "normal", category: "Metabolic" },
      { name: "AST", value: 32, unit: "U/L", min: 10, max: 40, status: "normal", category: "Hepatic" },
      { name: "ALT", value: 44, unit: "U/L", min: 7, max: 35, status: "high", category: "Hepatic" }
    ]
  },
  {
    id: "lab_lipid_02",
    title: "Lipid Profile & Cardiovascular Risk",
    date: "2026-10-02",
    facility: "LabCorp Diagnostics",
    summary: "Elevated Total Cholesterol (218 mg/dL) and LDL Cholesterol (138 mg/dL). Triglycerides slightly borderline.",
    rawText: `Lipid Panel with Non-HDL Calculation
Collection Date: 2026-10-02 07:45 AM
Fasting: Yes

Total Cholesterol: 218 mg/dL (Reference: <200 mg/dL) [HIGH]
Triglycerides: 165 mg/dL (Reference: <150 mg/dL) [BORDERLINE HIGH]
HDL Cholesterol: 47 mg/dL (Reference: >40 mg/dL) [NORMAL]
LDL Cholesterol (Calc): 138 mg/dL (Reference: <100 mg/dL) [HIGH]
Non-HDL Cholesterol: 171 mg/dL (Reference: <130 mg/dL) [HIGH]
Total/HDL Ratio: 4.6 (Reference: <5.0) [NORMAL]`,
    biomarkers: [
      { name: "Total Cholesterol", value: 218, unit: "mg/dL", min: 125, max: 200, status: "high", category: "Lipids" },
      { name: "LDL Cholesterol", value: 138, unit: "mg/dL", min: 50, max: 100, status: "high", category: "Lipids" },
      { name: "HDL Cholesterol", value: 47, unit: "mg/dL", min: 40, max: 80, status: "normal", category: "Lipids" },
      { name: "Triglycerides", value: 165, unit: "mg/dL", min: 50, max: 150, status: "high", category: "Lipids" }
    ]
  },
  {
    id: "lab_a1c_03",
    title: "Hemoglobin A1c (Glycated Hemoglobin)",
    date: "2026-09-15",
    facility: "Quest Diagnostics",
    summary: "HbA1c at 6.1%, indicating prediabetes range (5.7% - 6.4%). Estimated Average Glucose is 128 mg/dL.",
    rawText: `Hemoglobin A1c with eAG
Collection Date: 2026-09-15 09:12 AM

Hemoglobin A1c: 6.1 % (Reference: <5.7 %) [HIGH - PREDIABETES]
Estimated Average Glucose (eAG): 128 mg/dL (Reference: <117 mg/dL) [HIGH]`,
    biomarkers: [
      { name: "Hemoglobin A1c", value: 6.1, unit: "%", min: 4.0, max: 5.6, status: "high", category: "Glycemic" },
      { name: "Estimated Avg Glucose", value: 128, unit: "mg/dL", min: 70, max: 117, status: "high", category: "Glycemic" }
    ]
  }
];

export const PRESET_CHAT_CONVERSATIONS = [
  {
    id: "msg_1",
    sender: "user",
    timestamp: "2026-10-12 10:20 AM",
    text: "Hi Copilot, my fasting blood sugar was 118 mg/dL this morning, and my doctor mentioned I am in the prediabetes range. What does this mean, and what actions can I take today?"
  },
  {
    id: "msg_2",
    sender: "assistant",
    timestamp: "2026-10-12 10:20 AM",
    triageLevel: "routine",
    text: `### 🩺 Clinical Insight: Understanding Your Fasting Glucose (118 mg/dL)

A fasting blood glucose of **118 mg/dL** falls into the **impaired fasting glucose (prediabetes)** category (standard normal is 70–99 mg/dL; prediabetes is 100–125 mg/dL). 

#### 💡 Key Takeaways:
1. **Reversibility:** Prediabetes is widely reversible with targeted lifestyle changes before pancreatic beta-cell fatigue progresses.
2. **Post-Meal Spikes:** Your fasting level reflects nighttime liver glucose release. Pair carbohydrates with fiber and protein to prevent dawn spikes.

#### 🎯 Actionable Recommendations:
* **The 15-Minute Post-Meal Walk:** Walking for just 10–15 minutes after your heaviest meal stimulates GLUT4 transporters, driving glucose into muscle tissue without relying heavily on insulin.
* **Fiber Anchor:** Aim for at least 30g of dietary fiber daily (chia seeds, leafy greens, legumes).
* **Hydration:** Ensure 2.5L+ water intake to assist renal filtration of excess glucose.

#### ❓ Questions for Your Doctor at Next Visit:
1. *"Should we re-test my HbA1c in 90 days to evaluate trend direction?"*
2. *"Is my current Metformin ER 500mg dosage adequate or should we consider timing adjustments?"*`
  }
];
