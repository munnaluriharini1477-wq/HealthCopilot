/**
 * AI-Powered Personal Health Copilot
 * Clinical Intelligence & Triage Engine (Dual Mode: Heuristic Expert + Gemini LLM)
 */

export const BIOMARKER_DICTIONARY = {
  "glucose": {
    name: "Fasting Blood Glucose",
    category: "Metabolic / Glycemic",
    unit: "mg/dL",
    min: 70,
    max: 99,
    criticalLow: 54,
    criticalHigh: 250,
    interpretation: {
      low: "Hypoglycemia. Can cause dizziness, shakiness, perspiration, and cognitive confusion.",
      normal: "Optimal glycemic homeostasis. Body effectively balances insulin and glucagon.",
      high: "Elevated fasting blood sugar. Levels 100–125 indicate impaired fasting glucose (prediabetes); ≥126 suggests diabetes.",
    },
    lifestyle: "Focus on low glycemic index foods, prioritize dietary fiber (chia, flax, leafy greens), and engage in light walking 15 minutes post-meal.",
    doctorQuestions: [
      "Should we evaluate my 3-month HbA1c to assess chronic glycemic exposure?",
      "Would continuous glucose monitoring (CGM) or pre/post-prandial fingersticks provide clearer insight?"
    ]
  },
  "hba1c": {
    name: "Hemoglobin A1c (HbA1c)",
    category: "Glycemic",
    unit: "%",
    min: 4.0,
    max: 5.6,
    criticalLow: 3.5,
    criticalHigh: 10.0,
    interpretation: {
      low: "Below typical range. May occur in conditions with rapid red blood cell turnover or chronic hypoglycemia.",
      normal: "Optimal long-term blood sugar regulation over the past 90–120 days.",
      high: "5.7%–6.4% indicates prediabetes. 6.5% and above on two separate tests indicates diabetes.",
    },
    lifestyle: "Resistance training increases non-insulin mediated muscle glucose uptake. Reduce refined sugars and sugar-sweetened beverages.",
    doctorQuestions: [
      "What is my personalized target HbA1c based on my age and cardiovascular risk?",
      "Would metformin or lifestyle therapy be the recommended primary step?"
    ]
  },
  "ldl": {
    name: "LDL Cholesterol (Low-Density Lipoprotein)",
    category: "Lipids & Cardiovascular",
    unit: "mg/dL",
    min: 50,
    max: 99,
    criticalLow: 30,
    criticalHigh: 190,
    interpretation: {
      low: "Unusually low. Generally cardioprotective, though very low values should be reviewed.",
      normal: "Optimal atherogenic particle count. Low risk for arterial plaque accumulation.",
      high: "Elevated 'bad' cholesterol. Accelerates atherosclerotic plaque formation inside arterial walls.",
    },
    lifestyle: "Increase soluble fiber (oats, psyllium husk, beans) which binds bile acids in the gut. Substitute saturated fats with monounsaturated fats (extra virgin olive oil, avocados).",
    doctorQuestions: [
      "Would an ApoB test or Coronary Artery Calcium (CAC) scan better clarify my individual plaque burden?",
      "Is statin therapy indicated based on my 10-year ASCVD risk calculation?"
    ]
  },
  "hdl": {
    name: "HDL Cholesterol (High-Density Lipoprotein)",
    category: "Lipids & Cardiovascular",
    unit: "mg/dL",
    min: 40,
    max: 85,
    criticalLow: 25,
    criticalHigh: 120,
    interpretation: {
      low: "Low 'good' cholesterol. Associated with metabolic syndrome and reduced reverse cholesterol transport.",
      normal: "Adequate reverse cholesterol transport capacity.",
      high: "High HDL is traditionally considered cardioprotective, though extremely high (>100) may not add further benefit.",
    },
    lifestyle: "Aerobic cardiovascular exercise and quitting smoking are the most effective ways to boost protective HDL.",
    doctorQuestions: [
      "Does my low HDL correlate with my triglyceride levels or insulin resistance?"
    ]
  },
  "triglycerides": {
    name: "Triglycerides",
    category: "Lipids & Cardiovascular",
    unit: "mg/dL",
    min: 50,
    max: 149,
    criticalLow: 30,
    criticalHigh: 500,
    interpretation: {
      low: "Low circulating fats, usually normal.",
      normal: "Optimal circulating fat storage balance.",
      high: "Elevated circulating lipids. Strongly associated with hepatic fat storage, refined carbohydrate intake, and insulin resistance.",
    },
    lifestyle: "Strictly minimize high-fructose corn syrup, refined white carbs, and alcohol. Increase omega-3 fatty acids (salmon, sardines, walnuts).",
    doctorQuestions: [
      "Could my elevated triglycerides indicate fatty liver (MASLD)?",
      "Should I supplement prescription-grade EPA/DHA?"
    ]
  },
  "alt": {
    name: "Alanine Aminotransferase (ALT)",
    category: "Hepatic / Liver",
    unit: "U/L",
    min: 7,
    max: 35,
    criticalLow: 0,
    criticalHigh: 200,
    interpretation: {
      low: "Normal liver enzyme levels.",
      normal: "Healthy hepatocyte integrity.",
      high: "Liver enzyme leakage. Can indicate metabolic dysfunction-associated steatotic liver disease (fatty liver), medication stress, or alcohol exposure.",
    },
    lifestyle: "Eliminate sugary drinks and alcohol. Gradual 5–10% body weight reduction significantly reduces liver enzyme stress.",
    doctorQuestions: [
      "Should we order an abdominal ultrasound or FibroScan to check for liver steatosis?",
      "Do any of my current daily medications stress liver metabolism?"
    ]
  },
  "ast": {
    name: "Aspartate Aminotransferase (AST)",
    category: "Hepatic / Liver",
    unit: "U/L",
    min: 10,
    max: 40,
    criticalLow: 0,
    criticalHigh: 200,
    interpretation: {
      low: "Normal.",
      normal: "Healthy cellular integrity across liver, heart, and skeletal muscle.",
      high: "Elevated cellular enzyme. Often analyzed in conjunction with ALT (AST/ALT ratio) to differentiate liver vs. muscular sources.",
    },
    lifestyle: "Avoid strenuous unaccustomed weightlifting within 48 hours of retesting, as muscle microtears can falsely elevate AST.",
    doctorQuestions: [
      "Is the AST elevation isolated or paired with ALT and GGT?"
    ]
  },
  "creatinine": {
    name: "Serum Creatinine",
    category: "Renal / Kidney",
    unit: "mg/dL",
    min: 0.70,
    max: 1.30,
    criticalLow: 0.3,
    criticalHigh: 3.5,
    interpretation: {
      low: "Usually reflects low muscle mass or high hydration.",
      normal: "Normal glomerular filtration and kidney filtration efficiency.",
      high: "Possible decrease in kidney clearance capacity or acute dehydration.",
    },
    lifestyle: "Ensure consistent hydration (2–3 liters daily). Avoid excessive chronic NSAID (ibuprofen/naproxen) usage which stresses renal perfusion.",
    doctorQuestions: [
      "What is my current eGFR (estimated glomerular filtration rate)?",
      "Is my ACE inhibitor or blood pressure medication properly dosed for my renal clearance?"
    ]
  },
  "potassium": {
    name: "Serum Potassium (K+)",
    category: "Electrolytes",
    unit: "mEq/L",
    min: 3.5,
    max: 5.1,
    criticalLow: 2.8,
    criticalHigh: 6.2,
    interpretation: {
      low: "Hypokalemia. Risk of cardiac arrhythmia, muscle cramping, and weakness.",
      normal: "Optimal cellular membrane resting potential and cardiac rhythm stability.",
      high: "Hyperkalemia. Important when taking ACE inhibitors or ARBs. Risk of cardiac conduction abnormalities.",
    },
    lifestyle: "If on ACE inhibitors (like Lisinopril), avoid high-dose potassium supplements or salt substitutes containing potassium chloride unless directed.",
    doctorQuestions: [
      "Given my blood pressure medications, how frequently should my potassium and electrolytes be monitored?"
    ]
  },
  "tsh": {
    name: "Thyroid-Stimulating Hormone (TSH)",
    category: "Endocrine / Thyroid",
    unit: "mIU/L",
    min: 0.45,
    max: 4.5,
    criticalLow: 0.1,
    criticalHigh: 15.0,
    interpretation: {
      low: "Suppressed TSH. Suggests hyperthyroidism (overactive thyroid) or medication over-replacement.",
      normal: "Normal pituitary-thyroid feedback axis.",
      high: "Elevated TSH. Suggests subclinical or clinical hypothyroidism (underactive thyroid), common cause of fatigue and weight gain.",
    },
    lifestyle: "Ensure adequate dietary selenium and iodine through varied nutrition. Recheck in 6–8 weeks morning fasting.",
    doctorQuestions: [
      "Should we check Free T4, Free T3, and thyroid peroxidase (TPO) antibodies?"
    ]
  }
};

