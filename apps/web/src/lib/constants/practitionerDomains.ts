export interface PractitionerDomainOption {
  value: string;
  label: string;
}

export interface PractitionerDomainGroup {
  group: string;
  domains: PractitionerDomainOption[];
}

export const PRACTITIONER_DOMAINS: PractitionerDomainGroup[] = [
  {
    group: "Medical & Surgical Practice",
    domains: [
      { value: "medical_doctor", label: "Medical Doctor / General Practitioner (MBBS/MBChB)" },
      { value: "dermatologist", label: "Dermatologist (Skin, Hair & Nail Specialist)" },
      { value: "specialist_physician", label: "Specialist Physician / Consultant (Internal Med, Paediatrics, etc.)" },
      { value: "surgeon", label: "General / Specialist Surgeon" },
      { value: "psychiatrist", label: "Psychiatrist" },
    ],
  },
  {
    group: "Pharmacy & Medicines",
    domains: [
      { value: "clinical_pharmacist", label: "Clinical Pharmacist (PharmD / B.Pharm)" },
      { value: "community_pharmacist", label: "Community / Retail Pharmacist" },
      { value: "industrial_pharmacist", label: "Industrial / Research Pharmacist" },
      { value: "pharmacy_technician", label: "Pharmacy Technician" },
    ],
  },
  {
    group: "Nursing & Midwifery",
    domains: [
      { value: "registered_nurse", label: "Registered Nurse (RN)" },
      { value: "registered_midwife", label: "Registered Midwife (RM)" },
      { value: "specialist_nurse", label: "Critical Care / Intensive Care Nurse" },
      { value: "paediatric_nurse", label: "Paediatric / Neonatal Nurse" },
      { value: "public_health_nurse", label: "Public Health / Community Nurse" },
    ],
  },
  {
    group: "Physical, Manual & Rehabilitative Therapy",
    domains: [
      { value: "physiotherapist", label: "Physiotherapist / Physical Therapist" },
      { value: "masseur", label: "Licensed Massage Therapist (Masseur / Masseuse)" },
      { value: "occupational_therapist", label: "Occupational Therapist" },
      { value: "chiropractor", label: "Chiropractor / Osteopathic Practitioner" },
      { value: "orthotist_prosthetist", label: "Orthotist / Prosthetist" },
    ],
  },
  {
    group: "MentalHealth & Psychological Services",
    domains: [
      { value: "clinical_psychologist", label: "Clinical Psychologist" },
      { value: "psychotherapist", label: "Psychotherapist / Mental Health Counsellor" },
      { value: "substance_abuse_counsellor", label: "Substance Abuse & Addiction Counsellor" },
      { value: "family_marriage_therapist", label: "Marriage & Family Therapist" },
    ],
  },
  {
    group: "Dental & Oral Health",
    domains: [
      { value: "dentist", label: "Dentist / Dental Surgeon (BDS)" },
      { value: "dental_therapist", label: "Dental Therapist" },
      { value: "dental_hygienist", label: "Dental Hygienist" },
      { value: "dental_technologist", label: "Dental Technologist" },
    ],
  },
  {
    group: "Vision & Eye Care",
    domains: [
      { value: "optometrist", label: "Optometrist (Doctor of Optometry - OD)" },
      { value: "ophthalmologist", label: "Ophthalmologist (Eye Surgeon)" },
      { value: "optician", label: "Dispensing Optician" },
    ],
  },
  {
    group: "Diagnostic & Laboratory Medicine",
    domains: [
      { value: "medical_lab_scientist", label: "Medical Laboratory Scientist (MLS / AMLSCN)" },
      { value: "medical_lab_technician", label: "Medical Laboratory Technician" },
      { value: "diagnostic_radiographer", label: "Diagnostic Radiographer / Sonographer / MRI Tech" },
      { value: "pathologist", label: "Clinical Pathologist" },
    ],
  },
  {
    group: "Nutrition, Dietetics & Lifestyle Medicine",
    domains: [
      { value: "registered_dietitian", label: "Registered Dietitian (RD)" },
      { value: "clinical_nutritionist", label: "Clinical Nutritionist" },
      { value: "lifestyle_medicine_coach", label: "Lifestyle Medicine / Health Coach" },
    ],
  },
  {
    group: "Community, Preventive & Emergency Medicine",
    domains: [
      { value: "community_health_worker", label: "Community Health Extension Worker (CHEW / CHO)" },
      { value: "public_health_specialist", label: "Public Health Officer / Epidemiologist" },
      { value: "paramedic_emt", label: "Emergency Medical Technician (EMT) / Paramedic" },
      { value: "speech_therapist", label: "Speech & Language Pathologist / Audiologist" },
      { value: "other_health_practitioner", label: "Other Certified Health Professional" },
    ],
  },
];
