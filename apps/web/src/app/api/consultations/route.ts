import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function GET(req: Request) {
  return NextResponse.json(serverDb.consultations || []);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newConsultation = {
      id: `c-${Date.now()}`,
      ...data,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };

    serverDb.consultations.push(newConsultation);

    return NextResponse.json(newConsultation);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to book consultation' },
      { status: 500 }
    );
  }
}
