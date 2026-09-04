export const APP_NAME = 'ILERTI Health';
export const APP_TAGLINE = 'Know. Connect. Care. Prevent. Thrive.';
export const APP_DESCRIPTION = 'A digital health ecosystem for lifelong, accessible and preventive healthcare.';

export const CONSULTATION_FEE_MIN = 3000; // ₦3,000
export const CONSULTATION_FEE_MAX = 50000; // ₦50,000

// Health journey options shown on landing page
export const HEALTH_JOURNEY_OPTIONS = [
  {
    id: 'health-concern',
    icon: '🩺',
    title: 'I have a health concern',
    description: 'Get AI-guided health navigation for your symptoms',
    color: 'teal',
    href: '/ai',
  },
  {
    id: 'speak-doctor',
    icon: '👨🏽‍⚕️',
    title: 'I want to speak to a doctor',
    description: 'Connect with a verified healthcare professional',
    color: 'navy',
    href: '/doctors',
  },
  {
    id: 'find-facility',
    icon: '🏥',
    title: 'I need a healthcare facility',
    description: 'Find hospitals, clinics and diagnostic centres near you',
    color: 'green',
    href: '/facilities',
  },
  {
    id: 'eat-healthier',
    icon: '🥗',
    title: 'I want to eat healthier',
    description: 'Get personalized meal plans with local Nigerian foods',
    color: 'amber',
    href: '/wellness/nutrition',
  },
  {
    id: 'improve-lifestyle',
    icon: '💧',
    title: 'I want to improve my lifestyle',
    description: 'Build healthy daily habits and routines',
    color: 'blue',
    href: '/wellness',
  },
  {
    id: 'manage-health',
    icon: '📋',
    title: 'I want to manage my health',
    description: 'Track your health records, medications and appointments',
    color: 'purple',
    href: '/health',
  },
  {
    id: 'health-reminder',
    icon: '🔔',
    title: 'I have a health reminder',
    description: 'Set up medication, appointment and screening reminders',
    color: 'orange',
    href: '/health/reminders',
  },
  {
    id: 'prevent-problems',
    icon: '❤️',
    title: 'I want to prevent health problems',
    description: 'Preventive screening, immunization and health checks',
    color: 'red',
    href: '/prevention',
  },
] as const;
