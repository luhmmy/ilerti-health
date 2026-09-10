import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rl = checkRateLimit(`doctors_${clientIp}`, { limit: 20, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { message: `Too many requests. Please wait ${rl.resetSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rl.resetSeconds) } }
      );
    }
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty');
    const state = searchParams.get('state');

    const doctors = await serverDb.getAllDoctors();

    let list = doctors.map((d) => {
      const parts = d.fullName.replace(/^Dr\.\s*/i, '').trim().split(' ');
      const firstName = parts[0] || 'Doctor';
      const lastName = parts.slice(1).join(' ') || '';

      return {
        id: d.id,
        user: {
          firstName,
          lastName,
          city: d.cityOfPractice || 'Lagos',
          state: d.stateOfPractice || 'Nigeria',
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.fullName)}&background=0D9488&color=fff`,
        },
        specialties: [d.primarySpecialty, d.secondarySpecialty].filter(Boolean) as string[],
        primarySpecialty: d.primarySpecialty,
        secondarySpecialty: d.secondarySpecialty,
        mdcnNumber: d.mdcnFolio,
        hospitalAffiliation: d.hospitalAffiliation,
        consultationFee: d.consultationFee || 10000,
        languages: d.languages || ['English'],
        bio: d.bio || 'Registered MDCN medical practitioner on ILERTI Health.',
        rating: 4.9,
        totalConsultations: 18,
        status: d.status,
        isAvailable: d.isAvailable !== false,
      };
    });

    if (specialty && specialty !== 'ALL') {
      list = list.filter(
        (d) =>
          d.primarySpecialty.toLowerCase().includes(specialty.toLowerCase()) ||
          (d.secondarySpecialty && d.secondarySpecialty.toLowerCase().includes(specialty.toLowerCase()))
      );
    }

    if (state && state !== 'ALL') {
      list = list.filter((d) => d.user.state.toLowerCase() === state.toLowerCase());
    }

    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
