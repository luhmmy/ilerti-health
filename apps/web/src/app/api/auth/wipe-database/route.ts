import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function GET() {
  try {
    await serverDb.wipeAll();
    return NextResponse.json({
      success: true,
      message: 'All accounts, OTPs, and consultations wiped successfully from PostgreSQL and memory. Clean state active.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to wipe database' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await serverDb.wipeAll();
    return NextResponse.json({
      success: true,
      message: 'All accounts, OTPs, and consultations wiped successfully from PostgreSQL and memory. Clean state active.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to wipe database' },
      { status: 500 }
    );
  }
}