export class ClinicalAIEngine {
  constructor(db) {
    this.db = db;
  }

  /**
   * Triage user symptoms into clinical urgency categories
   */
  triageSymptoms(text) {
    const lower = text.toLowerCase();

    // Red Flag emergency triggers
    const emergencyKeywords = [
      "chest pain", "pressure in chest", "left arm pain", "jaw pain",
      "slurred speech", "face droop", "sudden paralysis", "can't breathe",
      "severe shortness of breath", "coughing blood", "anaphylaxis",
      "suicidal", "severe allergic reaction", "unconscious", "passing out",
      "worst headache of life", "thunderclap headache"
    ];

    for (const kw of emergencyKeywords) {
      if (lower.includes(kw)) {
        return {
          level: "emergency",
          label: "EMERGENCY: Immediate Medical Attention Needed",
          color: "#EF4444",
          badge: "CRITICAL 911",
          notice: "These symptoms can represent acute life-threatening emergencies (e.g. cardiac event, stroke, acute respiratory distress). Please call 911 or go to the nearest emergency room immediately."
        };
      }
    }

    // Urgent Care triggers
    const urgentKeywords = [
      "fever above 103", "high fever", "blood in stool", "blood in urine",
      "severe abdominal pain", "stiff neck with fever", "confusion",
      "sugar 350", "glucose 350", "glucose above 300", "bp 185", "bp 190",
      "dehydration", "inability to keep liquids down", "wound infection"
    ];

    for (const kw of urgentKeywords) {
      if (lower.includes(kw)) {
        return {
          level: "urgent",
          label: "Urgent Medical Evaluation Recommended",
          color: "#F97316",
          badge: "URGENT CARE (Today)",
          notice: "These symptoms warrant same-day clinical assessment by an Urgent Care center or your primary care physician to prevent complications."
        };
      }
    }

    // Routine clinical triggers
    const routineKeywords = [
      "persistent headache", "fatigue", "dizzy", "dizziness", "knee pain",
      "joint pain", "rash", "elevated", "lab result", "metformin", "lisinopril",
      "blood pressure", "cough", "missed dose", "cholesterol", "statin", "nausea"
    ];

    for (const kw of routineKeywords) {
      if (lower.includes(kw)) {
        return {
          level: "routine",
          label: "Prompt Clinical Review Recommended",
          color: "#F59E0B",
          badge: "SCHEDULE APPOINTMENT",
          notice: "These symptoms or medication queries are best managed in consultation with your primary physician or prescribing provider."
        };
      }
    }

    return {
      level: "self-care",
      label: "Wellness & Self-Care Guidance",
      color: "#10B981",
      badge: "ROUTINE MONITORING",
      notice: "General health inquiry. Continue monitoring and maintain health tracking."
    };
  }

