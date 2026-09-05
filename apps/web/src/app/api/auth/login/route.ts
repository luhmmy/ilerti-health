import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const inputKey = (data.email || data.emailOrPhone || '').toLowerCase().trim();
    const inputPass = data.password || '';

    if (!inputKey || !inputPass) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 1. Check Super Admin login
    const isAdmin = (inputKey === 'admin@ilertihealth.site' || inputKey === 'admin') && (inputPass === 'ILERTI-ADMIN-2025' || inputPass === 'admin');
    if (isAdmin) {
      const token = serverDb.signToken({
        userId: 'admin-master',
        email: 'admin@ilertihealth.site',
        role: 'admin',
      });
      return NextResponse.json({
        access_token: token,
        user: {
          id: 'admin-master',
          email: 'admin@ilertihealth.site',
          name: 'System Administrator',
          role: 'admin',
        },
      });
    }

    // 2. Lookup user in persistent database
    const user = await serverDb.getUser(inputKey);

    if (!user) {
      return NextResponse.json(
        { message: 'This account does not exist in the database. Please create an account to sign in.' },
        { status: 401 }
      );
    }

    // Verify password hash
    const isPasswordValid = await serverDb.comparePassword(inputPass, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = serverDb.signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        specialty: user.specialty,
        mdcnFolio: user.mdcnFolio,
        hospitalAffiliation: user.hospitalAffiliation,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Login failed' },
      { status: 500 }
    );
  }
}
