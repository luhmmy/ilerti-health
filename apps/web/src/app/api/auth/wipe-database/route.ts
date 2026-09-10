import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const adminKey = req.headers.get('x-admin-key');
    const expectedKey = process.env.ADMIN_SECRET_KEY;

    let isAuthorized = false;

    if (expectedKey && adminKey && adminKey === expectedKey) {
      isAuthorized = true;
    } else if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = serverDb.verifyToken(token);
      if (decoded && (decoded.role === 'admin' || decoded.role === 'ADMIN')) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { message: 'Unauthorized. Admin credentials required to perform this action.' },
        { status: 403 }
      );
    }

    await serverDb.wipeAll();
    return NextResponse.json({
      success: true,
      message: 'All accounts, OTPs, and consultations wiped successfully. Clean state active.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to wipe database' },
      { status: 500 }
    );
  }
}

