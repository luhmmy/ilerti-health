export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  mdcnNumber: string;
  fee: number;
  feeString: string;
  bio: string;
  languages: string[];
  imageUrl: string;
  availableDays: string[];
}

export const doctors: Doctor[] = [
  {
    id: "doc_1",
    name: "Dr. Adebayo Ogunlesi",
    specialty: "Cardiology",
    hospital: "LUTH Idi-Araba",
    mdcnNumber: "MDCN/2014/41209",
    fee: 25000,
    feeString: "₦25,000",
    bio: "Consultant Cardiologist with over 15 years of experience managing hypertension, heart failure, and arrhythmias. Fellow of the West African College of Physicians.",
    languages: ["English", "Yoruba", "Nigerian Pidgin"],
    imageUrl: "https://ui-avatars.com/api/?name=Adebayo+Ogunlesi&background=0D9488&color=fff",
    availableDays: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: "doc_2",
    name: "Dr. Ngozi Eze",
    specialty: "Paediatrics",
    hospital: "National Hospital Abuja",
    mdcnNumber: "MDCN/2016/52310",
    fee: 15000,
    feeString: "₦15,000",
    bio: "Specialist Paediatrician focused on neonatal care, childhood immunizations, and management of acute pediatric illnesses.",
    languages: ["English", "Igbo"],
    imageUrl: "https://ui-avatars.com/api/?name=Ngozi+Eze&background=0D9488&color=fff",
    availableDays: ["Tuesday", "Thursday"],
  },
  {
    id: "doc_3",
    name: "Dr. Aminu Kano",
    specialty: "General Practice",
    hospital: "AKTH Kano",
    mdcnNumber: "MDCN/2018/60124",
    fee: 8000,
    feeString: "₦8,000",
    bio: "Experienced General Practitioner providing comprehensive primary care, chronic disease management, and preventive health services.",
    languages: ["English", "Hausa"],
    imageUrl: "https://ui-avatars.com/api/?name=Aminu+Kano&background=0D9488&color=fff",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "doc_4",
    name: "Dr. Folashade Adeleke",
    specialty: "Obstetrics & Gynaecology",
    hospital: "LASUTH Ikeja",
    mdcnNumber: "MDCN/2012/35900",
    fee: 30000,
    feeString: "₦30,000",
    bio: "Consultant O&G specializing in high-risk pregnancies, infertility treatments, and women's reproductive health.",
    languages: ["English", "Yoruba"],
    imageUrl: "https://ui-avatars.com/api/?name=Folashade+Adeleke&background=0D9488&color=fff",
    availableDays: ["Wednesday", "Saturday"],
  },
  {
    id: "doc_5",
    name: "Dr. Chinedu Okafor",
    specialty: "Internal Medicine",
    hospital: "UNTH Enugu",
    mdcnNumber: "MDCN/2015/48211",
    fee: 20000,
    feeString: "₦20,000",
    bio: "Internal Medicine physician dealing with the prevention, diagnosis, and treatment of adult diseases including diabetes and infectious diseases.",
    languages: ["English", "Igbo", "Nigerian Pidgin"],
    imageUrl: "https://ui-avatars.com/api/?name=Chinedu+Okafor&background=0D9488&color=fff",
    availableDays: ["Monday", "Thursday"],
  },
  {
    id: "doc_6",
    name: "Dr. Zainab Aliyu",
    specialty: "Dermatology",
    hospital: "Cedarcrest Abuja",
    mdcnNumber: "MDCN/2017/55022",
    fee: 22000,
    feeString: "₦22,000",
    bio: "Expert Dermatologist treating skin, hair, and nail conditions. Specialized in medical and cosmetic dermatology tailored for African skin types.",
    languages: ["English", "Hausa"],
    imageUrl: "https://ui-avatars.com/api/?name=Zainab+Aliyu&background=0D9488&color=fff",
    availableDays: ["Tuesday", "Friday"],
  },
  {
    id: "doc_7",
    name: "Dr. Babatunde Olawale",
    specialty: "Orthopaedics",
    hospital: "UCH Ibadan",
    mdcnNumber: "MDCN/2010/29505",
    fee: 28000,
    feeString: "₦28,000",
    bio: "Orthopaedic Surgeon focused on musculoskeletal trauma, sports injuries, and joint replacements.",
    languages: ["English", "Yoruba"],
    imageUrl: "https://ui-avatars.com/api/?name=Babatunde+Olawale&background=0D9488&color=fff",
    availableDays: ["Monday", "Wednesday"],
  },
  {
    id: "doc_8",
    name: "Dr. Ejiro Peters",
    specialty: "Psychiatry",
    hospital: "Lily Hospitals PH",
    mdcnNumber: "MDCN/2019/65301",
    fee: 18000,
    feeString: "₦18,000",
    bio: "Consultant Psychiatrist dedicated to mental health advocacy, treating mood disorders, anxiety, and providing therapeutic counseling.",
    languages: ["English", "Nigerian Pidgin"],
    imageUrl: "https://ui-avatars.com/api/?name=Ejiro+Peters&background=0D9488&color=fff",
    availableDays: ["Thursday", "Friday"],
  }
];

export const DOCTORS = doctors;
