import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';
import { dispatchOtp } from '@/lib/dispatchOtp';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const data = await req.json();
    const key = (data.emailOrPhone || data.email || '').toLowerCase().trim();

    if (!key) {
      return NextResponse.json(
        { message: 'Email or phone number is required' },
        { status: 400 }
      );
    }

    // Rate limit: max 4 resends per 2 minutes per IP / key
    const rl = checkRateLimit(`resend_${clientIp}_${key}`, { limit: 4, windowSeconds: 120 });
    if (!rl.success) {
      return NextResponse.json(
        { message: `Too many OTP resend attempts. Please wait ${rl.resetSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rl.resetSeconds) } }
      );
    }

    const user = await serverDb.getUser(key);
    const email = user?.email || (key.includes('@') ? key : '');
    const phone = user?.phone || (!key.includes('@') ? key : undefined);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpPayload = {
      code: otp,
      email: email || key,
      phone,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    await serverDb.saveOtp(key, otpPayload);
    if (email) {
      await serverDb.saveOtp(email, otpPayload);
    }

    // Dispatch real SMS & Email
    const dispatchResult = await dispatchOtp(email, phone, otp);

    return NextResponse.json({
      success: true,
      message: dispatchResult.isSimulated 
        ? `Verification code generated: ${otp}` 
        : 'New verification code sent via SMS and Email',
      devOtp: dispatchResult.isSimulated ? otp : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to resend code' },
      { status: 500 }
    );
  }
}
