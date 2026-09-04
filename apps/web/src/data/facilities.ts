export interface Facility {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  has247ER: boolean;
  hmoAffiliations: string[];
  diagnosticServices: string[];
  imageUrl: string;
}

export const facilities: Facility[] = [
  {
    id: "fac_1",
    name: "Reddington Hospital",
    address: "12 Idowu Martins Street",
    city: "Victoria Island",
    state: "Lagos",
    phone: "+234 1 271 5341",
    has247ER: true,
    hmoAffiliations: ["Hygeia", "AXA Mansard", "Reliance"],
    diagnosticServices: ["MRI", "CT Scan", "X-Ray", "Ultrasound", "Full Lab"],
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac_2",
    name: "Evercare Hospital",
    address: "1 Bisola Durosinmi Etti Drive",
    city: "Lekki Phase 1",
    state: "Lagos",
    phone: "+234 813 985 0710",
    has247ER: true,
    hmoAffiliations: ["Hygeia", "AXA Mansard", "Leadway Health", "Reliance"],
    diagnosticServices: ["MRI", "CT Scan", "Fluoroscopy", "Mammography", "Endoscopy", "Full Lab"],
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac_3",
    name: "MeCure Healthcare Limited",
    address: "Debo Industrial Compound, Apapa-Oshodi Expressway",
    city: "Oshodi",
    state: "Lagos",
    phone: "+234 700 063 2873",
    has247ER: false,
    hmoAffiliations: ["AXA Mansard", "Reliance", "Leadway Health"],
    diagnosticServices: ["PET-CT", "MRI", "CT Scan", "Ultrasound", "Digital X-Ray", "Pathology"],
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac_4",
    name: "St. Nicholas Hospital",
    address: "57 Campbell Street",
    city: "Lagos Island",
    state: "Lagos",
    phone: "+234 802 290 8484",
    has247ER: true,
    hmoAffiliations: ["Hygeia", "AXA Mansard"],
    diagnosticServices: ["Dialysis", "CT Scan", "X-Ray", "Ultrasound", "Full Lab"],
    imageUrl: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac_5",
    name: "Kelina Hospital",
    address: "3rd Avenue, Gwarinpa",
    city: "Abuja",
    state: "FCT",
    phone: "+234 803 364 4644",
    has247ER: true,
    hmoAffiliations: ["Reliance", "Leadway Health"],
    diagnosticServices: ["Laser Surgery", "Endoscopy", "CT Scan", "Ultrasound", "Laboratory"],
    imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac_6",
    name: "Clina-Lancet Laboratories",
    address: "Various Locations",
    city: "Nationwide",
    state: "Nigeria",
    phone: "+234 704 653 3040",
    has247ER: false,
    hmoAffiliations: ["Hygeia", "AXA Mansard", "Reliance", "Leadway Health"],
    diagnosticServices: ["Clinical Pathology", "Molecular Diagnostics", "Histopathology", "Cytology"],
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac_7",
    name: "Lily Hospitals",
    address: "6, Deco Road",
    city: "Warri",
    state: "Delta",
    phone: "+234 809 016 0174",
    has247ER: true,
    hmoAffiliations: ["Hygeia", "Leadway Health"],
    diagnosticServices: ["CT Scan", "X-Ray", "Ultrasound", "Echocardiography", "Laboratory"],
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac_8",
    name: "Premier Specialists Medical Centre",
    address: "16 Akin Adesola Street",
    city: "Victoria Island",
    state: "Lagos",
    phone: "+234 1 270 3000",
    has247ER: true,
    hmoAffiliations: ["Hygeia", "AXA Mansard"],
    diagnosticServices: ["X-Ray", "Ultrasound", "Laboratory"],
    imageUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80"
  }
];

export const FACILITIES = facilities;
