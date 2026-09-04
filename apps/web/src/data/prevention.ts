export interface PreventionGuideline {
  category: string;
  title: string;
  details: string;
  frequencyOrTiming: string;
  targetGroup: string;
}

export const preventionGuidelines: PreventionGuideline[] = [
  {
    category: "Immunization",
    title: "BCG Vaccine",
    details: "Protects against Tuberculosis (TB). Essential first vaccine for newborns.",
    frequencyOrTiming: "At Birth",
    targetGroup: "Newborns"
  },
  {
    category: "Immunization",
    title: "OPV & Pentavalent",
    details: "Protects against Polio, Diphtheria, Pertussis, Tetanus, Hepatitis B, and Haemophilus influenzae type B.",
    frequencyOrTiming: "6, 10, and 14 weeks",
    targetGroup: "Infants"
  },
  {
    category: "Immunization",
    title: "Rotavirus Vaccine",
    details: "Prevents severe rotavirus diarrhea in young children.",
    frequencyOrTiming: "6 and 10 weeks",
    targetGroup: "Infants"
  },
  {
    category: "Immunization",
    title: "Measles & Yellow Fever",
    details: "Vital protection against highly contagious Measles and mosquito-borne Yellow Fever.",
    frequencyOrTiming: "9 months",
    targetGroup: "Infants"
  },
  {
    category: "Immunization",
    title: "HPV Vaccine",
    details: "Prevents Human Papillomavirus infections that can lead to cervical cancer.",
    frequencyOrTiming: "9 to 14 years (2 doses)",
    targetGroup: "Adolescent Girls"
  },
  {
    category: "Malaria",
    title: "Malaria Prevention",
    details: "Use of Insecticide-Treated Nets (ITNs), indoor residual spraying, and Intermittent Preventive Treatment in pregnancy (IPTp). Ensure environmental sanitation to clear stagnant water.",
    frequencyOrTiming: "Continuous / During Pregnancy",
    targetGroup: "All Ages / Pregnant Women"
  },
  {
    category: "Screening",
    title: "Blood Pressure & BMI",
    details: "Routine check for hypertension and obesity, which are risk factors for cardiovascular diseases.",
    frequencyOrTiming: "At least once every year",
    targetGroup: "Adults (18+)"
  },
  {
    category: "Screening",
    title: "Fasting Blood Glucose & Lipid Profile",
    details: "Screening for Diabetes Mellitus and hyperlipidemia. Vital for early detection and management.",
    frequencyOrTiming: "Every 1-3 years depending on risk",
    targetGroup: "Adults (40+ or earlier if high risk)"
  },
  {
    category: "Screening",
    title: "Pap Smear & Mammography",
    details: "Cervical and breast cancer screening. Early detection saves lives.",
    frequencyOrTiming: "Pap Smear (every 3 years), Mammogram (annually/biennially)",
    targetGroup: "Women (21+ for Pap, 40+ for Mammogram)"
  }
];
