import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function POST(req: Request) {
  try {
    await serverDb.wipeAll();
    return NextResponse.json({
      success: true,
      message: 'Serverless database wiped successfully. Clean production state restored.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to wipe database' },
      { status: 500 }
    );
  }
}
