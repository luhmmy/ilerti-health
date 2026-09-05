import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty');
    const state = searchParams.get('state');

    let list = Array.from(serverDb.doctors.values());

    if (specialty && specialty !== 'ALL') {
      list = list.filter(
        (d) =>
          d.primarySpecialty.toLowerCase().includes(specialty.toLowerCase()) ||
          (d.secondarySpecialty && d.secondarySpecialty.toLowerCase().includes(specialty.toLowerCase()))
      );
    }

    if (state && state !== 'ALL') {
      list = list.filter((d) => d.stateOfPractice.toLowerCase() === state.toLowerCase());
    }

    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
