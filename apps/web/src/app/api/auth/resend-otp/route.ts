import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const key = (data.emailOrPhone || data.email || '').toLowerCase().trim();

    if (!key) {
      return NextResponse.json(
        { message: 'Email or phone number is required' },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    serverDb.otps.set(key, {
      code: otp,
      email: key,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    return NextResponse.json({
      success: true,
      message: 'New verification code sent',
      verificationCode: otp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to resend code' },
      { status: 500 }
    );
  }
}
