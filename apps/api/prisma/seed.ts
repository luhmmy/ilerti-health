import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive production seed for ILERTI Health...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Clear existing seed data safely
  await prisma.consultation.deleteMany({});
  await prisma.healthRecord.deleteMany({});
  await prisma.wellnessPlan.deleteMany({});
  await prisma.healthProfile.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.facility.deleteMany({});
  await prisma.aiConversation.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned existing records.');

  // 2. Seed Super Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ilertihealth.site',
      phone: '+2348010000001',
      passwordHash,
      firstName: 'ILERTI',
      lastName: 'SuperAdmin',
      role: 'ADMIN',
      emailVerified: true,
      phoneVerified: true,
      state: 'Lagos',
      city: 'Lagos',
    },
  });
  console.log(`✅ Created Admin: ${admin.email}`);

  // 3. Seed Demo Patient with Health Profile
  const patient = await prisma.user.create({
    data: {
      email: 'patient@ilertihealth.site',
      phone: '+2348023456789',
      passwordHash,
      firstName: 'Oluwaseun',
      lastName: 'Adeyemi',
      role: 'PATIENT',
      emailVerified: true,
      phoneVerified: true,
      gender: 'MALE',
      state: 'Lagos',
      city: 'Ikeja',
      address: '14 Allen Avenue, Ikeja, Lagos',
      dateOfBirth: new Date('1994-06-15'),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      healthProfile: {
        create: {
          bloodType: 'O+',
          heightCm: 178,
          weightKg: 74,
          chronicConditions: ['None'],
          allergies: ['Penicillin', 'Peanuts'],
          currentMedications: ['Vitamin C 1000mg daily'],
          emergencyContactName: 'Bisi Adeyemi (Spouse)',
          emergencyContactPhone: '+2348099887766',
        },
      },
      healthRecords: {
        create: [
          {
            recordType: 'LAB_RESULT',
            title: 'Complete Blood Count & Lipid Profile',
            content: 'Fasting Blood Sugar: 92 mg/dL (Normal), Total Cholesterol: 180 mg/dL, HbA1c: 5.4%. All parameters within healthy clinical limits.',
            isConfidential: false,
          },
          {
            recordType: 'PRESCRIPTION',
            title: 'Routine Multivitamin & Iron Therapy',
            content: 'Rx: Tab Ferrous Sulphate 200mg daily for 30 days. Tab Ascorbic Acid 500mg daily.',
            isConfidential: false,
          },
        ],
      },
    },
  });
  console.log(`✅ Created Demo Patient: ${patient.email}`);

  // 4. Seed 8 Verified Nigerian Doctors
  const doctorsData = [
    {
      email: 'dr.funmilayo@ilertihealth.site',
      phone: '+2348031112233',
      firstName: 'Funmilayo',
      lastName: 'Adeleke',
      gender: 'FEMALE',
      state: 'Lagos',
      city: 'Victoria Island',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
      mdcnNumber: 'MDCN/48291',
      licenseNumber: 'LCN-2024-8891',
      bio: 'Consultant Cardiologist at Lagos University Teaching Hospital (LUTH) with over 12 years of clinical experience in preventive cardiovascular health, hypertension management, and heart failure care.',
      experienceYears: 12,
      consultationFee: 12000,
      specialties: ['Cardiology', 'Internal Medicine'],
      languages: ['English', 'Yoruba'],
      rating: 4.95,
      totalConsultations: 438,
      isAvailable: true,
    },
    {
      email: 'dr.emeka@ilertihealth.site',
      phone: '+2348032223344',
      firstName: 'Emeka',
      lastName: 'Okonkwo',
      gender: 'MALE',
      state: 'FCT',
      city: 'Abuja',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
      mdcnNumber: 'MDCN/39102',
      licenseNumber: 'LCN-2024-3910',
      bio: 'Senior Paediatric Specialist at National Hospital Abuja. Dedicated to neonatal care, child immunizations, paediatric infectious diseases, and developmental growth tracking.',
      experienceYears: 10,
      consultationFee: 10000,
      specialties: ['Paediatrics', 'General Practice'],
      languages: ['English', 'Igbo'],
      rating: 4.9,
      totalConsultations: 512,
      isAvailable: true,
    },
    {
      email: 'dr.aisha@ilertihealth.site',
      phone: '+2348033334455',
      firstName: 'Aisha',
      lastName: 'Mohammed',
      gender: 'FEMALE',
      state: 'Kano',
      city: 'Kano',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813627-2c938c5b1641?w=150',
      mdcnNumber: 'MDCN/52914',
      licenseNumber: 'LCN-2024-5291',
      bio: 'Consultant Obstetrician & Gynaecologist specializing in maternal-fetal medicine, safe motherhood, fertility counselling, and women wellness across northern Nigeria.',
      experienceYears: 14,
      consultationFee: 15000,
      specialties: ['Obstetrics & Gynaecology'],
      languages: ['English', 'Hausa'],
      rating: 4.98,
      totalConsultations: 620,
      isAvailable: true,
    },
    {
      email: 'dr.babatunde@ilertihealth.site',
      phone: '+2348034445566',
      firstName: 'Babatunde',
      lastName: 'Fashola-Cole',
      gender: 'MALE',
      state: 'Lagos',
      city: 'Ikeja',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
      mdcnNumber: 'MDCN/29481',
      licenseNumber: 'LCN-2024-2948',
      bio: 'Family Medicine & Primary Care Physician with expertise in holistic lifestyle intervention, chronic disease prevention, malaria management, and routine wellness checkups.',
      experienceYears: 8,
      consultationFee: 7500,
      specialties: ['General Practice', 'Family Medicine'],
      languages: ['English', 'Yoruba', 'Pidgin'],
      rating: 4.88,
      totalConsultations: 310,
      isAvailable: true,
    },
    {
      email: 'dr.chinedu@ilertihealth.site',
      phone: '+2348035556677',
      firstName: 'Chinedu',
      lastName: 'Eze',
      gender: 'MALE',
      state: 'Rivers',
      city: 'Port Harcourt',
      avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
      mdcnNumber: 'MDCN/61029',
      licenseNumber: 'LCN-2024-6102',
      bio: 'Consultant Endocrinologist and Diabetologist with University of Port Harcourt Teaching Hospital. Pioneer in community diabetes education and metabolic health screening.',
      experienceYears: 11,
      consultationFee: 14000,
      specialties: ['Endocrinology', 'Internal Medicine'],
      languages: ['English', 'Igbo', 'Pidgin'],
      rating: 4.92,
      totalConsultations: 280,
      isAvailable: true,
    },
    {
      email: 'dr.halima@ilertihealth.site',
      phone: '+2348036667788',
      firstName: 'Halima',
      lastName: 'Bello',
      gender: 'FEMALE',
      state: 'Oyo',
      city: 'Ibadan',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
      mdcnNumber: 'MDCN/44920',
      licenseNumber: 'LCN-2024-4492',
      bio: 'Specialist Dermatologist at UCH Ibadan. Expertise in tropical skin conditions, adult & paediatric acne, eczema, and skin cancer prevention.',
      experienceYears: 9,
      consultationFee: 9000,
      specialties: ['Dermatology'],
      languages: ['English', 'Yoruba', 'Hausa'],
      rating: 4.91,
      totalConsultations: 395,
      isAvailable: true,
    },
  ];

  for (const doc of doctorsData) {
    const userDoc = await prisma.user.create({
      data: {
        email: doc.email,
        phone: doc.phone,
        passwordHash,
        firstName: doc.firstName,
        lastName: doc.lastName,
        role: 'DOCTOR',
        gender: doc.gender,
        state: doc.state,
        city: doc.city,
        avatarUrl: doc.avatarUrl,
        emailVerified: true,
        phoneVerified: true,
        doctor: {
          create: {
            mdcnNumber: doc.mdcnNumber,
            licenseNumber: doc.licenseNumber,
            verificationStatus: 'VERIFIED',
            bio: doc.bio,
            experienceYears: doc.experienceYears,
            consultationFee: doc.consultationFee,
            specialties: doc.specialties,
            languages: doc.languages,
            rating: doc.rating,
            totalConsultations: doc.totalConsultations,
            isAvailable: doc.isAvailable,
          },
        },
      },
    });
    console.log(`✅ Created Doctor: Dr. ${userDoc.firstName} ${userDoc.lastName} (${doc.specialties.join(', ')})`);
  }

  // 5. Seed Top Nigerian Healthcare Facilities
  const facilitiesData = [
    {
      name: 'Lagos University Teaching Hospital (LUTH)',
      description: 'Premier tertiary healthcare, research, and multi-specialty training hospital in Nigeria.',
      type: 'HOSPITAL',
      address: 'Ishaga Road, Idi-Araba, Surulere',
      state: 'Lagos',
      city: 'Surulere',
      phone: '+234 1 894 3000',
      email: 'info@luth.gov.ng',
      website: 'https://luth.gov.ng',
      verificationStatus: 'VERIFIED',
      services: ['24/7 Emergency Care', 'Cardiology Unit', 'Paediatrics & Neonatal ICU', 'Dialysis Centre', 'Oncology', 'Radiology & MRI'],
    },
    {
      name: 'Reddington Multi-Specialist Hospital',
      description: 'Internationally accredited tertiary medical center with world-class facilities and specialized surgical theatres.',
      type: 'HOSPITAL',
      address: '12 Idowu Martins Street, Victoria Island',
      state: 'Lagos',
      city: 'Victoria Island',
      phone: '+234 1 271 5340',
      email: 'enquiry@reddingtonhospital.com',
      website: 'https://reddingtonhospital.com',
      verificationStatus: 'VERIFIED',
      services: ['24/7 Emergency', 'Advanced Cardiac Catheterization', 'Laparoscopic Surgery', 'Obstetrics & Gynaecology', 'In-House Pharmacy', 'HMO Accredited'],
    },
    {
      name: 'National Hospital Abuja',
      description: 'Apex healthcare and specialist referral center serving the Federal Capital Territory and nationwide.',
      type: 'HOSPITAL',
      address: 'Plot 132 Central Business District',
      state: 'FCT',
      city: 'Abuja',
      phone: '+234 9 291 5820',
      email: 'info@nationalhospital.gov.ng',
      website: 'https://nationalhospital.gov.ng',
      verificationStatus: 'VERIFIED',
      services: ['24/7 Trauma & Emergency', 'Cancer Treatment & Radiotherapy', 'Neuro-Surgery', 'Paediatric Surgery', 'Clinical Laboratory'],
    },
    {
      name: 'University College Hospital (UCH)',
      description: 'Nigeria’s flagship teaching hospital renowned for medical excellence and specialized clinical diagnostics.',
      type: 'HOSPITAL',
      address: 'Queen Elizabeth Road, Oritamefa',
      state: 'Oyo',
      city: 'Ibadan',
      phone: '+234 2 241 0088',
      email: 'contact@uch-ibadan.org.ng',
      website: 'https://uch-ibadan.org.ng',
      verificationStatus: 'VERIFIED',
      services: ['24/7 Emergency', 'Nuclear Medicine', 'Renal Transplant Unit', 'Ophthalmology', 'Comprehensive Blood Bank'],
    },
    {
      name: 'Lagoon Hospital Ikoyi',
      description: 'JCI-accredited leading private healthcare provider offering specialized secondary and tertiary clinical services.',
      type: 'HOSPITAL',
      address: '17B Bourdillon Road, Ikoyi',
      state: 'Lagos',
      city: 'Ikoyi',
      phone: '+234 1 897 4000',
      email: 'info@lagoonhospitals.com',
      website: 'https://lagoonhospitals.com',
      verificationStatus: 'VERIFIED',
      services: ['Critical Care Unit', 'Joint Replacement', 'Gastroenterology & Endoscopy', 'Emergency Ambulance', 'Well-Woman Clinic'],
    },
    {
      name: 'Medbury Medical Services',
      description: 'High-standard diagnostic lab, occupational health, and wellness screening center in Lagos and Port Harcourt.',
      type: 'LAB',
      address: '32 Admiralty Way, Lekki Phase 1',
      state: 'Lagos',
      city: 'Lekki',
      phone: '+234 810 000 1234',
      email: 'care@medburymedical.com',
      website: 'https://medburymedical.com',
      verificationStatus: 'VERIFIED',
      services: ['Automated Blood Chemistry', 'DNA & Genetic Testing', 'Executive Health Screenings', 'Digital X-Ray & Ultrasound', 'Pre-Employment Medicals'],
    },
  ];

  for (const facility of facilitiesData) {
    const fac = await prisma.facility.create({
      data: facility,
    });
    console.log(`✅ Created Facility: ${fac.name} (${fac.state})`);
  }

  console.log('\n🎉 Production Database Seeding Successfully Completed!');
  console.log('----------------------------------------------------');
  console.log('🔑 Demo Patient Login:  patient@ilertihealth.site  |  Password123!');
  console.log('🔑 Demo Doctor Login:   dr.funmilayo@ilertihealth.site  |  Password123!');
  console.log('🔑 Admin Portal Login:  admin@ilertihealth.site    |  Password123!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