  /**
   * Process a message via Gemini API if key is present, otherwise fallback to heuristic engine
   */
  async processUserMessage(userInput) {
    const settings = this.db.getSettings();
    const triage = this.triageSymptoms(userInput);
    const patient = this.db.getPatient();
    const vitals = this.db.getVitals().slice(0, 5);
    const meds = this.db.getMedications();

    if (settings.geminiApiKey && settings.geminiApiKey.trim().length > 10) {
      try {
        const liveResponse = await this.callGeminiAPI(settings.geminiApiKey, userInput, {
          patient, vitals, meds, triage
        });
        return {
          triageLevel: triage.level,
          triageBadge: triage.badge,
          text: liveResponse,
          source: "gemini-live"
        };
      } catch (err) {
        console.warn("Gemini API call failed, falling back to clinical engine:", err);
      }
    }

    // Fallback to embedded Clinical Heuristic Engine
    const heuristicResponse = this.generateClinicalHeuristicResponse(userInput, triage, {
      patient, vitals, meds
    });

    return {
      triageLevel: triage.level,
      triageBadge: triage.badge,
      text: heuristicResponse,
      source: "clinical-engine"
    };
  }

  async callGeminiAPI(apiKey, prompt, context) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

    const systemPrompt = `You are an AI-powered Personal Health Copilot for a patient named ${context.patient.name} (${context.patient.age} y/o, ${context.patient.gender}).
Current Conditions: ${context.patient.conditions.join(", ")}.
Current Medications: ${context.meds.map(m => `${m.name} ${m.dosage} (${m.frequency})`).join("; ")}.
Recent Vitals: ${JSON.stringify(context.vitals)}.

Always adhere to these clinical communication guidelines:
1. Empathy, plain language, and rigorous medical accuracy.
2. If critical red flags are present, urge immediate emergency services (911/ER).
3. Structure your response with markdown:
   - ### 🩺 Clinical Assessment & Overview
   - #### 💡 Key Physiological Insights
   - #### 🎯 Actionable Self-Care & Lifestyle Steps
   - #### ❓ 2-3 High-Value Questions for Their Doctor
4. Remind the user you are an educational copilot, not a replacement for in-person diagnosis.`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt + "\n\nUser Question: " + prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from model.";
  }

  generateClinicalHeuristicResponse(input, triage, context) {
    const lower = input.toLowerCase();

    // Emergency Scenario
    if (triage.level === "emergency") {
      return `### 🚨 CRITICAL MEDICAL ALERT: IMMEDIATE ATTENTION REQUIRED

**Your reported symptoms indicate a potential high-acuity emergency.**

> **IMMEDIATE ACTION:** Call **911** (or local emergency dispatch) or have someone drive you to the nearest hospital emergency department right now. **Do not drive yourself.**

#### ⚠️ Reasons for Urgent Concern:
* Symptoms such as severe chest pressure, radiating arm or jaw pain, sudden neurological deficits, or severe breathlessness require acute cardiac and pulmonary exclusion.
* Time-to-treatment is vital in cardiovascular and neurological events.

#### 📋 What to tell emergency responders:
1. State your primary symptom clearly: *"I am experiencing ${input}"*.
2. Provide your active medications: **${context.meds.map(m => m.name).join(", ")}**.
3. Note known allergies: **${context.patient.allergies.join(", ")}**.`;
    }

    // Medication Missed Dose Scenario
    if (lower.includes("missed dose") || lower.includes("forgot") && lower.includes("medication") || lower.includes("double")) {
      return `### 💊 Medication Guidance: Handling a Missed Dose

#### ⚠️ Golden Rule for Most Daily Medications:
**Never double up on a dose** to compensate for a missed one unless explicitly authorized by your physician. Doubling medications like **Lisinopril** (ACE inhibitor) or **Metformin** can cause acute hypotension (dangerous blood pressure drop) or gastrointestinal upset/hypoglycemia.

#### ⏱ General Timing Protocol:
1. **If you remember within 2–4 hours of your scheduled time:** It is typically safe to take your standard dose.
2. **If it is close to your next scheduled dose:** Skip the missed dose entirely and resume your regular schedule.
3. **Log the occurrence:** Record the missed dose in your **Medication Tracker** tab so your doctor can evaluate whether adherence gaps correlate with any symptom spikes.

#### ❓ Questions for Your Doctor or Pharmacist:
* *"If I miss my morning ${context.meds[0]?.name || 'medication'}, what is my exact safe window before I should skip?"*`;
    }

    // Drug interaction / Ibuprofen & Lisinopril
    if ((lower.includes("ibuprofen") || lower.includes("advil") || lower.includes("aleve") || lower.includes("nsaid")) &&
        (lower.includes("lisinopril") || lower.includes("blood pressure") || lower.includes("metformin"))) {
      return `### ⚠️ Drug Interaction Alert: NSAIDs & Blood Pressure Medications

You asked about combining NSAIDs (such as **Ibuprofen / Advil / Naproxen**) with your medication regimen (**Lisinopril / Metformin**).

#### 🔬 Clinical Interaction Mechanism:
* **Blunted Antihypertensive Effect:** NSAIDs inhibit renal prostaglandins, which causes sodium and water retention. This directly counteracts the blood-pressure lowering benefits of ACE inhibitors like Lisinopril.
* **Renal Perfusion Stress:** The combination of an ACE inhibitor with high-dose NSAIDs can decrease glomerular filtration, placing acute strain on your kidneys.
* **Potassium Elevation:** Both agents can independently reduce renal potassium excretion.

#### 💡 Safer Alternatives for Mild Pain or Fever:
* **Acetaminophen (Tylenol):** At standard doses (under 2,000–3,000 mg/day with normal liver function), Acetaminophen does not interfere with ACE inhibitors or renal prostaglandins.
* **Topical Formulations:** Topical creams (e.g. Voltaren gel for joint pain) have significantly lower systemic absorption.

#### ❓ Discussion for Your Clinician:
* *"What is the preferred pain reliever for me considering my blood pressure and kidney parameters?"*`;
    }

    // Glucose / Diabetes Inquiry
    if (lower.includes("glucose") || lower.includes("sugar") || lower.includes("prediabetes") || lower.includes("a1c")) {
      return `### 🩺 Metabolic Analysis: Blood Glucose & Prediabetes

Your profile indicates ongoing management of **Prediabetes** alongside **Metformin ER 500mg**.

#### 📊 What the Metrics Mean:
* **Fasting Glucose Target:** A healthy fasting range is **70–99 mg/dL**. Readings between **100–125 mg/dL** reflect impaired fasting glucose.
* **Dawn Phenomenon:** Natural morning cortisol surges cause the liver to release stored glycogen, leading to elevated fasting numbers even if you ate cleanly the night before.

#### 🎯 Evidence-Based Interventions:
1. **The 10-Minute Movement Rule:** Engaging in light walking or bodyweight movement within 20 minutes after meals directly activates muscle GLUT-4 glucose transporters, clearing glucose without requiring extra insulin.
2. **Food Sequencing:** Eat protein and leafy vegetables before carbohydrates in every meal. This slows gastric emptying and dampens glucose peaks by up to 35%.
3. **Hydration & Electrolytes:** Keep water intake at 2.5–3 liters to assist kidney clearance.

#### ❓ Questions for Your Doctor:
1. *"Would a 90-day repeat of my HbA1c help verify if my current lifestyle changes are reducing my average glucose?"*
2. *"Should we adjust the timing of my evening Metformin dose to counter morning dawn spikes?"*`;
    }

    // Blood Pressure & Dizziness Inquiry
    if (lower.includes("blood pressure") || lower.includes("dizzy") || lower.includes("dizziness") || lower.includes("hypertension") || lower.includes("bp")) {
      return `### 💓 Cardiovascular Check: Blood Pressure & Orthostatic Sensations

You mentioned symptoms related to **blood pressure or dizziness**.

#### 🔍 Clinical Considerations:
* **Orthostatic Hypotension:** If dizziness occurs primarily upon standing up from a bed or chair, it may indicate a temporary postural drop in blood pressure.
* **Medication Peak Effect:** ACE inhibitors like **Lisinopril** reach peak plasma concentration 6–8 hours after ingestion. Notice if dizziness aligns with peak absorption windows.
* **Hydration Status:** Low fluid or electrolyte intake amplifies postural drops.

#### 🎯 Immediate Self-Care Steps:
* **Pause Before Standing:** Sit on the edge of the bed or chair for 30 seconds before rising completely.
* **Log Paired Readings:** Take your blood pressure seated, then stand and take it again 2 minutes later. Record both in the **Vitals Logger**.
* **Hydrate:** Drink a large glass of water with a pinch of electrolytes if not restricted by dietary sodium guidelines.

#### ❓ Questions for Your Doctor:
1. *"Should we test my orthostatic blood pressure in the clinic?"*
2. *"Is 10mg of Lisinopril producing too pronounced an effect, or is my dosing schedule optimal?"*`;
    }

    // Cholesterol / Statin Inquiry
    if (lower.includes("cholesterol") || lower.includes("statin") || lower.includes("atorvastatin") || lower.includes("lipid") || lower.includes("ldl")) {
      return `### 🫀 Lipid Management: Cholesterol & Cardiovascular Protection

You are currently prescribed **Atorvastatin 20mg** for lipid management and cardiovascular risk reduction.

#### 💡 Key Clinical Points:
* **Why Take at Bedtime?** The primary liver enzyme responsible for cholesterol synthesis (HMG-CoA reductase) is most active during the night. Taking statins in the evening maximizes lipid reduction.
* **Atherosclerotic Prevention:** Lowering LDL below 100 mg/dL (or below 70 mg/dL for elevated risk profiles) stabilizes vascular endothelium and halts plaque buildup.
* **CoQ10 Supplementation:** Statins can decrease endogenous Coenzyme Q10 synthesis. Continuing your CoQ10 supplement supports cellular mitochondrial energy.

#### 🎯 Actionable Lifestyle Synergies:
* Add **10g of soluble fiber daily** (e.g. psyllium, rolled oats, black beans) which binds intestinal cholesterol.
* Replace trans-fats and palm oils with high-polyphenol extra virgin olive oil.

#### ❓ Questions for Your Doctor:
* *"Should we check my high-sensitivity C-reactive protein (hs-CRP) to evaluate systemic arterial inflammation?"*
* *"When should we run our next follow-up lipid panel to measure statin response?"*`;
    }

    // General Health Query Fallback
    return `### 🩺 Personal Health Copilot Analysis

Thank you for logging your health query: *"**${input}**"*.

#### 💡 Clinical Synthesis:
Based on your health profile (${context.patient.name}, ${context.patient.age} y/o, managing ${context.patient.conditions.join(", ")}):
* **Symptom Stratification:** Your current query falls under **${triage.badge}**. No acute red flags were detected, but monitoring frequency should remain consistent.
* **Holistic Balance:** Your vitals and medication adherence history provide a strong foundation for longitudinal wellness.

#### 🎯 Practical Next Steps:
1. Continue recording your morning and evening readings in the **Vitals Logger**.
2. If symptoms persist or increase in frequency over the next 48–72 hours, contact **${context.patient.primaryPhysician.name}** at **${context.patient.primaryPhysician.phone}**.
3. Use the **Doctor Visit Prep** tab to add this note to your upcoming consultation agenda.

#### ❓ Recommended Questions for Your Provider:
* *"Does this symptom align with my current health profile and medications?"*
* *"Are there specific symptom thresholds where I should notify your nursing desk directly?"*`;
  }
}
