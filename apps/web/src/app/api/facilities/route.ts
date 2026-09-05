import { NextResponse } from 'next/server';

const FACILITIES = [
  {
    id: 'fac-1',
    name: 'Lagos University Teaching Hospital (LUTH)',
    type: 'Teaching & Specialist Hospital',
    address: 'Ishaga Road, Idi-Araba',
    city: 'Surulere',
    state: 'Lagos',
    phone: '+234 1 897 0000',
    emergency24_7: true,
    hmoAccredited: true,
    services: ['Emergency Trauma Center', 'Cardiology & ICU', 'Paediatrics', 'Radiology/CT/MRI', 'Oncology'],
  },
  {
    id: 'fac-2',
    name: 'National Hospital Abuja',
    type: 'Federal Medical Center',
    address: 'Plot 132 Central Business District',
    city: 'Abuja (FCT)',
    state: 'FCT',
    phone: '+234 9 234 0000',
    emergency24_7: true,
    hmoAccredited: true,
    services: ['24/7 Emergency', 'Neurosurgery', 'Dialysis Unit', 'Maternal Health', 'Neonatal ICU'],
  },
  {
    id: 'fac-3',
    name: 'University College Hospital (UCH) Ibadan',
    type: 'Teaching Hospital',
    address: 'Queen Elizabeth Road',
    city: 'Ibadan',
    state: 'Oyo',
    phone: '+234 2 241 0088',
    emergency24_7: true,
    hmoAccredited: true,
    services: ['Tertiary Clinical Care', 'Cardiothoracic Surgery', 'Nuclear Medicine', 'Blood Bank'],
  },
];

export async function GET(req: Request) {
  return NextResponse.json(FACILITIES);
}
